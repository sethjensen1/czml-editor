import { Section } from "../../misc/section";

import { Entity } from "cesium";
import { useState } from "preact/hooks";
import { CreatePolygon } from "./create-polygon";
import { CreateBillboard } from "./create-billboard";



type CreateEntitySectionProps = {
    onEntityCreated: (entity: Entity) => any;
}
export function CreateEntitySection({onEntityCreated}: CreateEntitySectionProps) {

    const [activeType, setActiveType] = useState<string|undefined>(undefined);

    /* <Section id={'create-entity'} className={'create-section'} header={'Create entities'}> */
    /* </Section> */

    const allEnabled = activeType === undefined;
    const billboardDisabled = !allEnabled  && activeType !== 'billboard';
    const polygonDisabled = !allEnabled  && activeType !== 'polygon';

    return (
        <div class={'section create-section'}>
            <h3><span>Create entities</span></h3>
            <CreateBillboard disabled={billboardDisabled} {...{setActiveType, onEntityCreated}} />
            <CreatePolygon disabled={polygonDisabled} {...{setActiveType, onEntityCreated}} />
        </div>
    );
}

