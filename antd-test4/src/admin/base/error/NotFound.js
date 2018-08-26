import React, { Component } from 'react';
import Exception from 'ant-design-pro/lib/Exception';
import {Link} from 'react-router-dom';

class NotFound extends Component {
  render(){
    return (
      <Exception type="404"  linkElement={Link}/>
    )
  }
}

export default NotFound;
