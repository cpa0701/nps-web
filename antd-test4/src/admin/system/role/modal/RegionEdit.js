import React, {Component} from 'react';
import { Modal, Table } from 'antd';
import SysRoleMgService from "../../../../services/RoleService";

export default class extends Component {
  state = {
      regionData: []
  };
  componentDidMount() {
        // 获取所有区域树数据
        SysRoleMgService.qryRegionTree()
            .then(res => {
                this.setState({
                    regionData: res.regionData,
                });
            });
  }
  onSubmit = () => {
      this.props.onCreate();
  };

  render() {
    const {editReg, regSelectKeys = []} = this.props;
    const columns = [
          {
              title: '区域名称',
              dataIndex: 'name'
          },
          {
              title: '区域类型',
              dataIndex: 'type'
          },
          {
              title: '区域码',
              dataIndex: 'code'
          }
      ];
    const rowSelection = {
        selectedRowKeys: regSelectKeys,
        onChange: this.props.onSelectChange
    };

    return (
      <Modal
        title="修改角色区域"
        width={800}
        maskClosable={false}
        visible={editReg}
        onOk={this.onSubmit}
        onCancel={() => this.props.onClose()}
      >
          <Table
              bordered
              rowKey={record => record.key}
              columns={columns}
              dataSource={this.state.regionData}
              rowSelection={rowSelection}
          />
      </Modal>
    );
  }
}
