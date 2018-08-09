import React from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

const TreePic = ({treeData, onSelect, onCheck, checkedKeys, onLoadData, selectedKey, checkable, defaultExpandedKeys}) => {
    const loop = (data = []) => data.map((item) => {
        if (item.children) {
            return <TreeNode title={item.title} key={item.key} dataRef={item} isLeaf={item.isLeaf}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode title={item.title} key={item.key} dataRef={item}/>; // 可以添加禁用.
    });
    return (
        <Tree
            checkable={checkable}
            onSelect={onSelect}
            checkedKeys={checkedKeys}
            loadData={onLoadData}
            onCheck={onCheck}
            selectedKeys={selectedKey}
            defaultExpandedKeys={defaultExpandedKeys}
        >
            {loop(treeData)}
        </Tree>
    );
};

TreePic.propTypes = {
    treeData: PropTypes.array,
    onSelect: PropTypes.func,
    onLoadData: PropTypes.func,
};


export default TreePic;