import React, { Component } from 'react';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificateid: '',
            awardcode: '',
            awardtype: '',
            issueddate: '',
            freeaward: '',
            bookingcode: '',
            status: '',
            numbercertificate: '',
            certificateprice: '',
            ticketnumber: '',
            ticketvaliditydate: ''
        };
    }

    componentWillReceiveProps(props) {
        const { certificateid, awardcode, awardtype, issueddate, freeaward, bookingcode, status, numbercertificate, certificateprice, ticketnumber, ticketvaliditydate } = props.data;
        this.setState({ certificateid, awardcode, awardtype, issueddate, freeaward, bookingcode, status, numbercertificate, certificateprice, ticketnumber, ticketvaliditydate });
    }

    render() {
        const { certificateid, awardcode, awardtype, issueddate, freeaward, bookingcode, status, numbercertificate, certificateprice, ticketnumber, ticketvaliditydate } = this.state;
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
                                <label className="col-sm-3">Certificate Price </label>
                                <div className="col-sm-9"> {certificateprice} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3">Ticket Number </label>
                                <div className="col-sm-9"> {ticketnumber} </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="issueddate-view">Issued Date </label>
                                <div className="col-sm-9" htmlFor="issueddatevalue-view"> {issueddate}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="freeaward-view">Free Award </label>
                                <div className="col-sm-9" htmlFor="freeawardvalue-view">{freeaward} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="bookingcode-view">Booking Code </label>
                                <div className="col-sm-9" htmlFor="bookingcodevalue-view"> {bookingcode}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3">Status </label>
                                <div className="col-sm-9"> {status} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3">Ticket Validity Date </label>
                                <div className="col-sm-9"> {ticketvaliditydate} </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;