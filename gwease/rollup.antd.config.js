
/*
 * @Author: zhangzhen
 * @Date: 2022-10-26 09:06:09
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-10-26 15:11:54
 * 
 */
const  postcss  = require( "rollup-plugin-postcss")
const  autoprefixer  = require( "autoprefixer")
const  cssnano  = require( "cssnano")

 const config={
    input: "src/antd/index.ts",
    output: {
        dir:'dist/antd',
        format: 'es',
        exports: 'named', // 指定导出模式（自动、默认、命名、无）
        name:"ease.antd",
        preserveModules: true, // 保留模块结构
        preserveModulesRoot: 'src/antd', // 将保留的模块放在根级别的此路径下
      
    },
     plugins: [
        postcss({
        plugins: [autoprefixer(), cssnano()],
        extract: "style.css",
        }),
       
    ],
  
}
  
export default config