import './editor.css';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { Entity } from 'cesium';
import { EntitiesList } from './entities-list';
import { EntytyEditor } from './entity-editor';

import { UploadSection } from './upload-section';
import { CreateEntitySection } from './create-section';
import { Google3DSwitch } from './google3dSwitch';

export function Editor() {
    
    const [entities, setEntities] = useState<Entity[]>([]);
    const [entity, selectEntity] = useState<Entity | null>(null);
    
    const onEntityCreated = useCallback((newEntity: Entity) => {
        setEntities([...entities, newEntity])
    }, [setEntities, entities]);

    return (
      <div id={'editor'}>
        <UploadSection {...{entities, setEntities}} />
        <Google3DSwitch />
        <CreateEntitySection {...{onEntityCreated}}/>
        <EntitiesList {...{entities, entity, selectEntity}}/>
        <EntytyEditor entity={entity}/>
      </div>
    );
}
