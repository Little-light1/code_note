/*
 * @Author: zhangyu
 * @Date: 2022-06-22 09:47:06
 * @LastEditors: zhangyu
 * @LastEditTime: 2022-09-20 10:22:02
 * @Description:
 *
 */
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {searchDocument} from '@/services/helpDoc';
import {message} from 'antd';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {highlight} from '../helper';

const {t} = i18nIns;

// 搜索文档内容
export const searchContent =
    (props: PageProps, e: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const text = e;
        const action = {
            id: 'queryDocument',
            module: id,
            desc: t('查询文档'),
        };
        report.action({
            id: 'queryDocument',
            module: id,
            position: [props.menu?.menuName ?? '', t('查询')],
            action: 'query',
            wait: true,
        });
        const {data, code, msg} = await searchDocument(text);

        if (code === '200') {
            for (const item of data) {
                item.title = highlight(item.title, text);
                item.content = highlight(item.content, text);
            }

            dispatch(
                actions.set({
                    searchResult: data,
                }),
            );
            document.getElementById('helpSearchDropdownLink')?.click();
            report.success(action);
        } else {
            message.error(msg);
            report.fail(action);
        }
    };
