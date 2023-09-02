## 依赖库

1. i18next https://www.i18next.com/overview/api
2. react-datasheet https://github.com/nadbm/react-datasheet
3. xlsx

## ChangeLog

-   1.1.34(20230726)

    1. 修改 dnd 版本

    1.1.33(20230711)

    1. 修改 useReColumnsWidth,去除滚动条宽度

-   1.1.32(20230711)

    1. 修改 useReColumnsWidth,去除滚动条宽度

-   1.1.31(20230711)

    1. 修改 useReColumnsWidth

-   1.1.30(20230517)

    1. 去除 columns 宽度大于容器宽度等分的功能

-   1.1.29(20230517)

    1. 修复 useScroll 不生效的问题

-   1.1.28(20230517)

    1. 对 EditTable 添加 td 的样式,Table 的 columns 最后一列自适应(重新上传)

-   1.1.27(20230517)

    1. 对 EditTable 添加 td 的样式,Table 的 columns 最后一列自适应(重新上传)

-   1.1.26(20230517)

    1. 对 EditTable 添加 td 的样式,Table 的 columns 最后一列自适应

-   1.1.25(20230516)

    1. 对 Table 的 columns 宽度进行格式化

-   1.1.24(20230324)

    1. [UPDATE] react 版本升级至 18.2.0

-   1.1.23(20230303)

    1. [FIX] 扩展页面初始化成功回调函数

-   1.1.22(20221214)

    1. [FIX] 调整 package.json 入口定义

-   1.1.22(20221209)

    1. [FIX] 页面渲染出错提示 message 展示

-   1.1.21(20221209)

    1. [FIX] 增加页面出错信息提示

-   1.1.20(20221204)

    1. [FIX] 增加页面出错时多语言
    2. [FEATURE] 调整 trigger 函数第二个参数为 props，支持 trigger 时传递参数
    3. [FIX] Modal 组件关闭逻辑优化

-   1.1.18(20221130)

    1. [FIX]Table 列头 resize 异常问题修复

-   1.1.17(20221128)

    1. [FIX]Table 中 contextMenu 在模态窗口中展示异常问题

-   1.1.16(20221128)

    1. [FIX]增加列表头 Tooltip 展示完整文字

-   1.1.15(20221127)

    1. [FIX]GRequest 增加 isBusinessError 判断方法，允许外部自定义通用的业务错误逻辑

-   1.1.14(20221124)

    1. [FIX]Table 列头拖拽问题，列头显示隐藏问题，虚拟编辑列表新增删除问题，隐藏流程图组件
    2. [FEATURE] 增加 Table 列头 title 属性

-   1.1.13(20221122)

    1. [FEATURE]增加 GRequest 用户行为参数

-   1.1.12(20221122)
    1. [FEATURE]增加用户行为日志
-   1.1.11(20221121)

    1. [FEATURE]增加多语言机制

-   1.1.8(20221118)

    1. [FEATURE]将多语言初始化独立出 Runtime，以解决 pageConfig 中需要使用多语言场景（有破坏性，使用项目需要调整）

-   1.1.7(20221118)

    1. [FEATURE]将多语言初始化独立出 Runtime，以解决 pageConfig 中需要使用多语言场景

-   1.1.6(20221110)

    1. [BUG]Modal 支持 footer 为 null 场景

-   1.1.5(20221109)

    1. [BUG]流程图缺陷修复

-   1.1.4(20221107)

    1. [BUG]流程图缺陷修复

-   1.1.3(20221107)

    1. [BUG]流程图缺陷修复
    2. [BUG]ANTD 样式缺陷修复

-   1.1.2(20221101)

    1. [BUG]流程图缺陷修复

-   1.1.1(20221101)

    1. [BUG]流程图缺陷修复

-   1.1.0(20221031)

    1. [FEATURE]打包方式调整
    2. [FEATURE]流程图组件

-   1.0.115(20221014)

    1. [BUG]虚拟编辑表格表头异常缺陷修复

-   1.0.114(20221013)

    1. [BUG]虚拟编辑表格追加新行，初始化问题

-   1.0.113(20221012)

    1. [BUG]虚拟编辑表格缺陷修复

-   1.0.112(20220914)

    1. 虚拟编辑表格原数据中存在“\_”,识别异常缺陷

-   1.0.111(20220914)

    1. 虚拟编辑表格原数据中存在“\_”,识别异常缺陷

-   1.0.110(20220908)

    1. xlsxReader 读取异常 excel 报错问题处理

-   1.0.109(20220908)

    1. 表格 Index 默认配置 canResize 改为 false

-   1.0.107(20220908)

    1. 虚拟编辑表格 增加 rowSelection
    2. xlsxReader 读取异常 excel 报错问题处理

-   1.0.106(20220906)

    1. 编辑表格 & 虚拟编辑表格 原始数据 null/undefined 显示 --

-   1.0.105(20220906)

    1. 虚拟编辑表格

-   1.0.104(20220901)

    1. 虚拟表格增加 Empty 效果

-   1.0.103(20220826)

    1. 优化编辑表格数据量过多卡顿问题

-   1.0.102(20220824)
    1. 表格编辑中，关联场景下，renderEdit 不触发问题
    2. 优化直接点击提交数据场景，优先 confirm
-   1.0.98(20220809)

    1. 调整 Runtime i18n 使用

-   1.0.97(20220808)

    1. 调整 Runtime i18n 使用

-   1.0.96(20220803)

    1. usePage 缺陷
    2. 解决 shouldCellUpdate 阻止渲染问题，将其变成可选项
    3. 优化表格列宽调整功能

