import React, { Component } from 'react';
import { Form, Row, Col, Divider } from 'antd';
import { ErrorGeneral } from '../../Base/BaseComponent';
import CeritificateDetails from './CertificateDetails';
import PassengerDetails from './PassengerDetails';
import ActivityDetails from './ActivityDetails';
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
            promoairdetails: {},
            voucher: [],
            numbercertificate: null,
            redeemusers: []
        };
    }

    render() {
        const { source } = this.props;
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
                            <CeritificateDetails {...this.props.certificatedetails} categorycode={this.props.categorycode} />
                            <PassengerDetails {...this.props.passengerdetails} />
                            <ActivityDetails {...this.props.activitydetails} categorycode={this.props.categorycode} source={source} />
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