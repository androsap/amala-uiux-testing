import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest, SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Row, Col, Typography, Form, Divider, Spin, Modal, Card } from 'antd';
import { ErrorGeneral, Button, Alert, TextArea } from '../../../components/Base/BaseComponent';
import { connect } from 'react-redux';
import moment from 'moment';
import RequestHistory from './RequestHistory';

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
                visibleFailed: false
            },
            resultbuymileage: {},
            resultdata: {},
            reqdatas: {},
            responsedatas: [],
            type: null
        };
    }

    async componentDidMount() {
        await this.getDetail();
        await this.getBuyMileage();
    }

    getDetail = async (type) => {
        let requestid = this.props.match.params.ID;
        this.setState({ isLoading: true });
        await DetailRequest(api.url.requestapproval.detail, { requestid }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                const { reqdatas, responsedatas, requeststatus } = result;
                this.setState({
                    reqdatas, responsedatas,
                    resultdata: result,
                    visible: { ...this.state.visible, visibleFailed: (requeststatus === 'FAILED') ? true : false }
                });
                if (requeststatus !== 'FAILED' && type === 'fromSaveRequest') this.props.history.goBack();
            } else {
                this.setState({ responsecode, responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    getBuyMileage = async () => {
        const { reqdatas, responsedatas } = this.state;
        const { memberbuymileageid } = (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ?
            reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;
        await RetrieveRequest(api.url.memberbuymileage.list, { memberbuymileageid }).then((response) => {
            const { status = {}, result } = response || {};
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                this.setState({ resultbuymileage: result[0] });
            } else {
                Alert.error(responsemessage);
            }
        });
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
                        //hide loader
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
    };

    handleCancel = () => {
        this.setState({ visible: { visibleHistory: false, visibleRemark: false } });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        const { isLoading, formrender, visible, resultdata, reqdatas, responsedatas, type, resultbuymileage } = this.state;
        const { visibleHistory, visibleRemark, visibleFailed } = visible;
        const { requestid, requesttype, requeststatus, approvalby, approvaldate, cardnumber, remark, createdBy } = resultdata;
        const { buymileageid, buydate, source, qty, currencycode, totalamount, includevat, catalogueprice, vatamount } = resultbuymileage;
        const { paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode } = (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ?
            reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }

        return (
            <Spin spinning={isLoading}>
                <Modal visible={visibleHistory || visibleRemark} title={visibleHistory ? 'Request History' : 'Remark Form'} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={720} closable={true}>
                    {(visibleHistory) ? <RequestHistory requestid={requestid} /> : <RemarkForm resultdata={resultdata} type={type} isLoading={isLoading} saveAction={this.saveAction} handleCancel={this.handleCancel} />}
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
                            <Card title='Buy Mileage Details' bordered={false} className='card-shadow' style={{ marginBottom: 10, width: '85%' }}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Buy ID</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(buymileageid) ? buymileageid : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Card Number</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(cardnumber) ? cardnumber : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Buy Date</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(buydate) ? moment(buydate).format('DD/MM/YYYY') : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Issued By</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(createdBy) ? createdBy : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Source</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(source) ? source : '-'}</Col>
                                    </Row>
                                </Col>
                                <Col className='gutter-row' span={12}>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Price</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(catalogueprice) ? catalogueprice : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Currency Code</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(currencycode) ? currencycode : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Quantity</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(qty) ? qty : '-'}</Col>
                                    </Row>
                                    {!includevat ? <Row>
                                        <Col xs={24} xl={8}><label>VAT Amount</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(vatamount) ? vatamount : '-'}</Col>
                                    </Row> : ''}
                                    <Row>
                                        <Col xs={24} xl={8}><label>Total Price</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(totalamount) ? ((includevat) ? (<Row>
                                            {totalamount}<strong style={{ color: 'red' }}>    *Include VAT</strong>
                                        </Row>) : totalamount) : '-'}</Col>
                                    </Row>
                                </Col>
                            </Card>
                        </Col>
                        <Col className='gutter-row' span={24} offset={2}>
                            <Card title="Confirmation Details" bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Card Issuer</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(cardissuer) ? cardissuer : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Card Identifier</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(cardidentifier) ? cardidentifier : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={6}><label>Ref Number</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 16, pull: 1 }}>{(refnumber) ? refnumber : '-'}</Col>
                                    </Row>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Payment Method</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(paymentmethod) ? paymentmethod : '-'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} xl={8}><label>Transaction Code</label></Col>
                                        <Col xs={1} xl={2}><label>:</label></Col>
                                        <Col xs={23} xl={{ span: 14, pull: 1 }}>{(transactioncode) ? transactioncode : '-'}</Col>
                                    </Row>
                                </Col>
                            </Card>
                        </Col>
                    </ Row>
                    <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                        {
                            (usermenu[menucode][`${prefixmenuname}_UPDATE`] &&
                                (requeststatus === 'NEW' || requeststatus === 'REVISE' || requeststatus === 'FAILED' || requeststatus === 'READY_TO_APPROVAL')) ? (!visibleFailed) ?
                                <span>
                                    <Button htmlType='button' className='btn-custom-green' label='Approve' onClick={() => this.handleOpenModal('approve')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                    <Button htmlType='button' className='btn-warning' label='Revise' onClick={() => this.handleOpenModal('revise')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                    <Button htmlType='button' type='danger' label='Reject' onClick={() => this.handleOpenModal('reject')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                </span> : '' : ''
                        }
                        <Button htmlType='button' type='default' label='Back' onClick={() => { this.props.history.goBack() }} />
                    </Row>
                </Form>
            </Spin>
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