// 挂载window运行时对象
export function mountWindowRuntime(app: string, runtime: any) {
    // 保留子系统的运行时
    !window.runtime && (window.runtime = {});
    app && runtime && (window.runtime[app] = runtime);
}
