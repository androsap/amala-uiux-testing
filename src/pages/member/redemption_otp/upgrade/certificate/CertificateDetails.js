import React, { Component } from 'react';
import { Form, Row, Col, Card } from 'antd';

class Layout extends Component {
    render() {
        let certificateid = (this.props.certificateid) ? this.props.certificateid : '-';
        let awardcode = (this.props.awardcode) ? this.props.awardcode : '-';
        let awardtype = (this.props.awardtype) ? this.props.awardtype : '-';
        let bookingcode = (this.props.bookingcode) ? this.props.bookingcode : '-';
        let freeaward = (this.props.freeaward) ? 'YES' : 'NO';
        let totalprice = (this.props.totalprice) ? this.props.totalprice : '-';
        let status = (this.props.status) ? this.props.status : '-';
        let issueddate = (this.props.issueddate) ? this.props.issueddate : '-';
        let ticketvaliditydate = (this.props.ticketvaliditydate) ? this.props.ticketvaliditydate : '-';
        let ticketnumber = (this.props.ticketnumber) ? this.props.ticketnumber : '-';
        return (
            <Card title="Certificate Details" bordered={false} style={{ marginBottom: 10 }}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Form.Item label="Cerfiticate ID" style={{ margin: 0 }}>
                            <span className="ant-form-text">{certificateid}</span>
                        </Form.Item>
                        <Form.Item label="Award Code" style={{ margin: 0 }}>
                            <span className="ant-form-text">{awardcode}</span>
                        </Form.Item>
                        <Form.Item label="Award Type" style={{ margin: 0 }}>
                            <span className="ant-form-text">{awardtype}</span>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Form.Item label="Booking Code" style={{ margin: 0 }}>
                            <span className="ant-form-text">{bookingcode}</span>
                        </Form.Item>
                        <Form.Item label="Free Award" style={{ margin: 0 }}>
                            <span className="ant-form-text">{freeaward}</span>
                        </Form.Item>
                        <Form.Item label="Price" style={{ margin: 0 }}>
                            <span className="ant-form-text">{totalprice}</span>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Form.Item label="Status" style={{ margin: 0 }}>
                            <span className="ant-form-text">{status}</span>
                        </Form.Item>
                        <Form.Item label="Issued Date" style={{ margin: 0 }}>
                            <span className="ant-form-text">{issueddate}</span>
                        </Form.Item>
                        <Form.Item label="Ticket Number" style={{ margin: 0 }}>
                            <span className="ant-form-text">{ticketnumber}</span>
                        </Form.Item>
                        <Form.Item label="Ticket Validity Date" style={{ margin: 0 }}>
                            <span className="ant-form-text">{ticketvaliditydate}</span>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        )
    }
}

export default Layout;