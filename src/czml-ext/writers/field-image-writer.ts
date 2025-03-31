import { ConstantProperty, Entity, Property, Resource } from "cesium";
import { ExportOptions, WriterContext } from "../export-czml";
import { writeScalar } from "./field-writers";

/**
 * This function is asynchronous to support async image transformations
*/
export async function writeImage(property: Property, ctx: WriterContext) {

    const val = writeScalar(property, ctx);
    if (!val || val.reference) return val;

    // We don't want to copy base64 data urls, we want to replace such urls
    // as references 
    // This might not be needed in a future for cml editor b.c. it's better to set
    // such properties as references at the moment of their assignment
    
    const exportedImages = ctx.exportedImages;

    const resource = (val instanceof String || typeof val === 'string') ? new Resource(val as string) : val as Resource;
    if (!(resource instanceof Resource)) {
        ctx.options?.onFailedToEncode?.(ctx.entity!, ctx.path, property);
    }
    
    if (exportedImages) {
        const existing = exportedImages[resource.url];
        if (existing) {
            return existing.targetPath;
        }
    }

    return resource.toString();
}

export type ResourcesMap = {
    [key: string]: Entity[]
}
export function buildImagesMap(entities: Entity[], path: string[], map: ResourcesMap) {

    for (const entity of entities) {
        const resource = getResourceByPath(entity, path);
        if (resource) {
            const entry = map[resource.url] || [];
            map[resource.url] = [...entry, entity];
        }
    }
}

export type ImageExport = {
    [url: string]: {
        targetPath: string
        img: ImageBitmap | HTMLImageElement
    }
};
export async function exportImages(imgs: ResourcesMap, options: ExportOptions) {
    const {exportImagesPath = ''} = options;

    let counter = 1;

    let result: ImageExport = {};

    for (const [url] of Object.entries(imgs)) {

        const resource = new Resource(url);
        const urlFileExt = resource.extension;
    
        const urlPathname = (resource.isBlobUri || resource.isDataUri) ? undefined : new URL(resource.url).pathname;
        const urlFileName = urlPathname?.match(/\/([\w\d\.\-]+)$/i)?.[1];
    
        const dataMime = resource.isDataUri ? url.substring(url.indexOf(":") + 1, url.indexOf(";")) : undefined;
        const mimeExt = dataMime?.replace('image/', '');

        const ext = urlFileExt || mimeExt;

        const name = urlFileName || `icon-${counter++}.${ext}`;
    
        try {
            const img = await resource.fetchImage();
            const targetPath = exportImagesPath + name;
            
            if (img) {
                result = {
                    ...result,
                    [url]: {targetPath, img}
                }
            }
            else {
                // TODO: Error reporting
                console.warn('failed to fetch image');
            }
        }
        catch {
            // TODO: Error reporting
            console.warn('failed to fetch image');
        }
    }

    return result;
}

export function getResourceByPath(entity: Entity, path: string[]) {
    const property = getPropertyByPath(entity, path) as (Property | ConstantProperty | Resource | string | undefined);

    if (property) {
        if (typeof property === 'string') {
            return new Resource(property);
        }

        if ((property as any).isConstant && (property as any).getValue) {
            const val = (property as ConstantProperty).getValue();
            if (val) {
                if (val instanceof Resource) {
                    return val;
                }

                if (typeof val === 'string') {
                    return new Resource(val);
                }
            }
        }
    }
}

function getPropertyByPath(entity: Entity, path: string[]) {
    let ret = entity;
    for (const p of path) {
        if (ret === undefined) return undefined;

        ret = (ret as any)[p];
    }

    return ret;
}
