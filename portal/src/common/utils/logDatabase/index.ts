import packageJson from '@/../package.json';
import {LogErrorProps} from '@gwaapp/ease/dist/components/Runtime/App/types';
import {getDatabase} from './database';
import {Log, FullLog, LevelType} from './types';
import {getBrowserType} from './browserInfo';

export class ClientLogReporter {
    // 日志上报条数限制，默认前10条，若设置为null，则数据库日志全部上报
    private limit: number | null = 10;

    private static instance: ClientLogReporter;

    private lastLog: FullLog | null;

    private logQueue: FullLog[]; // 当前是否正在插入，若未正在插入，则插入新日志时，重新启动插入队列

    private isInserting: boolean;

    private timer: NodeJS.Timer | null;

    static sharedInstance(): ClientLogReporter {
        if (!this.instance) {
            this.instance = new ClientLogReporter();
        }

        return this.instance;
    }

    private constructor() {
        this.lastLog = null;
        this.logQueue = [];
        this.isInserting = false;
        this.timer = null;
        this.addErrorEventListener();
    }

    info(log: Log) {
        this.insert(log, LevelType.Error);
    }

    warn(log: Log) {
        this.insert(log, LevelType.Warn);
    }

    error(log: Log) {
        this.insert(log, LevelType.Error);
    }
    /**
     * 日志自动上报启动，仅需在app入口处设置
     * @param interval 日志上报间隔，默认10分钟一次
     */

    async start(interval: number = 10 * 60 * 1000, limit: number | null = 10) {
        this.limit = limit;
        const db = await getDatabase();
        db.waitForLeadership().then(() => {
            this.timer && clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.report();
            }, interval);
        });
    }

    /**
     * 在队列插入一条新日志
     * @param log 日志
     * @param level 日志等级
     * @returns
     */
    private insert(log: Log, level: LevelType) {
        if (!log || !log.content) {
            return;
        } // 获取当前存储的用户信息

        const userInfo = JSON.parse(
            window.localStorage.getItem('userInfo') || '{}',
        );
        const data: FullLog = {
            ...log,
            level,
            frequency: 1,
            timestamp: new Date().getTime().toString(),
            userId: userInfo.id || null,
            userName: userInfo.userName || null,
            version: packageJson.version,
            browserType: getBrowserType(),
        };
        this.logQueue.push(data);

        if (!this.isInserting) {
            this.queueInsert();
        }
    }

    private addErrorEventListener() {
        window.addEventListener('error', (error) => {
            const logContent = {
                href: error.target?.location.href,
                message: error.message,
            };
            const log: Log = {
                content: JSON.stringify(logContent),
            };
            this.error(log);
        });
    }
    /**
     * 匹配数据当前要存储的数据与上一条存储数据是否内容一致
     * @param pre 上一条存储数据
     * @param current 当前存储数据
     * @returns true: 一致  false: 不一致
     */

    private static isSameLog(pre: FullLog, current: FullLog): boolean {
        if (
            pre.level === current.level &&
            pre.content === current.content &&
            pre.pageKey === current.pageKey &&
            pre.pageName === current.pageName &&
            pre.userId === current.userId &&
            pre.userName === current.userName &&
            pre.version === current.version &&
            pre.browserType === current.browserType
        ) {
            return true;
        }

        return false;
    }

    /**
     * 更新数据库连续次数
     * @param oldData 数据库旧数据
     * @returns
     */
    private update = async () => {
        const db = await getDatabase();

        if (this.lastLog && this.lastLog.frequency > 1) {
            const lastLog = await db.logs.findOne({
                selector: {
                    timestamp: this.lastLog.timestamp,
                },
            });
            await lastLog.update({
                $set: {
                    frequency: this.lastLog.frequency,
                },
            });
        }
    };

    static async remove() {
        const db = await getDatabase();
        await db.remove();
    }
    /**
     * 队列插入
     */

    private async queueInsert() {
        if (this.logQueue.length > 0) {
            this.isInserting = true;
            const db = await getDatabase();
            const log = this.logQueue.shift()!;
            const inDuration =
                this.lastLog &&
                Number(log.timestamp) - Number(this.lastLog.timestamp) <=
                    30 * 1000;

            if (
                this.lastLog &&
                ClientLogReporter.isSameLog(this.lastLog, log) &&
                this.lastLog.frequency < 1000 &&
                inDuration
            ) {
                this.lastLog.frequency += 1;
                await this.queueInsert();
            } else {
                this.update().finally(() => {
                    db.logs.insert(log).finally(() => {
                        // 记录上次的日志记录
                        this.lastLog = log;
                        this.queueInsert();
                    });
                });
            }
        } else {
            this.update().finally(() => {
                this.isInserting = false;
            });
        }
    }

    // 日志上报
    private async report() {
        const db = await getDatabase();
        const logsQuery = db.logs.find().limit(this.limit);
        const data = await logsQuery.exec();

        if (data.length === 0) {
            return;
        }

        const logs = data.map((item) => item.toJSON()) as FullLog[];
        console.log('logs======', logs);
        await logsQuery.remove();
    }
}
const logReporter = ClientLogReporter.sharedInstance();
export const logError = (props: LogErrorProps) => {
    logReporter.error({
        content: props.msg || '',
    });
};
export default logReporter;
