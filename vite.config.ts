import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   lib: {
  //     entry: 'src/main.tsx', // Adjust the entry point as needed
  //     name: 'OrboSkinAnalyzer',
  //     fileName: (format) => `orbo-skin-analyzer.${format}.js`
  //   },
  //   rollupOptions: {
  //     // Make sure to externalize dependencies that shouldn't be bundled
  //     // into your library
  //     external: [],
  //     output: {
  //       globals: {}
  //     }
  //   }
  // },
  // define: {
  //   'process.env.NODE_ENV': JSON.stringify('production'), // Explicitly define the environment
  // }
})
