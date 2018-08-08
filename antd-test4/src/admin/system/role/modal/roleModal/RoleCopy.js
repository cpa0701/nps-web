import React, {Component} from 'react';
import {Modal, Row, Col, Input, Form} from 'antd';

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
    afterClose = () => this.props.form.resetFields();
    render() {
        const {copy, role = {}, form: {getFieldDecorator}} = this.props;
        const formItemLayout = {
            labelCol: {xs: {span: 24}, sm: {span: 6}},
            wrapperCol: {xs: {span: 24}, sm: {span: 16}},
        };

        return (
            <Modal
                title="复制角色"
                width={450}
                maskClosable={false}
                visible={copy}
                onOk={this.onSubmit}
                onCancel={() => this.props.onClose()}
                afterClose={this.afterClose}
            >
                <Form className="ui-smallForm">
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="原角色名称">
                                {getFieldDecorator('name', {
                                    initialValue: role.name,
                                    rules: [
                                        {required: true, message: '请输入角色名称'},
                                    ],
                                })(<Input/>)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem{...formItemLayout} label="新角色名称">
                                {getFieldDecorator('newName', {
                                    rules: [
                                        {required: true, message: '请输入角色名称'},
                                    ],
                                })(
                                    <Input placeholder="请输入角色名称"/>
                                )}
                            </FormItem>
                            {getFieldDecorator('parentId', {
                                initialValue: role.parentId,
                            })(<Input type="hidden"/>)}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
