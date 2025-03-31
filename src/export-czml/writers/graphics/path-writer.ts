import { PathGraphics } from "cesium";
import { WriterContext } from "../../export-czml";
import { Path as PathCzml } from "../../schema/path";
import { writeDistanceDisplayCondition, writeScalar } from "../field-writers";
import { writePolylineMaterial } from "../material-writer";

export function writePath(path: PathGraphics, ctx: WriterContext) {
    const czml: PathCzml = {};

    if (path.show !== undefined) {
        czml.show = writeScalar(path.show, {...ctx, path: [...ctx.path, 'show']});
    }
    
    if (path.leadTime !== undefined) {
        czml.leadTime = writeScalar(path.leadTime, {...ctx, path: [...ctx.path, 'leadTime']});
    }
    
    if (path.trailTime !== undefined) {
        czml.trailTime = writeScalar(path.trailTime, {...ctx, path: [...ctx.path, 'trailTime']});
    }
    
    if (path.width !== undefined) {
        czml.width = writeScalar(path.width, {...ctx, path: [...ctx.path, 'width']});
    }
    
    if (path.resolution !== undefined) {
        czml.resolution = writeScalar(path.resolution, {...ctx, path: [...ctx.path, 'resolution']});
    }
    
    if (path.material !== undefined) {
        czml.material =  writePolylineMaterial(path.material, {...ctx, path: [...ctx.path, 'material']});
    }

    if (path.distanceDisplayCondition !== undefined) {
        czml.distanceDisplayCondition = writeDistanceDisplayCondition(path.distanceDisplayCondition, {...ctx, path: [...ctx.path, 'distanceDisplayCondition']});
    }

    return czml;
}