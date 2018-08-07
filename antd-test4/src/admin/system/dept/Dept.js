import React, {Component} from 'react';
import {Form, Layout, Icon, TreeSelect, Input, Button, Tree} from 'antd';
// import DeptForm from "./DeptForm"

import "./Dept.less"
import DomainService from "../../../services/DomainService"
import {message, Modal} from "antd"

const TreeNode = Tree.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const info = Modal.info;
const {Header, Sider, Content} = Layout;

@Form.create({})
export default class Dept extends Component {
    state = {
        collapsed: false,
        value: undefined,
        treeData: [],
        domainTreeDate: [],
        departmentData: [],
        departmentEditData: null,
        modalVisible: false
    };

    constructor(props) {
        super(props);
        this.handlerSearchDepartment = this.handlerSearchDepartment.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        // this.onExpand = this.onExpand.bind(this);
    }

    componentWillMount() {
        let a = JSON.stringify({
            "IDOMAINID": 10000,
            "ISEQ": 1,
            "SDOMAINNAME": "全国",
            "children": [
                {
                    "IDOMAINID": 20000,
                    "ISEQ": 1,
                    "SDOMAINNAME": "北京",
                    "SDOMAINCODE": "beijing",
                    "SPATHID": "/10000/20000",
                    "IPARENTID": 10000,
                    "IDOMAINTYPE": 1
                },
                {
                    "IDOMAINID": 30000,
                    "ISEQ": 1,
                    "SDOMAINNAME": "湖南",
                    "children": [{
                        "IDOMAINID": 31000,
                        "ISEQ": 1,
                        "SDOMAINNAME": "长沙",
                        "SDOMAINCODE": "changsha",
                        "SPATHID": "/10000/30000/31000",
                        "IPARENTID": 30000,
                        "IDOMAINTYPE": 1
                    }],
                    "SDOMAINCODE": "hunan",
                    "SPATHID": "/10000/30000",
                    "IPARENTID": 10000,
                    "IDOMAINTYPE": 1
                }
            ],
            "SDOMAINCODE": "all",
            "SPATHID": "/10000",
            "IPARENTID": 0,
            "IDOMAINTYPE": 0
        })
        a = a.replace(/SDOMAINNAME/g, "title").replace(/SDOMAINCODE/g, "value").replace(/IDOMAINID/g, "key")
        this.setState({
            domainTreeDate: [JSON.parse(a)]
        });
        DomainService.getDomainTree().then(result => {
            this.setState({
                treeData: result.treeData,
            });
        });
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    onChange = (value) => {
        console.log(arguments);
        this.setState({value});
    }
    //点击部门树节点时
    onSelect = (selectedKeys, info) => {
        this.setState({
            departmentEditData: info.selectedNodes.length ? info.selectedNodes[0].props : ""
        })
    }
    //异步加载树节点
    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            DomainService.getDomainTree(treeNode.props.dataRef).then(result => {
                treeNode.props.dataRef.children = [...result.treeData];
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            })
        });
    }

    //渲染树节点
    renderTreeNodes = (data) => {
        return data.map((item) => {
            item.title = item.sdeptName;
            item.key = item.ideptId;
            item.isLeaf = !item.childCount;
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item} isLeaf={item.isLeaf}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
    }

    //点击查询部门树
    handlerSearchDepartment = () => {
        let params = this.props.form.getFieldsValue();
        params.region = this.state.value;
        DomainService.getDomainTree(params).then(result => {
            this.setState({
                treeData: [...result.treeData]
            });
        });
    }
    //新增方法
    handleAdd = () => {
        if (this.state.departmentEditData) {
            this.setState({
                departmentData: {
                    sdispName: this.state.departmentEditData.sdispName,
                    idomainId: this.state.departmentEditData.idomainId,
                    SDOMAINNAME: this.state.departmentEditData.SDOMAINNAME,
                }
            });
            this.handleModalVisible(true);
        } else {
            const ref = info({
                title: '请先选择要新增的所属部门',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }

    //修改方法
    handleUpdate = () => {
        if (this.state.departmentEditData) {
            if (this.state.departmentEditData.IDOMAINID !== "-1") {
                this.setState({
                    departmentData: this.state.departmentEditData,
                    thisTime: '',
                });
                this.handleModalVisible(true);
            } else {
                const ref = info({
                    title: '不能修改区域根节点！',
                    content: '',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        ref.destroy();
                    }
                });
            }
        } else {
            const ref = info({
                title: '请先选择要修改的区域',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }

    //删除方法
    handleDelete = (row) => {
        let params = {};
        let promise = null;
        if (Array.isArray(row)) {
            params.menuIds = row.map(item => item.menuId + ''); //平台角色id，必填
            params.operateType = '3'; //3-删除，必填
            promise = DomainService.DelAllMenuSys(params);
        } else {
            params = {
                menuId: row.menuId,//菜单id，必填
                operateType: '3' //3-删除，必填
            }
            promise = DomainService.DelMenuSys(params);
        }
        promise.then(result => {
            if (!result.head) {
                return;
            }
            let head = result.head;
            // let data = result.data;
            let success = head.resultCode;
            if (success !== '0') {
                message.error(head.remark);
            }
            else {
                message.success('删除成功');

                this.handleSearch();
            }
        });
        this.handleSelectRows([])
    }

    //点击勾选方法
    handleSelectRows = (record, selected, selectedRows) => {
        this.setState({
            selectedRows: record,
            departmentEditData: record[record.length - 1],
        });
    }


    //控制弹出框的显示状态
    handleModalVisible = (flag) => {
        let visible = !!flag
        this.setState({
            modalVisible: visible,
        });

        //页面关闭了要重新查询
        // !visible && this.handleSearch();
    }

    render() {
        const {departmentData, modalVisible, domainTreeDate} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <Layout className='dept'>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                    collapsedWidth="0"
                    style={{background: '#fff'}}
                    width={300}
                >
                    <div className='dept-logo'>部门列表</div>
                    <Form>
                        <FormItem
                            labelCol={{span: 6}}
                            wrapperCol={{span: 17}}
                            label="所属区域"
                            style={{"marginBottom": 0}}
                        >
                            <TreeSelect
                                value={this.state.value}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                treeData={domainTreeDate}
                                treeCheckable={true}
                                showCheckedStrategy={SHOW_PARENT}
                                searchPlaceholder={'请选择区域'}
                                onChange={this.onChange}
                            />
                        </FormItem>
                        <FormItem
                            labelCol={{span: 6}}
                            wrapperCol={{span: 17}}
                            label="部门名称"
                            style={{"marginBottom": 0}}
                        >
                            {getFieldDecorator('deptName', {
                                rules: [{required: false}],
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Form>
                    <div className='departmentBtn'>
                        <Button onClick={this.handlerSearchDepartment} type="primary">查询</Button>
                        <Button onClick={this.handleAdd}>新增</Button>
                        <Button type="dashed">修改</Button>
                        <Button type="danger">删除</Button>
                    </div>
                    <h6 className='departmentH6'>部门导航树</h6>
                    <Tree
                        showLine
                        checkable
                        defaultExpandedKeys={['0-0-0']}
                        onSelect={this.onSelect}
                        loadData={this.onLoadData}
                    >
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                    {/*<DeptForm*/}
                    {/*departmentData={departmentData}*/}
                    {/*domainTreeDate={domainTreeDate}*/}
                    {/*modalVisible={modalVisible}*/}
                    {/*thisTime={this.state.thisTime}*/}
                    {/*handleModalVisible={this.handleModalVisible}*/}
                    {/*/>*/}
                </Sider>
                <Layout>
                    <Header className='dept-header'>
                        <Icon
                            className='trigger'
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content style={{background: '#fff', minHeight: 280, paddingLeft: "10px"}}>
                        Content
                    </Content>
                </Layout>
            </Layout>
        )
    }
}