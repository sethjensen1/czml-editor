import { JSX, useState } from 'preact/compat';

import "./main-layout.css"

export type MainLayoutProps = {
    sidebar: JSX.Element,
    mainArea: JSX.Element,
}

export function MainLayout({sidebar, mainArea}: MainLayoutProps) {
  
    const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth * 0.25);
  
    function resizeHandler(e: MouseEvent) {
      const startX = e.clientX;
      const startWidth = sidebarWidth;
  
      function onMouseMove(e: MouseEvent) {
        const newWidth = startWidth + e.clientX - startX;
        setSidebarWidth(newWidth);
      }
  
      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
  
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  
    return (<div id={'main-layout'} class={'resizable-horizontal-layout'}>
      
      <div id={'sidebar'} class={'left-side-area'} style={{width: `${sidebarWidth}px`}}>
        {sidebar}
      </div>
  
      <div class={'resize-bar'} onMouseDown={resizeHandler}></div>
  
      <div id={'main-area'} class={'right-side-area'}>
        {mainArea}
      </div>
  
    </div>);
  }