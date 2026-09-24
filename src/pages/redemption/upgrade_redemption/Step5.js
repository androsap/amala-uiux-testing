import React, { Component } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Alert from '../../../components/Alert';
import Loader from '../../../components/Loader';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import Datepicker from '../../../components/Datepicker';
import HeaderAwards from '../../../components/Header/Awards';
import moment from 'moment';
import { formatNumber } from '../../../utilities/Helpers';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: [],
            cardnumber: (this.props.cardnumber) ? this.props.cardnumber : null,
            awardid: (this.props.awardid) ? this.props.awardid : null,
            searchflight: {},
            member: {},
            award: {},
            passengerdata: [],
            redeemuser: [],
            ticketvaliditydate: null,
            redemptionsummary: {
                flightdeparture: {},
                flightreturn: {},
                mileage: 0,
                passenger: null,
                totalmileage: 0
            }
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //bookingcode
        if (!field['bookingcode']) {
            errors['bookingcode'] = 'Required';
        } else if (!field['bookingcode'].match(/^[a-zA-Z0-9]+$/)) {
            errors['bookingcode'] = 'Only alphanumeric';
        } else if (field['bookingcode'].length > 6) {
            errors['bookingcode'] = 'Maximum 6 characters';
        }

        //ticketvaliditydate
        if (!field['ticketvaliditydate']) {
            errors['ticketvaliditydate'] = 'Required';
        } else if (field['ticketvaliditydate'] < moment(new Date()).subtract(1, 'days')) {
            errors['ticketvaliditydate'] = 'Date may not be backdate';
        }

        //flightnumberdeparture
        if (!field['flightnumberdeparture']) {
            errors['flightnumberdeparture'] = 'Required';
        } else if (!field['flightnumberdeparture'].match(/^[a-zA-Z0-9]+$/)) {
            errors['flightnumberdeparture'] = 'Only alphanumeric';
        } else if (field['flightnumberdeparture'].length > 4) {
            errors['flightnumberdeparture'] = 'Maximum 4 characters';
        }

        const { isreturn } = this.state.searchflight;
        if (isreturn) {
            //flightnumberreturn
            if (!field['flightnumberreturn']) {
                errors['flightnumberreturn'] = 'Required';
            } else if (!field['flightnumberreturn'].match(/^[a-zA-Z0-9]+$/)) {
                errors['flightnumberreturn'] = 'Only alphanumeric';
            } else if (field['flightnumberreturn'].length > 4) {
                errors['flightnumberreturn'] = 'Maximum 4 characters';
            }
        }

        //ticketnumber
        if (!field['ticketnumber']) {
            errors['ticketnumber'] = 'Required';
        } else if (!field['ticketnumber'].match(/^[0-9]+$/)) {
            errors['ticketnumber'] = 'Only numeric';
        } else if (field['ticketnumber'].length > 13) {
            errors['ticketnumber'] = 'Maximum 13 characters';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        this.setState({
            searchflight: this.props.redemption.searchflight,
            member: this.props.redemption.member,
            redeemuser: this.props.redemption.redeemuser,
            redemptionsummary: this.props.redemption.redemptionsummary,
            award: this.props.redemption.award
        })
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }

        formData['ticketvaliditydate'] = this.state.ticketvaliditydate;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            // //define parameter
            const { award, member, redemptionsummary, redeemuser, searchflight } = this.state;
            const { isreturn } = this.state.searchflight;
            let { countrycode, tierid, membershipid, freeaward } = this.props.redemption;

            let awardcode = award.awardcode;
            let issueddate = moment(new Date()).format("YYYY-MM-DD");
            let memberid = member.memberid;
            let bookingcode = formData.bookingcode.toUpperCase();
            let ticketvaliditydate = moment(formData.ticketvaliditydate).format("YYYY-MM-DD");
            let ticketnumber = formData.ticketnumber;
            let totalprice = redemptionsummary.totalmileage;

            let redeemairactivity = [];
            let flightscheduledeparture = {
                type: 'departure',
                price: redemptionsummary.flightdeparture.onewayprice,
                activitydate: moment(searchflight.departuredate).format("YYYY-MM-DD"),
                airline: redemptionsummary.flightdeparture.airlinecode,
                origin: redemptionsummary.flightdeparture.origin,
                destination: redemptionsummary.flightdeparture.destination,
                feeder: 0,
                // flightnumber: redemptionsummary.flightdeparture.flightnumber,
                flightnumber: formData.flightnumberdeparture,
                compartment: redemptionsummary.flightdeparture.compartmentcode,
                bookingtype: 'INTERNET',
                paidcompartmentcode: redemptionsummary.flightdeparture.paidcompartmentcodedepart,
                paidbookingclasscode: redemptionsummary.flightdeparture.paidbookingclassdepart,
                bookingclass: redemptionsummary.flightdeparture.bookingclasscode,
                peakseasonstatus: redemptionsummary.flightdeparture.peakseasonstatus
            };
            redeemairactivity.push(flightscheduledeparture);

            if (isreturn) {
                let flightschedulereturn = {
                    type: 'return',
                    price: redemptionsummary.flightreturn.onewayprice,
                    activitydate: moment(searchflight.returndate).format("YYYY-MM-DD"),
                    airline: redemptionsummary.flightreturn.airlinecode,
                    origin: redemptionsummary.flightreturn.origin,
                    destination: redemptionsummary.flightreturn.destination,
                    feeder: 0,
                    // flightnumber: redemptionsummary.flightreturn.flightnumber,
                    flightnumber: formData.flightnumberreturn,
                    compartment: redemptionsummary.flightreturn.compartmentcode,
                    bookingtype: 'INTERNET',
                    paidcompartmentcode: redemptionsummary.flightreturn.paidcompartmentcodedepart,
                    paidbookingclasscode: redemptionsummary.flightreturn.paidbookingclassdepart,
                    bookingclass: redemptionsummary.flightreturn.bookingclasscode,
                    peakseasonstatus: redemptionsummary.flightreturn.peakseasonstatus
                };
                redeemairactivity.push(flightschedulereturn);
            }

            let data = {
                awardcode, issueddate, memberid, bookingcode, ticketvaliditydate, ticketnumber, freeaward, totalprice,
                return: isreturn,
                countrycode, tierid, membershipid, redeemuser, redeemairactivity
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
                            this.props.changePage("PAGE", 'step6');
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

    handleBackStep = (e) => {
        e.preventDefault();
        this.props.changePage("PAGE", 'step4');
    }

    handleTicketValidityDateChange = (event) => {
        let ticketvaliditydate = event === null ? null : event;
        this.setState({ ticketvaliditydate });
    }

    render() {
        const { loading, formrender, errors } = this.state;
        const { ticketvaliditydate, award } = this.state;
        const { flightdeparture, flightreturn } = this.state.redemptionsummary;
        if (formrender) {
            const { redeemuser, redemptionsummary, searchflight } = this.state;
            let passengerdatalist = redeemuser.map((data, key) =>
                <div className="row mb-3" key={key}>
                    <div className="col-sm-12">
                        <h4 className="title-has-control" htmlFor="passenger-view">Passenger {key + 1} </h4>
                        <hr className="mt-1" />
                    </div>

                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-3" htmlFor="salutation-view">Salutation </label>
                            <div className="col-sm-9" htmlFor="salutation_value-view">{(data.salutationcode) ? data.salutationcode : "-"} </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3" htmlFor="name-view">Name </label>
                            <div className="col-sm-9" htmlFor="name_value-view">{data.name} </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3" htmlFor="familyname-view">Family Name </label>
                            <div className="col-sm-9" htmlFor="familyname_value-view">{data.familyname} </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-3" htmlFor="memberid-view">Member ID </label>
                            <div className="col-sm-9" htmlFor="memberid_value-view">{(data.memberiduser) ? data.memberiduser : '-'} </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3" htmlFor="travelertype-view">Traveler Type </label>
                            <div className="col-sm-9" htmlFor="travelertype_value-view">{(data.travelertype) ? data.travelertype : '-'} </div>
                        </div>
                        <div className={(key !== 0) ? "form-group row hidden" : "form-group row"}>
                            <label className="col-sm-3" htmlFor="selfusasge-view">Self Usage </label>
                            <div className="col-sm-9" htmlFor="selfusasge_value-view">{(data.selfusage) ? "Yes" : "No"} </div>
                        </div>
                    </div>
                </div>
            );

            let headeraward = '';
            if (award.awardcode !== undefined && award.awardcode !== null) {
                headeraward = <HeaderAwards id={award.awardcode} />;
            }

            var rutedeparture = '';
            if (flightdeparture !== undefined) {
                if (flightdeparture.origin !== undefined) {
                    rutedeparture = flightdeparture.origin + " - ";
                }
                if (flightdeparture.destination !== undefined) {
                    rutedeparture = rutedeparture + flightdeparture.destination
                }
            }

            var rutereturn = '';
            if (flightreturn !== undefined) {
                if (flightreturn.origin !== undefined) {
                    rutereturn = flightreturn.origin + " - ";
                }
                if (flightreturn.destination !== undefined) {
                    rutereturn = rutereturn + flightreturn.destination
                }
            }

            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Redemption" />
                    <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                        <Loader value={loading} />
                        {/* <div className="main-panel mt-3"> */}
                        <div className="content-title flex-hr mb-1 title-description row justify-content-between">
                            <div className="col-8 text-left">
                                <h1 className="title-has-control mt-2">
                                    <div className="btn btn-outline-dark circle btn-sm" onClick={(e) => this.handleBackStep(e)}>
                                        <i className="mdi mdi-arrow-left-thick"></i>
                                    </div> &nbsp;Redemption
                                </h1>
                            </div>
                        </div>
                        <hr className="mt-1" />
                        {headeraward}
                        <div className="main-panel mt-3">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h3 className="title-has-control mt-2">Completion</h3>
                            </div>
                            <hr className="mt-0" />
                            <div className="col-sm-12 mb-2">
                                <ol className="amala-wizard mb-5 d-flex justify-content-center">
                                    <li className="amala-wizard-todo no-hl">
                                        <span>Flight Info</span>
                                    </li>
                                    <li className="amala-wizard-todo no-hl">
                                        <span>Passenger Data</span>
                                    </li>
                                    <li className="amala-wizard-doing no-hl">
                                        <span>Completion</span>
                                    </li>
                                </ol>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-3 col-form-label" htmlFor="issueddate-view">Issued Date </label>
                                                    <label className="col-sm-9 col-form-label" htmlFor="issueddatevalue-view">{moment(new Date()).format("DD MMMM YYYY")} </label>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-3 col-form-label" htmlFor="bookingcode-view">Booking Code </label>
                                                    <div className="col-sm-9">
                                                        <input className="form-control" type="text" id="bookingcode-view" ref="bookingcode" maxLength="6" />
                                                        <span className="text-danger">{errors["bookingcode"]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="ticketvaliditydate-view">Ticket Validity Date </label>
                                                    <div className="col-sm-8">
                                                        <Datepicker className="form-control" onChange={this.handleTicketValidityDateChange} selected={ticketvaliditydate} dateFormat={"DD/MM/YYYY"} minDate={moment(new Date())} />
                                                        <span className="text-danger">{errors["ticketvaliditydate"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="ticketnumber-view">Ticket Number </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="ticketnumber-view" ref="ticketnumber" maxLength="13" />
                                                        <span className="text-danger">{errors["ticketnumber"]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-12 mb-2">
                                <div className="content-title flex-hr mb-0 title-description">
                                    <h3 className="title-has-control mt-2">Redemption Summary</h3>
                                </div>
                                <hr className="mt-1" />
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-8">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <h4 className="title-has-control" htmlFor="departure-view">Departure </h4>
                                                        <hr className="mt-1" />
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="rutedeparture-view">Rute </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="rutedeparture-view" ref="rutedeparture" value={rutedeparture} disabled />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="airlinedeparture-view">Airline </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="airlinedeparture-view" ref="airlinedeparture" value={(flightdeparture !== undefined && flightdeparture.airlinecode !== undefined) ? flightdeparture.airlinecode : "-"} disabled />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="flightnumberdeparture-view">Flight Number </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="flightnumberdeparture-view" ref="flightnumberdeparture" maxLength="4" placeholder="ex. 0001" />
                                                                        <span className="text-danger">{errors["flightnumberdeparture"]}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="departuredate-view">Date </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="departuredate-view" ref="departuredate" value={(searchflight.departuredate) ? moment(searchflight.departuredate).format("DD/MM/YYYY") : '-'} disabled />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={(searchflight.isreturn) ? "col-sm-12" : "col-sm-12 d-none"}>
                                                        <h4 className="title-has-control" htmlFor="return-view">Return </h4>
                                                        <hr className="mt-1" />
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="rutereturn-view">Rute </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="rutereturn-view" ref="rutereturn" value={rutereturn} disabled />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="airlinereturn-view">Airline </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="airlinereturn-view" ref="airlinereturn" value={(flightreturn !== undefined && flightreturn.airlinecode !== undefined) ? flightreturn.airlinecode : "-"} disabled />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="flightnumberreturn-view">Flight Number </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="flightnumberreturn-view" ref="flightnumberreturn" maxLength="4" placeholder="ex. 0001" />
                                                                        <span className="text-danger">{errors["flightnumberreturn"]}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-sm-4 col-form-label" htmlFor="returndate-view">Date </label>
                                                                    <div className="col-sm-8">
                                                                        <input className="form-control" type="text" id="returndate-view" ref="returndate" value={(searchflight.returndate) ? moment(searchflight.returndate).format("DD/MM/YYYY") : '-'} disabled />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 text-center p-5">
                                                <h2>Total Mileage</h2>
                                                <h2 className="mt-3 mb-3">{formatNumber(redemptionsummary.totalmileage)}</h2>
                                                <h4>{redemptionsummary.passenger} x {formatNumber(redemptionsummary.mileage)} Mileage</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 mb-2">
                                <div className="content-title flex-hr mb-0 title-description">
                                    <h3 className="title-has-control mt-2">Passenger Data</h3>
                                </div>
                                <hr className="mt-1" />
                                <div className="card">
                                    <div className="card-body">
                                        {passengerdatalist}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 mt-3">
                                <div className="form-group row">
                                    <div className="col-sm-3 offset-sm-9">
                                        <button type="submit" className="btn btn-success large w-100">Confirm</button>
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