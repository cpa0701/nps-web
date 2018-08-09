import React, {PureComponent} from 'react';
import {
    Form,
    Layout,
    Icon,
    TreeSelect,
    Input,
    Button,
    Popconfirm,
    Tabs,
    message,
    Modal, Row, Col,
} from 'antd';

import "./Dept.less"
import DeptService from "../../../services/DeptService"
import DeptModal from "./modal/DeptModal"
import StaffModal from "./modal/StaffModal"
import ChangeDeptModal from "./modal/ChangeDeptModal"
import AddRoleModal from "./modal/AddRoleModal"
import EditAuthorityModal from "./modal/EditAuthorityModal"
import DeptForm from "./DeptForm"
import StandardTable from '../../../common/components/table/table';
import TreeComponent from '../../../common/components/tree/tree';
import {inject} from "mobx-react/index"

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const FormItem = Form.Item;
const info = Modal.info;
const {Sider, Content} = Layout;
const TabPane = Tabs.TabPane;

@Form.create({})
@inject('stores')
export default class Dept extends PureComponent {
    state = {
        collapsed: false,
        value: undefined,
        activeKey: 'role',
        deptTreeData: [],
        roleTreeData: [],
        authorityTreeData: [],
        authorityTreeAllData: [],
        addRoleTreeDate: [],
        domainTreeDate: [],
        departmentData: [],
        deptTreeForChangeData: [],
        departmentDataTree: [],
        staffData: [],
        staffEditData: [],
        selectedKeys: [],
        selectedRoleKeys: [],
        selectedStaffIds: [],
        editAuthorityParams: [],
        selectedAuthorityData: [],
        departmentEditData: null,
        modalStaffVisible: false,
        modalDeptVisible: false,
        modalChangeDeptVisible: false,
        modalChangeRoleVisible: false,
        modalChangeAuthorityVisible: false,
        staffColumns: [
            {
                title: '登录账号',
                dataIndex: 'account',
                render: (text, record, index) => {
                    return (
                        <span>
                            <Icon type="user"/>{text}
                        </span>
                    )
                }
            },
            {
                title: '人员工号',
                dataIndex: 'no'
            },
            {
                title: '人员姓名',
                dataIndex: 'name',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                filters: [
                    {text: 'M', value: '男'},
                    {text: 'F', value: '女'},
                ]
            },
            {
                title: '账号状态',
                dataIndex: 'state',
            },
            {
                title: '手机号码',
                dataIndex: 'cellphone',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '部门名称',
                dataIndex: 'deptId',
            }
        ],
        formValues: {}
    };

    constructor(props) {
        super(props);
        this.handlerSearchDepartment = this.handlerSearchDepartment.bind(this);
        this.handleDeptAdd = this.handleDeptAdd.bind(this);
        this.handleDeptUpdate = this.handleDeptUpdate.bind(this);
        this.handleDeptDelete = this.handleDeptDelete.bind(this);
        this.handleStaffAdd = this.handleStaffAdd.bind(this);
        this.handleStaffEdit = this.handleStaffEdit.bind(this);
        this.handleStaffDelete = this.handleStaffDelete.bind(this);
        this.handleAddRole = this.handleAddRole.bind(this);
        this.handleRoleDelete = this.handleRoleDelete.bind(this);
        this.editAuthority = this.editAuthority.bind(this);
    }

