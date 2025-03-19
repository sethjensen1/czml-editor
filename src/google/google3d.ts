import * as Cesium from "cesium";


const getParams = new URLSearchParams(window.location.search);
Cesium.GoogleMaps.defaultApiKey = getParams.get('google_key') || 'AIzaSyCgjboUOBS_g9VjVZnTaRTg9dvfHDiZJ4k';


export function switchGoogleGlobeOn(viewer: Cesium.Viewer) {

    Cesium.createGooglePhotorealistic3DTileset().then(tileset => {

        viewer.scene.primitives.add(tileset);
        viewer.scene.globe.show = false;

    }).catch(error => {
        console.log(`Failed to load tileset: ${error}`);
    });
};

export function switchGoogleGlobeOff (viewer: Cesium.Viewer) {
    // @ts-ignore
    viewer.scene.primitives._primitives
        // @ts-ignore
        .filter(p => p._basePath && p._basePath.startsWith('https://tile.googleapis.com/'))
        // @ts-ignore
        .forEach(p => {
            viewer.scene.primitives.remove(p);
        });

    viewer.scene.globe.show = true;
};