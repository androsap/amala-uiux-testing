import React, { Component } from 'react';
import { Form, Col, Card, Row } from 'antd';
import { formatNumber } from '../../../utilities/Helpers';

class Layout extends Component {
    render() {
        let promocode = (this.props.promocode) ? this.props.promocode : null;
        let promoname = (this.props.promoname) ? this.props.promoname : null;
        let discountamount = (this.props.discountamount) ? this.props.discountamount : '-';
        let certificateprice = (this.props.certificateprice) ? this.props.certificateprice : '-';
        return (

            <Card title="Promo Details" bordered={true} className="card-shadow" style={{ marginBottom: 10 }} hidden={(promocode !== null || promoname !== null) ? false : true}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={8} xl={24} pull={5} >
                        <Form.Item label="Promo Code" style={{ margin: 0 }}>
                            <span className="ant-form-text">{promocode} - {promoname}</span>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={8} xl={12}>
                        <Form.Item label="Price Before Discount" style={{ margin: 0 }}>
                            <span className="ant-form-text">{certificateprice && discountamount ? formatNumber(certificateprice + discountamount) : null}</span>
                        </Form.Item>
                        <Form.Item label="Discount Amount" style={{ margin: 0 }}>
                            <span className="ant-form-text">{discountamount ? formatNumber(discountamount) : null}</span>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

        )
    }
}

export default Layout;