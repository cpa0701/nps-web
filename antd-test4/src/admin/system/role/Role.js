import React, {PureComponent} from 'react';
import {Row, Col, Button, Tabs, Radio, Table, Form, Input, Popconfirm, message} from 'antd';

import SysRoleMgService from '../../../services/RoleService';
import DeptService from '../../../services/DeptService';

import Tree from './Tree';
import RoleAdd from './modal/roleModal/RoleAdd';
import RoleEdit from './modal/roleModal/RoleEdit';
import RoleCopy from './modal/roleModal/RoleCopy';

import AuthEdit from './modal/AuthEdit';
import RegEdit from './modal/RegionEdit';
import DeptEdit from './modal/DeptEdit';
import UserAdd from './modal/UserAdd';

import './Role.less';

const [TabPane, RadioGroup, FormItem] = [Tabs.TabPane, Radio.Group, Form.Item];

@Form.create({})
export default class Role extends PureComponent {
    state = {
        treeData: [], // 角色树
        authData: [], // 角色拥有权限树
        regionData: [], // 用户区域管理树
        deptTreeData: [], // 用户所属部门树
        authCheckedKeys: [], // 勾选的角色存在的权限id
        regSelectKeys: [], // 用户所属区域的id
        deptCheckedKeys: [], // 勾选的角色存在的部门id
        userData: [], // 用户表
        deptData: [], // 部门表
        checkedKeys: [], //角色树勾选
        selRowKeys: [], // 用户表勾选
        fullPaths: [], // 角色树扁平化数据
        record: {}, // 编辑角色时的obj数据
        parentId: '0',
        selectedKeys: [],
        loading: false,
        add: false,
        addUser: false,
        edit: false,
        copy: false,
        editAuth: false,
        editReg:false,
        editDept: false,
        // value: 1,
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条用户信息`,
            current: 1,
            total: null,
            pageSize: 10,
        },
    };

    componentDidMount() {
        // 获取角色树
        this.roleQuery();
    }
    isMount = true;
    // 扁平树数据结构
    spread = (dataModel) => {
        let fullPaths = [];
        dataModel.map((item) => {
            if (item.children) {
                this.spread(item.children);
            }
            fullPaths.push(item);
        });
        return fullPaths;
    };

    // 获取角色树
    roleQuery = (params) => {
        const fullPaths = [];
        const spread = dataModel => dataModel.map((item) => {
            fullPaths.push(item);
            if (item.children) {
                spread(item.children);
            }
            return '';
        });
        DeptService.getDeptTree(params)
            .then(res => {
                res.treeData.map(item => {
                    item.title = item.sdeptName;
                    item.key = item.ideptId;
                    item.isLeaf = !item.childCount;
                });
                this.setState({
                    treeData: res.treeData,
                });
                spread(res.treeData);
                this.setState({fullPaths});
            });
    };
    // 异步加载角色树节点
    loadRoleData = (treeNode) => {
        const fullPaths = [];
        const spread = dataModel => dataModel.map((item) => {
            fullPaths.push(item);
            if (item.children) {
                spread(item.children);
            }
            return '';
        });
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
                        treeData: [...this.state.treeData]
                    });
                    spread(result.treeData);
                    this.setState({fullPaths});
                    resolve();
                })
        });
    };
    // 点击角色树节点时
    onSelect = (selectedKeys, info) => {
        const [select] = [...selectedKeys];
        this.setState({
            parentId: select,
            record: info.node.props.dataRef
        });
        let params = {roleId: select};
        this.authQuery(params);
        this.getUserData(params);
    };
    // 勾选角色树节点时
    onCheck = (checkedKeys) => {
        let params = {roleId: checkedKeys};
        this.setState({ checkedKeys });
        this.authQuery(params);
        this.getUserData(params);
    };
    // 新增角色
    addRoleModal = (show) => {
        if (show) {
            this.setState({add: true});
        } else {
            this.setState({add: false});
        }
    };
    // 编辑角色
    editRoleModal = (show, record, checkedKeys, type) => {
        if (Object.keys(record).length !== 0) {
            this.setState({
                edit: true
            });
        } else if (checkedKeys.length === 1) {
            let record = this.state.fullPaths.filter(item => item.key === checkedKeys[0])[0];
            if(record) {
                this.setState({
                    edit: true,
                    record
                });
            }
        } else if (checkedKeys.length > 1) {
            message.info('一次只能编辑一条角色');
        } else if(type === 1) {
            this.setState({edit: false});
        } else {
            this.setState({edit: false});
            message.info('请选择需要编辑的角色');
        }
    };
    // 复制角色
    copyRoleModal = (show, record, checkedKeys, type) => {
        if (Object.keys(record).length !== 0) {
            this.setState({
                copy: true
            });
        } else if (checkedKeys.length === 1) {
            let record = this.state.fullPaths.filter(item => item.key === checkedKeys[0])[0];
            if(record) {
                this.setState({
                    copy: true,
                    record
                });
            }
        } else if (checkedKeys.length > 1) {
            message.info('一次只能复制一条角色');
        } else if(type === 1) {
            this.setState({copy: false});
        } else {
            this.setState({copy: false});
            message.info('请选择需要复制的角色');
        }
    };
    // 删除角色
    delRoles = () => {
        let checkedKeys = this.state.checkedKeys;
        if(checkedKeys.length === 0) {
            message.info('请选择要删除的角色');
            return;
        }
        this.setState({loading: true}, () => {
            SysRoleMgService.delRoles({ids: checkedKeys}).then((res) => {
                if (res.code === 0) {
                    message.success('删除成功');
                    this.treeQuery();
                    if (this.isMount) {
                        this.setState({loading: false});
                    }
                } else {
                    message.error('删除失败');
                    if (this.isMount) {
                        this.setState({loading: false});
                    }
                }
            });
        });
    };

    // 获取角色拥有权限树
    authQuery = (params) => {
        const fullPaths = [];
        const spread = dataModel => dataModel.map((item) => {
            fullPaths.push(item);
            if (item.children) {
                spread(item.children);
            }
            return '';
        });
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

                spread(res.treeData);
                let authCheckedKeys = [];
                fullPaths.map(item => {
                    authCheckedKeys.push(item.ideptId);
                });
                console.log('rrr',authCheckedKeys);
                this.setState({authCheckedKeys});
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
    // 编辑权限
    editAuthModal = (show, checkedKeys, type) => {
        if (checkedKeys.length !== 0) {
            this.setState({
                editAuth: true
            });
        } else if (type === 1) {
            this.setState({editAuth: false});
        } else {
            this.setState({editAuth: false});
            message.info('请选择需要编辑权限的角色');
        }
    };
    // 批量删除权限
    delAuths = () => {
        let checkedKeys = this.state.checkedKeys;
        if(checkedKeys.length === 0) {
            message.info('请在左侧勾选要删除权限的角色');
            return;
        }
        this.setState({loading: true}, () => {
            SysRoleMgService.delRolePriv({ids: checkedKeys}).then((res) => {
                if (res.code === 0) {
                    message.success('删除成功');
                    // this.treeQuery(); 删除成功动作
                    if (this.isMount) {
                        this.setState({loading: false});
                    }
                } else {
                    message.error('删除失败');
                    if (this.isMount) {
                        this.setState({loading: false});
                    }
                }
            });
        });
    };

    // 全局域/个性域切换
    // onChange = (e) => {
    //     this.setState({
    //         value: e.target.value,
    //     });
    // };

    // 获取角色区域树
    regionQuery = (params) => {
        SysRoleMgService.qryRegionTree(params)
            .then(res => {
                res.treeData.map(item => {
                    item.title = item.sdeptName;
                    item.key = item.ideptId;
                    item.isLeaf = !item.childCount;
                });
                this.setState({
                    regionData: res.treeData,
                });
            });
    };
    //异步加载区域树节点
    // loadRegData = (treeNode) => {
    //     return new Promise((resolve) => {
    //         if (treeNode.props.children) {
    //             resolve();
    //             return;
    //         }
    //         SysRoleMgService.qryRegTree(treeNode.props.dataRef)
    //             .then(result => {
    //                 result.treeData.map(item => {
    //                     item.title = item.sdeptName;
    //                     item.key = item.ideptId;
    //                     item.isLeaf = !item.childCount;
    //                 });
    //                 treeNode.props.dataRef.children = [...result.treeData];
    //                 this.setState({
    //                     regionData: [...this.state.regionData]
    //                 });
    //                 resolve();
    //             })
    //     });
    // };
    // 编辑选择区域
    editRegionModal = (show, checkedKeys, type) => {
        if (checkedKeys.length !== 0) {
            this.setState({
                editReg: true
            });
        } else if (type === 1) {
            this.setState({editReg: false});
        } else {
            this.setState({editReg: false});
            message.info('请选择需要选择区域的角色');
        }
    };

    // 获取部门树
    deptQuery = (params) => {
        DeptService.getDeptTree(params)
            .then(res => {
                res.treeData.map(item => {
                    item.title = item.sdeptName;
                    item.key = item.ideptId;
                    item.isLeaf = !item.childCount;
                });
                this.setState({
                    deptTreeData: res.treeData,
                });
            });
    };
    //异步加载部门树节点
    loadDeptData = (treeNode) => {
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
                        deptTreeData: [...this.state.deptTreeData]
                    });
                    resolve();
                })
        });
    };
    // 编辑权限
    editDeptModal = (show, checkedKeys, type) => {
        if (checkedKeys.length !== 0) {
            this.setState({
                editDept: true
            });
        } else if (type === 1) {
            this.setState({editDept: false});
        } else {
            this.setState({editDept: false});
            message.info('请选择需要编辑部门的角色');
        }
    };

    // 获取人员信息表格数据
    getUserData = (values) => {
        SysRoleMgService.getUserDate(values).then(result => {
            this.setState({
                userData: [...result.userData]
            });
        });
    };
    // 点击查询用户表格
    handleSearch = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            let params = {
                ...values,
                roleId: this.state.checkedKeys
            };
            this.getUserData(params);
        });
    };
    // 获取勾选用户表格id
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys', selectedRowKeys);
        this.setState({ selRowKeys: selectedRowKeys });
    };
    // 新增角色
    addUsers = (show, type) => {
        if (show.length !== 0) {
            this.setState({
                addUser: true
            });
        } else if (type === 1) {
            this.setState({addUser: false});
        } else {
            this.setState({addUser: false});
            message.info('请选择需要新增人员的角色');
        }
    };
    // 删除用户
    delUsers = () => {
        let selRowKeys = this.state.selRowKeys;
        if(selRowKeys.length === 0) {
            message.info('请选择要删除的用户');
            return;
        }
        this.setState({loading: true}, () => {
            SysRoleMgService.delUsers({ids: selRowKeys}).then((res) => {
                if (res.code === 0) {
                    message.success('删除成功');
                    this.getUserData();
                    if (this.isMount) {
                        this.setState({loading: false});
                    }
                } else {
                    message.error('删除失败');
                    if (this.isMount) {
                        this.setState({loading: false});
                    }
                }
            });
        });
    };

    render() {
        const {
            pagination,
            loading,
            userData,
            deptData,
            treeData,
            authData,
            regionData,
            selectedKey,
            checkedKeys,
            authCheckedKeys,
            selRowKeys,
            regSelectKeys
        } = this.state;
        // 表格列
        const userColumns = [
            {
                title: '用户名称',
                dataIndex: 'userName',
                width: '20%'
            },
            {
                title: '部门名称',
                dataIndex: 'deptName',
                width: '60%'
            },
            {
                title: '创建者',
                dataIndex: 'create',
                width: '20%'
            }
        ];
        const deptColumns = [
            {
                title: '部门名称',
                dataIndex: 'name',
                width: '20%'
            },
            {
                title: '部门路径',
                dataIndex: 'chName',
                width: '30%'
            },
            {
                title: '所属区域',
                dataIndex: 'modelDir',
                width: '30%'
            },
            {
                title: '所属区域标识  ',
                dataIndex: 'modelDes'
            }
        ];
        const rowSelection = {
            selectedRowKeys: selRowKeys,
            onChange: this.onSelectChange,
        };

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 12},
        };

        // 角色、权限、区域、部门树
        const roleProps = {// 树索要用到的参数
            treeData, // 要一级数据.
            selectedKey,
            checkedKeys,
            checkable: true,
            onCheck: (checkedKeys) => {
                this.onCheck(checkedKeys);
            },
            onSelect: (selectedKeys, info) => {
                this.onSelect(selectedKeys, info);
            }
        };
        const authProps = {// 树索要用到的参数
            treeData: authData, // 要一级数据.
            selectedKey,
            checkable: false,
        };
        const regionProps = {// 表所要用到的参数
            treeData: regionData,
            selectedKey,
            checkable: false,
        };
        const deptProps = {// 表所要用到的参数
            treeData,
            checkable: false,
        };

        // 角色新增、编辑、复制传参
        const addModalProps = {
            add: this.state.add,
            parentId: this.state.parentId,
            onClose: () => {
                this.addRoleModal(false);
            },
            onCreate: (values) => {
                SysRoleMgService.addRoles({...values}).then((res) => {
                    if (res.code === 0) {
                        message.success('保存成功');
                        if (this.isMount) {
                            this.setState({add: false}, () => {
                                this.treeQuery();
                            });
                        }
                    } else {
                        message.error('保存失败');
                        if (this.isMount) {
                            this.setState({loading: false});
                        }
                    }
                });
            },
        };
        const editModalProps = {
            edit: this.state.edit,
            role: this.state.record,
            onClose: () => {
                this.editRoleModal(false, {}, {}, 1);
                },
            onCreate: (values) => {
                SysRoleMgService.editRoles({...values}).then((data) => {
                    if (data.code === 0) {
                        message.success('编辑成功!');
                        if (this.isMount) {
                            this.setState({edit: false}, () => {
                                this.treeQuery();
                            });
                        }
                    } else {
                        message.error('编辑失败');
                        if (this.isMount) {
                            this.setState({loading: false});
                        }
                    }
                });
            },
        };
        const copyModalProps = {
            copy: this.state.copy,
            role: this.state.record,
            onClose: () => {
                this.copyRoleModal(false, {}, {}, 1);
            },
            onCreate: (values) => {
                SysRoleMgService.copyRoles({...values}).then((data) => {
                    if (data.code === 0) {
                        message.success('复制成功!');
                        if (this.isMount) {
                            this.setState({edit: false}, () => {
                                this.treeQuery();
                            });
                        }
                    } else {
                        message.error('复制失败');
                        if (this.isMount) {
                            this.setState({loading: false});
                        }
                    }
                });
            },
        };
        // 权限编辑
        const editAuthModalProps = {
            editAuth: this.state.editAuth,
            checkedKeys: authCheckedKeys,
            onClose: () => {
                this.editAuthModal(false, [], 1);
            },
            onCreate: () => {
                let params = {
                    userIds: checkedKeys,
                    authIds: authCheckedKeys
                };
                console.log(params);

                SysRoleMgService.editRolePriv({...params}).then((data) => {
                    if (data.code === 0) {
                        message.success('修改权限成功!');
                        if (this.isMount) {
                            this.setState({editAuth: false}, () => {
                                // this.treeQuery(); 编辑完后进行的动作
                            });
                        }
                    } else {
                        message.error('修改权限失败');
                        if (this.isMount) {
                            this.setState({loading: false});
                        }
                    }
                });
            },
            onCheck: (checkedKeys) => {
                this.setState({ authCheckedKeys: checkedKeys });
            },
        };
        // 区域编辑
        const editRegModalProps = {
            editReg: this.state.editReg,
            regSelectKeys,
            onClose: () => {
                this.editRegionModal(false, [], 1);
            },
            onCreate: () => {
                let params = {
                    userIds: checkedKeys,
                    regionIds: regSelectKeys
                };
                SysRoleMgService.editRegion({...params}).then((data) => {
                    if (data.code === 0) {
                        message.success('修改区域成功!');
                        if (this.isMount) {
                            this.setState({editAuth: false}, () => {
                                // this.treeQuery(); 编辑完后进行的动作
                            });
                        }
                    } else {
                        message.error('修改区域失败');
                        if (this.isMount) {
                            this.setState({loading: false});
                        }
                    }
                });
            },
            onSelectChange: (selectedRowKeys, selectedRows) => { // 载入数据.
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({ regSelectKeys: selectedRowKeys });
            },
        };
        // 部门编辑
        const editDeptModalProps = {
            edit: this.state.editDept,
            checkedKeys: this.state.deptCheckedKeys,
            onClose: () => {
                this.editDeptModal(false, [], 1);
            },
            onCreate: (values) => {
                let params = new Object();
                params.userIds = checkedKeys;
                params.deptIds = values;

                DeptService.ediDept({...params}).then((data) => {
                    if (data.code === 0) {
                        message.success('修改部门成功!');
                        if (this.isMount) {
                            this.setState({editDept: false}, () => {
                                // this.treeQuery(); 编辑完后进行的动作
                            });
                        }
                    } else {
                        message.error('修改部门失败');
                        if (this.isMount) {
                            this.setState({loading: false});
                        }
                    }
                });
            },
            onCheck: (checkedKeys) => {
                this.setState({ deptCheckedKeys: checkedKeys });
            },
            onCheckSelect: (checkedKeys) => {
                this.setState({ deptCheckedKeys: checkedKeys });
            },
        };
        // 人员新增
        const addUserModalProps = {
            add: this.state.addUser,
            checkedKeys: this.state.deptCheckedKeys,
            onClose: () => {
                this.addUsers([], 1);
            },
            onCreate: (values) => {

            }
        };

        return (
            <div className="content-inner">
                <Row>
                    <Col span={5} className="leftTree">
                        <header>角色列表</header>
                        <div className="btnGroup">
                            <Button type="primary" icon="plus-circle-o" onClick={() => this.addRoleModal(true)}>新增</Button>
                            <div className="divider"></div>
                            <Button type="primary" icon="edit" onClick={() => this.editRoleModal(true, this.state.record, this.state.checkedKeys, 0)}>修改</Button>
                            <div className="divider"></div>
                            <Popconfirm
                                onConfirm={() => this.delRoles()}
                                title={<span>此操作将删除所勾选的角色？</span>}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="danger" icon="delete">删除</Button>
                            </Popconfirm>
                            <div className="divider"></div>
                            <Button type="primary" icon="copy" onClick={() => this.copyRoleModal(true, this.state.record, this.state.checkedKeys, 0)}>复制</Button>
                        </div>
                        <div className="treeStyle">
                            <Tree {...roleProps} onLoadData={this.loadRoleData}/>
                        </div>
                    </Col>
                    <Col span={19} className="rightContent">
                       <div>
                           <Tabs type="card">
                               <TabPane tab="权限管理" key="1">
                                   <div className="btnGroup" style={{width: '18%', padding: '5px 0'}}>
                                       <Button type="primary" icon="edit" style={{width: '42%'}} onClick={() => this.editAuthModal(true, this.state.checkedKeys, 0)}>修改权限</Button>
                                       <div className="divider"></div>
                                       <Button type="danger" icon="delete" style={{width: '42%'}} onClick={() => this.delAuths()}>批量删权</Button>
                                       {/*<div className="divider"></div>*/}
                                       {/*<Button type="primary" icon="edit">修改个性域</Button>*/}
                                       {/*<div className="divider"></div>*/}
                                       {/*<Button type="danger" icon="delete">取消个性域</Button>*/}
                                       {/*<div className="divider"></div>*/}
                                       {/*<RadioGroup onChange={this.onChange} value={this.state.value}>*/}
                                           {/*<Radio value={1}>全局域</Radio>*/}
                                           {/*<Radio value={2}>个性域</Radio>*/}
                                       {/*</RadioGroup>*/}
                                   </div>
                                   <div className="authorityManage">
                                        <header>权限名称</header>
                                        <Tree {...authProps}  onLoadData={this.loadAuthData}/>
                                   </div>
                               </TabPane>
                               {/*<TabPane tab="区域管理" key="2">*/}
                                   {/*<div className="btnGroup btnGroupOther">*/}
                                       {/*<Button type="primary" icon="edit" onClick={() => this.editRegionModal(true, this.state.checkedKeys, 0)}>修改</Button>*/}
                                   {/*</div>*/}
                                   {/*<div className="deptManage">*/}
                                       {/*<header>区域名称(全局区域)</header>*/}
                                       {/*<Tree {...regionProps}  onLoadData={this.loadRegData}/>*/}
                                   {/*</div>*/}
                               {/*</TabPane>*/}
                               {/*<TabPane tab="部门管理" key="3">*/}
                                   {/*<div className="btnGroup btnGroupOther">*/}
                                       {/*<Button type="primary" icon="edit" onClick={() => this.editDeptModal(true, this.state.checkedKeys, 0)}>修改</Button>*/}
                                   {/*</div>*/}
                                   {/*<div className="deptManage">*/}
                                       {/*<header>部门名称-区域</header>*/}
                                       {/*<Tree {...deptProps}  onLoadData={this.loadDeptData}/>*/}
                                   {/*</div>*/}
                               {/*</TabPane>*/}
                           </Tabs>
                       </div>
                        <div>
                            <Tabs type="card">
                                <TabPane tab="人员" key="1">
                                    <div className="searchForm">
                                        <Form layout="inline">
                                            <FormItem
                                                {...formItemLayout}
                                                label="部门名称"
                                                style={{"marginBottom": 0}}
                                            >
                                                {getFieldDecorator('deptName', {
                                                    rules: [{required: false}],
                                                })(
                                                    <Input/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="用户名称"
                                                style={{"marginBottom": 0}}
                                            >
                                                {getFieldDecorator('userName', {
                                                    rules: [{required: false}],
                                                })(
                                                    <Input/>
                                                )}
                                            </FormItem>
                                        </Form>
                                    </div>
                                    <div className="btnGroup" style={{width: '20%', padding: '5px 2px'}}>
                                        <Button type="primary" onClick={this.handleSearch} icon="search" className="btnThre">查询</Button>
                                        <div className="divider"></div>
                                        <Button type="primary" icon="plus-circle-o" className="btnThre"onClick={() => this.addUsers(this.state.checkedKeys, 0)}>新增</Button>
                                        <div className="divider"></div>
                                        <Popconfirm
                                            onConfirm={() => this.delUsers()}
                                            title={<span>此操作将删除所勾选的用户？</span>}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <Button type="danger" icon="delete" className="btnThre">删除</Button>
                                        </Popconfirm>
                                    </div>
                                    <Table
                                        columns={userColumns}
                                        rowSelection={rowSelection}
                                        rowKey={record => `${record.id}`}
                                        dataSource={userData}
                                        pagination={pagination}
                                        onChange={this.handleTableChange}
                                        loading={loading}
                                        size="small"
                                    />
                                </TabPane>
                                {/*<TabPane tab="部门" key="2">*/}
                                    {/*<div className="btnGroup btnGroupOther">*/}
                                        {/*<Button type="primary" icon="edit" onClick={() => this.editDeptModal(true, this.state.checkedKeys, 0)}>修改</Button>*/}
                                    {/*</div>*/}
                                    {/*<Table*/}
                                        {/*columns={deptColumns}*/}
                                        {/*rowKey={record => `${record.id}`}*/}
                                        {/*dataSource={deptData}*/}
                                        {/*loading={loading}*/}
                                        {/*scroll={{ y: 240 }}*/}
                                        {/*size="small"*/}
                                    {/*/>*/}
                                {/*</TabPane>*/}
                            </Tabs>
                        </div>
                    </Col>
                </Row>
                <RoleAdd {...addModalProps}/>
                <RoleEdit {...editModalProps}/>
                <RoleCopy {...copyModalProps}/>

                <AuthEdit {...editAuthModalProps}/>
                {/*<RegEdit {...editRegModalProps}/>*/}
                {/*<DeptEdit {...editDeptModalProps}/>*/}
                <UserAdd {...addUserModalProps}/>
            </div>
        )
    }
}