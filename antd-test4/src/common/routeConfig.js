import React from 'react';
import {Route} from 'react-router-dom';

import Home from "../admin/base/frame/Home/Home"
import Domain from "../admin/system/domain/Domain"
import Dept from "../admin/system/dept/Dept"
import Role from "../admin/system/role/Role"
import Authority from "../admin/system/authority/Authority"
import QuestionApplication from "../admin/npsMgr/QuestionApplication"

class RouteList extends React.PureComponent {
    render() {
        return (
            <div>
                <Route path="/" exact component={Home}/>
                <Route path="/npsMgr/questionMgr/questionApplication" component={QuestionApplication}/>
                <Route path="/system/domain" component={Domain}/>
                <Route path="/system/dept" component={Dept}/>
                <Route path="/system/role" component={Role}/>
                <Route path="/system/authority" component={Authority}/>
            </div>
        )
    }
}

export default RouteList