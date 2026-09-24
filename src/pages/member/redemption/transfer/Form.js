import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { connect } from 'react-redux';
import { InputNumber, Button, Alert, DatePickerBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card } from 'antd';
import moment from 'moment';
import { getTravelerType } from '../../../../utilities/Helpers';
import { getProfile } from '../../../../utilities/AuthService';

const { Title } = Typography;

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
            responseBuyAward: {}
        }
    }

    componentDidMount() {
        document.title = ' Redemption Transfer | Loyalty Management System ';
        this.retriveDetail(this.props.match.params.awardcode);
    }

    retriveDetail = (awardcode) => {
        DetailRequest(api.url.awardmaster.detailbasicinfo, { awardcode }).then((response) => {
            this.setState({ isLoading: true });
            let { status, result } = response;
            if (status.responsecode === '0000') {
                let awardinfo = result;
                console.log('awardinfo', awardinfo);
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
    }

    saveAction = (e, typeButton) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { awardinfo } = this.state;
                const { profile } = this.props;
                const { price, trxdate } = input || {};
                let age = moment().diff(moment(profile.dateofbirth), 'years');

                let promocode = null;
                let channelapp = 'amalabo';
                let issueddate = moment().format('YYYY-MM-DD');
                let memberid = this.props.match.params.ID;
                let totalprice = input.quantity === undefined ? price : (price * input.quantity);
                let quantity = input.quantity === undefined ? 1 : Number(input.quantity);
                let username = getProfile().username;
                let bookingcode = null;
                let ticketnumber = null;
                let freeaward = false;
                let redeemairactivity = null;
                let remark = null;
                let ticketvaliditydate = null;
                let awardcode = awardinfo.awardcode;
                let redeemuser = [
                    {
                        name: profile.firstname,
                        familyname: profile.lastname,
                        salutationcode: null,
                        memberiduser: profile.cardnumber,
                        certificateprice: Number(price),
                        activitydate: moment(trxdate).format('YYYY-MM-DD'),
                        selfusage: true,
                        travelertype: getTravelerType(age)
                    }
                ]

                let data = (typeButton === 'BUY') ? {
                    promocode, channelapp, issueddate, memberid, totalprice, quantity, username, bookingcode, ticketnumber, freeaward,
                    redeemairactivity, remark, ticketvaliditydate, awardcode, redeemuser, return: null
                } : {
                    referenceid: null, memberid, requesttype: "REDEMPTION", requeststatus: "NEW", approvalby: null, approvaldate: null, remark: null, reqdatas: {
                        url: 'redemption/transaction/v1.2/buyaward', promocode, channelapp, issueddate, memberid, totalprice, quantity, username, bookingcode, ticketnumber,
                        freeaward, redeemairactivity, remark, ticketvaliditydate, awardcode, redeemuser, return: null, categorycode: awardinfo.categorycode, awardinfo
                    }
                }

                let url = (typeButton === 'BUY') ? api.url.redemption.buyaward : api.url.requestapproval.create;
                SaveRequest(url, data).then((response) => {
                    let { status, result } = response;
                    if (status.responsecode === '0000') {
                        Alert.success(status.responsemessage);
                        this.props.refreshHeader();
                        if (typeButton === 'BUY') {
                            this.setState({ isSuccessBuy: true, responseBuyAward: result })
                        } else {
                            this.props.history.push(`/member/form/${memberid}/redemption`);
                        };
                    } else {
                        Alert.error(status.responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChange = (type, value) => {
        this.setState({ [type]: value })
    };

    render() {
        const { formrender, trxdate, awardinfo, price, quantity, errormessage, isSuccessBuy, responseBuyAward } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 9 } }
        };

        if (isSuccessBuy) {
            return (<Redirect to={{ pathname: `/member/form/${this.props.match.params.ID}/redemption/transfer/${awardinfo.awardcode}/certificate`, state: { responseBuyAward } }} />)
        } else {
            if (formrender) {
                return (
                    <Row>
                        <Row>
                            <Title level={4}><Button url={'/member/form/' + this.props.match.params.ID + '/redemption'} shape='circle' icon='left' />  Redemption Transfer</Title>
                            <Divider />
                        </Row>
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
                                                    {awardinfo.cardnumber}{(awardinfo.nameoncard === null || awardinfo.nameoncard === undefined) ? (awardinfo.firstname) ? ` - ${awardinfo.firstname} ${(awardinfo.lastname) ? ` ${awardinfo.lastname}` : ''}` : '' : ` - ${awardinfo.nameoncard}`}</Col>
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
                                        <Button htmlType='button' type='primary' block={true} label='Send' menucode={'REDEEM'} prefixmenuname={'REDEEM'} actioncode={'BUY'} style={{ marginTop: '20px' }}
                                            disabled={awardinfo.pricingby === 'FIXED' ? (quantity && trxdate ? false : true) : (price && trxdate ? false : true)} onClick={(e) => this.saveAction(e, 'BUY')} />
                                        <Button htmlType='button' type='primary' block={true} label='Request' menucode={'REDEEM'} prefixmenuname={'REDEEM'} actioncode={'REQUEST'} style={{ marginTop: '20px' }}
                                            disabled={awardinfo.pricingby === 'FIXED' ? (quantity && trxdate ? false : true) : (price && trxdate ? false : true)} onClick={(e) => this.saveAction(e, 'REQUEST')} />
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
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
