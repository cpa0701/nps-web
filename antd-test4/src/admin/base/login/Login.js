import React from 'react';
import {withRouter} from 'react-router-dom';
import * as mobx from 'mobx';

import {observer, inject} from 'mobx-react';
import {message, Form, Input, Button, Icon, Row, Col, Radio} from 'antd';

import LoginService from '../../../services/LoginService';
import ResetPassword from './ResetPassword';

const {runInAction, autorun, configure} = mobx;
configure({enforceActions: true});  // 不允许在动作之外进行状态修改

@inject('stores')
@observer
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.stores;

        this.state = {
            'loading': false,
            resetPassword: {visible: false},
            rememberUc: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        //监听是否已经登录
        this.isLogined();
    }

    componentDidMount() {
        //填充记住密码
        this.fillRememberUc();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields({force: true},
            (err, values) => {
                if (!err) {
                    //校验通过
                    this.login();
                }
            }
        );
    }

    handleResetPassword = (e) => {
        e && e.preventDefault();
        this.setState({
            resetPassword: {visible: true}
        });
    }

    handleHideResetPasswordComponent = (val) => {
        this.setState({
            resetPassword: {visible: val}
        });
    }

    login() {
        //加载中
        this.setState({
            'loading': true
        });

        let formData = this.props.form.getFieldsValue();

        let params = {
            usercode: formData.user,//用户名，必填
            pwd: formData.password, //密码，必填
            loginType: '0'//登录方式：0：工号密码；1:手机动态验证码；，必填
        }

        //记住密码
        if (sessionStorage) {
            if (this.state.rememberUc) {
                const content = JSON.stringify({
                    usercode: formData.user,//用户名，必填
                    pwd: formData.password, //密码，必填
                });
                sessionStorage.setItem('rememberUc', content);
            } else {
                sessionStorage.removeItem('rememberUc');
            }
        }

        LoginService.login(params)
            .then(result => {
                this.setState({
                    'loading': false
                });

                // if (!result.head) {
                //     return;
                // }
                // let head = result.head;
                // let data = result.data;
                // let success = head.resultCode;
                // if (success !== '0') {
                //     message.error(head.remark);
                // }
                // else {
                //restrict模式下,run in action
                runInAction(() => {
                    message.success('登录成功！');

                    //登录状态变更
                    this.store.LoginModel.login(result);
                });
                // }
            });
    }

    isLogined() {
        autorun(() => {
            if (this.store.LoginModel.usercode) {
                this.props.history.push('/');
            }
        })
    }

    fillRememberUc = () => {
        const {form} = this.props;
        if (!sessionStorage) {
            return;
        }
        let content = sessionStorage.getItem('rememberUc');
        if (content) {
            content = JSON.parse(content);
            form.setFieldsValue({
                'user': content.usercode,
            });
            form.setFieldsValue({
                'password': content.pwd
            });
            this.setState({
                rememberUc: true
            });
        }
    }

    toggleRememberUc = (e) => {
        const {rememberUc} = this.state;
        if (!rememberUc) {
            this.setState({rememberUc: true});
        } else {
            this.setState({rememberUc: false});
            sessionStorage && sessionStorage.removeItem('rememberUc');
        }
    }

    renderResetPawwordModalComponent = () => {
        const {resetPassword} = this.state;
        const callback = {
            handleHideResetPasswordComponent: this.handleHideResetPasswordComponent
        };
        const rp = <ResetPassword {...callback} visible={resetPassword.visible}/>
        return resetPassword.visible ? rp : null;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {login} = this.props.stores.I18nModel.outputLocale
        return (<div className="login">
            <div className="login-logo">

            </div>
            <div className="login-box">
                <div className="login-box-title">
                    {document.title}
                </div>
                <div className="login-box-cont">
                    <div className="login-title">{login.loginTitle}</div>
                    <div className="ipt-box-cont">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {
                                    getFieldDecorator('user', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '账号不能为空'
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder={login.accountPlaceHolder} size="large"
                                        />
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('password', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '密码不能为空'
                                            }
                                        ]
                                    })(<Input prefix={<Icon type="lock"
                                                            style={{color: 'rgba(0,0,0,.25)'}}/>}
                                              type="password"
                                              placeholder={login.passwordPlaceHolder}
                                              size="large"
                                              autoComplete="new-password"
                                    />)
                                }
                            </Form.Item>

                            <Row>
                                <Col span={16} style={{lineHeight: '40px'}}>
                                    <Radio checked={this.state.rememberUc}
                                           onClick={this.toggleRememberUc}
                                    >
                                        {login.rememberPassword}
                                    </Radio>
                                </Col>
                                <Col span={8}>
                                    <Button type="primary" htmlType="submit"
                                            loading={this.state.loading}>{login.loginButton}</Button>
                                </Col>
                            </Row>
                        </Form>

                    </div>
                    {<div className="ipt-box-bottom">
                        <a className="forgot" onClick={this.handleResetPassword}>
                            {login.forgetPassword}
                        </a>
                    </div>}
                </div>
            </div>
            <footer>© 中兴软创科技股份有限公司 版权所有| All Rights Reserved</footer>
            {
                this.renderResetPawwordModalComponent()
            }
        </div>)
    }
}

export default Login = withRouter(Form.create({})(Login));
