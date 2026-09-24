import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest, CancelRequest } from '../../utilities/RequestService';
import { Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Divider, Card, Typography, Modal, Tag } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            visible: true,
            fieldvalue: {
            },
        }
    }

    componentDidMount() {
        document.title = 'Details Merging Account | Loyalty Management System';
        const { mergeid } = this.props.match.params.ID;
        this.getDetail(mergeid);
    };

    getDetail = (mergeid = this.props.match.params.ID) => {
        let url = api.url.profileintegration.detail;
        let data = { mergeid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let mastermember = result.originMember.cardnumber ? result.originMember.cardnumber : null;
                    let mergewith = result.mergeWith.cardnumber ? result.mergeWith.cardnumber : null;
                    let idmastermembername = result.originMember.memberid ? result.originMember.memberid : null;
                    let idmergewith = result.mergeWith.memberid ? result.mergeWith.memberid : null;
                    let mastermembername = result.originMember.name ? result.originMember.name : null;
                    let mergewithname = result.mergeWith.name ? result.mergeWith.name : null;
                    let approvaldateorigin = result.approvaldateorigin ? moment(result.approvaldateorigin).format('DD-MM-YYYY') : null;
                    let approvaldatedestination = result.approvaldatedestination ? moment(result.approvaldatedestination).format('DD-MM-YYYY') : null;
                    let requestdate = result.requestdate ? moment(result.requestdate).format('DD-MM-YYYY') : null;
                    let onqueuedate = result.onqueuedate ? moment(result.onqueuedate).format('DD-MM-YYYY') : null;
                    let finishdate = result.finishdate ? moment(result.finishdate).format('DD-MM-YYYY') : null;
                    let mergetype = result.mergetype ? result.mergetype : null;
                    let status = result.status ? result.status : null;
                    let createdby = result.createdby ? result.createdby : null;
                    let remarks = result.remarks ? result.remarks : null;

                    let setValue = { mastermember, mergewith, idmastermembername, idmergewith, mastermembername, mergewithname, approvaldateorigin, approvaldatedestination, requestdate, onqueuedate, finishdate, mergetype, status, createdby, remarks };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({ fieldvalue: setValue });

                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    cancelMerge() {
        let url = api.url.profileintegration.update;
        let mergeid = this.props.match.params.ID;
        let { idmastermembername, idmergewith } = this.state.fieldvalue;
        let data = { mergeid, mastermember: idmastermembername, mergewith: idmergewith, status: 'CANCELLED' };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Requested Merge has been cancelled';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
        };
        CancelRequest(url, data, callback, 'Are you sure to cancel this request?');
    }

    render() {
        const { isLoading, fieldvalue } = this.state;
        const { mastermember, mastermembername, mergewithname, mergewith, approvaldateorigin, approvaldatedestination, requestdate, onqueuedate, finishdate, mergetype, status, createdby, remarks } = fieldvalue;
        const colorStatus = (status === 'FINISHED') ? 'green' : (status === 'CANCELLED') ? 'volcano' :
            (status === 'REJECTED') ? 'red' : 'yellow';

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 7 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        return (
            <Spin spinning={isLoading}>
                <Form {...formItemLayout}>
                    <Row>
                        <Col xs={24} sm={20}>
                            <Title level={3}><Button url={`/merging-account`} shape='circle' icon='left' /> Details Merging Account</Title>
                        </Col>
                        <Col xs={24} sm={4} align='right'>
                            <Button htmlType='button' label='Cancel Merge Request' type='danger' onClick={() => this.cancelMerge()} className={status === 'WAITING_APPROVAL' ? '' : 'hidden'} />
                        </Col>
                        <Divider />
                        <Row gutter={24} style={{ marginBottom: 20 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={8} xl={8} >
                                <Card style={{ background: '#E4EDFF', borderRadius: 20 }} bordered={true} className='card-shadow'>
                                    <Title style={{ textAlign: 'center' }} level={4}>Member Origin</Title>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={7}><label> Card Number </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={17} xl={17}>: {mastermember ? mastermember : '-'} </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={7}><label> Name </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={17} xl={17}>: {mastermembername ? mastermembername : '-'}</Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={7}><label> Approval Date </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={17} xl={17}>: {approvaldateorigin ? approvaldateorigin : '-'}</Col>
                                        </Row>
                                    </Col>
                                </Card>
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={2} xl={2} >
                                <Divider style={{ borderTop: '20px solid #E4EDFF', marginLeft: -24, marginTop: 80, width: '200%' }} />
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={4} xl={4} >
                                <Card style={{ background: '#E4EDFF', borderRadius: 40, marginTop: 50, marginLeft: 0 }} bordered={true} className='card-shadow'>
                                    <p style={{ textAlign: 'center' }}>Merge to</p>
                                </Card>
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={2} xl={2} >
                                <Divider style={{ borderTop: '20px solid #E4EDFF', marginLeft: -25, marginTop: 80, width: '200%' }} />
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={8} xl={8} >
                                <Card style={{ background: '#E4EDFF', borderRadius: 20 }} bordered={true} className='card-shadow'>
                                    <Title style={{ textAlign: 'center' }} level={4}>Member Destination</Title>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={7}><label> Card Number </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={17} xl={17}>: {mergewith ? mergewith : '-'} </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={7}><label> Name </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={17} xl={17}>: {mergewithname ? mergewithname : '-'}</Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={7}><label> Approval Date </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={17} xl={17}>: {approvaldatedestination ? approvaldatedestination : '-'}</Col>
                                        </Row>
                                    </Col>
                                </Card>
                            </Col>
                        </Row>
                        <Divider style={{ marginTop: 30 }}>Detail Information</Divider>
                        <Row gutter={[16, 16]} style={{ textAlign: 'center', marginTop: 20 }}>
                            <Card style={{ background: '#E4EDFF', borderRadius: 20 }} bordered={true} className='card-shadow'>
                                <Col xs={24} sm={12} md={8} lg={5} xl={8}>
                                    <div>
                                        <label>Request Date</label>
                                        <div>{requestdate ? requestdate : '-'}</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5} xl={8}>
                                    <div>
                                        <label>On Queue Date</label>
                                        <div>{onqueuedate ? onqueuedate : '-'}</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5} xl={8}>
                                    <div>
                                        <label>Finish Date</label>
                                        <div>{finishdate ? finishdate : '-'}</div>
                                    </div>
                                </Col>
                                <Divider style={{ borderTop: '3px solid #bae7ff' }}></Divider>

                                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                    <div>
                                        <label>Merge Type</label>
                                        <div>{mergetype ? mergetype : '-'}</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                    <div>
                                        <label>Status</label>
                                        <div>
                                            <Tag color={colorStatus}>
                                                {status?.replace(/_/g, " ") || "-"}
                                            </Tag>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                    <div>
                                        <label>Created By</label>
                                        <div>{createdby ? createdby : '-'}</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                                    <div>
                                        <label>Remarks</label>
                                        <div>{remarks ? remarks : '-'}</div>
                                    </div>
                                </Col>
                            </Card>
                        </Row>
                    </Row>
                </Form>
            </Spin >
        );
    }
}
export default Form.create()(App);