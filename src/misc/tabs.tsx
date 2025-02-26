import { JSX } from "preact/jsx-runtime";
import cls from "./cls";
import { useState } from "preact/hooks";

import './tabs.css';

export type TabProps = {
    tabNames: string[];
    children: JSX.Element[];
}
export function Tabs({tabNames, children}: TabProps) {

    const [tabInx, setTabInx] = useState<number>(0);

    const header = tabNames.map((name, i) => {
        return <span 
            class={cls('tab-header', (i === tabInx) && 'selected')} 
            onClick={() => setTabInx(i)}>
                {name}
            </span>
    });

    const tabs = children.map((chld, i) => {
        return <div class={cls('tab', (i === tabInx) && 'selected')}>{chld}</div>
    });

    return (
        <>
        <div class={'tab-bar'}>
            {header}
        </div>
        {tabs}
        </>
    )
}