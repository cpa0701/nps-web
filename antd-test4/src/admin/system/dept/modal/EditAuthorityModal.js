import React, {PureComponent} from 'react';
import {Modal} from 'antd';

import TreeComponent from '../../../../common/components/tree/tree';
import DeptService from "../../../../services/DeptService"

class EditAuthorityModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false
        }
    }
    //点击角色树节点时
    onSelectRoleTree = (selectedKeys, info) => {
        info.selectedNodes = info.selectedNodes ? info.selectedNodes : info.checkedNodes;
        this.setState({selectedKeys: selectedKeys})
    }
    //提交更改权限
    handleAddRole = () => {
        this.setState({
            confirmLoading: true,
        });
        DeptService.editAuthority(this.state.selectedKeys).then(result => {
            this.setState({
                confirmLoading: false,
            }, () => this.props.EditAuthorityVisible(false));
        })
    }

    render() {
        const {authorityTreeAllData, modalChangeAuthorityVisible, EditAuthorityVisible,onLoadData,selectedAuthorityData} = this.props
        const {confirmLoading} = this.state;
        return (
            <Modal
                title="更改部门"
                visible={modalChangeAuthorityVisible}
                onOk={this.handleAddRole}
                confirmLoading={confirmLoading}
                onCancel={() => EditAuthorityVisible(false)}
                okText="确认"
                cancelText="取消"
            >
                <h6 className='departmentH6'>角色树</h6>
                <div>
                    <TreeComponent
                        checkable={true}
                        default={selectedAuthorityData}
                        onSelect={this.onSelectRoleTree}
                        onCheck={this.onSelectRoleTree}
                        treeData={authorityTreeAllData}
                        onLoadData={onLoadData}/>
                </div>
            </Modal>
        );
    }
}

export default EditAuthorityModal;
