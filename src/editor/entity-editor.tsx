import { ClassificationType, ConstantProperty, Entity, HeightReference } from "cesium";
import { Tabs } from "../misc/tabs";

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
            <h3>Selected Entity</h3>
            <PolygonEditor entity={entity}/>
        </div>
    );
}

export type PropertyType = {
    type: 'number' | 'boolean' | 'color' | 'material' | 'distanceDisplayCondition';
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
    {name: 'fill', type: 'boolean'},
    {name: 'material', type: 'material'}, 
    {name: 'outline', type: 'boolean'},
    {name: 'outlineColor', type: 'color'},
    {name: 'outlineWidth', type: 'number'}, 
];

const extraProps: PropertyMeta[] = [
    {name: 'classificationType', type: 'enum', enum: ClassificationType},
    {name: 'zIndex', type: 'number'},
    {name: 'distanceDisplayCondition', type: 'distanceDisplayCondition'}, 
];

export type PolygonEditorProps = {
    entity: Entity | null;
}
export function PolygonEditor({entity}: EntityEditorProps) {

    const subj = entity?.polygon;

    console.log(subj);

    const geom = subj && geomProperties.map(prop => 
        <PropertyField subject={subj} 
            key={prop.name} 
            property={prop} />);

    const appearance = subj && appearanceProps.map(prop => 
        <PropertyField subject={subj} 
            key={prop.name} 
            property={prop} />);

    const extra = subj && extraProps.map(prop => 
        <PropertyField subject={subj} 
            key={prop.name} 
            property={prop} />);

    return (
        <div id={'polygon-editor'}>
            <h3>Polygon Editor</h3>
            <Tabs tabNames={['Appearance', 'Geometry', 'Extra']}>
                <>
                {appearance}
                </>
                <>
                {geom}
                </>
                <>
                {extra}
                </>
            </Tabs>

        </div>
    );

}
