import { Cartesian3, Entity, HeadingPitchRoll } from "cesium";
import { BooleanField } from "./boolean-fld";

type PositionFldProps = {
    label?: string
    entity: Entity;
    value?: Cartesian3
    onChange?: (value: Cartesian3) => void;
}
export function PositionFld({entity, label, value, onChange}: PositionFldProps) {
    return (
    <div>
        <BooleanField label={label || 'Allow draging'} />
    </div>
    );
}




/*
Vue.component('position-editor', {
    template,
    props: ['entity'],
    data: () => ({
        active: false,
        controller: null
    }),
    methods: {
        onInput() {

        }
    },
    watch: {
        entity: function(newEntity) {
            this.active = false;
            this.controller = attachController(newEntity, this.onInput);
        },
        active: function(active) {
            this.controller.active = active;
        }
    },
    created: function() {
        bindScreenSpaceEvents(viewer);
        this.controller = attachController(this.entity, this.onInput)
    }
});
*/