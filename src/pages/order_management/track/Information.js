import React from 'react';
import { Button, OrderHistorySteps } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Card, Typography, Divider, Spin, Table, Modal, Tag, message } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { TrackingDestinationHistory as DestinationHistory } from '../../../components/Base/BaseComponent';

const { Title, Text } = Typography;
const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: {
                destinationvisible: false
            }
        }
    };

    handleModal = (value, fieldname) => {
        this.setState({
            visible: { ...this.state.visible, [fieldname]: value }
        });
    };

    handleCloseAllModal = () => {
        this.setState({ visible: { destinationvisible: false } });
    };

    handleCopyOrdercode = (ordercode) => {
        navigator.clipboard.writeText(ordercode);
        message.success('Your order code is copied.', 3);
    };

    render() {
        const { visible } = this.state;
        const { destinationvisible } = visible || {};
        const { isLoading, trackingDetail, orderDetail, memberProfile, letterData, vendorProduct } = this.props;
        const { usepackagingvendor, usecouriercode, useprintingvendor, inventoryvariant, branchcode, qty, isfree, printletter, emd, mailingproduct, orderdate,
            ordercode, status, paymenttype, paymentmethod, totalprice, currencycode, ticketoffice, printingvendorcode, printingnotes, printingpriorityhandling,
            packagingvendorcode, packagingnotes, packagingpriorityhandling, couriervendorcode, couriernotes, courierpriorityhandling, mailingorderdestination } = orderDetail || {};
        const { printingvendorname, packagingvendorname, couriervendorname } = vendorProduct || {};
        const { trackingstatus, reordernumber } = trackingDetail || {};
        const { firstname, lastname, membercards, membertiers, memberaddress } = memberProfile || {};
        const { lettername, languagename, papervariant, envelopevariant } = letterData || {};
        const { address, statename, cityname, countryname, postalcode } = (!memberaddress) ? {} : (memberaddress.length === 0) ? {} : memberaddress.filter((val) => val.active && val.ispreffered).length !== 0 ? memberaddress.filter((val) => val.active && val.ispreffered)[0] : {};
        const { producttype, mailingproductname } = mailingproduct || {}

        const primaryDestination = (mailingorderdestination && mailingorderdestination.length !== 0) ? mailingorderdestination.find((obj) => obj.isdefault) : null;
        const sendto = (primaryDestination) ? primaryDestination.sendto : null;
        const addressDestination = (primaryDestination) ? primaryDestination.address : null;
        const statenameDestination = (primaryDestination) ? primaryDestination.state : null;
        const citynameDestination = (primaryDestination) ? primaryDestination.city : null;
        const countrynameDestination = (primaryDestination) ? primaryDestination.country : null;
        const postalcodeDestination = (primaryDestination) ? primaryDestination.postalcode : null;

        return (
            <React.Fragment >
                <Spin spinning={isLoading}>
                    <Row style={{ marginBottom: 5 }}>

                        <Modal visible={destinationvisible} title={'Destination History'} loading={isLoading} onCancel={this.handleCloseAllModal} footer={null} destroyOnClose={true} width={1000}>
                            <DestinationHistory {...this.props} mailingorderdestination={mailingorderdestination} onClose={this.handleCloseAllModal} />
                        </Modal>

                        <Row style={{ marginBottom: 5 }}>
                            <Col xs={24} xl={20}>
                                <Title level={4}><Button htmlType={'link'} url={`/order-management/track`} shape='circle' icon='left' /> Tracking Status Details</Title>
                            </Col>
                            <Divider />
                        </Row>

                        <Col className='gutter-row' md={24} >
                            <Card bordered={false} style={{ boxShadow: '0 1px 2.5px 0 rgba(27,27,27,.1)', marginBottom: '16px', borderRadius: '15px' }} >
                                <div style={{ background: '#ffffff', height: '100%' }} >
                                    <Row>
                                        <Col xs={24} md={18} >
                                            <Col className='gutter-row' xs={24} style={{ marginBottom: 5 }}>
                                                <Text style={{ fontSize: '16px' }}>Order Code :</Text>
                                                <label style={{ fontSize: '16px' }}>{(ordercode) ? ` ${ordercode}` : '-'}</label>
                                                <Button htmlType='button' onClick={() => this.handleCopyOrdercode(ordercode)} type='primary' shape='circle' icon='copy' title='Copy Order Code' style={{ marginLeft: 30 }} />
                                            </Col>
                                            <Col className='gutter-row' xs={24} style={{ marginBottom: 20 }}>
                                                <Text type='secondary' style={{ fontSize: '12px' }}>Order Date :</Text> <label style={{ fontSize: '14px' }}>{(orderdate) ? moment(orderdate).format('DD/MM/YYYY') : '-'}</label>
                                                <label style={{ fontSize: '14px', margin: '0px 10px' }}>|</label>
                                                <Text type='secondary' style={{ fontSize: '12px' }}>Reorder :</Text> <label style={{ fontSize: '14px' }}>{(reordernumber || reordernumber === 0) ? reordernumber : '-'}</label>
                                            </Col>
                                        </Col>
                                        <Col xs={24} md={6}>
                                            <Row gutter={24} type='flex' justify='end' style={{ marginTop: 15, padding: '0px 20px' }}>
                                                <Text type='secondary' style={{ fontSize: '13px' }}>Status : &nbsp;</Text>
                                                <Text style={{ display: 'block' }}>
                                                    <Tag color={(status === 'WAITING_FOR_PAYMENT' || (status === 'FAILED')) ? '#f50' : '#87d068'}>
                                                        {(status) ? jsUcfirst(status === 'SUCCESS' ? 'DELIVERED' : status && status === 'READYTODELIVER' ? 'READY TO PICKUP' : status && status === 'DELIVERING' ? 'ON DELIVERY' : status, '_').toUpperCase() : '-'}
                                                    </Tag>
                                                </Text>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={24} md={12} style={{ marginTop: 20 }}>
                                            <Col xs={2}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i class='fa fa-book' aria-hidden='true'></i></Row>
                                            </Col>
                                            <Col xs={21} offset={1}>
                                                <Title level={4}>Order Info</Title>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Product Type</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(producttype) ? producttype : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Product Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(mailingproductname) ? mailingproductname : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Variant Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(inventoryvariant && inventoryvariant.inventoryvariantname) ? inventoryvariant.inventoryvariantname : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Qty</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(qty) ? qty : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Print Letter</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(printletter !== undefined) ? (printletter) ? 'Yes' : 'No' : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Letter Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(lettername) ? lettername : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Language</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(languagename) ? languagename : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Paper</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(papervariant && papervariant.inventorycode) ? papervariant.inventorycode : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Paper Variant</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(papervariant && papervariant.inventoryvariantname) ? jsUcfirst(papervariant.inventoryvariantname) : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Envelope</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(envelopevariant && envelopevariant.inventorycode) ? envelopevariant.inventorycode : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Envelope Variant</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(envelopevariant && envelopevariant.inventoryvariantname) ? jsUcfirst(envelopevariant.inventoryvariantname) : '-'}</label></Col>
                                                </Row>
                                            </Col>
                                        </Col>
                                        <Col xs={24} md={12} style={{ marginTop: 20 }}>
                                            <Col xs={2}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i class='fa fa-users' aria-hidden='true'></i></Row>
                                            </Col>
                                            <Col xs={21} offset={1}>
                                                <Title level={4}>Member</Title>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(firstname) ? `${firstname} ${lastname}` : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Cardnumber</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(!membercards) ? '-' : (membercards.length === 0) ? '-' : (membercards[0].cardnumber) ? membercards[0].cardnumber : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Valid thru</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(!membertiers) ? '-' : (membertiers.length === 0) ? '-' : (membertiers[0].enddate) ? moment(membertiers[0].enddate).format('DD/MM/YYYY') : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Tier</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(!membertiers) ? '-' : (membertiers.length === 0) ? '-' : (membertiers[0].tiername) ? membertiers[0].tiername : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Address</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16} style={{ lineHeight: 1.8 }}>
                                                        <label style={{ fontSize: '15px' }}>{(address) ? jsUcfirst(address) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(cityname) ? jsUcfirst(cityname) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(statename) ? jsUcfirst(statename) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(countryname) ? jsUcfirst(countryname) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(postalcode) ? jsUcfirst(postalcode) : '-'}</label><br />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={24} md={12} style={{ marginTop: 30 }}>
                                            <Col xs={2}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i class='fa fa-map-marker' aria-hidden='true'></i></Row>
                                            </Col>
                                            <Col xs={21} offset={1}>
                                                <Row>
                                                    <Col xs={12}>
                                                        <Title level={4} >Destination</Title>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 3 }} ><label>
                                                            <Link to='#' onClick={() => this.handleModal(true, 'destinationvisible')} style={{ cursor: 'pointer' }}> <i class='fa fa-external-link' aria-hidden='true' style={{ marginLeft: 10 }} /> History</Link>
                                                        </label></Row>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Send to</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(sendto) ? (sendto === 'BO') ? 'Branch Office' : sendto : '-'}</label></Col>
                                                </Row>
                                                {
                                                    (sendto === 'BO') ? <Row style={{ marginBottom: 5 }}>
                                                        <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Branch Code</Text></Col>
                                                        <Col className='gutter-row' xs={1}>: </Col>
                                                        <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(branchcode) ? branchcode : '-'}</label></Col>
                                                    </Row> : null
                                                }
                                                {
                                                    (sendto === 'BO') ? <Row style={{ marginBottom: 5 }}>
                                                        <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Ticket Office</Text></Col>
                                                        <Col className='gutter-row' xs={1}>: </Col>
                                                        <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(ticketoffice) ? ticketoffice : '-'}</label></Col>
                                                    </Row> : null
                                                }
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Address</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    {(sendto !== 'BO') ? <Col className='gutter-row' xs={23} md={16} style={{ lineHeight: 1.8 }}>
                                                        <label style={{ fontSize: '15px' }}>{(addressDestination) ? jsUcfirst(addressDestination) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(citynameDestination) ? jsUcfirst(citynameDestination) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(statenameDestination) ? jsUcfirst(statenameDestination) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(countrynameDestination) ? jsUcfirst(countrynameDestination) : '-'}</label><br />
                                                        <label style={{ fontSize: '15px' }}>{(postalcodeDestination) ? jsUcfirst(postalcodeDestination) : '-'}</label><br />
                                                    </Col> : <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(addressDestination) ? addressDestination : '-'}</label></Col>
                                                    }
                                                </Row>
                                            </Col>
                                        </Col>
                                        <Col xs={24} md={12} style={{ marginTop: 30 }}>
                                            <Col xs={2}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i class='fa fa-money' aria-hidden='true'></i></Row>
                                            </Col>
                                            <Col xs={21} offset={1}>
                                                <Title level={4}>Payment</Title>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={8}><Text type='secondary' style={{ fontSize: '13px' }}>Is Free</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={15}> <label style={{ fontSize: '15px' }}>{(isfree !== undefined) ? (isfree) ? 'Yes' : 'No' : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={8}><Text type='secondary' style={{ fontSize: '13px' }}>Payment Type</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={15}> <label style={{ fontSize: '15px' }}>{(paymenttype) ? paymenttype : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={8}><Text type='secondary' style={{ fontSize: '13px' }}>Payment Method</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={15}> <label style={{ fontSize: '15px' }}>{(paymentmethod) ? paymentmethod : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={8}><Text type='secondary' style={{ fontSize: '13px' }}>Total Price</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={15}> <label style={{ fontSize: '15px' }}>
                                                        {(totalprice) ? `${(paymenttype === 'CASH') ? `${currencycode} ${totalprice}` : `${totalprice} Miles`}` : '-'}
                                                    </label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={8}><Text type='secondary' style={{ fontSize: '13px' }}>EMD</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={15}> <label style={{ fontSize: '15px' }}>{(emd) ? emd : '-'}</label></Col>
                                                </Row>
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={24} style={{ marginTop: 30, marginBottom: 50 }}>
                                            <Col xs={2} sm={1}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i class='fa fa-truck' aria-hidden='true'></i></Row>
                                            </Col>
                                            <Col xs={21} sm={22} offset={1}>
                                                <Title level={4}>Vendor</Title>
                                                <Row>
                                                    <Col xs={24} md={12}>
                                                        <Divider orientation='left' type='horizontal'>Printing</Divider>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Name</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!useprintingvendor) ? 'No' : (printingvendorname) ? printingvendorname : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Code</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!useprintingvendor) ? 'No' : (printingvendorcode) ? printingvendorcode : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Priority Handling</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!useprintingvendor) ? 'No' : (printingpriorityhandling) ? printingpriorityhandling : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Notes</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!useprintingvendor) ? 'No' : (printingnotes) ? printingnotes : '-'}
                                                            </label></Col>
                                                        </Row>

                                                        <Divider orientation='left' type='horizontal'>Courier</Divider>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Name</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usecouriercode) ? 'No' : (couriervendorname) ? couriervendorname : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Code</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usecouriercode) ? 'No' : (couriervendorcode) ? couriervendorcode : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Priority Handling</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usecouriercode) ? 'No' : (courierpriorityhandling) ? courierpriorityhandling : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Notes</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usecouriercode) ? 'No' : (couriernotes) ? couriernotes : '-'}
                                                            </label></Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Divider orientation='left' type='horizontal'>Packaging</Divider>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Name</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usepackagingvendor) ? 'No' : (packagingvendorname) ? packagingvendorname : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Code</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usepackagingvendor) ? 'No' : (packagingvendorcode) ? packagingvendorcode : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Priority Handling</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usepackagingvendor) ? 'No' : (packagingpriorityhandling) ? packagingpriorityhandling : '-'}
                                                            </label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Notes</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>
                                                                {(!usepackagingvendor) ? 'No' : (packagingnotes) ? packagingnotes : '-'}
                                                            </label></Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Card title='Order History' bordered={false} style={{ boxShadow: '0 1px 2.5px 0 rgba(27,27,27,.1)', marginBottom: '20px', borderRadius: '15px' }}>
                            <OrderHistorySteps trackingstatus={trackingstatus} producttype={producttype} reordernumber={reordernumber} />
                            <div style={{ marginTop: 40 }} >
                                <Table dataSource={trackingstatus} size='middle' pagination={false} >
                                    <Column width='2%' />
                                    <Column title='Status' dataIndex='status' key='status' className='nowrap' render={
                                        (value, record) => (value) ? ((value === 'READYTOPRINT') ? 'Ready to Print' : (value === 'READYTODELIVER') ? 'Ready to Deliver' : (value === 'DELIVERING') ? 'On Delivery' : (value === 'READYTOPACK') ? 'Ready to Pack' : jsUcfirst(value, '_')) : '-'}
                                    />
                                    <Column title='Performed By' dataIndex='createdBy' key='createdBy' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                                    <Column title='Date' dataIndex='date' key='date' className='nowrap' render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} />
                                    <Column title='Reorder' dataIndex='reordernumber' key='reordernumber' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                                    <Column title='Notes' dataIndex='notes' key='notes' width='25%' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                                    <Column title='Is Over SLA' dataIndex='notes' key='notes' width='25%' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                                </Table>
                            </div>
                        </Card>
                    </Row>
                </Spin>
            </React.Fragment >
        );
    }
}

export default Form.create()(App);