    componentWillMount() {
        let a = JSON.stringify({
            "IDOMAINID": '10000',
            "ISEQ": 1,
            "SDOMAINNAME": "全国",
            "children": [
                {
                    "IDOMAINID": '20000',
                    "ISEQ": 1,
                    "SDOMAINNAME": "北京",
                    "SDOMAINCODE": "beijing",
                    "SPATHID": "/10000/20000",
                    "IPARENTID": 10000,
                    "IDOMAINTYPE": 1
                },
                {
                    "IDOMAINID": '30000',
                    "ISEQ": 1,
                    "SDOMAINNAME": "湖南",
                    "children": [{
                        "IDOMAINID": '31000',
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
        this.getDeptTree();
        this.getAllAuthorityData();
    }

    componentDidMount() {
        //第一次默认加载
        // this.standardTable.handleSearch({current: 1, pageSize: 10})
    }

    //收起展开部门
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    //点击区域树
    onChange = (value) => {
        this.setState({value});
    }
    //获取部门树
    getDeptTree = (params) => {
        DeptService.getDeptTree(params).then(result => {
            let treeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({
                deptTreeData: treeData,
            });
        });
    }
    //获取角色树
    getRoleTree = (params) => {
        let data = params[params.length - 1];
        DeptService.getRoleTree(data).then(result => {
            let treeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({
                roleTreeData: treeData,
            });
        });
    }
    //获取权限树
    getAuthorityTree = (params) => {
        let selectedAuthorityData = [];
        DeptService.getAuthorityTree(params).then(result => {
            let treeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId;
                selectedAuthorityData.push(item.key)
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({
                authorityTreeData: treeData,
                selectedAuthorityData: selectedAuthorityData
            });
        });
    }
    //点击部门树节点时
    onSelectDeptTree = (selectedKeys, info) => {
        info.selectedNodes = info.selectedNodes ? info.selectedNodes : info.checkedNodes;
        this.setState({
            departmentEditData: info.selectedNodes.length ? info.selectedNodes[info.selectedNodes.length - 1].props : "",
            selectedKeys: selectedKeys
        }, () => {
            this.getStaffData(this.state.departmentEditData)
        })
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
                    deptTreeData: [...this.state.deptTreeData],
                });
                resolve();
            })
        });
    }
    //点击角色树节点时
    onSelectRoleTree = (selectedKeys, info) => {
        info.selectedNodes = info.selectedNodes ? info.selectedNodes : info.checkedNodes;
        DeptService.getDeptTree(info.selectedNodes[info.selectedNodes.length - 1].props).then(result => {
            let treeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({
                addRoleTreeDate: [...treeData],
                selectedRoleKeys: selectedKeys,
            });
        })
        this.getAuthorityTree(info.selectedNodes.length ? info.selectedNodes[info.selectedNodes.length - 1].props : "")
    }
    //异步加载角色树节点
    onLoadRoleTreeData = (treeNode) => {
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
                    roleTreeData: [...this.state.roleTreeData],
                });
                resolve();
            })
        });
    }
    //点击权限树节点时
    onSelectAuthorityTree = (selectedKeys, info) => {
        info.selectedNodes = info.selectedNodes ? info.selectedNodes : info.checkedNodes;
        this.setState({
            departmentEditData: info.selectedNodes.length ? info.selectedNodes[info.selectedNodes.length - 1].props : "",
            selectedKeys: selectedKeys
        })
    }
    //异步加载权限树节点
    onLoadAuthorityTreeData = (treeNode) => {
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
                    authorityTreeData: [...this.state.authorityTreeData],
                });
                resolve();
            })
        });
    }
    //异步加载全部权限树节点
    onLoadEditAuthorityTreeData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            DeptService.getAllAuthorityData(treeNode.props.dataRef).then(result => {
                let treeData = result.treeData.map(item => {
                    item.title = item.sdeptName;
                    item.key = item.ideptId
                    item.isLeaf = !item.childCount;
                    return item;
                })
                treeNode.props.dataRef.children = [...treeData];
                this.setState({
                    authorityTreeAllData: [...this.state.authorityTreeAllData],
                });
                resolve();
            })
        });
    }
    //点击查询部门树
    handlerSearchDepartment = () => {
        let params = this.props.form.getFieldsValue();
        this.setState({
            deptTreeData: [],
        });
        this.getDeptTree(params);
    }
    //新增部门
    handleDeptAdd = () => {
        if (this.state.departmentEditData) {
            this.setState({
                departmentData: {
                    sdispName: this.state.departmentEditData.sdispName,
                    parentId: this.state.departmentEditData.ideptId,
                    sdeptName: "",
                }
            }, () => this.handleDeptModalVisible(true));

        } else {
            this.setState({
                departmentData: {
                    sdispName: "",
                    parentId: 0,
                    sdeptName: "",
                }
            }, () => this.handleDeptModalVisible(true));
            // const ref = info({
            //     title: '请先选择要新增的所属部门',
            //     content: '',
            //     okText: '确定',
            //     cancelText: '取消',
            //     onOk: () => {
            //         ref.destroy();
            //     }
            // });
        }
    }
    //修改部门
    handleDeptUpdate = () => {
        if (this.state.departmentEditData) {
            this.setState({
                departmentData: this.state.departmentEditData,
                thisTime: 'M',
            });
            this.handleDeptModalVisible(true);
        } else {
            const ref = info({
                title: '请先选择要修改的部门',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    //删除部门
    handleDeptDelete = () => {
        let row = this.state.selectedKeys;
        let params = {};
        if (row.length !== 0) {
            params.menuIds = row.map(item => item + ''); //平台角色id，必填
            DeptService.dleDept(params).then(result => {
                message.success('删除成功');
                this.handlerSearchDepartment();
            });
        } else {
            const ref = info({
                title: '请先选择要删除的部门',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
        this.handleSelectRows([])

    }
    //控制弹出框的显示状态
    handleDeptModalVisible = (flag) => {
        let visible = !!flag
        this.setState({
            modalDeptVisible: visible,
        });

        // 页面关闭了要重新查询
        !visible && this.handlerSearchDepartment();
    }
    //点击勾选方法
    handleSelectRows = (record, selected, selectedRows) => {
        this.setState({
            selectedRows: record,
            departmentEditData: record[record.length - 1],
        });
    }
    //获取人员表格数据
    getStaffData = (params) => {
        this.setState({
            formValues: params
        }, () => {
            this.standardTable.handleSearch({pageInfo: {pageIndex: 1, pageSize: 10}, ...params})
        });
    }
    //新增人员
    handleStaffAdd = () => {
        if (this.state.departmentEditData.length !== 0) {
            this.setState({staffEditData: []})
            this.handleStaffModalVisible(true);
        } else {
            const ref = info({
                title: '请先选择要新增人员的所属部门',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    //修改人员
    handleStaffEdit = () => {
        if (this.state.departmentEditData.length !== 0) {
            if (this.state.staffData.length !== 0) {
                this.setState({
                    staffEditData: this.state.staffData,
                    thisTime: 'M',
                }, () => {
                    this.handleStaffModalVisible(true);
                });
            } else {
                const ref = info({
                    title: '请先选择要修改的人员',
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
                title: '请先选择要修改人员的所属部门',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    // 双击表格查看人员信息
    handelViewStaff = (data) => {
        this.setState({
            staffEditData: data,
            thisTime: 'V',
        }, () => {
            this.handleStaffModalVisible(true);
        });
    }
    //删除人员
    handleStaffDelete = () => {
        let row = this.state.selectedStaffIds;
        if (row.length !== 0) {
            DeptService.dleDept(row).then(result => {
                message.success('删除成功');
                this.getStaffData();
            });
        } else {
            const ref = info({
                title: '请先选择要删除的部门',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
        this.handleSelectRows([])

    }
    //控制人员弹出框的显示状态
    handleStaffModalVisible = (flag) => {
        let visible = !!flag
        this.setState({
            modalStaffVisible: visible,
        });

        // 页面关闭了要重新查询
        !visible && this.getStaffData();
    }

    //更改部门
    handleChangeDept = () => {
        if (this.state.staffData.length !== 0) {
            this.setState({
                staffEditData: this.state.staffData,
                modalChangeDeptVisible: true,
            });
        } else {
            const ref = info({
                title: '请先选择要修改的人员',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    //控制更改部门弹出框显示状态
    handleChangeDeptVisible = (flag) => {
        let visible = !!flag
        this.setState({
            modalChangeDeptVisible: visible,
        });

        // 页面关闭了要重新查询
        !visible && this.getStaffData();
    }

    //新增角色按钮点击事件
    handleAddRole = () => {
        if (this.state.addRoleTreeDate.length) {
            this.handleAddRoleVisible(true);
        } else {
            const ref = info({
                title: '请先选择要新增的角色',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    //控制添加角色弹出框显示状态
    handleAddRoleVisible = (flag) => {
        let visible = !!flag
        this.setState({
            modalChangeRoleVisible: visible,
        });
        // 页面关闭了要重新查询
        !visible && this.getRoleTree(this.state.staffData)
    }
    //异步加载增加角色的角色树
    onLoadAddRoleTreeData = (treeNode) => {
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
                    addRoleTreeDate: [...this.state.addRoleTreeDate],
                });
                resolve();
            })
        });
    }
    //删除角色
    handleRoleDelete = () => {
        let row = this.state.selectedRoleKeys;
        if (row.length !== 0) {
            DeptService.dleRole(row).then(result => {
                message.success('删除成功');
                this.getRoleTree(this.state.staffData)
            });
        } else {
            const ref = info({
                title: '请先选择要删除的角色',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
        // this.handleSelectRows([])
    }
    // 编辑权限弹框
    editAuthority = () => {
        if (this.state.selectedAuthorityData.length) {
            this.handleEditAuthorityVisible(true);
        } else {
            const ref = info({
                title: '请先选择要编辑的角色或人员',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    // 控制编辑权限弹框显示状态
    handleEditAuthorityVisible = (flag) => {
        let visible = !!flag
        this.setState({
            modalChangeAuthorityVisible: visible,
        });
        // 页面关闭了要重新查询
        !visible && this.changeAuthorityTreeData(this.state.activeKey)
    }
    //切换标签页时获取权限数据
    changeAuthorityTreeData = (activeKey) => {
        let selectedAuthorityData = [];
        let params = ''
        if (activeKey === 'role') {
            params = this.state.selectedRoleKeys[this.state.selectedRoleKeys - 1];
        } else {
            params = this.state.staffData[this.state.staffData - 1]
        }
        this.setState({
            selectedAuthorityData: [],
            authorityTreeAllData: [],
        }, this.getAllAuthorityData())
        DeptService.getAuthorityTree(params).then(result => {
            let treeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId;
                selectedAuthorityData.push(item.key)
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({
                authorityTreeData: treeData,
                activeKey: activeKey,
                selectedAuthorityData: selectedAuthorityData
            });
        });
    }
    //获取所有权限
    getAllAuthorityData = () => {
        DeptService.getAllAuthorityData().then(result => {
            let treeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId;
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({
                authorityTreeAllData: treeData
            });
        })
    }
    // 获取第三区域的数据
    getThirdData = (data) => {
        let staffIds = [];
        if (data.length !== 0) {
            data = data[data.length - 1];
            staffIds = (data.id ? data.id : []);
        }
        DeptService.getDeptTree(data.deptId).then(result => {
            let treeData = result.treeData.map(item => {
                item.title = item.sdeptName;
                item.key = item.ideptId
                item.isLeaf = !item.childCount;
                return item;
            })
            this.setState({
                staffData: data,
                selectedStaffIds: staffIds,
                deptTreeForChangeData: treeData,
            })
        });

        this.getRoleTree(data)
    }

    render() {
        const {departmentData, authorityTreeAllData, deptTreeForChangeData, selectedAuthorityData, modalChangeAuthorityVisible, staffEditData, modalDeptVisible, modalStaffVisible, modalChangeDeptVisible, modalChangeRoleVisible, domainTreeDate, deptTreeData, roleTreeData, addRoleTreeDate, authorityTreeData, staffColumns, formValues} = this.state;
        const {getFieldDecorator} = this.props.form;
        // const defaultDeptSelectedKeys=deptTreeData.length!==0?deptTreeData[0].ideptId.toString():'';
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
                    <div className='dept-logo'>部门列表
                        <Icon
                            className={this.state.collapsed ? 'trigger triggered' : 'trigger'}
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                            style={{'float': 'right'}}
                        />
                    </div>
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
                        <Button onClick={this.handleDeptAdd}>新增</Button>
                        <Button type="dashed" onClick={this.handleDeptUpdate}>修改</Button>
                        <Popconfirm title="确定删除吗?" okText="确定" cancelText="取消" onConfirm={this.handleDeptDelete}>
                            <Button type="danger">删除</Button>
                        </Popconfirm>,
                    </div>
                    <h6 className='departmentH6'>部门导航树</h6>
                    <TreeComponent
                        showLine={true}
                        checkable={true}
                        onSelect={this.onSelectDeptTree}
                        onCheck={this.onSelectDeptTree}
                        treeData={deptTreeData}
                        onLoadData={this.onLoadDeptTreeData}/>
                    <DeptModal
                        departmentData={departmentData}
                        domainTreeDate={[{key: 0, title: '全国'}, {key: 1, title: '湖南'}, {key: 2, title: '北京'}]}
                        modalVisible={modalDeptVisible}
                        thisTime={this.state.thisTime}
                        handleModalVisible={this.handleDeptModalVisible}
                    />
                </Sider>
                <Layout style={{overflow: 'hidden'}}>
                    <Content style={{background: '#fff', minHeight: 280, paddingLeft: "10px"}}>
                        <div>
                            <Tabs type="card">
                                <TabPane tab="人员管理" key="1">
                                    <DeptForm handleAdd={this.handleStaffAdd}
                                              handleEdit={this.handleStaffEdit}
                                              handleDelete={this.handleStaffDelete}
                                              handleChangeDept={this.handleChangeDept}
                                              getStaffParams={this.getStaffData}/>
                                    <StandardTable
                                        ref={child => this.standardTable = child}
                                        rowKey={"id"}
                                        // rowSelection={{selectedRowKeys:[10000]}}
                                        columns={staffColumns}
                                        service={DeptService}
                                        method="getStaffData"
                                        onDoubleClick={this.handelViewStaff}
                                        formValues={formValues}
                                        onSelectRow={this.getThirdData}
                                    />
                                    <StaffModal
                                        departmentData={departmentData}
                                        staffData={staffEditData}
                                        modalVisible={modalStaffVisible}
                                        thisTime={this.state.thisTime}
                                        handleModalVisible={this.handleStaffModalVisible}
                                    />
                                    <ChangeDeptModal
                                        staffData={staffEditData}
                                        domainTreeDate={domainTreeDate}
                                        deptTreeForChangeData={deptTreeForChangeData}
                                        modalChangeDeptVisible={modalChangeDeptVisible}
                                        changeDeptVisible={this.handleChangeDeptVisible}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                        <div>
                            <Tabs type="card" onChange={this.changeAuthorityTreeData}>
                                <TabPane tab="角色" key="role">
                                    <Row className={'thirdBlockBtn'}>
                                        <Col span={12}>
                                            <Button type="primary" onClick={this.handleAddRole}>新增</Button>
                                            <Popconfirm title="确定删除吗?" okText="确定" cancelText="取消"
                                                        onConfirm={this.handleRoleDelete}>
                                                <Button type="danger">删除</Button>
                                            </Popconfirm>
                                        </Col>
                                        <Col span={12}>
                                            <Button type="dashed" onClick={this.editAuthority}>修改</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h6 className='departmentH6'>角色树</h6>
                                            <div style={{'borderRight': '1px solid #ddd'}}>
                                                <TreeComponent
                                                    showLine={true}
                                                    checkable={true}
                                                    defaultExpandedKeys={['0-0-0']}
                                                    onSelect={this.onSelectRoleTree}
                                                    onCheck={this.onSelectRoleTree}
                                                    treeData={roleTreeData}
                                                    onLoadData={this.onLoadRoleTreeData}/>
                                            </div>
                                            <AddRoleModal
                                                addRoleTreeDate={addRoleTreeDate}
                                                modalChangeRoleVisible={modalChangeRoleVisible}
                                                addRoleVisible={this.handleAddRoleVisible}
                                                onLoadData={this.onLoadAddRoleTreeData}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <h6 className='departmentH6'>权限树</h6>
                                            <TreeComponent
                                                showLine={true}
                                                checkable={true}
                                                defaultExpandedKeys={['0-0-0']}
                                                onSelect={this.onSelectAuthorityTree}
                                                onCheck={this.onSelectAuthorityTree}
                                                treeData={authorityTreeData}
                                                onLoadData={this.onLoadAuthorityTreeData}/>
                                            <EditAuthorityModal
                                                authorityTreeAllData={authorityTreeAllData}
                                                modalChangeAuthorityVisible={modalChangeAuthorityVisible}
                                                EditAuthorityVisible={this.handleEditAuthorityVisible}
                                                onLoadData={this.onLoadEditAuthorityTreeData}
                                                selectedAuthorityData={selectedAuthorityData}
                                            />
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="权限" key="authority">
                                    <Row className={'thirdBlockBtn'}>
                                        <Col span={24}>
                                            <Button type="dashed" onClick={this.editAuthority}>修改</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <h6 className='departmentH6'>权限树</h6>
                                            <TreeComponent
                                                showLine={true}
                                                checkable={true}
                                                defaultExpandedKeys={['0-0-0']}
                                                onSelect={this.onSelectAuthorityTree}
                                                onCheck={this.onSelectAuthorityTree}
                                                treeData={authorityTreeData}
                                                onLoadData={this.onLoadAuthorityTreeData}/>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}