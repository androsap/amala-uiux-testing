import React from 'react';
import { Redirect } from 'react-router-dom';
import { api } from '../../../../../config/Services';
import { DetailRequest, RetrieveRequest } from '../../../../../utilities/RequestService';
import { Card, Row, Col, Typography, Form, Divider, Spin } from 'antd';
import { CheckboxBase, ErrorGeneral, Button, Alert } from '../../../../../components/Base/BaseComponent';
import { formatNumber, jsUcfirst } from '../../../../../utilities/Helpers';
import CeritificateDetails from '../../../../../components/Certificate/Air/CertificateDetails';
import moment from 'moment';

const { Title, Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            certificatedetails: {},
            activitydetails: {},
            activitydepartureselected: false,
            activityreturnselected: false,
            isSuccessSelect: false,
            categorycode: null
        };
    }

    getDetail = (certificateid) => {
        let url = api.url.redemptioncertificate.detail;
        let data = { certificateid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                const { categorycode, awardcode, awardname, awardtypename, issueddate, freeaward, bookingcode, redeemairactivity, returnstatus, ticketvaliditydate, ticketnumber, redeemusers } = result;

                let certificatedetails = {};
                let activitydetails = {};
                certificatedetails['certificateid'] = redeemusers['certificateid'];
                certificatedetails['awardcode'] = (awardcode !== undefined) ? awardcode : '-';
                certificatedetails['awardname'] = (awardname !== undefined) ? awardname : '-';
                certificatedetails['awardtype'] = (awardtypename !== undefined) ? awardtypename : '-';
                certificatedetails['totalprice'] = (redeemusers.certificateprice !== undefined) ? redeemusers.certificateprice : null;
                certificatedetails['issueddate'] = (issueddate !== undefined) ? moment(issueddate).format("DD/MM/YYYY") : '-';
                certificatedetails['freeaward'] = freeaward;
                certificatedetails['bookingcode'] = bookingcode;
                certificatedetails['ticketvaliditydate'] = ticketvaliditydate;
                // certificatedetails['ticketnumber'] = ticketnumber;
                certificatedetails['paidticketnumber'] = ticketnumber;
                certificatedetails['redeemusers'] = redeemusers;
                certificatedetails['ticketofficeuser'] = (redeemusers.ticketofficeuser !== undefined) ? redeemusers.ticketofficeuser : null;
                certificatedetails['partnername'] = (redeemusers['partner'] !== undefined) ? redeemusers['partner'] : null;
                certificatedetails['status'] = (redeemusers['status'] !== undefined) ? jsUcfirst(redeemusers['status'], "_") : '-';

                //define redeemairactivity
                let activitydeparture = {};
                let activityreturn = {};
                for (const field in redeemairactivity) {
                    if (redeemairactivity[field]['type'].toUpperCase() === 'DEPARTURE') {
                        activitydeparture = redeemairactivity[field];
                    } else {
                        activityreturn = redeemairactivity[field];
                    }
                }
                /* set ticket number */
                certificatedetails['ticketnumber'] = (activitydeparture.ticketnumber) ? activitydeparture.ticketnumber : null;

                activitydetails['flightdeparture'] = activitydeparture;
                activitydetails['flightdeparture']['airlinecode'] = activitydeparture.airline;
                activitydetails['flightdeparture']['compartmentcode'] = activitydeparture.compartment;
                activitydetails['flightdeparture']['bookingclasscode'] = activitydeparture.bookingclass;

                activitydetails['flightreturn'] = activityreturn;
                activitydetails['flightreturn']['airlinecode'] = (activityreturn.airline) ? activityreturn.airline : null;
                activitydetails['flightreturn']['compartmentcode'] = (activityreturn.compartment) ? activityreturn.compartment : null;
                activitydetails['flightreturn']['bookingclasscode'] = (activityreturn.bookingclass) ? activityreturn.bookingclass : null;
                activitydetails['roundtrip'] = returnstatus;

                RetrieveRequest(api.url.awardmaster.list, { awardcode }).then((response) => {
                    const { status, result } = response;
                    if ((result.length !== 0) && (status.responsecode === '0000')) {
                        certificatedetails['awardpricingby'] = result[0].pricingby;
                    } else Alert.information(`Can't retrieve award information`);
                })

                this.setState({ certificatedetails, activitydetails, categorycode, isLoading: false });
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
        });
    }

    componentDidMount() {
        let certificateid = this.props.match.params.certificateid;
        this.getDetail(certificateid);
        // this.setState({ pricedeprunpromo: pricedepr + discountamountdepr })
    }

    handleContinue = (e) => {
        e.preventDefault();
        this.setState({ isLoading: true });
        setTimeout(() => this.setState({ isSuccessSelect: true, isLoading: false }), 1000);
    }

    handleSelectActivity = (event, type) => {
        let selected = (event.target && event.target.checked) ? event.target.checked : false;

        if (type === 'departure') {
            this.setState({ activitydepartureselected: selected });
        } else if (type === 'return') {
            this.setState({ activityreturnselected: selected });
        }
    }

    render() {
        const { formrender, certificatedetails, activitydetails, isSuccessSelect, activitydepartureselected, activityreturnselected, categorycode, activitydeparture, activityreturn } = this.state;
        let promocodedepr = (activitydeparture && activitydeparture.promocode !== undefined) ? activitydeparture.promocode : null;
        let promonamedepr = (activitydeparture && activitydeparture.promoname !== undefined) ? activitydeparture.promoname : null;
        let pricedepr = (activitydeparture && activitydeparture.price !== undefined) ? activitydeparture.price : null;
        let discountamountdepr = (activitydeparture && activitydeparture.discountamount !== undefined) ? activitydeparture.discountamount : null;
        let promocoderetr = (activityreturn && activityreturn.promocode !== undefined) ? activityreturn.promocode : null;
        let promonameretr = (activityreturn && activityreturn.promoname !== undefined) ? activityreturn.promoname : null;
        let priceretr = (activityreturn && activityreturn.price !== undefined) ? activityreturn.price : null;
        let discountamountretr = (activityreturn && activityreturn.discountamount !== undefined) ? activityreturn.discountamount : null;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const memberprofile = this.props.profile;
        const memberid = this.props.match.params.ID;

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }

        if (isSuccessSelect) {
            const categorycode = (this.state.categorycode) ? this.state.categorycode.toLowerCase() : '';
            return (<Redirect to={{ pathname: this.props.match.url + '/' + categorycode, state: { certificatedetails, activitydepartureselected, activityreturnselected, activitydetails, memberprofile, categorycode } }} />);
        } else {
            const { roundtrip, flightdeparture, flightreturn } = activitydetails;
            let departureactivitydate = (flightdeparture && flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : '-';
            let departureairlinecode = (flightdeparture && flightdeparture.airline) ? flightdeparture.airline : '-';
            let departureflightnumber = (flightdeparture && flightdeparture.flightnumber) ? flightdeparture.flightnumber : '-';
            let departureorigin = (flightdeparture && flightdeparture.origin) ? flightdeparture.origin : '-';
            let departuredestination = (flightdeparture && flightdeparture.destination) ? flightdeparture.destination : '-';
            let departurecompartment = (flightdeparture && flightdeparture.compartment) ? flightdeparture.compartment : '-';
            let departurebookingclass = (flightdeparture && flightdeparture.bookingclass) ? flightdeparture.bookingclass : '-';
            let departurestatus = (flightdeparture && flightdeparture.status) ? flightdeparture.status : null;
            let departureselected = null;

            if (departurestatus === 'VOUCHER_ISSUED' || departurestatus === 'VOUCHER_UPDATED') {
                if ((flightdeparture && flightdeparture.activitydate) && (moment().diff(moment(flightdeparture.activitydate), 'days') < 1)) {
                    departureselected = <CheckboxBase form={this.props.form} datafield="departure" onChange={(e) => this.handleSelectActivity(e, 'departure')} />
                } else {
                    departureselected = <Text strong type="warning">Expired</Text>;
                }
            } else {
                if (departurestatus === 'VOUCHER_VOID') {
                    departureselected = <Text strong style={{ color: '#EA4335' }}>Void</Text>
                } else if (departurestatus === 'VOUCHER_REDEEM') {
                    departureselected = <Text strong style={{ color: '#34A853' }}>Redeemed</Text>
                }
            }

            let returnactivitydate = (flightreturn && flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : '-';
            let returnirlinecode = (flightreturn && flightreturn.airline) ? flightreturn.airline : '-';
            let returnflightnumber = (flightreturn && flightreturn.flightnumber) ? flightreturn.flightnumber : '-';
            let returnorigin = (flightreturn && flightreturn.origin) ? flightreturn.origin : '-';
            let returndestination = (flightreturn && flightreturn.destination) ? flightreturn.destination : '-';
            let returncompartment = (flightreturn && flightreturn.compartment) ? flightreturn.compartment : '-';
            let returnbookingclass = (flightreturn && flightreturn.bookingclass) ? flightreturn.bookingclass : '-';
            let returnstatus = (flightreturn && flightreturn.status) ? flightreturn.status : null;
            let returnselected = null;

            if (returnstatus === 'VOUCHER_ISSUED' || returnstatus === 'VOUCHER_UPDATED') {
                if ((flightreturn && flightreturn.activitydate) && (moment().diff(moment(flightreturn.activitydate), 'days') < 1)) {
                    returnselected = <CheckboxBase form={this.props.form} datafield="return" onChange={(e) => this.handleSelectActivity(e, 'return')} />
                } else {
                    returnselected = <Text strong type="warning">Expired</Text>;
                }
            } else {
                if (returnstatus === 'VOUCHER_VOID') {
                    returnselected = <Text strong style={{ color: '#EA4335' }}>Void</Text>
                } else if (returnstatus === 'VOUCHER_REDEEM') {
                    returnselected = <Text strong style={{ color: '#34A853' }}>Redeemed</Text>
                }
            }

            return (
                <Row>
                    <Title level={4}><Button url={'/member/form/' + memberid + '/certificate'} shape="circle" icon="left" /> Update Certificate</Title>
                    <Divider />
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout}>
                            {/* <div style={{ background: '#ECECEC', padding: '30px', marginBottom: '30px' }}> */}
                            <Row>
                                <CeritificateDetails categorycode={categorycode}  {...certificatedetails} />
                                <Card title="Activity Details" bordered={false} style={{ marginBottom: 10 }} className="card-shadow">
                                    <Row className="pricelist-flight-header">
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Flight </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={3}> Activity Date </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={3}> Airline / <br />Flight Number </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Origin - Destination </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Compartment /<br />Booking Class </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Status </Col>
                                    </Row>
                                    <Row className="pricelist-flight">
                                        <Col xs={24} sm={24} md={24} lg={3} xl={4}> Departure </Col>
                                        <Col xs={24} sm={24} md={24} lg={3} xl={3}> {departureactivitydate} </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={3}> {departureairlinecode} / {departureflightnumber} </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> {departureorigin} - {departuredestination} </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> {departurecompartment} / {departurebookingclass} </Col>
                                        <Col xs={24} sm={24} md={24} lg={3} xl={4}> {(departurestatus) ? jsUcfirst(departurestatus, "_") : '-'} </Col>
                                        <Col xs={24} sm={24} md={24} lg={3} xl={2}>
                                            {/* {
                                                (departurestatus === 'VOUCHER_ISSUED') ?
                                                    <CheckboxBase form={this.props.form} datafield="departure" onChange={(e) => this.handleSelectActivity(e, 'departure')} />
                                                    : (departurestatus === 'VOUCHER_VOID') ? <Text strong style={{ color: '#EA4335' }}>Void</Text>
                                                        : <Text strong style={{ color: '#34A853' }}>Redeemed</Text>
                                            } */}
                                            {departureselected}
                                        </Col>
                                    </Row>
                                    {
                                        (promocodedepr || promonamedepr) ?

                                            <Col style={{ textAlign: "left", marginLeft: 30, marginTop: 10 }}>
                                                <Col style={{ marginBottom: 5 }}>
                                                    <span> Promo Code : </span>
                                                    <span >{promocodedepr} - {promonamedepr}</span>
                                                </Col>
                                                <Col style={{ marginBottom: 5 }}>
                                                    <span> Price Before Discount : </span>
                                                    <span >{discountamountdepr ? formatNumber(pricedepr + discountamountdepr) : null}</span>
                                                </Col>
                                                <Col style={{ marginBottom: 5 }}>
                                                    <span> Discount Amount : </span>
                                                    <span >{discountamountdepr ? formatNumber(discountamountdepr) : null}</span>
                                                </Col>
                                            </Col> : null
                                    }
                                    {/* <Row style={{ margin: 3 }}>Promo Code&emsp;&emsp;&emsp;&emsp;&emsp;:&nbsp;  {activitydeparture ? activitydeparture.promocode + ' - ' + activitydeparture.promoname : null} </Row>
                                    <Row style={{ margin: 3 }}>Price Before Discount&emsp;:&nbsp; {activitydeparture ? formatNumber(activitydeparture.price + activitydeparture.discountamount) : null}</Row>
                                    <Row style={{ margin: 3 }}>Discount Amount&emsp;&emsp;&nbsp; :&nbsp; {activitydeparture ? formatNumber(activitydeparture.discountamount) : null}</Row> */}
                                    <Row className={(roundtrip) ? "pricelist-flight" : "hidden"}>
                                        <Col xs={24} sm={24} md={24} lg={3} xl={4}> Return </Col>
                                        <Col xs={24} sm={24} md={24} lg={3} xl={3}> {returnactivitydate} </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={3}> {returnirlinecode} / {returnflightnumber} </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> {returnorigin} - {returndestination} </Col>
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> {returncompartment} / {returnbookingclass} </Col>
                                        <Col xs={24} sm={24} md={24} lg={3} xl={4}> {(returnstatus) ? jsUcfirst(returnstatus, "_") : '-'} </Col>
                                        <Col xs={24} sm={24} md={24} lg={3} xl={2}>
                                            {returnselected}
                                            {/* {
                                                (returnstatus === 'VOUCHER_ISSUED') ?
                                                    <CheckboxBase form={this.props.form} datafield="return" onChange={(e) => this.handleSelectActivity(e, 'return')} />
                                                    : (returnstatus === 'VOUCHER_VOID') ? <Text strong style={{ color: '#EA4335' }}>Void</Text>
                                                        : <Text strong style={{ color: '#34A853' }}>Redeemed</Text>
                                            } */}
                                        </Col>
                                    </Row>
                                    {
                                        (promocoderetr || promonameretr) ?
                                            <Col style={{ textAlign: "left", marginLeft: 30, marginTop: 10 }}>
                                                <Col style={{ marginBottom: 5 }}>
                                                    <span> Promo Code : </span>
                                                    <span >{promocoderetr} - {promonameretr}</span>
                                                </Col>
                                                <Col style={{ marginBottom: 5 }}>
                                                    <span> Price Before Discount : </span>
                                                    <span >{formatNumber(priceretr + discountamountretr)}</span>
                                                </Col>
                                                <Col style={{ marginBottom: 5 }}>
                                                    <span> Discount Amount : </span>
                                                    <span >{formatNumber(discountamountretr)}</span>
                                                </Col>
                                            </Col> : null
                                    }
                                    {/* <fragment>
                                        {(activityreturn) ?
      <Row style={{ margin: 3 }}>Promo Code&emsp;&emsp;&emsp;&emsp;&emsp;:&nbsp;  {activityreturn ? activityreturn.promocode + ' - ' + activityreturn.promoname : null} </Row>
      <Row style={{ margin: 3 }}>Price Before Discount&emsp;:&nbsp; {activityreturn ? formatNumber(activityreturn.price + activityreturn.discountamount) : null}</Row>
      <Row style={{ margin: 3 }}>Discount Amount&emsp;&emsp;&nbsp; :&nbsp; {activityreturn ? formatNumber(activityreturn.discountamount) : null}</Row>
                                            : null
                                        }
                                    </fragment> */}

                                </Card>
                            </Row>
                            {/* </div> */}
                            <Row>
                                <Col style={{ textAlign: 'center' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Button htmlType="button" type="primary" onClick={(e) => this.handleContinue(e)} disabled={(!activitydepartureselected && !activityreturnselected)} label="Continue" />
                                    {/* <Button url={'/member/form/' + this.props.match.params.ID + '/certificate'} htmlType="link" type="default" label="Back" /> */}
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        }
    }
}


export default Form.create()(App);