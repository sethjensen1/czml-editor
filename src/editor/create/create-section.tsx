import { Section } from "../../misc/elements/section";

import { Entity } from "cesium";
import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { CreatePolygon } from "./create-polygon";
import { CreateBillboard } from "./create-billboard";
import { EditorContext } from "../editor";
import { CreateEntityInputMode } from "../../geometry-editor/input-new-entity";
import { ViewerContext } from "../../app";


type GeometryEditorMode = 'polygon' | 'polyline'
type CreateSectionMode = CreateEntityInputMode | undefined | GeometryEditorMode;

type CreateEntitySectionProps = {
    onEntityCreated: (entity: Entity) => any;
}
export function CreateEntitySection({onEntityCreated}: CreateEntitySectionProps) {

    const [activeType, setActiveType] = useState<CreateSectionMode>();

    const clickCreateController = useContext(EditorContext).clickCreateController;
    const viewer = useContext(ViewerContext);

    const handleEntityCreatedByClickRef = useRef((_e: Entity) => {});

    const handleActiveTypeSet = useCallback((aType: CreateSectionMode) => {
        setActiveType(aType);
        if (!clickCreateController) {
            return;
        }

        if (aType === undefined || Object.values(CreateEntityInputMode).includes(aType)) {
            const supportedType = aType === undefined ? null : aType as CreateEntityInputMode;
            clickCreateController.inputMode = supportedType;

            if (supportedType !== null) {
                clickCreateController.subscribeToEvents();
            }
            else {
                clickCreateController.subscribeToEvents();
            }
        }
    }, [clickCreateController, setActiveType]);

    handleEntityCreatedByClickRef.current = useCallback((entity: Entity) => {
        setActiveType(undefined);

        if (clickCreateController) {
            clickCreateController.inputMode = null;
            clickCreateController.unSubscribeToEvents();
        }
        
        console.log('New entity from click-create controller', entity);

        if (viewer) {
            viewer.entities.add(entity);
        }

        onEntityCreated(entity);
    }, [clickCreateController, viewer, setActiveType, onEntityCreated]);

    useEffect(() => {
        if (clickCreateController) {
            const handler = handleEntityCreatedByClickRef.current;
            clickCreateController.newEntityEvent.addEventListener(handler);

            return () => {
                clickCreateController.newEntityEvent.removeEventListener(handler);
            };
        }
    }, [clickCreateController, handleEntityCreatedByClickRef]);

    /* <Section id={'create-entity'} className={'create-section'} header={'Create entities'}> */
    /* </Section> */

    const billboardActive = activeType === CreateEntityInputMode.billboard;
    const polygonActive = activeType === 'polygon';

    const allEnabled = activeType === undefined;
    const billboardDisabled = !allEnabled && !billboardActive;
    const polygonDisabled = !allEnabled  && !polygonActive;

    return (
        <div class={'section create-section'}>
            <h3><span>Create entities</span></h3>
            <CreateBillboard active={billboardActive}
                disabled={billboardDisabled} setActiveType={handleActiveTypeSet} />
            <CreatePolygon active={polygonActive} 
                disabled={polygonDisabled} setActiveType={handleActiveTypeSet} {...{onEntityCreated}} />
        </div>
    );
}

