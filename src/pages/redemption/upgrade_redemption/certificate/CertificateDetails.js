import React, { Component } from 'react';
import moment from 'moment';
import { formatNumber } from '../../../../utilities/Helpers';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificateid: '',
            awardcode: '',
            awardtype: '',
            totalprice: 0,
            issueddate: '',
            freeaward: '',
            bookingcode: '',
            status: '',
            numbercertificate: '',
            ticketvaliditydate: '',
            ticketnumber: ''
        };
    }

    componentWillReceiveProps(props) {
        const { certificateid, awardcode, awardtype, totalprice, issueddate, freeaward, bookingcode, status, numbercertificate, ticketvaliditydate, ticketnumber } = props.data;
        this.setState({ certificateid, awardcode, awardtype, totalprice, issueddate, freeaward, bookingcode, status, numbercertificate, ticketvaliditydate, ticketnumber });
    }

    render() {
        const { certificateid, awardcode, awardtype, totalprice, issueddate, freeaward, bookingcode, status, numbercertificate, ticketvaliditydate, ticketnumber } = this.state;
        return (
            <div className="card" key={numbercertificate}>
                <div className="card-body">
                    <h4 className="mt-2">Certificate Details</h4>
                    <hr className="mt-1" />
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="certificate-view">Cerficate ID </label>
                                <div className="col-sm-9" htmlFor="certificatevalue-view"> {certificateid}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="awardcode-view">Award Code </label>
                                <div className="col-sm-9" htmlFor="awardcodevalue-view">{awardcode} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="awardtype-view">Award Type </label>
                                <div className="col-sm-9" htmlFor="awardtypevalue-view"> {awardtype}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="totalprice-view">Total Price </label>
                                <div className="col-sm-9" htmlFor="totalpricevalue-view">{formatNumber(totalprice)} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="ticketnumber-view">Ticket Number </label>
                                <div className="col-sm-9" htmlFor="ticketnumbervalue-view">{ticketnumber} </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="issueddate-view">Issued Date </label>
                                <div className="col-sm-9" htmlFor="issueddatevalue-view"> {issueddate}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="freeaward-view">Free Award </label>
                                <div className="col-sm-9" htmlFor="freeawardvalue-view">{(freeaward) ? "Yes" : "No"} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="bookingcode-view">Booking Code </label>
                                <div className="col-sm-9" htmlFor="bookingcodevalue-view"> {bookingcode}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="totalprice-view">Status </label>
                                <div className="col-sm-9" htmlFor="totalpricevalue-view">{status} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="ticketvaliditydate-view">Ticket Validity Date </label>
                                <div className="col-sm-9" htmlFor="ticketvaliditydatevalue-view">{moment(ticketvaliditydate).format("DD/MM/YYYY")} </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;