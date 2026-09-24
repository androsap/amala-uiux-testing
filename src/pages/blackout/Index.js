import React from 'react';
import { RetrieveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button, Alert, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, notification, Typography } from 'antd';
import moment from 'moment';
const { Title } = Typography;

const optionsStatus = [
    { label: "Active", value: true },
    { label: "Incative", value: false }
]
const configurationSearchForm = [
    { labeltext: "Name", datafield: "name", type: 'text', placeholder: 'Name', showDefaultSearch: true },
    { labeltext: "Airline", datafield: "airlinecode", type: 'text', placeholder: 'Airline', showDefaultSearch: true },
    { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
    { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true },
    { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus }
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
        document.title = "Manage Blackout | Loyalty Management System";
    }

    getList() {
        const { criteria, sort } = this.state;
        let url = api.url.blackout.list;
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
                notification['error']({ message: 'Error Service', description: response.status.responsemessage, duration: null });
            }
        });
    }

    deleteData(blackoutid) {
        let url = api.url.blackout.delete;
        let data = { blackoutid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.blackout.list,
            columns: [
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Airline', dataIndex: 'airlinecode', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/blackout/form/' + row.blackoutid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.blackoutid)} />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Blackout</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/blackout/form/'} label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);