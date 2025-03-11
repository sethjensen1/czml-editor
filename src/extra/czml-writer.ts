import { ArcType, BillboardGraphics, BoundingRectangle, Cartesian2, Cartesian3, Cesium3DTilesetGraphics, ClassificationType, Color, ColorBlendMode, ColorMaterialProperty, ConstantProperty, 
    DistanceDisplayCondition, Ellipsoid, Entity, HeightReference, HorizontalOrigin, ImageMaterialProperty, 
    LabelGraphics, 
    LabelStyle, 
    MaterialProperty, 
    ModelGraphics, 
    NearFarScalar, PolygonGraphics, PolygonHierarchy, PolylineGraphics, Property, Quaternion, Rectangle, RectangleGraphics, ReferenceProperty, Resource, ShadowMode, VerticalOrigin } from "cesium";
import { Math as CesiumMath } from "cesium";


type ResourceCache = {
    [key: string]: any
};

type CzmlPacket = {
    id: string;
    parent?: string;
    position?: null | {
        cartographicDegrees: number[]
    };
    orientation?: null | {
        unitQuaternion: number[]
    };

    label?: LabelCzmlDef;
    billboard?: BillboardCzmlDef;
    polygon?: PolygonCzmlDef;
    polyline?: PolylineCzmlDef; 
    rectangle?: RectangleCzmlDef;
    model?: ModelCzmlDef;
    tileset?: TilesetCzmlDef;
};


function encodeEntitySimpleProperty(entity: Entity, packet: CzmlPacket, field: 'name' | 'description') {
    const property = entity[field];

    if (property !== undefined) {
        if (property instanceof Property && property.isConstant) {
            return {
                ...packet,
                [field]: (property as ConstantProperty).valueOf()
            }
        }
    }

    return packet;
}

function cartesianAsCartographicDegrees(cartesian3: Cartesian3) {
    const cartographic  = Ellipsoid.WGS84.cartesianToCartographic(cartesian3);
    const lon = CesiumMath.toDegrees(cartographic.longitude);
    const lat = CesiumMath.toDegrees(cartographic.latitude);

    return [lon, lat, cartographic.height];
}

function encodePosition (pos: any) {
    if (pos && pos instanceof Cartesian3) {
        return {
            cartographicDegrees: cartesianAsCartographicDegrees(pos)
        }
    }
    return null;
}

function encodeOrientation (orientation: any) {
    if (orientation && orientation instanceof Quaternion) {
        return {
            unitQuaternion: Quaternion.pack(orientation, [], 0)
        }
    }
    return null;
}

type MaterialImageCzmlDef = {
    image?: any;
    color?: any;
    repeat?: any;
    transparent?: any;
}

type EntytiGraphicsCzmlDef = LabelCzmlDef
    | BillboardCzmlDef
    | PolygonCzmlDef
    | PolylineCzmlDef
    | RectangleCzmlDef
    | ModelCzmlDef
    | TilesetCzmlDef;

type WriteDestPacketType = CzmlPacket | EntytiGraphicsCzmlDef | MaterialImageCzmlDef;

function writeConstantProperty<T extends WriteDestPacketType>(srcProperty: Property | undefined, packet: T, property: keyof T, adapter?: (val: any) => any) {
    if (srcProperty !== undefined && srcProperty.isConstant) {
        const v = srcProperty.valueOf();
        if (adapter) {
            const adapted = adapter(v);
            if (adapted !== undefined) {
                packet[property] = adapted;
            }
        }
        else {
            packet[property] = v as any;
        }
    }
}

function writeMaterialProperty(srcProperty: MaterialProperty | ColorMaterialProperty | ImageMaterialProperty, packet: any, property: string, ref: string) {
    if (srcProperty) {
        if (srcProperty instanceof ColorMaterialProperty) {
            const color = srcProperty.color?.valueOf();
            if (color && color instanceof Color) {
                packet[property] = {
                    solidColor: {
                        color: encodeColor(color)
                    }
                };
            }
        }
        else if (srcProperty instanceof ImageMaterialProperty) {
            const imageDef: MaterialImageCzmlDef = {};

            writeConstantProperty(srcProperty.image, imageDef, 'image', resourceEncoder(ref));
            writeConstantProperty(srcProperty.color, imageDef, 'color', encodeColor);
            writeConstantProperty(srcProperty.repeat, imageDef, 'repeat', encodeCartesian2);
            writeConstantProperty(srcProperty.transparent, imageDef, 'transparent', encodeColor);

            packet[property] = {
                image: imageDef
            };
        }
        else {
            console.log('Unsupported material property', property, srcProperty);
        }
    }
}

