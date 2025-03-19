import { Resource } from "cesium";
import { InputField } from "./fields/input-fld";
import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { SharedResourcesContext } from "./editor";
import cls from "../misc/cls";

import "./icon-lib.css";
import { FileInput } from "../misc/elements/file-input";
import { blobToBase64 } from "../misc/file-to-base64";
import { DropZone } from "../misc/elements/drop-zone";

type IconLibProps = {
        value?: string | Resource;
        onChange?: (value: Resource) => void;
}
export function IconLib({value, onChange}: IconLibProps) {

    const {resources, setResources} = useContext(SharedResourcesContext);

    const handleUpload = useCallback((uploaded: string) => {
        const uploads = resources.uploads;

        if (!uploads.includes(uploaded)) {
            setResources({
                ...resources,
                uploads: [...uploads, uploaded]
            });
        }
    }, [resources, setResources]);

    const handleFileSelection = useCallback(async (file: File) => {
        const dataUrl = await blobToBase64(file);
        handleUpload(dataUrl);
    }, [handleUpload]);

    const [urlToLoad, setUrlToLoad] = useState<string>();
    const handleLoadFromUrl = useCallback(() => {
        urlToLoad && handleUpload(urlToLoad);
        setUrlToLoad(undefined);
    }, [urlToLoad, setUrlToLoad, handleUpload]);
    
    const url = (value instanceof Resource) ? value.url : value;

    const allResources = [...resources.datasourceIcons, ...resources.defaultIcons, ...resources.uploads];

    const $images = allResources.map(imgUrl => {
        const resource = new Resource(imgUrl);
        return <Icon key={imgUrl} 
            selected={imgUrl === url} 
            resource={resource}
            onClick={() => {onChange && onChange(imgUrl)}}
        />
    });

    return <div class={'icon-lib'}>
        <div class={'icon-lib-icons'}>
            {$images}
        </div>
        <DropZone className={'icon-drop-zone'} onFile={handleFileSelection}>
            <div>Drop image or click</div>
            <FileInput name={"Upload image"} accept={"image/*"} onFile={handleFileSelection} />
        </DropZone>
        <div style={{display: 'flex'}}>
            <button onClick={handleLoadFromUrl}>Load from URL</button>
            <InputField className={'wide'} label={'Load URL'} value={urlToLoad} 
                onChange={setUrlToLoad} />
        </div>
    </div>
}

type IconProps = {
    resource: Resource;
    selected?: boolean;
    onClick?: () => void;
}
function Icon({resource, selected, onClick}: IconProps) {
    const imgRef = useRef<HTMLImageElement>(null);

    const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.onload = () => {
                setDimensions([
                    imgRef.current?.naturalWidth || 0,
                    imgRef.current?.naturalHeight || 0
                ]);
            }
        }
    }, [imgRef, setDimensions]);

    const [w, h] = dimensions;

    return (
        <div class={'icon-lib-icon-component'} onClick={onClick}>
            <div class={cls('icon-lib-icon', selected && 'selected')}>
                <img ref={imgRef} src={resource.url}></img>
            </div>
            <div>
                <span>{w}</span>
                <span>x</span>
                <span>{h}</span>
            </div>
        </div>
    )
}