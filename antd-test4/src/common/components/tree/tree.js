import React from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

const TreeComponent = ({treeData, onSelect, onCheck, checkedKeys, onLoadData, checkable,showLine,defaultExpandedKeys}) => {
    const loop = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item} isLeaf={item.isLeaf}>
                    {loop(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} dataRef={item}/>;
    });
    return treeData.length
        ? <Tree
            showLine={showLine}
            checkable={checkable}
            defaultExpandedKeys={defaultExpandedKeys}
            onSelect={onSelect}
            onCheck={onCheck}
            loadData={onLoadData}>{loop(treeData)}</Tree>
        : '';
};

export default TreeComponent;