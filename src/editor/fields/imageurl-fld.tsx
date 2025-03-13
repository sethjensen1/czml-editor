import { Resource } from "cesium";
import "./imageurl-fld.css"
import { useState } from "preact/hooks";
import { ModalPane } from "../../misc/elements/modal-pane";
import { IconLib } from "../icon-lib";


type ImageUrlFieldProps = {
    label?: string;
    value?: string | Resource;
    onChange?: (value: Resource) => void;
}
export function ImageUrlField({label, value, onChange}: ImageUrlFieldProps) {

    const [iconLibOpen, setIconLibOpen] = useState<boolean>(false);

    const url = (value instanceof Resource) ? value.url : value;

    return <div class={'imgurl-fld-container'}>
        <div class={'imgurl-fld'}>
            <div class={'label'}>{label || 'Billbord image'}</div>
            
            <img src={url}></img>
            <button class={'size-s'} onClick={() => {setIconLibOpen(true);}}>Change</button>
        </div>

        <ModalPane visible={iconLibOpen}>
            <div><button onClick={()=>{setIconLibOpen(false);}}>Close</button></div>

            <IconLib {...{value, onChange}} />

        </ModalPane>

    </div>
}