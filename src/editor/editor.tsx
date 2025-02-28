import './editor.css';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { Color, CzmlDataSource, Entity, KmlDataSource, PinBuilder } from 'cesium';
import { FileInput } from '../misc/file-input';
import { EntitiesList } from './entities-list';
import { EntytyEditor } from './entity-editor';

import GeometryEditor from '../geometry-editor/geometry-editor';
import { ViewerContext } from '../app';

type CesiumDataSource = CzmlDataSource | KmlDataSource;

// export type EditorProps = {
//     entities: Entity[];
//     entity: Entity | null;
//     onEntityCreated?: (entity: Entity) => void;
//     onSelectEntity?: (entity: Entity) => void;
//     onCesiumDataSource: (ds: Promise<CzmlDataSource | KmlDataSource>) => void;
// }
export function Editor(/*{onCesiumDataSource, entities, entity, onSelectEntity, onEntityCreated}: EditorProps*/) {

    const [entities, setEntities] = useState<Entity[]>([]);
    const [entity, onSelectEntity] = useState<Entity | null>(null);

    const viewer = useContext(ViewerContext);

    const handleDSLoaded = useCallback((ds: CzmlDataSource | KmlDataSource) => {
        const newEntities = ds.entities.values;
        setEntities([...entities, ...newEntities]);
    }, [entities, setEntities]);
    
    const handleCesiumDS = useCallback((ds: Promise<CesiumDataSource>) => {
        if (viewer) {
            viewer.dataSources.add(ds);
            ds.then(handleDSLoaded);
        }
    }, [viewer, handleDSLoaded]);

    const fileSelected = useCallback((file: File) => {
        if (/vnd.google-earth/.test(file.type) || /\.kmz|\.kml/.test(file.name)) {
            handleCesiumDS(KmlDataSource.load(file));
        }
        else if (/\.czml/.test(file.name)) {
            readTextFromFile(file).then(text => {
                const czmljson = JSON.parse(text);
                sanitizeSelfRef(czmljson);
                handleCesiumDS(CzmlDataSource.load(czmljson));
            });
        }

    }, [handleCesiumDS]);


    useEffect(() => {
        if (viewer) {
            window.geometryEditor = new GeometryEditor(viewer);
        }
    }, [viewer]);

    const onEntityCreated = useCallback((newEntity: Entity) => {
        setEntities([...entities, newEntity])
    }, [setEntities, entities]);

    const [creationMode, setCreationMode] = useState(false);

    const handleSavePolygon = useCallback(() => {
        const newEntity = (window.geometryEditor as GeometryEditor).save();
        newEntity && onEntityCreated(newEntity);
        console.log('new entity', newEntity);
        setCreationMode(false);
    }, [setCreationMode]);

    const handleCreatePolygon = useCallback(() => {
        const subjEntity = (window.geometryEditor as GeometryEditor).newEntity('polygon');

        window.geometryEditor.viewer.entities.add(subjEntity);

        setCreationMode(true);
    }, [setCreationMode]);

    const handleCancel = useCallback(() => {
        const subjEntity = window.geometryEditor.cancel();
        window.geometryEditor.viewer.entities.remove(subjEntity);
        setCreationMode(false);
    }, [setCreationMode])

    return (
      <div id={'editor'}>
        <FileInput onFile={fileSelected}/>
        <div>
            { !creationMode && <button onClick={handleCreatePolygon}>Create Polygon</button> }
            { creationMode && <button onClick={handleSavePolygon}>Save</button>}
            { creationMode && <button onClick={handleCancel}>Cancel</button>}
        </div>
        <EntitiesList {...{entities, entity, onSelectEntity}}/>
        <EntytyEditor entity={entity}/>
      </div>
    );
}

function readTextFromFile(file: File): Promise<string> {
    const reader = new FileReader();
    const promise =  new Promise((resolve) => {
        reader.onload = function() {
            resolve(reader.result);
        };
    });
    reader.readAsText(file);
    
    return promise as Promise<string>;
}

function sanitizeSelfRef(czmljson: any[]) {
    let selfRefs = 0;
    czmljson.forEach(packet => {
        const billboardIsRef = packet.billboard && 
            packet.billboard.image && 
            packet.billboard.image.reference;
        
        const selfReference = billboardIsRef && 
            packet.billboard.image.reference.split('#')[0] === packet.id;
        
        if (selfReference) {
            console.warn('Self-referencing reference for billboard image', packet);
            const pb = new PinBuilder();
            packet.billboard.image = pb.fromText(
                "" + ++selfRefs,
                Color.fromRandom({"alpha": 1.0}), 32).toDataURL();
        }
    });
}
