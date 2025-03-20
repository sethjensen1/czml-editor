import { CzmlDataSource, Entity, GeoJsonDataSource, KmlDataSource } from "cesium";

import { LoadFiles } from "./load-files";
import { ExportFiles } from "./export-files";

export type CesiumDataSource = CzmlDataSource | KmlDataSource | GeoJsonDataSource;

export type FilesSectionProps = {
    entities: Entity[];
    onLoad: (entities: Entity[], dataSource: CesiumDataSource, file: File) => any;
}
export function FilesSection({ entities, onLoad }: FilesSectionProps) {

    return (
        <div class={'section upload-section'}>
            <h3><span>Upload / Download</span></h3>
            <LoadFiles onLoad={onLoad} />
            <ExportFiles entities={entities} />
        </div>
    );
}

