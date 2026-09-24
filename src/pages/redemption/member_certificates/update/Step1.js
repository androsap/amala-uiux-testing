import React, { Component } from 'react';
import CertificateDetail from '../cancel/CertificateDetail';
import Loader from '../../../../components/Loader';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            loading: true
        }
    }


    handleValidation() {
        let errors = {};
        let status = true;

        const { departureactivity, returnactivity } = this.props.updatecertificate.selectedairactivity;
        if (departureactivity.redeemairactivityid === undefined && returnactivity.redeemairactivityid === undefined) {
            errors['selectedairactivity'] = '* Please choose air activity';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

    componentWillReceiveProps(props) {
        this.setState({ loading: false });
    }

    handleSelectActivityChange = (event, activityid, type) => {
        let selectactivity = event === null ? null : event.target.checked;
        const { redeemairactivity } = this.props.updatecertificate.detailcertificate;
        let activity = redeemairactivity.filter(function (value) {
            return value.redeemairactivityid === activityid;
        });

        activity = (activity[0] !== undefined) ? activity[0] : {};

        if (selectactivity) {
            this.props.selectedAirActivity(type, activity);
        } else {
            this.props.selectedAirActivity(type);
        }

        this.setUpdateSummary();
    }

    //SET DEFAULT UPDATE SUMMARY FLIGHT DEPARTURE AND FLIGHT RETURN
    setUpdateSummary() {
        const { detailcertificate } = this.props.updatecertificate;
        const { redeemairactivity } = detailcertificate;

        let flightdeparture = redeemairactivity.filter(function (value) { return value.type === 'DEPARTURE'; });
        flightdeparture = {
            type: "departure",
            price: (flightdeparture[0] && flightdeparture[0].price) ? flightdeparture[0].price : null,
            activitydate: (flightdeparture[0] && flightdeparture[0].activitydate) ? flightdeparture[0].activitydate : null,
            airline: (flightdeparture[0] && flightdeparture[0].airline) ? flightdeparture[0].airline : null,
            origin: (flightdeparture[0] && flightdeparture[0].origin) ? flightdeparture[0].origin : null,
            destination: (flightdeparture[0] && flightdeparture[0].destination) ? flightdeparture[0].destination : null,
            feeder: 0,
            flightnumber: (flightdeparture[0] && flightdeparture[0].flightnumber) ? flightdeparture[0].flightnumber : null,
            compartment: (flightdeparture[0] && flightdeparture[0].compartment) ? flightdeparture[0].compartment : null,
            bookingclass: (flightdeparture[0] && flightdeparture[0].bookingclass) ? flightdeparture[0].bookingclass : null,
            bookingtype: "INTERNET",
            peakseasonstatus: false,
            paidairlinecode: (flightdeparture[0] && flightdeparture[0].paidairlinecode) ? flightdeparture[0].paidairlinecode : null,
            paidcompartmentcode: (flightdeparture[0] && flightdeparture[0].paidcompartmentcode) ? flightdeparture[0].paidcompartmentcode : null,
            paidbookingclasscode: (flightdeparture[0] && flightdeparture[0].paidbookingclasscode) ? flightdeparture[0].paidbookingclasscode : null
        }

        let updatesummary = { flightdeparture };

        if (redeemairactivity.length > 1) {
            let flightreturn = redeemairactivity.filter(function (value) { return value.type === 'RETURN'; });
            flightreturn = {
                type: "return",
                price: (flightreturn[0] && flightreturn[0].price) ? flightreturn[0].price : null,
                activitydate: (flightreturn[0] && flightreturn[0].activitydate) ? flightreturn[0].activitydate : null,
                airline: (flightreturn[0] && flightreturn[0].airline) ? flightreturn[0].airline : null,
                origin: (flightreturn[0] && flightreturn[0].origin) ? flightreturn[0].origin : null,
                destination: (flightreturn[0] && flightreturn[0].destination) ? flightreturn[0].destination : null,
                feeder: 0,
                flightnumber: (flightreturn[0] && flightreturn[0].flightnumber) ? flightreturn[0].flightnumber : null,
                compartment: (flightreturn[0] && flightreturn[0].compartment) ? flightreturn[0].compartment : null,
                bookingclass: (flightreturn[0] && flightreturn[0].bookingclass) ? flightreturn[0].bookingclass : null,
                bookingtype: "INTERNET",
                peakseasonstatus: false,
                paidairlinecode: (flightreturn[0] && flightreturn[0].paidairlinecode) ? flightreturn[0].paidairlinecode : null,
                paidcompartmentcode: (flightreturn[0] && flightreturn[0].paidcompartmentcode) ? flightreturn[0].paidcompartmentcode : null,
                paidbookingclasscode: (flightreturn[0] && flightreturn[0].paidbookingclasscode) ? flightreturn[0].paidbookingclasscode : null
            }
            updatesummary.flightreturn = flightreturn;
        }
        this.props.setUpdateSummary(updatesummary);
    }

    saveAction = (e) => {
        e.preventDefault();
        if (this.handleValidation()) {
            const { departureactivity, returnactivity } = this.props.updatecertificate.selectedairactivity;
            let typeactivity = null;
            if ((departureactivity && departureactivity.redeemairactivityid !== undefined) && (returnactivity && returnactivity.redeemairactivityid !== undefined)) {
                typeactivity = 'ROUNDTRIP';
            } else if ((departureactivity && departureactivity.redeemairactivityid !== undefined)) {
                typeactivity = 'ONEWAY/DEPARTURE';
            } else if ((returnactivity && returnactivity.redeemairactivityid !== undefined)) {
                typeactivity = 'ONEWAY/RETURN';
            }
            this.props.saveActivityAirType(typeactivity);
            this.props.jumpStepTo(2);
        }
    }

    handleBack = () => {
        this.props.jumpStepTo(0);
    }

    render() {
        const { errors, loading } = this.state;
        const { certificatedetail, certificateid } = this.props;
        const { redeemairactivity } = this.props.updatecertificate.detailcertificate;
        let { departureactivity, returnactivity } = this.props.updatecertificate.selectedairactivity;
        let redeemactivityiddeparture = (departureactivity && departureactivity.redeemairactivityid) ? departureactivity.redeemairactivityid : null;
        let redeemactivityidreturn = (returnactivity && returnactivity.redeemairactivityid) ? returnactivity.redeemairactivityid : null;

        var flightList = '';
        if (redeemairactivity && redeemairactivity.length) {
            flightList =
                redeemairactivity.sort((a, b) => {
                    return a.type > b.type;
                }).map((val, i) =>
                    <div className="card mb-1" key={i}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col text-center"> {"#" + ++i} </div>
                                <div className="col text-center"> {moment(val.activitydate).format('DD/MM/YYYY')} </div>
                                <div className="col text-center"> {val.airline} </div>
                                <div className="col text-center"> {val.flightnumber} </div>
                                <div className="col text-center"> {val.origin} - {val.destination}</div>
                                <div className="col text-center"> {val.price} </div>
                                <div className="col text-center">
                                    {(val.status === 'VOUCHER_ISSUED') ?
                                        <label className="custom-control fill-checkbox">
                                            <input type="checkbox" className="fill-control-input" ref={"airactivities_" + val["redeemairactivityid"]} onChange={(e) => this.handleSelectActivityChange(e, val["redeemairactivityid"], val["type"])} defaultChecked={((redeemactivityiddeparture === val["redeemairactivityid"]) || (redeemactivityidreturn === val["redeemairactivityid"])) ? true : false} />
                                            <span className="fill-control-indicator"></span>
                                            <span className="fill-control-description">Select</span>
                                        </label> :
                                        <span className="badge badge-muted">CANCELED</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        } else {
            flightList = <div className="card mb-1">
                <div className="card-body">
                    <div className="row">
                        <div className="col text-center">No data to display</div>
                    </div>
                </div>
            </div>
        }

        return (
            <div className="container-fluid">
                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                    <CertificateDetail certificatedetail={certificatedetail} certificateid={certificateid} />
                    <div className="member-section">
                        <Loader value={loading} />
                        <label className="main-label mt-4">Update Certificate</label>
                        <div className="card mt-2">
                            <div className="card-body">
                                <h4 className="mt-2">Redemption Air Activity</h4>
                                <hr className="mt-0 mb-0" />
                                <div className="card-body">
                                    <div className="row font-weight-bold">
                                        <div className="col text-center"> # </div>
                                        <div className="col text-center"> Activity Date </div>
                                        <div className="col text-center"> Operating Airline </div>
                                        <div className="col text-center"> Flight Number </div>
                                        <div className="col text-center"> Origin - Destination </div>
                                        <div className="col text-center"> Price (Mileage) </div>
                                        <div className="col text-center"> </div>
                                    </div>
                                </div>
                                {flightList}
                                <div className="row">
                                    <div className="col-md-12 text-right text-danger">{errors['selectedairactivity']}</div>
                                </div>
                            </div>
                        </div>
                        <div className="box-footer text-center mt-3 mb-3">
                            <button type="button" className="btn btn-outline-dark normal mr-2" onClick={this.handleBack}>Back</button>
                            <button className="btn btn-primary normal">Continue</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
export default Layout;