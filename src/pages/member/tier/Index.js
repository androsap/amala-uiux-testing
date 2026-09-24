import React from 'react';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import ManageTierForm from './Form';
import TierHistoryTable from './History';
import { getProfile } from '../../../utilities/AuthService';

const { Title } = Typography;
const optionsChangeProcess = [
    { value: 'UPGRADE', label: 'UPGRADE' },
    { value: 'MAINTAIN', label: 'MAINTAIN' },
    { value: 'DOWNGRADE', label: 'DOWNGRADE' }
];

const isBOD = getProfile().rolename === 'BOD';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            managetiertype: 'current',
            formType: '',
            fieldvalue: {
                membertier: null,
                membershiptype: null,
                tierdataselected: {}
            }
        }
    }

    componentDidMount() {
        document.title = "Member Tiers | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (managetiertype, membertierid, membershiptypeid, formType, row) => {
        const fieldvalue = { tierdataselected: row, membertier: membertierid, membershiptype: membershiptypeid };
        this.setState({ visible: true, managetiertype, fieldvalue, formType });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleOk = () => {
        this.setState({ visible: false },
            this.componentTable.getList(),
            this.props.refreshHeader());
    };

    render() {
        const { menucode, prefixmenuname, permission, membertierid, membershiptypeid } = this.props;
        const { visible, isLoading, managetiertype, fieldvalue, formType } = this.state;
        const { membertier, membershiptype, tierdataselected } = fieldvalue;
        const memberid = this.props.match.params.ID;

        const configurationTable = {
            url: api.url.membertier.list,
            criteria: { memberid, active: true },
            sort: { startdate: 'desc' },
            columnClassName: "nowrap",
            columns: [
                { type: 'field', title: (isBOD) ? 'Tier Change' : 'Code', dataIndex: 'tierchangeprocess', sorter: true },
                { type: 'field', title: 'Membership', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                (!isBOD) ? {
                    type: 'html', title: 'Tier Miles', dataIndex: 'totaltiermiles', sorter: true,
                    render: (value) => { return (value) ? value : value === null ? '-' : '0' }
                } : '',
                (!isBOD) ? {
                    type: 'html', title: 'Frequency', dataIndex: 'totalfrequency', sorter: true,
                    render: (value) => { return (value) ? value : value === null ? '-' : '0' }
                } : '',
                (!isBOD) ? {
                    type: 'html', title: 'Tier Renewal', dataIndex: 'tierrenewal', sorter: true,
                    render: (value) => { return (value) ? value : value === null ? '-' : '0' }
                } : '',
                (!isBOD) ? {
                    type: 'html', title: 'Frequency Renewal', dataIndex: 'frequencyrenewal', sorter: true,
                    render: (value) => { return (value) ? value : value === null ? '-' : '0' }
                } : '',
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (_value, row, index) => {
                        return (
                            <span>
                                {(isBOD) ? <Button htmlType="button" size="small" label={"Upgrade Tier"} className={{ hidden: moment(row.enddate) < moment(new Date()) }} menucode={menucode}
                                    prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal('manage', row.membertierid, row.membershiptypeid, 'manage')} /> : null}
                                {(permission && permission.usermenu["MBRTIER"] && permission.usermenu["MBRTIER"]["MBRTIER_BACK"]) ?
                                    <Button htmlType="button" size="small" label="Edit Tier" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="BACK"
                                        onClick={() => this.handleOpenModal('edit', row.membertierid, row.membershiptypeid, 'edit', row)} /> :
                                    <Button htmlType="button" size="small" label="View Detail" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS"
                                        onClick={() => this.handleOpenModal('manage', row.membertierid, row.membershiptypeid, 'detail')} />}
                                {(!isBOD && (permission && permission.usermenu["MBRTIER"] && permission.usermenu["MBRTIER"]["MBRTIER_UPDATE"])) ?
                                    <Button htmlType="button" size="small" label={"Manage Tier"} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"
                                        className={{ hidden: (moment() >= moment(row.startdate) && moment() <= (row.enddate)) ? false : (index === 0) ? false : true }}
                                        onClick={() => this.handleOpenModal('manage', row.membertierid, row.membershiptypeid, 'manage')} /> : null}
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Tier Change Process", datafield: "tierchangeprocess", type: 'select', placeholder: 'Tier Change Process', options: optionsChangeProcess, showDefaultSearch: true },
            { labeltext: "Membership Name", datafield: "membershipname", type: 'text', placeholder: 'Membership Name', showDefaultSearch: (window.innerWidth > 767) },
            { labeltext: "Tier Name", datafield: "tiername", type: 'text', placeholder: 'Tier Name', showDefaultSearch: (window.innerWidth > 767) },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false }
        ];

        const titleBarModal = { history: 'Tier History', manage: (isBOD) ? "Upgrade Tier" : "Manage Tier", detail: "View Detail", edit: 'Edit Tier' }
        return (
            <React.Fragment>
                <Modal visible={visible} title={titleBarModal[formType]} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={960} style={{marginTop: '-50px'}}>
                    {
                        (formType === 'history') ? <TierHistoryTable menucode={menucode} prefixmenuname={prefixmenuname} permission={permission} memberid={memberid} managetiertype={managetiertype} membertierid={membertierid} membershiptypeid={membershiptypeid} handleOk={this.handleOk} /> :
                            ((formType === 'manage') || (formType === 'detail') || (formType === 'edit')) ? <ManageTierForm menucode={menucode} prefixmenuname={prefixmenuname} permission={permission} memberid={memberid} managetiertype={managetiertype} membertierid={membertier} membershiptypeid={membershiptype} handleOk={this.handleOk} isBOD={isBOD} formType={formType} tierdataselected={tierdataselected} /> : null
                    }
                </Modal>
                <Row>
                    <Col xs={24} xl={18}>
                        <Title level={4}>Manage Tiers</Title>
                    </Col>
                    <Col xs={24} xl={6} align="right">
                        {
                            (!isBOD) ?
                                <span>
                                    <Button htmlType="button" size="default" label="Tier History" className="btn-custom-dark-blue" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" onClick={() => this.handleOpenModal('current', membertierid, membershiptypeid, 'history')} />
                                    {/* <Button htmlType="button" type="primary" size="default" label="Manage Tier" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal('current', membertierid, membershiptypeid, 'manage')} /> */}
                                </span>
                                : null
                        }
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