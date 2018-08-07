import React from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

const TreePic = ({treeData, onSelect, onLoadData, selectedKey}) => {
    const loop = data => data.map((item) => {
        if (item.children) {
            return <TreeNode title={item.name} key={item.key} dataRef={item}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode title={item.name} key={item.key} isLeaf={!item.isParent} dataRef={item}/>; // 可以添加禁用.
    });
    return (
        <Tree
            checkable
            onSelect={onSelect}
            loadData={onLoadData}
            selectedKeys={selectedKey}
            defaultExpandedKeys={['1']}
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