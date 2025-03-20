import { ComponentChildren } from "preact"
import cls from "../cls";

import "./subsection.css";

type SubsectionProps = {
    id?: string;
    className?: string;
    children: ComponentChildren
}

export function Subsection({id, className, children}: SubsectionProps) {
    return (
    <div id={id} class={cls('subsection', className)}>
        {children}
    </div>);
}