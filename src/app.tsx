import './app.css'
import { Viewer as CesiumViewer, CzmlDataSource, Entity, KmlDataSource } from 'cesium'
import { Editor } from './editor/editor';
import { MainLayout } from './misc/main-layout';
import { useCallback, useRef, useState } from 'preact/hooks';
import { Viewer } from './viewer';


type CesiumDataSource = CzmlDataSource | KmlDataSource;

export function App() {

  const cesiumViewerRef = useRef<CesiumViewer | null>(null);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [entity, setEntity] = useState<Entity | null>(null);

  const handleDSLoaded = useCallback((ds: CzmlDataSource | KmlDataSource) => {
    const newEntities = ds.entities.values;
    setEntities([...entities, ...newEntities]);
  }, [entities, setEntities]);

  const handleCesiumDS = useCallback((ds: Promise<CesiumDataSource>) => {
    const viewer = cesiumViewerRef.current;
    if (viewer) {
      viewer.dataSources.add(ds);
      ds.then(handleDSLoaded);
    }
  }, [cesiumViewerRef, handleDSLoaded]);

  const editor = <Editor 
    {...{entities, entity}}
    onSelectEntity={setEntity}
    onCesiumDataSource={handleCesiumDS}
  />;
  const viewer = <Viewer viewerRef={cesiumViewerRef} />;

  return (
    <MainLayout 
      sidebar={editor} 
      mainArea={viewer}/>
  );
}

