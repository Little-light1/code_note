import React from 'react';
import {Tree} from 'antd';
import {Link} from 'react-router-dom';
import {useAction} from '@gwaapp/ease';

const PagesDemo = () => {
    const {historyManager} = useAction();
    const routeTree = historyManager?.routeTree;
    const MemoizedTitleComponent = React.useCallback((nodeData: any) => {
        const {path, title} = nodeData;
        return (
            <Link key={path} to={path}>
                {title}
            </Link>
        );
    }, []);
    return (
        <div>
            <Tree
                className="draggable-tree"
                fieldNames={{
                    title: 'title',
                    key: 'key',
                    children: 'subRoutes',
                }}
                defaultExpandAll
                blockNode
                treeData={routeTree}
                titleRender={MemoizedTitleComponent}
            />
        </div>
    );
};

export default PagesDemo;
