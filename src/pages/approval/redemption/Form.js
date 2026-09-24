import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest, SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Row, Col, Typography, Form, Divider, Spin, Modal, Card } from 'antd';
import { ErrorGeneral, Button, Alert, TextArea, AirActivity, PassengerDetails, CertificateDetails } from '../../../components/Base/BaseComponent';
import { connect } from 'react-redux';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

import RequestHistory from '../redemption/RequestHistory';
import Certificate from '../../../components/Certificate/Index';

const { Title } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            formrender: true,
            visible: {
                visibleHistory: false,
                visibleRemark: false,
                visibleCertificate: false,
                visibleFailed: false
            },
            originAirport: 'null',
            destinationAirport: 'null',
            redeemairactivity: {},
            resultdata: {},
            reqdatas: {},
            responsedatas: [],
            type: null
        };
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = (type) => {
        let requestid = this.props.match.params.ID;
        this.setState({ isLoading: true });
        DetailRequest(api.url.requestapproval.detail, { requestid }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                const { requesttype, reqdatas, responsedatas, requeststatus } = result;
                const { categorycode } = reqdatas;
                if ((categorycode === 'FREEFLIGHT' || categorycode === 'UPGRADE') && requesttype !== 'CANCEL') this.getAirport(reqdatas, responsedatas);
                this.setState({
                    reqdatas, responsedatas,
                    resultdata: result,
                    visible: { ...this.state.visible, visibleFailed: (requeststatus === 'FAILED') ? true : false }
                });
                if (requeststatus !== 'FAILED' && type === 'fromSaveRequest') this.props.history.goBack();

                this.setState({ reqdatas, responsedatas, resultdata: result });
            } else {
                this.setState({ responsecode, responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    getAirport = (reqdatas, responsedatas) => {
        let { redeemairactivity, category } = (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ? reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;
        if (category === 'UPDATE' || (typeof redeemairactivity === 'object' && redeemairactivity !== null && redeemairactivity.departure === undefined)) {
            redeemairactivity = {
                departure: [redeemairactivity.find(o => o.type === 'departure' || o.type === 'DEPARTURE')],
                return: [redeemairactivity.find(o => o.type === 'return' || o.type === 'RETURN')]
            };
        };

        const notUndefined = (element) => element !== undefined;
        const airport = Object.keys(redeemairactivity).map(function (val, index) {
            let result = [];
            if (redeemairactivity[val][0] !== undefined) result = [redeemairactivity[val][0].origin, redeemairactivity[val][0].destination];
            return result
        });

        for (var i = 0; i < 2; i++) {
            const helperValidation = (i === 0) ? 'origin' : 'destination'
            RetrieveRequest(api.url.airport.list, { airportiatacode: (i === 0) ? airport[airport.findIndex(notUndefined)][0] : airport[airport.findIndex(notUndefined)][1] }).then((response) => {
                const { status = {}, result } = response || {};
                const { cityname, airportiatacode, airportname } = result[0] || {};
                if (status.responsecode === '0000' && result) {
                    if (helperValidation === 'origin') { this.setState({ originAirport: `${cityname}(${airportiatacode}), ${airportname}` }) }
                    else { this.setState({ destinationAirport: `${cityname}(${airportiatacode}), ${airportname}` }) }
                }
                else { Alert.error(status.responsemessage) }
            })
        }
    }

    saveAction = (e, type, remark) => {
        e.preventDefault();
        const { resultdata } = this.state;
        const { requestid, memberid, approvalstatus, requesttype } = resultdata;
        const callback = () => {
            this.props.form.validateFieldsAndScroll((err) => {
                if (!err) {
                    this.setState({ isLoading: true });
                    //define parameter               
                    let url = api.url.requestapproval.approval;
                    let data = {
                        requestid, memberid, approvalstatus, requesttype, remark,
                        requeststatus: (type === 'approve') ? 'APPROVED' : (type === 'reject') ? 'REJECTED' : 'REVISE'
                    };

                    SaveRequest(url, data).then((response) => {
                        const { status = {} } = response;
                        const { responsecode, responsemessage } = status;
                        if (responsecode === '0000') {
                            let message = (responsemessage) ? responsemessage : 'New data has been created';
                            Alert.success(message);
                            this.handleCancel();
                            this.getDetail('fromSaveRequest');
                        } else {
                            this.getDetail();
                            Alert.error(responsemessage);
                        }
                        this.setState({ isLoading: false });
                    })
                }
            });
        }
        (type === 'approve') ?
            confirm({
                title: `Are you sure to ${type} this data?`,
                onOk(e) {
                    return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                        callback();
                    }).catch(() => console.log('Oops errors!'));
                },
                onCancel() { },
            }) : callback();
    };

    handleOpenModal = (type) => {
        if (type === 'history') this.setState({ visible: { visibleHistory: true } });
        else if (type === 'revise' || type === 'reject' || type === 'approve') this.setState({ visible: { visibleRemark: true }, type });
        else if (type === 'certificate') this.setState({ visible: { visibleCertificate: true } });
    };

    handleCancel = () => {
        this.setState({ visible: { visibleHistory: false, visibleRemark: false, visibleCertificate: false } });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        const { isLoading, formrender, visible, resultdata, reqdatas, type, responsedatas, originAirport, destinationAirport } = this.state;
        const { visibleHistory, visibleRemark, visibleCertificate, visibleFailed } = visible;
        const { requestid, requesttype, requeststatus, approvalby, approvaldate, cardnumber, remark, createdBy } = resultdata;
        let { awardcode, issueddate, username, bookingcode, totalprice, redeemuser, redeemairactivity, categorycode, quantity, standarfee, freeaward, trxdate, fee, awardinfo, expiredawardmiles } =
            (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ? reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;
        let { certificateid, status, name, familyname, salutationcode, travelertype, selfusage, certificateprice, activitydate } = Array.isArray(redeemuser) ? redeemuser[0] : redeemuser !== undefined ? redeemuser : [];
        let { nameoncard, firstname, lastname } = awardinfo || {};
        let category = categorycode ? categorycode.toLowerCase() : reqdatas ? reqdatas.categorycode ? reqdatas.categorycode.toLowerCase() : '' : '';

        if (category === 'update' || (typeof redeemairactivity === 'object' && redeemairactivity !== null && redeemairactivity.departure === undefined)) {
            redeemairactivity = {
                departure: [redeemairactivity.find(o => o.type === 'departure' || o.type === 'DEPARTURE')],
                return: [redeemairactivity.find(o => o.type === 'return' || o.type === 'RETURN')]
            };
        }

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
        return (
            <Spin spinning={isLoading}>
                <Modal visible={visibleHistory || visibleRemark} title={visibleHistory ? 'Request History' : 'Remark Form'} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={720} closable={true}>
                    {(visibleHistory) ? <RequestHistory requestid={requestid} /> : <RemarkForm resultdata={resultdata} type={type} isLoading={isLoading} saveAction={this.saveAction} handleCancel={this.handleCancel} />}
                </Modal>

                <Modal visible={visibleCertificate} title='Certificate Details' onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                    <Certificate {...this.props} number={1} certificateid={reqdatas.certificateid} />
                </Modal>

                <Form {...formItemLayout}>
                    <Col xs={24} sm={20}>
                        <Title level={4}>Request Information</Title>
                    </Col>
                    <Col xs={24} sm={4} align='right'>
                        <Button htmlType='button' type='default' label='Request History' onClick={() => this.handleOpenModal('history')} />
                    </Col>
                    <Divider style={{ marginTop: 0 }} />

                    <Row gutter={24} style={{ marginBottom: 30 }}>
                        <Col className='gutter-row' span={24} offset={2}>
                            <Card title='Request Details' bordered={false} className='card-shadow' style={{ marginBottom: 10, width: '85%' }}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Request ID</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(requestid) ? requestid : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Approval Type</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(requesttype) ? requesttype : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Status</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(requeststatus) ? requeststatus.replaceAll('_', ' ') : '-'}</Col>
                                    </Row>
                                </Col>
                                <Col className='gutter-row' span={12}>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Approval by</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(approvalby) ? approvalby : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Approval Date</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(approvaldate) ? moment(approvaldate).format('DD/MM/YYYY') : '-'}</Col>
                                    </Row>
                                    <Row>
                                        {(requeststatus === 'NEW' || requeststatus === 'APPROVED') ? '' : <Col xs={24} xl={8}><strong>Notes</strong></Col>}
                                        {(requeststatus === 'NEW' || requeststatus === 'APPROVED') ? '' : <Col xs={1} xl={2}><label>:</label></Col>}
                                        {(requeststatus === 'NEW' || requeststatus === 'APPROVED') ? '' : <Col xs={23} xl={{ span: 14, pull: 1 }}><strong>{(remark) ? remark : '-'}</strong></Col>}
                                    </Row>
                                </Col>
                            </Card>
                        </Col>
                        <Col className='gutter-row' span={24} offset={2}>
                            <Card title={`Redemption ${requesttype === 'CANCEL' ? 'Cancel' : ''} Details`} bordered={false} className='card-shadow' style={{ marginBottom: 10, width: '85%' }}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Issued By</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(username) ? username : createdBy ? createdBy : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Free Award</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(freeaward || standarfee) ? 'True' : 'False'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Issued Date</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(issueddate) ? moment(issueddate).format('DD/MM/YYYY') : (requesttype === 'CANCEL') ? moment(trxdate).format('DD/MM/YYYY') : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Total Price</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(totalprice) ? totalprice : (requesttype === 'CANCEL') ? reqdatas.price : '-'}</Col>
                                    </Row>
                                    <Row>
                                        {category === 'hotel' && requesttype !== 'CANCEL' ? <Col xs={24} xl={6}><label>Check In Date</label></Col> : ''}
                                        {category === 'hotel' && requesttype !== 'CANCEL' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {category === 'hotel' && requesttype !== 'CANCEL' ?
                                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{activitydate ? moment(activitydate).format('dddd, DD/MM/YYYY') : reqdatas.redeemuser === undefined ? '' :
                                                reqdatas.redeemuser[0].activitydate ? moment(reqdatas.redeemuser[0].activitydate).format('dddd, DD/MM/YYYY') : '-'}</Col> : ''
                                        }
                                    </Row>
                                    <Row>
                                        {requesttype === 'CANCEL' ? <Col xs={24} xl={6}><label>Certificate ID</label></Col> : ''}
                                        {requesttype === 'CANCEL' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {requesttype === 'CANCEL' ? <Col xs={23} xl={{ span: 16, pull: 1 }}>{(reqdatas) ? (reqdatas.certificateid) ? reqdatas.certificateid : '-' : '-'}</Col> : ''}
                                    </Row>
                                </Col>
                                <Col className='gutter-row' span={12}>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Award Code</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(awardcode) ? awardcode : '-'}</Col>
                                    </Row>
                                    <Row>
                                        {(category !== 'freeflight' || category !== 'upgrade') ? <Col xs={24} xl={8}><label>Card Number</label></Col> : ''}
                                        {(category !== 'freeflight' || category !== 'upgrade') ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {(category !== 'freeflight' || category !== 'upgrade') ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{(cardnumber) ? cardnumber : '-'}</Col> : ''}
                                    </Row>
                                    <Row>
                                        {(category === 'freeflight' || category === 'upgrade') ? <Col xs={24} xl={8}><label>Booking Code</label></Col> : ''}
                                        {(category === 'freeflight' || category === 'upgrade') ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {(category === 'freeflight' || category === 'upgrade') ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{(bookingcode) ? bookingcode : '-'}</Col> : ''}
                                    </Row>
                                    <Row>
                                        {category === 'hotel' && requesttype !== 'CANCEL' ? <Col xs={24} xl={8}><label>Duration</label></Col> : ''}
                                        {category === 'hotel' && requesttype !== 'CANCEL' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {category === 'hotel' && requesttype !== 'CANCEL' ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{quantity ? `${quantity} night` : '-'}</Col> : ''}
                                    </Row>
                                    <Row>
                                        {category === 'hotel' && requesttype !== 'CANCEL' ? <Col xs={24} xl={8}><label>Check Out Date</label></Col> : ''}
                                        {category === 'hotel' && requesttype !== 'CANCEL' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {category === 'hotel' && requesttype !== 'CANCEL' ?
                                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{activitydate ? moment(activitydate).add(quantity, 'days').format('dddd, DD/MM/YYYY') : reqdatas.redeemuser === undefined ? '' :
                                                reqdatas.redeemuser[0].activitydate ? moment(reqdatas.redeemuser[0].activitydate).add(quantity, 'days').format('dddd, DD/MM/YYYY') : '-'}</Col> : ''
                                        }
                                    </Row>
                                    <Row>
                                        {(requesttype === 'CANCEL' || requesttype === 'UPDATE') ? <Col xs={24} xl={8}><label>Fee {jsUcfirst(requesttype)}</label></Col> : ''}
                                        {(requesttype === 'CANCEL' || requesttype === 'UPDATE') ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {(requesttype === 'CANCEL' || requesttype === 'UPDATE') ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{(fee) ? fee : reqdatas ? reqdatas.fee ? reqdatas.fee : '-' : '-'}</Col> : ''}
                                    </Row>
                                    <Row>
                                        {(requesttype === 'CANCEL') ? <Col xs={24} xl={8} style={{ color: 'red' }}><strong>Expired Award Miles</strong></Col> : ''}
                                        {(requesttype === 'CANCEL') ? <Col xs={1} xl={2} style={{ color: 'red' }}><strong>:</strong></Col> : ''}
                                        {(requesttype === 'CANCEL') ? <Col xs={23} xl={{ span: 14, pull: 1 }} style={{ color: 'red' }}>{(expiredawardmiles !== undefined || expiredawardmiles !== null) ? <strong>{expiredawardmiles}</strong> : '-'}</Col> : ''}
                                    </Row>
                                    <Row>
                                        {category === 'transfer' ? <Col xs={24} xl={8}><label>Recipient</label></Col> : ''}
                                        {category === 'transfer' ? <Col xs={1} xl={2}><label>:</label></Col> : ''}
                                        {category === 'transfer' ? <Col xs={23} xl={{ span: 14, pull: 1 }}>{(awardinfo) ? `${nameoncard ? jsUcfirst(nameoncard) : `${jsUcfirst(firstname)} ${jsUcfirst(lastname)}`} - ${awardinfo.cardnumber}` : '-'}</Col> : ''}
                                    </Row>
                                </Col>
                            </Card>
                        </Col>

                        {(category === 'freeflight' || category === 'upgrade') && requesttype !== 'CANCEL' ? <Col className='gutter-row' span={24} offset={2}>
                            {(redeemuser === undefined) ? '' : <PassengerDetails redeemuser={Array.isArray(redeemuser) ? redeemuser[0] : redeemuser} />}
                            {(redeemuser === undefined) ? '' : redeemairactivity === undefined ? '' : Object.keys(redeemairactivity).map(function (val, i) {
                                return (redeemairactivity[val][0] !== undefined ? <AirActivity category={category} i={i} redeemairactivity={redeemairactivity[val][0]} originAirport={originAirport} destinationAirport={destinationAirport} /> : '')
                            })}
                        </Col> : ''}

                        {requesttype === 'CANCEL' && (category !== 'freeflight' || category !== 'upgrade') ? '' : <Col className='gutter-row' span={24} offset={2}>
                            {requeststatus === 'APPROVED' ? ((redeemuser === undefined) ? '' : (requeststatus !== 'APPROVED') ? '' : <CertificateDetails redeemuser={Array.isArray(redeemuser) ? redeemuser[0] : redeemuser} />) :
                                <Card title='Certificate Details' bordered={false} className='card-shadow' style={{ marginBottom: 10, width: '85%' }}>
                                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                        <Row>
                                            <Col xs={24} xl={6}><label>Certificate ID</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            {requesttype === 'UPDATE' && (category === 'upgrade' || category === 'freeflight') ?
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(reqdatas) ? reqdatas.certificateid ? reqdatas.certificateid : '-' : '-'}</Col> : <Col xs={23} xl={{ span: 16, pull: 1 }}>{(certificateid) ? certificateid : '-'}</Col>}
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={6}><label>Name</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{(name) ? `${salutationcode ? jsUcfirst(salutationcode) : ''} ${jsUcfirst(name)} ${jsUcfirst(familyname)}` : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={6}><label>Traveler Type</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            <Col xs={23} xl={{ span: 16, pull: 1 }}>{(travelertype) ? travelertype : '-'}</Col>
                                        </Row>
                                    </Col>
                                    <Col className='gutter-row' span={12}>
                                        <Row>
                                            <Col xs={24} xl={8}><label>Price</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{(certificateprice) ? certificateprice : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={8}><label>Self Usage</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{(selfusage) ? 'Yes' : 'No'}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={8}><label>Status</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            {requesttype === 'UPDATE' && (category === 'upgrade' || category === 'freeflight') ?
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(reqdatas) ? reqdatas.status ? reqdatas.status : '-' : '-'}</Col> : <Col xs={23} xl={{ span: 14, pull: 1 }}>{(status) ? status : '-'}</Col>}
                                        </Row>
                                    </Col>
                                </Card>}
                        </Col>}

                        {requesttype === 'CANCEL' && (category === 'hotel' || category === 'freeflight' || category === 'upgrade') ? <Col className='gutter-row' span={24} offset={2}>
                            <Card title='Certificate Details' bordered={false} className='card-shadow' style={{ marginBottom: 10, width: '80%' }} >
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Certificate</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}><Button htmlType='button' label='Show Details' type='primary' onClick={() => this.handleOpenModal('certificate')} /></Col>
                                    </Row>
                                </Col>
                            </Card>
                        </Col> : ''}

                    </Row>

                    <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                        {
                            (usermenu[menucode][`${prefixmenuname}_UPDATE`] &&
                                (requeststatus === 'NEW' || requeststatus === 'REVISE' || requeststatus === 'FAILED' || requeststatus === 'READY_TO_APPROVAL')) ? (!visibleFailed) ?
                                <span>
                                    <Button htmlType='button' className='btn-custom-green' label='Approve' onClick={() => this.handleOpenModal('approve')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                    {requesttype !== 'CANCEL' ? <Button htmlType='button' className='btn-warning' label='Revise' onClick={() => this.handleOpenModal('revise')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' /> : ''}
                                    <Button htmlType='button' type='danger' label='Reject' onClick={() => this.handleOpenModal('reject')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                </span> : '' : ''
                        }
                        <Button htmlType='button' type='default' label='Back' onClick={() => { this.props.history.goBack() }} />
                    </Row>
                </Form >
            </Spin >
        )
    }
}

class RemarkFormApp extends React.Component {
    saveRemark = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((_err, input) => {
            if (!_err) {
                let type = this.props.type;
                let remark = input.remark;
                this.props.saveAction(e, type, remark);
            }
        });
    };

    render() {
        const { isLoading } = this.props;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
        };
        return (
            <Spin spinning={isLoading}>
                <Form onSubmit={(e) => this.saveRemark(e)} {...formItemLayout}>
                    <TextArea form={this.props.form} labeltext='Remark' datafield='remark' maxLength={255} validationrules={['required']} />
                    <Row gutter={24} type='flex' justify='center'>
                        <Button htmlType='submit' type='primary' size='default' label='Submit' />
                    </Row>
                </Form>
            </Spin>
        )
    }
}

const RemarkForm = Form.create()(RemarkFormApp);
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));