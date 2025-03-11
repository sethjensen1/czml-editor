import { JSX } from "preact";
import cls from "./cls";
import Switch from "./switch";

import "./labled-switch.css";

type LabledSwitchProps = {
    label: string | JSX.Element;
    checked?: boolean; 
    onChange?: (val: boolean) => void;
    className?: string;
}
export function LabledSwitch({label, checked, onChange, className}: LabledSwitchProps) {
    return (
        <div class={cls('labled-switch', className)}>
            <label>{label}</label>
            <Switch checked={!!checked} 
                onChange={() => {onChange && onChange(!checked)}} />
        </div>
    )
}