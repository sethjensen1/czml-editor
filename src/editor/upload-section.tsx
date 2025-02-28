import { Color, CzmlDataSource, Entity, GeoJsonDataSource, KmlDataSource, PinBuilder } from "cesium";

import { useCallback, useContext } from "preact/hooks";
import { ViewerContext } from "../app";
import { FileInput } from "../misc/file-input";

export type CesiumDataSource = CzmlDataSource | KmlDataSource | GeoJsonDataSource;

export type UploadSectionProps = {
    entities: Entity[];
    setEntities: (entities: Entity[]) => any;
}
export function UploadSection({entities, setEntities}: UploadSectionProps) {

    const viewer = useContext(ViewerContext);
    
    const handleDSLoaded = useCallback((ds: CesiumDataSource) => {
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
    
    return (
        <div class={'section upload-section'}>
            <FileInput onFile={fileSelected} />
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