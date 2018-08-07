import React from 'react';
import { Layout } from 'antd';

import "./Footer.less"

const { Footer } = Layout;

class Foot extends React.PureComponent {
    render() {
        return (
            <Footer>
                © 中兴软创科技股份有限公司 版权所有| All Rights Reserved
            </Footer>
        )
    }
}

export default Foot;
