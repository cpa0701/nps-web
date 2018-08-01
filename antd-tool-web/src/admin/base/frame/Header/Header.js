import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import LoginService from '../../../../services/LoginService';

import "./Header.less"

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Head extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            current: 'mail',
            menuData: [
                {
                    name: '首页',
                    icon: 'home',
                    path: '/',
                    id: 1
                },
                {
                    name: '调研问卷管理',
                    icon: 'form',
                    path: '/nps/surveyQstnaire',
                    id: 2,
                    children: [
                        {
                            name: '题目管理',
                            path: '/questionLibMgr',
                            id: 21,
                        },
                        {
                            name: '问卷管理',
                            path: 'questionMgr',
                            id: 22,
                            children:[
                                {
                                    name: '问卷申请',
                                    path: 'questionnaireFor',
                                    id: 221,
                                },
                                {
                                    name: '问卷审核',
                                    path: 'questionnaireReview',
                                    id: 222,
                                },
                                {
                                    name: '问卷库',
                                    path: 'questionnaireLibrary',
                                    id: 223,
                                }
                            ]
                        }
                    ],
                },
                {
                    name: '调研任务管理',
                    icon: 'table',
                    path: 'list',
                    id: 3,
                    children: [
                        {
                            name: '触发式调研任务申请',
                            path: 'table-list',
                            id: 31,
                        },
                        {
                            name: '调研任务申请',
                            path: 'basic-list',
                            id: 32,
                        },
                        {
                            name: '调研任务审核',
                            path: 'card-list',
                            id: 33,
                        },
                        {
                            name: '调研任务终止',
                            path: 'basic-list',
                            id: 34,
                        },
                        {
                            name: '周期性调研',
                            path: 'card-list',
                            id: 35,
                        }
                    ],
                },
                {
                    name: '调研资源管理',
                    icon: 'profile',
                    path: 'profile',
                    id: 4,
                    children: [
                        {
                            name: '调研资源规划',
                            path: 'basic',
                            id: 41,
                        },
                        {
                            name: '调研资源统计图',
                            path: 'advanced',
                            authority: 'admin',
                            id: 42,
                        },
                    ],
                },
                {
                    name: '满意度运营分析',
                    icon: 'check-circle-o',
                    path: 'result',
                    id: 5,
                    children: [
                        {
                            name: '调研结果分析',
                            path: 'success',
                            id: 51,
                        }
                    ]
                },
                {
                    name: '客户忠诚度感知',
                    icon: 'user',
                    path: 'profile',
                    id: 6,
                    children: [
                        {
                            name: '感知总视图',
                            path: 'basic',
                            id: 61,
                        },
                        {
                            name: '支局视图',
                            path: 'advanced',
                            authority: 'admin',
                            id: 62,
                        },
                        {
                            name: '用户视图',
                            path: 'basic',
                            id: 63,
                        },
                        {
                            name: '统计报表',
                            path: 'advanced',
                            authority: 'admin',
                            id: 64,
                        },
                    ],
                },
                {
                    name: '系统管理',
                    icon: 'setting',
                    path: 'result',
                    id: 7
                }
            ],
        }
        this.initMenu = this.initMenu.bind(this)
    }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    initMenu = (menuData = this.state.menuData) => {
        return menuData.map((item) => {
                if (item.children) {
                    return (
                        <SubMenu key={item.id}
                                 title={<span><Icon type={item.icon}/><span>{item.name}</span></span>}>
                            {item.children.map((vl) => {
                                if (vl.children) {
                                    return (<SubMenu key={vl.id}
                                                     title={<span><Icon type={vl.icon}/><span>{vl.name}</span></span>}>
                                        {this.initMenu(vl.children)}</SubMenu>)
                                } else {
                                    return (

                                        <Menu.Item key={vl.id}>{vl.name}</Menu.Item>
                                    )
                                }
                            })}
                        </SubMenu>
                    )
                } else {
                    return (<Menu.Item key={item.id}>
                        <Icon type={item.icon}/>{item.name}
                    </Menu.Item>)
                }
            }
        )
    }

    componentWillMount() {
        // LoginService.getMenuList().then(res => {
        //     return res.json()
        // }).then(json => {
        //     console.log(json)
        // })
    }

    render() {
        const {menuData} = this.state;
        return (
            <Header>
                <div className="logo">
                    <Icon type="apple"/>
                </div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    theme="dark"
                    style={{height: "100%", paddingTop: 9}}
                >{
                    this.initMenu()
                }</Menu>
            </Header>
        )
    }
}

export default Head;
