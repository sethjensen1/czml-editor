import { Entity } from "cesium";

type OrientationEditorProps = {
    entity: Entity;
    onChange?: (entity: Entity) => void;
}
export function OrientationEditor({entity, onChange}: OrientationEditorProps) {

    const orientationProperty = entity.orientation;
    
    const orientation = orientationProperty?.isConstant && orientationProperty.getValue();

    console.log('orientation', orientation);

    return <div>
        TODO: Add orientation editing
    </div>
}