import { ArcType, ClassificationType, PolylineGraphics, ShadowMode } from "cesium";
import { WriterContext } from "../../export-czml";
import { Polyline as PolylineCzml } from "../../schema/polyline";
import { writeDistanceDisplayCondition, writeEnum, writePositionList, writeScalar } from "../field-writers";
import { writePolylineMaterial } from "../material-writer";

export function writePolyline(polyline: PolylineGraphics, ctx: WriterContext) {
    const packet: PolylineCzml = {};
    
    /**
     * Initialization options for the PolylineGraphics constructor
     * @property [show = true] - A boolean Property specifying the visibility of the polyline.
     * @property [positions] - A Property specifying the array of {@link Cartesian3} positions that define the line strip.
     * @property [width = 1.0] - A numeric Property specifying the width in pixels.
     * @property [granularity = Cesium.Math.RADIANS_PER_DEGREE] - A numeric Property specifying the angular distance between each latitude and longitude if arcType is not ArcType.NONE.
     * @property [material = Color.WHITE] - A Property specifying the material used to draw the polyline.
     * @property [depthFailMaterial] - A property specifying the material used to draw the polyline when it is below the terrain.
     * @property [arcType = ArcType.GEODESIC] - The type of line the polyline segments must follow.
     * @property [clampToGround = false] - A boolean Property specifying whether the Polyline should be clamped to the ground.
     * @property [shadows = ShadowMode.DISABLED] - An enum Property specifying whether the polyline casts or receives shadows from light sources.
     * @property [distanceDisplayCondition] - A Property specifying at what distance from the camera that this polyline will be displayed.
     * @property [classificationType = ClassificationType.BOTH] - An enum Property specifying whether this polyline will classify terrain, 3D Tiles, or both when on the ground.
     * @property [zIndex = 0] - A Property specifying the zIndex used for ordering ground geometry. Only has an effect if `clampToGround` is true and polylines on terrain is supported.
     */

    if (polyline.show !== undefined) {
        packet.show =  writeScalar(polyline.show, {...ctx, path: [...ctx.path, 'show']});
    }
    
    if (polyline.positions !== undefined) {
        packet.positions =  writePositionList(polyline.positions, {...ctx, path: [...ctx.path, 'positions']});
    }

    if (polyline.width !== undefined) {
        packet.width =  writeScalar(polyline.width, {...ctx, path: [...ctx.path, 'width']});
    }
    
    if (polyline.granularity !== undefined) {
        packet.granularity =  writeScalar(polyline.granularity, {...ctx, path: [...ctx.path, 'granularity']});
    }

    if (polyline.material !== undefined) {
        packet.material =  writePolylineMaterial(polyline.material, {...ctx, path: [...ctx.path, 'material']});
    }
    
    if (polyline.depthFailMaterial !== undefined) {
        packet.depthFailMaterial =  writePolylineMaterial(polyline.depthFailMaterial, {...ctx, path: [...ctx.path, 'depthFailMaterial']});
    }

    if (polyline.arcType !== undefined) {
        packet.arcType =  writeEnum(polyline.arcType, {...ctx, path: [...ctx.path, 'arcType']}, ArcType);
    }
    
    if (polyline.clampToGround !== undefined) {
        packet.clampToGround =  writeScalar(polyline.clampToGround, {...ctx, path: [...ctx.path, 'clampToGround']});
    }
    
    if (polyline.shadows !== undefined) {
        packet.shadows =  writeEnum(polyline.shadows, {...ctx, path: [...ctx.path, 'shadows']}, ShadowMode);
    }
    
    if (polyline.distanceDisplayCondition !== undefined) {
        packet.distanceDisplayCondition = writeDistanceDisplayCondition(polyline.distanceDisplayCondition, {...ctx, path: [...ctx.path, 'distanceDisplayCondition']});
    }

    if (polyline.classificationType !== undefined) {
        packet.classificationType =  writeEnum(polyline.classificationType, {...ctx, path: [...ctx.path, 'classificationType']}, ClassificationType);
    }
    
    if (polyline.zIndex !== undefined) {
        packet.zIndex =  writeScalar(polyline.zIndex, {...ctx, path: [...ctx.path, 'zIndex']});
    }

    return packet;
}