-   1.0.95(20220721)

    1. 基础表格组件

-   1.0.94(20220715)

    1. 统一表格类型声明

-   1.0.93(20220715)

    1. 增加表格组件 contextMenu 属性用来关闭列头右键菜单
    2. 优化编辑表格组件性能
    3. 编辑表格暴露名称调整
    4. 修复虚拟表格右键不生效问题

-   1.0.92(20220707)

    1. GRequest 增加统一 timeout 设置

-   1.0.91(20220707)

    1. LazyLoader 支持失败重试机制，默认为 5 次
    2. 页面失败增加重载机制
    3. 统一组件库错误提示

-   1.0.90(20220706) 2. 虚拟表格组件支持 rowSelection

-   1.0.89(20220705)

    1. 虚拟表格组件

-   1.0.88(20220702)
    1. 树组件帮助函数调整
-   1.0.87(20220630)

    1. GRequest 重复提示错误问题修复

-   1.0.86(20220622)

    1. GlobalMask 增加超时允许关闭机制

-   1.0.84(20220621)

    1. gRequest 函数错误缺陷修复，arraybuffer 等数据类型没有 code 节点

-   1.0.83(20220615)

    1. gRequest 函数错误抛出优化，项目对应使用作调整
    2. runtime 注入 handlers

-   1.0.82(20220613)
    1. 表格列头传递字符串会无法 resize 问题
    2. usePage 增加自身跳转自身的 Update 逻辑
-   1.0.81(20220610)

    1. 解决 push 不会清空 search&hash 问题 https://github.com/remix-run/history/issues/859

-   1.0.80(20220610)

    1. 增加 HistoryManager search 参数类型

-   1.0.79(20220608)

    1. 增加 Table titleAlign & ellipsis 机制
    2. 优化运行时代码 & 导出内容

-   1.0.78(20220526)

    1. 修改 FlexContainer

-   1.0.77(20220525)

    1. 将 runtime 运行时生成的 historyManager 与 react-router 打通，项目引用 EaseApp 的时候不再需要定义 BrowserRouter 等
    2. 增加 FlexContainer 组件，处理 flex 场景下 Component 需要明确宽高的问题

-   1.0.76(20220509)

    1. cell 渲染多次问题
    2. excel 读取处理空 sheet

-   1.0.75(20220508) 3. 合并基础样式 4. 调整 styles

-   1.0.74(20220507)

    1. 增加代码健壮性
    2. 增加 pushPath 参数 state

-   1.0.73(20220427)

    1. 修复 1.68Bug

-   1.0.72(20220426)
    1. 修复 1.68Bug
-   1.0.71(20220426)

    1. 修复 1.68Bug

-   1.0.70(20220425)

    1. 修复 1.68Bug

-   1.0.68(20220425)
    1. 调整 usePage 触发逻辑,支持相同页面多页签打开
-   1.0.67(20220421)

    1. 调整 usePage 触发逻辑

-   1.0.66(20220420)

    1. 表格列隐藏失效问题修复
    2. 查询树组件

-   1.0.63(20220416)

    1. 表格拖拽和列宽调整冲突问题
    2. 列头右键菜单默认样式调整，缩放，当列头过多，上下空间都不够的时候会显示异常
    3. 表格 Esc 提示时常调整 10->3

-   1.0.59(20220412)

    1. 导入文件格式错误

-   1.0.58(20220412)

    1. 门户通用样式

-   1.0.57(20220411)

    1. 修复 Page 组件错误状态不恢复问题
    2. 增加 withRouter 高阶组件，注入 react-router 相关参数（location，navigate，params）
    3. XlsxReader 增加 onError 函数，抛出异常
    4. XlsxReader 增加 openFile 方法，支持主动打开 File 窗口

-   1.0.56(20220411)
    1. 增加自动刷新逻辑
-   1.0.54(20220404)

    1. 增加 connectPage

-   1.0.53(20220402)

    1. 修复 modal 打开多个问题
    2. 增加表格组件拖拽/列宽调整功能
    3. pushPath 跳转逻辑，去掉/

-   1.0.46(20220327)
    1. 增加针对 portal-antd 的样式复写 css
-   1.0.45(20220327)

    1. 表格组件问题，外部传入 errors，解决被覆盖问题

-   1.0.44(20220326)

    1. 修复导出组件 bug & 表格组件 bug

-   1.0.43(20220326)

    1. 修复导出组件 bug

-   1.0.42(20220326)

    1. 修复表格组件 bug

-   1.0.41(20220326)

    1. 修复表格组件 bug

-   1.0.40(20220324)

    1. 修复表格组件 bug

-   1.0.39(20220324)

    1. 增加 storybook 用例

-   1.0.38(20220324)

    1. <refactor!> 增加表格组件

-   1.0.37
    1. <refactor!> 增加本地 xlsx 读取组件

## 贡献、联系作者、License 等

孙涛 suntao1@goldwind.com.cn / 316597133@qq.com

## 备注

. 最新构建测试包存在问题 "@storybook/addon-interactions": "^6.5.0-alpha.39", https://github.com/eirslett/storybook-builder-vite/issues/242

    ```
        import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
        import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
        import { IExtra } from "./types";

        export type RootState = ReturnType<typeof store.getState>;
        export type AppDispatch = typeof store.dispatch;
        export type AppThunk<RootState = any, ReturnType = void | Promise<any>> = ThunkAction<ReturnType, RootState, IExtra<RootState>, AnyAction>;

        export const useAppDispatch = () => useDispatch<AppDispatch>();

        export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

    ```
