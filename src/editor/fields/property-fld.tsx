import { PropertyMeta } from '../entity-editor';
import camelCaseToTitle from '../../misc/cammelToTitle';
import { InputField } from './input-fld';
import { BooleanField } from './boolean-fld';
import { ColorField } from './color-fld';
import { Property as CesiumProperty, ConstantProperty } from "cesium";
import { BillboardGraphics, LabelGraphics, PolygonGraphics, PolylineGraphics } from 'cesium';
import { useCallback } from 'preact/hooks';

export type PropertyFieldProps = {
    subject: PolygonGraphics | PolylineGraphics | BillboardGraphics | LabelGraphics
    property: PropertyMeta;
    onChange?: (value: any) => void;
}
export function PropertyField({subject, property: prop, onChange}: PropertyFieldProps) {

    const { name, type, title } = prop;
    const label = title || camelCaseToTitle(name);

    const property = (subject as any)[prop.name] as CesiumProperty;
    const interpolated = property !== undefined && !property.isConstant;

    const value = (property as ConstantProperty)?.valueOf();

    const changeHandler = useCallback((val: any) => {
        if (property !== undefined && (property as any).setValue) {
            (property as ConstantProperty).setValue(val);
        }
        else {
            (subject as any)[prop.name] = val;
        }
    }, [subject, property]);

    if (interpolated) {
        return <div>
        Cant't edit "{prop.name}" because its values are interpolated
        </div>
    }
    
    if (type === 'number') {
        return <InputField label={label} value={value} onChange={changeHandler}/>;
    } else if (type === 'boolean') {
        return <BooleanField label={label} value={value} onChange={changeHandler}/>;
    } else if (type === 'color') {
        return <ColorField label={label} value={value} onChange={changeHandler}/>;
    } else if (type === 'material') {
        const val = value?.color?.valueOf();
        return <ColorField label={label} value={val} onChange={changeHandler}/>;
    }

    return <InputField label={label} value={value} onChange={changeHandler}/>;

}