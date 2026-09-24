import React, { Component } from 'react';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Button as Button2 } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card, Button, Modal, Table } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../../utilities/Helpers';

const { Title, Text } = Typography;
const { Column } = Table;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: [],
        }
    };

    componentDidMount() {
        document.title = ' Details Reorder | Loyalty Management System ';
        this.getDetail();
    };

    getDetail = () => {
        let url = api.url.reorder.detail;
        let data = { reorderid: this.props.match.params.ID };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let reorderid = result.reorderid ? result.reorderid : '-';
                    let deadline = result.deadline ? moment(result.deadline).format('DD/MM/YYYY') : null;
                    let reordernumber = result.reordernumber ? result.reordernumber : '0';
                    let status = result.status ? result.status : null;
                    let isoversla = result.isoversla === true ? 'OVER SLA' : 'ON TIME';
                    let ordercode = result.ordercode ? result.ordercode : null;
                    let orderdate = result.orderdate ? moment(result.orderdate).format('DD/MM/YYYY') : null;
                    let mailingproductname = result.mailingproductname ? result.mailingproductname : null;
                    let mailingproducttype = result.mailingproducttype ? result.mailingproducttype : null;
                    let inventoryvariantname = result.inventoryvariantname ? result.inventoryvariantname : null;
                    let priorityhandling = result.priorityhandling ? result.priorityhandling : null;
                    let ordernotes = result.ordernotes ? result.ordernotes : null;
                    let notes = result.notes ? result.notes : null;
                    let startdate = result.startdate ? moment(result.startdate).format('DD/MM/YYYY') : null;
                    let enddate = result.enddate ? moment(result.enddate).format('DD/MM/YYYY') : null;
                    let awb = result.awb ? result.awb : null;
                    let reorderdate = result.reorderdate ? moment(result.reorderdate).format('DD/MM/YYYY') : null;
                    let reorderto = result.reorderto ? result.reorderto : null;
                    let usevendor = result.usevendor ? result.usevendor : false;
                    let qty = result.qty ? result.qty : false;
                    let branchname = result.branchname ? result.branchname : false;
                    let address = result.address ? result.address : false;
                    let ticketingofficename = result.ticketingofficename ? result.ticketingofficename : false;
                    let issamedestination = result.issamedestination ? true : false;

                    //destinationdetail
                    let desaddress = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.address ? result.destinationdetail.address : null;
                    let desbranchname = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.branchname ? result.destinationdetail.branchname : null;
                    let countryname = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.countryname ? result.destinationdetail.countryname : null;
                    let postalcode = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.postalcode ? result.destinationdetail.postalcode : null;
                    let sendto = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.sendto ? result.destinationdetail.sendto : null;
                    let statename = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.statename ? result.destinationdetail.statename : null;
                    let cityname = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.cityname ? result.destinationdetail.cityname : null;
                    let desticketofficename = result && result.destinationdetail && Object.keys(result.destinationdetail).length !== 0 && result.destinationdetail.ticketofficename ? result.destinationdetail.ticketofficename : null;

                    //newdestinationdetail
                    let newaddress = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.address ? result.newdestinationdetail.address : null;
                    let newbranchname = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.branchname ? result.newdestinationdetail.branchname : null;
                    let newcountryname = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.countryname ? result.newdestinationdetail.countryname : null;
                    let newpostalcode = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.postalcode ? result.newdestinationdetail.postalcode : null;
                    let newsendto = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.sendto ? result.newdestinationdetail.sendto : null;
                    let newstatename = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.statename ? result.newdestinationdetail.statename : null;
                    let newcityname = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.cityname ? result.newdestinationdetail.cityname : null;
                    let newticketofficename = result && result.newdestinationdetail && Object.keys(result.newdestinationdetail).length !== 0 && result.newdestinationdetail.ticketofficename ? result.newdestinationdetail.ticketofficename : null;

                    //memberdetail
                    let cardnumber = result && result.memberdetail && Object.keys(result.memberdetail).length !== 0 && result.memberdetail.cardnumber ? result.memberdetail.cardnumber : null;
                    let enrolmentdate = result && result.memberdetail && Object.keys(result.memberdetail).length !== 0 && result.memberdetail.enrolmentdate ? result.memberdetail.enrolmentdate : null;
                    let tier = result && result.memberdetail && Object.keys(result.memberdetail).length !== 0 && result.memberdetail.tier ? result.memberdetail.tier : null;
                    let name = result && result.memberdetail && Object.keys(result.memberdetail).length !== 0 && result.memberdetail.name ? result.memberdetail.name : null;

                    //memberaddressdetail
                    let memberAddress = result && result.memberdetail && result.memberdetail.memberaddress && Object.keys(result.memberdetail.memberaddress).length !== 0 && result.memberdetail.memberaddress !== null && result.memberdetail.memberaddress.address ? result.memberdetail.memberaddress.address : null;
                    let memberCountry = result && result.memberdetail && result.memberdetail.memberaddress && Object.keys(result.memberdetail.memberaddress).length !== 0 && result.memberdetail.memberaddress !== null && result.memberdetail.memberaddress.countryname ? result.memberdetail.memberaddress.countryname : null;
                    let memberState = result && result.memberdetail && result.memberdetail.memberaddress && Object.keys(result.memberdetail.memberaddress).length !== 0 && result.memberdetail.memberaddress !== null && result.memberdetail.memberaddress.statename ? result.memberdetail.memberaddress.statename : null;
                    let memberCity = result && result.memberdetail && result.memberdetail.memberaddress && Object.keys(result.memberdetail.memberaddress).length !== 0 && result.memberdetail.memberaddress !== null && result.memberdetail.memberaddress.cityname ? result.memberdetail.memberaddress.cityname : null;
                    let memberPostalCode = result && result.memberdetail && result.memberdetail.memberaddress && Object.keys(result.memberdetail.memberaddress).length !== 0 && result.memberdetail.memberaddress !== null && result.memberdetail.memberaddress.postalcode ? result.memberdetail.memberaddress.postalcode : null;

                    //letter
                    let lettername = result && result.letterdetail && Object.keys(result.letterdetail).length !== 0 && result.letterdetail.lettername ? result.letterdetail.lettername : null;
                    let languagename = result && result.letterdetail && Object.keys(result.letterdetail).length !== 0 && result.letterdetail.languagename ? result.letterdetail.languagename : null;

                    let papervariant = result && result.letterdetail && result.letterdetail.papervariant && Object.keys(result.letterdetail.papervariant).length !== 0 && result.letterdetail.papervariant !== null && result.letterdetail.papervariant.inventorycode ? result.letterdetail.papervariant.inventorycode : null;
                    let papername = result && result.letterdetail && result.letterdetail.papervariant && Object.keys(result.letterdetail.papervariant).length !== 0 && result.letterdetail.papervariant !== null && result.letterdetail.papervariant.inventoryvariantname ? result.letterdetail.papervariant.inventoryvariantname : null;

                    let envelopevariant = result && result.letterdetail && result.letterdetail.envelopevariant && Object.keys(result.letterdetail.envelopevariant).length !== 0 && result.letterdetail.envelopevariant !== null && result.letterdetail.envelopevariant.inventorycode ? result.letterdetail.envelopevariant.inventorycode : null;
                    let envelopename = result && result.letterdetail && result.letterdetail.envelopevariant && Object.keys(result.letterdetail.envelopevariant).length !== 0 && result.letterdetail.envelopevariant !== null && result.letterdetail.envelopevariant.inventoryvariantname ? result.letterdetail.envelopevariant.inventoryvariantname : null;

                    //vendordetail
                    let addressvendor = result && result.vendor && Object.keys(result.vendor).length !== 0 && result.vendor.address ? result.vendor.address : null;
                    let phone = result && result.vendor && Object.keys(result.vendor).length !== 0 && result.vendor.phone ? result.vendor.phone : null;
                    let vendorcode = result && result.vendor && Object.keys(result.vendor).length !== 0 && result.vendor.vendorcode ? result.vendor.vendorcode : null;
                    let vendorname = result && result.vendor && Object.keys(result.vendor).length !== 0 && result.vendor.vendorname ? result.vendor.vendorname : null;
                    let email = result && result.vendor && Object.keys(result.vendor).length !== 0 && result.vendor.email ? result.vendor.email : null;

                    //worknote
                    let dataList = result.worknotes ? result.worknotes : '-';
                    let from = result && result.worknotes && result.worknotes[0] && result.worknotes[0].from && Object.keys(result.worknotes[0]).length !== 0 ? result.worknotes[0].from : '-';
                    this.setState({
                        reorderid, deadline, reordernumber, isoversla, ordercode, orderdate, mailingproductname, inventoryvariantname, mailingproducttype, priorityhandling,
                        ordernotes, notes, startdate, enddate, status, awb, reorderdate, reorderto, usevendor, qty, branchname, address, ticketingofficename, issamedestination,
                        desaddress, desbranchname, countryname, postalcode, sendto, statename, cityname, desticketofficename,
                        newaddress, newbranchname, newcityname, newcountryname, newpostalcode, newsendto, newstatename, newticketofficename,
                        cardnumber, enrolmentdate, tier, name,
                        memberAddress, memberCountry, memberState, memberCity, memberPostalCode,
                        lettername, languagename, papervariant, envelopevariant, papername, envelopename,
                        addressvendor, phone, vendorcode, vendorname, email,
                        from, dataList,
                        data: result,
                    });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    render() {
        const { isLoading, cityname, dataList, name, mailingproducttype, inventoryvariantname, issamedestination,
            cardnumber, enrolmentdate, tier, qty, desaddress, countryname, postalcode, statename, ordercode, orderdate,
            sendto, desbranchname, desticketofficename, reorderdate, reorderto, lettername, languagename,
            papervariant, envelopevariant, papername, envelopename, mailingproductname,
            memberAddress, memberCountry, memberState, memberCity, memberPostalCode,
            newaddress, newbranchname, newcityname, newcountryname, newpostalcode, newsendto, newstatename, newticketofficename,
        } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 8 } }
        };

        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}><Button2 htmlType={'link'} url={`/order-management/reorder`} shape='circle' icon='left' /> Reorder Details</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Card bordered={false} style={{ boxShadow: '0 1px 2.5px 0 rgba(27,27,27,.1)', marginBottom: '16px', borderRadius: '15px' }} >
                                    <Row>
                                        <Col xs={24} md={18} >
                                            <Col className='gutter-row' xs={24} style={{ marginBottom: 5 }}><Text style={{ fontSize: '16px' }}>Order Code :</Text> <label style={{ fontSize: '16px' }}>{(ordercode) ? ordercode : '-'}</label></Col>
                                            <Col className='gutter-row' xs={24} style={{ marginBottom: 20 }}>
                                                <Text type='secondary' style={{ fontSize: '12px' }}>Order Date :</Text> <label style={{ fontSize: '14px' }}>{(orderdate) ? orderdate : '-'}</label>
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} md={8} style={{ marginTop: 20 }}>
                                            <Col xs={2}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i className="fa fa-book" aria-hidden="true"></i></Row>
                                            </Col>
                                            <Col xs={21} offset={1}>
                                                <Title level={4}>Order Info</Title>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Product Type</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(mailingproducttype) ? mailingproducttype : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Product Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(mailingproductname) ? mailingproductname : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Variant Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(inventoryvariantname) ? inventoryvariantname : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Qty</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(qty) ? qty : '-'}</label></Col>
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
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Paper Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(papername) ? papername : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Paper Variant</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(papervariant) ? papervariant : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Envelope Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(envelopename) ? envelopename : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Envelope Variant</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(envelopevariant) ? envelopevariant : '-'}</label></Col>
                                                </Row>
                                            </Col>
                                        </Col>
                                        <Col xs={24} md={8} style={{ marginTop: 20 }}>
                                            <Col xs={2}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i className="fa fa-users" aria-hidden="true"></i></Row>
                                            </Col>
                                            <Col xs={21} offset={1}>
                                                <Title level={4}>Member</Title>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Name</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(name) ? name : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Card Number</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(cardnumber) ? cardnumber : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Valid thru</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(enrolmentdate) ? enrolmentdate : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Tier</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(tier) ? tier : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Address</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(memberAddress) ? memberAddress : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}></Col>
                                                    <Col className='gutter-row' xs={1}></Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{`${(memberCity) ? memberCity + ',' : ''}`} {(memberState) ? memberState : '-'}</label></Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{ }</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}></Col>
                                                    <Col className='gutter-row' xs={1}></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}></Col>
                                                    <Col className='gutter-row' xs={1}></Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{`${(memberPostalCode) ? memberPostalCode + ',' : ''}`} {(memberCountry) ? memberCountry : '-'}</label></Col>
                                                </Row>
                                            </Col>
                                        </Col>
                                        {issamedestination ?
                                            <Row>
                                                <Col xs={24} md={8} style={{ marginTop: 20 }}>
                                                    <Col xs={2}>
                                                        <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i className="fa fa-map-marker" aria-hidden="true"></i></Row>
                                                    </Col>
                                                    <Col xs={21} offset={1}>
                                                        <Title level={4}>Destination</Title>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Send to</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(sendto) ? sendto : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Branch Name</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(desbranchname) ? desbranchname : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Ticket Office</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(desticketofficename) ? desticketofficename : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Address</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(desaddress) ? desaddress : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}></Col>
                                                            <Col className='gutter-row' xs={1}></Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{`${(cityname) ? cityname + ',' : ''}`} {(statename) ? statename : '-'}</label></Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{ }</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}></Col>
                                                            <Col className='gutter-row' xs={1}></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}></Col>
                                                            <Col className='gutter-row' xs={1}></Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{`${(postalcode) ? postalcode + ',' : ''}`} {(countryname) ? countryname : '-'}</label></Col>
                                                        </Row>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            : <Row>
                                                <Col xs={24} md={8} style={{ marginTop: 20 }}>
                                                    <Col xs={2}>
                                                        <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i className="fa fa-map-marker" aria-hidden="true"></i></Row>
                                                    </Col>
                                                    <Col xs={21} offset={1}>
                                                        <Title level={4}>Destination</Title>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Send to</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(newsendto) ? newsendto : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Branch Name</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(newbranchname) ? newbranchname : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Ticket Office</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(newticketofficename) ? newticketofficename : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Address</Text></Col>
                                                            <Col className='gutter-row' xs={1}>: </Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(newaddress) ? newaddress : '-'}</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}></Col>
                                                            <Col className='gutter-row' xs={1}></Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{`${(newcityname) ? newcityname + ',' : ''}`} {(newstatename) ? newstatename : '-'}</label></Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{ }</label></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}></Col>
                                                            <Col className='gutter-row' xs={1}></Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: 5 }}>
                                                            <Col className='gutter-row' xs={24} md={7}></Col>
                                                            <Col className='gutter-row' xs={1}></Col>
                                                            <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{`${(newpostalcode) ? newpostalcode + ',' : ''}`} {(newcountryname) ? newcountryname : '-'}</label></Col>
                                                        </Row>
                                                    </Col>
                                                </Col>
                                            </Row>
                                        }
                                    </Row>
                                    <Row>
                                        <Col xs={24} md={8} style={{ marginTop: 20 }}>
                                            <Col xs={2}>
                                                <Row style={{ background: '#F5F5F5', borderRadius: '100px', padding: '10px' }} type='flex' justify='center'><i className="fa fa-retweet" aria-hidden="true"></i></Row>
                                            </Col>
                                            <Col xs={21} offset={1}>
                                                <Title level={4}>Reorder Information</Title>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Reorder Date</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(reorderdate) ? reorderdate : '-'}</label></Col>
                                                </Row>
                                                <Row style={{ marginBottom: 5 }}>
                                                    <Col className='gutter-row' xs={24} md={7}><Text type='secondary' style={{ fontSize: '13px' }}>Reorder To</Text></Col>
                                                    <Col className='gutter-row' xs={1}>: </Col>
                                                    <Col className='gutter-row' xs={23} md={16}> <label style={{ fontSize: '15px' }}>{(reorderto) ? (reorderto === 'READYTODELIVER' || reorderto === 'DELIVERING') ? 'READY TO PICK-UP' : (reorderto === 'READYTOPACK' || reorderto === 'PACKING') ? 'READY TO PACK' :
                                                        (reorderto === 'READYTOPRINT' || reorderto === 'PRINTING') ? 'READY TO PRINT' : (reorderto === 'PAYMENT_SUCCESS') ? 'PAYMENT SUCCESS' : reorderto : '-'}</label></Col>
                                                </Row>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} style={{ boxShadow: '0 1px 2.5px 0 rgba(27,27,27,.1)', marginBottom: '16px', borderRadius: '15px' }} >
                                    <Divider orientation='left'> <Text strong> Work Notes </Text> </Divider>
                                    <Table rowKey={record => record.number} dataSource={dataList} size="middle" pagination={true} loading={isLoading} >
                                        <Column title="No" dataIndex="number" key="number" render={(val, row, i) => i + 1} width="3%" />
                                        <Column title="Date" dataIndex="date" key="date" width="10%" render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} sorter={(a, b) => new Date(a.date) - new Date(b.date)} />
                                        <Column title="From" dataIndex="fromvendorname" key="fromvendorname" width="20%" sorter={(a, b) => ('' + a.fromvendorname).localeCompare(b.fromvendorname)} render={(value, row) => (row.fromvendorname) ? value : 'GA'} />
                                        <Column title="To" dataIndex="tovendorname" key="tovendorname" width="20%" sorter={(a, b) => ('' + a.tovendorname).localeCompare(b.tovendorname)} render={(value, row) => (row.tovendorname) ? value : 'GA'} />
                                        <Column title="Notes" dataIndex="notes" key="notes" width="20%" sorter={(a, b) => ('' + a.notes).localeCompare(b.notes)} render={(value) => (value) ? value : '-'} />
                                    </Table>
                                </Card>
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={14} xl={14}>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));