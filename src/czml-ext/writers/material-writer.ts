import { CheckerboardMaterialProperty, ColorMaterialProperty, ImageMaterialProperty, PolylineArrowMaterialProperty, PolylineDashMaterialProperty, PolylineGlowMaterialProperty, PolylineOutlineMaterialProperty, Property, StripeMaterialProperty, StripeOrientation } from "cesium";
import { WriterContext } from "../export-czml";
import { writeCartesian, writeColor, writeEnum, writeScalar } from "./field-writers";
import { writeImage } from "./field-image-writer";
import { PolylineArrowMaterial, PolylineDashMaterial, PolylineGlowMaterial, PolylineMaterial, PolylineOutlineMaterial } from "../schema/polyline";
import { CheckerboardMaterial, ImageMaterial, Material, StripeMaterial } from "../schema/polygon";

export async function writeMaterial(prop: Property, ctx: WriterContext) {
    if (prop instanceof ColorMaterialProperty) {
        return {
            "solidColor": writeColorMaterial(prop, ctx)
        } as Material
    }
    
    if (prop instanceof ImageMaterialProperty) {
        return {
            "image": await writeImageMaterial(prop, ctx)
        } as Material
    }

    if (prop instanceof StripeMaterialProperty) {
        return {
            "stripe": writeStripeMaterial(prop, ctx)
        } as Material
    }
    
    if (prop instanceof CheckerboardMaterialProperty) {
        return {
            "checkerboard": writeCheckerboardMaterial(prop, ctx)
        } as Material
    }

    // TODO: handle unsupported material
}

export function writePolylineMaterial(prop: Property, ctx: WriterContext) {
    if (prop instanceof ColorMaterialProperty) {
        return {
            "solidColor": writeColorMaterial(prop, ctx)
        } as PolylineMaterial
    }
    
    if (prop instanceof PolylineOutlineMaterialProperty) {
        return {
            "polylineOutline": writePolylineOutlineMaterial(prop, ctx)
        } as PolylineMaterial
    }
    
    if (prop instanceof PolylineArrowMaterialProperty) {
        return {
            "polylineArrow": writePolylineArrowMaterial(prop, ctx)
        } as PolylineMaterial
    }
    
    if (prop instanceof PolylineDashMaterialProperty) {
        return {
            "polylineDash": writePolylineDashMaterial(prop, ctx)
        } as PolylineMaterial
    }
    
    if (prop instanceof PolylineGlowMaterialProperty) {
        return {
            "polylineGlow": writePolylineGlowMaterial(prop, ctx)
        } as PolylineMaterial
    }
    
    // TODO: handle unsupported material
}

function writeColorMaterial(prop: ColorMaterialProperty, ctx: WriterContext) {
    if (prop.color) {
        return {
            "color": writeColor(prop.color, {...ctx, path: [...ctx.path, 'color']})
        }
    }
}

export async function writeImageMaterial(prop: ImageMaterialProperty, ctx: WriterContext) {

    const material: ImageMaterial = {};

    if (prop.image) {
        material.image = await writeImage(prop.image, {...ctx, path: [...ctx.path, 'image']})
    }

    if (prop.repeat) {
        material.repeat = writeCartesian(prop.repeat, {...ctx, path: [...ctx.path, 'repeat']})
    }

    if (prop.color) {
        material.color = writeColor(prop.color, {...ctx, path: [...ctx.path, 'color']})
    }
    
    if (prop.transparent) {
        material.transparent = writeScalar(prop.transparent, {...ctx, path: [...ctx.path, 'transparent']})
    }

    return material;
}

function writeStripeMaterial(prop: StripeMaterialProperty, ctx: WriterContext) {
    
    const material: StripeMaterial = {};

    if (prop.orientation) {
        material.orientation = writeEnum(prop.orientation, {...ctx, path: [...ctx.path, 'orientation']}, StripeOrientation)
    }
    
    if (prop.evenColor) {
        material.evenColor = writeColor(prop.evenColor, {...ctx, path: [...ctx.path, 'evenColor']})
    }
    
    if (prop.oddColor) {
        material.oddColor = writeColor(prop.oddColor, {...ctx, path: [...ctx.path, 'oddColor']})
    }
    
    if (prop.repeat) {
        // expected double[4]
        material.repeat = writeScalar(prop.repeat, {...ctx, path: [...ctx.path, 'repeat']})
    }

    return material;
}

function writeCheckerboardMaterial(prop: CheckerboardMaterialProperty, ctx: WriterContext) {
    const material: CheckerboardMaterial = {};
    
    if (prop.evenColor) {
        material.evenColor = writeColor(prop.evenColor, {...ctx, path: [...ctx.path, 'evenColor']})
    }

    if (prop.oddColor) {
        material.oddColor = writeColor(prop.oddColor, {...ctx, path: [...ctx.path, 'oddColor']})
    }
    
    if (prop.repeat) {
        material.repeat = writeCartesian(prop.repeat, {...ctx, path: [...ctx.path, 'repeat']})
    }

    return material;
}

function writePolylineOutlineMaterial(prop: PolylineOutlineMaterialProperty, ctx: WriterContext) {
    const material: PolylineOutlineMaterial = {};
    
    if (prop.color) {
        material.color = writeColor(prop.color, {...ctx, path: [...ctx.path, 'color']})
    }
    
    if (prop.outlineColor) {
        material.outlineColor = writeColor(prop.outlineColor, {...ctx, path: [...ctx.path, 'outlineColor']})
    }
    
    if (prop.outlineWidth) {
        material.outlineWidth = writeScalar(prop.outlineWidth, {...ctx, path: [...ctx.path, 'outlineWidth']})
    }

    return material;
}

function writePolylineArrowMaterial(prop: PolylineArrowMaterialProperty, ctx: WriterContext) {
    const material: PolylineArrowMaterial = {};
    
    if (prop.color) {
        material.color = writeColor(prop.color, {...ctx, path: [...ctx.path, 'color']})
    }

    return material;
}

function writePolylineDashMaterial(prop: PolylineDashMaterialProperty, ctx: WriterContext) {
    const material: PolylineDashMaterial = {};
    
    if (prop.color) {
        material.color = writeColor(prop.color, {...ctx, path: [...ctx.path, 'color']})
    }
    
    if (prop.gapColor) {
        material.gapColor = writeColor(prop.gapColor, {...ctx, path: [...ctx.path, 'gapColor']})
    }
    
    if (prop.dashLength) {
        material.dashLength = writeScalar(prop.dashLength, {...ctx, path: [...ctx.path, 'dashLength']})
    }
    
    if (prop.dashPattern) {
        material.dashPattern = writeScalar(prop.dashPattern, {...ctx, path: [...ctx.path, 'dashPattern']})
    }

    return material;
}

function writePolylineGlowMaterial(prop: PolylineGlowMaterialProperty, ctx: WriterContext) {
    const material: PolylineGlowMaterial = {};
    
    if (prop.color) {
        material.color = writeColor(prop.color, {...ctx, path: [...ctx.path, 'color']})
    }

    if (prop.glowPower) {
        material.glowPower = writeScalar(prop.glowPower, {...ctx, path: [...ctx.path, 'glowPower']})
    }
    
    if (prop.taperPower) {
        material.taperPower = writeScalar(prop.taperPower, {...ctx, path: [...ctx.path, 'taperPower']})
    }

    return material;
}
