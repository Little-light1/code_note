/*
 * @Author: sun.t
 * @Date: 2022-06-30 17:13:59
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-07-15 22:20:53
 */
import React, {useCallback, useEffect, useMemo, useRef, useState, Key} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Button, InputNumber, Input, Select} from 'antd';
import {EaseEditableTableInstance, EditableVirtualTable, EditableTable} from '../components/Table';
import DatePickerWrapper from './components/DatePickerWrapper';
// import "antd/lib/style/index.less";
// import "antd/lib/style/default.css";
// import 'antd/lib/table/style/index.css';
// import 'antd/lib/pagination/style/index.css';
// import 'antd/lib/select/style/index.css';
// import 'antd/lib/input/style/index.css';
// import 'antd/lib/date-picker/style/index.css';
// import 'antd/lib/input-number/style/index.css';
// import 'antd/lib/tooltip/style/index.css';
// import 'antd/lib/message/style/index.less';
import '../antd/index';
import mockTable100 from './mock/table100.json';
import columns25 from './mock/columns25.json';
import dataC25 from './mock/dataC25.json';
import columnsResize from './mock/columnsResize.json';
import dataResize from './mock/dataResize.json';
import moment from 'moment';
import {EditStatus} from '../components/Table/types';
import FlexContainer from '../components/FlexContainer';
import info from './mock/info.json';
import testColumns from './mock/columns.json';
import _ from 'lodash';
import ModalProvider from '../components/Modal/ModalProvider';
import PageContainer from '../components/Page/Container/index';

const {Option} = Select;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/EditTable',
    component: EditableTable,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    // argTypes: {
    //   backgroundColor: { control: "color" },
    // },
} as ComponentMeta<typeof EditableTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditableTable> = (args) => <EditableTable {...args} />;

export const TableTemplate = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TableTemplate.args = {
    rowKey: 'name',
    showIndex: true,
    columns: [
        {
            title: '姓名超级长姓名超级长姓名超级长姓名超级长姓名超级长姓名超级长姓名超级长',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            sorter: true,
            width: 50,
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            ellipsis: true,
            sorter: true,
            width: 50,
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
            sorter: true,
            width: 50,
        },
    ],
    dataSource: mockTable100,
    onExtraChange: ({columns}) => console.log(columns),
};
TableTemplate.storyName = '简单用例';

// function range(start, end) {
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// }

// function disabledDate(current,) {
//   // Can not select days before today and today
//   return current && current < moment().endOf('day');
// }

// function disabledDateTime() {
//   return {
//     disabledHours: () => range(0, 24).splice(4, 20),
//     disabledMinutes: () => range(30, 60),
//     disabledSeconds: () => [55, 56],
//   };
// }

