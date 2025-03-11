import { JSX } from "preact";
import cls from "./cls";

export type SectionProps = {
    header: string;
    id?: string;
    className?: string;
    children: (JSX.Element | boolean)[];
}
export function Section({header, id, className, children}: SectionProps) {

    return (
        <div id={id} class={cls('section', className)}>
            <h3><span>{header}</span></h3>
            {children}
        </div>
    );
}