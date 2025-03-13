import { JSX } from "preact";
import cls from "../cls";
import "./modal-pane.css"

type ModalPaneProps = {
    visible: boolean;
    children: JSX.Element | JSX.Element[];
    className?: string;
}
export function ModalPane({visible, children, className}: ModalPaneProps) {
    return (
    <div class={cls(className, 'modal', visible && 'visible')}>
        <div class={'content'}>
            {children}
        </div>
    </div>
    );
}