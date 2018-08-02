import React, {PureComponent} from 'react';
import { Form, Input, Modal, Row, Col, Button, message} from 'antd';
import * as mobx from 'mobx';
import CheckRule from '../../../common/utils/CheckRule';
import LoginService from '../../../services/LoginService';

const {runInAction} = mobx;
const FormItem = Form.Item;

@Form.create()
class ResetPassword extends PureComponent {

    state = {
        loadingSMSCode : false,
        loadingResetPassword : false,
        seconds : 60
    };

    handleSubmit = (e) => {
        const {form, handleHideResetPasswordComponent} = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            this.setState({
                loadingResetPassword : true
            });
            if(fieldsValue.password !== fieldsValue.password_confirm) {
                message.error('两次密码输入不一致');
                return;
            }
            let params = {
                mobileno : fieldsValue.mobileno,
                verifycode : fieldsValue.verifycode,
                password : fieldsValue.password
            }
            LoginService.resetPassword(params)
            .then((result) => {
                this.setState({
                    loadingResetPassword : false
                });
                if(!result.head) {
                    message.error('请求失败');
                    return;
                }
                let head = result.head;
                let success = head.resultCode;
                if(success !== '0'){
                    message.error(head.remark);
                }else {
                    message.success('密码修改成功');
                    handleHideResetPasswordComponent();
                }
            });
        });
    }

    handleGetSMSCode = (e) => {
        if (this.state.loadingSMSCode) {
            return;
        }
        const {form} = this.props;
        form.validateFields(['mobileno'], {}, (err, fieldsValue) => {
            if(err) {
                if (err.mobileno) {
                    message.error('请先输入正确的手机号码');
                    return;
                }
            }
            this.setState({
                loadingSMSCode : true
            });
            LoginService.getSMSCode({'mobileno' : fieldsValue.mobileno})
            .then((result) => {
                this.setState({
                    loadingSMSCode : false
                });
                if(!result.head){
                    return;
                }
                let head = result.head;
                let success = head.resultCode;
                if(success !== '0'){
                    message.error(head.remark);
                }else {
                    runInAction(() => {
                        let siv = setInterval(() => {
                            this.setState((preState) => ({
                                seconds: preState.seconds - 1,
                            }), () => {
                                if (this.state.seconds === 0) {
                                    clearInterval(siv);
                                    this.setState({
                                        seconds : 60
                                    })
                                }
                            });
                        }, 1000);
                    });
                }
            });
        });
    }

    render() {
        let {visible, handleHideResetPasswordComponent} = this.props;
        let {getFieldDecorator} = this.props.form;
        let {seconds, loadingSMSCode} = this.state;
        let codeButtonTitle;
        if ((seconds > 0 && seconds < 60)) {
            codeButtonTitle = seconds + "s";
        }else if (!loadingSMSCode) {
            codeButtonTitle = "获取验证码";
        }
        const codeButtonDisabled = (seconds > 0 && seconds < 60);
        // const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

        const formItemLayout = {
            labelCol: {
              xs: { span: 6 }
            },
            wrapperCol: {
              xs: { span: 14 },
            },
          };
        return (
            <Modal
            title={"忘记密码"}
            visible={visible}
            destroyOnClose={true}
            onOk = {this.handleSubmit}
            onCancel={() => handleHideResetPasswordComponent(false)}
            confirmLoading={this.state.loadingResetPassword}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码">
                        {getFieldDecorator('mobileno', {
                            rules: [{ required: true, message: '请输入账号关联的手机号码' ,
                            pattern:/^1[0-9]{10}$/}],
                            validateTrigger : "onBlur"
                        })(
                            <Input addonBefore="86" placeholder="请输入账号关联的手机号码"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="验证码">
                        <Row gutter={8}>
                            <Col span={15}>
                            {getFieldDecorator('verifycode', {
                                rules: [{ required: true, message: '请输入验证码' }],
                            })(
                                <Input placeholder="请输入验证码"/>
                            )}
                            </Col>
                            <Col span={9}>
                                <Button disabled={codeButtonDisabled} onClick={this.handleGetSMSCode} loading={this.state.loadingSMSCode}>{codeButtonTitle}</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码">
                        {getFieldDecorator('password', {
                            rules: [{ required: true,
                            validator:CheckRule.handlePassWordCheck}],
                        })(
                            <Input type="password" placeholder="请输入密码"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认新密码">
                        {getFieldDecorator('password_confirm', {
                            rules: [{ required: true, message: '请再次输入密码'}],
                        })(
                            <Input type="password" placeholder="请再次输入密码"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
export default ResetPassword;