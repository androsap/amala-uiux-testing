import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { getProfile } from '../../../../utilities/AuthService';
import { AirlineSelect, CompartmentSelect, OriDesSelect, InputNumber, Button, Alert, SwitchButton, DatePickerBase, DateRangeBase, SubclassSelect } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Statistic, Typography } from 'antd';
import moment from 'moment';
import FormApproval from './FormApproval';

const { Title, Text } = Typography;
const { Countdown } = Statistic;
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
        await this.getDetail();
        await this.props.retrieveSession();
    }

    getDetail = async () => {
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
        const { activitydate, airline, bookingclass, compartment, destination, origin } = this.props.result.reqdatas.redeemairactivity.departure[0] || {};
        const returndate = this.props.result.reqdatas.return ? this.props.result.reqdatas.redeemairactivity.return[0].activitydate : undefined;
        const roundtrip = this.props.result.reqdatas.return || false;
        const date = [moment(activitydate), moment(returndate)] || [];
        const adultpassenger = this.props.result.reqdatas.redeemuser.length || 1;

        await this.componentCompartmentSelect.retrieveData({ airline });
        await this.componentSubclassSelect.retrieveData({ airlinecode: airline, compartmentcode: compartment, spendmiles: true });
        await this.props.form.setFieldsValue({ departuredate: roundtrip ? undefined : moment(activitydate), date, airlinecode: airline, compartmentcode: compartment, subclasscode: bookingclass, destination, origin, adultpassenger, roundtrip });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, comparmentfielddisabled: false, subclassfielddisabled: false } });
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
                    departuredate = (input.departuredate) ? moment(input.departuredate).format("YYYY-MM-DD") : null;
                }
                let flightdata = [];
                let requestSearchFlight = {};
                if (moment(departuredate) < moment()) {
                    flightdata[0] = { airlinecode, compartmentcode, origin, destination, bookingclass, return: roundtrip, departuredate: moment().format("YYYY-MM-DD"), returndate };
                    requestSearchFlight = { memberid, awardcode, username, adultpassenger, airlinecode, bookingclass, compartmentcode, origin, destination, roundtrip, departuredate: moment().format("YYYY-MM-DD"), returndate };
                } else {
                    flightdata[0] = { airlinecode, compartmentcode, origin, destination, bookingclass, return: roundtrip, departuredate, returndate };
                    requestSearchFlight = { memberid, awardcode, username, adultpassenger, airlinecode, bookingclass, compartmentcode, origin, destination, roundtrip, departuredate, returndate };
                }

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

    handleBackSearchFlight = () => {
        this.setState({ isSuccessSearchFlight: false });
        this.getDetail();
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
        const { validate, countdown } = this.props;

        <><Countdown value={countdown} format="mm:ss" onFinish={this.props.retrieveFinish} className={'hidden'} />
        </>
        if (validate) {
            if (!formrender) {
                return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
            }
            if (isSuccessSearchFlight) {
                return (
                    <FormApproval {...this.props} location={location} result={this.props.result} handleBackSearchFlight={this.handleBackSearchFlight} />
                )
            } else {
                return (
                    <Row>
                        <Spin spinning={this.state.isLoading}>
                            <Form {...formItemLayout} onSubmit={this.saveAction}>
                                <Row gutter={24}>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                        <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} onChange={this.handleAirlineChange} disabled={true} />
                                        <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" validationrules={['required']} onChange={this.handleCompartmentChange} sort={{ rank: 'desc' }} disabled={true} />
                                        <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Subclass" datafield="subclasscode" disabled={true} />
                                        <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} disabled={true} />
                                        <SwitchButton form={this.props.form} labeltext="Round Trip" datafield="roundtrip" disabled={true} />
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
        } else {
            return (
                <><Row gutter={24} type="flex" justify="center">
                    <Title level={2} style={{ textAlign: 'center', marginTop: 350 }} className={''}>This page need OTP Authentication, please back to Redemption page</Title>
                </Row><Row gutter={24} type="flex" justify="center">
                        <Button url={'/member/form/' + this.props.match.params.ID + '/redemptionotp'} htmlType="link" type="default" label="Back" />
                    </Row></>
            )
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));