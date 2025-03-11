import { Color, CompositeEntityCollection, CustomDataSource, CzmlDataSource, DataSource, Entity, EntityCollection, exportKml, exportKmlResultKml, GeoJsonDataSource, KmlDataSource, PinBuilder } from "cesium";

import { useCallback, useContext } from "preact/hooks";
import { ViewerContext } from "../app";
import { FileInput } from "../misc/file-input";
import CzmlWriter from "../extra/czml-writer";

export type CesiumDataSource = CzmlDataSource | KmlDataSource | GeoJsonDataSource;

export type UploadSectionProps = {
    entities: Entity[];
    setEntities: (entities: Entity[]) => any;
}
export function UploadSection({ entities, setEntities }: UploadSectionProps) {

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
        else if (file.type === 'application/geo+json') {
            readTextFromFile(file).then(text => {
                handleCesiumDS(GeoJsonDataSource.load(JSON.parse(text)));
            });
        }
        else {
            console.log('Unknown filetype', file);
        }

    }, [handleCesiumDS]);

    const handleDownloadKML = useCallback(() => {
        const ds = new CustomDataSource("export");
        entities.forEach(e => ds.entities.add(e));
        exportKml({ entities: ds.entities }).then(result => {
            const mime = 'application/vnd.google-earth.kml+xml';
            const kml = `data:${mime};charset=utf-8,` + encodeURIComponent((result as exportKmlResultKml).kml);

            downloadAsFile(kml, 'document.kml');
        });
    }, [entities]);

    const handleDownloadCZML = useCallback(() => {
        const writer = new CzmlWriter({ separateResources: false });
        entities.forEach(entity => writer.addEntity(entity));

        const czml = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(writer.toJSON()));
        downloadAsFile(czml, 'document.czml');
        
    }, [entities]);

    return (
        <div class={'section upload-section'}>
            <h3><span>Upload / Download</span></h3>
            <FileInput onFile={fileSelected} />

            <button onClick={handleDownloadKML}>Download as KML</button>
            {/* <button>Download as KMZ</button> */}
            <button onClick={handleDownloadCZML}>Download as CZML</button>
            {/* <button>Download as CZMZ</button> */}
        </div>
    );
}

function downloadAsFile(content: string, filename: string) {
    const link = document.createElement('A') as HTMLAnchorElement;
    link.href = content;
    link.download = filename;
    link.click();
    link.remove();
}

function readTextFromFile(file: File): Promise<string> {
    const reader = new FileReader();
    const promise = new Promise((resolve) => {
        reader.onload = function () {
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
                Color.fromRandom({ "alpha": 1.0 }), 32).toDataURL();
        }
    });
}