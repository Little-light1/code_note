/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable no-console */

/* eslint-disable no-underscore-dangle */
import moment from 'moment';
import {getNativeBrowserInfo, getFirstTiming} from './utils';
import {
    Action,
    ActionType,
    RecordAction,
    ReportStrategy,
    WaitingAction,
} from './types';

export interface ClientActionReportProps {
    strategy?: ReportStrategy; // 上送策略 立即/timeout

    reportInterval?: number; // 上送间隔

    clientMonitorInterval?: number; // 浏览器信息间隔

    firstTiming?: number; // 首次记录客户端表现

    reportActionTypes?: ActionType[]; // 需要上报类型

    report?: (actions: RecordAction[]) => void; // 上报回调
}
const _log = console.log;
const _error = console.error;
const _warn = console.warn;
const _info = console.info;
export class ClientActionReport {
    actionQueue: RecordAction[];

    strategy: ReportStrategy;

    clientMonitorInterval: number;

    clientMonitorInstance: NodeJS.Timer | null;

    reportInterval: number;

    reportActionTypes: ActionType[];

    waitingQueue: {
        [key: string]: WaitingAction;
    };

    report?: (actions: RecordAction[]) => void;

    static ActionTypes: ActionType[] = [
        'firstTiming',
        'performance',
        'pageEnter',
        'pageExit',
        'pageStay',
        'click',
        'log',
        'error',
        'warn',
        'info',
    ];

    constructor({
        strategy = 'immediately',
        clientMonitorInterval = 5 * 60 * 1000,
        reportInterval = 5 * 60 * 1000,
        firstTiming = 60 * 1000,
        reportActionTypes = ['click', 'error'],
        report,
    }: ClientActionReportProps) {
        this.reportActionTypes = reportActionTypes;
        this.waitingQueue = {};
        this.actionQueue = [];
        this.strategy = strategy;
        this.clientMonitorInterval = clientMonitorInterval;
        this.reportInterval = reportInterval;
        this.clientMonitorInstance = null;
        this.report = report; // 初始化全局console
        // this.initConsole();
        // 开启上送进程

        if (strategy === 'interval') {
            setInterval(() => {
                this._report();
            }, reportInterval);
        } // 开启清理等待进程

        setInterval(() => {
            const newWaitingQueue: {
                [key: string]: WaitingAction;
            } = {};
            const now = new Date().getTime();
            Object.keys(this.waitingQueue).forEach((uuid) => {
                const waitingAction = this.waitingQueue[uuid];

                if (
                    !waitingAction.expirationTime ||
                    waitingAction.expirationTime < now
                ) {
                    newWaitingQueue[uuid] = waitingAction;
                }
            });
            this.waitingQueue = newWaitingQueue;
        }, 10 * 1000); // 开启性能监听

        this.monitorClient(); // 记录first-timing

        getFirstTiming(firstTiming).then((params) => {
            console.log(params, '+++======');
            const time = new Date().getTime();
            this.appendQueue({
                time,
                timeStr: moment(time).format('YYYY-MM-DD HH:mm:ss'),
                action: 'firstTiming',
                id: 'AAPP',
                desc: 'firstTiming',
                extra: params,
            });
        });
    }

    initConsole() {
        console.error = this.error;
        console.info = this.info;
        console.log = this.log;
        console.warn = this.warn;
    }

    appendQueue(action: RecordAction) {
        this.actionQueue.push(action);

        if (this.strategy === 'immediately') {
            this._report();
        }
    } // 开始监听客户端性能指标

    monitorClient() {
        this.clientMonitorInstance = setInterval(() => {
            const params = getNativeBrowserInfo();
            const time = new Date().getTime();
            this.appendQueue({
                time,
                timeStr: moment(time).format('YYYY-MM-DD HH:mm:ss'),
                action: 'performance',
                id: 'AAPP',
                desc: 'performance',
                extra: params,
            });
        }, this.clientMonitorInterval);
    } // 停止监听客户端性能指标

    stopMonitorClient() {
        this.clientMonitorInstance && clearInterval(this.clientMonitorInstance);
        this.clientMonitorInstance = null;
    } // eslint-disable-next-line class-methods-use-this

    error(...args: any) {
        _error.apply(console, args);
    } // eslint-disable-next-line class-methods-use-this

    info(...args: any) {
        _info.apply(console, args);
    } // eslint-disable-next-line class-methods-use-this

    warn(...args: any) {
        _warn.apply(console, args);
    } // eslint-disable-next-line class-methods-use-this

