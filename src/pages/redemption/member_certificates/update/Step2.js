import React, { Component } from 'react';
import CertificateDetail from '../cancel/CertificateDetail';
import Datepicker from '../../../../components/Datepicker';
import { getProfile } from '../../../../utilities/AuthService';
import Alert from '../../../../components/Alert';
import { SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import Loader from '../../../../components/Loader';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: {},
            selectedairactivity: {},
            departuredate: null,
            returndate: null,
            mindeparturedate: null,
            maxdeparturedate: null,
            minreturndate: null,
            maxreturndate: null,
            airlinecode: null,
            origin: null,
            destination: null,
            compartmentcode: null,
            compartmentcodedepart: null,
            paidbookingclassdepart: null,
            compartmentcodereturn: null,
            paidbookingclassreturn: null,
            passenger: null
        }
    }


    handleValidation(field) {
        let errors = {};
        let status = true;

        const { activityairtype } = this.props.updatecertificate;
        const { mindeparturedate, maxdeparturedate, minreturndate } = this.state;

        if (activityairtype === "ROUNDTRIP") {
            //departuredate
            if (!field['departuredate']) {
                errors['departuredate'] = 'Required';
            } else if (moment(field['departuredate']).format("YYYY/MM/DD") < moment(mindeparturedate).format("YYYY/MM/DD")) {
                errors['departuredate'] = 'Todays minimum date';
            }

            //returndate
            if (!field['returndate']) {
                errors['returndate'] = 'Required';
            } else if (moment(field['returndate']).format("YYYY/MM/DD") < moment(minreturndate).format("YYYY/MM/DD")) {
                errors['returndate'] = 'Return Date must be greater than Departure date';
            }
        } else {
            if (activityairtype.split("/")[1] === 'DEPARTURE') {
                //departuredate
                if (!field['departuredate']) {
                    errors['departuredate'] = 'Required';
                } else if (moment(field['departuredate']).format("YYYY/MM/DD") < moment(mindeparturedate).format("YYYY/MM/DD")) {
                    errors['departuredate'] = 'Todays minimum date';
                } else if (moment(field['departuredate']).format("YYYY/MM/DD") > moment(maxdeparturedate).format("YYYY/MM/DD")) {
                    errors['departuredate'] = 'Departure date cannot be more than return date';
                }
            } else if (activityairtype.split("/")[1] === 'RETURN') {
                //returndate
                if (!field['returndate']) {
                    errors['returndate'] = 'Required';
                } else if (moment(field['returndate']).format("YYYY/MM/DD") < moment(minreturndate).format("YYYY/MM/DD")) {
                    errors['returndate'] = 'Return Date must be greater than Departure date';
                }
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    async componentDidMount() {
        await this.setMinimumDate();
        await this.setOriginDestination();
        await this.setCompartment();
        await this.setPassenger();
        await this.setAirline();
    }

    async componentWillReceiveProps() {
        await this.setMinimumDate();
        await this.setOriginDestination();
        await this.setCompartment();
        await this.setPassenger();
        await this.setAirline();
    }

    setAirline() {
        const { activityairtype } = this.props.updatecertificate;
        const { departureactivity, returnactivity } = this.props.updatecertificate.selectedairactivity;
        let airlinecode = null;
        if (activityairtype === 'ROUNDTRIP') {
            airlinecode = (departureactivity && departureactivity.airline) ? departureactivity.airline : null;
        } else {
            if (activityairtype.split("/")[1] === 'DEPARTURE') {
                airlinecode = (departureactivity && departureactivity.airline) ? departureactivity.airline : null;
            } else if (activityairtype.split("/")[1] === 'RETURN') {
                airlinecode = (returnactivity && returnactivity.airline) ? returnactivity.airline : null;
            }
        }

        this.setState({ airlinecode });
    }

    setPassenger() {
        const { redeemusers } = this.props.updatecertificate.detailcertificate;
        let passenger = (redeemusers && redeemusers.length) ? redeemusers.length : null;
        this.setState({ passenger });
    }

    setOriginDestination() {
        const { activityairtype } = this.props.updatecertificate;
        const { departureactivity, returnactivity } = this.props.updatecertificate.selectedairactivity;

        let origin = null;
        let destination = null;
        if (activityairtype === 'ROUNDTRIP') {
            origin = (departureactivity && departureactivity.origin) ? departureactivity.origin : null;
            destination = (departureactivity && departureactivity.destination) ? departureactivity.destination : null;
        } else {
            if (activityairtype.split("/")[1] === 'DEPARTURE') {
                origin = (departureactivity && departureactivity.origin) ? departureactivity.origin : null;
                destination = (departureactivity && departureactivity.destination) ? departureactivity.destination : null;
            } else if (activityairtype.split("/")[1] === 'RETURN') {
                origin = (returnactivity && returnactivity.origin) ? returnactivity.origin : null;
                destination = (returnactivity && returnactivity.destination) ? returnactivity.destination : null;
            }
        }
        this.setState({ origin, destination });
    }

    setCompartment() {
        const { categorycode } = this.props.updatecertificate.detailcertificate;
        const { activityairtype } = this.props.updatecertificate;
        const { departureactivity, returnactivity } = this.props.updatecertificate.selectedairactivity;
        let compartmentcode = null;
        let compartmentcodedepart = null;
        let paidbookingclassdepart = null;
        let compartmentcodereturn = null;
        let paidbookingclassreturn = null;

        if (categorycode === 'FREEFLIGHT') {
            if (activityairtype === 'ROUNDTRIP') {
                compartmentcode = (departureactivity && departureactivity.compartment) ? departureactivity.compartment : null;
            } else {
                if (activityairtype.split("/")[1] === 'DEPARTURE') {
                    compartmentcode = (departureactivity && departureactivity.compartment) ? departureactivity.compartment : null;
                } else if (activityairtype.split("/")[1] === 'RETURN') {
                    compartmentcode = (returnactivity && returnactivity.compartment) ? returnactivity.compartment : null;
                }
            }
        } else if (categorycode === 'UPGRADE') {
            if (activityairtype === 'ROUNDTRIP') {
                compartmentcodedepart = (departureactivity && departureactivity.paidcompartmentcode) ? departureactivity.paidcompartmentcode : null;
                paidbookingclassdepart = (departureactivity && departureactivity.paidbookingclasscode) ? departureactivity.paidbookingclasscode : null;
                compartmentcodereturn = (returnactivity && returnactivity.paidcompartmentcode) ? returnactivity.paidcompartmentcode : null;
                paidbookingclassreturn = (returnactivity && returnactivity.paidbookingclasscode) ? returnactivity.paidbookingclasscode : null;
            } else {
                if (activityairtype.split("/")[1] === 'DEPARTURE') {
                    compartmentcodedepart = (departureactivity && departureactivity.paidcompartmentcode) ? departureactivity.paidcompartmentcode : null;
                    paidbookingclassdepart = (departureactivity && departureactivity.paidbookingclasscode) ? departureactivity.paidbookingclasscode : null;
                } else if (activityairtype.split("/")[1] === 'RETURN') {
                    compartmentcodedepart = (returnactivity && returnactivity.paidcompartmentcode) ? returnactivity.paidcompartmentcode : null;
                    paidbookingclassdepart = (returnactivity && returnactivity.paidbookingclasscode) ? returnactivity.paidbookingclasscode : null;
                }
            }
        }

        this.setState({ compartmentcode, compartmentcodedepart, paidbookingclassdepart, compartmentcodereturn, paidbookingclassreturn });
    }

    setMinimumDate() {
        let mindeparturedate = moment(new Date());
        let maxdeparturedate = null;
        let minreturndate = null;
        let maxreturndate = null;
        const { redeemairactivity } = this.props.updatecertificate.detailcertificate;

        let departureactivity = redeemairactivity.filter(function (value) { return value.type === 'DEPARTURE'; });
        let returnactivity = redeemairactivity.filter(function (value) { return value.type === 'RETURN'; });

        let activitydatedeparture = (departureactivity[0] && departureactivity[0]["activitydate"]) ? departureactivity[0]["activitydate"] : null;
        let activitydatereturn = (returnactivity[0] && returnactivity[0]["activitydate"]) ? returnactivity[0]["activitydate"] : null;

        const { activityairtype } = this.props.updatecertificate;
        if (activityairtype !== "ROUNDTRIP") {
            if (activitydatedeparture !== null) { minreturndate = moment(activitydatedeparture); }
            if (activitydatereturn !== null) { maxdeparturedate = moment(activitydatereturn); }
        } else {
            if (activitydatedeparture !== null) { minreturndate = moment(activitydatedeparture); }
        }

        this.setState({ mindeparturedate, maxdeparturedate, minreturndate, maxreturndate });
    }

    handleDepartureDateChange = (event) => {
        let departuredate = event === null ? null : event;
        let returndate = null;
        const { activityairtype } = this.props.updatecertificate;
        let maxdeparturedate = (activityairtype === 'ROUNDTRIP') ? null : this.state.maxdeparturedate;
        let minreturndate = departuredate;
        this.setState({ departuredate, maxdeparturedate, returndate, minreturndate });
    }

    handleReturnDateChange = (event) => {
        let returndate = event === null ? null : event;
        this.setState({ returndate });
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};

        formData['departuredate'] = this.state.departuredate;
        formData['returndate'] = this.state.returndate;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            const { activityairtype } = this.props.updatecertificate;
            const { awardcode, memberid, categorycode } = this.props.updatecertificate.detailcertificate;
            const { compartmentcodedepart, paidbookingclassdepart, compartmentcodereturn, paidbookingclassreturn, airlinecode } = this.state;

            let origin = this.state.origin;
            let destination = this.state.destination;
            let compartmentcode = this.state.compartmentcode;
            let departuredate = (activityairtype.split("/")[1] === 'RETURN') ? moment(formData.returndate).format("YYYY-MM-DD") : moment(formData.departuredate).format("YYYY-MM-DD");
            let returndate = (formData.returndate) ? moment(formData.returndate).format("YYYY-MM-DD") : null;
            let passenger = this.state.passenger;
            let username = (getProfile().username) ? getProfile().username : null;
            let upgrade = { compartmentcodedepart, paidbookingclassdepart, compartmentcodereturn, paidbookingclassreturn };
            let isreturn = (activityairtype === 'ROUNDTRIP') ? true : false;

            let data = { airlinecode, origin, destination, compartmentcode, departuredate, returndate, passenger, awardcode, memberid, username, return: isreturn };

            if (categorycode === 'UPGRADE') { data.upgrade = upgrade; }

            let url = api.url.redemption.getpricelist;
            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { result } = response;
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        this.props.setPriceList(result);
                        this.props.jumpStepTo(3);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        }
    }

    handleBack = () => {
        this.props.jumpStepTo(1);
    }

    render() {
        const { loading, errors } = this.state;
        const { certificateid, certificatedetail } = this.props;
        const { departuredate, returndate, mindeparturedate, maxdeparturedate, minreturndate, maxreturndate } = this.state;
        const { departureactivity, returnactivity } = this.props.updatecertificate.selectedairactivity;

        let airlinecodedeparture = (departureactivity && departureactivity.airline) ? departureactivity.airline : null;
        let airlinecodereturn = (returnactivity && returnactivity.airline) ? returnactivity.airline : null;
        let departureactivityorigin = (departureactivity && departureactivity.origin) ? departureactivity.origin : null;
        let departureactivitydestination = (departureactivity && departureactivity.destination) ? departureactivity.destination : null;
        let returnactivityorigin = (returnactivity && returnactivity.origin) ? returnactivity.origin : null;
        let returnactivitydestination = (returnactivity && returnactivity.destination) ? returnactivity.destination : null;
        console.log("this.props.updatecertificate", this.props.updatecertificate)
        return (
            <div className="container-fluid">
                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                    <Loader value={loading} />
                    <CertificateDetail certificatedetail={certificatedetail} certificateid={certificateid} />
                    <div className="content-title flex-hr mb-0 mt-5 title-description">
                        <h3 className="title-has-control">Update Certificate</h3>
                    </div>
                    <hr className="mt-0" />
                    <div className="card">
                        <div className="card-body">
                            <div className="member-section">
                                <label className="main-label mb-3">Redemption Air Activity - Flight Search</label>
                                <div className="row">
                                    <div className={(departureactivity && departureactivity.redeemairactivityid ? "col-sm-6" : "col-sm-6 d-none")}>
                                        <div className="form-group row">
                                            <h4 className="col-sm-4">Departure </h4>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4" htmlFor="operatingairline-view">Operating Airline </label>
                                            <div className="col-sm-8">{airlinecodedeparture}</div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="oridest-view">Origin Destination </label>
                                            <div className="col-sm-8">{departureactivityorigin} - {departureactivitydestination} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="departure-view">Departure Date </label>
                                            <div className="col-sm-8">
                                                <Datepicker className="form-control" id="departuredate-view" onChange={this.handleDepartureDateChange} selected={departuredate} dateFormat={"DD/MM/YYYY"} minDate={mindeparturedate} maxDate={maxdeparturedate} /><br />
                                                <span className="text-danger">{errors["departuredate"]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={(returnactivity && returnactivity.redeemairactivityid ? "col-sm-6" : "col-sm-6 d-none")}>
                                        <div className="form-group row">
                                            <h4 className="col-sm-4">Return </h4>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4" htmlFor="operatingairline-view">Operating Airline </label>
                                            <div className="col-sm-8">{airlinecodereturn}</div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="oridest-view">Origin Destination </label>
                                            <div className="col-sm-8">{returnactivityorigin} - {returnactivitydestination} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="returndate-view">Return Date </label>
                                            <div className="col-sm-8">
                                                <Datepicker className="form-control" id="returndate-view" onChange={this.handleReturnDateChange} selected={returndate} dateFormat={"DD/MM/YYYY"} minDate={minreturndate} maxDate={maxreturndate} /><br />
                                                <span className="text-danger">{errors["returndate"]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-footer text-center mt-3 mb-3">
                        <button type="button" className="btn btn-outline-dark normal mr-2" onClick={this.handleBack}>Back</button>
                        <button className="btn btn-primary normal">Search Flight</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Layout;