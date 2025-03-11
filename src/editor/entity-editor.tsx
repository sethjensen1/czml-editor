import './entity-editor.css';

import { Entity } from "cesium";

import { FeatureEditor } from "./feature-editor";
import { DescriptionFld } from "./fields/description-fld";

import { polygonMetaData } from "./meta/polygon-meta";
import { billboardMetaData } from "./meta/billboard-meta";
import { EntityData } from './fields/entity-data';
import { useCallback, useState } from 'preact/hooks';
import { InputField } from './fields/input-fld';
import { PositionEditor } from './position-editor';

export type EntityEditorProps = {
    entity: Entity | null;
    onChange?: (entity: Entity) => void;
}
export function EntytyEditor({entity, onChange}: EntityEditorProps) {

    const [showData, setShowData] = useState<boolean>(false);
    const handleNameInput = useCallback((value: string) => {
        if (entity) {
            entity.name = value;
            onChange && onChange(entity);
        }
    }, [entity, onChange]);

    const label = entity?.label;
    const billboard = entity?.billboard;

    // const path = entity?.path;
    const point = entity?.point;
    const polyline = entity?.polyline;
    const tileset = entity?.tileset;
    const model = entity?.model;

    const polygon = entity?.polygon;
    
    if (!entity) {
        return null;
    }
    return (
        <div id={'entity-editor'}>
            <h3>Selected Entity</h3>
            
            <PositionEditor key={`${entity.id}.position`} entity={entity} />

            <InputField label={'Entity name'} key={`${entity.id}.name`} value={entity.name} 
                onChange={handleNameInput} />
            
            <DescriptionFld entity={entity} />
            
            <EntityData entity={entity} {...{showData, setShowData}} />

            <h4>Styling properties</h4>

            {billboard !== undefined && <FeatureEditor 
                entity={entity} metadata={billboardMetaData}/>}
            
            {polygon !== undefined && <FeatureEditor 
                entity={entity} metadata={polygonMetaData}/>}

        </div>
    );
}
