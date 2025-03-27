import { HeightReference, HorizontalOrigin, LabelGraphics, LabelStyle, VerticalOrigin } from "cesium";
import { WriterContext } from "../export-czml";
import { writeCartesian, writeColor, writeEnum, writeNearFarScalar, writeScalar } from "./field-writers";

export function writeLabel(label: LabelGraphics, ctx: WriterContext) {

    const packet: any = {};

    if (label.show !== undefined) {
        packet.show =  writeScalar(label.show, {...ctx, path: ['label', 'show']});
    }
    
    if (label.text !== undefined) {
        packet.text =  writeScalar(label.text, {...ctx, path: ['label', 'text']});
    }
    
    if (label.font !== undefined) {
        packet.font =  writeScalar(label.font, {...ctx, path: ['label', 'font']});
    }
    
    if (label.style !== undefined) {
        packet.style =  writeEnum(label.style, {...ctx, path: ['label', 'style']}, LabelStyle);
    }

    if (label.scale !== undefined) {
        packet.scale =  writeScalar(label.scale, {...ctx, path: ['label', 'scale']});
    }
    
    if (label.showBackground !== undefined) {
        packet.showBackground =  writeScalar(label.showBackground, {...ctx, path: ['label', 'showBackground']});
    }

    if (label.backgroundColor !== undefined) {
        packet.backgroundColor =  writeColor(label.backgroundColor, {...ctx, path: ['label', 'backgroundColor']});
    }
    
    if (label.backgroundPadding !== undefined) {
        packet.backgroundPadding =  writeCartesian(label.backgroundPadding, {...ctx, path: ['label', 'backgroundPadding']});
    }
    
    if (label.pixelOffset !== undefined) {
        packet.pixelOffset =  writeCartesian(label.pixelOffset, {...ctx, path: ['label', 'pixelOffset']});
    }
    
    if (label.eyeOffset !== undefined) {
        packet.eyeOffset =  writeCartesian(label.eyeOffset, {...ctx, path: ['label', 'eyeOffset']});
    }

    if (label.horizontalOrigin !== undefined) {
        packet.horizontalOrigin =  writeEnum(label.horizontalOrigin, {...ctx, path: ['label', 'horizontalOrigin']}, HorizontalOrigin);
    }
    
    if (label.verticalOrigin !== undefined) {
        packet.verticalOrigin =  writeEnum(label.verticalOrigin, {...ctx, path: ['label', 'verticalOrigin']}, VerticalOrigin);
    }
    
    if (label.heightReference !== undefined) {
        packet.heightReference =  writeEnum(label.heightReference, {...ctx, path: ['label', 'heightReference']}, HeightReference);
    }
    
    if (label.fillColor !== undefined) {
        packet.fillColor =  writeColor(label.fillColor, {...ctx, path: ['label', 'fillColor']});
    }

    if (label.outlineColor !== undefined) {
        packet.outlineColor =  writeColor(label.outlineColor, {...ctx, path: ['label', 'outlineColor']});
    }
    
    if (label.outlineWidth !== undefined) {
        packet.outlineWidth =  writeScalar(label.outlineWidth, {...ctx, path: ['label', 'outlineWidth']});
    }

    if (label.translucencyByDistance !== undefined) {
        packet.translucencyByDistance =  writeNearFarScalar(label.translucencyByDistance, {...ctx, path: ['label', 'translucencyByDistance']});
    }
    
    if (label.pixelOffsetScaleByDistance !== undefined) {
        packet.pixelOffsetScaleByDistance =  writeNearFarScalar(label.pixelOffsetScaleByDistance, {...ctx, path: ['label', 'pixelOffsetScaleByDistance']});
    }

    if (label.scaleByDistance !== undefined) {
        packet.scaleByDistance =  writeNearFarScalar(label.scaleByDistance, {...ctx, path: ['label', 'scaleByDistance']});
    }

    if (label.distanceDisplayCondition !== undefined) {
        packet.distanceDisplayCondition =  writeNearFarScalar(label.distanceDisplayCondition, {...ctx, path: ['label', 'distanceDisplayCondition']});
    }

    if (label.disableDepthTestDistance !== undefined) {
        packet.disableDepthTestDistance =  writeScalar(label.disableDepthTestDistance, {...ctx, path: ['label', 'disableDepthTestDistance']});
    }

    return packet;

}