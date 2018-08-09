import React, {Component} from 'react';
import {Modal} from 'antd';

import Tree from '../Tree';
import SysRoleMgService from "../../../../services/RoleService";
import DeptService from "../../../../services/DeptService";

export default class extends Component {
  state = {
      authData: [], // 权限树
  };
  componentDidMount() {
        // 获取权限树
        this.authQuery();
  }
  // 获取所有权限树数据
  authQuery = (params) => {
      DeptService.getDeptTree(params)
            .then(res => {
                res.treeData.map(item => {
                    item.title = item.sdeptName;
                    item.key = item.ideptId;
                    item.isLeaf = !item.childCount;
                });
                this.setState({
                    authData: res.treeData,
                });
            });
    };
  //异步加载权限树节点
  loadAuthData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            DeptService.getDeptTree(treeNode.props.dataRef)
                .then(result => {
                    result.treeData.map(item => {
                        item.title = item.sdeptName;
                        item.key = item.ideptId;
                        item.isLeaf = !item.childCount;
                    });
                    treeNode.props.dataRef.children = [...result.treeData];
                    this.setState({
                        authData: [...this.state.authData]
                    });
                    resolve();
                })
        });
    };

  onSubmit = () => {
      this.props.onCreate();
  };

  render() {
    const {editAuth, checkedKeys} = this.props;
    const authProps = { // 树索要用到的参数
          treeData: this.state.authData, // 要一级数据.
          checkedKeys,
          checkable: true,
          onCheck: this.props.onCheck,
          onLoadData: this.loadAuthData
      };

    return (
      <Modal
        title="编辑角色权限"
        width={600}
        maskClosable={false}
        visible={editAuth}
        onOk={this.onSubmit}
        onCancel={() => this.props.onClose()}
        className="authModal-content"
      >
       <Tree {...authProps}/>
      </Modal>
    );
  }
}
