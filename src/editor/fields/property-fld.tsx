import { PropertyMeta } from '../entity-editor';
import camelCaseToTitle from '../../misc/cammelToTitle';
import { InputField } from './input-fld';
import { BooleanField } from './boolean-fld';
import { ColorField } from './color-fld';

export type PropertyFieldProps = {
    value: any;
    property: PropertyMeta;
    onChange: (value: any) => void;
}
export function PropertyField({value, property, onChange}: PropertyFieldProps) {

    const { name, type, title } = property;
    const label = title || camelCaseToTitle(name);

    var fld = null;
    if (type === 'number') {
        fld = <InputField label={label} value={value} onChange={onChange}/>;
    } else if (type === 'boolean') {
        fld = <BooleanField label={label} value={value} onChange={onChange}/>;
    } else if (type === 'color') {
        fld = <ColorField label={label} value={value} onChange={onChange}/>;
    } else if (type === 'material') {
        const val = value.color.valueOf();
        fld = <ColorField label={label} value={val} onChange={onChange}/>;
    } else {
        fld = <InputField label={label} value={value} onChange={onChange}/>;
    }

    return fld;
}