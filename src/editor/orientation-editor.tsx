import { ConstantProperty, Entity, Quaternion } from "cesium";
import { VectorField } from "./fields/vector-fld";
import { useCallback } from "preact/hooks";

type OrientationEditorProps = {
    entity: Entity;
    onChange?: (entity: Entity) => void;
}
export function OrientationEditor({entity, onChange}: OrientationEditorProps) {

    const orientationProperty = entity.orientation;

    const propVal = orientationProperty?.isConstant && orientationProperty.getValue();

    const handleChange = useCallback((v: Quaternion) => {

        if (orientationProperty) {
            if (orientationProperty.isConstant) {
                (orientationProperty as ConstantProperty).setValue(v);
            }
        }
        else {
            entity.orientation = new ConstantProperty(v);
        }

    }, [entity, orientationProperty, onChange]);

    return <div>
        <h4>Orientation</h4>

        <VectorField targetClass={Quaternion} size={4} value={propVal} onChange={handleChange} />
    </div>
}