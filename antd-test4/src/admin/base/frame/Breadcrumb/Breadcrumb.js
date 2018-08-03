import React from 'react';
import AntPageHeader from 'ant-design-pro/lib/PageHeader';
import {HashRouter as Link, withRouter} from 'react-router-dom';
import {Breadcrumb, Alert} from 'antd';
// import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';

import "./Breadcrumb.less"

@inject("stores")
@observer
class Bread extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'mail',
            menuMaps: []
        }
    }

    render() {
        const {stores, location} = this.props;
        const menuMaps = stores.MenuModel.menuMaps;
        const pathSnippets = location.pathname.split('/').filter(i => i);

        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url} href={'#' + url}>
                    {menuMaps[url]}
                </Breadcrumb.Item>
            );
        });
        let BreadcrumbItems = extraBreadcrumbItems;
        if (menuMaps.length !== 0 && pathSnippets.length === 0) {
            BreadcrumbItems = [(
                <Breadcrumb.Item key="home" href="/">
                    首页
                </Breadcrumb.Item>
            )].concat(extraBreadcrumbItems);
        }
        return (
            <Breadcrumb>
                {BreadcrumbItems}
            </Breadcrumb>)
    }
}

export default withRouter(Bread);
