import { Cartesian3, ConstantProperty, Entity, HeadingPitchRoll, Matrix3, Matrix4, Quaternion, Transforms } from "cesium";
import { VectorField } from "./fields/vector-fld";
import { useCallback } from "preact/hooks";

type OrientationEditorProps = {
    entity: Entity;
    onChange?: (entity: Entity) => void;
}
export function OrientationEditor({entity, onChange}: OrientationEditorProps) {

    const orientationProperty = entity.orientation;

    const propVal = orientationProperty?.isConstant && orientationProperty.getValue();
    const position = entity.position?.isConstant && entity.position?.getValue();

    const valHpr = position && propVal && globalOrientationQuaternionToLocalHPR(position, propVal);

    const handleChange = useCallback((hpr: HeadingPitchRoll) => {
        if (position) {
            const globalQ = localHPRToGlobalOrientationQuaternion(position, hpr);

            if (orientationProperty) {
                if (orientationProperty.isConstant) {
                    (orientationProperty as ConstantProperty).setValue(globalQ);
                }
            }
            else {
                entity.orientation = new ConstantProperty(globalQ);
            }
        }

    }, [entity, position, orientationProperty, onChange]);

    if (!entity.model) {
        return;
    }

    return (
    <div>
        <h4>Orientation</h4>

        <VectorField targetClass={HeadingPitchRoll} size={3} inline={true} 
            componentNames={['heading', 'pitch', 'roll']} value={valHpr} onChange={handleChange} />
    </div>);
}

export function localHPRToGlobalOrientationQuaternion(position: Cartesian3, hpr: HeadingPitchRoll) {
    return Transforms.headingPitchRollQuaternion(position, hpr);
}

export function globalOrientationQuaternionToLocalHPR(position: Cartesian3, orientation: Quaternion) {
    const orientationAbs = Matrix3.fromQuaternion(orientation);

    const transform = Matrix4.fromRotationTranslation(
        orientationAbs,
        position);

    return Transforms.fixedFrameToHeadingPitchRoll(transform);
}