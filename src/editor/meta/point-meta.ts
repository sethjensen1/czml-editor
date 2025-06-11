import { HeightReference } from "cesium";
import { PropertyMeta } from "./meta";


const basicProps: PropertyMeta[] = [
    
    {name: 'outlineWidth', type: 'number'},
    {name: 'outlineColor', type: 'color', noAlpha: true},
    {name: 'pixelSize', type: 'number'},

    {name: 'heightReference', type: 'enum', enum: HeightReference},
    
    {name: 'translucencyByDistance', type: 'near-far-scalar'},
    
    {name: 'scaleByDistance', type: 'near-far-scalar'},
        
    {name: 'distanceDisplayCondition', 
        type: 'distance-display-condition'},
            
    {name: 'disableDepthTestDistance', type: 'number'},
];

export const pointMetaData = {
    feature: 'point',
    propertyGroups: [{
        title: 'Point',
        properties: basicProps
    }]
}