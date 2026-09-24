import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { SalutationSelect, Button, Alert, SelectBase, SwitchButton, InputText } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, List, Modal, Card, Affix, Tooltip, Alert as AlertAnt } from 'antd';
import { formatNumber, getTravelerType } from '../../../../utilities/Helpers';
import moment from 'moment';
import UsePromo from '../freeflight/UsePromo';
import SaveForm from '../../../my_approval/Confirmation';

const { confirm, warning } = Modal;
const { Text } = Typography;
const optionsTravelerType = [
    { label: 'Adult', value: 'ADULT' },
    { label: 'Infant', value: 'INFANT' },
    { label: 'Child', value: 'CHILD' }
];
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            spinloading: false,
            fieldvalue: {},
            fielddisabled: {
                comparmentfielddisabled: true,
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
            awardinfo: {},
            visibleDepr: false,
            visibleRetr: false,
            modalType: null,
            cardnumber: this.props.cardnumber,
            totalafterdiscountdepr: null,
            totalafterdiscountretr: null,
            promocodedepr: null,
            promocoderetr: null,
            promoUsage: null,
            dataList: props.location.state.priceList,
            inputValue: '',
            showsave: false,
        }
    }

    componentDidMount() {
        const { state } = this.props.location;
        let memberid = this.props.match.params.ID;
        if (state === undefined) {
            this.props.history.push('/member/form/' + memberid + '/redemption/');
        } else {
            const { priceList, requestSearchFlight, awardinfo } = state;
            let flightDeparture = priceList.departure;
            let flightReturn = priceList.return;
            this.setState({ ...this.state, flightDeparture, flightReturn, requestSearchFlight, awardinfo });
            const { redeemuser, bookingcode, ticketvaliditydate, ticketnumber, redeemairactivity } = this.props.result.reqdatas;
            const { certificateprice, familyname, memberiduser, name, selfusage, travelertype } = redeemuser[0] || redeemuser;
            this.props.form.setFieldsValue({
                bookingcode, certificateprice, [`passenger-familyname0`]: familyname, [`passenger-memberid0`]: memberiduser, [`passenger-name0`]: name, ticketnumber, selfusage,
                ticketvaliditydate: moment(ticketvaliditydate), [`passenger-travelertype0`]: travelertype, flightnumberdeparture: redeemairactivity[0] ? redeemairactivity[0].flightnumber : redeemairactivity.departure[0].flightnumber
            });
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        const callback = (input) => {
            this.setState({ isLoading: true, showsave: false });
            const { referenceid, requestid, requeststatus, requesttype, approvalby, approvaldate, reqdata, createdBy, isdataactive, reqdatas } = this.props.result;
            const { categorycode } = reqdatas;
            const { mileageDeparture, mileageReturn } = this.state;
            const { awardcode, adultpassenger, memberid, username, roundtrip } = this.state.requestSearchFlight;
            const { selectFlightDeparture, selectFlightReturn, flightDeparture, flightReturn, totalafterdiscountdepr, totalafterdiscountretr,
                summaryafterdiscountdepr, summaryafterdiscountretr, promocodedepr, promocoderetr } = this.state;

            let departureActivity = flightDeparture[selectFlightDeparture];
            let pricedepr = (selectFlightDeparture !== null) ?
                (summaryafterdiscountdepr === null || summaryafterdiscountdepr === undefined) ?
                    mileageDeparture : totalafterdiscountdepr : mileageDeparture;
            departureActivity = {
                promocode: (promocodedepr !== null) ? promocodedepr : null,
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
            let returnActivity = null;
            let priceretr = (selectFlightReturn !== null) ?
                (summaryafterdiscountretr === null || summaryafterdiscountretr === undefined) ?
                    mileageReturn : totalafterdiscountretr : mileageReturn;
            if (roundtrip) {
                returnActivity = flightReturn[selectFlightReturn];
                returnActivity = {
                    promocode: (promocoderetr !== null) ? promocoderetr : null,
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
            }
            //define parameter
            let promocode = null;
            let channelapp = "amalabo";
            let totalprice = null;

            if (totalafterdiscountdepr !== null && totalafterdiscountretr === null) totalprice = ((totalafterdiscountdepr + mileageReturn) * adultpassenger);
            if (totalafterdiscountretr !== null && totalafterdiscountdepr === null) totalprice = ((totalafterdiscountretr + mileageDeparture) * adultpassenger);
            if (totalafterdiscountdepr !== null && totalafterdiscountretr !== null) totalprice = ((totalafterdiscountdepr + totalafterdiscountretr) * adultpassenger);
            if (totalafterdiscountdepr === null && totalafterdiscountretr === null) totalprice = ((mileageDeparture + mileageReturn) * adultpassenger);

            let issueddate = moment().format("YYYY-MM-DD");
            let quantity = null;
            let bookingcode = (input.bookingcode) ? input.bookingcode : null;
            let ticketnumber = (input.ticketnumber) ? input.ticketnumber : null;
            let ticketvaliditydate = (input.ticketvaliditydate) ? moment(input.ticketvaliditydate).format("YYYY-MM-DD") : null;
            let freeaward = false;

            let redeemairactivity = {
                departure: [departureActivity],
                return: (returnActivity) ? [returnActivity] : []
            };
            let remark = (input.remark) ? input.remark : null;

            let redeemuser = [];
            for (let i = 0; i < adultpassenger; i++) {
                redeemuser.push({
                    name: input[`passenger-name${i}`],
                    familyname: input[`passenger-familyname${i}`],
                    salutationcode: input[`passenger-salutationcode${i}`],
                    memberiduser: i === 0 ? input[`passenger-memberid${i}`] : input[`passenger-memberid${i}`],
                    travelertype: input[`passenger-travelertype${i}`],
                    selfusage: i === 0 ? (input.selfusage || false) : false,
                    certificateprice:
                        (totalafterdiscountdepr !== null && totalafterdiscountretr === null) ? (totalafterdiscountdepr + mileageReturn) :
                            (totalafterdiscountretr !== null && totalafterdiscountdepr === null) ? (totalafterdiscountretr + mileageDeparture) :
                                (totalafterdiscountdepr !== null && totalafterdiscountretr !== null) ? (totalafterdiscountdepr + totalafterdiscountretr) :
                                    (totalafterdiscountdepr === null && totalafterdiscountretr === null) ? (mileageDeparture + mileageReturn) : null,
                    activitydate: null
                })
            }

            let url = api.url.requestapproval.update;
            let data = {
                reqdata, createdBy, isdataactive, requestid, referenceid, memberid, requesttype, requeststatus, approvalby, approvaldate, remark: input.remark ? input.remark : remark, reqdatas: {
                    url: 'redemption/transaction/v1.2/buyaward', promocode, channelapp, awardcode, issueddate, quantity, memberid, username, bookingcode, ticketnumber, ticketvaliditydate, freeaward,
                    totalprice, redeemuser, redeemairactivity, remark, return: roundtrip, categorycode
                }
            };
            SaveRequest(url, data).then(async (response) => {
                const { status } = response || {};
                if (status.responsecode === "0000") {
                    Alert.success(status.responsemessage);
                    this.props.history.push('/my-approval');
                } else {
                    Alert.error(status.responsemessage);
                }
                this.setState({ isLoading: false });
            });
        }
        this.props.form.validateFieldsAndScroll((err, input) => {
            const { promocodedepr, promocoderetr } = this.state;
            if (!err) {
                if (promocoderetr !== null || promocodedepr !== null) {
                    this.getPromoUsage(callback, input);
                } else {
                    callback(input)
                }
            }
        });
        this.setState({ isLoading: false })
    };

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
        const { flightDeparture, flightReturn } = this.state;
        const { roundtrip } = this.state.requestSearchFlight;
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
            this.setState({ ...this.state, selectFlightReturn: key, mileageReturn, totalMileage });
        }
    }

    handleSelfUsageChange = (selfusage) => {
        const { redeemuser } = this.props.result.reqdatas;
        let { name, familyname, memberiduser, travelertype } = (redeemuser[0] || redeemuser) || undefined;
        // let salutationcode = (selfusage) ? this.props.profile.salutationcode : undefined;
        this.props.form.setFieldsValue({
            // [`passenger-salutationcode0`]: salutationcode,
            [`passenger-name0`]: (selfusage) ? name : undefined,
            [`passenger-familyname0`]: (selfusage) ? familyname : undefined,
            [`passenger-travelertype0`]: (selfusage) ? travelertype : undefined,
            [`passenger-memberid0`]: ((selfusage) ? `${memberiduser}` : undefined)
        });
    }

    handleOthersPassenger = (value, data, key) => {
        if (value) {
            const { salutationcode, firstname, lastname, dateofbirth } = data;
            let age = moment().diff(moment(dateofbirth), 'years');

            this.props.form.setFieldsValue({
                [`passenger-salutationcode${key}`]: salutationcode,
                [`passenger-name${key}`]: firstname,
                [`passenger-familyname${key}`]: lastname,
                [`passenger-travelertype${key}`]: getTravelerType(age)
            });
        }
        else {
            this.props.form.resetFields([
                `passenger-salutationcode${key}`,
                `passenger-name${key}`,
                `passenger-familyname${key}`,
                `passenger-travelertype${key}`]
            );
        }
    }

    handleCancelPromo = (type) => {
        const { summaryafterdiscountdepr, summaryafterdiscountretr } = this.state;
        if (type === 'DEPARTURE' && summaryafterdiscountdepr !== null) {
            this.setState({ promocodedepr: null, summarydiscountdepr: null, summaryafterdiscountdepr: null, totalafterdiscountdepr: null, discountretr: null, totaldiscountdepr: null, discountdepr: null, });
        } else if (type === 'RETURN' && summaryafterdiscountretr !== null) {
            this.setState({ promocoderetr: null, summarydiscountretr: null, summaryafterdiscountretr: null, totalafterdiscountretr: null, discountretr: null, totaldiscountretr: null, discountdepr: null, });
        } else if (type === 'BOTH' && summaryafterdiscountdepr !== null && summaryafterdiscountretr !== null) {
            this.setState({
                promocodedepr: null, summarydiscountdepr: null, summaryafterdiscountdepr: null, totalafterdiscountdepr: null, discountdepr: null, totaldiscountdepr: null,
                promocoderetr: null, summarydiscountretr: null, summaryafterdiscountretr: null, totalafterdiscountretr: null, discountretr: null, totaldiscountretr: null,
            });
        }
    }

    handleOpenModal = (e, type) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            const { flightnumberdeparture, flightnumberreturn } = input || {};
            if (flightnumberdeparture && type === 'DEPARTURE') {
                this.setState({ visibleDepr: true, modalType: type, flightnumberdeparture });
            } else if (flightnumberreturn && type === 'RETURN') {
                this.setState({ visibleRetr: true, modalType: type, flightnumberreturn });
            }
        });
    }

    handleCloseModal = () => {
        this.setState({ visibleDepr: false, visibleRetr: false, showsave: false });
    };

    handleOk = (val) => {
        const { promocode } = val;
        const { modalType } = this.state;
        if (modalType === 'DEPARTURE') {
            this.props.form.setFieldsValue({ promocodedepr: promocode })
        } else {
            this.props.form.setFieldsValue({ promocoderetr: promocode })
        }
        this.setState({ visibleDepr: false, visibleRetr: false });
    }

    setStateOfParent2 = (dataPromo) => {
        const { promocode, summarydiscount, summaryafterdiscount, totalafterdiscount, discounttype, totaldiscount, discount } = dataPromo;
        const { modalType } = this.state;
        switch (modalType) {
            case ("RETURN"):
                this.setState({
                    promocoderetr: promocode,
                    discountretr: (discount !== null) ? discount : null,
                    summarydiscountretr: (summarydiscount) ? summarydiscount : 0,
                    discounttyperetr: (discounttype !== null) ? discounttype : null,
                    totaldiscountretr: (totaldiscount !== null) ? totaldiscount : null,
                    totalafterdiscountretr: (totalafterdiscount !== null) ? totalafterdiscount : null,
                    summaryafterdiscountretr: (summaryafterdiscount !== null) ? summaryafterdiscount : null,
                })
                break;
            default:
                this.setState({
                    promocodedepr: promocode,
                    discountdepr: (discount !== null) ? discount : null,
                    summarydiscountdepr: (summarydiscount) ? summarydiscount : 0,
                    discounttypedepr: (discounttype !== null) ? discounttype : null,
                    totaldiscountdepr: (totaldiscount !== null) ? totaldiscount : null,
                    totalafterdiscountdepr: (totalafterdiscount !== null) ? totalafterdiscount : null,
                    summaryafterdiscountdepr: (summaryafterdiscount !== null) ? summaryafterdiscount : null,
                })
                break;
        }
    }

    getPromoUsage = (callback, input) => {
        const { promocodedepr, promocoderetr } = this.state;
        let memberid = this.props.match.params.ID;
        let url = api.url.redeempromo.getusagepromo;
        let promo = [promocodedepr, promocoderetr];
        let data = {
            "promocode": promo,
            "memberid": memberid
        };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode) {
                this.setState({ promoUsageStatus: result, responsemessage });
                this.handlePromoUsage(callback, input);
            } else {
                Alert.error(responsemessage);
            }
        });
    }

    handlePromoUsage = (callback, input) => {
        const { promoUsageStatus } = this.state
        const { promocodedepr, promocoderetr } = this.state || {}
        if ((promoUsageStatus[0].status && !promoUsageStatus[1]) || (promoUsageStatus[0].status && promoUsageStatus[1].status)) {
            if (promocodedepr && promocoderetr) {
                this.getpromo(promocodedepr, 'DEPARTURE')
                this.getpromo(promocoderetr, 'RETURN')
            } else if (promocodedepr && !promocoderetr) {
                this.getpromo(promocodedepr, 'DEPARTURE')
            } else {
                this.getpromo(promocoderetr, 'RETURN')
            }
            confirm({
                title: `Promo used, Are you sure to buy this award?`,
                onOk(e) {
                    return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                        callback(input);
                    }).catch(() => console.log('Oops errors!'));
                },
                onCancel() { },
            });
        }
        else {
            const { promocodedepr, promocoderetr } = this.state

            if (promocodedepr !== null && promocoderetr == null && !promoUsageStatus[0].status) { this.handleCancelPromo("DEPARTURE"); }
            else if (promocodedepr == null && promocoderetr !== null && !promoUsageStatus[0].status) { this.handleCancelPromo("RETURN"); }
            else if (promocodedepr !== null && promocoderetr !== null && !promoUsageStatus[0].status && promoUsageStatus[1].status) { this.handleCancelPromo("DEPARTURE"); }
            else if (promocodedepr !== null && promocoderetr !== null && promoUsageStatus[0].status && !promoUsageStatus[1].status) { this.handleCancelPromo("RETURN"); }
            else if (promocodedepr !== null && promocoderetr !== null && !promoUsageStatus[0].status && !promoUsageStatus[1].status) { this.handleCancelPromo("BOTH"); }

            if (promocodedepr !== null && promocoderetr === null && !promoUsageStatus[0].status) { warning({ title: 'Promo Departure Unavailable, Normal Price will be Charged.', }) }
            else if (promocodedepr === null && promocoderetr !== null && !promoUsageStatus[0].status) { warning({ title: 'Promo Return Unavailable, Normal Price will be Charged.' }) }
            else if (promocodedepr !== null && promocoderetr !== null && !promoUsageStatus[0].status && promoUsageStatus[1].status) {
                this.getpromo(promocoderetr, 'RETURN');
                warning({ title: 'Promo Return Used but Promo Departure Unavailable, Normal Price will be Charged.' })
            }
            else if (promocodedepr !== null && promocoderetr !== null && promoUsageStatus[0].status && !promoUsageStatus[1].status) {
                this.getpromo(promocodedepr, 'DEPARTURE');
                warning({ title: 'Promo Departure Used but Promo Return Unavailable, Normal Price will be Charged.' });
            }
            else if (promocodedepr !== null && promocoderetr !== null && !promoUsageStatus[0].status && !promoUsageStatus[1].status) { warning({ title: 'Departure and Return Promo are Unavailable, Normal Price will be Charged.' }) }
        }
    }

    getpromo = (promocode, modalType) => {
        const { dataList } = this.state;
        const { cardnumber } = this.props
        const { awardcode, routetype, adultpassenger } = dataList || {};
        let flightnumberreturn = this.props.form.getFieldValue('flightnumberreturn')
        let flightnumberdeparture = this.props.form.getFieldValue('flightnumberdeparture')
        const { awardinfo, selectFlightDeparture, selectFlightReturn, } = this.state;
        const { categorytype } = awardinfo || {};
        const { price, airlinecode, bookingclasscode, compartmentcode, origin, destination, flightdate }
            = (modalType === 'DEPARTURE') ? dataList.departure[selectFlightDeparture] : dataList.return[selectFlightReturn] || {};
        let url = api.url.redeempromo.getpromo;
        let data = {
            "promocode": promocode,
            "promotype": categorytype,
            "cardnumber": cardnumber,
            "channel": "amalabo",
            "awardcode": awardcode,
            "total": price,
            "checkdate": true,
            "airactivity": {
                "flightnumber": (modalType === "DEPARTURE") ? flightnumberdeparture : flightnumberreturn,
                "airlinecode": airlinecode,
                "bookingclass": bookingclasscode,
                "compartment": compartmentcode,
                "routetype": routetype,
                "odairport": `${origin},${destination}`,
                "oairport": origin,
                "dairport": destination,
                "activitydate": flightdate,
                "passenger": adultpassenger
            }
        };

        this.setState({ spinloading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === "0000") {
                var key = 0;
                if (modalType === "DEPARTURE") {
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
                        promoDataDepr[key]['enddate'] = (!result[field].unlimitedperiod) ? moment(result[field].enddate).format('DD/MM/YYYY') : "Unlimited";
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
                        responsemessage,
                    });
                } else {
                    if (modalType === "RETURN") {
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
                            promoDataRetr[key]['enddate'] = (!result[field].unlimitedperiod) ? moment(result[field].enddate).format('DD/MM/YYYY') : "Unlimited";
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
                            responsemessage,
                        });
                    }
                }
            } else {
                Alert.error(responsemessage);
                if (modalType === 'DEPARTURE') {
                    this.handleCancelPromo('DEPARTURE')
                } else {
                    this.handleCancelPromo('RETURN')
                }
            }
            this.setState({ spinloading: false });
        });

    }

    handlePromoCodedepr = (e) => {
        let promocodedepr = this.props.form.getFieldValue('promocodedepr') ? this.props.form.getFieldValue('promocodedepr') : null;
        if (promocodedepr !== null) {
            if (e.key === 'Enter') {
                this.getpromo(promocodedepr, 'DEPARTURE')
            }
        } else {
            Alert.error('Promocode cannot be empty')
        }
    }

    handlePromoCoderetr = (e) => {
        let promocoderetr = this.props.form.getFieldValue('promocoderetr') ? this.props.form.getFieldValue('promocoderetr') : null;
        if (promocoderetr !== null) {
            if (e.key === 'Enter') {
                this.getpromo(promocoderetr, 'RETURN')
            }
        } else {
            Alert.error('Promocode cannot be empty')
        }
    }

    handleFlightNumber = (flightnumber, typeflight) => {
        if (typeflight === "DEPARTURE") {
            this.props.form.setFieldsValue({ flightnumberdeparture: flightnumber });
        } else {
            this.props.form.setFieldsValue({ flightnumberreturn: flightnumber });
        }
    }

    showSave = () => {
        this.setState({ showsave: true })
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        const { flightnumberdeparture, flightnumberreturn, cardnumber, promocodedepr, promocoderetr, discountdepr, discountretr, spinloading,
            totalafterdiscountdepr, totalafterdiscountretr, discounttypedepr, discounttyperetr, totaldiscountdepr, totaldiscountretr, showsave } = this.state;
        const { isLoading, visibleDepr, visibleRetr, modalType, flightDeparture, flightReturn, selectFlightDeparture, selectFlightReturn,
            requestSearchFlight, mileageDeparture, mileageReturn, isSuccessBuy, responseBuyAward, awardinfo } = this.state;
        const { roundtrip, adultpassenger } = requestSearchFlight;
        let summaryDepartureFlight = (flightDeparture[selectFlightDeparture]) ? flightDeparture[selectFlightDeparture] : {};
        let summaryReturnFlight = (flightReturn && flightReturn[selectFlightReturn]) ? flightReturn[selectFlightReturn] : {};

        let memberid = this.props.match.params.ID;
        let awardcode = this.props.match.params.awardcode;

        let selfusage = this.props.form.getFieldValue('selfusage');

        let passengerList = [];
        if (adultpassenger > 1) {
            for (let key = 1; key < adultpassenger; key++) {
                passengerList[key] = <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                    <Divider>Passenger #{key + 1}</Divider>
                    <SalutationSelect wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Salutation" datafield={"passenger-salutationcode" + key} />
                    <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Name" datafield={"passenger-name" + key} validationrules={['required', 'pattern.letterspace']} maxLength={45} />
                    <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Family Name" datafield={"passenger-familyname" + key} validationrules={['pattern.letter']} maxLength={45} />
                    <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="GarudaMiles ID" datafield={"passenger-memberid" + key} validationrules={['pattern.number']} maxLength={16} />
                    <SelectBase wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Traveler Type" datafield={"passenger-travelertype" + key} validationrules={['required']} options={optionsTravelerType} />
                </Col>;
            }
        }

        if (isSuccessBuy) {
            return (<Redirect to={{ pathname: '/member/form/' + memberid + '/redemption/freeflight/' + awardcode + '/certificate', state: { responseBuyAward } }} />)
        } else {
            return (
                <Row>
                    {
                        (modalType === 'DEPARTURE') ?
                            <Modal visible={visibleDepr} title="Use Promo" loading={isLoading} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={680}>
                                <UsePromo onClose={this.handleOk} {...this.props} modalType={modalType} flightnumberdeparture={flightnumberdeparture} form={this.props.form}
                                    setStateOfParent2={this.setStateOfParent2} cardnumber={cardnumber} awardinfo={awardinfo} selectFlightDeparture={selectFlightDeparture}
                                />
                            </Modal>
                            : (modalType === 'RETURN') ?
                                <Modal visible={visibleRetr} title="Use Promo" loading={isLoading} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={680}>
                                    <UsePromo onClose={this.handleOk} {...this.props} modalType={modalType} flightnumberreturn={flightnumberreturn}
                                        setStateOfParent2={this.setStateOfParent2} cardnumber={cardnumber} awardinfo={awardinfo} selectFlightReturn={selectFlightReturn}
                                    />
                                </Modal>
                                : null
                    }
                    <Modal visible={showsave} footer={null} onCancel={this.handleCloseModal} destroyOnClose={true} width={400}>
                        <SaveForm {...this.props} onOk={this.saveAction} onClose={this.handleCloseModal} />
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
                                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                            {(item.flightdate) ? moment(item.flightdate).format("DD/MM/YYYY") : '-'}
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                            {(item.airlinecode) ? item.airlinecode : '-'}
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                            {(item.origin) ? item.origin : '-'} - {(item.destination) ? item.destination : '-'}
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                            {(item.compartmentcode) ? item.compartmentcode : '-'}&nbsp;/&nbsp;
                                                            {(item.bookingclasscode) ? item.bookingclasscode : '-'}
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                            {(item.price) ? formatNumber(item.price) : '-'}
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                            <Button htmlType="button" type={(key === selectFlightDeparture) ? 'primary' : 'default'} size="small" label="Select"
                                                                onClick={(e) => this.handleSelectFlight(e, 'DEPARTURE', key)} />
                                                        </Col>
                                                    </Row>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                    <Form>
                                        <Row gutter={48} type="flex" justify="center" style={{ marginTop: 10 }} className={(!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null) ? '' : 'hidden'}>
                                            {(promocodedepr !== null) ?
                                                <Col className={''} xs={24} sm={24} md={24} lg={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }}>
                                                    <AlertAnt showIcon message={`Promo ${promocodedepr} used`} type="success" style={{ marginBottom: '10px' }}
                                                        closeText="Cancel Promo" afterClose={() => this.handleCancelPromo('DEPARTURE')} />
                                                </Col>
                                                : null}
                                        </Row>
                                        <Row className={(!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null) ? '' : 'hidden'}>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Departure Flight Number" datafield="flightnumberdeparture" validationrules={['required', 'pattern.number']} maxLength={4} onChange={() => this.handleFlightNumber(flightnumberdeparture, "DEPARTURE")} />
                                                <Row gutter={24}>
                                                    <Col xs={24} lg={14}>
                                                        <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 14 }} form={this.props.form} labeltext="Input Promo Code" datafield="promocodedepr" placeholder="Ex. air00020" maxLength={20} onPressEnter={this.handlePromoCodedepr} disabled={(this.props.form.getFieldValue('flightnumberdeparture')) ? false : true} />
                                                        {
                                                            (spinloading) ? <Spin style={{ marginTop: 10, marginLeft: 10 }} /> : null
                                                        }
                                                    </Col>
                                                    <Col xs={24} lg={10}>
                                                        <Button htmlType="button" size="medium" label="Promo List" onClick={(e) => this.handleOpenModal(e, 'DEPARTURE')} style={{ marginTop: 3 }} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>

                                    {
                                        (roundtrip && selectFlightDeparture !== null) ?
                                            <Row>
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
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        {(item.flightdate) ? moment(item.flightdate).format("DD/MM/YYYY") : '-'}
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        {(item.airlinecode) ? item.airlinecode : '-'}
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        {(item.origin) ? item.origin : '-'} - {(item.destination) ? item.destination : '-'}
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        {(item.compartmentcode) ? item.compartmentcode : '-'}&nbsp;/&nbsp;
                                                                        {(item.bookingclasscode) ? item.bookingclasscode : '-'}
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        {(item.price) ? formatNumber(item.price) : '-'}
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                                                        <Button htmlType="button" type={(key === selectFlightReturn) ? 'primary' : 'default'} size="small" label="Select" onClick={(e) => this.handleSelectFlight(e, 'RETURN', key)} />
                                                                    </Col>
                                                                </Row>
                                                            )}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Form>
                                                        <Row gutter={48} type="flex" justify="center" style={{ marginTop: 10 }} className={(roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null) ? '' : 'hidden'}>
                                                            {(promocoderetr !== null) ?
                                                                <Col className={''} xs={24} sm={24} md={24} lg={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }}>
                                                                    <AlertAnt showIcon message={`Promo ${promocoderetr} used`} type="success" style={{ marginBottom: '10px' }}
                                                                        closeText="Cancel Promo" afterClose={() => this.handleCancelPromo('RETURN')} />
                                                                </Col> : null}
                                                        </Row>
                                                        <Row className={(roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null) ? '' : 'hidden'}>
                                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Return Flight Number" datafield="flightnumberreturn" validationrules={['required', 'pattern.number']} maxLength={4} onChange={() => this.handleFlightNumber(flightnumberreturn, "RETURN")} />
                                                                <Row gutter={24}>
                                                                    <Col xs={24} lg={14}>
                                                                        <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 14 }} form={this.props.form} labeltext="Input Promo Code" datafield="promocoderetr" placeholder="Ex. air00020" maxLength={20} onPressEnter={this.handlePromoCoderetr} disabled={(this.props.form.getFieldValue('flightnumberreturn')) ? false : true} />
                                                                        {
                                                                            (spinloading) ? <Spin style={{ marginTop: 10, marginLeft: 10 }} /> : null
                                                                        }
                                                                    </Col>
                                                                    <Col xs={24} lg={10}>
                                                                        <Button htmlType="button" size="medium" label="Promo List" onClick={(e) => this.handleOpenModal(e, 'RETURN')} style={{ marginLeft: 20, marginTop: 5, }} />
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </Row>
                                            </Row>
                                            : null
                                    }

                                    <Row className={((!roundtrip && selectFlightDeparture !== null) || (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? '' : 'hidden'}>
                                        <Divider>Passenger Data</Divider>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                            <Divider>Passenger #1</Divider>
                                            <SwitchButton wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Self Usage" datafield="selfusage" onChange={this.handleSelfUsageChange} />
                                            <SalutationSelect wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} ref={(e) => { this.componentSalutationSelect = e }} form={this.props.form} labeltext="Salutation" datafield={"passenger-salutationcode0"} disabled={selfusage} />
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Name" datafield={"passenger-name0"} validationrules={['required', 'pattern.letterspace']} maxLength={45} disabled={selfusage} />
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Family Name" datafield={"passenger-familyname0"} validationrules={['required', 'pattern.letter']} maxLength={45} disabled={selfusage} />
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="GarudaMiles ID" datafield={"passenger-memberid0"} disabled={selfusage} validationrules={['pattern.number']} maxLength={16} />
                                            <SelectBase wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Traveler Type" datafield={"passenger-travelertype0"} validationrules={['required']} options={optionsTravelerType} disabled={selfusage} />
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
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Remark" datafield="remark" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8} style={{ padding: '0 10px' }}>
                                    <Affix offsetTop={0}>
                                        <div>
                                            <Card title="Award Information" bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)' }} bodyStyle={{ padding: '5px', paddingBottom: '5px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Award Code</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        <Tooltip title={(awardinfo.awardcode) ? awardinfo.awardcode : '-'}>
                                                            {(awardinfo.awardcode) ? (awardinfo.awardcode.length > 12) ?
                                                                awardinfo.awardcode.substring(0, 12) + '...' : awardinfo.awardcode : '-'}
                                                        </Tooltip>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '5px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Award Type</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(awardinfo.awardtypecode) ? awardinfo.awardtypecode : '-'}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '5px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Partner</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(awardinfo.partnername) ? awardinfo.partnername : '-'}
                                                    </Col>
                                                </Row>
                                            </Card>
                                            <Card title="Price Details" bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginTop: '5px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                        <Text strong style={{ display: 'block' }}>Departure Flight</Text>
                                                        <Text style={{ display: 'block' }}> {moment(summaryDepartureFlight.flightdate).format("DD MMMM YYYY")} &nbsp;{(summaryDepartureFlight.peakseasonstatus) ? <Text type="warning">Peak Season Period</Text> : null} </Text>
                                                        <Text style={{ display: 'block' }}>
                                                            {
                                                                (selectFlightDeparture !== null) ? `${summaryDepartureFlight.origin} - ${summaryDepartureFlight.destination}
                                                                    / ${summaryDepartureFlight.airlinecode} / ${summaryDepartureFlight.compartmentcode} / ${summaryDepartureFlight.bookingclasscode} (x${adultpassenger})` : '-'
                                                            }
                                                        </Text>
                                                        <Text style={{ display: 'block', marginLeft: 30 }}>
                                                            {
                                                                (mileageDeparture) ? `@${formatNumber(mileageDeparture)} x ${adultpassenger}` : " "
                                                            }
                                                        </Text>
                                                        <Text style={{ display: 'block' }}>
                                                            {
                                                                (promocodedepr) ? `Promo ${promocodedepr}` : " "
                                                            }
                                                        </Text>
                                                    </Col>
                                                    {/* set total mileage of activity */}
                                                    <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right' }}>
                                                        {(selectFlightDeparture !== null) ? formatNumber(mileageDeparture * adultpassenger) : ""}
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right', marginTop: 63 }}>
                                                        {(totaldiscountdepr) ? `- ${formatNumber(totaldiscountdepr * adultpassenger)}` : (!totaldiscountdepr) ? "" : ""}
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ display: 'block', marginLeft: 30 }}>
                                                        <Text style={{ display: 'block' }}>
                                                            {(discountdepr && discounttypedepr === "PERCENTAGE" && totaldiscountdepr) ? `(Disc ${discountdepr}%) @${formatNumber(totaldiscountdepr)} x ${adultpassenger}` :
                                                                (discountdepr && discounttypedepr === "MILEAGE" && totaldiscountdepr) ? `(Disc ${discountdepr} Miles) @${formatNumber(totaldiscountdepr)} x ${adultpassenger}` : ''}
                                                        </Text>
                                                    </Col>
                                                </Row>
                                                {
                                                    (roundtrip) ?
                                                        <Row style={{ marginTop: '5px' }}>
                                                            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                                <Text strong style={{ display: 'block' }}> Return Flight </Text>
                                                                <Text style={{ display: 'block' }}> {moment(summaryReturnFlight.flightdate).format("DD MMMM YYYY")} &nbsp;{(summaryReturnFlight.peakseasonstatus) ? <Text type="warning">Peak Season Period</Text> : null} </Text>
                                                                <Text style={{ display: 'block' }}>
                                                                    {
                                                                        (selectFlightReturn !== null) ? `${summaryReturnFlight.origin} - ${summaryReturnFlight.destination}
                                                                            / ${summaryReturnFlight.airlinecode} / ${summaryReturnFlight.compartmentcode} / ${summaryReturnFlight.bookingclasscode} (x${adultpassenger})` : '-'
                                                                    }
                                                                </Text>
                                                                <Text style={{ display: 'block', marginLeft: 30 }}>
                                                                    {
                                                                        (mileageReturn) ? `@${formatNumber(mileageReturn)} x ${adultpassenger}` : " "
                                                                    }
                                                                </Text>
                                                                <Text style={{ display: 'block' }}>
                                                                    {
                                                                        (promocoderetr) ? `Promo ${promocoderetr}` : " "
                                                                    }
                                                                </Text>
                                                            </Col>
                                                            {/* set total mileage of activity */}
                                                            <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right' }}>
                                                                {(selectFlightReturn !== null) ? formatNumber(mileageReturn * adultpassenger) : ""}
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right', marginTop: 63 }}>
                                                                {(totaldiscountretr) ? `- ${formatNumber(totaldiscountretr * adultpassenger)}` : (!totaldiscountretr) ? "" : ""}
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ display: 'block', marginLeft: 30 }}>
                                                                <Text style={{ display: 'block' }}>
                                                                    {(discountretr && discounttyperetr === "PERCENTAGE" && totaldiscountretr) ? `(Disc ${discountretr}%) @${formatNumber(totaldiscountretr)} x ${adultpassenger}` :
                                                                        (discountretr && discounttyperetr === "MILEAGE" && totaldiscountretr) ? `(Disc ${discountretr} Miles) @${formatNumber(totaldiscountretr)} x ${adultpassenger}` : ''}
                                                                </Text>
                                                            </Col>
                                                        </Row>
                                                        : null
                                                }
                                                <Row style={{ paddingTop: '16px', borderTop: '1px solid #e8e8e8', marginTop: '12px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                        <Text strong>Total Mileage</Text>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ textAlign: 'right' }}>
                                                        {
                                                            (totalafterdiscountdepr !== null && totalafterdiscountretr === null) ? formatNumber((totalafterdiscountdepr + mileageReturn) * adultpassenger) :
                                                                (totalafterdiscountretr !== null && totalafterdiscountdepr === null) ? formatNumber((totalafterdiscountretr + mileageDeparture) * adultpassenger) :
                                                                    (totalafterdiscountdepr !== null && totalafterdiscountretr !== null) ? formatNumber((totalafterdiscountdepr + totalafterdiscountretr) * adultpassenger) :
                                                                        (totalafterdiscountdepr === null && totalafterdiscountretr === null) ? formatNumber((mileageDeparture + mileageReturn) * adultpassenger) : '-'
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card>
                                            <Button htmlType="button" type="primary" block style={{ marginTop: '20px' }} disabled={((!roundtrip && selectFlightDeparture !== null) ||
                                                (roundtrip && selectFlightDeparture !== null && selectFlightReturn !== null)) ? false : true} label='Update Request' onClick={this.showSave} />
                                            <Button htmlType="button" type="default" block style={{ marginTop: '20px' }} onClick={this.props.handleBackSearchFlight} label='Back to Search Flight' />
                                        </div>
                                    </Affix>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
