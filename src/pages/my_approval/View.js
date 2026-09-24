import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest, RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert } from '../../components/Base/BaseComponent';
import { Divider, Row, Col, Typography, Modal, Card, Form, Statistic } from 'antd';
import ErrorGeneral from '../error/ErrorGeneral';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';

import History from './History';

import BuyMileage from './buy_mileage/Form';
import Redemption from './redemption/Form';

const { Title } = Typography;
const { Countdown } = Statistic;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            formrender: true,
            isLoading: false,
            result: {},
            originAirport: 'null',
            destinationAirport: 'null',
            awardcode: '',
            requesttype: '',
            responsecode: '',
            responsemessage: ''
        }
    };

    componentDidMount() {
        document.title = 'Detail Approval List | Loyalty Management System';
        this.getDetail();
    };

    getDetail = () => {
        this.setState({ isLoading: true });
        const requestid = this.props.fromCertif ? this.props.location.pathname.split('/')[7] : this.props.match.params.ID
        DetailRequest(api.url.requestapproval.detail, { requestid }).then((response) => {
            const { status = {}, result } = response || {};
            const { responsecode, responsemessage } = status || {};
            this.setState({ requesttype: result.requesttype })
            if (responsecode === '0000' && result) {
                const { requesttype, reqdatas, responsedatas } = result;
                const { categorycode } = reqdatas;
                if ((categorycode === 'FREEFLIGHT' || categorycode === 'UPGRADE') && requesttype !== 'CANCEL') this.getAirport(reqdatas, responsedatas);
                this.setState({ result, isLoading: false });
            } else {
                this.setState({ responsecode, responsemessage, formrender: false, isLoading: false });
            }
        });
    };

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
    };

    handleModal = (action) => {
        this.setState({ visible: action });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { fromCertif } = this.props;
        const { responseMessage, formrender, result, visible, originAirport, destinationAirport } = this.state;
        const { requestid, requesttype, requeststatus, approvalby, approvaldate, remark } = result || {};

        if (formrender) {
            return (
                <React.Fragment>

                    <Modal visible={visible} title='Approval History' onCancel={() => this.handleModal(false)} footer={null} destroyOnClose={true} width={1000}>
                        <History {...this.props} onClose={() => this.handleModal(false)} fromCertif={fromCertif} />
                    </Modal>

                    <Col xs={24} sm={16}>
                        <Title level={4}><Button url={{ pathname: (fromCertif) ? `/member/form/${this.props.match.params.ID}/certificate` : '/my-approval', state: { fromCertif } }} shape='circle' icon='left' /> Detail Approval Request</Title>
                    </Col>
                    <Col xs={24} sm={4} align='right'>
                        <Button htmlType='button' label='Approval History' type='primary' onClick={() => this.handleModal(true)} />
                    </Col>
                    <Divider orientation='center'>{requesttype === 'BUYMILEAGE' ? 'Buy Mileage Request' : (requesttype ? `${jsUcfirst(requesttype)} Request` : '')}</Divider>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' span={24} offset={2}>
                                <Card bordered={false} className='card-shadow' style={{ marginBottom: 10, width: '85%' }}>
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
                                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                        <Row>
                                            <Col xs={24} xl={8}><label>Approval by</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{(approvalby) ? jsUcfirst(approvalby) : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={8}><label>Approval Date</label></Col>
                                            <Col xs={1} xl={2}><label>:</label></Col>
                                            <Col xs={23} xl={{ span: 14, pull: 1 }}>{(approvaldate) ? moment(approvaldate).format('DD/MM/YYYY') : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={8} className={(requeststatus === 'NEW' || requeststatus === 'APPROVED') ? 'hidden' : ''}><strong>Notes</strong></Col>
                                            <Col xs={1} xl={2} className={(requeststatus === 'NEW' || requeststatus === 'APPROVED') ? 'hidden' : ''}><label>:</label></Col>
                                            <Col xs={23} xl={{ span: 14, pull: 1 }} className={(requeststatus === 'NEW' || requeststatus === 'APPROVED') ? 'hidden' : ''}>
                                                {(!remark) ? '-' : (requeststatus === 'NEW' || requeststatus === 'APPROVED') ? '-' : <strong>{remark}</strong>}</Col>
                                        </Row>
                                    </Col>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                    {requesttype === 'BUYMILEAGE' ? <BuyMileage {...this.props} resultdata={result} formrender={formrender} responseMessage={responseMessage} /> :
                        requesttype === undefined ? '' : <Redemption {...this.props} resultdata={result} formrender={formrender} responseMessage={responseMessage} originAirport={originAirport} destinationAirport={destinationAirport} />}
                </React.Fragment>
            );
        } else return (<ErrorGeneral {...this.props} message={responseMessage} />);
    };
}

export default App;