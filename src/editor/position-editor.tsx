import { Cartesian3, ConstantPositionProperty, Entity } from "cesium"
import { LabledSwitch } from "../misc/elements/labled-switch"
import { useCallback, useContext, useState } from "preact/hooks"
import { EditorContext } from "./editor"
import { attachController } from "../geometry-editor/position-drag-editor"
import { PositionFld } from "./fields/position-fld"
import { ViewerContext } from "../app"

type PositionEditorProps = {
    entity: Entity
}
export function PositionEditor({entity}: PositionEditorProps) {

    const viewer = useContext(ViewerContext);

    const handleFlyTo = useCallback(() => {
        entity && viewer?.flyTo(entity, {duration: 1});
    }, [viewer, entity]);

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

    const handleFldChange = useCallback((val: Cartesian3) => {
        if(entity.position && entity.position.isConstant) {
            (entity.position as ConstantPositionProperty).setValue(val);
        }
    }, [entity])

    return (
        <div class={'entity-position'}>
            <h4><span>Position</span> <button onClick={handleFlyTo} class={'fly-to-button'}>Flyto</button></h4>
            <PositionFld entity={entity} onChange={handleFldChange} />
            <LabledSwitch checked={active} onChange={handleActiveChange}
                label={'Drag to move'}></LabledSwitch>
        </div>
    );
}