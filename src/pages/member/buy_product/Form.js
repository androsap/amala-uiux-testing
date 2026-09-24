import React from 'react';
import { api } from '../../../config/Services';
import { Button, DatePickerBase, InputNumber, RadioButton, CurrencySelect, PriceBuyProductDetail, VerifyStatus, BuyProductNameSelect, Alert, SwitchButton } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Spin } from 'antd';
import { DetailRequest, SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { PaymentType } from '../../../data'
import moment from 'moment';

import ConfirmationForm from './Confirmation';
import Product from './Form/Product';
import Destination from './Form/Destination';

const { Title } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionspage: 'create',
            isLoading: false,
            responseMessage: '',
            buyproductdetail: {},
            showmemberbuylimit: false,
            historyPage: null,
            paymenttype: 'CASH',
            visible: {
                showconfirmation: this.props.showconfirmation ? this.props.showconfirmation : false,
                productform: true,
                destinationform: false,
            },
            data: {
                product: {},
                destination: {},
                price: {}
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission = () => {
        this.setState({ isLoading: true });

        const { match, showconfirmation } = this.props;
        let { titlepage, actionspage, fielddisabled } = this.state;
        let { generalfielddisabled } = fielddisabled;

        if (match.params.ordercode) {
            titlepage = 'View';
            actionspage = 'view';
            generalfielddisabled = true;
            setTimeout(() => {
                this.getDetail(match.params.ordercode);
            }, 100);
        } else {
            this.props.form.setFieldsValue({ paymenttype: 'CASH' });
        };
        if (showconfirmation) {
            titlepage = 'Confirmation';
            actionspage = 'confirmation';
        };

        this.setState({ isLoading: false, titlepage, actionspage, fielddisabled: { generalfielddisabled } });

    };

    componentDidMount() {
        document.title = 'Member Buy Product | Loyalty Management System';
        this.checkPermission();
    };

    getDetail = async (ordercode) => {
        const { historyPage, visible, data } = this.state;
        await this.setState({ isLoading: true });

        if (historyPage === 'paymentform-destinationform') {
            const { currencycode, paymenttype } = data.price || {};

            this.props.form.setFieldsValue({ currencycode, paymenttype });
            await this.setState({ paymenttype, isLoading: false });
        } else {
            RetrieveRequest(api.url.memberbuyproduct.retrieve, { ordercode }).then(async (response) => {
                const { status, result } = response;
                if ((result && result.length !== 0) && (status.responsecode === '0000')) {
                    const { mailingproductcode, inventoryvariantid, qty, paymenttype, currencycode, mailingproduct, price, totalprice, inventoryvariant } = result[0] || [];
                    const { producttype, inventorycode } = mailingproduct;
                    const orderdate = result[0].orderdate ? moment(result[0].orderdate) : undefined;
                    const calculation = { quantity: qty, totalamount: totalprice, totalprice: price };
                    const buyproductdetail = {
                        ...result[0],
                        mailingproduct,
                        variantdata: {
                            variants: [{
                                inventoryvariantid: inventoryvariant.inventoryvariantid,
                                inventoryvariantname: inventoryvariant.inventoryvariantname
                            }]
                        }
                    };

                    await this.setState({
                        buyproductdetail, paymenttype,
                        data: { ...data, price: { calculation } },
                        visible: { ...visible, productform: false },
                        isLoading: false
                    });
                    await this.componentBuyProductNameSelect.getProductMailing({ producttype, date: orderdate });
                    await this.componentBuyProductNameSelect.onChangeProduct(mailingproductcode, inventorycode);
                    await this.props.form.setFieldsValue({ orderdate, mailingproductcode, inventoryvariantid, qty, paymenttype, currencycode });
                } else {
                    Alert.error(status.responsemessage);
                    await this.setState({ isLoading: false });
                }
            });
        }
    };

    saveAction = async (e) => {
        e.preventDefault();
        const callback = async (input) => {
            this.setState({ isLoading: true });

            const { product, destination, price } = this.state.data;
            const { inventoryvariantid, mailingproduct, mailingproductcode, orderdate, printletter, producttype, qty } = product || {};
            const { lettercode, inventorycode } = mailingproduct;
            const { sendto, usepreferenceaddress, address, countryname, statename, cityname, postalcode, region, useprintingvendor, usepackagingvendor, usecouriervendor, awb, vendorproduct,
                branchname, ticketofficename, printingpriorityhandling, printingnotes, packagingpriorityhandling, packagingnotes, courierpriorityhandling, couriernotes } = destination || {};
            const { prices, calculation } = price || {};
            const { currencycode, paymenttype, isfree } = input || {};
            const memberid = this.props.match.params.ID;

            const vendorList = (vendorproduct === undefined || !vendorproduct[0]) ? undefined : (vendorproduct.filter(val => { return val !== null && val !== undefined }));
            const courierList = (!usecouriervendor) ? undefined : (vendorList.filter(val => val.vendortype === 'COURIER'));
            const couriervendorcode = (!courierList) ? undefined :
                (courierList.find(val => (val.allregion === true)) ? courierList.find(val => (val.allregion === true)).vendorcode :
                    courierList.find((val) => { return (val.regions.some((e) => { return (e.regioncode === destination.region) })) }) ?
                        courierList.find((val) => { return val.regions.some((e) => { return (e.regioncode === destination.region) }) }).vendorcode : null)

            let url = api.url.memberbuyproduct.buy;
            let data = {
                mailingproductcode, memberid, paymenttype, currencycode, inventoryvariantid, lettercode, couriervendorcode, isfree,
                printletter, producttype, usepreferenceaddress, inventorycode, printingnotes,
                printingpriorityhandling, packagingpriorityhandling, packagingnotes, courierpriorityhandling, couriernotes, awb,
                usepackagingvendor: (usepackagingvendor) ? usepackagingvendor : false,
                useprintingvendor: (useprintingvendor) ? useprintingvendor : false,
                usecouriercode: usecouriervendor,
                qty: Number(qty),
                channel: 'TO',
                partner: null,
                orderdate: moment(orderdate).format('YYYY-MM-DD HH:mm:ss'),
                price: (isfree) ? Number(calculation.totalprice) : Number(prices.price),
                totalprice: Number(calculation.totalprice),
                printingvendorcode: (!useprintingvendor) ? null : (vendorproduct.find(val => val.vendortype === 'PRINTING') ? (vendorproduct.find(val => val.vendortype === 'PRINTING').vendorcode) : undefined),
                packagingvendorcode: (!usepackagingvendor) ? null : (vendorproduct.find(val => val.vendortype === 'PACKAGING') ? (vendorproduct.find(val => val.vendortype === 'PACKAGING').vendorcode) : undefined),
                vendorregion: region,
                destination: {
                    address, postalcode, branchname, ticketofficename, sendto,
                    state: statename,
                    city: cityname,
                    country: countryname,
                },
            };

            SaveRequest(url, data).then(async (response) => {
                const { status, result } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000' && result) {
                    Alert.success((responsemessage) ? responsemessage : 'New data has been created');
                    this.setState({
                        buyproductdetail: result,
                        titlepage: 'Confirmation',
                        actionspage: 'confirmation'
                    });
                    this.handleModal(true, 'showconfirmation');

                    const ordercode = (result && result.ordercode) ? result.ordercode : null;

                    if (ordercode) await this.props.history.push(`/member/form/${this.props.match.params.ID}/buy-product`);
                    await this.props.history.push(`/member/form/${this.props.match.params.ID}/buy-product/form/${ordercode}/confirmation`);
                    this.setState({ isLoading: false });
                } else {
                    Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                };
            });
        }
        await this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                confirm({
                    title: 'Are you sure buy this product?',
                    onOk(e) {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            callback(input);
                        }).catch(() => console.log('Oops errors!'));
                    },
                    onCancel() { },
                });
            }
        })
    };

    handleNext = async (value, type, dataBefore) => {
        const disableBefore = (type === 'productform') ? 'destinationform' : (type === 'destinationform') ? 'paymentform' : 'productform';
        const { data, visible, historyPage } = this.state;
        let { product, destination, price } = data;
        let { mailingproduct, mailingproductcode, orderdate, inventoryvariantid, qty, producttype, isfree, paymenttype, currencycode } = product;
        let productChanged = ((type === 'productform') && (JSON.stringify(dataBefore) === JSON.stringify(product)));
        let destinationChanged = ((type === 'destinationform') && (JSON.stringify(dataBefore) === JSON.stringify(destination)));

        await this.setState({ isLoading: true });
        await this.setState({
            isLoading: false,
            visible: { ...visible, [type]: value, [disableBefore]: true },
            data: {
                ...data,
                product: (type === 'productform') ? dataBefore : product,
                destination: (type === 'destinationform') ? dataBefore : (productChanged) ? destination : {},
                price: (destinationChanged) ? price : (historyPage === 'paymentform-destinationform') ?
                    { ...price, currencycode: undefined, calculation: {} } : {}
            }
        });

        if (disableBefore === 'paymentform') {
            if (mailingproduct.isfree) await this.getPrice('CASH', 'IDR');
            await this.componentBuyProductNameSelect.getProductMailing({ producttype, date: orderdate });
            await this.componentBuyProductNameSelect.onChangeProduct(mailingproductcode);
            await this.getPrice(paymenttype, currencycode, isfree);
            this.setState({ paymenttype });
            this.props.form.setFieldsValue({
                mailingproductcode, inventoryvariantid, qty, paymenttype, currencycode, isfree,
                orderdate: moment(orderdate),
            });
        };

        if (historyPage === 'paymentform-destinationform') await this.getDetail();
    };

    handleBack = async () => {
        const { productform, destinationform } = this.state.visible;
        const typePage = (productform) ? 'productform' : (destinationform) ? 'destinationform' : 'paymentform';
        const backPage = (typePage === 'destinationform') ? 'productform' : (typePage === 'paymentform') ? 'destinationform' : 'productform';
        const historyPage = `${typePage}-${backPage}`;

        await this.setState({ isLoading: true });
        await this.setState({
            isLoading: false, historyPage,
            visible: { ...this.state.visible, [typePage]: false, [backPage]: true },
            data: { ...this.state.data, price: this.state.data.price }
        });
    };

    getPrice = async (paymenttype, currencycode, isfree) => {
        const { mailingproductcode, inventoryvariantid, qty, orderdate } = this.state.data.product;

        let url = api.url.memberbuyproduct.getprice;
        let data = {
            mailingproductcode, inventoryvariantid, paymenttype, isfree: (isfree) ? true : false,
            quantity: Number(qty), date: moment(orderdate).format('YYYY-MM-DD')
        };

        if (paymenttype === 'CASH') data.currencycode = currencycode;
        await this.setState({ isLoading: true, data: { ...this.state.data, price: undefined } });
        await DetailRequest(url, data).then((response) => {
            if (response.status.responsecode === '0000') {
                this.setState({ data: { ...this.state.data, price: { ...response.result, currencycode, paymenttype } } });
            } else Alert.information(response.status.responsemessage);
        });
        await this.setState({ isLoading: false });
    };

    handleModal = (value, type) => {
        this.setState({ visible: { ...this.state.visible, [type]: value } });
    };

    render() {
        const { actionspage, isLoading, buyproductdetail, historyPage, visible, data, fielddisabled, paymenttype } = this.state;
        const { product, destination, price } = data;
        const { mailingproduct, variantdata, inventoryvariantid, receiptnumber } = (actionspage === 'create') ? product : buyproductdetail;
        const { productform, destinationform, showconfirmation } = visible;
        const { generalfielddisabled } = fielddisabled;
        const { match, profile, permission } = this.props;
        const isfree = (mailingproduct && mailingproduct.isfree) ? mailingproduct.isfree : this.props.form.getFieldValue('isfree');
        const memberid = match.params.ID;
        const primaryemail = (profile && profile.email) ? profile.email : null;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, md: { span: 8 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, md: { span: 16 } }
        };

        const currencycode = this.props.form.getFieldValue('currencycode');
        const type = (productform) ? 'Product' : (destinationform) ? 'Destination' : 'Payment';
        const htmlTypeBack = (type === 'Product' || actionspage !== 'create') ? 'link' : 'button';
        const choose = (productform || destinationform) ? '- Choose' : '';
        const actionsconfirmationpage = (buyproductdetail.status !== 'WAITING_FOR_PAYMENT') ? 'view' : 'confirmation';
        const priceData = { price, inventoryvariantid, paymenttype, currencycode, mailingproduct, variantdata }

        const paymentcurrencyfielddisabled = (actionspage === 'confirmation' || isfree) ? true : generalfielddisabled;
        const isfreefielddisabled = (permission && permission['usermenu']['MBBUYPRO']['MBP_BUYFREE']) ? generalfielddisabled : true;
        const masterfielddisabled = { isfreefielddisabled, paymentcurrencyfielddisabled };

        return (
            <React.Fragment>
                <Modal visible={showconfirmation} title={(actionsconfirmationpage === 'confirmation') ? 'Confirmation' : 'View Detail Confirmation'} loading={isLoading} onCancel={() => this.handleModal(false, 'showconfirmation')} footer={null} destroyOnClose={true} width={700}>
                    <ConfirmationForm {...this.props} memberid={memberid} primaryemail={primaryemail} buyproductdetail={buyproductdetail} actionsconfirmationpage={actionsconfirmationpage} onClose={() => this.handleModal(false, 'showconfirmation')} />
                </Modal>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}><Button htmlType={htmlTypeBack} url={`/member/form/${memberid}/buy-product`} shape='circle' icon='left' onClick={this.handleBack} />  Member Buy Product {choose} {type}</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    {
                        (productform) ? <Product {...this.props} handleNext={this.handleNext} data={product} historyPage={historyPage} actionspage={actionspage} generalfielddisabled={generalfielddisabled} masterfielddisabled={masterfielddisabled} /> :
                            (destinationform) ? <Destination {...this.props} handleNext={this.handleNext} data={destination} product={product} historyPage={historyPage} actionspage={actionspage} generalfielddisabled={generalfielddisabled} /> :
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className='gutter-row' xs={24} lg={{ span: 14 }}>
                                            <DatePickerBase form={this.props.form} labeltext='Order Date' datafield='orderdate' validationrules={['required']} defaultValue={moment()} disabled={true} />
                                            <BuyProductNameSelect ref={(e) => { this.componentBuyProductNameSelect = e }} labeltext='Product Name' datafield={['mailingproductcode', 'inventoryvariantid']} form={this.props.form} disabled={true} validationrules={['required']} />
                                            <InputNumber form={this.props.form} labeltext='Quantity' datafield='qty' validationrules={['required']} disabled={true} />
                                            <SwitchButton form={this.props.form} labeltext='Is Free' datafield='isfree' defaultChecked={false} disabled={true} />
                                            <RadioButton form={this.props.form} labeltext='Payment Type' datafield='paymenttype' validationrules={['required']} options={PaymentType} disabled={true} />
                                            {
                                                (paymenttype === 'CASH' || isfree) ? <CurrencySelect form={this.props.form} labeltext='Currency Code' datafield='currencycode' validationrules={['required']} disabled={true} /> : null
                                            }
                                        </Col>

                                        <Col className='gutter-row' xs={24} lg={{ span: 10 }} >
                                            {
                                                (actionspage === 'view') ? <Col style={{ marginBottom: 20 }}><Button url={`${this.props.match.url}/track-order`} type='primary' label='Order Track' block={true} /></Col> : null
                                            }
                                            {
                                                (actionspage === 'confirmation' || actionspage === 'view') ? <VerifyStatus {...this.props} buyproductdetail={buyproductdetail} handleModal={this.handleModal} /> : null
                                            }
                                            <PriceBuyProductDetail priceData={priceData} receiptnumber={receiptnumber} />
                                            {
                                                (actionspage === 'view') ? null : ((buyproductdetail.status === 'WAITING_FOR_PAYMENT') ?
                                                    <Button htmlType='button' type='primary' label='Confirmation' block={true} onClick={() => this.handleModal(true, 'showconfirmation')} /> :
                                                    <Button htmlType='submit' type='primary' label='Buy' block={true} disabled={(price) ? (Object.keys(price).length !== 0) ? false : true : true} />)
                                            }
                                        </Col>
                                    </Row>
                                </Form>
                    }
                </Spin>
            </React.Fragment>
        );
    };
}

export default Form.create()(App);