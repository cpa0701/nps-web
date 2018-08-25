import React, {PureComponent} from 'react';
import {Table, Alert, Spin, Button} from 'antd';
import './table.less';
import {inject} from "mobx-react/index"

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

function initTotalList(columns) {
    const totalList = [];
    columns.forEach((column) => {
        if (column.needTotal) {
            totalList.push({...column, total: 0});
        }
    });
    return totalList;
}

function initAsyncSpan(columns) {
    columns.forEach((column) => {
        //异步加载静态数据翻译
        if (column.code && !column.render) {
            column.render = (val) => {
                return <AsyncSpan code={column.code} value={val}/>;
            }
        }
    });
}
@inject('stores')
class StandardTable extends PureComponent {
    constructor(props) {
        super(props);
        const {columns, rowSelection,onRef} = props;
        const selectedRowKeys = rowSelection ? rowSelection.selectedRowKeys : [];
        const needTotalList = initTotalList(columns);
        this.state = {
            clickedRowIndex: null,
            selectedRowKeys: (selectedRowKeys || []),
            needTotalList,
        };
        this.rowClassName = this.rowClassName.bind(this);
        onRef(this);
    }

    componentWillReceiveProps(nextProps) {
        // clean state
        if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
            const needTotalList = initTotalList(nextProps.columns);
            this.setState({
                // selectedRowKeys: [],
                needTotalList,
            });
        }
        else if (nextProps.rowSelection
            && nextProps.rowSelection.selectedRowKeys
            && this.state.selectedRowKeys.length > 0
            && nextProps.rowSelection.selectedRowKeys.length !== this.state.selectedRowKeys) {
            // const needTotalList = initTotalList(nextProps.columns);
            this.setState({
                selectedRowKeys: nextProps.rowSelection.selectedRowKeys
            });
        }
        initAsyncSpan(nextProps.columns);
    }

    handleSearch = (params) => {
        const {service, method, cusParams} = this.props;

        let _params = {};
        if (cusParams) {
            _params = {
                ...params,
                ...cusParams
            }
        } else {
            _params = {
                ...params
            }
        }

        if (typeof(service[method]) !== 'function') {
            return;
        }

        this.setState({
            loading: true
        });
        service[method](_params)
            .then(result => {
                // if (!result || !result.head) {
                if (!result) {
                    return;
                }
                // let head = result.head;
                // let data = result.data;
                // let success = head.resultCode;
                // if (success !== '0') {
                //     message.error(head.remark);
                // }
                let data = result;
                // let success = result.status;
                //
                // if (success !== '1') {
                //     message.error(success === '0' ? '系统错误，请联系管理员' : '该记录已存在');
                // }
                // else {
                let pageSizeOptions = ['5', '10', '20', '30', '40'];
                let dataSource = data.dataList || data.page;
                if (this.props.onFinishLoading) {
                    dataSource = this.props.onFinishLoading(_params.pageInfo.pageIndex, data.dataList);
                }
                this.setState({
                    loading: false,
                    list: dataSource,
                    pagination: data.pageInfo ? {
                        total: this.getInteger(data.pageInfo.totalRow),
                        pageSize: this.getInteger(data.pageInfo.pageNum),
                        current: this.getInteger(data.pageInfo.pageIndex),
                        pageSizeOptions: pageSizeOptions
                    } : false,
                    selectedRowKeys: [dataSource[0][this.props.rowKey]],
                    clickedRowIndex: dataSource[0][this.props.rowKey],
                });
                this.props.onSelectRow([dataSource[0]])
                // }
            });
    }

    getInteger = (value) => {
        if (typeof(value) === 'number') {
            return value;
        }
        else if (typeof(value) === 'string') {
            return parseInt(value, 10);
        }
        else {
            return 0;
        }
    }

    handleRowSelectChange = (selectedRowKeys, selectedRows) => {
        let needTotalList = [...this.state.needTotalList];
        needTotalList = needTotalList.map((item) => {
            return {
                ...item,
                total: selectedRows.reduce((sum, val) => {
                    return sum + parseFloat(val[item.dataIndex], 10);
                }, 0),
            };
        });

        if (this.props.onSelectRow) {
            this.props.onSelectRow(selectedRows, selectedRowKeys);
        }
        this.setState({selectedRowKeys, needTotalList});
    }

    handleRowSelect = (record, selected, selectedRows) => {
        if (this.props.onRowSelect) {
            this.props.onRowSelect(record, selected, selectedRows);
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        if (this.props.handleStandardTableChange) {
            //自定义了事件
            this.props.handleStandardTableChange(pagination, filters, sorter);
        }
        else {
            //采用标准事件
            this.handleStandardTableChange(pagination, filters, sorter);
        }
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const {formValues} = this.props;
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = {...obj};
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            pageInfo: {
                pageIndex: pagination.current + '',
                pageNum: pagination.pageSize + ''
            },
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        this.handleSearch(params);
    }

    cleanSelectedKeys = () => {
        this.handleRowSelectChange([], []);
    }

    cleanTable = () => {
        this.setState({
            list: [],
            pagination: null
        });
        this.cleanSelectedKeys();
    }

    onRowClick = (record, index) => {
        const {onRowClick} = this.props;
        this.setState({
            clickedRowIndex: record[this.props.rowKey]
        });
        if (typeof(onRowClick) === 'function') {
            onRowClick(record, index);
        }
    }

    rowClassName = (record, index) => {
        if (this.state.clickedRowIndex === record[this.props.rowKey]) {
            //点击行的样式
            return 'ant-table-row-selected';
        }
        return 'ant-table-row-nonSelected';
    }

    render() {
        const {dept}=this.props.stores.I18nModel.outputLocale
        const {selectedRowKeys, needTotalList} = this.state;
        const {
            title, size, columns, rowKey, showRowSelection,
            dataSource, dataSourcePagination,
            dataSourceLoading, onPaginationLoaded
        } = this.props;
        let rowSelection = this.props.rowSelection || {};
        rowSelection.selectedRowKeys = selectedRowKeys;
        let list = dataSource ? dataSource : this.state.list;
        let pagination = dataSourcePagination ? dataSourcePagination : this.state.pagination;
        let loading = dataSourceLoading ? dataSourceLoading : this.state.loading;
        let paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            ...pagination,
        };
        if (!pagination) {
            paginationProps = false
        }

        if (onPaginationLoaded) {
            onPaginationLoaded(paginationProps);
        }

        const defaultRowSelection =
            {
                selectedRowKeys,
                onChange: this.handleRowSelectChange,
                onSelect: this.handleRowSelect,
                getCheckboxProps: record => {
                    return ({
                        disabled: record.disabled,
                    })
                }
            };

        rowSelection = Object.assign(defaultRowSelection, rowSelection);
        const rowSelectionOpts = showRowSelection === false ? null : rowSelection;
        let showSelectTips = rowSelection.type === 'radio' ? false : showRowSelection;
        return (
            <div className={'standardTable'}>
                {showSelectTips === false ? null :
                    <div className={'tableAlert'}>
                        <Alert
                            message={(
                                <div>
                                    已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                    {
                                        needTotalList.map(item => (
                                                <span style={{marginLeft: 8}} key={item.dataIndex}>{item.title}总计&nbsp;
                                                    <span style={{fontWeight: 600}}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                                            )
                                        )
                                    }
                                    {/* <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a> */}
                                    <Button style={{border: 0}}
                                            onClick={this.cleanSelectedKeys}
                                            disabled={(selectedRowKeys.length === 0)}
                                            type="primary"
                                            ghost={true}>{dept.clear}</Button>
                                </div>
                            )}
                            type="info"
                            showIcon
                        />
                    </div>
                }
                <Table
                    title={title}
                    size={size}
                    loading={loading}
                    rowKey={rowKey}
                    rowSelection={rowSelectionOpts}
                    onRow={(record, index) => {
                        return {
                            onClick: () => {
                                this.onRowClick(record, index)
                            },       // 点击行
                            onMouseEnter: () => {
                            },  // 鼠标移入行
                            onDoubleClick: (e) => {
                                this.props.onDoubleClick && this.props.onDoubleClick(record, index);
                            }
                        }
                    }}
                    scroll={{y: 300}}
                    rowClassName={this.rowClassName}
                    dataSource={list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    ref={child => this.standardTable = child}
                />
            </div>
        );
    }
}

export default StandardTable;

//异步加载静态数据模块
class AsyncSpan extends PureComponent {
    state = {
        text: null
    }

    componentWillMount() {
        const {code, value} = this.props;
        this.handleQryDcValName(code, value);
    }

    handleQryDcValName = (code, value) => {
        if (!code) {
            return;
        }
    }

    componentWillReceiveProps(props) {
        const {code, value} = this.props;
        if (props.code === code && props.value !== value) {
            this.handleQryDcValName(props.code, props.value);
        }
    }

    render() {
        // const {code} = this.props;

        return (
            <span>{this.state.text}<Spin spinning={this.state.text === null}/></span>
        )
    }
}
