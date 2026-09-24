import React, { Component } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Loader from '../../../components/Loader';
import { Link } from 'react-router-dom';
// import { redeemusers, redeemvoucherdetail } from '../responsedata/freeflight';
import moment from 'moment';

import Certificate from './certificate/Index';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redeemusers: [],
            redeemairactivity: {
                departure: {},
                return: {}
            },
            voucherimage: '',
            redeemvoucherdetail: [],
            canvassourcevoucher: [],
            cardnumber: null
        }
    }

    componentWillMount() {
        const { redeemvoucherdetail, redeemairactivity, redeemusers, voucherimage, totalprice, issueddate, freeaward, bookingcode, awardcode, awardtypename, ticketnumber, ticketvaliditydate } = this.props.redemption.responsebuyaward;
        let vouchertext = [];
        for (const field in redeemvoucherdetail) {
            if (vouchertext[redeemvoucherdetail[field].certificateid] === undefined) {
                vouchertext[redeemvoucherdetail[field].certificateid] = [];
            }
            vouchertext[redeemvoucherdetail[field].certificateid].push(redeemvoucherdetail[field]);
        }

        //define redeemairactivity
        let activitydeparture = {};
        let activityreturn = {};
        for (const field in redeemairactivity) {
            if (redeemairactivity[field]['type'].toUpperCase() === 'DEPARTURE') {
                activitydeparture = redeemairactivity[field];
            } else {
                activityreturn = redeemairactivity[field];
            }
        }

        //define user
        let redeemUserFinal = [];
        for (const field in redeemusers) {
            redeemUserFinal[field] = [];
            redeemUserFinal[field]['certificatedetails'] = {};
            redeemUserFinal[field]['certificatedetails']['certificateid'] = redeemusers[field]['certificateid'];
            redeemUserFinal[field]['certificatedetails']['awardcode'] = (awardcode !== undefined) ? awardcode : '-';
            redeemUserFinal[field]['certificatedetails']['awardtype'] = (awardtypename !== undefined) ? awardtypename : '-';
            redeemUserFinal[field]['certificatedetails']['totalprice'] = (totalprice !== undefined) ? totalprice : '-';
            redeemUserFinal[field]['certificatedetails']['issueddate'] = (issueddate !== undefined) ? moment(issueddate).format("DD/MM/YYYY") : '-';
            redeemUserFinal[field]['certificatedetails']['freeaward'] = freeaward;
            redeemUserFinal[field]['certificatedetails']['bookingcode'] = bookingcode;
            redeemUserFinal[field]['certificatedetails']['ticketnumber'] = ticketnumber;
            redeemUserFinal[field]['certificatedetails']['ticketvaliditydate'] = ticketvaliditydate;
            redeemUserFinal[field]['certificatedetails']['status'] = (redeemusers[field]['status'] !== undefined) ? redeemusers[field]['status'] : '-';


            redeemUserFinal[field]['passengerdetails'] = {};
            redeemUserFinal[field]['passengerdetails']['salutation'] = (redeemusers[field]['salutationcode']) ? redeemusers[field]['salutationcode'] : '-';
            redeemUserFinal[field]['passengerdetails']['name'] = (redeemusers[field]['name'] !== undefined) ? redeemusers[field]['name'] : '-';
            redeemUserFinal[field]['passengerdetails']['familyname'] = (redeemusers[field]['familyname'] !== undefined) ? redeemusers[field]['familyname'] : '-';
            redeemUserFinal[field]['passengerdetails']['memberid'] = (redeemusers[field]['memberiduser']) ? redeemusers[field]['memberiduser'] : '-';
            redeemUserFinal[field]['passengerdetails']['travelertype'] = (redeemusers[field]['travelertype'] !== undefined) ? redeemusers[field]['travelertype'] : '-';
            redeemUserFinal[field]['passengerdetails']['selfusage'] = (redeemusers[field]['selfusage'] !== undefined) ? redeemusers[field]['selfusage'] : '-';


            redeemUserFinal[field]['activitydetails'] = {};
            redeemUserFinal[field]['activitydetails']['flightdeparture'] = {};
            redeemUserFinal[field]['activitydetails']['flightdeparture']['origin'] = activitydeparture.origin;
            redeemUserFinal[field]['activitydetails']['flightdeparture']['destination'] = activitydeparture.destination;
            redeemUserFinal[field]['activitydetails']['flightdeparture']['airlinecode'] = activitydeparture.airline;
            redeemUserFinal[field]['activitydetails']['flightdeparture']['flightnumber'] = activitydeparture.flightnumber;
            redeemUserFinal[field]['activitydetails']['flightdeparture']['activitydate'] = (activitydeparture.activitydate) ? activitydeparture.activitydate : '-';

            redeemUserFinal[field]['activitydetails']['flightreturn'] = {};
            redeemUserFinal[field]['activitydetails']['flightreturn']['origin'] = (activityreturn.origin) ? activityreturn.origin : '-';
            redeemUserFinal[field]['activitydetails']['flightreturn']['destination'] = (activityreturn.destination) ? activityreturn.destination : '-';
            redeemUserFinal[field]['activitydetails']['flightreturn']['airlinecode'] = (activityreturn.airline) ? activityreturn.airline : '-';
            redeemUserFinal[field]['activitydetails']['flightreturn']['flightnumber'] = (activityreturn.flightnumber) ? activityreturn.flightnumber : '-';
            redeemUserFinal[field]['activitydetails']['flightreturn']['activitydate'] = (activityreturn.activitydate) ? activityreturn.activitydate : '-';
            redeemUserFinal[field]['activitydetails']['isreturn'] = this.props.redemption.responsebuyaward.return;

            redeemUserFinal[field]['voucher'] = {};
            redeemUserFinal[field]['voucher']['urltemplate'] = voucherimage;
            redeemUserFinal[field]['voucher']['certificateid'] = (redeemusers[field]['certificateid'] !== undefined) ? redeemusers[field]['certificateid'] : '-';
            redeemUserFinal[field]['voucher']['voucher'] = vouchertext[redeemusers[field]['certificateid']];
        }

        let cardnumber = (this.props.redemption.responsebuyaward.cardnumber !== undefined) ? this.props.redemption.responsebuyaward.cardnumber : '-';

        this.setState({
            redeemusers: redeemUserFinal,
            voucherimage,
            redeemvoucherdetail: vouchertext,
            canvassourcevoucher: [],
            cardnumber
        })
    }

    render() {
        const { loading, redeemusers, cardnumber } = this.state;

        let certificatelist = [];
        let certificatedetails = {};
        let passengerdetails = {};
        let activitydetails = {};
        let voucher = [];
        let numbercertificate = 1;
        for (const field in redeemusers) {
            certificatedetails = redeemusers[field].certificatedetails;
            passengerdetails = redeemusers[field].passengerdetails;
            activitydetails = redeemusers[field].activitydetails;
            voucher = redeemusers[field].voucher;
            certificatelist[field] = <Certificate key={field} numbercertificate={numbercertificate} certificatedetails={certificatedetails} passengerdetails={passengerdetails} activitydetails={activitydetails} voucher={voucher} />
            numbercertificate++;
        }
        return (
            <div className="container-fluid">
                <Breadcrumb path="Data Management / Redemption" />
                <div className="content-title flex-hr mb-1 title-description">
                    <h1 className="title-has-control mt-2">View All Certificate</h1>
                </div>
                <hr className="mt-0" />
                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                    <Loader value={loading} />
                    {certificatelist}
                </form>
                <div className="row mt-4">
                    <div className="col-sm-12 text-center">
                        <Link to={"/redemption/" + cardnumber} className="btn btn-primary"> Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Layout;