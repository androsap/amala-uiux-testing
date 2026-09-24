import React from 'react';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Card, Row, Col, Modal, Spin, Typography, Form } from 'antd';
import { Button, ErrorGeneral } from '../../../../components/Base/BaseComponent';
import { formatNumber, jsUcfirst } from '../../../../utilities/Helpers';
import { connect } from "react-redux";

import moment from 'moment';
import AccountExpired from '../AccountExpired';

const { Text, Title } = Typography;
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
            formrender: true,
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
                const trxid = result.trxid;
                const trxdate = result.trxdate;
                const createddate = result.createddate;
                const awardmiles = result.awardmiles;
                const expiredawardmiles = result.expiredawardmiles;
                const fieldvalue = { ...this.state.fieldvalue, trxid, trxdate, createddate, awardmiles, expiredawardmiles };

                this.setState({ fieldvalue, isLoading: false });
            } else {
                this.setState({ isLoading: false, responseCode: status.responsecode, responseMessage: status.responsedesc, formrender: false });
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
        const { roundtrip, departureFlight, returnFligth, certificateid, memberid, typeButton, location, discountamountdepr, discountamountretr, mileageDeparture, mileageReturn, standarfee, fee, totalmileage } = this.props || {};
        const { state } = location;
        const { activitydetails } = state;
        const { flightdeparture, flightreturn } = activitydetails;

        let deprflightnumberbefore = flightdeparture ? flightdeparture.flightnumber : null
        let depractivitydate = flightdeparture ? moment(flightdeparture.activitydate).format("DD/MM/YYYY") : null
        let retrflightnumberbefore = flightreturn ? flightreturn.flightnumber : null
        let retractivitydate = flightreturn ? moment(flightreturn.activitydate).format("DD/MM/YYYY") : null

        const { fieldvalue, showAccount, formrender } = this.state;
        const { awardmiles, expiredawardmiles } = fieldvalue;
        const isLoading = (this.props.isLoading || this.state.isLoading) ? true : false;
        const activityDateDepart = (departureFlight && departureFlight.flightdate) ? moment(departureFlight.flightdate).format("DD/MM/YYYY") : '-';
        const airlineCodeDepart = (departureFlight && departureFlight.airlinecode) ? departureFlight.airlinecode : '-';
        const flightNumberDepart = (departureFlight && departureFlight.flightnumber) ? departureFlight.flightnumber : '-';
        const originDepart = (departureFlight && departureFlight.origin) ? departureFlight.origin : '-';
        const destinationDepart = (departureFlight && departureFlight.destination) ? departureFlight.destination : '-';
        const compartmentDepart = (departureFlight && departureFlight.compartmentcode) ? departureFlight.compartmentcode : '-';
        const bookingClassDepart = (departureFlight && departureFlight.bookingclasscode) ? departureFlight.bookingclasscode : '-';

        const activityDateReturn = (returnFligth && returnFligth.flightdate) ? moment(returnFligth.flightdate).format("DD/MM/YYYY") : '-';
        const airlineCodeReturn = (returnFligth && returnFligth.airlinecode) ? returnFligth.airlinecode : '-';
        const flightNumberReturn = (returnFligth && returnFligth.flightnumber) ? returnFligth.flightnumber : '-';
        const originReturn = (returnFligth && returnFligth.origin) ? returnFligth.origin : '-';
        const destinationReturn = (returnFligth && returnFligth.destination) ? returnFligth.destination : '-';
        const compartmentReturn = (returnFligth && returnFligth.compartmentcode) ? returnFligth.compartmentcode : '-';
        const bookingClassReturn = (returnFligth && returnFligth.bookingclasscode) ? returnFligth.bookingclasscode : '-';

        const feeinfo = (standarfee) ? (roundtrip) ? '(Calculated from Certificate Price)' : (flightdeparture) ? '(Calculated from Departure Price)' : '(Calculated from Return Price)' : null;

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
                    <AccountExpired confirmtype="UPDATE" memberid={memberid} certificateid={certificateid} handleCloseModal={this.handleCloseModal} onChangeScheduleAction={this.props.onSubmit} showNewCertificate={this.props.handleShowNewCertificate} />
                </Modal>
                <Modal
                    title={`Confirmation - ${typeButton === 'UPDATE' ? '' : jsUcfirst(typeButton)} Update Certificate`}
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.props.handleClose}
                    footer={null} destroyOnClose={true}
                    width={920}
                >
                    {
                        (formrender) ?
                            <Spin spinning={isLoading}>
                                <Card title="Previous Change Schedule Information" bordered={false} style={{ marginBottom: 20 }} className="card-shadow">
                                    <Row className="pricelist-flight-header">
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Flight </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Activity Date </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Airline / Flight Number </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Origin - Destination </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Compartment /<br />Booking Class </Col>
                                    </Row>
                                    <Row className="pricelist-flight">
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Departure </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {depractivitydate} </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {airlineCodeDepart} / {deprflightnumberbefore} </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {originDepart} - {destinationDepart} </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {compartmentDepart} / {bookingClassDepart} </Col>
                                    </Row>
                                    {
                                        (roundtrip) ?
                                            <Row className="pricelist-flight">
                                                <Col xs={24} sm={24} md={24} lg={4} xl={4}> Return </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {retractivitydate} </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {airlineCodeReturn} / {retrflightnumberbefore} </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {originReturn} - {destinationReturn} </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {compartmentReturn} / {bookingClassReturn} </Col>
                                            </Row> : null
                                    }
                                </Card>

                                <Card title="Previous Miles Information" bordered={false} style={{ marginBottom: 20 }} className="card-shadow">
                                    <Row gutter={24}>
                                        {(standarfee) ? null : <Col className="gutter-row" span={12} style={{ color: 'red' }}>
                                            <Col xs={24} xl={12}><strong>Expired Award Miles</strong></Col>
                                            <Col xs={24} xl={12}>: <strong>{(expiredawardmiles !== null) ? expiredawardmiles : '-'}</strong></Col>
                                        </Col>}
                                        <Col className="gutter-row" span={12}>
                                            <Col xs={24} xl={12}><label>Award Price Before</label></Col>
                                            <Col xs={24} xl={12}>: {(awardmiles !== null) ? formatNumber(awardmiles) : '-'} Miles</Col>
                                        </Col>
                                    </Row>
                                </Card>

                                <Card title="New Change Schedule Information" bordered={false} style={{ marginBottom: 20 }} className="card-shadow">
                                    <Row className="pricelist-flight-header">
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Flight </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Activity Date </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Airline / Flight Number </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Origin - Destination </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> Compartment /<br />Booking Class </Col>
                                    </Row>
                                    <Row className="pricelist-flight" >
                                        <Col xs={24} sm={24} md={24} lg={4} xl={4}> Departure </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5} style={{ fontWeight: (activityDateDepart === depractivitydate) ? '' : 'bold' }}>
                                            {activityDateDepart}
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5} style={{ fontWeight: ((airlineCodeDepart !== airlineCodeDepart) || (flightNumberDepart !== deprflightnumberbefore)) ? 'bold' : '' }}>
                                            {airlineCodeDepart} / {flightNumberDepart}
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {originDepart} - {destinationDepart} </Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}> {compartmentDepart} / {bookingClassDepart} </Col>
                                    </Row>
                                    {
                                        (roundtrip) ?
                                            <Row className="pricelist-flight">
                                                <Col xs={24} sm={24} md={24} lg={4} xl={4}> Return </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5} style={{ fontWeight: (activityDateReturn === retractivitydate) ? '' : 'bold' }}>
                                                    {activityDateReturn}
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5} style={{ fontWeight: ((airlineCodeReturn !== airlineCodeReturn) || (flightNumberReturn !== retrflightnumberbefore)) ? 'bold' : '' }}>
                                                    {airlineCodeReturn} / {flightNumberReturn}
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {originReturn} - {destinationReturn} </Col>
                                                <Col xs={24} sm={24} md={24} lg={5} xl={5}> {compartmentReturn} / {bookingClassReturn} </Col>
                                            </Row> : null
                                    }
                                </Card>
                                <Card title="New Miles Information" bordered={false} style={{ marginBottom: 20 }} className="card-shadow">
                                    <Row gutter={24}>
                                        <Col className="gutter-row" span={12}>
                                            <Col xs={24} xl={12}><label>Award Price After</label></Col>
                                            <Col xs={24} xl={12}>: {(awardmiles !== null) ? `- ${formatNumber((totalmileage) ? totalmileage : 0)}` : '-'} Miles</Col>
                                        </Col>
                                    </Row>
                                </Card>
                                {(standarfee) ? <Card title="Change Schedule Fee" bordered={false} className="card-shadow" style={{ marginBottom: 20 }}>
                                    <Row gutter={24}>
                                        <Col xs={24} xl={10}>
                                            <Row gutter={24} type="flex" justify="end"><label>Fee :&nbsp;</label></Row>
                                        </Col>
                                        <Col xs={24} xl={14}>
                                            <Row gutter={24} type="flex" justify="start"><h2 style={{ marginTop: '-8px' }}>{fee}</h2>&nbsp; {feeinfo}</Row>
                                        </Col>
                                    </Row>
                                </Card> : null}
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                    <Button htmlType="button" type="primary" label={`Yes, ${typeButton === 'UPDATE' ? '' : jsUcfirst(typeButton)} Change Schedule`} onClick={this.props.onSubmit} />
                                    <Button htmlType="button" type="default" label="Back" onClick={this.props.handleClose} />
                                </Row>
                            </Spin>
                            : <ErrorGeneral {...this.props} message={this.state.responseMessage} />
                    }
                </Modal>
            </React.Fragment>
        )
    }
}

// export default App;
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);