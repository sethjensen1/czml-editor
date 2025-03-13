import { JSX } from "preact";
import cls from "../cls";

import "./drop-zone.css"
import { useEffect, useRef, useState } from "preact/hooks";

type DropZoneProps = {
    accept?: (file: File) => boolean;
    className?: string;
    children?: JSX.Element | JSX.Element[];
    onFile?: (file: File) => void;
}
export function DropZone({accept, className, children, onFile}: DropZoneProps) {

    const dropZoneRef = useRef<HTMLDivElement>(null);
    const [dragover, setDragover] = useState<boolean>(false);
    const [accepted, setAssepted] = useState<boolean>(true);

    useEffect(() => {
        const dropzone = dropZoneRef.current;
        if (!dropzone) {
            return;
        }

        const dragenter = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer && e.dataTransfer.files && accept) {
                setAssepted(Array.from(e.dataTransfer.files).every(file => accept(file)));
            }
            setDragover(true);
        };

        const dragleave = (e: DragEvent) => {
            e.preventDefault();
            setDragover(false);
        };

        const dragover = (e: DragEvent) => {
            e.preventDefault();
            setDragover(true);
        };

        const dragdrop = (e: DragEvent) => {
            e.preventDefault();
            setDragover(false);
            if(e.dataTransfer && e.dataTransfer.files) {
                for (let f of e.dataTransfer.files) {
                    onFile && onFile(f);
                }
            }
        };

        dropzone.addEventListener("dragenter", dragenter);
        dropzone.addEventListener("dragleave", dragleave);
        dropzone.addEventListener("dragover", dragover);
        dropzone.addEventListener("drop", dragdrop);

        return () => {
            dropzone.removeEventListener("dragenter", dragenter);
            dropzone.removeEventListener("dragleave", dragleave);
            dropzone.removeEventListener("dragover", dragover);
            dropzone.removeEventListener("drop", dragdrop);
        }

    }, [onFile, accept, setDragover, dropZoneRef]);

    const classString = cls('drop-zone', dragover && 'drag-over', !accepted && 'reject', className)
    return (
    <div ref={dropZoneRef} class={classString}>
        { children }
    </div>
    )
}
