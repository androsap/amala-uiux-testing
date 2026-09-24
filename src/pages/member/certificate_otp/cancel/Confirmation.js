import React from 'react';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Card, Row, Col, Modal, Spin, Form } from 'antd';
import { Button } from '../../../../components/Base/BaseComponent';
import { formatNumber, jsUcfirst } from '../../../../utilities/Helpers';
import moment from 'moment';
import AccountExpired from '../AccountExpired';
import { connect } from "react-redux";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fieldvalue: {
                isExpired: false,
                trxid: null,
                trxdate: false,
                createddate: null,
                awardmiles: null,
                expiredawardmiles: null,
            },
            showAccount: false
        }
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        let url = api.url.membertransaction.detail;
        let certificateid = (this.props.certificateid) ? this.props.certificateid : null;
        let data = { certificateid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let number = 0;
                const dataList = result.trxdetail.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                const accountdetailsidexpired = dataList.filter(val => val.isexpired === true || moment(val.expireddate).format("YYYY/MM/DD") < moment().format("YYYY/MM/DD")).length;

                const trxid = result.trxid;
                const trxdate = result.trxdate;
                const createddate = result.createddate;
                const awardmiles = result.awardmiles;
                const expiredawardmiles = result.expiredawardmiles;
                const fieldvalue = { ...this.state.fieldvalue, trxid, trxdate, createddate, awardmiles, expiredawardmiles, accountdetailsidexpired };

                this.setState({ fieldvalue, isLoading: false });
            } else {
                this.setState({ isLoading: false, responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    handleShowAccount = () => {
        this.setState({ showAccount: true });
    }

    handleCloseModal = () => {
        this.setState({ showAccount: false }, this.getList());
    }

    render() {
        const { certificateid, confirmationtype, memberid, awardcategory, certificatedetails, typeButton } = this.props;
        const { fieldvalue, showAccount } = this.state;
        const { awardmiles, expiredawardmiles, accountdetailsidexpired } = fieldvalue;
        const isLoading = (this.props.isLoading || this.state.isLoading) ? true : false;

        return (
            <React.Fragment>
                <Modal
                    title="Member Account Detail - Expired"
                    visible={showAccount}
                    onOk={this.handleCloseModal}
                    onCancel={this.handleCloseModal}
                    footer={null} destroyOnClose={true}
                    width={920}
                >
                    <AccountExpired confirmtype="CANCEL" memberid={memberid} certificateid={certificateid} onCancellationAction={this.props.onSubmit} handleCloseModal={this.handleCloseModal} showNewCertificate={this.props.handleShowNewCertificate} />
                </Modal>
                <Modal
                    title={"Confirmation - " + this.props.title}
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.props.handleClose}
                    footer={null} destroyOnClose={true}
                    width={920}
                >
                    <Spin spinning={isLoading}>
                        {
                            (awardcategory === 'AIR') ?
                                <AirInformation {...this.props} confirmationtype={confirmationtype} /> :
                                (awardcategory === 'NONAIR') ? <NonAirinformation certificatedetails={certificatedetails} /> : null
                        }
                        <Card title="Miles Information" bordered={false} style={{ marginBottom: 20 }} extra={(accountdetailsidexpired) ? <a onClick={this.handleShowAccount}>View Expired Account</a> : null} className="card-shadow">
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12} style={{ color: 'red' }}>
                                    <Col xs={24} xl={12}><strong>Expired Award Miles</strong></Col>
                                    <Col xs={24} xl={12}>: <strong>{(expiredawardmiles !== null) ? expiredawardmiles : '-'}</strong></Col>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={12}><label>Award Price</label></Col>
                                    <Col xs={24} xl={12}>: {(awardmiles !== null) ? formatNumber(awardmiles) : '-'} Miles</Col>
                                </Col>
                            </Row>
                        </Card>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                            <Button htmlType="button" type='danger' label={`Yes, ${(typeButton === 'REQUEST') ? `${jsUcfirst(typeButton)} Cancel` : 'Cancel'} Certificate`} onClick={() => this.props.onSubmit(expiredawardmiles)} />
                            <Button htmlType="button" type="default" label="Back" onClick={this.props.handleClose} />
                        </Row>
                    </Spin>
                </Modal>
            </React.Fragment>
        )
    }
}

