import './entity-editor.css';

import { ConstantProperty, Entity } from "cesium";

import { FeatureEditor } from "./feature-editor";
import { DescriptionFld } from "./fields/description-fld";

import { polygonMetaData } from "./meta/polygon-meta";
import { billboardMetaData } from "./meta/billboard-meta";
import { EntityData } from './fields/entity-data';
import { useCallback, useState } from 'preact/hooks';
import { InputField } from './fields/input-fld';
import { PositionEditor } from './position-editor';
import { labelMetadata } from './meta/label-meta';
import { LabledSwitch } from '../misc/elements/labled-switch';

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

    const [showLabel, setShowLabel] = useState<boolean>(entity?.label?.show?.getValue());
    const handleShowLabelSwitch = useCallback((show: boolean) => {
        if (entity && entity.label) {
            const prop = entity.label.show;
            
            if (prop && prop.isConstant) {
                (prop as ConstantProperty).setValue(show);
            }
            else if (prop === undefined) {
                entity.label.show = new ConstantProperty(show);
            }
            else {
                return;
            }

            setShowLabel(show);
            onChange && onChange(entity);
        }
    }, [entity, onChange, setShowLabel]);

    const billboard = entity?.billboard;

    // const path = entity?.path;
    const point = entity?.point;
    const polyline = entity?.polyline;
    const tileset = entity?.tileset;
    const model = entity?.model;

    const polygon = entity?.polygon;

    const applicableMeta = [
        billboard && billboardMetaData, 
        polygon && polygonMetaData, 
        showLabel && labelMetadata
    ].filter(m => !!m);
    
    if (!entity) {
        return null;
    }
    return (
        <div id={'entity-editor'}>
            <h3>Selected Entity</h3>
            
            <PositionEditor key={`${entity.id}.position`} entity={entity} />

            <InputField label={'Entity name'} key={`${entity.id}.name`} value={entity.name} 
                onChange={handleNameInput} />
            
            <LabledSwitch label={'Show label'} checked={showLabel} onChange={handleShowLabelSwitch} />
            
            <DescriptionFld entity={entity} />
            
            <EntityData entity={entity} {...{showData, setShowData}} />

            <h4>Styling properties</h4>

            <FeatureEditor entity={entity} metadata={applicableMeta}/>

        </div>
    );
}
