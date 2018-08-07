import React, {Component} from 'react';
import {Form, Input, InputNumber, Modal, message, Select,TreeSelect,Row,Col} from 'antd';

import DomainService from '../../../services/DomainService';

const FormItem = Form.Item;
const {Option} = Select;
const actionTypeMap = {
    'A': '新增部门',
    'M': '修改部门',
    'V': '查看部门'
}

class Dept extends Component {

    state = {
        actionType: 'A',
        actionTypeName: actionTypeMap['A'],
        disabledParentTree: false
    }

    componentDidMount() {
        const {form} = this.props;
        form.resetFields();
    }

    componentWillReceiveProps = (nextProps) => {
        this.setActionType(nextProps);
    }
    //   设置动作类型
    setActionType = (nextProps) => {
        const {departmentData} = this.props;
        let realSysvData = departmentData;
        if (nextProps) {
            //如果在props更新的时候调用，那么用nextProps为准
            realSysvData = nextProps.departmentData;
        }
        let action = 'A';
        if (realSysvData && realSysvData.actionType) {
            action = realSysvData.actionType;
        }
        this.setState({
            actionType: action,
            actionTypeName: actionTypeMap[action]
        });

        //   if('V' === action){
        //     this.setState({
        //       footer: null
        //     });
        //   }
        //   else {
        //     this.setState({
        //       footer: undefined
        //     });
        //   }

    }


    handleConfirmId = (rule, value, callback) => {
        const {getFieldValue} = this.props.form
        if (getFieldValue('IDOMAINTYPE') === '' || getFieldValue('IDOMAINTYPE') === undefined) {
            callback('请先选择上级菜单')
        }
        callback()
    }
    // 查询父级部门名字
    // searchName=(parentId)=>{
    //     // debugger
    //   if(!parentId){
    //       return;
    //   }else if(parentId === -1){
    //       return '根菜单'
    //   }else{

