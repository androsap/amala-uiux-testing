import React, { Component } from 'react';
import CertificateDetail from '../cancel/CertificateDetail';
import Loader from '../../../../components/Loader';
import Alert from '../../../../components/Alert';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: [],
            standarfee: true,
            updateunit: null,
            updatefee: null,
            fee: null,
            redeemairactivity: []

        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        const { activityairtype } = this.props.updatecertificate;
        if (activityairtype === 'ROUNDTRIP' || activityairtype.split("/")[1] === 'DEPARTURE') {
            //flightnumberdeparture
            if (!field['flightnumberdeparture']) {
                errors['flightnumberdeparture'] = 'Required';
            } else if (!field['flightnumberdeparture'].match(/^[a-zA-Z0-9]+$/)) {
                errors['flightnumberdeparture'] = 'Only alphanumeric';
            } else if (field['flightnumberdeparture'].length > 4) {
                errors['flightnumberdeparture'] = 'Maximum 4 characters';
            }
        }

        if (activityairtype === 'ROUNDTRIP' || activityairtype.split("/")[1] === 'RETURN') {
            //flightnumberreturn
            if (!field['flightnumberreturn']) {
                errors['flightnumberreturn'] = 'Required';
            } else if (!field['flightnumberreturn'].match(/^[a-zA-Z0-9]+$/)) {
                errors['flightnumberreturn'] = 'Only alphanumeric';
            } else if (field['flightnumberreturn'].length > 4) {
                errors['flightnumberreturn'] = 'Maximum 4 characters';
            }
        }

        const { standarfee } = this.state;
        if (!standarfee) {
            if (!field['fee']) {
                errors['fee'] = 'Required';
            } else if (!field['fee'].match(/^[0-9]+$/)) {
                errors['fee'] = 'Only numeric';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    async componentDidMount() {
        let awardcode = this.props.awardcode;
        await this.setState(
            { awardcode },
            this.getFee(awardcode)
        );
    }

    async componentWillReceiveProps(props) {
        let awardcode = props.awardcode;
        await this.setState(
            { awardcode },
            this.getFee(awardcode)
        );
    }

    getFee(awardcode) {
        let url = api.url.awardmaster.retrievecancelupdate;
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            const { result } = response;
            if (responsecode.substring(0, 1) === '0' && result) {
                let updateunit = (result.updateunit) ? result.updateunit : null;
                let updatefee = (result.updatefee) ? result.updatefee : 0;

                //call loader
                const { standarfee } = this.state;
                this.setState({
                    updateunit,
                    updatefee,
                    loading: false
                }, () => this.calculationFee(standarfee));
            } else {
                Alert.error(responsemessage);
            }
        });
    }

    handleBack = () => {
        const { activityairtype } = this.props.updatecertificate;
        if (activityairtype === 'ROUNDTRIP') {
            this.props.jumpStepTo(4);
        } else {
            this.props.jumpStepTo(3);
        }
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

        if (this.handleValidation(formData)) {
            //show loader
            this.setState({ loading: true });
            let { standarfee, fee } = this.state;
            let { detailcertificate, updatesummary, pricelist, activityairtype, selectedairactivity } = this.props.updatecertificate;
            let { awardcode, memberid, bookingcode, ticketvaliditydate, ticketnumber, freeaward } = detailcertificate;
            let { flightdeparture, flightreturn, certificateprice } = updatesummary;
            let { tierid, countrycode, membershipid } = pricelist;

            // standarfee = (standarfee) ? 1 : 0;
            // freeaward = (freeaward) ? 1 : 0;
            let issueddate = moment(new Date()).format("YYYY-MM-DD");
            let totalprice = certificateprice;
            let isreturn = (activityairtype === 'ROUNDTRIP') ? true : false;
            let updatetype = null;
            let certificateid = (detailcertificate.redeemuser && detailcertificate.redeemuser.certificateid) ? detailcertificate.redeemuser.certificateid : null;
            if (activityairtype === 'ROUNDTRIP') {
                updatetype = 'ALL';
            } else {
                updatetype = (activityairtype.split("/")[1]) ? activityairtype.split("/")[1] : null;
            }

            if (detailcertificate.redeemusers > 1 && (activityairtype !== 'ROUNDTRIP')) {
                let oldcertificateprice = detailcertificate.redeemuser.certificateprice;
                let newprice = (activityairtype.split("/")[1] !== 'DEPARTURE') ? flightdeparture.price : flightreturn.price;
                let oldprice = (activityairtype.split("/")[1] !== 'DEPARTURE') ? selectedairactivity.departureactivity.price : selectedairactivity.returnactivity.price;

                certificateprice = oldcertificateprice + (newprice - oldprice);
            }
            let redeemuser = {
                name: detailcertificate.redeemuser.name,
                familyname: detailcertificate.redeemuser.familyname,
                salutationcode: detailcertificate.redeemuser.salutationcode,
                memberiduser: detailcertificate.redeemuser.memberiduser,
                travelertype: detailcertificate.redeemuser.travelertype,
                selfusage: (detailcertificate.redeemuser.selfusage) ? 1 : 0,
                certificateprice
            }

            //REDEEM AIR ACTIVITY WILL BE UPDATED
            let redeemairactivityid = [];
            var value = null;

            value = detailcertificate.redeemairactivity.filter(function (obj) {
                return obj.type === "DEPARTURE";
            });
            redeemairactivityid.push(value[0].redeemairactivityid);

            if (detailcertificate.redeemairactivity.length > 1) {
                value = detailcertificate.redeemairactivity.filter(function (obj) {
                    return obj.type === "RETURN";
                });
                redeemairactivityid.push(value[0].redeemairactivityid);
            }

            //SET REDEEM AIR ACTIVITY
            let redeemairactivity = [];
            if (detailcertificate.redeemairactivity.length > 1 && activityairtype.split("/")[0] === 'ONEWAY' && activityairtype.split("/")[1] === 'RETURN') {
                flightreturn.flightnumber = formData.flightnumberreturn;
            } else if (detailcertificate.redeemairactivity.length > 1 && activityairtype.split("/")[0] === 'ONEWAY' && activityairtype.split("/")[1] === 'DEPARTURE') {
                flightdeparture.flightnumber = formData.flightnumberdeparture;
            } else {
                flightdeparture.flightnumber = formData.flightnumberdeparture;
                flightreturn.flightnumber = formData.flightnumberreturn;
            }
            redeemairactivity.push(flightdeparture);
            if (detailcertificate.redeemairactivity.length > 1) {
                redeemairactivity.push(flightreturn);
            }

            fee = (standarfee) ? fee : formData.fee;

            let data = {
                awardcode, memberid, bookingcode, issueddate, ticketvaliditydate, ticketnumber, freeaward, totalprice,
                return: isreturn,
                tierid, countrycode, membershipid, updatetype, standarfee, fee,
                certificateid, redeemuser, redeemairactivityid, redeemairactivity
            };

            let url = api.url.redemptioncertificate.update;
            let message = 'Ceritificate has been updated';
            if (window.confirm("Are you sure update?")) {
                var requestData = SaveRequest(url, data);
                if (requestData) {
                    requestData.then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {

                            this.props.setReponseUpdateAward(response.result);
                            this.props.loadDataMemberHeader(memberid);
                            this.props.jumpStepTo(6);
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);
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
    }

    handleStandardFee = (event) => {
        let standarfee = event === null ? null : event.target.checked;
        this.calculationFee(standarfee);
    }

    calculationFee(standarfee) {
        let { updateunit, updatefee } = this.state;
        let { certificateprice } = this.props.updatecertificate.detailcertificate.redeemuser;
        const { detailcertificate, activityairtype, selectedairactivity } = this.props.updatecertificate;
        const { redeemairactivity } = detailcertificate;
        //CALCULATION FEE
        let fee = null;
        if (standarfee && updateunit === 'PERCENTAGE') {
            fee = Math.ceil(certificateprice * updatefee / 100);
            if (redeemairactivity.length > 1 && activityairtype.split("/")[1] === 'DEPARTURE') {
                const { departureactivity } = selectedairactivity;
                fee = Math.ceil(departureactivity.price * updatefee / 100);
            } else if (redeemairactivity.length > 1 && activityairtype.split("/")[1] === 'RETURN') {
                const { returnactivity } = selectedairactivity;
                fee = Math.ceil(returnactivity.price * updatefee / 100);
            }
        } else if (standarfee && updateunit === 'MILEAGE') {
            fee = updatefee;
        }

        //IF FREEAWARD, FEE = 0
        let { freeaward } = this.props.updatecertificate.detailcertificate;
        if (freeaward) {
            fee = (standarfee) ? 0 : null;
        }
        this.setState({ standarfee, fee });
    }

    render() {
        const { loading, errors } = this.state;
        const { standarfee, fee } = this.state;
        const { certificateid, certificatedetail } = this.props;
        const { activityairtype } = this.props.updatecertificate;
        const { flightdeparture, flightreturn } = this.props.updatecertificate.updatesummary;
        const { redeemuser } = this.props.updatecertificate.detailcertificate;
        const { certificateprice } = this.props.updatecertificate.updatesummary;

        let departureorigin = (flightdeparture && flightdeparture.origin) ? flightdeparture.origin : null;
        let departuredestination = (flightdeparture && flightdeparture.destination) ? flightdeparture.destination : null;
        let departureairlinecode = (flightdeparture && flightdeparture.airline) ? flightdeparture.airline : null;
        let departuredate = (flightdeparture && flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : null;

        let returnorigin = (flightreturn && flightreturn.origin) ? flightreturn.origin : null;
        let returndestination = (flightreturn && flightreturn.destination) ? flightreturn.destination : null;
        let returnairlinecode = (flightreturn && flightreturn.airline) ? flightreturn.airline : null;
        let returndate = (flightreturn && flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : null;

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
                                <label className="main-label mb-3">Booking Completion</label>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group row">
                                            <label className="col-sm-2" htmlFor="issueddate-view">Issued Date </label>
                                            <div className="col-sm-10">{moment(new Date()).format("D MMMM YYYY")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-2">
                        <div className="card-body">
                            <div className="member-section">
                                <label className="main-label mb-3">Flight Schedule Completion</label>
                                <div className="row">
                                    <div className="col-sm-8">
                                        <div className={(activityairtype === 'ROUNDTRIP' || activityairtype.split("/")[1] === 'DEPARTURE') ? "row" : "row d-none"}>
                                            <div className="col-sm-12">
                                                <h4 className="title-has-control" htmlFor="departure-view">Departure </h4>
                                                <hr className="mt-1" />
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="rutedeparture-view">Rute </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="rutedeparture-view" ref="rutedeparture" value={departureorigin + " - " + departuredestination} disabled />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="airlinedeparture-view">Airline </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="airlinedeparture-view" ref="airlinedeparture" value={departureairlinecode} disabled />
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
                                                        <input className="form-control" type="text" id="departuredate-view" ref="departuredate" value={departuredate} disabled />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={(activityairtype === 'ROUNDTRIP' || activityairtype.split("/")[1] === 'RETURN') ? "row" : "row d-none"}>
                                            <div className="col-sm-12">
                                                <h4 className="title-has-control" htmlFor="return-view">Return </h4>
                                                <hr className="mt-1" />
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="rutereturn-view">Rute </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="rutereturn-view" ref="rutereturn" value={returnorigin + " - " + returndestination} disabled />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="airlinereturn-view">Airline </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="airlinereturn-view" ref="airlinereturn" value={returnairlinecode} disabled />
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
                                                        <input className="form-control" type="text" id="returndate-view" ref="returndate" value={returndate} disabled />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4 text-center p-5">
                                        <h2>Total Mileage</h2>
                                        <h2 className="mt-3 mb-3">{(certificateprice !== undefined) ? certificateprice : "-"}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-2">
                        <div className="card-body">
                            <div className="member-section">
                                <label className="main-label mb-3">Passenger</label>
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3" htmlFor="salutation-view">Salutation </label>
                                            <div className="col-sm-9" htmlFor="salutation_value-view">{redeemuser.salutationcode} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3" htmlFor="name-view">Name </label>
                                            <div className="col-sm-9" htmlFor="name_value-view">{redeemuser.name} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3" htmlFor="familyname-view">Family Name </label>
                                            <div className="col-sm-9" htmlFor="familyname_value-view">{redeemuser.familyname} </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3" htmlFor="memberid-view">Member ID </label>
                                            <div className="col-sm-9" htmlFor="memberid_value-view">{(redeemuser.memberiduser) ? redeemuser.memberiduser : '-'} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3" htmlFor="travelertype-view">Traveler Type </label>
                                            <div className="col-sm-9" htmlFor="travelertype_value-view">{(redeemuser.travelertype) ? redeemuser.travelertype : '-'} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3" htmlFor="selfusasge-view">Self Usage </label>
                                            <div className="col-sm-9" htmlFor="selfusasge_value-view">{(redeemuser.selfusage) ? "Yes" : "No"} </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-2">
                        <div className="card-body">
                            <div className="member-section">
                                <label className="main-label mb-3">Update Fee</label>
                                <div className="row justify-content-between">
                                    <div className="col-sm-3">
                                        <div className="form-group row">
                                            <label className="col col-form-label" htmlFor="standarfee-view">Standard Fee </label>
                                            <div className="col-sm-7">
                                                <div className="row no-gutters">
                                                    <label className="custom-control border-switch">
                                                        <input id="standarfee-view" ref="standarfee" className="border-switch-control-input" type="checkbox" onClick={this.handleStandardFee} defaultChecked={(standarfee) ? "checked" : null} disabled />
                                                        <span className="border-switch-control-description">No</span>
                                                        <span className="border-switch-control-indicator"></span>
                                                        <span className="border-switch-control-description">Yes</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="form-group row text-right">
                                            <label className="col col-form-label" htmlFor="fee-view">Fee </label>
                                            <div className={(standarfee) ? "col-sm-9" : "col-sm-9 hidden"}>
                                                <h2 id="totalstandarfee">{fee}</h2>
                                            </div>
                                            <div className={(!standarfee) ? "col-sm-9" : "col-sm-9 hidden"}>
                                                <input className="form-control" type="text" id="fee-view" ref="fee" maxLength="11" />
                                                <span className="text-danger">{errors["fee"]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-footer text-center mt-3 mb-3">
                        <button type="button" className="btn btn-outline-dark normal mr-2" onClick={this.handleBack}>Back</button>
                        <button className="btn btn-primary normal">Process</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Layout;