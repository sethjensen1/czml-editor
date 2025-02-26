import { useCallback } from 'preact/hooks';
import cls from '../../misc/cls';
import './input-fld.css';
import Switch from '../../misc/switch';

import './boolean-fld.css';

var idCounter = 0;

export type BooleanFieldProps = {
    label?: string;
    value?: boolean;
    onChange?: (value: boolean | undefined) => void;
}
export function BooleanField({label, value, onChange}: BooleanFieldProps) {
    const id = 'input-b' + (idCounter++);

    const inputHandler = useCallback((e: Event) => {
        onChange && onChange((e.target as HTMLInputElement).checked);
    }, [onChange]);

    return (
        <div class="input-container boolean-fld">
            {label && <label for={id} class="label">{label}</label>}
            <Switch checked={value || false} onChange={inputHandler}/>
            <div class="underline"></div>
        </div>
    );
}