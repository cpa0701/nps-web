import React from 'react';
import AntPageHeader from 'ant-design-pro/lib/PageHeader';
import {withRouter} from 'react-router-dom';

// import "./Breadcrumb.less"


class Bread extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuMaps: [
                {
                    "menuId": 1,
                    "menuName": "首页",
                    "menuUrl": "/",
                    "menuLevel": "1",
                    "menuIcon": "home",
                    "orderId": 1,
                    "pmenuId": -1,
                    "state": "00A",
                    "updateTime": "20180524111218",
                    "operateType": "2",
                    "children": null,
                    "isLeaf": null
                }, {
                    "menuId": 300,
                    "menuName": "系统管理",
                    "menuUrl": "/system",
                    "menuLevel": "1",
                    "menuIcon": "setting",
                    "orderId": 5,
                    "pmenuId": -1,
                    "state": "00A",
                    "updateTime": "20180330133411",
                    "operateType": "2",
                    "children": [],
                    "isLeaf": null
                },{
                    "menuId": 301,
                    "menuName": "区域管理",
                    "menuUrl": "/system/domain",
                    "menuLevel": "2",
                    "menuIcon": "",
                    "orderId": 1,
                    "pmenuId": 300,
                    "state": "00A",
                    "updateTime": "",
                    "operateType": "",
                    "children": null,
                    "isLeaf": null
                }, {
                    "menuId": 303,
                    "menuName": "部门人员管理",
                    "menuUrl": "/system/dept",
                    "menuLevel": "2",
                    "menuIcon": null,
                    "orderId": 3,
                    "pmenuId": 300,
                    "state": "00A",
                    "updateTime": null,
                    "operateType": null,
                    "children": null,
                    "isLeaf": null
                }, {
                    "menuId": 304,
                    "menuName": "角色管理",
                    "menuUrl": "/system/Role",
                    "menuLevel": "2",
                    "menuIcon": null,
                    "orderId": 4,
                    "pmenuId": 300,
                    "state": "00A",
                    "updateTime": null,
                    "operateType": null,
                    "children": null,
                    "isLeaf": null
                }, {
                    "menuId": 305,
                    "menuName": "权限管理",
                    "menuUrl": "/system/Authority",
                    "menuLevel": "2",
                    "menuIcon": null,
                    "orderId": 5,
                    "pmenuId": 300,
                    "state": "00A",
                    "updateTime": "20180525191701",
                    "operateType": "1",
                    "children": null,
                    "isLeaf": null
                }]
        };
    }

    render() {
        const menuMaps = this.state.menuMaps;
        const {location} = this.props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            for (let i = 0; i < menuMaps.length; i++) {
                let menu = menuMaps[i];
                if (url === menu.menuUrl) {
                    let children = menu.children;
                    let href = '#' + url;
                    //拥有子菜单一般都不是链接菜单
                    if (children && children.length > 0) {
                        href = '';
                    }
                    return (
                        {
                            key: menu.menuId,
                            href: href,
                            title: menu.menuName
                        }
                    );
                }
            }
            return (
                {
                    key: url,
                    href: url,
                    title: url
                }
            );
        });

        //最前面增加首页链接
        let items = [{
            key: 'homeBread',
            href: '#',
            title: '首页'
        }].concat(extraBreadcrumbItems);
        return (
            <AntPageHeader title="" breadcrumbList={items}/>
        )
    }
}

export default withRouter(Bread);
