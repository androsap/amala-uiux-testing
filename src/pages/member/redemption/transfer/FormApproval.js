import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { connect } from 'react-redux';
import { getProfile } from '../../../../utilities/AuthService';
import { InputNumber, Button, Alert, DatePickerBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Card, Modal } from 'antd';
import moment from 'moment';
import SaveForm from '../../../my_approval/Confirmation';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            formrender: true,
            trxdate: null,
            awardinfo: {},
            price: null,
            quantity: null,
            errormessage: null,
            isSuccessBuy: false,
            generalfielddisabled: true,
            responseBuyAward: {},
            showsave: false
        }
    }

    componentDidMount() {
        this.retriveDetail();
    }

    retriveDetail = async () => {
        const { awardcode, result } = this.props;
        const { redeemuser, quantity } = result.reqdatas;
        await DetailRequest(api.url.awardmaster.detailbasicinfo, { awardcode }).then((response) => {
            this.setState({ isLoading: true });
            let { status, result } = response;
            if (status.responsecode === '0000') {
                let awardinfo = result;
                this.setState({ awardinfo, formrender: true });
                if (awardinfo.pricingby === 'FIXED') {
                    DetailRequest(api.url.awardmaster.detailfixedprice, { awardcode }).then((response) => {
                        let { status, result } = response;
                        if (status.responsecode === '0000') {
                            let price = result.fixprice;
                            this.setState({ price });
                            this.props.form.setFieldsValue({ price });
                        }
                    })
                }
            } else {
                Alert.error(status.responsemessage);
                this.setState({ formrender: false, errormessage: status.responsemessage });
            }
            this.setState({ isLoading: false });
        });
        await this.setState({ quantity, trxdate: moment(redeemuser ? redeemuser.activitydate : redeemuser[0].activitydate) });
        await this.props.form.setFieldsValue({ quantity, trxdate: moment(redeemuser ? redeemuser.activitydate : redeemuser[0].activitydate) });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true, showsave: false });
                const { awardcode, result } = this.props;
                const { referenceid, approvalby, approvaldate, createdBy, isdataactive, memberid, reqdatas, requestid, requeststatus, requesttype, reqdata } = result;
                const { promocode, channelapp, freeaward, url, redeemuser, categorycode, awardinfo } = reqdatas;
                const { familyname, name, selfusage, travelertype, memberiduser } = redeemuser[0] || redeemuser;
                const { price, quantity, trxdate } = input || {};

                let data = {
                    referenceid, requestid, memberid, requesttype, requeststatus, approvalby, approvaldate, remark: input.remark ? input.remark : null, createdBy, isdataactive, reqdata,
                    reqdatas: {
                        url, promocode, channelapp, memberid, freeaward, awardcode, awardinfo, categorycode, return: null, 
                        totalprice: quantity === undefined ? price : (price * quantity),
                        quantity: quantity === undefined ? 1 : Number(quantity),
                        issueddate: moment().format('YYYY-MM-DD'),
                        username: getProfile().username,
                        ticketvaliditydate: null,
                        redeemuser: [
                            {
                                name, selfusage, travelertype, familyname, memberiduser,
                                salutationcode: null,
                                certificateprice: Number(price),
                                activitydate: moment(trxdate).format('YYYY-MM-DD'),
                            }
                        ]

                    }
                }
                SaveRequest(api.url.requestapproval.update, data).then(async (response) => {
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
        });
    };

    onChange = (type, value) => {
        this.setState({ [type]: value })
    };

    render() {
        const { formrender, trxdate, awardinfo, price, quantity, errormessage, showsave } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 9 } }
        };
        if (formrender) {
            return (
                <Row>
                    <Modal visible={showsave} footer={null} onCancel={() => this.onChange('showsave', false)} destroyOnClose={true} width={400}>
                        <SaveForm {...this.props} onOk={this.saveAction} onClose={() => this.onChange('showsave', false)} />
                    </Modal>

                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={14} xl={13} style={{ marginTop: 25 }}>
                                    <DatePickerBase form={this.props.form} labeltext='Transaction Date' datafield='trxdate' validationrules={['required']} maxDate={moment()} onChange={value => this.onChange('trxdate', value)} />
                                    <InputNumber form={this.props.form} labeltext='Price' datafield='price' validationrules={['required']} min={1} onChange={value => this.onChange('price', value)} disabled={awardinfo.pricingby === 'FIXED' ? true : false} />
                                    <InputNumber className={awardinfo.pricingby === 'FIXED' ? '' : 'hidden'} labeltext='Quantity' datafield='quantity' validationrules={awardinfo.pricingby === 'FIXED' ? ['required'] : []}
                                        form={this.props.form} min={1} onChange={value => this.onChange('quantity', value)} />
                                </Col>
                                <Col className={'gutter-row'} xs={24} sm={24} md={24} lg={10} xl={11} >
                                    <Card title='Recipient' bordered={false} className='card-shadow' style={{ marginBottom: 30 }}>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}><label> Award Code </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>{awardinfo.awardcode}</Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}><label> Award Type </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>{awardinfo.awardtypecode}</Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}><label> Recipient </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>
                                                {awardinfo.cardnumber} - {awardinfo.nameoncard === null || awardinfo.nameoncard === undefined ? `${awardinfo.firstname} ${awardinfo.lastname}` : awardinfo.nameoncard}</Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}><label> Custom Transaction </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>{awardinfo.customtrxcode}</Col>
                                        </Row>
                                    </Card>
                                    <Card title='Price Details' bordered={false} className='card-shadow' style={{ marginBottom: 30 }}>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}><label> Transaction Date </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>{trxdate ? moment(trxdate).format('DD-MM-YYYY') : '-'}</Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}><label> {awardinfo.pricingby === 'FIXED' ? 'Total Price' : 'Price'} </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }} className={awardinfo.pricingby === 'FIXED' ? 'hidden' : ''}>{price ? price : '-'}</Col>
                                        </Row>
                                        <Row style={{ marginTop: 4 }} className={awardinfo.pricingby === 'FIXED' ? '' : 'hidden'}>
                                            <Col xs={24} sm={24} md={24} lg={10} xl={10}> <div style={{ marginLeft: 20 }}> {price ? `@  ${price}` : '@ Price'} x {quantity ? quantity : 'Quantity'} </div></Col>
                                            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ textAlign: 'right' }}>{price && quantity ? (price * quantity) : '-'}</Col>
                                        </Row>
                                    </Card>
                                    <Button htmlType='button' type='primary' block={true} label='Update Request' onClick={() => this.onChange('showsave', true)}
                                        disabled={awardinfo.pricingby === 'FIXED' ? (quantity && trxdate ? false : true) : (price && trxdate ? false : true)} />
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={errormessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