    //   }
    // }
    //提交按钮
    handleSubmit = (fields) => {
        const {handleModalVisible, departmentData} = this.props;
        let promise = null;
        let pId = fields.pmenuId.value.value
        fields.pmenuId = pId;
        let IDOMAINTYPE = fields.IDOMAINTYPE;

        if (IDOMAINTYPE) {
            fields.IDOMAINTYPE = IDOMAINTYPE + '';
        } else {
            fields.IDOMAINTYPE = '-1';
        }
        //新增
        if (this.state.actionType === 'A') {
            promise = DomainService.AddMenuSys(fields)
        }
        else {
            promise = DomainService.EdiMenuSys({...fields, menuId: departmentData.menuId})
        }

        promise.then(result => {
            if (!result.head) {
                return;
            }
            let head = result.head;
            let success = head.resultCode;
            if (success !== '0') {
                message.error(head.remark);
            }
            else {
                message.success(this.state.actionTypeName + '成功');

                handleModalVisible();
            }
        });
    }
    // 校验部门的唯一性
    handleCheckName = (rule, value, callback) => {
        let code = ''
        let params = {
            menuName: value,
            state: "00A"
        }
        DomainService.checkMenuName(params)
            .then(result => {
                if (!result.head) {
                    return;
                }
                console.log(result);
                code = result.data.code
                if (code && code === '1' && this.state.actionType === 'A') {
                    callback('系统名称已存在！')
                }
                callback()
            })
    }
    getFields() {
        const {form,domainTreeDate}=this.props
                return (
                    <div><Col span={12}>
                    <FormItem
                        label="所属区域"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('IDOMAINID', {
                            rules: [
                                {required: true, message: '所属区域不能为空'},
                                {validator: this.handleCheckName},
                                {whitespace: true, message: '请输入非空白内容'}
                            ],
                            initialValue: this.props.departmentData.SDOMAINNAME,
                        })(
                            <TreeSelect
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={domainTreeDate}
                                treeDefaultExpandAll
                            />
                        )}
                    </FormItem>
                    </Col>
                    <Col span={12}>
                    <FormItem
                        label="部门类型"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('SDOMAINNAME', {
                            rules: [
                                {required: true, message: '部门名称不能为空'},
                                {validator: this.handleCheckName},
                                {whitespace: true, message: '请输入非空白内容'}
                            ],
                            initialValue: this.props.departmentData.SDOMAINNAME,
                        })(
                            <Select disabled={this.state.actionType === "V"}>
                                <Option value='1'>省</Option>
                                <Option value='2'>本地网</Option>
                                <Option value='3'>县</Option>
                                <Option value='4'>扇区</Option>
                                <Option value='5'>自定义</Option>
                            </Select>
                        )}
                    </FormItem>
    </Col>
        <Col span={12}>
                    <FormItem
                        label="部门级别"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('IDOMAINTYPE', {
                            initialValue: this.props.departmentData.IDOMAINTYPE,
                            rules: [
                                {required: true, message: '请选择部门类型'},
                                {validator: this.handleConfirmId}
                            ],
                        })(
                            <Select disabled={this.state.actionType === "V"}>
                                <Option value='1'>省</Option>
                                <Option value='2'>本地网</Option>
                                <Option value='3'>县</Option>
                                <Option value='4'>扇区</Option>
                                <Option value='5'>自定义</Option>
                            </Select>
                        )}
                    </FormItem>
        </Col>
        <Col span={12}>
                    <FormItem
                        label="部门名称"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('SDOMAINCODE', {
                            rules: [
                                { //type:"url",
                                    required: true, message: '部门编码'
                                },
                                {whitespace: true, message: '请输入非空白内容'}
                            ],
                            initialValue: this.props.departmentData.SDOMAINCODE,
                            // initialValue: { menuUrl: this.props.departmentData.menuUrl !== undefined ? this.props.departmentData.menuUrl + '' : '' },
                        })(
                            <Input disabled={this.state.actionType === "V"}/>
                        )}
                    </FormItem>
    </Col>
        <Col span={12}>
                    <FormItem
                        label="显示名称"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('SDOMAINCODE', {
                            rules: [
                                { //type:"url",
                                    required: true, message: '部门编码'
                                },
                                {whitespace: true, message: '请输入非空白内容'}
                            ],
                            initialValue: this.props.departmentData.SDOMAINCODE,
                            // initialValue: { menuUrl: this.props.departmentData.menuUrl !== undefined ? this.props.departmentData.menuUrl + '' : '' },
                        })(
                            <Input disabled={this.state.actionType === "V"}/>
                        )}
                    </FormItem>
        </Col>
        <Col span={12}>
                    <FormItem
                        label="部门简称"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('SDOMAINCODE', {
                            initialValue: this.props.departmentData.SDOMAINCODE,
                            // initialValue: { menuUrl: this.props.departmentData.menuUrl !== undefined ? this.props.departmentData.menuUrl + '' : '' },
                        })(
                            <Input disabled={this.state.actionType === "V"}/>
                        )}
                    </FormItem>
    </Col>
        <Col span={12}>
                    <FormItem
                        label="部门编码"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('SDOMAINCODE', {
                            initialValue: this.props.departmentData.SDOMAINCODE,
                            // initialValue: { menuUrl: this.props.departmentData.menuUrl !== undefined ? this.props.departmentData.menuUrl + '' : '' },
                        })(
                            <Input disabled={this.state.actionType === "V"}/>
                        )}
                    </FormItem>
        </Col>
        <Col span={12}>
                    <FormItem
                        label="是否责任部门"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('IDOMAINTYPE', {
                            initialValue: this.props.departmentData.IDOMAINTYPE,
                            rules: [
                                {required: true, message: '请选择部门类型'},
                                {validator: this.handleConfirmId}
                            ],
                        })(
                            <Select disabled={this.state.actionType === "V"}>
                                <Option value='1'>是</Option>
                                <Option value='2'>否</Option>
                            </Select>
                        )}
                    </FormItem>
    </Col>
        <Col span={12}>
                    <FormItem
                        label="排序"
                        labelCol={{span:10}}
                        wrapperCol={{span:14}}
                    >
                        {form.getFieldDecorator('ISEQ', {
                            rules: [{required: true, message: '请输入排序'}],
                            initialValue: this.props.departmentData.ISEQ,
                            // initialValue: { orderId: this.props.departmentData.orderId !== undefined ? this.props.departmentData.orderId + '' : '' },
                        })(
                            <InputNumber disabled={this.state.actionType === "V"}
                                         min={1} max={100}
                            />
                        )}
                    </FormItem>
                </Col></div>)
    }
    render() {
        // let detailFlag = this.state.detailFlag;
        const {modalVisible, form, handleModalVisible, departmentData, thisTime} = this.props;
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                this.handleSubmit(fieldsValue);
            });
        };
        if (departmentData && departmentData.IDOMAINID) {
            if (thisTime === "") {
                this.setState({
                    actionType: 'M',
                    actionTypeName: '修改部门'
                });
            } else {
                this.setState({
                    actionType: 'V',
                    actionTypeName: '查看部门'
                });
            }
        } else {
            this.setState({
                actionType: 'A',
                actionTypeName: '新增部门'
            });
        }
        return (
            <Modal
                title={this.state.actionTypeName}
                visible={modalVisible}
                destroyOnClose={true}
                onOk={okHandle}
                onCancel={() => handleModalVisible()}
                {...this.props.thisTime}
            >
                <Form>
                    <Row gutter={24}>
                        {this.getFields()}
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({})(Dept);
