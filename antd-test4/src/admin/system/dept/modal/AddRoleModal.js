import React, {PureComponent} from 'react';
import {Modal} from 'antd';

import TreeComponent from '../../../../common/components/tree/tree';
import DeptService from "../../../../services/DeptService"

class AddRoleModal extends PureComponent {
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
    //提交更改角色信息
    handleAddRole = () => {
        this.setState({
            confirmLoading: true,
        });
        DeptService.addRole(this.state.selectedKeys).then(result => {
            this.setState({
                confirmLoading: false,
            }, () => this.props.addRoleVisible(false));
        })
    }

    render() {
        const {addRoleTreeDate, modalChangeRoleVisible, addRoleVisible,onLoadData} = this.props
        const {confirmLoading} = this.state;
        return (
            <Modal
                title="更改部门"
                visible={modalChangeRoleVisible}
                onOk={this.handleAddRole}
                confirmLoading={confirmLoading}
                onCancel={() => addRoleVisible(false)}
                okText="确认"
                cancelText="取消"
            >
                <h6 className='departmentH6'>角色树</h6>
                <div>
                    <TreeComponent
                        checkable={true}
                        onSelect={this.onSelectRoleTree}
                        onCheck={this.onSelectRoleTree}
                        treeData={addRoleTreeDate}
                        onLoadData={onLoadData}/>
                </div>
            </Modal>
        );
    }
}

export default AddRoleModal;
