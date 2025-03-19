import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import preact from '@preact/preset-vite'


const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";

export default defineConfig({
  base: '/czml-editor/',
  plugins: [
    preact(),
    viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }),
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
  },
  
})
