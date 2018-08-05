import React from 'react';
import {Layout} from 'antd';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

import Home from "../Home/Home"
// import QuestionLibMgr from "@admin/nps/QuestionLibMgr"
import Domain from "../System/Domain/Domain"
import Dept from "../System/Dept/Dept"

import {inject, observer} from "mobx-react/index"

import "./Main.less"

const {Content} = Layout;

@inject("stores")
@observer
class Main extends React.Component {
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
                                {/*<Route path="/nps/questionLibMgr" component={QuestionLibMgr}/>*/}
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
