import { CylinderGraphics, HeightReference, ShadowMode } from "cesium";
import { WriterContext } from "../../export-czml";
import { Cylinder as CylinderCzml } from "../../schema/cylinder";
import { writeColor, writeDistanceDisplayCondition, writeEnum, writeScalar } from "../field-writers";
import { writeMaterial } from "../material-writer";

export async function writeCylinder(cylinder: CylinderGraphics , ctx: WriterContext) {
    const czml: CylinderCzml = {};

    if (cylinder.show !== undefined) {
        czml.show = writeScalar(cylinder.show, {...ctx, path: [...ctx.path, 'show']});
    }
    
    if (cylinder.length !== undefined) {
        czml.length = writeScalar(cylinder.length, {...ctx, path: [...ctx.path, 'length']});
    }

    if (cylinder.topRadius !== undefined) {
        czml.topRadius = writeScalar(cylinder.topRadius, {...ctx, path: [...ctx.path, 'topRadius']});
    }
    
    if (cylinder.bottomRadius !== undefined) {
        czml.bottomRadius = writeScalar(cylinder.bottomRadius, {...ctx, path: [...ctx.path, 'bottomRadius']});
    }
    
    if (cylinder.heightReference !== undefined) {
        czml.heightReference = writeEnum(cylinder.heightReference, {...ctx, path: [...ctx.path, 'heightReference']}, HeightReference);
    }

    if (cylinder.fill !== undefined) {
        czml.fill = writeScalar(cylinder.fill, {...ctx, path: [...ctx.path, 'fill']});
    }

    if (cylinder.material !== undefined) {
        czml.material = await writeMaterial(cylinder.material, {...ctx, path: [...ctx.path, 'material']});
    }

    if (cylinder.outline !== undefined) {
        czml.outline = writeScalar(cylinder.outline, {...ctx, path: [...ctx.path, 'outline']});
    }

    if (cylinder.outlineColor !== undefined) {
        czml.outlineColor = writeColor(cylinder.outlineColor, {...ctx, path: [...ctx.path, 'outlineColor']});
    }
    
    if (cylinder.outlineWidth !== undefined) {
        czml.outlineWidth = writeScalar(cylinder.outlineWidth, {...ctx, path: [...ctx.path, 'outlineWidth']});
    }
    
    if (cylinder.numberOfVerticalLines !== undefined) {
        czml.numberOfVerticalLines = writeScalar(cylinder.numberOfVerticalLines, {...ctx, path: [...ctx.path, 'numberOfVerticalLines']});
    }
    
    if (cylinder.slices !== undefined) {
        czml.slices = writeScalar(cylinder.slices, {...ctx, path: [...ctx.path, 'slices']});
    }

    if (cylinder.shadows !== undefined) {
        czml.shadows = writeEnum(cylinder.shadows, {...ctx, path: [...ctx.path, 'shadows']}, ShadowMode);
    }

    if (cylinder.distanceDisplayCondition !== undefined) {
        czml.distanceDisplayCondition = writeDistanceDisplayCondition(cylinder.distanceDisplayCondition, {...ctx, path: [...ctx.path, 'distanceDisplayCondition']});
    }


    return czml;
}

