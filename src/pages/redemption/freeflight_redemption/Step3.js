import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';
import Breadcrumb from '../../../components/Breadcrumb';
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
            titlepage: 'Flight Info - Return',
            redemption: {},
            flightscheduledeparture: [],
            flightschedulereturn: [],
            flightinfo: {
                departure: {},
                return: {}
            },
            mileage: 0,
            passenger: 0,
            totalmileage: 0,
            selectflight: null,
            confirmdisabled: true,
            freeaward: false,
            member: {},
            award: {},
            searchflight: {},
            redemptionsummary: {
                flightdeparture: {},
                flightreturn: {},
                mileage: 0,
                passenger: 0,
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
            flightscheduledeparture: this.props.redemption.flightschedule.flightdeparture,
            flightschedulereturn: this.props.redemption.flightschedule.flightreturn,
            redemptionsummary: this.props.redemption.redemptionsummary,
            searchflight: this.props.redemption.searchflight,
            award: this.props.redemption.award,
            member: this.props.redemption.member
        }, () => this.calculationMileage(freeaward))
    }

    checkConfirmation(priceaward) {
        // const { priceaward } = this.state.award;
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

            const { redemptionsummary, freeaward } = this.state
            let generalRequestData = { freeaward };
            this.props.setGeneralRequest(generalRequestData);
            this.props.setRedemptionSummary(redemptionsummary);

            this.props.changePage("PAGE", 'step4');
        }
    };

    handleSelectFlight = (e, selectflight) => {
        const { flightschedulereturn, searchflight, redemptionsummary } = this.state;
        let freeaward = false;

        let passenger = Number.parseInt(searchflight.passenger, 0);
        let mileage = Number.parseInt(redemptionsummary.flightdeparture.returnprice, 0);
        let totalmileage = passenger * mileage;
        let certificateprice = Number.parseInt(redemptionsummary.flightdeparture.returnprice, 0);
        let activityprice = Number.parseInt(redemptionsummary.flightdeparture.onewayprice, 0);

        this.setState(prevstate => ({
            redemptionsummary: {
                flightdeparture: prevstate.redemptionsummary.flightdeparture,
                flightreturn: flightschedulereturn[selectflight],
                mileage, passenger, totalmileage, certificateprice, activityprice
            },
            selectflight,
            freeaward
        }), () => this.checkConfirmation(mileage));
    }

    handleDepartureFlight = (e) => {
        e.preventDefault();
        this.props.changePage("PAGE", 'step2');
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
            const { redemptionsummary, searchflight } = this.state;

            let passenger = Number.parseInt(searchflight.passenger, 0);
            let mileage = Number.parseInt(redemptionsummary.flightdeparture.returnprice, 0);
            let totalmileage = passenger * mileage;

            let certificateprice = Number.parseInt(redemptionsummary.flightdeparture.returnprice, 0);
            let activityprice = Number.parseInt(redemptionsummary.flightdeparture.onewayprice, 0);

            this.setState(prevState => ({
                redemptionsummary: {
                    ...prevState.redemptionsummary,
                    totalmileage, certificateprice, activityprice
                },
                freeaward
            }));
        }
    }

    handleBackStep = (e) => {
        e.preventDefault();
        this.props.changePage("PAGE", 'step2');
    }

    render() {
        const { formrender, loading } = this.state;
        const { flightschedulereturn, selectflight, award, searchflight, redemptionsummary, confirmdisabled, freeaward } = this.state;

        let returnList = '';
        if (flightschedulereturn.length > 0) {
            returnList = flightschedulereturn.map((data, key) =>
                <div className="card mb-1" key={key}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-2 text-center"> {data.airlinecode} </div>
                            <div className="col-sm-3 text-center"> {data.origin + " - " + data.destination} </div>
                            <div className="col-sm-3 text-center"> {data.compartmentcode + " - " + data.bookingclasscode} </div>
                            <div className="col-sm-3 text-center">
                                <button type="button" className={(selectflight === key) ? "btn btn-success small" : "btn btn-secondary small"} onClick={(e) => this.handleSelectFlight(e, key)}>Select</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            returnList = <div className="card mb-1">
                <div className="card-body">
                    <div className="row d-flex justify-content-center">
                        <h2>No flights available</h2>
                    </div>
                </div>
            </div>;
        }

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
                            <h3 className="title-has-control mt-2">Flight Info - Return</h3>
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
                                                <div className="col-sm-3 text-center"> Compartment - Booking Class </div>
                                            </div>
                                            {returnList}
                                            {
                                                (searchflight && searchflight.isreturn) ?
                                                    <div className="form-group row mt-4">
                                                        <div className="col-sm-12 text-left">
                                                            <button type="button" className="btn btn-success large" onClick={(e) => this.handleDepartureFlight(e)}>Departure Flight</button>
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
                                                        <div className="col-sm-7 col-form-label">
                                                            {(searchflight) ? moment(searchflight.departuredate).format("DD/MM/YYYY") : 'Loading'}
                                                        </div>
                                                        <div>
                                                            <div className="col-sm-12">{redemptionsummary.flightdeparture.origin + " - " + redemptionsummary.flightdeparture.destination} </div>
                                                            <div className="col-sm-12">{redemptionsummary.flightdeparture.airlinecode} </div>
                                                            <div className="col-sm-12">{redemptionsummary.flightdeparture.flightnumber} </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-5 col-form-label">Return </label>
                                                        <div className="col-sm-7 col-form-label">
                                                            {(searchflight) ? moment(searchflight.returndate).format("DD/MM/YYYY") : 'Loading'}
                                                        </div>
                                                        {
                                                            (selectflight !== null && redemptionsummary.flightreturn) ?
                                                                <div><div className="col-sm-12">{redemptionsummary.flightreturn.origin + " - " + redemptionsummary.flightreturn.destination} </div>
                                                                    <div className="col-sm-12">{redemptionsummary.flightreturn.airlinecode} </div>
                                                                    <div className="col-sm-12">{redemptionsummary.flightreturn.flightnumber} </div>
                                                                </div>
                                                                : <div className="col-sm-12 text-danger">Please select return flight</div>
                                                        }
                                                    </div>
                                                    {/* {
                                                        (selectflight !== null) ?
                                                            <div className="form-group row">
                                                                <label className="col-sm-12 col-form-label text-right">{(searchflight) ? searchflight.passenger : 0} x {redemptionsummary.mileage} Mileage </label>
                                                            </div> : ""
                                                    } */}
                                                    {
                                                        (selectflight !== null) ?
                                                            <div className="form-group row">
                                                                <h4 className="col-sm-3">Total </h4>
                                                                <h4 className="col-sm-9 text-right">{formatNumber(redemptionsummary.totalmileage)} Mileage ({(searchflight) ? searchflight.passenger : 0} Pax)</h4>
                                                            </div> : ""
                                                    }
                                                    <div className="form-group row">
                                                        <div className="col-sm-12">
                                                            <button type="submit" className="btn btn-success large w-100" disabled={confirmdisabled}>Continue</button>
                                                            {(selectflight !== null && confirmdisabled) ? <div class="text-danger">Not enough mileage</div> : ''}
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-8 col-form-label" htmlFor="freeaward-view">Free Award</label>
                                                        <div className="col-sm-4">
                                                            <label className="custom-control border-switch">
                                                                <input id="freeaward-view" ref="freeaward" value="1" className="border-switch-control-input" type="checkbox" onChange={this.handleFreeAwardChange} checked={(freeaward) ? "checked" : ""} disabled />
                                                                <span className="border-switch-control-indicator"></span>
                                                            </label>
                                                        </div>
                                                    </div>
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