class NonAirinformation extends React.Component {
    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
            labelAlign: 'left',
            colon: false
        };

        const { certificatedetails } = this.props;
        let { certificateid, awardcode, awardtype, bookingcode, freeaward, totalprice, status, issueddate, ticketofficeuser } = certificatedetails;

        certificateid = (certificateid) ? certificateid : '-';
        awardcode = (awardcode) ? awardcode : '-';
        awardtype = (awardtype) ? awardtype : '-';
        bookingcode = (bookingcode) ? bookingcode : '-';
        freeaward = (freeaward) ? 'YES' : 'NO';
        totalprice = (totalprice) ? totalprice : '-';
        status = (status) ? jsUcfirst(status, "_") : '-';
        issueddate = (issueddate) ? issueddate : '-';
        ticketofficeuser = (ticketofficeuser) ? ticketofficeuser : '-';

        return (
            <React.Fragment>
                <Form {...formItemLayout}>
                    <Card title="Information Cancelled" bordered={false} style={{ marginBottom: 10 }} className="card-shadow">
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                <Form.Item label="Cerfiticate ID" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{certificateid}</span>
                                </Form.Item>
                                <Form.Item label="Award Code" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{awardcode}</span>
                                </Form.Item>
                                <Form.Item label="Award Type" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{awardtype}</span>
                                </Form.Item>
                                <Form.Item label="Issued By" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{ticketofficeuser}</span>
                                </Form.Item>
                                <Form.Item label="issued Date" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{issueddate}</span>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                <Form.Item label="Booking Code" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{bookingcode}</span>
                                </Form.Item>
                                <Form.Item label="Free Award" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{freeaward}</span>
                                </Form.Item>
                                <Form.Item label="Price" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{totalprice}</span>
                                </Form.Item>
                                <Form.Item label="Status" style={{ margin: 0 }}>
                                    : <span className="ant-form-text">{status}</span>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </React.Fragment>
        )
    }
}


class AirInformation extends React.Component {
    render() {
        const { departureFlight, returnFligth } = this.props;

        const activityDateDepart = (departureFlight && departureFlight.flightdate) ? moment(departureFlight.flightdate).format("DD/MM/YYYY") : '-';
        const airlineCodeDepart = (departureFlight && departureFlight.airlinecode) ? departureFlight.airlinecode : '-';
        const flightNumberDepart = (departureFlight && departureFlight.flightnumber) ? departureFlight.flightnumber : '-';
        const originDepart = (departureFlight && departureFlight.origin) ? departureFlight.origin : '-';
        const destinationDepart = (departureFlight && departureFlight.destination) ? departureFlight.destination : '-';
        const compartmentDepart = (departureFlight && departureFlight.compartmentcode) ? departureFlight.compartmentcode : '-';
        const bookingClassDepart = (departureFlight && departureFlight.bookingclasscode) ? departureFlight.bookingclasscode : '-';
        const iscancelledDepart = (departureFlight && departureFlight.iscancelled) ? departureFlight.iscancelled : null;

        const activityDateReturn = (returnFligth && returnFligth.flightdate) ? moment(returnFligth.flightdate).format("DD/MM/YYYY") : '-';
        const airlineCodeReturn = (returnFligth && returnFligth.airlinecode) ? returnFligth.airlinecode : '-';
        const flightNumberReturn = (returnFligth && returnFligth.flightnumber) ? returnFligth.flightnumber : '-';
        const originReturn = (returnFligth && returnFligth.origin) ? returnFligth.origin : '-';
        const destinationReturn = (returnFligth && returnFligth.destination) ? returnFligth.destination : '-';
        const compartmentReturn = (returnFligth && returnFligth.compartmentcode) ? returnFligth.compartmentcode : '-';
        const bookingClassReturn = (returnFligth && returnFligth.bookingclasscode) ? returnFligth.bookingclasscode : '-';
        const iscancelledReturn = (returnFligth && returnFligth.iscancelled) ? returnFligth.iscancelled : null;

        return (
            <React.Fragment>
                <Card title="Schedule Information Cancelled" bordered={false} style={{ marginBottom: 10 }} className="card-shadow">
                    <Row className="pricelist-flight-header">
                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Flight </Col>
                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Activity Date </Col>
                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Airline / Flight Number </Col>
                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Origin - Destination </Col>
                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Compartment /<br />Booking Class </Col>
                    </Row>
                    {
                        (iscancelledDepart) ?
                            <Row className="pricelist-flight">
                                <Col xs={24} sm={24} md={24} lg={4} xl={4}> Departure </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {activityDateDepart} </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {airlineCodeDepart} / {flightNumberDepart} </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {originDepart} - {destinationDepart} </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {compartmentDepart} / {bookingClassDepart} </Col>
                            </Row> : null
                    }
                    {
                        (iscancelledReturn) ?
                            <Row className="pricelist-flight">
                                <Col xs={24} sm={24} md={24} lg={4} xl={4}> Return </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {activityDateReturn} </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {airlineCodeReturn} / {flightNumberReturn} </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {originReturn} - {destinationReturn} </Col>
                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {compartmentReturn} / {bookingClassReturn} </Col>
                            </Row> : null
                    }
                </Card>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);