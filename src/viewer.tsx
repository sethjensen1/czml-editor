import { Viewer as CesiumViewer } from "cesium"
import { useEffect } from "preact/hooks"

import "cesium/Build/Cesium/Widgets/widgets.css";

export type ViewerProps = {
    viewerRef: React.MutableRefObject<CesiumViewer | null>;
}
export function Viewer({viewerRef}: ViewerProps) {

    useEffect(() => {
        viewerRef.current = new CesiumViewer('cesiumContainer', {
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
        });
    }, []);

    return (
        <div id={'cesiumContainer'}></div>
    )
}