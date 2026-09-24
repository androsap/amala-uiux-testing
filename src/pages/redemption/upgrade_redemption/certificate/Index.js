import React, { Component } from 'react';

import CeritificateDetails from './CertificateDetails';
import PassengerDetails from './PassengerDetails';
import ActivityDetails from './ActivityDetails';
import Voucher from './Voucher';


class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificatedetails: {},
            passengerdetails: {},
            activitydetails: {},
            voucher: [],
            numbercertificate: null
        };
    }

    componentDidMount() {
        this.setState({
            certificatedetails: this.props.certificatedetails,
            passengerdetails: this.props.passengerdetails,
            activitydetails: this.props.activitydetails,
            voucher: this.props.voucher,
            numbercertificate: this.props.numbercertificate
        })
    }

    render() {
        const { certificatedetails, passengerdetails, activitydetails, voucher, numbercertificate } = this.state;

        return (<div className="main-panel mt-3">
            <div className="content-title flex-hr mb-0 title-description">
                <h3 className="title-has-control mt-2">Cetificate {numbercertificate}</h3>
            </div>
            <hr className="mt-1" />
            <CeritificateDetails data={certificatedetails} numbercertificate={numbercertificate}/>
            <PassengerDetails data={passengerdetails} numbercertificate={numbercertificate}/>
            <ActivityDetails data={activitydetails} numbercertificate={numbercertificate}/>
            <Voucher data={voucher} numbercertificate={numbercertificate}/>
        </div>
        )
    }
}

export default Layout;