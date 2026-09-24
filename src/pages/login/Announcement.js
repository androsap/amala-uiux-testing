import React, { Component } from 'react';
import { Row, Form, Icon, Col, Result, Typography } from 'antd';

const { Title, Text } = Typography;

class App extends Component {

    render() {
        return (
            <div style={{ fontSize: '11px' }}>
                <Row>
                    <Row style={{ color: '#03a9f4' }}>
                        <Col xs={1}>
                            <Icon type="exclamation-circle" />
                        </Col>
                        <Col xs={22} style={{ fontSize: '13px', marginTop: -2, marginLeft: 2, }}>Broadcast Message</Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>Please be informed about AMALA Database Maintenance activity plan which will be scheduled on</Row>
                    <Row style={{ marginTop: '5px' }}>
                        <Col xs={4}>Start Time</Col>
                        <Col xs={1}>:</Col>
                        <Col xs={19}>
                            <strong>Saturday, July 18, 2026 at 22:00 (UTC+ 07:00)</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>End Time</Col>
                        <Col xs={1}>:</Col>
                        <Col xs={19}>
                            <strong>Sunday, July 19, 2026 at 04:00 (UTC+ 07:00)</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>Downtime</Col>
                        <Col xs={1}>:</Col>
                        <Col xs={19}>
                            <strong>360 minutes</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>Impact</Col>
                        <Col xs={1}>:</Col>
                        <Col xs={19}>
                            <strong>Unable to access All Amala Service and Website</strong>
                        </Col>
                    </Row>
                </Row>
            </div>
        )
    }
}

export class AnnouncementModal extends Component {
    render() {
        const mobileScreen = window.screen.width < 600;

        return (
            <Row type="flex" justify="center" align="middle" >
                <Col>
                    <Result
                        icon={
                            <img src="https://amala.garuda-indonesia.com/assets/images/maintenance.png" alt="Maintenance" width={mobileScreen ? 200 : 260} />
                        }
                        status="error"
                        title={<Title level={2} style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "clamp(22px, 6vw, 36px)", margin: "8px 0 0" }}>{"Maintenance"}</Title>}
                        subTitle={<Text type="secondary" style={{ display: "block", maxWidth: 420, margin: "12px auto 0", fontSize: "clamp(13px, 3.5vw, 15px)", padding: "0 8px" }}>{this.props.messageSubTitle}</Text>}
                    />
                </Col>
            </Row>
        )
    }
}

export default Form.create()(App);