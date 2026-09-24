import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, OriDesSelect, AirlineSelect, DatePickerBase, ProgramSelect, CheckboxBase, SubclassSelect, SelectBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsAirline = [
    { label: "Garuda Indonesia - GA", value: "GA" }
]

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                uin: null,
                couponnumber: null,
                flighttypeindicator: null,
                seatnumber: null,
                sequencenumber: null,
                channel: null,
                tourcode: null,
                postingdate: null,
                postingstatus: null,
                basemiles: null,
                classofservicebonusmiles: null,
                elitetierbonusmiles: null,
                promotionalbonusmiles: null,
                postingtypeindicator: null,
                receivefileid: null,
                activityid: null,
                retro: this.props.retro,
                retroclaimid: null,
                retrodate: null,
                receivefeedback: this.props.receivefeedback,
                feedbackdate: null,
                billed: null,
                billingfileid: null,
                billingdate: null,
                accrualfiledate: null,
                accrualfileid: null,
                dateofissue: this.props.dateofissue
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                operatingbookingclassfielddisabled: true,
                operatingbookingsubclassfielddisabled: true,
                marketingbookingclassfielddisabled: true,
                marketingbookingsubclassfielddisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        this.props.form.setFieldsValue({ airlinecode: 'GA' });
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let operatingbookingclassfielddisabled = false;
            let operatingbookingsubclassfielddisabled = false;
            let marketingbookingclassfielddisabled = false;
            let marketingbookingsubclassfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                operatingbookingclassfielddisabled = false;
                operatingbookingsubclassfielddisabled = false;
                marketingbookingclassfielddisabled = true;
                marketingbookingsubclassfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled, operatingbookingclassfielddisabled, operatingbookingsubclassfielddisabled, marketingbookingclassfielddisabled, marketingbookingsubclassfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
        this.componentAirlineSelect.retrieveData();
        this.componentOriDesSelect.retrieveData();
        this.componentProgramSelect.retrieveData();
        this.componentSubclassSelect.retrieveData({ airlinecode: 'GA' });
        this.componentSubclassSelect2.retrieveData({ airlinecode: 'GA' });
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (id, actionspage) => {
        let url = api.url.obp.list;
        let criteria = { id };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let ffpnumber = result[0].ffpnumber ? result[0].ffpnumber : null;
                    let firstname = result[0].firstname ? result[0].firstname : null;
                    let lastname = result[0].lastname ? result[0].lastname : null;
                    let ffpcarriercode = result[0].ffpcarriercode ? result[0].ffpcarriercode : null;
                    let airlinecode = result[0].operatingcarriercode ? result[0].operatingcarriercode : null;
                    let subclasscode = result[0].operatingbookingclass ? result[0].operatingbookingclass : null;
                    let operatingbookingclass = result[0].operatingbookingclass ? result[0].operatingbookingclass : null;
                    let operatingbookingsubclass = result[0].operatingbookingsubclass && result[0].cabinclasscode ? `${result[0].operatingbookingsubclass} ${result[0].cabinclasscode}` : null;
                    let operatingfltnumber = result[0].operatingfltnumber ? result[0].operatingfltnumber : null;
                    let marketingcarrier = result[0].marketingcarrier ? result[0].marketingcarrier : null;
                    let marketingbookingclass = result[0].marketingbookingclass ? result[0].marketingbookingclass : null;
                    let marketingbookingsubclass = result[0].marketingbookingsubclass ? result[0].marketingbookingsubclass : null;
                    let marketingfltnum = result[0].marketingfltnum ? result[0].marketingfltnum : null;
                    let origin = result[0].origin ? result[0].origin : null;
                    let destination = result[0].destination ? result[0].destination : null;
                    let departuredate = (result[0].departuredate) ? moment(result[0].departuredate) : undefined;
                    let ticketnumber = result[0].ticketnumber ? result[0].ticketnumber : null;
                    let checkticketnumber = result[0].checkticketnumber ? result[0].checkticketnumber : null;
                    let pnr = result[0].pnr ? result[0].pnr : null;
                    let seatnumber = result[0].seatnumber ? result[0].seatnumber : null;
                    let sequencenumber = result[0].sequencenumber ? result[0].sequencenumber : null;
                    let uin = result[0].uin ? result[0].uin : null;
                    let couponnumber = result[0].couponnumber ? result[0].couponnumber : null;
                    let flighttypeindicator = result[0].flighttypeindicator ? result[0].flighttypeindicator : null;
                    let channel = result[0].channel ? result[0].channel : null;
                    let tourcode = result[0].tourcode ? result[0].tourcode : null;
                    let postingdate = result[0].postingdate ? result[0].postingdate : null;
                    let postingstatus = result[0].postingstatus ? result[0].postingstatus : null;
                    let basemiles = result[0].basemiles ? result[0].basemiles : null;
                    let classofservicebonusmiles = result[0].classofservicebonusmiles ? result[0].classofservicebonusmiles : null;
                    let elitetierbonusmiles = result[0].elitetierbonusmiles ? result[0].elitetierbonusmiles : null;
                    let promotionalbonusmiles = result[0].promotionalbonusmiles ? result[0].promotionalbonusmiles : null;
                    let postingtypeindicator = result[0].postingtypeindicator ? result[0].postingtypeindicator : null;
                    let receivefileid = result[0].receivefileid ? result[0].receivefileid : null;
                    let activityid = result[0].activityid ? result[0].activityid : null;
                    let retro = result[0].retro === null ? null : result[0].retro === false ? false : true;
                    let retroclaimid = result[0].retroclaimid ? result[0].retroclaimid : null;
                    let retrodate = result[0].retrodate ? result[0].retrodate : null;
                    let receivefeedback = result[0].receivefeedback === null ? null : result[0].receivefeedback === false ? false : true;
                    let feedbackdate = result[0].feedbackdate ? result[0].feedbackdate : null;
                    let billed = result[0].billed === null ? null : result[0].billed === false ? false : true;
                    let billingfileid = result[0].billingfileid ? result[0].billingfileid : null;
                    let billingdate = result[0].billingdate ? result[0].billingdate : null;
                    let accrualfiledate = result[0].accrualfiledate ? result[0].accrualfiledate : null;
                    let accrualfileid = result[0].accrualfileid ? result[0].accrualfileid : null;
                    let dateofissue = result[0].dateofissue ? result[0].dateofissue : null;

                    let setValue = {
                        ffpnumber, firstname, lastname, ffpcarriercode, airlinecode, subclasscode, operatingbookingclass, operatingbookingsubclass, operatingfltnumber, marketingcarrier,
                        marketingbookingclass, marketingbookingsubclass, marketingfltnum, origin, destination, departuredate, ticketnumber, checkticketnumber, pnr
                    };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({
                        fieldvalue: {
                            ...this.fieldvalue, uin, couponnumber, flighttypeindicator, seatnumber, sequencenumber,
                            channel, tourcode, postingdate, postingstatus, basemiles, classofservicebonusmiles, elitetierbonusmiles,
                            promotionalbonusmiles, postingtypeindicator, receivefileid, activityid, retro, retroclaimid, retrodate,
                            receivefeedback, feedbackdate, billed, billingfileid, billingdate, accrualfiledate, accrualfileid, dateofissue
                        }
                    });
                    let fielddisabled = { ...this.state.fielddisabled };
                    this.setState({ fielddisabled });

                    this.componentSubclassSelect.retrieveData({ airlinecode }, { subclasscode }, actionspage);
                    this.componentSubclassSelect2.retrieveData({ airlinecode }, { subclasscode }, actionspage);
                    this.componentSubclassSelect3.retrieveData({ airlinecode }, { subclasscode }, actionspage);
                    this.componentSubclassSelect4.retrieveData({ airlinecode }, { subclasscode }, actionspage);

                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let ffpnumber = input.ffpnumber;
                let firstname = input.firstname;
                let lastname = input.lastname;
                let ffpcarriercode = input.ffpcarriercode;
                let operatingcarriercode = input.airlinecode;
                let operatingbookingclass = input.operatingbookingclass;
                let cabinclasscode = input.operatingbookingsubclass.split(' ')[1];
                let operatingbookingsubclass = input.operatingbookingsubclass.split(' ')[0];
                let operatingfltnumber = input.operatingfltnumber;
                let marketingcarrier = input.marketingcarrier;
                let marketingbookingclass = input.marketingbookingclass;
                let marketingbookingsubclass = input.marketingbookingsubclass;
                let marketingfltnum = input.marketingfltnum;
                let origin = input.origin;
                let destination = input.destination;
                let departuredate = moment(input.departuredate).format("YYYY-MM-DD");
                let ticketnumber = input.ticketnumber;
                let checkticketnumber = input.checkticketnumber;
                let pnr = (input.pnr) ? input.pnr : null;
                let uin = this.state.fieldvalue.uin;
                let couponnumber = this.state.fieldvalue.couponnumber;
                let flighttypeindicator = this.state.fieldvalue.flighttypeindicator;
                let seatnumber = this.state.fieldvalue.seatnumber;
                let sequencenumber = this.state.fieldvalue.sequencenumber;
                let channel = this.state.fieldvalue.channel;
                let tourcode = this.state.fieldvalue.tourcode;
                let postingstatus = this.state.fieldvalue.postingstatus;
                let postingdate = this.state.fieldvalue.postingdate;
                let basemiles = this.state.fieldvalue.basemiles;
                let classofservicebonusmiles = this.state.fieldvalue.classofservicebonusmiles;
                let elitetierbonusmiles = this.state.fieldvalue.elitetierbonusmiles;
                let promotionalbonusmiles = this.state.fieldvalue.promotionalbonusmiles;
                let postingtypeindicator = this.state.fieldvalue.postingtypeindicator;
                let receivefileid = this.state.fieldvalue.receivefileid;
                let activityid = this.state.fieldvalue.activityid;
                let retro = this.state.fieldvalue.retro;
                let retroclaimid = this.state.fieldvalue.retroclaimid;
                let retrodate = this.state.fieldvalue.retrodate;
                let receivefeedback = this.state.fieldvalue.receivefeedback;
                let feedbackdate = this.state.fieldvalue.feedbackdate;
                let billed = this.state.fieldvalue.billed;
                let billingfileid = this.state.fieldvalue.billingfileid;
                let billingdate = this.state.fieldvalue.billingdate;
                let accrualfileid = this.state.fieldvalue.accrualfileid;
                let accrualfiledate = this.state.fieldvalue.accrualfiledate;
                let dateofissue = moment(this.state.fieldvalue.dateofissue).format("YYYY-MM-DD");

                let data = {
                    ffpnumber, firstname, lastname, ffpcarriercode, operatingcarriercode, operatingbookingclass, cabinclasscode, operatingbookingsubclass, operatingfltnumber, marketingcarrier,
                    marketingbookingclass, marketingbookingsubclass, marketingfltnum, origin, destination, departuredate, ticketnumber, checkticketnumber, pnr, uin, couponnumber,
                    flighttypeindicator, seatnumber, sequencenumber, channel, tourcode, postingdate, postingstatus, basemiles, classofservicebonusmiles, elitetierbonusmiles,
                    promotionalbonusmiles, postingtypeindicator, receivefileid, activityid, retro, retroclaimid, retrodate, receivefeedback, feedbackdate, billed, billingfileid,
                    billingdate, accrualfiledate, accrualfileid, dateofissue
                };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.obp.create;
                } else {
                    data.id = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.obp.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/obp');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    handleChangeMarketingCode = (airlinecode) => {
        let marketingbookingclass = undefined;
        let marketingbookingsubclass = undefined;
        let marketingbookingclassfielddisabled = (airlinecode) ? false : true;
        let marketingbookingsubclassfielddisabled = (airlinecode) ? false : true;

        this.componentSubclassSelect3.retrieveData({ airlinecode });
        this.componentSubclassSelect4.retrieveData({ airlinecode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, marketingbookingclassfielddisabled, marketingbookingsubclassfielddisabled } });
        this.props.form.setFieldsValue({ marketingbookingclass, marketingbookingsubclass });

        this.setState({ fieldvalue: { ...this.state.fieldvalue, airlinecode } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, operatingbookingclassfielddisabled, operatingbookingsubclassfielddisabled, marketingbookingclassfielddisabled, marketingbookingsubclassfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            document.title = titlepage + " OBP | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} OBP</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="First Name" datafield="firstname" form={this.props.form} maxLength={50} validationrules={['required', 'pattern.letterspace']} disabled={generalfielddisabled} />
                                    <InputText labeltext="Last Name" datafield="lastname" form={this.props.form} maxLength={50} validationrules={['required', 'pattern.letterspace']} disabled={generalfielddisabled} />
                                    <ProgramSelect ref={(e) => { this.componentProgramSelect = e }} form={this.props.form} labeltext="FFP Carrier" placeholder="FFP Carrier" datafield="ffpcarriercode" disabled={generalfielddisabled} custom={true} />
                                    <InputText labeltext="Card Number" datafield="ffpnumber" form={this.props.form} maxLength={9} validationrules={['pattern.number']} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Operating Carrier" datafield="airlinecode" options={optionsAirline} validationrules={['required']} disabled={true} />
                                    <InputText labeltext="Operating Flight Number" datafield="operatingfltnumber" form={this.props.form} validationrules={['required', 'pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Operating Compartment" placeholder="Operating Compartment" datafield="operatingbookingclass" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect2 = e }} form={this.props.form} custom={true} labeltext="Operating Sub Class" placeholder="Operating Sub Class" datafield="operatingbookingsubclass" validationrules={['required']} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Marketing Carrier" placeholder="Marketing Carrier" datafield="marketingcarrier" onChange={this.handleChangeMarketingCode} validationrules={['required']} disabled={generalfielddisabled} custom={true} />
                                    <InputText labeltext="Marketing Flight Number" datafield="marketingfltnum" form={this.props.form} validationrules={['required', 'pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect3 = e }} form={this.props.form} labeltext="Marketing Compartment" placeholder="Marketing Compartment" datafield="marketingbookingclass" validationrules={['required']} disabled={marketingbookingclassfielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect4 = e }} form={this.props.form} labeltext="Marketing Sub Class" placeholder="Marketing Sub Class" datafield="marketingbookingsubclass" validationrules={['required']} disabled={marketingbookingsubclassfielddisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" maxDate={moment().subtract(0, 'day')} validationrules={['required']} disabled={generalfielddisabled} />

                                    <Col xs={16} sm={16} md={16}>
                                        <InputText labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} labeltext="Ticket Number" datafield="ticketnumber" form={this.props.form} validationrules={['required', 'pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                                    </Col>
                                    <Col xs={8} sm={8} md={8}>
                                        <CheckboxBase labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} form={this.props.form} datafield='checkticketnumber' disabled={generalfielddisabled}> Check Ticket Number</CheckboxBase>
                                    </Col>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="PNR" datafield="pnr" form={this.props.form} validationrules={['pattern.alphanumeric']} maxLength={10} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button url="/obp" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));