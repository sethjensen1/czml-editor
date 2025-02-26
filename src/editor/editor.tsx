import { useCallback, useRef } from 'preact/hooks';
import { Color, CzmlDataSource, Entity, KmlDataSource, PinBuilder } from 'cesium';

import './editor.css';
import { FileInput } from '../misc/file-input';
import { EntitiesList } from './entities-list';
import { EntytyEditor } from './entity-editor';


export type EditorProps = {
    entities: Entity[];
    entity: Entity | null;
    onSelectEntity?: (entity: Entity) => void;
    onCesiumDataSource: (ds: Promise<CzmlDataSource | KmlDataSource>) => void;
}
export function Editor({onCesiumDataSource, entities, entity, onSelectEntity}: EditorProps) {

    const fileSelected = useCallback((file: File) => {
        if (/vnd.google-earth/.test(file.type) || /\.kmz|\.kml/.test(file.name)) {
            onCesiumDataSource(KmlDataSource.load(file));
        }
        else if (/\.czml/.test(file.name)) {
            readTextFromFile(file).then(text => {
                const czmljson = JSON.parse(text);
                sanitizeSelfRef(czmljson);
                onCesiumDataSource(CzmlDataSource.load(czmljson));
            });
        }

    }, []);


    return (
      <div id={'editor'}>
        <FileInput onFile={fileSelected}/>
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
