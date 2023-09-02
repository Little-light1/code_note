export type ActionType = String;

export type DefaultAction = Omit<Action, 'id'>;

export interface InitReactTrack {
    onClick?: (message: any) => void;
    defaultAction?: DefaultAction;
}

// 用户行为
export interface Action {
    system?: string; // 系统

    module?: string; // 模块

    id: string; // 行为唯一ID

    name?: string; // 行为名称

    desc?: string; // 行为描述

    action?: ActionType; // 行为类型

    extra?: any; // 附加信息

    result?: 'success' | 'fail'; // 行为结果

    wait?: boolean; // 是否等待

    waitingTime?: number; // 等待时长

    position?: string[] | string; // position: 位置描述
}

export interface ElementProps {
    action: Action;
    [key: string]: any;
}

// 用户行为
export interface UserAction extends Action {
    module: string;
}
