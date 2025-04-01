import { Entity } from "cesium";
import { PropertyField } from "./fields/property-fld";
import cls from "../misc/cls";
import { Tab, Tabs } from "../misc/elements/tabs";
import { FeatureMetaData, PropertyMeta } from "./meta/meta";

export type FeatureEditorProps = {
    entity: Entity | null;
    onChange?: (val: any, feature?: string, property?: PropertyMeta) => any;
    metadata: FeatureMetaData | FeatureMetaData[];
}
export function FeatureEditor({entity, metadata, onChange}: FeatureEditorProps) {

    const featuresMeta = Array.isArray(metadata) ? metadata : [metadata];

    const propGroups = featuresMeta.map((featureMeta) => {
        
        const subj = (entity as any)[featureMeta.feature];
    
        return subj && featureMeta.propertyGroups.map(pg => {
            return (
            <Tab key={`${entity?.id}.${featureMeta.feature}.${pg.title}`} title={pg.title}>
                {pg.properties.map(prop => 
                    <PropertyField key={`${entity?.id}.${featureMeta.feature}.${prop.name}`} 
                        subject={subj}
                        property={prop} 
                        onChange={(val) => {
                            onChange && onChange(val, featureMeta.feature, prop);
                        }}
                    />
                )}
            </Tab>
            )
        });
    }).flat(1);

    return (
        <div class={cls('feature-editor')}>
            {propGroups && 
                <Tabs>
                    {propGroups}
                </Tabs>
                }
        </div>
    );

}