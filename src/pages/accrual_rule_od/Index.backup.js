import React from 'react';
import { RetrieveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, Pagination, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Table, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Column } = Table;
const { Title } = Typography;

const configurationSearchForm = [
    { labeltext: "Rule Name", datafield: "odrulename", type: 'text', placeholder: 'Rule Name', showDefaultSearch: true },
    { labeltext: "Airline", datafield: "airlinecode", type: 'text', placeholder: 'Airline', showDefaultSearch: true },
    { labeltext: "Origin", datafield: "originairport", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
    { labeltext: "Destination", datafield: "destinationairport", type: 'text', placeholder: 'Destination', showDefaultSearch: true },
    { labeltext: "TPM", datafield: "tpm", type: 'text', placeholder: 'TPM', showDefaultSearch: false },
    { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
    { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            criteria: {},
            sort: {},
            loading: false
        };
    }

    componentDidMount() {
        document.title = "Manage Accrual Rule - Origin Destination | Loyalty Management System";
        this.getList();
    }

    getList() {
        const { criteria, sort } = this.state;
        let url = api.url.accrualruleod.list;
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

    deleteData(odruleid) {
        let url = api.url.accrualruleod.delete;
        let data = { odruleid };
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

    handleSearchForm = (criteria) => {
        this.setState({ criteria, current: 1, }, () => this.getList());
    }

    render() {
        const { dataList, loading, totalrecord, pageSize } = this.state;
        const { menucode, prefixmenuname } = this.props;

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Accrual Rule - Origin Destination</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/accrual-rule-od/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.odruleid} dataSource={dataList} size="middle" pagination={false} loading={loading} onChange={this.handleTableChange} >
                        <Column title="No" dataIndex="number" key="number" />
                        <Column title="Rule Name" dataIndex="odrulename" key="odrulename" sorter={true} />
                        <Column title="Airline" dataIndex="airlinecode" key="airlinecode" sorter={true} />
                        <Column title="Origin" dataIndex="originairport" key="originairport" sorter={true} />
                        <Column title="Destination" dataIndex="destinationairport" key="destinationairport" sorter={true} />
                        <Column title="TPM" dataIndex="tpm" key="tpm" sorter={true} />
                        <Column title="Start Date" dataIndex="startdate" key="startdate" render={(value) => moment(value).format('DD/MM/YYYY')} sorter={true} />
                        <Column title="End Date" dataIndex="enddate" key="enddate" render={(value) => moment(value).format('DD/MM/YYYY')} sorter={true} />
                        <Column
                            width="12%"
                            title="Action"
                            key="action"
                            render={(text, record) => (
                                <span>
                                    <Button url={'/accrual-rule-od/form/' + record.odruleid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                    <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(record.odruleid)} />
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