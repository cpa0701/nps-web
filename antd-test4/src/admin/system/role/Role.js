import React, {PureComponent} from 'react';
import {Row, Col, Button, Tabs, Radio, Table} from 'antd';

import SysRoleMgService from '../../../services/RoleService';

import RoleTree from './Tree';
// 权限树待引
import AuthorityTree from './Tree'

import './Role.less';
import DomainService from "../../../services/DomainService";

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

export default class Role extends PureComponent {
    state = {
        treeData: [],
        selectedKeys: '',
        loading: false,
        value: null,
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条用户信息`,
            current: 1,
            total: null,
            pageSize: 10,
        },
        userData: [],
        deptData: []
    };

    componentDidMount() {
        this.treeQuery();
    }
    //点击角色树节点时
    onSelect = (selectedKeys, info) => {
        const [select] = [...selectedKeys];
        if (this.delay !== null) {
            clearTimeout(this.delay);
        }
        this.delay = setTimeout(() => {
            this.setState({selectedKeys: select});
        }, 300);
    };
    //异步加载树节点
    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            SysRoleMgService.qryRoleTree(treeNode.props.dataRef)
                .then(result => {
                    treeNode.props.dataRef.children = [...result.treeData];
                    this.setState({
                        treeData: [...this.state.treeData],
                    });
                    resolve();
            })
        });
    };
    isMount = true;
    treeQuery = () => {
        SysRoleMgService.qryRoleTree()
            .then(res => {
                this.setState({
                    treeData: res.treeData
                });
            });
    };

    // 全局域/个性域切换
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
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
                dataIndex: 'modelDes',
                width: '30%'
            }
        ];
        const {
            pagination,
            loading,
            userData,
            deptData,
            treeData,
            selectedKey
        } = this.state;
        const roleProps = {// 树索要用到的参数
            treeData, // 要一级数据.
            selectedKey,
            onSelect(selectedKeys, info) {
                const id = info[0];
                this.onSelect(selectedKeys, info);
            },
            onLoadData(treeNode) { // 载入数据.
                const id = treeNode.props.eventKey;
                // this.onLoadData(id);
            },
        };
        const authProps = {// 树索要用到的参数
            treeData, // 要一级数据.
            selectedKey,
            onSelect(info) {
                const id = info[0];
            },
            onLoadData(treeNode) { // 载入数据.
                const id = treeNode.props.eventKey;
            },
        };

        return (
            <div className="content-inner">
                <Row>
                    <Col span={5} className="leftTree">
                        <header>角色列表</header>
                        <div className="btnGroup">
                            <Button type="primary" icon="plus-circle-o">新增</Button>
                            <div className="divider"></div>
                            <Button type="primary" icon="edit">修改</Button>
                            <div className="divider"></div>
                            <Button type="danger" icon="delete">删除</Button>
                            <div className="divider"></div>
                            <Button type="primary" icon="copy">复制</Button>
                        </div>
                        <div className="treeStyle">
                            <RoleTree {...roleProps}/>
                        </div>
                    </Col>
                    <Col span={19} className="rightContent">
                       <div>
                           <Tabs type="card">
                               <TabPane tab="权限管理" key="1">
                                   <div className="btnGroup">
                                       <Button type="primary" icon="edit">修改权限</Button>
                                       <div className="divider"></div>
                                       <Button type="danger" icon="delete">批量删权</Button>
                                       <div className="divider"></div>
                                       <Button type="primary" icon="edit">修改个性域</Button>
                                       <div className="divider"></div>
                                       <Button type="danger" icon="delete">取消个性域</Button>
                                       <div className="divider"></div>
                                       <RadioGroup onChange={this.onChange} value={this.state.value}>
                                           <Radio value={1}>全局域</Radio>
                                           <Radio value={2}>个性域</Radio>
                                       </RadioGroup>
                                   </div>
                                   <div className="authorityManage">
                                        <header>权限名称</header>
                                        <AuthorityTree {...authProps}/>
                                   </div>
                               </TabPane>
                               <TabPane tab="区域管理" key="2">
                                   <div className="deptManage"></div>
                               </TabPane>
                               <TabPane tab="部门管理" key="3">
                                   <div className="btnGroup" style={{width: '26%', justifyContent: 'flex-start', padding: '5px'}}>
                                       <Button type="primary" icon="edit">修改</Button>
                                   </div>
                                   <div className="deptManage">
                                       <header>部门名称-区域</header>
                                       <AuthorityTree {...authProps}/>
                                   </div>
                               </TabPane>
                           </Tabs>
                       </div>
                        <div>
                            <Tabs type="card">
                                <TabPane tab="人员" key="1">
                                    <div className="searchForm">

                                    </div>
                                    <div className="btnGroup" style={{width: '20%', padding: '5px 2px'}}>
                                        <Button type="primary" icon="search" className="btnThre">查询</Button>
                                        <div className="divider"></div>
                                        <Button type="primary" icon="plus-circle-o" className="btnThre">新增</Button>
                                        <div className="divider"></div>
                                        <Button type="danger" icon="delete" className="btnThre">删除</Button>
                                    </div>
                                    <Table
                                        columns={userColumns}
                                        rowKey={record => `${record.id}`}
                                        dataSource={userData}
                                        pagination={pagination}
                                        onChange={this.handleTableChange}
                                        loading={loading}
                                        size="small"
                                    />
                                </TabPane>
                                <TabPane tab="部门" key="2">
                                    <div className="btnGroup" style={{width: '26%', justifyContent: 'flex-start', padding: '5px'}}>
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
            </div>
        )
    }
}