import React from 'react';
import { Row, Col, Card, Tag, Typography } from 'antd';
import { Button } from '../Base/BaseComponent';
import { jsUcfirst } from '../../utilities/Helpers';
import moment from 'moment';

const { Text } = Typography;

class VerifyStatus extends React.Component {

    handleModal = () => {
        this.props.handleModal(true, 'showconfirmation');
    };

    render() {
        const { buyproductdetail } = this.props;
        const { status, paymentverificationtimeout, paymentmethod, trxid } = buyproductdetail || {};
        const memberid = this.props.match.params.ID;

        return (
            <React.Fragment>
                <Card title='Verify Status' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', margin: '20px 0', marginTop: -2, borderRadius: '10px' }}>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Status</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>
                            <Text style={{ display: 'block' }}>
                                <Tag color={(status === 'WAITING_FOR_PAYMENT' || (status === 'FAILED')) ? '#f50' : '#87d068'}>
                                    {(status !== 'WAITING_FOR_PAYMENT') ? ((status) ? ((status === 'FAILED') ? 'Failed' : 'Success') : '-') : jsUcfirst(status, '_')}
                                </Tag>
                            </Text>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Payment Time</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>
                            <Text type={(status === 'WAITING_FOR_PAYMENT') ? 'danger' : ''} strong style={{ display: 'block' }}>
                                {moment(paymentverificationtimeout).format('DD/MM/YYYY HH:mm:ss')}
                            </Text>
                            <Text type='danger' strong style={{ display: 'block' }}>
                                {(paymentverificationtimeout && (moment(paymentverificationtimeout).isBefore(moment())) && (status === 'FAILED')) ? 'EXPIRED' : null}</Text>
                        </Col>
                    </Row>
                    {(status !== 'WAITING_FOR_PAYMENT') ? <Button htmlType='button' type='primary' label='View Detail' block={true} disabled={false} onClick={this.handleModal} style={{ marginBottom: 10 }} /> : null}
                    {(paymentmethod === 'MILEAGE' && trxid) ? <Button htmlType='link' type='primary' label='See Mileage User' block={true} disabled={false} url={`/member/form/${memberid}/transaction/detail/${trxid}`} /> : null}
                </Card>
            </React.Fragment>
        )
    }
}

export default VerifyStatus;