import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Input} from 'antd';
import {SearchTree} from '../components/Tree';
import 'antd/lib/style/index.css';
import 'antd/lib/style/default.css';
import 'antd/lib/tree/style/index.css';
import 'antd/lib/input/style/index.css';
import deviceTreeByOrg from './mock/deviceTreeByOrg.json';
import deviceTreeByModel from './mock/deviceTreeByModel.json';

const {Search} = Input;

export default {
    title: 'Example/SearchTree',
    component: SearchTree,
} as ComponentMeta<typeof SearchTree>;

const Template: ComponentStory<typeof SearchTree> = (args) => <SearchTree {...args} />;

export const SearchTreeTemplate = Template.bind({});
SearchTreeTemplate.args = {
    treeData: deviceTreeByOrg,
    fieldNames: {key: 'id', title: 'name'},
    defaultExpandAll: true,
};
SearchTreeTemplate.storyName = '查询树';

export const MixinSearchTreeTemplate = () => {
    const [searchValue, setSearchValue] = useState('');

    return (
        <div style={{height: '100%', width: 500}}>
            <Search style={{marginBottom: 8}} placeholder="请输入查找条件" onSearch={setSearchValue} />
            <div style={{display: 'flex', height: '100%'}}>
                <div style={{minWidth: '50%'}}>
                    <SearchTree
                        defaultExpandAll
                        isShowSearch={false}
                        treeData={deviceTreeByOrg}
                        searchValue={searchValue}
                        fieldNames={{key: 'id', title: 'name'}}
                    />
                </div>
                <div style={{minWidth: '50%'}}>
                    <SearchTree
                        defaultExpandAll
                        isShowSearch={false}
                        treeData={deviceTreeByModel}
                        searchValue={searchValue}
                        fieldNames={{key: 'id', title: 'name'}}
                    />
                </div>
            </div>
        </div>
    );
};
MixinSearchTreeTemplate.storyName = '组合';
