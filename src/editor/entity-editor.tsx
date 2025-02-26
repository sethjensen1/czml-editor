import { ConstantProperty, Entity, HeightReference } from "cesium";
import { Tabs } from "../misc/tabs";

import { Property as CesiumProperty } from "cesium";

import './entity-editor.css';
import { PropertyField } from "./fields/property-fld";

export type EntityEditorProps = {
    entity: Entity | null;
}

export function EntytyEditor({entity}: EntityEditorProps) {

    if (!entity) {
        return null;
    }
    return (
        <div id={'entity-editor'}>
            <h2>Selected Entity</h2>
            <PolygonEditor entity={entity}/>
        </div>
    );
}

export type PropertyType = {
    type: 'number' | 'boolean' | 'color' | 'material';
} | {
    type: 'enum';
    enum: any;
};

export type PropertyMeta = {
    name: string;
    title?: string;
    description?: string;
} & PropertyType;

const heightReferenceDescription = `
NONE - The position is absolute.
CLAMP_TO_GROUND - The position is clamped to the terrain and 3D Tiles.
RELATIVE_TO_GROUND - The position height is the height above the terrain and 3D Tiles.
CLAMP_TO_TERRAIN - The position is clamped to terain.
RELATIVE_TO_TERRAIN - The position height is the height above terrain.
CLAMP_TO_3D_TILE - The position is clamped to 3D Tiles.
RELATIVE_TO_3D_TILE - The position height is the height above 3D Tiles.
`;

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
    {name: 'height', type: 'number'}, 
    {name: 'fill', type: 'boolean'},
    {name: 'material', type: 'material'}, 
    {name: 'outline', type: 'boolean'},
    {name: 'outlineColor', type: 'color'},
    {name: 'outlineWidth', type: 'number'}, 
];

const polygonProps = [
    'classificationType', 
    'zIndex', 
    'distanceDisplayCondition',
];

export type PolygonEditorProps = {
    entity: Entity | null;
}
export function PolygonEditor({entity}: EntityEditorProps) {

    const subj = entity?.polygon;

    console.log(subj);

    const createPropField = (prop: PropertyMeta) => {

        const property = (subj as any)[prop.name] as CesiumProperty;
        
        if( property !== undefined && !property.isConstant ) {
            return <div>
                Cant't edit "{prop.name}" because it's values are interpolated
            </div>
        }

        const value = (property as ConstantProperty)?.valueOf();
        
        return (
            <PropertyField key={prop.name} 
                property={prop} value={value} 
                onChange={(val: any) => {(subj as any)[prop.name] = val;}} />
        );
    }


    const geom = subj && geomProperties.map(createPropField);

    const appearance = subj && appearanceProps.map(createPropField);

    return (
        <div id={'polygon-editor'}>
            <h3>Polygon Editor</h3>
            <Tabs tabNames={['Appearance', 'Geometry']}>
                <>
                {appearance}
                </>
                <>
                {geom}
                </>
            </Tabs>

        </div>
    );

}
