import { PropertyMeta } from "./meta";

const appearanceProps: PropertyMeta[] = [
    {name: 'text', type: 'string'},
];

export const labelMetadata = {
    feature: 'billboard',
    propertyGroups: [{
        title: 'Text and Font',
        properties: appearanceProps
    }]
}