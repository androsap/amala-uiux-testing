import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest, DetailRequest } from '../../../../../../utilities/RequestService';
import { api } from '../../../../../../config/Services';
import { connect } from "react-redux";
import { getProfile } from '../../../../../../utilities/AuthService';
import { SalutationSelect, Button, Alert, SelectBase, SwitchButton, InputText } from '../../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, List, Card, Affix, Tooltip, Modal, Statistic } from 'antd';
import { formatNumber } from '../../../../../../utilities/Helpers';
import { TravelerType } from '../../../../../../data';
import moment from 'moment';

import TicketNumber from '../../../TicketNumber';
import ConfirmationPage from '../../Confirmation';
import SaveForm from '../../../../../my_approval/Confirmation';

const { Title, Text } = Typography;
const { warning } = Modal;
const { Countdown } = Statistic;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fieldvalue: {
                updateunit: null,
                updatefee: null,
                awardtypename: null,
                summaryDepartureFlight: {},
                summaryReturnFlight: {}
            },
            fielddisabled: {
                comparmentfielddisabled: true
            },
            requestSearchFlight: {},
            flightDeparture: [],
            flightReturn: [],
            selectFlightDeparture: null,
            selectFlightReturn: null,
            mileageDeparture: 0,
            mileageReturn: 0,
            totalMileage: 0,
            isSuccessBuy: false,
            responseBuyAward: {},
            newcertificateid: null,
            visible: false,
            standarfee: true,
            showConfirmation: false,
            totalafterdiscountdepr: null,
            totalafterdiscountretr: null,
            showsave: false,
            typeButton: null
        }
    }

    async componentDidMount() {
        const { location, fromApproval, result } = this.props;
        const { state } = location;
        const { activitydetails, activitydepartureselected, activityreturnselected } = state;
        const { roundtrip } = activitydetails;
        const { flightdeparture, flightreturn } = activitydetails
        let promocodedepr = flightdeparture ? flightdeparture.promocode ? flightdeparture.promocode : null : null;
        let promocoderetr = flightreturn ? flightreturn.promocode ? flightreturn.promocode : null : null;
        /*Variable props */
        let deprpromocode = flightdeparture ? flightdeparture.promocode : null
        let discountamountdepr = flightdeparture ? flightdeparture.discountamount : null
        let deprprice = flightdeparture ? flightdeparture.price : null
        let retrpromocode = flightreturn ? flightreturn.promocode : null
        let discountamountretr = flightreturn ? flightreturn.discountamount : null
        let retrprice = flightreturn ? flightreturn.price : null
        this.setState({ deprpromocode, discountamountdepr, deprprice, retrpromocode, discountamountretr, retrprice });

        setTimeout(() => {
            if (!roundtrip && promocodedepr && activitydepartureselected) {
                this.getpromo('DEPARTURE');
            } else if (roundtrip && promocoderetr && promocodedepr && activitydepartureselected && activityreturnselected) {
                this.getpromo('DEPARTURE');
                this.getpromo('RETURN');
            } else if (roundtrip && promocoderetr && !promocodedepr && activityreturnselected) {
                this.getpromo('RETURN')
            } else if (roundtrip && !promocoderetr && promocodedepr && activitydepartureselected) {
                this.getpromo('DEPARTURE')
            } else if (roundtrip && promocoderetr && promocodedepr && activitydepartureselected) {
                this.getpromo('DEPARTURE')
            } else if (roundtrip && promocoderetr && promocodedepr && activityreturnselected) {
                this.getpromo('RETURN')
            }
        }, 1000)
        document.title = "Redemption Freeflight | Loyalty Management System";

        let memberid = this.props.match.params.ID;
        if (state === undefined) {
            this.props.history.push(`/member/form/${memberid}certificateotp/`);
        } else {
            const { priceList, requestSearchFlight, activitydepartureselected, activityreturnselected, activitydetails, certificatedetails } = state;
            const { departuredate, returndate } = requestSearchFlight;
            const { awardpricingby } = certificatedetails;

            /*Set Field Disabled */
            let { awardcode, ticketnumber, ticketvaliditydate, redeemusers, redeemuser } = fromApproval ? result.reqdatas : certificatedetails;
            const { selfusage, salutationcode, name, familyname, memberiduser, travelertype } = redeemusers || redeemuser;
            let memberid = memberiduser;
            ticketvaliditydate = (ticketvaliditydate) ? moment(ticketvaliditydate) : undefined;


            let flightnumberdeparture = (!activitydepartureselected && activitydetails.flightdeparture && activitydetails.flightdeparture.flightnumber) ? activitydetails.flightdeparture.flightnumber : undefined;
            let flightnumberreturn = (!activityreturnselected && activitydetails.flightreturn && activitydetails.flightreturn.flightnumber) ? activitydetails.flightreturn.flightnumber : undefined;
            let standarfee = this.state.standarfee;
            this.props.form.setFieldsValue({ standarfee, flightnumberdeparture, flightnumberreturn, ticketnumber, ticketvaliditydate, selfusage, salutationcode, name, familyname, memberid, travelertype });

            /* Get Price List */
            let flightDeparture = [];
            let flightReturn = [];
            let selectFlightDeparture = 0;
            let selectFlightReturn = 0;
            /* Update Departure Activity */
            if (activitydepartureselected && !activityreturnselected) {
                const { airlinecode, bookingclasscode, compartmentcode, origin, destination, price, peakseasonstatus } = activitydetails.flightdeparture;
                selectFlightReturn = 0;
                flightDeparture = (awardpricingby === 'MANUAL') ? [{ price, airlinecode, bookingclasscode, compartmentcode, origin, destination, peakseasonstatus, flightdate: departuredate }] : priceList.departure;
                if (!fromApproval) {
                    flightReturn[0] = activitydetails.flightreturn;
                    flightReturn[0]['flightdate'] = (activitydetails.flightreturn && activitydetails.flightreturn.activitydate) ? activitydetails.flightreturn.activitydate : null;
                }
            }
            /* Update Return Activity */
            else if (!activitydepartureselected && activityreturnselected) {
                const { airlinecode, bookingclasscode, compartmentcode, origin, destination, price, peakseasonstatus } = activitydetails.flightreturn;
                selectFlightDeparture = 0;
                flightReturn = (awardpricingby === 'MANUAL') ? [{ price, airlinecode, bookingclasscode, compartmentcode, origin, destination, peakseasonstatus, flightdate: departuredate }] : priceList.departure;
                if (!fromApproval) {
                    flightDeparture[0] = activitydetails.flightdeparture;
                    flightDeparture[0]['flightdate'] = (activitydetails.flightdeparture && activitydetails.flightdeparture.activitydate) ? activitydetails.flightdeparture.activitydate : null;
                }
            }
            /* Update Departure and Return Activity */
            else if (activitydepartureselected && activityreturnselected) {
                const { flightdeparture, flightreturn } = activitydetails;

                flightDeparture = (awardpricingby !== 'MANUAL') ? priceList.departure :
                    [{ peakseasonstatus: flightdeparture.peakseasonstatus, price: flightdeparture.price, airlinecode: flightdeparture.airlinecode, bookingclasscode: flightdeparture.bookingclasscode, compartmentcode: flightdeparture.compartmentcode, origin: flightdeparture.origin, destination: flightdeparture.destination, flightdate: departuredate }];
                flightReturn = (awardpricingby !== 'MANUAL') ? priceList.return :
                    [{ peakseasonstatus: flightreturn.peakseasonstatus, price: flightreturn.price, airlinecode: flightreturn.airlinecode, bookingclasscode: flightreturn.bookingclasscode, compartmentcode: flightreturn.compartmentcode, origin: flightreturn.origin, destination: flightreturn.destination, flightdate: returndate }];
            }

            await this.setState({ flightDeparture, flightReturn });
            if (fromApproval && result.reqdatas.updatetype === 'DEPARTURE') {
                await this.calculateTotalMileage('DEPARTURE', 0);
            } else if (fromApproval && result.reqdatas.updatetype === 'RETURN') {
                await this.calculateTotalMileage('RETURN', 0);
            } else {
                await this.calculateTotalMileage('DEPARTURE', 0);
                await this.calculateTotalMileage('RETURN', 0);
            }
            await this.getFee(awardcode, standarfee);
            await this.setState({ requestSearchFlight, selectFlightDeparture, selectFlightReturn });
        }
        this.props.retrieveSession();
    }

    getFee(awardcode, standarfee) {
        let url = api.url.awardmaster.retrievecancelupdate;
        let data = { awardcode };
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            const { result } = response;
            if (responsecode.substring(0, 1) === '0' && result) {
                const { updateunit, updatefee, awardtypename } = result;

                this.setState({
                    fieldvalue: { ...this.state.fieldvalue, updateunit, updatefee, awardtypename },
                    isLoading: false
                }, () => this.calculationFee(standarfee));
            } else {
                Alert.error(responsemessage);
            }
        });
    }

    saveAction = (e, callbackexpiration) => {
        e.preventDefault();
        const callback = (input, callbackexpiration) => {
            this.setState({ isLoading: true });
            const { flightDeparture, selectFlightDeparture, flightReturn, selectFlightReturn, totalafterdiscountdepr, totalafterdiscountretr, summaryafterdiscountdepr, summaryafterdiscountretr, mileageDeparture, mileageReturn, typeButton } = this.state;
            const { fromApproval, result } = this.props;
            const { reqdata, reqdatas, createdBy, createdDate, isdataactive, requestid, referenceid, requesttype, requeststatus, approvalby, approvaldate } = result || {};
            const { state } = this.props.location;
            const { certificatedetails, memberprofile, activitydetails, activitydepartureselected, activityreturnselected, requestSearchFlight, categorycode } = state;
            const { adultpassenger } = requestSearchFlight;
            const { awardcode, freeaward, certificateid, redeemusers, status } = certificatedetails || {};
            const { tierid, membershipid } = memberprofile || {};
            const { roundtrip } = activitydetails;
            let issueddate = moment().format("YYYY-MM-DD");
            let totalprice = (totalafterdiscountdepr !== null && totalafterdiscountretr == null) ? ((totalafterdiscountdepr + mileageReturn) * adultpassenger) :
                (totalafterdiscountretr !== null && totalafterdiscountdepr == null) ? ((totalafterdiscountretr + mileageDeparture) * adultpassenger) :
                    (totalafterdiscountdepr !== null && totalafterdiscountretr !== null) ? ((totalafterdiscountdepr + totalafterdiscountretr) * adultpassenger) :
                        (totalafterdiscountdepr == null && totalafterdiscountretr == null) ? ((mileageDeparture + mileageReturn) * adultpassenger) : null;

            let quantity = null;
            let memberid = this.props.match.params.ID;
            let username = getProfile().username;
            let bookingcode = (input.bookingcode) ? input.bookingcode : null;
            let ticketnumber = (input.ticketnumber) ? input.ticketnumber : null;
            let standarfee = (input.standarfee) ? input.standarfee : false;
            let fee = (input.fee) ? input.fee : 0;
            let ticketvaliditydate = (input.ticketvaliditydate) ? moment(input.ticketvaliditydate).format("YYYY-MM-DD") : null;

            /* Redeem activity to be replaced */
            let updatetype = null;
            let redeemairactivityid = [];
            if (roundtrip) {
                redeemairactivityid.push(activitydetails.flightdeparture.redeemairactivityid);
                redeemairactivityid.push(activitydetails.flightreturn.redeemairactivityid);
            } else {
                redeemairactivityid.push(activitydetails.flightdeparture.redeemairactivityid);
            }
            if (activitydepartureselected && activityreturnselected) {
                updatetype = 'ALL';
            } else if (activitydepartureselected && !activityreturnselected) {
                updatetype = 'DEPARTURE';
            } else if (!activitydepartureselected && activityreturnselected) {
                updatetype = 'RETURN';
            }

            /* Redeem User */
            let redeemuser = {};
            redeemuser.name = fromApproval ? ((reqdatas.redeemuser.name) ? reqdatas.redeemuser.name : null) : ((redeemusers.name) ? redeemusers.name : null);
            redeemuser.familyname = fromApproval ? ((reqdatas.redeemuser.familyname) ? reqdatas.redeemuser.familyname : null) : ((redeemusers.familyname) ? redeemusers.familyname : null);
            redeemuser.salutationcode = fromApproval ? ((reqdatas.redeemuser.salutationcode) ? reqdatas.redeemuser.salutationcode : null) : ((redeemusers.salutationcode) ? redeemusers.salutationcode : null);
            redeemuser.memberiduser = fromApproval ? ((reqdatas.redeemuser.memberiduser) ? reqdatas.redeemuser.memberiduser : null) : ((redeemusers.memberiduser) ? redeemusers.memberiduser : null);
            redeemuser.travelertype = fromApproval ? ((reqdatas.redeemuser.travelertype) ? reqdatas.redeemuser.travelertype : null) : ((redeemusers.travelertype) ? redeemusers.travelertype : null);
            redeemuser.selfusage = fromApproval ? ((reqdatas.redeemuser.selfusage) ? reqdatas.redeemuser.selfusage : false) : ((redeemusers.selfusage) ? redeemusers.selfusage : false);
            let certificateprices =
                (totalafterdiscountdepr !== null && totalafterdiscountretr == null) ? (totalafterdiscountdepr + mileageReturn) :
                    (totalafterdiscountretr !== null && totalafterdiscountdepr == null) ? (totalafterdiscountretr + mileageDeparture) :
                        (totalafterdiscountdepr !== null && totalafterdiscountretr !== null) ? (totalafterdiscountdepr + totalafterdiscountretr) :
                            (totalafterdiscountdepr == null && totalafterdiscountretr == null) ? (mileageDeparture + mileageReturn) : null
            redeemuser.certificateprice = certificateprices;

            let pricedepr = (selectFlightDeparture !== null) ? (summaryafterdiscountdepr === null || summaryafterdiscountdepr === undefined) ? mileageDeparture : totalafterdiscountdepr : mileageDeparture;
            /* REDEEM ACTIVITY */
            let redeemairactivity = [];
            let departureActivity = flightDeparture[selectFlightDeparture];
            departureActivity = {
                type: 'departure',
                price: pricedepr,
                activitydate: departureActivity.flightdate,
                airline: departureActivity.airlinecode,
                origin: departureActivity.origin,
                destination: departureActivity.destination,
                feeder: false,
                flightnumber: (input.flightnumberdeparture !== undefined) ? input.flightnumberdeparture : null,
                compartment: departureActivity.compartmentcode,
                bookingclass: departureActivity.bookingclasscode,
                peakseasonstatus: departureActivity.peakseasonstatus,
                paidcompartmentcode: null,
                paidbookingclasscode: null,
                bookingtype: "INTERNET"
            }

            redeemairactivity.push(departureActivity);

            let returnActivity = null;
            let priceretr = (selectFlightReturn !== null) ? (summaryafterdiscountretr === null || summaryafterdiscountretr === undefined) ? mileageReturn : totalafterdiscountretr : mileageReturn;
            if (roundtrip) {
                returnActivity = flightReturn[selectFlightReturn];
                returnActivity = {
                    type: 'return',
                    price: priceretr,
                    activitydate: returnActivity.flightdate,
                    airline: returnActivity.airlinecode,
                    origin: returnActivity.origin,
                    destination: returnActivity.destination,
                    feeder: false,
                    flightnumber: (input.flightnumberreturn !== undefined) ? input.flightnumberreturn : null,
                    compartment: returnActivity.compartmentcode,
                    bookingclass: returnActivity.bookingclasscode,
                    peakseasonstatus: returnActivity.peakseasonstatus,
                    paidcompartmentcode: null,
                    paidbookingclasscode: null,
                    bookingtype: "INTERNET"
                }
                redeemairactivity.push(returnActivity);
            };

            let url = fromApproval ? api.url.requestapproval.update : (typeButton === 'UPDATE') ? api.url.redemption.updateaward : api.url.requestapproval.create;
            let data = fromApproval ? {
                reqdata, createdBy, createdDate, isdataactive, requestid, referenceid, memberid: reqdatas.memberid, requesttype, requeststatus, approvalby, approvaldate, remark: input.remark ? input.remark : null, reqdatas: {
                    status: reqdatas.status,
                    url: 'redemption/transaction/v1.2/buyaward', awardcode: reqdatas.awardcode, issueddate, quantity: reqdatas.quantity, memberid: reqdatas.memberid, username, bookingcode, ticketvaliditydate, ticketnumber, freeaward: reqdatas.freeaward, return: reqdatas.return,
                    tierid: reqdatas.tierid, membershipid: reqdatas.membershipid, updatetype, certificateid: reqdatas.certificateid, redeemairactivityid: reqdatas.redeemairactivityid, redeemuser, redeemairactivity, standarfee, fee, categorycode: reqdatas.categorycode, totalprice
                }
            } : (typeButton === 'UPDATE') ? {
                awardcode, issueddate, quantity, memberid, username, bookingcode, ticketvaliditydate, ticketnumber, freeaward,
                return: roundtrip, totalprice, tierid, membershipid, updatetype, certificateid, redeemairactivityid, redeemuser, redeemairactivity, standarfee, fee
            } : {
                referenceid: null, memberid: memberid, requesttype: "UPDATE", requeststatus: "NEW", approvalby: null, approvaldate: null, remark: null, reqdatas: {
                    status,
                    url: 'redemption/transaction/v1.2/update', awardcode, issueddate, quantity, memberid, username, bookingcode, ticketvaliditydate, ticketnumber, categorycode,
                    freeaward, return: roundtrip, totalprice, tierid, membershipid, updatetype, certificateid, redeemairactivityid, redeemuser: redeemuser, redeemairactivity, standarfee, fee
                }
            };

            SaveRequest(url, data).then((response) => {
                const { status = {}, result } = response || {};
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    Alert.success((responsemessage) ? responsemessage : 'New data has been created');
                    if (fromApproval) {
                        this.props.history.push('/my-approval');
                    } else {
                        const { redeemuser } = result;
                        this.props.refreshHeader();

                        if (typeButton === 'UPDATE') {
                            this.setState({ isSuccessBuy: true, newcertificateid: redeemuser.certificateid });
                        } else {
                            this.props.history.push(`/member/form/${memberid}certificateotp`);
                        }
                    }
                } else {
                    Alert.error(responsemessage);
                }
                this.setState({ isLoading: false });
            })
        }

        this.props.form.validateFieldsAndScroll((err, input) => { if (!err) callback(input, callbackexpiration) });
    };

    showConfirmation = (typeButton) => {
        const { location } = this.props;
        const { state } = location;
        const { activitydetails, activitydepartureselected, activityreturnselected } = state;
        const { roundtrip } = activitydetails;
        const { flightDeparture, flightReturn, selectFlightDeparture, selectFlightReturn, promocodedepr, promocoderetr } = this.state;
        if (!roundtrip && promocodedepr && activitydepartureselected) {
            this.getpromoConfirm('DEPARTURE');
        } else if (roundtrip && promocoderetr && promocodedepr && activitydepartureselected && activityreturnselected) {
            this.getpromoConfirm('DEPARTURE');
            this.getpromoConfirm('RETURN');
        } else if (roundtrip && promocoderetr && !promocodedepr && activityreturnselected) {
            this.getpromoConfirm('RETURN')
        } else if (roundtrip && !promocoderetr && promocodedepr && activitydepartureselected) {
            this.getpromoConfirm('DEPARTURE')
        } else if (roundtrip && promocoderetr && promocodedepr && activitydepartureselected) {
            this.getpromoConfirm('DEPARTURE')
        } else if (roundtrip && promocoderetr && promocodedepr && activityreturnselected) {
            this.getpromoConfirm('RETURN')
        }
        /* get summary flight */
        let summaryDepartureFlight = (flightDeparture[selectFlightDeparture]) ? flightDeparture[selectFlightDeparture] : {};
        let summaryReturnFlight = (flightReturn && flightReturn[selectFlightReturn]) ? flightReturn[selectFlightReturn] : {};

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                summaryDepartureFlight.flightnumber = (input.flightnumberdeparture) ? input.flightnumberdeparture : null;
                summaryReturnFlight.flightnumber = (input.flightnumberreturn) ? input.flightnumberreturn : null;

                const fieldvalue = { ...this.state.fieldvalue, summaryDepartureFlight, summaryReturnFlight };
                this.setState({ showConfirmation: true, fieldvalue, typeButton });
            }
        });
    }

    handleAirlineChange = (airlinecode) => {
        let compartmentcode = undefined;
        let comparmentfielddisabled = (airlinecode) ? false : true;
        if (airlinecode) {
            this.componentCompartmentSelect.retrieveData({ airlinecode });
        }
        this.props.form.setFieldsValue({ compartmentcode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, comparmentfielddisabled } });
    }

    handleSelectFlight = (event, type = '', key) => {
        event.preventDefault();

        this.calculateTotalMileage(type, key);
    }

    calculateTotalMileage = (type = '', key) => {
        const { flightDeparture, flightReturn } = this.state;
        const { location } = this.props;
        const { state } = location;
        const { activitydetails } = state;
        const { roundtrip } = activitydetails;
        let totalMileage = 0;

        if (type === 'DEPARTURE') {
            let mileageDeparture = (flightDeparture[key]['price']) ? flightDeparture[key]['price'] : 0;
            totalMileage = mileageDeparture;
            if (roundtrip) { totalMileage = mileageDeparture + this.state.mileageReturn; }
            this.setState({ ...this.state, selectFlightDeparture: key, mileageDeparture, totalMileage });
        } else if (type === 'RETURN') {
            let mileageDeparture = this.state.mileageDeparture;
            let mileageReturn = (flightReturn[key]['price']) ? flightReturn[key]['price'] : 0;
            totalMileage = mileageDeparture + mileageReturn;
            /* Jika voucher status departure telah redeem, maka tidak masuk dalam hitungan total mileage */
            this.setState({ ...this.state, selectFlightReturn: key, mileageReturn, totalMileage });
        }
    }

    handleStandardFee = (value) => {
        this.calculationFee(value);
    }

    calculationFee(standarfee) {
        const { fieldvalue } = this.state;
        const { location, fromApproval, result } = this.props;
        const { state } = location;
        const { activitydepartureselected, activityreturnselected, activitydetails, certificatedetails } = state;
        const { redeemusers } = certificatedetails || {};
        const { certificateprice } = fromApproval ? result.reqdatas.redeemuser : redeemusers;
        const { flightdeparture, flightreturn } = activitydetails;
        let { updateunit, updatefee } = fieldvalue;

        /*CALCULATION FEE*/
        let fee = undefined;
        if (standarfee && updateunit === 'PERCENTAGE') {
            /*if update departure flight, fee base price departure flight*/
            if (activitydepartureselected && !activityreturnselected) {
                fee = Math.ceil(flightdeparture.price * updatefee / 100);
            }
            /*if update departure flight, fee base price departure flight*/
            else if (!activitydepartureselected && activityreturnselected) {
                fee = Math.ceil(flightreturn.price * updatefee / 100);
            } else {
                fee = Math.ceil(certificateprice * updatefee / 100);
            }
        } else if (standarfee && updateunit === 'MILEAGE') {
            fee = updatefee;
        }

        this.props.form.setFieldsValue({ fee });
    }

    handleCancel = () => {
        this.setState({ visible: false, showConfirmation: false, showsave: false });
    }

    handleShowNewCertificate = () => {
        this.setState({ isSuccessBuy: true });
    }

    getpromo = (type) => {
        const { flightDeparture, flightReturn } = this.state
        const { location, cardnumber } = this.props;
        const { state } = location;
        const { certificatedetails, activitydetails, requestSearchFlight, priceList } = state;
        const { routetype, departure } = priceList;
        const { awardcode, redeemusers } = certificatedetails;
        const { awardcategory } = redeemusers;
        const { flightdeparture, flightreturn } = activitydetails;
        const { promocode, flightnumber, bookingclass, compartment, origin, destination, airlinecode } = (type === 'DEPARTURE') ? flightdeparture : flightreturn;
        const { adultpassenger } = requestSearchFlight;
        let activitydatedepr = (flightDeparture && flightDeparture[0]) ? flightDeparture[0].flightdate : null;
        let activitydateretr = (flightReturn && flightReturn[0]) ? flightReturn[0].flightdate : null;
        let price = departure[0].price;
        let url = api.url.redeempromo.getpromo;
        let data = {
            "promocode": promocode,
            "promotype": awardcategory,
            "cardnumber": cardnumber,
            "channel": "amalabo",
            "awardcode": awardcode,
            "total": price,
            "airactivity": {
                "flightnumber": flightnumber,
                "airlinecode": airlinecode,
                "bookingclass": bookingclass,
                "compartment": compartment,
                "routetype": routetype,
                "odairport": `${origin},${destination}`,
                "oairport": origin,
                "dairport": destination,
                "activitydate": (type === 'DEPARTURE') ? activitydatedepr : activitydateretr,
                "passenger": adultpassenger
            }
        };


        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === "0000") {
                var key = 0;
                if (type === 'DEPARTURE') {
                    var promoDataDepr = [];
                    for (const field in result) {
                        promoDataDepr[key] = {};
                        promoDataDepr[key]['discount'] = result[field].discount;
                        promoDataDepr[key]['promocode'] = result[field].promocode;
                        promoDataDepr[key]['catalogname'] = result[field].catalogname;
                        promoDataDepr[key]['discounttype'] = result[field].discounttype;
                        promoDataDepr[key]['totaldiscount'] = result[field].totaldiscount;
                        promoDataDepr[key]['summarydiscount'] = result[field].summarydiscount;
                        promoDataDepr[key]['totalafterdiscount'] = result[field].totalafterdiscount;
                        promoDataDepr[key]['summaryafterdiscount'] = result[field].summaryafterdiscount;
                        key++;
                    }
                    this.setState({
                        promoDataDepr,
                        discountdepr: promoDataDepr[0].discount,
                        promocodedepr: promoDataDepr[0].promocode,
                        discounttypedepr: promoDataDepr[0].discounttype,
                        totaldiscountdepr: promoDataDepr[0].totaldiscount,
                        summarydiscountdepr: promoDataDepr[0].summarydiscount,
                        totalafterdiscountdepr: promoDataDepr[0].totalafterdiscount,
                        summaryafterdiscountdepr: promoDataDepr[0].summaryafterdiscount,
                        responsemessage
                    });

                } else if (type === 'RETURN') {
                    var promoDataRetr = [];
                    for (const field in result) {
                        promoDataRetr[key] = {};
                        promoDataRetr[key]['discount'] = result[field].discount;
                        promoDataRetr[key]['promocode'] = result[field].promocode;
                        promoDataRetr[key]['catalogname'] = result[field].catalogname;
                        promoDataRetr[key]['discounttype'] = result[field].discounttype;
                        promoDataRetr[key]['totaldiscount'] = result[field].totaldiscount;
                        promoDataRetr[key]['summarydiscount'] = result[field].summarydiscount;
                        promoDataRetr[key]['totalafterdiscount'] = result[field].totalafterdiscount;
                        promoDataRetr[key]['summaryafterdiscount'] = result[field].summaryafterdiscount;
                        key++;
                    }
                    this.setState({
                        promoDataRetr,
                        discountretr: promoDataRetr[0].discount,
                        promocoderetr: promoDataRetr[0].promocode,
                        discounttyperetr: promoDataRetr[0].discounttype,
                        totaldiscountretr: promoDataRetr[0].totaldiscount,
                        summarydiscountretr: promoDataRetr[0].summarydiscount,
                        totalafterdiscountretr: promoDataRetr[0].totalafterdiscount,
                        summaryafterdiscountretr: promoDataRetr[0].summaryafterdiscount,
                        responsemessage
                    });
                }

            } else {
                if (type === 'DEPARTURE' && responsecode === '9003') {
                    warning({ title: 'Departure Promo Unavailable, Normal Price Will Be Charged.' })
                    this.handleCancelPromo('DEPARTURE')
                } else {
                    if (type === 'RETURN' && responsecode === '9003') {
                        warning({ title: 'Return Promo Unavailable, Normal Price Will Be Charged.' })
                        this.handleCancelPromo('RETURN')
                    }
                }
            }
            this.setState({ isLoading: false });
        });
    }

    getpromoConfirm = (type) => {
        const { location, cardnumber } = this.props;
        const { state } = location;
        const { flightDeparture, flightReturn } = this.state;
        const { certificatedetails, activitydetails, requestSearchFlight, priceList } = state;
        const { routetype, departure } = priceList;
        const { awardcode, redeemusers } = certificatedetails;
        const { awardcategory } = redeemusers;
        const { flightdeparture, flightreturn } = activitydetails;
        const { promocode, bookingclass, compartment, origin, destination, airlinecode } = (type === 'DEPARTURE') ? flightdeparture : (type === 'RETURN') ? flightreturn : {};
        const { adultpassenger } = requestSearchFlight;
        let flightnumber = (type === 'DEPARTURE') ? this.props.form.getFieldValue('flightnumberdeparture') : (type === 'RETURN') ? this.props.form.getFieldValue('flightnumberreturn') : null
        let price = departure[0].price;
        let url = api.url.redeempromo.getpromo;
        let data = {
            "promocode": promocode,
            "promotype": awardcategory,
            "cardnumber": cardnumber,
            "channel": "amalabo",
            "awardcode": awardcode,
            "total": price,
            "airactivity": {
                "flightnumber": flightnumber,
                "airlinecode": airlinecode,
                "bookingclass": bookingclass,
                "compartment": compartment,
                "routetype": routetype,
                "odairport": `${origin},${destination}`,
                "oairport": origin,
                "dairport": destination,
                "activitydate": (type === 'DEPARTURE') ? flightDeparture[0].flightdate : flightReturn[0].flightdate,
                "passenger": adultpassenger
            }
        };

        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === "0000") {
                var key = 0;
                if (type === 'DEPARTURE') {
                    var promoDataDepr = [];
                    for (const field in result) {
                        promoDataDepr[key] = {};
                        promoDataDepr[key]['discount'] = result[field].discount;
                        promoDataDepr[key]['promocode'] = result[field].promocode;
                        promoDataDepr[key]['catalogname'] = result[field].catalogname;
                        promoDataDepr[key]['discounttype'] = result[field].discounttype;
                        promoDataDepr[key]['totaldiscount'] = result[field].totaldiscount;
                        promoDataDepr[key]['summarydiscount'] = result[field].summarydiscount;
                        promoDataDepr[key]['totalafterdiscount'] = result[field].totalafterdiscount;
                        promoDataDepr[key]['summaryafterdiscount'] = result[field].summaryafterdiscount;
                        key++;
                    }
                    this.setState({
                        promoDataDepr,
                        discountdepr: promoDataDepr[0].discount,
                        promocodedepr: promoDataDepr[0].promocode,
                        discounttypedepr: promoDataDepr[0].discounttype,
                        totaldiscountdepr: promoDataDepr[0].totaldiscount,
                        summarydiscountdepr: promoDataDepr[0].summarydiscount,
                        totalafterdiscountdepr: promoDataDepr[0].totalafterdiscount,
                        summaryafterdiscountdepr: promoDataDepr[0].summaryafterdiscount,
                        responsemessage
                    });

                } else if (type === 'RETURN') {
                    var promoDataRetr = [];
                    for (const field in result) {
                        promoDataRetr[key] = {};
                        promoDataRetr[key]['discount'] = result[field].discount;
                        promoDataRetr[key]['promocode'] = result[field].promocode;
                        promoDataRetr[key]['catalogname'] = result[field].catalogname;
                        promoDataRetr[key]['discounttype'] = result[field].discounttype;
                        promoDataRetr[key]['totaldiscount'] = result[field].totaldiscount;
                        promoDataRetr[key]['summarydiscount'] = result[field].summarydiscount;
                        promoDataRetr[key]['totalafterdiscount'] = result[field].totalafterdiscount;
                        promoDataRetr[key]['summaryafterdiscount'] = result[field].summaryafterdiscount;
                        key++;
                    }
                    this.setState({
                        promoDataRetr,
                        discountretr: promoDataRetr[0].discount,
                        promocoderetr: promoDataRetr[0].promocode,
                        discounttyperetr: promoDataRetr[0].discounttype,
                        totaldiscountretr: promoDataRetr[0].totaldiscount,
                        summarydiscountretr: promoDataRetr[0].summarydiscount,
                        totalafterdiscountretr: promoDataRetr[0].totalafterdiscount,
                        summaryafterdiscountretr: promoDataRetr[0].summaryafterdiscount,
                        responsemessage
                    });
                }

            } else {
                if (type === 'DEPARTURE' && responsecode === '9003') {
                    warning({ title: 'Departure Promo Unavailable, Normal Price Will Be Charged.' })
                    this.handleCancelPromo('DEPARTURE')
                } else {
                    if (type === 'RETURN' && responsecode === '9003') {
                        warning({ title: 'Return Promo Unavailable, Normal Price Will Be Charged.' })
                        this.handleCancelPromo('RETURN')
                    }
                }
            }
            this.setState({ isLoading: false });
        });
    }


    handleFlightNumber = (flightnumber, typeflight) => {
        if (typeflight === "DEPARTURE") {
            this.props.form.setFieldsValue({ flightnumberdeparture: flightnumber });
        } else {
            this.props.form.setFieldsValue({ flightnumberreturn: flightnumber });
        }
    }

    handleCancelPromo = (type) => {
        const { promocodedepr, promocoderetr } = this.state;
        if (type === 'DEPARTURE' && promocodedepr !== null) {
            this.setState({ promocodedepr: null, summarydiscountdepr: null, summaryafterdiscountdepr: null, totalafterdiscountdepr: null, discountdepr: null, totaldiscountdepr: null, deprpromocode: null, discountamountdepr: null, deprprice: null });
        } else if (type === 'RETURN' && promocoderetr !== null) {
            this.setState({ promocoderetr: null, summarydiscountretr: null, summaryafterdiscountretr: null, totalafterdiscountretr: null, discountretr: null, totaldiscountretr: null, retrpromocode: null, discountamountretr: null, retrprice: null });
        } else if (type === 'BOTH' && promocodedepr !== null && promocoderetr !== null) {
            this.setState({
                promocodedepr: null, summarydiscountdepr: null, summaryafterdiscountdepr: null, totalafterdiscountdepr: null, discountdepr: null, totaldiscountdepr: null, deprpromocode: null, discountamountdepr: null, deprprice: null,
                promocoderetr: null, summarydiscountretr: null, summaryafterdiscountretr: null, totalafterdiscountretr: null, discountretr: null, totaldiscountretr: null, retrpromocode: null, discountamountretr: null, retrprice: null
            });
        }
    }

    showSave = () => { this.setState({ showsave: true }) }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isLoading, flightDeparture, flightReturn, selectFlightDeparture, selectFlightReturn, requestSearchFlight, mileageDeparture, mileageReturn, isSuccessBuy, newcertificateid,
            deprpromocode, discountamountdepr, deprprice, retrpromocode, discountamountretr, retrprice, typeButton, discountdepr, totaldiscountdepr, totalafterdiscountdepr, promocodedepr,
            discounttypedepr, discountretr, totaldiscountretr, totalafterdiscountretr, promocoderetr, discounttyperetr, fieldvalue, showConfirmation, visible, showsave } = this.state;
        const { adultpassenger } = requestSearchFlight;

        const { location, fromApproval, result, permission, validate, countdown } = this.props;
        const { state } = location;
        const { usermenu } = permission;
        const { certificatedetails, activitydetails, activitydepartureselected, activityreturnselected } = state;
        const { roundtrip } = fromApproval ? result.reqdatas.return : activitydetails;
        const { flightnumberdeparture, flightnumberreturn } = activitydetails;
        const { awardcode, awardtype, partnername, certificateid } = fromApproval ? result.reqdatas : certificatedetails;

        let summaryDepartureFlight = (flightDeparture[selectFlightDeparture]) ? flightDeparture[selectFlightDeparture] : {};
        let summaryReturnFlight = (flightReturn && flightReturn[selectFlightReturn]) ? flightReturn[selectFlightReturn] : {};
        let passengerList = [];
        let standarfee = this.props.form.getFieldValue('standarfee');
        let fee = this.props.form.getFieldValue('fee');

        if (validate) {
            if (adultpassenger > 1) {
                for (let key = 0; key < adultpassenger - 1; key++) {
                    passengerList[key] = <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                        <Divider>Passenger #{key + 2}</Divider>
                        <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Card Number" datafield={"passenger-memberid" + key} validationrules={['pattern.number']} maxLength={16} />
                        <SalutationSelect wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Salutation" datafield={"passenger-salutationcode" + key} />
                        <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Name" datafield={"passenger-name" + key} validationrules={['required', 'pattern.letterspace']} maxLength={45} />
                        <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Family Name" datafield={"passenger-familyname" + key} validationrules={['pattern.letter']} maxLength={45} />
                        <SelectBase wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Traveler Type" datafield={"passenger-travelertype" + key} validationrules={['required']} options={TravelerType} />
                    </Col>;
                }
            }

            let memberid = this.props.match.params.ID;
            if (isSuccessBuy) {
                return (<Redirect to={{ pathname: `/member/form/${memberid}certificateotp/view/${newcertificateid}` }} />)
            } else {
                return (
                    <Row>
                        {
                            (showConfirmation) ? <ConfirmationPage isLoading={isLoading} certificateid={certificateid} memberid={memberid} departureFlight={fieldvalue.summaryDepartureFlight} returnFligth={fieldvalue.summaryReturnFlight} roundtrip={roundtrip} visible={showConfirmation} handleClose={this.handleCancel}
                                onSubmit={this.saveAction} handleShowNewCertificate={this.handleShowNewCertificate} location={location} mileageDeparture={mileageDeparture} mileageReturn={mileageReturn} discountamountdepr={discountamountdepr} discountamountretr={discountamountretr} typeButton={typeButton} /> : null
                        }
                        <TicketNumber visible={visible} handleCancel={this.handleCancel} />
                        <Row>
                            {fromApproval ? <Col xs={24} xl={20}></Col> :
                                <><Col xs={24} xl={20}>
                                    <Title level={4}><Button url={`/member/form/${memberid}certificateotp`} shape="circle" icon="left" /> Certificate Update</Title>
                                    <Divider />
                                </Col></>
                            }
                            <Col xs={24} xl={3} >
                                <p level={4} style={{ fontSize: '16px', textAlign: "right", color: 'black' }}>OTP Time Limit:&nbsp;</p>
                            </Col>
                            <Col xs={24} xl={1}>
                                <Countdown valueStyle={{ fontSize: '16px' }} value={countdown} format="mm:ss" onFinish={this.props.retrieveFinish} />
                            </Col>
                        </Row>

                        <Modal visible={showsave} footer={null} onCancel={this.handleCancel} destroyOnClose={true} width={400}>
                            <SaveForm {...this.props} onOk={this.saveAction} onClose={this.handleCancel} />
                        </Modal>

                        <Spin spinning={isLoading}>
                            <Form {...formItemLayout}>
                                <Row>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={16} xl={16}>
                                        <Row>
                                            <Divider>Flight Information</Divider>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Divider>Departure Flight</Divider>
                                                <Row className="pricelist-flight-header">
                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>Activity Date</Col>
                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>Airline</Col>
                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>Origin - Destination</Col>
                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>Compartment /<br />Booking Class</Col>
                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>Price</Col>
                                                </Row>
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={flightDeparture}
                                                    renderItem={(item, key) => (
                                                        <Row className="pricelist-flight">
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(item.flightdate) ? moment(item.flightdate).format("DD/MM/YYYY") : '-'}</Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(item.airlinecode) ? item.airlinecode : '-'}</Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(item.origin) ? item.origin : '-'} - {(item.destination) ? item.destination : '-'}</Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                {(item.compartmentcode) ? item.compartmentcode : '-'}&nbsp;/&nbsp;
                                                                {(item.bookingclasscode) ? item.bookingclasscode : '-'}
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(totalafterdiscountdepr) ? formatNumber(totalafterdiscountdepr) : (item.price) ? formatNumber(item.price) : '-'}</Col>
                                                            {
                                                                (item.status === 'VOUCHER_REDEEM') ?
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        <Text strong style={{ color: '#34A853' }}>Redeemed</Text>
                                                                    </Col> : null
                                                            }
                                                        </Row>
                                                    )}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            (roundtrip && selectFlightDeparture !== null) ?
                                                <Row>
                                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                        <Divider>Return Flight</Divider>
                                                        <Row className="pricelist-flight-header">
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>Activity Date</Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>Airline</Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>Origin - Destination</Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>Compartment /<br />Booking Class</Col>
                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>Price</Col>
                                                        </Row>
                                                        <List
                                                            itemLayout="horizontal"
                                                            dataSource={flightReturn}
                                                            renderItem={(item, key) => (
                                                                <Row className="pricelist-flight">
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(item.flightdate) ? moment(item.flightdate).format("DD/MM/YYYY") : '-'}</Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(item.airlinecode) ? item.airlinecode : '-'}</Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>{(item.origin) ? item.origin : '-'} - {(item.destination) ? item.destination : '-'}</Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        {(item.compartmentcode) ? item.compartmentcode : '-'}&nbsp;/&nbsp;
                                                                        {(item.bookingclasscode) ? item.bookingclasscode : '-'}
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        {(totalafterdiscountretr) ? formatNumber(totalafterdiscountretr) : (item.price) ? formatNumber(item.price) : '-'}
                                                                    </Col>
                                                                    {
                                                                        (item.status === 'VOUCHER_REDEEM') ?
                                                                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                                <Text strong style={{ color: '#34A853' }}>Redeemed</Text>
                                                                            </Col> : null
                                                                    }
                                                                </Row>
                                                            )}
                                                        />
                                                    </Col>
                                                </Row>
                                                : null
                                        }
                                        <Row className={((!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? '' : 'hidden'}>
                                            <Divider>Flight Schedule Completion</Divider>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 21, offset: 2 }} xl={{ span: 21, offset: 2 }}>
                                                <Form.Item label="Depature Flight">
                                                    <span className="ant-form-text">
                                                        {summaryDepartureFlight.airlinecode} /  {summaryDepartureFlight.origin} - {summaryDepartureFlight.destination} / {summaryDepartureFlight.compartmentcode} / {summaryDepartureFlight.bookingclasscode}
                                                    </span>
                                                </Form.Item>
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Departure Flight Number" datafield="flightnumberdeparture" validationrules={['required', 'pattern.number']} maxLength={4} disabled={!activitydepartureselected} onChange={() => this.handleFlightNumber(flightnumberdeparture, "DEPARTURE")} />
                                                {
                                                    (roundtrip) ?
                                                        <span>
                                                            <Form.Item label="Return Flight">
                                                                <span className="ant-form-text">
                                                                    {summaryReturnFlight.airlinecode} / {summaryReturnFlight.origin} - {summaryReturnFlight.destination} / {summaryReturnFlight.compartmentcode} / {summaryReturnFlight.bookingclasscode}
                                                                </span>
                                                            </Form.Item>
                                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Return Flight Number" datafield="flightnumberreturn" validationrules={['required', 'pattern.number']} maxLength={4} disabled={!activityreturnselected} onChange={() => this.handleFlightNumber(flightnumberreturn, "RETURN")} />
                                                        </span>
                                                        : null
                                                }
                                            </Col>
                                        </Row>
                                        <Row className={((!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? '' : 'hidden'}>
                                            <Divider>Passenger Data</Divider>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                                <Divider>Passenger #1</Divider>
                                                <SwitchButton wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Self Usage" datafield="selfusage" disabled={true} />
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Card Number" datafield="memberid" disabled={true} validationrules={['pattern.number']} maxLength={16} />
                                                <SalutationSelect wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} ref={(e) => { this.componentSalutationSelect = e }} form={this.props.form} labeltext="Salutation" datafield="salutationcode" disabled={true} />
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Name" datafield="name" validationrules={['required', 'pattern.letterspace']} maxLength={45} disabled={true} />
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Family Name" datafield="familyname" validationrules={['pattern.letter']} maxLength={45} disabled={true} />
                                                <SelectBase wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Traveler Type" datafield="travelertype" validationrules={['required']} options={TravelerType} disabled={true} />
                                            </Col>
                                            {passengerList}
                                        </Row>
                                        <Row className={((!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? '' : 'hidden'}>
                                            <Divider>Booking Completion</Divider>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                                <Form.Item label="Issued Date">
                                                    <span className="ant-form-text">{moment().format("DD MMMM YYYY")}</span>
                                                </Form.Item>
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Booking Code" datafield="bookingcode" validationrules={['required', 'pattern.alphanumeric']} maxLength={6} />
                                                <SwitchButton wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Standar Fee" datafield="standarfee" onChange={this.handleStandardFee} disabled={true} />
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Fee" datafield="fee" className={(standarfee) ? 'hidden' : ''} validationrules={['required', 'pattern.number']} maxLength={6} disabled={standarfee} />
                                                {
                                                    (standarfee) ?
                                                        <Form.Item label="Fee">
                                                            <span className="ant-form-text">{fee}</span>
                                                        </Form.Item> : null
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8} style={{ padding: '0 10px' }}>
                                        <Affix offsetTop={0}>
                                            <div>
                                                <Card title="Award Information" bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)' }} bodyStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                                                    <Row>
                                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>Award Code</Col>
                                                        <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                            <Tooltip title={(awardcode) ? awardcode : '-'}>
                                                                {(awardcode) ?
                                                                    (awardcode.length > 12) ? awardcode.substring(0, 12) + '...' : awardcode
                                                                    : '-'}
                                                            </Tooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: '5px' }}>
                                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>Award Type</Col>
                                                        <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>{(awardtype) ? awardtype : fieldvalue.awardtypename ? fieldvalue.awardtypename : '-'}</Col>
                                                    </Row>
                                                    <Row style={{ marginTop: '5px' }}>
                                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>Partner</Col>
                                                        <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>{(partnername) ? partnername : summaryDepartureFlight.airlinecode ? summaryDepartureFlight.airlinecode : '-'}</Col>
                                                    </Row>
                                                </Card>

                                                <Card title="Price Details" bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginTop: '10px' }} bodyStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>

                                                    <Row>
                                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                            <Text strong style={{ display: 'block' }}> Departure Flight </Text>
                                                            <Text style={{ display: 'block' }}> {moment(summaryDepartureFlight.flightdate).format("DD MMMM YYYY")} &nbsp;{(summaryDepartureFlight.peakseasonstatus) ? <Text type="warning">Peak Season Period</Text> : null} </Text>
                                                            <Text style={{ display: 'block' }}>
                                                                {
                                                                    (selectFlightDeparture !== null) ?
                                                                        summaryDepartureFlight.origin + " - " + summaryDepartureFlight.destination
                                                                        + " / " + summaryDepartureFlight.airlinecode + " / " + summaryDepartureFlight.compartmentcode + " / " + summaryDepartureFlight.bookingclasscode : "-"
                                                                }
                                                            </Text>
                                                            <Text style={{ display: 'block', marginLeft: 30 }}>
                                                                {
                                                                    (mileageDeparture && activitydepartureselected) ? `@${formatNumber(mileageDeparture)} x ${adultpassenger}` : (mileageDeparture && !activitydepartureselected) ? `@${formatNumber(discountamountdepr + deprprice)} x ${adultpassenger}` : " "
                                                                }
                                                            </Text>
                                                            <Text style={{ display: 'block' }}>
                                                                {
                                                                    (promocodedepr) ? `Promo ${promocodedepr}` :
                                                                        (deprpromocode) ? `Promo ${deprpromocode}` : " "
                                                                }
                                                            </Text>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right' }}>
                                                            {(selectFlightDeparture !== null && activitydepartureselected) ? formatNumber(mileageDeparture * adultpassenger) : (!activitydepartureselected) ? formatNumber(discountamountdepr + deprprice) : "-"}
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right', marginTop: 63 }}>
                                                            {(totaldiscountdepr && activitydepartureselected) ? `- ${formatNumber(totaldiscountdepr * adultpassenger)}` :
                                                                (!totaldiscountdepr && activitydepartureselected) ? "" :
                                                                    (!activitydepartureselected && activityreturnselected && discountamountdepr) ? `- ${formatNumber(discountamountdepr * adultpassenger)}` :
                                                                        (!activitydepartureselected && activityreturnselected && totaldiscountdepr) ? `- ${formatNumber(totaldiscountdepr * adultpassenger)}` : ""}
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ display: 'block', marginLeft: 30 }}>
                                                            <Text style={{ display: 'block' }}>
                                                                {(discountdepr && discounttypedepr === "PERCENTAGE" && totaldiscountdepr) ? `(Disc ${discountdepr}%) @${formatNumber(totaldiscountdepr)} x ${adultpassenger}` :
                                                                    (!discountdepr && deprpromocode) ? /*`(Disc ${discountdepr}%)*/ `Disc @${formatNumber(discountamountdepr)} x ${adultpassenger}` :
                                                                        (discountdepr && discounttypedepr === "MILEAGE" && totaldiscountdepr) ? `(Disc ${discountdepr} Miles) @${formatNumber(totaldiscountdepr)} x ${adultpassenger}` : ''}
                                                            </Text>
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (roundtrip) ?
                                                            <Row style={{ marginTop: '10px' }}>
                                                                <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                                    <Text strong style={{ display: 'block' }}> Return Flight </Text>
                                                                    <Text style={{ display: 'block' }}> {moment(summaryReturnFlight.flightdate).format("DD MMMM YYYY")} &nbsp;{(summaryReturnFlight.peakseasonstatus) ? <Text type="warning">Peak Season Period</Text> : null} </Text>
                                                                    <Text style={{ display: 'block' }}>
                                                                        {
                                                                            (selectFlightReturn !== null) ?
                                                                                summaryReturnFlight.origin + " - " + summaryReturnFlight.destination
                                                                                + " / " + summaryReturnFlight.airlinecode + " / " + summaryReturnFlight.compartmentcode + " / " + summaryReturnFlight.bookingclasscode : "-"
                                                                        }
                                                                    </Text>
                                                                    <Text style={{ display: 'block', marginLeft: 30 }}>
                                                                        {
                                                                            (mileageReturn && activityreturnselected) ? `@${formatNumber(mileageReturn)} x ${adultpassenger}` : (mileageReturn && !activityreturnselected) ? `@${formatNumber(discountamountretr + retrprice)} x ${adultpassenger}` : " "
                                                                        }
                                                                    </Text>
                                                                    <Text style={{ display: 'block' }}>
                                                                        {
                                                                            (promocoderetr) ? `Promo ${promocoderetr}` :
                                                                                (retrpromocode) ? `Promo ${retrpromocode}` : " "
                                                                        }
                                                                    </Text>
                                                                </Col>
                                                                <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right' }}>
                                                                    {(selectFlightReturn !== null && activityreturnselected) ? formatNumber(mileageReturn * adultpassenger) : (!activityreturnselected) ? formatNumber(discountamountretr + retrprice) : "-"}
                                                                </Col>
                                                                <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right', marginTop: 63 }}>
                                                                    {(totaldiscountretr && activityreturnselected) ? `- ${formatNumber(totaldiscountretr * adultpassenger)}` :
                                                                        (!totaldiscountretr && activityreturnselected) ? "" :
                                                                            (activitydepartureselected && !activityreturnselected && discountamountretr) ? `- ${formatNumber(discountamountretr * adultpassenger)}` :
                                                                                (activitydepartureselected && !activityreturnselected && totaldiscountretr) ? ` - ${formatNumber(totaldiscountretr * adultpassenger)}` : ""}
                                                                </Col>
                                                                <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ display: 'block', marginLeft: 30 }}>
                                                                    <Text style={{ display: 'block' }}>
                                                                        {(discountretr && discounttyperetr === "PERCENTAGE" && totaldiscountretr) ? `(Disc ${discountretr} %) @${formatNumber(totaldiscountretr)} x ${adultpassenger}` :
                                                                            (!discountretr && retrpromocode) ? /*`(Disc ${discountdepr}%)*/ `Disc @${formatNumber(discountamountretr)} x ${adultpassenger}` :
                                                                                (discountretr && discounttyperetr === "MILEAGE" && totaldiscountretr) ? `(Disc ${discountretr} Miles) @${formatNumber(totaldiscountretr)} x ${adultpassenger}` : ''}
                                                                    </Text>
                                                                </Col>
                                                            </Row>
                                                            : null
                                                    }
                                                    <Row style={{ marginTop: '12px' }}>
                                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                            <Text strong style={{ display: 'block' }}> Fee </Text>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right' }}>
                                                            {(fee) ? formatNumber(fee) : "-"}
                                                        </Col>
                                                    </Row>

                                                    <Row style={{ paddingTop: '16px', borderTop: '1px solid #e8e8e8', marginTop: '12px' }}>
                                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                            Total Mileage
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right' }}>
                                                            {
                                                                (totalafterdiscountdepr !== null && totalafterdiscountretr == null && fee !== undefined) ? formatNumber(Math.ceil((totalafterdiscountdepr + mileageReturn + parseInt(fee, 0)) * adultpassenger)) :
                                                                    (totalafterdiscountretr !== null && totalafterdiscountdepr == null && fee !== undefined) ? formatNumber(Math.ceil((totalafterdiscountretr + mileageDeparture + parseInt(fee, 0)) * adultpassenger)) :
                                                                        (totalafterdiscountdepr !== null && totalafterdiscountretr !== null && fee !== undefined) ? formatNumber(Math.ceil((totalafterdiscountdepr + totalafterdiscountretr + parseInt(fee, 0)) * adultpassenger)) :
                                                                            (totalafterdiscountdepr == null && totalafterdiscountretr == null && fee !== undefined) ? formatNumber(Math.ceil((mileageDeparture + mileageReturn + parseInt(fee, 0)) * adultpassenger)) : '-'
                                                            }
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                {fromApproval ? <Row>
                                                    <Button htmlType="button" type="primary" block style={{ marginTop: '20px' }} disabled={((!roundtrip && selectFlightDeparture !== null) ||
                                                        (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? false : true} label='Update Request' onClick={this.showSave} />
                                                    <Button htmlType="button" type="default" block style={{ marginTop: '20px' }} onClick={this.props.handleBackSearchFlight} label='Back to Search Flight' />
                                                </Row> : <Row>
                                                    <Button htmlType="button" type="primary" label='Confirm' block={true} style={{ marginTop: '20px' }} menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'UPDATE'} custommenu={true}
                                                        disabled={((!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? false : true} onClick={() => this.showConfirmation('UPDATE')}
                                                        className={(usermenu && usermenu["CERTIF"]["CERTIF_UPDATE"]) ? '' : 'hidden'} />
                                                    <Button htmlType="button" type="primary" label='Request' block={true} style={{ marginTop: '20px' }} menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'REQUPDTE'} custommenu={true}
                                                        disabled={((!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? false : true} onClick={() => this.showConfirmation('REQUEST')} />
                                                </Row>
                                                }
                                            </div>
                                        </Affix>
                                    </Col>
                                </Row>
                            </Form>
                        </Spin>
                    </Row>
                )
            }
        } else {
            return (
                <><Row gutter={24} type="flex" justify="center">
                    <Title level={2} style={{ textAlign: 'center', marginTop: 350 }} className={''}>This page need OTP Authentication, please back to Certificate page</Title>
                </Row><Row gutter={24} type="flex" justify="center">
                        <Button url={'/member/form/' + this.props.match.params.ID + '/certificateotp'} htmlType="link" type="default" label="Back" />
                    </Row></>
            )
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));