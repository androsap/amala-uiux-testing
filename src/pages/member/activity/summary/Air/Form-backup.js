import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../../../../utilities/RequestService';
import Alert from '../../../../../components/Alert';
import { api } from '../../../../../config/Services';
import Loader from '../../../../../components/Loader';
import Datepicker from '../../../../../components/Datepicker';
import Select2 from '../../../../../components/Select2';
import moment from 'moment';
import addDays from 'moment';
import { _getUserPermission, _checkPermission } from '../../../../../utilities/PermissionService';
import ErrorGeneral from '../../../../error/ErrorGeneral';
import { getOptionsDeactive } from '../../../../../utilities/Helpers';

var permissionList = _getUserPermission();
var menuname = 'memberactivity';

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
            activityid: '',
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
            optionsFlightNumber: [],
            optionsMarketingFlightNumber: [],
            marketingflightnumber: null,
            marketingflightnumberdisabled: true,
            bookingclass: null,
            optionsBookingClass: [],
            bookingclassdisabled: true,
            operatingairlinecode: null,
            operatingairlinecodedisabled: true,
            optionsOperatingFlightNumber: [],
            flownclass: null,
            optionsFlownClass: [],
            flownclassdisabled: true,
            operatingflightnumber: null,
            operatingflightnumberdisabled: true,
            optionsAirport: [],
            optionsOrigin: [],
            optionsDestination: [],
            origin: null,
            destination: null,
            origindisabled: true,
            destinationdisabled: true,
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
            isLoadingSelect2: {
                partnercode: false,
                activitycode: false,
                airline: false,
                marketingflightnumber: false,
                bookingclass: false,
                operatingflightnumber: false,
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
        }

        //marketingflightnumber
        if (!field['marketingflightnumber']) {
            errors['marketingflightnumber'] = 'Required';
        }

        //bookingclass
        if (!field['bookingclass']) {
            errors['bookingclass'] = 'Required';
        }

        //operatingflightnumber
        if (field['operatingairlinecode']) {
            if (!field['operatingflightnumber']) {
                errors['operatingflightnumber'] = 'Required';
            }
        }

        //flownclass
        if (field['operatingairlinecode']) {
            if (!field['flownclass']) {
                errors['flownclass'] = 'Required';
            }
        }

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
            if (!field['salesoffice'].match(/^[a-zA-Z0-9\s]+$/)) {
                errors['salesoffice'] = 'Only alphanumeric and space';
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

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.props.getStore().activityid;
        if (id) {
            let titlepage = 'View Air Activity';
            let actionspage = 'view';
            let generalfielddisabled = true;
            this.setState({ titlepage, actionspage, generalfielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getOptionsPartner();
                this.getOptionsAirport();

                //default cardnumber
                this.refs.cardnumber.value = (this.props.getStore().cardnumber) ? this.props.getStore().cardnumber : '';
            }
        }
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, "access")) {
            this.checkPermission();
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
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
                this.refs.codeshareindicator.value = (result.codeshareindicator !== undefined) ? result.codeshareindicator : "";
                this.refs.delayeddays.value = (result.delayeddays !== undefined) ? result.delayeddays : "";
                this.refs.delayedhours.value = (result.delayedhours !== undefined) ? result.delayedhours : "";
                this.refs.vouchernumber.value = (result.vouchernumber !== undefined) ? result.vouchernumber : "";
                this.refs.ticketnumber.value = (result.ticketnumber !== undefined) ? result.ticketnumber : "";
                this.refs.couponnumber.value = (result.couponnumber !== undefined) ? result.couponnumber : "";
                this.refs.seatnumber.value = (result.seatnumber !== undefined) ? result.seatnumber : "";
                this.refs.boardingnumber.value = (result.boardingnumber !== undefined) ? result.boardingnumber : "";
                this.refs.refcode.value = (result.refcode !== undefined) ? result.refcode : "";
                this.refs.supplyawardmiles.value = (result.supplyawardmiles !== undefined) ? result.supplyawardmiles : "";
                this.refs.bookingpersonalias.value = (result.bookingpersonalias !== undefined) ? result.bookingpersonalias : "";
                this.refs.salesoffice.value = (result.salesoffice !== undefined) ? result.salesoffice : "";
                this.refs.paymentcardnumber.value = (result.paymentcardnumber !== undefined) ? result.paymentcardnumber : "";
                this.refs.cardnumber.value = (result.cardnumber !== undefined) ? result.cardnumber : "";
                let day = result.activitydate ? moment(result.activitydate).format('dddd') : null;

                let partnercode = (result.partnercode !== undefined) ? result.partnercode : null;
                let marketingairlinecode = (result.marketingairlinecode !== undefined) ? result.marketingairlinecode : null;
                let operatingairlinecode = (result.operatingairlinecode !== undefined) ? result.operatingairlinecode : null;

                let origin = (result.origin !== undefined) ? result.origin : null;
                let originairportname = (result.originairport !== undefined && result.originairport.airportname !== undefined) ? result.originairport.airportname : null;
                let origincityname = (result.originairport !== undefined && result.originairport.cityname !== undefined) ? result.originairport.cityname : null;

                let destination = (result.destination !== undefined) ? result.destination : null;
                let destinationairportname = (result.destinationairport !== undefined && result.destinationairport.airportname !== undefined) ? result.destinationairport.airportname : null;
                let destinationcityname = (result.destinationairport !== undefined && result.destinationairport.cityname) ? result.destinationairport.cityname : null;

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
                    marketingflightnumber: result.marketingflightnumber ? result.marketingflightnumber : null,
                    bookingclass: result.bookingclass ? result.bookingclass : null,
                    operatingairlinename: result.operatingairlinename ? result.operatingairlinename : null,
                    operatingflightnumber: result.operatingflightnumber ? result.operatingflightnumber : null,
                    flownclass: result.flownclass ? result.flownclass : null,
                    checkintype: (result.checkintype) ? result.checkintype : null,
                    bookingtype: (result.bookingtype) ? result.bookingtype : null,
                    paymenttype: (result.paymenttype) ? result.paymenttype : null,
                    lostbaggage: result.lostbaggage,
                    activitydate: result.activitydate ? moment(result.activitydate) : null,
                    refdate: (result.refdate) ? moment(result.refdate) : null,
                    operatingflightnumberdisabled: true
                },
                    this.getOptionsPartner(),
                    // this.getProgram(result.partnercode),
                    this.getOptionsActivityCode(partnercode, actionspage),
                    this.getOptionsAirline(partnercode, 'marketing', actionspage),
                    this.getOptionsAirline(partnercode, 'operating', actionspage),
                    this.getOptionsFlightNumber(day, marketingairlinecode, 'marketing', actionspage),
                    this.getOptionsBookingClass(marketingairlinecode, 'bookingclass', actionspage),
                    (operatingairlinecode) ? this.getOptionsFlightNumber(day, operatingairlinecode, 'operating', actionspage, origin, destination) : "",
                    (operatingairlinecode) ? this.getOptionsBookingClass(operatingairlinecode, 'flownclass', actionspage) : "",
                    this.getOptionsAirport());
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
        formData['activitydate'] = this.state.activitydate;
        formData['partnercode'] = this.state.partnercode;
        formData['partnerlocation'] = this.state.partnerlocation;
        formData['activitycode'] = this.state.activitycode;
        formData['marketingairlinecode'] = this.state.marketingairlinecode;
        formData['marketingflightnumber'] = this.state.marketingflightnumber;
        formData['bookingclass'] = this.state.bookingclass;
        formData['operatingairlinecode'] = this.state.operatingairlinecode;
        formData['operatingflightnumber'] = this.state.operatingflightnumber;
        formData['flownclass'] = this.state.flownclass;
        formData['origin'] = this.state.origin;
        formData['destination'] = this.state.destination;
        formData['checkintype'] = this.state.checkintype;
        formData['refdate'] = this.state.refdate;
        formData['bookingtype'] = this.state.bookingtype;
        formData['paymenttype'] = this.state.paymenttype;
        formData['checkintype'] = this.state.checkintype;

        if (this.handleValidation(formData)) {
            this.setState({ loading: true });
            let memberid = this.props.memberid;
            let cardnumber = formData.cardnumber;
            let activityid = formData.activityid;
            let activitytype = "AIR";
            let activitydate = moment(formData.activitydate).format("YYYY-MM-DD");
            let partnercode = formData.partnercode;
            let marketingairlinecode = formData.marketingairlinecode;

            let marketingflightnumber = formData.marketingflightnumber;
            let partmarketingflightnumber = marketingflightnumber.split("|SPLIT|", 3);
            marketingflightnumber = partmarketingflightnumber[0];

            let bookingclass = formData.bookingclass;
            let operatingairlinecode = formData.operatingairlinecode;

            let operatingflightnumber = formData.operatingflightnumber;
            if (operatingflightnumber !== null) {
                let partoperatingflightnumber = operatingflightnumber.split("|SPLIT|", 3);
                operatingflightnumber = partoperatingflightnumber[0];
            }

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
            let namecheck = false;
            if (type === 'rating-name') {
                namecheck = true;
                this.setState({ namecheck: true });
            }

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
                url = api.url.memberairactivity.update;
                data = {
                    memberid, activityid, cardnumber, activitytype, activitydate, partnercode, marketingairlinecode, marketingflightnumber,
                    operatingairlinecode, operatingflightnumber, origin, destination, bookingclass, flownclass, codeshareindicator,
                    delayeddays, delayedhours, vouchernumber, ticketnumber, couponnumber, seatnumber, boardingnumber,
                    checkintype, bookingtype, refcode, refdate, supplyawardmiles, bookingpersonalias, salesoffice, paymentcardnumber,
                    paymenttype, lostbaggage, namecheck
                };
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

    getOptionsAirport() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            airportiatacode: 'asc'
        };
        let criteria = {};
        let url = api.url.airport.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsAirport = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cityname + " (" + obj.airportiatacode + "), " + obj.airportname;
                    result2['value'] = obj.airportiatacode;
                    return result2;
                });

                //if options deactive
                const { actionspage } = this.state;
                //first airport
                const { origin, originairportname, origincityname } = this.state;
                let originlabel = origincityname + " (" + origin + "), " + originairportname;
                let optionsOrigin = [...optionsAirport];
                optionsOrigin = getOptionsDeactive(actionspage, optionsOrigin, origin, originlabel);

                //second airport
                const { destination, destinationairportname, destinationcityname } = this.state;
                let destinationlabel = destinationcityname + " (" + destination + "), " + destinationairportname;
                let optionsDestination = [...optionsAirport];
                optionsDestination = getOptionsDeactive(actionspage, optionsDestination, destination, destinationlabel);

                this.setState(prevState => ({
                    optionsAirport,
                    optionsOrigin,
                    optionsDestination,
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
        let criteria = (type === 'marketing') ? { partnercode, active: true } : { partnercode, isoperating: true, active: true };
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

    getOptionsFlightNumber(day = '', airlinecode = '', type = '', actionspage = '', origin = '', destination = '') {
        //criteria day
        let criteria = (type === 'marketing') ? { airlinecode, active: true } : { airlinecode, active: true, origin, destination };
        if (day !== null && day.toLowerCase() === 'monday') {
            criteria.monday = true;
        } else if (day !== null && day.toLowerCase() === 'tuesday') {
            criteria.tuesday = true;
        } else if (day !== null && day.toLowerCase() === 'wednesday') {
            criteria.wednesday = true;
        } else if (day !== null && day.toLowerCase() === 'thursday') {
            criteria.thursday = true;
        } else if (day !== null && day.toLowerCase() === 'friday') {
            criteria.friday = true;
        } else if (day !== null && day.toLowerCase() === 'saturday') {
            criteria.saturday = true;
        } else if (day !== null && day.toLowerCase() === 'sunday') {
            criteria.sunday = true;
        }

        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            flightnumber: 'asc'
        };
        let url = api.url.flightschedule.list;
        let column = [];
        /*loading select2 get data*/
        if (type === 'marketing') {
            this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, marketingflightnumber: true } }));
        } else {
            this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, operatingflightnumber: true } }));
        }
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                let optionsFlightNumber = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.flightnumber;
                    result2['value'] = obj.flightnumber + "|SPLIT|" + obj.origin + "|SPLIT|" + obj.destination;
                    result2['effectivedate'] = obj.effectivedate;
                    result2['discontinuedate'] = obj.discontinuedate;
                    return result2;
                }).filter(obj => {
                    var today = new Date();
                    var effdate = new Date(obj.effectivedate);
                    var disdate = new Date(obj.discontinuedate);
                    return effdate <= today && today <= disdate;
                });

                //if options deactive
                //operating flight number
                const { marketingflightnumber } = this.state;
                let optionsMarketingFlightNumber = [...optionsFlightNumber];
                if (marketingflightnumber) { optionsMarketingFlightNumber = getOptionsDeactive(actionspage, optionsMarketingFlightNumber, marketingflightnumber, marketingflightnumber); }

                //marketing flight number
                const { operatingflightnumber } = this.state;
                let optionsOperatingFlightNumber = [...optionsFlightNumber];
                if (operatingflightnumber) { optionsOperatingFlightNumber = getOptionsDeactive(actionspage, optionsOperatingFlightNumber, operatingflightnumber, operatingflightnumber); }

                if (type === 'marketing') {
                    let marketingflightnumberdisabled = (actionspage === 'view') ? true : false;
                    this.setState(prevState => ({
                        optionsMarketingFlightNumber,
                        marketingflightnumberdisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, marketingflightnumber: false }
                    }));
                } else {
                    let operatingflightnumberdisabled = (actionspage === 'view') ? true : false;
                    this.setState(prevState => ({
                        optionsOperatingFlightNumber,
                        operatingflightnumberdisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, operatingflightnumber: false }
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

    handleBackClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage
        });
    }

    handleActivityDateChange = (event) => {
        let activitydate = event === null ? null : event;
        let origin = null;
        let destination = null;
        let origindisabled = true;
        let destinationdisabled = true;
        let day = (activitydate !== null) ? moment(activitydate).format('dddd') : null;

        let marketingairlinecode = this.state.marketingairlinecode;
        let marketingflightnumber = null;
        let marketingflightnumberdisabled = true;
        let bookingclassdisabled = true;
        let bookingclass = null;

        let operatingairlinecode = this.state.operatingairlinecode;
        let operatingflightnumber = null;
        let operatingflightnumberdisabled = true;
        let operatingairlinecodedisabled = null;
        let flownclassdisabled = true;
        let flownclass = null;

        this.setState(
            {
                activitydate, marketingflightnumber, marketingflightnumberdisabled, origin, destination, origindisabled, destinationdisabled,
                bookingclassdisabled, bookingclass, flownclassdisabled, flownclass,
                operatingairlinecodedisabled, operatingairlinecode, operatingflightnumber, operatingflightnumberdisabled
            },
            (day && marketingairlinecode) ? this.getOptionsFlightNumber(day, marketingairlinecode, 'marketing') : null,
            (day && marketingairlinecode) ? this.getOptionsBookingClass(marketingairlinecode, 'bookingclass') : null,
            (day && operatingairlinecode) ? this.getOptionsFlightNumber(day, operatingairlinecode, 'operating') : null,
            (day && operatingairlinecode) ? this.getOptionsBookingClass(operatingairlinecode, 'flownclass') : null);
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
        let marketingflightnumber = null;
        let marketingflightnumberdisabled = true;
        let bookingclass = null;
        let bookingclassdisabled = true;
        let operatingairlinecode = null;
        let operatingairlinecodedisabled = true;
        let operatingflightnumber = null;
        let operatingflightnumberdisabled = true;
        let flownclass = null;
        let flownclassdisabled = true;
        let origin = null;
        let destination = null;
        let origindisabled = true;
        let destinationdisabled = true;
        this.setState({
            partnercode, activitycode, activitycodedisabled,
            marketingairlinecode, marketingairlinecodedisabled,
            marketingflightnumber, marketingflightnumberdisabled,
            bookingclass, bookingclassdisabled,
            operatingairlinecode, operatingairlinecodedisabled,
            operatingflightnumber, operatingflightnumberdisabled,
            flownclass, flownclassdisabled,
            origin, destination, origindisabled, destinationdisabled
        });
        if (partnercode) {
            this.getOptionsActivityCode(partnercode);
            this.getOptionsAirline(partnercode, 'marketing');
            this.getOptionsAirline(partnercode, 'operating');
            // this.getProgram(partnercode)
        }
    }

    handleOperatingAirlineCodeChange = (event) => {
        let operatingairlinecode = event === null ? null : event.value;
        let operatingflightnumber = null;
        let operatingflightnumberdisabled = true;
        let flownclass = null;
        let flownclassdisabled = true;
        let day = (this.state.activitydate !== null) ? moment(this.state.activitydate).format('dddd') : null;
        this.setState({ operatingairlinecode, operatingflightnumber, operatingflightnumberdisabled, flownclass, flownclassdisabled });
        if (day && operatingairlinecode) {
            const { actionspage, origin, destination } = this.state;
            this.getOptionsFlightNumber(day, operatingairlinecode, 'operating', actionspage, origin, destination);
            this.getOptionsBookingClass(operatingairlinecode, 'operating');
        }
    }

    handleMarketingAirlineChange = (event) => {
        let marketingairlinecode = event === null ? null : event.value;
        let marketingflightnumber = null;
        let marketingflightnumberdisabled = true;
        let bookingclass = null;
        let bookingclassdisabled = true;
        let origin = null;
        let destination = null;
        let origindisabled = true;
        let destinationdisabled = true;
        let day = (this.state.activitydate !== null) ? moment(this.state.activitydate).format('dddd') : null;
        this.setState({
            marketingairlinecode, marketingflightnumber,
            marketingflightnumberdisabled, bookingclass, bookingclassdisabled,
            origin, destination, origindisabled, destinationdisabled
        });
        if (day && marketingairlinecode) {
            this.getOptionsFlightNumber(day, marketingairlinecode, 'marketing');
            this.getOptionsBookingClass(marketingairlinecode, 'bookingclass');
        }
    }

    handleMarketingFlightNumberChange = (event) => {
        let marketingflightnumber = event === null ? null : event.value;
        let origin = null;
        let destination = null;
        let origindisabled = true;
        let destinationdisabled = true;
        if (marketingflightnumber !== null) {
            let partFlightNumber = marketingflightnumber.split("|SPLIT|", 3);
            origin = partFlightNumber[1];
            destination = partFlightNumber[2];
            origindisabled = false;
            destinationdisabled = false;

            const { day, operatingairlinecode, actionspage } = this.state;
            if (operatingairlinecode) {
                this.getOptionsFlightNumber(day, operatingairlinecode, 'operating', actionspage, origin, destination);
            }
        }
        this.setState({ marketingflightnumber, origin, destination, origindisabled, destinationdisabled });
    }

    handleOperatingFlightNumbereChange = (event) => {
        let operatingflightnumber = event === null ? null : event.value;
        this.setState({ operatingflightnumber });
    }

    handleOriginChange = (event) => {
        let origin = event === null ? null : event.value;
        this.setState({ origin });
    }

    handleDestinationChange = (event) => {
        let destination = event === null ? null : event.value;
        this.setState({ destination });
    }

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
        const { isLoadingSelect2, activityid, activitydate,
            partnercode, optionsPartner, marketingairlinecode, marketingairlinecodedisabled, optionsMarketingAirlines, optionsOperatingAirlines,
            operatingairlinecode, operatingairlinecodedisabled,
            optionsMarketingFlightNumber, marketingflightnumber, marketingflightnumberdisabled,
            optionsBookingClass, bookingclass, bookingclassdisabled,
            optionsFlownClass, flownclass, flownclassdisabled,
            optionsOperatingFlightNumber, operatingflightnumber, operatingflightnumberdisabled, optionsOrigin, optionsDestination, origin, destination,
            refdate,
            optionsCheckinType, optionsBookingType, optionsPaymentType, checkintype, bookingtype, paymenttype, lostbaggage } = this.state;
        const { origindisabled, destinationdisabled } = this.state;
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="member-section">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="title-has-control">{titlepage}</h1>
                    </div>
                    <hr />
                    <div className="card-table">
                        <form className="clearfix position-relative" onSubmit={(e) => e.preventDefault()} autoComplete="off">
                            <Loader value={loading} />
                            <div className="row">
                                <div className="col-md-6">
                                    <input className="form-control" type="hidden" id="activityid-view" ref="activityid" maxLength="45" value={activityid} />
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
                                        <div className="col-sm-8">
                                            <Select2 reference="marketingflightnumber" className="reactSelect2" id="marketingflightnumber-view" options={optionsMarketingFlightNumber} onChange={this.handleMarketingFlightNumberChange} value={optionsMarketingFlightNumber.filter(({ value }) => value === marketingflightnumber)} disabled={marketingflightnumberdisabled} isLoading={isLoadingSelect2.marketingflightnumber}></Select2>
                                            <span className="text-danger">{errors["marketingflightnumber"]}</span>
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
                                        <label className="col-sm-4 col-form-label" htmlFor="operatingairlinecode-view">Operating Airline {operatingairlinecode ? null : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
                                        <div className="col-sm-8">
                                            <Select2 reference="operatingairlinecode" className="reactSelect2" id="operatingairlinecode-view" options={optionsOperatingAirlines} onChange={this.handleOperatingAirlineCodeChange} value={optionsOperatingAirlines.filter(({ value }) => value === operatingairlinecode)} disabled={operatingairlinecodedisabled} isLoading={isLoadingSelect2.airline}></Select2>
                                            <span className="text-danger">{errors["operatingairlinecode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="operatingflightnumber-view">Operating Flight Number {operatingairlinecode ? null : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
                                        <div className="col-sm-8">
                                            <Select2 reference="operatingflightnumber" className="reactSelect2" id="operatingflightnumber-view" options={optionsOperatingFlightNumber} onChange={this.handleOperatingFlightNumbereChange} value={optionsOperatingFlightNumber.filter(({ value }) => value === operatingflightnumber)} disabled={operatingflightnumberdisabled} isLoading={isLoadingSelect2.operatingflightnumber}></Select2>
                                            <span className="text-danger">{errors["operatingflightnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="flownclass-view">Flown Class {operatingairlinecode ? null : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
                                        <div className="col-sm-8">
                                            <Select2 reference="flownclass" className="reactSelect2" id="flownclass-view" options={optionsFlownClass} onChange={this.handleFlownClassChange} value={optionsFlownClass.filter(({ value }) => value === flownclass)} disabled={flownclassdisabled} isLoading={isLoadingSelect2.flownclass}></Select2>
                                            <span className="text-danger">{errors["flownclass"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="origin-view">Origin </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="origin" className="reactSelect2" id="origin-view" options={optionsOrigin} onChange={this.handleOriginChange} value={optionsOrigin.filter(({ value }) => value === origin)} disabled={origindisabled} isLoading={isLoadingSelect2.airport}></Select2>
                                            <span className="text-danger">{errors["origin"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="destination-view">Destination </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="destination" className="reactSelect2" id="destination-view" options={optionsDestination} onChange={this.handleDestinationChange} value={optionsDestination.filter(({ value }) => value === destination)} disabled={destinationdisabled} isLoading={isLoadingSelect2.airport}></Select2>
                                            <span className="text-danger">{errors["destination"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="codeshareindicator-view">Codeshare Indicator <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="codeshareindicator-view" ref="codeshareindicator" maxLength="20" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["codeshareindicator"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="delayeddays-view">Delayed Day(s) <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="delayeddays-view" ref="delayeddays" maxLength="15" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["delayeddays"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="delayedhours-view">Delayed Hour(s) <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="delayedhours-view" ref="delayedhours" maxLength="15" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["delayedhours"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="vouchernumber-view">Voucher Number <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="vouchernumber-view" ref="vouchernumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["vouchernumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="ticketnumber-view">Ticket Number <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="ticketnumber-view" ref="ticketnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["ticketnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="couponnumber-view">Coupon Number <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="couponnumber-view" ref="couponnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["couponnumber"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="seatnumber-view">Seat Number <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="seatnumber-view" ref="seatnumber" maxLength="5" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["seatnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="boardingnumber-view">Boarding Number <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="boardingnumber-view" ref="boardingnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["boardingnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number ID</label>
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
                                        <label className="col-sm-4 col-form-label" htmlFor="checkintype-view">Check in Type <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="checkintype" className="reactSelect2" id="checkintype-view" options={optionsCheckinType} onChange={this.handleCheckinTypeChange} value={optionsCheckinType.filter(({ value }) => value === checkintype)} disabled={generalfielddisabled}></Select2>
                                            <span className="text-danger">{errors["checkintype"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="bookingtype-view">Booking Type <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="bookingtype" className="reactSelect2" id="bookingtype-view" options={optionsBookingType} onChange={this.handleBookingTypeChange} value={optionsBookingType.filter(({ value }) => value === bookingtype)} disabled={generalfielddisabled}></Select2>
                                            <span className="text-danger">{errors["bookingtype"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="refcode-view">Reference Code <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="refcode-view" ref="refcode" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["refcode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="refdate-view">Reference Date <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handleReferenceDateChange} selected={refdate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} maxDate={addDays(new Date(), 0)} />
                                            <span className="text-danger">{errors["refdate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="supplyawardmiles-view">Supply Award Miles <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="supplyawardmiles-view" ref="supplyawardmiles" maxLength="15" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["supplyawardmiles"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="bookingpersonalias-view">Booking Person Alias <p style={{ color: 'grey' }}><i>(Mandatory if save with name check)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="bookingpersonalias-view" ref="bookingpersonalias" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["bookingpersonalias"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="salesoffice-view">Sales Office <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="salesoffice-view" ref="salesoffice" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["salesoffice"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="paymentcardnumber-view">Payment Card Number<p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="paymentcardnumber-view" ref="paymentcardnumber" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["paymentcardnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="paymenttype-view">Payment Type <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
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
                                </div>
                            </div>
                            <div className="box-footer text-center">
                                <button type="button" ref={this.refresh} onClick={this.props.refreshMainPage} className="hidden">Close Refresh</button>
                                {/* {
                                    (actionspage !== 'view' && actionspage !== 'update') ? <button type="button" className="btn btn-outline-dark normal" onClick={(e) => this.saveAction(e, 'normal')}>Save</button> : ""
                                }
                                &nbsp;&nbsp; */}
                                {
                                    (actionspage !== 'view' && actionspage !== 'update') ? <button type="button" className="btn btn-outline-dark normal" onClick={(e) => this.saveAction(e, 'rating-name')}>Save With Rating (Name Check)</button> : ""
                                }
                                &nbsp;&nbsp;
                                {
                                    (actionspage !== 'view' && actionspage !== 'update') ? <button type="button" className="btn btn-outline-dark normal" onClick={(e) => this.saveAction(e, 'rating-no-name')}>Save With Rating (No Name Check)</button> : ""
                                }
                                &nbsp;&nbsp;
                            <button type="button" onClick={() => (this.handleBackClick('index'))} className="btn btn-outline-dark normal">Back</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;