import React from 'react';
import {Layout, Menu, Icon,Radio} from 'antd';
import MenuSer from '../../../../services/MenuSer';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router-dom';
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
        this.changeLocale = this.changeLocale.bind(this)
    }

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
                                        <Menu.Item key={vl.menuId}><Link to={vl.menuUrl}>{vl.menuName}</Link></Menu.Item>
                                    )
                                }
                            })}
                        </SubMenu>
                    )
                } else {
                    return (<Menu.Item key={item.menuId}>
                        <Link to={item.menuUrl}>
                            <Icon type={item.icon}/>{item.menuName}
                        </Link>
                    </Menu.Item>)
                }
            }
        )
    }
    changeLocale = (e) => {
        const localeValue = e.target.value;
        this.setState({locale: localeValue});
        // if (!localeValue) {
        //     moment.locale('en');
        // } else {
        //     moment.locale('zh-cn');
        // }
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

            </Header>
        )
    }
}

export default Head;
