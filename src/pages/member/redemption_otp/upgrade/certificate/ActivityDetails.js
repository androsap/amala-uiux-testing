import React, { Component } from 'react';
import { Col, Row, Card } from 'antd';
import moment from 'moment';

class Layout extends Component {
    render() {
        const { roundtrip, flightdeparture, flightreturn } = this.props;
        let departureactivitydate = (flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : '-';
        let departureairlinecode = (flightdeparture.airlinecode) ? flightdeparture.airlinecode : '-';
        let departureflightnumber = (flightdeparture.flightnumber) ? flightdeparture.flightnumber : '-';
        let departureorigin = (flightdeparture.origin) ? flightdeparture.origin : '-';
        let departuredestination = (flightdeparture.destination) ? flightdeparture.destination : '-';
        let departurecompartment = (flightdeparture.compartment) ? flightdeparture.compartment : '-';
        let departurebookingclass = (flightdeparture.bookingclass) ? flightdeparture.bookingclass : '-';

        let returnactivitydate = (flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : '-';
        let returnirlinecode = (flightreturn.airlinecode) ? flightreturn.airlinecode : '-';
        let returnflightnumber = (flightreturn.flightnumber) ? flightreturn.flightnumber : '-';
        let returnorigin = (flightreturn.origin) ? flightreturn.origin : '-';
        let returndestination = (flightreturn.destination) ? flightreturn.destination : '-';
        let returncompartment = (flightreturn.compartment) ? flightreturn.compartment : '-';
        let returnbookingclass = (flightreturn.bookingclass) ? flightreturn.bookingclass : '-';

        return (
            <Card title="Activity Details" bordered={false} style={{ marginBottom: 10 }}>
                <Row className="pricelist-flight-header">
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> Flight </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> Activity Date </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> Airline / Flight Number </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> Origin - Destination </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> Compartment /<br />Booking Class </Col>
                </Row>
                <Row className="pricelist-flight">
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> Departure </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {departureactivitydate} </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {departureairlinecode} / {departureflightnumber} </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {departureorigin} - {departuredestination} </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {departurecompartment} / {departurebookingclass} </Col>
                </Row>
                <Row className={(roundtrip) ? "pricelist-flight" : "hidden"}>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}> Return </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {returnactivitydate} </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {returnirlinecode} / {returnflightnumber} </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {returnorigin} - {returndestination} </Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}> {returncompartment} / {returnbookingclass} </Col>
                </Row>
            </Card>
        )
    }
}

export default Layout;