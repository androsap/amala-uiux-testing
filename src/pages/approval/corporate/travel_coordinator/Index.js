import React from 'react';
import { api } from '../../../../config/Services';
import { Button, TableBase, SearchForm } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { ApprovalCorporateStatus } from '../../../../data';
import moment from 'moment/moment';

const { Title } = Typography;

class App extends React.Component {

    componentDidMount() {
        document.title = 'Manage Travel Coordinator List | Loyalty Management System';
    };

    handleSearchForm = (criteria) => {
        criteria.requesttype = 'TRAVEL_COORDINATOR';
        this.componentTable.handleSearchForm(criteria);
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: 'Request Date', datafield: 'createdDate', type: 'datepicker', placeholder: 'Request Date', showDefaultSearch: true },
            { labeltext: 'Corporate Cardnumber', datafield: 'corporatecardnumber', type: 'text', placeholder: 'Corporate Cardnumber', showDefaultSearch: true },
            { labeltext: 'Request By', datafield: 'requestedby', type: 'text', placeholder: 'Request By', showDefaultSearch: true },
            { labeltext: 'Status', datafield: 'requeststatus', type: 'select', placeholder: 'Status', showDefaultSearch: true, options: ApprovalCorporateStatus },
        ];
        let configurationTable = {
            url: api.url.approvalcorporate.retrieve,
            criteria: { requesttype: 'TRAVEL_COORDINATOR' },
            sort: { createdDate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Request Date', dataIndex: 'createdDate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD-MM-YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Corporate Cardnumber', dataIndex: 'corporatecardnumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Travel-co Type', dataIndex: 'reqdata.travelcoordinatortype', sorter: false,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Travel-co Cardnumber', dataIndex: 'reqdata.cardnumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Travel-co Name', dataIndex: 'reqdata.name', sorter: false,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Request By', dataIndex: 'requestedby', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'requeststatus', sorter: true,
                    render: (value, row, index) => {
                        return (value) ? ((value === 'APPROVE') ? 'APPROVED' : (value === 'REJECT') ? 'REJECTED' : 'NEW') : '-'
                    }
                },
                {
                    type: 'field', title: 'Approval By', dataIndex: 'approvalby', sorter: true,
                    render: (value, row, index) => { return (value && (row.requeststatus !== 'NEW')) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', align: 'center',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={`/approval-corporate-travelco/form/${row.requestid}`} size='small' label='View' type='primary' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                            </span>
                        )
                    }
                },
            ]
        };
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Travel Coordinator Approval</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
