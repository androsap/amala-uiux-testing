import React from 'react';
import { Row, Col, Card, Alert as AlertAntd } from 'antd';

class AddressBuyProductDetail extends React.Component {

    render() {
        const { sendto, countryname, statename, cityname, postalcode, branchname, ticketofficename, address } = this.props.addressInformation;

        return (
            <React.Fragment>
                <Card title='Address Information' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginBottom: 20, borderRadius: '10px' }}>
                    {(sendto === 'BO') ? <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Branch Office</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(branchname) ? branchname : '-'}</Col>
                    </Row> : null}
                    {(sendto === 'BO') ? <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Ticket Office</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(ticketofficename) ? ticketofficename : '-'}</Col>
                    </Row> : null}
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Address</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(address) ? address : '-'}</Col>
                    </Row>
                    {(!sendto) ? null : (sendto !== 'BO') ? <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Country</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(countryname) ? countryname : '-'}</Col>
                    </Row> : null}
                    {(!sendto) ? null : (sendto !== 'BO') ? <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>State</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(statename) ? statename : '-'}</Col>
                    </Row> : null}
                    {(!sendto) ? null : (sendto !== 'BO') ? <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>City</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(cityname) ? cityname : '-'}</Col>
                    </Row> : null}
                    {(!sendto) ? null : (sendto !== 'BO') ? <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Postal Code</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(postalcode) ? postalcode : '-'}</Col>
                    </Row> : null}

                </Card>
            </React.Fragment>
        )
    }
}

export default AddressBuyProductDetail;