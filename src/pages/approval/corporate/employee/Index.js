import React from 'react';
import { api } from '../../../../config/Services';
import { Button, TableBase, SearchForm, CheckboxBase } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { ApprovalCorporateStatus } from '../../../../data';
import moment from 'moment/moment';

const { Title } = Typography;

class App extends React.Component {

    componentDidMount() {
        document.title = 'Manage Employee Approval List | Loyalty Management System';
    };

    handleSearchForm = (criteria) => {
        criteria.requesttype = 'EMPLOYEE';
        this.componentTable.handleSearchForm(criteria);
    };

    handleAllEmployee = (event) => {
        let requeststatus = event = null ? null : (event.target.checked ? '' : 'NEW');
        let criteria = {
            requesttype: 'EMPLOYEE',
            requeststatus
        };

        this.componentTable.handleSearchForm(criteria);
    }

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
            criteria: {
                requesttype: 'EMPLOYEE',
                requeststatus: 'NEW'
            },
            sort: { createdDate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Request Date', dataIndex: 'createdDate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format("DD/MM/YYYY") : '-' }
                },
                {
                    type: 'field', title: 'Corporate Cardnumber', dataIndex: 'corporatecardnumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Corporate Name', dataIndex: 'corporatename', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Employee Cardnumber', dataIndex: 'reqdata.cardnumber', sorter: true,
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
                                <Button url={`/approval-corporate-employee/form/${row.requestid}`} size='small' label='View' type='primary' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                            </span>
                        )
                    }
                },
            ]
        };
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={3}>Employee Approval</Title>
                    </Col>
                    <Col xs={24} xl={4} style={{ textAlign: "right" }}>
                        <CheckboxBase form={this.props.form} datafield='showallemployee' onChange={this.handleAllEmployee}> Show All Employee</CheckboxBase>
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