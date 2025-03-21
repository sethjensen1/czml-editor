import { CzmlDataSource, Entity, GeoJsonDataSource, KmlDataSource } from "cesium";

import { LoadFiles } from "./load-files";
import { ExportFiles } from "./export-files";
import { Section } from "../../misc/elements/section";
import { useEffect, useState } from "preact/hooks";

export type CesiumDataSource = CzmlDataSource | KmlDataSource | GeoJsonDataSource;

export type FilesSectionProps = {
    entities: Entity[];
    onLoad: (entities: Entity[], dataSource: CesiumDataSource, file: File) => any;
}
export function FilesSection({ entities, onLoad }: FilesSectionProps) {

    const [exported, setExported] = useState<boolean>(false);

    useEffect(() => {
        const unsavedChanges = entities.length > 0 && !exported;
        window.onbeforeunload = (e) => {
            const noPrompt = new URLSearchParams(window.location.search).has('noprompt')
            if (!noPrompt && unsavedChanges) {
                e.preventDefault();
            }
        }
        return () => {
            window.onbeforeunload = null;
        }
      }, [entities, exported]);

    return (
        <Section header={'Import / Export'} className={'upload-section'}>
            <LoadFiles onLoad={onLoad} />
            <ExportFiles entities={entities} onExport={() => {setExported(true);}} />
        </Section>
    );
}

