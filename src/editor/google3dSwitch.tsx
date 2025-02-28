import { useCallback, useContext, useState } from "preact/hooks";
import { switchGoogleGlobeOff, switchGoogleGlobeOn } from "../google/google3d";
import Switch from "../misc/switch";

import { ViewerContext } from "../app";

export function Google3DSwitch() {
    const [google3d, setGoogle3d] = useState<boolean>(false);
    const viewer = useContext(ViewerContext);

    const handleGoogle3dSwitch = useCallback(() => {
        const useG3d = !google3d;
        setGoogle3d(useG3d);

        if (viewer) {
            useG3d ? switchGoogleGlobeOn(viewer) : switchGoogleGlobeOff(viewer);
        }

    }, [viewer, google3d, setGoogle3d]);

    return (
        <div>
            <label>Use google 3d</label> <Switch onChange={handleGoogle3dSwitch} checked={google3d}></Switch>
        </div>
    );
}