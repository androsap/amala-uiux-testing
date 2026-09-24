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
                                    <label>Departure </label>
                                    <hr className="mt-1" />
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <label className="col-sm-3">Rute </label>
                                        <label className="col-sm-3"> Airline</label>
                                        <label className="col-sm-3"> Flight Number</label>
                                        <label className="col-sm-3"> Date</label>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">{flightdeparture.origin} - {flightdeparture.destination} </div>
                                        <div className="col-sm-3"> {flightdeparture.airlinecode}</div>
                                        <div className="col-sm-3"> {flightdeparture.flightnumber}</div>
                                        <div className="col-sm-3"> {(flightdeparture.activitydate) ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : ''}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={(isreturn) ? "row mt-5" : "row mt-5 d-none"}>
                                <div className="col-sm-12">
                                    <label>Return </label>
                                    <hr className="mt-1" />
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <label className="col-sm-3">Rute </label>
                                        <label className="col-sm-3"> Airline</label>
                                        <label className="col-sm-3"> Flight Number</label>
                                        <label className="col-sm-3"> Date</label>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">{flightreturn.origin} - {flightreturn.destination} </div>
                                        <div className="col-sm-3"> {flightreturn.airlinecode}</div>
                                        <div className="col-sm-3"> {flightreturn.flightnumber}</div>
                                        <div className="col-sm-3"> {(flightreturn.activitydate) ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : ''}</div>
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