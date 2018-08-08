import React from 'react';
import {Layout, Menu, Icon, Dropdown} from 'antd';
import MenuSer from '../../../../services/MenuSer';
import {observer, inject} from 'mobx-react';
import {Link, withRouter} from 'react-router-dom';
import "./Header.less"

const {Header} = Layout;
const SubMenu = Menu.SubMenu;

@inject("stores")
@observer
class Head extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 'mail',
            menuData: [],
            locale: null,
        }
        this.stores = this.props.stores;

        this.initMenu = this.initMenu.bind(this)
        this.mainOptionClick = this.mainOptionClick.bind(this)
    }

    mainOptionClick = ({key}) => {
        if (key.includes('zh-cn') || key.includes('en')) {
            this.stores.I18nModel.changeLocale(key);
            localStorage.setItem('locale', key);
            window.location.reload();
        } else {
            this.stores.LoginModel.logout();
            window.location.reload();
        }
    };

    componentWillMount() {
        MenuSer.getMenuList().then(res => {
            this.setState({menuData: res.menuData})
            //菜单数据
            this.stores.MenuModel.setMenuInfos(res.menuData);
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
                        <SubMenu key={item.menuId}
                                 title={<span><Icon type={item.icon}/><span>{item.menuName}</span></span>}>
                            {item.children.map((vl) => {
                                if (vl.children) {
                                    return (<SubMenu key={vl.menuId}
                                                     title={<span><Icon type={vl.icon}/><span>{vl.menuName}</span></span>}>
                                        {this.initMenu(vl.children)}</SubMenu>)
                                } else {
                                    return (
                                        <Menu.Item key={vl.menuId}><Link to={vl.menuUrl}
                                                                         replace>{vl.menuName}</Link></Menu.Item>
                                    )
                                }
                            })}
                        </SubMenu>
                    )
                } else {
                    return (<Menu.Item key={item.menuId}>
                        <Link to={item.menuUrl} replace>
                            <Icon type={item.icon}/>{item.menuName}
                        </Link>
                    </Menu.Item>)
                }
            }
        )
    }

    render() {
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

                <div className='main-options'>
                    <Dropdown overlay={<Menu onClick={this.mainOptionClick}>
                        <Menu.Item key="zh-cn">中文</Menu.Item>
                        <Menu.Item key="en">English</Menu.Item>
                        <Menu.Item key="logout">{this.stores.I18nModel.outputLocale.header.logout}</Menu.Item>
                    </Menu>}>
                        <Icon type='appstore'/>
                    </Dropdown>
                </div>
            </Header>
        )
    }
}

export default withRouter(Head);
