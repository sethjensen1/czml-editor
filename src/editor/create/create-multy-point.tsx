import { useCallback, useContext, useState } from "preact/hooks";
import { ViewerContext } from "../../app";
import { Entity } from "cesium";
import { EditorContext } from "../editor";

type CreateMultyPointFeatureProps = {
    type: 'polygon' | 'polyline';

    active: boolean;
    disabled?: boolean;
    setActiveType?: (subjectType: 'polygon' | 'polyline' | undefined) => void;
    onEntityCreated: (entity: Entity) => any;
}
export function CreateMultyPointFeature({type, onEntityCreated, disabled, setActiveType}: CreateMultyPointFeatureProps) {
    const viewer = useContext(ViewerContext);
    const geometryEditor = useContext(EditorContext).geometryEditor;

    const [creationMode, setCreationMode] = useState(false);

    const handleSave = useCallback(() => {
        if (geometryEditor) {
            const newEntity = geometryEditor.save();
            newEntity && onEntityCreated(newEntity);
            setCreationMode(false);
            setActiveType && setActiveType(undefined);
        }
    }, [geometryEditor, setCreationMode, onEntityCreated]);

    const handleCreate = useCallback(() => {
        if (viewer && geometryEditor) {
            const subjEntity = geometryEditor.newEntity(type);
            subjEntity && viewer.entities.add(subjEntity);
            setCreationMode(true);
            setActiveType && setActiveType(type);
        }
    }, [type, setCreationMode, setActiveType, viewer, geometryEditor]);

    const handleCancel = useCallback(() => {
        if (viewer && geometryEditor) {
            const subjEntity = geometryEditor.cancel();
            subjEntity && viewer.entities.remove(subjEntity);
        }
        setCreationMode(false);
        setActiveType && setActiveType(undefined);
    }, [setCreationMode, setActiveType, viewer, geometryEditor]);

    return (
        <div class={`create-${type}`}>
            { !creationMode && <button disabled={disabled === true} 
                onClick={handleCreate}>Create {type === 'polygon' ? 'Polygon' : 'Polyline'}</button> }
            { creationMode && <button onClick={handleSave}>Save</button>}
            { creationMode && <button onClick={handleCancel}>Cancel</button>}
        </div>
    );
}

type CreatePolygonProps = {
    active: boolean;
    disabled?: boolean;
    setActiveType?: (subjectType: 'polygon' | undefined) => void;
    onEntityCreated: (entity: Entity) => any;
}
export function CreatePolygon({onEntityCreated, disabled, setActiveType}: CreatePolygonProps) {
    const viewer = useContext(ViewerContext);
    const geometryEditor = useContext(EditorContext).geometryEditor;

    const [creationMode, setCreationMode] = useState(false);

    const handleSave = useCallback(() => {
        if (geometryEditor) {
            const newEntity = geometryEditor.save();
            newEntity && onEntityCreated(newEntity);
            setCreationMode(false);
            setActiveType && setActiveType(undefined);
        }
    }, [geometryEditor, setCreationMode, onEntityCreated]);

    const handleCreate = useCallback(() => {
        if (viewer && geometryEditor) {
            const subjEntity = geometryEditor.newEntity('polygon');
            subjEntity && viewer.entities.add(subjEntity);
            setCreationMode(true);
            setActiveType && setActiveType('polygon');
        }
    }, [setCreationMode, setActiveType, viewer, geometryEditor]);

    const handleCancel = useCallback(() => {
        if (viewer && geometryEditor) {
            const subjEntity = geometryEditor.cancel();
            subjEntity && viewer.entities.remove(subjEntity);
        }
        setCreationMode(false);
        setActiveType && setActiveType(undefined);
    }, [setCreationMode, setActiveType, viewer, geometryEditor]);

    return (
        <div class={'create-polygon'}>
            { !creationMode && <button disabled={disabled === true} 
                onClick={handleCreate}>Create Polygon</button> }
            { creationMode && <button onClick={handleSave}>Save</button>}
            { creationMode && <button onClick={handleCancel}>Cancel</button>}
        </div>
    );
}