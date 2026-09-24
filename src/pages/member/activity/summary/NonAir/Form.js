import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../../../../utilities/RequestService';
import Alert from '../../../../../components/Alert';
import { api } from '../../../../../config/Services';
import Loader from '../../../../../components/Loader';
import Datepicker from '../../../../../components/Datepicker';
import Select2 from '../../../../../components/Select2';
import moment from 'moment';
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
            titlepage: 'Create Non Air Activity',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            cardnumber: props.getStore().cardnumber,
            memberid: props.getStore().memberid,
            activityid: props.getStore().activityid,
            activitytype: 'NONAIR',
            activitydate: null,
            activityenddate: null,
            activitycode: null,
            partnercode: null,
            optionsActivityCode: [],
            optionsPartner: [],
            partnerlocationcodedisabled: true,
            optionsPartnerLocation: [],
            partnerlocationcode: null,
            activitycodedisabled: true,
            promodate: null,
            refdate: null,
            optionsTrxType: [
                { label: "Earning", value: "EARNING" },
                { label: "Spending", value: "SPENDING" }
            ],
            trxtype: null,
            trxdate: null,
            active: null,
            transactioninfo: [],
            isLoadingSelect2: {
                partner: false,
                partnerlocationcode: false,
                activitycode: false
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

        //activityenddate
        if (!field['activityenddate']) {
            errors['activityenddate'] = 'Required';
        }

        //partnercode
        if (!field['partnercode']) {
            errors['partnercode'] = 'Required';
        }

        //partnerlocationcode
        if (!field['partnerlocationcode']) {
            errors['partnerlocationcode'] = 'Required';
        }

        //activitycode
        if (!field['activitycode']) {
            errors['activitycode'] = 'Required';
        }

        //cardnumber
        if (!field['cardnumber']) {
            errors['cardnumber'] = 'Required';
        } else if (!field['cardnumber'].match(/^[0-9]+$/)) {
            errors['cardnumber'] = 'Only numeric';
        }

        //promocode
        if (field['promocode']) {
            if (!field['promocode'].match(/^[a-zA-Z0-9\s]+$/)) {
                errors['promocode'] = 'Only alphanumeric and space';
            } else if (field['promocode'].length > 45) {
                errors['promocode'] = 'Maximum 45 characters';
            }
        }

        //promoref
        if (field['promoref']) {
            if (!field['promoref'].match(/^[a-zA-Z0-9\s]+$/)) {
                errors['promoref'] = 'Only alphanumeric and space';
            } else if (field['promoref'].length > 45) {
                errors['promoref'] = 'Maximum 45 characters';
            }
        }

        //activityvolume
        // if (field['type'] !== 'normal') {
        //     if (!field['activityvolume']) {
        //         errors['activityvolume'] = 'Required';
        //     }
        // }
        if (field['activityvolume']) {
            if (!field['activityvolume'].match(/^[0-9]+$/)) {
                errors['activityvolume'] = 'Only numeric';
            } else if (field['activityvolume'].length > 9) {
                errors['activityvolume'] = 'Maximum 9 characters';
            }
        }

        //supplyawardmiles
        if (field['supplyawardmiles']) {
            if (!field['supplyawardmiles'].match(/^[0-9]+$/)) {
                errors['supplyawardmiles'] = 'Only numeric';
            } else if (field['supplyawardmiles'].length > 9) {
                errors['supplyawardmiles'] = 'Maximum 9 characters';
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

        //memberid
        // if (!field['memberid']) {
        //     errors['memberid'] = 'Required';
        // } else if (!field['memberid'].match(/^[0-9]+$/)) {
        //     errors['memberid'] = 'Only numeric';
        // } else if (field['memberid'].length > 45) {
        //     errors['memberid'] = 'Maximum 45 characters';
        // }

        //paymentcardnumber
        if (field['paymentcardnumber']) {
            if (!field['paymentcardnumber'].match(/^[0-9]+$/)) {
                errors['paymentcardnumber'] = 'Only numeric';
            } else if (field['paymentcardnumber'].length > 45) {
                errors['paymentcardnumber'] = 'Maximum 45 characters';
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
            let titlepage = 'Edit Non Air Activity';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View Non Air Activity';
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
                this.refs.promocode.value = (result.promocode !== undefined) ? result.promocode : "";
                this.refs.promoref.value = (result.promoref !== undefined) ? result.promoref : "";
                this.refs.activityvolume.value = (result.activityvolume !== undefined) ? result.activityvolume : "";
                this.refs.supplyawardmiles.value = (result.supplyawardmiles !== undefined) ? result.supplyawardmiles : "";
                this.refs.refcode.value = (result.refcode !== undefined) ? result.refcode : "";
                this.refs.bookingpersonalias.value = (result.bookingpersonalias !== undefined) ? result.bookingpersonalias : "";
                this.refs.paymentcardnumber.value = (result.paymentcardnumber !== undefined) ? result.paymentcardnumber : "";
                this.refs.salesoffice.value = (result.salesoffice !== undefined) ? result.salesoffice : "";
                this.refs.cardnumber.value = (result.cardnumber !== undefined) ? result.cardnumber : "";

                let transactioninfo = (result.transactioninfo !== null && result.transactioninfo.length) ? result.transactioninfo.filter(val => val.trxtype === 'EARNING') : [];
                this.refs.trxid.value = (transactioninfo[0]) ? transactioninfo[0].trxid : "";
                this.refs.awardmiles.value = (transactioninfo[0]) ? transactioninfo[0].awardmiles : "";
                this.refs.tiermiles.value = (transactioninfo[0]) ? transactioninfo[0].tiermiles : "";
                this.refs.frequency.value = (transactioninfo[0]) ? transactioninfo[0].frequency : "";

                //call loader
                this.setState({
                    loading: false,
                    activityid: activityid,
                    activitydate: (result.activitydate) ? moment(result.activitydate) : null,
                    activityenddate: (result.activityenddate) ? moment(result.activityenddate) : null,
                    partnercode: result.partnercode ? result.partnercode : null,
                    partnername: result.partnername ? result.partnername : null,
                    partnerlocationcode: result.partnerlocationcode ? result.partnerlocationcode : null,
                    activitycode: result.activitycode ? result.activitycode : null,
                    activitycodename: result.activitycodename ? result.activitycodename : null,
                    promodate: (result.promodate) ? moment(result.promodate) : null,
                    refdate: (result.refdate) ? moment(result.refdate) : null,
                    namecheck: result.namecheck,
                    retroclaimid: (result.retroclaimid) ? result.retroclaimid : null,
                    transactioninfo,
                    trxdate: (transactioninfo[0]) ? moment(transactioninfo[0].trxdate) : null,
                    trxtype: (transactioninfo[0]) ? transactioninfo[0].trxtype : null,
                    active: (transactioninfo[0]) ? transactioninfo[0].active : null,
                },
                    this.getOptionsPartner(),
                    this.getOptionsPartnerLocation(result.partnercode, actionspage),
                    this.getOptionsActivityCode(result.partnercode, actionspage));
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
            if (field === "namecheck") {
                formData[field] = this.refs[field].checked;
            } else {
                if (this.refs[field].value) {
                    formData[field] = this.refs[field].value.trim();
                }
            }
        }

        formData['type'] = type;
        formData['activitydate'] = this.state.activitydate;
        formData['activityenddate'] = this.state.activityenddate;
        formData['partnercode'] = this.state.partnercode;
        formData['partnerlocationcode'] = this.state.partnerlocationcode;
        formData['activitycode'] = this.state.activitycode;
        formData['promodate'] = this.state.promodate;
        formData['refdate'] = this.state.refdate;

        if (this.handleValidation(formData)) {
            this.setState({ loading: true });
            let activityid = formData.activityid;
            let activityinfo = 'ACTIVITY_RATED';
            let activitydate = moment(formData.activitydate).format("YYYY-MM-DD");
            let activityenddate = moment(formData.activityenddate).format("YYYY-MM-DD");
            let partnercode = formData.partnercode;
            let partnerlocationcode = formData.partnerlocationcode;
            let activitycode = formData.activitycode;
            let promocode = (formData.promocode && formData.promocode.length > 0) ? formData.promocode : null;
            let promoref = (formData.promoref && formData.promoref.length > 0) ? formData.promoref : null;
            let promodate = (formData.promodate) ? moment(formData.promodate).format("YYYY-MM-DD") : null;;
            let activityvolume = (formData.activityvolume && formData.activityvolume.length > 0) ? formData.activityvolume : null;
            let supplyawardmiles = (formData.supplyawardmiles && formData.supplyawardmiles.length > 0) ? formData.supplyawardmiles : null;
            let refcode = (formData.refcode && formData.refcode.length > 0) ? formData.refcode : null;
            let refdate = (formData.refdate) ? moment(formData.refdate).format("YYYY-MM-DD") : null;
            let bookingpersonalias = (formData.bookingpersonalias && formData.bookingpersonalias.length > 0) ? formData.bookingpersonalias.toUpperCase() : null;
            let salesoffice = (formData.salesoffice && formData.salesoffice.length > 0) ? formData.salesoffice.toUpperCase() : null;
            let paymentcardnumber = (formData.paymentcardnumber && formData.paymentcardnumber.length > 0) ? formData.paymentcardnumber : null;
            let namecheck = false;
            if (type === 'rating-name') {
                namecheck = true;
            }
            let oldactivityid = activityid;
            let newactivityid = null;
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
            let data = '';
            let message = '';

            if (typeof activityid === 'undefined') {
                if (type === 'normal') {
                    url = api.url.membernonairactivity.create;
                } else {
                    url = api.url.membernonairactivity.createwithrating;
                }
                message = 'New data has been created';
                data = {
                    activitytype, activitydate, activityenddate, partnercode, partnerlocationcode, activitycode, promocode, promoref, promodate, activityvolume, supplyawardmiles,
                    refcode, refdate, bookingpersonalias, memberid, salesoffice, paymentcardnumber, namecheck, cardnumber
                };
            } else {
                message = 'Data has been updated';
                if (type === 'makecorrection') {
                    newactivityid = activityid;
                    url = api.url.membertransaction.earningcorrection;
                    data = {
                        memberid, oldactivityid, newactivityid, activitycode, customtrxcode, trxdate, awardmiles, tiermiles, frequency, basemiles,
                        classofservicebonus, elitetierbonusmiles, promotionalbonusmiles
                    };
                } else {
                    url = api.url.membernonairactivity.updatewithrating;
                    data = {
                        activityid, activityinfo, activitytype, activitydate, activityenddate, partnercode, partnerlocationcode, activitycode, promocode, promoref, promodate, activityvolume, supplyawardmiles,
                        refcode, refdate, bookingpersonalias, memberid, salesoffice, paymentcardnumber, namecheck, cardnumber
                    };
                }
            }
            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
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
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        }
    };

    handleRefreshMainPage = () => {
        this.refresh.current.click();
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
            partnertype: 'NONAIR',
            active: true
        };
        let url = api.url.partner.list;
        let column = [];
        /*loading select2 get data*/
        this.setState({ isLoadingSelect2: { partner: true } });
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

                this.setState({
                    optionsPartner,
                    isLoadingSelect2: { partner: false }
                });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsPartnerLocation(partnercode = '', actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            partnercode: 'asc'
        };
        let criteria = {
            partnercode
        };
        let url = api.url.partnerlocation.list;
        let column = [];
        /*loading select2 get data*/
        this.setState({ isLoadingSelect2: { partnerlocationcode: true } });
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsPartnerLocation = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.partnerlocationcode;
                    result2['value'] = obj.partnerlocationcode;
                    return result2;
                })

                let partnerlocationcodedisabled = (actionspage === 'view') ? true : false;
                this.setState({
                    optionsPartnerLocation,
                    partnerlocationcodedisabled,
                    isLoadingSelect2: { partnerlocationcode: false }
                });
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
            partnercode,
            active: true
        };
        let url = api.url.activitycode.list;
        let column = [];
        /*loading select2 get data*/
        this.setState({ isLoadingSelect2: { activitycode: true } });
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
                const { activitycode, activitycodename, actionspage } = this.state;
                optionsActivityCode = getOptionsDeactive(actionspage, optionsActivityCode, activitycode, activitycodename);

                let activitycodedisabled = (actionspage === 'view') ? true : false;
                this.setState({
                    optionsActivityCode,
                    activitycodedisabled,
                    isLoadingSelect2: { activitycode: false }
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
        let activityenddate = null;
        this.setState({ activitydate, activityenddate });
    }

    handleActivityEndDateChange = (event) => {
        let activityenddate = event === null ? null : event;
        this.setState({ activityenddate });
    }

    handlePromoDateChange = (event) => {
        let promodate = event === null ? null : event;
        this.setState({ promodate });
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
        let partnerlocationcodedisabled = true;
        let partnerlocationcode = null;
        let activitycode = null;
        let activitycodedisabled = true;
        this.setState({ partnercode, partnerlocationcode, partnerlocationcodedisabled, activitycode, activitycodedisabled });
        if (partnercode) {
            this.getOptionsPartnerLocation(partnercode);
            this.getOptionsActivityCode(partnercode);
        }
    }

    handlePartnerLocationChange = (event) => {
        let partnerlocationcode = event === null ? null : event.value;
        this.setState({ partnerlocationcode });
    }

    render() {
        const { isLoadingSelect2, activityid, activitydate, activityenddate, activitycode, optionsActivityCode, activitycodedisabled,
            partnercode, optionsPartner, partnerlocationcode, optionsPartnerLocation, partnerlocationcodedisabled,
            promodate, refdate,
            transactioninfo, optionsTrxType, trxtype, trxdate, active } = this.state;
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
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="activitydate-view">Start Date </label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handleActivityDateChange} selected={activitydate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} maxDate={moment(new Date())} /><br />
                                            <span className="text-danger">{errors["activitydate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="activityenddate-view">End Date </label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handleActivityEndDateChange} selected={activityenddate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={(moment(activitydate))} maxDate={moment(new Date())} /><br />
                                            <span className="text-danger">{errors["activityenddate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="partnercode-view">Partner </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="partnercode" className="reactSelect2" id="partnercode-view" options={optionsPartner} onChange={this.handlePartnerChange} value={optionsPartner.filter(({ value }) => value === partnercode)} disabled={generalfielddisabled} isLoading={isLoadingSelect2.partner}></Select2>
                                            <span className="text-danger">{errors["partnercode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="partnerlocationcode-view">Partner Location </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="partnerlocationcode" className="reactSelect2" id="partnerlocationcode-view" options={optionsPartnerLocation} onChange={this.handlePartnerLocationChange} value={optionsPartnerLocation.filter(({ value }) => value === partnerlocationcode)} disabled={partnerlocationcodedisabled} isLoading={isLoadingSelect2.partnerlocationcode}></Select2>
                                            <span className="text-danger">{errors["partnerlocationcode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="activitycode-view">Activity Code </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="activitycode" className="reactSelect2" id="activitycode-view" options={optionsActivityCode} onChange={this.handleActivityCodeChange} value={optionsActivityCode.filter(({ value }) => value === activitycode)} disabled={activitycodedisabled} isLoading={isLoadingSelect2.activitycode}></Select2>
                                            <span className="text-danger">{errors["activitycode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="promocode-view">Promotion Code <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="promocode-view" ref="promocode" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["promocode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="promoref-view">Promotion Reference <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="promoref-view" ref="promoref" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["promoref"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="promodate-view">Promotion Date <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handlePromoDateChange} selected={promodate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["promodate"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="activityvolume-view">Activity Volume </label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="activityvolume-view" ref="activityvolume" maxLength="9" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["activityvolume"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" maxLength="45" disabled />
                                            <span className="text-danger">{errors["cardnumber"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="supplyawardmiles-view">Supply Award Miles <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="supplyawardmiles-view" ref="supplyawardmiles" maxLength="9" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["supplyawardmiles"]}</span>
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
                                            <Datepicker className="form-control" onChange={this.handleReferenceDateChange} selected={refdate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["refdate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="bookingpersonalias-view">Booking Person Alias <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="bookingpersonalias-view" ref="bookingpersonalias" maxLength="45" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["bookingpersonalias"]}</span>
                                        </div>
                                    </div>
                                    {/* <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="memberid-view">Used Member ID <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="memberid-view" ref="memberid" maxLength="45" value={memberid} disabled />
                                            <span className="text-danger">{errors["memberid"]}</span>
                                        </div>
                                    </div> */}
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
                    <div className={(actionspage !== 'create') ? "main-panel member-section mt-3" : "main-panel member-section mt-3 hidden"}>
                        <div className="content-title flex-hr mb-0 title-description">
                            <h3 className="title-has-control mt-2">Member Transaction</h3>
                        </div>
                        <hr className="mt-0" />
                        <div className="card-table">
                            <div className={(transactioninfo.length && trxtype === 'EARNING' && active) ? "row" : "row hidden"}>
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
                            <div className={(transactioninfo.length && trxtype === 'EARNING' && active) ? "mt-4 text-center hidden" : "mt-4 text-center"}>
                                <h4>No Transaction Recorded</h4>
                            </div>
                            <div className="box-footer text-center mt-4">
                                {
                                    (actionspage !== 'view' && transactioninfo.length && trxtype === 'EARNING' && active) ?
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