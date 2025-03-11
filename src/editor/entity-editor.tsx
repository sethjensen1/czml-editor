import './entity-editor.css';

import { Entity } from "cesium";

import { FeatureEditor } from "./feature-editor";
import { DescriptionFld } from "./fields/description-fld";

import { polygonMetaData } from "./meta/polygon-meta";
import { billboardMetaData } from "./meta/billboard-meta";
import { EntityData } from './fields/entity-data';
import { useState } from 'preact/hooks';

export type EntityEditorProps = {
    entity: Entity | null;
}
export function EntytyEditor({entity}: EntityEditorProps) {

    const [showData, setShowData] = useState<boolean>(false);

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
            <DescriptionFld entity={entity} />
            <EntityData entity={entity} {...{showData, setShowData}} />
            {billboard !== undefined && <FeatureEditor 
                entity={entity} metadata={billboardMetaData}/>}
            {polygon !== undefined && <FeatureEditor 
                entity={entity} metadata={polygonMetaData}/>}

        </div>
    );
}
