import { Entity } from "cesium";

import "./entities-data-table.css"
import { useCallback, useState } from "preact/hooks";
import { ModalPane } from "../../misc/modal-pane";

type EntitiesDataTableProps = {
    entities: Entity[];
    onClose?: () => void;
}
export function EntitiesDataTable({entities, onClose}: EntitiesDataTableProps) {
    const propertyNames = new Set();
    entities.forEach(e => e.properties?.propertyNames.forEach(name => propertyNames.add(name)));
    const propNames = Array.from(propertyNames);

    const [buckets, setBuckets] = useState<number[]>([]);

    const buildHistogram = useCallback((property: string) => {

        const nBuckets = 9;

        const values = entities.map(e => e.properties?.getValue()[property]);
        const minMax = [Number.MAX_VALUE, Number.MIN_VALUE];

        values.forEach(val => {
            minMax[0] = Math.min(val, minMax[0]);
            minMax[1] = Math.max(val, minMax[1]);
        });

        const [minValue, maxValue] = minMax;

        const bucketW = (maxValue - minValue) / nBuckets;

        const buckets = values.map(val => 
            Math.floor((minValue + val) / bucketW)
        );

        setBuckets(buckets);

    }, [entities, setBuckets]);

    const theader = <thead>
        <tr>
            <th>Name</th>
            {buckets.length > 0 && <th>Bucket</th>}
            {propNames.map(pName => <th key={pName}>
                {pName as string}
                <button onClick={buildHistogram.bind(undefined, pName as string)}>Histogram</button>
            </th>)}
        </tr>
    </thead>;

    const rows = entities.map((e, i) => {
        return (<tr>
            <td key={'name'}>{e.name}</td>
            {buckets.length > 0 && <td key={'bucket'}>{buckets[i]}</td>}
            {propNames.map(prp => <td key={prp}>{e.properties?.getValue()[prp as string] || ''}</td>)}
        </tr>);
    });

    // Expose entities to global namespace
    (window as any).entities = entities;

    return (
        <ModalPane visible={true} className={'data-table'}>
            <div class={'actions'}>
                <button onClick={() => onClose && onClose()}>Close</button>
            </div>
            <div class={'scroll'}>
                <table>
                    {theader}
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        </ModalPane>
    );
}