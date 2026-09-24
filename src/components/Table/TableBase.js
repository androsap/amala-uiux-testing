import React from 'react';
import { RetrieveRequest, RetrieveRequestCustom } from '../../utilities/RequestService';
import { Alert, Pagination } from '../../components/Base/BaseComponent';
import { Table, Row } from 'antd';

const { Column, ColumnGroup } = Table;
class TableBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            criteria: this.props.configuration.criteria ? this.props.configuration.criteria : {},
            criteriadata: this.props.configuration.criteriadata ? this.props.configuration.criteriadata : {},
            sort: this.props.configuration.sort ? this.props.configuration.sort : {},
            loading: false,
            totalrecord: 0,
            rowsSelection: {
                selectedRows: this.props.defaultRowSelected ? this.props.defaultRowSelected : [],
                selectedRowKeys: this.props.defaultRowSelectedKey ? this.props.defaultRowSelectedKey : []
            }
        }

        this.handleRowSelectOnChange = this.handleRowSelectOnChange.bind(this);
    }

    componentDidMount() {
        if (this.props.didmount || this.props.didmount === undefined) {
            this.getList();
        }
    }

    getList() {
        const { sort, criteria, criteriadata } = this.state;
        let url = this.props.configuration.url;
        let column = [];
        /* 
            checking pagination true or false,
            if true or undefined, default from state
            else if false, default page = 1 and limit = -1
        */
        let paging = (this.props.pagination === false) ? { page: 1, limit: -1 } : { page: this.state.current, limit: this.state.pageSize };
        this.setState({ loading: true });
        if (this.props.configuration.retrieveCustom) {
            let parameter = (this.props.configuration.noColumnRequest) ? { column, criteria, sort } : { column, criteria, sort, data: criteriadata };
            RetrieveRequestCustom(url, parameter, paging).then((response) => {
                const { paging, status } = response;
                const { responsecode } = status;
                if (responsecode && responsecode.substring(0, 1) === '0') {
                    let number = (this.props.pagination === false) ? 0 : (paging.page - 1) * paging.limit;
                    let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                    let totalrecord = (this.props.pagination === false) ? dataList.length : response.paging.totalrecord;

                    this.setState({ dataList, totalrecord });
                } else Alert.error(response.status.responsemessage);
                this.setState({ loading: false });
            });
        } else RetrieveRequest(url, criteria, paging, column, sort, criteriadata).then((response) => {
            const { paging, status } = response;
            const { responsecode } = status;
            if (responsecode && responsecode.substring(0, 1) === '0') {
                let number = (this.props.pagination === false) ? 0 : (paging.page - 1) * paging.limit;
                let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                let totalrecord = (this.props.pagination === false) ? dataList.length : response.paging.totalrecord;

                this.setState({ dataList, totalrecord });
            } else {
                Alert.error(response.status.responsemessage);
            }
            this.props.afterRequest && this.props.afterRequest(response);
            this.setState({ loading: false });
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        let sort = {};
        if (sorter.field) { sort = { [sorter.field]: (sorter.order === 'ascend') ? 'asc' : 'desc' } }
        this.setState({ sort }, () => this.getList());
    }

    generateColumns = () => {
        return this.props.configuration.columns.map((obj, key) => {
            var sort = this.props.configuration.sort;
            for (const fieldsort in sort) {
                if (fieldsort === obj.dataIndex) {
                    obj.defaultSortOrder = (sort[fieldsort] === 'asc') ? 'ascend' : 'descend';
                }
            }

            /* overide className in columns */
            if (obj && this.props.configuration.columnClassName && (obj.className === undefined || obj.className === "")) {
                obj.className = this.props.configuration.columnClassName;
            }

            switch (obj.type) {
                case 'field':
                    return <Column {...obj} title={obj.title} dataIndex={obj.dataIndex} key={obj.dataIndex} sorter={obj.sorter} width={obj.width} />
                case 'html':
                    return <Column {...obj} title={obj.title} dataIndex={obj.dataIndex} key={obj.dataIndex} sorter={obj.sorter} width={obj.width}
                        render={(value, row, index) => obj.render(value, row, index)} />
                case 'group':
                    return <ColumnGroup title={obj.title} width={obj.width}>
                        {
                            obj.childcolumns.map((obj2, key2) => {
                                switch (obj2.type) {
                                    case 'field':
                                        return <Column {...obj} title={obj2.title} dataIndex={obj2.dataIndex} key={obj2.dataIndex} sorter={obj2.sorter} width={obj.width} />
                                    case 'html':
                                        return <Column {...obj} title={obj2.title} dataIndex={obj2.dataIndex} key={obj2.dataIndex} sorter={obj2.sorter} width={obj.width}
                                            render={(value, row, index) => obj2.render(value, row, index)} />
                                    default:
                                        return null
                                }
                            })
                        }
                    </ColumnGroup>
                default:
                    return null
            }
        });
    }

    onPaginationChange = page => {
        this.setState({ current: page }, () => this.getList());
    };

    handleSearchForm = async (criteria, criteriadata) => {
        criteriadata = { ...this.state.criteriadata, ...criteriadata };
        criteria = { ...this.state.criteria, ...criteria };
        await this.setState({ criteria, criteriadata, current: 1, }, () => this.getList());
    }

    handleRowSelectOnChange = async (selectedRowKeys, selectedRows) => {
        const rowKey = (this.props.configuration.rowKey) ? this.props.configuration.rowKey : record => record.number;
        selectedRows = [...this.state.rowsSelection.selectedRows, ...selectedRows];
        selectedRows = [...new Map(selectedRows.map(item => [rowKey(item), item])).values()];
        selectedRows = selectedRows.filter(obj => selectedRowKeys.includes(rowKey(obj)));

        this.setState({ rowsSelection: { ...this.state.rowsSelection, selectedRowKeys, selectedRows } });
        if (this.props.useCustomOnChange) {
            if (selectedRowKeys.length > 0) {
                this.props.customOnChange(true, selectedRows, selectedRowKeys)
            } else {
                this.props.customOnChange(false, selectedRows, selectedRowKeys)
            }
        }
    }

    resetSelectedRowKeys() {
        let rowsSelection = { ...this.state.rowsSelection, selectedRowKeys: [] };
        this.setState({ rowsSelection })
    }

    render() {
        const { dataList, loading, current, totalrecord, pageSize, rowsSelection } = this.state;
        const { selectedRowKeys } = rowsSelection;
        const { getCheckboxProps } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.handleRowSelectOnChange(selectedRowKeys, selectedRows);
            },
            getCheckboxProps
        };

        /* set default rowKey */
        const rowKey = (this.props.configuration.rowKey) ? this.props.configuration.rowKey : record => record.number;
        /* set default scroll */
        const scroll = (this.props.scroll) ? this.props.scroll : {};

        return (
            <Row className={this.props.className}>
                <Row style={{ ...this.props.style, marginBottom: 30 }}>
                    <Table rowKey={rowKey} rowSelection={(this.props.rowSelection) ? rowSelection : null} dataSource={dataList} size="middle" pagination={false} loading={loading} onChange={this.handleTableChange} scroll={scroll}
                        expandedRowRender={(this.props.configuration.expandedRowRender) ? record => this.props.configuration.expandedRowRender(record) : null}>
                        <Column title="No" dataIndex="number" key="number" />
                        {this.generateColumns()}
                    </Table>
                </Row>
                {
                    /* 
                        checking pagination true or false,
                        if true or undefined, default from state
                        else if false, default page = 1 and limit = -1
                    */
                    (this.props.pagination === false) ? null :
                        <Row type="flex" justify="end">
                            <Pagination
                                current={current}
                                total={totalrecord}
                                pageSize={pageSize}
                                onChange={this.onPaginationChange}
                                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                hideOnSinglePage={this.props.hidePagination}
                            />
                        </Row>
                }
            </Row>
        )
    }

}

export default TableBase;