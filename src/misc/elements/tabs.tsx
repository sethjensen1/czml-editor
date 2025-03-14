import { JSX } from "preact/jsx-runtime";
import { ReactElement } from "preact/compat";
import { useState } from "preact/hooks";

import cls from "../cls";

import './tabs.css';

type TabFC = ReactElement<TabProps>;

export type TabsProps = {
    children: TabFC[];
}
export function Tabs({children}: TabsProps) {

    const [tabInx, setTabInx] = useState<number>(0);

    const childrenArray = (Array.isArray(children) ? children : [children]);

    const header = childrenArray.map((elem: TabFC, i) => {
        const title = elem.props.title;
        return <span 
            class={cls('tab-header', (i === tabInx) && 'selected')} 
            onClick={() => setTabInx(i)}>
                {title}
            </span>
    });

    const tabs = childrenArray.map((chld, i) => {
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

export type TabProps = {
    title: string;
    children: JSX.Element | JSX.Element[];
}
export function Tab({children}: TabProps) {
    return <>
    {children}
    </>
}