function stringHash(str: string) {
    var hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function throughCache(url: string, resourceCache: ResourceCache, ref: string) {
    const hash = stringHash(url);

    const existingRef = resourceCache[hash];
    if (existingRef) {
        return {
            reference: existingRef
        };
    }

    resourceCache[hash] = ref;
    return url;
}

type ResourceEncoderContext = {
    id: string;
    resourceCache: ResourceCache;
    separateResources: boolean;
}
function _resourceEncoder(ref: string, context?: ResourceEncoderContext) {
    const resourceCache = context && context.resourceCache;
    const id = context && context.id;
    const separateResources = context && context.separateResources;

    return (resource: ReferenceProperty | Resource) => {
        if (resource instanceof ReferenceProperty) {
            return `${resource.targetId}#${resource.targetPropertyNames.join('.')}`;
        }

        if (resource instanceof Resource) {
            let url = resource.url;
            let isDataURL = resource.isDataUri || /^data:/.test(url);
            if (isDataURL && resourceCache && ref) {
                if (separateResources) {
                    resourceCache[ref] = url;
                    return ref;
                }
                else {
                    return throughCache(url, resourceCache, `${id}#${ref}`);
                }
            }
            return url;
        }
    }
}

var resourceEncoder = (ref: string) => _resourceEncoder(ref, undefined);

function enumEncoder(enm: any) {
    return (v: any) => {
        return Object.keys(enm).find(k => enm[k] === v);
    }
}

function encodeNearFarScalar(v: NearFarScalar) {
    return {
        nearFarScalar: [v.near, v.nearValue, v.far, v.farValue]
    };
}

function encodeColor(v: Color) {
    return {
        rgbaf: [v.red, v.green, v.blue, v.alpha]
    };
}

function encodeBoundingRectangle(v: BoundingRectangle) {
    return {
        boundingRectangle: [v.x, v.y, v.width, v.height]
    };
}

function encodeDistanceDisplayCondition(v: DistanceDisplayCondition) {
    return {
        distanceDisplayCondition: [v.near, v.far]
    };
}

function encodePolygonPositions (hierarchy: PolygonHierarchy) {
    return encodePositions(hierarchy.positions);
}

function encodeHoles(hierarchy: PolygonHierarchy) {
    if (hierarchy.holes) {
        return hierarchy.holes.map(encodePolygonPositions);
    }

    return undefined;
}

function encodeCartesian2(v: Cartesian2) {
    return {
        "cartesian2": [v.x, v.y]
    };
}

function encodeCartesian3(v: Cartesian3) {
    return {
        "cartesian": [v.x, v.y, v.z]
    };
}

function encodePositions(v: Property | Cartesian3[]) {
    const positions: Cartesian3[] = (v instanceof Property) ? v.getValue() : v;

    const positionArray = positions.map(p => cartesianAsCartographicDegrees(p)).flat(1);
    return {
        "cartographicDegrees": positionArray
    };
}

function encodeRectanglePositions(v: Rectangle) {
    return {
        wsen: [v.west, v.south, v.east, v.north]
    };
}

function encodeNodeTransformations(v: any) {
    console.warn("Node transformations are not supported");
    return null;
}

function encodeArticulations(v: any) {
    console.warn("Articulations are not supported");
    return null;
}

type BillboardCzmlDef = {
    image?: any;
    scale?: any;
    pixelOffset?: any;
    eyeOffset?: number[];

    horizontalOrigin?: any;
    verticalOrigin?: any;
    heightReference?: any;
    
    color?: any;
    rotation?: any;
    alignedAxis?: any;
    sizeInMeters?: any;

    width?: any;
    height?: any;
    
    scaleByDistance?: any;
    translucencyByDistance?: any;
    pixelOffsetScaleByDistance?: any;
    imageSubRegion?: any;
    distanceDisplayCondition?: any;
    disableDepthTestDistance?: any;
}
function writeBillboard(billboard: BillboardGraphics) {
    const result: BillboardCzmlDef = {};

    var imageProp = billboard.image;
    if (imageProp instanceof ReferenceProperty) {
        imageProp = (imageProp as ReferenceProperty).resolvedProperty;
    }

    writeConstantProperty(imageProp, result, 'image', resourceEncoder('billboard.image'));
    writeConstantProperty(billboard.scale, result, 'scale');
    writeConstantProperty(billboard.pixelOffset, result, 'pixelOffset', encodeCartesian2);
    writeConstantProperty(billboard.eyeOffset, result, 'eyeOffset', encodeCartesian3);
    writeConstantProperty(billboard.horizontalOrigin, result, 'horizontalOrigin', enumEncoder(HorizontalOrigin));
    writeConstantProperty(billboard.verticalOrigin, result, 'verticalOrigin', enumEncoder(VerticalOrigin));
    writeConstantProperty(billboard.heightReference, result, 'heightReference', enumEncoder(HeightReference));
    writeConstantProperty(billboard.color, result, 'color', encodeColor);
    writeConstantProperty(billboard.rotation, result, 'rotation');
    writeConstantProperty(billboard.alignedAxis, result, 'alignedAxis', encodeCartesian3);
    writeConstantProperty(billboard.sizeInMeters, result, 'sizeInMeters');
    writeConstantProperty(billboard.width, result, 'width');
    writeConstantProperty(billboard.height, result, 'height');
    writeConstantProperty(billboard.scaleByDistance, result, 'scaleByDistance', encodeNearFarScalar);
    writeConstantProperty(billboard.translucencyByDistance, result, 'translucencyByDistance', encodeNearFarScalar);
    writeConstantProperty(billboard.pixelOffsetScaleByDistance, result, 'pixelOffsetScaleByDistance', encodeNearFarScalar);
    writeConstantProperty(billboard.imageSubRegion, result, 'imageSubRegion', encodeBoundingRectangle);
    writeConstantProperty(billboard.distanceDisplayCondition, result, 'distanceDisplayCondition', encodeDistanceDisplayCondition);
    writeConstantProperty(billboard.disableDepthTestDistance, result, 'disableDepthTestDistance');

    return result;
}

type PolygonCzmlDef = {
    positions?: any;
    holes?: any;
    
    arcType?: any;

    height?: any;
    heightReference?: any;
    
    extrudedHeight?: any;
    extrudedHeightReference?: any;

    stRotation?: any;
    granularity?: any;
    fill?: any;

    material?: any;

    outline?: any;
    outlineColor?: any;
    outlineWidth?: any;

    perPositionHeight?: any;

    closeTop?: any;
    closeBottom?: any;

    shadows?: any;
    distanceDisplayCondition?: any;
    classificationType?: any;

    zIndex?: any;
}
function writePolygon(polygon: PolygonGraphics) {

    const result: PolygonCzmlDef = {};

    if (polygon.hierarchy instanceof ConstantProperty) {
        writeConstantProperty(polygon.hierarchy, result, 'positions', encodePolygonPositions);
        writeConstantProperty(polygon.hierarchy, result, 'holes', encodeHoles);
    }
    else {
        console.warn('polygon.hierarchy is not ConstantProperty');
    }


    writeConstantProperty(polygon.arcType, result, 'arcType', enumEncoder(ArcType));

    writeConstantProperty(polygon.height, result, 'height');
    writeConstantProperty(polygon.heightReference, result, 'heightReference', enumEncoder(HeightReference));

    writeConstantProperty(polygon.extrudedHeight, result, 'extrudedHeight');
    writeConstantProperty(polygon.extrudedHeightReference, result, 'extrudedHeightReference', enumEncoder(HeightReference));

    writeConstantProperty(polygon.stRotation, result, 'stRotation');
    writeConstantProperty(polygon.granularity, result, 'granularity');
    writeConstantProperty(polygon.fill, result, 'fill');

    writeMaterialProperty(polygon.material, result, 'material', 'polygon');

    writeConstantProperty(polygon.outline, result, 'outline');
    writeConstantProperty(polygon.outlineColor, result, 'outlineColor', encodeColor);
    writeConstantProperty(polygon.outlineWidth, result, 'outlineWidth');

    writeConstantProperty(polygon.perPositionHeight, result, 'perPositionHeight');

    writeConstantProperty(polygon.closeTop, result, 'closeTop');
    writeConstantProperty(polygon.closeBottom, result, 'closeBottom');

    writeConstantProperty(polygon.shadows, result, 'shadows', enumEncoder(ShadowMode));
    writeConstantProperty(polygon.distanceDisplayCondition, result, 'distanceDisplayCondition', encodeDistanceDisplayCondition);
    writeConstantProperty(polygon.classificationType, result, 'classificationType', enumEncoder(ClassificationType));

    writeConstantProperty(polygon.zIndex, result, 'zIndex');

    return result;
}


type RectangleCzmlDef = {
    coordinates?: any;
    height?: any;
    heightReference?: any;

    extrudedHeight?: any;
    extrudedHeightReference?: any;

    rotation?: any;
    stRotation?: any;
    granularity?: any;
    fill?: any;

    material?: any;

    outline?: any;
    outlineColor?: any;
    outlineWidth?: any;

    shadows?: any;

    distanceDisplayCondition?: any;
    classificationType?: any;

    zIndex?: any;
}
function writeRectangle(rectangle: RectangleGraphics) {

    const result: RectangleCzmlDef = {};

    writeConstantProperty(rectangle.coordinates, result, 'coordinates', encodeRectanglePositions);

    writeConstantProperty(rectangle.height, result, 'height');
    writeConstantProperty(rectangle.heightReference, result, 'heightReference', enumEncoder(HeightReference));

    writeConstantProperty(rectangle.extrudedHeight, result, 'extrudedHeight');
    writeConstantProperty(rectangle.extrudedHeightReference, result, 'extrudedHeightReference', enumEncoder(HeightReference));

    writeConstantProperty(rectangle.rotation, result, 'rotation');
    writeConstantProperty(rectangle.stRotation, result, 'stRotation');
    writeConstantProperty(rectangle.granularity, result, 'granularity');
    writeConstantProperty(rectangle.fill, result, 'fill');

    writeMaterialProperty(rectangle.material, result, 'material', 'rectangle');

    writeConstantProperty(rectangle.outline, result, 'outline');
    writeConstantProperty(rectangle.outlineColor, result, 'outlineColor', encodeColor);
    writeConstantProperty(rectangle.outlineWidth, result, 'outlineWidth');

    writeConstantProperty(rectangle.shadows, result, 'shadows', enumEncoder(ShadowMode));

    writeConstantProperty(rectangle.distanceDisplayCondition, result, 'distanceDisplayCondition', encodeDistanceDisplayCondition);
    writeConstantProperty(rectangle.classificationType, result, 'classificationType', enumEncoder(ClassificationType));

    writeConstantProperty(rectangle.zIndex, result, 'zIndex');

    return result;
}

type PolylineCzmlDef = {
    positions?: any;
    arcType?: any;
    width?: any;
    granularity?: any;
    material?: any;
    followSurface?: any;
    shadows?: any;
    depthFailMaterial?: any;
    distanceDisplayCondition?: any;
    clampToGround?: any;
    classificationType?: any;
    zIndex?: any;
};
function writePolyline(polyline: PolylineGraphics) {
    const result: PolylineCzmlDef = {};

    writeConstantProperty(polyline.positions, result, 'positions', encodePositions);
    writeConstantProperty(polyline.arcType, result, 'arcType', enumEncoder(ArcType));
    writeConstantProperty(polyline.width, result, 'width');
    writeConstantProperty(polyline.granularity, result, 'granularity');
    writeMaterialProperty(polyline.material, result, 'material', 'polyline');
    writeConstantProperty(polyline.followSurface, result, 'followSurface');
    writeConstantProperty(polyline.shadows, result, 'shadows', enumEncoder(ShadowMode));
    writeMaterialProperty(polyline.depthFailMaterial, result, 'depthFailMaterial', 'polyline');
    writeConstantProperty(polyline.distanceDisplayCondition, result, 'distanceDisplayCondition', encodeDistanceDisplayCondition);
    writeConstantProperty(polyline.clampToGround, result, 'clampToGround');
    writeConstantProperty(polyline.classificationType, result, 'classificationType', enumEncoder(ClassificationType));
    writeConstantProperty(polyline.zIndex, result, 'zIndex');

    return result;
}

type ModelCzmlDef = {
    gltf?: any;
    scale?: any;

    minimumPixelSize?: any;
    maximumScale?: any;

    incrementallyLoadTextures?: any;
    runAnimations?: any;
    shadows?: any;
    heightReference?: any;
    silhouetteColor?: any;
    silhouetteSize?: any;

    color?: any;
    colorBlendMode?: any;
    colorBlendAmount?: any;

    distanceDisplayCondition?: any;

    nodeTransformations?: any;
    articulations?: any;
}
function writeModel(model: ModelGraphics) {
    const result: ModelCzmlDef = {};

    writeConstantProperty(model.uri, result, 'gltf', resourceEncoder('model.gltf'));
    writeConstantProperty(model.scale, result, 'scale');
    writeConstantProperty(model.minimumPixelSize, result, 'minimumPixelSize');
    writeConstantProperty(model.maximumScale, result, 'maximumScale');
    writeConstantProperty(model.incrementallyLoadTextures, result, 'incrementallyLoadTextures');
    writeConstantProperty(model.runAnimations, result, 'runAnimations');
    writeConstantProperty(model.shadows, result, 'shadows', enumEncoder(ShadowMode));
    writeConstantProperty(model.heightReference, result, 'heightReference', enumEncoder(HeightReference));
    writeConstantProperty(model.silhouetteColor, result, 'silhouetteColor', encodeColor);
    writeConstantProperty(model.silhouetteSize, result, 'silhouetteSize');
    writeConstantProperty(model.color, result, 'color', encodeColor);
    writeConstantProperty(model.colorBlendMode, result, 'colorBlendMode', enumEncoder(ColorBlendMode));
    writeConstantProperty(model.colorBlendAmount, result, 'colorBlendAmount');
    writeConstantProperty(model.distanceDisplayCondition, result, 'distanceDisplayCondition', encodeDistanceDisplayCondition);

    writeConstantProperty(model.nodeTransformations, result, 'nodeTransformations', encodeNodeTransformations);
    writeConstantProperty(model.articulations, result, 'articulations', encodeArticulations);

    return result;
}

type TilesetCzmlDef = {
    uri?: any;
    maximumScreenSpaceError?: any;
}
function writeTileset(tileset: Cesium3DTilesetGraphics) {
    const result: TilesetCzmlDef = {};

    writeConstantProperty(tileset.uri, result, 'uri');
    writeConstantProperty(tileset.maximumScreenSpaceError, result, 'maximumScreenSpaceError');

    return result;
}

type LabelCzmlDef = {
    text?: any;
    font?: any;
    style?: any;
    scale?: any;

    showBackground?: any;
    backgroundColor?: any;
    backgroundPadding?: any;

    pixelOffset?: any;
    eyeOffset?: any;

    horizontalOrigin?: any;
    verticalOrigin?: any;

    heightReference?: any;
    fillColor?: any;
    outlineColor?: any;
    outlineWidth?: any;
    translucencyByDistance?: any;
    pixelOffsetScaleByDistance?: any;
    scaleByDistance?: any;
    distanceDisplayCondition?: any;
    disableDepthTestDistance?: any;
};
function writeLabel(label: LabelGraphics) {
    const result: LabelCzmlDef = {};

    writeConstantProperty(label.text, result, 'text');
    writeConstantProperty(label.font, result, 'font');
    writeConstantProperty(label.style, result, 'style', enumEncoder(LabelStyle));
    writeConstantProperty(label.scale, result, 'scale');
    writeConstantProperty(label.showBackground, result, 'showBackground');
    writeConstantProperty(label.backgroundColor, result, 'backgroundColor', encodeColor);
    writeConstantProperty(label.backgroundPadding, result, 'backgroundPadding', encodeCartesian2);
    writeConstantProperty(label.pixelOffset, result, 'pixelOffset', encodeCartesian2);
    writeConstantProperty(label.eyeOffset, result, 'eyeOffset', encodeCartesian3);
    writeConstantProperty(label.horizontalOrigin, result, 'horizontalOrigin', enumEncoder(HorizontalOrigin));
    writeConstantProperty(label.verticalOrigin, result, 'verticalOrigin', enumEncoder(VerticalOrigin));
    writeConstantProperty(label.heightReference, result, 'heightReference', enumEncoder(HeightReference));
    writeConstantProperty(label.fillColor, result, 'fillColor', encodeColor);
    writeConstantProperty(label.outlineColor, result, 'outlineColor', encodeColor);
    writeConstantProperty(label.outlineWidth, result, 'outlineWidth');
    writeConstantProperty(label.translucencyByDistance, result, 'translucencyByDistance', encodeNearFarScalar);
    writeConstantProperty(label.pixelOffsetScaleByDistance, result, 'pixelOffsetScaleByDistance', encodeNearFarScalar);
    writeConstantProperty(label.scaleByDistance, result, 'scaleByDistance', encodeNearFarScalar);
    writeConstantProperty(label.distanceDisplayCondition, result, 'distanceDisplayCondition', encodeDistanceDisplayCondition);
    writeConstantProperty(label.disableDepthTestDistance, result, 'disableDepthTestDistance');

    return result;
}

type CzmlWriterConstructorOptions = {
    separateResources: boolean
};
export default class CzmlWriter {

    separateResources: boolean;
    resourceCache: ResourceCache = {};
    counter: number = 0;

    document = {
        "id": "document",
        "version": "1.0"
    };

    packets: CzmlPacket[] = [];

    constructor (options?: CzmlWriterConstructorOptions) {
        this.separateResources = options?.separateResources || true;
    }

    addEntity (entity: Entity) {
        const id = entity.id || `object${this.counter++}`
        var packet: CzmlPacket = {id};

        packet = encodeEntitySimpleProperty(entity, packet, 'name');
        packet = encodeEntitySimpleProperty(entity, packet, 'description');

        if (entity.parent) {
            packet = {
                ...packet,
                parent: entity.parent.id
            }
        }

        if (entity.position) {
            const position = entity.position;
            if (position.isConstant) {
                packet = {
                    ...packet,
                    position: encodePosition(position.getValue())
                }
            }
            else {
                console.warn('Not Supported');
            }
        }

        if (entity.orientation) {
            const orientation = entity.orientation;
            if (orientation.isConstant) {
                packet = {
                    ...packet,
                    orientation: encodeOrientation(orientation.getValue())
                }
            }
            else {
                console.warn('Not Supported');
            }
        }

        const encoderContext: ResourceEncoderContext = {
            id, 
            resourceCache: this.resourceCache, 
            separateResources: this.separateResources
        };
        
        resourceEncoder = (ref: string) => _resourceEncoder(ref, encoderContext);

        if (entity.billboard) {
            packet.billboard = writeBillboard(entity.billboard);
        }

        if (entity.polyline) {
            packet.polyline = writePolyline(entity.polyline);
        }

        if (entity.polygon) {
            packet.polygon = writePolygon(entity.polygon);
        }

        if (entity.rectangle) {
            packet.rectangle = writeRectangle(entity.rectangle);
        }

        if (entity.model) {
            packet.model = writeModel(entity.model);
        }

        if (entity.tileset) {
            packet.tileset = writeTileset(entity.tileset);
        }

        if (entity.label) {
            packet.label = writeLabel(entity.label);
        }

        if (entity.parent) {
            packet = {
                ...packet,
                parent: entity.parent.id
            }
        }

        this.packets.push(packet);
    }

    toJSON() {
        return [this.document, ...this.packets]
    }

    async listResources() {
        const resources = [];

        for (let key of Object.keys(this.resourceCache)) {
            const blob = await fetch(this.resourceCache[key])
                .then(resp => resp.blob());

            resources.push({
                name: key, 
                lastModified: new Date(), 
                input: blob
            });
        }

        return resources;
    }

}