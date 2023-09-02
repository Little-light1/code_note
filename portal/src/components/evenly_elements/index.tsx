/* eslint-disable react/no-array-index-key */
import React, {CSSProperties, FC} from 'react';
import {Row, Col} from 'antd';
import _ from 'lodash';

export const HideElement: FC = ({children}) => {
    return <div hidden>{children}</div>;
};

interface EvenlyElementsProps {
    count?: number;
    offset?: number;
    rowStyle?: CSSProperties;
    // elements?: React.ReactElement[];
}

// const isEmptyObject = (target: any): target is {} => {
//     return (
//         toString.call(target) === '[object Object]' &&
//         !Object.keys(target).length
//     );
// };

/**
 * 自动分配子元素组件
 * @param param.count 每行数量
 * @param param.offset 偏移
 * @param param.elemetns 数组元素
 * @param param.children 注意children不要有空字符串
 * @returns
 */
const EvenlyElements: FC<EvenlyElementsProps> = ({
    count = 1,
    // elements = [],
    offset = 1,
    rowStyle = {},
    children,
}) => {
    if (!Array.isArray(children)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{children}</>;
    }

    const filterElements = children.filter((ele) => ele);

    const hideElements = _.remove(
        filterElements,
        (ele) => ele.type === HideElement,
    );

    const span = Math.floor(24 / count);

    const group = _.chunk(filterElements, count);

    return (
        <>
            {group.map((nodes, gIndex) => (
                <Row key={`group_${gIndex}`} style={rowStyle}>
                    {nodes.map((node, index) => (
                        <Col
                            key={`node_${index}`}
                            // 首列不进行偏移
                            span={index === 0 ? span : span - offset}
                            offset={index === 0 ? 0 : offset}
                        >
                            {node}
                        </Col>
                    ))}
                </Row>
            ))}
            {hideElements}
        </>
    );
};

export default EvenlyElements;
