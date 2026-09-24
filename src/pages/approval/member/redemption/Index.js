import React from 'react';
import { api } from '../../../../config/Services';
import { Button, TableBase, SearchForm, Alert } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Empty, Tabs } from 'antd';
import moment from 'moment';
import { getProfile } from '../../../../utilities/AuthService';
import { RetrieveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { ApprovalStatus } from '../../../../data';

const { Title } = Typography;
const { TabPane } = Tabs;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            tab2clicked: false,
            tab2Search: false,
            isLoading: false,
            tickoffid: undefined,
            ignoretickoffid: undefined,
            ApprovalByData: [],
            IssuedByData: [],
            fielddisabled: {
                enddatedisabled: true
            }
        }
    }

    async componentDidMount() {
        const { pagetype } = this.props;
        document.title = `Manage Approval Redemption ${pagetype === 'cancel' ? 'Cancel' : pagetype === 'update' ? 'Update' : ''} | Loyalty Management System`;
        await this.getUser();
        await this.getIssuedBy();
        await this.getApprovalBy();
    }

    getUser = async () => {
        let username = getProfile().username;
        await RetrieveRequest(api.url.user.list, { username }).then((response) => {
            const { status, result } = response;
            const { responsecode } = status || {};
            if (responsecode === '0000') {
                const { ignoretickoffid, tickoffid } = result[0];
                this.setState({ tickoffid, ignoretickoffid: ignoretickoffid ? ignoretickoffid : false });
            }
        })
    };

    getIssuedBy = async () => {
        await DetailRequest(api.url.requestapproval.getissuedby, { issuedby: true }).then((response) => {
            const { status = {}, result } = response || {};
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                this.setState({ IssuedByData: result });
            } else {
                Alert.error(responsemessage);
            }
        });
    };

    getApprovalBy = async () => {
        await DetailRequest(api.url.requestapproval.getapprovalby, { approvalby: true }).then((response) => {
            const { status = {}, result } = response || {};
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                this.setState({ ApprovalByData: result });
            } else {
                Alert.error(responsemessage);
            }
        });
    };


    handleSearchForm = (criteria, type) => {
        const { startdate, enddate, requestid, approvaldate, approvalby, cardnumber, requeststatus, createddate, createdBy } = criteria;
        const { tab2clicked } = this.state;

        if (startdate === null && enddate === null && requestid === null && approvaldate === null && approvalby === null && cardnumber === null && requeststatus === null && createddate === null && createdBy === null && tab2clicked) {
            Alert.error('Please input one or more filter');
            this.setState({ tab2Search: false });
        } else {
            criteria.requesttype = this.props.pagetype ? this.props.pagetype : 'REDEMPTION';
            let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
            this.setState({ searching, tab2Search: (searching && type === 'tab2') ? true : false });
            this.props.form.validateFieldsAndScroll((err) => {
                if (!err) {
                    if (type === 'tab1') this.componentTable1.handleSearchForm(criteria);
                    if (type === 'tab2') this.componentTable2.handleSearchForm(criteria);
                }
            })
        }
    }

    handleTabCliked = (key) => {
        this.props.form.resetFields();
        let criteria = {};
        if (key === '1') {
            criteria.isdataactive = true;
            criteria.startdate = undefined;
            criteria.enddate = undefined;
            if (!this.state.ignoretickoffid) criteria.tickoffid = this.state.tickoffid;
            this.setState({ tab2clicked: false });
            this.componentTable1.handleSearchForm(criteria);
        }
        if (key === '2') {
            criteria.isdataactive = false;
            criteria.requesttype = 'GRADE';
            if (!this.state.ignoretickoffid) criteria.tickoffid = this.state.tickoffid;
            this.setState({ tab2clicked: true, searching: false, tab2Search: false });
            if (!this.props.form.getFieldValue('startdate')) setTimeout(() => { this.componentTable2.handleSearchForm(criteria) }, 1000)
        }
    }

    render() {
        const { menucode, prefixmenuname, location, pagetype } = this.props;
        const { searching, ApprovalByData, IssuedByData, tab2clicked, tickoffid, ignoretickoffid, tab2Search } = this.state;

        const startdate = this.props.form.getFieldValue('startdate');
        const enddate = this.props.form.getFieldValue('enddate');
        const approvaldatefrom = this.props.form.getFieldValue('approvaldatefrom');
        const approvaldateto = this.props.form.getFieldValue('approvaldateto');
        const ApprovalStatusOptions = (!tab2clicked ? ((pagetype !== 'update') ? [ApprovalStatus[0], ApprovalStatus[2]] : ApprovalStatus.slice(0, 3)) :
            ((pagetype !== 'update') ? [ApprovalStatus[3], ApprovalStatus[5]] : ApprovalStatus.slice(3, 6)));

        let configurationSearchForm = [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: 'Created Date From', datafield: 'startdate', type: 'datepicker', placeholder: 'Created Date From', showDefaultSearch: true, maxDate: (enddate ? enddate : '') },
            { labeltext: 'Created Date To', datafield: 'enddate', type: 'datepicker', placeholder: 'Created Date To', showDefaultSearch: true, defaultPickerValue: startdate, minDate: (startdate ? startdate : '') },
            { labeltext: 'Approval Date From', datafield: 'approvaldatefrom', type: 'datepicker', placeholder: 'Approval Date From', showDefaultSearch: false, maxDate: (approvaldatefrom ? approvaldatefrom : '') },
            { labeltext: 'Approval Date To', datafield: 'approvaldateto', type: 'datepicker', placeholder: 'Approval Date To', showDefaultSearch: false, minDate: (approvaldateto ? approvaldateto : '') },
            { labeltext: 'Request ID', datafield: 'requestid', type: 'text', placeholder: 'Request ID', showDefaultSearch: false },
            { labeltext: 'Approval By', datafield: 'approvalby', type: 'autocomplete', placeholder: 'Approval By', showDefaultSearch: false, dataSource: ApprovalByData },
            { labeltext: 'Approval Status', datafield: 'requeststatus', type: 'select', placeholder: 'Approval Status', showDefaultSearch: true, options: ApprovalStatusOptions },
            { labeltext: 'Issued By', datafield: 'createdBy', type: 'autocomplete', placeholder: 'Issued By', showDefaultSearch: false, dataSource: IssuedByData },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: false },
            { labeltext: 'Award Code', datafield: 'awardcode', type: 'text', placeholder: 'Award Code', showDefaultSearch: false },
        ];
        if (ignoretickoffid && !configurationSearchForm.find(o => o.datafield === 'tickoffid')) configurationSearchForm.push({ labeltext: 'Ticket Office', datafield: 'tickoffid', type: 'text', placeholder: 'Ticket Office', showDefaultSearch: false });

        const configurationTable = {
            url: api.url.requestapproval.list,
            criteria: ignoretickoffid ? { requesttype: pagetype === 'cancel' ? 'CANCEL' : pagetype === 'update' ? 'UPDATE' : 'REDEMPTION', isdataactive: !tab2clicked } :
                { requesttype: pagetype === 'cancel' ? 'CANCEL' : pagetype === 'update' ? 'UPDATE' : 'REDEMPTION', isdataactive: !tab2clicked, tickoffid },
            sort: { updateddate: 'desc' },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true },
                { type: 'field', title: 'Request ID', dataIndex: 'requestid', sorter: true },
                { type: 'field', title: 'Award Code', dataIndex: 'awardcode', sorter: true },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Approval Date', dataIndex: 'approvaldate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Approval by', dataIndex: 'approvalby', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Approval Status', dataIndex: 'requeststatus', sorter: true,
                    render: (value, row, index) => { return (value) ? value.replaceAll('_', ' ') : '-' }
                },
                {
                    type: 'field', title: 'Issued By', dataIndex: 'createdBy', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Ticket Office', dataIndex: 'tickoffid', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', fixed: 'right', align: 'center',
                    render: (_value, row) => {
                        return (<Button url={{ pathname: `${location.pathname}/form/${row.requestid}`, state: {} }} size='small' label='Detail' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />)
                    }
                }
            ]
        };
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={3}>{`Manage Approval Redemption ${pagetype === 'cancel' ? 'Cancel' : pagetype === 'update' ? 'Update' : ''}`}</Title>
                    </Col>
                    <Divider />
                </Row>
                <Tabs defaultActiveKey='1' style={{ marginTop: '-20px' }} onTabClick={this.handleTabCliked}>
                    <TabPane tab='Active Request' key='1'>
                        <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={value => this.handleSearchForm(value, 'tab1')} />
                        {ignoretickoffid === undefined && tickoffid === undefined ? '' : <TableBase ref={(e) => { this.componentTable1 = e }} configuration={configurationTable} />}
                    </TabPane>
                    <TabPane tab='Updated Request' key='2'>
                        <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={value => this.handleSearchForm(value, 'tab2')} />
                        {ignoretickoffid === undefined && tickoffid === undefined ? '' : <TableBase ref={(e) => { this.componentTable2 = e }} configuration={configurationTable} className={(searching && !tab2clicked) || tab2Search ? '' : 'hidden'} />}
                        <Title level={2} style={{ textAlign: 'center' }} className={(!searching && tab2clicked) || !tab2Search ? '' : 'hidden'}>Let's Find the Transaction</Title>
                        <Empty image='../assets/images/searching.svg' imageStyle={{ height: 200 }} description='' className={(!searching && tab2clicked) || !tab2Search ? '' : 'hidden'} />
                    </TabPane>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);