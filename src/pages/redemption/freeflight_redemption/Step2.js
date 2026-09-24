import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';
import Breadcrumb from '../../../components/Breadcrumb';
import moment from 'moment';
import HeaderAwards from '../../../components/Header/Awards';
import { formatNumber } from '../../../utilities/Helpers';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: [],
            titlepage: 'Flight Info - Departure',
            flightscheduledeparture: [],
            flightschedulereturn: [],
            selectflight: null,
            confirmdisabled: true,
            freeaward: false,
            searchflight: {},
            isreturn: null,
            passenger: null,
            member: {},
            award: {},
            redemptionsummary: {
                flightdeparture: {},
                flightreturn: {},
                mileage: 0,
                nopassenger: 0,
                totalmileage: 0,
                certificateprice: 0,
                activityprice: 0
            }
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

    componentDidMount() {
        const { freeaward } = this.state;
        this.setState({
            searchflight: this.props.redemption.searchflight,
            flightscheduledeparture: this.props.redemption.pricelist.pricedeparture,
            flightschedulereturn: this.props.redemption.pricelist.pricereturn,
            isreturn: this.props.redemption.searchflight.isreturn,
            passenger: this.props.redemption.searchflight.passenger,
            member: this.props.redemption.member,
            award: this.props.redemption.award
        }, () => this.calculationMileage(freeaward));
    }

    checkConfirmation(priceaward) {
        // const { priceaward } = this.state.redemption.awards;
        const { member } = this.state;
        let awardmiles = member.awardmiles;
        let confirmdisabled = true;
        if ((awardmiles > priceaward)) {
            confirmdisabled = false;
        }
        this.setState({ confirmdisabled, loading: false });
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
        formData['selectflight'] = this.state.selectflight;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });

            const { searchflight, redemptionsummary, freeaward } = this.state;

            //get price list from response service getpricelist
            let flightscheduledeparture = this.state.flightscheduledeparture;
            let flightschedulereturn = this.state.flightschedulereturn;

            if (searchflight.isreturn) {
                flightschedulereturn = this.getFlightReturnFilter(redemptionsummary.flightdeparture.airlinecode);
            }

            let generalRequestData = { freeaward };
            this.props.setGeneralRequest(generalRequestData);
            this.props.setFlightSchedule(flightscheduledeparture, flightschedulereturn);
            this.props.setRedemptionSummary(redemptionsummary);
            if (searchflight.isreturn) {
                this.props.changePage("PAGE", 'step3');
            } else {
                this.props.changePage("PAGE", 'step4');
            }

        }
    };

    getFlightReturnFilter(flightdeparture = '') {
        let result = [];
        let flightschedulereturn = this.state.flightschedulereturn;
        for (const field in flightschedulereturn) {
            if (flightschedulereturn[field]['airlinecode'].toLowerCase() === flightdeparture.toLowerCase()) {
                result.push(flightschedulereturn[field])
            }
        }
        return result;
    }

    handleSelectFlight = (e, selectflight) => {
        const { flightscheduledeparture, searchflight, isreturn } = this.state;
        let passenger = Number.parseInt(searchflight.passenger, 0);
        let mileage = (!searchflight.isreturn) ? Number.parseInt(flightscheduledeparture[selectflight].onewayprice, 0) : 0;
        let totalmileage = passenger * mileage;

        let certificateprice = (!isreturn) ? Number.parseInt(flightscheduledeparture[selectflight].onewayprice, 0) : Number.parseInt(flightscheduledeparture[selectflight].returnprice, 0);
        let activityprice = Number.parseInt(flightscheduledeparture[selectflight].onewayprice, 0);

        this.setState({
            passenger,
            redemptionsummary: {
                flightdeparture: flightscheduledeparture[selectflight],
                flightreturn: {},
                mileage, passenger,
                totalmileage,
                certificateprice,
                activityprice
            },
            selectflight,
            freeaward: false
        }, () => this.checkConfirmation(mileage))
    }

    handleFreeAwardChange = (event) => {
        let freeaward = event === null ? null : event.target.checked;
        this.calculationMileage(freeaward);
    }

    calculationMileage(freeaward) {
        if (freeaward) {
            this.setState(prevState => ({
                redemptionsummary: {
                    ...prevState.redemptionsummary,
                    totalmileage: 0,
                    certificateprice: 0,
                    confirmdisabled: false
                },
                freeaward
            }));
        } else {
            let { redemptionsummary, passenger, isreturn, selectflight } = this.state;

            let totalmileage = 0;
            let certificateprice = 0;
            if (selectflight !== null) {
                passenger = Number.parseInt(passenger, 0);
                let mileage = (!isreturn) ? Number.parseInt(redemptionsummary.flightdeparture.onewayprice, 0) : 0;
                totalmileage = passenger * mileage;
                certificateprice = (!isreturn) ? Number.parseInt(redemptionsummary.flightdeparture.onewayprice, 0) : Number.parseInt(redemptionsummary.flightdeparture.returnprice, 0);
            } else {
                totalmileage = 0;
            }

            this.setState(prevState => ({
                redemptionsummary: {
                    ...prevState.redemptionsummary,
                    certificateprice,
                    totalmileage
                },
                freeaward
            }));
        }
    }

    handleBackStep = (e) => {
        e.preventDefault();
        this.props.changePage("PAGE", 'step1');
    }

    render() {
        const { formrender, loading, confirmdisabled } = this.state;
        const { isreturn, passenger, searchflight, redemptionsummary, flightscheduledeparture, selectflight, freeaward, award } = this.state;
        const departureList =
            flightscheduledeparture.map((data, key) =>
                <div className="card mb-1" key={key}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-2 text-center"> {data.airlinecode} </div>
                            <div className="col-sm-3 text-center"> {data.origin + " - " + data.destination} </div>
                            <div className="col-sm-2 text-center"> {(isreturn) ? formatNumber(data.returnprice) : formatNumber(data.onewayprice)} </div>
                            <div className="col-sm-2 text-center"> {data.compartmentcode + " - " + data.bookingclasscode} </div>
                            <div className="col-sm-2 text-center">
                                <button type="button" className={(selectflight === key) ? "btn btn-success small" : "btn btn-secondary small"} onClick={(e) => this.handleSelectFlight(e, key)}>Select</button>
                            </div>
                        </div>
                    </div>
                </div>
            );

        let headeraward = '';
        if (award.awardcode !== undefined && award.awardcode !== null) {
            headeraward = <HeaderAwards id={award.awardcode} />;
        }

        if (formrender) {
            //render form
            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Redemption" />
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
                            <h3 className="title-has-control mt-2">Flight Info - Departure</h3>
                        </div>
                        <hr className="mt-0" />
                        <ol className="amala-wizard mb-5 d-flex justify-content-center">
                            <li className="amala-wizard-doing no-hl">
                                <span>Flight Info</span>
                            </li>
                            <li className="amala-wizard-todo no-hl">
                                <span>Passenger Data</span>
                            </li>
                            <li className="amala-wizard-todo no-hl">
                                <span>Completion</span>
                            </li>
                        </ol>
                        <div className="row">
                            <div className="col">
                                <form className="clearfix position-relative" autoComplete="off" onSubmit={(e) => this.saveAction(e)} >
                                    <Loader value={loading} />
                                    <div className="row">
                                        <div className="col-sm-9">
                                            <div className="row p-2 font-weight-bold">
                                                <div className="col-sm-2 text-center"> Operating Airline </div>
                                                <div className="col-sm-3 text-center"> Origin Destination </div>
                                                <div className="col-sm-2 text-center"> Price (Mileage) </div>
                                                <div className="col-sm-2 text-center"> Compartment - Booking Class </div>
                                            </div>
                                            {departureList}
                                            {
                                                (searchflight && searchflight.isreturn) ?
                                                    <div className="form-group row mt-4">
                                                        <div className="col-sm-12 text-right">
                                                            <button type="submit" className="btn btn-success large">Return Flight</button>
                                                        </div>
                                                    </div> : ""
                                            }
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h3 className="card-title">Redemption Summary</h3>
                                                    <div className="form-group row">
                                                        <label className="col-sm-5 col-form-label">Departure </label>
                                                        <div className="col-sm-7 col-form-label">{(searchflight) ? moment(searchflight.departuredate).format("DD/MM/YYYY") : 'Loading'} </div>
                                                        {
                                                            (selectflight !== null && redemptionsummary.flightdeparture) ?
                                                                <div><div className="col-sm-12">{redemptionsummary.flightdeparture.origin + " - " + redemptionsummary.flightdeparture.destination} </div>
                                                                    <div className="col-sm-12">{redemptionsummary.flightdeparture.airlinecode} </div>
                                                                    <div className="col-sm-12">{redemptionsummary.flightdeparture.flightnumber} </div>
                                                                </div>
                                                                : <div className="col-sm-12 text-danger">Please select departure flight</div>
                                                        }
                                                    </div>
                                                    {
                                                        (searchflight && searchflight.isreturn) ?
                                                            <div className="form-group row">
                                                                <label className="col-sm-5 col-form-label">Return </label>
                                                                <div className="col-sm-7 col-form-label">{(searchflight) ? moment(searchflight.returndate).format("DD/MM/YYYY") : 'Loading'} </div>
                                                                <div className="col-sm-12">Please select return flight</div>
                                                            </div> : ""
                                                    }
                                                    {/* {
                                                        (searchflight && !searchflight.isreturn) ?
                                                            <div className="form-group row">
                                                                <label className="col-sm-12 col-form-label text-right">{passenger} x {redemptionsummary.mileage} Mileage </label>
                                                            </div> : ""
                                                    } */}
                                                    {
                                                        (searchflight && !searchflight.isreturn) ?
                                                            <div className="form-group row">
                                                                <h4 className="col-sm-3">Total </h4>
                                                                <h4 className="col-sm-9 text-right">{formatNumber(redemptionsummary.totalmileage)} Mileage ({passenger} pax) </h4>
                                                            </div> : ""
                                                    }
                                                    {
                                                        (searchflight && !searchflight.isreturn) ?
                                                            <div className="form-group row">
                                                                <div className="col-sm-12">
                                                                    <button type="submit" className="btn btn-success large w-100" disabled={confirmdisabled}>Continue</button>
                                                                    {(selectflight !== null && confirmdisabled) ? <div class="text-danger">Not enough mileage</div> : ''}
                                                                </div>
                                                            </div> : ""
                                                    }
                                                    {
                                                        (searchflight && !searchflight.isreturn) ?
                                                            <div className="form-group row">
                                                                <label className="col-sm-8 col-form-label" htmlFor="freeaward-view">Free Award</label>
                                                                <div className="col-sm-4">
                                                                    <label className="custom-control border-switch">
                                                                        <input id="freeaward-view" ref="freeaward" value="1" className="border-switch-control-input" type="checkbox" onChange={this.handleFreeAwardChange} checked={(freeaward) ? "checked" : ""} disabled />
                                                                        <span className="border-switch-control-indicator"></span>
                                                                    </label>
                                                                </div>
                                                            </div> : ""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;