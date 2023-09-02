/*
 * @Author: zhangzhen
 * @Date: 2022-10-26 09:06:09
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-11-09 10:42:03
 *
 */
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const typescript = require('@rollup/plugin-typescript');
const path = require('path');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const {externals} = require('rollup-plugin-node-externals');
const commonjs = require('@rollup/plugin-commonjs');
const image = require('@rollup/plugin-image');
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
const {module} = require('./package.json');
const strip = require('@rollup/plugin-strip');

const config = {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist',
            format: 'es',
            exports: 'named', // 指定导出模式（自动、默认、命名、无）
            name: 'esae',
            preserveModules: true, // 保留模块结构
            preserveModulesRoot: 'src', // 将保留的模块放在根级别的此路径下
        },
        // {
        //     dir: 'dist',
        //     format: 'es',
        //     entryFileNames: 'ease.[format].js',
        // },
    ],
    plugins: [
        image(),
        commonjs(),
        postcss({
            plugins: [autoprefixer(), cssnano()],
            extract: 'style.css',
        }),
        typescript({
            outDir: 'dist',
            declaration: true,
            declarationDir: 'dist',
        }),
        // 打包删除调试代码debugger console
        strip(),
        // 处理外部依赖
        nodeResolve(),
        //  externals({
        //   devDeps: false, // devDependencies 类型的依赖就不用加到 externals 了。
        //   }),
        copy({
            targets: [{src: 'src/components/locale-provider', dest: 'dist'}],
        }),
        json(),
    ],
    external: [
        'ahooks',
        'antd',
        'react-redux',
        'redux',
        '@reduxjs/toolkit',
        'react-router',
        'react-router-dom',
        'react',
        'react-dom',
        'i18nNext',
        'react-i18next',
        'i18next-browser-languagedetector',
        'axios',
        'moment',
        'xlsx',
        'react-resizable',
        'react-dnd',
        'react-window',
        'react-contextmenu',
        'react-sortable-hoc',
        'react-dnd-html5-backend',
        'react-draggable',
    ],
};

export default config;
