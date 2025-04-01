import './entity-editor.css';

import { Entity} from "cesium";

import { FeatureEditor } from "./feature-editor";
import { DescriptionFld } from "./fields/description-fld";

import { polygonMetaData } from "./meta/polygon-meta";
import { billboardMetaData } from "./meta/billboard-meta";
import { EntityData } from './fields/entity-data';
import { useCallback, useState } from 'preact/hooks';
import { InputField } from './fields/input-fld';
import { PositionEditor } from './position-editor';
import { labelMetadata } from './meta/label-meta';
import { polylineMetaData } from './meta/polyline-meta';
import { EntityLabel } from './entity-label';
import { EditMultipointGeometry } from './multipoint-geometry';
import { modelMetaData } from './meta/model-meta';
import { OrientationEditor } from './orientation-editor';
import { Section } from '../misc/elements/section';
import { Subsection } from '../misc/elements/subsection';
import { PropertyMeta } from './meta/meta';

const changes = {
    entityId: "",
    style: {}
};

export type EntityEditorProps = {
    entity: Entity | null;
    onChange?: (entity: Entity) => void;
}
export function EntytyEditor({entity, onChange}: EntityEditorProps) {

    const [showData, setShowData] = useState<boolean>(false);
    const [_name, forceNameUpdate] = useState<string | undefined>(entity?.name);

    const handleNameInput = useCallback((value: string) => {
        if (entity) {
            entity.name = value;
            onChange && onChange(entity);
            forceNameUpdate(value);
        }
    }, [entity, onChange, forceNameUpdate]);

    const handleEntityChange = useCallback((val: any, feature?: string, property?: PropertyMeta) => {
        if (entity) {
            if (changes.entityId !== entity?.id) {
                changes.entityId = entity.id;
                changes.style = {};
            }

            changes.style = {
                ...changes.style,
                [`${feature}.${property?.name}`]: val
            };
        }
    }, [entity]);

    const handleStyleCopy = useCallback(() => {
        const copy = Object.fromEntries(
            Object.entries(changes.style)
                .map(([key, val]) => [key, clone(val)])
        );
        
        console.log(copy);
    }, []);

    const billboard = entity?.billboard;
    const showLabel = entity?.label?.show?.getValue();

    // TODO: add metadata
    // const point = entity?.point;
    // const path = entity?.path;
    // const tileset = entity?.tileset;
    const model = entity?.model;
    
    const polyline = entity?.polyline;
    const polygon = entity?.polygon;

    const isMultiPoint = polygon || polyline ;

    const applicableMeta = [
        billboard && billboardMetaData,
        polyline && polylineMetaData,
        polygon && polygonMetaData, 
        model && modelMetaData,
        showLabel && labelMetadata
    ].filter(m => !!m);
    
    if (!entity) {
        return null;
    }
    return (
        <Section id={'entity-editor'} header={'Selected Entity'} >
            <Subsection key={entity.id + '.subsection-common'}>
                <InputField label={'Entity name'} key={`${entity.id}.name`} value={entity.name} 
                    onChange={handleNameInput} />
                
                <PositionEditor key={`${entity.id}.position`} entity={entity} />

                {isMultiPoint && <EditMultipointGeometry entity={entity} onChange={onChange} />}

                <OrientationEditor entity={entity} onChange={onChange} />

                <EntityLabel entity={entity} onChange={onChange} />
                
                <DescriptionFld entity={entity} />
                
                <EntityData entity={entity} {...{showData, setShowData}} />
            </Subsection>

            <Subsection key={entity.id + '.subsection-styling'}>
                <h4>Styling properties</h4>
                <button onClick={handleStyleCopy} class={'size-s'}>Copy style changes</button>
                <FeatureEditor entity={entity} 
                    metadata={applicableMeta} onChange={handleEntityChange}/>
            </Subsection>

        </Section>
    );
}

function clone(val: any) {
    if (!val) {
        return val;
    }

    // Most of the cesium property value objects should have clone method
    if (val['clone'] && typeof val['clone'] === 'function') {
       return val.clone();
    }

    if (Array.isArray(val)) {
        return [...val];
    }

    return val;
}
