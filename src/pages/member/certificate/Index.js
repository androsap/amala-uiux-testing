import React from 'react';
import { Redirect } from 'react-router-dom';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin, Tabs, Tag } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import { getProfile } from '../../../utilities/AuthService';
import { DetailRequest } from '../../../utilities/RequestService';
import { MemberLockAlert } from '../../../components/Partials';
import moment from 'moment';

import MyApproval from '../../my_approval/Index';
import TicketNumberForm from '../certificate/TicketNumber';

const menucode = "CERTIF";
const prefixmenuname = "CERTIF";

const { Title } = Typography;
const { TabPane } = Tabs;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addticketnumber: false,
            path: null,
            isLoadingTicketNumber: false,
            fieldvalue: {
                certificateid: null,
                cardnumber: null,
                name: null,
                familyname: null
            }
        }
    }

    componentDidMount() {
        document.title = "Manage Certificate | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleValidation = (path) => {
        let username = getProfile().username;
        let data = { username };
        let url = api.url.redemptioncertificate.getemptyticketnumber;
        this.setState({ isLoadingTicketNumber: true });
        /* check ticket number empty */
        DetailRequest(url, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                const { result } = response;
                if (result.length > 0) {
                    const certificateid = (result && result[0]) ? result[0] : null;
                    let url = api.url.redemptioncertificate.detail;
                    let data = { certificateid };
                    //call loader
                    /* get data cardnumber & name from service detail certificate */
                    DetailRequest(url, data).then((response) => {
                        let { status, result } = response;
                        if (status.responsecode.substring(0, 1) === '0' && result) {
                            const cardnumber = (result && result['redeemusers'] && result['redeemusers']['memberiduser']) ? result['redeemusers']['memberiduser'] : null;
                            const name = (result && result['redeemusers'] && result['redeemusers']['name']) ? result['redeemusers']['name'] : null;
                            const familyname = (result && result['redeemusers'] && result['redeemusers']['familyname']) ? result['redeemusers']['familyname'] : null;

                            const fieldvalue = { ...this.state.fieldvalue, certificateid, cardnumber, name, familyname };

                            this.setState({ addticketnumber: true, isLoadingTicketNumber: false, fieldvalue });
                        } else {
                            Alert.error(response.status.responsemessage);
                            this.setState({ isLoadingTicketNumber: false });
                        }
                    });
                } else {
                    this.setState({ addticketnumber: false, path, isLoadingTicketNumber: false });
                }
            } else {
                Alert.error(response.status.responsemessage);
                this.setState({ isLoadingTicketNumber: false });
            }
        });
    }

    handleCancel = () => {
        this.setState({ addticketnumber: false, path: null });
    }

    render() {
        const memberid = this.props.match.params.ID;
        const { isLoadingTicketNumber, addticketnumber, fieldvalue } = this.state;
        const { memberlock, usermenu, match } = this.props;
        const { blockredeem } = memberlock || {};

        const defaultValueTab = (this.props.location.state && this.props.location.state.fromCertif) ? '2' : '1';
        const status = this.props.profile.status;

        const configurationTable = {
            url: api.url.redemptioncertificate.list,
            criteria: { memberid },
            sort: { createddate: 'desc' },
            expandedRowRender: (row) => {
                return (
                    <Row>
                        <Col md={6} className={(row.awardcategory === 'AIR') ? '' : 'hidden'}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Route Departure : {(row.awardcategory === 'AIR' && row.departureorigin && row.departuredestination) ? row.departureorigin + ' - ' + row.departuredestination : '-'}</p>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Route Return : {(row.awardcategory === 'AIR' && row.returnorigin && row.returndestination) ? row.returnorigin + ' - ' + row.returndestination : '-'}</p>
                        </Col>
                        <Col md={6} className={(row.awardcategory === 'AIR') ? '' : 'hidden'}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Departure Date : {(row.departureactivitydate) ? moment(row.departureactivitydate).format('DD/MM/YYYY') : '-'}</p>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Return Date : {(row.returnactivitydate) ? moment(row.returnactivitydate).format('DD/MM/YYYY') : '-'}</p>
                        </Col>
                        <Col md={6} className={(row.awardcategory === 'AIR') ? '' : 'hidden'}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Departure Compartment : {(row.departurecompartment) ? row.departurecompartment : '-'}</p>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Return Compartment : {(row.returncompartment) ? row.returncompartment : '-'}</p>
                        </Col>
                        <Col md={6}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Start Validity Date : {(row.startvaliditydate) ? moment(row.startvaliditydate).format('DD/MM/YYYY') : '-'}</p>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>End Validity Date : {(row.endvaliditydate) ? moment(row.endvaliditydate).format('DD/MM/YYYY') : '-'}</p>
                        </Col>
                        {
                            (row.certificatetext) ?
                                <Col md={24} style={{ marginTop: '10px' }}>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#000', fontStyle: 'italic' }}> {row.certificatetext} </p>
                                </Col> : null
                        }
                    </Row>
                )
            },
            columns: [
                {
                    type: 'html', title: 'Issued Date', dataIndex: 'createdDate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Partner', dataIndex: 'partner', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Award Name', dataIndex: 'awardname', sorter: true, width: 125 },
                {
                    type: 'html', title: 'Certificate ID', dataIndex: 'certificateid', sorter: true, width: 225,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row) => {
                        const color = (value === 'VOUCHER_ISSUED' || value === 'VOUCHER_CREATED') ? 'green' : (value === 'VOUCHER_PARTIAL_VOID') ? 'volcano' : (value === 'VOUCHER_VOID') ? 'red' : 'geekblue';

                        return (value) ? (row.awardcode === 'FREEFLIGHT' || row.awardcode === 'UPGRADE') ?
                            <Tag color={color}>{jsUcfirst(value, "_")}</Tag> : jsUcfirst(value, "_") : '-'
                    }
                },
                {
                    type: 'html', title: 'Certificate Price', dataIndex: 'certificateprice', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Ticket Office User', dataIndex: 'ticketofficeuser', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: 115,
                    render: (_value, row) => {
                        const updateStatus = (row.status === 'VOUCHER_ISSUED') || (row.status === 'VOUCHER_UPDATED') || (row.status === 'VOUCHER_PARTIAL_UPDATED') || (row.status === 'VOUCHER_PARTIAL_VOID');
                        const cancelStatus = (row.status === 'VOUCHER_ISSUED') || (row.status === 'VOUCHER_UPDATED') || (row.status === 'VOUCHER_PARTIAL_UPDATED') || (row.status === 'VOUCHER_PARTIAL_VOID');

                        return (
                            <span>
                                <Button url={'/member/form/' + row.memberid + '/certificate/view/' + row.certificateid} size="small" title="View" icon="eye" />
                                {/* {(row.canupdated && row.status === 'VOUCHER_ISSUED' && row.awardcategory === 'AIR') ? <Button url={'/member/form/' + row.memberid + '/certificate/update/' + row.certificateid} size="small" type="primary" title="Edit" icon="edit" /> : null} */}
                                {
                                    ((match.path.split("/")[1] === 'member-corporate') && updateStatus && row.canupdated && row.awardcategory === 'AIR' && !blockredeem && (status === 'ACTIVE' || status === 'TEST' || status === 'SUSPECTDUPLICATE')) ?
                                        <Button htmlType="button" onClick={() => this.handleValidation('/member-corporate/form/' + row.memberid + '/certificate/update/' + row.certificateid)} size="small" type="primary" title="Edit" icon="edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" /> :
                                        ((match.path.split("/")[1] === 'member') && (usermenu["CERTIF"]["CERTIF_UPDATE"] || (!usermenu["CERTIF"]["CERTIF_UPDATE"] && usermenu["CERTIF"]["CERTIF_REQUPDTE"])) && updateStatus && row.canupdated && row.awardcategory === 'AIR' && !blockredeem && (status === 'ACTIVE' || status === 'TEST' || status === 'SUSPECTDUPLICATE')) ?
                                            <Button htmlType="button" onClick={() => this.handleValidation('/member/form/' + row.memberid + '/certificate/update/' + row.certificateid)} size="small" type="primary" title="Edit" icon="edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" /> : null
                                }
                                {
                                    ((match.path.split("/")[1] === 'member-corporate') && cancelStatus && row.cancanceled && !blockredeem && (status === 'ACTIVE' || status === 'TEST' || status === 'SUSPECTDUPLICATE')) ?
                                        <Button htmlType="button" onClick={() => this.handleValidation('/member-corporate/form/' + row.memberid + '/certificate/cancel/' + row.certificateid)} size="small" type="danger" title="Cancel" icon="close-circle" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" /> :
                                        ((match.path.split("/")[1] === 'member') && (usermenu["CERTIF"]["CERTIF_CANCEL"] || (!usermenu["CERTIF"]["CERTIF_CANCEL"] && usermenu["CERTIF"]["CERTIF_REQCNCLE"])) && cancelStatus && row.cancanceled && !blockredeem && (status === 'ACTIVE' || status === 'TEST' || status === 'SUSPECTDUPLICATE')) ?
                                            <Button htmlType="button" onClick={() => this.handleValidation('/member/form/' + row.memberid + '/certificate/cancel/' + row.certificateid)} size="small" type="danger" title="Cancel" icon="close-circle" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" /> : null
                                    // <Button htmlType="button" onClick={() => this.handleValidation('/member/form/' + row.memberid + '/certificate/cancel/' + row.certificateid)} size="small" type="danger" title="Cancel" icon="close-circle" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CANCEL" /> : null
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Award Name", datafield: "awardname", type: 'text', placeholder: 'Award Name', showDefaultSearch: true },
            { labeltext: "Partner", datafield: "partner", type: 'text', placeholder: 'Partner', showDefaultSearch: true },
            { labeltext: "Certificate ID", datafield: "certificateid", type: 'text', placeholder: 'Certificate ID', showDefaultSearch: true },
            { labeltext: "Issued Date", datafield: "issueddate", type: 'datepicker', placeholder: 'Issued Date', showDefaultSearch: true }
        ];
        if (!addticketnumber && this.state.path) { return (<Redirect to={{ pathname: this.state.path }} />) }
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Member Certificate</Title>
                    </Col>
                    <Divider />
                    {(blockredeem) ? <MemberLockAlert memberlock={memberlock} /> : ''}
                </Row>
                <Spin spinning={isLoadingTicketNumber} tip="Please wait while checking the ticket number">
                    <TicketNumberForm {...fieldvalue} visible={addticketnumber} handleClose={this.handleCancel} />
                    <Tabs defaultActiveKey={defaultValueTab} style={{ marginTop: '-20px' }} onTabClick={this.handleTabCliked}>
                        <TabPane tab='Certificate' key='1'>
                            <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} style={{ padding: 2 }} />
                            <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                        </TabPane>
                        <TabPane tab='Cancel Request' key='2'>
                            <MyApproval {...this.props} memberCertif={true} certifMemberid={memberid} />
                        </TabPane>
                    </Tabs>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);