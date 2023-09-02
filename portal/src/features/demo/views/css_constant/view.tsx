import {Divider} from 'antd';
import React from 'react';
import styles from './styles.module.scss';

const vaiables = [
    {
        key: 'base',
        title: '基础变量',
        children: [
            {
                key: 'fontColor',
                title: '文字颜色',
                variable: 'var(--font-color)',
            },
            {
                key: 'fontColor',
                title: '文字颜色',
                variable: 'var(--font-color)',
            },
        ],
    },
];

const TableDemo = () => (
    <div
        style={{
            height: '100%',
        }}
    >
        {vaiables.map((v) => (
            <div className={styles.group} key={v.key}>
                <Divider plain>{v.title}</Divider>
                <div className={styles.area}>
                    {v.children.map((vItem) => (
                        <div className={styles.item} key={vItem.key}>
                            <div
                                className={styles.block}
                                style={{
                                    backgroundColor: vItem.variable,
                                }}
                            />
                            <div>{vItem.title}</div>
                            <div>{vItem.variable}</div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default TableDemo;
