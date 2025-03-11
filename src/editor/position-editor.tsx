import { Entity } from "cesium"
import { LabledSwitch } from "../misc/labled-switch"
import { useCallback, useContext, useState } from "preact/hooks"
import { EditorContext } from "./editor"
import { attachController } from "../geometry-editor/position-drag-editor"

type PositionEditorProps = {
    entity: Entity
}
export function PositionEditor({entity}: PositionEditorProps) {

    const moveController = useContext(EditorContext).positionDragController;

    const [active, setActive] = useState<boolean>(false);

    const deActivate = useCallback(() => {
        setActive(false);

        if (moveController) {
            moveController.reset();
            moveController?.unBindScreenSpaceEvents();
            moveController?.enableDefaultControls();
        }
    }, [moveController, entity, setActive]);

    const activate = useCallback(() => {
        setActive(true);

        if (moveController) {
            attachController(moveController, entity, deActivate);
            moveController.bindScreenSpaceEvents();
        }
    }, [moveController, entity, deActivate]);
    

    const handleActiveChange = useCallback((val: boolean) => {
        if (moveController && entity) {
            val ? activate() : deActivate();
        }
    }, [activate, deActivate]);

    return (
        <div>
            <h4>Position</h4>
            <LabledSwitch checked={active} onChange={handleActiveChange}
                label={'Allow drag to move'}></LabledSwitch>
        </div>
    );
}