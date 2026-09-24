import React, { Component } from 'react';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flightdeparture: {},
            flightreturn: {},
            numbercertificate: ''
        };
    }

    componentWillReceiveProps(props) {
        const { flightdeparture, flightreturn, isreturn, numbercertificate } = props.data;
        this.setState({ flightdeparture, flightreturn, isreturn, numbercertificate });
    }

    render() {
        const { flightdeparture, flightreturn, isreturn, numbercertificate } = this.state;
        return (
            <div className="card mt-3" key={numbercertificate}>
                <div className="card-body">
                    <h4 className="mt-2">Redemption Activity Detail</h4>
                    <hr className="mt-1" />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="font-weight-bold">Departure </label>
                                    <hr className="mt-1" />
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <label className="col-sm-3"> Route </label>
                                        <label className="col-sm-3"> Airline</label>
                                        <label className="col-sm-3"> Flight Number</label>
                                        <label className="col-sm-3"> Date</label>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3"> {(flightdeparture !== undefined && flightdeparture.origin !== undefined) ? flightdeparture.origin : ''} - {(flightdeparture !== undefined && flightdeparture.destination !== undefined) ? flightdeparture.destination : ''} </div>
                                        <div className="col-sm-3"> {(flightdeparture !== undefined && flightdeparture.airlinecode !== undefined) ? flightdeparture.airlinecode : ''}</div>
                                        <div className="col-sm-3"> {(flightdeparture !== undefined && flightdeparture.flightnumber !== undefined) ? flightdeparture.flightnumber : ''}</div>
                                        <div className="col-sm-3"> {(flightdeparture !== undefined && flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : ''}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={(isreturn) ? "row mt-5" : "row mt-5 d-none"}>
                                <div className="col-sm-12">
                                    <label className="font-weight-bold">Return </label>
                                    <hr className="mt-1" />
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <label className="col-sm-3"> Route </label>
                                        <label className="col-sm-3"> Airline</label>
                                        <label className="col-sm-3"> Flight Number</label>
                                        <label className="col-sm-3"> Date</label>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3"> {(flightreturn !== undefined && flightreturn.origin !== undefined) ? flightreturn.origin : ''} - {(flightreturn !== undefined && flightreturn.destination !== undefined) ? flightreturn.destination : ''} </div>
                                        <div className="col-sm-3"> {(flightreturn !== undefined && flightreturn.airlinecode !== undefined) ? flightreturn.airlinecode : ''}</div>
                                        <div className="col-sm-3"> {(flightreturn !== undefined && flightreturn.flightnumber !== undefined) ? flightreturn.flightnumber : ''}</div>
                                        <div className="col-sm-3"> {(flightreturn !== undefined && flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : ''}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;