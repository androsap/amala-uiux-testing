import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Loader from '../../components/Loader';
import moment from 'moment';
import ErrorGeneral from '../error/ErrorGeneral';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            responseCode: '0',
            responseMessage: '',
            //detil data//
            retroclaimid: props.id,
            cardnumber: null,
            ticketname: null,
            operatingairline: null,
            operatingfltnumber: null,
            origin: null,
            destination: null,
            operatingbookingsubclass: null,
            requestdate: null
        };
    }

    componentDidMount() {
        let retroclaimid = this.state.retroclaimid;
        this.getList(retroclaimid);
    }

    getList(retroclaimid) {
        let url = api.url.retroclaim.reqinfohistory;
        let data = { retroclaimid };
        //call loader
        this.setState({ isLoaded: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                if (result.length !== 0) {
                    this.setState({
                        cardnumber: (result.cardnumber) ? result.cardnumber : '-',
                        ticketname: (result.ticketname) ? result.ticketname : '-',
                        operatingairline: (result.operatingairline) ? result.operatingairline : '-',
                        operatingfltnumber: (result.operatingfltnumber) ? result.operatingfltnumber : '-',
                        origin: (result.origin) ? result.origin : '-',
                        destination: (result.destination) ? result.destination : '-',
                        operatingbookingsubclass: (result.operatingbookingsubclass) ? result.operatingbookingsubclass : '-',
                        requestdate: (result.requestdate) ? moment(result.requestdate).format('DD/MM/YYYY') : '-',
                        dataList: response.result.reqhistorylist,
                        isLoaded: false
                    });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({
                    responseCode: response.status.responsecode,
                    responseMessage: response.status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { dataList, isLoaded } = this.state;
            const { cardnumber, ticketname, operatingairline, operatingfltnumber, origin, destination, operatingbookingsubclass, requestdate } = this.state;

            var body = '';
            if (isLoaded) {
                body = <tbody>
                    <tr>
                        <td colSpan="99" className="text-center">Loading . . .</td>
                    </tr>
                </tbody>;
            } else {
                if (dataList.length) {
                    body = <tbody>
                        {dataList.map((val, i) =>
                            <tr key={i}>
                                <td>{++i}</td>
                                <td>{val.reqinfo}</td>
                                <td>{moment(val.actiondate).format('DD/MM/YYYY')}</td>
                                <td>
                                    {
                                        (val.actiondate.split("T")[1] !== undefined) ?
                                            (val.actiondate.split("T")[1].split(".")[0]) ? val.actiondate.split("T")[1].split(".")[0] : '-'
                                            : '-'
                                    }
                                </td>
                                <td>{val.actionby}</td>
                            </tr>
                        )}
                    </tbody>;
                } else {
                    body = <tbody>
                        <tr>
                            <td colSpan="99" className="text-center">No data to display</td>
                        </tr>
                    </tbody>;
                }
            }
            return (
                <div className="container-fluid">
                    <form className="clearfix position-relative" autoComplete="off">
                        <Loader value={isLoaded} />
                        <div className="content-title flex-hr mb-0 title-description">
                            <h3 className="title-has-control mt-2">Retro Claim Request History</h3>
                        </div>
                        <hr className="mt-0 mb-1" />
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-4">Card Number </label>
                                            <div className="col-sm-8">: {cardnumber} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4">Name on Ticket </label>
                                            <div className="col-sm-8">: {ticketname} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4">Airline </label>
                                            <div className="col-sm-8">: {operatingairline} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4">Flight Number </label>
                                            <div className="col-sm-8">: {operatingfltnumber} </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-4">Route </label>
                                            <div className="col-sm-8">: {origin} - {destination} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4">Subclass </label>
                                            <div className="col-sm-8">: {operatingbookingsubclass} </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4">Request Date </label>
                                            <div className="col-sm-8">: {requestdate} </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="member-section mt-4">
                            <label className="main-label mb-1">Request History</label>
                            <table className="table table-bordered table-striped table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>No</th>
                                        <th>Request Info</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Action by</th>
                                    </tr>
                                </thead>
                                {body}
                            </table>
                        </div>
                    </form>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;