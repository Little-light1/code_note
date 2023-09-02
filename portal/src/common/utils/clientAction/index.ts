/*
 * @Author: sun.t
 * @Date: 2021-11-14 17:04:37
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-11-10 15:35:01
 */
import {runtime} from '@/app/runtime';
import {saveBatchOpnLog} from '@services/operation_logs_view';
import moment from 'moment';
import {ClientActionReport, ClientActionReportProps} from './actionReport';
import {RecordAction} from './types';

const ProxyClientActionReport: any = (function () {
    let instance: ClientActionReport;
    return function (args: ClientActionReportProps) {
        // 代理函数仅作管控单例
        if (instance) {
            return instance;
        }

        instance = new ClientActionReport(args);
        return instance;
    };
})();

export {default as initReactTrack} from './initReactTrack';
const SYSTEMS: Record<string, string> = {
    oc: '0',
    am: '2',
    dataplat: '4',
    bi: '3',
    sphm: '1',
};
export const report: ClientActionReport = new ProxyClientActionReport({
    strategy: 'immediately',
    reportActionTypes: ['add', 'modify', 'delete', 'query', 'export', 'import'],
    report: (actions: RecordAction[]) => {
        const {dicts, userInfo} = runtime.store.getState().app; // eslint-disable-next-line @typescript-eslint/naming-convention

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const {busi_app = {}} = dicts;
        const submitData = actions.map(
            ({action, desc, position, result, time, system = 'oc'}) => {
                const sysDictDataCode = SYSTEMS[system] || '0';
                const sysName = busi_app[sysDictDataCode]?.dictdataName ?? '';
                return {
                    busiType: sysDictDataCode,
                    // 默认门户
                    logType: sysDictDataCode === '0' ? '0' : '1',
                    // 门户默认“系统级别”
                    opnBehavior: `opn_${action}`,
                    // 这里耦合了数据字典的code定义
                    opnContext: desc,
                    opnName: userInfo?.userName ?? '',
                    opnPosition: (sysName ? [sysName] : [])
                        .concat(position)
                        .join('-'),
                    // {系统名称}-{最小级别菜单名称}-{按钮或链接名称}
                    opnResult: result === 'success' ? '0' : '1',
                    opnTime: moment(time).format('YYYY-MM-DD HH:mm:ss'),
                    opnUser: userInfo?.loginName ?? '',
                };
            },
        );
        saveBatchOpnLog(submitData).then(() => {
            // eslint-disable-next-line no-console
            console.log('save action success');
        });
    },
});
export const logError = report.error.bind(report);
