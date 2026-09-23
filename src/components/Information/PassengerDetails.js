import React from 'react';
import { Row, Col, Card } from 'antd';
import { jsUcfirst } from '../../utilities/Helpers';

class PassengerDetails extends React.Component {

    render() {
        const { redeemuser } = this.props;
        const { name, familyname, memberiduser, travelertype, selfusage } = redeemuser;

        return (
            <React.Fragment>
                {Array.isArray(redeemuser) ? redeemuser.map((val, i) => <Card title={`Passenger ${redeemuser.length === 1 ? '' : (i + 1)} Details`} bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }} key={'passenger'}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                        <Row>
                            <Col xs={24} xl={6}><label>Name</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{val.name ? jsUcfirst(val.name) : '-'}</Col>
                        </Row>
                        <Row>
                            <Col xs={24} xl={6}><label>Family Name</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{val.familyname ? jsUcfirst(val.familyname) : '-'}</Col>
                        </Row>
                        <Row>
                            <Col xs={24} xl={6}><label>Card Number</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{val.memberiduser ? val.memberiduser : '-'}</Col>
                        </Row>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Row>
                            <Col xs={24} xl={8}><label>Traveler Type</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{val.travelertype ? val.travelertype : '-'}</Col>
                        </Row>
                        <Row>
                            <Col xs={24} xl={8}><label>Self Usage</label></Col>
                            <Col xs={1} xl={2}><label>:</label></Col>
                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{val.selfusage !== undefined ? val.selfusage ? 'Yes' : 'No' : ''}</Col>
                        </Row>
                    </Col>
                </Card >) :
                    <Card title={`Passenger Details`} bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }} key={'passenger'}>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                            <Row>
                                <Col xs={24} xl={6}><label>Name</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{name ? jsUcfirst(name) : '-'}</Col>
                            </Row>
                            <Row>
                                <Col xs={24} xl={6}><label>Family Name</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{familyname ? jsUcfirst(familyname) : '-'}</Col>
                            </Row>
                            <Row>
                                <Col xs={24} xl={6}><label>Card Number</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{memberiduser ? memberiduser : '-'}</Col>
                            </Row>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <Row>
                                <Col xs={24} xl={8}><label>Traveler Type</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{travelertype ? travelertype : '-'}</Col>
                            </Row>
                            <Row>
                                <Col xs={24} xl={8}><label>Self Usage</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{selfusage !== undefined ? selfusage ? 'Yes' : 'No' : ''}</Col>
                            </Row>
                        </Col>
                    </Card>
                }
            </React.Fragment>
        )
    }
}

export default PassengerDetails;