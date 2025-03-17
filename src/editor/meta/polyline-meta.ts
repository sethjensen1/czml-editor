import { ClassificationType } from "cesium";
import { PropertyMeta } from "./meta";

const geomProperties: PropertyMeta[] = [
    {name: 'width', type: 'number'}, 
    {name: 'material', type: 'material'}, 
    {name: 'clampToGround', type: 'boolean'},
    {name: 'distanceDisplayCondition',
        type: 'distance-display-condition'}, 
    {name: 'classificationType', type: 'enum', 
        enum: ClassificationType, 
        ignore: ['NUMBER_OF_CLASSIFICATION_TYPES']
    },
]; 

export const polylineMetaData = {
    feature: 'polyline',
    propertyGroups: [{
        title: 'Polyline properties',
        properties: geomProperties
    }],
}