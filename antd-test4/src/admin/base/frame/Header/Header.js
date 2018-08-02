import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import MenuSer from '../../../../services/MenuSer';

import "./Header.less"

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Head extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            current: 'mail',
        }
        this.initMenu = this.initMenu.bind(this)
    }

    componentWillMount() {
        MenuSer.getMenuList().then(res => {
            this.setState({menuData: res.menuData})
        })
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    initMenu = (menuData = this.state.menuData) => {
        if (!menuData)
            return false;
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
