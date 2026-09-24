import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import { Button, TableBase, SearchForm, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';
import { ApprovalStatus, ApprovalTypeMyApproval } from '../../data';
import { getProfile } from '../../utilities/AuthService';

const { Title } = Typography;
const profile = getProfile().username;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ApprovalByData: []
        }
    }

    componentDidMount() {
        const memberCertif = this.props.memberCertif ? true : false;
        document.title = memberCertif ? 'Manage Certificate | Loyalty Management System' : 'Manage Approval List | Loyalty Management System';

        this.getApprovalBy();
        if (memberCertif) this.props.form.setFieldsValue({ requesttype: 'CANCEL' });
    };

    getApprovalBy = () => {
        DetailRequest(api.url.requestapproval.getapprovalby, { approvalby: true }).then((response) => {
            const { status = {}, result } = response || {};
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                this.setState({ ApprovalByData: result });
            } else {
                Alert.error(responsemessage);
            }
        });
    };

    handleSearchForm = (criteria) => {
        if (this.props.memberCertif) {
            criteria.memberid = this.props.match.params.ID;
        } else criteria.createdby = profile;
        this.componentTable.handleSearchForm(criteria);
    };

    handleCustomClear = async () => {
        await this.props.form.resetFields();
        await this.props.form.setFieldsValue({ requesttype: 'CANCEL' });
    };

    render() {
        const { menucode, prefixmenuname, memberCertif, certifMemberid } = this.props;
        const startdate = this.props.form.getFieldValue('startdate');
        const enddate = this.props.form.getFieldValue('enddate');
        const approvaldatefrom = this.props.form.getFieldValue('approvaldatefrom');
        const approvaldateto = this.props.form.getFieldValue('approvaldateto');
        const configurationSearchForm = [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: 'Created Date From', datafield: 'startdate', type: 'datepicker', placeholder: 'Created Date From', showDefaultSearch: true, maxDate: (enddate ? enddate : '') },
            { labeltext: 'Created Date To', datafield: 'enddate', type: 'datepicker', placeholder: 'Created Date To', showDefaultSearch: true, defaultPickerValue: startdate, minDate: (startdate ? startdate : '') },
            { labeltext: 'Approval Date From', datafield: 'approvaldatefrom', type: 'datepicker', placeholder: 'Approval Date From', showDefaultSearch: false, maxDate: (approvaldatefrom ? approvaldatefrom : '') },
            { labeltext: 'Approval Date To', datafield: 'approvaldateto', type: 'datepicker', placeholder: 'Approval Date To', showDefaultSearch: false, minDate: (approvaldateto ? approvaldateto : '') },
            { labeltext: 'Request ID', datafield: 'requestid', type: 'text', placeholder: 'Request ID', showDefaultSearch: false },
            { labeltext: 'Approval Type', datafield: 'requesttype', type: 'select', placeholder: 'Approval Type', showDefaultSearch: false, options: ApprovalTypeMyApproval, disabled: memberCertif ? true : false },
            { labeltext: 'Approval Status', datafield: 'requeststatus', type: 'select', placeholder: 'Approval Status', showDefaultSearch: true, options: ApprovalStatus },
            { labeltext: 'Award Code', datafield: 'awardcode', type: 'text', placeholder: 'Award Code', showDefaultSearch: false },
            { labeltext: 'Ticket Office', datafield: 'tickoffid', type: 'text', placeholder: 'Ticket Office', showDefaultSearch: false },
        ];
        let configurationTable = {
            url: api.url.requestapproval.list,
            sort: { updateddate: 'desc', requeststatus: 'asc' },
            criteria: memberCertif ? { memberid: `%${this.props.match.params.ID}%`, requesttype: 'CANCEL' } : {},
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true },
                {
                    type: 'field', title: 'Request ID', dataIndex: 'requestid', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Approval Type', dataIndex: 'requesttype', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Approval Date', dataIndex: 'approvaldate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Approval By', dataIndex: 'approvalby', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'field', title: 'Award Code', dataIndex: 'awardcode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Approval Status', dataIndex: 'requeststatus', sorter: true,
                    render: (value, row, index) => { return (value) ? value.replaceAll('_', ' ') : '-' }
                },
                {
                    type: 'field', title: 'Created Date', dataIndex: 'createdDate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Ticket Office', dataIndex: 'tickoffid', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                (!memberCertif) ? {
                    type: 'field', title: 'Payment Time Limit', dataIndex: 'paymenttimelimit', sorter: true,
                    render: (value, row, index) => { return (value) ? <strong style={{ color: 'red' }}>{moment(value).format("DD/MM/YYYY HH:mm:ss")}</strong> : '-' }
                } : {},
                {
                    type: 'html', title: 'Action', dataIndex: 'action', align: 'center',
                    render: (value, row, index) => {
                        return (
                            <span>
                                {row.requeststatus === 'REVISE' && row.requesttype !== 'CANCEL' ?
                                    <Button url={memberCertif ? `/member/form/${certifMemberid}/certificate/my-approval/form/${row.requestid}` : `/my-approval/form/${row.requestid}`} type='primary' size='small' label='Edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' /> :
                                    <Button url={memberCertif ? `/member/form/${certifMemberid}/certificate/my-approval/form/${row.requestid}` : `/my-approval/form/${row.requestid}`} size='small' label='Detail' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />}
                            </span>
                        )
                    }
                },
            ]
        };
        if (memberCertif && configurationTable.columnClassName === undefined) configurationTable.columnClassName = 'nowrap';

        return (
            <React.Fragment>
                <Row className={memberCertif ? 'hidden' : ''}>
                    <Col xs={24} xl={22}>
                        <Title level={3}>My Approval List</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} memberCertif={memberCertif} handleCustomClear={this.handleCustomClear} style={{ padding: 2 }} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
