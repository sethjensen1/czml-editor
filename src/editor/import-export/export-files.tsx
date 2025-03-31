import { CustomDataSource, Entity, exportKml, exportKmlResultKml } from "cesium";
import { useCallback } from "preact/hooks";

import "./export-files.css"
import { exportAsCzml } from "../../czml-ext/export-czml";

import { ZipWriter, BlobWriter, TextReader } from "@zip.js/zip.js"


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

    const handleDownloadCZML = useCallback(async () => {
        const { czml, exportedImages } = await exportAsCzml(entities, { exportImages: true });
        
        try {
            const czmlText = JSON.stringify(czml);
    
            const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
            await zipWriter.add('document.czml', new TextReader(czmlText));
    
            if (exportedImages) {
                for (const { targetPath, img } of Object.values(exportedImages)) {
                    const canvas = new OffscreenCanvas(img.width, img.height);
                    canvas.getContext('2d')?.drawImage(img, 0, 0);
                    const blob = await canvas.convertToBlob();
                    await zipWriter.add(targetPath, blob.stream())
                }
            }
    
            downloadBlobFile(await zipWriter.close(), 'document.czml.zip');
        }
        catch(e) {
            console.log(czml);
            console.error(e);
        }
        
        // const czmlData = 'data:text/json;charset=utf-8,' + encodeURIComponent();
        // downloadAsFile(czmlData, 'document.czml');
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

function downloadBlobFile(content: Blob, filename: string) {
    const link = document.createElement('A') as HTMLAnchorElement;
    link.href = URL.createObjectURL(content);
    link.download = filename;
    link.click();
    link.remove();
}
