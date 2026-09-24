import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { ErrorGeneral } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Button } from 'antd';
import moment from 'moment';
import CeritificateDetails from './CertificateDetails';
import PassengerDetails from './PassengerDetails';
import ActivityDetails from './ActivityDetails';
import Voucher from './Voucher';


const { Title } = Typography;
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
            voucher: [],
            numbercertificate: null,
            redeemusers: []
        };
    }

    getDetail = (certificateid) => {
        let url = api.url.redemptioncertificate.detail;
        let data = { certificateid };
        //call loader
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                const { awardcode, awardtypename, totalprice, issueddate, freeaward, bookingcode, redeemairactivity, redeemvoucherdetail, voucherimage, approvalby, requestid } = result;

                let redeemUserFinal = [];
                let redeemuser = result.redeemuser;
                for (const field in redeemuser) {
                    redeemUserFinal[field] = [];
                    redeemUserFinal[field]['certificatedetails'] = {};
                    redeemUserFinal[field]['certificatedetails']['certificateid'] = redeemuser[field]['certificateid'];
                    redeemUserFinal[field]['certificatedetails']['awardcode'] = (awardcode !== undefined) ? awardcode : '-';
                    redeemUserFinal[field]['certificatedetails']['awardtype'] = (awardtypename !== undefined) ? awardtypename : '-';
                    redeemUserFinal[field]['certificatedetails']['totalprice'] = (totalprice !== undefined) ? totalprice : '-';
                    redeemUserFinal[field]['certificatedetails']['issueddate'] = (issueddate !== undefined) ? moment(issueddate).format("DD/MM/YYYY") : '-';
                    redeemUserFinal[field]['certificatedetails']['freeaward'] = freeaward;
                    redeemUserFinal[field]['certificatedetails']['bookingcode'] = bookingcode;
                    redeemUserFinal[field]['certificatedetails']['status'] = (redeemuser[field]['status'] !== undefined) ? redeemuser[field]['status'] : '-';
                    redeemUserFinal[field]['certificatedetails']['approvalby'] = approvalby;
                    redeemUserFinal[field]['certificatedetails']['requestid'] = requestid;

                    redeemUserFinal[field]['passengerdetails'] = {};
                    redeemUserFinal[field]['passengerdetails']['salutation'] = (redeemuser[field]['salutationcode']) ? redeemuser[field]['salutationcode'] : '-';
                    redeemUserFinal[field]['passengerdetails']['name'] = (redeemuser[field]['name'] !== undefined) ? redeemuser[field]['name'] : '-';
                    redeemUserFinal[field]['passengerdetails']['familyname'] = (redeemuser[field]['familyname'] !== undefined) ? redeemuser[field]['familyname'] : '-';
                    redeemUserFinal[field]['passengerdetails']['memberid'] = (redeemuser[field]['memberiduser']) ? redeemuser[field]['memberiduser'] : '-';
                    redeemUserFinal[field]['passengerdetails']['travelertype'] = (redeemuser[field]['travelertype'] !== undefined) ? redeemuser[field]['travelertype'] : '-';
                    redeemUserFinal[field]['passengerdetails']['selfusage'] = (redeemuser[field]['selfusage'] !== undefined) ? redeemuser[field]['selfusage'] : '-';



                    //define redeemairactivity
                    let activitydeparture = {};
                    let activityreturn = {};
                    for (const field in redeemairactivity) {
                        if (redeemairactivity[field]['type'].toUpperCase() === 'DEPARTURE') {
                            activitydeparture = redeemairactivity[field];
                        } else {
                            activityreturn = redeemairactivity[field];
                        }
                    }

                    redeemUserFinal[field]['activitydetails'] = {};
                    redeemUserFinal[field]['activitydetails']['flightdeparture'] = {};
                    redeemUserFinal[field]['activitydetails']['flightdeparture']['origin'] = activitydeparture.origin;
                    redeemUserFinal[field]['activitydetails']['flightdeparture']['destination'] = activitydeparture.destination;
                    redeemUserFinal[field]['activitydetails']['flightdeparture']['airlinecode'] = activitydeparture.airline;
                    redeemUserFinal[field]['activitydetails']['flightdeparture']['flightnumber'] = activitydeparture.flightnumber;
                    redeemUserFinal[field]['activitydetails']['flightdeparture']['compartment'] = activitydeparture.compartment;
                    redeemUserFinal[field]['activitydetails']['flightdeparture']['bookingclass'] = activitydeparture.bookingclass;
                    redeemUserFinal[field]['activitydetails']['flightdeparture']['activitydate'] = (activitydeparture.activitydate) ? activitydeparture.activitydate : '-';

                    redeemUserFinal[field]['activitydetails']['flightreturn'] = {};
                    redeemUserFinal[field]['activitydetails']['flightreturn']['origin'] = (activityreturn.origin) ? activityreturn.origin : '-';
                    redeemUserFinal[field]['activitydetails']['flightreturn']['destination'] = (activityreturn.destination) ? activityreturn.destination : '-';
                    redeemUserFinal[field]['activitydetails']['flightreturn']['airlinecode'] = (activityreturn.airline) ? activityreturn.airline : '-';
                    redeemUserFinal[field]['activitydetails']['flightreturn']['flightnumber'] = (activityreturn.flightnumber) ? activityreturn.flightnumber : '-';
                    redeemUserFinal[field]['activitydetails']['flightreturn']['compartment'] = (activityreturn.compartment) ? activityreturn.compartment : '-';
                    redeemUserFinal[field]['activitydetails']['flightreturn']['bookingclass'] = (activityreturn.bookingclass) ? activityreturn.bookingclass : '-';
                    redeemUserFinal[field]['activitydetails']['flightreturn']['activitydate'] = (activityreturn.activitydate) ? activityreturn.activitydate : '-';
                    redeemUserFinal[field]['activitydetails']['roundtrip'] = result.return;


                    let vouchertext = [];
                    for (const field in redeemvoucherdetail) {
                        if (vouchertext[redeemvoucherdetail[field].certificateid] === undefined) {
                            vouchertext[redeemvoucherdetail[field].certificateid] = [];
                        }
                        vouchertext[redeemvoucherdetail[field].certificateid].push(redeemvoucherdetail[field]);
                    }

                    redeemUserFinal[field]['voucher'] = {};
                    redeemUserFinal[field]['voucher']['urltemplate'] = voucherimage;
                    redeemUserFinal[field]['voucher']['certificateid'] = (redeemuser[field]['certificateid'] !== undefined) ? redeemuser[field]['certificateid'] : '';
                    redeemUserFinal[field]['voucher']['voucher'] = vouchertext[redeemuser[field]['certificateid']];
                }
                this.setState({ redeemusers: redeemUserFinal });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    componentDidMount() {
        let memberid = this.props.match.params.ID;
        let certificateid = this.props.match.params.certificateid;
        this.getDetail(certificateid);
    }

    generateCanvas(vouchertext, voucherimage) {
        var imageCanvas = new Image();
        imageCanvas.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            const canvas = document.getElementById("canvas");
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageCanvas, 0, 0);
            var temp1 = vouchertext;
            for (const keyTemp1 in temp1) {
                var posx = temp1[keyTemp1].positionx;
                var posy = (temp1[keyTemp1].positiony * 1) + 19;
                var text = temp1[keyTemp1].vouchertext;
                var color = temp1[keyTemp1].color;
                var font = temp1[keyTemp1].font;
                var size = temp1[keyTemp1].size;

                ctx.font = size + 'px ' + font;
                ctx.fillStyle = color;
                ctx.fillText(text, posx, posy);
            }
        };
        imageCanvas.src = voucherimage;
    }

    render() {
        const { formrender, redeemusers, certificatedetails, passengerdetails, activitydetails, voucher } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        // let certificatelist = [];
        // let certificatedetails = {};
        // let passengerdetails = {};
        // let activitydetails = {};
        // let voucher = {};
        // for (const field in redeemusers) {
        //     certificatedetails = redeemusers[field].certificatedetails;
        //     passengerdetails = redeemusers[field].passengerdetails;
        //     activitydetails = redeemusers[field].activitydetails;
        //     voucher = redeemusers[field].voucher;
        //     certificatelist[field] = <Certificate key={field} number={field} certificatedetails={certificatedetails} passengerdetails={passengerdetails} activitydetails={activitydetails} voucher={voucher} />
        // }

        let memberid = this.props.match.params.ID;


        if (formrender) {
            return (
                <Row>
                    <Row>
                        <Title level={4}>Certificate</Title>
                        <Divider />
                    </Row>
                    <Form {...formItemLayout}>
                        <Certificate certificatedetails={certificatedetails} passengerdetails={passengerdetails} activitydetails={activitydetails} voucher={voucher} />
                        <Row>
                            <Col style={{ textAlign: 'center' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Link to={"/member/form/" + memberid + "/certificate"}>
                                    <Button htmlType="button" type="primary">Back</Button>
                                </Link>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}



class Certificate extends Component {
    render() {
        let number = Number.parseInt(this.props.number, 0);
        return (
            <React.Fragment>
                <Divider>Certificate #{number + 1}</Divider>
                <div style={{ background: '#ECECEC', padding: '30px', marginBottom: '30px' }}>
                    <Row>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                            <CeritificateDetails {...this.props.certificatedetails} />
                            <PassengerDetails {...this.props.passengerdetails} />
                            <ActivityDetails {...this.props.activitydetails} />
                            <Voucher number={number} {...this.props.voucher} />
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        )
    }
}

export default Layout;