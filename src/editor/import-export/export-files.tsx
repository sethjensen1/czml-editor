import { CustomDataSource, Entity, exportKml, exportKmlResultKml } from "cesium";
import { useCallback } from "preact/hooks";
import CzmlWriter from "../../extra/czml-writer";

import "./export-files.css"


type ExportFilesProps = {
    entities: Entity[];
    onExport?: () => void;
};
export function ExportFiles({entities, onExport}: ExportFilesProps) {

    const handleDownloadKML = useCallback(() => {
        const ds = new CustomDataSource("export");
        entities.forEach(e => ds.entities.add(e));
        exportKml({ entities: ds.entities }).then(result => {
            const mime = 'application/vnd.google-earth.kml+xml';
            const kml = `data:${mime};charset=utf-8,` + encodeURIComponent((result as exportKmlResultKml).kml);

            downloadAsFile(kml, 'document.kml');
        });
    }, [entities, onExport]);

    const handleDownloadCZML = useCallback(() => {
        const writer = new CzmlWriter({ separateResources: false });
        entities.forEach(entity => writer.addEntity(entity));

        const czml = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(writer.toJSON()));
        downloadAsFile(czml, 'document.czml');
        
    }, [entities, onExport]);

    return (
        <div class={'export'}>
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
