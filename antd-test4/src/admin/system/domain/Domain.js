import Http from '../../../common/Http';
import React, {PureComponent} from 'react';
import { Button,Divider,Table,Modal,Row, Col,Input,Select,InputNumber,Form ,message} from 'antd'
import {inject, observer} from "mobx-react/index";
import './Domain.less'
import Servicedomain from '../../../services/Servicedomain';
import DeptService from "../../../services/DeptService";


// rowSelection objects indicates the need for row selection

//选择框
const Option = Select.Option;
//表单
const FormItem = Form.Item;
const info = Modal.info;
@inject('stores')
@observer
@Form.create({})
export default class Domain extends PureComponent {
    //新增方法
    handleAdd = () => {
        if (this.state.domainAddData) {
            this.setState({
                domainData: this.state.domainData,
                addVisible: true,
            });
        } else {
            const ref = info({
                title: '请先选择区域项',
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
        if (this.state.domainEditData) {
            this.setState({
                domainData: this.state.domainData,
                editVisible: true,
            });
        } else {
            const ref = info({
                title: '请先选择修改项',
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
        if (this.state.domainDeleteData) {
            this.setState({
                domainData: this.state.domainData,
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
        if (this.state.domainUserData) {
            this.setState({
                domainData: this.state.domainData,
                userVisible: true,
            });
        } else {
            const ref = info({
                title: '请先选择区域项',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    ref.destroy();
                }
            });
        }
    }
    constructor(props) {
        super(props);
        this.store = this.props.stores;
        this.state = {
            //树形数据展示
            bordered:true,
            pagination:false,
            data:[],
            domainEditData:[],
            domainAddData:[],
            domainUserData:[],
            domainDeleteData:[],
            domainData:[],
            //模态框
            addVisible: false,
            userVisible:false,
            editVisible:false,
            confirmLoading: false,
        }
    }


    componentDidMount() {
        Servicedomain.getDomainList().then(result=>{
            this.setState({
                data: result.domainData,
                domainAddData:false,
                domainEditData: false,
                domainUserData:false,
                domainDeleteData:false

            });
        });

    }
    freshTable(){
        Servicedomain.getDomainList().then(result=>{
            this.setState({
                data: result.domainData
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
    render() {
        const {domain} = this.props.stores.I18nModel.outputLocale
        const columns = [{
            title: domain.domainName,
            dataIndex: 'name',
            key: 'name',
            width: '32%',
        }, {
            title: domain.domainType,
            dataIndex: 'type',
            key: 'type',
            width: '32%',
        }, {
            title: domain.domainID,
            dataIndex: 'id',
            key: 'id',
            width: '32%',

        }];
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
        const rowSelection = {
            onSelect:(record, selected, selectedRows) => {
                this.setState({
                    domainAddData:selected,
                    domainEditData: selected,
                    domainUserData:selected,
                    domainDeleteData:selected,
                    domainData:record
                })


            },
        };

        return (
            <div>
                <div className="headerDomain">
                    <Button type="primary" icon="plus-circle-o" onClick={this.handleAdd}>{domain.insert}</Button>
                    <Button type="primary" icon="edit" onClick={this.handleUpdate}>{domain.modify}</Button>
                    <Button type="danger" icon="delete" onClick={this.handleDelete}>{domain.delete}</Button>
                    <Button type="primary" icon="user" onClick={this.handleDetail}>{domain.detail}</Button>
                </div>
                <div className="gridTree">
                    <Table {...this.state} columns={columns} rowSelection={rowSelection} dataSource={this.state.data} onRow={(record) => {
                        return {
                            onClick: (e) => {
                                e.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click()
                            },       // 点击行
                            onDoubleClick: (e) => {
                                this.setState({
                                    domainUserData:true
                                },()=>{
                                    this.handleDetail()
                                });


                            },
                        }
                    }
                    }/>
                    <Modal
                        title="新增区域"
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
                                    label="所属标识"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('domainsign', {
                                        rules: [{ required: true,}],
                                        initialValue:"1010582",
                                    })(

                                            <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="区域名称"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('domainName', {
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
                                    label="区域类型"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('domainType', {
                                        rules: [{ required: true,}],
                                        initialValue:"请选择",
                                    })(
                                        <Select>
                                            <Option value="省">省</Option>
                                            <Option value="本地网">本地网 </Option>
                                            <Option value="县市">县市</Option>
                                            <Option value="扇区">扇区</Option>
                                            <Option value="自定义">自定义</Option>
                                            <Option value="请选择" disabled>请选择</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="区域码"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('domainID', {
                                        rules: [{ required: true,}],
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
                                    label="序号"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    {getFieldDecorator('domainNo', {
                                        rules: [{ type:'number',}],
                                        initialValue:" ",
                                    })(
                                        <InputNumber min={1} max={10000}  />
                                    )}
                                </FormItem>
                            </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        title="修改区域"
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
                        <Form  onSubmit={this.handleSubmit}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="所属标识"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('domainsign', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.domainData.key,
                                        })(
                                            <Input placeholder="1010582"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="区域名称"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('domainName', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.domainData.name,
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="区域类型"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('domainType', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.domainData.type,
                                        })(
                                            <Select >
                                                <Option value="省">省</Option>
                                                <Option value="本地网">本地网 </Option>
                                                <Option value="县市">县市</Option>
                                                <Option value="扇区">扇区</Option>
                                                <Option value="自定义">自定义</Option>
                                                <Option value="请选择" disabled>请选择</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="区域码"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('domainID', {
                                            rules: [{ required: true,}],
                                            initialValue:this.state.domainData.id,
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="序号"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {getFieldDecorator('domainNo', {
                                            rules: [{ }],
                                            initialValue:this.state.domainData.No,
                                        })(
                                            <InputNumber min={1} max={10000}/>
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
                        <Form  onSubmit={this.handleSubmit}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="所属标识"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >

                                        {this.state.domainData.key}

                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="区域名称"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.domainData.name}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="区域类型"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.domainData.type}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="区域码"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.domainData.id}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="序号"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        {this.state.domainData.No}
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
