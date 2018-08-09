import React, {PureComponent} from 'react';
import {Modal, TreeSelect, Row, Col} from 'antd';

import DeptService from '../../../../services/DeptService';
import TreeComponent from '../../../../common/components/tree/tree';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class changeDeptModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
            deptTreeData: undefined,
        }
    }

    //点击区域树
    onChange = (value) => {
        this.setState({value});
        this.setState({
            deptTreeData: [],
        }, () => this.getDeptTree(value));
    }
    //提交更改部门信息
    handleChangedDept = () => {
        this.setState({
            confirmLoading: true,
        });
        DeptService.changeDept(this.state.selectedKeys).then(result => {
            this.setState({
                confirmLoading: false,
            }, () => this.props.changeDeptVisible(false));
        })
    }

    //获取部门树
    getDeptTree = (params) => {
        DeptService.getDeptTree(params ? params : this.props.staffData.deptId).then(result => {
            let deptTreeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({deptTreeData: deptTreeData})
        });
    }
    //异步加载部门树节点
    onLoadDeptTreeData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            DeptService.getDeptTree(treeNode.props.dataRef).then(result => {
                let treeData = result.treeData.map(item => {
                    item.title = item.sdeptName;
                    item.key = item.ideptId
                    item.isLeaf = !item.childCount;
                    return item;
                })
                treeNode.props.dataRef.children = [...treeData];
                this.setState({
                    deptTreeData: [...this.state.deptTreeData ? this.state.deptTreeData : this.props.deptTreeForChangeData],
                });
                resolve();
            })
        });
    }
    //选中部门树
    onSelectDeptTree = (selectedKeys, info) => {
        this.setState({
            selectedKeys: selectedKeys
        })
    }

    render() {
        const {changeDeptVisible, modalChangeDeptVisible, staffData, domainTreeDate, deptTreeForChangeData} = this.props
        const {confirmLoading, value, deptTreeData} = this.state;
        const selectDomain = value ? value : (staffData.deptId ? staffData.deptId.toString() : "");
        const deptTree = deptTreeData ? deptTreeData : deptTreeForChangeData;
        return (
            <Modal
                title="更改部门"
                visible={modalChangeDeptVisible}
                onOk={this.handleChangedDept}
                confirmLoading={confirmLoading}
                onCancel={() => changeDeptVisible(false)}
                okText="确认"
                cancelText="取消"
            >
                <Row>
                    <Col span={8}>所属区域</Col>
                    <Col span={16}>
                        <TreeSelect
                            value={selectDomain}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            treeData={domainTreeDate}
                            showCheckedStrategy={SHOW_PARENT}
                            searchPlaceholder={'请选择区域'}
                            onChange={this.onChange}
                            style={{'width': '100%'}}
                        />
                    </Col>
                    <Col span={24}>
                        <TreeComponent
                            showLine={true}
                            checkable={false}
                            onSelect={this.onSelectDeptTree}
                            onCheck={this.onSelectDeptTree}
                            treeData={deptTree}
                            onLoadData={this.onLoadDeptTreeData}/>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default changeDeptModal;
