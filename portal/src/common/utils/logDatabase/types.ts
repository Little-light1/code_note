/// 日志等级
export enum LevelType {
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
} /// 存储日志记录时的对象

export interface Log {
    // 日志内容
    content: string; // 页面名称

    pageName?: string | null; // 页面标识

    pageKey?: string | null;
} /// 查询的完整日志记录对象

export interface FullLog extends Log {
    // 日志等级
    level: LevelType; // 连续产生次数

    frequency: number; // 日志记录时间戳，目前设置为日志唯一标识，同一时间戳只能存在一条记录

    timestamp: string; // 用户id，未登录时则不存在

    userId: string | null; // 用户名，未登录时则不存在

    userName: string | null; // 当前版本号

    version: string; // 浏览器型号

    browserType: string;
}
