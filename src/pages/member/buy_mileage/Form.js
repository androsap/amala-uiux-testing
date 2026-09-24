/**
 * @author Muhamad Humam
 * @email muhamadhumamm17@gmail.com
 * @create date 2020-07-30 13:30:35
 * @modify date 2020-07-30 13:30:48
 * @desc Form Buy Mileage
 */

import React, { Component } from 'react';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, SelectBase, InputText, ErrorGeneral, CurrencySelect, DatePickerBase, RadioButton, InputNumber } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal, Button as AntButton, Table, Affix, Card, Tag } from 'antd';
import moment from 'moment';
import ConfirmationForm from './Confirmation';
import { formatNumber, jsUcfirst } from '../../../utilities/Helpers';

const { confirm } = Modal;
const { Column } = Table;
const { Title, Text } = Typography;

const optionsUnitType = [
    { label: 'Package', value: 'PACKAGE' },
    { label: 'Pieces', value: 'PIECE' }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: '',
            actionspage: 'create',
            isLoading: false,
            formrender: true,
            responseBuyAward: {},
            showpromolist: false,
            showconfirmation: this.props.showconfirmation,
            actionsconfirmationpage: 'confirmation',
            fieldvalue: {
                optionsCatalogue: [],
                basemileage: null,
                price: null,
                numberofmiles: null,
                status: null,
                buymileagedetail: {},
                promoid: null,
                includevat: false,
                vat: null,
                vatamount: null,
                buymileagename: null,
                mileagetype: null,
                unittype: null,
                qty: null,
                totalprice: null,
                totalamount: null,
                promo: {},
                promoprice: null,
                discount: null,
                discountprice: null,
                paymentverificationtimeout: null,
                verifydate: null,
                requestid: null
            },
            fielddisabled: {
                generalfielddisabled: false,
                cataloguefielddisabled: true,
                numberofmilesfielddisabled: true,
                promoidfielddisabled: true,
                buyfielddisabled: true
            }
        }

        this.handleBuyDateChange = this.handleBuyDateChange.bind(this);
        this.handleCurrencyCodeChange = this.handleCurrencyCodeChange.bind(this);
        this.handleUnitTypeChange = this.handleUnitTypeChange.bind(this);
        this.handleCatalogueChange = this.handleCatalogueChange.bind(this);
        this.getCatalogue = this.getCatalogue.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleShowPromo = this.handleShowPromo.bind(this);
        this.handleRemovePromo = this.handleRemovePromo.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSelectPromo = this.handleSelectPromo.bind(this);
        this.handleOpenConfirmationModal = this.handleOpenConfirmationModal.bind(this);
    }

    async checkPermission() {
        const id = this.props.match.params.memberbuymileageid;
        if (id) {
            await this.getDetail();
        } else {
            await this.componentCurrencySelect.retrieveData();
        }
    }

    componentDidMount() {
        document.title = "Member Buy Mileage | Loyalty Management System";
        this.checkPermission();
    }

    getDetail = () => {
        const memberbuymileageid = this.props.match.params.memberbuymileageid;
        const url = api.url.memberbuymileage.list;
        const criteria = { memberbuymileageid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then(async (response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    const { showconfirmation } = this.state;
                    const { receiptnumber, currencycode, buymileageid, qty, includevat, vat, promoid, discountprice, promoprice, discount, totalamount, status } = result[0] || {};

                    const buymileagedetail = (result[0]) ? result[0] : {};
                    const { requestid } = (result[0]) ? result[0] : {};
                    const generalfielddisabled = true;
                    const cataloguefielddisabled = true;
                    const numberofmilesfielddisabled = true;

                    const verifydate = (result[0].verifydate) ? moment(result[0].verifydate) : undefined;
                    const paymentverificationtimeout = (result[0].paymentverificationtimeout) ? moment(result[0].paymentverificationtimeout) : undefined;
                    const buydate = (result[0].buydate) ? moment(result[0].buydate) : undefined;

                    const buymileagename = (result[0].buymileagecatalog && result[0].buymileagecatalog.buymileagename) ? result[0].buymileagecatalog.buymileagename : undefined;
                    const mileagetype = (result[0].buymileagecatalog && result[0].buymileagecatalog.mileagetype) ? result[0].buymileagecatalog.mileagetype : undefined;
                    const unittype = (result[0].buymileagecatalog && result[0].buymileagecatalog.unittype) ? result[0].buymileagecatalog.unittype : undefined;
                    const basemileage = (result[0].buymileagecatalog && result[0].buymileagecatalog.basemileage !== undefined && result[0].buymileagecatalog.basemileage !== null) ? result[0].buymileagecatalog.basemileage : undefined;

                    const numberofmiles = (result[0].totalmileage !== undefined && result[0].totalmileage !== null) ? result[0].totalmileage : undefined;
                    const totalprice = (result[0].totalprice !== undefined && result[0].totalprice !== null) ? result[0].totalprice : null;

                    const vatamount = (result[0].vatamount !== undefined && result[0].vatamount !== null) ? result[0].vatamount : undefined;
                    const promotype = (result[0].promo && result[0]['promo']['promotype']) ? result[0]['promo']['promotype'] : null;

                    await this.getCatalogue(buydate, currencycode, unittype);

                    let titlepage = 'View';
                    let actionspage = 'view';

                    /* set action page if show confirmation */
                    if (showconfirmation) {
                        titlepage = 'Confirmation';
                        actionspage = 'confirmation';
                    }

                    await this.componentCurrencySelect.retrieveData();
                    await this.props.form.setFieldsValue({ buydate, currencycode, unittype, buymileageid, qty, promoid });

                    const promo = { ...this.state.fieldvalue.promo, promotype };
                    const fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, cataloguefielddisabled, numberofmilesfielddisabled };
                    const fieldvalue = { ...this.state.fieldvalue, requestid, verifydate, paymentverificationtimeout, buymileagename, mileagetype, unittype, basemileage, qty, numberofmiles, discount, discountprice, promoprice, promo, totalprice, includevat, vat, vatamount, totalamount, status, buymileagedetail, receiptnumber };
                    await this.setState({ titlepage, actionspage, fielddisabled, fieldvalue });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();

        const callback = async (input) => {
            this.setState({ isLoading: true });
            //define parameter
            const memberid = this.props.match.params.ID;
            const buymileageid = (input.buymileageid) ? input.buymileageid : null;
            // const buydate = (input.buydate) ? moment(input.buydate).format("YYYY-MM-DD HH:mm:ss") : null;
            const buydate = moment().format("YYYY-MM-DD HH:mm:ss")
            const partnercode = null;
            const source = "BO";
            const promoid = (input.promoid) ? input.promoid : null;
            const qty = (input.qty !== undefined && input.qty !== null) ? parseInt(input.qty, 0) : null;
            const currencycode = (input.currencycode) ? input.currencycode : null;

            let message = 'New data has been created';
            let data = { buymileageid, memberid, buydate, source, partnercode, promoid, qty, currencycode, paymenttype: 'CASH' };
            let url = api.url.memberbuymileage.buy;

            SaveRequest(url, data).then(async (response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);

                    const memberbuymileageid = (response && response.result && response.result.memberbuymileageid) ? response.result.memberbuymileageid : null;
                    if (memberbuymileageid) {
                        await this.props.history.push('/member/form/' + this.props.match.params.ID + '/buy-mileage');
                    }
                    await this.props.history.push('/member/form/' + this.props.match.params.ID + '/buy-mileage/form/' + memberbuymileageid + '/confirmation');
                    this.setState({ isLoading: false });
                } else {
                    Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                }
            });
        }

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                confirm({
                    title: `Are you sure buy this mileage?`,
                    onOk(e) {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            callback(input);
                        }).catch(() => console.log('Oops errors!'));
                    },
                    onCancel() { },
                });
            }
        });
    };

    /* get price base on memberid, buymilageid, currencycode, date(buydate), qty */
    /* getprice calling when choose catalogue, qty or promo */
    getPrice = async (quantity) => {
        const memberid = this.props.match.params.ID;
        const buymileageid = this.props.form.getFieldValue('buymileageid');
        const promocode = this.props.form.getFieldValue('promoid');
        const currencycode = this.props.form.getFieldValue('currencycode');
        const qty = (quantity !== undefined) ? Number(quantity) : (this.props.form.getFieldValue('qty')) ? Number(this.props.form.getFieldValue('qty')) : null;
        let date = this.props.form.getFieldValue('buydate');
        date = (date) ? moment(date).format("YYYY-MM-DD") : null;

        await this.setState({
            fielddisabled: { ...this.state.fielddisabled, promoidfielddisabled: true },
            fieldvalue: {
                ...this.state.fieldvalue, numberofmiles: null, vat: null, includevat: null, buymileagename: null,
                // mileagetype: null, unittype: null, 
                basemileage: null, qty: null, totalprice: null, totalamount: null, vatamount: null
            }
        });

        if (memberid && buymileageid && currencycode && date && qty) {
            const data = { memberid, buymileageid, promocode, currencycode, date, qty, paymenttype: 'CASH' };
            const url = api.url.memberbuymileage.getprice;
            //call loader
            this.setState({ isLoading: true });
            DetailRequest(url, data).then((response) => {
                const { status, result } = response;
                if (status.responsecode.substring(0, 1) === '0') {

                    const buymileagename = (result.buymileagename) ? result.buymileagename : null;
                    const mileagetype = (result.mileagetype) ? result.mileagetype : null;
                    const unittype = (result.unittype) ? result.unittype : null;
                    const basemileage = (result.basemileage !== undefined && result.basemileage !== null) ? result.basemileage : null;
                    const qty = (result.calculation && result.calculation.qty !== undefined && result.calculation.qty !== null) ? result.calculation.qty : null;
                    const promoprice = (result.calculation && result.calculation.promoprice !== undefined && result.calculation.promoprice !== null) ? result.calculation.promoprice : null;
                    const discount = (result.calculation && result.calculation.discount !== undefined && result.calculation.discount !== null) ? result.calculation.discount : null;
                    const discountprice = (result.calculation && result.calculation.discountprice !== undefined && result.calculation.discountprice !== null) ? result.calculation.discountprice : null;
                    const vat = (result.calculation && result.calculation.vat) ? result.calculation.vat : null;
                    const includevat = (result.calculation && result.calculation.includevat) ? result.calculation.includevat : false;
                    const vatamount = (result.calculation && result.calculation.vatamount !== undefined && result.calculation.vatamount !== null) ? result.calculation.vatamount : null;
                    const totalprice = (result.calculation && result.calculation.totalprice !== undefined && result.calculation.totalprice !== null) ? result.calculation.totalprice : null;
                    const totalamount = (result.calculation && result.calculation.totalamount !== undefined && result.calculation.totalamount !== null) ? result.calculation.totalamount : null;

                    /* calculation number of miles */
                    const numberofmiles = (result.basemileage !== undefined && result.basemileage !== null) ? result.basemileage * qty : null;

                    this.setState({ fieldvalue: { ...this.state.fieldvalue, numberofmiles, vat, includevat, buymileagename, mileagetype, unittype, basemileage, qty, totalprice, totalamount, vatamount, promoprice, discountprice, discount } });
                } else {
                    const { responsemessage } = status;
                    Alert.error(responsemessage);
                    /* reset value */
                    this.props.form.setFieldsValue({ promoid: undefined });
                }

                /* reset promoidfielddisabled */
                const promoidfielddisabled = false;
                const fielddisabled = { ...this.state.fielddisabled, promoidfielddisabled };
                this.setState({ isLoading: false, fielddisabled });
            });
        }
    }

    /* get catalogue base buy, currency and unittype */
    getCatalogue = async (buydate, currency, unittype) => {
        let cataloguefielddisabled = true;
        let numberofmilesfielddisabled = true;

        /* reset buymileageid */
        await this.props.form.setFieldsValue({ buymileageid: undefined });
        if (buydate && currency && unittype) {
            cataloguefielddisabled = false;

            const url = api.url.memberbuymileage.getcatalogue;
            const source = "BO";
            const partnercode = null;
            const date = (buydate) ? moment(buydate).format("YYYY-MM-DD") : null;
            const data = { source, partnercode, unittype, currency, date, mileagetype: 'AWARDMILES' };
            await DetailRequest(url, data).then(async (response) => {
                const { status, result } = response;
                const { responsemessage } = status;
                let optionsCatalogue = [];
                if (status.responsecode.substring(0, 1) === '0' && result) {
                    optionsCatalogue = result.map((obj, key) => {
                        const label = (obj.buymileagename) ? obj.buymileagename : '-';
                        const value = (obj.buymileageid) ? obj.buymileageid : null;
                        const basemileage = (obj.basemileage) ? obj.basemileage : null;
                        const price = (obj.price && (obj.price.price !== null && obj.price.price !== undefined)) ? obj.price.price : null;
                        return { label, value, basemileage, price }
                    });

                    /* if unit type piece, set value buymileageid first result and disabled */
                    if (unittype === 'PIECE') {
                        const buymileageid = (optionsCatalogue && optionsCatalogue[0] && optionsCatalogue[0]['value']) ? optionsCatalogue[0]['value'] : undefined;
                        cataloguefielddisabled = true;
                        numberofmilesfielddisabled = false;
                        const fielddisabled = { ...this.state.fielddisabled, cataloguefielddisabled, numberofmilesfielddisabled };
                        await this.setState({ fielddisabled });
                        await this.props.form.setFieldsValue({ buymileageid });
                    } else {
                        await this.props.form.setFieldsValue({ buymileageid: undefined });
                        await this.setState({ fielddisabled: { ...this.state.fielddisabled, cataloguefielddisabled, numberofmilesfielddisabled } });
                    }
                } else {
                    Alert.error(responsemessage);
                }

                await this.setState({ fieldvalue: { ...this.state.fieldvalue, optionsCatalogue } });
            });
        }

        /* reset buymileageid */
        await this.props.form.setFieldsValue({ qty: undefined, promoid: undefined });
        // await this.setState({ fielddisabled: { ...this.state.fielddisabled, cataloguefielddisabled, numberofmilesfielddisabled } });
    }

    handleBuyDateChange = async (value) => {
        const buydate = (value) ? value : null;
        const currencycode = this.props.form.getFieldValue('currencycode');
        const unittype = this.props.form.getFieldValue('unittype');

        await this.getCatalogue(buydate, currencycode, unittype);
    }

    handleCurrencyCodeChange = async (value) => {
        const buydate = this.props.form.getFieldValue('buydate');
        const currencycode = (value) ? value : null;
        const unittype = this.props.form.getFieldValue('unittype');

        await this.getCatalogue(buydate, currencycode, unittype);
    }

    handleUnitTypeChange = async (event) => {
        const buydate = this.props.form.getFieldValue('buydate');
        const currencycode = this.props.form.getFieldValue('currencycode');
        const unittype = event === null ? null : event.target.value;

        await this.getCatalogue(buydate, currencycode, unittype);
    }

    handleCatalogueChange = async (value) => {
        const { optionsCatalogue } = this.state.fieldvalue;
        const numberofmilesfielddisabled = (value) ? false : true;

        /* get detail catalogue base selected */
        let cataloguedetail = optionsCatalogue.filter(obj => obj.value === value);
        cataloguedetail = (cataloguedetail.length > 0 && cataloguedetail[0]) ? cataloguedetail[0] : {};

        const basemileage = (cataloguedetail.basemileage !== undefined && cataloguedetail.basemileage !== null) ? cataloguedetail.basemileage : null;
        const price = (cataloguedetail.price !== undefined && cataloguedetail.price !== null) ? cataloguedetail.price : null;

        /* set fieldvalue & fielddisabled */
        const fieldvalue = { ...this.state.fieldvalue, basemileage, price };
        const fielddisabled = { ...this.state.fielddisabled, numberofmilesfielddisabled };
        await this.setState({ fieldvalue, fielddisabled });

        /* reset quantity */
        await this.props.form.setFieldsValue({ qty: undefined, numberofmiles: undefined });
        await this.getPrice();
    }

    handleQuantityChange = async (event) => {
        if ((Number(event) < 1) || (Number(event) > 100)) {
            this.setState({
                fielddisabled: { ...this.state.fielddisabled, buyfielddisabled: true },
                fieldvalue: {
                    ...this.state.fieldvalue, numberofmiles: null, vat: null, includevat: null, buymileagename: null, mileagetype: null, unittype: null, basemileage: null,
                    qty: null, totalprice: null, totalamount: null, vatamount: null, promoprice: null, discountprice: null, discount: null
                }
            });
        } else {
            await this.setState({ fielddisabled: { ...this.state.fielddisabled, buyfielddisabled: false } });
            await this.getPrice(event);
        }
    }

    handleOpenConfirmationModal = (actionsconfirmationpage) => {
        this.setState({ showconfirmation: true, actionsconfirmationpage });
    };

    handleShowPromo = () => {
        this.setState({ showpromolist: true });
    };

    handleRemovePromo = async () => {
        const promoid = undefined;
        await this.setState({ fieldvalue: { ...this.state.fieldvalue, promo: {} } });
        await this.props.form.setFieldsValue({ promoid });
        await this.getPrice();
    };

    handleCloseModal = async () => {
        await this.setState({ showpromolist: false, showconfirmation: false });
    };

    handleSelectPromo = async (promoid, promo) => {
        await this.setState({ fieldvalue: { ...this.state.fieldvalue, promo } });
        await this.props.form.setFieldsValue({ promoid });
        await this.getPrice();
        await this.setState({ showpromolist: false });
    };

    handleSeeTransaction = async (id) => {
        await this.props.history.push('/member/');
        await this.props.history.push(`/member/form/${this.props.match.params.ID}/transaction/detail/${id}`);
    };

    handleDownload = async () => {
        await this.setState({ isLoading: true });
        SaveRequest(api.url.memberreceipt.download, { receiptnumber: this.state.fieldvalue.receiptnumber }).then(async (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                window.location.href = response.result.path;
                Alert.success((responsemessage) ? responsemessage : 'Downloading file...');
            } else Alert.error(responsemessage);
            await this.setState({ isLoading: false });
        })
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, formrender, actionspage, fieldvalue, fielddisabled, showpromolist, showconfirmation, isLoading, actionsconfirmationpage } = this.state;
        const { generalfielddisabled, cataloguefielddisabled, numberofmilesfielddisabled, promoidfielddisabled, buyfielddisabled } = fielddisabled;
        const { optionsCatalogue, verifydate, paymentverificationtimeout, numberofmiles, status, buymileagedetail, includevat, vat, buymileagename, mileagetype, unittype, qty, vatamount, totalamount, totalprice, promoprice, promo, discount, discountprice, requestid, receiptnumber } = fieldvalue;
        const { trxid, cancelledtrxid } = buymileagedetail || {};
        const { memberlock } = this.props;
        const { blockaccrual } = memberlock || {};
        const { promotype } = promo;
        const buymileageid = this.props.form.getFieldValue('buymileageid');
        const currencycode = this.props.form.getFieldValue('currencycode');
        const promoid = this.props.form.getFieldValue('promoid');
        const primaryemail = (this.props.profile && this.props.profile.email) ? this.props.profile.email : null;

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        } else {
            const memberid = this.props.match.params.ID;
            const memberbuymileageid = this.props.match.params.memberbuymileageid;
            const buydate = this.props.form.getFieldValue('buydate');
            return (
                <Row>
                    <Modal visible={showconfirmation} title={(actionsconfirmationpage === 'confirmation') ? 'Confirmation' : 'View Detail Confirmation'} loading={isLoading} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={700}>
                        <ConfirmationForm {...this.props} actionsconfirmationpage={actionsconfirmationpage} memberid={memberid} memberbuymileageid={memberbuymileageid} primaryemail={primaryemail} buymileagedetail={buymileagedetail} onClose={this.handleCloseModal} requestid={requestid} />
                    </Modal>
                    <Modal title="Promo List" visible={showpromolist} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={900}>
                        <PromoList memberid={memberid} buydate={buydate} buymileageid={buymileageid} currencycode={currencycode} mileagetype={mileagetype} unittype={unittype} handleSelectPromo={this.handleSelectPromo} />
                    </Modal>
                    <Row>
                        <Title level={4}><Button url={'/member/form/' + memberid + '/buy-mileage'} shape="circle" icon="left" /> Member Buy Mileage {(titlepage) ? "- " + titlepage : null}</Title>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={16} xl={16}>
                                    <DatePickerBase wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Buy Date" datafield="buydate" validationrules={['required']} defaultValue={moment()} onChange={this.handleBuyDateChange} disabled={true} />
                                    <CurrencySelect wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext="Currency Code" datafield="currencycode" validationrules={['required']} onChange={this.handleCurrencyCodeChange} disabled={generalfielddisabled} />
                                    <RadioButton wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Unit Type" datafield="unittype" validationrules={['required']} options={optionsUnitType} onChange={this.handleUnitTypeChange} disabled={generalfielddisabled} />
                                    <SelectBase wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Catalogue" datafield="buymileageid" validationrules={['required']} options={optionsCatalogue} onChange={this.handleCatalogueChange} disabled={cataloguefielddisabled} />
                                    <InputNumber wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Quantity" datafield="qty" validationrules={['required']} min={1} max={100} step={0.1} onChange={this.handleQuantityChange} disabled={numberofmilesfielddisabled} />
                                    {/* <InputText wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Number of Miles" datafield="numberofmiles" validationrules={['required', 'pattern.number']} extra={((basemileage !== undefined && basemileage !== null) && (qty !== undefined && qty !== null)) ? "Calculation of " + basemileage + " base mileage x " + qty : null} disabled={true} /> */}
                                    {/* <InputText wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Price" datafield="price" disabled={true} validationrules={['required']} /> */}
                                    <Form.Item label="Promo">
                                        <Row>
                                            <Col span={12}>
                                                <InputText wrapperCol={{ span: 24 }} labelCol={{ span: 8 }} form={this.props.form} datafield="promoid" disabled={true} />
                                            </Col>
                                            {
                                                (promoid) ?
                                                    <Col span={4}>
                                                        <Button htmlType="button" label="Remove Promo" type="danger" onClick={this.handleRemovePromo} disabled={promoidfielddisabled} />
                                                    </Col> :
                                                    <Col span={4}>
                                                        <Button htmlType="button" label="Show Promo" type="primary" onClick={this.handleShowPromo} disabled={promoidfielddisabled} />
                                                    </Col>
                                            }
                                        </Row>
                                    </Form.Item>
                                    {/* <InputText wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="VAT" datafield="vatamount" extra={<b>Value Added Tax percentage {vat} %</b>} validationrules={(includevat) ? ['required'] : null} disabled={true} suffix="%" />
                                     <InputText wrapperCol={{ span: 12 }} labelCol={{ span: 8 }} form={this.props.form} labeltext="Total Price" datafield="totalprice" disabled={true} validationrules={['required']} /> */}
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8} style={{ padding: '0 10px' }}>
                                    <Affix offsetTop={30}>
                                        <div>
                                            {/* <Card bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginBottom: '20px' }}>
                                                 <div style={{ border: '1px solid rgb(219, 222, 226)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                                                     <Text strong style={{ display: 'block' }}>
                                                         <Icon type="gift" theme="twoTone" /> Add Promo <Icon type="right" />
                                                     </Text>
                                                 </div>
                                             </Card> */}
                                            {
                                                (actionspage !== 'create') ?
                                                    <Card title="Verify Status" bordered={false} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginBottom: '20px' }}>
                                                        <Row>
                                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                                                <Text style={{ display: 'block' }}>Status</Text>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>
                                                                <Text style={{ display: 'block' }}>
                                                                    <Tag color={(status === 'SUCCESS') ? "#87d068" : "#f50"}>{(status) ? jsUcfirst(status, "_") : '-'}</Tag>
                                                                </Text>
                                                            </Col>
                                                        </Row>
                                                        {
                                                            (status === 'SUCCESS') ?
                                                                <Row style={{ marginTop: 5 }}>
                                                                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                                                        <Text style={{ display: 'block' }}>Verify Date</Text>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>
                                                                        <Text strong style={{ display: 'block' }}>{(verifydate) ? moment(verifydate).format("DD/MM/YYYY HH:mm:ss") : '-'}</Text>
                                                                    </Col>
                                                                </Row> : null
                                                        }
                                                        {
                                                            (receiptnumber) ?
                                                                <Row style={{ marginTop: 5 }}>
                                                                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                                                        <Text style={{ display: 'block' }}>Receipt Number</Text>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>
                                                                        <Text strong style={{ display: 'block' }}>{((receiptnumber === ' ') || (receiptnumber === 'null')) ? '-' : receiptnumber}</Text>
                                                                    </Col>
                                                                </Row> : null
                                                        }
                                                        {
                                                            (status === 'WAITING_FOR_PAYMENT' || status === 'FAILED') ?
                                                                <Row>
                                                                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                                                        <Text style={{ display: 'block' }}>Payment Time Limit</Text>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>
                                                                        <Text type="danger" strong style={{ display: 'block' }}>{(paymentverificationtimeout) ? moment(paymentverificationtimeout).format("DD/MM/YYYY HH:mm:ss") : '-'}</Text>
                                                                        <Text type="danger" strong style={{ display: 'block' }}>{(paymentverificationtimeout && (moment(paymentverificationtimeout).isBefore(moment()))) ? 'EXPIRED' : null}</Text>
                                                                    </Col>
                                                                </Row> : null
                                                        }
                                                        {
                                                            (status === 'SUCCESS' || status === 'REJECTED' || status === 'REVISE') ?
                                                                <Button htmlType='button' type='primary' label='View Detail' disabled={false} block={true} style={{ marginTop: '20px' }} onClick={() => this.handleOpenConfirmationModal('view')} /> : null
                                                        }
                                                        {
                                                            ((status === 'SUCCESS' && trxid) || (status === 'VOID' && cancelledtrxid)) ?
                                                                <Button htmlType='button' type='primary' label='View Transaction' disabled={false} block={true} style={{ marginTop: '20px' }} onClick={() => this.handleSeeTransaction((status === 'SUCCESS') ? trxid : cancelledtrxid)} /> : null
                                                        }
                                                    </Card> : null
                                            }
                                            <Card title="Price Details" bordered={false} style={{ marginBottom: '20px', boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Catalogue Name</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(buymileagename) ? buymileagename : '-'}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Mileage Type</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(mileagetype) ? mileagetype : '-'}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Unit Type</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(unittype) ? unittype : '-'}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Base Mileage {(qty !== undefined && qty !== null) ? '(x' + qty + ')' : null}</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(numberofmiles !== undefined && numberofmiles !== null) ? formatNumber(numberofmiles) : '-'}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px', }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>Price {(qty !== undefined && qty !== null) ? '(x' + qty + ')' : null}</Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        {(totalprice !== undefined && totalprice !== null) ?
                                                            (promotype === 'FIXED') ? <Text delete> {currencycode + " " + formatNumber(totalprice)} </Text>
                                                                : currencycode + " " + formatNumber(totalprice)
                                                            : '-'}
                                                    </Col>
                                                    {
                                                        (includevat) ? <Text type="danger" style={{ fontSize: '10px', fontWeight: 'bold', fontStyle: 'italic' }}>* Include VAT</Text> : null
                                                    }
                                                </Row>
                                                <Divider />
                                                {
                                                    (promotype === 'FIXED') ?
                                                        <Row style={{ marginTop: '10px' }}>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                                <Text strong style={{ display: 'block' }}>Promo Price {(qty !== undefined && qty !== null) ? '(x' + qty + ')' : null}</Text>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                                <Text strong style={{ display: 'block' }}>
                                                                    {(promoprice !== undefined && promoprice !== null) ? currencycode + " " + formatNumber(promoprice) : '-'}
                                                                </Text>
                                                            </Col>
                                                        </Row> : null
                                                }
                                                {
                                                    (promotype === 'DISCOUNT') ?
                                                        <Row style={{ marginTop: '10px' }}>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                                <Text strong style={{ display: 'block' }}>Discount ({(discount !== undefined && discount !== null) ? discount + " %" : '- %'})</Text>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                                <Text strong style={{ display: 'block' }}>
                                                                    {(discountprice !== undefined && discountprice !== null) ? currencycode + " " + formatNumber(discountprice) : '-'}
                                                                </Text>
                                                            </Col>
                                                        </Row> : null
                                                }
                                                {
                                                    (promotype === 'DISCOUNT') ?
                                                        <Row style={{ marginTop: '10px' }}>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                                <Text strong style={{ display: 'block' }}>Price After Discount</Text>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                                <Text strong style={{ display: 'block' }}>
                                                                    {(promoprice !== undefined && promoprice !== null) ? currencycode + " " + formatNumber(promoprice) : '-'}
                                                                </Text>
                                                            </Col>
                                                        </Row> : null
                                                }
                                                {
                                                    (!includevat) ?
                                                        <Row style={{ marginTop: '10px' }}>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                                <Text strong style={{ display: 'block' }}>VAT ({vat} %)</Text>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                                <Text strong style={{ display: 'block' }}>
                                                                    {(vatamount !== undefined && vatamount !== null) ? currencycode + " " + formatNumber(vatamount) : '-'}
                                                                </Text>
                                                            </Col>
                                                        </Row> : null
                                                }
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                        <Text strong style={{ display: 'block' }}>Total Price</Text>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}>
                                                        <Text strong style={{ display: 'block' }}>
                                                            {(totalamount !== undefined && totalamount !== null) ? currencycode + " " + formatNumber(totalamount) : '-'}
                                                        </Text>
                                                    </Col>
                                                </Row>
                                                {
                                                    (status === 'SUCCESS' && !blockaccrual) ? <Button htmlType='button' label='Download Receipt' type='primary' icon='download' block onClick={this.handleDownload} style={{ marginTop: 10 }} /> : null
                                                }
                                            </Card>
                                            {
                                                (status === 'WAITING_FOR_PAYMENT') ? <Button htmlType="button" type="primary" label='Confirm' onClick={() => this.handleOpenConfirmationModal('confirmation')} block={true} style={{ marginBottom: 20 }} /> : null
                                            }
                                            {
                                                (actionspage === 'create') ? <Button htmlType="button" type="primary" label='Buy' block={true} style={{ marginBottom: 20 }} onClick={(e) => this.saveAction(e)} disabled={buyfielddisabled} /> : null
                                            }
                                        </div>
                                    </Affix>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            );
        }
    }
}


class PromoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            promolist: [],
        }

        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = () => {
        const currencycode = this.props.currencycode;
        const memberid = this.props.memberid;
        const partnercode = null;
        const catalogueid = this.props.buymileageid;
        const mileagetype = this.props.mileagetype;
        const mileageunittype = this.props.unittype;
        const date = (this.props.buydate) ? moment(this.props.buydate).format("YYYY-MM-DD") : null;
        const promoid = null;
        const url = api.url.memberbuymileage.getpromo;
        const data = { memberid, partnercode, catalogueid, date, promoid, mileagetype, mileageunittype };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsemessage } = status;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                const promolist = result.map((obj, key) => {
                    const promoid = (obj.promoid) ? obj.promoid : null;
                    const promoname = (obj.promoname) ? obj.promoname : null;
                    const promotype = (obj.promotype) ? obj.promotype : null;
                    let amount = (obj.amount) ? obj.amount : null;
                    if (promotype === 'FIXED') {
                        let prices = (obj.prices) ? obj.prices : null;
                        prices = prices.filter(val => val.currencycode === currencycode);

                        if (prices.length > 0) {
                            amount = (prices && prices[0] && prices[0]['price']) ? prices[0]['price'] : null;
                        }
                    }

                    return { promoid, promoname, promotype, currencycode, amount };
                });

                this.setState({ promolist });
            } else {
                Alert.error(responsemessage);
            }

            this.setState({ isLoading: false });
        });
    }

    handleSelect = (e, promoid, promo) => {
        e.preventDefault();
        this.props.handleSelectPromo(promoid, promo);
    }

    render() {
        const { promolist, isLoading } = this.state;
        return (
            <div>
                <Table dataSource={promolist} pagination={false} loading={isLoading} scroll={{ y: 240 }}>
                    <Column title="Promo Code" dataIndex="promoid" key="promoid" render={(value, row) => (value) ? value : '-'} width="20%" />
                    <Column title="Promo Name" dataIndex="promoname" key="promoname" render={(value, row) => (value) ? value : '-'} width="20%" />
                    <Column title="Promo Type" dataIndex="promotype" key="promotype" render={(value, row) => (value) ? value : '-'} width="20%" />
                    <Column title="Amount" dataIndex="amount" key="amount" render={
                        (value, row) => {
                            if (row.promotype === 'DISCOUNT') {
                                return (value !== null & value !== undefined) ? value + "%" : '-'
                            } else if (row.promotype === 'FIXED') {
                                return (value !== null & value !== undefined) ? row.currencycode + " " + value : '-'
                            }
                            return (value !== null & value !== undefined) ? value : '-'
                        }
                    } width="20%" />
                    <Column
                        title="Action"
                        key="action"
                        width="20%"
                        render={(value, row) => (
                            <span>
                                <AntButton type="primary" size="small" onClick={(e) => this.handleSelect(e, row.promoid, row)}>Select</AntButton>
                            </span>
                        )}
                    />
                </Table>
            </div>
        )
    }
}


const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));