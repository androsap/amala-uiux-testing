import React, { Component } from 'react';
import { DetailRequest, SaveRequest, RetrieveRequest } from '../../../../../utilities/RequestService';
import { api } from '../../../../../config/Services';
import { connect } from "react-redux";
import { InputText, Button, Alert, PartnerSelect, DatePickerBase, PartnerLocationSelect, ActivityCodeSelect } from '../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Empty, Tooltip, Icon, Table, Modal } from 'antd';
import ErrorGeneral from '../../../../error/ErrorGeneral';
import moment from 'moment';
import { formatNumber } from '../../../../../utilities/Helpers';
import EligibleList from './EligibleList';

const { Title } = Typography;
const { Column } = Table;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            requestEligible: {},
            selectedRowKey: [],
            visible: false,
            isLoading: false,
            fieldvalue: {
                activitystatus: null,
                transactioninfo: [],
                activityinfo: null,
                trxtype: null,
                active: false,
                activityvolumefromnonairrule: null,
                useactivityvolume: false,
                activitytype: 'nonair',
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                partnerlocationfielddisabled: true,
                activitycodefielddisabled: true
            },
            actionType: null
        }
    };

    checkPermission() {
        let id = this.props.match.params.activityid;
        const { menucode, permission, prefixmenuname, memberlock } = this.props;
        const { usermenu } = permission;
        const { blockaccrual } = memberlock || {};
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || blockaccrual) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentPartnerSelect.retrieveData({ partnertype: 'NONAIR' });
            }
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = (activityid, actionspage) => {
        let url = api.url.memberactivity.detail;
        let data = { activityid };

        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                const { activityidpromo, activityinfo, cardnumbersender, reftrxid } = result || {};

                let activitydate = (result.activitydate) ? moment(result.activitydate) : null;
                let partnercode = (result.partnercode) ? result.partnercode : null;
                let partnername = (result.partnername) ? result.partnername : null;
                let partnerlocationcode = (result.partnerlocationcode) ? result.partnerlocationcode : null;
                let partnerlocationname = (result.partnerlocationname) ? result.partnerlocationname : null;
                let activitycode = (result.activitycode) ? result.activitycode : null;
                let activityname = (result.activityname) ? result.activityname : null;
                let promocode = (result.promocode) ? result.promocode : undefined;
                let promoref = (result.promoref) ? result.promoref : undefined;
                let promodate = (result.promodate) ? moment(result.promodate) : null;
                let activityvolume = (result.activityvolume !== undefined) ? result.activityvolume.toString() : undefined;
                let refcode = (result.refcode) ? result.refcode : undefined;
                let refdate = (result.refdate) ? moment(result.refdate) : undefined;
                let salesoffice = (result.salesoffice) ? result.salesoffice : undefined;
                let paymentcardnumber = (result.paymentcardnumber) ? result.paymentcardnumber : undefined;

                let transactioninfo = (result.transactioninfo !== undefined && result.transactioninfo.length) ? result.transactioninfo.filter(val => val.trxtype === 'EARNING') : [];
                let awardmiles = (result.transactioninfo[0]) ? result.transactioninfo[0].awardmiles.toString() : 0;
                let tiermiles = (result.transactioninfo[0]) ? result.transactioninfo[0].tiermiles.toString() : 0;

                let trxid = (transactioninfo[0]) ? transactioninfo[0].trxid : "";
                let trxdate = (transactioninfo[0]) ? moment(transactioninfo[0].trxdate) : null;
                let trxtype = (transactioninfo[0]) ? transactioninfo[0].trxtype : null;
                let correctionawardmiles = (transactioninfo[0]) ? transactioninfo[0].awardmiles : 0;
                let correctiontiermiles = (transactioninfo[0]) ? transactioninfo[0].tiermiles : 0;
                let frequency = (transactioninfo[0]) ? transactioninfo[0].frequency : 0;
                let active = (transactioninfo[0]) ? transactioninfo[0].active : null;

                let activitystatus = (result.status) ? result.status : undefined;
                const { blockaccrual } = this.props.memberlock || {};
                if (activitystatus === 'INACTIVE' || blockaccrual) {
                    let titlepage = 'View';
                    let specialfielddisabled = true;
                    let generalfielddisabled = true;
                    let partnerlocationfielddisabled = true;
                    let activitycodefielddisabled = true;
                    this.setState({ titlepage, fielddisabled: { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled, partnerlocationfielddisabled, activitycodefielddisabled } });
                };

                this.setState({ fieldvalue: { ...this.state.fieldvalue, transactioninfo, active, trxtype, trxid, activitystatus, activityidpromo, activityinfo } });
                this.props.form.setFieldsValue({
                    activitydate, partnercode, partnerlocationcode, activitycode, activityname, promocode, promoref, promodate, activityvolume,
                    refcode, refdate, salesoffice, paymentcardnumber, trxid, trxdate, trxtype, cardnumbersender,
                    correctionawardmiles, correctiontiermiles, frequency, awardmiles, tiermiles, reftrxid
                });

                if (activityidpromo) this.getActivityIDPromoDetail(activityidpromo);
                this.retrieveAccrualNonAir({ activitycode }, activitydate);
                this.componentPartnerSelect.retrieveData({}, { partnercode, partnername }, actionspage);
                this.componentPartnerLocationSelect.retrieveData({ partnercode }, { partnerlocationcode, partnerlocationname }, actionspage);
                this.componentActivitySelect.retrieveData({ partnercode }, { activitycode, activityname: activitycode }, actionspage);

                RetrieveRequest(api.url.activitycode.list, { activitycode }).then((response) => {
                    const { status, result } = response;
                    if (status.responsecode === '0000') {
                        const isAccelerator = result && result[0].nonairactivitytype === 'ACCELERATOR';

                        if (isAccelerator) {
                            this.setState({
                                titlepage: 'View',
                                actionspage: 'view',
                                fielddisabled: { ...this.state.fielddisabled, generalfielddisabled: true, partnerlocationfielddisabled: true }
                            });
                        }
                    }
                });

                setTimeout(() => {
                    let nonairactivitytype = this.componentActivitySelect.getValue(activitycode, 'nonairactivitytype');
                    this.setState({ nonairactivitytype, isLoading: false });
                }, 500);

            } else this.setState({ isLoading: false, responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
        });
    };

    saveAction = (e, type) => {
        e.preventDefault();
        const { actionspage, fieldvalue } = this.state;
        const { useactivityvolume } = fieldvalue;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true, actionType: type });

                const { cardnumbersender } = input || {};

                let memberid = this.props.match.params.ID;
                let activityid = this.props.match.params.activityid;
                let activitydate = (input.activitydate && input.activitydate) ? moment(input.activitydate).format("YYYY-MM-DD") : null;
                let partnercode = input.partnercode;
                let partnerlocationcode = input.partnerlocationcode;
                let activitycode = input.activitycode;
                let promocode = (input.promocode && input.promocode.length > 0) ? input.promocode : null;
                let promoref = (input.promoref && input.promoref.length > 0) ? input.promoref : null;
                let promodate = (input.promodate) ? moment(input.promodate).format("YYYY-MM-DD") : null;
                let activityvolume = (!useactivityvolume) ? '0' : (input.activityvolume && input.activityvolume.length > 0) ? input.activityvolume : null;
                let cardnumber = (input.cardnumber && input.cardnumber.length > 0) ? input.cardnumber : null;
                let refcode = (input.refcode && input.refcode.length > 0) ? input.refcode : null;
                let refdate = (input.refdate) ? moment(input.refdate).format("YYYY-MM-DD") : null;
                let salesoffice = (input.salesoffice && input.salesoffice.length > 0) ? input.salesoffice.toUpperCase() : null;
                let paymentcardnumber = (input.paymentcardnumber && input.paymentcardnumber.length > 0) ? input.paymentcardnumber : null;
                let activityinfo = 'RATED';
                let namecheck = (type === 'rating-name') ? true : false;
                let awardmiles = (useactivityvolume) ? 0 : (input.awardmiles !== undefined) ? input.awardmiles.toString() : '0';
                let tiermiles = (useactivityvolume) ? 0 : (input.tiermiles !== undefined) ? input.tiermiles.toString() : '0';

                let message = '';
                let url = '';
                let data = {};
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.membernonairactivity.createwithrating;
                    data = {
                        activitydate, partnercode, partnerlocationcode, activitycode, promocode, promoref, promodate, activityvolume, awardmiles, tiermiles,
                        cardnumber, memberid, refcode, refdate, salesoffice, paymentcardnumber, namecheck, cardnumbersender
                    }
                } else {
                    message = 'Data has been updated';
                    if (type === 'make-correction') {
                        let basemiles = 0;
                        let classofservicebonus = 0;
                        let elitetierbonusmiles = 0;
                        let promotionalbonusmiles = 0;
                        let newactivityid = null;
                        let customtrxcode = null;
                        let oldactivityid = activityid;
                        let trxdate = moment(new Date()).format("YYYY-MM-DD");
                        let frequency = (input.frequency !== undefined) ? input.frequency : 0;

                        awardmiles = (input.correctionawardmiles !== undefined) ? input.correctionawardmiles : 0;
                        tiermiles = (input.correctiontiermiles !== undefined) ? input.correctiontiermiles : 0;
                        newactivityid = activityid;

                        url = api.url.membertransaction.earningcorrection;
                        data = {
                            memberid, oldactivityid, newactivityid, activitycode, customtrxcode, trxdate, awardmiles, tiermiles, frequency, basemiles,
                            classofservicebonus, elitetierbonusmiles, promotionalbonusmiles
                        }
                    } else {
                        url = api.url.membernonairactivity.updatewithrating;
                        data = {
                            activityid, activityinfo, activitydate, partnercode, partnerlocationcode, activitycode, promocode, promoref, promodate,
                            activityvolume, awardmiles, tiermiles, refcode, refdate, memberid, salesoffice, paymentcardnumber, namecheck, cardnumber
                        };
                    }
                }
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                        this.props.history.push('/member/form/' + this.props.match.params.ID + '/activity');
                    } else {
                        if (responsemessage !== "Insufficient balance") Alert.error(responsemessage);
                        if (responsemessage === "Insufficient balance") this.popUpInfo();
                        this.setState({ isLoading: false });
                    }
                })
            }
        });
    };

    getActivityIDPromoDetail = (activityidpromo) => {
        this.setState({ isLoading: true });

        DetailRequest(api.url.memberactivity.detail, { activityid: activityidpromo }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    const { activitytype } = result || {};
                    const fieldvalue = { ...this.state.fieldvalue, activitytype: activitytype.replaceAll('_', '').toLowerCase() };

                    this.setState({ fieldvalue, isLoading: false });
                };
            };
        });
    };

    popUpInfo() {
        Modal.info({
            title: 'Information',
            content: 'Insufficient Balance',
        });
    }

    handlePartnerChange = (partnercode) => {
        let partnerlocationcode = undefined;
        let activitycode = undefined;
        let partnerlocationfielddisabled = (partnercode) ? false : true;
        let activitycodefielddisabled = (partnercode) ? false : true;

        this.componentPartnerLocationSelect.retrieveData({ partnercode });
        this.componentActivitySelect.retrieveWithData({ partnercode }, {}, '', { excludenonairactivitytype: ["ACCELERATOR"] });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, partnerlocationfielddisabled, activitycodefielddisabled } });
        this.props.form.setFieldsValue({ partnerlocationcode, activitycode });
        this.props.form.resetFields(['awardmiles', 'tiermiles', []]);
    };

    retrieveAccrualNonAir = (criteria, activitydate) => {
        let paging = { limit: -1, page: 1 }
        let sort = { activityname: 'asc' };
        let url = api.url.accrualrulenonair.list;
        criteria.active = true;
        let column = [];
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { result } = response;
            if (response.status.responsecode.substring(0, 1) === '0') {
                // callback(result);

                let rule = result.filter(item => {
                    let startdate = moment(item.startdate);
                    let enddate = moment(item.enddate);
                    return activitydate >= startdate && activitydate <= enddate;
                });
                let activityvolumefromnonairrule = (rule[0] && rule[0]['activityvolume']) ? rule[0]['activityvolume'] : null;
                let useactivityvolume = (rule[0] && rule[0]['useactivityvolume']) ? rule[0]['useactivityvolume'] : false;
                this.setState({ fieldvalue: { ...this.state.fieldvalue, activityvolumefromnonairrule, useactivityvolume } });
            } else {
                Alert.error(response.status.responsemessage);
            }
        })
    };

    handleActivityDateChange = (activitydate) => {
        let activitycode = this.props.form.getFieldValue('activitycode');
        if (activitycode && activitydate) {
            this.retrieveAccrualNonAir({ activitycode }, activitydate);
        }
    };

    handleActivityCodeChange = (activitycode) => {
        let nonairactivitytype = this.componentActivitySelect.getValue(activitycode, 'nonairactivitytype');
        this.props.form.resetFields(['awardmiles', 'tiermiles', []]);
        this.setState({ nonairactivitytype });

        let activitydate = this.props.form.getFieldValue('activitydate');
        if (activitydate && activitycode) {
            this.retrieveAccrualNonAir({ activitycode }, activitydate);
        }
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = (totalawardmiles) => {
        this.setState({ visible: false });
        if (typeof totalawardmiles === 'number') this.props.form.setFieldsValue({ awardmiles: totalawardmiles })
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, fieldvalue, fielddisabled, isLoading, nonairactivitytype, requestEligible, selectedRowKey, visible } = this.state;
        const { activityvolumefromnonairrule, useactivityvolume, activitystatus, activityidpromo, activitytype } = fieldvalue;
        const { generalfielddisabled, partnerlocationfielddisabled, activitycodefielddisabled } = fielddisabled;
        const { menucode, prefixmenuname, cardnumber, match } = this.props;
        const activitycode = this.props.form.getFieldValue('activitycode')
        let smallWidthScreen = (window.innerWidth < 992 && window.innerWidth > 767);

        if (formrender) {
            return (
                <>
                    <Row>
                        <Row>
                            <Col xs={24} xl={22}>
                                <Title level={4}>{titlepage} Non Air Activity</Title>
                            </Col>
                            <Divider />
                        </Row>
                        <Spin spinning={this.state.isLoading}>
                            <Form {...formItemLayout}>
                                <Row gutter={24}>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                        <DatePickerBase form={this.props.form} labeltext="Activity Date" datafield="activitydate" validationrules={['required']} onChange={this.handleActivityDateChange} maxDate={moment()} disabled={generalfielddisabled} />
                                        {(actionspage !== 'create') ? <InputText form={this.props.form} labeltext="Activity" datafield="activityname" disabled={true} /> : null}
                                        {(actionspage !== 'create' && activityidpromo) ? <Form.Item label="Activity ID Promo">
                                            <Tooltip title={'Activity ID Promo Reference'}>
                                                <a href={`/member/form/${match.params.ID}/activity/${activitytype}/form/${activityidpromo}`}>{activityidpromo}</a>
                                            </Tooltip>&nbsp;&nbsp;&nbsp;
                                            <Icon type="link" style={{ color: '#03a9f4' }} />
                                        </Form.Item> : null}
                                        <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} onChange={this.handlePartnerChange} disabled={actionspage === 'create' ? generalfielddisabled : true} />
                                        <PartnerLocationSelect ref={(e) => { this.componentPartnerLocationSelect = e }} form={this.props.form} labeltext="Partner Location" datafield="partnerlocationcode" validationrules={[]} disabled={partnerlocationfielddisabled} />
                                        <ActivityCodeSelect ref={(e) => { this.componentActivitySelect = e }} form={this.props.form} labeltext="Activity Code" datafield="activitycode" validationrules={['required']} onChange={this.handleActivityCodeChange} disabled={actionspage === 'create' ? activitycodefielddisabled : true} />
                                        <InputText form={this.props.form} labeltext="Promo Code" datafield="promocode" validationrules={['pattern.alphanumericspace', 'max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext="Promo Reference" datafield="promoref" validationrules={['pattern.alphanumericspace', 'max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                        <DatePickerBase form={this.props.form} labeltext="Promotion Date" datafield="promodate" disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext="Activity Volume" datafield="activityvolume" validationrules={(useactivityvolume) ? ['required', 'pattern.number', 'max.9'] : ['pattern.number', 'max.9']} maxLength={9} className={(useactivityvolume) ? '' : 'hidden'} extra={(useactivityvolume) ? "Activity volume must be a multiple of " + activityvolumefromnonairrule : null} disabled={generalfielddisabled} />
                                        {nonairactivitytype === 'REINSTATE' || nonairactivitytype === 'EXTEND' ?
                                            <Row gutter={24}>
                                                <Col className="gutter-row" xs={24} sm={{ span: (smallWidthScreen) ? 13 : 16, push: (smallWidthScreen) ? 0 : 2 }} md={{ span: 20, pull: 1 }} lg={{ span: 18, push: 1 }} style={{ marginLeft: 7 }} >
                                                    <InputText form={this.props.form} labelCol={{ sm: 9, md: 11, lg: 9 }} wrapperCol={{ sm: 15, md: 13, lg: 14 }} labeltext="Total Miles" datafield="awardmiles" validationrules={(nonairactivitytype === 'REINSTATE' || nonairactivitytype === 'EXTEND') ? ['pattern.number', 'required'] : []} disabled={true} />
                                                </Col>
                                                {
                                                    <Col className="gutter-row" xs={24} sm={{ span: 3, push: (smallWidthScreen) ? 0 : 2 }} md={{ span: 4, pull: 1 }} lg={{ span: 6, push: 1 }} style={{ lineHeight: '40px', marginLeft: -24 }}>
                                                        <Button type='primary' htmlType="button" label='Choose Miles' onClick={this.showModal} />
                                                    </Col>
                                                }
                                            </Row>
                                            :
                                            <InputText form={this.props.form} labeltext="Award Miles" datafield="awardmiles" validationrules={(useactivityvolume || nonairactivitytype === 'REINSTATE' || nonairactivitytype === 'EXTEND') ? ['pattern.number', 'max.11'] : ['required', 'pattern.number', 'max.11']} maxLength={11} className={(useactivityvolume || nonairactivitytype === 'REINSTATE' || nonairactivitytype === 'EXTEND') ? 'hidden' : ''} disabled={generalfielddisabled} />
                                        }
                                        <InputText form={this.props.form} labeltext="Tier Miles" datafield="tiermiles" validationrules={(useactivityvolume || nonairactivitytype === 'REINSTATE' || nonairactivitytype === 'EXTEND') ? ['pattern.number', 'max.11'] : ['required', 'pattern.number', 'max.11']} maxLength={11} className={(useactivityvolume || nonairactivitytype === 'REINSTATE' || nonairactivitytype === 'EXTEND') ? 'hidden' : ''} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext="Reference Code" datafield="refcode" validationrules={['max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                        <DatePickerBase form={this.props.form} labeltext="Reference Date" datafield="refdate" disabled={generalfielddisabled} />
                                        {
                                            (actionspage !== 'create') ? <InputText form={this.props.form} labeltext="Reference Trx ID" datafield="reftrxid" disabled={true} /> : null
                                        }
                                        <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" defaultValue={cardnumber} disabled={true} />
                                        <InputText form={this.props.form} labeltext="Card Number Sender" datafield="cardnumbersender" disabled={generalfielddisabled} className={nonairactivitytype === 'GIFT' ? '' : 'hidden'} />
                                        <InputText form={this.props.form} labeltext="Sales Office" datafield="salesoffice" validationrules={['pattern.alphabet', 'max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext="Payment Card Number" datafield="paymentcardnumber" validationrules={['pattern.alphanumeric', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                        <Modal visible={visible} title={"Choose Miles"} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={800}>
                                            <EligibleList {...this.props} requestEligible={requestEligible} selectedRowKey={selectedRowKey} cardnumber={cardnumber} activitycode={activitycode} onCancel={this.handleCancel} />
                                        </Modal>
                                    </Col>
                                </Row>
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                    {/* {
                                        (actionspage === 'create') ?
                                            <Button htmlType="button" type="primary" label="Save With Rating (Name Check)" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={(e) => this.saveAction(e, 'rating-name')} />
                                            : (actionspage === 'update') ?
                                                <Button htmlType="submit" type="primary" label="Save With Rating (Name Check)" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'rating-name')} />
                                                : null
                                    } */}
                                    {
                                        (actionspage === 'create') ?
                                            <Button htmlType="button" type="primary" label="Save With Rating" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={(e) => this.saveAction(e, 'rating-no-name')} />
                                            : (actionspage === 'update' && activitystatus !== 'INACTIVE') ?
                                                <Button htmlType="submit" type="primary" label="Save With Rating" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'rating-no-name')} />
                                                : null
                                    }
                                    <Button url={'/' + this.props.match.url.split('/')[1] + '/form/' + this.props.match.params.ID + '/activity'} htmlType="link" type="default" label="Back" className={(actionspage === 'create') ? '' : 'hidden'} />
                                </Row>
                                {/* <Row className={(actionspage === 'create') ? 'hidden' : ''}>
                                    <Divider>Member Transaction</Divider>
                                    <Row className={(transactioninfo.length && trxtype === 'EARNING' && active) ? '' : 'hidden'}>
                                        <Row gutter={24}>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                                <InputText form={this.props.form} labeltext="Transaction ID" datafield="trxid" disabled />
                                                <DatePickerBase form={this.props.form} labeltext="Transaction Date" datafield="trxdate" disabled />
                                                <InputText form={this.props.form} labeltext="Transaction Type" datafield="trxtype" disabled />
                                                <InputText form={this.props.form} labeltext="Award Miles" datafield="correctionawardmiles" validationrules={(actionType === 'make-correction') ? ['required', 'pattern.number'] : ['pattern.number']} disabled={generalfielddisabled} />
                                                <InputText form={this.props.form} labeltext="Tier Miles" datafield="correctiontiermiles" validationrules={(actionType === 'make-correction') ? ['required', 'pattern.number'] : ['pattern.number']} disabled={generalfielddisabled} />
                                                <InputText form={this.props.form} labeltext="Frequency" datafield="frequency" validationrules={(actionType === 'make-correction') ? ['required', 'pattern.number'] : ['pattern.number']} disabled={generalfielddisabled} />
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Row className={(transactioninfo.length && trxtype === 'EARNING' && active) ? 'hidden' : ''}>
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No Transaction Recorded</span>} />
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                        {
                                            (actionspage !== 'view' && transactioninfo.length && trxtype === 'EARNING' && active && activitystatus !== 'INACTIVE') ?
                                                <Button htmlType="submit" type="primary" label="Make Correction" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e, 'make-correction')} />
                                                : null
                                        }
                                        <Button url={'/' + this.props.match.url.split('/')[1] + '/form/' + this.props.match.params.ID + '/activity'} htmlType="link" type="default" label="Back" />
                                    </Row>
                                </Row> */}
                            </Form >
                        </Spin >
                    </Row >
                    {/* <Row>
                    {
                        (actionspage !== 'create' && activityinfo === 'ACTIVITY_RATED') ? <>
                            <Divider orientation="left" style={{ marginTop: '30px' }}>Transaction List</Divider>
                            <Table rowKey={record => record.trxid} dataSource={transactioninfo} size="middle" pagination={false} loading={isLoading} bordered>
                                <Column title="Comment" dataIndex="comment" key="comment" align="center" render={(value) => (value) ? value : '-'} />
                                <Column title="Trx Date" dataIndex="trxdate" key="trxdate" align="center" render={(value) => (value) ? moment(value).format("DD/MM/YYYY") : '-'} />
                                <Column title="Award Miles" dataIndex="awardmiles" key="awardmiles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                                <Column title="Tier Miles" dataIndex="tiermiles" key="tiermiles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                                <Column title="Frequency" dataIndex="Frequency" key="Frequency" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                                <Column title="Tier Miles Renewal" dataIndex="tierrenewal" key="tierrenewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                                <Column title="Frequency Renewal" dataIndex="frequencyrenewal" key="frequencyrenewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                                <Column title="Expired Date" dataIndex={"trxdetail[0].expireddate"} key="trxdetail[0].expireddate" align="center" render={(value) => (value) ? moment(value).format("DD/MM/YYYY") : '-'} />
                                <Column title="Action" render={(_value, row) => {
                                    return (
                                        <Row>
                                            <Button url={'/member/form/' + row.memberid + '/transaction/detail/' + trxid} size="small" title="View" icon="eye" />
                                        </Row>
                                    )
                                }
                                } />
                            </Table> </> : null
                    }
                </Row> */}
                </>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));