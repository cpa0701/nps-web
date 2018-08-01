import React from 'react';
import {Layout} from 'antd';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

import Home from "../Home/Home"
import Domain from "../System/Domain/Domain"
import Dept from "../System/Dept/Dept"

import "./Main.less"

const {Content} = Layout;

class Main extends React.PureComponent {
    render() {
        return (
            <Router>
                <Layout className="layout">
                    <Header/>
                    <Content>
                        <Breadcrumb/>
                        <div className="content">
                            <Switch>
                                <Route path="/" exact component={Home}/>
                                <Route path="/system/domain" component={Domain}/>
                                <Route path="/system/dept" component={Dept}/>
                            </Switch>
                        </div>
                    </Content>
                    <Footer/>
                </Layout>
            </Router>

        )
    }
}

export default Main;
