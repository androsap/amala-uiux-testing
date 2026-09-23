import React, { Component } from 'react';
import { Icon, Row, Col, Skeleton } from 'antd';
import { PaymentSuccess, Printed, Packaged, Delivered, Ready, Printing, Packaging, OnDelivery, Return, Reorder, } from '../../IconSVG/index';
import moment from 'moment';

import LargerScreen from './LargerScreen';
import MediumScreen from './MediumScreen';
import SmallScreen from './SmallScreen';

const PaymentSuccessIcon = props => <Icon component={PaymentSuccess} {...props} />;
const ReadyToPrintIcon = props => <Icon component={Ready} {...props} />;
const PrintingIcon = props => <Icon component={Printing} {...props} />;
const PrintedIcon = props => <Icon component={Printed} {...props} />;
const ReadyToPackagingIcon = props => <Icon component={Ready} {...props} />;
const PackagingIcon = props => <Icon component={Packaging} {...props} />;
const PackagedIcon = props => <Icon component={Packaged} {...props} />;
const ReadyToPickupIcon = props => <Icon component={Ready} {...props} />;
const OnDeliveryIcon = props => <Icon component={OnDelivery} {...props} />;
const ReturnIcon = props => <Icon component={Return} {...props} />;
const DeliveredIcon = props => <Icon component={Delivered} {...props} />;
const ReorderIcon = props => <Icon component={Reorder} {...props} />;

