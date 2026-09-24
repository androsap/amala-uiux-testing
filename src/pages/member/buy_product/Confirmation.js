import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Button, Alert, SelectBase, InputText } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Typography } from 'antd';
import { formatNumber } from '../../../utilities/Helpers';
import { PaymentMethodOrder } from '../../../data';
import moment from 'moment';

const { Text } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            inventoryvariantname: null,
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
                paymentfielddisabled: false
            }
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });

        setTimeout(() => {
            let { buyproductdetail, actionsconfirmationpage, primaryemail, showconfirmation } = this.props;
            let { membersecondaryemail, paymentmethod, emd, paymenttype, mailingproduct } = buyproductdetail;

            if (actionsconfirmationpage === 'view' && !showconfirmation) {
                this.props.form.setFieldsValue({ primaryemail, membersecondaryemail, emd, paymentmethod });
                this.setState({
                    paymentmethod,
                    fielddisabled: {
                        ...this.state.fielddisabled,
                        specialfielddisabled: true,
                        generalfielddisabled: true,
                        paymentfielddisabled: true
                    }
                });
            } else {
                const { isfree } = mailingproduct || buyproductdetail || {};

                this.setState({ fielddisabled: { ...this.state.fielddisabled, paymentfielddisabled: (isfree || (paymenttype === 'MILEAGE')) ? true : false } });
                this.props.form.setFieldsValue({
                    primaryemail,
                    paymentmethod: (paymenttype === 'MILEAGE') ? 'MILEAGE' : isfree ? 'CASH' : undefined
                });
            };
            this.getInventory();
        }, 1000);
    };

    getInventory = async () => {
        const { mailingproduct, inventoryvariantid } = this.props.buyproductdetail;
        const { inventorycode } = mailingproduct;

        await DetailRequest(api.url.inventorysys.detail, { inventoryvariantid, inventorycode }).then((response) => {
            if (response.status.responsecode === '0000') {
                const inventoryvariantname = response.result.variants.find(val => val.inventoryvariantid === inventoryvariantid).inventoryvariantname;
                this.setState({ inventoryvariantname });

            } else Alert.information(response.status.responsemessage);
        });
        await this.setState({ isLoading: false });
    };

    saveAction = async (e, type) => {
        e.preventDefault();
        await this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                const { primaryemail, membersecondaryemail, paymentmethod, emd, cardissuer, cardidentifier, transactioncode } = input || {};
                const { ordercode } = this.props.buyproductdetail || undefined;

                let url = api.url.memberbuyproduct.confirmation;
                let data = {
                    primaryemail, paymentmethod, ordercode, cardissuer, cardidentifier, transactioncode,
                    emd: (emd) ? emd : null,
                    membersecondaryemail: (membersecondaryemail) ? membersecondaryemail : null
                };

                SaveRequest(url, data).then(async (response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : 'New data has been updated');

                        await this.props.refreshHeader();
                        await this.props.onClose();
                        await this.props.history.push(`/member/form/${this.props.match.params.ID}/buy-product`);

                        await this.setState({ isLoading: false });
                    } else {
                        Alert.error(responsemessage);
                        await this.setState({ isLoading: false });
                    }
                });
            }
        });
    };

    handleChange = (paymentmethod) => {
        this.setState({ paymentmethod });
    };

    render() {
        const { fielddisabled, isLoading, actionspage, inventoryvariantname, paymentmethod } = this.state;
        const { generalfielddisabled, paymentfielddisabled } = fielddisabled;
        const { buyproductdetail, actionsconfirmationpage } = this.props;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        const paymenttype = (buyproductdetail && buyproductdetail.paymenttype) ? buyproductdetail.paymenttype : null;
        const currencycode = (buyproductdetail && buyproductdetail.currencycode) ? buyproductdetail.currencycode : null;
        const orderdate = (buyproductdetail && buyproductdetail.orderdate) ? moment(buyproductdetail.orderdate).format('DD/MM/YYYY HH:mm:ss') : '-';
        const mailingproductname = (buyproductdetail && buyproductdetail.mailingproduct) ? buyproductdetail.mailingproduct.mailingproductname : '-';
        const totalamount = (buyproductdetail && (buyproductdetail.totalprice !== null && buyproductdetail.totalprice !== undefined)) ? formatNumber(buyproductdetail.totalprice) : '-';
        const paymentverificationtimeout = (buyproductdetail && (buyproductdetail.paymentverificationtimeout)) ? moment(buyproductdetail.paymentverificationtimeout).format('DD/MM/YYYY HH:mm:ss') : '-';
        const isfree = (buyproductdetail && buyproductdetail.mailingproduct && buyproductdetail.mailingproduct.isfree) ? true : false;
        const qty = (buyproductdetail && buyproductdetail.qty) ? buyproductdetail.qty : null;

        const optionsPaymentMethod = (paymenttype === 'MILEAGE') ? PaymentMethodOrder.slice(2) : PaymentMethodOrder.slice(0, 2);

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <Form.Item label='Payment Time Limit' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>
                                        <Text type='danger' strong style={{ display: 'block' }}>{paymentverificationtimeout}</Text>
                                    </span>
                                </Form.Item>
                                <Form.Item label='Order Date' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{orderdate}</span>
                                </Form.Item>
                                <Form.Item label='Mailing Product' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{mailingproductname}</span>
                                </Form.Item>
                                <Form.Item label='Variant Name' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{inventoryvariantname}</span>
                                </Form.Item>
                                <Form.Item label='Quantity' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{qty}</span>
                                </Form.Item>
                                <Form.Item label='Total Price' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{(paymenttype === 'MILEAGE') ? `${totalamount} Miles` : `${currencycode} ${totalamount}`}</span>
                                </Form.Item>
                                <InputText form={this.props.form} labeltext='Primary Email' datafield='primaryemail' validationrules={['required', 'pattern.email']} disabled={true} />
                                <InputText form={this.props.form} labeltext='Secondary Email' datafield='membersecondaryemail' validationrules={['pattern.email']} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext='Payment Method' datafield='paymentmethod' validationrules={['required']} options={optionsPaymentMethod}
                                    disabled={paymentfielddisabled} onChange={this.handleChange} />
                                {
                                    (paymentmethod === 'CREDIT_CARD' || paymentmethod === 'DEBIT_CARD') ? <Row>
                                        <InputText form={this.props.form} labeltext='Card Issuer' datafield='cardissuer' validationrules={['required', 'pattern.alphanumeric']} maxLength={10} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext='Card Identifier' datafield='cardidentifier' validationrules={['required', 'pattern.alphanumeric']} maxLength={4} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext='Transaction Code' datafield='transactioncode' validationrules={['required']} disabled={generalfielddisabled} />
                                    </Row> : null
                                }
                                {(paymenttype !== 'MILEAGE') ? <InputText form={this.props.form} labeltext='EMD' datafield='emd' validationrules={['required']} disabled={generalfielddisabled} /> : null }
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            {(actionspage !== 'view' && actionsconfirmationpage === 'confirmation') ? <Button htmlType='button' type='primary' label='Confirm' onClick={(e) => this.saveAction(e, 'BUY')} /> : null}
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));