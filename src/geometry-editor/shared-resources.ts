import { Entity, EntityCollection, ReferenceProperty, Resource } from "cesium";

export type SharedResources = typeof DefaultSharedResources;

export const DefaultSharedResources = {
    uploads: [] as any[],
    defaultIcons: [] as any[],
    datasourceIcons: [] as string[],
}

/**
 * Returns a map of (billboard image resource) to all entity ids where it's used
*/
export function mapBillboardImageResources(entities: Entity[]) {

    const imageUriToEntityIds: Map<string, string[]> = new Map();

    for (var entity of entities) {
        if (entity.billboard) {
            const imgProperty = entity.billboard.image
        
            if (imgProperty?.isConstant && !(imgProperty instanceof ReferenceProperty)) {
                const value = imgProperty.getValue();
                const resource = getUrlFromPropValue(value);

                if (resource) {
                    
                    const entityIds = imageUriToEntityIds.get(resource.url) || [];
                    imageUriToEntityIds.set(resource.url, [...entityIds, entity.id]);
                }
            }
        }
    }

    return imageUriToEntityIds;
}

export function referenceProperties(entities: Entity[], collection: EntityCollection) {

    // if(imageUriToEntityIds.has(resource.url) && resource.isDataUri) {
    //     const tagetId = imageUriToEntityIds.get(resource.url)![0]
    //     entity.billboard.image = new ReferenceProperty(collection, tagetId, ['billboard', 'image'] )
    // }
}

function getUrlFromPropValue(value: string | Resource | HTMLCanvasElement ) {
    if (value instanceof Resource) {
        return value;
    }
    else if (typeof value === 'string' || value instanceof String) {
        return new Resource(value as string);
    }
    else if (value instanceof HTMLCanvasElement) {
        return new Resource(value.toDataURL());
    }
    else {
        console.warn('Unknow type of imgage property value, value is', value);
    }
}