import './editor.css';
import { useCallback, useContext, useMemo, useState } from 'preact/hooks';
import { Entity } from 'cesium';
import { EntitiesList } from './entity-list/entities-list';
import { EntytyEditor } from './entity-editor';

import { UploadSection } from './upload-section';
import { CreateEntitySection } from './create/create-section';
import { Google3DSwitch } from '../misc/google3dSwitch';
import GeometryEditor from '../geometry-editor/geometry-editor';
import { createContext } from 'preact';
import { ViewerContext } from '../app';
import { CreateEntityByClickController } from '../geometry-editor/input-new-entity';
import { PositionDragController } from '../geometry-editor/position-drag-editor';


export type EditorControllersContext = {
    geometryEditor?: GeometryEditor;
    clickCreateController?: CreateEntityByClickController;
    positionDragController?: PositionDragController;
}

export const EditorContext = createContext<EditorControllersContext>({});

export function Editor() {
    const viewer = useContext(ViewerContext);

    const editorContext = useMemo<EditorControllersContext>(() => {
        return {
            geometryEditor: viewer ? new GeometryEditor(viewer) : undefined,
            clickCreateController: viewer ? new CreateEntityByClickController(viewer) : undefined,
            positionDragController: viewer ? new PositionDragController(viewer) : undefined,
        }
    }, [viewer]);

    const [entities, setEntities] = useState<Entity[]>([]);
    const [entity, setSelectedEntity] = useState<Entity | null>(null);

    const selectEntity = useCallback((entity: Entity | null) => {
        setSelectedEntity(entity);
        console.log('select entity', entity);
    }, [setSelectedEntity]);

    const onEntityCreated = useCallback((newEntity: Entity) => {
        console.log('Entity created', newEntity);
        setEntities([...entities, newEntity]);
        setSelectedEntity(newEntity);
    }, [entities, setEntities, setSelectedEntity]);

    return (
        <div id={'editor'} class={'section entity-editor'}>
            <EditorContext value={editorContext}>
                <UploadSection {...{ entities, setEntities }} />
                <Google3DSwitch />
                <CreateEntitySection {...{ onEntityCreated }} />
                <EntitiesList {...{ entities, entity, selectEntity }} />
                <EntytyEditor entity={entity} onChange={selectEntity} />
            </EditorContext>
        </div>
    );
}
