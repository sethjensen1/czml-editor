import { ArcGisMapServerImageryProvider, CesiumTerrainProvider, CzmlDataSource, 
    EllipsoidTerrainProvider, ImageryProvider, IonImageryProvider, ProviderViewModel, 
    Viewer } from "cesium";
import ImgSelector, { CesiumIntegrationApi, SelectorOption } from 'cesium-img-selector';
import bingIcon from "./assets/bingAerial.png"
import bingHybridIcon from "./assets/bingAerialLabels.png"
import bingRoadsIcon from "./assets/bingRoads.png"

import esriWorldIcon from "./assets/esriWorldImagery.png"
import esriStreetsIcon from "./assets/esriWorldStreetMap.png"
import natGeoIcon from "./assets/esriNationalGeographic.png"
import { switchGoogleGlobeOff, switchGoogleGlobeOn } from "./google3d";

import "./cesium.css";


CesiumIntegrationApi.Dependencies.resolveProviderClass = () => {
    throw new Error("Unsupported");
}

type ProviderViewModelEx = ProviderViewModel & {
    lg_code: string;
    _category: string;
};

export const categories = ["Satellite", "Geographic"];

export function createBaseImageryOptions() {
    return createImageryProviders().map(model => {
        return {
            lg_code: model.lg_code,
            icon: model.iconUrl,
            title: model.name,
            category: model.category,
            model
        };
    });
}

export function createImageryProviders() {
    return [...createBingProviders(), ...createESRIProviders()] as ProviderViewModelEx[];
}

function checkForDefaultAssets() {
    const defaultAssetsLabel = (window as any).defaultAssetsLabel as string;

    const defaultAssetsUrl = (window as any).defaultAssets as string;
    const defaultAssets = defaultAssetsUrl ? CzmlDataSource.load(defaultAssetsUrl) : undefined;

    return {
        defaultAssetsLabel,
        defaultAssets,
    }
}

export async function setBaseLayerByModel(viewer: Viewer, model: ProviderViewModel) {
    const provider = await (model.creationCommand.canExecute ? 
        (model.creationCommand as unknown as (() => ImageryProvider))() : 
        Promise.resolve(undefined));
    
    if (provider) {
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(provider);
    }
}

export function createSelector(viewer: Viewer) {
    const toolbar = viewer.container.getElementsByClassName('cesium-viewer-toolbar')[0];

    const selectorButton = document.createElement('button');
    selectorButton.className = 'cesium-button cesium-toolbar-button img-selector-toggle';
    toolbar?.appendChild(selectorButton);

    const sContainer = document.createElement('div');
    toolbar?.appendChild(sContainer);

    const baseImagery = createBaseImageryOptions();
  
    const defaultBaseImagery = baseImagery.find(i => i.lg_code === 'esri_world');
    if (defaultBaseImagery) {
        setBaseLayerByModel(viewer, defaultBaseImagery?.model);
    }
    
    const { defaultAssetsLabel, defaultAssets } = checkForDefaultAssets();

    const imgSelector = new ImgSelector({
        visible: false,
        categories: categories,
        defaultAssets: !!defaultAssets,
        mainUiContainer: sContainer,
        baseImageryOptions: baseImagery,
        defaultBaseImageryOption: defaultBaseImagery,
        uiConfig: {
            hideDefaultAssets: !defaultAssets,
            defaultAssetsLabel
        }
    });

    if (defaultAssets) {
        defaultAssets.then(ds => {
            (ds as any).__ignore = true;
            
            ds.show = imgSelector.defaultAssets.value;
            viewer.dataSources.add(ds);
        });
    }
  
    selectorButton.onclick = () => {
        imgSelector.setVisible(!imgSelector.visible.value);
    };
  
    imgSelector.selectedBaseImageryOption.subscribe((baseLayer?: SelectorOption) => {
        baseLayer && setBaseLayerByModel(viewer, baseLayer?.model);
    });
  
    imgSelector.google3d.subscribe(g3dOn => {
        g3dOn ? switchGoogleGlobeOn(viewer) : switchGoogleGlobeOff(viewer);
    });
  
    imgSelector.terrain3d.subscribe(async terrainOn => {
        if (terrainOn) {
            const provider = await CesiumTerrainProvider.fromIonAssetId(1);
            if (provider) {
                viewer.terrainProvider = provider;
            }
        }
        else {
            viewer.terrainProvider = new EllipsoidTerrainProvider();
        }
    });

    imgSelector.defaultAssets.subscribe(async visible => {
        const datasource = await defaultAssets;
        if (datasource) {
            datasource.show = visible;
        }
    });
}

function createBingProviders() {
    const bing = new ProviderViewModel({
        name: "Bing Maps Aerial",
        iconUrl: bingIcon,
        tooltip: "Bing Maps Aerial",
        category: "Satellite",
        creationFunction: function () {
            return IonImageryProvider.fromAssetId(2);
        },
    });
    (bing as ProviderViewModelEx).lg_code = "bing";
    
    const bingHybrid = new ProviderViewModel({
        name: "Bing Maps with Labels",
        iconUrl: bingHybridIcon,
        tooltip: "Bing Maps Aerial with Labels",
        category: "Satellite",
        creationFunction: function () {
            return IonImageryProvider.fromAssetId(3);
        },
    });
    (bingHybrid as ProviderViewModelEx).lg_code = "bing_hybrid";
    
    const bingRoads = new ProviderViewModel({
        name: "Bing Maps Road",
        iconUrl: bingRoadsIcon,
        tooltip: "Bing Maps Road",
        category: "Geographic",
        creationFunction: function () {
            return IonImageryProvider.fromAssetId(3);
        },
    });
    (bingRoads as ProviderViewModelEx).lg_code = "bing_road";

    return [bing, bingHybrid, bingRoads];
}

function createESRIProviders() {

    const esriWorld = new ProviderViewModel({
        name: "ESRI World Imagery",
        iconUrl: esriWorldIcon,
        tooltip: "ESRI World Imagery",
        category: "Satellite",
        creationFunction: function () {
            const url = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";
            return ArcGisMapServerImageryProvider.fromUrl(url, {enablePickFeatures: false});
        },
    });
    (esriWorld as ProviderViewModelEx).lg_code = "esri_world";

    const esriStreets = new ProviderViewModel({
        name: "ESRI World Street Map",
        iconUrl: esriStreetsIcon,
        tooltip: "ESRI World Street Map",
        category: "Geographic",
        creationFunction: function () {
            const url = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";
            return ArcGisMapServerImageryProvider.fromUrl(url, {enablePickFeatures: false});
        },
    });
    (esriStreets as ProviderViewModelEx).lg_code = "esri_streets";

    const esriNatGeo = new ProviderViewModel({
        name: "ESRI Natural Geographic",
        iconUrl: natGeoIcon,
        tooltip: "ESRI Natural Geographic",
        category: "Geographic",
        creationFunction: function () {
            const url = "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer";
            return ArcGisMapServerImageryProvider.fromUrl(url, {enablePickFeatures: false});
        },
    });
    (esriNatGeo as ProviderViewModelEx).lg_code = "esri_nat_geo";

    return [esriWorld, esriStreets, esriNatGeo];
}