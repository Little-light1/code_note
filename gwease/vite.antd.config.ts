const react = require("@vitejs/plugin-react");
const path = require("path");
const { defineConfig } = require("vite");
const typescript = require("@rollup/plugin-typescript");
const { name } = require("./package");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      formats: ["es"],
      // 库模式构建相关配置
      entry: path.resolve(__dirname, "src/antd/index"),
      name: "ease",
      fileName: (format) => `ease.antd.${format}.js`,
    },
    outDir: "dist/antd",
    rollupOptions: {},
  },
  // plugins: [typescript(), react()],
});
