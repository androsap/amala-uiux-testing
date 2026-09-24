import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    // componentDidMount() {
    //     document.title = "Manage File Management | Loyalty Management System";
    // }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { fileid, filetype } = this.props;
        const configurationSearchForm = [
            { labeltext: "FPP Number", datafield: "ffpnumber", type: 'text', placeholder: 'FPP Number', showDefaultSearch: true },
            { labeltext: "Marketing Carrier", datafield: "marketingcarrier", type: 'text', placeholder: 'Marketing Carrier', showDefaultSearch: true },
            { labeltext: "Operating Carrier", datafield: "operatingcarrier", type: 'text', placeholder: 'Operating Carrier', showDefaultSearch: true },
            { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
            { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.filedata.list,
            criteria: (filetype === 'BILLING_IN' || filetype === 'BILLING_OUT') ? { billingfile: fileid } :
                (filetype === 'ACCRUAL_IN' || filetype === 'ACCRUAL_OUT') ? { accrualfile: fileid } :
                    (filetype === 'HANDBACK_IN' || filetype === 'HANDBACK_OUT') ? { handbackfile: fileid } : {},
            columns: [
                { type: 'field', title: 'UIN', dataIndex: 'uin', sorter: true },
                { type: 'field', title: 'FPP Carrier Code', dataIndex: 'ffpcarriercode', sorter: true },
                {
                    type: 'field', title: 'Name', dataIndex: 'name', sorter: true,
                    render: (value, row, index) => { return row.firstname + ' ' + row.lastname }
                },
                { type: 'field', title: 'Marketing Carrier', dataIndex: 'marketingcarrier', sorter: true },
                { type: 'field', title: 'Operating Carrier', dataIndex: 'operatingcarrier', sorter: true },
                {
                    type: 'field', title: 'Departure Date', dataIndex: 'departuredate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'group', title: 'Route', childcolumns: [
                        { type: 'field', title: 'From', dataIndex: 'origin', sorter: true },
                        { type: 'field', title: 'To', dataIndex: 'destination', sorter: true }
                    ]
                },
                { type: 'field', title: 'Cabin Class Code', dataIndex: 'cabinclasscode', sorter: true },
                { type: 'field', title: 'Activity ID', dataIndex: 'activityid', sorter: true },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                { type: 'field', title: 'Remarks', dataIndex: 'remarks', sorter: true },
                { type: 'field', title: 'Accrual File', dataIndex: 'accrualfile', sorter: true },
                { type: 'field', title: 'Handback File', dataIndex: 'handbackfile', sorter: true },
                { type: 'field', title: 'Billing File', dataIndex: 'billingfile', sorter: true }
            ]
        };

        return (
            <React.Fragment>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);