    log(...args: any) {
        _log.apply(console, args);
    }

    action(actionArgs: Action) {
        const time = new Date().getTime();
        const timeStr = moment(time).format('YYYY-MM-DD HH:mm:ss:SSS');
        const {
            id,
            name,
            desc,
            module = 'aapp',
            system = '',
            action = 'click',
            extra,
            wait,
            position,
            result,
        } = actionArgs;
        console.log(
            `%c module:${module}; id:[${id}]; desc:[${desc}]; position:[${
                position ? JSON.stringify(position) : ''
            }]%c ${timeStr} %c ${extra ? JSON.stringify(extra) : ''}`,
            `background-color: #697723;color:white;padding:1px 3px;text-align: center;`,
            `background-color: #DAA520;color:white;padding:1px 3px;`,
            `background: none;`,
        );

        if (wait) {
            this.recordWaitingAction(actionArgs);
            return;
        }

        if (this.waitingQueue[`${module}-${id}`]) {
            this.finishWaitingAction(actionArgs);
            return;
        }

        this.appendQueue({
            id,
            name,
            desc,
            system,
            action,
            extra,
            time,
            timeStr,
            position,
            result: result || 'success',
        });
    }

    recordWaitingAction(actionArgs: Action) {
        const time = new Date().getTime();
        const {id, module = 'aapp', waitingTime} = actionArgs;
        this.waitingQueue[`${module}-${id}`] = {
            ...actionArgs,
            time,
            ...(waitingTime
                ? {
                      expirationTime: time + waitingTime,
                  }
                : {}),
        };
    }

    updateWaitingAction(actionArgs: Action) {
        const {id, module, name, desc, extra, action} = actionArgs;
        const waitingAction = this.waitingQueue[`${module}-${id}`];

        if (typeof waitingAction === 'undefined') {
            console.error(
                `%c ${module}-${id} %c The action has not started, or has timed out`,
                `background-color: #697723;color:white;padding:1px 3px;text-align: center;`,
                `background: none;`,
            );
            return;
        }

        this.waitingQueue[`${module}-${id}`] = Object.assign(
            this.waitingQueue[`${module}-${id}`],
            {
                name: name || waitingAction.name,
                desc: desc || waitingAction.desc,
                extra: extra || waitingAction.extra,
                action: action || waitingAction.action,
            },
        );
    }

    finishWaitingAction(actionArgs: Action, clean = true) {
        const {id, module, system, name, desc, extra, action, result} =
            actionArgs;
        const waitingAction = this.waitingQueue[`${module}-${id}`];

        if (typeof waitingAction === 'undefined') {
            console.error(
                `%c ${module}-${id} %c The action has not started, or has timed out`,
                `background-color: #697723;color:white;padding:1px 3px;text-align: center;`,
                `background: none;`,
            );
            return;
        } // 这里上送的时候需要调整至当前完成时间，而非整个动作的开始时间
        // const time = this.waitingQueue[`${module}-${id}`].time;
        // const timeStr = moment(time).format('YYYY-MM-DD HH:mm:ss:SSS');

        const time = new Date().getTime();
        const timeStr = moment(time).format('YYYY-MM-DD HH:mm:ss:SSS');
        const recordAction = Object.assign(
            this.waitingQueue[`${module}-${id}`],
            {
                desc: desc || waitingAction.desc,
                name: name || waitingAction.name,
                extra: extra || waitingAction.extra,
                action: action || waitingAction.action,
                system: system || waitingAction.system,
                time,
                timeStr,
                result: result || waitingAction.result,
            },
        );
        clean && delete this.waitingQueue[`${module}-${id}`];
        this.appendQueue(recordAction);
    }

    success(actionArgs: Action) {
        this.finishWaitingAction({...actionArgs, result: 'success'});
    }

    fail(actionArgs: Action) {
        this.finishWaitingAction({...actionArgs, result: 'fail'}, false);
    }

    _report() {
        if (this.actionQueue.length) {
            const filterReportActions = this.actionQueue.filter(
                ({action}) => action && this.reportActionTypes.includes(action),
            );

            if (filterReportActions.length) {
                if (this.report) {
                    this.report(filterReportActions);
                } else {
                    console.log(filterReportActions);
                }
            }

            this.actionQueue = []; // // TODO：上送逻辑
            // console.log('--------开始上送日志--------');
            // setTimeout(() => {
            //     console.log(this.actionQueue);
            //     this.actionQueue = [];
            // }, 1000);
        }
    }
}
