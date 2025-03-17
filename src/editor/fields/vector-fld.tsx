import { useCallback, useState } from 'preact/hooks';
import cls from '../../misc/cls';
import './vector-fld.css';
import { InputField } from './input-fld';

const defaultComponentNames = ['x', 'y', 'z', 'w'];

export type VectorFieldProps = {
    label?: string;
    value?: any[];
    size?: number;
    targetClass?: any;
    componentNames?: string[];
    onChange?: (value: any) => void;
}
export function VectorField({label, value, size, targetClass, componentNames, onChange}: VectorFieldProps) {

    const vectorSize = value?.length || componentNames?.length || size || 3;
    const valueArray = Array.from({length: vectorSize}, (_v, i) => value?.[i] || null);

    const [scratchValues, setScratchValues] = useState<(string | number)[]>(valueArray);

    const inputHandler = useCallback((inx: number, val: string) => {
        
        const newArray = scratchValues.map((v, i) => i !== inx ? v : val);
        setScratchValues(newArray);

        const numArray = newArray.map(s => Number(s));
        const notNull = numArray.every(v => v && !isNaN(v));
        const newVal = notNull && (targetClass && new targetClass(...numArray) || numArray);
        
        onChange && onChange(notNull ? newVal : undefined);
        // if (newVal && onChange) {
        //     onChange(newVal);
        // }
    }, [scratchValues, targetClass, onChange]);

    const componentFields = scratchValues.map((componentVal, i) => {
        const componentName = componentNames?.[i] || defaultComponentNames[i];
        const undef = (componentVal === undefined || componentVal === null);
        const stringVal = undef ? '' : ('' + componentVal);

        return <InputField key={componentName} className={'component-fld'}
            value={stringVal} 
            label={componentName} 
            onChange={inputHandler.bind(undefined, i)} />
    });

    return (
        <div class={cls('input-container', 'vector-fld')}>
            <div>{label}</div>
            <div>
            {componentFields}
            </div>
        </div>
    );
}