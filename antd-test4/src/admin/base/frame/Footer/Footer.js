import React from 'react';
import { Layout } from 'antd';

import "./Footer.less"

const { Footer } = Layout;

class Foot extends React.PureComponent {
    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2016 Created by Ant UED
            </Footer>
        )
    }
}

export default Foot;
