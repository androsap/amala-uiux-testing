import React from 'react';
import { Row, Col, Card } from 'antd';
import moment from 'moment';

class AirActivity extends React.Component {

    render() {
        const { category, i, redeemairactivity, originAirport, destinationAirport } = this.props;

        return (
            <React.Fragment>
                <Card title={`${i === 0 ? 'Departure' : 'Return'} Activity Details`} bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }} key={i}>
                    <Col className="gutter-row" xs={24} lg={{ span: 12 }}>
                        <Row>
                            <Col xs={24} xl={6}><label>Flight Date</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{redeemairactivity.activitydate ? moment(redeemairactivity.activitydate).format('dddd, DD/MM/YYYY') : '-'}</Col>
                        </Row>
                        <Row>
                            <Col xs={24} xl={6}><label>Airline</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{redeemairactivity.airline ? redeemairactivity.airline : '-'}</Col>
                        </Row>
                        <Row>
                            <Col xs={24} xl={6}><label>Price</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{redeemairactivity.price ? redeemairactivity.price : '-'}</Col>
                        </Row>
                        <Row>
                            {category === 'upgrade' ? <Col xs={24} xl={6}><label>Flight Number</label></Col> : ''}
                            {category === 'upgrade' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                            {category === 'upgrade' ? <Col xs={23} xl={{ span: 16, pull: 1 }}>{redeemairactivity.flightnumber ? redeemairactivity.flightnumber : '-'}</Col> : ''}
                        </Row>
                        <Row>
                            <Col xs={24} xl={6}><label>Origin</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{(originAirport && i === 0) ? originAirport : (destinationAirport && i !== 0) ? destinationAirport : '-'}</Col>
                        </Row>
                    </Col>
                    <Col className="gutter-row" xs={24} lg={{ span: 12 }}>
                        <Row>
                            <Col xs={24} xl={8}><label>Compartment</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{redeemairactivity.compartment ? redeemairactivity.compartment : '-'}</Col>
                        </Row>
                        <Row>
                            <Col xs={24} xl={8}><label>Booking Class</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{redeemairactivity.bookingclass ? redeemairactivity.bookingclass : '-'}</Col>
                        </Row>
                        <Row>
                            {category === 'freeflight' ? <Col xs={24} xl={8}><label>Flight Number</label></Col> : ''}
                            {category === 'freeflight' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                            {category === 'freeflight' ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{redeemairactivity.flightnumber ? redeemairactivity.flightnumber : '-'}</Col> : ''}
                        </Row>
                        <Row>
                            {category === 'upgrade' ? <Col xs={24} xl={8}><label>Paid Compartment</label></Col> : ''}
                            {category === 'upgrade' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                            {category === 'upgrade' ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{redeemairactivity.paidcompartmentcode ? redeemairactivity.paidcompartmentcode : '-'}</Col> : ''}
                        </Row>
                        <Row>
                            {category === 'upgrade' ? <Col xs={24} xl={8}><label>Paid Booking Class</label></Col> : ''}
                            {category === 'upgrade' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                            {category === 'upgrade' ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{redeemairactivity.paidbookingclasscode ? redeemairactivity.paidbookingclasscode : '-'}</Col> : ''}
                        </Row>
                        <Row>
                            <Col xs={24} xl={8}><label>Destination</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{(destinationAirport && i === 0) ? destinationAirport : (originAirport && i !== 0) ? originAirport : '-'}</Col>
                        </Row>
                    </Col>
                </Card>
            </React.Fragment>
        )
    }
}

export default AirActivity;