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
export function CreateMultyPointFeature({type, active, onEntityCreated, disabled, setActiveType}: CreateMultyPointFeatureProps) {
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
            { active && <div>
                Click in a 3d map view to add points to {type} geometry.
                {type === 'polygon' && <div> You need at least 3 points for polygon.</div>}
                {type === 'polyline' && <div> You need at least 2 points for polyline.</div>}
                </div>}
            { !creationMode && <button disabled={disabled === true} onClick={handleCreate}>
                Add {type === 'polygon' ? 'Polygon' : 'Polyline'} 
            </button> }
            { creationMode && <button onClick={handleSave}>Save</button>}
            { creationMode && <button onClick={handleCancel}>Cancel</button>}
        </div>
    );
}