import { Entity } from "cesium"
import Switch from "../../misc/switch";

import "./entity-data.css";
import { LabledSwitch } from "../../misc/labled-switch";

type EntityData = {
    entity: Entity;
    showData?: boolean;
    setShowData?: (show: boolean) => void;
}
export function EntityData({entity, showData, setShowData}: EntityData) {
    
    const data = entity.properties;

    const dataProperties = data?.getValue();

    const $properties = showData && data?.propertyNames.map(pName => {
        return <tr key={pName}>
            <td>{pName}</td>
            <td>{(dataProperties as any)[pName]}</td>
        </tr>
    });
    
    return (
    <div className={'entity-data'}>
        <h4>Data</h4>
        <LabledSwitch 
            label={'Show data'} 
            className={'show-entity-data'}
            checked={showData} 
            onChange={setShowData}
        />
        <table>
            <tbody>
                {$properties}
            </tbody>
        </table>
    </div>)
}