import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import preact from '@preact/preset-vite'
import { visualizer } from "rollup-plugin-visualizer";


const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";

export default defineConfig({
  base: '/czml-editor/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          cesium: ['cesium']
        },
      },
    }
  },
  plugins: [
    preact(),
    visualizer(),
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
