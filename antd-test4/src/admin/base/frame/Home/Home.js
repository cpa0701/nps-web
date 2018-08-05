import React from 'react';
import {
    Pagination, DatePicker, TimePicker, Calendar,
    Table, Modal, Button, Select, Transfer
} from 'antd';
import moment from 'moment';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    filters: [{
        text: 'filter1',
        value: 'filter1',
    }],
}, {
    title: 'Age',
    dataIndex: 'age',
}];

class Home extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            locale: null,
            visible: false,
        };
    }

    showModal = () => {
        this.setState({visible: true});
    }

    hideModal = () => {
        this.setState({visible: false});
    }

    render() {
        const info = () => {
            Modal.info({
                title: 'some info',
                content: 'some info',
            });
        };
        const confirm = () => {
            Modal.confirm({
                title: 'some info',
                content: 'some info',
            });
        };
        return (
            <div className="locale-components">
                <div className="example">
                    <Pagination defaultCurrent={1} total={50} showSizeChanger/>
                </div>
                <div className="example">
                    <Select showSearch style={{width: 200}}>
                        <Option value="jack">jack</Option>
                        <Option value="lucy">lucy</Option>
                    </Select>
                    <DatePicker/>
                    <TimePicker/>
                    <RangePicker style={{width: 200}}/>
                </div>
                <div className="example">
                    <Button type="primary" onClick={this.showModal}/>Show Modal
                    <Button onClick={info}/>Show info
                    <Button onClick={confirm}/>Show confirm
                </div>
                <div className="example">
                    <Transfer
                        dataSource={[]}
                        showSearch
                        targetKeys={[]}
                        render={item => item.title}
                    />
                </div>
                <div style={{width: 319, border: '1px solid #d9d9d9', borderRadius: 4}}>
                    <Calendar fullscreen={false} value={moment()}/>
                </div>
                <div className="example">
                    <Table dataSource={[]} columns={columns}/>
                </div>
                <Modal title="Locale Modal" visible={this.state.visible} onCancel={this.hideModal}>
                    <p>Locale Modal</p>
                </Modal>
            </div>
        );
    }
}

export default Home;
