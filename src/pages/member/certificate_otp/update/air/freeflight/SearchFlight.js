import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest, RetrieveRequest } from '../../../../../../utilities/RequestService';
import { api } from '../../../../../../config/Services';
import { connect } from "react-redux";
import { getProfile } from '../../../../../../utilities/AuthService';
import { AirlineSelect, CompartmentSelect, OriDesSelect, InputNumber, Button, Alert, SwitchButton, DatePickerBase, DateRangeBase, SubclassSelect } from '../../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Statistic } from 'antd';
import ErrorGeneral from '../../../../../error/ErrorGeneral';
import moment from 'moment';

import FormUpgrade from './Form';

const { Title } = Typography;
const { Countdown } = Statistic;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            formrender: true,
            responseCode: '0',
            responseMessage: '',
            fieldvalue: {
                minDate: moment()
            },
            isSuccessSearchFlight: false,
            requestSearchFlight: {},
            responseSearchFlight: {}
        }
    }

    componentDidMount() {
        document.title = "Certificate Update - Freeflight | Loyalty Management System";
        this.getDetail();
        this.props.retrieveSession();
    }

    getDetail = () => {
        this.componentAirlineSelect.retrieveData();
        this.componentOriDesSelect.retrieveData();

        const { location, fromApproval, result } = this.props;
        const { state } = location || {};
        let { activitydetails, activitydepartureselected, activityreturnselected } = state || {};
        let { flightdeparture, flightreturn } = activitydetails || {};
        let roundtrip = fromApproval ? result.reqdatas.return : (activitydepartureselected && activityreturnselected) ? true : false;
        const adultpassenger = 1;
        const airactivity = result ? result.reqdatas.redeemairactivity : '';

        /* set flight departure and return from approval */
        if (fromApproval) {
            flightdeparture = (airactivity.find(o => o.type === 'departure') === undefined) ? undefined : airactivity.find(o => o.type === 'departure');
            flightreturn = (airactivity.find(o => o.type === 'return') === undefined) ? undefined : airactivity.find(o => o.type === 'return');
            roundtrip = (flightdeparture && flightreturn) ? true : false;
            this.setState({ flightdeparture, flightreturn })
        }

        /* set origin destination ase update activity */
        const { airline, compartment, bookingclass, origin, destination } = activitydepartureselected ? flightdeparture : flightreturn;
        let airlinecode = airline;
        let compartmentcode = compartment;
        let subclasscode = bookingclass;

        this.componentCompartmentSelect.retrieveData({ airlinecode });
        this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode, spendmiles: true });
        this.props.form.setFieldsValue({ airlinecode, origin, destination, compartmentcode, subclasscode, roundtrip, adultpassenger });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { location, fromApproval, result } = this.props;
                const { flightdeparture, flightreturn } = this.state;
                const { state } = location;
                const { certificatedetails, activitydepartureselected, activityreturnselected } = state || {};
                const { awardcode, awardpricingby } = (fromApproval) ? result.reqdatas : certificatedetails;

                let memberid = (fromApproval) ? result.memberid : this.props.match.params.ID;
                let username = getProfile().username;
                let adultpassenger = Number.parseInt(input.adultpassenger, 0);
                let airlinecode = input.airlinecode;
                let compartmentcode = input.compartmentcode;
                let origin = input.origin;
                let destination = input.destination;
                let bookingclass = (input.subclasscode) ? input.subclasscode : null;
                let roundtrip = (input.roundtrip) ? input.roundtrip : false;
                let departuredate = null;
                let returndate = null;
                if (roundtrip) {
                    departuredate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                    returndate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                } else {
                    if (activitydepartureselected || flightdeparture) {
                        departuredate = (input.departuredate) ? moment(input.departuredate).format("YYYY-MM-DD") : null;
                    } else if (activityreturnselected || flightreturn) {
                        departuredate = (input.returndate) ? moment(input.returndate).format("YYYY-MM-DD") : null;
                    }
                }
                let flightdata = [{ airlinecode, compartmentcode, origin, destination, bookingclass, return: roundtrip, departuredate, returndate }];

                let requestSearchFlight = { memberid, awardcode, username, adultpassenger, airlinecode, compartmentcode, origin, destination, roundtrip, departuredate, returndate };
                let data = { awardcode, memberid, username, adultpassenger, flightdata };
                let url = (awardpricingby === 'MANUAL') ? api.url.accrualruleod.list : api.url.redemption.getpricelist;

                if (awardpricingby === 'MANUAL') {
                    RetrieveRequest(url, { airlinecode, originairport: origin, destinationairport: destination }, {}, [], {}).then((response) => {
                        const { status, result } = response;
                        if (result.length !== 0 && status.responsecode === '0000') {
                            this.setState({ isSuccessSearchFlight: true, requestSearchFlight })
                        } else Alert.error((status.responsemessage) ? status.responsemessage : 'Route not available');
                        this.setState({ isLoading: false });
                    })
                } else {
                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode === '0000') {
                            let responseSearchFlight = response.result;
                            this.setState({ isSuccessSearchFlight: true, requestSearchFlight, responseSearchFlight })
                        } else Alert.error(responsemessage);
                        this.setState({ isLoading: false });
                    })
                }

            }
        });
    };

    handleBackSearchFlight = async () => {
        await this.setState({ isSuccessSearchFlight: false });
        await this.getDetail();
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isSuccessSearchFlight, requestSearchFlight, responseSearchFlight, formrender } = this.state;
        const roundtrip = this.props.form.getFieldValue('roundtrip');
        const maxperson = 1;

        const { location, fromApproval, result, validate, countdown } = this.props;
        const { state } = location || {};
        const { activitydepartureselected, activityreturnselected, activitydetails, certificatedetails, memberprofile, categorycode } = state || {};
        const { flightdeparture, flightreturn } = activitydetails || this.state;
        const { awardcode } = (fromApproval) ? (result.reqdatas) : (certificatedetails === undefined ? {} : certificatedetails);
        const maxDateDeparture = (fromApproval) ? undefined : (flightreturn.activitydate) ? moment(flightreturn.activitydate) : undefined;
        const dataLocation = { state: { priceList: responseSearchFlight, requestSearchFlight: requestSearchFlight, activitydepartureselected: flightdeparture, activityreturnselected: flightreturn, activitydetails: { roundtrip, flightdeparture, flightreturn }, certificatedetails, memberprofile } }

        if (validate) {
            if (!formrender) {
                return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
            }
            if (isSuccessSearchFlight && fromApproval) {
                return (<FormUpgrade {...this.props} location={dataLocation} handleBackSearchFlight={this.handleBackSearchFlight} />)
            } else if (isSuccessSearchFlight) {
                return (<Redirect to={{ pathname: '/member/form/' + this.props.match.params.ID + '/certificateotp/update/' + this.props.match.params.certificateid + '/freeflight/buy', state: { priceList: responseSearchFlight, requestSearchFlight, activitydepartureselected, activityreturnselected, activitydetails, certificatedetails, memberprofile, categorycode } }} />)
            } else {
                return (
                    <Row>
                        <Row>
                            {fromApproval ? <Col xs={24} xl={20}></Col> :
                                <><Col xs={24} xl={20}>
                                    <Title level={4}>Certificate Update</Title>
                                </Col><Divider /></>
                            }
                            <Col xs={24} xl={3} >
                                <p level={4} style={{ fontSize: '16px', textAlign: "right", color: 'black' }}>OTP Time Limit:&nbsp;</p>
                            </Col>
                            <Col xs={24} xl={1}>
                                <Countdown valueStyle={{ fontSize: '16px' }} value={countdown} format="mm:ss" onFinish={this.props.retrieveFinish} />
                            </Col>
                        </Row>
                        <Spin spinning={this.state.isLoading}>
                            <Form {...formItemLayout} onSubmit={this.saveAction}>
                                <Row gutter={24}>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                        <Form.Item label="Award Code">
                                            <span className="ant-form-text">{awardcode}</span>
                                        </Form.Item>
                                        <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} disabled={true} />
                                        <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" validationrules={['required']} disabled={true} />
                                        <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Subclass" datafield="subclasscode" disabled={true} />
                                        <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} disabled={true} />
                                        <SwitchButton form={this.props.form} labeltext="Round Trip" datafield="roundtrip" disabled={true} />
                                        {
                                            (roundtrip) ?
                                                <span>
                                                    <Form.Item label="Old Departure Date">
                                                        <span className="ant-form-text">{((flightdeparture && flightdeparture.activitydate) || (flightreturn && fromApproval)) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                    </Form.Item>
                                                    <Form.Item label="Old Return Date">
                                                        <span className="ant-form-text">{(flightreturn && flightreturn.activitydate) || (flightreturn && fromApproval) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                    </Form.Item>
                                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Departure Date', 'Return Date']} minDate={moment()} validationrules={['required']} />
                                                </span>
                                                :
                                                (activitydepartureselected) || (flightdeparture && fromApproval) ?
                                                    <span>
                                                        <Form.Item label="Old Departure Date">
                                                            <span className="ant-form-text">{(flightdeparture && flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                        </Form.Item>
                                                        <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" validationrules={['required']} minDate={moment()} maxDate={maxDateDeparture} />
                                                    </span> :
                                                    (activityreturnselected) || (flightreturn && fromApproval) ?
                                                        <span>
                                                            <Form.Item label="Old Return Date">
                                                                <span className="ant-form-text">{(flightreturn && flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                            </Form.Item>
                                                            <DatePickerBase form={this.props.form} labeltext="Return Date" datafield="returndate" validationrules={['required']} minDate={moment(flightdeparture.activitydate)} defaultPickerValue={moment(flightdeparture.activitydate)} />
                                                        </span> : null
                                        }
                                        <InputNumber form={this.props.form} labeltext="No. of Passenger" datafield="adultpassenger" validationrules={[`required`]} min={1} max={maxperson} disabled={true} />
                                    </Col>
                                </Row>
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                    <Button htmlType="submit" type="primary" label="Search"></Button>
                                    {fromApproval ? '' : <Button url={'/member/form/' + this.props.match.params.ID + '/certificateotp/update/' + this.props.match.params.certificateid} htmlType="link" type="default" label="Back" />}
                                </Row>
                            </Form>
                        </Spin>
                    </Row>
                )
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

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));