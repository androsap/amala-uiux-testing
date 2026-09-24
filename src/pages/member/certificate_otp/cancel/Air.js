import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Col, Row, Card, Checkbox, Form, Typography, Empty, Modal, Spin } from 'antd';
import moment from 'moment';
import { Button, SwitchButton, InputText, Alert } from '../../../../components/Base/BaseComponent';
import { getProfile } from '../../../../utilities/AuthService';
import CeritificateDetails from '../../../../components/Certificate/Air/CertificateDetails';
import ConfirmationPage from './Confirmation';
import { jsUcfirst } from '../../../../utilities/Helpers';

const { Text, Title } = Typography;

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            standardfee: true,
            standardfielddisabled: false,
            cancelunit: null,
            cancelfee: null,
            certificateprice: null,
            selectactivity: true,
            redeemairactivity: [],
            selectedActivities: [],
            showConfirmation: false,
            typeButton: null,
            fieldvalue: {
                summarydepartureflight: {},
                summaryreturnflight: {},
                roundtrip: false,
                newcertificateid: null
            }
        }
    }

    componentDidMount() {
        /* tidak boleh melakukan cancel jika salah satu certificate telah berstatus redeem */
        let oneOfRedeem = this.props.redeemairactivity.filter(obj => obj.status === 'VOUCHER_REDEEM');
        if (oneOfRedeem.length === 0) {
            // this.autoSelected(this.props.redeemairactivity);
        }
        this.getFee(this.props.certificatedetails.awardcode);
    }

    autoSelected(redeemairactivity) {
        let filterdActivity = redeemairactivity.filter(obj => obj.status === 'VOUCHER_ISSUED' && moment().diff(moment(obj.activitydate), 'days') < 1);
        let selectedActivities = [];
        for (const field in filterdActivity) {
            selectedActivities[field] = filterdActivity[field]["redeemairactivityid"] + '|SPLIT|' + filterdActivity[field]["price"] + '|SPLIT|' + filterdActivity[field]["type"];
        }
        this.setState({ selectedActivities });
    }

    getFee(awardcode) {
        let url = api.url.awardmaster.retrievecancelupdate;
        let data = { awardcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                //call loader
                this.setState({
                    isLoading: false,
                    cancelunit: (result.cancelunit) ? result.cancelunit : null,
                    cancelfee: (result.cancelfee) ? result.cancelfee : '0'
                });
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    saveAction = (expiredawardmiles) => {
        const { selectedActivities, standardfee, typeButton } = this.state;
        const { redeemairactivity } = this.props;

        let redeemairactivityid = [];
        var key = 0;
        for (const field in redeemairactivity) {
            redeemairactivityid[key] = redeemairactivity[field].redeemairactivityid;
            key++;
        }

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const callback = () => {
                    this.setState({ isLoading: true });
                    //define parameter
                    let username = getProfile().username;
                    let memberid = this.props.match.params.ID;
                    let certificateid = this.props.match.params.certificateid;
                    let awardcode = this.props.certificatedetails.awardcode;
                    let certificateprice = this.props.certificatedetails.certificateprice;
                    let bookingcode = this.props.certificatedetails.bookingcode;
                    let trxdate = moment(new Date()).format('YYYY-MM-DD');
                    let standarfee = (input.standardfee) ? input.standardfee : false;
                    let fee = standardfee ? Number.parseInt(document.getElementById('totalstandardfee').innerText, 0) : Number.parseInt(input.fee, 0);
                    let price = (selectedActivities.length === 1) ? Number.parseInt(selectedActivities[0].split('|SPLIT|')[1], 0) : Number.parseInt(certificateprice, 0);
                    let canceltype = (selectedActivities.length > 1 || redeemairactivity.length === 1) ? 'ALL' : selectedActivities[0].split('|SPLIT|')[2];
                    let categorycode = this.props.categorycode;

                    let message = 'Data has been updated';
                    let url = (typeButton === 'CANCEL') ? api.url.redemptioncertificate.cancel : api.url.requestapproval.create;
                    let data = (typeButton === 'CANCEL') ? { username, trxdate, certificateid, memberid, awardcode, price, standarfee, fee, redeemairactivityid, canceltype } : {
                        referenceid: null, memberid: memberid, requesttype: "CANCEL", requeststatus: "NEW", approvalby: null, approvaldate: null, remark: null, reqdatas: {
                            url: 'redemption/transaction/v1.2/cancel', expiredawardmiles, username, trxdate, certificateid, memberid, awardcode, price, standarfee, fee, redeemairactivityid, canceltype, categorycode, bookingcode
                        }
                    };

                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);
                            this.props.refreshHeader();

                            //GET NEW CERTIFICATE ID
                            const { newcertificate } = response.result;
                            if (typeButton === 'CANCEL') {
                                if (newcertificate !== null) {
                                    const { redeemuser } = newcertificate;
                                    let newcertificateid = (redeemuser && redeemuser[0] && redeemuser[0]['certificateid']) ? redeemuser[0]['certificateid'] : null;
                                    if (newcertificateid) {
                                        this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp/view/' + newcertificateid);
                                    } else {
                                        this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp');
                                    }
                                } else {
                                    this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp');
                                }
                            } else {
                                this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp');
                            }
                        } else {
                            if (responsecode === '9005' && responsemessage.includes('This Certificate is Waiting for Approval')) {
                                Alert.information(responsemessage);
                            } else Alert.error(responsemessage);
                        }
                        //hide loader
                        this.setState({ isLoading: false });
                    })
                }

                callback();
                Modal.destroyAll();
            }
        });
    }

    handleStandardFee = (value) => {
        this.props.form.setFieldsValue({ fee: undefined });
        this.setState({ standardfee: value });
    }

    handleSelectActivity = (event, selected) => {
        let selectactivity = event.target.checked;
        let onSelected = selected + '_' + selectactivity;

        let tempSelected = [...this.state.selectedActivities];
        let getSelected = onSelected.split('_')[0];
        let getValue = tempSelected.indexOf(getSelected);

        if (onSelected.split('_')[1] === "true") {
            tempSelected.push(getSelected);
        } else {
            tempSelected.splice(getValue, 1);
        }

        // let standardfee = this.state.standardfee;
        let standardfielddisabled = false;
        if (tempSelected.length < 1 && this.props.redeemairactivity.length !== 1) {
            // standardfee = false;
            standardfielddisabled = true;
            // this.props.form.setFieldsValue({ standardfee, fee: undefined });
            this.props.form.setFieldsValue({ fee: undefined });
        }

        // this.setState({ selectedActivities: tempSelected, standardfee, standardfielddisabled });
        this.setState({ selectedActivities: tempSelected, standardfielddisabled });
    }


    showConfirmation = (e, typeButton) => {
        e.preventDefault();
        const { redeemairactivity } = this.props
        let { selectedActivities, roundtrip } = this.state;

        /* create summary for cancelation information */
        let summarydepartureflight = {};
        let summaryreturnflight = {};
        for (const field in selectedActivities) {
            if (selectedActivities[field]) {
                let redeemairactivityid = (selectedActivities[field].split('|SPLIT|').length > 0 && selectedActivities[field].split('|SPLIT|')[0]) ? selectedActivities[field].split('|SPLIT|')[0] : null;
                let flighttype = (selectedActivities[field].split('|SPLIT|').length > 0 && selectedActivities[field].split('|SPLIT|')[2]) ? selectedActivities[field].split('|SPLIT|')[2] : null;

                const airactivity = redeemairactivity.filter(obj => obj.redeemairactivityid === redeemairactivityid);
                const flightdate = (airactivity && airactivity[0] && airactivity[0]['activitydate']) ? airactivity[0]['activitydate'] : null;
                const airlinecode = (airactivity && airactivity[0] && airactivity[0]['airline']) ? airactivity[0]['airline'] : null;
                const flightnumber = (airactivity && airactivity[0] && airactivity[0]['flightnumber']) ? airactivity[0]['flightnumber'] : null;
                const origin = (airactivity && airactivity[0] && airactivity[0]['origin']) ? airactivity[0]['origin'] : null;
                const destination = (airactivity && airactivity[0] && airactivity[0]['destination']) ? airactivity[0]['destination'] : null;
                const compartmentcode = (airactivity && airactivity[0] && airactivity[0]['compartment']) ? airactivity[0]['compartment'] : null;
                const bookingclasscode = (airactivity && airactivity[0] && airactivity[0]['bookingclass']) ? airactivity[0]['bookingclass'] : null;
                const iscancelled = true;

                if (flighttype === 'DEPARTURE') {
                    summarydepartureflight = { flighttype, flightdate, airlinecode, flightnumber, origin, destination, compartmentcode, bookingclasscode, iscancelled };
                } else if (flighttype === 'RETURN') {
                    summaryreturnflight = { flighttype, flightdate, airlinecode, flightnumber, origin, destination, compartmentcode, bookingclasscode, iscancelled };
                    roundtrip = true;
                }
            }
        }

        const fieldvalue = { ...this.state.fieldvalue, roundtrip, summarydepartureflight, summaryreturnflight };
        this.setState({ showConfirmation: true, fieldvalue, typeButton });
    }

    handleCancel = () => {
        this.setState({ showConfirmation: false });
    }

    handleShowNewCertificate = () => {
        const { newcertificateid } = this.state.fieldvalue;
        if (newcertificateid) {
            this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp/view/' + newcertificateid);
        } else {
            this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp');
        }
    }

    render() {
        const { certificatedetails, redeemairactivity, categorycode } = this.props;
        const { isLoading, standardfee, cancelunit, cancelfee, selectedActivities, selectactivity, standardfielddisabled, showConfirmation, typeButton } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 12 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
        };
        const memberid = this.props.match.params.ID;
        const certificateid = this.props.match.params.certificateid;

        var totalprice = (selectedActivities.length) ? (redeemairactivity.length > 1) ? (selectedActivities.length > 1) ? (parseInt(selectedActivities[0].split('|SPLIT|')[1], 0) + parseInt(selectedActivities[1].split('|SPLIT|')[1], 0)) : selectedActivities[0].split('|SPLIT|')[1] : selectedActivities[0].split('|SPLIT|')[1] : '0';
        var percentagefee = (redeemairactivity.length > 1) ? (selectedActivities.length > 1) ? Math.ceil(certificatedetails.certificateprice * cancelfee / 100) : Math.ceil(totalprice * cancelfee / 100) : Math.ceil(totalprice * cancelfee / 100);
        // var feeinfo = (selectedActivities.length) ? (selectedActivities.length > 1) ? "(Calculated from Certificate Price)" : "(Calculated from Total Price)" : '';
        var flightList = '';

        var feeinfo = '';
        let canceltype = (selectedActivities.length > 1 || redeemairactivity.length === 1) ? 'ALL' : (selectedActivities[0]) ? selectedActivities[0].split('|SPLIT|')[2] : null;
        if (canceltype === 'ALL') {
            feeinfo = '(Calculated from Certificate Price)';
        } else if (canceltype === 'DEPARTURE') {
            feeinfo = '(Calculated from Departure Price)';
        } else if (canceltype === 'RETURN') {
            feeinfo = '(Calculated from Return Price)';
        }
        /* tidak boleh melakukan cancel jika salah satu certificate telah berstatus redeem */
        let oneOfRedeem = redeemairactivity.filter(obj => obj.status === 'VOUCHER_REDEEM');
        if (redeemairactivity.length) {
            flightList =
                redeemairactivity.map((val, i) =>
                    <Row className="pricelist-flight" key={i}>
                        <Col xs={24} sm={24} md={24} lg={3} xl={3}> {val.type} </Col>
                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {moment(val.activitydate).format('DD/MM/YYYY')} </Col>
                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> {val.airline} / {val.flightnumber} </Col>
                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {val.origin} - {val.destination} </Col>
                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {val.price} </Col>
                        <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                            {
                                (val.status === 'VOUCHER_ISSUED') ?
                                    (moment().diff(moment(val.activitydate), 'days') < 1) ?
                                        (oneOfRedeem.length === 0) ? <Checkbox form={this.props.form} onChange={(e) => this.handleSelectActivity(e, val['redeemairactivityid'] + '|SPLIT|' + val['price'] + '|SPLIT|' + val['type'])} defaultChecked={selectactivity ? "" : "checked"} /> : null
                                        : <Text strong type="warning">Expired</Text>
                                    : (val.status === 'VOUCHER_REDEEM') ? <Text code>REDEEMED</Text> : <Text code>CANCELED</Text>
                            }
                        </Col>
                    </Row>
                );
        } else {
            flightList = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No Activity Found</span>} />;
        }

        return (
            <Form {...formItemLayout} onSubmit={(e) => this.showConfirmation(e)}>
                {
                    (showConfirmation) ?
                        <ConfirmationPage title={`Certificate ${jsUcfirst(typeButton)}${typeButton === 'CANCEL' ? 'lation' : ' Cancellation'}`} awardcategory="AIR" isLoading={isLoading}
                            certificateid={certificateid} memberid={memberid} typeButton={typeButton}
                            departureFlight={this.state.fieldvalue.summarydepartureflight} returnFligth={this.state.fieldvalue.summaryreturnflight} roundtrip={this.state.fieldvalue.roundtrip}
                            visible={showConfirmation} handleClose={this.handleCancel} onSubmit={(expiredawardmiles) => this.saveAction(expiredawardmiles)}
                            handleShowNewCertificate={this.handleShowNewCertificate} /> : null
                }
                <Spin spinning={isLoading}>
                    <CeritificateDetails categorycode={categorycode} {...this.props.certificatedetails} fromCancel={true} />
                    <Card title="Redemption Air Activity" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                        <Row className="pricelist-flight-header" style={{ display: (redeemairactivity.length) ? 'block' : 'none' }}>
                            <Col xs={24} sm={24} md={24} lg={3} xl={3}> Flight </Col>
                            <Col xs={24} sm={24} md={24} lg={5} xl={5}> Activity Date </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}> Airline /<br />Flight Number </Col>
                            <Col xs={24} sm={24} md={24} lg={5} xl={5}> Origin - Destination </Col>
                            <Col xs={24} sm={24} md={24} lg={5} xl={5}> Price<br />(Mileage) </Col>
                        </Row>
                        {flightList}
                        <Text type="danger">{(oneOfRedeem.length !== 0) ? 'Can not cancel certificate, because activity already used' : (!selectedActivities.length) ? 'Please select at least one activity you want to cancel' : ''}</Text>
                    </Card>
                    <Card title="Cancellation Fee" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={22} xl={22}>
                                <SwitchButton form={this.props.form} labeltext="Standard Fee" datafield="standardfee" onChange={this.handleStandardFee} disabled={true} defaultChecked />
                                {
                                    (standardfee) ?
                                        <Form.Item label="Fee">
                                            <Title level={4} className="ant-form-text" id="totalstandardfee">{(cancelunit === 'PERCENTAGE') ? percentagefee : cancelfee}</Title>
                                            <Text type="secondary">{(cancelunit === 'PERCENTAGE') ? feeinfo : ''}</Text>
                                        </Form.Item>
                                        : <InputText labelCol={{ span: 12 }} wrapperCol={{ span: 4 }} form={this.props.form} labeltext="Fee" datafield="fee" validationrules={(standardfielddisabled) ? '' : ['required', 'pattern.number']} maxLength={6} disabled={standardfielddisabled} />
                                }
                            </Col>
                        </Row>
                    </Card>
                    <Col style={{ textAlign: 'center', marginTop: 15 }} xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Button htmlType="button" type="primary" label="Confirm" className={(certificatedetails.status === 'VOUCHER_ISSUED') ? '' : 'hidden'} style={{ marginRight: 10 }}
                            disabled={(selectedActivities.length) ? false : true} menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'CANCEL'} onClick={(e) => this.showConfirmation(e, 'CANCEL')}></Button>
                        <Button htmlType="button" type="primary" label="Request" className={(certificatedetails.status === 'VOUCHER_ISSUED') ? '' : 'hidden'} style={{ marginLeft: 10 }}
                            disabled={(selectedActivities.length) ? false : true} menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'REQCNCLE'} onClick={(e) => this.showConfirmation(e, 'REQUEST')}></Button>
                        {/* <Button url={"/member/form/" + memberid + "certificateotp"} htmlType="link" type="default" label="Back" /> */}
                    </Col>
                </Spin>
            </Form>
        )
    }
}

// export default Layout;
export default Form.create()(Layout);
