import React, { Component } from 'react';
import { Col, Row, Card, Typography, Tag } from 'antd';
import { formatNumber, jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

const { Text } = Typography;
class Layout extends Component {
    render() {
        const { roundtrip, flightdeparture, flightreturn, categorycode, source } = this.props;

        let departureactivitydate = (flightdeparture && flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format('DD/MM/YYYY') : '-';
        let departureairlinecode = (flightdeparture && flightdeparture.airlinecode) ? flightdeparture.airlinecode : '-';
        let departureflightnumber = (flightdeparture && flightdeparture.flightnumber) ? flightdeparture.flightnumber : '-';
        let departureorigin = (flightdeparture && flightdeparture.origin) ? flightdeparture.origin : '-';
        let departuredestination = (flightdeparture && flightdeparture.destination) ? flightdeparture.destination : '-';
        let departurecompartment = (flightdeparture && flightdeparture.compartment) ? flightdeparture.compartment : '-';
        let departurebookingclass = (flightdeparture && flightdeparture.bookingclass) ? flightdeparture.bookingclass : '-';
        let departureprice = (flightdeparture && flightdeparture.price !== undefined) ? flightdeparture.price : '-';
        let departurepaidcompartmentcode = (flightdeparture && flightdeparture.paidcompartmentcode !== undefined) ? flightdeparture.paidcompartmentcode : null;
        let departurepaidbookingclasscode = (flightdeparture && flightdeparture.paidbookingclasscode !== undefined) ? flightdeparture.paidbookingclasscode : null;
        let promocodedepr = (flightdeparture && flightdeparture.promocode !== undefined) ? flightdeparture.promocode : '-';
        let promonamedepr = (flightdeparture && flightdeparture.promoname !== undefined) ? flightdeparture.promoname : '-';
        let discountamountdepr = (flightdeparture && flightdeparture.discountamount !== undefined) ? flightdeparture.discountamount : '-';
        let statusdepr = (flightdeparture && flightdeparture.status !== undefined) ? jsUcfirst(flightdeparture.status, '_') : '-';
        let departureusecancelfee = (!flightdeparture) ? null : (flightdeparture.usecancelfee === undefined || flightdeparture.usecancelfee === null) ? null : (flightdeparture.usecancelfee) ? <Tag color='green'>Yes</Tag> : <Tag color='red'>No</Tag>;

        let returnactivitydate = (flightreturn && flightreturn.activitydate) ? moment(flightreturn.activitydate).format('DD/MM/YYYY') : '-';
        let returnirlinecode = (flightreturn && flightreturn.airlinecode) ? flightreturn.airlinecode : '-';
        let returnflightnumber = (flightreturn && flightreturn.flightnumber) ? flightreturn.flightnumber : '-';
        let returnorigin = (flightreturn && flightreturn.origin) ? flightreturn.origin : '-';
        let returndestination = (flightreturn && flightreturn.destination) ? flightreturn.destination : '-';
        let returncompartment = (flightreturn && flightreturn.compartment) ? flightreturn.compartment : '-';
        let returnbookingclass = (flightreturn && flightreturn.bookingclass) ? flightreturn.bookingclass : '-';
        let returnprice = (flightreturn && flightreturn.price !== undefined) ? flightreturn.price : '-';
        let returnpaidcompartmentcode = (flightreturn && flightreturn.paidcompartmentcode !== undefined) ? flightreturn.paidcompartmentcode : null;
        let returnpaidbookingclasscode = (flightreturn && flightreturn.paidbookingclasscode !== undefined) ? flightreturn.paidbookingclasscode : null;
        let promonameretr = (flightreturn && flightreturn.promoname !== undefined) ? flightreturn.promoname : '-';
        let promocoderetr = (flightreturn && flightreturn.promocode !== undefined) ? flightreturn.promocode : '-';
        let discountamountretr = (flightreturn && flightreturn.discountamount !== undefined) ? flightreturn.discountamount : '-';
        let statusretr = (flightreturn && flightreturn.status !== undefined) ? jsUcfirst(flightreturn.status, '_') : '-';
        let returnusecancelfee = (!flightreturn) ? null : (flightreturn.usecancelfee === undefined || flightreturn.usecancelfee === null) ? null : (flightreturn.usecancelfee) ? <Tag color='green'>Yes</Tag> : <Tag color='red'>No</Tag>;

        let departureUsingCancel = (departureusecancelfee === null) ? false : true;
        let returnUsingCancel = (returnusecancelfee === null) ? false : true;

        let usingCancel = (departureUsingCancel || returnUsingCancel) ? true : false
        let headerColLength = 4;
        let departureColLength = 4;
        let returnColLength = 4;

        if (categorycode === 'UPGRADE' || usingCancel) {
            headerColLength = 3;
            departureColLength = 3;
            returnColLength = 3;
        };

        const colorDeparture = (statusdepr === 'Voucher Issued' || statusdepr === 'Voucher Created') ? 'green' : (statusdepr === 'Voucher Partial Void') ? 'volcano' : (statusdepr === 'Voucher Void') ? 'red' : 'geekblue';
        const colorReturn = (statusretr === 'Voucher Issued' || statusretr === 'Voucher Created') ? 'green' : (statusretr === 'Voucher Partial Void') ? 'volcano' : (statusretr === 'Voucher Void') ? 'red' : 'geekblue';

        return (
            <Card title='Activity Details' bordered={false} className='card-shadow' style={{ marginBottom: 10 }}>
                <Row className='pricelist-flight-header'>
                    <Col xs={24} sm={24} md={24} lg={(source === 'memberCertif') ? 2 : headerColLength} xl={(source === 'memberCertif') ? 2 : headerColLength}> Flight </Col>
                    <Col xs={24} sm={24} md={24} lg={headerColLength} xl={headerColLength}> Activity Date </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> Airline /{(source === 'memberCertif') ? <br /> : null}Flight Number </Col>
                    <Col xs={24} sm={24} md={24} lg={headerColLength} xl={headerColLength}> Origin - Destination </Col>
                    {
                        (source === 'memberCertif') ? <Col xs={24} sm={24} md={24} lg={2} xl={2}> Price <br />(Mileage) </Col> :
                            <Col xs={24} sm={24} md={24} lg={headerColLength} xl={headerColLength}> Price (Mileage) </Col>
                    }
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> Compartment /<br />Booking Class </Col>
                    {
                        (categorycode === 'UPGRADE') ? <Col xs={24} sm={24} md={24} lg={4} xl={4}> Paid Compartment /<br />Paid Booking Class </Col> : null
                    }
                    {(usingCancel) ? <Col xs={24} sm={24} md={24} lg={2} xl={2}> Refund <br /> Fee</Col> : null}
                    {(source === 'memberCertif') ? <Col xs={24} sm={24} md={24} lg={(usingCancel) ? 3 : (categorycode === 'UPGRADE') ? 2 : 4} xl={(categorycode === 'UPGRADE') ? 2 : (departureUsingCancel || returnUsingCancel) ? 3 : 4}> Status</Col> : null}
                </Row>
                <Row className='pricelist-flight'>
                    <Col xs={24} sm={24} md={24} lg={(source === 'memberCertif') ? 2 : departureColLength} xl={(source === 'memberCertif') ? 2 : departureColLength}> Departure </Col>
                    <Col xs={24} sm={24} md={24} lg={departureColLength} xl={departureColLength}> {departureactivitydate} </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> {departureairlinecode} / {departureflightnumber} </Col>
                    <Col xs={24} sm={24} md={24} lg={departureColLength} xl={departureColLength}> {departureorigin} - {departuredestination} </Col>
                    <Col xs={24} sm={24} md={24} lg={(source === 'memberCertif') ? 2 : departureColLength} xl={(source === 'memberCertif') ? 2 : departureColLength}> {departureprice} </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> {departurecompartment} / {departurebookingclass} </Col>
                    {
                        (categorycode === 'UPGRADE') ? <Col xs={24} sm={24} md={24} lg={4} xl={4}> {departurepaidcompartmentcode} / {departurepaidbookingclasscode} </Col> : null
                    }
                    {(usingCancel) ? <Col xs={24} sm={24} md={24} lg={2} xl={2}>{departureusecancelfee}</Col> : null}
                    {(source === 'memberCertif') ? <Col xs={24} sm={24} md={24} lg={(categorycode === 'UPGRADE') ? 2 : 4} xl={(categorycode === 'UPGRADE') ? 2 : 4}>
                        <Tag color={colorDeparture}>{statusdepr}</Tag>
                    </Col> : null}
                </Row>
                {
                    (promocodedepr || promonamedepr) ? <Col style={{ textAlign: 'left', marginLeft: 30, marginTop: 10 }}>
                        <Col style={{ marginBottom: 5 }}>
                            <span> Promo Code : </span>
                            <span >{promocodedepr} - {promonamedepr}</span>
                        </Col>
                        <Col style={{ marginBottom: 5 }}>
                            <span> Price Before Discount : </span>
                            <span >{discountamountdepr && departureprice ? formatNumber(departureprice + discountamountdepr) : null}</span>
                        </Col>
                        <Col style={{ marginBottom: 5 }}>
                            <span> Discount Amount : </span>
                            <span >{discountamountdepr ? formatNumber(discountamountdepr) : null}</span>
                        </Col>
                    </Col> : null
                }
                <Row className={(roundtrip) ? 'pricelist-flight' : 'hidden'}>
                    <Col xs={24} sm={24} md={24} lg={(source === 'memberCertif') ? 2 : returnColLength} xl={(source === 'memberCertif') ? 2 : returnColLength}> Return </Col>
                    <Col xs={24} sm={24} md={24} lg={returnColLength} xl={returnColLength}> {returnactivitydate} </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> {returnirlinecode} / {returnflightnumber} </Col>
                    <Col xs={24} sm={24} md={24} lg={returnColLength} xl={returnColLength}> {returnorigin} - {returndestination} </Col>
                    <Col xs={24} sm={24} md={24} lg={(source === 'memberCertif') ? 2 : returnColLength} xl={(source === 'memberCertif') ? 2 : returnColLength}> {returnprice} </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> {returncompartment} / {returnbookingclass} </Col>
                    {
                        (categorycode === 'UPGRADE') ? <Col xs={24} sm={24} md={24} lg={4} xl={4}> {returnpaidcompartmentcode} / {returnpaidbookingclasscode} </Col> : null
                    }
                    {(usingCancel) ? <Col xs={24} sm={24} md={24} lg={2} xl={2}>{returnusecancelfee}</Col> : null}
                    {(source === 'memberCertif') ? <Col xs={24} sm={24} md={24} lg={(categorycode === 'UPGRADE') ? 2 : 4} xl={(categorycode === 'UPGRADE') ? 2 : 4}>
                        <Tag color={colorReturn}>{statusretr}</Tag>
                    </Col> : null}
                </Row>
                {
                    (promocoderetr || promonameretr) ? <Col style={{ textAlign: 'left', marginLeft: 30, marginTop: 10 }}>
                        <Col style={{ marginBottom: 5 }}>
                            <span> Promo Code : </span>
                            <span >{promocoderetr} - {promonameretr}</span>
                        </Col>
                        <Col style={{ marginBottom: 5 }}>
                            <span> Price Before Discount : </span>
                            <span >{returnprice && discountamountretr ? formatNumber(returnprice + discountamountretr) : null}</span>
                        </Col>
                        <Col style={{ marginBottom: 5 }}>
                            <span> Discount Amount : </span>
                            <span >{discountamountretr ? formatNumber(discountamountretr) : null}</span>
                        </Col>
                    </Col> : null
                }
            </Card>
        )
    };
}

export default Layout;