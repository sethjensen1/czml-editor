import { Cartesian2, Viewer } from "cesium";

export function getPickCoordinates(viewer: Viewer, position: Cartesian2) {
    const ray = viewer.camera.getPickRay(position);

    const rayPP = ray && viewer.scene.globe.pick(ray, viewer.scene);

    return rayPP || viewer.camera.pickEllipsoid(
        position,
        viewer.scene.globe.ellipsoid
    );
}
