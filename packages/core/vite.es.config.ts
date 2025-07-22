import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import { readdirSync } from "fs"
import dts from "vite-plugin-dts"
function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true })

  return entries.filter(item => item.isDirectory()).map(item => item.name)
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "../../tsconfig.build.json",
      outDir: "dist/types"
    })
  ],
  build: {
    outDir: "dist/es",
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "ProElementPlus",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue", "element-plus"],
      output: {
        assetFileNames: assertInfo => {
          if (assertInfo.name === "style.css") {
            return "index.css"
          }
          return assertInfo.name as string
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"
          }
          if (id.includes("/packages/hooks")) {
            return "hooks"
          }
          if (id.includes("/packages/utils")) {
            return "utils"
          }
          for (const item of getDirectoriesSync("../components")) {
            if (id.includes(`/packages/components/${item}`)) {
              return item
            }
          }
        }
      }
    }
  }
})
