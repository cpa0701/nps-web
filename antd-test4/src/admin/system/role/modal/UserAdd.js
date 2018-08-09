import React, { Component } from 'react';
import { Modal, Row, Col, Input, Form, Checkbox, Tabs, Button, Table, Tree, TreeSelect } from 'antd';

import '../Role.less';
import DeptService from "../../../../services/DeptService";
import SysRoleMgService from "../../../../services/RoleService";

const {TextArea} = Input;
const [FormItem, CheckboxGroup, TabPane, SHOW_PARENT, TreeNode] =
    [Form.Item, Checkbox.Group, Tabs.TabPane, TreeSelect.SHOW_PARENT, Tree.TreeNode];

@Form.create()
export default class extends Component {
    state = {
        selRowName: [],
        selRowName1: [],
        selRowName2: [],
        selRowKeys: [],
        selRowKeys1: [],
        selRowKeys2: [],
        checkedId: [],
        checkedList: [],
        tableList: [],
        tableList1: [],
        tableList2: [],
        userData1: [
            {
                ID: 111,
                name: 'lll',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 112,
                name: 'nnn',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 113,
                name: 'mmm',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 114,
                name: 'ooo',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
        ],
        userData: [
            {
                ID: 111,
                name: 'lll',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 1,
                name: 'aaa',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 2,
                name: 'bbb',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 3,
                name: 'ccc',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 4,
                name: 'ddd',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 5,
                name: 'eee',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 6,
                name: 'fff',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 7,
                name: 'ggg',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 8,
                name: 'hhh',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 9,
                name: 'iii',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 10,
                name: 'jjj',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
            {
                ID: 11,
                name: 'kkk',
                deptName: 'eee',
                synch: '1',
                phone: 12113
            },
        ],
        treeData: [],
        domainTreeDate: [],
        selectedRowKeys: [],
        value: undefined,
        indeterminate: false,
        checkAll: true,
        loading: false,
    };
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
        });
        a = a.replace(/SDOMAINNAME/g, "title").replace(/SDOMAINCODE/g, "value").replace(/IDOMAINID/g, "key");
        this.setState({
            domainTreeDate: [JSON.parse(a)]
        });
        this.deptQuery();
        // this.seaUserQuery();
    }

    onSubmit = () => {
        this.props.onCreate({userId: this.state.checkedId});
    };
    afterClose = () => {
      this.props.form.resetFields();
      this.setState({
          selRowName: [],
          selRowKeys: [],
          checkedList: [],
          userData1: [],
          userData: [],
          treeData: [],
          domainTreeDate: [],
          selectedRowKeys1: [],
          selectedRowKeys: [],
          value: undefined,
          indeterminate: false,
          checkAll: false,
      })
    };

    // 选择区域树
    onSelChange = (value) => {
        let deptName = this.props.form.getFieldValue('deptName');
        this.setState({value});
        let params = {
            deptName,
            region: value
        };
        this.deptQuery(params);
    };
    // 输入部门搜索时
    deptNameChange = (e) => {
        let params = {
            deptName: e.target.value,
            region: this.state.value
        };
        this.deptQuery(params);
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
                    treeData: res.treeData,
                });
            });
    };
    // 异步加载树节点
    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            DeptService.getDeptTree(treeNode.props.dataRef).then(result => {
                treeNode.props.dataRef.children = [...result.treeData];
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            })
        });
    };
    // 点击部门树节点时
    onSelect = (selectedKeys, info) => {
        this.setState({
            selectedKeys: selectedKeys
        });
        let params = {
            deptId: selectedKeys
        };
        this.selUserQuery(params);
    };

    // 渲染树节点
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
    };

    // 右侧勾选单个框
    onChange = (checkedList) => {
        var checkedId = checkedList.map((item) => {
           return this.state.tableList.find(k => k.name === item).ID;
        });
        this.setState({
            checkedId,
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.selRowName.length),
            checkAll: checkedList.length === this.state.selRowName.length,
        });
    };
    // 右侧勾选所有框
    onCheckAllChange = (e) => {
        this.setState({
            checkedId: e.target.checked ? this.state.selRowKeys : [],
            checkedList: e.target.checked ? this.state.selRowName : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    // 获取选择页人员表格信息
    selUserQuery = (params) => {
        SysRoleMgService.getUserDate(params)
            .then(res => {
                this.setState({
                    userData1: res.userData1,
                });
            });
    };
    // 获取搜索页人员表格信息
    seaUserQuery = (params) => {
        SysRoleMgService.getUserDate(params)
            .then(res => {
                this.setState({
                    userData: res.userData,
                });
            });
    };

    // 获取选择页勾选人员表格id
    onSelectChange = (selectedRowKeys, selectedRowsValue) => {
        if(selectedRowsValue) {
            let selRowName = [], selRowKeys = [];
            selectedRowsValue.map(item => {
                // if(!this.state.selRowName.includes(item.name)){
                selRowName.push(item.name);
                selRowKeys.push(item.ID);
                // }
            });
            this.setState({
                selRowName1: selRowName,
                selRowKeys1: selRowKeys,
                tableList1: selectedRowsValue,
                selectedRowKeys,
                selRowName: [...new Set([...selRowName, ...this.state.selRowName2])],
                selRowKeys: [...new Set([...selRowKeys, ...this.state.selRowKeys2])],
                tableList: [...selectedRowsValue, ...this.state.tableList2]
            }, () => {
                this.setState({checkedId: this.state.selRowKeys, checkedList: this.state.selRowName})
            });
        }
    };
    // 获取搜索页勾选人员表格id
    onSearchChange = (selectedRowKeys, selectedRowsValue) => {
        if(selectedRowsValue) {
            let selRowName = [], selRowKeys = [];
            selectedRowsValue.map(item => {
                selRowName.push(item.name);
                selRowKeys.push(item.ID);
            });
            this.setState({
                selRowName2: selRowName,
                selRowKeys2: selRowKeys,
                tableList2: selectedRowsValue,
                selectedRowKeys,
                selRowName: [...new Set([...selRowName, ...this.state.selRowName1])],
                selRowKeys: [...new Set([...selRowKeys, ...this.state.selRowKeys1])],
                tableList: [...selectedRowsValue, ...this.state.tableList1]
            }, () => {
                this.setState({checkedId: this.state.selRowKeys, checkedList: this.state.selRowName})
            });
        }
    };

    // 点击搜索按钮
    search =() => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.seaUserQuery(values);
        });
    };

    render() {
      const {add, form: {getFieldDecorator}} = this.props;
      const {
          userData1,
          userData,
          loading,
          indeterminate,
          checkAll,
          selRowName,
          selRowKeys,
          checkedList,
          selectedRowKeys1,
          selectedRowKeys,
          domainTreeDate
      } = this.state;

      const formItemLayout = {
        labelCol: {span: 10},
        wrapperCol: {span: 14},
      };

      // 表格列
      const userColumns = [
          {
              title: '人员账号',
              dataIndex: 'ID'
          },
          {
              title: '人员姓名',
              dataIndex: 'name'
          },
          {
              title: '部门名称',
              dataIndex: 'deptName'
          },
          {
              title: '是否同步',
              dataIndex: 'synch'
          },
          {
              title: '手机号码',
              dataIndex: 'phone'
          }
      ];
      const userColumnsel = [
          {
              title: '人员姓名',
              dataIndex: 'name'
          },
          {
              title: '人员账号',
              dataIndex: 'ID'
          },
          {
              title: '是否同步',
              dataIndex: 'synch'
          }
        ];
      const rowSelection1 = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
      const rowSelection = {
            selectedRowKeys,
            onChange: this.onSearchChange,
      };

      return (
        <Modal
          title="新增人员"
          width={1000}
          maskClosable={false}
          visible={add}
          onOk={this.onSubmit}
          onCancel={() => this.props.onClose()}
          afterClose={this.afterClose}
          className="userModal-content"
        >
          <Row >
              <Col span={20} className="left-content">
                  <Tabs type="card">
                      <TabPane tab="选择" key="1">
                          <Col span={8} style={{paddingRight: '16px'}}>
                              <Form className="ant-search-left-form">
                                  <FormItem labelCol={{span: 8}} wrapperCol={{span: 14}} label="所属区域">
                                          <TreeSelect
                                              value={this.state.value}
                                              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                              treeData={domainTreeDate}
                                              treeCheckable={true}
                                              showCheckedStrategy={SHOW_PARENT}
                                              searchPlaceholder={'请选择区域'}
                                              onChange={this.onSelChange}
                                          />
                                  </FormItem>
                                  <FormItem labelCol={{span: 8}} wrapperCol={{span: 14}} label="部门名称">
                                      {getFieldDecorator('deptName', {
                                          onChange: this.deptNameChange,
                                          initialValue: '',
                                          rules: [
                                              {required: false, message: '请输入部门名称'},
                                          ],
                                      })(<Input placeholder="请输入部门名称"/>)}
                                  </FormItem>
                              </Form>
                              <div className="deptManage">
                                  <header>部门导航树</header>
                                  <Tree
                                      checkable
                                      defaultExpandedKeys={['0-0-0']}
                                      onSelect={this.onSelect}
                                      onCheck={this.onSelect}
                                      loadData={this.onLoadData}
                                  >
                                      {this.renderTreeNodes(this.state.treeData)}
                                  </Tree>
                              </div>
                          </Col>
                          <Col span={16}>
                              <Table
                                  columns={userColumnsel}
                                  rowSelection={rowSelection1}
                                  rowKey={record => `${record.ID}`}
                                  dataSource={userData1}
                                  loading={loading}
                                  scroll={{ y: 253 }}
                                  size="small"
                              />
                          </Col>
                      </TabPane>
                      <TabPane tab="搜索" key="2">
                          <Form layout="inline" className="ant-search-form">
                              <Col span={7}>
                                  <FormItem {...formItemLayout} label="人员账号">
                                      {getFieldDecorator('ID', {
                                          rules: [
                                              {required: false, message: '请输入人员账号'},
                                          ],
                                      })(<Input placeholder="请输入人员账号"/>)}
                                  </FormItem>
                              </Col>
                              <Col span={7}>
                                  <FormItem {...formItemLayout} label="人员姓名">
                                      {getFieldDecorator('name', {
                                          rules: [
                                              {required: false, message: '请输入人员姓名'},
                                          ],
                                      })(<Input placeholder="请输入人员姓名"/>)}
                                  </FormItem>
                              </Col>
                              <Col span={7}>
                                  <FormItem {...formItemLayout} label="部门名称">
                                      {getFieldDecorator('deptName', {
                                          rules: [
                                              {required: false, message: '请输入部门名称'},
                                          ],
                                      })(<Input placeholder="请输入部门名称"/>)}
                                  </FormItem>
                              </Col>
                              <Col span={1}>
                                  <Button type="primary" icon="search" onClick={() => this.search()}>搜索</Button>
                              </Col>
                          </Form>
                          <Table
                              columns={userColumns}
                              rowSelection={rowSelection}
                              rowKey={record => `${record.ID}`}
                              dataSource={userData}
                              loading={loading}
                              scroll={{ y: 193 }}
                              size="small"
                          />
                      </TabPane>
                  </Tabs>
              </Col>
              <Col span={4} className="right-content">
                <div className="rightHeader">
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={checkAll}
                    >
                       人员名称
                    </Checkbox>
                </div>
                <div className="rightContent">
                    <CheckboxGroup options={selRowName} value={checkedList} onChange={this.onChange} />
                </div>
              </Col>
          </Row>
        </Modal>
      );
    }
}

