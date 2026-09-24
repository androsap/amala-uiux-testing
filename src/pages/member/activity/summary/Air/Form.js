import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../../../../utilities/RequestService';
import Alert from '../../../../../components/Alert';
import { api } from '../../../../../config/Services';
import Loader from '../../../../../components/Loader';
import Datepicker from '../../../../../components/Datepicker';
import Select2 from '../../../../../components/Select2';
import moment from 'moment';
import addDays from 'moment';
// import MemberTransaction from '../MemberTransaction';
import ErrorGeneral from '../../../../error/ErrorGeneral';
import { getOptionsDeactive } from '../../../../../utilities/Helpers';
import Button from '../../../../../components/Button';

const prefixmenuname = 'MBRACT';
const menucode = 'MBRACT';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Air Activity',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            cardnumber: props.getStore().cardnumber,
            memberid: props.getStore().memberid,
            activityid: props.getStore().activityid,
            activitytype: 'AIR',
            activitydate: null,
            activitycode: null,
            partnercode: null,
            optionsActivityCode: [],
            optionsPartner: [],
            activitycodedisabled: true,
            refdate: null,
            lostbaggage: false,
            usedmemberid: props.memberid,
            marketingairlinecode: null,
            marketingairlinecodedisabled: true,
            optinsAirline: [],
            optionsMarketingAirlines: [],
            optionsOperatingAirlines: [],
            bookingclass: null,
            optionsBookingClass: [],
            bookingclassdisabled: true,
            operatingairlinecode: null,
            operatingairlinecodedisabled: true,
            flownclass: null,
            optionsFlownClass: [],
            flownclassdisabled: true,
            optionsOrigin: [],
            optionsDestination: [],
            optionsAirportOrigin: [],
            optionsAirportDestination: [],
            origin: null,
            destination: null,
            oridestdisabled: true,
            checkintype: null,
            bookingtype: null,
            paymenttype: null,
            programcode: null,
            optionsCheckinType: [
                { label: "AUTO", value: "AUTO" },
                { label: "DESK", value: "DESK" },
                { label: "INTERNET", value: "INTERNET" }
            ],
            optionsBookingType: [
                { label: "INTERNET", value: "INTERNET" },
                { label: "DESK", value: "DESK" },
                { label: "PHONE", value: "PHONE" }
            ],
            optionsPaymentType: [
                { label: "FQTV", value: "FQTV" },
                { label: "FQTR", value: "FQTR" },
                { label: "FQTU", value: "FQTU" }
            ],
            optionsTrxType: [
                { label: "Earning", value: "EARNING" },
                { label: "Spending", value: "SPENDING" }
            ],
            trxtype: null,
            trxdate: null,
            active: null,
            status: null,
            transactioninfo: [],
            isLoadingSelect2: {
                partnercode: false,
                activitycode: false,
                airline: false,
                bookingclass: false,
                flownclass: false,
                airport: false
            }
        }
        this.refresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //activitydate
        if (!field['activitydate']) {
            errors['activitydate'] = 'Required';
        }

        //partnercode
        if (!field['partnercode']) {
            errors['partnercode'] = 'Required';
        }

        //activitycode
        // if (!field['activitycode']) {
        //     errors['activitycode'] = 'Required';
        // }

        //marketingairlinecode
        if (!field['marketingairlinecode']) {
            errors['marketingairlinecode'] = 'Required';
        } else {
            //bookingclass
            if (!field['bookingclass']) {
                errors['bookingclass'] = 'Required';
            }
        }

        //marketingflightnumber
        if (!field['marketingflightnumber']) {
            errors['marketingflightnumber'] = 'Required';
        }

        // //operatingflightnumber
        // if (!field['operatingflightnumber']) {
        //     errors['operatingflightnumber'] = 'Required';
        // } else if (!field['operatingflightnumber'].match(/^[0-9]+$/)) {
        //     errors['operatingflightnumber'] = 'Only numeric';
        // }

        // //flownclass
        // if (field['operatingairlinecode']) {
        //     if (!field['flownclass']) {
        //         errors['flownclass'] = 'Required';
        //     }
        // }

        //origin
        if (!field['origin']) {
            errors['origin'] = 'Required';
        }

        //destination
        if (!field['destination']) {
            errors['destination'] = 'Required';
        }

        //codeshareindicator
        if (field['codeshareindicator']) {
            if (!field['codeshareindicator'].match(/^[0-9]+$/)) {
                errors['codeshareindicator'] = 'Only numeric';
            } else if (field['codeshareindicator'].length > 20) {
                errors['codeshareindicator'] = 'Maximum 20 characters';
            }
        }

        //delayeddays
        if (field['delayeddays']) {
            if (!field['delayeddays'].match(/^[0-9]+$/)) {
                errors['delayeddays'] = 'Only numeric';
            } else if (field['delayeddays'].length > 15) {
                errors['delayeddays'] = 'Maximum 15 characters';
            }
        }

        //cardnumber
        if (!field['cardnumber']) {
            errors['cardnumber'] = 'Required';
        } else if (!field['cardnumber'].match(/^[0-9]+$/)) {
            errors['cardnumber'] = 'Only numeric';
        }

        //delayedhours
        if (field['delayedhours']) {
            if (!field['delayedhours'].match(/^[0-9]+$/)) {
                errors['delayedhours'] = 'Only numeric';
            } else if (field['delayedhours'].length > 15) {
                errors['delayedhours'] = 'Maximum 15 characters';
            }
        }

        //vouchernumber
        if (field['vouchernumber']) {
            if (!field['vouchernumber'].match(/^[0-9]+$/)) {
                errors['vouchernumber'] = 'Only numeric';
            } else if (field['vouchernumber'].length > 45) {
                errors['vouchernumber'] = 'Maximum 45 characters';
            }
        } else if (!field['vouchernumber'] && field['paymenttype'] === 'FQTR') {
            errors['vouchernumber'] = 'Required';
        }

        //ticketnumber
        if (field['ticketnumber']) {
            if (!field['ticketnumber'].match(/^[0-9]+$/)) {
                errors['ticketnumber'] = 'Only numeric';
            } else if (field['ticketnumber'].length > 45) {
                errors['ticketnumber'] = 'Maximum 45 characters';
            }
        }

        //couponnumber
        if (field['couponnumber']) {
            if (!field['couponnumber'].match(/^[0-9]+$/)) {
                errors['couponnumber'] = 'Only numeric';
            } else if (field['couponnumber'].length > 45) {
                errors['couponnumber'] = 'Maximum 45 characters';
            }
        }

        //seatnumber
        if (field['seatnumber']) {
            if (!field['seatnumber'].match(/^[a-zA-Z0-9]+$/)) {
                errors['seatnumber'] = 'Only alphanumeric';
            } else if (field['seatnumber'].length > 5) {
                errors['seatnumber'] = 'Maximum 5 characters';
            }
        }

        //boardingnumber
        if (field['boardingnumber']) {
            if (!field['boardingnumber'].match(/^[0-9]+$/)) {
                errors['boardingnumber'] = 'Only numeric';
            } else if (field['boardingnumber'].length > 45) {
                errors['boardingnumber'] = 'Maximum 45 characters';
            }
        }

        //refcode
        if (field['refcode']) {
            if (!field['refcode'].match(/^[a-zA-Z0-9\s]+$/)) {
                errors['refcode'] = 'Only alphanumeric and space';
            } else if (field['refcode'].length > 45) {
                errors['refcode'] = 'Maximum 45 characters';
            }
        }

        //supplyawardmiles
        if (field['supplyawardmiles']) {
            if (!field['supplyawardmiles'].match(/^[0-9]+$/)) {
                errors['supplyawardmiles'] = 'Only numeric';
            } else if (field['supplyawardmiles'].length > 15) {
                errors['supplyawardmiles'] = 'Maximum 15 characters';
            }
        }

        //bookingpersonalias
        if (field['type'] === 'rating-name') {
            //bookingpersonalias
            if (!field['bookingpersonalias']) {
                errors['bookingpersonalias'] = 'Required';
            }
        }

        //bookingpersonalias
        if (field['bookingpersonalias']) {
            if (!field['bookingpersonalias'].match(/^[a-zA-Z/]+$/)) {
                errors['bookingpersonalias'] = 'Only letters and slash';
            } else if (field['bookingpersonalias'].length > 45) {
                errors['bookingpersonalias'] = 'Maximum 45 characters';
            }
        }

        //salesoffice
        if (field['salesoffice']) {
            if (!field['salesoffice'].match(/^[a-zA-Z]+$/)) {
                errors['salesoffice'] = 'Only alphabet';
            } else if (field['salesoffice'].length > 45) {
                errors['salesoffice'] = 'Maximum 45 characters';
            }
        }

        //paymentcardnumber
        if (field['paymentcardnumber']) {
            if (!field['paymentcardnumber'].match(/^[a-zA-Z0-9]+$/)) {
                errors['paymentcardnumber'] = 'Only alphanumeric';
            } else if (field['paymentcardnumber'].length > 45) {
                errors['paymentcardnumber'] = 'Maximum 45 characters';
            }
        }

        if (field['type'] === 'makecorrection') {
            //awardmiles
            if (!field['awardmiles']) {
                errors['awardmiles'] = 'Required';
            } else if (!field['awardmiles'].match(/^[0-9]+$/)) {
                errors['awardmiles'] = 'Only numeric';
            }

            //tiermiles
            if (!field['tiermiles']) {
                errors['tiermiles'] = 'Required';
            } else if (!field['tiermiles'].match(/^[0-9]+$/)) {
                errors['tiermiles'] = 'Only numeric';
            }

            //frequency
            if (!field['frequency']) {
                errors['frequency'] = 'Required';
            } else if (!field['frequency'].match(/^[0-9]+$/)) {
                errors['frequency'] = 'Only numeric';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.state.activityid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit Air Activity';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View Air Activity';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            this.setState({ titlepage, actionspage, generalfielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getOptionsPartner();
                this.getOptionsAirline('', 'operating');

                //default cardnumber
                this.refs.cardnumber.value = (this.props.getStore().cardnumber) ? this.props.getStore().cardnumber : '';
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail(activityid, actionspage) {
        let url = api.url.memberactivity.detail;
        let data = { activityid };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.activityid.value = result.activityid;
                this.refs.codeshareindicator.value = (result.codeshareindicator) ? result.codeshareindicator : "";
                this.refs.delayeddays.value = (result.delayeddays) ? result.delayeddays : "";
                this.refs.delayedhours.value = (result.delayedhours) ? result.delayedhours : "";
                this.refs.vouchernumber.value = (result.vouchernumber) ? result.vouchernumber : "";
                this.refs.ticketnumber.value = (result.ticketnumber) ? result.ticketnumber : "";
                this.refs.couponnumber.value = (result.couponnumber) ? result.couponnumber : "";
                this.refs.seatnumber.value = (result.seatnumber) ? result.seatnumber : "";
                this.refs.boardingnumber.value = (result.boardingnumber) ? result.boardingnumber : "";
                this.refs.refcode.value = (result.refcode) ? result.refcode : "";
                this.refs.supplyawardmiles.value = (result.supplyawardmiles) ? result.supplyawardmiles : "";
                this.refs.bookingpersonalias.value = (result.bookingpersonalias) ? result.bookingpersonalias : "";
                this.refs.salesoffice.value = (result.salesoffice) ? result.salesoffice : "";
                this.refs.paymentcardnumber.value = (result.paymentcardnumber) ? result.paymentcardnumber : "";
                this.refs.cardnumber.value = (result.cardnumber) ? result.cardnumber : "";
                this.refs.marketingflightnumber.value = (result.marketingflightnumber) ? result.marketingflightnumber : "";
                this.refs.operatingflightnumber.value = (result.operatingflightnumber) ? result.operatingflightnumber : "";
                this.refs.retroclaimid.value = (result.retroclaimid) ? result.retroclaimid : "-";

                let transactioninfo = (result.transactioninfo !== null && result.transactioninfo.length) ? result.transactioninfo.filter(val => val.trxtype === 'EARNING') : [];
                this.refs.trxid.value = (transactioninfo[0]) ? transactioninfo[0].trxid : "";
                this.refs.awardmiles.value = (transactioninfo[0]) ? transactioninfo[0].awardmiles : "";
                this.refs.tiermiles.value = (transactioninfo[0]) ? transactioninfo[0].tiermiles : "";
                this.refs.frequency.value = (transactioninfo[0]) ? transactioninfo[0].frequency : "";

                let partnercode = (result.partnercode) ? result.partnercode : null;
                let marketingairlinecode = (result.marketingairlinecode) ? result.marketingairlinecode : null;
                let operatingairlinecode = (result.operatingairlinecode) ? result.operatingairlinecode : null;
                let airlinecode = operatingairlinecode ? operatingairlinecode : marketingairlinecode;

                let origin = (result.origin) ? result.origin : null;
                let originairportname = (result.originairport && result.originairport.airportname) ? result.originairport.airportname : null;
                let origincityname = (result.originairport && result.originairport.cityname) ? result.originairport.cityname : null;

                let destination = (result.destination) ? result.destination : null;
                let destinationairportname = (result.destinationairport && result.destinationairport.airportname) ? result.destinationairport.airportname : null;
                let destinationcityname = (result.destinationairport && result.destinationairport.cityname) ? result.destinationairport.cityname : null;

                this.setState({
                    loading: false,
                    activityid: activityid,
                    partnercode, marketingairlinecode, operatingairlinecode,
                    origin, originairportname, origincityname,
                    destination, destinationairportname, destinationcityname,
                    originlabel: origincityname + ' (' + origin + '), ' + originairportname,
                    destinationlabel: destinationcityname + ' (' + destination + '), ' + destinationairportname,
                    partnername: result.partnername ? result.partnername : null,
                    activitycode: result.activitycode ? result.activitycode : null,
                    marketingairlinename: result.marketingairlinename ? result.marketingairlinename : null,
                    bookingclass: result.bookingclass ? result.bookingclass : null,
                    operatingairlinename: result.operatingairlinename ? result.operatingairlinename : null,
                    flownclass: result.flownclass ? result.flownclass : null,
                    checkintype: (result.checkintype) ? result.checkintype : null,
                    bookingtype: (result.bookingtype) ? result.bookingtype : null,
                    paymenttype: (result.paymenttype) ? result.paymenttype : null,
                    lostbaggage: result.lostbaggage,
                    activitydate: result.activitydate ? moment(result.activitydate) : null,
                    refdate: (result.refdate) ? moment(result.refdate) : null,
                    activityinfo: (result.activityinfo) ? result.activityinfo : null,
                    retroclaimid: (result.retroclaimid) ? result.retroclaimid : null,
                    status: (result.status) ? result.status : null,
                    transactioninfo,
                    trxdate: (transactioninfo[0]) ? moment(transactioninfo[0].trxdate) : null,
                    trxtype: (transactioninfo[0]) ? transactioninfo[0].trxtype : null,
                    active: (transactioninfo[0]) ? transactioninfo[0].active : null,
                },
                    this.getOptionsPartner(),
                    // this.getProgram(result.partnercode),
                    this.getOptionsActivityCode(partnercode, actionspage),
                    this.getOptionsAirline(partnercode, 'marketing', actionspage),
                    this.getOptionsAirline(partnercode, 'operating', actionspage),
                    this.getOptionsBookingClass(marketingairlinecode, 'bookingclass', actionspage),
                    this.getOptionsBookingClass(operatingairlinecode, 'flownclass', actionspage),
                    this.getOptionsAirport(airlinecode, 'origin'),
                    this.getOptionsAirport(airlinecode, 'destination'));
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        });
    }

    saveAction = (e, type) => {
        e.preventDefault();
        const formData = {};
        const { cardnumber, memberid, activitytype } = this.state;
        for (const field in this.refs) {
            if (field === "lostbaggage") {
                formData[field] = this.refs[field].checked;
            } else {
                if (this.refs[field].value) {
                    formData[field] = this.refs[field].value.trim();
                }
            }
        }

        formData['type'] = type;
        formData['activityinfo'] = this.state.activityinfo;
        formData['activitydate'] = this.state.activitydate;
        formData['partnercode'] = this.state.partnercode;
        formData['partnerlocation'] = this.state.partnerlocation;
        formData['activitycode'] = this.state.activitycode;
        formData['marketingairlinecode'] = this.state.marketingairlinecode;
        formData['bookingclass'] = this.state.bookingclass;
        formData['operatingairlinecode'] = this.state.operatingairlinecode;
        formData['flownclass'] = this.state.flownclass;
        formData['origin'] = this.state.origin;
        formData['destination'] = this.state.destination;
        formData['checkintype'] = this.state.checkintype;
        formData['refdate'] = this.state.refdate;
        formData['bookingtype'] = this.state.bookingtype;
        formData['paymenttype'] = this.state.paymenttype;
        formData['checkintype'] = this.state.checkintype;
        formData['trxdate'] = this.state.trxdate;
        formData['trxtype'] = this.state.trxtype;
        formData['retroclaimid'] = this.state.retroclaimid;

        if (this.handleValidation(formData)) {
            this.setState({ loading: true });
            // let cardnumber = formData.cardnumber;
            let activityid = formData.activityid;
            let activityinfo = formData.activityinfo;
            let activitydate = moment(formData.activitydate).format("YYYY-MM-DD");
            let partnercode = formData.partnercode;
            let marketingairlinecode = formData.marketingairlinecode;
            let marketingflightnumber = formData.marketingflightnumber.toUpperCase();
            let bookingclass = formData.bookingclass;
            let operatingairlinecode = formData.operatingairlinecode;
            let operatingflightnumber = (formData.operatingflightnumber) ? formData.operatingflightnumber.toUpperCase() : null;
            let flownclass = formData.flownclass;
            let origin = formData.origin;
            let destination = formData.destination;
            let codeshareindicator = (formData.codeshareindicator && formData.codeshareindicator.length > 0) ? formData.codeshareindicator : null;
            let delayeddays = (formData.delayeddays) ? formData.delayeddays : null;
            let delayedhours = (formData.delayedhours) ? formData.delayedhours : null;
            let vouchernumber = (formData.vouchernumber && formData.vouchernumber.length > 0) ? formData.vouchernumber : null;
            let ticketnumber = (formData.ticketnumber && formData.ticketnumber.length > 0) ? formData.ticketnumber : null;
            let couponnumber = (formData.couponnumber && formData.couponnumber.length > 0) ? formData.couponnumber : null;
            let seatnumber = (formData.seatnumber && formData.seatnumber.length > 0) ? formData.seatnumber : null;
            let boardingnumber = (formData.boardingnumber && formData.boardingnumber.length > 0) ? formData.boardingnumber : null;
            let checkintype = formData.checkintype;
            let bookingtype = formData.bookingtype;
            let refcode = (formData.refcode && formData.refcode.length > 0) ? formData.refcode : null;
            let refdate = (formData.refdate) ? moment(formData.refdate).format("YYYY-MM-DD") : null;
            let supplyawardmiles = (formData.supplyawardmiles) ? formData.supplyawardmiles : null;
            let bookingpersonalias = (formData.bookingpersonalias && formData.bookingpersonalias.length > 0) ? formData.bookingpersonalias.toUpperCase() : null;
            let salesoffice = (formData.salesoffice && formData.salesoffice.length > 0) ? formData.salesoffice.toUpperCase() : null;
            let paymentcardnumber = (formData.paymentcardnumber && formData.paymentcardnumber.length > 0) ? formData.paymentcardnumber : null;
            let paymenttype = formData.paymenttype;
            let lostbaggage = (formData.lostbaggage) ? true : false;
            let retroclaimid = formData.retroclaimid;
            let namecheck = false;
            if (type === 'rating-name') {
                namecheck = true;
                this.setState({ namecheck: true });
            }
            let oldactivityid = activityid;
            let newactivityid = null;
            let activitycode = null;
            let customtrxcode = null;
            let basemiles = 0;
            let classofservicebonus = 0;
            let elitetierbonusmiles = 0;
            let promotionalbonusmiles = 0;
            let awardmiles = formData.awardmiles;
            let tiermiles = formData.tiermiles;
            let frequency = formData.frequency;
            let trxdate = moment(new Date()).format("YYYY-MM-DD");

            let url = '';
            let data = {};
            let message = '';
            if (typeof activityid === 'undefined') {
                url = api.url.memberairactivity.create;
                if (type === 'normal') {
                    url = api.url.memberairactivity.create;
                } else {
                    url = api.url.memberairactivity.createwithrating;
                }
                message = 'New data has been created';
                data = {
                    memberid, cardnumber, activitytype, activitydate, partnercode, marketingairlinecode, marketingflightnumber,
                    operatingairlinecode, operatingflightnumber, origin, destination, bookingclass, flownclass, codeshareindicator,
                    delayeddays, delayedhours, vouchernumber, ticketnumber, couponnumber, seatnumber, boardingnumber,
                    checkintype, bookingtype, refcode, refdate, supplyawardmiles, bookingpersonalias, salesoffice, paymentcardnumber,
                    paymenttype, lostbaggage, namecheck
                };
            } else {
                message = 'Data has been updated';
                if (type === 'makecorrection') {
                    newactivityid = activityid;
                    url = api.url.membertransaction.earningcorrection;
                    data = {
                        memberid, oldactivityid, newactivityid, activitycode, customtrxcode, trxdate, awardmiles, tiermiles, frequency, basemiles,
                        classofservicebonus, elitetierbonusmiles, promotionalbonusmiles
                    }
                } else {
                    url = api.url.memberairactivity.updatewithrating;
                    data = {
                        memberid, activityid, activityinfo, cardnumber, activitytype, activitydate, partnercode, marketingairlinecode, marketingflightnumber,
                        operatingairlinecode, operatingflightnumber, origin, destination, bookingclass, flownclass, codeshareindicator,
                        delayeddays, delayedhours, vouchernumber, ticketnumber, couponnumber, seatnumber, boardingnumber,
                        checkintype, bookingtype, refcode, refdate, supplyawardmiles, bookingpersonalias, salesoffice, paymentcardnumber,
                        paymenttype, lostbaggage, namecheck, retroclaimid
                    };
                }
            }

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        //earning process if with rating process
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        //after action, check permission
                        this.checkPermission();
                        // this.handleRefreshMainPage();
                        this.props.loadDataMemberHeader(memberid);
                        //redirect to index page
                        this.props.updatePage({
                            displayactivitypage: 'index'
                        });
                    } else {
                        Alert.error(responsemessage);
                        this.setState({ loading: false });
                    }
                })
            }
        }
    };

    handleRefreshMainPage = () => {
        this.refresh.current.click();
    }

    getOptionsAirport(airlinecode = '', type = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        // let sort = {};
        let sortOri = { originairport: 'asc' };
        let sortDest = { destinationairport: 'asc' };
        let criteria = {
            active: true,
            airlinecode
        };
        let url = api.url.accrualruleod.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: true } }));

        /*get data of origin airport*/
        var resultori = RetrieveRequest(url, paging, column, criteria, sortOri);
        resultori.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                var optOri = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.origin.cityname + " (" + obj.origin.airportiatacode + "), " + obj.origin.airportname;
                    result2['value'] = obj.origin.airportiatacode;
                    return result2;
                });

                let optionsOrigin = optOri.filter((obj, key) => key === optOri.findIndex(elm => elm.value === obj.value && elm.label === obj.label));

                const { actionspage } = this.state;
                //origin airport
                const { origin, originairportname, origincityname } = this.state;
                let originlabel = origincityname + " (" + origin + "), " + originairportname;
                let optionsAirportOrigin = [...optionsOrigin];
                optionsOrigin = getOptionsDeactive(actionspage, optionsOrigin, origin, originlabel);

                let oridestdisabled = (actionspage === 'view') ? true : false;
                this.setState(prevState => ({
                    optionsOrigin,
                    optionsAirportOrigin,
                    oridestdisabled,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });

        /*get data of destination airport*/
        var resultdes = RetrieveRequest(url, paging, column, criteria, sortDest);
        resultdes.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                var optDes = result.map(obj => {
                    var result3 = {};
                    result3['label'] = obj.destination.cityname + " (" + obj.destination.airportiatacode + "), " + obj.destination.airportname;
                    result3['value'] = obj.destination.airportiatacode;
                    return result3;
                });

                let optionsDestination = optDes.filter((obj, key) => key === optDes.findIndex(elm => elm.value === obj.value && elm.label === obj.label));

                const { actionspage } = this.state;
                //destination airport
                const { destination, destinationairportname, destinationcityname } = this.state;
                let destinationlabel = destinationcityname + " (" + destination + "), " + destinationairportname;
                let optionsAirportDestination = [...optionsDestination];
                optionsDestination = getOptionsDeactive(actionspage, optionsDestination, destination, destinationlabel);

                let oridestdisabled = (actionspage === 'view') ? true : false;
                this.setState(prevState => ({
                    optionsDestination,
                    optionsAirportDestination,
                    oridestdisabled,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsAirline(partnercode = '', type = '', actionspage = '') {
        // let operatingairline = (type === 'marketing') ? 0 : 1;
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            airlinename: 'asc'
        };
        let criteria = (type === 'marketing') ? { partnercode, active: true } : { isoperating: true, active: true };
        let url = api.url.airline.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsAirline = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.airlinename;
                    result2['value'] = obj.airlinecode;
                    return result2;
                });

                //if options deactive
                //marketing airline
                const { marketingairlinecode, marketingairlinename } = this.state;
                let optionsMarketingAirlines = [...optionsAirline];
                if (marketingairlinecode) { optionsMarketingAirlines = getOptionsDeactive(actionspage, optionsAirline, marketingairlinecode, marketingairlinename); }

                //operating airline
                const { operatingairlinecode, operatingairlinename } = this.state;
                let optionsOperatingAirlines = [...optionsAirline];
                if (operatingairlinecode) { optionsOperatingAirlines = getOptionsDeactive(actionspage, optionsAirline, operatingairlinecode, operatingairlinename); }

                if (type === 'marketing') {
                    let marketingairlinecodedisabled = (actionspage === 'view') ? true : false;
                    this.setState(prevState => ({
                        optionsMarketingAirlines,
                        marketingairlinecodedisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: false }
                    }));
                } else {
                    let operatingairlinecodedisabled = (actionspage === 'view') ? true : false;
                    this.setState(prevState => ({
                        optionsOperatingAirlines,
                        operatingairlinecodedisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: false }
                    }));
                }
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsBookingClass(airlinecode = '', type = '', actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            subclasscode: 'asc'
        };
        let criteria = { airlinecode };
        let url = api.url.subclass.list;
        let column = [];
        /*loading select2 get data*/
        if (type === 'bookingclass') {
            this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, bookingclass: true } }));
        } else {
            this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, flownclass: true } }));
        }
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsClass = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.subclasscode;
                    result2['value'] = obj.subclasscode;
                    return result2;
                })

                if (type === 'bookingclass') {
                    let bookingclassdisabled = (actionspage === 'view') ? true : false;
                    this.setState(prevState => ({
                        optionsBookingClass: optionsClass,
                        bookingclassdisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, bookingclass: false }
                    }));
                } else {
                    let flownclassdisabled = (actionspage === 'view') ? true : false;
                    this.setState(prevState => ({
                        optionsFlownClass: optionsClass,
                        flownclassdisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, flownclass: false }
                    }));
                }
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsPartner() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            partnercode: 'asc'
        };
        let criteria = {
            partnertype: 'AIR',
            active: true
        };
        let url = api.url.partner.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, partnercode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsPartner = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.partnername;
                    result2['value'] = obj.partnercode;
                    return result2;
                });

                //if options deactive
                const { partnercode, partnername, actionspage } = this.state;
                optionsPartner = getOptionsDeactive(actionspage, optionsPartner, partnercode, partnername);

                this.setState(prevState => ({
                    optionsPartner,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, partnercode: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsActivityCode(partnercode = '', actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            activityname: 'asc'
        };
        let criteria = {
            partnercode
        };
        let url = api.url.activitycode.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, activitycode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsActivityCode = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.activityname;
                    result2['value'] = obj.activitycode;
                    return result2;
                });

                //if options deactive
                const { activitycode, activitycodename } = this.state;
                optionsActivityCode = getOptionsDeactive(actionspage, optionsActivityCode, activitycode, activitycodename);

                let activitycodedisabled = (actionspage === 'view') ? true : false;
                this.setState(prevState => ({
                    optionsActivityCode,
                    activitycodedisabled,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, activitycode: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getProgram(partnercode = '') {
        let url = api.url.program.getprogram;
        let data = { partnercode };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    programcode: (result[0] && result[0].programcode) ? result[0].programcode : null
                });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    handleFilterOriginDestination = (type, value) => {
        let { optionsOrigin, optionsDestination } = this.state;

        if (type === 'origin') {
            let temp = [];
            optionsDestination.forEach(obj => {
                if (value !== obj.value) temp.push(obj);
            });
            this.setState({ optionsAirportDestination: temp });
        }

        if (type === 'destination') {
            let temp = [];
            optionsOrigin.forEach(obj => {
                if (value !== obj.value) temp.push(obj);
            });
            this.setState({ optionsAirportOrigin: temp });
        }
    }

    handleOriginChange = (event) => {
        let origin = event === null ? null : event.value;
        this.setState({ origin });

        this.handleFilterOriginDestination('origin', origin);
    }
    handleDestinationChange = (event) => {
        let destination = event === null ? null : event.value;
        this.setState({ destination });
    }

    handleBackClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage
        });
    }

    handleActivityDateChange = (event) => {
        let activitydate = event === null ? null : event;
        this.setState({ activitydate });
    }

    handleReferenceDateChange = (event) => {
        let refdate = event === null ? null : event;
        this.setState({ refdate });
    }

    handleActivityCodeChange = (event) => {
        let activitycode = event === null ? null : event.value;
        this.setState({ activitycode });
    }

    handlePartnerChange = (event) => {
        let partnercode = event === null ? null : event.value;
        let activitycode = null;
        let activitycodedisabled = true;
        let marketingairlinecode = null;
        let marketingairlinecodedisabled = true;
        let bookingclass = null;
        let bookingclassdisabled = true;
        // let operatingairlinecode = null;
        // let operatingairlinecodedisabled = true;
        let flownclass = null;
        let flownclassdisabled = true;
        let origin = null;
        let destination = null;
        let oridestdisabled = true;
        this.setState({
            partnercode, activitycode, activitycodedisabled,
            marketingairlinecode, marketingairlinecodedisabled,
            bookingclass, bookingclassdisabled,
            // operatingairlinecode, operatingairlinecodedisabled,
            flownclass, flownclassdisabled,
            origin, destination, oridestdisabled
        });
        if (partnercode) {
            this.getOptionsActivityCode(partnercode);
            this.getOptionsAirline(partnercode, 'marketing');
            //this.getOptionsAirline(partnercode, 'operating');
            // this.getProgram(partnercode)
        }
    }

    handleOperatingAirlineCodeChange = (event) => {
        let operatingairlinecode = event === null ? null : event.value;
        let flownclass = null;
        let origin = null;
        let destination = null;
        let flownclassdisabled = true;
        let oridestdisabled = true;
        this.refs.operatingflightnumber.value = '';
        this.setState({ operatingairlinecode, flownclass, origin, destination, flownclassdisabled, oridestdisabled });
        if (operatingairlinecode) {
            this.getOptionsBookingClass(operatingairlinecode, 'flownclass');
            this.getOptionsAirport(operatingairlinecode, 'origin');
            this.getOptionsAirport(operatingairlinecode, 'destination');
        }else{
            const { marketingairlinecode } = this.state;
            this.getOptionsAirport(marketingairlinecode, 'origin');
            this.getOptionsAirport(marketingairlinecode, 'destination');
        }
    }

    handleMarketingAirlineChange = (event) => {
        let marketingairlinecode = event === null ? null : event.value;
        let bookingclass = null;
        let origin = null;
        let destination = null;
        let bookingclassdisabled = true;
        let oridestdisabled = true;
        this.refs.marketingflightnumber.value = '';
        this.setState({ marketingairlinecode, bookingclass, origin, destination, bookingclassdisabled, oridestdisabled });
        if (marketingairlinecode) {
            this.getOptionsBookingClass(marketingairlinecode, 'bookingclass');
            this.getOptionsAirport(marketingairlinecode, 'origin');
            this.getOptionsAirport(marketingairlinecode, 'destination');
        }else{
            const { operatingairlinecode } = this.state;
            this.getOptionsAirport(operatingairlinecode, 'origin');
            this.getOptionsAirport(operatingairlinecode, 'destination');
        }
    }

    // handleOriginChange = (event) => {
    //     let origin = event === null ? null : event.value;
    //     this.setState({ origin });
    // }

    // handleDestinationChange = (event) => {
    //     let destination = event === null ? null : event.value;
    //     this.setState({ destination });
    // }

    handleBookingClassChange = (event) => {
        let bookingclass = event === null ? null : event.value;
        this.setState({ bookingclass });
    }

    handleFlownClassChange = (event) => {
        let flownclass = event === null ? null : event.value;
        this.setState({ flownclass });
    }

    handleCheckinTypeChange = (event) => {
        let checkintype = event === null ? null : event.value;
        this.setState({ checkintype });
    }

    handleBookingTypeChange = (event) => {
        let bookingtype = event === null ? null : event.value;
        this.setState({ bookingtype });
    }

    handlePaymentTypeChange = (event) => {
        let paymenttype = event === null ? null : event.value;
        this.setState({ paymenttype });
    }

    render() {
        const { isLoadingSelect2, activityid, activitydate, refdate,
            partnercode, optionsPartner, marketingairlinecode, marketingairlinecodedisabled, optionsMarketingAirlines, optionsOperatingAirlines,
            operatingairlinecode, operatingairlinecodedisabled,
            optionsBookingClass, bookingclass, bookingclassdisabled,
            optionsFlownClass, flownclass, flownclassdisabled,
            optionsAirportOrigin, optionsAirportDestination, origin, destination, oridestdisabled,
            optionsCheckinType, optionsBookingType, optionsPaymentType, checkintype, bookingtype, paymenttype, lostbaggage,
            transactioninfo, optionsTrxType, trxtype, trxdate, status } = this.state;
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <form className="clearfix position-relative" autoComplete="off">
                    <Loader value={loading} />
                    <div className="main-panel member-section">
                        <div className="content-title flex-hr mt-0 mb-0 title-description">
                            <h1 className="title-has-control mt-2">{titlepage}</h1>
                        </div>
                        <hr className="mt-0" />
                        <div className="card-table">
                            <div className="row">
                                <div className="col-md-6">
                                    <input className="form-control" type="hidden" id="activityid-view" ref="activityid" maxLength="45" value={activityid} />
                                    <input className="form-control" type="hidden" id="activityinfo-view" ref="activityinfo" maxLength="45" />
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="activitydate-view">Activity Date </label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handleActivityDateChange} selected={activitydate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} maxDate={moment(new Date())} /><br />
                                            <span className="text-danger">{errors["activitydate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="partnercode-view">Partner </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="partnercode" className="reactSelect2" id="partnercode-view" options={optionsPartner} onChange={this.handlePartnerChange} value={optionsPartner.filter(({ value }) => value === partnercode)} disabled={generalfielddisabled} isLoading={isLoadingSelect2.partnercode}></Select2>
                                            <span className="text-danger">{errors["partnercode"]}</span>
                                        </div>
                                    </div>
                                    {/* <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="activitycode-view">Activity Code </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="activitycode" className="form-control" id="activitycode-view" options={optionsActivityCode} onChange={this.handleActivityCodeChange} value={activitycode} disabled={activitycodedisabled} isLoading={isLoadingSelect2.activitycode}></Select2>
                                            <span className="text-danger">{errors["activitycode"]}</span>
                                        </div>
                                    </div> */}
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="marketingairlinecode-view">Marketing Airline </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="marketingairlinecode" className="reactSelect2" id="marketingairlinecode-view" options={optionsMarketingAirlines} onChange={this.handleMarketingAirlineChange} value={optionsMarketingAirlines.filter(({ value }) => value === marketingairlinecode)} disabled={marketingairlinecodedisabled} isLoading={isLoadingSelect2.airline}></Select2>
                                            <span className="text-danger">{errors["marketingairlinecode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="marketingflightnumber-view">Marketing Flight Number </label>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="text" id="marketingflightnumber-view" ref="marketingflightnumber" maxLength="4" disabled={bookingclassdisabled} />
                                            <span className="text-danger">{errors["marketingflightnumber"]}</span>
                                        </div>
                                        <div className="col-sm-2">
                                            <p className="col-form-label">4 digits</p>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="bookingclass-view">Booking Class </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="bookingclass" className="reactSelect2" id="bookingclass-view" options={optionsBookingClass} onChange={this.handleBookingClassChange} value={optionsBookingClass.filter(({ value }) => value === bookingclass)} disabled={bookingclassdisabled} isLoading={isLoadingSelect2.bookingclass}></Select2>
                                            <span className="text-danger">{errors["bookingclass"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="operatingairlinecode-view">Operating Airline <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="operatingairlinecode" className="reactSelect2" id="operatingairlinecode-view" options={optionsOperatingAirlines} onChange={this.handleOperatingAirlineCodeChange} value={optionsOperatingAirlines.filter(({ value }) => value === operatingairlinecode)} disabled={operatingairlinecodedisabled} isLoading={isLoadingSelect2.airline}></Select2>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="operatingflightnumber-view">Operating Flight Number <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="text" id="operatingflightnumber-view" ref="operatingflightnumber" maxLength="4" disabled={flownclassdisabled} />
                                        </div>
                                        <div className="col-sm-2">
                                            <p className="col-form-label">4 digits</p>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="flownclass-view">Flown Class <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="flownclass" className="reactSelect2" id="flownclass-view" options={optionsFlownClass} onChange={this.handleFlownClassChange} value={optionsFlownClass.filter(({ value }) => value === flownclass)} disabled={flownclassdisabled} isLoading={isLoadingSelect2.flownclass}></Select2>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="origin-view">Origin </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="origin" className="reactSelect2" id="origin-view" options={optionsAirportOrigin} onChange={this.handleOriginChange} value={optionsAirportOrigin.filter(({ value }) => value === origin)} disabled={oridestdisabled} isLoading={isLoadingSelect2.airport}></Select2>
                                            <span className="text-danger">{errors["origin"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="destination-view">Destination </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="destination" className="reactSelect2" id="destination-view" options={optionsAirportDestination} onChange={this.handleDestinationChange} value={optionsAirportDestination.filter(({ value }) => value === destination)} disabled={oridestdisabled} isLoading={isLoadingSelect2.airport}></Select2>
                                            <span className="text-danger">{errors["destination"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="codeshareindicator-view">Codeshare Indicator <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="codeshareindicator-view" ref="codeshareindicator" maxLength="20" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["codeshareindicator"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="delayeddays-view">Delayed Day(s) <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="delayeddays-view" ref="delayeddays" maxLength="15" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["delayeddays"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="delayedhours-view">Delayed Hour(s) <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="delayedhours-view" ref="delayedhours" maxLength="15" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["delayedhours"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="vouchernumber-view">Voucher Number <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="vouchernumber-view" ref="vouchernumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["vouchernumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="ticketnumber-view">Ticket Number <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="ticketnumber-view" ref="ticketnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["ticketnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="couponnumber-view">Coupon Number <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="couponnumber-view" ref="couponnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["couponnumber"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="seatnumber-view">Seat Number <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="seatnumber-view" ref="seatnumber" maxLength="5" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["seatnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="boardingnumber-view">Boarding Number <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="boardingnumber-view" ref="boardingnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["boardingnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number </label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" maxLength="45" disabled />
                                            <span className="text-danger">{errors["cardnumber"]}</span>
                                        </div>
                                    </div>
                                    {/* <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="usedmemberid-view">Used Member ID <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="usedmemberid-view" ref="usedmemberid" maxLength="45" value={usedmemberid} disabled />
                                            <span className="text-danger">{errors["usedmemberid"]}</span>
                                        </div>
                                    </div> */}
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="checkintype-view">Check-in Type <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="checkintype" className="reactSelect2" id="checkintype-view" options={optionsCheckinType} onChange={this.handleCheckinTypeChange} value={optionsCheckinType.filter(({ value }) => value === checkintype)} disabled={generalfielddisabled}></Select2>
                                            <span className="text-danger">{errors["checkintype"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="bookingtype-view">Booking Type <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="bookingtype" className="reactSelect2" id="bookingtype-view" options={optionsBookingType} onChange={this.handleBookingTypeChange} value={optionsBookingType.filter(({ value }) => value === bookingtype)} disabled={generalfielddisabled}></Select2>
                                            <span className="text-danger">{errors["bookingtype"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="refcode-view">Reference Code <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="refcode-view" ref="refcode" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["refcode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="refdate-view">Reference Date <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handleReferenceDateChange} selected={refdate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} maxDate={addDays(new Date(), 0)} />
                                            <span className="text-danger">{errors["refdate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="supplyawardmiles-view">Supply Award Miles <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="supplyawardmiles-view" ref="supplyawardmiles" maxLength="15" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["supplyawardmiles"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="bookingpersonalias-view">Booking Person Alias <p className="text-muted"><i>(Mandatory if save with name check)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="bookingpersonalias-view" ref="bookingpersonalias" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["bookingpersonalias"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="salesoffice-view">Sales Office <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="salesoffice-view" ref="salesoffice" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["salesoffice"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="paymentcardnumber-view">Payment Card Number <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="paymentcardnumber-view" ref="paymentcardnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["paymentcardnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="paymenttype-view">Payment Type <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="paymenttype" className="reactSelect2" id="paymenttype-view" options={optionsPaymentType} onChange={this.handlePaymentTypeChange} value={optionsPaymentType.filter(({ value }) => value === paymenttype)} disabled={generalfielddisabled}></Select2>
                                            <span className="text-danger">{errors["paymenttype"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="lostbaggage-view">Lost Baggage? </label>
                                        <div className="col-sm-8">
                                            <div className="row no-gutters">
                                                <label className="custom-control border-switch">
                                                    <input id="lostbaggage-view" ref="lostbaggage" className="border-switch-control-input" type="checkbox" defaultChecked={(lostbaggage) ? "checked" : null} disabled={generalfielddisabled} />
                                                    <span className="border-switch-control-description">No</span>
                                                    <span className="border-switch-control-indicator"></span>
                                                    <span className="border-switch-control-description">Yes</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={(actionspage !== 'create') ? "form-group row" : "form-group row hidden"}>
                                        <label className="col-sm-4 col-form-label" htmlFor="retroclaimid-view">Retro Claim </label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="retroclaimid-view" ref="retroclaimid" disabled />
                                            <span className="text-danger">{errors["retroclaimid"]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer text-center">
                                <button type="button" ref={this.refresh} onClick={this.props.refreshMainPage} className="hidden">Close Refresh</button>
                                {/* {
                                    (actionspage !== 'view' && actionspage !== 'update') ? <button type="button" className="btn btn-outline-dark normal mr-2" onClick={(e) => this.saveAction(e, 'normal')}>Save</button> : ""
                                }*/}
                                {
                                    (actionspage === 'create') ?
                                        <Button type="button" label="Save With Rating (Name Check)" className="btn btn-outline-dark normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={(e) => this.saveAction(e, 'rating-name')} />
                                        : (actionspage === 'update') ?
                                            <Button type="button" label="Save With Rating (Name Check)" className="btn btn-outline-dark normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'rating-name')} />
                                            : null
                                }
                                {
                                    (actionspage === 'create') ?
                                        <Button type="button" label="Save With Rating (No Name Check)" className="btn btn-outline-dark normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={(e) => this.saveAction(e, 'rating-no-name')} />
                                        : (actionspage === 'update') ?
                                            <Button type="button" label="Save With Rating (No Name Check)" className="btn btn-outline-dark normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'rating-no-name')} />
                                            : null
                                }
                                <button type="button" onClick={() => (this.handleBackClick('index'))} className={(actionspage === 'create') ? "btn btn-outline-dark normal" : "btn btn-outline-dark normal hidden"}>Back</button>
                            </div>
                        </div>
                    </div>
                    {/* <MemberTransaction memberid={memberid} activityid={activityid} activitytype={activitytype} transactioninfo={transactioninfo}  /> */}
                    <div className={(actionspage !== 'create') ? "main-panel member-section mt-3" : "main-panel member-section mt-3 hidden"}>
                        <div className="content-title flex-hr mb-0 title-description">
                            <h3 className="title-has-control mt-2">Member Transaction</h3>
                        </div>
                        <hr className="mt-0" />
                        <div className="card-table">
                            <div className={(transactioninfo.length && trxtype === 'EARNING' && status === 'ACTIVE') ? "row" : "row hidden"}>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="trxid-view">Transaction ID </label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="trxid-view" ref="trxid" disabled />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="trxdate-view">Transaction Date </label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" selected={trxdate} dateFormat={"DD/MM/YYYY"} disabled />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="trxtype-view">Transaction Type </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="trxtype" className="reactSelect2" id="trxtype-view" options={optionsTrxType} value={optionsTrxType.filter(({ value }) => value === trxtype)} disabled></Select2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="awardmiles-view">Award Miles </label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="awardmiles-view" ref="awardmiles" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["awardmiles"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="tiermiles-view">Tier Miles </label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="tiermiles-view" ref="tiermiles" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["tiermiles"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="frequency-view">Frequency </label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="frequency-view" ref="frequency" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["frequency"]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={(transactioninfo.length && trxtype === 'EARNING' && status === 'ACTIVE') ? "mt-4 text-center hidden" : "mt-4 text-center"}>
                                <h4>No Transaction Recorded</h4>
                            </div>
                            <div className="box-footer text-center mt-4">
                                {
                                    (actionspage !== 'view' && transactioninfo.length && trxtype === 'EARNING' && status === 'ACTIVE') ?
                                        <Button type="button" label="Make Correction" className="btn btn-primary normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'makecorrection')} /> : ''
                                }
                                <button type="button" onClick={() => (this.handleBackClick('index'))} className="btn btn-outline-dark normal">Back</button>
                            </div>
                        </div>
                    </div>
                </form>
            );
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;