import React, { Component } from 'react';
import { SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { Button, Alert, SelectBase, SwitchButton, InputText } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Typography } from 'antd';
import { formatNumber } from '../../../../utilities/Helpers';
import { PaymentMethod } from '../../../../data'
import moment from 'moment';

const { Text } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.getDetail();
            this.setState({ isLoading: false });
        }, 1000);
    }

    getDetail = () => {
        const { memberbuymileagedetail, actionsconfirmationpage, status } = this.props;
        let paymentmethod = memberbuymileagedetail || undefined;

        if (actionsconfirmationpage === 'view' || status === 'SUCCESS') {
            let { cardissuer, cardidentifier, refnumber, transactioncode, updatememberemail, memberprimaryemail, membersecondaryemail } = memberbuymileagedetail || undefined;
            paymentmethod = (memberbuymileagedetail.paymenttype === 'CASH') ? ((paymentmethod) ? paymentmethod.paymentmethod : undefined) : 'MILEAGE';

            this.props.form.setFieldsValue({
                updatememberemail: updatememberemail ? updatememberemail : false,
                primaryemail: memberprimaryemail,
                paymentmethodconfirm: paymentmethod,
                membersecondaryemail, cardissuer, cardidentifier, refnumber, transactioncode
            });
            this.setState({ fielddisabled: { ...this.state.fielddisabled, specialfielddisabled: true, generalfielddisabled: true } });
        } else {
            const { primaryemail, paymenttype } = this.props;
            paymentmethod = (paymenttype === 'CASH' ? undefined : (memberbuymileagedetail.paymenttype === 'CASH' ? undefined : 'MILEAGE'))
            this.props.form.setFieldsValue({ primaryemail });
        };
        this.setState({ paymentmethod });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { updatememberemail, membersecondaryemail, paymentmethodconfirm, cardissuer, cardidentifier, refnumber, transactioncode } = input || null;
                const url = api.url.memberbuymileage.confirmation;
                const data = {
                    memberbuymileageid: (this.props.memberbuymileageid) ? this.props.memberbuymileageid : null,
                    updatememberemail: updatememberemail ? updatememberemail : false,
                    paymentmethod: paymentmethodconfirm,
                    membersecondaryemail: (membersecondaryemail || membersecondaryemail !== '') ? membersecondaryemail : null,
                    cardissuer, cardidentifier, refnumber, transactioncode
                };

                SaveRequest(url, data).then(async (response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : 'New data has been updated');

                        await this.props.refreshHeader();
                        await this.props.onClose();
                        await this.props.history.push('/member/form/' + this.props.match.params.ID + '/buy-mileage');
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                });
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { generalfielddisabled } = this.state.fielddisabled;
        const { isLoading } = this.state;
        const { memberbuymileagedetail, status } = this.props;
        const { paymenttype, mileagetype } = memberbuymileagedetail;

        const NewPaymentMethod = (paymenttype && (paymenttype === 'MILEAGE')) ? [{ label: 'Mileage', value: 'MILEAGE' }] : PaymentMethod;
        const updatememberemail = this.props.form.getFieldValue('updatememberemail');

        const paymentmethod = (this.props.form.getFieldValue('paymentmethodconfirm')) ? this.props.form.getFieldValue('paymentmethodconfirm') : undefined;
        const currencycode = (memberbuymileagedetail && memberbuymileagedetail.currencycode) ? memberbuymileagedetail.currencycode : null;
        const buydate = (memberbuymileagedetail && memberbuymileagedetail.buydate) ? moment(memberbuymileagedetail.buydate).format('DD/MM/YYYY HH:mm:ss') : '-';
        const totalamount = (memberbuymileagedetail && (memberbuymileagedetail.totalamount !== null && memberbuymileagedetail.totalamount !== undefined)) ? formatNumber(memberbuymileagedetail.totalamount) : '-';
        const totalmileage = (memberbuymileagedetail && (memberbuymileagedetail.totalmileage !== null && memberbuymileagedetail.totalmileage !== undefined)) ? formatNumber(memberbuymileagedetail.totalmileage) : '-';
        const paymentverificationtimeout = (memberbuymileagedetail && (memberbuymileagedetail.paymentverificationtimeout)) ? moment(memberbuymileagedetail.paymentverificationtimeout).format('DD/MM/YYYY HH:mm:ss') : '-';

        //render form
        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18 }} xl={{ span: 18 }}>
                                <Form.Item label='Payment Time Limit' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>
                                        <Text type='danger' strong style={{ display: 'block' }}>{paymentverificationtimeout}</Text>
                                    </span>
                                </Form.Item>
                                <Form.Item label='Buy Date' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{buydate}</span>
                                </Form.Item>
                                <Form.Item label='Buy Mileage Type' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{mileagetype}</span>
                                </Form.Item>
                                <Form.Item label='Total Mileage' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{totalmileage}</span>
                                </Form.Item>
                                <Form.Item label='Total Price' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{(paymenttype === 'CASH') ? `${currencycode} ${totalamount}` : `${totalamount} Miles`}</span>
                                </Form.Item>
                                <InputText form={this.props.form} labeltext='Primary Email' datafield='primaryemail' validationrules={['required', 'pattern.email']} disabled={true} />
                                <SwitchButton form={this.props.form} labeltext='Update Member Email' datafield='updatememberemail' disabled={true} />
                                <InputText form={this.props.form} labeltext='Secondary Email' datafield='membersecondaryemail' validationrules={(updatememberemail) ? ['required', 'pattern.email'] : ['pattern.email']} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext='Payment Method' datafield='paymentmethodconfirm' validationrules={['required']} options={NewPaymentMethod} disabled={(paymenttype === 'MILEAGE') ? true : generalfielddisabled} defaultValue={(paymenttype === 'MILEAGE') ? 'MILEAGE' : null} />
                                {(paymenttype === 'CASH') ? <Row>
                                    <InputText form={this.props.form} labeltext='Card Issuer' datafield='cardissuer' validationrules={(paymentmethod === 'CREDIT_CARD' || paymentmethod === 'DEBIT_CARD') ? ['required', 'pattern.alphanumeric'] : ['pattern.alphanumeric']} maxLength={10} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Card Identifier' datafield='cardidentifier' validationrules={(paymentmethod === 'CREDIT_CARD' || paymentmethod === 'DEBIT_CARD') ? ['required', 'pattern.alphanumeric'] : ['pattern.alphanumeric']} maxLength={4} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Ref Number' datafield='refnumber' disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Transaction Code' datafield='transactioncode' validationrules={['required']} disabled={generalfielddisabled} /></Row> : ''
                                }
                            </Col>
                        </Row>

                        {status !== 'SUCCESS' ? <Row gutter={24} type='flex' justify='center' style={{ marginTop: 25 }}>
                            <Button htmlType='submit' type='primary' label='Confirm'/>
                        </Row> : ''}
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));