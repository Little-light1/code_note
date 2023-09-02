import React, {useState} from 'react'; // import _ from 'lodash';

import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {
    Row,
    Col,
    Space,
    Button,
    DatePicker,
    TreeSelect,
    message,
    Tooltip,
} from 'antd';
import moment from 'moment';
import {shallowEqual} from 'react-redux';
import {RangeValue} from 'rc-picker/lib/interface';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@/app/runtime';
import PortalIcon from '@/components/icon';
import styles from './styles.module.scss'; // 检查类型

interface Item {
    id: [];
    endDate: string;
    startDate: string;
    productName: string;
} // 函数入参 负责渲染DOM

interface SystemsProps {
    id: string;
    value: Item[]; // 一个服务对应一个开始结束时间

    onChange: (value: Item[]) => void;
}
const {RangePicker} = DatePicker;
const {TreeNode} = TreeSelect;

const Systems = ({value, onChange, id}: SystemsProps) => {
    const [currentChooseServices, setCurrentChooseServices] = useState([]); // 已选择的标签

    const [currentChooseTimeRange, setCurrentChooseTimeRange] = useState([
        moment(),
        moment(),
    ]); // 已选择的时间

    const {appServiceData} = useAppSelector((state) => state[id], shallowEqual);
    const [name] = useState();
    const {t} = useTranslation();

    const getTreeData = (data: {
        list: {
            [x: string]: any;
        }[];
    }) =>
        data.map((item: {[x: string]: any}) => ({
            ...item,
            value: item.id,
            title: item.name,
            key: item.id,
            disableCheckbox: false,
        }));

    const add = () => {
        if (currentChooseServices.length === 0) {
            message.warning(t('请选择产品服务名称'));
        } else {
            // 判断有没有相同id   new Set() 集合 has判断集合有没有重复
            const idSet = new Set(value.map((r) => r.productID));
            const num = currentChooseServices.filter((r) => idSet.has(r.value));

            if (num.length === 0) {
                const valueMap = value.reduce(
                    (prev, curr) => ({
                        ...prev,
                        [curr.productID]: curr, // 设置键值:设置值
                    }),
                    {},
                ); // eslint-disable-next-line @typescript-eslint/no-shadow

                currentChooseServices.forEach(({value, label}) => {
                    const index = [];
                    index.push(
                        appServiceData.find((item: any) => item.id === value),
                    );
                    const str = index[0].state;
                    valueMap[value] = {
                        productID: value,
                        productName: label,
                        endDate: currentChooseTimeRange[1].format('YYYY-MM-DD'),
                        startDate:
                            currentChooseTimeRange[0].format('YYYY-MM-DD'),
                        state: str,
                    };
                });
                onChange(Object.values(valueMap)); // 传递一个对象到 Object.values
            } else {
                message.warning(t('不能添加相同产品服务'));
            }
        }
    };

    const remove = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1); // 数组 splie 删除

        onChange(newValue);
    }; // 时间日期组件时间修改

    const dateFormat = 'YYYY-MM-DD';

    const changeItemTime = (
        index: number,
        data: RangeValue<moment.Moment>,
        dateString: any[],
    ) => {
        const tmp: Item[] = [];

        for (let i = 0; i < value.length; i += 1) {
            let aaa;

            if (i === index) {
                // if (i === index && i.state.value === 0) {
                aaa = {
                    ...value[i],
                    startDate: dateString[0],
                    endDate: dateString[1],
                }; // props只读不可修改 解构赋值
            } else {
                aaa = {...value[i]};
            }

            tmp.push(aaa);
        }

        onChange(tmp);
    };

    // 应用禁用逻辑
    const renderTreeNodes = (data: any) =>
        data.map((item: any) => {
            // 已经选择的产品服务不可勾选
            if (value?.find((val) => val.productID === item.id)) {
                item.disabled = true;
            } else if (item.state.value === 1) {
                item.disabled = true;
            } else {
                item.disabled = false;
            }

            return (
                <TreeNode
                    key={item.id}
                    title={item.name}
                    value={item.id}
                    disabled={item.disabled}
                />
            );
        });

    return (
        <>
            <Row
                style={{
                    width: '800px',
                }}
            >
                <Col span={11}>
                    <TreeSelect
                        style={{
                            width: '450px',
                        }}
                        treeCheckStrictly
                        treeCheckable
                        showCheckedStrategy={TreeSelect.SHOW_ALL}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                        }}
                        placeholder={t('请选择')}
                        // placeholder={t('请选择产品服务名称')}
                        allowClear={false}
                        value={name}
                        key="id"
                        onChange={(e) => {
                            setCurrentChooseServices(e);
                        }}
                        maxTagCount={3}
                    >
                        {renderTreeNodes(getTreeData(appServiceData))}
                    </TreeSelect>
                </Col>
                <Col span={11}>
                    <RangePicker
                        format="YYYY-MM-DD"
                        style={{
                            width: '345px',
                            marginLeft: '101px',
                        }}
                        separator="~"
                        allowClear={false}
                        value={currentChooseTimeRange}
                        onChange={(dates) => {
                            setCurrentChooseTimeRange(dates);
                        }}
                        suffixIcon={
                            <img
                                src="../../../public/image/pickerData.png"
                                alt=""
                            />
                        }
                    />
                </Col>
                <Col span={2}>
                    <Button className={styles.button} onClick={add}>
                        <PlusOutlined className={styles.buttonAdd} />
                    </Button>
                </Col>
            </Row>
            {value.map((item, index) => (
                <Space
                    key={item.productID}
                    className={styles.spaceFlex}
                    align="baseline"
                >
                    <div className={styles.box}>
                        <Row>
                            <Col span={13}>
                                {item.state.value === 1 ? (
                                    <Tooltip
                                        placement="topLeft"
                                        title={t('该应用已被禁用')}
                                    >
                                        <div className={styles.tags}>
                                            <PortalIcon
                                                iconClass="icon-portal-warn"
                                                style={{
                                                    marginRight: '10px',
                                                    color: '#F94C4C',
                                                }}
                                            />
                                            {item.productName}
                                        </div>
                                    </Tooltip>
                                ) : (
                                    <div className={styles.tags}>
                                        {item.productName}
                                    </div>
                                )}
                            </Col>
                            <Col span={9} className={styles.picker}>
                                {item.state.value === 1 ? (
                                    <RangePicker
                                        allowClear={false}
                                        className={styles.pickerTime}
                                        separator="~"
                                        defaultValue={[
                                            moment(item.startDate, dateFormat),
                                            moment(item.endDate, dateFormat),
                                        ]}
                                        onChange={(data, dateString) => {
                                            changeItemTime(
                                                index,
                                                data,
                                                dateString,
                                            );
                                        }}
                                        suffixIcon={false}
                                        bordered={false}
                                        disabled
                                    />
                                ) : (
                                    <RangePicker
                                        allowClear={false}
                                        className={styles.pickerTime}
                                        separator="~"
                                        defaultValue={[
                                            moment(item.startDate, dateFormat),
                                            moment(item.endDate, dateFormat),
                                        ]}
                                        onChange={(data, dateString) => {
                                            changeItemTime(
                                                index,
                                                data,
                                                dateString,
                                            );
                                        }}
                                        suffixIcon={false}
                                        bordered={false}
                                    />
                                )}
                            </Col>
                            <Col span={2}>
                                <div className={styles.minusSign}>
                                    <MinusOutlined
                                        className={styles.removeIcon}
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Space>
            ))}
            {/* <Button className={styles.button} onClick={add}>
      <PlusOutlined className={styles.buttonAdd} />
      </Button> */}
        </>
    );
};

export default Systems;
