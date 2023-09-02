import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Input} from 'antd';
import {SearchTreeSelect} from '../components/Tree';
import 'antd/lib/style/index.css';
import 'antd/lib/style/default.css';
import 'antd/lib/tree/style/index.css';
import 'antd/lib/input/style/index.css';
import deviceTreeByOrg from './mock/deviceTreeByOrg.json';
import deviceTreeByModel from './mock/deviceTreeByModel.json';

const {Search} = Input;

export default {
    title: 'Example/SearchTreeSelect',
    component: SearchTreeSelect,
} as ComponentMeta<typeof SearchTreeSelect>;

const Template: ComponentStory<typeof SearchTreeSelect> = (args) => <SearchTreeSelect {...args} />;

export const SearchTreeSelectTemplate = Template.bind({});
SearchTreeSelectTemplate.args = {
    treeData: deviceTreeByOrg,
    fieldNames: {key: 'id', title: 'name'},
    defaultExpandAll: true,
};
SearchTreeSelectTemplate.storyName = '查询下拉树';
