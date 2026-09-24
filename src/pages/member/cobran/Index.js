import React from 'react';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment'
import CobrandForm from './Form';
import CobrandApproval from './Approval';
import CobrandTerminate from './Terminate';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            visible: false,
            formType: null,
            membercobrandid: null
        }
    }

    componentDidMount() {
        document.title = "Member Cobrand | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (membercobrandid, formType) => {
        this.setState({ visible: true, membercobrandid, formType });
    };

    handleOk = () => {
        this.setState({ visible: false });
        this.componentTable.getList();
    }

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { isLoading, visible, formType, membercobrandid } = this.state;
        const { menucode, prefixmenuname, permission, tierid } = this.props;
        const memberid = this.props.match.params.ID;
        const configurationSearchForm = [
            { labeltext: "Application Date", datafield: "applicationdate", type: 'datepicker', placeholder: 'Tier Change Process', showDefaultSearch: true },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true },
            { labeltext: "Terminate Date", datafield: "terminatedate", type: 'datepicker', placeholder: 'Terminate Date', showDefaultSearch: false },
            { labeltext: "Status", datafield: "status", type: 'text', placeholder: 'Status', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.membercobrand.list,
            criteria: { memberid },
            columns: [
                {
                    type: 'html', title: 'Cobrand Code', dataIndex: 'cobrandcode', sorter: true,
                    render: (_value, row) => { return row.cobrandcode + " - " + row.cobrandname }
                },
                {
                    type: 'html', title: 'Application Date', dataIndex: 'applicationdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Terminated Date', dataIndex: 'terminatedate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (_value, row) => {
                        return (
                            <span>
                                {(!row.terminatebyfile && row.status === 'ACTIVE') ? <Button htmlType="button" size="small" label="Terminate" className="btn-warning" onClick={() => this.handleOpenModal(row.membercobrandid, 'terminate')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" /> : null}
                                {(row.status === 'PENDING_APPROVAL') ?
                                    <span>
                                        <Button htmlType="button" type="primary" size="small" label="Approve" onClick={() => this.handleOpenModal(row.membercobrandid, 'approve')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" />
                                        <Button htmlType="button" type="danger" size="small" label="Reject" onClick={() => this.handleOpenModal(row.membercobrandid, 'reject')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" />
                                    </span>
                                    : null}
                                {/* <Button htmlType="button" size="small" label="Edit" onClick={() => this.handleOpenModal(row.membercobrandid, 'edit')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" /> */}
                            </span>
                        )
                    }
                },
            ]
        };
        const titleBarModal = { enroll: 'Enroll Cobrand', edit: 'Detail Cobrand', approve: 'Approve Cobrand', reject: 'Reject Cobrand', terminate: 'Terminate Cobrand' }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Manage Cobrand</Title>
                    </Col>
                    <Col xs={24} xl={4} align="right">
                        <Button htmlType="button" type="primary" label="Add New" onClick={() => this.handleOpenModal('', 'enroll')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <Modal visible={visible} title={titleBarModal[formType]} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    {
                        (formType === 'enroll' || formType === 'edit') ?
                            <CobrandForm menucode={menucode} prefixmenuname={prefixmenuname} permission={permission} memberid={memberid} tierid={tierid} formType={formType} membercobrandid={membercobrandid} refreshHeader={this.props.refreshHeader} onClose={this.handleOk} /> :
                            (formType === 'approve' || formType === 'reject') ?
                                <CobrandApproval menucode={menucode} prefixmenuname={prefixmenuname} permission={permission} memberid={memberid} tierid={tierid} formType={formType} membercobrandid={membercobrandid} refreshHeader={this.props.refreshHeader} onClose={this.handleOk} /> :
                                (formType === 'terminate') ?
                                    <CobrandTerminate menucode={menucode} prefixmenuname={prefixmenuname} permission={permission} memberid={memberid} tierid={tierid} formType={formType} membercobrandid={membercobrandid} refreshHeader={this.props.refreshHeader} onClose={this.handleOk} /> : null
                    }
                </Modal>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);