export const EditableVirtualTemplate = ({}) => {
    const tableRef = useRef<EaseEditableTableInstance>();
    const [dataSource, setDataSource] = useState(mockTable100);
    const [numberOptions] = useState(new Array(100).fill(0).map((v, index) => index + 1));
    const [editStatus, setEditStatus] = useState<EditStatus>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [isEdited, setIsEdited] = useState(false);

    const addOne = useCallback(
        (text, record, rowIndex) => {
            const {snapShoot} = tableRef.current.getFieldsValue();

            const addedDataSource = _.clone(snapShoot);

            const copyItem = _.clone(snapShoot[rowIndex]);

            copyItem.key = new Date().getTime();
            addedDataSource.splice(rowIndex + 1, 0, copyItem);

            setDataSource(addedDataSource);
        },
        [editStatus, dataSource],
    );

    const delOne = useCallback(
        (text, record, rowIndex) => {
            const clone = [...dataSource];
            clone.splice(rowIndex, 1);

            const addedDataSource = [...clone];

            setDataSource(addedDataSource);
        },
        [editStatus, dataSource],
    );

    const columns = useMemo(() => {
        return [
            {
                title: 'ID',
                dataIndex: 'Id',
                align: 'center',
                render: (text, record, index) => {
                    return index + 1;
                },
                width: 80,
            },
            {
                title: '班级',
                dataIndex: 'class',
                key: 'class',
                align: 'center',
                onCell: (_, index) => {
                    if (index === 2) {
                        return {rowSpan: 2};
                    }
                    if (index === 3) {
                        return {rowSpan: 0};
                    }
                    return {};
                    // if (index === 4) {
                    //   return { colSpan: 0 };
                    // }
                },
                canHide: false,
                width: 290,
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                renderEdit: () => <Input />,
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your name',
                        },
                        // {
                        //   validator: (rule, value) => {
                        //     return new Promise((resolve, reject) => {
                        //       const { snapShoot } = tableRef.current.getFieldsValue();
                        //       const validateUnique = snapShoot.find((record) => record.name === value);
                        //       if (validateUnique) {
                        //         reject("姓名重复");
                        //         return;
                        //       }
                        //       resolve(value);
                        //     });
                        //   },
                        // },
                    ],
                },
                canHide: false,
                width: 300,
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
                align: 'center',
                renderEdit: () => <InputNumber controls={false} />,
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your age',
                        },
                    ],
                },
                dependence: ['name'],
                canHide: false,
                width: 380,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render: (text, record, rowIndex, number) => {
                    if (text === 'male') return '男性';
                    if (text === 'female') return '女性';
                    return '';
                },
                renderEdit: () => (
                    <Select>
                        <Option value="male">男性</Option>
                        <Option value="female">女性</Option>
                    </Select>
                ),
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your sex',
                        },
                    ],
                },
                dependence: ['name'],
                editable: true,
                width: 80,
            },
            // {
            //     title: '学号(不可重复)',
            //     dataIndex: 'number',
            //     key: 'number',
            //     width: 150,
            //     renderEdit: () => {
            //         const {snapShoot} = tableRef.current.getFieldsValue();
            //         const selectedNumbers = snapShoot.map((record) => record.number);
            //         return (
            //             <Select>
            //                 {numberOptions.map((number) => (
            //                     <Option key={number} value={number} disabled={selectedNumbers.includes(number)}>
            //                         {number}
            //                     </Option>
            //                 ))}
            //             </Select>
            //         );
            //     },
            //     formProps: {
            //         rules: [
            //             {
            //                 required: true,
            //                 message: 'Please select your number',
            //             },
            //         ],
            //     },
            //     dependence: ['name'],
            // },
            // {
            //     title: '开始日期',
            //     dataIndex: 'startDate',
            //     key: 'startDate',
            //     width: 200,
            //     renderEdit: ({text, record, rowIndex, editRecord}) => {
            //         const endDate = editRecord['endDate'] ? editRecord['endDate'] : record['endDate'];
            //         return (
            //             // @ts-ignore
            //             <DatePickerWrapper
            //                 format="YYYY-MM-DD HH:mm:ss"
            //                 disabledDate={(current) => current.isAfter(moment(endDate))}
            //                 showTime={true}
            //             />
            //         );
            //     },
            //     formProps: {
            //         rules: [
            //             {
            //                 required: true,
            //                 message: 'Please input your startDate',
            //             },
            //         ],
            //     },
            //     dependence: ['name', 'endDate'],
            //     defaultValue: (record) => {
            //         let start = moment(record.endDate || '1999-02-03');
            //         start = start.subtract(1, 'd');
            //         return start.format('YYYY-MM-DD HH:mm:ss');
            //     },
            // },
            // {
            //     title: '结束日期',
            //     dataIndex: 'endDate',
            //     key: 'endDate',
            //     renderEdit: ({text, record, rowIndex, editRecord}) => {
            //         const startDate = editRecord['startDate'] ? editRecord['startDate'] : record['endDate'];
            //         return (
            //             // @ts-ignore
            //             <DatePickerWrapper
            //                 format="YYYY-MM-DD HH:mm:ss"
            //                 disabledDate={(current) => current.isBefore(moment(startDate))}
            //                 showTime={true}
            //             />
            //         );
            //     },
            //     width: 200,
            //     formProps: {
            //         rules: [
            //             {
            //                 required: true,
            //                 message: 'Please input your endDate',
            //             },
            //         ],
            //     },
            //     dependence: ['name', 'startDate'],
            //     defaultValue: (record) => {
            //         let end = moment(record.startDate || '1999-02-03');
            //         end = end.subtract(-1, 'd');
            //         return end.format('YYYY-MM-DD HH:mm:ss');
            //     },
            // },
            // {
            //     title: '住址',
            //     dataIndex: 'address',
            //     key: 'address',
            //     width: 200,
            //     renderEdit: () => (
            //         <Input
            //             onBlur={() => {
            //                 console.log('失去焦点');
            //             }}
            //             defaultValue={''}
            //         />
            //     ),
            //     dependence: ['name'],
            // },
            {
                title: '控制',
                dataIndex: 'control',
                width: 200,
                render: (text, record, rowIndex) => (
                    <>
                        <Button onClick={() => addOne(text, record, rowIndex)}>新增</Button>
                        <Button onClick={() => delOne(text, record, rowIndex)}>删除</Button>
                    </>
                ),
            },
        ];
    }, [addOne]);

    const submit = useCallback(() => {
        if (!tableRef.current) return;
        tableRef.current
            .submit()
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const restore = useCallback(() => {
        if (!tableRef.current) return;
        tableRef.current.restore();
    }, []);

    const getFieldsValue = useCallback(() => {
        if (!tableRef.current) return;
        console.log(tableRef.current.getFieldsValue());
    }, []);

    const onEdit = useCallback((status) => {
        setEditStatus([...status]);
        let currentIsEdited = false;
        status.forEach((rowEditStatus, rowIndex) => {
            if (rowEditStatus && Object.values(rowEditStatus).length) {
                currentIsEdited = true;
            }
        });
        setIsEdited(currentIsEdited);
    }, []);

    const validateCorrelation = useCallback(
        (status) => {
            if (!tableRef.current) return;
            const {snapShoot} = tableRef.current.getFieldsValue();

            const weight = {};

            snapShoot.forEach(({name}, rowIndex) => {
                if (!weight[name]) {
                    weight[name] = [];
                }
                weight[name].push(rowIndex);
            });

            Object.keys(weight).forEach((name) => {
                const rowIndexs = weight[name];
                if (rowIndexs.length > 1) {
                    rowIndexs.forEach((rowIndex) => {
                        if (!editStatus[rowIndex]) {
                            editStatus[rowIndex] = {name: {errors: []}};
                        } else {
                            if (editStatus[rowIndex].name) {
                                editStatus[rowIndex].name.errors = [];
                            } else {
                                editStatus[rowIndex].name = {errors: []};
                            }
                        }
                        editStatus[rowIndex].name.errors.push('姓名存在重复');
                    });
                }
            });

            setEditStatus([...editStatus]);
        },
        [editStatus],
    );
    let keys = [];
    const rowSelection = useMemo(
        () => ({
            selectedRowKeys,
            onChange: (key, rows) => {
                console.log('rows: ', rows);
                keys = key;
                setSelectedRowKeys(key);
            },
        }),
        [setSelectedRowKeys, selectedRowKeys],
    );

    const newColumns = [
        ...testColumns,
        {
            title: '控制',
            dataIndex: 'control',
            width: 800,
            render: (text, record, rowIndex) => (
                <>
                    <Button onClick={() => addOne(text, record, rowIndex)}>新增</Button>
                    <Button onClick={() => delOne(text, record, rowIndex)}>删除</Button>
                </>
            ),
        },
    ];
    return (
        <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* <div style={{ display: "flex", height: "3%" }}>
        <div style={{ width: "50%" }}>
          <Button
            onClick={() => {
              console.log('selectedRowKeys[0]: ', selectedRowKeys[0]);

              const clone = [...dataSource];

              const addedDataSource = clone.filter(item => item.id !== selectedRowKeys[0])
              console.log('addedDataSource: ', addedDataSource);
          
              setDataSource(addedDataSource)
            }}
          >
            删除
          </Button>
          <Button onClick={() => {}}>插入一行</Button>
        </div>
        <div style={{ width: "50%", textAlign: "right" }}>
          <Button onClick={submit} disabled={!isEdited}>
            提交
          </Button>
          <Button onClick={restore}>重置</Button>
          <Button onClick={getFieldsValue}>获取当前状态</Button>
          <Button
            onClick={() => {
              console.log(tableRef.current.columns);
            }}
          >
            获取当前columns
          </Button>
          <Button onClick={validateCorrelation}>输入相同的姓名试试</Button>
        </div> 
    </div> */}
            <Button
                type="primary"
                onClick={() => {
                    addOne(1, 2, dataSource.length - 1);
                }}>
                新增
            </Button>
            <FlexContainer direction="column">
                <EditableVirtualTable
                    tableType={'virtual'}
                    table={tableRef}
                    showFilter={true}
                    onFilter={(item, searchValue) => {
                        return item['address'].indexOf(searchValue) >= 0;
                    }}
                    pagination={false}
                    rowKey="key"
                    showIndex={true}
                    columns={columns}
                    dataSource={dataSource}
                    onExtraChange={({columns}) => console.log('列变化', columns)}
                    onEdit={onEdit}
                    defaultEditStatus={[]}
                    editStatus={editStatus}
                    editable={({column, record}) => {
                        const {key} = column;

                        if (key === 'id') {
                            return false;
                        }

                        return true;
                    }}
                />
            </FlexContainer>
        </div>
    );
};

