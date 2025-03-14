import { PropertyMeta } from "./meta";

const appearanceProps: PropertyMeta[] = [
    {name: 'show', type: 'boolean'},
    {name: 'text', type: 'string'},
];

export const labelMetadata = {
    feature: 'label',
    propertyGroups: [{
        title: 'Text and Font',
        properties: appearanceProps
    }]
}