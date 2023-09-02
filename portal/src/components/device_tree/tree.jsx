import React, {useCallback} from 'react';
import {SearchTree} from '@components/tree';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const DeviceTree = ({checkedKeys, onCheck}) => {
    const {t} = useTranslation();
    const treeData = useSelector((state) => state.app.thingDevices);
    const thingDevicesMap = useSelector((state) => state.app.thingDevicesMap); // [checkedKeysCount, setCheckedKeysCount] = useState(0),
    // { flatLeafs, flatLeafKeys } = useMemo(() => {
    //     const tempFlatLeafs = tree2Flat({
    //             treeData,
    //             toType: 'array'
    //         }).filter(nodeData => typeof nodeData.children === 'undefined'),
    //         tempFlatLeafKeys = tempFlatLeafs.map(v => v.key);
    //     return {
    //         flatLeafs: tempFlatLeafs,
    //         flatLeafKeys: tempFlatLeafKeys
    //     };
    // }, [treeData]),

    const onCheckCallback = useCallback(
        (selectedKeys, selectedNodes) => {
            const thingIds = selectedNodes.map((item) => item.thingId);
            const selectedNodesIds = selectedNodes
                .filter((item) => item.type == 'thing_device')
                .map((item2) => item2.key);
            onCheck && onCheck(selectedNodesIds, thingIds);
        },
        [onCheck, thingDevicesMap],
    );
    return (
        <SearchTree
            treeData={treeData}
            checkedKeys={checkedKeys} // placeholder={`${checkedKeysCount} / ${flatLeafs.length}`}
            placeholder={t('请输入')}
            onCheck={onCheckCallback}
        />
    );
};

export default DeviceTree;
