import {fetchThingDevices} from '@services/demo';
import {utils} from '@components/tree';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';

const {loopToAntdTreeData} = utils;
export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        fetchThingDevices().then((res) => {
            const {data} = res;
            dispatch(
                actions.set({
                    treeData: loopToAntdTreeData({
                        treeData: data,
                        titlePropName: 'name',
                        keyPropName: 'thingId',
                    }),
                }),
            );
        });
    };
