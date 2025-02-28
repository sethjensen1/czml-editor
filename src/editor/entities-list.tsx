import { Entity } from "cesium";
import cls from "../misc/cls";

import './entities-list.css';
    
export type EntitiesListProps = {
    entities: Entity[];
    entity: Entity | null;
    selectEntity?: (entity: Entity) => void;
}
export function EntitiesList({entities, entity, selectEntity}: EntitiesListProps) {

    const types = ['billboard', 'label', 'polyline', 'polygon', 'model'];
    const byTypeCounters = {};
    types.forEach(t => (byTypeCounters as any)[t] = 0);

    const $entities = entities.map(e => {
        const type = types.find(tname => (e as any)[tname] !== undefined);
        
        const isFolder = type === undefined && entities.some(pe => pe.parent?.id === e.id);

        if (type) {
            (byTypeCounters as any)[type] += 1;
        }

        const typeCount = type !== undefined ? (byTypeCounters as any)[type] : '';
        const title = e.name || `${type} ${typeCount}`;

        return (
            <div key={e.id} class={cls('entity', entity === e && 'selected')}
                onClick={() => selectEntity && !isFolder && selectEntity(e)}>

                <span class={'entity-type'}>
                {`${isFolder ? 'folder' : type}`}
                </span> 

                <span>&nbsp;</span>
                
                <span class={'entity-title'}>
                {title}
                </span> 
            </div>
        );
    });

    return (
        <div id={'entity-list'}>
            {$entities}
        </div>
    );
}
