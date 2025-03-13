import { Entity } from "cesium"
import Switch from "../../misc/elements/switch";

import "./entity-data.css";
import { LabledSwitch } from "../../misc/elements/labled-switch";
import cls from "../../misc/cls";

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
    <div className={cls('entity-data')}>
        <h4>Data</h4>
        <div class={cls('data-empty-warning', dataProperties && 'hidden')}>Data is empty</div>
        <div class={cls('data-display', !dataProperties && 'hidden')}>
            <LabledSwitch 
                label={'Show data'} 
                className={'show-entity-data'}
                checked={showData} 
                onChange={setShowData}
            />
            <table class={'data-properties-table'}>
                <tbody>
                    {$properties}
                </tbody>
            </table>
        </div>
    </div>)
}