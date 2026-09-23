import React, { Component } from 'react';
import { ErrorGeneral } from '../../Base/BaseComponent';
import { Form, Row, Col, Divider } from 'antd';
import CeritificateDetails from './CertificateDetails';
import PassengerDetails from './PassengerDetails';
import PromoDetails from './PromoDetails';
import MilesInformation from './MilesInformation';
import Voucher from './Voucher';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            certificatedetails: {},
            passengerdetails: {},
            activitydetails: {},
            promodetails: {},
            voucher: [],
            numbercertificate: null,
            // redeemusers: []
        };
    }

    render() {
        const { formrender } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        if (formrender) {
            let number = Number.parseInt(this.props.number, 0);
            return (
                <Form {...formItemLayout}>
                    <Divider>Certificate #{number}</Divider>
                    {/* <div style={{ background: '#ECECEC', padding: '30px', marginBottom: '30px' }}> */}
                    <Row>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                            <CeritificateDetails {...this.props.certificatedetails} />
                            <PromoDetails {...this.props.promodetails} />
                            <PassengerDetails {...this.props.passengerdetails} />
                            <MilesInformation {...this.props} certificateid={this.props.certificatedetails.certificateid} />
                            <Voucher number={number} {...this.props.voucher} />
                        </Col>
                    </Row>
                    {/* </div> */}
                </Form>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

export default Layout;