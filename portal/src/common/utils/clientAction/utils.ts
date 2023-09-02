export const formatTime2Second = (val: number) => `${val / 1000}s`;
export const formatMemory2Mb = (val: number) =>
    `${Math.floor(val / 1024 / 1024)}mb`; // const getNow = () => {
//     const date = new Date();
//     return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
// };

export const getNativeBrowserInfo = () => {
    // 获取浏览器原生数据
    const params: any = {}; // 获取性能相关参数

    if (performance) {
        // @ts-ignore
        params.usedJSHeapSize = formatMemory2Mb(
            performance.memory.usedJSHeapSize,
        ); // JS 对象（包括V8引擎内部对象）占用的内存
        // @ts-ignore

        params.totalJSHeapSize = formatMemory2Mb(
            performance.memory.totalJSHeapSize,
        ); // 可使用的内存
        // @ts-ignore

        params.jsHeapSizeLimit = formatMemory2Mb(
            performance.memory.jsHeapSizeLimit,
        ); // 内存大小限制
    }

    return params;
};
export const getFirstTiming = (timeout = 60 * 1000) =>
    new Promise((resolve) => {
        setTimeout(() => {
            const params: any = {};

            if (window.screen) {
                params.screenHeight = window.screen.height || 0; // 获取显示屏信息

                params.screenWidth = window.screen.width || 0; // params.color = screen.colorDepth || 0;
            }

            params.moreThan1sCount = performance
                .getEntriesByType('resource')
                .filter(
                    (v) => v.duration > 1000 && v.name.indexOf('aapp-api') < 0,
                ).length;

            if (navigator) {
                params.language = navigator.language || ''; // 获取所用语言种类

                params.userAgent = navigator.userAgent.toLowerCase(); // 运行环境
            }

            if (performance) {
                params.connectTime = formatTime2Second(
                    performance.timing.connectEnd -
                        performance.timing.connectStart,
                ); // TCP链接耗时

                params.responseTime = formatTime2Second(
                    performance.timing.responseEnd -
                        performance.timing.responseStart,
                ); // 等待服务器响应耗时（注意是否存在cache）

                params.renderTime = formatTime2Second(
                    performance.timing.domComplete -
                        performance.timing.domLoading,
                ); // 渲染处理

                params.activeTime = formatTime2Second(
                    performance.timing.domInteractive -
                        performance.timing.navigationStart,
                ); // 可交互

                params.t3Time = formatTime2Second(
                    performance.timing.loadEventEnd -
                        performance.timing.navigationStart,
                ); // 内容加载完毕，即 T3：
            }

            resolve(params);
        }, timeout);
    });
