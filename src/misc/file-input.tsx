import { useCallback, useRef } from "preact/hooks";

export type FileInputProps = {
    onFile?: (file: File) => void;
}
export function FileInput({onFile}: FileInputProps) {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback(() => {
        // @ts-ignore
        for (let f of inputRef.current?.files) {
            onFile && onFile(f);
        }
    }, [onFile, inputRef]);

    return (
        <>
            <button onClick={() => {inputRef.current?.click()}}>Load document</button>

            <input ref={inputRef} onChange={handleFileSelect}
                type="file" id="file" style={{display: 'none'}}
                multiple accept=".kml, .kmz, .json, .czml, .czmz, .geojson"></input>
        </>
    );
}