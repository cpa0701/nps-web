import React, {PureComponent} from 'react';
import {Form, Input, Modal, message, Select, Row, Col} from 'antd';

import DeptService from '../../../../services/DeptService';

const {TextArea} = Input;
const FormItem = Form.Item;
const {Option} = Select;
const actionTypeMap = {
    'A': '新增部门',
    'M': '修改部门',
    'V': '查看部门'
}

class StaffModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            actionTypeName: actionTypeMap['A'],
        }
        this.actionType = 'A';
    }

    componentDidMount() {
        const {form} = this.props;
        form.resetFields();
    }

    // componentWillReceiveProps = (nextProps) => {
    //     this.setActionType(nextProps);
    // }
    // //   设置动作类型
    // setActionType = (nextProps) => {
    //     const {departmentData} = this.props;
    //     let realSysvData = departmentData;
    //     if (nextProps) {
    //         //如果在props更新的时候调用，那么用nextProps为准
    //         realSysvData = nextProps.departmentData;
    //     }
    //     let action = 'A';
    //     if (nextProps && nextProps.thisTime) {
    //         action = nextProps.thisTime;
    //     }
    //     this.actionType = action
    //     this.setState({
    //         actionTypeName: actionTypeMap[action]
    //     });
    //
    //     if ('V' === action) {
    //         this.setState({
    //             footer: null
    //         });
    //     }
    //     else {
    //         this.setState({
    //             footer: undefined
    //         });
    //     }
    //
    // }
    //
    //
    // handleConfirmId = (rule, value, callback) => {
    //     const {getFieldValue} = this.props.form
    //     if (getFieldValue('IDOMAINTYPE') === '' || getFieldValue('IDOMAINTYPE') === undefined) {
    //         callback('请先选择上级菜单')
    //     }
    //     callback()
    // }
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
        //新增
        if (this.actionType === 'A') {
            promise = DeptService.addStaff(fields)
        }
        else {
            promise = DeptService.ediStaff({...fields, menuId: departmentData.iDeptId})
        }
        promise.then(result => {
            message.success(this.state.actionTypeName + '成功');
            handleModalVisible();
        });
    }
    // 校验部门的唯一性
    handleCheckName = (rule, value, callback) => {
        let code = ''
        let params = {
            menuName: value,
            state: "00A"
        }
        DeptService.checkDeptName(params)
            .then(result => {
                code = result.code
                if (code && code === '1' && this.actionType === 'A') {
                    callback('系统名称已存在！')
                }
                callback()
            })
    }

    getFields(actionType) {
        const {form, departmentData,staffData} = this.props;
        return (
            <div>
                <Col span={12}>
                    <FormItem
                        label="人员姓名"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('name', {
                            rules: [
                                {required: true, message: '人员姓名不能为空'}
                            ],
                            initialValue: staffData.name,
                        })(
                            <Input disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        label="登录账号"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('account', {
                            rules: [
                                {required: true, message: '登录账号不能为空'}
                            ],
                            initialValue: staffData.account,
                        })(
                            <Input disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        label="用户工号"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('no', {
                            rules: [
                                {required: true, message: '用户工号不能为空'}
                            ],
                            initialValue:staffData.no,
                        })(
                            <Input disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        label="性别"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('sex', {
                            rules: [
                                {required: true, message: '性别不能为空'}
                            ],
                            initialValue: staffData.sex,
                        })(
                            <Select placeholder="请选择性别" disabled={actionType === "V"}>
                                <Option value="M">男</Option>
                                <Option value="F">女</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        label="手机号"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('cellphone ', {
                            rules: [],
                            initialValue: staffData.cellphone,
                        })(
                            <Input disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12} style={{'display': 'none'}}>
                    <FormItem
                        label="部门id"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('deptId', {
                            initialValue: departmentData.iDeptId,
                            rules: [],
                        })(
                            <Input disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        label="邮箱"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('email ', {
                            rules: [],
                            initialValue: staffData.email,
                            // initialValue: { menuUrl: this.props.departmentData.menuUrl !== undefined ? this.props.departmentData.menuUrl + '' : '' },
                        })(
                            <Input disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        label="身份证"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                    >
                        {form.getFieldDecorator('identityCard ', {
                            initialValue: staffData.identityCard,
                            // initialValue: { menuUrl: this.props.departmentData.menuUrl !== undefined ? this.props.departmentData.menuUrl + '' : '' },
                        })(
                            <Input disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem
                        label="备注"
                        labelCol={{span: 5}}
                        wrapperCol={{span: 19}}
                    >
                        {form.getFieldDecorator('remark', {
                            initialValue: staffData.remark
                        })(
                            <TextArea rows={4} disabled={actionType === "V"}/>
                        )}
                    </FormItem>
                </Col>
            </div>)
    }

    render() {
        // let detailFlag = this.state.detailFlag;
        const {modalVisible, form, handleModalVisible, thisTime} = this.props;
        let action = {
            actionType: 'A',
            actionTypeName: '新增人员'
        }
        if (thisTime === "M") {
            action = {
                actionType: 'M',
                actionTypeName: '修改人员'
            };
        } else if (thisTime === "V") {
            action = {
                actionType: 'V',
                actionTypeName: '查看人员'
            };
        }
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                this.handleSubmit(fieldsValue);
            });
        };

        return (
            <Modal
                title={action.actionTypeName}
                visible={modalVisible}
                width={800}
                destroyOnClose={true}
                onOk={okHandle}
                onCancel={() => handleModalVisible()}
            >
                <Form>
                    <Row gutter={24}>
                        {this.getFields(action.actionType)}
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({})(StaffModal);
