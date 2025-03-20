import { Cartesian3, Cartographic, Entity } from "cesium";
import { InputField } from "./input-fld";
import { useCallback } from "preact/hooks";

type PositionFldProps = {
    label?: string
    entity: Entity;
    value?: Cartesian3
    onChange?: (value: Cartesian3) => void;
}
export function PositionFld({entity, onChange}: PositionFldProps) {

    const prop = entity.position;
    const isConstant = prop && prop.isConstant;
    const val = isConstant && prop.getValue();
    const catographic = val ? Cartographic.fromCartesian(val) : undefined;

    const latitude = toDegrees(catographic?.latitude);
    const longitude = toDegrees(catographic?.longitude);
    const height = catographic?.height;

    const handleHeight = useCallback((newVal: string) => {
        const num = parseFloat(newVal);
        if (!isNaN(num) && latitude && longitude) {
            const newPosition = Cartesian3.fromDegrees(longitude, latitude, num);
            onChange && onChange(newPosition);
        }
    }, [latitude, longitude, onChange]);

    if (!latitude || !longitude) {
        return undefined;
    }

    return (
    <div class={'position-fld'}>
        <div class={'label'}>
            <span>Latitude</span>
            <span>Longitude</span>
            <span>Height(m)</span>
        </div>
        <div class={'value'}>
            <span>{`${latitude?.toFixed(6)}`}</span>
            <span>{`${longitude?.toFixed(6)}`}</span>
            <span>{`${height?.toFixed(3)}`}</span>
        </div>
        <InputField label={'height'} value={'' + height?.toFixed(3)} onChange={handleHeight} />
    </div>
    );
}


function toDegrees(val?: number) {
    return val !== undefined ? (val * 180 / Math.PI) : undefined;
}

