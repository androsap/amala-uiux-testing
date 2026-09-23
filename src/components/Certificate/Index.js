import React, { Component } from 'react';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import { ErrorGeneral } from '../../components/Base/BaseComponent';
import { jsUcfirst } from '../../utilities/Helpers';
import moment from 'moment';
import CertificateAir from './Air/Index';
import CertificateVoucher from './Voucher/Index';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            certificatedetails: {},
            passengerdetails: {},
            activitydetails: {},
            voucher: [],
            promodetails: {},
            redeemusers: [],
            categorycode: null
        };
    }

    getDetail = (certificateid) => {
        let url = api.url.redemptioncertificate.detail;
        let data = { certificateid };
        //call loader
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                const { awardcode, awardname, awardtypename, categorycode, issueddate, freeaward, bookingcode, redeemairactivity, redeemvoucherdetail, voucherimage, redeemusers, returnstatus, ticketnumber, ticketvaliditydate, redeemuser } = result;
                const { approvalby, requestid } = redeemuser[0] || [];

                let certificatedetails = {};
                certificatedetails['certificateid'] = redeemusers['certificateid'];
                certificatedetails['awardcode'] = (awardcode !== undefined) ? awardcode : '-';
                certificatedetails['awardname'] = (awardname !== undefined) ? awardname : '-';
                certificatedetails['awardtype'] = (awardtypename !== undefined) ? awardtypename : '-';
                certificatedetails['totalprice'] = (redeemusers.certificateprice !== undefined) ? redeemusers.certificateprice : '-';
                certificatedetails['paymentprice'] = (redeemusers.paymentprice !== undefined) ? redeemusers.paymentprice : '-';
                certificatedetails['paymentcurrency'] = (redeemusers.paymentcurrency !== undefined) ? redeemusers.paymentcurrency : '-';
                certificatedetails['cashprice'] = (redeemusers.cashprice !== undefined) ? redeemusers.cashprice : '-';
                certificatedetails['cashcurrency'] = (redeemusers.cashcurrency !== undefined) ? redeemusers.cashcurrency : '-';
                certificatedetails['issueddate'] = (issueddate !== undefined) ? moment(issueddate).format("DD/MM/YYYY") : '-';
                certificatedetails['freeaward'] = freeaward;
                certificatedetails['bookingcode'] = bookingcode;
                certificatedetails['status'] = (redeemusers['status'] !== undefined) ? jsUcfirst(redeemusers['status'], "_") : '-';
                certificatedetails['paidticketnumber'] = ticketnumber;
                certificatedetails['ticketvaliditydate'] = (ticketvaliditydate !== undefined) ? moment(ticketvaliditydate).format("DD/MM/YYYY") : null;
                certificatedetails['ticketofficeuser'] = (redeemusers.ticketofficeuser !== undefined) ? redeemusers.ticketofficeuser : '-';
                certificatedetails['approvalby'] = approvalby;
                certificatedetails['requestid'] = requestid;

                let passengerdetails = {};
                passengerdetails['salutation'] = (redeemusers['salutationcode']) ? redeemusers['salutationcode'] : '-';
                passengerdetails['name'] = (redeemusers['name'] !== undefined) ? redeemusers['name'] : '-';
                passengerdetails['familyname'] = (redeemusers['familyname'] !== undefined) ? redeemusers['familyname'] : '-';
                passengerdetails['memberid'] = (redeemusers['memberiduser']) ? redeemusers['memberiduser'] : '-';
                passengerdetails['travelertype'] = (redeemusers['travelertype'] !== undefined) ? redeemusers['travelertype'] : '-';
                passengerdetails['selfusage'] = (redeemusers['selfusage'] !== undefined) ? redeemusers['selfusage'] : '-';

                //define promodetails for Nonair
                let promodetails = {};
                promodetails['promocode'] = (redeemusers['promocode'] !== undefined) ? redeemusers['promocode'] : null;
                promodetails['promoname'] = (redeemusers['promoname'] !== undefined) ? redeemusers['promoname'] : '-';
                promodetails['discountamount'] = (redeemusers['discountamount'] !== undefined) ? redeemusers['discountamount'] : '-';
                promodetails['certificateprice'] = (redeemusers['certificateprice'] !== undefined) ? redeemusers['certificateprice'] : '-';

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
                /* set ticket number */
                certificatedetails['ticketnumber'] = (activitydeparture.ticketnumber) ? activitydeparture.ticketnumber : null;

                let activitydetails = {};
                activitydetails['flightdeparture'] = activitydeparture;
                activitydetails['flightdeparture']['origin'] = activitydeparture.origin;
                activitydetails['flightdeparture']['destination'] = activitydeparture.destination;
                activitydetails['flightdeparture']['airlinecode'] = activitydeparture.airline;
                activitydetails['flightdeparture']['flightnumber'] = activitydeparture.flightnumber;
                activitydetails['flightdeparture']['compartment'] = activitydeparture.compartment;
                activitydetails['flightdeparture']['bookingclass'] = activitydeparture.bookingclass;
                activitydetails['flightdeparture']['promocode'] = (activitydeparture.promocode) ? activitydeparture.promocode : null;
                activitydetails['flightdeparture']['discountamount'] = (activitydeparture.discountamount) ? activitydeparture.discountamount : null;
                activitydetails['flightdeparture']['promoname'] = (activitydeparture.promoname) ? activitydeparture.promoname : null;
                activitydetails['flightdeparture']['price'] = (activitydeparture.price) ? activitydeparture.price : '-';
                activitydetails['flightdeparture']['activitydate'] = (activitydeparture.activitydate) ? activitydeparture.activitydate : '-';

                activitydetails['flightreturn'] = activityreturn;
                activitydetails['flightreturn']['origin'] = (activityreturn.origin) ? activityreturn.origin : '-';
                activitydetails['flightreturn']['destination'] = (activityreturn.destination) ? activityreturn.destination : '-';
                activitydetails['flightreturn']['airlinecode'] = (activityreturn.airline) ? activityreturn.airline : '-';
                activitydetails['flightreturn']['flightnumber'] = (activityreturn.flightnumber) ? activityreturn.flightnumber : '-';
                activitydetails['flightreturn']['compartment'] = (activityreturn.compartment) ? activityreturn.compartment : '-';
                activitydetails['flightreturn']['bookingclass'] = (activityreturn.bookingclass) ? activityreturn.bookingclass : '-';
                activitydetails['flightreturn']['promocode'] = (activityreturn.promocode) ? activityreturn.promocode : null;
                activitydetails['flightreturn']['promoname'] = (activityreturn.promoname) ? activityreturn.promoname : null;
                activitydetails['flightreturn']['discountamount'] = (activityreturn.discountamount) ? activityreturn.discountamount : null;
                activitydetails['flightreturn']['price'] = (activityreturn.price) ? activityreturn.price : '-';
                activitydetails['flightreturn']['activitydate'] = (activityreturn.activitydate) ? activityreturn.activitydate : '-';
                activitydetails['roundtrip'] = returnstatus;

                let vouchertext = [];
                for (const field in redeemvoucherdetail) {
                    if (vouchertext[redeemvoucherdetail[field].certificateid] === undefined) {
                        vouchertext[redeemvoucherdetail[field].certificateid] = [];
                    }
                    vouchertext[redeemvoucherdetail[field].certificateid].push(redeemvoucherdetail[field]);
                }

                let voucher = {};
                voucher['urltemplate'] = voucherimage;
                voucher['certificateid'] = (redeemusers['certificateid'] !== undefined) ? redeemusers['certificateid'] : '';
                voucher['voucher'] = vouchertext[redeemusers['certificateid']];

                this.setState({ categorycode, certificatedetails, passengerdetails, activitydetails, voucher, promodetails });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    componentDidMount() {
        let certificateid = this.props.certificateid;
        this.getDetail(certificateid);
    }

    render() {
        const { formrender, categorycode, certificatedetails, passengerdetails, activitydetails, voucher, promodetails } = this.state;
        const { source } = this.props || {};

        if (formrender) {
            return (
                (categorycode === 'FREEFLIGHT' || categorycode === 'UPGRADE') ?
                    <CertificateAir {...this.props} categorycode={categorycode} certificatedetails={certificatedetails} passengerdetails={passengerdetails} activitydetails={activitydetails} voucher={voucher} source={source} />
                    : (categorycode === 'VOUCHER' || categorycode === 'HOTEL' || categorycode === 'TRANSFER') ? <CertificateVoucher {...this.props} certificatedetails={certificatedetails} passengerdetails={passengerdetails} activitydetails={activitydetails} voucher={voucher} promodetails={promodetails} /> : null
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

export default Layout;