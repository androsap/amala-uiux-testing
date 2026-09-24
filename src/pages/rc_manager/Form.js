import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { InputText, Button, Alert, AirlineSelect, DatePickerBase, OriDesSelect, CompartmentSelect, SubclassSelect, TextArea, } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal, Alert as AlertAntd } from 'antd';
import { jsUcfirst } from '../../utilities/Helpers';
import RequestHistory from './RequestHistory';
import ErrorGeneral from '../error/ErrorGeneral';
import CodeShare from './CodeShare';
import moment from 'moment';

const titlealliance = {
    "GA": "INTERNALGA",
    "SKYTEAM": "SKYTEAM",
    "STARALLIANCE": "STARALLIANCE",
    "ONEWORLD": "ONEWORLD"
};
const { Title } = Typography;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            ticketNameFocused: false,
            titlepage: 'Retro Claim',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            showRequestHistory: false,
            routetype: null,
            visible: false,
            operatingairline: null,
            operatingfltnumber: null,
            data: {},
            fieldvalue: {
                codeShare: {},
                eligibilitydenialcode: null,
                eligibilitydenialcodeinfo: null,
                retroclaimid: null,
                reqinfo: null,
                createdby: null,
                createddate: null,
                updatedby: null,
                updateddate: null,
                channel: null,
                retrofrom: null,
                tickoffid: null,
                approvalby: null,
                seatnumber: null,
                fltnumber: null,
                airlinecode: null,
                alliancetype: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                compartmentcodefielddisabled: true,
                subclasscodefielddisabled: true,
                approvalreasondisabled: true,
                routetypefielddisabled: true
            }
        }
    };

    checkPermission() {
        let id = this.props.match.params.ID;
        let retrofrom = this.props.retrofrom;
        let formtype = this.props.formtype;
        let alliancetype = (titlealliance[this.props.retrofrom]) ? titlealliance[this.props.retrofrom] : this.props.retrofrom;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let compartmentcodefielddisabled = false;
            let subclasscodefielddisabled = false;
            let approvalreasondisabled = (formtype) ? false : true;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || formtype !== 'approval') {
                titlepage = 'Retro Claim';
                actionspage = 'view';
                generalfielddisabled = true;
                compartmentcodefielddisabled = true;
                subclasscodefielddisabled = true;
            }
            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled, approvalreasondisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, retrofrom, actionspage)
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                if (retrofrom !== "ONEWORLD") this.componentAirlineSelect.retrieveData({ alliancetype });
                this.componentOriDesSelect.retrieveData();
            }
        }

        if (retrofrom === "ONEWORLD") this.componentAirlineSelect.retrieveData();
        if (retrofrom === "ONEWORLD") this.componentMarAirlineSelect.retrieveData();
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = (retroclaimid, retrofrom, actionspage) => {
        let url = api.url.retroclaim.list;
        let criteria = { retroclaimid, retrofrom };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let retroclaimid = (result[0].retroclaimid) ? result[0].retroclaimid : null;
                    let alliancetype = (result[0].alliancetype) ? result[0].alliancetype : null;
                    let cardnumber = (result[0].cardnumber) ? result[0].cardnumber : undefined;
                    let ticketname = (result[0].ticketname) ? result[0].ticketname : undefined;
                    let airlinecode = (result[0].operatingairline) ? result[0].operatingairline : undefined;
                    let airlinename = (result[0].operatingairlinename) ? result[0].operatingairlinename : null;
                    let ticketnumber = (result[0].ticketnumber) ? result[0].ticketnumber : undefined;
                    let fltnumber = (result[0].operatingfltnumber) ? result[0].operatingfltnumber : undefined;
                    let departuredate = (result[0].departuredate) ? moment(result[0].departuredate) : undefined;
                    let origin = (result[0].origin) ? result[0].origin : undefined;
                    let destination = (result[0].destination) ? result[0].destination : undefined;
                    let retrofrom = (result[0].retrofrom) ? result[0].retrofrom : null;
                    let compartmentcode = (retrofrom !== "ONEWORLD") && (result[0].operatingbookingclass) ? result[0].operatingbookingclass : (retrofrom === "ONEWORLD") && (result[0].marketingbookingclass) ? result[0].marketingbookingclass : undefined;
                    let subclasscode = (retrofrom !== "ONEWORLD") && result[0].operatingbookingsubclass ? result[0].operatingbookingsubclass : (retrofrom === "ONEWORLD") && (result[0].marketingbookingsubclass) ? result[0].marketingbookingsubclass : undefined;
                    let approvalreason = (result[0].approvalreason) ? result[0].approvalreason : undefined;
                    let eligibilitydenialcode = (result[0].eligibilitydenialcode) ? result[0].eligibilitydenialcode : null;
                    let eligibilitydenialcodeinfo = (result[0].eligibilitydenialcodeinfo) ? result[0].eligibilitydenialcodeinfo : null;
                    let reqinfo = (result[0].reqinfo) ? result[0].reqinfo : null;
                    let createdby = (result[0].createdby) ? result[0].createdby : null;
                    let createddate = (result[0].createddate) ? moment(result[0].createddate).format('DD/MM/YYYY') : null;
                    let updatedby = (result[0].updatedby) ? result[0].updatedby : null;
                    let updateddate = (result[0].updateddate) ? moment(result[0].updateddate).format('DD/MM/YYYY') : null;
                    let channel = (result[0].channel) ? result[0].channel : null;
                    let tickoffid = (result[0].tickoffid) ? result[0].tickoffid : null;
                    let approvalby = (result[0].approvalby) ? result[0].approvalby : null;
                    let seatnumber = (result[0].seatnumber) ? result[0].seatnumber : null;
                    let marketingairline = (result[0].marketingairline) ? result[0].marketingairline : null;
                    let marketingfltnumber = (result[0].marketingfltnumber) ? result[0].marketingfltnumber : null;
                    let marketingbookingclass = (result[0].marketingbookingclass) ? result[0].marketingbookingclass : null;
                    let marketingbookingsubclass = (result[0].marketingbookingsubclass) ? result[0].marketingbookingsubclass : null;

                    let fieldvalue = { ...this.state.fieldvalue, retroclaimid, alliancetype, reqinfo, createdby, createddate, updatedby, updateddate, channel, retrofrom, tickoffid, approvalby, eligibilitydenialcode, eligibilitydenialcodeinfo };
                    this.setState({ fieldvalue });

                    let setValue = {
                        cardnumber, ticketname, airlinecode, ticketnumber, departuredate, origin, destination, fltnumber, compartmentcode, subclasscode, approvalreason,
                        seatnumber, eligibilitydenialcode, eligibilitydenialcodeinfo, marketingairline, marketingfltnumber, marketingbookingclass, marketingbookingsubclass
                    };
                    this.props.form.setFieldsValue(setValue);

                    /* Jika Manual Verification */
                    let formtype = this.props.formtype;
                    let compartmentcodefielddisabled = ((reqinfo === 'RETRO_REQUEST_CREATED' || reqinfo === 'WAITING_FOR_MANUAL_VERIFICATION') && formtype) ? false : true;
                    let subclasscodefielddisabled = ((reqinfo === 'RETRO_REQUEST_CREATED' || reqinfo === 'WAITING_FOR_MANUAL_VERIFICATION') && formtype) ? false : true;
                    let fielddisabled = { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled };
                    this.setState({ fielddisabled, destination, airlinecode });

                    this.componentAirlineSelect.retrieveData({}, { airlinecode, airlinename }, actionspage);
                    this.componentCompartmentSelect.retrieveData({ airlinecode }, { compartmentcode }, actionspage);
                    this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode }, { subclasscode }, actionspage);
                    setTimeout(() => {
                        this.handleChangeOriDes(origin, 'origin')
                    }, 500);
                } else this.setState({ responseMessage: 'Data not found', formrender: false });
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            this.setState({ isLoading: false });
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let state = this.props.location;
                let retrofrom = this.props.retrofrom;
                let requestdate = moment(new Date()).format("YYYY-MM-DD");
                let ffpcarriercode = "GA";
                let cardnumber = input.cardnumber;
                let ticketname = input.ticketname.toUpperCase().replace(/\s*\/\s*/g, '/');
                let splitticketname = ticketname.split("/");
                let paxfirstname = (splitticketname[1]) ? splitticketname[1].trim() : null;
                let paxlastname = (splitticketname[0]) ? splitticketname[0].trim() : null;
                let operatingairline = (state === undefined) ? input.marketingairline : input.airlinecode;
                let alliancetype = (retrofrom === "ONEWORLD") ? 'ONEWORLD' : this.componentAirlineSelect.getValue(operatingairline, 'alliancetype');
                let compartmentcode = (input.compartmentcode) ? input.compartmentcode : null;
                let cabinclasscode = (input.compartmentcode) ? input.compartmentcode : null;
                let operatingfltnumber = (state === undefined) ? input.marketingfltnumber : input.fltnumber;
                let departuredate = moment(input.departuredate).format("YYYY-MM-DD");
                let subclasscode = (input.subclasscode) ? input.subclasscode : null;
                let origin = input.origin;
                let destination = input.destination;
                let ticketnumber = input.ticketnumber;
                let seatnumber = (input.seatnumber) ? input.seatnumber : null;
                let routetype = input.routetype;
                let sequencenumber = null;
                let pnr = null;
                let channel = "BO";

                let url = '';
                let data = {
                    requestdate, retrofrom, ffpcarriercode, cardnumber, ticketname, paxfirstname, paxlastname, operatingairline, operatingfltnumber, departuredate,
                    origin, destination, compartmentcode, cabinclasscode, subclasscode, ticketnumber, seatnumber, routetype, sequencenumber, pnr, channel, alliancetype
                };

                if (alliancetype === 'INTERNALGA') {
                    url = api.url.retroclaim.retroclaimga;
                } else if (alliancetype === 'INTERNALQG') {
                    url = api.url.retroclaim.retroclaimqg;
                } else if (alliancetype === 'INTERNALSJ') {
                    url = api.url.retroclaim.retroclaimsj;
                } else if (alliancetype === 'SKYTEAM') {
                    url = api.url.retroclaim.retroclaimskyteam;
                } else if (alliancetype === 'STARALLIANCE') {
                    url = api.url.retroclaim.retroclaimstar;
                } else if (alliancetype === 'ONEWORLD') {
                    url = api.url.retroclaim.retroclaimoneworld;
                    data.marketingairline = input.marketingairline;
                    data.marketingfltnumber = input.marketingfltnumber;
                }

                let message = 'New data has been created';

                this.setState({ operatingairline, operatingfltnumber, data })

                SaveRequest(url, data).then((response) => {
                    const { result, status } = response;
                    const { codeshareinfo } = result || {};
                    const { responsecode, responsemessage } = status;
                    const { fltnumber, airlinecode, alliancetype } = codeshareinfo || {};
                    if (responsecode === '0000') {
                        RetrieveRequest(api.url.retroclaim.list, { retroclaimid: response.result.retroclaimid }).then((response) => {
                            const { status, result } = response;
                            const { eligibilitydenialcode, retroclaimid } = result[0] || {};
                            if (status.responsecode === '0000') {
                                if (eligibilitydenialcode === '888' || eligibilitydenialcode === '777') {
                                    this.setState({
                                        fieldvalue: {
                                            ...this.state.fieldvalue, retroclaimid, eligibilitydenialcode, fltnumber, airlinecode, alliancetype,
                                            codeShare: { eligibilitydenialcode, fltnumber, airlinecode, alliancetype }
                                        }, visible: true,
                                    })
                                } else {
                                    message = (responsemessage) ? responsemessage : message;
                                    Alert.success(message);
                                    this.props.history.push('/retro-claim-' + retrofrom.toLowerCase() + '-manager');
                                }
                            }
                        })
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    approvalAction = (e, type) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                let retroclaimid = this.props.match.params.ID;
                let operatingbookingclass = input.compartmentcode;
                let operatingbookingsubclass = input.subclasscode;
                let approvalreason = input.approvalreason;

                let reqinfo = '';
                let message = '';
                if (type === 'approve') {
                    reqinfo = 'OVERRIDE_APPROVED_BY_USER';
                    message = 'Data has been approved';
                } else if (type === 'reject') {
                    reqinfo = 'OVERRIDE_REJECTED_BY_USER';
                    message = 'Data has been rejected';
                } else if (type === 'verify') {
                    reqinfo = 'WAITING_FOR_MANUAL_VERIFICATION';
                    message = 'Data has been verified';
                }
                let url = api.url.retroclaim.updatereqinfo;
                let data = { retroclaimid, reqinfo, operatingbookingclass, operatingbookingsubclass, approvalreason };

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push(`/${this.props.match.url.split('/')[1]}`);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeDurationType = (event) => {
        let durationtype = event === null ? null : event.target.value;

        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, durationtype } });
    };

    handleFocusTicketName = () => {
        this.setState({ ticketNameFocused: true });
    };

    handleBlurTicketName = () => {
        this.setState({ ticketNameFocused: false });
    };

    handleValidationTicketName = (rule, value, callback) => {
        if (value && /^\s|\s$/.test(value)) {
            callback('Name cannot contain spaces');
        } else if (value && /\s\/|\/\s/.test(value)) {
            callback('Name cannot contain spaces before or after "/"');
        } else if (value && value.split("/").length > 2) {
            callback('Only for last name and firstname');
        } else if (value && value.split("/").length < 2) {
            callback('Must consist of firstname and lastname');
        }
        callback();
    };

    handleChangeAirlineCode = (airlinecode) => {
        let compartmentcode = undefined;
        let subclasscode = undefined;
        let compartmentcodefielddisabled = (airlinecode) ? false : true;
        let subclasscodefielddisabled = true;
        let pricecalc = undefined;

        this.componentCompartmentSelect.retrieveData({ airlinecode });
        this.setState({ airlinecode, fielddisabled: { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ compartmentcode, subclasscode, pricecalc });

        this.setState({ fieldvalue: { ...this.state.fieldvalue, airlinecode, pricecalc } });

        const { origin, destination } = this.state
        let retrofrom = this.props.retrofrom;
        if (retrofrom === 'STARALLIANCE' && origin !== undefined && destination !== undefined) {
            RetrieveRequest(api.url.accrualruleod.list, { originairport: origin, destinationairport: destination, airlinecode }, {}, [], {}).then((response) => {
                const { status = {}, result } = response
                if (status.responsecode === '0000' && !(Array.isArray(result) && !result.length)) {
                    this.props.form.setFieldsValue({ routetype: result[0].routetype })
                } else {
                    Alert.error(status.responsecode !== '0000' ? status.responsemessage : 'No route type found, please choose another origin destination');
                    this.props.form.setFieldsValue({ routetype: '' })
                }
            });
        }
    };

    handleChangeCompartment = (compartmentcode) => {
        let airlinecode = this.props.form.getFieldValue('airlinecode');
        let subclasscode = undefined;
        let subclasscodefielddisabled = (compartmentcode) ? false : true;
        this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ subclasscode });
    };

    handleShowRequestHistory = () => {
        this.setState({ showRequestHistory: true });
    };

    handleCancel = () => {
        this.setState({ showRequestHistory: false, visible: false });
    };

    handleChangeOriDes = (value, type) => {
        this.setState({ [type]: value })
        const { origin, destination, airlinecode } = this.state || value
        let retrofrom = this.props.retrofrom;
        if (retrofrom === 'STARALLIANCE' && type === 'origin' && destination !== undefined && airlinecode !== undefined) {
            RetrieveRequest(api.url.accrualruleod.list, { originairport: value, destinationairport: destination, airlinecode }, {}, [], {}).then((response) => {
                const { status = {}, result } = response
                if (status.responsecode === '0000' && !(Array.isArray(result) && !result.length)) {
                    this.props.form.setFieldsValue({ routetype: result[0].routetype })
                } else {
                    Alert.error(status.responsecode !== '0000' ? status.responsemessage : 'No route type found, please choose another origin destination');
                    this.props.form.setFieldsValue({ routetype: '' })
                }
            });
        } else if (retrofrom === 'STARALLIANCE' && type === 'destination' && origin !== undefined && airlinecode !== undefined) {
            RetrieveRequest(api.url.accrualruleod.list, { originairport: origin, destinationairport: value, airlinecode }, {}, [], {}).then((response) => {
                const { status = {}, result } = response
                if (status.responsecode === '0000' && !(Array.isArray(result) && !result.length)) {
                    this.props.form.setFieldsValue({ routetype: result[0].routetype })
                } else {
                    Alert.error(status.responsecode !== '0000' ? status.responsemessage : 'No route type found, please choose another origin destination');
                    this.props.form.setFieldsValue({ routetype: '' })
                }
            });
        }
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, fieldvalue, showRequestHistory, visible, data, operatingairline, isLoading, fielddisabled, ticketNameFocused } = this.state;
        const { generalfielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled, approvalreasondisabled, routetypefielddisabled } = fielddisabled;
        const { menucode, prefixmenuname, location, formtype, retrofrom } = this.props;
        const { reqinfo, createdby, createddate, updatedby, updateddate, channel, approvalby, retroclaimid, codeShare, eligibilitydenialcode, eligibilitydenialcodeinfo, airlinecode, fltnumber, alliancetype } = fieldvalue;
        const routetype = this.props.form.getFieldValue('routetype');
        const titlename = {
            "GA": "Garuda Indonesia",
            "QG": "Citilink",
            "SJ": "Sriwijaya",
            "SKYTEAM": "Skyteam - Out",
            "STARALLIANCE": "Star Alliance",
            "ONEWORLD": "ONEWORLD"
        };
        if (formrender) {
            //title bar on browser
            document.title = `${titlepage}| Loyalty Management System`;
            //render form
            return (
                <Row>
                    <Modal visible={showRequestHistory} title="Retro Claim Request History" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={800}>
                        <RequestHistory retroclaimid={retroclaimid} />
                    </Modal>
                    <Modal title={`This flight is codeshare with ${airlinecode} ${fltnumber}. You should click OK to continue this Retro Claim into Retro Claim Management - ${alliancetype === 'SKYTEAM' ? 'SkyTeam' : 'StarAlliance'}`} visible={visible} destroyOnClose={true} footer={null} width={400} closable={false}>
                        <CodeShare {...this.props} retroclaimid={retroclaimid} airlinecode={operatingairline} data={data} codeShare={codeShare} />
                    </Modal>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} {(titlename[retrofrom]) ? titlename[retrofrom] : retrofrom}</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row >
                                <Divider>Retro Claim Information</Divider>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 3 }} xl={{ span: 14, offset: 3 }}>
                                    <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" validationrules={['required', 'pattern.number', 'max.16',]} maxLength={16} disabled={generalfielddisabled} />
                                    {ticketNameFocused &&
                                        <Form.Item label=" " colon={false} style={{ marginBottom: 12 }}>
                                            <AlertAntd className="field-focus-alert" message={<span>Input the <strong>Name on Ticket</strong> without leading and trailing spaces in firstname lastname. Use slash "/" for lastname/firstname (e.g., Putra Doe/John)</span>} type="info" showIcon />
                                        </Form.Item>
                                    }
                                    <InputText form={this.props.form} labeltext="Name on Ticket" datafield="ticketname" validationrules={['required', 'max.255', this.handleValidationTicketName]} maxLength={255} disabled={generalfielddisabled} onFocus={this.handleFocusTicketName} onBlur={this.handleBlurTicketName} />
                                    <AirlineSelect ref={(e) => { this.componentMarAirlineSelect = e }} form={this.props.form} labeltext="Marketing Airline" datafield="marketingairline" validationrules={(retrofrom === 'ONEWORLD') ? ['required'] : []} className={(retrofrom === 'ONEWORLD') ? '' : 'hidden'} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Marketing Flight Number" datafield={"marketingfltnumber"} validationrules={(retrofrom === 'ONEWORLD') ? ['required', 'pattern.alphanumeric', 'max.16'] : []} className={(retrofrom === 'ONEWORLD') ? '' : 'hidden'} maxLength={16} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext={`${(retrofrom === 'ONEWORLD') ? 'Operating ' : ''}Airline`} datafield={"airlinecode"} onChange={this.handleChangeAirlineCode} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext={`${retrofrom === 'ONEWORLD' ? 'Operating ' : ''}Flight Number`} datafield="fltnumber" validationrules={['required', 'pattern.alphanumeric', 'max.16']} maxLength={16} disabled={generalfielddisabled} getValueFromEvent={(e) => { return e.target.value.replace(/^0+/, ''); }} />
                                    <InputText form={this.props.form} labeltext="Ticket Number" datafield="ticketnumber" validationrules={(retrofrom === 'STARALLIANCE') ? ['required', 'pattern.number', 'max.13'] : ['required', 'pattern.number', 'max.16']} maxLength={(retrofrom === 'STARALLIANCE') ? 13 : 16} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" placeholder="Departure Date" validationrules={['required']} maxDate={moment(new Date())} disabled={generalfielddisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} destinationChange={(e) => this.handleChangeOriDes(e, 'destination')} originChange={(e) => this.handleChangeOriDes(e, 'origin')} disabled={generalfielddisabled} custom={'routetype'} />
                                    {(retrofrom === 'STARALLIANCE') ?
                                        <InputText form={this.props.form} labeltext="Route Type" datafield="routetype" disabled={(retrofrom === 'STARALLIANCE') ? true : routetypefielddisabled} />
                                        : null}
                                    {(retrofrom === 'STARALLIANCE') ?
                                        <InputText form={this.props.form} labeltext="Seat Number" datafield="seatnumber" validationrules={(routetype === 'DOMESTIC') ? ['required', 'pattern.seatnumber'] : ['pattern.seatnumber']} maxLength={4} disabled={generalfielddisabled} suffix={'ex. 22F/5F'} />
                                        : null
                                    }
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" validationrules={(retrofrom !== 'SKYTEAM') ? ['required'] : []} onChange={this.handleChangeCompartment} sort={{ rank: 'desc' }} disabled={compartmentcodefielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext={`${(retrofrom === 'ONEWORLD') ? 'Marketing ' : ''}Subclass`} datafield='subclasscode' validationrules={(retrofrom !== 'SKYTEAM') ? ['required'] : []} disabled={subclasscodefielddisabled} />
                                </Col>
                            </Row>
                            <Row className={(actionspage === 'view') ? '' : 'hidden'}>
                                <Divider>Request Log</Divider>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 13, offset: 4 }}>
                                    <Form.Item label="Request Info">
                                        <span className="ant-form-text">{(reqinfo) ? jsUcfirst(reqinfo, "_") : '-'} {(eligibilitydenialcode) ? `- ${eligibilitydenialcode}` : ''}{(eligibilitydenialcodeinfo) ? ` - ${eligibilitydenialcodeinfo}` : ''}</span>
                                    </Form.Item>
                                    <Form.Item label="Created By">
                                        <span className="ant-form-text">{(createdby) ? createdby : '-'}</span>
                                    </Form.Item>
                                    <Form.Item label="Created Date">
                                        <span className="ant-form-text">{(createddate) ? createddate : '-'}</span>
                                    </Form.Item>
                                    <Form.Item label="Updated By">
                                        <span className="ant-form-text">{(updatedby) ? updatedby : '-'}</span>
                                    </Form.Item>
                                    <Form.Item label="Updated Date">
                                        <span className="ant-form-text">{(updateddate) ? updateddate : '-'}</span>
                                    </Form.Item>
                                    <Form.Item label="Created Channel">
                                        <span className="ant-form-text">{channel} - {fieldvalue.retrofrom}</span>
                                    </Form.Item>
                                    <Form.Item label="Approved/Rejected by">
                                        <span className="ant-form-text">{(approvalby) ? approvalby : '-'}</span>
                                    </Form.Item>
                                    {
                                        (formtype !== 'manual-verification') ?
                                            <TextArea form={this.props.form} labeltext="Approved/Rejected Reason" datafield="approvalreason" validationrules={(actionspage === 'view') ? ['required'] : []} maxLengthh={255} disabled={approvalreasondisabled} /> : null
                                    }
                                </Col>
                                <Col span={6} style={{ textAlign: 'right' }}>
                                    <Button htmlType="button" type="primary" size="default" label="Request History" onClick={this.handleShowRequestHistory} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="primary" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={!location.state.ID ? "UPDATE" : "CREATE"}></Button>
                                            : null
                                } &nbsp;

                                {
                                    (formtype && (reqinfo === 'RETRO_REQUEST_CREATED' || reqinfo === 'WAITING_FOR_MANUAL_VERIFICATION')) ?
                                        <span>
                                            <Button htmlType="submit" type="primary" label="Approve" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.approvalAction(e, 'approve')}></Button>
                                            <Button htmlType="submit" type="danger" label="Reject" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.approvalAction(e, 'reject')}></Button>
                                        </span> : ''
                                }
                                {(formtype && reqinfo === 'RETRO_REQUEST_REJECTED') ? <Button htmlType="submit" type="primary" label="Manual Verification" className="btn-warning" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="VERIFY" onClick={(e) => this.approvalAction(e, 'verify')} /> : ''}
                                <Button url={`/${this.props.match.url.split('/')[1]}`} htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));