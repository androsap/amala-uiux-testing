import React, { Component } from 'react';
import moment from 'moment';
import Loader from '../../../../components/Loader';
import Certificate from '../certificate/Index';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentWillMount() {
        const { redeemuser, awardcode, awardtypename, issueddate, freeaward, totalprice, ticketnumber, ticketvaliditydate, bookingcode, redeemairactivity, redeemvoucherdetail, voucherimage } = this.props.updatecertificate.responseupdateaward;

        let certificatedetails = {};
        certificatedetails['certificateid'] = redeemuser['certificateid'];
        certificatedetails['awardcode'] = (awardcode !== undefined) ? awardcode : '-';
        certificatedetails['awardtype'] = (awardtypename !== undefined) ? awardtypename : '-';
        certificatedetails['totalprice'] = (totalprice !== undefined) ? totalprice : '-';
        certificatedetails['issueddate'] = (issueddate !== undefined) ? moment(issueddate).format("DD/MM/YYYY") : '-';
        certificatedetails['freeaward'] = (freeaward) ? 'Yes' : 'No';
        certificatedetails['bookingcode'] = (bookingcode) ? bookingcode : '-';
        certificatedetails['status'] = (redeemuser['status'] !== undefined) ? redeemuser['status'] : '-';
        certificatedetails['certificateprice'] = (redeemuser['certificateprice'] !== undefined) ? redeemuser['certificateprice'] : '-';;
        certificatedetails['ticketnumber'] = ticketnumber ? ticketnumber : '-';
        certificatedetails['ticketvaliditydate'] = ticketvaliditydate ? moment(ticketvaliditydate).format('DD/MM/YYYY') : '-';

        let passengerdetails = {};
        passengerdetails['salutation'] = (redeemuser['salutationcode'] !== undefined) ? redeemuser['salutationcode'] : '-';
        passengerdetails['name'] = (redeemuser['name'] !== undefined) ? redeemuser['name'] : '-';
        passengerdetails['familyname'] = (redeemuser['familyname'] !== undefined) ? redeemuser['familyname'] : '-';
        passengerdetails['memberid'] = (redeemuser['memberiduser']) ? redeemuser['memberiduser'] : '-';
        passengerdetails['travelertype'] = (redeemuser['travelertype'] !== undefined) ? redeemuser['travelertype'] : '-';
        passengerdetails['selfusage'] = (redeemuser['selfusage'] !== undefined) ? redeemuser['selfusage'] : '-';

        //define redeemairactivity
        let activitydeparture = null;
        let activityreturn = null;
        for (const field in redeemairactivity) {
            if (redeemairactivity[field]['type'].toUpperCase() === 'DEPARTURE' && redeemuser['certificateid'] === redeemairactivity[field]['certificateid']) {
                activitydeparture = redeemairactivity[field];
            }

            if (redeemairactivity[field]['type'].toUpperCase() === 'RETURN' && redeemuser['certificateid'] === redeemairactivity[field]['certificateid']) {
                activityreturn = redeemairactivity[field];
            }
        }

        let activitydetails = null;
        if (activitydeparture) {
            activitydetails = {};
            activitydetails['flightdeparture'] = {};
            activitydetails['flightdeparture']['origin'] = (activitydeparture.origin) ? activitydeparture.origin : null;
            activitydetails['flightdeparture']['destination'] = (activitydeparture.destination) ? activitydeparture.destination : null;
            activitydetails['flightdeparture']['airlinecode'] = (activitydeparture.airline) ? activitydeparture.airline : null;
            activitydetails['flightdeparture']['flightnumber'] = (activitydeparture.flightnumber) ? activitydeparture.flightnumber : null;
            activitydetails['flightdeparture']['activitydate'] = (activitydeparture.activitydate) ? activitydeparture.activitydate : '-';

            activitydetails['flightreturn'] = {};
            activitydetails['flightreturn']['origin'] = (activityreturn !== null && activityreturn.origin) ? activityreturn.origin : '-';
            activitydetails['flightreturn']['destination'] = (activityreturn !== null && activityreturn.destination) ? activityreturn.destination : '-';
            activitydetails['flightreturn']['airlinecode'] = (activityreturn !== null && activityreturn.airline) ? activityreturn.airline : '-';
            activitydetails['flightreturn']['flightnumber'] = (activityreturn !== null && activityreturn.flightnumber) ? activityreturn.flightnumber : '-';
            activitydetails['flightreturn']['activitydate'] = (activityreturn !== null && activityreturn.activitydate) ? activityreturn.activitydate : '-';
            activitydetails['isreturn'] = activityreturn;
        }
        let vouchertext = [];
        for (const field in redeemvoucherdetail) {
            if (vouchertext[redeemvoucherdetail[field].certificateid] === undefined) {
                vouchertext[redeemvoucherdetail[field].certificateid] = [];
            }
            vouchertext[redeemvoucherdetail[field].certificateid].push(redeemvoucherdetail[field]);
        }

        let voucher = {};
        voucher['urltemplate'] = voucherimage;
        voucher['certificateid'] = (redeemuser['certificateid'] !== undefined) ? redeemuser['certificateid'] : '';
        voucher['voucher'] = vouchertext[redeemuser['certificateid']];

        this.setState({ certificatedetails, passengerdetails, activitydetails, voucher });
    }

    handleBack = () => {
        this.props.jumpStepTo(0);
    }

    render() {
        const { loading, certificatedetails, passengerdetails, activitydetails, voucher } = this.state;

        return (
            <div className="container-fluid">
                <div className="content-title flex-hr mb-0 title-description">
                    <h1 className="title-has-control mt-3">View Member Certificate</h1>
                </div>
                <hr className="mt-0" />
                <div className="row">
                    <div className="col-sm-12">
                        <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                            <Loader value={loading} />
                            <Certificate certificatedetails={certificatedetails} passengerdetails={passengerdetails} activitydetails={activitydetails} voucher={voucher} />
                        </form>
                    </div>
                    <div className="col-sm-12 text-center mt-4 mb-4">
                        <button onClick={() => (this.handleBack())} title="Back To Home" className="btn btn-primary">Back To Home</button>
                    </div>
                </div>
                <div className="row">
                </div>
            </div>
        )
    }
}


export default Layout;
