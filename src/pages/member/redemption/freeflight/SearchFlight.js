import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { getProfile } from '../../../../utilities/AuthService';
import { AirlineSelect, CompartmentSelect, OriDesSelect, InputNumber, Button, Alert, SwitchButton, DatePickerBase, DateRangeBase, SubclassSelect } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import ErrorGeneral from '../../../error/ErrorGeneral';
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
            fieldvalue: {},
            fielddisabled: {
                comparmentfielddisabled: true,
                subclassfielddisabled: true
            },
            awardinfo: {},
            isSuccessSearchFlight: false,
            requestSearchFlight: {},
            responseSearchFlight: {}
        }
    }

    async componentDidMount() {
        //title bar on browser
        document.title = "Redemption Freeflight | Loyalty Management System";
        const { state } = this.props.location;
        let awardcode = this.props.match.params.awardcode;

        await this.getDetail(awardcode);
        if (state) {
            const { requestSearchFlight } = state;
            let { airlinecode, compartmentcode, bookingclass, origin, destination, roundtrip, adultpassenger, departuredate, returndate } = requestSearchFlight;
            if (airlinecode) {
                let comparmentfielddisabled = false;
                let subclassfielddisabled = false;

                this.componentCompartmentSelect.retrieveData({ airlinecode });
                this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode, spendmiles: true });

                if (roundtrip) {
                    departuredate = (departuredate) ? moment(departuredate) : undefined;
                    returndate = (returndate) ? moment(returndate) : undefined;
                    let date = [departuredate, returndate];
                    this.props.form.setFieldsValue({ date });
                } else this.props.form.setFieldsValue({ departuredate: moment(departuredate) });

                bookingclass = (bookingclass) ? bookingclass : undefined;

                this.setState({ fielddisabled: { ...this.state.fielddisabled, comparmentfielddisabled, subclassfielddisabled } });
                this.props.form.setFieldsValue({ airlinecode, compartmentcode, subclasscode: bookingclass, origin, destination, roundtrip, adultpassenger });
            }
        }
    }

    getDetail = (awardcode) => {
        let url = api.url.awardmaster.detailbasicinfo;
        let data = { awardcode };
        //call loader
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                let awardinfo = result;
                this.setState({ awardinfo, formrender: true },
                    this.componentAirlineSelect.retrieveData(),
                    this.componentOriDesSelect.retrieveData());
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
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
                } else departuredate = (input.departuredate) ? moment(input.departuredate).format("YYYY-MM-DD") : null;

                let flightdata = [{ airlinecode, compartmentcode, origin, destination, bookingclass, return: roundtrip, departuredate, returndate }];
                let requestSearchFlight = { memberid, awardcode, username, adultpassenger, airlinecode, bookingclass, compartmentcode, origin, destination, roundtrip, departuredate, returndate };
                let data = { awardcode, memberid, username, adultpassenger, flightdata };
                let url = (this.state.awardinfo.pricingby === 'MANUAL') ? api.url.accrualruleod.list : api.url.redemption.getpricelist;

                if (this.state.awardinfo.pricingby === 'MANUAL') {
                    RetrieveRequest(url, { airlinecode, originairport: origin, destinationairport: destination }, {}, [], {}).then((response) => {
                        const { status, result } = response;
                        if (result && result.length !== 0 && status.responsecode === '0000') {
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
                        //hide loader
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    };

    handleAirlineChange = (airlinecode) => {
        let compartmentcode = undefined;
        let subclasscode = undefined;
        let comparmentfielddisabled = (airlinecode) ? false : true;
        let subclassfielddisabled = true;
        if (airlinecode) {
            this.componentCompartmentSelect.retrieveData({ airlinecode });
        }
        this.props.form.setFieldsValue({ compartmentcode, subclasscode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, comparmentfielddisabled, subclassfielddisabled } });
    }

    handleCompartmentChange = (compartmentcode) => {
        let subclasscode = undefined;
        let subclassfielddisabled = (compartmentcode) ? false : true;
        let airlinecode = this.props.form.getFieldValue("airlinecode");
        if (compartmentcode) {
            this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode, spendmiles: true });
        }

        this.props.form.setFieldsValue({ subclasscode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclassfielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { comparmentfielddisabled, subclassfielddisabled } = this.state.fielddisabled;
        const { isSuccessSearchFlight, requestSearchFlight, responseSearchFlight, awardinfo, formrender } = this.state;
        const roundtrip = this.props.form.getFieldValue('roundtrip');
        const maxperson = awardinfo.maxperson;
        const manualPricing = awardinfo.pricingby === 'MANUAL';

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
                            <Title level={4}>Redemption Freeflight</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} onChange={this.handleAirlineChange} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" validationrules={['required']} onChange={this.handleCompartmentChange} sort={{ rank: 'desc' }} disabled={comparmentfielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Subclass" datafield="subclasscode" validationrules={(manualPricing) ? ['required'] : []} disabled={subclassfielddisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} />
                                    <SwitchButton form={this.props.form} labeltext="Round Trip" datafield="roundtrip" />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" className={(roundtrip) ? '' : 'hidden'} placeholder={['Departure Date', 'Return Date']} minDate={moment()} validationrules={(roundtrip) ? ['required'] : []} />
                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" className={(roundtrip) ? 'hidden' : ''} datafield="departuredate" validationrules={(roundtrip) ? [] : ['required']} minDate={moment()} />
                                    {/* {
                                        (roundtrip) ?
                                            <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Departure Date', 'Return Date']} minDate={moment()} validationrules={['required']} />
                                            : <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" validationrules={['required']} minDate={moment()} />
                                    } */}
                                    <InputNumber form={this.props.form} labeltext="No. of Passenger" datafield="adultpassenger" validationrules={[`required`]} min={1} max={maxperson} />
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