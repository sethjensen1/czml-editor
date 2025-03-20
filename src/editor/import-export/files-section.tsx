import { CzmlDataSource, Entity, GeoJsonDataSource, KmlDataSource } from "cesium";

import { LoadFiles } from "./load-files";
import { ExportFiles } from "./export-files";
import { Section } from "../../misc/elements/section";

export type CesiumDataSource = CzmlDataSource | KmlDataSource | GeoJsonDataSource;

export type FilesSectionProps = {
    entities: Entity[];
    onLoad: (entities: Entity[], dataSource: CesiumDataSource, file: File) => any;
}
export function FilesSection({ entities, onLoad }: FilesSectionProps) {

    return (
        <Section header={'Import / Export'} className={'upload-section'}>
            <LoadFiles onLoad={onLoad} />
            <ExportFiles entities={entities} />
        </Section>
    );
}

