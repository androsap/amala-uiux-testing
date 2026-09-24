import React from 'react';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            certificateid: props.certificateid,
            certificatedetail: props.certificatedetail
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            certificateid: props.certificateid,
            certificatedetail: props.certificatedetail
        });
    }

    render() {
        const { certificatedetail, certificateid } = this.state;

        return (
            <div className="member-section">
                <label className="main-label mt-4">Certificate Details</label>
                <div className="card mt-2 mb-2">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label className="col-sm-4">Certificate ID </label>
                                    <div className="col-sm-8"> {certificateid} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Award Code </label>
                                    <div className="col-sm-8"> {certificatedetail.awardcode} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Award Type </label>
                                    <div className="col-sm-8"> {certificatedetail.awardtype} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Certificate Price </label>
                                    <div className="col-sm-8"> {certificatedetail.certificateprice} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Status </label>
                                    <div className="col-sm-8"> {certificatedetail.status} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Ticket Number </label>
                                    <div className="col-sm-8"> {certificatedetail.ticketnumber} </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group row">
                                    <label className="col-sm-4">Issued Date </label>
                                    <div className="col-sm-8"> {certificatedetail.issueddate} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Validity Date </label>
                                    <div className="col-sm-8"> {certificatedetail.validitydate} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Free Award </label>
                                    <div className="col-sm-8"> {certificatedetail.freeaward} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Booking Code </label>
                                    <div className="col-sm-8"> {certificatedetail.bookingcode} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Self Usage </label>
                                    <div className="col-sm-8"> {certificatedetail.selfusage} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4">Ticket Validity Date </label>
                                    <div className="col-sm-8"> {certificatedetail.ticketvaliditydate} </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}


export default Layout;