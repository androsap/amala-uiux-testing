import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { getProfile } from '../../../../utilities/AuthService';
import { connect } from "react-redux";
import { SalutationSelect, Alert, SelectBase, SwitchButton, InputText, Button, DateRangeBase, ErrorGeneral } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal, Affix, Button as AntButton, Card, Tooltip, Alert as AlertAnt } from 'antd';
import { formatNumber, getTravelerType } from '../../../../utilities/Helpers';
import moment from 'moment';
import UsePromoNonair from '../voucher/UsePromoNonair';
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
            formrender: true,
            fieldvalue: {},
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
            awardinfo: {},
            pricingby: null,
            fixprice: null,
            quantity: 0,
            visible: null,
            cardnumber: this.props.cardnumber,
            totalafterdiscount: null,
            showsave: false

        }
    }

    componentDidMount() {
        const { quantity, redeemuser } = this.props.result.reqdatas;
        const { certificateprice, familyname, memberiduser, name, selfusage, travelertype, activitydate } = redeemuser[0] || redeemuser;
        const checkoutdate = (moment(activitydate) < moment()) ? moment().add(quantity, 'days') : moment(activitydate).add(quantity, 'days');
        const checkindate = (moment(activitydate) < moment()) ? moment() : moment(activitydate);
        this.props.form.setFieldsValue({
            certificateprice, [`passenger-familyname0`]: familyname, [`passenger-memberid0`]: memberiduser, [`passenger-name0`]: name,
            selfusage, [`passenger-travelertype0`]: travelertype, date: [checkindate, checkoutdate]
        });
        this.setState({ quantity })
        this.getDetail(this.props.awardcode);
    }

    getDetail = (awardcode) => {
        let url = api.url.awardmaster.detailbasicinfo;
        let data = { awardcode };
        //call loader
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let awardinfo = result;
                let pricingby = (result.pricingby) ? result.pricingby : null;

                if (pricingby === 'FIXED') { this.getFixPrice(awardcode); }
                this.setState({ awardinfo, pricingby, formrender: true });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    getFixPrice = (awardcode) => {
        let url = api.url.awardmaster.detailfixedprice;
        let data = { awardcode };
        //call loader
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let fixprice = (result.fixprice !== undefined) ? result.fixprice : null;

                this.setState({ fixprice, formrender: true });
                this.props.form.setFieldsValue({ price: fixprice });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();

        const callback = (input) => {
            this.setState({ isLoading: true, showsave: false });
            const { result, awardcode } = this.props;
            const { referenceid, requestid, requeststatus, requesttype, memberid, approvalby, approvaldate, reqdata, createdBy, isdataactive, reqdatas } = result;
            const { categorycode } = reqdatas;
            let checkin = (input.date && input.date[0]) ? new Date(moment(input.date[0]).format("YYYY,MM,DD")) : null;
            let checkout = (input.date && input.date[1]) ? new Date(moment(input.date[1]).format("YYYY,MM,DD")) : null;
            const { totalafterdiscount } = this.state;
            let promocode = (this.state.promocode) ? this.state.promocode : null;
            let channelapp = "amalabo";
            let username = getProfile().username;
            let issueddate = moment().format("YYYY-MM-DD");
            let differentInDays = checkout.getTime() - checkin.getTime();
            let quantity = differentInDays / (1000 * 3600 * 24);
            let bookingcode = (input.bookingcode) ? input.bookingcode : null;
            let ticketnumber = null;
            let ticketvaliditydate = null;
            let freeaward = false;
            let price = input.price;
            let totalprice = (totalafterdiscount !== null) ? (totalafterdiscount * quantity) : (price * quantity);
            let redeemairactivity = null;
            let remark = (input.remark) ? input.remark : null;
            let redeemuser = [];
            redeemuser.push({
                name: input[`passenger-name0`],
                familyname: input[`passenger-familyname0`],
                salutationcode: input[`passenger-salutationcode0`],
                memberiduser: input[`passenger-memberid0`],
                travelertype: input[`passenger-travelertype0`],
                selfusage: (input.selfusage) ? input.selfusage : false,
                certificateprice: (totalafterdiscount !== null) ? totalafterdiscount : price,
                activitydate: (checkin) ? moment(input.date[0]).format("YYYY-MM-DD") : null
            })

            let url = api.url.requestapproval.update;
            let data = {
                referenceid, requestid, requeststatus, requesttype, memberid, approvalby, approvaldate, remark, reqdata, createdBy, isdataactive, reqdatas: {
                    url: 'redemption/transaction/v1.2/buyaward', promocode, channelapp, awardcode, issueddate, quantity, memberid, username, bookingcode, ticketnumber, ticketvaliditydate, freeaward,
                    totalprice, redeemuser, redeemairactivity, remark, return: null, categorycode
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
            });
        }
        this.props.form.validateFieldsAndScroll((err, input) => {
            const { promocode } = this.state;
            if (!err) {
                if (promocode) {
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
        // let salutationcode = (selfusage) ? this.props.profile.salutationcode : undefined;
        let name = (selfusage) ? this.props.result.reqdatas.redeemuser[0].name : undefined;
        let familyname = (selfusage) ? this.props.result.reqdatas.redeemuser[0].familyname : undefined;
        let memberid = (selfusage) ? this.props.result.reqdatas.redeemuser[0].memberiduser : undefined;
        let travelertype = (selfusage) ? this.props.result.reqdatas.redeemuser[0].travelertype : undefined;

        this.props.form.setFieldsValue({
            // [`passenger-salutationcode0`]: salutationcode,
            [`passenger-name0`]: name,
            [`passenger-familyname0`]: familyname,
            [`passenger-travelertype0`]: travelertype,
            [`passenger-memberid0`]: ((selfusage) ? `${memberid}` : undefined)
        });
    }

    handleDate = (value) => {
        let checkin = (value && value[0]) ? new Date(moment(value[0]).format("YYYY,MM,DD")) : 0;
        let checkout = (value && value[1]) ? new Date(moment(value[1]).format("YYYY,MM,DD")) : 0;
        let differenceInDays = 0;
        if (checkin && checkout) {
            differenceInDays = checkout.getTime() - checkin.getTime();
            var quantity = differenceInDays / (1000 * 3600 * 24)

            this.setState({ quantity });
        }
    }

    handleValidationDate = (rule, value, callback) => {
        let checkin = (value && value[0]) ? new Date(moment(value[0]).format("YYYY,MM,DD")) : null;
        let checkout = (value && value[1]) ? new Date(moment(value[1]).format("YYYY,MM,DD")) : null;
        let differenceInDays = 0;
        if (checkin && checkout) {
            differenceInDays = checkout.getTime() - checkin.getTime();
            var quantity = differenceInDays / (1000 * 3600 * 24)
            if (quantity === 0) {
                callback('Check-in cannot be the same as check-out');
            }
        }
        callback();
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

    handleOpenModal = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err) => {
            if (!err) {
                const { quantity } = this.state;
                if (quantity > 0) this.setState({ visible: true });
            }
        });
    }

    handleCloseModal = () => {
        this.setState({ visible: false, showsave: false });
    };

    handleOk = (codepromo) => {
        this.setState({ visible: false });
        this.props.form.setFieldsValue({ codepromo });
    }

    setStateOfParent = (totalafterdiscount, promocode, catalogname, discount, discounttype, totaldiscount) => {
        this.setState({ totalafterdiscount, promocode, catalogname, discount, discounttype, totaldiscount });
    }

    handleCancelPromo = () => {
        this.setFieldsValue({ codepromo: undefined });
        this.setState({
            promocode: null, summarydiscount: 0, summaryafterdiscount: 0, totaldiscount: null,
            totalafterdiscount: null, catalogname: null, discount: null, discounttype: null
        });
        this.props.form.setFieldsValue({ codepromo: undefined });
    }

    getPromoUsage = (callback, input) => {
        const { promocode } = this.state;
        let memberid = this.props.match.params.ID;
        let url = api.url.redeempromo.getusagepromo;
        let promo = [promocode];
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
        const { promocode } = this.state || {}
        if (promoUsageStatus[0].status === true) {
            if (promocode) {
                this.getPromo(promocode)
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
            const { promocode } = this.state
            if (promocode && !promoUsageStatus[0].status) this.handleCancelPromo();
            warning({ title: 'Promo Unavailable, Normal Price will be Charged.' })
        }
    }

    getPromo = (codepromo) => {
        const { awardinfo, quantity, cardnumber } = this.state;
        let price = this.props.form.getFieldValue('price');
        const { awardcode, partnercode, startdate, categorytype } = awardinfo || {};
        let url = api.url.redeempromo.getpromo;
        let data = {
            "promocode": codepromo,
            "promotype": categorytype,
            "cardnumber": cardnumber,
            "channel": "amalabo",
            "awardcode": awardcode,
            "total": price,
            "checkdate": true,
            "nonairactivity": {
                "partnercode": partnercode,
                "activitydate": moment(startdate).format('YYYY-MM-DD'),
                "quantity": quantity
            }
        };
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === "0000") {
                var promoData = [];
                var key = 0;
                for (const field in result) {
                    promoData[key] = {};
                    promoData[key]['discount'] = result[field].discount;
                    promoData[key]['promocode'] = result[field].promocode;
                    promoData[key]['catalogname'] = result[field].catalogname;
                    promoData[key]['discounttype'] = result[field].discounttype;
                    promoData[key]['totaldiscount'] = result[field].totaldiscount;
                    promoData[key]['totalafterdiscount'] = result[field].totalafterdiscount;
                    promoData[key]['enddate'] = (!result[field].unlimitedperiod) ? moment(result[field].enddate).format('DD/MM/YYYY') : "Unlimited";
                    key++;
                }
                this.setState({
                    discount: promoData[0].discount,
                    promocode: promoData[0].promocode,
                    discounttype: promoData[0].discounttype,
                    totaldiscount: promoData[0].totaldiscount,
                    summarydiscount: promoData[0].summarydiscount,
                    totalafterdiscount: promoData[0].totalafterdiscount,
                    summaryafterdiscount: promoData[0].summaryafterdiscount,
                    responsemessage
                });
            } else {
                Alert.error(responsemessage);
                this.handleCancelPromo()
            }
            this.setState({ isLoading: false });
        });
    }

    handlePromoCode = (e) => {
        let promocode = this.props.form.getFieldValue('codepromo') ? this.props.form.getFieldValue('codepromo') : null;
        if (promocode !== null) {
            if (e.key === 'Enter') {
                this.getPromo(promocode)
            }
        } else {
            Alert.error('Promocode cannot be empty')
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
        const { isSuccessBuy, showsave, formrender, awardinfo, pricingby, promocode, quantity, visible, isLoading, cardnumber, totalafterdiscount, discount, discounttype, totaldiscount } = this.state;

        let selfusage = this.props.form.getFieldValue('selfusage');
        let price = this.props.form.getFieldValue('price');
        price = (price) ? price : 0;
        let totalMileage = quantity * price;
        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }

        if (isSuccessBuy) {
            return (<Redirect to={{ pathname: '/my-approval' }} />)
        } else {
            return (
                <Row>
                    <Modal visible={visible} title="Use Promo" loading={isLoading} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={680}>
                        <UsePromoNonair onClose={this.handleOk} {...this.props} setStateOfParent={this.setStateOfParent} awardinfo={awardinfo} quantity={quantity} price={price} pricingby={pricingby} cardnumber={cardnumber} />
                    </Modal>
                    <Modal visible={showsave} footer={null} onCancel={this.handleCloseModal} destroyOnClose={true} width={400}>
                        <SaveForm {...this.props} onOk={this.saveAction} onClose={this.handleCloseModal} />
                    </Modal>

                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={16} xl={16}>
                                    <Row>
                                        <Divider>Member Data</Divider>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                            <SwitchButton wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Self Usage" datafield="selfusage" onChange={this.handleSelfUsageChange} />
                                            <SalutationSelect wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} ref={(e) => { this.componentSalutationSelect = e }} form={this.props.form} labeltext="Salutation" datafield={"passenger-salutationcode0"} disabled={selfusage} />
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Name" datafield={"passenger-name0"} validationrules={['required', 'pattern.letterspace']} maxLength={45} disabled={selfusage} />
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Family Name" datafield={"passenger-familyname0"} validationrules={['required', 'pattern.letter']} maxLength={45} disabled={selfusage} />
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="GarudaMiles ID" datafield={"passenger-memberid0"} disabled={selfusage} validationrules={['pattern.number']} maxLength={16} />
                                            <SelectBase wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Traveler Type" datafield={"passenger-travelertype0"} validationrules={['required']} options={optionsTravelerType} disabled={selfusage} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Divider>Confirmation</Divider>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Booking Code" datafield="bookingcode" validationrules={['pattern.alphanumeric']} maxLength={50} />
                                            <DateRangeBase wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Date" datafield="date" placeholder={['Check in', 'Check out']} validationrules={['required', this.handleValidationDate]} minDate={moment()} onChange={this.handleDate} />
                                        </Col>
                                        <Col className="gutter-row" xs={20} sm={20} md={20} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                            <InputText wrapperCol={{ span: 13 }} labelCol={{ span: 10 }} form={this.props.form} labeltext="Price" datafield="price" validationrules={['required', 'pattern.number']} maxLength={11} disabled={(pricingby === 'FIXED') ? true : false} />
                                        </Col>
                                        {(promocode) ?
                                            <Col className={''} xs={24} sm={24} md={24} lg={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }} style={{ paddingLeft: "150px", paddingRight: "90px" }}>
                                                <AlertAnt showIcon message={`Promo ${promocode} used`} type="success" style={{ marginBottom: '10px' }}
                                                    closeText="Cancel Promo" afterClose={() => this.handleCancelPromo()} />
                                            </Col>
                                            : null}
                                        <Col className="gutter-row" xs={14} sm={14} md={14} lg={{ span: 14, offset: 3 }} xl={{ span: 14, offset: 3 }} >
                                            <Row gutter={8} type="flex" justify="end">
                                                <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 11 }} form={this.props.form} labeltext="Input Promo Code" datafield="codepromo" placeholder="Ex. air00020" maxLength={20} onPressEnter={this.handlePromoCode} disabled={(quantity) ? false : true} />
                                                <Button htmlType="button" size="medium" label="List Promo" onClick={(e) => this.handleOpenModal(e)} style={{ marginTop: 5, }} />
                                            </Row>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                            <InputText wrapperCol={{ span: 10 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Remark" datafield="remark" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8} style={{ padding: '0 10px' }}>
                                    <Affix offsetTop={30}>
                                        <div>
                                            <Card title="Award Information" bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                        Award Code
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        <Tooltip title={(awardinfo.awardcode) ? awardinfo.awardcode : '-'}>
                                                            {(awardinfo.awardcode) ?
                                                                (awardinfo.awardcode.length > 12) ? awardinfo.awardcode.substring(0, 12) + '...' : awardinfo.awardcode
                                                                : '-'}
                                                        </Tooltip>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                        Award Type
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(awardinfo.awardtypecode) ? awardinfo.awardtypecode : '-'}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                        Partner
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(awardinfo.partnername) ? awardinfo.partnername : '-'}
                                                    </Col>
                                                </Row>
                                            </Card>
                                            <Card title="Price Details" bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginTop: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                        <Tooltip title={(awardinfo.awardcode) ? awardinfo.awardcode : '-'}>
                                                            {
                                                                (awardinfo.awardcode) ?
                                                                    (awardinfo.awardcode.length > 12) ?
                                                                        awardinfo.awardcode.substring(0, 12) + '...' : awardinfo.awardcode : '-'
                                                            }
                                                        </Tooltip>
                                                        <Text style={{ display: 'block', marginLeft: 30, }}>
                                                            {
                                                                (totalMileage) ? `@${formatNumber(price)} x ${quantity}` : " "
                                                            }
                                                        </Text>
                                                        <Text style={{ display: 'block' }}>
                                                            {
                                                                (promocode) ? `Promo ${promocode}` : " "
                                                            }
                                                        </Text>
                                                        <Text style={{ display: 'block', marginLeft: 30 }}>
                                                            {(discount && discounttype === "PERCENTAGE") ? `(Disc ${discount}%) @${formatNumber(totaldiscount)} x ${quantity}` :
                                                                (discount && discounttype === "MILEAGE") ? `(Disc ${discount} Miles) @${formatNumber(totaldiscount)} x ${quantity}` : ''}
                                                        </Text>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={6} xl={8} style={{ textAlign: 'right', }}>
                                                        {(price && quantity > 0) ? formatNumber(price * quantity) : "-"}
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={6} xl={8} style={{ textAlign: 'right', marginTop: 22 }}>
                                                        {(totalafterdiscount) ? `- ${formatNumber(totaldiscount * quantity)}` : (!totalafterdiscount) ? "" : ""}
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: '16px', borderTop: '1px solid #e8e8e8', marginTop: '12px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                        <Text strong>Total Mileage</Text>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'right' }}>
                                                        {(price && totalafterdiscount !== null) ? <Text strong>{formatNumber(totalafterdiscount * quantity)}</Text> :
                                                            (price && totalafterdiscount === null && quantity > 0) ? <Text strong>{formatNumber(price * quantity)}</Text> :
                                                                (price && totalafterdiscount === null && quantity > 0 && (price <= totaldiscount)) ? '0' : '-'}
                                                    </Col>
                                                </Row>
                                            </Card>
                                            <AntButton htmlType="button" type="primary" block style={{ marginTop: '20px' }} onClick={this.showSave} > Update Request </AntButton>
                                        </div>
                                    </Affix>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row >
            )
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));