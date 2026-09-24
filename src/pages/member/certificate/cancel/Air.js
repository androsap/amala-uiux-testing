import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Col, Row, Card, Checkbox, Form, Typography, Empty, Modal, Spin, Switch } from 'antd';
import { jsUcfirst } from '../../../../utilities/Helpers';
import { Button, SwitchButton, InputText, Alert } from '../../../../components/Base/BaseComponent';
import { getProfile } from '../../../../utilities/AuthService';
import moment from 'moment';

import CeritificateDetails from '../../../../components/Certificate/Air/CertificateDetails';
import ConfirmationPage from './Confirmation';

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
            useCancelFee: [null, null],
            showConfirmation: false,
            typeButton: null,
            fieldvalue: {
                summarydepartureflight: {},
                summaryreturnflight: {},
                roundtrip: false,
                newcertificateid: null
            }
        }
    };

    componentDidMount() {
        let { useCancelFee } = this.state;
        let { certificatedetails, redeemairactivity } = this.props;
        let { awardcode } = certificatedetails || {};
        let oneOfRedeem = redeemairactivity.filter(obj => obj.status === 'VOUCHER_REDEEM');

        redeemairactivity.map((val, i) => val.userefundfee = true);
        redeemairactivity.map((val, i) => {
            useCancelFee[i] = (moment().diff(moment(val.activitydate), 'days') < 1) && (oneOfRedeem.length === 0) &&
                (val.status === 'VOUCHER_ISSUED' || val.status === 'VOUCHER_PARTIAL_VOID' || val.status === 'VOUCHER_UPDATED' || val.status === 'VOUCHER_PARTIAL_UPDATED')
        });

        this.getFee(awardcode);
        this.setState({ redeemairactivity });
    };

    autoSelected(redeemairactivity) {
        let filterdActivity = redeemairactivity.filter(obj => obj.status === 'VOUCHER_ISSUED' && moment().diff(moment(obj.activitydate), 'days') < 1);
        let selectedActivities = [];
        for (const field in filterdActivity) {
            selectedActivities[field] = filterdActivity[field]['redeemairactivityid'] + '|SPLIT|' + filterdActivity[field]['price'] + '|SPLIT|' + filterdActivity[field]['type'];
        }
        this.setState({ selectedActivities });
    };

    getFee(awardcode) {
        this.setState({ isLoading: true });

        let url = api.url.awardmaster.retrievecancelupdate;
        let data = { awardcode };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
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
    };

    saveAction = (expiredawardmiles) => {
        const { certificatedetails } = this.props;
        const { selectedActivities, standardfee, typeButton, redeemairactivity, cancelfee, cancelunit } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const callback = () => {
                    this.setState({ isLoading: true });

                    let username = getProfile().username;
                    let memberid = this.props.match.params.ID;
                    let certificateid = this.props.match.params.certificateid;
                    let awardcode = this.props.certificatedetails.awardcode;
                    let certificateprice = this.props.certificatedetails.certificateprice;
                    let bookingcode = this.props.certificatedetails.bookingcode;
                    let trxdate = moment(new Date()).format('YYYY-MM-DD');
                    let standarfee = (input.standardfee) ? input.standardfee : false;
                    let price = (selectedActivities.length === 1) ? Number.parseInt(selectedActivities[0].split('|SPLIT|')[1], 0) : Number.parseInt(certificateprice, 0);
                    let canceltype = (selectedActivities.length > 1 || redeemairactivity.length === 1) ? 'ALL' : selectedActivities[0].split('|SPLIT|')[2];
                    let categorycode = this.props.categorycode;
                    let airactivityid = selectedActivities.map((obj) => obj.split('|SPLIT|')[0]);
                    let redeemairactivityid = [];

                    // if (certificatedetails.awardcode === 'FREEFLIGHT') {
                    for (var i = 0; i < airactivityid.length; i++) {
                        let refundfee = redeemairactivity.find((val) => val.redeemairactivityid === airactivityid[i]).userefundfee;
                        let flightfee = (redeemairactivity.find((val) => val.redeemairactivityid === airactivityid[i]).price);
                        let fee = 0;

                        if (refundfee) {
                            fee = ((cancelunit === 'PERCENTAGE') ? Number(Math.ceil(flightfee * (cancelfee / 100))) : Number(cancelfee));
                        };

                        redeemairactivityid.push({
                            fee, refundfee,
                            redeemairactivityid: airactivityid[i]
                        });
                    };
                    // } else redeemairactivityid = selectedActivities.map((obj) => obj.split('|SPLIT|')[0]);

                    let fee = (standardfee) ? Number(redeemairactivityid.reduce((total, val) => total + val.fee, 0)) : Number.parseInt(input.fee, 0);

                    setTimeout(() => {
                        let message = 'Data has been updated';
                        let url = (typeButton === 'CANCEL') ? api.url.redemptioncertificate.cancel : api.url.requestapproval.create;
                        let data = (typeButton === 'CANCEL') ? { username, trxdate, certificateid, memberid, awardcode, price, standarfee, fee, redeemairactivityid, canceltype } : {
                            referenceid: null, memberid: memberid, requesttype: 'CANCEL', requeststatus: 'NEW', approvalby: null, approvaldate: null, remark: null, reqdatas: {
                                url: 'redemption/transaction/v1.2/cancel', expiredawardmiles, username, trxdate, certificateid, memberid, awardcode, price, standarfee, fee, redeemairactivityid, canceltype, categorycode, bookingcode
                            }
                        };

                        SaveRequest(url, data).then((response) => {
                            const { responsecode, responsemessage } = response.status;
                            if (responsecode === '0000') {
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
                                            this.props.history.push('/member/form/' + this.props.match.params.ID + '/certificate/view/' + newcertificateid);
                                        } else this.props.history.push('/member/form/' + this.props.match.params.ID + '/certificate');
                                    } else this.props.history.push('/member/form/' + this.props.match.params.ID + '/certificate');
                                } else this.props.history.push('/member/form/' + this.props.match.params.ID + '/certificate');
                            } else {
                                if (responsecode === '9005' && responsemessage.includes('This Certificate is Waiting for Approval')) {
                                    Alert.information(responsemessage);
                                } else Alert.error(responsemessage);
                            }
                            this.setState({ isLoading: false });
                        })
                    }, 20)
                }
                callback();
                Modal.destroyAll();
            }
        });
    };

    handleStandardFee = (value) => {
        this.props.form.setFieldsValue({ fee: undefined });
        this.setState({ standardfee: value });
    };

    handleSelectActivity = (event, selected) => {
        let selectactivity = event.target.checked;
        let onSelected = selected + '_' + selectactivity;

        let tempSelected = [...this.state.selectedActivities];
        let getSelected = onSelected.split('_')[0];
        let getValue = tempSelected.indexOf(getSelected);

        if (onSelected.split('_')[1] === 'true') {
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
    };

    showConfirmation = (e, typeButton) => {
        e.preventDefault();
        let { selectedActivities, roundtrip, redeemairactivity } = this.state;

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
    };

    handleCancel = () => {
        this.setState({ showConfirmation: false });
    };

    handleShowNewCertificate = () => {
        const { newcertificateid } = this.state.fieldvalue;
        if (newcertificateid) {
            this.props.history.push('/member/form/' + this.props.match.params.ID + '/certificate/view/' + newcertificateid);
        } else {
            this.props.history.push('/member/form/' + this.props.match.params.ID + '/certificate');
        }
    };

    handleRefundFeeChange = (event, redeemairactivityid) => {
        let { redeemairactivity } = this.state;
        let filteredactivity = redeemairactivity.filter((val) => val.redeemairactivityid !== redeemairactivityid);
        let changeactivity = redeemairactivity.find((val) => val.redeemairactivityid === redeemairactivityid);
        changeactivity.userefundfee = event;
        filteredactivity.push(changeactivity);

        redeemairactivity = filteredactivity.sort(function (a, b) {
            return a.type.localeCompare(b.type)
        });

        this.setState({ redeemairactivity });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 12 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
        };

        const { certificatedetails, categorycode } = this.props;
        const { isLoading, standardfee, cancelunit, cancelfee, selectedActivities, selectactivity, standardfielddisabled, showConfirmation, typeButton, redeemairactivity, useCancelFee } = this.state;

        const memberid = this.props.match.params.ID;
        const certificateid = this.props.match.params.certificateid;

        var totalprice = (selectedActivities.length) ? (redeemairactivity.length > 1) ? (selectedActivities.length > 1) ? (parseInt(selectedActivities[0].split('|SPLIT|')[1], 0) + parseInt(selectedActivities[1].split('|SPLIT|')[1], 0)) : selectedActivities[0].split('|SPLIT|')[1] : selectedActivities[0].split('|SPLIT|')[1] : '0';
        var percentagefee = (redeemairactivity.length > 1) ? (selectedActivities.length > 1) ? Math.ceil(certificatedetails.certificateprice * cancelfee / 100) : Math.ceil(totalprice * cancelfee / 100) : Math.ceil(totalprice * cancelfee / 100);
        // var feeinfo = (selectedActivities.length) ? (selectedActivities.length > 1) ? '(Calculated from Certificate Price)' : '(Calculated from Total Price)' : '';
        var flightList = '';

        let canceltype = (selectedActivities.length > 1 || redeemairactivity.length === 1) ? 'ALL' : (selectedActivities[0]) ? selectedActivities[0].split('|SPLIT|')[2] : null;
        let feeinfo = null;
        if (canceltype === "ALL") {
            feeinfo = '(Calculated from Certificate Price)'
        } else if (canceltype === "DEPARTURE") {
            feeinfo = '(Calculated from Departure Price)'
        } else if (canceltype === "RETURN") {
            feeinfo = '(Calculated from Return Price)'
        } else '';

        /* tidak boleh melakukan cancel jika salah satu certificate telah berstatus redeem */
        let oneOfRedeem = redeemairactivity.filter(obj => obj.status === 'VOUCHER_REDEEM');
        let cancelLayout = (certificatedetails && certificatedetails.awardcode === 'FREEFLIGHT') && useCancelFee.find(value => value);

        if (redeemairactivity.length) {
            flightList = redeemairactivity.map((val, i) =>
                <Row className='pricelist-flight' key={i}>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}> {val.type} </Col>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}> {moment(val.activitydate).format('DD/MM/YYYY')} </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> {val.airline} / {val.flightnumber} </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> {val.origin} - {val.destination} </Col>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}> {(val.status) ? jsUcfirst(val.status, '_') : '-'} </Col>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}> {val.price} </Col>
                    {(cancelLayout) ? <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                        {(useCancelFee[i]) ? <Switch form={this.props.form} checkedChildren='Yes' unCheckedChildren='No' onChange={(e) => this.handleRefundFeeChange(e, val.redeemairactivityid)} defaultChecked={selectactivity} disabled /> : null}
                    </Col> : null}
                    {
                        (val.status === 'VOUCHER_ISSUED' || val.status === 'VOUCHER_PARTIAL_VOID' || val.status === 'VOUCHER_UPDATED' || val.status === 'VOUCHER_PARTIAL_UPDATED') ?
                            (moment().diff(moment(val.activitydate), 'days') < 1) ?
                                (oneOfRedeem.length === 0) ? <Col xs={24} sm={24} md={24} lg={2} xl={2}> <Checkbox form={this.props.form} onChange={(e) => this.handleSelectActivity(e, `${val['redeemairactivityid']}|SPLIT|${val['price']}|SPLIT|${val['type']}|SPLIT|`)} defaultChecked={selectactivity ? '' : 'checked'} /> </Col> : null
                                : <Col xs={24} sm={24} md={24} lg={4} xl={4}><Text strong type='warning'>Expired</Text> </Col>
                            : <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(val.status === 'VOUCHER_REDEEM') ? <Text code>REDEEMED</Text> : <Text code>CANCELED</Text>} </Col>
                    }
                </Row>
            );
        } else flightList = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No Activity Found</span>} />;

        return (
            <Form {...formItemLayout}>
                {
                    (showConfirmation) ?
                        <ConfirmationPage title={`Certificate ${jsUcfirst(typeButton)}${typeButton === 'CANCEL' ? 'lation' : ' Cancellation'}`} awardcategory='AIR' isLoading={isLoading}
                            certificateid={certificateid} memberid={memberid} typeButton={typeButton} cancelunit={cancelunit} percentagefee={percentagefee} cancelfee={cancelfee} feeinfo={feeinfo}
                            departureFlight={this.state.fieldvalue.summarydepartureflight} returnFligth={this.state.fieldvalue.summaryreturnflight} roundtrip={this.state.fieldvalue.roundtrip}
                            visible={showConfirmation} handleClose={this.handleCancel} onSubmit={(expiredawardmiles) => this.saveAction(expiredawardmiles)} redeemairactivity={redeemairactivity}
                            selectedActivities={selectedActivities} handleShowNewCertificate={this.handleShowNewCertificate} /> : null
                }
                <Spin spinning={isLoading}>
                    <CeritificateDetails categorycode={categorycode} {...this.props.certificatedetails} />
                    <Card title='Redemption Air Activity' bordered={false} className='card-shadow' style={{ marginBottom: 10 }}>
                        <Row className='pricelist-flight-header' style={{ display: (redeemairactivity.length) ? 'block' : 'none' }}>
                            <Col xs={24} sm={24} md={24} lg={3} xl={3}> Flight </Col>
                            <Col xs={24} sm={24} md={24} lg={3} xl={3}> Activity Date </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}> Airline /<br />Flight Number </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}> Origin - Destination </Col>
                            <Col xs={24} sm={24} md={24} lg={3} xl={3}> Status </Col>
                            <Col xs={24} sm={24} md={24} lg={3} xl={3}> Price<br />(Mileage) </Col>
                            <Col xs={24} sm={24} md={24} lg={2} xl={2} style={{ marginLeft: -7 }}> {(cancelLayout) ? <div>Refund<br />Fee </div> : ''}</Col>
                        </Row>
                        {flightList}
                        <Text type='danger'>{(oneOfRedeem.length !== 0) ? 'Can not cancel certificate, because activity already used' : (!selectedActivities.length) ? 'Please select at least one activity you want to cancel' : ''}</Text>
                    </Card>
                    <Card title='Cancellation Fee' bordered={false} className='card-shadow' style={{ marginBottom: 10 }}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={22} xl={22}>
                                <SwitchButton form={this.props.form} labeltext='Standard Fee' datafield='standardfee' onChange={this.handleStandardFee} disabled={true} defaultChecked />
                                {
                                    (standardfee) ? <Form.Item label='Fee'>
                                        <Title level={4} className='ant-form-text' id='totalstandardfee'>{(cancelunit === 'PERCENTAGE') ? percentagefee : cancelfee}</Title>
                                        <Text type='secondary'>{(cancelunit === 'PERCENTAGE') ? feeinfo : ''}</Text>
                                    </Form.Item> : <InputText labelCol={{ span: 12 }} wrapperCol={{ span: 4 }} form={this.props.form} labeltext='Fee' datafield='fee' validationrules={(standardfielddisabled) ? '' : ['required', 'pattern.number']} maxLength={6} disabled={standardfielddisabled} />
                                }
                            </Col>
                        </Row>
                    </Card>
                    <Col style={{ textAlign: 'center', marginTop: 15 }} xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Button className={(certificatedetails.status === 'VOUCHER_ISSUED' || certificatedetails.status === 'VOUCHER_PARTIAL_VOID' || certificatedetails.status === 'VOUCHER_UPDATED' || certificatedetails.status === 'VOUCHER_PARTIAL_UPDATED') ? '' : 'hidden'}
                            htmlType='button' type='primary' label='Confirm' style={{ marginRight: 10 }} disabled={(selectedActivities.length) ? false : true} menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'CANCEL'} onClick={(e) => this.showConfirmation(e, 'CANCEL')}></Button>
                        <Button className={(certificatedetails.status === 'VOUCHER_ISSUED' || certificatedetails.status === 'VOUCHER_PARTIAL_VOID' || certificatedetails.status === 'VOUCHER_UPDATED' || certificatedetails.status === 'VOUCHER_PARTIAL_UPDATED') ? '' : 'hidden'}
                            htmlType='button' type='primary' label='Request' style={{ marginLeft: 10 }} disabled={(selectedActivities.length) ? false : true} menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'REQCNCLE'} onClick={(e) => this.showConfirmation(e, 'REQUEST')}></Button>
                        {/* <Button url={'/member/form/' + memberid + '/certificate'} htmlType='link' type='default' label='Back' /> */}
                    </Col>
                </Spin>
            </Form>
        )
    };
}

export default Form.create()(Layout);
