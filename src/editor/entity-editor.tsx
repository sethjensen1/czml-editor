import { ConstantProperty, Entity, Property as CesiumProperty } from "cesium";

import { polygonMetaData } from "./meta/polygon-meta";
import { FeatureEditor } from "./feature-editor";
import { DescriptionFld } from "./fields/description-fld";

import './entity-editor.css';

export type EntityEditorProps = {
    entity: Entity | null;
}
export function EntytyEditor({entity}: EntityEditorProps) {

    const property = entity?.description as CesiumProperty;
    const description = (property as ConstantProperty)?.valueOf();

    const billboard = entity?.billboard;
    const label = entity?.label;
    const model = entity?.model;
    // const path = entity?.path;
    const point = entity?.point;
    const polygon = entity?.polygon;
    const polyline = entity?.polyline;
    const tileset = entity?.tileset;

    if (!entity) {
        return null;
    }
    return (
        <div id={'entity-editor'}>
            <h3>Selected Entity</h3>
            <DescriptionFld entity={entity} />
            {polygon !== undefined && <FeatureEditor 
                entity={entity} metadata={polygonMetaData}/>}

        </div>
    );
}
