import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { getProfile } from '../../../../utilities/AuthService';
import { AirlineSelect, CompartmentSelect, OriDesSelect, InputNumber, Button, Alert, SwitchButton, DatePickerBase, DateRangeBase, SubclassSelect, RadioButton } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Alert as AlertAnt } from 'antd';
import { RedemptionTravellerType } from '../../../../data';
import ErrorGeneral from '../../../error/ErrorGeneral';
import moment from 'moment';

const { Title } = Typography;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            formrender: true,
            fieldvalue: {},
            fielddisabled: {
                comparmentfielddisabled: true,
                subclassfielddisabled: true,
                subclassreturnfielddisabled: true
            },
            awardinfo: {},
            isSuccessSearchFlight: false,
            requestSearchFlight: {},
            responseSearchFlight: {}
        }
    }

    async componentDidMount() {
        //title bar on browser
        document.title = "Redemption Upgrade | Loyalty Management System";
        let awardcode = this.props.match.params.awardcode;
        await this.getDetail(awardcode);


        const { state } = this.props.location;
        if (state) {
            const { requestSearchFlight } = state;
            let { airlinecode, paidcompartmentcodedepart, paidcompartmentcodereturn, paidbookingclassdepart, paidbookingclassreturn, origin, destination, roundtrip, adultpassenger, departuredate, returndate, redemptiontravellertype } = requestSearchFlight;
            if (airlinecode) {
                paidcompartmentcodedepart = (paidcompartmentcodedepart) ? paidcompartmentcodedepart : undefined;
                paidcompartmentcodereturn = (paidcompartmentcodereturn) ? paidcompartmentcodereturn : undefined;

                let comparmentfielddisabled = false;
                let subclassfielddisabled = false;
                let subclassreturnfielddisabled = false;

                this.componentCompartmentSelect.retrieveData({ airlinecode });
                this.componentCompartmentReturnSelect.retrieveData({ airlinecode });

                this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode: paidcompartmentcodedepart });
                this.componentSubclassReturnSelect.retrieveData({ airlinecode, compartmentcode: paidcompartmentcodereturn });

                if (roundtrip) {
                    departuredate = (departuredate) ? moment(departuredate) : undefined;
                    returndate = (returndate) ? moment(returndate) : undefined;
                    let date = [departuredate, returndate];
                    this.props.form.setFieldsValue({ date });
                } else {
                    this.props.form.setFieldsValue({ departuredate: moment(departuredate) });
                }

                let paidsubclasscodedepart = (paidbookingclassdepart) ? paidbookingclassdepart : undefined;
                let paidsubclasscodereturn = (paidbookingclassreturn) ? paidbookingclassreturn : undefined;

                this.setState({ fielddisabled: { ...this.state.fielddisabled, comparmentfielddisabled, subclassfielddisabled, subclassreturnfielddisabled } });
                this.props.form.setFieldsValue({ airlinecode, paidcompartmentcodedepart, paidcompartmentcodereturn, paidsubclasscodedepart, paidsubclasscodereturn, origin, destination, roundtrip, adultpassenger, redemptiontravellertype });
            }
        }
    }

    getDetail = (awardcode) => {
        let url = api.url.awardmaster.detailbasicinfo;
        let data = { awardcode };
        //call loader
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let awardinfo = result;
                this.setState({ awardinfo, formrender: true },
                    this.componentAirlineSelect.retrieveData(),
                    this.componentOriDesSelect.retrieveData());
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.match.params.ID;
                let awardcode = this.props.match.params.awardcode;
                let username = getProfile().username;
                let adultpassenger = Number.parseInt(input.adultpassenger, 0);
                let airlinecode = input.airlinecode;
                let paidcompartmentcodedepart = input.paidcompartmentcodedepart;
                let paidbookingclassdepart = input.paidsubclasscodedepart;
                let origin = input.origin;
                let destination = input.destination;
                let roundtrip = (input.roundtrip) ? input.roundtrip : false;
                let paidcompartmentcodereturn = (roundtrip && input.paidcompartmentcodereturn) ? input.paidcompartmentcodereturn : null;
                let paidbookingclassreturn = (roundtrip && input.paidsubclasscodereturn) ? input.paidsubclasscodereturn : null;
                let departuredate = null;
                let returndate = null;
                let upgrade = { paidcompartmentcodedepart, paidbookingclassdepart, paidcompartmentcodereturn, paidbookingclassreturn };

                if (roundtrip) {
                    departuredate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                    returndate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                } else departuredate = (input.departuredate) ? moment(input.departuredate).format("YYYY-MM-DD") : null;

                let flightdata = [{ airlinecode, origin, destination, return: roundtrip, departuredate, returndate, upgrade }];
                let redemptiontravellertype = input.redemptiontravellertype;
                let requestSearchFlight = { memberid, awardcode, username, adultpassenger, airlinecode, origin, destination, roundtrip, departuredate, returndate, paidcompartmentcodedepart, paidbookingclassdepart, paidcompartmentcodereturn, paidbookingclassreturn, redemptiontravellertype };
                let data = { awardcode, memberid, username, adultpassenger, flightdata };
                let url = (this.state.awardinfo.pricingby === 'MANUAL') ? api.url.accrualruleod.list : api.url.redemption.getpricelist;
                if (this.state.awardinfo.pricingby === 'MANUAL') {
                    RetrieveRequest(url, { airlinecode, originairport: origin, destinationairport: destination }, {}, [], {}).then((response) => {
                        const { status, result } = response;
                        if (result && result.length !== 0 && status.responsecode === '0000') {
                            this.setState({ isSuccessSearchFlight: true, requestSearchFlight })
                        } else Alert.error(status.responsemessage ? status.responsemessage : 'Route not available');
                        this.setState({ isLoading: false });
                    })
                } else {
                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode === '0000') {
                            let responseSearchFlight = response.result;
                            this.setState({ isSuccessSearchFlight: true, requestSearchFlight, responseSearchFlight })
                        } else Alert.error(responsemessage);
                        //hide loader
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    };

    handleAirlineChange = (airlinecode) => {
        let paidcompartmentcodedepart = undefined;
        let paidcompartmentcodereturn = undefined;
        let paidsubclasscodedepart = undefined;
        let paidsubclasscodereturn = undefined;
        let comparmentfielddisabled = (airlinecode) ? false : true;
        let subclassfielddisabled = true;
        let subclassreturnfielddisabled = true;
        if (airlinecode) {
            this.componentCompartmentSelect.retrieveData({ airlinecode });
            this.componentCompartmentReturnSelect.retrieveData({ airlinecode });
        }
        this.props.form.setFieldsValue({ paidcompartmentcodedepart, paidcompartmentcodereturn, paidsubclasscodedepart, paidsubclasscodereturn });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, comparmentfielddisabled, subclassfielddisabled, subclassreturnfielddisabled } });
    }

    handleCompartmentChange = (compartmentcode) => {
        let paidsubclasscodedepart = undefined;
        let subclassfielddisabled = (compartmentcode) ? false : true;
        let airlinecode = this.props.form.getFieldValue("airlinecode");
        if (compartmentcode) {
            this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode });
        }

        this.props.form.setFieldsValue({ paidsubclasscodedepart });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclassfielddisabled } });
    }

    handleCompartmentReturnChange = (compartmentcode) => {
        let paidsubclasscodereturn = undefined;
        let subclassreturnfielddisabled = (compartmentcode) ? false : true;
        let airlinecode = this.props.form.getFieldValue("airlinecode");
        if (compartmentcode) {
            this.componentSubclassReturnSelect.retrieveData({ airlinecode, compartmentcode });
        }

        this.props.form.setFieldsValue({ paidsubclasscodereturn });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclassreturnfielddisabled } });
    }

    handleRoundTripChange = () => {
        let paidcompartmentcodereturn = undefined;
        let paidsubclasscodereturn = undefined;
        let subclassreturnfielddisabled = true;

        this.props.form.setFieldsValue({ paidcompartmentcodereturn, paidsubclasscodereturn });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclassreturnfielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { comparmentfielddisabled, subclassfielddisabled, subclassreturnfielddisabled } = this.state.fielddisabled;
        const { isSuccessSearchFlight, requestSearchFlight, responseSearchFlight, awardinfo, formrender } = this.state;
        const roundtrip = this.props.form.getFieldValue('roundtrip');
        const travellerTypeOption = RedemptionTravellerType.find(obj => obj.value === this.props.form.getFieldValue('redemptiontravellertype'));
        const maxperson = awardinfo.maxperson;

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
        if (isSuccessSearchFlight) {
            return (
                <Redirect to={{ pathname: this.props.match.url + '/buy', state: { priceList: responseSearchFlight, requestSearchFlight: requestSearchFlight, awardinfo } }} />
            )
        } else {
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>Redemption Upgrade</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 3 }} xl={{ span: 14, offset: 3 }}>
                                    <RadioButton form={this.props.form} labeltext="Passenger Type" datafield="redemptiontravellertype" validationrules={['required']} options={RedemptionTravellerType} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} onChange={this.handleAirlineChange} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Paid Compartment Depart" datafield="paidcompartmentcodedepart" validationrules={['required']} onChange={this.handleCompartmentChange} sort={{ rank: 'desc' }} disabled={comparmentfielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Paid Subclass Depart" datafield="paidsubclasscodedepart" validationrules={['required']} disabled={subclassfielddisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} />
                                    <SwitchButton form={this.props.form} labeltext="Round Trip" datafield="roundtrip" onChange={this.handleRoundTripChange} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Paid Compartment Return" datafield="paidcompartmentcodereturn" validationrules={(roundtrip) ? ['required'] : []} onChange={this.handleCompartmentReturnChange} sort={{ rank: 'desc' }} disabled={comparmentfielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Paid Subclass Return" datafield="paidsubclasscodereturn" validationrules={(roundtrip) ? ['required'] : []} disabled={subclassreturnfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" className={(roundtrip) ? '' : 'hidden'} placeholder={['Departure Date', 'Return Date']} minDate={moment()} validationrules={(roundtrip) ? ['required'] : []} />
                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" className={(roundtrip) ? 'hidden' : ''} datafield="departuredate" validationrules={(roundtrip) ? [] : ['required']} minDate={moment()} />
                                    {/* {
                                        (roundtrip) ?
                                            <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Departure Date', 'Return Date']} minDate={moment()} validationrules={['required']} />
                                            : <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" validationrules={['required']} minDate={moment()} />
                                    } */}
                                    <InputNumber form={this.props.form} labeltext="No. of Passenger" datafield="adultpassenger" validationrules={[`required`]} min={1} max={maxperson} />
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={7} xl={7}>
                                    {(travellerTypeOption) ? <AlertAnt type="info" showIcon message="Information" description={travellerTypeOption.info} /> : null}
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="submit" type="primary" label="Search"></Button>
                                <Button url={'/member/form/' + this.props.match.params.ID + '/redemption'} htmlType="link" type="default" label="Back" />
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