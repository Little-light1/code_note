/// 日志上报id类型枚举
export enum LogActionID {
    // 保存基本信息配置
    SaveBaseInfo = 'saveBaseInfo',
    // 背景页面配置 -> 新建
    AddBGConfig = 'addBGConfig',
    // 背景页面配置 -> 编辑
    ModifyBGConfig = 'modifyBGConfig',
    // 背景页面配置 -> 删除
    DeleteBGConfig = 'deleteBGConfig',
    // 通用配置 -> 新建
    AddCommonConfig = 'addCommonConfig',
    // 通用配置 -> 编辑
    ModifyCommonConfig = 'modifyCommonConfig',
    // 通用配置 -> 删除
    DeleteCommonConfig = 'deleteCommonConfig',
}
