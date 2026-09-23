import React, { Component } from 'react';
import { Icon, Row, Col } from 'antd';
import moment from 'moment';

class MediumScreen extends Component {
    render() {
        const { trackingstatus, trackingdata, dataComponent, afterReorder } = this.props;
        const { paymentSuccess, readytoprint, printing, printed, readytopackaging, returns, delivered, ondelivery, readytopickup, packaged, packaging, reorder } = trackingdata || {};
        const { PaymentSuccessIcon, ReadyToPrintIcon, PrintingIcon, PrintedIcon, ReadyToPackagingIcon, PackagingIcon, PackagedIcon, ReadyToPickupIcon, OnDeliveryIcon, ReturnIcon, DeliveredIcon, ReorderIcon } = dataComponent;

        return (
            <Row>
                <Row>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row >
                            <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={PaymentSuccessIcon} style={{ fontSize: '50%' }} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((paymentSuccess) ? '#1890ff' : '') }}  >{(paymentSuccess) ? <Icon type='check' /> : ''} Payment Success</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}  >{(paymentSuccess) ? moment(paymentSuccess.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}  >{(paymentSuccess) ? ((paymentSuccess.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                    <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                        <Icon type="arrow-right" />
                    </Col>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row >
                            <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={ReadyToPrintIcon} style={{ fontSize: '50%' }} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((readytoprint) ? '#1890ff' : '') }}  >{(readytoprint) ? <Icon type='check' /> : ''} Ready To Print</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}  >{(readytoprint) ? moment(readytoprint.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}  >{(readytoprint) ? ((readytoprint.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                    <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                        <Icon type="arrow-right" />
                    </Col>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row align='middle'>
                            <Col xs={24} style={{ margin: '5px 0' }}><Icon component={PrintingIcon} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((printing) ? '#1890ff' : '') }}>{(printing) ? <Icon type='check' /> : ''} Printing</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}>{(printing) ? moment(printing.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}>{(printing) ? ((printing.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row type='flex' justify='end' style={{ marginBottom: 20 }}>
                    <Col sm={24} md={1} lg={1} style={{ marginRight: '15.7%' }}>
                        <Icon type="arrow-down" />
                    </Col>
                </Row>
                <Row>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row align='middle'>
                            <Col xs={24} style={{ margin: '5px 0' }}><Icon component={PackagingIcon} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((packaging) ? '#1890ff' : '') }}>{(packaging) ? <Icon type='check' /> : ''} Packaging</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}>{(packaging) ? moment(packaging.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}>{(packaging) ? ((packaging.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                    <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                        <Row >
                            <Icon type="arrow-left" />
                        </Row>
                    </Col>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row align='middle'>
                            <Col xs={24} style={{ margin: '5px 0' }}><Icon component={ReadyToPackagingIcon} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((readytopackaging) ? '#1890ff' : '') }}>{(readytopackaging) ? <Icon type='check' /> : ''} Ready To Packaging</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}>{(readytopackaging) ? moment(readytopackaging.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}>{(readytopackaging) ? ((readytopackaging.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                    <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                        <Row >
                            <Icon type="arrow-left" />
                        </Row>
                    </Col>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row align='middle'>
                            <Col xs={24} style={{ margin: '5px 0' }}><Icon component={PrintedIcon} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((printed) ? '#1890ff' : '') }}>{(printed) ? <Icon type='check' /> : ''} Printed</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}>{(printed) ? moment(printed.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}>{(printed) ? ((printed.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row type='flex' justify='start' style={{ marginBottom: 20 }}>
                    <Col sm={24} md={1} lg={1} style={{ marginLeft: '13.5%' }}>
                        <Icon type="arrow-down" />
                    </Col>
                </Row>
                <Row>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row align='middle'>
                            <Col xs={24} style={{ margin: '5px 0' }}><Icon component={PackagedIcon} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((packaged) ? '#1890ff' : '') }}>{(packaged) ? <Icon type='check' /> : ''} Packaged</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}>{(packaged) ? moment(packaged.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}>{(packaged) ? ((packaged.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                    <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                        <Icon type="arrow-right" />
                    </Col>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row align='middle'>
                            <Col xs={24} style={{ margin: '5px 0' }}><Icon component={ReadyToPickupIcon} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((readytopickup) ? '#1890ff' : '') }}>{(readytopickup) ? <Icon type='check' /> : ''} Ready To Pick Up</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}>{(readytopickup) ? moment(readytopickup.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}>{(readytopickup) ? ((readytopickup.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                    <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                        <Row >
                            <Icon type="arrow-right" />
                        </Row>
                    </Col>
                    <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                        <Row >
                            <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={OnDeliveryIcon} style={{ fontSize: '50%' }} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((ondelivery) ? '#1890ff' : '') }}  >{(ondelivery) ? <Icon type='check' /> : ''} On Delivery</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}  >{(ondelivery) ? moment(ondelivery.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}  >{(ondelivery) ? ((ondelivery.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row type='flex' justify='end' style={{ marginBottom: 20 }}>
                    <Col sm={24} md={1} lg={1} style={{ marginRight: '15.7%' }}>
                        <Icon type="arrow-down" />
                    </Col>
                </Row>
                <Row type='flex' align='end'>
                    {(returns) ? <div>
                        <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                            <Row align='middle'>
                                <Col xs={24} style={{ margin: '5px 0' }}><Icon component={ReadyToPickupIcon} /></Col>
                                <Col xs={24} style={{ margin: '5px 0', color: ((readytopickup) ? '#1890ff' : '') }}>{(readytopickup) ? <Icon type='check' /> : ''} Ready To Pick Up</Col>
                                <Col xs={24} style={{ margin: '-5px 0' }}>{(readytopickup) ? moment(readytopickup.date).format('DD/MM/YYYY') : '-'}</Col>
                                <Col xs={24} style={{ margin: '5px 0' }}>{(readytopickup) ? ((readytopickup.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                            </Row>
                        </Col>
                        <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                            <Icon type="arrow-left" />
                        </Col>
                        <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                            <Row >
                                <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={ReorderIcon} style={{ fontSize: '50%' }} /></Col>
                                <Col xs={24} style={{ margin: '5px 0', color: ((reorder) ? '#1890ff' : '') }}  >{(reorder) ? <Icon type='check' /> : ''} Reorder</Col>
                                <Col xs={24} style={{ margin: '-5px 0' }}  >{(reorder) ? moment(reorder.date).format('DD/MM/YYYY') : '-'}</Col>
                                <Col xs={24} style={{ margin: '5px 0' }}  >{(reorder) ? ((reorder.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                            </Row>
                        </Col>
                        <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                            <Icon type="arrow-left" />
                        </Col>
                        <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                            <Row >
                                <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={ReturnIcon} style={{ fontSize: '50%' }} /></Col>
                                <Col xs={24} style={{ margin: '5px 0', color: ((returns) ? '#1890ff' : '') }}  >{(returns) ? <Icon type='check' /> : ''} Return</Col>
                                <Col xs={24} style={{ margin: '-5px 0' }}  >{(returns) ? moment(returns.date).format('DD/MM/YYYY') : '-'}</Col>
                                <Col xs={24} style={{ margin: '5px 0' }}  >{(returns) ? ((returns.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                            </Row>
                        </Col>
                    </div> : <Col sm={24} md={7} lg={4} type='flex' align='middle' style={{ marginRight: 35 }}>
                        <Row align='middle'>
                            <Col xs={24} style={{ margin: '5px 0' }}><Icon component={DeliveredIcon} /></Col>
                            <Col xs={24} style={{ margin: '5px 0', color: ((delivered) ? '#1890ff' : '') }}>{(delivered) ? <Icon type='check' /> : ''} Delivered</Col>
                            <Col xs={24} style={{ margin: '-5px 0' }}>{(delivered) ? moment(delivered.date).format('DD/MM/YYYY') : '-'}</Col>
                            <Col xs={24} style={{ margin: '5px 0' }}>{(delivered) ? ((delivered.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                        </Row>
                    </Col>}
                </Row>
                {(trackingstatus) ? afterReorder : null}
            </Row>
        )
    }

}

export default MediumScreen