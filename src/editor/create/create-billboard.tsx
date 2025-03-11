import { useCallback, useContext } from "preact/hooks";
import { EditorContext } from "../editor";
import { CreateEntityInputMode } from "../../geometry-editor/input-new-entity";

type CreateBillboardProps = {
    active: boolean;
    enabled: boolean;
    setActiveType: (creationType: CreateEntityInputMode | undefined) => void;
}
export function CreateBillboard({active, enabled, setActiveType}: CreateBillboardProps) {

    // TODO: add controls for editing clickCreateController billboard options
    // const clickCreateController = useContext(EditorContext).clickCreateController;
    
    const handleCreate = useCallback(() => {
        setActiveType(CreateEntityInputMode.billboard);
    }, [setActiveType]);

    const handleCancel = useCallback(() => {
        setActiveType(undefined);
    }, [setActiveType]);

    return (
        <div className={'create-billboard'}>
            { !active && <button disabled={enabled === false} 
                onClick={handleCreate}>Create Billboard</button> }
            { active && <button onClick={handleCancel}>Cancel</button>}
        </div>
    );
}