EditableVirtualTemplate.storyName = '编辑虚拟表格';

export const EditableTemplate = ({}) => {
    const tableRef = useRef<EaseEditableTableInstance>();
    const [dataSource, setDataSource] = useState(
        mockTable100.map((item, index) => {
            item.id = index + 1;
            if (index % 2 !== 0) {
                item.sex = 'male';
            } else {
                item.sex = 'female';
            }
            return item;
        }),
    );
    const [numberOptions] = useState(new Array(100).fill(0).map((v, index) => index + 1));
    const [editStatus, setEditStatus] = useState<EditStatus>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [isEdited, setIsEdited] = useState(false);

    const addOne = useCallback(
        (text, record, rowIndex) => {
            const clone = [...dataSource];

            const addedDataSource = [
                ...clone.splice(0, rowIndex + 1),
                ...[
                    {
                        id: new Date().getTime(),
                        name: ``,
                        age: null,
                        sex: '',
                        startDate: '2022-03-26 15:30:30',
                        endDate: '2022-03-26 15:30:30',
                        number: null,
                        address: '1111111111111111111111111',
                    },
                ],
                ...clone,
            ];

            setDataSource(addedDataSource);

            editStatus[rowIndex + 1] = {
                sex: {value: null, orginal: null, status: 'editing'},
                startDate: {value: null, orginal: null, status: 'editing'},
                endDate: {value: null, orginal: null, status: 'editing'},
                number: {value: null, orginal: null, status: 'editing'},
                address: {value: null, orginal: null, status: 'editing'},
                name: {value: null, orginal: null, status: 'editing'},
                age: {value: null, orginal: null, status: 'editing'},
            };

            setEditStatus([...editStatus]);
        },
        [editStatus, dataSource],
    );
    const delOne = useCallback(
        (text, record, rowIndex) => {
            const clone = [...dataSource];
            clone.splice(rowIndex, 1);
            console.log('clone: ', clone);

            const addedDataSource = [...clone];
            editStatus.splice(rowIndex, 1);

            setDataSource(addedDataSource);

            setEditStatus([...editStatus]);
        },
        [editStatus, dataSource],
    );

    const columns = useMemo(() => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                visible: true,
                width: 80,
                align: 'center',
            },
            {
                title: '班级',
                dataIndex: 'class',
                key: 'class',
                align: 'center',
                onCell: (_, index) => {
                    if (index === 2) {
                        return {rowSpan: 2};
                    }
                    if (index === 3) {
                        return {rowSpan: 0};
                    }
                    return {};
                    // if (index === 4) {
                    //   return { colSpan: 0 };
                    // }
                },
                canHide: false,
                width: 50,
            },
            {
                title: '姓名',
                align: 'center',
                dataIndex: 'name',
                key: 'name',
                renderEdit: () => <Input />,
                width: 50,

                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your name',
                        },
                        // {
                        //   validator: (rule, value) => {
                        //     return new Promise((resolve, reject) => {
                        //       const { snapShoot } = tableRef.current.getFieldsValue();
                        //       const validateUnique = snapShoot.find((record) => record.name === value);
                        //       if (validateUnique) {
                        //         reject("姓名重复");
                        //         return;
                        //       }
                        //       resolve(value);
                        //     });
                        //   },
                        // },
                    ],
                },
                canHide: false,
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
                width: 50,

                renderEdit: () => <InputNumber controls={false} />,
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your age',
                        },
                    ],
                },
                dependence: ['name'],
                canHide: false,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                width: 50,
                render: (text, record, rowIndex, number) => {
                    if (text === 'male') return '男性';
                    if (text === 'female') return '女性';
                    return '';
                },
                renderEdit: () => (
                    <Select>
                        <Option value="male">男性</Option>
                        <Option value="female">女性</Option>
                    </Select>
                ),
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your sex',
                        },
                    ],
                },
                dependence: ['name'],
                editable: true,
            },
            {
                title: '学号(不可重复)',
                dataIndex: 'number',
                key: 'number',
                width: 150,
                renderEdit: () => {
                    const {snapShoot} = tableRef.current.getFieldsValue();
                    const selectedNumbers = snapShoot.map((record) => record.number);
                    return (
                        <Select>
                            {numberOptions.map((number) => (
                                <Option key={number} value={number} disabled={selectedNumbers.includes(number)}>
                                    {number}
                                </Option>
                            ))}
                        </Select>
                    );
                },
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please select your number',
                        },
                    ],
                },
                dependence: ['name'],
            },
            {
                title: '开始日期',
                dataIndex: 'startDate',
                key: 'startDate',
                width: 50,

                renderEdit: ({text, record, rowIndex, editRecord}) => {
                    const endDate = editRecord['endDate'] ? editRecord['endDate'] : record['endDate'];
                    return (
                        // @ts-ignore
                        <DatePickerWrapper
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current.isAfter(moment(endDate))}
                            showTime={true}
                        />
                    );
                },
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your startDate',
                        },
                    ],
                },
                dependence: ['name', 'endDate'],
                defaultValue: (record) => {
                    let start = moment(record.endDate || '1999-02-03');
                    start = start.subtract(1, 'd');
                    return start.format('YYYY-MM-DD HH:mm:ss');
                },
            },
            {
                title: '结束日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 50,
                renderEdit: ({text, record, rowIndex, editRecord}) => {
                    const startDate = editRecord['startDate'] ? editRecord['startDate'] : record['endDate'];
                    return (
                        // @ts-ignore
                        <DatePickerWrapper
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current.isBefore(moment(startDate))}
                            showTime={true}
                        />
                    );
                },
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your endDate',
                        },
                    ],
                },
                dependence: ['name', 'startDate'],
                defaultValue: (record) => {
                    let end = moment(record.startDate || '1999-02-03');
                    end = end.subtract(-1, 'd');
                    return end.format('YYYY-MM-DD HH:mm:ss');
                },
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
                width: 100,
                renderEdit: () => <Input />,
                dependence: ['name'],
            },
            {
                title: '控制',
                dataIndex: 'control',
                width: 50,
                render: (text, record, rowIndex) => (
                    <>
                        <Button onClick={() => addOne(text, record, rowIndex)}>新增</Button>
                        <Button onClick={() => delOne(text, record, rowIndex)}>删除</Button>
                    </>
                ),
            },
        ];
    }, [addOne]);

    const submit = useCallback(() => {
        if (!tableRef.current) return;
        tableRef.current
            .submit()
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const restore = useCallback(() => {
        if (!tableRef.current) return;
        tableRef.current.restore();
    }, []);

    const getFieldsValue = useCallback(() => {
        if (!tableRef.current) return;
        console.log(tableRef.current.getFieldsValue());
    }, []);

    const onEdit = useCallback((status) => {
        setEditStatus([...status]);
        let currentIsEdited = false;
        status.forEach((rowEditStatus, rowIndex) => {
            if (rowEditStatus && Object.values(rowEditStatus).length) {
                currentIsEdited = true;
            }
        });
        setIsEdited(currentIsEdited);
    }, []);

    const validateCorrelation = useCallback(
        (status) => {
            if (!tableRef.current) return;
            const {snapShoot} = tableRef.current.getFieldsValue();

            const weight = {};

            snapShoot.forEach(({name}, rowIndex) => {
                if (!weight[name]) {
                    weight[name] = [];
                }
                weight[name].push(rowIndex);
            });

            Object.keys(weight).forEach((name) => {
                const rowIndexs = weight[name];
                if (rowIndexs.length > 1) {
                    rowIndexs.forEach((rowIndex) => {
                        if (!editStatus[rowIndex]) {
                            editStatus[rowIndex] = {name: {errors: []}};
                        } else {
                            if (editStatus[rowIndex].name) {
                                editStatus[rowIndex].name.errors = [];
                            } else {
                                editStatus[rowIndex].name = {errors: []};
                            }
                        }
                        editStatus[rowIndex].name.errors.push('姓名存在重复');
                    });
                }
            });

            setEditStatus([...editStatus]);
        },
        [editStatus],
    );

    const rowSelection = useMemo(
        () => ({
            selectedRowKeys,
            onChange: setSelectedRowKeys,
        }),
        [setSelectedRowKeys, selectedRowKeys],
    );

    return (
        <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* <div style={{ display: "flex", height: "3%" }}>
        <div style={{ width: "50%" }}>
          <Button
            onClick={() => {
              console.log(selectedRowKeys);
            }}
          >
            删除
          </Button>
          <Button onClick={() => {}}>插入一行</Button>
        </div>
        <div style={{ width: "50%", textAlign: "right" }}>
          <Button onClick={submit} disabled={!isEdited}>
            提交
          </Button>
          <Button onClick={restore}>重置</Button>
          <Button onClick={getFieldsValue}>获取当前状态</Button>
          <Button
            onClick={() => {
              console.log(tableRef.current.columns);
            }}
          >
            获取当前columns
          </Button>
          <Button onClick={validateCorrelation}>输入相同的姓名试试</Button>
        </div>
      </div> */}
            <FlexContainer direction="column">
                <EditableTable
                    table={tableRef}
                    // showFilter={true}
                    // onFilter={(item, searchValue) => {
                    //   return item["address"].indexOf(searchValue) >= 0;
                    // }}
                    pagination={false}
                    // rowSelection={rowSelection}
                    rowKey="id"
                    columns={columns}
                    dataSource={dataSource}
                    onExtraChange={({columns}) => console.log('列变化', columns)}
                    onEdit={onEdit}
                    defaultEditStatus={[]}
                    editStatus={editStatus}
                    editable={({column, record}) => {
                        const {key} = column;

                        if (key === 'id') {
                            return false;
                        }

                        return true;
                    }}
                />
            </FlexContainer>
        </div>
    );
};

