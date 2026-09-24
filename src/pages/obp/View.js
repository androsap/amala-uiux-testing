import React from 'react';
import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { Form, Spin, Col, Row } from 'antd';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.getDetail(this.props.id);
    }

    getDetail = (id) => {
        let url = api.url.obp.list;
        let criteria = { id };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let id = result[0].id ? result[0].id : '-';
                    let receivefeedback = result[0].receivefeedback === null ? '-' : result[0].receivefeedback === false ? false : true;
                    let feedbackdate = result[0].feedbackdate ? result[0].feedbackdate : null;
                    let firstname = result[0].firstname ? result[0].firstname : '-';
                    let lastname = result[0].lastname ? result[0].lastname : '-';
                    let uin = result[0].uin ? result[0].uin : '-';
                    let marketingcarrier = result[0].marketingcarrier ? result[0].marketingcarrier : '-';
                    let marketingfltnum = result[0].marketingfltnum ? result[0].marketingfltnum : '-';
                    let marketingbookingclass = result[0].marketingbookingclass ? result[0].marketingbookingclass : '-';
                    let marketingbookingsubclass = result[0].marketingbookingsubclass ? result[0].marketingbookingsubclass : '-';
                    let operatingcarriercode = result[0].operatingcarriercode ? result[0].operatingcarriercode : '-';
                    let operatingfltnumber = result[0].operatingfltnumber ? result[0].operatingfltnumber : '-';
                    let operatingbookingclass = result[0].operatingbookingclass ? result[0].operatingbookingclass : '-';
                    let operatingbookingsubclass = result[0].operatingbookingsubclass ? result[0].operatingbookingsubclass : '-';
                    let cabinclasscode = result[0].cabinclasscode ? result[0].cabinclasscode : '-';
                    let departuredate = result[0].departuredate ? result[0].departuredate : null;
                    let origin = result[0].origin ? result[0].origin : '-';
                    let destination = result[0].destination ? result[0].destination : '-';
                    let ticketnumber = result[0].ticketnumber ? result[0].ticketnumber : '-';
                    let couponnumber = result[0].couponnumber ? result[0].couponnumber : '-';
                    let flighttypeindicator = result[0].flighttypeindicator ? result[0].flighttypeindicator : '-';
                    let seatnumber = result[0].seatnumber ? result[0].seatnumber : '-';
                    let sequencenumber = result[0].sequencenumber ? result[0].sequencenumber : '-';
                    let pnr = result[0].pnr ? result[0].pnr : '-';
                    let ffpcarriercode = result[0].ffpcarriercode ? result[0].ffpcarriercode : '-';
                    let ffpnumber = result[0].ffpnumber ? result[0].ffpnumber : '-';
                    let postingstatus = result[0].postingstatus ? result[0].postingstatus : '-';
                    let postingdate = result[0].postingdate ? result[0].postingdate : null;
                    let basemiles = result[0].basemiles ? result[0].basemiles : '-';
                    let classofservicebonusmiles = result[0].classofservicebonusmiles ? result[0].classofservicebonusmiles : '-';
                    let elitetierbonusmiles = result[0].elitetierbonusmiles ? result[0].elitetierbonusmiles : '-';
                    let promotionalbonusmiles = result[0].promotionalbonusmiles ? result[0].promotionalbonusmiles : '-';
                    let postingtypeindicator = result[0].postingtypeindicator ? result[0].postingtypeindicator : '-';
                    let receivefileid = result[0].receivefileid ? result[0].receivefileid : '-';
                    let activityid = result[0].activityid ? result[0].activityid : '-';
                    let retro = result[0].retro === null ? '-' : result[0].retro === false ? false : true;
                    let retroclaimid = result[0].retroclaimid ? result[0].retroclaimid : '-';
                    let retrodate = result[0].retrodate ? result[0].retrodate : null;
                    let billed = result[0].billed === null ? '-' : result[0].billed === false ? false : true;
                    let billingfileid = result[0].billingfileid ? result[0].billingfileid : '-';
                    let billingdate = result[0].billingdate ? result[0].billingdate : null;
                    let accrualfileid = result[0].accrualfileid ? result[0].accrualfileid : '-';
                    let accrualfiledate = result[0].accrualfiledate ? result[0].accrualfiledate : null;
                    let createdby = result[0].createdby ? result[0].createdby : '-';

                    this.setState({
                        id, receivefeedback, feedbackdate, firstname, lastname, uin, marketingcarrier, marketingfltnum, marketingbookingclass, marketingbookingsubclass, operatingcarriercode,
                        operatingfltnumber, operatingbookingclass, operatingbookingsubclass, cabinclasscode, departuredate, origin, destination,
                        ticketnumber, couponnumber, flighttypeindicator, seatnumber, sequencenumber, pnr, ffpcarriercode, ffpnumber, postingstatus,
                        postingdate, basemiles, classofservicebonusmiles, elitetierbonusmiles, promotionalbonusmiles, postingtypeindicator,
                        receivefileid, activityid, retro, retroclaimid, retrodate, billed, billingfileid, billingdate, accrualfileid, accrualfiledate, createdby
                    });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { formrender, loading, receivefeedback, feedbackdate, firstname, lastname, uin, marketingcarrier, marketingfltnum, marketingbookingclass, marketingbookingsubclass, operatingcarriercode,
            operatingfltnumber, operatingbookingclass, operatingbookingsubclass, cabinclasscode, departuredate, origin, destination,
            ticketnumber, couponnumber, flighttypeindicator, seatnumber, sequencenumber, pnr, ffpcarriercode, ffpnumber, postingstatus,
            postingdate, basemiles, classofservicebonusmiles, elitetierbonusmiles, promotionalbonusmiles, postingtypeindicator,
            receivefileid, activityid, retro, retroclaimid, retrodate, billed, billingfileid, billingdate, accrualfileid, accrualfiledate, createdby } = this.state;

        if (formrender) {
            return (
                <React.Fragment>
                    <Spin spinning={loading}>
                        <Form onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={12}><label>FFP Carrier Code</label></Col>
                                    <Col xs={24} xl={12}>: {ffpcarriercode}</Col>

                                    <Col xs={24} xl={12}><label>FFP Number</label></Col>
                                    <Col xs={24} xl={12}>: {ffpnumber}</Col>

                                    <Col xs={24} xl={12}><label>First Name</label></Col>
                                    <Col xs={24} xl={12}>: {firstname}</Col>

                                    <Col xs={24} xl={12}><label>Last Name</label></Col>
                                    <Col xs={24} xl={12}>: {lastname}</Col>

                                    <Col xs={24} xl={12}><label>Operating Carrier Code</label></Col>
                                    <Col xs={24} xl={12}>: {operatingcarriercode}</Col>

                                    <Col xs={24} xl={12}><label>Operating Filter Number</label></Col>
                                    <Col xs={24} xl={12}>: {operatingfltnumber}</Col>

                                    <Col xs={24} xl={12}><label>Operating Booking Class</label></Col>
                                    <Col xs={24} xl={12}>: {operatingbookingclass}</Col>

                                    <Col xs={24} xl={12}><label>Operating Booking Subclass</label></Col>
                                    <Col xs={24} xl={12}>: {operatingbookingsubclass}</Col>

                                    <Col xs={24} xl={12}><label>Marketing Carrier</label></Col>
                                    <Col xs={24} xl={12}>: {marketingcarrier}</Col>

                                    <Col xs={24} xl={12}><label>Marketing Filter Number</label></Col>
                                    <Col xs={24} xl={12}>: {marketingfltnum}</Col>

                                    <Col xs={24} xl={12}><label>Marketing Booking Class</label></Col>
                                    <Col xs={24} xl={12}>: {marketingbookingclass}</Col>

                                    <Col xs={24} xl={12}><label>Marketing Booking Subclass</label></Col>
                                    <Col xs={24} xl={12}>: {marketingbookingsubclass}</Col>

                                    <Col xs={24} xl={12}><label>Origin</label></Col>
                                    <Col xs={24} xl={12}>: {origin}</Col>

                                    <Col xs={24} xl={12}><label>Destination</label></Col>
                                    <Col xs={24} xl={12}>: {destination}</Col>

                                    <Col xs={24} xl={12}><label>Departure Date</label></Col>
                                    <Col xs={24} xl={12}>: {departuredate ? moment(departuredate).format("DD/MM/YYYY") : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Ticket Number</label></Col>
                                    <Col xs={24} xl={12}>: {ticketnumber}</Col>

                                    <Col xs={24} xl={12}><label>PNR</label></Col>
                                    <Col xs={24} xl={12}>: {pnr}</Col>

                                    <Col xs={24} xl={12}><label>Cabin Class Code</label></Col>
                                    <Col xs={24} xl={12}>: {cabinclasscode}</Col>

                                    <Col xs={24} xl={12}><label>Coupon Number</label></Col>
                                    <Col xs={24} xl={12}>: {couponnumber}</Col>

                                    <Col xs={24} xl={12}><label>Seat Number</label></Col>
                                    <Col xs={24} xl={12}>: {seatnumber}</Col>

                                    <Col xs={24} xl={12}><label>Sequence Number</label></Col>
                                    <Col xs={24} xl={12}>: {sequencenumber}</Col>

                                    <Col xs={24} xl={12}><label>Flight Type Indicator</label></Col>
                                    <Col xs={24} xl={12}>: {flighttypeindicator}</Col>

                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={12}><label>UIN</label></Col>
                                    <Col xs={24} xl={12}>: {uin}</Col>

                                    <Col xs={24} xl={12}><label>Receive Feedback</label></Col>
                                    <Col xs={24} xl={12}>: {receivefeedback === true ? 'True' : receivefeedback === false ? 'False' : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Feedback Date</label></Col>
                                    <Col xs={24} xl={12}>: {feedbackdate ? moment(feedbackdate).format("DD/MM/YYYY") : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Posting Status</label></Col>
                                    <Col xs={24} xl={12}>: {postingstatus}</Col>

                                    <Col xs={24} xl={12}><label>Posting Date</label></Col>
                                    <Col xs={24} xl={12}>: {postingdate ? moment(postingdate).format("DD/MM/YYYY") : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Base Miles</label></Col>
                                    <Col xs={24} xl={12}>: {basemiles}</Col>

                                    <Col xs={24} xl={12}><label>Class of Service Bonus Miles</label></Col>
                                    <Col xs={24} xl={12}>: {classofservicebonusmiles}</Col>

                                    <Col xs={24} xl={12}><label>Elite Tier Bonus Miles</label></Col>
                                    <Col xs={24} xl={12}>: {elitetierbonusmiles}</Col>

                                    <Col xs={24} xl={12}><label>Promotional Bonus Miles</label></Col>
                                    <Col xs={24} xl={12}>: {promotionalbonusmiles}</Col>

                                    <Col xs={24} xl={12}><label>Posting Type Indicator</label></Col>
                                    <Col xs={24} xl={12}>: {postingtypeindicator}</Col>

                                    <Col xs={24} xl={12}><label>Receive File ID</label></Col>
                                    <Col xs={24} xl={12}>: {receivefileid}</Col>

                                    <Col xs={24} xl={12}><label>Activity ID</label></Col>
                                    <Col xs={24} xl={12}>: {activityid}</Col>

                                    <Col xs={24} xl={12}><label>Retro</label></Col>
                                    <Col xs={24} xl={12}>: {retro === true ? 'True' : retro === false ? 'False' : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Retro Claim ID</label></Col>
                                    <Col xs={24} xl={12}>: {retroclaimid}</Col>

                                    <Col xs={24} xl={12}><label>Retro Date</label></Col>
                                    <Col xs={24} xl={12}>: {retrodate ? moment(retrodate).format("DD/MM/YYYY") : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Billed</label></Col>
                                    <Col xs={24} xl={12}>: {(billed === true) ? 'True' : (billed === false) ? 'False' : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Billing File ID</label></Col>
                                    <Col xs={24} xl={12}>: {billingfileid}</Col>

                                    <Col xs={24} xl={12}><label>Billing Date</label></Col>
                                    <Col xs={24} xl={12}>: {billingdate ? moment(billingdate).format("DD/MM/YYYY") : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Accrual File ID</label></Col>
                                    <Col xs={24} xl={12}>: {accrualfileid}</Col>

                                    <Col xs={24} xl={12}><label>Accrual File Date</label></Col>
                                    <Col xs={24} xl={12}>: {accrualfiledate ? moment(accrualfiledate).format("DD/MM/YYYY") : '-'}</Col>

                                    <Col xs={24} xl={12}><label>Created By</label></Col>
                                    <Col xs={24} xl={12}>: {createdby}</Col>

                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
                            </Row>
                        </Form>
                    </Spin>
                </React.Fragment>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} type="modal" />);
        }
    }
}

export default Form.create()(App);