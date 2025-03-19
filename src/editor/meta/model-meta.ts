import { ColorBlendMode, HeightReference, ShadowMode } from "cesium";
import { PropertyMeta } from "./meta";

const scaleProps: PropertyMeta[] = [
    {name: 'scale', type: 'number'},
    {name: 'minimumPixelSize', type: 'number'},
    {name: 'maximumScale', type: 'number'},
];

const appearanceProps: PropertyMeta[] = [
    {name: 'color', type: 'color'},
    {name: 'colorBlendMode', type: 'enum', enum: ColorBlendMode},
    {name: 'colorBlendAmount', type: 'number'},
    
    {name: 'silhouetteColor', type: 'color'},
    {name: 'silhouetteSize', type: 'number'},
];

const extraProps: PropertyMeta[] = [
    {name: 'runAnimations', type: 'boolean'},
    {name: 'clampAnimations', type: 'boolean'},
    {name: 'shadows', type: 'enum', enum: ShadowMode, ignore: ['NUMBER_OF_SHADOW_MODES']},
    {name: 'heightReference', type: 'enum', enum: HeightReference},
    {name: 'distanceDisplayCondition', type: 'distance-display-condition'},
];

export const modelMetaData = {
    feature: 'model',
    propertyGroups: [{
        title: 'Scale & Display',
        properties: scaleProps
    },{
        title: 'Color',
        properties: appearanceProps
    },{
        title: 'Extra',
        properties: extraProps
    }],
}