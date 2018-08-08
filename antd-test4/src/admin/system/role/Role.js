import React, {PureComponent} from 'react';
import {Row, Col, Button, Tabs, Radio, Table, Form, Input, Popconfirm, message} from 'antd';

import SysRoleMgService from '../../../services/RoleService';

import Tree from './Tree';
import RoleAdd from './modal/roleModal/RoleAdd';
import RoleEdit from './modal/roleModal/RoleEdit';
import RoleCopy from './modal/roleModal/RoleCopy';

import './Role.less';

const [TabPane, RadioGroup, FormItem] = [Tabs.TabPane, Radio.Group, Form.Item];

@Form.create({})
export default class Role extends PureComponent {
    state = {
        treeData: [], // 角色树
        authData: [], // 权限树
        domainData: [], // 区域管理树
        userData: [], // 用户表
        deptData: [], // 部门表
        checkedKeys: [], //角色树勾选
        selRowKeys: [], // 用户表勾选
        fullPaths: [], // 角色树扁平化数据
        record: {},
        parentId: '0',
        selectedKeys: [],
        loading: false,
        add: false,
        edit: false,
        copy: false,
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
    roleQuery = () => {
        const fullPaths = [];
        const spread = dataModel => dataModel.map((item) => {
            fullPaths.push(item);
            if (item.children) {
                spread(item.children);
            }
            return '';
        });
        SysRoleMgService.qryRoleTree()
            .then(res => {
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
            SysRoleMgService.qryRoleTree(treeNode.props.dataRef)
                .then(result => {
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
    };
    // 勾选角色树节点时
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
    };

    // 获取权限树
    authQuery = () => {
        SysRoleMgService.qryAuthTree()
            .then(res => {
                this.setState({
                    authData: res.authData,
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
            SysRoleMgService.qryAuthTree(treeNode.props.dataRef)
                .then(result => {
                    treeNode.props.dataRef.children = [...result.authData];
                    this.setState({
                        authData: [...this.state.authData]
                    });
                    resolve();
                })
        });
    };

    // 全局域/个性域切换
    // onChange = (e) => {
    //     this.setState({
    //         value: e.target.value,
    //     });
    // };

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
                if (res.success) {
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
            this.getUserData(values);
        });
    };
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys', selectedRowKeys);
        this.setState({ selRowKeys: selectedRowKeys });
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
                if (res.success) {
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
            selectedKey,
            checkedKeys,
            selRowKeys
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

        // 角色、权限树
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
            },
            onLoadData: (treeNode) => { // 载入数据.
                this.loadRoleData(treeNode);
            },
        };
        const authProps = {// 树索要用到的参数
            treeData, // 要一级数据.
            selectedKey,
            checkable: false,
            onLoadData: (treeNode) => { // 载入数据.
                this.loadAuthData(treeNode);
            },
        };

        // 新增\编辑传参
        const addModalProps = {
            add: this.state.add,
            parentId: this.state.parentId,
            onClose: () => {
                this.addRoleModal(false);
            },
            onCreate: (values) => {
                SysRoleMgService.addRoles({...values}).then((res) => {
                    if (res.success) {
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
                    if (data.success) {
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
                    if (data.success) {
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
                            <Tree {...roleProps}/>
                        </div>
                    </Col>
                    <Col span={19} className="rightContent">
                       <div>
                           <Tabs type="card">
                               <TabPane tab="权限管理" key="1">
                                   <div className="btnGroup" style={{width: '18%', padding: '5px 0'}}>
                                       <Button type="primary" icon="edit" style={{width: '42%'}}>修改权限</Button>
                                       <div className="divider"></div>
                                       <Button type="danger" icon="delete" style={{width: '42%'}}>批量删权</Button>
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
                                        <Tree {...authProps}/>
                                   </div>
                               </TabPane>
                               <TabPane tab="区域管理" key="2">
                                   <div className="btnGroup btnGroupOther">
                                       <Button type="primary" icon="edit">修改</Button>
                                   </div>
                                   <div className="deptManage">
                                       <header>区域名称(全局区域)</header>
                                       <Tree {...authProps}/>
                                   </div>
                               </TabPane>
                               <TabPane tab="部门管理" key="3">
                                   <div className="btnGroup btnGroupOther">
                                       <Button type="primary" icon="edit">修改</Button>
                                   </div>
                                   <div className="deptManage">
                                       <header>部门名称-区域</header>
                                       <Tree {...authProps}/>
                                   </div>
                               </TabPane>
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
                                        <Button type="primary" icon="plus-circle-o" className="btnThre">新增</Button>
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
                                <TabPane tab="部门" key="2">
                                    <div className="btnGroup btnGroupOther">
                                        <Button type="primary" icon="edit">修改</Button>
                                    </div>
                                    <Table
                                        columns={deptColumns}
                                        rowKey={record => `${record.id}`}
                                        dataSource={deptData}
                                        loading={loading}
                                        scroll={{ y: 240 }}
                                        size="small"
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
                <RoleAdd {...addModalProps}/>
                <RoleEdit {...editModalProps}/>
                <RoleCopy {...copyModalProps}/>
            </div>
        )
    }
}