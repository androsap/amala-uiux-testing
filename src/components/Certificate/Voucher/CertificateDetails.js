import React, { Component } from 'react';
import { Form, Row, Col, Card } from 'antd';
import { formatNumber } from '../../../utilities/Helpers';

class Layout extends Component {
    render() {
        const { requestid, approvalby } = this.props || undefined;

        let certificateid = (this.props.certificateid) ? this.props.certificateid : '-';
        let awardcode = (this.props.awardcode) ? this.props.awardcode : '-';
        let awardname = (this.props.awardname) ? this.props.awardname : '-';
        let awardtype = (this.props.awardtype) ? this.props.awardtype : '-';
        let bookingcode = (this.props.bookingcode) ? this.props.bookingcode : '-';
        let freeaward = (this.props.freeaward) ? 'YES' : 'NO';
        let totalprice = (this.props.totalprice) ? this.props.totalprice : '-';
        let paymentprice = (this.props.paymentprice) ? this.props.paymentprice : '-';
        let paymentcurrency = (this.props.paymentcurrency) ? this.props.paymentcurrency : '-';
        let cashprice = (this.props.cashprice) ? this.props.cashprice : '-';
        let cashcurrency = (this.props.cashcurrency) ? this.props.cashcurrency : '-';
        let status = (this.props.status) ? this.props.status : '-';
        let issueddate = (this.props.issueddate) ? this.props.issueddate : '-';
        let ticketofficeuser = this.props.ticketofficeuser;

        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

        return (
            <Card title="Certificate Details" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                {((requestid === undefined && approvalby === undefined) || (requestid === null && approvalby === null)) ? <Row>
                    <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                        <Form.Item {...formItemLayout} label="Certificate ID" style={{ margin: 0 }}>
                            <span className="ant-form-text">{certificateid}</span>
                        </Form.Item>
                    </Col>
                </Row> : ''}
                <Row>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        {((requestid === undefined && approvalby === undefined) || (requestid === null && approvalby === null)) ? '' :
                            <Form.Item label="Certificate ID" style={{ margin: 0 }}>
                                <span className="ant-form-text">{certificateid}</span>
                            </Form.Item>}
                        <Form.Item label="Award Code" style={{ margin: 0 }}>
                            <span className="ant-form-text">{awardcode}</span>
                        </Form.Item>
                        <Form.Item label="Award Name" style={{ margin: 0 }}>
                            <span className="ant-form-text">{awardname}</span>
                        </Form.Item>
                        <Form.Item label="Award Type" style={{ margin: 0 }}>
                            <span className="ant-form-text">{awardtype}</span>
                        </Form.Item>
                        <Form.Item label="Booking Code" style={{ margin: 0 }}>
                            <span className="ant-form-text">{bookingcode}</span>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={7}>
                        {(requestid === undefined) ? '' : (requestid === null) ? '' : <Form.Item label="Request ID" style={{ margin: 0 }}>
                            <span className="ant-form-text">{requestid}</span>
                        </Form.Item>}
                        <Form.Item label="Issued By" style={{ margin: 0 }}>
                            <span className="ant-form-text">{ticketofficeuser}</span>
                        </Form.Item>
                        <Form.Item label="Award Price" style={{ margin: 0 }}>
                            <span className="ant-form-text">{`${formatNumber(totalprice)} miles`}</span>
                        </Form.Item>
                        <Form.Item label="Payment Price" style={{ margin: 0 }}>
                            <span className="ant-form-text">{formatNumber(paymentprice)} {paymentcurrency !== '-' ? `(${paymentcurrency})` : ''}</span>
                        </Form.Item>
                        <Form.Item label="Cash Price" style={{ margin: 0 }}>
                            <span className="ant-form-text">{formatNumber(cashprice)} {cashcurrency !== '-' ? `(${cashcurrency})` : ''}</span>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={9}>
                        {(approvalby === undefined) ? '' : (requestid === null) ? '' : <Form.Item label="Approval By" style={{ margin: 0 }}>
                            <span className="ant-form-text">{approvalby}</span>
                        </Form.Item>}
                        <Form.Item label="Status" style={{ margin: 0 }}>
                            <span className="ant-form-text">{status}</span>
                        </Form.Item>
                        <Form.Item label="Issued Date" style={{ margin: 0 }}>
                            <span className="ant-form-text">{issueddate}</span>
                        </Form.Item>
                        <Form.Item label="Free Award" style={{ margin: 0 }}>
                            <span className="ant-form-text">{freeaward}</span>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        )
    }
}

export default Layout;