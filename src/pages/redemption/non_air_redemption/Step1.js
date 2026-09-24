import React, { Component } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import { Link } from 'react-router-dom';
import Alert from '../../../components/Alert';
import Loader from '../../../components/Loader';
import { RetrieveRequest, SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import Select2 from '../../../components/Select2';
import { api } from '../../../config/Services';
import moment from 'moment';
import ErrorGeneral from '../../error/ErrorGeneral';
import { getProfile } from '../../../utilities/AuthService';
import { getOptionsDeactive, getTravelerType } from '../../../utilities/Helpers';
import { formatNumber } from '../../../utilities/Helpers';

import HeaderMemberProfile from '../../../components/Header/MemberProfile';
import HeaderAwards from '../../../components/Header/Awards';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: [],
            optionsSalutation: [],
            salutationcode: null,
            selfusage: true,
            cardnumber: (this.props.cardnumber) ? this.props.cardnumber : null,
            awardcode: (this.props.awardcode) ? this.props.awardcode : null,
            categorytype: '',
            member: {
                memberid: null,
                salutationcode: null,
                name: '',
                familyname: '',
                awardmiles: null,
                age: null
            },
            memberid: null,
            totalprice: 0,
            priceaward: 0,
            freeaward: false,
            confirmdisabled: false,
            branchcodeenroll: null,
            countrycode: null,
            issueddate: moment(new Date()),
            optionsTravelerType: [
                { label: 'Adult', value: 'ADULT' },
                { label: 'Infant', value: 'INFANT' },
                { label: 'Child', value: 'CHILD' }
            ],
            travelertype: null,
            username: (getProfile().username) ? getProfile().username : '',
            pricingby: null,
            alltiers: null,
            allcountries: null,
            totalpricedisabled: false,
            bookingcodedisbaled: false,
            // pricemultipler: 1,
            isLoadingSelect2: {
                salutation: false,
            }
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //salutationcode
        // if (!field['salutationcode']) {
        //     errors['salutationcode'] = 'Required';
        // }

        //name
        if (!field['name']) {
            errors['name'] = 'Required';
        } else if (!field['name'].match(/^[a-zA-Z\s]+$/)) {
            errors['name'] = 'Only letters and space';
        } else if (field['name'].length > 45) {
            errors['name'] = 'Maximum 45 characters';
        }

        //familyname
        if (!field['familyname']) {
            errors['familyname'] = 'Required';
        } else if (!field['familyname'].match(/^[a-zA-Z]+$/)) {
            errors['familyname'] = 'Only letters';
        } else if (field['familyname'].length > 45) {
            errors['familyname'] = 'Maximum 45 characters';
        }

        //memberid
        if (field['memberid']) {
            if (!field['memberid'].match(/^[0-9]+$/)) {
                errors['memberid'] = 'Only numeric';
            } else if (field['memberid'].length > 16) {
                errors['memberid'] = 'Maximum 16 characters';
            }
        }

        //bookingcode
        if (field['bookingcode']) {
            if (!field['bookingcode'].match(/^[a-zA-Z0-9]+$/)) {
                errors['bookingcode'] = 'Only alphanumeric';
            } else if (field['bookingcode'].length > 50) {
                errors['bookingcode'] = 'Maximum 50 characters';
            }
        }

        const { pricingby, freeaward } = this.state;
        if (pricingby === 'MANUAL') {
            //totalprice
            if (!field['totalprice']) {
                errors['totalprice'] = 'Required';
            } else if (!field['totalprice'].match(/^[0-9]+$/)) {
                errors['totalprice'] = 'Only numeric';
            } else if (field['totalprice'].length > 45) {
                errors['totalprice'] = 'Maximum 45 characters';
            } else if (Number.parseInt(field['totalprice'], 0) === 0 && !freeaward) {
                errors['totalprice'] = 'Price must be greater than 0';
            }
        }

        //travelertype
        if (!field['travelertype']) {
            errors['travelertype'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        this.getOptionsSalutation();
        this.getEligibleRedeem();
    }

    getEligibleRedeem() {
        let url = api.url.redemption.eligibleredeem;
        const { cardnumber } = this.state;
        let data = { cardnumber };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result && result.redeemstatus) {
                let redeemstatus = result.redeemstatus;
                let memberid = result.memberid;

                //reducer redemption
                let data = { memberid, cardnumber, redeemstatus };
                this.props.setData("SETDATA", data);

                /* SET ELIGIBLE REDEEM STATUS ON STORE REDEEMPTION */
                this.props.setEligibleRedeemStatus(redeemstatus);

                this.setState({
                    memberid
                }, () => this.getMemberProfile(memberid));
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

    checkConfirmation(awardmiles, priceaward, countrycode, tierid, awardcode, alltiers, allcountries) {
        let confirmdisabled = true;

        if ((awardmiles > priceaward) && alltiers && allcountries) {
            confirmdisabled = false;
            this.setState({ confirmdisabled, loading: false });
        } else {
            this.checkEligibleCountry(awardcode, countrycode).then((response) => {
                let eligiblecountry = (allcountries) ? true : response;
                this.checkEligibleTier(awardcode, tierid).then((response) => {
                    let eligibletier = (alltiers) ? true : response;
                    if ((awardmiles > priceaward) && eligibletier && eligiblecountry) {
                        confirmdisabled = false;
                    }
                    let bookingcodedisbaled = (confirmdisabled) ? true : false;
                    this.setState({ bookingcodedisbaled, confirmdisabled, loading: false });
                });
            })
        }
    }

    checkEligibleTier(awardcode, tierid) {
        let paging = {};
        let sort = {};
        let criteria = { awardcode };
        let url = api.url.awardeligibletiers.list;
        let column = [];
        //call loader
        this.setState({ loading: true });
        return RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
            const { result } = response;
            let eligible = false;
            for (const field in result) {
                if (result[field].tierid === tierid) {
                    eligible = true;
                }
            }

            return eligible;
        });
    }

    checkEligibleCountry(awardcode, countrycode) {
        let paging = {};
        let sort = {};
        let criteria = { awardcode };
        let url = api.url.awardeligiblecountries.list;
        let column = [];
        //call loader
        this.setState({ loading: true });
        return RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
            const { result } = response;
            let eligible = false;
            for (const field in result) {
                if (result[field].countrycode === countrycode) {
                    eligible = true;
                }
            }

            return eligible;
        });
    }

    getMemberProfile(memberid) {
        let url = api.url.member.profile;
        let type = 'SUMMARY';

        let data = { memberid, type };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { result, status } = response;

            if (status.responsecode.substring(0, 1) === '0' && result) {
                let branchcodeenroll = (result.branchcodeenroll !== undefined) ? result.branchcodeenroll : null;
                let salutationcode = (result.salutationcode !== undefined) ? result.salutationcode : null;
                let salutationname = (result.salutationname !== undefined) ? result.salutationname : null;
                let firstname = (result.firstname !== undefined) ? result.firstname : '';
                let lastname = (result.lastname !== undefined) ? result.lastname : '';
                let dateofbirth = (result.dateofbirth !== undefined) ? result.dateofbirth : '';
                let age = moment().diff(moment(dateofbirth), 'years');
                let travelertype = getTravelerType(age);
                let name = firstname;
                let familyname = lastname;
                let awardmiles = (result.memberaccount !== undefined && result.memberaccount.awardmiles !== undefined) ? result.memberaccount.awardmiles : '';
                let tierid = (result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].tierid !== undefined) ? result.membertiers[0].tierid : null;
                let corporatedetailinfo = (result.corporatedetailinfo !== undefined) ? result.corporatedetailinfo : null;

                /* SET MEMBER PROFILE ON STORE REDEEMPTION */
                let member = { memberid, branchcodeenroll, salutationcode, salutationname, firstname, lastname, awardmiles, tierid, age, corporatedetailinfo };
                this.props.setMemberProfile(member);

                this.setState({
                    member: {
                        memberid, salutationcode, salutationname, familyname, awardmiles, name, tierid, branchcodeenroll, age
                    }, travelertype
                },
                    () => this.getUser())
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

    getUser() {
        let username = this.state.username;
        let url = api.url.user.list;
        let paging = {};
        let column = [];
        let criteria = { username };
        let sort = {};
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
            const { status, result } = response;

            if (status.responsecode.substring(0, 1) === '0' && result.length > 0) {
                let countrycode = (result[0]['countrycode']) ? result[0]['countrycode'] : null;

                /* SET USER ON STORE REDEEMPTION */
                let datastore = { countrycode, username };
                this.props.setUser(datastore);

                this.setState({
                    countrycode
                }, () => this.getAward());
            } else {
                this.setState(
                    {
                        responseCode: '9999',
                        responseMessage: 'User data not found',
                        formrender: false
                    }
                );
            }
        });
    }

    getAward() {
        let awardcode = this.state.awardcode;
        let url = api.url.awardmaster.detailbasicinfo;
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {

                let pricingby = (result.pricingby !== undefined) ? result.pricingby : null;

                if (pricingby.toUpperCase() === 'FIXED') { this.getFixedPrice(); }

                let categorytype = (result.categorytype !== undefined) ? result.categorytype : '';
                let alltiers = (result.alltiers !== undefined) ? result.alltiers : null;
                let allcountries = (result.allcountries !== undefined) ? result.allcountries : null;

                this.setState(
                    { awardcode, categorytype, pricingby, alltiers, allcountries },
                    // () => this.getFixedPrice()
                    () => this.getPrice()
                );
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        })
    }

    getPrice() {
        const { countrycode, awardcode, alltiers, allcountries, pricingby } = this.state;
        const { awardmiles, tierid } = this.state.member;

        if (pricingby === 'FIXED') {
            this.getFixedPrice();
        } else {
            let priceaward = 0;
            this.checkConfirmation(awardmiles, priceaward, countrycode, tierid, awardcode, alltiers, allcountries);
        }

        this.setSelfUsage(this.state.selfusage);
    }

    getFixedPrice() {
        let awardcode = this.state.awardcode;
        let url = api.url.awardmaster.detailfixedprice;
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let priceaward = (result.fixprice !== undefined) ? result.fixprice : '';
                let totalprice = (result.fixprice !== undefined) ? result.fixprice : '';

                const { countrycode, awardcode, alltiers, allcountries, pricingby, categorytype } = this.state;
                const { awardmiles, tierid } = this.state.member;

                /* SET AWARD ON STORE REDEEMPTION */
                let datastore = { awardcode, categorytype, pricingby, alltiers, allcountries, priceaward }
                this.props.setAward(datastore);

                this.setState({
                    priceaward, totalprice
                }, () => this.checkConfirmation(awardmiles, priceaward, countrycode, tierid, awardcode, alltiers, allcountries));
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        })
    }

    getOptionsSalutation() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            salutationname: 'asc'
        };
        let criteria = {
            active: true
        };
        let url = api.url.salutation.list;
        let column = [];
        /*loading select2 get data*/
        this.setState({ isLoadingSelect2: { salutation: true } });
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsSalutation = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.salutationname;
                    result2['value'] = obj.salutationcode;
                    return result2;
                })

                this.setState({
                    optionsSalutation,
                    isLoadingSelect2: { salutation: false }
                });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    setSelfUsage(selfusage) {
        //if corporate not selfusge
        const { corporatedetailinfo } = this.props.redemption.member;
        if (corporatedetailinfo !== null) { selfusage = false; }

        let salutationcode = null;
        let name = '';
        let memberid = '';
        let familyname = '';
        let travelertype = null;
        if (selfusage) {
            salutationcode = this.state.member.salutationcode;
            name = this.state.member.name;
            memberid = this.state.cardnumber;
            familyname = this.state.member.familyname;

            /* GET TRAVELER TYPE BASE AGE */
            let { age } = this.state.member;
            travelertype = getTravelerType(age);
        } else {
            travelertype = null;
        }
        this.refs.name.value = name;
        this.refs.memberid.value = memberid;
        this.refs.familyname.value = familyname;

        this.setState({ salutationcode, selfusage, travelertype });
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        // const { actionspage } = this.state;
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }
        formData['salutationcode'] = this.state.salutationcode;
        formData['selfusage'] = this.state.selfusage;
        formData['travelertype'] = this.state.travelertype;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            // //define parameter
            let awardcode = this.state.awardcode;
            let memberid = this.state.member.memberid;
            let salutationcode = formData.salutationcode;
            let name = formData.name;
            let familyname = formData.familyname;
            let travelertype = formData.travelertype;
            let memberiduser = formData.memberid;
            let bookingcode = formData.bookingcode.toUpperCase();
            let issueddate = this.state.issueddate.format("YYYY-MM-DD");
            let freeaward = this.state.freeaward;
            let ticketvaliditydate = null;
            let ticketnumber = null;
            let countrycode = null;
            let tierid = null;
            let membershipid = null;

            const { pricingby } = this.state;

            let totalprice = (pricingby === 'MANUAL') ? Number.parseInt(formData.totalprice, 0) : this.state.totalprice;
            let selfusage = (this.state.selfusage) ? 1 : 0;
            let certificateprice = Number.parseInt(this.state.totalprice, 0);
            let redeemairactivity = [];

            let redeemuser = [];
            redeemuser[0] = {};
            redeemuser[0].name = name;
            redeemuser[0].familyname = familyname;
            redeemuser[0].salutationcode = salutationcode;
            redeemuser[0].memberiduser = memberiduser;
            redeemuser[0].travelertype = travelertype;
            redeemuser[0].selfusage = selfusage;
            redeemuser[0].certificateprice = certificateprice;

            let data = {
                awardcode, issueddate, memberid, bookingcode, freeaward, ticketvaliditydate, ticketnumber, totalprice,
                redeemuser, redeemairactivity, return: null,
                countrycode, tierid, membershipid
            }

            let url = api.url.redemption.buyaward;
            let message = 'Buy awards is success';
            if (window.confirm("Are you sure buy this award?")) {
                var requestData = SaveRequest(url, data);
                if (requestData) {
                    requestData.then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);

                            /* SET REPONSE ON STORE REDEEMPTION */
                            let responseBuyAward = response.result;
                            responseBuyAward.cardnumber = this.state.cardnumber;
                            this.props.setReponseBuyAward(responseBuyAward);

                            this.props.changePage("PAGE", 'step2');
                        } else {
                            Alert.error(responsemessage);
                        }
                        //hide loader
                        this.setState({ loading: false });
                    })
                }
            } else {
                //hide loader
                this.setState({ loading: false });
            }
        }
    };

    handleSalutationChange = (event) => {
        let salutationcode = event === null ? null : event.value;
        this.setState({ salutationcode });
    }

    handleSelfUsageChange = (event) => {
        let selfusage = event === null ? null : event.target.checked;

        this.setSelfUsage(selfusage);

        let { optionsSalutation } = this.state;
        optionsSalutation = getOptionsDeactive('update', optionsSalutation, this.state.member.salutationcode, this.state.member.salutationname);

        this.setState({ selfusage, optionsSalutation });
    }

    handleFreeAwardChange = (event) => {
        let freeaward = event === null ? null : event.target.checked;
        let totalpricedisabled = false;

        if (!freeaward) {
            const { priceaward, countrycode, awardcode, alltiers, allcountries } = this.state;
            const { awardmiles, tierid } = this.state.member;
            let totalprice = priceaward;

            this.checkConfirmation(awardmiles, priceaward, countrycode, tierid, awardcode, alltiers, allcountries);
            this.setState({ totalprice, freeaward, totalpricedisabled })
        } else {
            let bookingcodedisbaled = false;

            totalpricedisabled = true;
            this.setState({
                totalprice: 0, confirmdisabled: false, freeaward, totalpricedisabled, bookingcodedisbaled
            })
        }

        const { pricingby } = this.state;
        if (pricingby === 'MANUAL') { this.refs.totalprice.value = 0; }
    }

    handleTravelerTypeChange = (event) => {
        let travelertype = event === null ? null : event.value;
        this.setState({ travelertype });
    }

    handleTotalPriceChange = (event) => {
        let priceaward = event === null ? null : event.target.value;

        const { countrycode, awardcode, alltiers, allcountries } = this.state;
        const { awardmiles, tierid } = this.state.member;

        this.checkConfirmation(awardmiles, priceaward, countrycode, tierid, awardcode, alltiers, allcountries);
        this.setState({ priceaward, totalprice: priceaward })
    }

    // handlePriceMultiplerChange = (event) => {
    //     let pricemultipler = event === null ? null : event.target.value;
    //     this.setState({ pricemultipler });
    // }

    render() {
        const { formrender } = this.state;
        if (formrender) {
            const { loading, errors, isLoadingSelect2 } = this.state;
            const { optionsSalutation, optionsTravelerType } = this.state;
            const { awardcode, salutationcode, selfusage, totalprice, cardnumber, travelertype, pricingby, issueddate } = this.state;
            const { memberid } = this.state;
            const { confirmdisabled, totalpricedisabled, bookingcodedisbaled } = this.state;

            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Redemption" />
                    <div className="content-title flex-hr mb-1 title-description row justify-content-between">
                        <div className="col-8 text-left">
                            <h1 className="title-has-control mt-2">
                                <Link to={"/redemption/" + cardnumber} className="btn btn-outline-dark circle btn-sm"><i className="mdi mdi-arrow-left"></i></Link>
                                &nbsp;Redemption
                            </h1>
                        </div>
                    </div>
                    <hr className="mt-1" />
                    <HeaderMemberProfile id={memberid} />
                    <HeaderAwards id={awardcode} />
                    <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                        <Loader value={loading} />
                        <div className="main-panel mt-3">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h3 className="title-has-control mt-2">Receipt Detail</h3>
                            </div>
                            <hr className="mt-0" />
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="selfusage-view">Self Usage</label>
                                        <div className="col-sm-9">
                                            <label className="custom-control border-switch">
                                                <input id="selfusage-view" ref="selfusage" value="1" className="border-switch-control-input" type="checkbox" checked={selfusage} onChange={this.handleSelfUsageChange} disabled={(confirmdisabled) ? true : false} />
                                                <span className="border-switch-control-description">No</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">Yes</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="salutationcode-view">Salutation <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-9">
                                            <Select2 reference="salutationcode" className="reactSelect2" id="salutationcode-view" options={optionsSalutation} onChange={this.handleSalutationChange} value={optionsSalutation.filter(({ value }) => value === salutationcode)} isLoading={isLoadingSelect2.salutation} disabled={(confirmdisabled || selfusage) ? true : false}></Select2>
                                            <span className="text-danger">{errors["salutationcode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="name-view">Name </label>
                                        <div className="col-sm-9">
                                            <input className="form-control" type="text" id="name-view" ref="name" maxLength="45" disabled={(confirmdisabled || selfusage) ? true : false} />
                                            <span className="text-danger">{errors["name"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="memberid-view">GarudaMiles ID <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                        <div className="col-sm-9">
                                            <input className="form-control" type="text" id="memberid-view" ref="memberid" maxLength="16" disabled={(confirmdisabled || selfusage) ? true : false} />
                                            <span className="text-danger">{errors["memberid"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="familyname-view">Family Name </label>
                                        <div className="col-sm-9">
                                            <input className="form-control" type="text" id="familyname-view" ref="familyname" maxLength="45" disabled={(confirmdisabled || selfusage) ? true : false} />
                                            <span className="text-danger">{errors["familyname"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="travelertype-view">Traveler Type </label>
                                        <div className="col-sm-9">
                                            <Select2 reference="travelertype" className="reactSelect2" id="travelertype-view" options={optionsTravelerType} onChange={this.handleTravelerTypeChange} value={optionsTravelerType.filter(({ value }) => value === travelertype)} isLoading={isLoadingSelect2.travelertype} disabled={(confirmdisabled || selfusage) ? true : false}></Select2>
                                            <span className="text-danger">{errors["travelertype"]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="main-panel mt-3">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h3 className="title-has-control mt-2">Confirmation</h3>
                            </div>
                            <hr className="mt-0" />
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="issueddate-view">Issued Date </label>
                                        <label className="col-sm-9 col-form-label" htmlFor="issueddatevalue-view">{issueddate.format("DD MMMM YYYY")} </label>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="bookingcode-view">Booking Code <p className="text-muted"><i>(optional)</i></p></label>
                                        <div className="col-sm-9">
                                            <input className="form-control" type="text" id="bookingcode-view" ref="bookingcode" maxLength="50" disabled={bookingcodedisbaled} />
                                            <span className="text-danger">{errors["bookingcode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label" htmlFor="freeaward-view">Free Award</label>
                                        <div className="col-sm-9">
                                            <label className="custom-control border-switch">
                                                <input id="freeaward-view" ref="freeaward" value="1" className="border-switch-control-input" type="checkbox" onChange={this.handleFreeAwardChange} disabled />
                                                <span className="border-switch-control-description">No</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">Yes</span>
                                            </label>
                                        </div>
                                    </div>
                                    {/* <div className={(pricingby === 'FIXED') ? "form-group row" : "form-group row hidden"}>
                                        <label className="col-sm-3 col-form-label" htmlFor="pricemultipler-view">Price Multipler </label>
                                        <div className="col-sm-3">
                                            <input className="form-control" type="number" defaultValue="1" min="1" max="50" id="pricemultipler-view" ref="pricemultipler" onChange={this.handlePriceMultiplerChange} disabled={pricemultiplerdisabled} />
                                            <span className="text-danger">{errors["pricemultipler"]}</span>
                                        </div>
                                        <div className="col-sm-3">
                                            <label className="col-form-label"><h4>x {totalprice}</h4></label>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-sm-4 offset-sm-2">
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label d-flex align-items-center" htmlFor="totalprice-view">
                                            <h3>Total </h3>
                                        </label>
                                        <label className="col-sm-6 col-form-label d-flex justify-content-end" htmlFor="totalvalue-view">
                                            {
                                                (pricingby === 'MANUAL') ?
                                                    <div className="form-group row">
                                                        <div className="col-sm-12">
                                                            <input className="form-control" type="text" id="totalprice-view" ref="totalprice" maxLength="45" defaultValue="0" disabled={totalpricedisabled} onChange={this.handleTotalPriceChange} />
                                                            <span className="text-danger">{errors["totalprice"]}</span>
                                                        </div>
                                                    </div> : <h1>{formatNumber(totalprice)}</h1>
                                                // (pricingby === 'FIXED') ? <h1>{totalprice * pricemultipler}</h1> : <h1>{totalprice}</h1>
                                            }
                                        </label>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-8">
                                            <button type="submit" className="btn btn-success large w-100" disabled={confirmdisabled}>Confirm</button>
                                            {(confirmdisabled) ? <span className="text-danger">This Award is not eligible redeem for this member</span> : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;