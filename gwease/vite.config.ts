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
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ease",
      fileName: (format) => `ease.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "ahooks",
        "antd",
        "react-redux",
        "redux",
        "@reduxjs/toolkit",
        "react-router",
        "react-router-dom",
        "react",
        "react-dom",
        "i18nNext",
        "react-i18next",
        "i18next-browser-languagedetector",
        "axios",
        "moment",
        "xlsx",
        "react-resizable",
        "react-dnd",
        "react-window",
        "react-contextmenu",
        "react-sortable-hoc",
        "react-dnd-html5-backend",
        "react-draggable",
      ],
    },
  },
  plugins: [typescript(), react()],
});
