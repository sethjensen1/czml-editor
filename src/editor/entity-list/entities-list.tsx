import { EntitySelectionSync } from "./selection-sync";
import { Entity } from "cesium";

import './entities-list.css';
import { types } from "../meta/meta";
import { EntityListElement } from "./entity-list-elem";
import { useState } from "preact/hooks";
import { EntitiesDataTable } from "./entities-data-table";

export type EntitiesListProps = {
    entities: Entity[];
    entity: Entity | null;
    selectEntity?: (entity: Entity | null) => void;
}
export function EntitiesList({entities, entity, selectEntity}: EntitiesListProps) {
    
    const typeStatistics = {};
    types.forEach(t => (typeStatistics as any)[t] = 0);
    entities.forEach(e => {
        const type = types.find(tname => (e as any)[tname] !== undefined);
        if (type) {
            (typeStatistics as any)[type] += 1;
        }
    });

    const [showDataTable, setShowDataTable] = useState<boolean>(false);

    const $entities = entities.map(e => 
        <EntityListElement key={e.id} entity={e} selectedEntity={entity}
            {...{entities, typeStatistics, selectEntity}} />
    );

    return (
        <div id={'entity-list'} class={'section entities-list-section'}>
            <h3>Entities</h3>
            {showDataTable && <EntitiesDataTable entities={entities} onClose={() => {setShowDataTable(false);}} />}
            <div class={'entities-actions button-size-s'}>
                <button onClick={() => {setShowDataTable(true);}}>Data table</button>
            </div>
            <div class={'scroll-container'}>
                {$entities}
            </div>
            <EntitySelectionSync {...{entity, selectEntity}} />
        </div>
    );
}
