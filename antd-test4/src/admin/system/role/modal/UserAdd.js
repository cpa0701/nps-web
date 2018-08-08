import React, { Component } from 'react';
import { Modal, Row, Col, Input, Form } from 'antd';

const {TextArea} = Input;
const FormItem = Form.Item;

@Form.create()
export default class extends Component {
  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      this.props.onCreate(values);
    });
  };
  afterClose = () => {
    this.props.form.resetFields();
  };

  render() {
    const {add, parentId = '',form: {getFieldDecorator}} = this.props;
    const formItemLayout = {
      labelCol: {xs: {span: 24}, sm: {span: 6}},
      wrapperCol: {xs: {span: 24}, sm: {span: 16}},
    };

    return (
      <Modal
        title="新增角色"
        width={400}
        maskClosable={false}
        visible={add}
        onOk={this.onSubmit}
        onCancel={() => this.props.onClose()}
        afterClose={this.afterClose}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="角色名称">
                {getFieldDecorator('name', {
                  rules: [
                    {required: true, message: '请输入角色名称'},
                  ],
                })(<Input placeholder="请输入角色名称"/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="备注信息">
                {getFieldDecorator('description', {
                  initialValue: '',
                  rules: [
                    {max: 255, message: '备注不能超过255个字符'},
                  ],
                })(
                  <TextArea placeholder="请输入备注信息"/>
                )}
              </FormItem>
                {getFieldDecorator('parentId', {
                    initialValue: parentId,
                })(<Input type="hidden"/>)}
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

