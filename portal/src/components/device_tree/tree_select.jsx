import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {SearchTreeSelect} from '../tree';

const DeviceTree = ({checkedKeys, inputClassName, onCheck}) => {
    const treeData = useSelector((state) => state.app.thingDevices);

    const {t} = useTranslation();

    return (
        <SearchTreeSelect
            inputClassName={inputClassName}
            treeData={treeData}
            checkedKeys={checkedKeys}
            searchPlaceholder={t('请输入')}
            onCheck={(selectedKeys, selectedNodes) => {
                const thingIds = selectedNodes.map((item) => item.thingId);
                const selectedNodesIds = selectedNodes
                    .filter((item) => item.type == 'thing_device')
                    .map((item2) => item2.key);
                onCheck && onCheck(selectedNodesIds, thingIds);
            }}
        />
    );
};

export default DeviceTree;
