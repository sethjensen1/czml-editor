import { Entity } from "cesium";
import cls from "../misc/cls";

import './entities-list.css';
    
export type EntitiesListProps = {
    entities: Entity[];
    entity: Entity | null;
    onSelectEntity?: (entity: Entity) => void;
}
export function EntitiesList({entities, entity, onSelectEntity}: EntitiesListProps) {

    const $entities = entities.map(e => {
        return (
            <div key={e.id} class={cls('entity', entity === e && 'selected')}
                onClick={() => onSelectEntity && onSelectEntity(e)}>
                {e.name} {e.id}
            </div>
        );
    });

    return (
        <div id={'entity-list'}>
            {$entities}
        </div>
    );
}