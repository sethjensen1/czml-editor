import { Cartesian2, HeightReference, HorizontalOrigin, LabelStyle, VerticalOrigin } from "cesium";
import { PropertyMeta } from "./meta";

const appearanceProps: PropertyMeta[] = [
    {name: 'text', type: 'string'},

    {name: 'pixelOffset', type: 'vector', size: 2, targetClass: Cartesian2},

    {name: 'fillColor', type: 'color'},
    {name: 'outlineWidth', type: 'number'},
    {name: 'outlineColor', type: 'color'},
    {name: 'style', type: 'enum', enum: LabelStyle},
    
    {name: 'horizontalOrigin', type: 'enum', enum: HorizontalOrigin},
    {name: 'verticalOrigin', type: 'enum', enum: VerticalOrigin},

    {name: 'font', type: 'string'},
    {name: 'scale', type: 'number'},

    {name: 'heightReference', type: 'enum', enum: HeightReference},
];

const extraProps: PropertyMeta[] = [
    {name: 'showBackground', type: 'boolean'},
    {name: 'backgroundColor', type: 'color'},
    {name: 'backgroundPadding', type: 'vector', size: 2, targetClass: Cartesian2},
    
    {name: 'scaleByDistance', type: 'near-far-scalar'},
    {name: 'translucencyByDistance', type: 'near-far-scalar'},
    {name: 'pixelOffsetScaleByDistance', type: 'near-far-scalar'},
    
    {name: 'distanceDisplayCondition', type: 'distance-display-condition'},
];

export const labelMetadata = {
    feature: 'label',
    propertyGroups: [{
        title: 'Label',
        properties: appearanceProps
    }, {
        title: 'Label Extra',
        properties: extraProps
    }]
}