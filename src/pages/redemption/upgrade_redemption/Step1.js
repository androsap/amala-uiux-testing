import React, { Component } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import { Link } from 'react-router-dom';
import Alert from '../../../components/Alert';
import Loader from '../../../components/Loader';
import { RetrieveRequest, DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import Select2 from '../../../components/Select2';
import { api } from '../../../config/Services';
import Datepicker from '../../../components/Datepicker';
import moment from 'moment';
import { getProfile } from '../../../utilities/AuthService';

import HeaderMemberProfile from '../../../components/Header/MemberProfile';
import HeaderAwards from '../../../components/Header/Awards';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: [],
            optionsAirport: [],
            optionsAirportDestination: [],
            optionsAirportOrigin: [],
            optionsCompartment: [
                { label: 'First Class', value: 'F' },
                { label: 'Business', value: 'C' },
                { label: 'Economy', value: 'Y' },
            ],
            compartmentcode: null,
            origin: null,
            destination: null,
            departuredate: null,
            returndate: null,
            returndatedisabled: true,
            isreturn: false,
            selfusage: '',
            cardnumber: (this.props.cardnumber) ? this.props.cardnumber : null,
            awardcode: (this.props.awardcode) ? this.props.awardcode : null,
            member: {
                memberid: null,
                salutationcode: null,
                salutationname: '',
                name: '',
                familyname: ''
            },
            username: (getProfile().username) ? getProfile().username : '',
            totalprice: 0,
            priceaward: 0,
            pricingby: '',
            maxperson: null,
            alltiers: null,
            allcountries: null,
            optionsAirline: [],
            airlinecode: null,
            optionsCompartmentDepart: [],
            optionsCompartmentReturn: [],
            optionsPaidBookingClass: [],
            optionsPaidBookingClassDepart: [],
            optionsPaidBookingClassReturn: [],
            paidbookingclassdepart: null,
            paidbookingclassreturn: null,
            paidbookingclassdepartdisabled: true,
            paidbookingclassreturndisabled: true,
            compartmentcodedepart: null,
            compartmentcodereturn: null,
            bookingclassdisabled: true,
            compartmentcodedepartdisabled: true,
            compartmentcodereturndisabled: true,
            isLoadingSelect2: {
                airlinecode: false,
                airport: false,
                compartmentcode: false,
                compartmentcodedepart: false,
                compartmentcodereturn: false,
                paidbookingclassdepart: false,
                paidbookingclassreturn: false
            }
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;
        // let today = moment(new Date());

        //origin
        if (!field['origin']) {
            errors['origin'] = 'Required';
        }

        //destination
        if (!field['destination']) {
            errors['destination'] = 'Required';
        }

        //departuredate
        if (!field['departuredate']) {
            errors['departuredate'] = 'Required';
        }

        //airlinecode
        if (!field['airlinecode']) {
            errors['airlinecode'] = 'Required';
        }

        //compartmentcodedepart
        if (!field['compartmentcodedepart']) {
            errors['compartmentcodedepart'] = 'Required';
        }

        //paidbookingclassdepart
        if (!field['paidbookingclassdepart']) {
            errors['paidbookingclassdepart'] = 'Required';
        }

        //returndate
        if (field["isreturn"]) {
            if (!field['returndate']) {
                errors['returndate'] = 'Required';
            }
            // else if (field['returndate'] < today) {
            //     errors['returndate'] = 'The day after today';
            // } 
            else if (moment(field['departuredate']).format("YYYY/MM/DD") > moment(field['returndate']).format("YYYY/MM/DD")) {
                errors['returndate'] = 'Return Date must be greater than Departure date';
            }

            //compartmentcodereturn
            if (!field['compartmentcodereturn']) {
                errors['compartmentcodereturn'] = 'Required';
            }

            //paidbookingclassreturn
            if (!field['paidbookingclassreturn']) {
                errors['paidbookingclassreturn'] = 'Required';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        this.getOptionsAirline();
        this.getOptionsAirport();
        this.getEligibleRedeem();
        this.props.resetStore();
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
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
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
                let name = firstname;
                let familyname = lastname;
                let awardmiles = (result.memberaccount !== undefined && result.memberaccount.awardmiles !== undefined) ? result.memberaccount.awardmiles : '';
                let tierid = (result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].tierid !== undefined) ? result.membertiers[0].tierid : null;
                let cardnumber = (this.state.cardnumber !== undefined) ? this.state.cardnumber : null;
                let corporatedetailinfo = (result.corporatedetailinfo !== undefined) ? result.corporatedetailinfo : null;

                /* SET MEMBER PROFILE ON STORE REDEEMPTION */
                let member = { memberid, branchcodeenroll, salutationcode, salutationname, firstname, lastname, awardmiles, tierid, cardnumber, age, corporatedetailinfo };
                this.props.setMemberProfile(member);

                this.setState({
                    member: {
                        memberid, salutationcode, salutationname, familyname, awardmiles, name, tierid, branchcodeenroll, age
                    }
                },
                    () => this.getUser()
                )
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
                },
                    () => this.getAward()
                );
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
        const { awardcode } = this.state;
        let url = api.url.awardmaster.detailbasicinfo;
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let awardcode = result.awardcode;
                let maxperson = result.maxperson;
                let alltiers = result.alltiers;
                let allcountries = result.allcountries;
                let pricingby = result.pricingby;
                let categorytype = result.categorytype;

                /* SET AWARD ON STORE REDEEMPTION */
                let datastore = { awardcode, maxperson, alltiers, allcountries, pricingby, categorytype };
                this.props.setAward(datastore);

                this.setState({ awardcode, maxperson, alltiers, allcountries, pricingby, loading: false });
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

    getOptionsAirport() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            airportname: 'asc'
        };
        let criteria = {
            active: true
        };
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
                })
                this.setState(prevState => ({
                    optionsAirport,
                    optionsAirportOrigin: optionsAirport,
                    optionsAirportDestination: optionsAirport,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsAirline() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            airlinename: 'asc'
        };
        let criteria = {
            active: true
        }
        let url = api.url.airline.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airlinecode: true } }));
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
                })

                this.setState(prevState => ({
                    optionsAirline,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airlinecode: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsCompartment(airlinecode) {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            compartmentcode: 'asc'
        };
        let criteria = { airlinecode }
        let url = api.url.compartment.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, compartmentcode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsCompartment = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.compartmentname;
                    result2['value'] = obj.compartmentcode;
                    result2['rank'] = obj.rank;
                    return result2;
                }).sort((a, b) => a.rank < b.rank);

                this.setState(prevState => ({
                    optionsCompartment,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, compartmentcode: false }
                }));

            } else {
                Alert.error(status.responsemessage);
            }
        });
    }


    getOptionsBookingClass(type, airlinecode, compartmentcode) {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            subclasscode: 'asc'
        };
        let criteria = { airlinecode, compartmentcode }
        let url = api.url.subclass.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, bookingclass: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsPaidBookingClass = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.subclasscode;
                    result2['value'] = obj.subclasscode;
                    return result2;
                })

                if (type === 'DEPARTURE') {
                    let paidbookingclassdepartdisabled = false;
                    this.setState(prevState => ({
                        optionsPaidBookingClassDepart: optionsPaidBookingClass,
                        paidbookingclassdepartdisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, bookingclass: false }
                    }));
                } else {
                    let paidbookingclassreturndisabled = false;
                    this.setState(prevState => ({
                        optionsPaidBookingClassReturn: optionsPaidBookingClass,
                        paidbookingclassreturndisabled,
                        isLoadingSelect2: { ...prevState.isLoadingSelect2, bookingclass: false }
                    }));
                }
            } else {
                Alert.error(status.responsemessage);
            }
        });
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

        formData['origin'] = this.state.origin;
        formData['destination'] = this.state.destination;
        formData['departuredate'] = this.state.departuredate;
        formData['isreturn'] = this.state.isreturn;
        formData['returndate'] = this.state.returndate;
        formData['compartmentcodedepart'] = this.state.compartmentcodedepart;
        formData['compartmentcodereturn'] = this.state.compartmentcodereturn;
        formData['airlinecode'] = this.state.airlinecode;
        formData['paidbookingclassdepart'] = this.state.paidbookingclassdepart;
        formData['paidbookingclassreturn'] = this.state.paidbookingclassreturn;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });

            const {
                origin, destination, compartmentcode, isreturn,
                airlinecode, compartmentcodedepart, compartmentcodereturn,
                paidbookingclassdepart, paidbookingclassreturn
            } = this.state;
            const { member, awardcode } = this.state;

            let departuredate = moment(formData.departuredate).format("YYYY-MM-DD");
            let returndate = (formData.returndate) ? moment(formData.returndate).format("YYYY-MM-DD") : null;

            let passenger = Number.parseInt(formData.passenger, 0);
            let username = this.state.username;

            let upgrade = { compartmentcodedepart, compartmentcodereturn, paidbookingclassdepart, paidbookingclassreturn }

            let data = {
                airlinecode, origin, destination, compartmentcode, username, passenger,
                return: isreturn, departuredate, returndate, awardcode,
                memberid: member.memberid,
                upgrade
            }

            let url = api.url.redemption.getpricelist;
            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { result } = response;
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        /* SET PRICE LIST ON STORE REDEEMPTION */
                        let membershipid = (result.membershipid !== undefined) ? result.membershipid : null;
                        let tierid = (result.tierid !== undefined) ? result.tierid : null;
                        let countrycode = (result.countrycode !== undefined) ? result.countrycode : null;
                        let generalRequestData = { membershipid, tierid, countrycode };

                        this.props.setGeneralRequest(generalRequestData);
                        this.props.setPriceList(result.departure, result.return);
                        this.props.setFlightSchedule(result.departure, result.return);
                        this.props.changePage("PAGE", 'step2');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        }
    };

    handleFilterOriginDestination = (type, value) => {
        let temp = [];
        this.state.optionsAirport.forEach(obj => {
            if (value !== obj.value) temp.push(obj);
        });
        if (type === 'origin') this.setState({ optionsAirportDestination: temp });
        else if (type === 'destination') this.setState({ optionsAirportOrigin: temp });
    }

    handleOriginChange = (event) => {
        let origin = event === null ? null : event.value;
        this.setState({ origin });
        this.props.setOrigin({ origin });

        this.handleFilterOriginDestination('origin', origin);
    }

    handleDestinationChange = (event) => {
        let destination = event === null ? null : event.value;
        this.setState({ destination });
        this.props.setDestination({ destination });

        this.handleFilterOriginDestination('destination', destination);
    }

    handleIsReturnChange = (event) => {
        let isreturn = event === null ? null : event.target.checked;
        let returndatedisabled = (isreturn) ? false : true;
        let compartmentcodereturndisabled = (isreturn && this.state.airlinecode) ? false : true;
        let compartmentcodereturn = null;
        let paidbookingclassreturndisabled = (isreturn && this.state.airlinecode && this.state.compartmentcodereturn) ? false : true;
        let paidbookingclassreturn = null;
        let returndate = null;
        this.props.setIsReturn({ isreturn });
        this.setState({ returndatedisabled, returndate, isreturn, compartmentcodereturn, compartmentcodereturndisabled, paidbookingclassreturn, paidbookingclassreturndisabled });
    }

    handleCompartmentChange = (event) => {
        let compartmentcode = event === null ? null : event.value;
        this.setState({ compartmentcode });
        this.props.setCompartment({ compartmentcode });
    }

    handleDepartureDateChange = (event) => {
        let departuredate = event === null ? null : event;
        let returndate = null;
        this.props.setDepartureDate({ departuredate });
        this.setState({ departuredate, returndate });
    }

    handleReturnDateChange = (event) => {
        let returndate = event === null ? null : event;
        this.props.setReturnDate({ returndate });
        this.setState({ returndate });
    }

    handlePassengerChange = (event) => {
        let passenger = event.target.value ? event.target.value : '';
        this.props.setPassenger({ passenger });
    }

    handleAirlineChange = (event) => {
        let airlinecode = event === null ? null : event.value;
        let bookingclassdisabled = true;
        /* COMPARTMENT */
        let compartmentcodedepart = null;
        let compartmentcodereturn = null;
        let compartmentcodedepartdisabled = (airlinecode) ? false : true;
        let compartmentcodereturndisabled = (airlinecode && this.state.isreturn) ? false : true;

        /* PAID BOOKING CLASS */
        let paidbookingclassdepart = null;
        let paidbookingclassdepartdisabled = (airlinecode && this.state.compartmentcodedepart) ? false : true;
        let paidbookingclassreturn = null;
        let paidbookingclassreturndisabled = (airlinecode && this.state.compartmentcodereturn && this.state.isreturn) ? false : true;

        this.setState({
            airlinecode, bookingclassdisabled,
            compartmentcodedepart, compartmentcodereturn,
            paidbookingclassdepart, paidbookingclassreturn,
            compartmentcodedepartdisabled, compartmentcodereturndisabled,
            paidbookingclassdepartdisabled, paidbookingclassreturndisabled
        });

        if (airlinecode) { this.getOptionsCompartment(airlinecode) }

        let upgrade = { airlinecode };
        this.props.setCompartment({ upgrade });
    }

    handleCompartmentDepartChange = (event) => {
        let compartmentcodedepart = event === null ? null : event.value;
        let paidbookingclassdepart = null;
        let paidbookingclassdepartdisabled = true;
        this.setState({ compartmentcodedepart, paidbookingclassdepart, paidbookingclassdepartdisabled });

        if (compartmentcodedepart) {
            let airlinecode = this.state.airlinecode;
            this.getOptionsBookingClass('DEPARTURE', airlinecode, compartmentcodedepart)
        }

        let upgrade = { compartmentcodedepart };
        this.props.setCompartment({ upgrade });
    }

    handleCompartmentReturnChange = (event) => {
        let compartmentcodereturn = event === null ? null : event.value;
        let paidbookingclassreturn = null;
        let paidbookingclassreturndisabled = true;
        this.setState({ compartmentcodereturn, paidbookingclassreturn, paidbookingclassreturndisabled });

        if (compartmentcodereturn) {
            let airlinecode = this.state.airlinecode;
            this.getOptionsBookingClass('RETURN', airlinecode, compartmentcodereturn)
        }

        let upgrade = { compartmentcodereturn };
        this.props.setCompartment({ upgrade });
    }

    handleDeparturePaidBookingClassChange = (event) => {
        let paidbookingclassdepart = event === null ? null : event.value;
        this.setState({ paidbookingclassdepart });
    }

    handleReturnPaidBookingClassChange = (event) => {
        let paidbookingclassreturn = event === null ? null : event.value;
        this.setState({ paidbookingclassreturn });
    }

    render() {
        const { loading, errors, isLoadingSelect2, returndatedisabled, compartmentcodedepartdisabled, compartmentcodereturndisabled, paidbookingclassdepartdisabled, paidbookingclassreturndisabled } = this.state;
        const { optionsAirportDestination, optionsAirportOrigin, optionsCompartment, optionsAirline, optionsPaidBookingClassDepart, optionsPaidBookingClassReturn } = this.state;
        const { origin, destination, departuredate, returndate, airlinecode, compartmentcodedepart, compartmentcodereturn, paidbookingclassdepart, paidbookingclassreturn } = this.state;
        const { awardcode, cardnumber, maxperson } = this.state;
        const { memberid } = this.state;

        return (
            <div className="container-fluid">
                <Breadcrumb path="Data Management / Redemption" />
                <div className="mb-1 title-description">
                    <h1 className="title-has-control mt-2">
                        <Link to={"/redemption/" + cardnumber} className="btn btn-outline-dark circle btn-sm"><i className="mdi mdi-arrow-left-thick"></i></Link>
                        &nbsp;Redemption
                    </h1>
                </div>
                <hr className="mt-1" />
                <HeaderMemberProfile id={memberid} />
                <HeaderAwards id={awardcode} />
                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                    <Loader value={loading} />
                    <div className="main-panel mt-3">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h3 className="title-has-control mt-2">Search Flight</h3>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="airlinecode-view">Airline </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="airlinecode" className="reactSelect2" id="airlinecode-view" options={optionsAirline} onChange={this.handleAirlineChange} value={optionsAirline.filter(({ value }) => value === airlinecode)} isLoading={isLoadingSelect2.airlinecode}></Select2>
                                        <span className="text-danger">{errors["airlinecode"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="origin-view">From </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="origin" className="reactSelect2" id="origin-view" options={optionsAirportOrigin} onChange={this.handleOriginChange} value={optionsAirportOrigin.filter(({ value }) => value === origin)} isLoading={isLoadingSelect2.airport}></Select2>
                                        <span className="text-danger">{errors["origin"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="departure-view">Departure Date </label>
                                    <div className="col-sm-8">
                                        <Datepicker className="form-control" id="departuredate-view" onChange={this.handleDepartureDateChange} selected={departuredate} dateFormat={"DD/MM/YYYY"} minDate={moment(new Date())} />
                                        <span className="text-danger">{errors["departuredate"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="compartmentcodedepart-view">Paid Compartment Departure </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="compartmentcodedepart" className="reactSelect2" id="compartmentcodedepart-view" options={optionsCompartment} onChange={this.handleCompartmentDepartChange} value={optionsCompartment.filter(({ value }) => value === compartmentcodedepart)} isLoading={isLoadingSelect2.compartmentcode} disabled={compartmentcodedepartdisabled}></Select2>
                                        <span className="text-danger">{errors["compartmentcodedepart"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="paidbookingclassdepart-view">Paid Booking Class </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="paidbookingclassdepart" className="reactSelect2" id="paidbookingclassdepart-view" options={optionsPaidBookingClassDepart} onChange={this.handleDeparturePaidBookingClassChange} value={optionsPaidBookingClassDepart.filter(({ value }) => value === paidbookingclassdepart)} isLoading={isLoadingSelect2.paidbookingclassdepart} disabled={paidbookingclassdepartdisabled}></Select2>
                                        <span className="text-danger">{errors["paidbookingclassdepart"]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                {/* <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="compartmentcode-view">Compartment </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="compartmentcode" className="reactSelect2" id="compartmentcode-view" options={optionsCompartment} onChange={this.handleCompartmentChange} value={optionsCompartment.filter(({ value }) => value === compartmentcode)} isLoading={isLoadingSelect2.compartmentcode}></Select2>
                                        <span className="text-danger">{errors["compartmentcode"]}</span>
                                    </div>
                                </div> */}
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="passenger-view">No. of Passenger </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" type="number" id="passenger-view" ref="passenger" min="1" max={maxperson} defaultValue="1" onChange={this.handlePassengerChange} disabled />
                                        <span className="text-danger">{errors["passenger"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="destination-view">To </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="destination" className="reactSelect2" id="destination-view" options={optionsAirportDestination} onChange={this.handleDestinationChange} value={optionsAirportDestination.filter(({ value }) => value === destination)} isLoading={isLoadingSelect2.airport}></Select2>
                                        <span className="text-danger">{errors["destination"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="returndate-view">
                                        <label className="custom-control fill-checkbox">
                                            <input type="checkbox" className="fill-control-input" ref="return_check" onClick={this.handleIsReturnChange} />
                                            <span className="fill-control-indicator"></span>
                                            Return Date
                                        </label>
                                    </label>
                                    <div className="col-sm-8">
                                        <Datepicker className="form-control" id="returndate-view" onChange={this.handleReturnDateChange} selected={returndate} dateFormat={"DD/MM/YYYY"} disabled={returndatedisabled} minDate={departuredate} />
                                        <span className="text-danger">{errors["returndate"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="compartmentcodereturn-view">Paid Compartment Return </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="compartmentcodereturn" className="reactSelect2" id="compartmentcodereturn-view" options={optionsCompartment} onChange={this.handleCompartmentReturnChange} value={optionsCompartment.filter(({ value }) => value === compartmentcodereturn)} isLoading={isLoadingSelect2.compartmentcode} disabled={compartmentcodereturndisabled}></Select2>
                                        <span className="text-danger">{errors["compartmentcodereturn"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-12 col-form-label" htmlFor="paidbookingclassreturn-view">Paid Booking Class </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="paidbookingclassreturn" className="reactSelect2" id="paidbookingclassreturn-view" options={optionsPaidBookingClassReturn} onChange={this.handleReturnPaidBookingClassChange} value={optionsPaidBookingClassReturn.filter(({ value }) => value === paidbookingclassreturn)} isLoading={isLoadingSelect2.paidbookingclassreturn} disabled={paidbookingclassreturndisabled}></Select2>
                                        <span className="text-danger">{errors["paidbookingclassreturn"]}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-8">
                                        <button type="submit" className="btn btn-success large w-100">Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Layout;