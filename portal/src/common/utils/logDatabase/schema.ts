export const logSchema = {
    title: 'logs',
    description: 'store logs',
    version: 0,
    primaryKey: 'timestamp',
    type: 'object',
    properties: {
        // 日志记录时间戳，目前设置为日志唯一标识，同一时间戳只能存在一条记录
        timestamp: {
            type: 'string',
            maxLength: 100,
        },
        // 日志等级
        level: {
            type: 'string',
        },
        // 日志内容
        content: {
            type: 'string',
        },
        // 连续次数
        frequency: {
            type: 'number',
            default: 1,
            minimum: 1,
        },
        // 页面名称
        pageName: {
            type: 'string',
        },
        // 页面标识
        pageKey: {
            type: 'string',
        },
        // 用户id，未登录时则不存在
        userId: {
            type: 'string',
        },
        // 用户名，未登录时则不存在
        userName: {
            type: 'string',
        },
        // 系统版本号
        version: {
            type: 'string',
        },
        // 浏览器类型
        browserType: {
            type: 'string',
        },
    },
    required: ['timestamp', 'level', 'content'],
};
