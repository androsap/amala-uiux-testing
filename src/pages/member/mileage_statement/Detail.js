import React, { Component } from 'react';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { Button } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card } from 'antd';
import { formatNumber } from '../../../utilities/Helpers';
import moment from 'moment';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            dataList: [],
            fieldvalue: {},
        }
    }

    componentDidMount() {
        let { mileagestatementid } = this.props.match.params;
        this.getDetail(mileagestatementid);
    }

    getDetail = (mileagestatementid) => {
        let url = api.url.mileagestatementmember.detail;
        let data = { mileagestatementid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let { mileagestatementid, periodemonth, periodeyear, memberid, memberstatus, salutation, membername, membershipid,
                    tier, emailmember, openingbalance, milesearned, milesredeemed, expirymiles, currentmilesbalance, eligiblemiles,
                    milestoexpiry1, milestoexpiry2, langcode, filename, status, validitycard, extensionmiles } = result || {};

                let dataArr = [];
                let dataObj = {
                    mileagestatementid, periodemonth, periodeyear, memberid, memberstatus, salutation, membername, membershipid,
                    tier, emailmember, openingbalance, milesearned, milesredeemed, expirymiles, currentmilesbalance, eligiblemiles,
                    milestoexpiry1, milestoexpiry2, langcode, filename, status, validitycard, extensionmiles
                };

                dataArr.push(dataObj);
                let dataList = dataArr.map((obj) => { return ({ ...obj }) });

                this.setState({ ...this.state.fieldvalue, fieldvalue: dataObj, dataList, mileagestatementid, isLoading: false })
            } else {
                this.setState({ isLoading: false, responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    render() {
        const { formrender, fieldvalue } = this.state;
        const { periodemonth, memberid, periodeyear, membername, tier, openingbalance, milesearned, milesredeemed, expirymiles,
            currentmilesbalance, eligiblemiles, validitycard, milestoexpiry1, milestoexpiry2, extensionmiles } = fieldvalue;
        var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
            "November", "December"];
        const periode = monthNames[periodemonth] + " " + periodeyear;
        const periode1 = monthNames[periodemonth + 1] + " " + periodeyear;
        const periode2 = monthNames[periodemonth + 2] + " " + periodeyear;

        if (formrender) {
            //title bar on browser
            document.title = "Member Mileage Detail Data | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Col xs={24} sm={24}>
                        <Title level={4}><Button url={'/member/form/' + memberid + '/mileage-statement'} shape="circle" icon="left" /> Member Mileage Detail Data</Title>
                    </Col>
                    <Divider />
                    <Spin spinning={this.state.isLoading}>
                        <Card title="Detail Data" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Periode</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(periode) ? (periode) : '-'}</Col>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Member ID</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(memberid) ? memberid : '-'}</Col>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Member Name</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(membername) ? membername : '-'}</Col>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Membership</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(tier) ? tier : '-'}</Col>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Validity Card</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(validitycard) ? moment(validitycard).format('DD/MM/YYYY') : '-'}</Col>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Summary" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Opening Balance</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(openingbalance) ? formatNumber(openingbalance) : '0'}</Col>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Miles Earned</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(milesearned) ? formatNumber(milesearned) : '0'}</Col>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Miles Redeemed</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(milesredeemed) ? formatNumber(milesredeemed) : '0'}</Col>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Expiry Miles</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(expirymiles) ? formatNumber(expirymiles) : '0'}</Col>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Extended Miles</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(extensionmiles) ? formatNumber(extensionmiles) : '0'}</Col>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Current Miles Balance</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(currentmilesbalance) ? formatNumber(currentmilesbalance) : '0'}</Col>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Eligible Mileage" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Tier Miles</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(eligiblemiles) ? formatNumber(eligiblemiles) : '0'}</Col>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Eligible Flight</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '10px' }}>: {(eligiblemiles) ? formatNumber(eligiblemiles) : '0'}</Col>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Expiry Mileage" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Miles to expiry on {periode1}</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '50px' }}>: {(milestoexpiry1) ? formatNumber(milestoexpiry1) : '0'}</Col>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={7} style={{ marginBottom: '10px' }}><label>Miles to expiry on {periode2}</label></Col>
                                    <Col xs={24} xl={17} style={{ marginBottom: '50px' }}>: {(milestoexpiry2) ? formatNumber(milestoexpiry2) : '0'}</Col>
                                </Col>
                            </Row>
                        </Card>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));