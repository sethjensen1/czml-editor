import { HeightReference, PointGraphics } from "cesium";
import { Point as PointCzml } from "../../schema/point";
import { WriterContext } from "../../export-czml";
import { writeColor, writeDistanceDisplayCondition, writeEnum, writeNearFarScalar, writeScalar } from "../field-writers";

export function writePoint(point: PointGraphics, ctx: WriterContext) {
    const czml: PointCzml = {};

    if (point.show !== undefined) {
        czml.show = writeScalar(point.show, {...ctx, path: [...ctx.path, 'show']});
    }
    
    if (point.pixelSize !== undefined) {
        czml.pixelSize = writeScalar(point.pixelSize, {...ctx, path: [...ctx.path, 'pixelSize']});
    }
    
    if (point.heightReference !== undefined) {
        czml.heightReference = writeEnum(point.heightReference, {...ctx, path: [...ctx.path, 'heightReference']}, HeightReference);
    }
    
    if (point.color !== undefined) {
        czml.color = writeColor(point.color, {...ctx, path: [...ctx.path, 'color']});
    }
    
    if (point.outlineColor !== undefined) {
        czml.outlineColor = writeColor(point.outlineColor, {...ctx, path: [...ctx.path, 'outlineColor']});
    }
    
    if (point.outlineWidth !== undefined) {
        czml.outlineWidth = writeColor(point.outlineWidth, {...ctx, path: [...ctx.path, 'outlineWidth']});
    }
    
    if (point.scaleByDistance !== undefined) {
        czml.scaleByDistance = writeNearFarScalar(point.scaleByDistance, {...ctx, path: [...ctx.path, 'scaleByDistance']});
    }
    
    if (point.translucencyByDistance !== undefined) {
        czml.translucencyByDistance = writeNearFarScalar(point.translucencyByDistance, {...ctx, path: [...ctx.path, 'translucencyByDistance']});
    }

    if (point.distanceDisplayCondition !== undefined) {
        czml.distanceDisplayCondition = writeDistanceDisplayCondition(point.distanceDisplayCondition, {...ctx, path: [...ctx.path, 'distanceDisplayCondition']});
    }

    if (point.disableDepthTestDistance !== undefined) {
        czml.disableDepthTestDistance = writeScalar(point.disableDepthTestDistance, {...ctx, path: [...ctx.path, 'disableDepthTestDistance']});
    }

    return czml;
}