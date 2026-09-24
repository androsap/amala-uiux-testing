import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest } from '../../../../../../utilities/RequestService';
import ErrorGeneral from '../../../../../error/ErrorGeneral';
import { api } from '../../../../../../config/Services';
import { connect } from "react-redux";
import { getProfile } from '../../../../../../utilities/AuthService';
import { AirlineSelect, CompartmentSelect, OriDesSelect, InputNumber, Button, Alert, SwitchButton, DatePickerBase, DateRangeBase, SubclassSelect } from '../../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import FormUpgrade from './Form';
import moment from 'moment';

const { Title } = Typography;
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
            responseSearchFlight: {},
            flightdeparture: {},
            flightreturn: {}
        }
    }

    componentDidMount() {
        document.title = "Certificate Update - Upgrade | Loyalty Management System";
        this.getDetail();
    }

    getDetail = () => {
        this.componentAirlineSelect.retrieveData();
        this.componentOriDesSelect.retrieveData();

        const { location, fromApproval, result } = this.props;
        const { state } = location || {};
        let { activitydetails, activitydepartureselected, activityreturnselected } = state || {};
        let { flightdeparture, flightreturn } = activitydetails || {};
        const roundtrip = fromApproval ? result.reqdatas.return : (activitydepartureselected && activityreturnselected) ? true : false;
        const adultpassenger = 1;
        const updatetype = result ? result.reqdatas.updatetype.toLowerCase() : '';

        if (fromApproval) {
            if (result.reqdatas.redeemairactivity.length === 2) {
                flightdeparture = result.reqdatas.redeemairactivity.find(o => o.type === 'departure');
                flightreturn = result.reqdatas.redeemairactivity.find(o => o.type === 'return');
            } else if (updatetype === 'departure' && result.reqdatas.redeemairactivity.length === 1) {
                flightdeparture = result.reqdatas.redeemairactivity.find(o => o.type === 'departure');
            } else if (updatetype === 'return' && result.reqdatas.redeemairactivity.length === 1) {
                flightreturn = result.reqdatas.redeemairactivity.find(o => o.type === 'return');
            }
            this.setState({ flightdeparture, flightreturn })
        }

        /* update round trip */
        if (roundtrip) {
            const { airline, origin, destination } = flightdeparture;
            let airlinecode = airline;
            let compartmentcodedepart = fromApproval ? ((flightdeparture.compartment) ? flightdeparture.compartment : null) : ((flightdeparture.compartmentcode) ? flightdeparture.compartmentcode : null);
            let subclasscodedepart = fromApproval ? ((flightdeparture.bookingclass) ? flightdeparture.bookingclass : null) : ((flightdeparture.bookingclasscode) ? flightdeparture.bookingclasscode : null);
            let paidcompartmentcodedepart = (flightdeparture.paidcompartmentcode) ? flightdeparture.paidcompartmentcode : null;
            let paidsubclasscodedepart = (flightdeparture.paidbookingclasscode) ? flightdeparture.paidbookingclasscode : null;

            let compartmentcodereturn = fromApproval ? ((flightreturn.compartment) ? flightreturn.compartment : null) : ((flightreturn.compartmentcode) ? flightreturn.compartmentcode : null);
            let subclasscodereturn = fromApproval ? ((flightreturn.bookingclass) ? flightreturn.bookingclass : null) : ((flightreturn.bookingclasscode) ? flightreturn.bookingclasscode : null);
            let paidcompartmentcodereturn = (flightreturn.paidcompartmentcode) ? flightreturn.paidcompartmentcode : null;
            let paidsubclasscodereturn = (flightreturn.paidbookingclasscode) ? flightreturn.paidbookingclasscode : null;

            /* DEPARTURE */
            this.componentCompartmentDepartSelect.retrieveData({ airlinecode });
            this.componentSubclassDepartSelect.retrieveData({ airlinecode, compartmentcode: compartmentcodedepart });
            this.componentPaidCompartmentDepartSelect.retrieveData({ airlinecode });
            this.componentPaidSubclassDepartSelect.retrieveData({ airlinecode, compartmentcode: paidcompartmentcodedepart });

            /* RETURN */
            this.componentCompartmentReturnSelect.retrieveData({ airlinecode });
            this.componentSubclassReturnSelect.retrieveData({ airlinecode, compartmentcode: compartmentcodereturn });
            this.componentPaidCompartmentReturnSelect.retrieveData({ airlinecode });
            this.componentPaidSubclassReturnSelect.retrieveData({ airlinecode, compartmentcode: paidcompartmentcodereturn });

            this.props.form.setFieldsValue({ airlinecode, compartmentcodedepart, subclasscodedepart, compartmentcodereturn, subclasscodereturn, paidcompartmentcodedepart, paidsubclasscodedepart, paidcompartmentcodereturn, paidsubclasscodereturn, origin, destination, roundtrip, adultpassenger });
        } else {
            //update only departure
            if (activitydepartureselected || updatetype === 'departure') {
                const { airline, origin, destination } = flightdeparture;
                let airlinecode = airline;
                let compartmentcodedepart = fromApproval ? ((flightdeparture.compartment) ? flightdeparture.compartment : null) : ((flightdeparture.compartmentcode) ? flightdeparture.compartmentcode : null);
                let subclasscodedepart = fromApproval ? ((flightdeparture.bookingclass) ? flightdeparture.bookingclass : null) : ((flightdeparture.bookingclasscode) ? flightdeparture.bookingclasscode : null);
                let paidcompartmentcodedepart = (flightdeparture.paidcompartmentcode) ? flightdeparture.paidcompartmentcode : null;
                let paidsubclasscodedepart = (flightdeparture.paidbookingclasscode) ? flightdeparture.paidbookingclasscode : null;

                this.componentCompartmentDepartSelect.retrieveData({ airlinecode });
                this.componentSubclassDepartSelect.retrieveData({ airlinecode, compartmentcode: compartmentcodedepart });
                this.componentPaidCompartmentDepartSelect.retrieveData({ airlinecode });
                this.componentPaidSubclassDepartSelect.retrieveData({ airlinecode, compartmentcode: paidcompartmentcodedepart });
                this.props.form.setFieldsValue({ airlinecode, compartmentcodedepart, subclasscodedepart, paidcompartmentcodedepart, paidsubclasscodedepart, origin, destination, roundtrip, adultpassenger });
            } else if (activityreturnselected || updatetype === 'return') {
                const { airline, origin, destination } = flightreturn;
                let airlinecode = airline;
                let compartmentcodedepart = fromApproval ? ((flightreturn.compartment) ? flightreturn.compartment : null) : ((flightreturn.compartmentcode) ? flightreturn.compartmentcode : null);
                let subclasscodedepart = fromApproval ? ((flightreturn.bookingclass) ? flightreturn.bookingclass : null) : ((flightreturn.bookingclasscode) ? flightreturn.bookingclasscode : null);
                let paidcompartmentcodedepart = (flightreturn.paidcompartmentcode) ? flightreturn.paidcompartmentcode : null;
                let paidsubclasscodedepart = (flightreturn.paidbookingclasscode) ? flightreturn.paidbookingclasscode : null;

                this.componentCompartmentDepartSelect.retrieveData({ airlinecode });
                this.componentSubclassDepartSelect.retrieveData({ airlinecode, compartmentcode: compartmentcodedepart });
                this.componentPaidCompartmentDepartSelect.retrieveData({ airlinecode });
                this.componentPaidSubclassDepartSelect.retrieveData({ airlinecode, compartmentcode: paidcompartmentcodedepart });

                this.props.form.setFieldsValue({ airlinecode, compartmentcodedepart, subclasscodedepart, paidcompartmentcodedepart, paidsubclasscodedepart, origin, destination, roundtrip, adultpassenger });
            }
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                const { location, fromApproval, result } = this.props;
                const { state } = location;
                const { certificatedetails, activitydepartureselected, activityreturnselected, activitydetails } = state || {};
                const { flightdeparture, flightreturn } = activitydetails || {};
                const { awardcode } = (fromApproval) ? result.reqdatas : certificatedetails;

                let memberid = (fromApproval) ? result.memberid : this.props.match.params.ID;
                let username = getProfile().username;
                let adultpassenger = Number.parseInt(input.adultpassenger, 0);
                let flightdata = [];
                let airlinecode = input.airlinecode;
                let origin = input.origin;
                let destination = input.destination;
                let roundtrip = (input.roundtrip) ? input.roundtrip : false;

                let data = {};
                let url = api.url.redemption.getpricelist;
                let requestSearchFlight = { memberid, awardcode, username, adultpassenger, airlinecode, origin, destination, roundtrip };

                /* ROUND TRIP UPDATE */
                if (roundtrip) {
                    let upgrade = {};
                    let departuredate = null;
                    let compartmentcode = null;
                    let bookingclass = null;
                    let paidcompartmentcodedepart = null;
                    let paidbookingclassdepart = null;

                    /* Request Departure */
                    departuredate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;

                    compartmentcode = input.compartmentcodedepart;
                    bookingclass = input.subclasscodedepart;
                    paidcompartmentcodedepart = input.paidcompartmentcodedepart;
                    paidbookingclassdepart = input.paidsubclasscodedepart;
                    upgrade = { paidcompartmentcodedepart, paidbookingclassdepart, paidcompartmentcodereturn: null, paidbookingclassreturn: null };
                    flightdata[0] = { airlinecode, origin, destination, compartmentcode, bookingclass, return: false, departuredate, returndate: null, upgrade };

                    /* Request Return */
                    departuredate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                    origin = input.destination;
                    destination = input.origin;
                    compartmentcode = input.compartmentcodereturn;
                    bookingclass = input.subclasscodereturn;

                    paidcompartmentcodedepart = (roundtrip && input.paidcompartmentcodereturn) ? input.paidcompartmentcodereturn : null;
                    paidbookingclassdepart = (roundtrip && input.paidsubclasscodereturn) ? input.paidsubclasscodereturn : null;
                    upgrade = { paidcompartmentcodedepart, paidbookingclassdepart, paidcompartmentcodereturn: null, paidbookingclassreturn: null };
                    flightdata[1] = { airlinecode, origin, destination, compartmentcode, bookingclass, return: false, departuredate, returndate: null, upgrade };

                    let responseSearchFlight = [];
                    for (const field in flightdata) {
                        data = { awardcode, memberid, username, adultpassenger, flightdata: [flightdata[field]] };

                        await SaveRequest(url, data).then((response) => {
                            const { responsecode, responsemessage } = response.status;
                            if (responsecode.substring(0, 1) === '0') {
                                responseSearchFlight.push(response.result);
                            } else {
                                Alert.error(responsemessage);
                            }
                        })
                    }
                    
                    if (responseSearchFlight.length > 1) {
                        let response = {};

                        const departure = responseSearchFlight[0]['departure'][0] || {}
                        const pricedeparture = responseSearchFlight[0]['departure'][0].price
                        const returns = responseSearchFlight[1]['departure'][0] || {}
                        const pricereturns = responseSearchFlight[1]['departure'][0].price

                        response.awardcode = (responseSearchFlight[0] && responseSearchFlight[0]['awardcode']) ? responseSearchFlight[0]['awardcode'] : null;
                        response.routetype = (responseSearchFlight[0] && responseSearchFlight[0]['routetype']) ? responseSearchFlight[0]['routetype'] : null;
                        response.memberid = (responseSearchFlight[0] && responseSearchFlight[0]['memberid']) ? responseSearchFlight[0]['memberid'] : null;
                        response.tierid = (responseSearchFlight[0] && responseSearchFlight[0]['tierid']) ? responseSearchFlight[0]['tierid'] : null;
                        response.membershipid = (responseSearchFlight[0] && responseSearchFlight[0]['membershipid']) ? responseSearchFlight[0]['membershipid'] : null;
                        response.username = (responseSearchFlight[0] && responseSearchFlight[0]['username']) ? responseSearchFlight[0]['username'] : null;
                        response.branchcode = (responseSearchFlight[0] && responseSearchFlight[0]['branchcode']) ? responseSearchFlight[0]['branchcode'] : null;
                        response.adultpassenger = (responseSearchFlight[0] && responseSearchFlight[0]['adultpassenger']) ? responseSearchFlight[0]['adultpassenger'] : null;
                        response.departure = [{ ...departure, price: (pricedeparture < flightdeparture.price) ? flightdeparture.price : pricedeparture }];
                        response.return = [{ ...returns, price: (pricereturns < flightreturn.price) ? flightreturn.price : pricereturns }];

                        this.setState({ isSuccessSearchFlight: true, requestSearchFlight, responseSearchFlight: response });
                    }

                    this.setState({ isLoading: false });
                } else {
                    let departuredate = null;
                    let returndate = null;
                    let compartmentcode = input.compartmentcodedepart;
                    let bookingclass = input.subclasscodedepart;

                    let upgrade = {};
                    upgrade.paidcompartmentcodereturn = null;
                    upgrade.paidbookingclassreturn = null;
                    upgrade.paidcompartmentcodedepart = input.paidcompartmentcodedepart;
                    upgrade.paidbookingclassdepart = input.paidsubclasscodedepart;

                    if (activitydepartureselected || (result && result.reqdatas.updatetype === 'DEPARTURE')) {
                        departuredate = (input.departuredate) ? moment(input.departuredate).format("YYYY-MM-DD") : null;
                    } else if (activityreturnselected || (result && result.reqdatas.updatetype === 'RETURN')) {
                        departuredate = (input.returndate) ? moment(input.returndate).format("YYYY-MM-DD") : null;
                    }

                    flightdata[0] = { airlinecode, origin, destination, compartmentcode, bookingclass, return: false, departuredate, returndate, upgrade };

                    data = { awardcode, memberid, username, adultpassenger, flightdata };
                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode === '0000') {
                            let responseSearchFlight = response.result;
                            responseSearchFlight.departure = responseSearchFlight.departure.map((val, index) => {
                                if (activitydepartureselected && val.price < flightdeparture.price) {
                                    return { ...responseSearchFlight.departure[index], price: flightdeparture.price }
                                } else if (activityreturnselected && val.price < flightreturn.price) {
                                    return { ...responseSearchFlight.departure[index], price: flightreturn.price }
                                } return { ...responseSearchFlight.departure[index] };
                            });

                            this.setState({ isSuccessSearchFlight: true, requestSearchFlight, responseSearchFlight })
                        } else {
                            Alert.error(responsemessage);
                        }
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

        const { location, fromApproval, result } = this.props;
        const { state } = location || {};
        const { activitydepartureselected, activityreturnselected, activitydetails, certificatedetails, memberprofile, categorycode } = state || {};
        const { flightdeparture, flightreturn } = activitydetails || this.state;
        const { awardcode } = (fromApproval) ? (result.reqdatas) : (certificatedetails === undefined ? {} : certificatedetails);
        const maxDateDeparture = (fromApproval) ? undefined : (flightreturn.activitydate) ? moment(flightreturn.activitydate) : undefined;
        const dataLocation = { state: { priceList: responseSearchFlight, requestSearchFlight: requestSearchFlight, activitydepartureselected: flightdeparture, activityreturnselected: flightreturn, activitydetails: { roundtrip, flightdeparture, flightreturn }, certificatedetails, memberprofile } }

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
        if (isSuccessSearchFlight && fromApproval) {
            return (<FormUpgrade {...this.props} location={dataLocation} handleBackSearchFlight={this.handleBackSearchFlight} />)
        } else if (isSuccessSearchFlight) {
            return (<Redirect to={{ pathname: '/member/form/' + this.props.match.params.ID + '/certificate/update/' + this.props.match.params.certificateid + '/upgrade/buy', state: { priceList: responseSearchFlight, requestSearchFlight: requestSearchFlight, activitydepartureselected, activityreturnselected, activitydetails, certificatedetails, memberprofile, categorycode } }} />)
        } else {
            return (
                <Row>
                    {fromApproval ? '' : <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>Certificate Update</Title>
                        </Col>
                        <Divider />
                    </Row>}
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 3 }} xl={{ span: 14, offset: 3 }}>
                                    <Form.Item label="Award Code">
                                        <span className="ant-form-text">{awardcode}</span>
                                    </Form.Item>
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} onChange={this.handleAirlineChange} disabled={true} />

                                    <CompartmentSelect ref={(e) => { this.componentCompartmentDepartSelect = e }} form={this.props.form} labeltext={(!roundtrip && activityreturnselected) ? "Compartment Return" : "Compartment Depart"} datafield="compartmentcodedepart" validationrules={['required']} disabled={true} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassDepartSelect = e }} form={this.props.form} labeltext={(!roundtrip && activityreturnselected) ? "Subclass Return" : "Subclass Depart"} datafield="subclasscodedepart" validationrules={['required']} disabled={true} />
                                    <CompartmentSelect ref={(e) => { this.componentPaidCompartmentDepartSelect = e }} form={this.props.form} labeltext={(!roundtrip && activityreturnselected) ? "Paid Compartment Return" : "Paid Compartment Depart"} datafield="paidcompartmentcodedepart" validationrules={['required']} disabled={true} />
                                    <SubclassSelect ref={(e) => { this.componentPaidSubclassDepartSelect = e }} form={this.props.form} labeltext={(!roundtrip && activityreturnselected) ? "Paid Subclass Return" : "Paid Subclass Depart"} datafield="paidsubclasscodedepart" validationrules={['required']} disabled={true} />

                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} disabled={true} />
                                    <SwitchButton form={this.props.form} labeltext="Round Trip" datafield="roundtrip" onChange={this.handleRoundTripChange} disabled={true} />

                                    <CompartmentSelect ref={(e) => { this.componentCompartmentReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Compartment Return" datafield="compartmentcodereturn" validationrules={(roundtrip) ? ['required'] : []} disabled={true} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Subclass Return" datafield="subclasscodereturn" validationrules={(roundtrip) ? ['required'] : []} disabled={true} />
                                    <CompartmentSelect ref={(e) => { this.componentPaidCompartmentReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Paid Compartment Return" datafield="paidcompartmentcodereturn" validationrules={(roundtrip) ? ['required'] : []} disabled={true} />
                                    <SubclassSelect ref={(e) => { this.componentPaidSubclassReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Paid Subclass Return" datafield="paidsubclasscodereturn" validationrules={(roundtrip) ? ['required'] : []} disabled={true} />

                                    {
                                        (roundtrip) ?
                                            <span>
                                                <Form.Item label="Old Departure Date">
                                                    <span className="ant-form-text">{(flightdeparture && flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                </Form.Item>
                                                <Form.Item label="Old Return Date">
                                                    <span className="ant-form-text">{(flightreturn && flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                </Form.Item>
                                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Departure Date', 'Return Date']} minDate={moment()} validationrules={['required']} />
                                            </span>
                                            :
                                            (activitydepartureselected || (result && result.reqdatas.updatetype === 'DEPARTURE')) ?
                                                <span>
                                                    <Form.Item label="Old Departure Date">
                                                        <span className="ant-form-text">{(flightdeparture && flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                    </Form.Item>
                                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" validationrules={['required']} minDate={moment()} maxDate={maxDateDeparture} />
                                                </span> :
                                                (activityreturnselected || (result && result.reqdatas.updatetype === 'RETURN')) ?
                                                    <span>
                                                        <Form.Item label="Old Return Date">
                                                            <span className="ant-form-text">{(flightreturn && flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : '-'}</span>
                                                        </Form.Item>
                                                        <DatePickerBase form={this.props.form} labeltext="Return Date" datafield="returndate" validationrules={['required']} minDate={(moment(flightdeparture.activitydate) < moment()) ? moment() : moment(flightdeparture.activitydate)} defaultPickerValue={moment(flightdeparture.activitydate)} />
                                                    </span> : null
                                    }
                                    <InputNumber form={this.props.form} labeltext="No. of Passenger" datafield="adultpassenger" validationrules={[`required`]} min={1} max={maxperson} disabled={true} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="submit" type="primary" label="Search"></Button>
                                {fromApproval ? '' : <Button url={'/member/form/' + this.props.match.params.ID + '/certificate/update/' + this.props.match.params.certificateid} htmlType="link" type="default" label="Back" />}
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));