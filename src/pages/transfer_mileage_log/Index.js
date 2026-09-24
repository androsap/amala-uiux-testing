import React from 'react';
import { api } from '../../config/Services';
import { SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;

const optionsStatus = [
    { label: "IN QUEUE", value: "IN_QUEUE" },
    { label: "PROCESSED", value: "PROCESSED" },
    { label: "FAILED", value: "FAILED" },
    { label: "SUCCESS", value: "SUCCESS" }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Transfer Mileage Log | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const configurationSearchForm = [
            { labeltext: "Sender Card Number", datafield: "sendercardnumber", type: 'text', placeholder: 'Sender Card Number', showDefaultSearch: false },
            { labeltext: "Sender Name", datafield: "sendername", type: 'text', placeholder: 'Sender Name', showDefaultSearch: true },
            { labeltext: "Receiver Card Number", datafield: "receivercardnumber", type: 'text', placeholder: 'Receiver Card Number', showDefaultSearch: false },
            { labeltext: "Receiver Name", datafield: "receivername", type: 'text', placeholder: 'Receiver Name', showDefaultSearch: true },
            { labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: true },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false }
        ];
        const configurationTable = {
            url: api.url.membertransaction.mileagelog,
            sort: { startdate: 'desc'},
            columns: [
                
                { type: 'field', title: 'Sender Card Number', dataIndex: 'sendercardnumber', sorter: true },
                { type: 'field', title: 'Sender Name', dataIndex: 'sendername', sorter: true },
                { type: 'field', title: 'Receiver Card Number', dataIndex: 'receivercardnumber', sorter: true },
                { type: 'field', title: 'Receiver Name', dataIndex: 'receivername', sorter: true },
                { type: 'field', title: 'Custom Transaction', dataIndex: 'customtrxcode', sorter: true },
                { type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true },
                { type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true },
                { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                }
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Transfer Mileage Log</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);