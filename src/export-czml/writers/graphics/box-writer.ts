import { BoxGraphics, HeightReference, ShadowMode } from "cesium";
import { WriterContext } from "../../export-czml";
import { Box as BoxCzml } from "../../schema/box";
import { writeCartesian, writeColor, writeDistanceDisplayCondition, writeEnum, writeScalar } from "../field-writers";
import { writeMaterial } from "../material-writer";

export async function writeBox(box: BoxGraphics, ctx: WriterContext) {
    const czml: BoxCzml = {};

    if (box.show !== undefined) {
        czml.show = writeScalar(box.show, {...ctx, path: [...ctx.path, 'show']});
    }

    if (box.dimensions !== undefined) {
        czml.dimensions = writeCartesian(box.dimensions, {...ctx, path: [...ctx.path, 'dimensions']});
    }

    if (box.heightReference !== undefined) {
        czml.heightReference = writeEnum(box.heightReference, {...ctx, path: [...ctx.path, 'heightReference']}, HeightReference);
    }

    if (box.fill !== undefined) {
        czml.fill = writeScalar(box.fill, {...ctx, path: [...ctx.path, 'fill']});
    }
    
    if (box.material !== undefined) {
        czml.material = await writeMaterial(box.material, {...ctx, path: [...ctx.path, 'material']});
    }

    if (box.outline !== undefined) {
        czml.outline = writeScalar(box.outline, {...ctx, path: [...ctx.path, 'outline']});
    }
    
    if (box.outlineColor !== undefined) {
        czml.outlineColor = writeColor(box.outlineColor, {...ctx, path: [...ctx.path, 'outlineColor']});
    }
    
    if (box.outlineWidth !== undefined) {
        czml.outlineWidth = writeScalar(box.outlineWidth, {...ctx, path: [...ctx.path, 'outlineWidth']});
    }

    if (box.shadows !== undefined) {
        czml.shadows = writeEnum(box.shadows, {...ctx, path: [...ctx.path, 'shadows']}, ShadowMode);
    }

    if (box.distanceDisplayCondition !== undefined) {
        czml.distanceDisplayCondition = writeDistanceDisplayCondition(box.distanceDisplayCondition, {...ctx, path: [...ctx.path, 'distanceDisplayCondition']});
    }

    return czml;
}
