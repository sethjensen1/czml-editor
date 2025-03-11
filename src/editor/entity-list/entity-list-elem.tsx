import { Entity } from "cesium";
import { types } from "../meta/meta";
import { useCallback, useRef } from "preact/hooks";

import cls from "../../misc/cls";

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
    
            <span class={'entity-type'}>
            {`${isFolder ? 'folder' : type}`}
            </span> 
    
            <span>&nbsp;</span>
            
            <span class={'entity-title'}>
            {title}
            </span> 
        </div>
    );
}
