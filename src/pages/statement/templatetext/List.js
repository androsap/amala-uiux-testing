import React from 'react';
import { RetrieveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, Pagination } from '../../../components/Base/BaseComponent';
import { Form, Table, Divider, Row, Col, Typography } from 'antd';
const { Column, ColumnGroup } = Table;
const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            criteria: {
                channel: (props.channelid) ? props.channelid : null,
                statementcode: (props.statementcode) ? props.statementcode : null
            },
            sort: {},
            loading: false,
            statementcode: (props.statementcode) ? props.statementcode : '',
            statementname: (props.statementname) ? props.statementname : '',
            statementtype: (props.statementtype) ? props.statementtype : '',
            channelname: (props.channelname) ? props.channelname : '',
            channelid: (props.channelid) ? props.channelid : null
        };
    }

    componentDidMount() {
        document.title = "Manage Statament Text | Loyalty Management System";
        this.getList();
    }

    getList() {
        const { criteria, sort } = this.state;
        let url = api.url.statementtext.list;
        let column = [];
        let paging = { page: this.state.current, limit: this.state.pageSize };

        this.setState({ loading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { paging } = response;
            if (response.status.responsecode.substring(0, 1) === '0') {
                let number = (paging.page - 1) * paging.limit;
                let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                let totalrecord = response.paging.totalrecord;

                this.setState({ dataList, totalrecord, loading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    deleteData(statementtextcode) {
        let url = api.url.statementtext.delete;
        let data = { statementtextcode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleTableChange = (pagination, filters, sorter) => {
        let sort = {};
        if (sorter.field) { sort = { [sorter.field]: (sorter.order === 'ascend') ? 'asc' : 'desc' } }
        this.setState({ sort }, () => this.getList());
    }

    onPaginationChange = page => {
        this.setState({ current: page }, () => this.getList());
    };

    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let criteria = {};
            Object.keys(values).map(function (key, index) {
                return criteria[key] = (values[key] !== undefined && values[key]) ? "%" + values[key] + "%" : null;
            });
            this.setState({ criteria, current: 1, }, () => this.getList());
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const { dataList, loading, totalrecord, pageSize } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const { channelid, channelname, statementname, statementcode, statementtype } = this.state;

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={21}>
                        <Title level={3}>Channel {channelname}</Title>
                    </Col>
                    <Col xs={24} xl={3}>
                        <Button type="primary" url={{ pathname: '/statement/template-text/form', state: { statementcode, statementname, channelid, channelname, statementtype } }} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                    </Col>
                    <Divider />
                </Row>
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.statementtextcode} dataSource={dataList} size="middle" pagination={false} loading={loading} onChange={this.handleTableChange} >
                        <Column title="No" dataIndex="number" key="number" />
                        <Column title="Language Code" dataIndex="langcode" key="langcode" sorter={true} />
                        <Column title="Statement Text" dataIndex="statementtext" key="statementtext" sorter={true} render={(value, row) => value ? value.length > 15 ? value.substring(0, 15) + '...' : value : null} />
                        <Column title="Correction Text" dataIndex="correctiontext" key="correctiontext" sorter={true} render={(value, row) => value ? value.length > 15 ? value.substring(0, 15) + '...' : value : null} />
                        <ColumnGroup title="Statement Text">
                            <Column title="Fee Update" dataIndex="updatestatementtext" key="updatestatementtext" sorter={true} render={(value, row) => value ? value.length > 15 ? value.substring(0, 15) + '...' : value : null} />
                            <Column title="Cancel" dataIndex="cancelstatementtext" key="cancelstatementtext" sorter={true} render={(value, row) => value ? value.length > 15 ? value.substring(0, 15) + '...' : value : null} />
                            <Column title="Fee Cancel" dataIndex="cancelcorrectiontext" key="cancelcorrectiontext" sorter={true} render={(value, row) => value ? value.length > 15 ? value.substring(0, 15) + '...' : value : null} />
                        </ColumnGroup>
                        <Column
                            title="Action"
                            key="action"
                            render={(text, record) => (
                                <span>
                                    <Button url={{ pathname: '/statement/template-text/form/' + record.statementtextcode, state: { statementcode, statementname, channelid, channelname, statementtype } }} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                    <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(record.statementtextcode)} />
                                </span>
                            )}
                        />
                    </Table>
                </Row>
                <Row type="flex" justify="end">
                    <Pagination
                        total={totalrecord}
                        pageSize={pageSize}
                        onChange={this.onPaginationChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);