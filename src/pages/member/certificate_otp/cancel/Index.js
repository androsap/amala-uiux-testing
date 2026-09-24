import React, { Component } from 'react';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { ErrorGeneral, Button } from '../../../../components/Base/BaseComponent';
import CancelAir from './Air';
import CancelNonAir from './NonAir';
import { Row, Col, Divider, Typography, Statistic } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Countdown } = Statistic;

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            certificatedetails: {},
            redeemusers: [],
            redeemairactivity: [],
            awardcategory: null,
            categorycode: null
        };
    }

    componentDidMount() {
        let certificateid = this.props.match.params.certificateid;
        this.getDetail(certificateid);
        this.props.retrieveSession();
    }

    getDetail = (certificateid) => {
        let url = api.url.redemptioncertificate.detail;
        let data = { certificateid };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                const { categorycode, awardcode, awardname, awardtypename, issueddate, freeaward, bookingcode, ticketnumber, redeemusers, ticketvaliditydate, redeemairactivity, redeemuser } = result;
                const { requestid, approvalby } = redeemuser[0] || [];

                let certificatedetails = {};
                certificatedetails['certificateid'] = redeemusers['certificateid'];
                certificatedetails['awardcode'] = (awardcode !== undefined) ? awardcode : '-';
                certificatedetails['awardname'] = (awardname !== undefined) ? awardname : '-';
                certificatedetails['awardtype'] = (awardtypename !== undefined) ? awardtypename : '-';
                certificatedetails['ticketnumber'] = (ticketnumber !== undefined) ? ticketnumber : '-';
                certificatedetails['paidticketnumber'] = (ticketnumber !== undefined) ? ticketnumber : '-';
                certificatedetails['issueddate'] = (issueddate !== undefined) ? moment(issueddate).format("DD/MM/YYYY") : '-';
                certificatedetails['freeaward'] = freeaward;
                certificatedetails['bookingcode'] = bookingcode;
                certificatedetails['certificateprice'] = (redeemusers['certificateprice'] !== undefined) ? redeemusers['certificateprice'].toString() : '0';
                certificatedetails['totalprice'] = (redeemusers['totalprice'] !== undefined) ? redeemusers['totalprice'].toString() : '0';
                certificatedetails['status'] = (redeemusers['status'] !== undefined) ? redeemusers['status'] : '-';
                certificatedetails['ticketvaliditydate'] = (ticketvaliditydate !== undefined) ? moment(ticketvaliditydate).format("DD/MM/YYYY") : null;
                certificatedetails['ticketofficeuser'] = (redeemusers.ticketofficeuser !== undefined) ? redeemusers.ticketofficeuser : null;
                certificatedetails['approvalby'] = approvalby;
                certificatedetails['requestid'] = requestid;

                //define redeemairactivity
                let activitydeparture = {};
                for (const field in redeemairactivity) {
                    if (redeemairactivity[field]['type'].toUpperCase() === 'DEPARTURE') {
                        activitydeparture = redeemairactivity[field];
                    }
                }

                /* set ticket number */
                certificatedetails['ticketnumber'] = (activitydeparture.ticketnumber) ? activitydeparture.ticketnumber : null;

                this.setState({
                    loading: false,
                    categorycode,
                    awardcategory: (redeemusers.awardcategory) ? redeemusers.awardcategory : null,
                    redeemairactivity: (result.redeemairactivity) ? result.redeemairactivity : null,
                    activityprice: (result.redeemairactivity.price) ? result.redeemairactivity.price : null,
                    certificatedetails
                });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    render() {
        const { formrender, certificatedetails, redeemairactivity, awardcategory, categorycode } = this.state;
        const { validate, countdown } = this.props;

        if (validate) {
            if (formrender) {
                return (
                    <Row>
                        <Col xs={24} xl={20} >
                            <Title level={4}><Button url={'/member/form/' + this.props.match.params.ID + 'certificateotp'} shape="circle" icon="left" />  Cancel Certificate</Title >
                        </Col>
                        <Col xs={24} xl={3} >
                            <p level={4} style={{ fontSize: '16px', textAlign: "right", color: 'black' }}>OTP Time Limit:&nbsp;</p>
                        </Col>
                        <Col xs={24} xl={1}>
                            <Countdown valueStyle={{ fontSize: '16px' }} value={countdown} format="mm:ss" onFinish={this.props.retrieveFinish} />
                        </Col>
                        <Divider />
                        <Row>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                {
                                    (awardcategory === 'AIR') ?
                                        <CancelAir {...this.props} categorycode={categorycode} redeemairactivity={redeemairactivity} certificatedetails={certificatedetails} /> : null
                                }
                                {
                                    (awardcategory === 'NONAIR') ?
                                        <CancelNonAir {...this.props} certificatedetails={certificatedetails} categorycode={categorycode} /> : null
                                }
                            </Col>
                        </Row>
                    </Row>
                )
            } else {
                return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
            }
        } else {
            return (
                <><Row gutter={24} type="flex" justify="center">
                    <Title level={2} style={{ textAlign: 'center', marginTop: 350 }} className={''}>This page need OTP Authentication, please back to Certificate page</Title>
                </Row><Row gutter={24} type="flex" justify="center">
                        <Button url={'/member/form/' + this.props.match.params.ID + '/certificateotp'} htmlType="link" type="default" label="Back" />
                    </Row></>
            )
        }
    }
}

export default Layout;