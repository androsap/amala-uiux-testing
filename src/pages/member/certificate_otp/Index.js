import React from 'react';
import { Redirect } from 'react-router-dom';
import { api } from '../../../config/Services';
import { Link } from 'react-router-dom';
import { Button, SearchForm, TableBase, Alert, InputOTP } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin, Modal, Tabs, Statistic } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import { getProfile } from '../../../utilities/AuthService';
import { DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import moment from 'moment';

import MyApproval from '../../my_approval/Index';
import TicketNumberForm from '../certificate_otp/TicketNumber';

const { Countdown } = Statistic;

const menucode = "CERTIF";
const prefixmenuname = "CERTIF";

const { confirm } = Modal;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addticketnumber: false,
            path: null,
            isLoadingTicketNumber: false,
            otpvalue: false,
            validate: false,
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
        this.props.retrieveSession();
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

    generateOTP = (val, type) => {
        const callback = () => {
            let url = api.url.memberotp.generate;
            let memberid = this.props.match.params.ID;
            let transactiontype = 'REDEMPTION';
            let channel = 'BO';
            let data = { memberid, transactiontype, channel };
            let message = 'Generating OTP...';
            DetailRequest(url, data).then((response) => {
                const { status = {}, result } = response;
                const { expiredtime } = result ? result : '';
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    message = (responsemessage) ? responsemessage : message;
                    this.setState({ expiredtime })
                    this.props.retrieveTimeOTP();
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
            });
        }
        confirm({
            title: type === 'generateotp' ? 'Are you sure to generate OTP?' : 'Are you sure to resend OTP?',
            content: (
                <div>
                    <p style={{ color: 'red' }}>Note: This otp will be send to member email</p>
                </div>
            ),
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    handleOTP = (value, type) => {
        if (type === 'verifyotp') {
            this.setState({ isLoading: true });
            const memberid = this.props.match.params.ID;
            const { otpvalue } = this.state;

            DetailRequest(api.url.memberotp.verification, { memberid, transactiontype: 'REDEMPTION', otpcode: Number(otpvalue) }).then((response) => {
                const { status, result } = response;
                const { responsecode, responsemessage } = status || {};
                const { transactiontype, verificationstatus } = result ? result : '';
                if (responsecode === '0000') {
                    let message = (responsemessage) ? responsemessage : '';
                    this.setState({ transactiontype, verificationstatus })
                    this.props.retrieveSession();
                    this.props.retrieveTimeOTP();
                    Alert.success(message);
                } else Alert.error(responsemessage);
                this.setState({ isLoading: false });
            });
        } else this.setState({ otpvalue: value })
    };

    finishOTPTime = () => {
        this.props.refreshHeader();
    };

    checkOTP = () => {
        this.props.retrieveSession();
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        const memberid = this.props.match.params.ID;
        const { usermenu, validate, countdown, validate2, countdown2, otpsessionid } = this.props;
        const { isLoadingTicketNumber, addticketnumber, fieldvalue, verificationstatus, otpvalue } = this.state;
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
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true, width: 125,
                    render: (value) => { return (value) ? jsUcfirst(value, "_") : '-' }
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
                    type: 'html', title: 'Action', dataIndex: 'action', width: 120,
                    render: (_value, row) => {
                        return (
                            <span>
                                <Button url={'/member/form/' + row.memberid + '/certificateotp/view/' + row.certificateid} size="small" title="View" icon="eye" />
                                {/* {(row.canupdated && row.status === 'VOUCHER_ISSUED' && row.awardcategory === 'AIR') ? <Button url={'/member/form/' + row.memberid + '/certificateotp/update/' + row.certificateid} size="small" type="primary" title="Edit" icon="edit" /> : null} */}
                                {
                                    ((usermenu["CERTIF"]["CERTIF_UPDATE"] || (!usermenu["CERTIF"]["CERTIF_UPDATE"] && usermenu["CERTIF"]["CERTIF_REQUPDTE"])) && row.canupdated && row.status === 'VOUCHER_ISSUED' && row.awardcategory === 'AIR' && (status === 'ACTIVE' || status === 'TEST' || status === 'SUSPECTDUPLICATE')) ?
                                        <Button htmlType="button" onClick={() => this.handleValidation('/member/form/' + row.memberid + '/certificateotp/update/' + row.certificateid)} size="small" type="primary" title="Edit" icon="edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" /> : null
                                }
                                {
                                    ((usermenu["CERTIF"]["CERTIF_CANCEL"] || (!usermenu["CERTIF"]["CERTIF_CANCEL"] && usermenu["CERTIF"]["CERTIF_REQCNCLE"])) && row.cancanceled && row.status === 'VOUCHER_ISSUED' && (status === 'ACTIVE' || status === 'TEST' || status === 'SUSPECTDUPLICATE')) ?
                                        <Button htmlType="button" onClick={() => this.handleValidation('/member/form/' + row.memberid + '/certificateotp/cancel/' + row.certificateid)} size="small" type="danger" title="Cancel" icon="close-circle" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" /> : null
                                }
                            </span>
                        )
                    }
                }
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
                {validate || validate2 ?
                    ''
                    :
                    <Form {...formItemLayout}>
                        <Row>
                            <Row gutter={24} type="flex" justify="center">
                                <Title level={2} style={{ textAlign: 'center', marginTop: 300 }} className={''}>This page need OTP Authentication, you can generate OTP code below</Title>
                            </Row>
                        </Row>
                        <br></br>
                        <Row gutter={24} type="flex" justify="center">
                            <Button htmlType="submit" type="primary" label="Generate OTP" actioncode="UPDATE" onClick={(val) => this.generateOTP(val, 'generateotp')}></Button>
                        </Row>
                    </Form>
                }
                {
                    otpsessionid || validate ?
                        <Row>
                            <Col xs={24} xl={20}>
                                <Title level={4}>Member Certificate</Title>
                            </Col>
                            <Col xs={24} xl={3} >
                                <p level={4} style={{ fontSize: '16px', textAlign: "right", color: 'black' }}>OTP Time Limit:&nbsp;</p>
                            </Col>
                            <Col xs={24} xl={1}>
                                <Countdown valueStyle={{ fontSize: '16px' }} value={countdown} format="mm:ss" onFinish={this.props.retrieveFinish} />
                            </Col>
                            <Divider />
                        </Row>
                        : ''
                }
                {
                    otpsessionid || validate ?
                        <Spin spinning={isLoadingTicketNumber} tip="Please wait while checking the ticket number">
                            <TicketNumberForm {...fieldvalue} visible={addticketnumber} handleClose={this.handleCancel} />
                            <Tabs defaultActiveKey={defaultValueTab} style={{ marginTop: '-20px' }} onTabClick={this.handleTabCliked}>
                                <TabPane tab='Certificate' key='1'>
                                    <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                                </TabPane>
                                <TabPane tab='Cancel Request' key='2'>
                                    <MyApproval {...this.props} memberCertif={true} certifMemberid={memberid} />
                                </TabPane>
                            </Tabs>
                        </Spin>
                        : ''
                }
                {
                    !otpsessionid && validate2 ?
                        <Form {...formItemLayout}>
                            <Row>
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 200 }}>
                                    <Title level={2}>Verification</Title>
                                </Row>
                                <Row gutter={24} type="flex" justify="center">
                                    <Text strong>Please wait until OTP member has been verified</Text>
                                </Row>
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 20 }}>
                                    <Countdown valueStyle={{ fontSize: '16px' }} value={countdown2} format="mm:ss" onFinish={this.finishOTPTime} />
                                    <Button htmlType='button' style={{ marginLeft: 20 }} type="default" shape="circle" icon="reload" size={'small'} onClick={() => this.checkOTP()} />
                                </Row>
                                {/* <InputOTP {...this.props} value={otpvalue} style={{ marginTop: 20 }} wrapperCol={{ span: 24 }} datafield='otp' numInputs={6} onChange={(val) => this.handleOTP(val, 'otpvalue')} /> */}
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 20 }}>
                                <Text strong>
                                    Didn't receive OTP Code ? <Link to='#' onClick={(val) => this.generateOTP(val, 'resendotp')} style={{ cursor: 'pointer' }}>Click here</Link> to Resend
                                </Text>
                            </Row>
                            <br></br>
                            {/* <Row gutter={24} type="flex" justify="center">
                                <Button htmlType='button' type='primary' label='Verify' onClick={(val) => this.handleOTP(val, 'verifyotp')} />
                                <Button htmlType="submit" type="primary" label="Verify" actioncode="UPDATE"></Button>
                            </Row> */}
                        </Form>
                        : ""
                }
            </React.Fragment>
        );
    }
}

export default Form.create()(App);