import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../../../utilities/RequestService';
import { api } from '../../../../../config/Services';
import ErrorGeneral from '../../../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, SelectBase, DatePickerBase, SwitchButton, SubclassSelect, OriDesSelect, AirlineSelect } from '../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Empty, Tooltip, Icon, Table } from 'antd';
import moment from 'moment';
import { formatNumber } from '../../../../../utilities/Helpers';

const { Title } = Typography;
const { Column } = Table;

const optionsCheckinType = [
    { label: "AUTO", value: "AUTO" },
    { label: "DESK", value: "DESK" },
    { label: "INTERNET", value: "INTERNET" }
]
const optionsBookingType = [
    { label: "INTERNET", value: "INTERNET" },
    { label: "DESK", value: "DESK" },
    { label: "PHONE", value: "PHONE" }
]
const optionsBookingChannel = [
    { label: "ALL", value: "ALL" },
    { label: "WEBSITE", value: "WEBSITE" },
    { label: "MOBILE", value: "MOBILE" }
]
const optionsPaymentType = [
    { label: "FQTV", value: "FQTV" },
    { label: "FQTR", value: "FQTR" },
    { label: "FQTU", value: "FQTU" }
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
                activitystatus: null,
                retroclaimid: null,
                activityinfo: null,
                transactioninfo: [],
                trxdate: null,
                trxtype: null,
                status: null,
                paymenttype: null,
                activitytype: 'nonair',
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                marketingairlinedisabled: true,
                marketingfltnumdisabled: true,
                bookingclassdisabled: true,
                operatingfltnumdisabled: true,
                flownclassdisabled: true,
                oridesdisabled: true
            },
            actionType: null
        }
    };

    checkPermission() {
        let id = this.props.match.params.activityid;
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
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentMarAirlineSelect.retrieveData();
                this.componentOprAirlineSelect.retrieveData({ isoperating: true });
            }
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = (activityid, actionspage) => {
        let url = api.url.memberactivity.detail;
        let data = { activityid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    const { activityidpromo } = result || {};

                    let activityinfo = (result.activityinfo) ? result.activityinfo : null;
                    let activitydate = (result.activitydate) ? moment(result.activitydate) : null;
                    let dateofissue = (result.dateofissue) ? moment(result.dateofissue) : null;
                    let marketingairlinecode = (result.marketingairlinecode) ? result.marketingairlinecode : null;
                    let marketingairlinename = (result.marketingairlinename) ? result.marketingairlinename : null;
                    let marketingflightnumber = (result.marketingflightnumber) ? result.marketingflightnumber : null;
                    let bookingclass = (result.bookingclass) ? result.bookingclass : null;
                    let operatingairlinecode = (result.operatingairlinecode) ? result.operatingairlinecode : null;
                    let operatingairlinename = (result.operatingairlinename) ? result.operatingairlinename : null;
                    let operatingflightnumber = (result.operatingflightnumber) ? result.operatingflightnumber : null;
                    let flownclass = (result.flownclass) ? result.flownclass : null;
                    let origin = (result.origin) ? result.origin : null;
                    let origincityname = (result.originairport && result.originairport.cityname) ? result.originairport.cityname : null;
                    let originairportname = (result.originairport && result.originairport.airportname) ? result.originairport.airportname : null;
                    let destination = (result.destination) ? result.destination : null;
                    let destinationcityname = (result.destinationairport && result.destinationairport.cityname) ? result.destinationairport.cityname : null;
                    let destinationairportname = (result.destinationairport && result.destinationairport.airportname) ? result.destinationairport.airportname : null;
                    let delayeddays = (result.delayeddays) ? result.delayeddays.toString() : 0;
                    let delayedhours = (result.delayedhours) ? result.delayedhours.toString() : 0;
                    let vouchernumber = (result.vouchernumber) ? result.vouchernumber : null;
                    let recordlocator = (result.recordlocator) ? result.recordlocator : null;
                    let ticketnumber = (result.ticketnumber) ? result.ticketnumber : null;
                    let couponnumber = (result.couponnumber) ? result.couponnumber : null;
                    let promocode = (result.promocode) ? result.promocode : null;
                    let seatnumber = (result.seatnumber) ? result.seatnumber : null;
                    let boardingnumber = (result.boardingnumber) ? result.boardingnumber : null;
                    let cardnumber = (result.cardnumber) ? result.cardnumber : null;
                    let checkintype = (result.checkintype) ? result.checkintype : null;
                    let bookingtype = (result.bookingtype) ? result.bookingtype : null;
                    let bookingchannel = (result.bookingchannel) ? result.bookingchannel : null;
                    let refdate = (result.refdate) ? moment(result.refdate) : null;
                    let refcode = (result.refcode) ? result.refcode : null;
                    let bookingpersonalias = (result.bookingpersonalias) ? result.bookingpersonalias : null;
                    let salesoffice = (result.salesoffice) ? result.salesoffice : null;
                    let paymentcardnumber = (result.paymentcardnumber) ? result.paymentcardnumber : null;
                    let paymenttype = (result.paymenttype) ? result.paymenttype : null;
                    let lostbaggage = (result.lostbaggage) ? result.lostbaggage : false;
                    let retroclaimid = (result.retroclaimid) ? result.retroclaimid : '-';
                    let status = (result.status) ? result.status : null;
                    let farebasiscode = (result.farebasiscode) ? result.farebasiscode : null;

                    let transactioninfo = (result.transactioninfo !== undefined && result.transactioninfo.length) ? result.transactioninfo.filter(val => val.trxtype === 'EARNING') : [];
                    let trxid = (transactioninfo[0]) ? transactioninfo[0].trxid : "";
                    let trxdate = (transactioninfo[0]) ? moment(transactioninfo[0].trxdate) : null;
                    let trxtype = (transactioninfo[0]) ? transactioninfo[0].trxtype : null;
                    let awardmiles = (transactioninfo[0]) ? transactioninfo[0].awardmiles : 0;
                    let tiermiles = (transactioninfo[0]) ? transactioninfo[0].tiermiles : 0;
                    let frequency = (transactioninfo[0]) ? transactioninfo[0].frequency : 0;

                    let setValue = {
                        activityid, cardnumber, activitydate, dateofissue, marketingairlinecode, marketingflightnumber, operatingairlinecode,
                        operatingflightnumber, origin, destination, bookingclass, flownclass, delayeddays, delayedhours,
                        vouchernumber, recordlocator, ticketnumber, couponnumber, promocode, seatnumber, boardingnumber, checkintype, bookingtype, bookingchannel, refcode, refdate,
                        bookingpersonalias, salesoffice, paymentcardnumber, paymenttype, lostbaggage, retroclaimid,
                        trxid, trxdate, trxtype, awardmiles, tiermiles, frequency, farebasiscode
                    };
                    this.props.form.setFieldsValue(setValue);

                    let activitystatus = (result.status) ? result.status : undefined;

                    let marketingairlinedisabled = false;
                    let marketingfltnumdisabled = false;
                    let bookingclassdisabled = false;
                    let operatingfltnumdisabled = false;
                    let flownclassdisabled = false;
                    let oridesdisabled = false;
                    if (activitystatus === 'INACTIVE') {
                        let titlepage = 'View';
                        let specialfielddisabled = true;
                        let generalfielddisabled = true;
                        marketingairlinedisabled = true;
                        marketingfltnumdisabled = true;
                        bookingclassdisabled = true;
                        operatingfltnumdisabled = true;
                        flownclassdisabled = true;
                        oridesdisabled = true;
                        this.setState({
                            titlepage, fielddisabled: {
                                ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled
                            }
                        });
                    } else {
                        marketingairlinedisabled = (result.marketingairlinecode && actionspage !== 'view') ? false : true;
                        marketingfltnumdisabled = (result.marketingflightnumber && actionspage !== 'view') ? false : true;
                        bookingclassdisabled = (result.bookingclass && actionspage !== 'view') ? false : true;
                        operatingfltnumdisabled = (result.operatingflightnumber && actionspage !== 'view') ? false : true;
                        flownclassdisabled = (result.flownclass && actionspage !== 'view') ? false : true;
                        oridesdisabled = (result.origin && result.destination && actionspage !== 'view') ? false : true;
                    }

                    let fieldvalue = { trxid, retroclaimid, activityinfo, status, transactioninfo, trxtype, paymenttype, activitystatus, activityidpromo };
                    let fielddisabled = { ...this.state.fielddisabled, marketingairlinedisabled, marketingfltnumdisabled, bookingclassdisabled, operatingfltnumdisabled, flownclassdisabled, oridesdisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    if (activityidpromo) this.getActivityIDPromoDetail(activityidpromo);
                    this.componentMarAirlineSelect.retrieveData({}, { marketingairlinecode, marketingairlinename }, actionspage);
                    this.componentOprAirlineSelect.retrieveData({ isoperating: true }, { operatingairlinecode, operatingairlinename }, actionspage);
                    this.componentSubclassSelect.retrieveData({ airlinecode: marketingairlinecode }, { bookingclass }, actionspage);
                    this.componentFlownclassSelect.retrieveData({ airlinecode: operatingairlinecode }, { flownclass }, actionspage);
                    this.componentOriDesSelect.retrieveData({}, { origin, origincityname, originairportname, destination, destinationcityname, destinationairportname }, actionspage);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    };

    getActivityIDPromoDetail = (activityidpromo) => {
        this.setState({ isLoading: true });

        DetailRequest(api.url.memberactivity.detail, { activityid: activityidpromo }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    const { activitytype } = result || {};
                    const fieldvalue = { ...this.state.fieldvalue, activitytype: activitytype.replaceAll('_', '').toLowerCase() };

                    this.setState({ fieldvalue, isLoading: false });
                };
            };
        });
    };

    saveAction = (e, type) => {
        e.preventDefault();
        const { actionspage, fieldvalue } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true, actionType: type });
                //define parameter
                let activityid = this.props.match.params.activityid;
                let memberid = this.props.match.params.ID;
                let activityinfo = this.state.fieldvalue.activityinfo;
                let cardnumber = (input.cardnumber) ? input.cardnumber : null;
                let activitydate = (input.activitydate) ? moment(input.activitydate).format("YYYY-MM-DD") : null;
                let dateofissue = (input.dateofissue) ? moment(input.dateofissue).format("YYYY-MM-DD") : null;
                let marketingairlinecode = (input.marketingairlinecode) ? input.marketingairlinecode : null;
                let marketingflightnumber = (input.marketingflightnumber) ? input.marketingflightnumber.toUpperCase() : null;
                let bookingclass = (input.bookingclass) ? input.bookingclass : null;
                let operatingairlinecode = (input.operatingairlinecode) ? input.operatingairlinecode : null;
                let operatingflightnumber = (input.operatingflightnumber) ? input.operatingflightnumber.toUpperCase() : null;
                let flownclass = (input.flownclass) ? input.flownclass : null;
                let origin = (input.origin) ? input.origin : null;
                let destination = (input.destination) ? input.destination : null;
                let delayeddays = (input.delayeddays) ? input.delayeddays : null;
                let delayedhours = (input.delayedhours) ? input.delayedhours : null;
                let vouchernumber = (input.vouchernumber) ? input.vouchernumber : null;
                let recordlocator = (input.recordlocator) ? input.recordlocator : null;
                let ticketnumber = (input.ticketnumber) ? input.ticketnumber : null;
                let couponnumber = (input.couponnumber) ? input.couponnumber : null;
                let promocode = (input.promocode) ? input.promocode : null;
                let seatnumber = (input.seatnumber) ? input.seatnumber : null;
                let boardingnumber = (input.boardingnumber) ? input.boardingnumber : null;
                let checkintype = (input.checkintype) ? input.checkintype : null;
                let bookingtype = (input.bookingtype) ? input.bookingtype : null;
                let bookingchannel = (input.bookingchannel) ? input.bookingchannel : null;
                let refcode = (input.refcode) ? input.refcode : null;
                let refdate = (input.refdate) ? moment(input.refdate).format("YYYY-MM-DD") : null;
                let bookingpersonalias = (input.bookingpersonalias) ? input.bookingpersonalias.toUpperCase() : null;
                let salesoffice = (input.salesoffice) ? input.salesoffice.toUpperCase() : null;
                let paymentcardnumber = (input.paymentcardnumber && input.paymentcardnumber) ? input.paymentcardnumber : null;
                let paymenttype = (input.paymenttype) ? input.paymenttype : null;
                let lostbaggage = (input.lostbaggage) ? input.lostbaggage : false;
                let retroclaimid = (input.retroclaimid) ? input.retroclaimid : null;
                let activitytype = 'AIR';
                let namecheck = (type === 'rating-name') ? true : false;
                let oldactivityid = activityid;
                let newactivityid = null;
                let activitycode = null;
                let customtrxcode = null;
                let basemiles = 0;
                let classofservicebonus = 0;
                let elitetierbonusmiles = 0;
                let promotionalbonusmiles = 0;
                let awardmiles = (input.awardmiles) ? input.awardmiles : 0;
                let tiermiles = (input.tiermiles) ? input.tiermiles : 0;
                let frequency = (input.frequency) ? input.frequency : 0;
                let trxdate = moment(new Date()).format("YYYY-MM-DD");
                let manualintervention = true;
                let farebasiscode = (input.farebasiscode) ? input.farebasiscode : null;

                let data = {};
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    data = {
                        activitydate, dateofissue, cardnumber, memberid, retroclaimid, marketingairlinecode, marketingflightnumber, manualintervention,
                        operatingairlinecode, operatingflightnumber, origin, destination, bookingclass, flownclass, paymenttype, lostbaggage,
                        delayedhours, delayeddays, vouchernumber, recordlocator, ticketnumber, couponnumber, promocode, seatnumber, boardingnumber,
                        checkintype, bookingtype, bookingchannel, refcode, refdate, namecheck, bookingpersonalias, salesoffice, paymentcardnumber,
                        activityidpromo: fieldvalue.activityidpromo, farebasiscode
                    };
                    message = 'New data has been created';
                    url = api.url.memberairactivity.createwithrating;
                } else {
                    message = 'Data has been updated';
                    if (type === 'make-correction') {
                        url = api.url.membertransaction.earningcorrection;
                        newactivityid = activityid;
                        data = {
                            memberid, oldactivityid, newactivityid, activitycode, customtrxcode, trxdate, awardmiles, tiermiles, frequency, basemiles,
                            classofservicebonus, elitetierbonusmiles, promotionalbonusmiles
                        }
                    } else {
                        url = api.url.memberairactivity.updatewithrating;
                        data = {
                            memberid, activityid, activityinfo, cardnumber, activitytype, activitydate, dateofissue, marketingairlinecode, marketingflightnumber,
                            operatingairlinecode, operatingflightnumber, origin, destination, bookingclass, flownclass,
                            delayeddays, delayedhours, vouchernumber, recordlocator, ticketnumber, couponnumber, promocode, seatnumber, boardingnumber,
                            checkintype, bookingtype, bookingchannel, refcode, refdate, bookingpersonalias, salesoffice, paymentcardnumber,
                            paymenttype, lostbaggage, namecheck, retroclaimid, manualintervention, farebasiscode
                        };
                    }
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                        this.props.history.push('/member/form/' + this.props.match.params.ID + '/activity');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleMarAirlineChange = (airlinecode) => {
        let marketingflightnumber = undefined;
        let bookingclass = undefined;
        let origin = undefined;
        let destination = undefined;
        let marketingfltnumdisabled = (airlinecode) ? false : true;
        let bookingclassdisabled = (airlinecode) ? false : true;
        let oridesdisabled = (airlinecode) ? false : true;

        this.componentSubclassSelect.retrieveData({ airlinecode });
        this.componentOriDesSelect.retrieveData();
        // this.componentOriDesSelect.retrieveData({ airlinecode }); 
        this.setState({ fielddisabled: { ...this.state.fielddisabled, marketingfltnumdisabled, bookingclassdisabled, oridesdisabled } });
        this.props.form.setFieldsValue({ marketingflightnumber, bookingclass, origin, destination });
    };

    handleOprAirlineChange = (airlinecode) => {
        let operatingflightnumber = undefined;
        let flownclass = undefined;
        let operatingfltnumdisabled = (airlinecode) ? false : true;
        let flownclassdisabled = (airlinecode) ? false : true;

        this.componentFlownclassSelect.retrieveData({ airlinecode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, operatingfltnumdisabled, flownclassdisabled } });
        this.props.form.setFieldsValue({ operatingflightnumber, flownclass });
    };

    onChangePaymentType = (value) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, paymenttype: value } })
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { form, match, menucode, prefixmenuname, cardnumber } = this.props;
        const { isLoading, titlepage, actionspage, formrender, actionType, fielddisabled, fieldvalue } = this.state;
        const { generalfielddisabled, marketingfltnumdisabled, bookingclassdisabled, operatingfltnumdisabled, flownclassdisabled, oridesdisabled } = fielddisabled;
        const { retroclaimid, transactioninfo, trxtype, trxid, status, paymenttype, activitystatus, activityidpromo, activitytype, activityinfo } = fieldvalue;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Air Activity | Loyalty Management System";
            //render form
            return (
                <>
                    <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Air Activity</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                    <DatePickerBase form={form} labeltext="Activity Date" datafield="activitydate" validationrules={['required']} maxDate={moment()} disabled={generalfielddisabled} />
                                    {(actionspage !== 'create' && activityidpromo) ? <Form.Item label="Activity ID Promo">
                                        <Tooltip title={'Activity ID Promo Reference'}>
                                            <a href={`/member/form/${match.params.ID}/activity/${activitytype}/form/${activityidpromo}`}>{activityidpromo}</a>
                                        </Tooltip>&nbsp;&nbsp;&nbsp;
                                        <Icon type="link" style={{ color: '#03a9f4' }} />
                                    </Form.Item> : null}
                                    <DatePickerBase form={form} labeltext="Date of Issue" datafield="dateofissue" disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentMarAirlineSelect = e }} form={form} labeltext="Marketing Airline" datafield="marketingairlinecode" validationrules={['required']} onChange={this.handleMarAirlineChange} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Marketing Flight Number" placeholder="5 Digits" datafield="marketingflightnumber" validationrules={['required', 'pattern.number']} maxLength={5} disabled={marketingfltnumdisabled} getValueFromEvent={(e) => { return e.target.value.replace(/^0+/, ''); }} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={form} labeltext="Booking Class" datafield="bookingclass" validationrules={['required']} disabled={bookingclassdisabled} />
                                    <AirlineSelect ref={(e) => { this.componentOprAirlineSelect = e }} form={form} labeltext="Operating Airline" datafield="operatingairlinecode" onChange={this.handleOprAirlineChange} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Operating Flight Number" placeholder="5 Digits" datafield="operatingflightnumber" validationrules={['pattern.number']} maxLength={5} disabled={operatingfltnumdisabled} getValueFromEvent={(e) => { return e.target.value.replace(/^0+/, ''); }} />
                                    <SubclassSelect ref={(e) => { this.componentFlownclassSelect = e }} form={form} labeltext="Flown Class" datafield="flownclass" disabled={flownclassdisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={form} validationrules={['required', 'required']} disabled={oridesdisabled} />
                                    <InputText form={form} labeltext="Delayed Days" datafield="delayeddays" validationrules={['pattern.number']} maxLength={15} disabled={generalfielddisabled} suffix="Days" />
                                    <InputText form={form} labeltext="Delayed Hours" datafield="delayedhours" validationrules={['pattern.number']} maxLength={15} disabled={generalfielddisabled} suffix="Hours" />
                                    <InputText form={form} labeltext="Voucher Number" datafield="vouchernumber" maxLength={45} validationrules={(paymenttype === 'FQTR') ? ['required', 'pattern.number'] : []} className={(paymenttype === 'FQTR') ? '' : 'hidden'} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="PNR" datafield="recordlocator" validationrules={['pattern.alphanumeric']} maxLength={10} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Ticket Number" datafield="ticketnumber" validationrules={['required', 'pattern.number']} maxLength={13} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Coupon Number" datafield="couponnumber" validationrules={['pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Promo Code" datafield="promocode" validationrules={['pattern.alphanumeric']} maxLength={20} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Seat Number" datafield="seatnumber" validationrules={['pattern.alphanumeric']} maxLength={5} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Boarding Number" datafield="boardingnumber" validationrules={['pattern.alphanumeric']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Card Number" datafield="cardnumber" defaultValue={cardnumber} validationrules={['required', 'pattern.number']} maxLength={45} disabled />
                                    <SelectBase form={form} labeltext="Check-In Type" datafield="checkintype" options={optionsCheckinType} disabled={generalfielddisabled} />
                                    <SelectBase form={form} labeltext="Booking Type" datafield="bookingtype" options={optionsBookingType} disabled={generalfielddisabled} />
                                    <SelectBase form={form} labeltext="Booking Channel" datafield="bookingchannel" options={optionsBookingChannel} disabled={generalfielddisabled} />
                                    <DatePickerBase form={form} labeltext="Reference Date" datafield="refdate" minDate={moment(new Date())} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Reference Code" datafield="refcode" validationrules={['pattern.alphanumericspace']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Booking Person Alias" datafield="bookingpersonalias" validationrules={(actionType === 'rating-name') ? ['required', 'pattern.letterslashspace'] : ['pattern.letterslashspace']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Sales Office" datafield="salesoffice" validationrules={['pattern.letter']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Payment Card Number" datafield="paymentcardnumber" validationrules={['pattern.alphanumeric']} maxLength={45} disabled={generalfielddisabled} />
                                    <SelectBase form={form} labeltext="Payment Type" datafield="paymenttype" options={optionsPaymentType} onChange={this.onChangePaymentType} disabled={generalfielddisabled} />
                                    <SwitchButton form={form} labeltext="Lost Baggage?" datafield="lostbaggage" disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Retro Claim" datafield="retroclaimid" defaultValue={retroclaimid} className={(actionspage === 'create') ? 'hidden' : ''} disabled />
                                    <InputText form={form} labeltext="Fare Basis Code" datafield="farebasiscode" validationrules={['pattern.alphanumericnospaceuppercase', 'min.3']} maxLength={12} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="button" type="default" label="Save With Rating (Name Check)" className="btn-custom-dark-blue" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={(e) => this.saveAction(e, 'rating-name')} />
                                        : (actionspage === 'update' && activitystatus !== 'INACTIVE') ?
                                            <Button htmlType="submit" type="default" label="Save With Rating (Name Check)" className="btn-custom-dark-blue" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'rating-name')} />
                                            : null
                                }
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="button" type="default" label="Save With Rating (No Name Check)" className="btn-custom-info" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={(e) => this.saveAction(e, 'rating-no-name')} />
                                        : (actionspage === 'update' && activitystatus !== 'INACTIVE') ?
                                            <Button htmlType="submit" type="default" label="Save With Rating (No Name Check)" className="btn-custom-info" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'rating-no-name')} />
                                            : null
                                }
                                <Button url={'/' + match.url.split('/')[1] + '/form/' + match.params.ID + '/activity'} htmlType="link" type="default" label="Back" className={(actionspage === 'create') ? '' : 'hidden'} />
                            </Row>

                            <Row className={(actionspage === 'create') ? 'hidden' : ''}>
                                <Divider>Member Transaction</Divider>
                                <Row className={(transactioninfo.length && trxtype === 'EARNING' && status === 'ACTIVE') ? '' : 'hidden'}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <InputText form={form} labeltext="Transaction ID" datafield="trxid" disabled />
                                            <DatePickerBase form={form} labeltext="Transaction Date" datafield="trxdate" disabled />
                                            <InputText form={form} labeltext="Transaction Type" datafield="trxtype" disabled />
                                            <InputText form={form} labeltext="Award Miles" datafield="awardmiles" validationrules={(actionType === 'make-correction') ? ['required', 'pattern.number'] : ['pattern.number']} disabled={generalfielddisabled} />
                                            <InputText form={form} labeltext="Tier Miles" datafield="tiermiles" validationrules={(actionType === 'make-correction') ? ['required', 'pattern.number'] : ['pattern.number']} disabled={generalfielddisabled} />
                                            <InputText form={form} labeltext="Frequency" datafield="frequency" validationrules={(actionType === 'make-correction') ? ['required', 'pattern.number'] : ['pattern.number']} disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                </Row>
                                <Row className={(transactioninfo.length && trxtype === 'EARNING' && status === 'ACTIVE') ? 'hidden' : ''}>
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No Transaction Recorded</span>} />
                                </Row>
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                    {
                                        (actionspage !== 'view' && transactioninfo.length && trxtype === 'EARNING' && status === 'ACTIVE' && activitystatus !== 'INACTIVE') ?
                                            <Button htmlType="submit" type="primary" label="Make Correction" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'make-correction')} />
                                            : null
                                    }
                                    <Button url={'/' + match.url.split('/')[1] + '/form/' + match.params.ID + '/activity'} htmlType="link" type="default" label="Back" />
                                </Row>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
                <Row>
                {
                    (actionspage !== 'create' && activityinfo === 'ACTIVITY_RATED') ? <>
                    <Divider orientation="left" style={{ marginTop: '30px' }}>Transaction List</Divider>
                    <Table rowKey={record => record.trxid} dataSource={transactioninfo} size="middle" pagination={false} loading={isLoading} bordered>
                            <Column title="Comment" dataIndex="comment" key="comment" align="center" render={(value) => (value) ? value : '-'} />
                            <Column title="Trx Date" dataIndex="trxdate" key="trxdate" align="center" render={(value) => (value) ?  moment(value).format("DD/MM/YYYY") : '-'} />
                            <Column title="Award Miles" dataIndex="awardmiles" key="awardmiles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Tier Miles" dataIndex="tiermiles" key="tiermiles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Frequency" dataIndex="Frequency" key="Frequency" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Tier Miles Renewal" dataIndex="tierrenewal" key="tierrenewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Frequency Renewal" dataIndex="frequencyrenewal" key="frequencyrenewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Expired Date" dataIndex={"trxdetail[0].expireddate"} key="trxdetail[0].expireddate" align="center" render={(value) => (value) ?  moment(value).format("DD/MM/YYYY") : '-'} />
                        <Column title="Action" render= {(_value, row) => {
                            return (
                                <Row>
                                    <Button url={'/member/form/' + row.memberid + '/transaction/detail/' + trxid} size="small" title="View" icon="eye" />
                                </Row>
                            )
                        }
                            } />
                    </Table> </> :null
                }
                </Row>
                </>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));