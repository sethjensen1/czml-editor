import { PropertyMeta } from "./meta";

const basicProps: PropertyMeta[] = [
    {name: 'leadTime', type: 'number'},
    {name: 'trailTime', type: 'number'},
    {name: 'width', type: 'number'},

    {name: 'material', type: 'material'},
];

export const pathMetaData = {
    feature: 'path',
    propertyGroups: [{
        title: 'Path',
        properties: basicProps
    }],
}