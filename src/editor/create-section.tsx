import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { ViewerContext } from "../app";
import GeometryEditor from "../geometry-editor/geometry-editor";
import { Entity } from "cesium";

export type CreateEntitySectionProps = {
    onEntityCreated: (entity: Entity) => any;
}
export function CreateEntitySection({onEntityCreated}: CreateEntitySectionProps) {
    const viewer = useContext(ViewerContext);
    const geometryEditorRef = useRef<GeometryEditor>();

    const [creationMode, setCreationMode] = useState(false);

    useEffect(() => {
        if (viewer && !geometryEditorRef.current) {
            geometryEditorRef.current = new GeometryEditor(viewer);
        }
    }, [viewer, geometryEditorRef]);

    const handleSavePolygon = useCallback(() => {
        const geometryEditor = geometryEditorRef.current;
        if (geometryEditor) {
            const newEntity = geometryEditor.save();
            newEntity && onEntityCreated(newEntity);
            setCreationMode(false);
        }
    }, [geometryEditorRef, setCreationMode]);

    const handleCreatePolygon = useCallback(() => {
        const geometryEditor = geometryEditorRef.current;
        if (viewer && geometryEditor) {
            const subjEntity = geometryEditor.newEntity('polygon');
            subjEntity && viewer.entities.add(subjEntity);
            setCreationMode(true);
        }

    }, [setCreationMode, viewer, geometryEditorRef]);

    const handleCancel = useCallback(() => {
        const geometryEditor = geometryEditorRef.current;
        if (viewer && geometryEditor) {
            const subjEntity = geometryEditor.cancel();
            subjEntity && viewer.entities.remove(subjEntity);
        }
        setCreationMode(false);
    }, [setCreationMode, viewer, geometryEditorRef]);

    return (
        <div class={'section create-section'}>
            <h3>Create entities</h3>
            { !creationMode && <button onClick={handleCreatePolygon}>Create Polygon</button> }
            { creationMode && <button onClick={handleSavePolygon}>Save</button>}
            { creationMode && <button onClick={handleCancel}>Cancel</button>}
        </div>
    )
}