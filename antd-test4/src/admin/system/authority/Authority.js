import React, {PureComponent} from 'react';
import {Col,Row,Select,Button,Divider,Table,Input,Form, Modal } from 'antd';
import './Authority.less'
import {inject, observer} from "mobx-react/index";
import AuthorityService from "../../../services/AuthorityService";


const Option = Select.Option;//是否激活选择框
//选择框选择内容

//表单
const FormItem = Form.Item;
const info = Modal.info;
@inject('stores')
@observer
@Form.create({})
export default class Authority extends PureComponent {
    //新增方法
    handleAdd = () => {
        if (this.state.authorityAddData) {
            this.setState({
                authorityData: this.state.authorityData,
                addVisible: true,
            });
        } else {
            const ref = info({
                title: '请先选择',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    //修改方法
    handleUpdate = () => {
        if (this.state.authorityEditData) {
            this.setState({
                authorityData: this.state.authorityData,
                editVisible: true,
            });
        } else {
            const ref = info({
                title: '请先选择',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    //删除方法
    handleDelete = () => {
        console.log(9999)
        if (this.state.authorityDeleteData) {
            this.setState({
                authorityData: this.state.authorityData,
            });
            const ref = info({
                title: '已删除',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        } else {
            const ref = info({
                title: '请先选择删除项',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
        this.freshTable();
    }
    //详情方法
    handleDetail = () => {
        if (this.state.authorityUserData) {
            this.setState({
                authorityData: this.state.authorityData,
                userVisible: true,
            });
        } else {
            const ref = info({
                title: '请先选择',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    componentDidMount() {
        AuthorityService.getAuthorityList().then(result=>{
            this.setState({
                data: result.authorityData,
                authorityEditData:false,
                authorityAddData:false,
                authorityUserData:false,
                authorityDeleteData:false,

            });
        });

    }
    freshTable(){
        AuthorityService.getAuthorityList().then(result=>{
            this.setState({
                data: result.authorityData
            });
        });
    }
    handleOk = () => {
        this.setState({
            addVisible: false,
            userVisible:false,
            editVisible:false,
        });
    }
    handleCancel = () => {
        this.setState({
            addVisible: false,
            userVisible:false,
            editVisible:false,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        this.freshTable();
        this.handleOk();
    }
    handleChange=(value)=> {
        console.log(`selected ${value}`);
        this.freshTable();
    }

    constructor(props) {
        super(props);
        this.store = this.props.stores;
        this.state = {
            //树形数据展示
            bordered:true,
            pagination:false,
            data:[],
            authorityEditData:[],
            authorityAddData:[],
            authorityUserData:[],
            authorityDeleteData:[],
            authorityData:[],
            //模态框
            addVisible: false,
            userVisible:false,
            editVisible:false,
            confirmLoading: false,
        }
    }



    render() {
        const {authority} = this.props.stores.I18nModel.outputLocale
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
        const rowSelection = {
            onSelect:(record, selected, selectedRows) => {
                this.setState({
                    authorityAddData:selected,
                    authorityEditData: selected,
                    authorityUserData:selected,
                    authorityDeleteData:selected,
                    authorityData:record
                })


            },
        };
        const columns = [{
            title: authority.authorityName,
            dataIndex: 'name',
            key: 'name',
            width: '24%',
        }, {
            title: authority.authorityUrl,
            dataIndex: 'url',
            key: 'url',
            width: '12%',
            render: (text) => <span className="tableText">{text}</span>,

        }, {
            title: authority.authorityIcon,
            dataIndex: 'icon',
            key: 'icon',
            width: '12%',

        }, {
                title: authority.authorityDescribe,
                dataIndex: 'describe',
                key: 'describe',
                width: '12%',
            render: (text) => <span className="tableText">{text}</span>,
            }, {
            title: authority.authorityNo,
            dataIndex: 'No',
            key: 'No',
            width: '8%',

        }, {
            title: authority.authorityType,
            dataIndex: 'type',
            key: 'type',
            width: '8%',

        }, {
            title: authority.authorityArea,
            dataIndex: 'area',
            key: 'area',
            width: '8%',

        }, {
            title: authority.authorityActivation,
            dataIndex: 'activate',
            key: 'activate',
            width: '8%',

        }, {
            title: authority.authoritySensitive,
            dataIndex: 'sensitive',
            key: 'sensitive',
            width: '8%',

        }];
        return (
            <div>
                <Row type="flex" align="middle">
                    <Col className='filterlabel' span={4}>应用系统</Col>
                    <Col span={6}>
                        <Select defaultValue="0" mode="multiple" onChange={this.handleChange}>
                            <Option value="0">全部</Option>
                            <Option value="1">是</Option>
                            <Option value="2">否</Option>
                        </Select>
                    </Col>
                    <Col className='filterlabel' span={4} >是否激活</Col>
                    <Col span={3}>
                        <Select defaultValue="0" onChange={this.handleChange}>
                            <Option value="0">全部</Option>
                            <Option value="1">是</Option>
                            <Option value="2">否</Option>
                        </Select>
                    </Col>
                </Row>
                <Divider />
                <div className="headerAuthority">
                    <Button type="primary" icon="plus-circle-o" onClick={this.handleAdd}>{authority.insert}</Button>
                    <Button type="primary" icon="edit" onClick={this.handleUpdate}>{authority.modify}</Button>
                    <Button type="danger" icon="delete" onClick={this.handleDelete}>{authority.delete}</Button>
                    <Button type="primary"  icon="user" onClick={this.handleDetail}>{authority.detail}</Button>
                </div>
                <Divider />
                <div>
                    <Table {...this.state} columns={columns} defaultExpandedRowKeys={[0]} rowSelection={rowSelection} size="small" dataSource={this.state.data} onRow={(record) => {
                        return {
                            onClick: (e) => {
                                e.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click()
                            },       // 点击行
                            onDoubleClick: (e) => {
                                 this.setState({
                                         authorityUserData:true
                                     },()=>{
                                         this.handleDetail()
                                    });


                            },
                        }
                    }
                    }
                    />
                    <Modal
                        title="新增权限"
                        width={800}
                        centered
                        visible={this.state.addVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="submit" type="primary" icon="check-circle-o" onClick={this.handleSubmit}>保存</Button>,
                            <Button key="back"  icon="close-circle-o" onClick={this.handleCancel}>取消</Button>
                        ]}
                    >
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="权限标识"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authoritySign', {
                                            rules: [{ required: true,}],
                                            initialValue:" ",
                                        })(

                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="权限名称"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityName', {
                                            rules: [{ required: true,}],
                                            initialValue:" ",
                                        })(
                                            <Input  />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="权限类型"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityType', {
                                            rules: [{ required: true,}],
                                            initialValue:"请选择",
                                        })(
                                            <Select>
                                                <Option value="1">菜单</Option>
                                                <Option value="2">功能按钮</Option>
                                                <Option value="3">C/S按钮</Option>
                                                <Option value="4">其它</Option>
                                                <Option value="5">tab页</Option>
                                                <Option value="6" >多数据源权限</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="链接URL"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityURL', {
                                            rules: [{ }],
                                            initialValue:" ",
                                        })(

                                            <Input />

                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                <FormItem
                                    label="图标名称"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('authorityIcon', {
                                        rules: [{}],
                                        initialValue:" ",
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="权限描述"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityDescribe', {
                                            rules: [{}],
                                            initialValue:" ",
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                <FormItem
                                    label="是否激活"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('authorityActivate', {
                                        rules: [{ required: true,}],
                                        initialValue:" ",
                                    })(
                                        <Select>
                                            <Option value="7">是</Option>
                                            <Option value="8">否</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                                <Col span={12}>
                                <FormItem
                                    label="应用类型"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('authorityArea', {
                                        rules: [{ required: true,}],
                                        initialValue:" ",
                                    })(
                                        <Select>
                                            <Option value="11">全局</Option>
                                            <Option value="12">网管系统</Option>
                                            <Option value="13">大客户系统</Option>
                                            <Option value="14">江苏有线-移动端</Option>
                                            <Option value="15">报表分析</Option>
                                            <Option value="16" >自定义报表</Option>
                                            <Option value="17">统计分析</Option>
                                            <Option value="18">重保</Option>
                                            <Option value="19" >广西门户</Option>
                                            <Option value="20" >广东资源数</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                <FormItem
                                label="同级序号"
                                labelCol={{span: 10}}
                                wrapperCol={{span: 14}}
                                >
                                {getFieldDecorator('authorityNo', {
                                    rules: [{ required: true,}],
                                    initialValue:" ",
                                })(
                                    <Input  />
                                )}
                                </FormItem>
                            </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                <FormItem
                                    label="扩展信息"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('authorityMsg', {
                                        rules: [{ required: true,}],
                                        initialValue:" ",
                                    })(
                                        <Input  />
                                    )}
                                </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        title="修改权限"
                        width={800}
                        centered
                        visible={this.state.editVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="submit" type="primary" icon="check-circle-o" onClick={this.handleSubmit}>保存</Button>,
                            <Button key="back"  icon="close-circle-o" onClick={this.handleCancel}>取消</Button>
                        ]}
                    >
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="权限标识"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authoritySign', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.authorityData.key,
                                        })(

                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="权限名称"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityName', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.authorityData.name,
                                        })(
                                            <Input  />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="权限类型"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityType', {
                                            rules: [{ required: true,}],
                                            initialValue:"请选择",
                                        })(
                                            <Select>
                                                <Option value="1">菜单</Option>
                                                <Option value="2">功能按钮</Option>
                                                <Option value="3">C/S按钮</Option>
                                                <Option value="4">其它</Option>
                                                <Option value="5">tab页</Option>
                                                <Option value="6" >多数据源权限</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="链接URL"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityURL', {
                                            rules: [{ }],
                                            initialValue:this.state.authorityData.URL,
                                        })(

                                            <Input />

                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="图标名称"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityIcon', {
                                            rules: [{}],
                                            initialValue:this.state.authorityData.icon,
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="权限描述"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityDescribe', {
                                            rules: [{}],
                                            initialValue:this.state.authorityData.describe,
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="是否激活"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityActivate', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.authorityData.activate,
                                        })(
                                            <Select>
                                                <Option value="7">是</Option>
                                                <Option value="8">否</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="应用类型"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityArea', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.authorityData.area,
                                        })(
                                            <Select>
                                                <Option value="11">全局</Option>
                                                <Option value="12">网管系统</Option>
                                                <Option value="13">大客户系统</Option>
                                                <Option value="14">江苏有线-移动端</Option>
                                                <Option value="15">报表分析</Option>
                                                <Option value="16" >自定义报表</Option>
                                                <Option value="17">统计分析</Option>
                                                <Option value="18">重保</Option>
                                                <Option value="19" >广西门户</Option>
                                                <Option value="20" >广东资源数</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="同级序号"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityNo', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.authorityData.No,
                                        })(
                                            <Input  />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="扩展信息"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('authorityMsg', {
                                            rules: [{ required: true,}],
                                            initialValue:" ",
                                        })(
                                            <Input  />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        title="详情信息"
                        width={800}
                        centered
                        visible={this.state.userVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="权限标识"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.key}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="权限名称"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.name}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="权限类型"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.type}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="链接URL"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.URL}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="图标名称"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.icon}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="权限描述"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.describe}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="是否激活"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.activate}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="应用类型"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.area}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="同级序号"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.authorityData.No}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="扩展信息"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}