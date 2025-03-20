import { Entity } from "cesium";
import { types } from "../meta/meta";
import { useCallback, useRef } from "preact/hooks";

import cls from "../../misc/cls";
import "./type-icon.css";
import "./entity-list-elem.css";

import billboardSvg from "../../assets/billboard.svg";
import labelSvg from "../../assets/label.svg";
import polygonSvg from "../../assets/polygon.svg";
import polylineSvg from "../../assets/polyline.svg";
import folderSvg from "../../assets/folder.svg";

const typeIcons = {
    billboard: billboardSvg,
    label: labelSvg,
    polygon: polygonSvg,
    polyline: polylineSvg,
    folder: folderSvg,
}

type EntityListElementProps = {
    entity: Entity;
    entities: Entity[];
    selectEntity?: (entity: Entity) => void;
    selectedEntity: Entity | null;
    typeStatistics: {[type: string]: number}
}
export function EntityListElement({entity, selectedEntity, entities, typeStatistics, selectEntity}: EntityListElementProps) {

    const divRef = useRef<HTMLDivElement>(null);
    
    const type = types.find(tname => (entity as any)[tname] !== undefined);
    const isFolder = type === undefined && entities.some(pe => pe.parent?.id === entity.id);
    
    const typeCount = type !== undefined ? (typeStatistics)[type] : 0;
    const title = entity.name || `${type} ${typeCount}`;
    
    const selected = selectedEntity === entity;
    
    const handleClick = useCallback(() => {
        selectEntity && !isFolder && selectEntity(entity);
    }, [entity, selectEntity, isFolder]);
    

    if (selected && divRef.current) {
        divRef.current.scrollIntoView({block: 'nearest'});
    }

    return (
        <div key={entity.id} ref={divRef}
            class={cls('entity', selected && 'selected')}
            onClick={handleClick}>
    
            <TypeIcon type={isFolder ? 'folder' : type} />
    
            <span>&nbsp;</span>
            
            <span class={'entity-title'}>
            {title}
            </span> 
        </div>
    );
}

type TypeIconProps = {
    type?: string;
}
function TypeIcon({type}: TypeIconProps) {

    const icon = type && typeIcons[type as keyof typeof typeIcons];

    return <span class={'entity-type'}>
        <img alt={type} src={icon} />
    </span> 
}
