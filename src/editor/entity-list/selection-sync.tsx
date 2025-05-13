import { CzmlDataSource, Entity } from "cesium";
import { useCallback, useContext, useEffect, useRef } from "preact/hooks";
import { ViewerContext } from "../../app";

type EntitySelectionSyncProps = {
    entity: Entity | null
    selectEntity?: (entity: Entity | null) => void;
};
export function EntitySelectionSync({entity, selectEntity}: EntitySelectionSyncProps) {
    const viewer = useContext(ViewerContext);

    const handlerRef = useRef((_selection: any) => {});

    // Save ref on handler, b.c. callback changes on each
    // entity, selectEntity update, which whould cause 
    // useEffect reapplication and adds new version of
    // callback on every update
    // Since we remove event listener, reapplication would also work
    // but this looks inefficient.
    handlerRef.current = useCallback(selection => {
        // Do not reset selection in editor on click outside
        if (selection && selection instanceof Entity) {
            const owner = selection.entityCollection?.owner;
            if (owner && owner instanceof CzmlDataSource && (owner as any).__ignore) {
                viewer && (viewer.selectedEntity = undefined);
                return;
            }

            const resetEmpty = (!entity && selection);
            if (resetEmpty || entity?.id !== selection?.id) {
                selectEntity && selectEntity(selection);
            }
        }
    }, [entity, selectEntity, viewer]);

    useEffect(() => {
        const handler = handlerRef.current;
        if (viewer && handler) {
            viewer.selectedEntityChanged.addEventListener(handler);
            return () => {
                viewer.selectedEntityChanged.removeEventListener(handler);
            }
        }
    }, [viewer, handlerRef]);

    useEffect(() => {
        if (viewer && entity instanceof Entity) {
            viewer.selectedEntity = entity;
        }
    }, [viewer, entity])

    return <></>
}