import React from 'react';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Button, DatePickerBase, BuyProductNameSelect, SelectBase, SwitchButton, Alert, CatalogMailingDetails, CurrencySelect, RadioButton, InputNumber } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Alert as AlertAntd } from 'antd';
import { PaymentType, ProductType } from '../../../../data'
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fieldvalue: {
                datavariant: {},
                mailingproduct: {},
                inventoryvariantid: null,
                lettername: null,
                useletter: null
            },
            fielddisabled: {
                productmailingfielddisabled: true
            }
        }
    };

    componentDidMount = async () => {
        const { historyPage, data } = this.props;

        if (historyPage) {
            const { lettername, printletter, mailingproductcode, inventoryvariantid, qty, producttype, orderdate, mailingproduct, variantdata, isfree, paymenttype, currencycode } = data

            await this.setState({ isLoading: true });
            await this.componentBuyProductNameSelect.getProductMailing({ producttype, date: orderdate });
            await this.componentBuyProductNameSelect.onChangeProduct(mailingproductcode);
            await this.setState({
                isLoading: false,
                fieldvalue: { ...this.state.fieldvalue, lettername, mailingproduct, inventoryvariantid, datavariant: variantdata },
                fielddisabled: { ...this.state.fielddisabled, productmailingfielddisabled: false }
            });

            this.props.form.setFieldsValue({
                lettername, printletter, mailingproductcode, inventoryvariantid, qty, producttype, isfree, paymenttype, currencycode,
                orderdate: moment(orderdate)
            });
        }
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const { orderdate, producttype, mailingproductcode, qty, printletter, inventoryvariantid, isfree, paymenttype, currencycode } = input || {};
                const { lettername, datavariant, mailingproduct } = this.state.fieldvalue;

                let data = { orderdate, producttype, mailingproductcode, qty, printletter, lettername, inventoryvariantid, mailingproduct, isfree, paymenttype, currencycode, variantdata: datavariant };
                this.props.handleNext(false, 'productform', data);
            }
        })
    };

    onChange = async (value, type, lettername) => {
        const { fielddisabled, fieldvalue } = this.state;

        await this.setState({ isLoading: true, fieldvalue: { ...this.state.fieldvalue, mailingproduct: {}, datavariant: {} } });
        if (type === 'producttype') {
            this.props.form.resetFields(['qty', []]);

            if (value) this.componentBuyProductNameSelect.getProductMailing({ producttype: value, date: moment().format('YYYY-MM-DD') });
            if (value === 'CARD') this.props.form.setFieldsValue({ qty: 1 });

            this.componentBuyProductNameSelect.resetVariant();
            this.props.form.resetFields(['mailingproductcode', 'inventoryvariantid', 'lettercode', 'priorityhandling', []]);
            this.setState({ fielddisabled: { ...fielddisabled, productmailingfielddisabled: (value) ? false : true } });

        } else if (type === 'productmailing') {
            await this.getMailingProduct(value, lettername);
        } else this.setState({ fieldvalue: { ...fieldvalue, [type]: value } });
        await this.setState({ isLoading: false });
    };

    onChangeQuantity = (rule, value, callback) => {
        const { datavariant, inventoryvariantid } = this.state.fieldvalue;
        const varianstock = datavariant.variants.find(val => val.inventoryvariantid === inventoryvariantid).quantity;

        if (value && value <= 0 && varianstock !== 0) {
            callback('Quantity must be greater than 0')
        } else if ((value > varianstock) && varianstock !== 0) {
            callback(`Quantity must be smaller than ${varianstock}`)
        } else if (varianstock === 0) callback(`Out of Stock`);

        callback();
    };

    getMailingProduct = async (mailingproductcode, lettername) => {
        let url = api.url.mailingproduct.detail;
        let data = { mailingproductcode };

        await DetailRequest(url, data).then((response) => {
            const { result } = response;
            if (response.status.responsecode === '0000' && result) {
                const { useletter } = result
                this.setState({ fieldvalue: { ...this.state.fieldvalue, lettername, useletter, mailingproduct: response.result } });
            } else Alert.error(response.status.responsemessage);
        });
    };

    handlePayment = (value, type) => {
        if (type === 'paymenttype') {
            this.setState({ paymenttype: value.target.value });
            this.props.form.resetFields(['currencycode', []]);
        } else if (value) {
            setTimeout(() => { this.props.form.setFieldsValue({ paymenttype: 'CASH', currencycode: 'IDR' }); }, 50);
        } else setTimeout(() => { this.props.form.setFieldsValue({ paymenttype: 'CASH', currencycode: null }); }, 50);
    };

    render() {
        const { masterfielddisabled } = this.props;
        const { isfreefielddisabled, paymentcurrencyfielddisabled } = masterfielddisabled;
        const { fieldvalue, fielddisabled, isLoading } = this.state;
        const { productmailingfielddisabled } = fielddisabled;
        const { lettername, inventoryvariantid, mailingproduct, datavariant, useletter } = fieldvalue || {};
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        const producttype = this.props.form.getFieldValue('producttype');
        const paymenttype = this.props.form.getFieldValue('paymenttype');
        const variantid = this.props.form.getFieldValue('inventoryvariantid');
        const isfree = this.props.form.getFieldValue('isfree');
        const quantity = this.props.form.getFieldValue('qty') ? this.props.form.getFieldValue('qty') : 0;
        const variantdata = this.props.form.getFieldValue('inventoryvariantid') ? datavariant : {};
        const varianstock = (Object.keys(variantdata).length !== 0 && variantdata.variants.find(val => val.inventoryvariantid === inventoryvariantid)) ?
            (variantdata.variants.find(val => val.inventoryvariantid === inventoryvariantid).quantity) : null;

        const nextbuttondisabled = (varianstock && (quantity > 0)) ? false : true;
        const quantityfielddisabled = (variantid) ? (producttype === 'CARD') ? true : false : true;
        const printletterfielddisabled = (useletter) ? false : true;

        return (
            <React.Fragment>
                <Spin spinning={isLoading} >
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} lg={{ span: 14 }}>
                                <DatePickerBase form={this.props.form} labeltext='Order Date' datafield='orderdate' validationrules={['required']} defaultValue={moment()} disabled={true} />
                                <SelectBase form={this.props.form} labeltext='Product Type' datafield='producttype' validationrules={['required']} options={ProductType} disabled={false} onChange={(e) => this.onChange(e, 'producttype')} />
                                <BuyProductNameSelect ref={(e) => { this.componentBuyProductNameSelect = e }} labeltext='Product Name' datafield={['mailingproductcode', 'inventoryvariantid']}
                                    form={this.props.form} disabled={productmailingfielddisabled} validationrules={['required']} onChangeProduct={this.onChange} onChangeVariant={this.onChange} />
                                <InputNumber form={this.props.form} labeltext='Quantity' datafield='qty' validationrules={['required', 'pattern.number', this.onChangeQuantity]} disabled={quantityfielddisabled} min={0} />
                                <Form.Item label='Letter'>
                                    <span className='ant-form-text'>{(lettername) ? lettername : '-'}</span>
                                </Form.Item>
                                <SwitchButton form={this.props.form} labeltext='Print Letter' defaultChecked={false} datafield='printletter' disabled={printletterfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext='Is Free' datafield='isfree' defaultChecked={false} disabled={isfreefielddisabled} onChange={this.handlePayment} />
                                <RadioButton form={this.props.form} labeltext='Payment Type' datafield='paymenttype' validationrules={['required']} options={PaymentType} onChange={(e) => this.handlePayment(e, 'paymenttype')} disabled={paymentcurrencyfielddisabled} />
                                {
                                    (paymenttype === 'CASH' || isfree) ? <CurrencySelect form={this.props.form} labeltext='Currency Code' datafield='currencycode' validationrules={['required']} disabled={paymentcurrencyfielddisabled} /> : null
                                }
                            </Col>
                            <Col className='gutter-row' xs={24} lg={{ span: 10 }} >
                                {(varianstock === 0) ? <div>
                                    <AlertAntd message='Out of Variant Stock' type='warning' description='This variant is currently unavailable. Please choose a different variant or restock this variant' showIcon />
                                    <br></br>
                                </div> : null}
                                <CatalogMailingDetails mailingproduct={mailingproduct} variantdata={variantdata} inventoryvariantid={inventoryvariantid} />
                                <Button htmlType='button' type='primary' label='Next Input Destination' block={true} onClick={this.saveAction} disabled={nextbuttondisabled} />
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);