EditableTemplate.storyName = '编辑表格';

export const PrevValidate = ({}) => {
    const tableRef = useRef<EaseEditableTableInstance>();
    const [numberOptions] = useState(new Array(100).fill(0).map((v, index) => index + 1));
    const [dataSource, setDataSource] = useState([]);
    const [editStatus, setEditStatus] = useState<EditStatus>([]);

    const columns = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                visible: false,
            },
            {
                title: '班级',
                dataIndex: 'class',
                key: 'class',
                canHide: false,
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                renderEdit: ({text, record, rowIndex, editRecord}) => <Input />,
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your name',
                        },
                    ],
                },
                canHide: false,
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
                renderEdit: ({text, record, rowIndex, editRecord}) => <InputNumber controls={false} />,
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your age',
                        },
                    ],
                },
                dependence: ['name'],
                canHide: false,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render: (text, record, rowIndex) => {
                    if (text === 'male') return '男性';
                    if (text === 'female') return '女性';
                },
                renderEdit: ({text, record, rowIndex, editRecord}) => (
                    <Select>
                        <Option value="male">男性</Option>
                        <Option value="female">女性</Option>
                    </Select>
                ),
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your sex',
                        },
                    ],
                },
                dependence: ['name'],
            },
            {
                title: '学号(不可重复)',
                dataIndex: 'number',
                key: 'number',
                renderEdit: ({text, record, rowIndex, editRecord}) => {
                    const {snapShoot} = tableRef.current.getFieldsValue();
                    const selectedNumbers = snapShoot.map((record) => record.number);
                    return (
                        <Select>
                            {numberOptions.map((number) => (
                                <Option key={number} value={number} disabled={selectedNumbers.includes(number)}>
                                    {number}
                                </Option>
                            ))}
                        </Select>
                    );
                },
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please select your number',
                        },
                    ],
                },
                dependence: ['name'],
            },
            {
                title: '开始日期',
                dataIndex: 'startDate',
                key: 'startDate',
                renderEdit: ({text, record, rowIndex, editRecord}) => {
                    const endDate = editRecord['endDate'] ? editRecord['endDate'] : record['endDate'];
                    return (
                        // @ts-ignore
                        <DatePickerWrapper
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current.isBefore(moment(endDate))}
                            showTime={true}
                        />
                    );
                },
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your startDate',
                        },
                    ],
                },
                dependence: ['name'],
                defaultValue: moment('1999-02-03'),
            },
            {
                title: '结束日期',
                dataIndex: 'endDate',
                key: 'endDate',
                renderEdit: ({text, record, rowIndex, editRecord}) => {
                    const startDate = editRecord['startDate'] ? editRecord['startDate'] : record['endDate'];
                    return (
                        // @ts-ignore
                        <DatePickerWrapper
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current.isAfter(moment(startDate))}
                            showTime={true}
                        />
                    );
                },
                formProps: {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your endDate',
                        },
                    ],
                },
                dependence: ['name'],
                defaultValue: moment('1999-02-03'),
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
                renderEdit: ({text, record, rowIndex, editRecord}) => <Input />,
                dependence: ['name'],
            },
        ],
        [],
    );

    useEffect(() => {
        setTimeout(() => {
            const _dataSource = [
                {
                    name: '姓名1',
                    age: 45,
                    class: '大一班',
                    id: 63,
                    sex: 'female',
                    number: null,
                    startDate: '2022-12-21 13:59:1',
                    endDate: '2022-12-21 13:59:63',
                    address: '地址香榭丽舍大街063',
                },
                {
                    name: '姓名2',
                    age: 45,
                    class: '大一班',
                    id: 63,
                    sex: 'female',
                    number: null,
                    startDate: '2022-12-21 13:59:1',
                    endDate: '2022-12-21 13:59:63',
                    address: '地址香榭丽舍大街063',
                },
            ];

            setDataSource(_dataSource);

            const _editStatus = _dataSource.map((data) => {
                const editRecord = {};
                Object.keys(data).forEach((key) => {
                    const original = data[key];
                    editRecord[key] = {
                        value: original,
                        original,
                        status: 'editing',
                        errors: ['数据不可靠'],
                    };
                });
                return editRecord;
            });

            setEditStatus(_editStatus);
        }, 2000);
    }, []);

    return (
        <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
            <EditableTable
                table={tableRef}
                showFilter={true}
                onFilter={(item, searchValue) => {
                    return item['address'].indexOf(searchValue) >= 0;
                }}
                pagination={false}
                rowKey="id"
                showIndex={false}
                columns={columns}
                dataSource={dataSource}
                onExtraChange={({columns}) => console.log('列变化', columns)}
                onEdit={setEditStatus}
                defaultEditStatus={[]}
                editStatus={editStatus}
                editable={({column, record}) => {
                    const {key} = column;

                    if (key === 'id') {
                        return false;
                    }

                    return true;
                }}
            />
        </div>
    );
};

PrevValidate.storyName = '预校验';

export const LargeTemplate = Template.bind({});
LargeTemplate.args = {
    rowKey: 'name',
    showIndex: true,
    columns: columns25.map((column) => {
        if (column.editable) {
            return {...column, renderEdit: () => <Input />};
        }
        return column;
    }),
    dataSource: dataC25,
    onExtraChange: ({columns}) => console.log(columns),
};
LargeTemplate.storyName = '25列';

export const TestResizeTemplate = Template.bind({});
TestResizeTemplate.args = {
    rowKey: 'index',
    showIndex: true,
    columns: columnsResize,
    dataSource: dataResize,
    onExtraChange: ({columns}) => console.log(columns),
};
TestResizeTemplate.storyName = '测试resize';

export const ContextMenuResizeTemplate = Template.bind({});
ContextMenuResizeTemplate.args = {
    rowKey: 'index',
    showIndex: true,
    columns: columnsResize,
    dataSource: dataResize,
    contextMenu: false,
    onExtraChange: ({columns}) => console.log(columns),
};
ContextMenuResizeTemplate.storyName = 'contextmenu';
