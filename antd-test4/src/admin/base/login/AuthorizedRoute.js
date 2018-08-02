import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {inject} from 'mobx-react';

@inject('stores')
class AuthorizedRoute extends React.Component {

  hasLogined(){
    let logined = false;

    const { stores } = this.props;
    let loginModel = stores.LoginModel;
    let modelUsercode = loginModel.usercode;

    if(!sessionStorage){
      return logined;
    }
    let usercode = sessionStorage.getItem('uc');
    if(modelUsercode && usercode && usercode !== modelUsercode){
      sessionStorage.setItem('uc', modelUsercode);
      return false;
    }
    return usercode;
  }

  render() {
    const { component: Component } = this.props;

    return (
        <Route render={props => {
        return this.hasLogined()
          ? <Component {...props} />
          : <Redirect to="/login" />
      }} />
    )
  }
}

export default AuthorizedRoute
