import React, {Component} from 'react';
import {Modal, Row, Col, Form, Select, Card, Tree} from 'antd';

import SysRoleMgService from '../../../../services/RoleService';
import DeptService from '../../../../services/DeptService';
import style from '../Role.less';

const {TreeNode} = Tree;
const [FormItem, Option] = [Form.Item, Select.Option];

@Form.create()
export default class extends Component {
  state = {
      regionValue: '',
      regionSelect: [
          {
              id: 1,
              name: '集团'
          },
          {
              id: 2,
              name: '北京'
          },
          {
              id: 3,
              name: '上海'
          }
      ],
      deptTreeData: [],
      deptArrSelect: [],
      fullPaths: [], // 部门树扁平化数据
      checkedKeys: [],
      expandedKeys: [],
  };
  componentDidMount() {
        // 获取所有部门树数据
        this.deptQuery();
        // 获取所属区域选择框数据
      SysRoleMgService.qryRegion()
          .then(res => {
              this.setState({
                  regionSelect: res.regionSelect,
              });
          });
  }

  // 获取所有部门树数据
  deptQuery = () => {
      const fullPaths = [];
      const spread = dataModel => dataModel.map((item) => {
          fullPaths.push(item);
          if (item.children) {
              spread(item.children);
          }
          return '';
      });
      DeptService.getDeptTree()
            .then(res => {
                this.setState({
                    deptTreeData: res.treeData,
                });
                spread(res.treeData);
                this.setState({fullPaths});
            });
  };
  //异步加载部门树节点
  loadDeptData = (treeNode) => {
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
                    treeNode.props.dataRef.children = [...result.treeData];
                    this.setState({
                        deptTreeData: [...this.state.deptTreeData]
                    });
                    spread(result.treeData);
                    this.setState({fullPaths});
                    resolve();
                })
        });
    };

  onCheck = (checkedKeys, info) => {
      this.props.onCheck(checkedKeys);
      if (checkedKeys.length === 0) {
          this.setState({
              deptArrSelect: [],
          });
      } else {
          const arr = [];
          checkedKeys.map((item) => {
              const itemArr = this.state.fullPaths.filter(k => k.key === item)[0];
              arr.push(itemArr.id);
              return '';
          });
      }
      this.setState({
          deptArrSelect: checkedKeys.concat(info.halfCheckedKeys),
      });
      console.log('aaaaa', this.state.deptArrSelect);
  };
  afterClose = () => {
        this.props.form.resetFields();
        this.setState({
            tagArrSelect: [],
            checkedKeys: [],
            expandedKeys: [],
        });
    }
  onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
        });
    };
  regionChange = (e) => {
        const item = this.state.regionSelect.filter(_item => _item.id === e)[0];
        this.setState({
            regionValue: item.regionValue,
        });
    };

  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      this.props.onCreate(values);
    });
  };

  render() {
    const {edit, checkedKeys = [], form: {getFieldDecorator}, role={}} = this.props;
    const {regionSelect, deptTreeData, deptArrSelect, expandedKeys} = this.state;

    const loop = (items, selected = false) => items.map((item) => {
          const cls = selected && !deptArrSelect.includes(item.key) && style.none;
          if (item.children && item.children.length !== 0) {
              return (
                  <TreeNode key={item.key} title={item.title} className={cls}>
                      {loop(item.children, selected)}
                  </TreeNode>
              );
          }
          return <TreeNode key={item.key} title={item.title} className={cls}/>;
    });

    return (
      <Modal
        title="选择部门"
        width={800}
        maskClosable={false}
        visible={edit}
        onOk={this.onSubmit}
        onCancel={() => this.props.onClose()}
        afterClose={this.afterClose}
      >
        <Form>
          <Row>
              <Col span={12}>
                  <FormItem labelCol={{span: 6}} wrapperCol={{span: 17}} label="所属区域">
                      {getFieldDecorator('region', {
                          onChange: this.regionChange,
                          rules: [
                              {required: true, message: '请选择所属区域'},
                          ],
                      })(
                          <Select
                              placeholder="请选择所属区域"
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                          >
                              {regionSelect.map(item =>
                                  <Option key={item.id} value={item.id}>{item.name}</Option>
                              )}
                          </Select>
                      )}
                  </FormItem>
              </Col>
          </Row>
        </Form>
          <Row gutter={20}>
              <Col span={12}>
                  <Card title="部门名称">
                      <Tree
                          checkable
                          onExpand={this.onExpand}
                          expandedKeys={expandedKeys}
                          loadData={this.loadDeptData}
                          checkedKeys={checkedKeys}
                          onCheck={this.onCheck}
                      >
                          {loop(deptTreeData)}
                      </Tree>
                  </Card>
              </Col>
              <Col span={12}>
                  <Card title="部门名称-区域筛选">
                      <Tree
                          defaultExpandAll
                          checkedKeys={checkedKeys}
                          onCheck={this.props.onCheckSelect}
                      >
                          {loop(deptTreeData, true)}
                      </Tree>
                  </Card>
              </Col>
          </Row>
      </Modal>
    );
  }
}
