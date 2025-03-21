import { useCallback } from "preact/hooks";
import { CreateEntityInputMode } from "../../geometry-editor/input-new-entity";

type CreateBillboardProps = {
    active: boolean;
    disabled: boolean;
    setActiveType: (creationType: CreateEntityInputMode | undefined) => void;
}
export function CreateBillboard({active, disabled, setActiveType}: CreateBillboardProps) {

    // TODO: add controls for editing clickCreateController billboard options
    // const clickCreateController = useContext(EditorContext).clickCreateController;
    
    const handleCreate = useCallback(() => {
        setActiveType(CreateEntityInputMode.billboard);
    }, [setActiveType]);

    const handleCancel = useCallback(() => {
        setActiveType(undefined);
    }, [setActiveType]);

    return (
        <>
            { active && <div>Click in a map view to create billboard</div>}
            { !active && <button disabled={disabled} 
                onClick={handleCreate}>Add Billboard</button> }
            { active && <button onClick={handleCancel}>Cancel</button>}
        </>
    );
}