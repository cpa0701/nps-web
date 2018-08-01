import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
