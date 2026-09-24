import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { getProfile } from '../../../../utilities/AuthService';
import { AirlineSelect, CompartmentSelect, OriDesSelect, InputNumber, Button, Alert, SwitchButton, DatePickerBase, DateRangeBase, SubclassSelect } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';
import FormApproval from './FormApproval';

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
        await this.getDetail();
    }

    getDetail = async () => {
        this.setState({ isLoading: true });
        await DetailRequest(api.url.awardmaster.detailbasicinfo, { awardcode: this.props.awardcode }).then((response) => {
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
        const { activitydate, airline, paidcompartmentcode, paidbookingclasscode, destination, origin } = this.props.result.reqdatas.redeemairactivity.departure[0] || {};
        const paidcompartmentcodereturn = this.props.result.reqdatas.return ? this.props.result.reqdatas.redeemairactivity.return[0].paidcompartmentcode : undefined;
        const paidsubclasscodereturn = this.props.result.reqdatas.return ? this.props.result.reqdatas.redeemairactivity.return[0].paidbookingclasscode : undefined;
        const returndate = this.props.result.reqdatas.return ? this.props.result.reqdatas.redeemairactivity.return[0].activitydate : undefined;
        const roundtrip = this.props.result.reqdatas.return || false;
        const date = [moment(activitydate), moment(returndate)] || [];
        const adultpassenger = this.props.result.reqdatas.redeemuser.length || 1;

        await this.componentCompartmentSelect.retrieveData({ airline });
        await this.componentSubclassSelect.retrieveData({ airlinecode: airline, compartmentcode: paidcompartmentcode, });
        await this.componentCompartmentReturnSelect.retrieveData({ airline });
        await this.componentSubclassReturnSelect.retrieveData({ airlinecode: airline, compartmentcode: paidcompartmentcodereturn, });
        await this.props.form.setFieldsValue({ departuredate: roundtrip ? undefined : moment(activitydate), date, airlinecode: airline, paidcompartmentcodedepart: paidcompartmentcode, paidsubclasscodedepart: paidbookingclasscode, destination, origin, adultpassenger, roundtrip, paidcompartmentcodereturn, paidsubclasscodereturn });
        this.setState({ isLoading: false, fielddisabled: { ...this.state.fielddisabled, comparmentfielddisabled: false, subclassfielddisabled: false } });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.result.memberid;
                let awardcode = this.props.awardcode;
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
                } else {
                    departuredate = (input.departuredate) ? moment(input.departuredate).format("YYYY-MM-DD") : null;
                }
                let flightdata = [];
                flightdata[0] = { airlinecode, origin, destination, return: roundtrip, departuredate, returndate, upgrade }

                let requestSearchFlight = { memberid, awardcode, username, adultpassenger, airlinecode, origin, destination, roundtrip, departuredate, returndate, paidcompartmentcodedepart, paidbookingclassdepart, paidcompartmentcodereturn, paidbookingclassreturn };
                let data = { awardcode, memberid, username, adultpassenger, flightdata };
                let url = api.url.redemption.getpricelist;
                SaveRequest(url, data).then((response) => {
                    const { status = {}, result } = response || {};
                    if (status.responsecode === "0000") {
                        let responseSearchFlight = result;
                        this.setState({ isSuccessSearchFlight: true, requestSearchFlight, responseSearchFlight })
                    } else {
                        Alert.error(status.responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
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

    handleBackSearchFlight = (requestSearchFlight) => {
        this.setState({ isSuccessSearchFlight: false });
        this.getDetail()
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isSuccessSearchFlight, requestSearchFlight, responseSearchFlight, awardinfo, formrender } = this.state;
        const roundtrip = this.props.form.getFieldValue('roundtrip');
        const maxperson = awardinfo.maxperson;
        const location = { state: { priceList: responseSearchFlight, requestSearchFlight: requestSearchFlight, awardinfo } }

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
        if (isSuccessSearchFlight) {
            return (
                <FormApproval {...this.props} location={location} result={this.props.result} awardcode={this.props.awardcode} handleBackSearchFlight={() => this.handleBackSearchFlight()} />
            )
        } else {
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 3 }} xl={{ span: 14, offset: 3 }}>
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} onChange={this.handleAirlineChange} disabled={true} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Paid Compartment Depart" datafield="paidcompartmentcodedepart" validationrules={['required']} onChange={this.handleCompartmentChange} sort={{ rank: 'desc' }} disabled={true} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Paid Subclass Depart" datafield="paidsubclasscodedepart" validationrules={['required']} disabled={true} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} disabled={true} />
                                    <SwitchButton form={this.props.form} labeltext="Round Trip" datafield="roundtrip" onChange={this.handleRoundTripChange} disabled={true} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Paid Compartment Return" datafield="paidcompartmentcodereturn" validationrules={(roundtrip) ? ['required'] : []} onChange={this.handleCompartmentReturnChange} sort={{ rank: 'desc' }} disabled={true} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassReturnSelect = e }} className={(roundtrip) ? '' : 'hidden'} form={this.props.form} labeltext="Paid Subclass Return" datafield="paidsubclasscodereturn" validationrules={(roundtrip) ? ['required'] : []} disabled={true} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" className={(roundtrip) ? '' : 'hidden'} placeholder={['Departure Date', 'Return Date']} minDate={moment()} validationrules={(roundtrip) ? ['required'] : []} />
                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" className={(roundtrip) ? 'hidden' : ''} datafield="departuredate" validationrules={(roundtrip) ? [] : ['required']} minDate={moment()} />
                                    <InputNumber form={this.props.form} labeltext="No. of Passenger" datafield="adultpassenger" validationrules={[`required`]} min={1} max={maxperson} disabled={true} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="submit" type="primary" label="Search"></Button>
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