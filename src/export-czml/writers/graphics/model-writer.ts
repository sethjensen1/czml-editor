import { ColorBlendMode, HeightReference, ModelGraphics, ShadowMode } from "cesium";
import { Model as ModelCzml } from "../../schema/model";
import { WriterContext } from "../../export-czml";
import { writeColor, writeDistanceDisplayCondition, writeEnum, writePropertyBag, writeScalar } from "../field-writers";
import { writeGltf } from "../field-gltf-writer";

export function writeModel(model: ModelGraphics, ctx: WriterContext) {
    const czml: ModelCzml = {};

    if (model.show !== undefined) {
        czml.show = writeScalar(model.show, {...ctx, path: [...ctx.path, 'show']});
    }

    if (model.uri !== undefined) {
        czml.gltf = writeGltf(model.uri, {...ctx, path: [...ctx.path, 'uri']});
    }

    if (model.minimumPixelSize !== undefined) {
        czml.minimumPixelSize = writeScalar(model.minimumPixelSize, {...ctx, path: [...ctx.path, 'minimumPixelSize']});
    }

    if (model.maximumScale !== undefined) {
        czml.maximumScale = writeScalar(model.maximumScale, {...ctx, path: [...ctx.path, 'maximumScale']});
    }
    
    if (model.incrementallyLoadTextures !== undefined) {
        czml.incrementallyLoadTextures = writeScalar(model.incrementallyLoadTextures, {...ctx, path: [...ctx.path, 'incrementallyLoadTextures']});
    }
    
    if (model.runAnimations !== undefined) {
        czml.runAnimations = writeScalar(model.runAnimations, {...ctx, path: [...ctx.path, 'runAnimations']});
    }

    if (model.shadows !== undefined) {
        czml.shadows = writeEnum(model.shadows, {...ctx, path: [...ctx.path, 'shadows']}, ShadowMode);
    }
    
    if (model.heightReference !== undefined) {
        czml.heightReference = writeEnum(model.heightReference, {...ctx, path: [...ctx.path, 'heightReference']}, HeightReference);
    }
    
    if (model.silhouetteColor !== undefined) {
        czml.silhouetteColor = writeColor(model.silhouetteColor, {...ctx, path: [...ctx.path, 'silhouetteColor']});
    }

    if (model.silhouetteSize !== undefined) {
        czml.silhouetteSize = writeScalar(model.silhouetteSize, {...ctx, path: [...ctx.path, 'silhouetteSize']});
    }

    if (model.color !== undefined) {
        czml.color = writeColor(model.color, {...ctx, path: [...ctx.path, 'color']});
    }
    
    if (model.colorBlendMode !== undefined) {
        czml.colorBlendMode = writeEnum(model.colorBlendMode, {...ctx, path: [...ctx.path, 'colorBlendMode']}, ColorBlendMode);
    }
    
    if (model.colorBlendAmount !== undefined) {
        czml.colorBlendAmount = writeScalar(model.colorBlendAmount, {...ctx, path: [...ctx.path, 'colorBlendAmount']});
    }

    if (model.distanceDisplayCondition !== undefined) {
        czml.distanceDisplayCondition = writeDistanceDisplayCondition(model.distanceDisplayCondition, {...ctx, path: [...ctx.path, 'distanceDisplayCondition']});
    }

    if (model.nodeTransformations !== undefined) {
        czml.nodeTransformations = writePropertyBag(model.nodeTransformations, {...ctx, path: [...ctx.path, 'nodeTransformations']});
    }
    
    if (model.articulations !== undefined) {
        czml.articulations = writePropertyBag(model.articulations, {...ctx, path: [...ctx.path, 'articulations']});
    }

    return czml;
}

