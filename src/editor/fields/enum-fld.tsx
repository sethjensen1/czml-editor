import cls from "../../misc/cls";
import "./enum-fld.css";

export type EnumFieldProps = {
    label?: string;
    enumObj?: any;
    ignore?: string[];
    value?: string;
    onChange?: (value: number) => void;
}
export function EnumField({label, enumObj, ignore, value, onChange}: EnumFieldProps) {

    const options = Object.entries(enumObj || {})
        .filter(([key]) => !ignore?.includes(key))
        .map(([key, val]) => {
            return {
                val,
                key,
                selected: value === val};
        });

    const $options = options.map(opt => {
        const key = `${opt.val}-${opt.key}`;
        const clazz = cls('enum-fld-option', opt.selected && 'selected');
        return <div class={clazz} key={key} 
            onClick={() => {onChange && onChange(opt.val as number)}}>
            {keyToName(opt.key)}

            <span class={cls('status', opt.selected && 'selected')}></span>
        </div>;
    });

    const clazz = cls('input-container', 'enum-fld', value === undefined && 'val-undefined');
    return <div class={clazz}>
        {label && <label class="label">{label}</label>}
        <div class={'enum-fld-options'}>
        { $options }
        </div>
        <div class="underline"></div>
    </div>
}

function keyToName(str: string) {
    return str.split('_')
        .map(s => s.toLowerCase())
        .filter(s => !!s)
        .join(' ');
}