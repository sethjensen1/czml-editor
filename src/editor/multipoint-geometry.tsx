import { Entity } from "cesium"
import { useCallback, useContext, useState } from "preact/hooks";
import { EditorContext } from "./editor";
import cls from "../misc/cls";

type EditMultipointGeometryProps = {
    entity: Entity;
    onChange?: (entity: Entity) => void;
}

export function EditMultipointGeometry({entity, onChange}: EditMultipointGeometryProps) {

    const [active, setActive] = useState<boolean>(false);

    const geometryEditor = useContext(EditorContext)?.geometryEditor;
    
    const editHandler = useCallback(() => {
        if (geometryEditor) {
            const type = entity.polygon ? 'polygon' : 'polyline';
            geometryEditor.editEntity(type, entity);
            setActive(true);
        }
    }, [entity, geometryEditor, setActive]);

    const cancelHandler = useCallback(() => {
        geometryEditor?.cancel();
        setActive(false);
    }, [geometryEditor, setActive]);

    const saveHandler = useCallback(() => {
        geometryEditor?.save();
        onChange && onChange(entity);
        setActive(false);
    }, [geometryEditor, setActive]);

    return <div class={cls('edit-geometry', 'button-size-s')}>
        {!active && <button onClick={editHandler}>Edit geometry</button>}
        {active && <button onClick={saveHandler}>Save</button>}
        {active && <button onClick={cancelHandler}>Cancel</button>}
    </div>
}