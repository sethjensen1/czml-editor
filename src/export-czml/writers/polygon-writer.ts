import { ArcType, ClassificationType, HeightReference, PolygonGraphics, PolygonHierarchy, Property, ShadowMode } from "cesium";
import { WriterContext } from "../export-czml";
import { writeColor, writeDistanceDisplayCondition, writeEnum, writePositionListOfListValue, writePositionListValue, writeScalar } from "./field-writers";
import { writeMaterial } from "./material-writer";

export async function writePolygon(polygon: PolygonGraphics, ctx: WriterContext) {
    const packet: any = {};

    if (polygon.show !== undefined) {
        packet.show =  writeScalar(polygon.show, {...ctx, path: ['polygon', 'show']});
    }

    if (polygon.hierarchy) {
        const {positions, holes} = writePolygonHierarchy(polygon.hierarchy, {...ctx, path: ['polygon', 'hierarchy']});
    
        if (positions) {
            packet.positions = positions;
        }
        else {
            // TODO: Error reporting
        }
    
        if (holes) {
            packet.holes = holes;
        }
    }

    if (polygon.arcType !== undefined) {
        packet.arcType = writeEnum(polygon.arcType, {...ctx, path: ['polygon', 'arcType']}, ArcType);
    }

    if (polygon.height !== undefined) {
        packet.height = writeScalar(polygon.height, {...ctx, path: ['polygon', 'height']});
    }

    if (polygon.heightReference !== undefined) {
        packet.heightReference = writeEnum(polygon.heightReference, {...ctx, path: ['polygon', 'heightReference']}, HeightReference);
    }

    if (polygon.extrudedHeight !== undefined) {
        packet.extrudedHeight = writeScalar(polygon.extrudedHeight, {...ctx, path: ['polygon', 'extrudedHeight']});
    }

    if (polygon.extrudedHeightReference !== undefined) {
        packet.extrudedHeightReference = writeEnum(polygon.extrudedHeightReference, {...ctx, path: ['polygon', 'extrudedHeightReference']}, HeightReference);
    }

    if (polygon.stRotation !== undefined) {
        packet.stRotation = writeScalar(polygon.stRotation, {...ctx, path: ['polygon', 'stRotation']});
    }

    if (polygon.granularity !== undefined) {
        packet.granularity = writeScalar(polygon.granularity, {...ctx, path: ['polygon', 'granularity']});
    }
    
    if (polygon.fill !== undefined) {
        packet.fill = writeScalar(polygon.fill, {...ctx, path: ['polygon', 'fill']});
    }

    if (polygon.material !== undefined) {
        packet.material = await writeMaterial(polygon.material, {...ctx, path: ['polygon', 'material']});
    }

    if (polygon.outline !== undefined) {
        packet.outline = writeScalar(polygon.outline, {...ctx, path: ['polygon', 'outline']});
    }
    
    if (polygon.outlineColor !== undefined) {
        packet.outlineColor = writeColor(polygon.outlineColor, {...ctx, path: ['polygon', 'outlineColor']});
    }

    if (polygon.outlineWidth !== undefined) {
        packet.outlineWidth = writeScalar(polygon.outlineWidth, {...ctx, path: ['polygon', 'outlineWidth']});
    }

    if (polygon.perPositionHeight !== undefined) {
        packet.perPositionHeight = writeScalar(polygon.perPositionHeight, {...ctx, path: ['polygon', 'perPositionHeight']});
    }

    if (polygon.closeTop !== undefined) {
        packet.closeTop = writeScalar(polygon.closeTop, {...ctx, path: ['polygon', 'closeTop']});
    }

    if (polygon.closeBottom !== undefined) {
        packet.closeBottom = writeScalar(polygon.closeBottom, {...ctx, path: ['polygon', 'closeBottom']});
    }
    
    if (polygon.shadows !== undefined) {
        packet.shadows = writeEnum(polygon.shadows, {...ctx, path: ['polygon', 'shadows']}, ShadowMode);
    }

    if (polygon.distanceDisplayCondition !== undefined) {
        packet.distanceDisplayCondition = writeDistanceDisplayCondition(polygon.distanceDisplayCondition, {...ctx, path: ['polygon', 'distanceDisplayCondition']});
    }
    
    if (polygon.classificationType !== undefined) {
        packet.classificationType = writeEnum(polygon.classificationType, {...ctx, path: ['polygon', 'classificationType']}, ClassificationType);
    }
    
    if (polygon.classificationType !== undefined) {
        packet.classificationType = writeEnum(polygon.classificationType, {...ctx, path: ['polygon', 'classificationType']}, ClassificationType);
    }
    
    if (polygon.zIndex !== undefined) {
        packet.zIndex = writeScalar(polygon.zIndex, {...ctx, path: ['polygon', 'zIndex']});
    }

    return packet;
}

type PositionsAndHoles = {
    positions?: ReturnType<typeof writePositionListValue>,
    holes?: ReturnType<typeof writePositionListOfListValue>,
}

function writePolygonHierarchy(property: Property, ctx: WriterContext) {
    const val = writeScalar(property, ctx);

    if (val === undefined || val === null) {
        return {
            positions: undefined,
            holes: undefined
        } as PositionsAndHoles;
    }

    const hierarchy = val as PolygonHierarchy;

    const ret: PositionsAndHoles = {
        // PositionList
        positions: writePositionListValue(hierarchy.positions),
    };

    if (hierarchy.holes && hierarchy.holes.length > 0) {
        // PositionListOfLists
        const coords = hierarchy.holes.map(h => h.positions);
        ret.holes = writePositionListOfListValue(coords);
    }

    return ret;
}
