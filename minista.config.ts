import { defineConfig } from "minista"

export default defineConfig({
  base: "./",
  beautify: {
    useHtml: true, // Pretty: HTML
    useAssets: true, // Pretty: CSS and JS
  },
})
