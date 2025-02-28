import './app.css'
import { Viewer as CesiumViewer} from 'cesium'
import { Editor } from './editor/editor';
import { MainLayout } from './misc/main-layout';
import { useEffect, useState } from 'preact/hooks';

import { createContext } from 'preact';

import "cesium/Build/Cesium/Widgets/widgets.css";

export const ViewerContext = createContext<CesiumViewer| null>(null);

export function App() {

  const [viewer, setViewer] = useState<CesiumViewer| null>(null);

  useEffect(() => {
    if (viewer == null) {
      setViewer(new CesiumViewer('cesiumContainer', {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: true,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        scene3DOnly: true,
        shouldAnimate: true
      })); 
    }
  }, [viewer, setViewer]);

  return (
    <MainLayout 
      sidebar={
        <ViewerContext value={viewer}>
          <Editor/>
        </ViewerContext>
      }
      mainArea={
        <div id={'cesiumContainer'}></div>
      }
    />
  );
}

