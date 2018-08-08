import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select, Popconfirm} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class AdvancedSearchForm extends Component {
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.getStaffParams(values)
        });
    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        const children = [];
        const fieldList = [{
            label: '部门范围',
            key: 'a',
            type: 'select',
            optionList: [{key: 0, title: '部门及子部门'}, {key: 1, title: '当前部门'}, {key: 2, title: '按区域'}]
        }, {label: '人员帐号',
            key: 'b',type: 'input'}, {
            label: '人员工号',
            key: 'c',
            type: 'input'
        }, {
            label: '人员姓名',
            key: 'd',
            type: 'input'
        }, {
            label: '账号状态',
            type: 'select',
            key: 'e',
            optionList: [{key: 0, title: '全部'}, {key: 1, title: '正常'}, {key: 2, title: '已封存'}, {
                key: 3,
                title: '待修改密码'
            }, {key: 4, title: '长期锁定'}, {key: 5, title: '短期锁定'}]
        }, {
            label: '是否有效',
            type: 'select',
            key: 'f',
            optionList: [{key: 0, title: '全部'}, {key: 1, title: '有效'}, {key: 2, title: '无效'}]
        }]

        for (let i = 0; i < fieldList.length; i++) {
            children.push(
                <Col span={8} key={i}>
                    <FormItem label={fieldList[i].label}>
                        {getFieldDecorator(fieldList[i].key, {
                            initialValue: fieldList[i].type === 'select' ? 0 : ''
                        })(
                            fieldList[i].type === 'input' ? (<Input/>) : (
                                <Select>
                                    {fieldList[i].optionList.map((a) =>
                                        <Option key={a.key} value={a.key}>{a.title}</Option>
                                    )}
                                </Select>)
                        )}
                    </FormItem>
                </Col>
            );
        }
        return children;
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={24}>{this.getFields()}</Row>
                <Row>
                    <Col span={24}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button>新增</Button>
                        <Button type="dashed">修改</Button>
                        <Popconfirm title="确定删除吗?" okText="确定" cancelText="取消" onConfirm={this.handleDelete}>
                            <Button type="danger">删除</Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(AdvancedSearchForm);