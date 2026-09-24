import React from 'react';
import { Row, Col, Form, Card, Modal } from 'antd';
import { ErrorGeneral, Button, AirActivity, PassengerDetails, CertificateDetails } from '../../../components/Base/BaseComponent';
import moment from 'moment';
import { jsUcfirst } from '../../../utilities/Helpers';

import FormUpdateFreeflight from '../../member/certificate/update/air/freeflight/SearchFlight';
import FormUpdateUpgrade from '../../member/certificate/update/air/upgrade/SearchFlight';
import FormFreeflight from '../../member/redemption/freeflight/SearchFlightApproval';
import FormVoucher from '../../member/redemption/voucher/FormApproval';
import FormUpgrade from '../../member/redemption/upgrade/SearchFlightApproval';
import FormHotel from '../../member/redemption/hotels/FormApproval';
import FormTransfer from '../../member/redemption/transfer/FormApproval';

import Certificate from '../../../components/Certificate/Index';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    };

    componentDidMount() {
    }

    handleModal = (action) => {
        this.setState({ visible: action });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { resultdata, formrender, responseMessage, originAirport, destinationAirport } = this.props;
        const { requesttype, cardnumber, createdBy, reqdatas, responsedatas, requeststatus } = resultdata;
        let { awardcode, issueddate, username, bookingcode, totalprice, redeemuser = {}, redeemairactivity, categorycode, quantity, standarfee, freeaward, trxdate, fee, awardinfo, expiredawardmiles } =
            (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ? reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;
        let { certificateid, status, name, familyname, salutationcode, travelertype, selfusage, certificateprice, activitydate } = Array.isArray(redeemuser) ? redeemuser[0] : redeemuser !== undefined ? redeemuser : [];
        let category = categorycode ? categorycode.toLowerCase() : reqdatas ? reqdatas.categorycode ? reqdatas.categorycode.toLowerCase() : '' : '';
        let { nameoncard, firstname, lastname } = awardinfo || {};

        if (category === 'update' || (typeof redeemairactivity === 'object' && redeemairactivity !== null && redeemairactivity.departure === undefined)) {
            redeemairactivity = {
                departure: [redeemairactivity.find(o => o.type === 'departure' || o.type === 'DEPARTURE')],
                return: [redeemairactivity.find(o => o.type === 'return' || o.type === 'RETURN')]
            }
        }

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={responseMessage} />);
        }
        return (
            <React.Fragment>

                <Modal visible={this.state.visible} title='Certificate Details' onCancel={() => this.handleModal(false)} footer={null} destroyOnClose={true} width={1200}>
                    <Certificate {...this.props} number={1} certificateid={reqdatas.certificateid} />
                </Modal>

                {(category === 'freeflight' && requeststatus === 'REVISE' && requesttype === 'UPDATE') ? <Card><FormUpdateFreeflight {...this.props} fromApproval={true} result={resultdata} awardcode={awardcode} /></Card> :
                    (category === 'upgrade' && requeststatus === 'REVISE' && requesttype === 'UPDATE') ? <Card><FormUpdateUpgrade {...this.props} fromApproval={true} result={resultdata} awardcode={awardcode} /></Card> :
                        (category === 'freeflight' && requeststatus === 'REVISE') ? <Card><FormFreeflight {...this.props} fromApproval={true} result={resultdata} awardcode={awardcode} /></Card> :
                            (category === 'voucher' && requeststatus === 'REVISE') ? <Card><FormVoucher {...this.props} fromApproval={true} result={resultdata} awardcode={awardcode} /></Card> :
                                (category === 'upgrade' && requeststatus === 'REVISE') ? <Card><FormUpgrade {...this.props} fromApproval={true} result={resultdata} awardcode={awardcode} /></Card> :
                                    (category === 'hotel' && requeststatus === 'REVISE') ? <Card><FormHotel {...this.props} fromApproval={true} result={resultdata} awardcode={awardcode} /></Card> :
                                        (category === 'transfer' && requeststatus === 'REVISE') ? <Card><FormTransfer {...this.props} result={resultdata} awardcode={awardcode} /></Card> :
                                            (!category) ? '' : <Form {...formItemLayout}>
                                                <Row gutter={24} style={{ marginBottom: 30 }}>
                                                    <Col className="gutter-row" span={24} offset={2}>
                                                        <Card title={`Redemption ${requesttype === 'CANCEL' ? "Cancel" : ""} Details`} bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }}>
                                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                                                <Row>
                                                                    <Col xs={24} xl={6}><label>Issued By</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(username) ? username : createdBy ? createdBy : '-'}</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs={24} xl={6} ><label>Free Award</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(freeaward || standarfee) ? 'True' : 'False'}</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs={24} xl={6}><label>Issued Date</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(issueddate) ? moment(issueddate).format("DD/MM/YYYY") : (requesttype === 'CANCEL') ? moment(trxdate).format("DD/MM/YYYY") : '-'}</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs={24} xl={6}><label>Total Price</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(totalprice) ? totalprice : (requesttype === 'CANCEL') ? reqdatas.price : '-'}</Col>
                                                                </Row>
                                                                {category === 'hotel' && requesttype !== 'CANCEL' ? <Row>
                                                                    <Col xs={24} xl={6}><label>Check In Date</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{activitydate ? moment(activitydate).format('dddd, DD/MM/YYYY') : reqdatas.redeemuser === undefined ? '' :
                                                                        reqdatas.redeemuser[0].activitydate ? moment(reqdatas.redeemuser[0].activitydate).format('dddd, DD/MM/YYYY') : '-'}</Col></Row> : ''
                                                                }
                                                                {requesttype === 'CANCEL' ? <Row>
                                                                    <Col xs={24} xl={6}><label>Certificate ID</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(reqdatas) ? (reqdatas.certificateid) ? reqdatas.certificateid : '-' : '-'}</Col></Row> : ''
                                                                }
                                                            </Col>
                                                            <Col className="gutter-row" span={12}>
                                                                <Row>
                                                                    <Col xs={24} xl={8}><label>Award Code</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(awardcode) ? awardcode : '-'}</Col>
                                                                </Row>
                                                                {category !== 'freeflight' || category !== 'upgrade' ? <Row>
                                                                    <Col xs={24} xl={8}><label>Card Number</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(cardnumber) ? cardnumber : '-'}</Col></Row> : ''
                                                                }
                                                                {category === 'freeflight' || category === 'upgrade' ? <Row>
                                                                    <Col xs={24} xl={8}><label>Booking Code</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(bookingcode) ? bookingcode : '-'}</Col></Row> : ''
                                                                }
                                                                {category === 'hotel' && requesttype !== 'CANCEL' ? <Row>
                                                                    <Col xs={24} xl={8}><label>Duration</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{quantity ? `${quantity} night` : '-'}</Col> </Row> : ''
                                                                }
                                                                {category === 'hotel' && requesttype !== 'CANCEL' ? <Row>
                                                                    <Col xs={24} xl={8}><label>Check Out Date</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{activitydate ? moment(activitydate).add(quantity, 'days').format('dddd, DD/MM/YYYY') : reqdatas.redeemuser === undefined ? '' :
                                                                        reqdatas.redeemuser[0].activitydate ? moment(reqdatas.redeemuser[0].activitydate).add(quantity, 'days').format('dddd, DD/MM/YYYY') : '-'}</Col> </Row> : ''
                                                                }
                                                                {(requesttype === 'CANCEL' || requesttype === 'UPDATE') ? <Row>
                                                                    <Col xs={24} xl={8}><label>Fee {jsUcfirst(requesttype)}</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(fee) ? fee : reqdatas ? reqdatas.fee ? reqdatas.fee : '-' : '-'}</Col></Row> : ''
                                                                }
                                                                {(requesttype === 'CANCEL') ? <Row>
                                                                    <Col xs={24} xl={8} style={{ color: 'red' }}><strong>Expired Award Miles</strong ></Col>
                                                                    <Col xs={1} xl={2} style={{ color: 'red' }}><strong>:</strong></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }} style={{ color: 'red' }}>{(expiredawardmiles !== undefined || expiredawardmiles !== null) ? <strong>{expiredawardmiles}</strong> : '-'}</Col></Row> : ''
                                                                }
                                                                {category === 'transfer' ? <Row>
                                                                    <Col xs={24} xl={8}><label>Recipient</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(awardinfo) ? `${nameoncard ? jsUcfirst(nameoncard) : `${jsUcfirst(firstname)} ${jsUcfirst(lastname)}`} - ${awardinfo.cardnumber}` : '-'}</Col></Row> : ''
                                                                }
                                                            </Col>
                                                        </Card>
                                                    </Col>
                                                    {(category === 'freeflight' || category === 'upgrade') && requesttype !== 'CANCEL' ? <Col className="gutter-row" span={24} offset={2}>
                                                        {(redeemuser === undefined) ? '' : <PassengerDetails redeemuser={Array.isArray(redeemuser) ? redeemuser[0] : redeemuser} />}
                                                        {(redeemuser === undefined) ? '' : redeemairactivity === undefined ? '' : Object.keys(redeemairactivity).map(function (val, i) {
                                                            return (redeemairactivity[val][0] !== undefined ? <AirActivity category={category} i={i} redeemairactivity={redeemairactivity[val][0]} originAirport={originAirport} destinationAirport={destinationAirport} /> : '')
                                                        })}
                                                    </Col> : ''}

                                                    {requesttype === 'CANCEL' && (category !== 'freeflight' || category !== 'upgrade') ? '' : <Col className="gutter-row" span={24} offset={2}>
                                                        {requeststatus === 'APPROVED' ? ((redeemuser === undefined) ? '' : (requeststatus !== 'APPROVED') ? '' : <CertificateDetails redeemuser={Array.isArray(redeemuser) ? redeemuser[0] : redeemuser} />) :
                                                            <Card title="Certificate Details" bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }}>
                                                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
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
                                                                <Col className="gutter-row" span={12}>
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

                                                    {requesttype === 'CANCEL' && (category === 'hotel' || category === 'freeflight' || category === 'upgrade') ? <Col className="gutter-row" span={24} offset={2}>
                                                        <Card title="Certificate Details" bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }} >
                                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                                                <Row>
                                                                    <Col xs={24} xl={6}><label>Certificate</label></Col>
                                                                    <Col xs={1} xl={2}><label>:</label></Col>
                                                                    <Col xs={23} xl={{ span: 16, pull: 1 }}><Button htmlType="button" label="Show Details" type="primary" onClick={() => this.handleModal(true)} /></Col>
                                                                </Row>
                                                            </Col>
                                                        </Card>
                                                    </Col> : ''}

                                                </Row>
                                            </Form >
                }
            </React.Fragment>
        )
    }
}

export default App;