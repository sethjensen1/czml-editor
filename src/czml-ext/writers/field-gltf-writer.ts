import { Entity, Property } from "cesium";
import { getResourceByPath } from "./field-image-writer";
import { WriterContext } from "../export-czml";
import { writeScalar } from "./field-writers";

export type ModelExport = {
    [url: string]: {
        targetPath: string
        model: Blob
    }
};

export function writeGltf(prop: Property, ctx: WriterContext) {
    const val = writeScalar(prop, ctx);
    if (val === undefined || val === null || val.reference) return val;

    const exported = ctx.exportedModels?.[val];
    if (exported) {
        return exported.targetPath;
    }

    return val;
}

export async function exportModels(entities: Entity[]) {

    const exportMap: ModelExport = {};

    let counter = 1;
    
    for (const entity of entities) {
        const resource = getResourceByPath(entity, ['model', 'uri']);

        if (resource) {
            const ext = resource.extension;
        
            const urlPathname = (resource.isBlobUri || resource.isDataUri) ? undefined : new URL(resource.url).pathname;
            const urlFileName = urlPathname?.match(/\/([\w\d\.\-]+)$/i)?.[1];
        
            const name = urlFileName || `model${counter++}.${ext}`;

            try {
                const targetPath = name;
                const blob = await resource.fetchBlob();
                if (blob) {
                    exportMap[resource.url] = {targetPath, model: blob};
                }
                else {
                    // TODO: Error reporting
                }
            }
            catch {
                // TODO: Error reporting
            }
        }
    }


    return exportMap ;
}