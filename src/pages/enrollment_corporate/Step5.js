import React, { Component } from 'react';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

export default class Step5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardnumber: props.enrollmentcorporate.response.membercard.cardnumber,
            corporatecode: props.enrollmentcorporate.response.membercorporatedetail.corporatecode,
            corporatename: props.enrollmentcorporate.response.membercorporatedetail.corporatename,
            loading: false
        };
    }

    render() {
        const { cardnumber, corporatename, corporatecode, loading } = this.state;
        return (
            <div className="member-enroll">
                <form className="clearfix position-relative">
                    <Loader value={loading} />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h3 className="title-has-control mt-2">Summary</h3>
                            </div>
                            <hr className="mt-0" />
                            <div className="row">
                                <div className="col">
                                    <div className="row">
                                        <label className="col-sm-3 col-form-label">Card Number </label>
                                        <label className="col-sm-9 col-form-label">: {cardnumber} </label>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-3 col-form-label">Corporate Code </label>
                                        <label className="col-sm-9 col-form-label">: {corporatecode} </label>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-3 col-form-label">Corporate Name </label>
                                        <label className="col-sm-9 col-form-label">: {corporatename} </label>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-sm-12">
                                            <Link to="/member-corporate" title="Member Corporate" className="btn btn-outline-dark btn-sm">Member Corporate List</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}