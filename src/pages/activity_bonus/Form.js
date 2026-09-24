import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputNumber, Button, Alert, TierSelect, ProgramSelect, AirlineSelect, RadioButton, CompartmentSelect, SubclassSelect, DateRangeBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const optionsBookingOn = [
    { label: "Marketing", value: "MARKETING" },
    { label: "Operating", value: "OPERATING" }
]

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                isdefault: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                compartmentcodefielddisabled: true,
                subclasscodefielddisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentTierSelect.retrieveData();
                this.componentProgramSelect.retrieveData();
                this.componentMarketingAirlineSelect.retrieveData();
                this.componentOperatingAirlineSelect.retrieveData({ isoperating: true });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (tieractivitybonusid, actionspage) => {
        let url = api.url.activitybonus.list;
        let criteria = { tieractivitybonusid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let tierid = (result[0].tierid !== undefined) ? result[0].tierid : undefined;
                    let programcode = (result[0].programcode !== undefined) ? result[0].programcode : undefined;
                    let marketingairline = (result[0].marketingairline !== undefined) ? result[0].marketingairline : undefined;
                    let marketingairlinename = (result[0].marketingairlinename !== undefined) ? result[0].marketingairlinename : undefined;
                    let operatingairline = (result[0].operatingairline !== undefined) ? result[0].operatingairline : undefined;
                    let operatingairlinename = (result[0].operatingairlinename !== undefined) ? result[0].operatingairlinename : undefined;
                    let bookingon = (result[0].bookingon !== undefined) ? result[0].bookingon : undefined;
                    let compartmentcode = (result[0].compartmentcode !== undefined) ? result[0].compartmentcode : undefined;
                    let subclasscode = (result[0].compartmentcode !== undefined) ? result[0].subclasscode : undefined;
                    let factor = (result[0].factor !== undefined) ? result[0].factor.toString() : undefined;
                    let effectivedate = (result[0].effectivedate !== undefined) ? moment(result[0].effectivedate) : undefined;
                    let discontinuedate = (result[0].discontinuedate !== undefined) ? moment(result[0].discontinuedate) : undefined;
                    let date = [effectivedate, discontinuedate];

                    let setValue = { tierid, programcode, marketingairline, operatingairline, bookingon, compartmentcode, subclasscode, factor, date };
                    this.props.form.setFieldsValue(setValue);

                    this.componentTierSelect.retrieveData();
                    this.componentProgramSelect.retrieveData();
                    this.componentMarketingAirlineSelect.retrieveData({}, { marketingairline, marketingairlinename }, actionspage);
                    this.componentOperatingAirlineSelect.retrieveData({}, { operatingairline, operatingairlinename }, actionspage);

                    // let airlinecode = (bookingon === 'MARKETING') ? marketingairline : operatingairline;
                    let airlinecode = marketingairline;
                    this.componentCompartmentSelect.retrieveData({ airlinecode });
                    this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode });

                    // let bookingonfielddisabled = (actionspage !== 'view') ? false : true;
                    let compartmentcodefielddisabled = (actionspage !== 'view') ? false : true;
                    let subclasscodefielddisabled = (actionspage !== 'view') ? false : true;

                    this.setState({ fielddisabled: { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled } });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let tierid = input.tierid;
                let programcode = input.programcode;
                let operatingairline = input.operatingairline;
                let marketingairline = input.marketingairline;
                let bookingon = input.bookingon;
                let airlinecode = (bookingon === 'MARKETING') ? marketingairline : operatingairline;
                let compartmentcode = input.compartmentcode;
                let subclasscode = input.subclasscode;
                let factor = (input.factor) ? Number.parseFloat(input.factor, 2) : null;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let data = { tierid, programcode, operatingairline, marketingairline, bookingon, airlinecode, compartmentcode, subclasscode, factor, effectivedate, discontinuedate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.activitybonus.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.activitybonus.update;
                    data.tieractivitybonusid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/activity-bonus');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleIsDefaultOnChange = (value) => {
        let partnercodefielddisabled = value;
        let branchcodefielddisabled = value;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, partnercodefielddisabled, branchcodefielddisabled } });
        this.props.form.setFieldsValue({ partnercode: undefined, branchcode: undefined });
    }

    handleBranchChange = (value) => {
        let partnercodefielddisabled = (value) ? true : false;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, partnercodefielddisabled } });
        this.props.form.setFieldsValue({ partnercode: undefined });
    }

    handlePartnerChange = (value) => {
        let branchcodefielddisabled = (value) ? true : false;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, branchcodefielddisabled } });
        this.props.form.setFieldsValue({ branchcode: undefined });
    }

    handleChangeBookingOn = (event) => {
        let bookingon = event === null ? null : event.target.value;
        let compartmentcode = undefined;
        let subclasscode = undefined;
        let subclasscodefielddisabled = true;
        let airlinecode = null;
        if (bookingon === "MARKETING") {
            airlinecode = this.props.form.getFieldValue('marketingairline');
        } else {
            airlinecode = this.props.form.getFieldValue('operatingairline');
        }

        this.props.form.setFieldsValue({ compartmentcode, subclasscode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, compartmentcodefielddisabled: false, subclasscodefielddisabled } });
        this.componentCompartmentSelect.retrieveData({ airlinecode });
    }

    handleChangeMarketingAirline = (marketingairline) => {
        let compartmentcode = undefined;
        let subclasscode = undefined;
        // let operatingairline = this.props.form.getFieldValue('operatingairline');
        // let bookingonfielddisabled = true;
        // let bookingon = undefined;
        let compartmentcodefielddisabled = (marketingairline) ? false : true;
        let subclasscodefielddisabled = true;
        // if (marketingairline && operatingairline) {
        //     bookingonfielddisabled = false;
        // }
        this.componentCompartmentSelect.retrieveData({ airlinecode: marketingairline });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled } })
        this.props.form.setFieldsValue({ compartmentcode, subclasscode });
    }

    // handleChangeOperatingAirline = (operatingairline) => {
    //     let compartmentcode = undefined;
    //     let subclasscode = undefined;
    //     // let marketingairline = this.props.form.getFieldValue('marketingairline');
    //     // let bookingonfielddisabled = true;
    //     // let bookingon = undefined;
    //     // let compartmentcodefielddisabled = true;
    //     let subclasscodefielddisabled = true;
    //     // if (marketingairline && operatingairline) {
    //     //     bookingonfielddisabled = false;
    //     // }

    //     this.setState({ fielddisabled: { ...this.state.fielddisabled, subclasscodefielddisabled } })
    //     this.props.form.setFieldsValue({ compartmentcode, subclasscode });
    // }

    handleChangeCompartment = (compartmentcode) => {
        let subclasscode = undefined;
        let subclasscodefielddisabled = (compartmentcode) ? false : true;
        let airlinecode = this.props.form.getFieldValue('marketingairline');

        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ subclasscode });
        this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Activity Bonus | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Activity Bonus</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={this.props.form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <ProgramSelect ref={(e) => { this.componentProgramSelect = e }} form={this.props.form} labeltext="Program" datafield="programcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentMarketingAirlineSelect = e }} form={this.props.form} labeltext="Marketing Airline" datafield="marketingairline" onChange={this.handleChangeMarketingAirline} validationrules={['required']} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentOperatingAirlineSelect = e }} form={this.props.form} labeltext="Operating Airline" datafield="operatingairline" validationrules={['required']} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="Booking On" datafield="bookingon" options={optionsBookingOn} validationrules={['required']} disabled={generalfielddisabled} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" onChange={this.handleChangeCompartment} validationrules={['required']} disabled={compartmentcodefielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Booking Class" datafield="subclasscode" validationrules={['required']} disabled={subclasscodefielddisabled} />
                                    <InputNumber form={this.props.form} labeltext="Factor" datafield="factor" validationrules={['required', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
                                <Button url="/activity-bonus" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));