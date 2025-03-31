import { ClassificationType, HeightReference, Property, Rectangle, RectangleGraphics, ShadowMode } from "cesium";
import { WriterContext } from "../../export-czml";
import { writeColor, writeDistanceDisplayCondition, writeEnum, writeScalar } from "../field-writers";
import { writeMaterial } from "../material-writer";

export async function writeRectangle(rectangle: RectangleGraphics, ctx: WriterContext) {
    const packet: any = {};

    /**
     * Initialization options for the RectangleGraphics constructor
     * @property [show = true] - A boolean Property specifying the visibility of the rectangle.
     * @property [coordinates] - The Property specifying the {@link Rectangle}.
     * @property [height = 0] - A numeric Property specifying the altitude of the rectangle relative to the ellipsoid surface.
     * @property [heightReference = HeightReference.NONE] - A Property specifying what the height is relative to.
     * @property [extrudedHeight] - A numeric Property specifying the altitude of the rectangle's extruded face relative to the ellipsoid surface.
     * @property [extrudedHeightReference = HeightReference.NONE] - A Property specifying what the extrudedHeight is relative to.
     * @property [rotation = 0.0] - A numeric property specifying the rotation of the rectangle clockwise from north.
     * @property [stRotation = 0.0] - A numeric property specifying the rotation of the rectangle texture counter-clockwise from north.
     * @property [granularity = Cesium.Math.RADIANS_PER_DEGREE] - A numeric Property specifying the angular distance between points on the rectangle.
     * @property [fill = true] - A boolean Property specifying whether the rectangle is filled with the provided material.
     * @property [material = Color.WHITE] - A Property specifying the material used to fill the rectangle.
     * @property [outline = false] - A boolean Property specifying whether the rectangle is outlined.
     * @property [outlineColor = Color.BLACK] - A Property specifying the {@link Color} of the outline.
     * @property [outlineWidth = 1.0] - A numeric Property specifying the width of the outline.
     * @property [shadows = ShadowMode.DISABLED] - An enum Property specifying whether the rectangle casts or receives shadows from light sources.
     * @property [distanceDisplayCondition] - A Property specifying at what distance from the camera that this rectangle will be displayed.
     * @property [classificationType = ClassificationType.BOTH] - An enum Property specifying whether this rectangle will classify terrain, 3D Tiles, or both when on the ground.
     * @property [zIndex = 0] - A Property specifying the zIndex used for ordering ground geometry.  Only has an effect if the rectangle is constant and neither height or extrudedHeight are specified.
     */

    if (rectangle.show !== undefined) {
        packet.show = writeScalar(rectangle.show, {...ctx, path: ['rectangle', 'show']});
    }

    if (rectangle.coordinates) {
        packet.coordinates = writeRectangleCoordinates(rectangle.coordinates, {...ctx, path: ['rectangle', 'coordinates']});
    }

    if (rectangle.height !== undefined) {
        packet.height = writeScalar(rectangle.height, {...ctx, path: ['rectangle', 'height']});
    }
    
    if (rectangle.heightReference !== undefined) {
        packet.heightReference = writeEnum(rectangle.heightReference, {...ctx, path: ['rectangle', 'heightReference']}, HeightReference);
    }

    if (rectangle.extrudedHeight !== undefined) {
        packet.extrudedHeight = writeScalar(rectangle.extrudedHeight, {...ctx, path: ['rectangle', 'extrudedHeight']});
    }
    
    if (rectangle.extrudedHeightReference !== undefined) {
        packet.extrudedHeightReference = writeEnum(rectangle.extrudedHeightReference, {...ctx, path: ['rectangle', 'extrudedHeightReference']}, HeightReference);
    }

    if (rectangle.rotation !== undefined) {
        packet.rotation = writeScalar(rectangle.rotation, {...ctx, path: ['rectangle', 'rotation']});
    }
    
    if (rectangle.stRotation !== undefined) {
        packet.stRotation = writeScalar(rectangle.stRotation, {...ctx, path: ['rectangle', 'stRotation']});
    }
    
    if (rectangle.granularity !== undefined) {
        packet.granularity = writeScalar(rectangle.granularity, {...ctx, path: ['rectangle', 'granularity']});
    }
    
    if (rectangle.fill !== undefined) {
        packet.fill = writeScalar(rectangle.fill, {...ctx, path: ['rectangle', 'fill']});
    }
    
    if (rectangle.material !== undefined) {
        packet.material = await writeMaterial(rectangle.material, {...ctx, path: ['rectangle', 'material']});
    }

    if (rectangle.outline !== undefined) {
        packet.outline = writeScalar(rectangle.outline, {...ctx, path: ['rectangle', 'outline']});
    }
    
    if (rectangle.outlineColor !== undefined) {
        packet.outlineColor = writeColor(rectangle.outlineColor, {...ctx, path: ['rectangle', 'outlineColor']});
    }
    
    if (rectangle.outlineWidth !== undefined) {
        packet.outlineWidth = writeScalar(rectangle.outlineWidth, {...ctx, path: ['rectangle', 'outlineWidth']});
    }

    if (rectangle.shadows !== undefined) {
        packet.shadows = writeEnum(rectangle.shadows, {...ctx, path: ['rectangle', 'shadows']}, ShadowMode);
    }

    if (rectangle.distanceDisplayCondition !== undefined) {
        packet.distanceDisplayCondition = writeDistanceDisplayCondition(rectangle.distanceDisplayCondition, {...ctx, path: ['rectangle', 'distanceDisplayCondition']});
    }

    if (rectangle.classificationType !== undefined) {
        packet.classificationType = writeEnum(rectangle.classificationType, {...ctx, path: ['rectangle', 'classificationType']}, ClassificationType);
    }

    if (rectangle.zIndex !== undefined) {
        packet.zIndex = writeScalar(rectangle.zIndex, {...ctx, path: ['rectangle', 'zIndex']});
    }

    return packet;
}

function writeRectangleCoordinates(prop: Property, ctx: WriterContext) {

    const val = writeScalar(prop, ctx);
    if (val === undefined || val === null || val.reference) return val;

    if (val instanceof Rectangle) {
        const wsenRad = [val.west, val.south, val.east, val.north];
        return {
            wsenDegrees: wsenRad.map(a => a * (180 / Math.PI))
        }
    }
}
