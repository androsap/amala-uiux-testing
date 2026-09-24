import React from 'react';
import moment from 'moment';
import { api } from '../../../../config/Services';
import { Button, DatePickerBase, Alert, RadioButton, BuyMileageCatalogSelect, CurrencySelect, InputText } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin, Card, Tag, Modal } from 'antd';
import { PaymentType } from '../../../../data';
import { jsUcfirst } from '../../../../utilities/Helpers';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../../../utilities/RequestService';

import ConfirmationForm from './Confirmation';
import SelectedTransaction from './information/SelectedTransaction';
import PriceDetails from './information/PriceDetails';

const { Title, Text } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionspage: 'create',
            isLoading: false,
            showTable: false,
            includevat: false,
            selectedTrx: [],
            selectedEligible: [],
            selectedTransaction: [],
            catalogData: {},
            memberbuymileagedetail: {},
            showconfirmation: this.props.showconfirmation,
            showselectedtransaction: false,
            memberbuymileageid: null,
            fieldvalue: {
                miles: 0,
                expiredmiles: 0,
                extendedmiles: 0,
                currency: undefined,
                paymentType: undefined,
            },
            priceDetail: {
                buymileagename: null,
                mileagetype: null,
                unittype: null,
                basemileage: null,
                qty: null,
                totalprice: null,
                totalamount: null,
                verifydate: moment()
            }
        }
    }

    async checkPermission() {
        const memberbuymileageid = this.props.match.params.memberbuymileageid;
        let { actionspage, fieldvalue } = this.state;
        let requestForm = {};

        if (memberbuymileageid) {
            this.setState({
                titlepage: 'Edit',
                actionspage: (this.props.location.state) ? ((this.props.location.state.fromCreate !== undefined) ? 'update' : 'view') : 'view'
            });
            this.getDetail(memberbuymileageid);
        } else if (actionspage === 'create') {
            requestForm = JSON.parse(this.props.location.state.form);
            const { buymileageid, buydate, paymenttype, currencycode } = requestForm || {};

            this.getCatalogDetail(buymileageid);
            setTimeout(() => {
                const { selectedEligible } = (this.props.location.state !== undefined) ? this.props.location.state : this.state;
                const memberbuymileagedetail = (memberbuymileageid && (this.props.location.state !== undefined)) ? this.props.location.state.selectedTransaction : selectedEligible;
                const selectedEligibleConvert = (selectedEligible) ? memberbuymileagedetail.map(a => a.data) : null;
                const selectedTransactionPrevious = (selectedEligibleConvert) ? selectedEligibleConvert.map(a => Object.values(a)).flat(1) : [];
                const selectedTransaction = (selectedTransactionPrevious) ? selectedTransactionPrevious.map(a => Object.values(a.selectedRows)).flat(1) : [];
                const miles = (selectedTransaction) ? selectedTransaction.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) : [];

                this.setState({ selectedEligible, requestForm, selectedTransaction, fieldvalue: { ...fieldvalue, miles, paymentType: paymenttype } });
                this.getPrice(paymenttype, currencycode, buymileageid);
                this.props.form.setFieldsValue({ buydate: moment(buydate), buymileageid, paymenttype, currencycode });
            }, 1000)
        };
        this.componentCatalogSelect.retrieveData({ mileagetype: 'EXPIRED' });
    };

    componentDidMount() {
        document.title = 'Member Buy to Extend Mileage | Loyalty Management System';
        this.checkPermission();
    };

    getDetail = (memberbuymileageid) => {
        this.setState({ isLoading: true });
        RetrieveRequest(api.url.memberbuymileage.list, { memberbuymileageid }, {}, [], {}, { memberbuymileageid }).then(async (response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                const { memberbuymileagedetail, selectedaccountdetail, buymileageid, buydate, buymileagecatalog, catalogueprice, qty, prices, totalamount, currencycode,
                    totalmileage, includevat, totalprice, status, verifydate, paymenttype, vatamount, paymentcode, receiptnumber, packagemileage } = result[0] || {};
                const { buymileagename, mileagetype, basemileage, pricetype } = buymileagecatalog || {};

                this.getCatalogDetail(buymileageid);
                this.getTrx(memberbuymileagedetail, status, buydate);
                setTimeout(() => {
                    this.setState({
                        selectedTransaction: selectedaccountdetail,
                        memberbuymileagedetail: result[0],
                        miles: totalmileage,
                        fieldvalue: { ...this.state.fieldvalue, receiptnumber, paymentcode, receiptnumber, paymentType: (paymenttype) ? paymenttype : (currencycode ? 'CASH' : 'MILEAGE') },
                        priceDetail: {
                            buymileagename, mileagetype, basemileage, qty, prices, pricetype, currencycode, includevat, status, verifydate, paymenttype, buydate, packagemileage,
                            totalprice: Number(totalprice).toLocaleString('en-US'),
                            totalamount: Number(totalamount).toLocaleString('en-US'),
                            vatamount: Number(vatamount).toLocaleString('en-US')
                        }
                    });
                }, 500);

                setTimeout(() => {
                    this.props.form.setFieldsValue({
                        catalogueprice: (catalogueprice && buymileagecatalog && buymileagecatalog.basemileage) ? `${catalogueprice} / ${buymileagecatalog.basemileage}` : catalogueprice,
                        paymenttype: (paymenttype) ? paymenttype : (currencycode ? 'CASH' : 'MILEAGE'),
                        buydate: moment(buydate), currencycode, buymileageid,
                    });
                }, 1000);

            } else Alert.error(status.responsemessage);
        })
        this.setState({ isLoading: false });
    };

    getTrx = (memberbuymileagedetail, statusPayment, buydate) => {
        const accountdetails = memberbuymileagedetail.map(obj => obj.accdetailid);
        DetailRequest(api.url.memberaccountdetail.gettrx, { accountdetails }).then((response) => {
            const { status = {}, result } = response;
            const { responsecode } = status;
            if (responsecode === '0000' && result) {
                let selectedTrx = result;
                if (statusPayment === 'SUCCESS') {
                    selectedTrx = selectedTrx.map((val) => {
                        const expireddateafter = memberbuymileagedetail.find(({ accdetailid }) => accdetailid === val.accdetailid).expireddateafter;
                        const expireddatebefore = memberbuymileagedetail.find(({ accdetailid }) => accdetailid === val.accdetailid).expireddatebefore;
                        return { ...val, expireddateafter, expireddatebefore, buydate }
                    })
                }
                this.setState({ selectedTrx })
            }
        })
    };

    getCatalogDetail = (buymileageid) => {
        DetailRequest(api.url.buymileagecatalog.detail, { buymileageid }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                this.setState({ catalogData: result })
            }
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        const callback = async (input) => {
            this.setState({ isLoading: true });

            const { fieldvalue, selectedTransaction } = this.state;
            const { miles } = fieldvalue;
            const { paymenttype, currencycode, buydate, buymileageid } = input || {};
            const memberid = this.props.match.params.ID;
            const accountdetails = selectedTransaction.map(function (item) { return item['accdetailid'] });

            let data = {
                buymileageid, memberid, paymenttype, accountdetails, miles: Number(miles),
                currencycode: (paymenttype === 'MILEAGE') ? null : currencycode,
                buydate: moment(buydate).format('YYYY-MM-DD HH:mm:ss'),
                source: 'BO',
                partnercode: null,
                promoid: null,
                qty: selectedTransaction.length,
            };
            let url = api.url.memberbuymileage.buy;
            SaveRequest(url, data).then(async (response) => {
                const { status = {} } = response || {};
                if (status.responsecode === '0000') {
                    const memberbuymileageid = (response && response.result && response.result.memberbuymileageid) ? response.result.memberbuymileageid : null;
                    Alert.success(status.responsemessage);

                    if (memberbuymileageid) await this.props.history.push('/member/form/' + this.props.match.params.ID + '/buy-mileage');
                    await this.props.history.push({ pathname: `/member/form/${memberid}/buy-mileage/form-expired-buy/${memberbuymileageid}/confirmation`, state: { selectedTransaction, fromCreate: true } });
                } else Alert.error(status.responsemessage);
                this.setState({ isLoading: false });
            });
        }

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                confirm({
                    title: 'Are you sure buy this mileage?',
                    onOk(e) {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            callback(input);
                        }).catch(() => console.log('Oops errors!'));
                    },
                });
            }
        });
    };

    handleForm = (value) => {
        this.setState({ openForm: value, selectedEligible: (value) ? this.state.selectedEligible : [] })
    };

    getPrice = async (paymenttype, currencycode, buymileageid) => {
        const { miles } = this.state.fieldvalue;

        const memberid = this.props.match.params.ID;
        const date = moment(this.props.form.getFieldValue('buydate')).format('YYYY-MM-DD');
        const qty = 1;

        const data = (paymenttype === 'CASH') ? { memberid, buymileageid, currencycode, miles, date, qty, paymenttype } : { memberid, buymileageid, miles, date, qty, paymenttype };
        const url = api.url.memberbuymileage.getprice;
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (result && status.responsecode === '0000') {
                const { buymileagename, mileagetype, unittype, calculation, prices, pricetype, basemileage } = result;
                const { price, currencycode } = result.price;
                const { includevat, vatamount, totalprice, totalamount, packagemileage } = calculation;

                this.props.form.setFieldsValue({ catalogueprice: (price && basemileage) ? `${price} / ${basemileage}` : price })
                this.setState({
                    priceDetail: {
                        ...this.state.priceDetail, buymileagename, mileagetype, unittype, prices, pricetype, currencycode, includevat, packagemileage,
                        totalprice: Number(totalprice).toLocaleString('en-US'),
                        totalamount: Number(totalamount).toLocaleString('en-US'),
                        vatamount: Number(vatamount).toLocaleString('en-US')
                    }
                });
            } else Alert.error(status.responsemessage);
        });
    };

    handleBackForm = () => {
        const { match, location } = this.props;
        const { selectedEligible } = location.state;
        const requestForm = JSON.parse(location.state.form);

        this.props.history.push({ pathname: `/member/form/${match.params.ID}/buy-mileage/form-expired`, state: { form: requestForm, buyPage: true, selectedEligible } });
    };

    handleChange = async (value, type) => {
        await this.setState({ [type]: value, isLoading: true, priceDetail: this.state.priceDetail });
        await this.props.form.setFieldsValue({ paymenttype: this.state.fieldvalue.paymentType });
        await this.setState({ isLoading: false });
    };

    handleSeeTransaction = async (trxid) => {
        await this.props.history.push('/member/');
        await this.props.history.push(`/member/form/${this.props.match.params.ID}/transaction/detail/${trxid}`);
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isLoading, showconfirmation, actionspage, priceDetail, memberbuymileagedetail, selectedEligible, fieldvalue, showselectedtransaction, selectedTransaction, selectedTrx } = this.state;
        const { totalamount, status, verifydate, mileagetype } = priceDetail;
        const { paymentType, paymentcode, receiptnumber } = fieldvalue;
        const { memberlock } = this.props;
        const { blockaccrual } = memberlock || {};

        const memberid = this.props.match.params.ID;
        const confirmfielddisabled = this.props.form.getFieldValue('paymenttype') === undefined ? true : ((this.props.form.getFieldValue('currencycode') === undefined) && paymentType === 'CASH') ? true : totalamount ? false : true;

        return (
            <React.Fragment>
                <Modal visible={showconfirmation || showselectedtransaction} title={(showconfirmation) ? 'View Detail Confirmation' : 'Selected Transaction'} loading={isLoading} footer={null} destroyOnClose={true} width={(showconfirmation) ? 800 : 1000}
                    onCancel={() => (showconfirmation) ? this.handleChange(false, 'showconfirmation') : this.handleChange(false, 'showselectedtransaction')} style={{ top: (showconfirmation) ? 0 : 20 }}>
                    {
                        (showconfirmation) ? <ConfirmationForm {...this.props} actionspage={actionspage} actionsconfirmationpage={'confirmation'} memberid={memberid} memberbuymileageid={memberbuymileagedetail.memberbuymileageid} memberbuymileagedetail={memberbuymileagedetail}
                            onClose={() => this.handleChange(false, 'showconfirmation')} primaryemail={this.props.profile.email} paymenttype={paymentType} status={status} /> :
                            <SelectedTransaction {...this.props} dataList={(actionspage === 'create') ? selectedEligible : selectedTransaction} onClose={() => this.handleChange(false, 'showselectedtransaction')} status={status} selectedTrx={selectedTrx} actionspage={actionspage} refreshHeader={() => this.props.refreshHeader()} />
                    }
                </Modal>

                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}><Button htmlType={actionspage === 'create' ? 'button' : 'link'} url={`/member/form/${memberid}/buy-mileage`} shape='circle' icon='left' onClick={this.handleBackForm} /> Member Buy to Extend Mileage</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <Row>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24} style={{ marginBottom: 20 }}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 14, pull: 1 }} xl={14} style={{ marginTop: 30 }}>
                                    <DatePickerBase form={this.props.form} labeltext='Buy Date' datafield='buydate' disabled={true} />
                                    <BuyMileageCatalogSelect form={this.props.form} labeltext='Catalogue' datafield='buymileageid' disabled={true} ref={(e) => { this.componentCatalogSelect = e }} />
                                    <RadioButton form={this.props.form} labeltext='Payment Type' datafield='paymenttype' validationrules={['required']} options={PaymentType} disabled={true} />
                                    {(paymentType === 'CASH') ? <CurrencySelect form={this.props.form} labeltext='Currency Code' datafield='currencycode' validationrules={['required']} disabled={true} /> : ''}
                                    <InputText form={this.props.form} labeltext='Catalogue Price' datafield='catalogueprice' validationrules={['required']} disabled={true} placeholder={'Catalog Price'} suffix='Miles' />
                                    <Form.Item label='Transaction'>
                                        <Button htmlType='button' type='primary' label='See Selected Transaction Expired' disabled={false} style={{ marginBottom: 15, marginLeft: -1 }} onClick={() => this.handleChange(true, 'showselectedtransaction')} />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={10} xl={10}>
                                    {
                                        ((status === 'SUCCESS') && (mileagetype === 'EXPIRED') && paymentcode) ?
                                            <Button htmlType='button' type='default' label='See Mileage Used' disabled={false} block={true} style={{ marginBottom: 15, marginLeft: -1 }} onClick={() => this.handleSeeTransaction(paymentcode)} /> : null
                                    }
                                    {(actionspage === 'create') ? '' : <Card title='Verify Status' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginBottom: '20px' }}>
                                        <Row style={{ marginBottom: 10 }}>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Status</label></Col>
                                            <Text style={{ display: 'block' }}>
                                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>
                                                    <Tag color={(status === 'SUCCESS') ? '#87d068' : '#f50'}>{(status) ? jsUcfirst(status, '_') : '-'}</Tag>
                                                </Col>
                                            </Text>
                                        </Row>
                                        {(status === 'SUCCESS') ? <Row style={{ marginBottom: 10 }}>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Verify Date</label></Col>
                                            <Text strong style={{ display: 'block' }}>
                                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{verifydate ? moment(verifydate).format('DD/MM/YYYY HH:MM:SS') : '-'}</Col>
                                            </Text>
                                        </Row> : ''}
                                        {
                                            (receiptnumber) ?
                                                <Row style={{ marginTop: 5 }}>
                                                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                                        <Text style={{ display: 'block' }}><label>Receipt Number</label></Text>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>
                                                        <Text strong style={{ display: 'block' }}>{((receiptnumber === ' ') || (receiptnumber === 'null')) ? '-' : receiptnumber}</Text>
                                                    </Col>
                                                </Row> : null
                                        }
                                        {
                                            (status === 'WAITING_FOR_PAYMENT') ?
                                                <Row>
                                                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                                        <Text strong style={{ display: 'block' }}>Payment Time Limit</Text>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>
                                                        <Text type="danger" strong style={{ display: 'block' }}>{(memberbuymileagedetail.paymentverificationtimeout) ? moment(memberbuymileagedetail.paymentverificationtimeout).format("DD/MM/YYYY HH:mm:ss") : '-'}</Text>
                                                    </Col>
                                                </Row> : null
                                        }
                                        {(status === 'SUCCESS') ? <Button htmlType='button' type='default' label='View Detail' disabled={false} block={true} style={{ marginTop: 10 }} onClick={() => this.handleChange(true, 'showconfirmation')} /> : ''}
                                    </Card>}

                                    <PriceDetails fieldvalue={fieldvalue} priceDetail={priceDetail} catalogData={this.state.catalogData} status={status} blockaccrual={blockaccrual} selectedTransaction={selectedTransaction} actionspage={actionspage} />

                                    {(memberbuymileagedetail && memberbuymileagedetail.status === 'WAITING_FOR_PAYMENT') ? <Button htmlType='button' type='primary' label='Confirm' block={true} onClick={() => this.handleChange(true, 'showconfirmation')} /> :
                                        (actionspage === 'create') ? <Button htmlType='submit' type='primary' label='Buy' disabled={confirmfielddisabled} block={true} /> :
                                            <Button htmlType='html' url={`/member/form/${memberid}/buy-mileage`} type='default' label='Back' disabled={false} block={true} className={(actionspage === 'create') ? 'hidden' : ''} />}
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Spin >
            </React.Fragment >
        );
    }
}

export default Form.create()(App);