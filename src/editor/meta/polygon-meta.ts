import { ClassificationType, HeightReference } from "cesium";
import { heightReferenceDescription, PropertyMeta } from "./meta";

const geomProperties: PropertyMeta[] = [
    {name: 'height', type: 'number'}, 
    {name: 'extrudedHeight', type: 'number'}, 
    {name: 'heightReference', type: 'enum', enum: HeightReference,
        description: heightReferenceDescription
    },
    {name: 'extrudedHeightReference', type: 'enum', enum: HeightReference,
        description: heightReferenceDescription
    }, 
    {name: 'perPositionHeight', type: 'boolean'},
    {name: 'closeBottom', type: 'boolean'},
    {name: 'closeTop', type: 'boolean'},
]; 

const appearanceProps: PropertyMeta[] = [
    {name: 'fill', type: 'boolean'},
    {name: 'material', type: 'material'}, 
    {name: 'outline', type: 'boolean'},
    {name: 'outlineColor', type: 'color'},
    {name: 'outlineWidth', type: 'number'}, 
];

const extraProps: PropertyMeta[] = [
    {name: 'classificationType', type: 'enum', 
        enum: ClassificationType, 
        ignore: ['NUMBER_OF_CLASSIFICATION_TYPES']
    },
    {name: 'zIndex', type: 'number'},
    {name: 'distanceDisplayCondition',
        type: 'distance-display-condition'}, 
];

export const polygonMetaData = {
    feature: 'polygon',
    propertyGroups: [{
        title: 'Appearance',
        properties: appearanceProps
    },{
        title: 'Geometry',
        properties: geomProperties
    },{
        title: 'Extra',
        properties: extraProps
    }],
}