import { useCallback } from 'preact/hooks';
import cls from '../../misc/cls';
import './input-fld.css';

var idCounter = 0;

export type InputFieldProps = {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
}
export function InputField({label, value, onChange}: InputFieldProps) {
    const id = 'input-' + (idCounter++);

    const inputHandler = useCallback((e: Event) => {
        onChange && onChange((e.target as HTMLInputElement).value);
    }, [onChange]);

    return (
        <div class="input-container">
            <input type={'text'} class={cls('input', (value !== undefined) && 'not-empty')} id={id} 
                value={value}
                onChange={inputHandler}></input>
            {label && <label for={id} class="label">{label}</label>}
            <div class="underline"></div>
        </div>
    );
}