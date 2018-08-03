import React, {Component} from 'react';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import NotFound from './admin/base/error/NotFound';
import Login from './admin/base/login/Login';
import Main from './admin/base/frame/Layout/Main';
import AuthorizedRoute from './admin/base/login/AuthorizedRoute';

import {Provider} from "mobx-react";

import stores from './model/Stores';
// 统一引入样式

import './less/index.less'
import './mock/apiData'

moment.locale('en');

class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Provider stores={stores}>
                    <Router>
                        <Switch>
                            <Route exact path="/login" component={Login}/>
                            <AuthorizedRoute path="/" component={Main}/>
                            <Route path='/404' component={NotFound}/>
                            <Redirect from='*' to='/404'/>
                        </Switch>
                    </Router>
                </Provider>
            </LocaleProvider>
        );
    }
}

export default App;
