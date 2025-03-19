import { useCallback, useRef } from "preact/hooks";

export type FileInputProps = {
    name?: string;
    accept?: string;
    disabled?: boolean;
    onFile?: (file: File) => void;
}
export function FileInput({onFile, accept, name, disabled}: FileInputProps) {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback(() => {
        // @ts-ignore
        for (let f of inputRef.current?.files) {
            onFile && onFile(f);
        }
    }, [onFile, inputRef]);

    return (
        <>
            <button disabled={disabled} onClick={() => {inputRef.current?.click()}}>{name || 'Load'}</button>

            <input ref={inputRef} onChange={handleFileSelect}
                type="file" id="file" style={{display: 'none'}}
                multiple accept={accept}></input>
        </>
    );
}