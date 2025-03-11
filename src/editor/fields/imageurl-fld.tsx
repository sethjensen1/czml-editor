import { Resource } from "cesium";
import "./imageurl-fld.css"
import { InputField } from "./input-fld";
import { useState } from "preact/hooks";


type Dimensions = {
    width: number;
    height: number;
};

type ImageUrlFieldProps = {
    label?: string;
    value?: string | Resource;
    onChange?: (value: Resource) => void;
}
export function ImageUrlField({value, label, onChange}: ImageUrlFieldProps) {

    const [dimensions, setDimensions] = useState<Dimensions>();

    const url = (value instanceof Resource) ? value.url : value;
    const resource = (value instanceof Resource) ? value : ( url && new Resource(url));

    const blob = (resource as Resource)?.isBlobUri;
    const data = (resource as Resource)?.isDataUri;
    const cors = (resource as Resource)?.isCrossOriginUrl;

    if (url) {
        const img = new Image();
        img.onload = () => {
            setDimensions({width: img.width, height: img.height});
        }
        img.src = url;
    }

    return <div class={'imgurl-fld'}>
        <img src={url}></img>

        <div><span>Dimensions: </span><span>{dimensions?.width}x{dimensions?.height}</span></div>

        <div class={'percs'}> 
            { blob && <span>blob</span> }
            { data && <span>data</span> }
            { cors && <span>cors</span> }
        </div>
        
        <InputField label={label} value={url} 
            onChange={newUrl => onChange && onChange(new Resource(newUrl))} />
    </div>
}