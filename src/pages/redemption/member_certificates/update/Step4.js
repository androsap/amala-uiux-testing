import React, { Component } from 'react';
import moment from 'moment';
import CertificateDetail from '../cancel/CertificateDetail';
import Loader from '../../../../components/Loader';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectflight: null
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //selectflight
        if (field['selectflight'] === null) {
            errors['selectflight'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    async componentDidMount() {

        //RESET UPDATE SUMMARY
        const { redeemusers } = this.props.updatecertificate.detailcertificate;
        let flightreturn = {};
        let mileage = null;
        let totalmileage = null;
        let passenger = (redeemusers) ? redeemusers.length : 0;
        let updatesummary = { flightreturn, mileage, totalmileage, passenger };
        await this.props.setUpdateSummary(updatesummary);
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};

        formData['selectflight'] = this.state.selectflight;
        if (this.handleValidation(formData)) {
            this.props.jumpStepTo(5);
        }
    }

    handleSelectFlight = (e, selectflight) => {
        const { pricelist } = this.props.updatecertificate;
        const { redeemusers } = this.props.updatecertificate.detailcertificate;

        let selectedflightreturn = (pricelist && pricelist.return[selectflight]) ? pricelist.return[selectflight] : null;
        let mileage = (pricelist && pricelist.departure[selectflight] && pricelist.departure[selectflight].returnprice) ? pricelist.departure[selectflight].returnprice : 0;
        let passenger = (redeemusers) ? redeemusers.length : 0;
        // let totalmileage = mileage * passenger;
        let certificateprice = mileage;

        let flightreturn = {
            type: "return",
            price: selectedflightreturn.onewayprice,
            activitydate: pricelist.returndate,
            airline: selectedflightreturn.airlinecode,
            origin: selectedflightreturn.origin,
            destination: selectedflightreturn.destination,
            feeder: 0,
            compartment: selectedflightreturn.compartmentcode,
            bookingclass: selectedflightreturn.bookingclasscode,
            bookingtype: "INTERNET",
            peakseasonstatus: selectedflightreturn.peakseasonstatus,
            paidairlinecode: (selectedflightreturn.paidairlinecode) ? selectedflightreturn.paidairlinecode : null,
            paidcompartmentcode: (selectedflightreturn.paidbookingclassdepart) ? selectedflightreturn.paidbookingclassdepart : null,
            paidbookingclasscode: (selectedflightreturn.paidcompartmentcodedepart) ? selectedflightreturn.paidcompartmentcodedepart : null
        };

        let updatesummary = { flightreturn, mileage, certificateprice, passenger };
        this.props.setUpdateSummary(updatesummary);
        this.setState({ selectflight });
    }

    handleBack = () => {
        this.props.jumpStepTo(3);
    }

    render() {
        const { loading, selectflight } = this.state;
        const { certificateid, certificatedetail } = this.props;
        const { pricelist } = this.props.updatecertificate;
        const { flightdeparture, flightreturn, certificateprice } = this.props.updatecertificate.updatesummary;

        let origindeparture = (flightdeparture && flightdeparture.origin) ? flightdeparture.origin : null;
        let destinationdeparture = (flightdeparture && flightdeparture.destination) ? flightdeparture.destination : null;
        let airlinecodedeparture = (flightdeparture && flightdeparture.airline) ? flightdeparture.airline : null;
        let departuredate = (pricelist && pricelist.departuredate) ? moment(pricelist.departuredate).format("DD/MM/YYYY") : null;

        let originreturn = (flightreturn && flightreturn.origin) ? flightreturn.origin : null;
        let destinationreturn = (flightreturn && flightreturn.destination) ? flightreturn.destination : null;
        let airlinecodereturn = (flightreturn && flightreturn.airline) ? flightreturn.airline : null;
        let returndate = (pricelist && pricelist.returndate) ? moment(pricelist.returndate).format("DD/MM/YYYY") : null;

        let returnlist = '';
        if (pricelist.return && pricelist.return.length > 0) {
            returnlist = pricelist.return.map((data, key) =>
                <div className="card mb-1" key={key}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col text-center"> {data.airlinecode} </div>
                            <div className="col text-center"> {data.origin} - {data.destination} </div>
                            <div className="col text-center"> {data.compartmentcode} - {data.bookingclasscode} </div>
                            <div className="col text-center">
                                <button type="button" className={(selectflight === key) ? "btn btn-success small" : "btn btn-secondary small"} onClick={(e) => this.handleSelectFlight(e, key)}>Select</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

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
                                <label className="main-label mb-3">Redemption Air Activity - Flight Info (Retrun)</label>
                                <div className="row">
                                    <div className="col-sm-9">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="member-section">
                                                    <div className="card-body">
                                                        <div className="row font-weight-bold">
                                                            <div className="col text-center"> Operating Airline </div>
                                                            <div className="col text-center"> Origin - Destination </div>
                                                            <div className="col text-center"> Compartment - Booking Class </div>
                                                            <div className="col text-center"></div>
                                                        </div>
                                                    </div>
                                                    {returnlist}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <h3 className="card-title">Update Summary</h3>
                                                <div className="form-group row">
                                                    <label className="col-sm-5 col-form-label">Departure </label>
                                                    <div className="col-sm-7 col-form-label">{departuredate} </div>
                                                    <div>
                                                        <div className="col-sm-12">{origindeparture} - {destinationdeparture} </div>
                                                        <div className="col-sm-12">{airlinecodedeparture} </div>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-5 col-form-label">Return </label>
                                                    <div className="col-sm-7 col-form-label">{returndate} </div>
                                                    {
                                                        (selectflight !== null && flightreturn.airline) ?
                                                            <div>
                                                                <div className="col-sm-12">{originreturn} - {destinationreturn} </div>
                                                                <div className="col-sm-12">{airlinecodereturn} </div>
                                                            </div>
                                                            :
                                                            <div className="col-sm-12 text-danger">Please select return flight</div>
                                                    }
                                                </div>
                                                <div className="form-group row">
                                                    <h4 className="col-sm-4">Total </h4>
                                                    <h4 className="col-sm-8 text-right">{(selectflight !== null) ? certificateprice : ''} Mileage </h4>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-12">
                                                        <button type="submit" className="btn btn-success large w-100">Continue</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-footer text-center mt-3 mb-3">
                        <button type="button" className="btn btn-outline-dark normal mr-2" onClick={this.handleBack}>Back</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Layout;