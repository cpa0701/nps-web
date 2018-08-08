import React, {PureComponent} from 'react';
import {TreeSelect, Tree} from 'antd';

const TreeNode = Tree.TreeNode;

class ParentTreeSelect extends PureComponent {

    state = {
        treeData: [{
            title: '根菜单',
            key: '-1',
            value: {value: '-1', label: '根菜单', menuLevel: '1'},
        }]
    }

    onLoadData = (treeNode) => {
        const {service, method} = this.props;
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            let params = {
                pageInfo: {
                    pageIndex: '1',
                    pageNum: '1000',
                },
                pmenuId: treeNode.props.value.value,//有条件查询
                state: '00A',
                // pmenuId: '-1',//有条件查询
                // menuLevel:'1'
            }
            // 查询上级菜单接口待定 pmenuid--父级菜单id
            service[method](params)
                .then(result => {
                    let treeData = [];
                    for (let i = 0; i < data.length; i++) {
                        treeData.push({
                            title: data[i].menuName,
                            key: data[i].menuId,
                            value: {value: data[i].menuId, label: data[i].menuName, menuLevel: data[i].menuLevel},
                            isLeaf: data[i].isLeaf,
                        });
                    }
                    // treeData.push({
                    //     title: '根菜单',
                    //     key: '-1',
                    //     value: { value: '-1', label: '根菜单' },
                    //     isLeaf:true
                    // })
                    // console.log(treeData);

                    treeNode.props.dataRef.children = treeData;
                    this.setState({
                        treeData: [...this.state.treeData],
                    });
                    // return;
                    resolve();
                });
        });
    }

    renderTreeNodes = (data) => {
        // if(data.length>2){
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode {...item} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
        // }

    }

    render() {
        console.log(this.state.treeData);

        return (
            <TreeSelect {...this.props}
                        labelInValue={true}
                        loadData={this.onLoadData}
            >
                {this.renderTreeNodes(this.state.treeData)}
            </TreeSelect>
        )
    }
}

export default ParentTreeSelect;