class OrderHistorySteps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                height: window.innerHeight,
                width: window.innerWidth
            }
        }
    };

    componentDidMount() { };

    render() {
        const { trackingstatus, reordernumber } = this.props;
        const dataComponent = { PaymentSuccessIcon, ReadyToPrintIcon, PrintingIcon, PrintedIcon, ReadyToPackagingIcon, PackagingIcon, PackagedIcon, ReadyToPickupIcon, OnDeliveryIcon, ReturnIcon, DeliveredIcon, ReorderIcon };
        if (trackingstatus) {
            let screenLarger = this.state.dimensions.width >= 992;
            let screenMedium = this.state.dimensions.width >= 768 && this.state.dimensions.width < 992;

            let paymentSuccess = trackingstatus.find(val => val.status === 'PAYMENT_SUCCESS' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'PAYMENT_SUCCESS' && val.reordernumber === 0) : null;
            let readytoprint = trackingstatus.find(val => val.status === 'READYTOPRINT' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'READYTOPRINT' && val.reordernumber === 0) : null;
            let printing = trackingstatus.find(val => val.status === 'PRINTING' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'PRINTING' && val.reordernumber === 0) : null;
            let printed = trackingstatus.find(val => val.status === 'PRINTED' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'PRINTED' && val.reordernumber === 0) : null;
            let readytopackaging = trackingstatus.find(val => val.status === 'READYTOPACK' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'READYTOPACK' && val.reordernumber === 0) : null;
            let packaging = trackingstatus.find(val => val.status === 'PACKING' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'PACKING' && val.reordernumber === 0) : null;
            let packaged = trackingstatus.find(val => val.status === 'PACKED' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'PACKED' && val.reordernumber === 0) : null;
            let readytopickup = trackingstatus.find(val => val.status === 'READYTODELIVER' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'READYTODELIVER' && val.reordernumber === 0) : null;
            let ondelivery = trackingstatus.find(val => val.status === 'DELIVERING' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'DELIVERING' && val.reordernumber === 0) : null;
            let returns = trackingstatus.find(val => val.status === 'RETURN' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'RETURN' && val.reordernumber === 0) : null;
            let reorder = trackingstatus.find(val => val.status === 'REORDER' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'REORDER' && val.reordernumber === 0) : null;
            let delivered = trackingstatus.find(val => val.status === 'DELIVERED' && val.reordernumber === 0) ? trackingstatus.find(val => val.status === 'DELIVERED' && val.reordernumber === 0) : null;
            let trackingdata = { paymentSuccess, readytoprint, printing, printed, readytopackaging, packaging, packaged, readytopickup, ondelivery, returns, reorder, delivered };

            let readytopickups = trackingstatus.filter(val => val.status === 'READYTODELIVER' && val.reordernumber !== 0);
            let ondeliverys = trackingstatus.filter(val => val.status === 'DELIVERING' && val.reordernumber !== 0);
            let afterReorder = [];

            if (reordernumber > 0 && screenLarger) {
                for (let key = 0; key < reordernumber; key++) {
                    afterReorder[key] = <div>
                        <Row type='flex' justify='start' style={{ marginBottom: 20 }}>
                            <Col sm={24} md={1} lg={1} style={{ marginLeft: '7.5%' }}>
                                <Icon type="arrow-down" />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                                <Row >
                                    <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={ReorderIcon} style={{ fontSize: '50%' }} /></Col>
                                    <Col xs={24} style={{ margin: '5px 0', color: ((reorder) ? '#1890ff' : '') }}  >{(reorder) ? <Icon type='check' /> : ''} Reorder</Col>
                                    <Col xs={24} style={{ margin: '-5px 0' }}  >{(reorder) ? moment(reorder.date).format('DD/MM/YYYY') : '-'}</Col>
                                    <Col xs={24} style={{ margin: '5px 0' }}  >{(reorder) ? ((reorder.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                                </Row>
                            </Col>
                            <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                                <Icon type="arrow-right" />
                            </Col>
                            <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                                <Row align='middle'>
                                    <Col xs={24} style={{ margin: '5px 0' }}><Icon component={ReadyToPickupIcon} /></Col>
                                    <Col xs={24} style={{ margin: '5px 0', color: ((readytopickups[key]) ? '#1890ff' : '') }}>{(readytopickups[key]) ? <Icon type='check' /> : ''} Ready To Pick Up</Col>
                                    <Col xs={24} style={{ margin: '-5px 0' }}>{(readytopickups[key]) ? moment(readytopickups[key].date).format('DD/MM/YYYY') : '-'}</Col>
                                    <Col xs={24} style={{ margin: '5px 0' }}>{(readytopickups[key]) ? ((readytopickups[key].isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                                </Row>
                            </Col>
                            <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                                <Icon type="arrow-right" />
                            </Col>
                            <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                                <Row >
                                    <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={OnDeliveryIcon} style={{ fontSize: '50%' }} /></Col>
                                    <Col xs={24} style={{ margin: '5px 0', color: ((ondeliverys[key]) ? '#1890ff' : '') }}  >{(ondeliverys[key]) ? <Icon type='check' /> : ''} On Delivery</Col>
                                    <Col xs={24} style={{ margin: '-5px 0' }}  >{(ondeliverys[key]) ? moment(ondeliverys[key].date).format('DD/MM/YYYY') : '-'}</Col>
                                    <Col xs={24} style={{ margin: '5px 0' }}  >{(ondeliverys[key]) ? ((ondeliverys[key].isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                                </Row>
                            </Col>
                            <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                                <Row >
                                    <Icon type="arrow-right" />
                                </Row>
                            </Col>
                            <Col sm={24} md={8} lg={4} type='flex' align='middle'>
                                <Row align='middle'>
                                    <Col xs={24} style={{ margin: '5px 0' }}><Icon component={DeliveredIcon} /></Col>
                                    <Col xs={24} style={{ margin: '5px 0', color: ((delivered) ? '#1890ff' : '') }}>{(delivered) ? <Icon type='check' /> : ''} Delivered</Col>
                                    <Col xs={24} style={{ margin: '-5px 0' }}>{(delivered) ? moment(delivered.date).format('DD/MM/YYYY') : '-'}</Col>
                                    <Col xs={24} style={{ margin: '5px 0' }}>{(delivered) ? ((delivered.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                }
            } else if (reordernumber > 0 && screenMedium) {
                for (let key = 0; key < reordernumber; key++) {
                    afterReorder[key] =
                        <div>
                            <Row type='flex' justify='start' style={{ marginBottom: 20 }}>
                                <Col sm={24} md={1} lg={1} style={{ marginLeft: '13.5%' }}>
                                    <Icon type="arrow-down" />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                                    <Row >
                                        <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={OnDeliveryIcon} style={{ fontSize: '50%' }} /></Col>
                                        <Col xs={24} style={{ margin: '5px 0', color: ((ondeliverys[key]) ? '#1890ff' : '') }}  >{(ondeliverys[key]) ? <Icon type='check' /> : ''} On Delivery</Col>
                                        <Col xs={24} style={{ margin: '-5px 0' }}  >{(ondeliverys[key]) ? moment(ondeliverys[key].date).format('DD/MM/YYYY') : '-'}</Col>
                                        <Col xs={24} style={{ margin: '5px 0' }}  >{(ondeliverys[key]) ? ((ondeliverys[key].isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                                    </Row>
                                </Col>
                                <Col sm={24} md={1} lg={1} style={{ marginTop: 20 }}>
                                    <Row >
                                        <Icon type="arrow-right" />
                                    </Row>
                                </Col>
                                <Col sm={24} md={7} lg={4} type='flex' align='middle'>
                                    <Row align='middle'>
                                        <Col xs={24} style={{ margin: '5px 0' }}><Icon component={DeliveredIcon} /></Col>
                                        <Col xs={24} style={{ margin: '5px 0', color: ((delivered) ? '#1890ff' : '') }}>{(delivered) ? <Icon type='check' /> : ''} Delivered</Col>
                                        <Col xs={24} style={{ margin: '-5px 0' }}>{(delivered) ? moment(delivered.date).format('DD/MM/YYYY') : '-'}</Col>
                                        <Col xs={24} style={{ margin: '5px 0' }}>{(delivered) ? ((delivered.isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                }
            } else if (reordernumber > 0) {
                for (let key = 0; key < reordernumber; key++) {
                    afterReorder[key] = <div>
                        <Col sm={24} style={{ marginBottom: 10 }}>
                            <Col xs={12} type='flex' align='middle'>
                                <Col xs={24} style={{ margin: '5px 0' }}><Icon component={ReadyToPickupIcon} /></Col>
                            </Col>
                            <Col xs={12} type='flex' align='start'>
                                <Col xs={24} style={{ margin: '5px 0', color: ((readytopickups[key]) ? '#1890ff' : '') }}>{(readytopickups[key]) ? <Icon type='check' /> : ''} Ready To Pick Up</Col>
                                <Col xs={24} style={{ margin: '-5px 0' }}>{(readytopickups[key]) ? moment(readytopickups[key].date).format('DD/MM/YYYY') : '-'}</Col>
                                <Col xs={24} style={{ margin: '5px 0' }}>{(readytopickups[key]) ? ((readytopickups[key].isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                            </Col>
                        </Col>
                        <Col sm={24} style={{ marginBottom: 10 }}>
                            <Col xs={12} type='flex' align='middle'>
                                <Col xs={24} style={{ margin: '5px 0' }}  ><Icon component={OnDeliveryIcon} style={{ fontSize: '50%' }} /></Col>
                            </Col>
                            <Col xs={12} type='flex' align='start'>
                                <Col xs={24} style={{ margin: '5px 0', color: ((ondeliverys[key]) ? '#1890ff' : '') }}  >{(ondeliverys[key]) ? <Icon type='check' /> : ''} On Delivery</Col>
                                <Col xs={24} style={{ margin: '-5px 0' }}  >{(ondeliverys[key]) ? moment(ondeliverys[key].date).format('DD/MM/YYYY') : '-'}</Col>
                                <Col xs={24} style={{ margin: '5px 0' }}  >{(ondeliverys[key]) ? ((ondeliverys[key].isoversla) ? <span style={{ color: 'red' }}>Over Sla</span> : <span style={{ color: 'green' }}>On Time</span>) : ''}</Col>
                            </Col>
                        </Col>
                    </div>
                }
            }

            if (screenLarger) {
                return <LargerScreen {...this.props} trackingstatus={trackingstatus} trackingdata={trackingdata} dataComponent={dataComponent} afterReorder={afterReorder} />
            } else if (screenMedium) {
                return <MediumScreen {...this.props} trackingstatus={trackingstatus} trackingdata={trackingdata} dataComponent={dataComponent} afterReorder={afterReorder} />
            } else return <SmallScreen {...this.props} trackingstatus={trackingstatus} trackingdata={trackingdata} dataComponent={dataComponent} afterReorder={afterReorder} />
        } else return <Skeleton active />
    }
}


export default OrderHistorySteps