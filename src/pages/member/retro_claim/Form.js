import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, AirlineSelect, DatePickerBase, OriDesSelect, CompartmentSelect, SubclassSelect, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../../utilities/Helpers';
import RequestHistory from '../../rc_manager/RequestHistory';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Retro Claim Request',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            showRequestHistory: false,
            fieldvalue: {
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
                approvalby: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                compartmentcodefielddisabled: true,
                subclasscodefielddisabled: true,
                approvalreasondisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.retroclaimid;
        let retrofrom = this.props.match.params.RETROFROM;
        let formtype = this.props.formtype;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let compartmentcodefielddisabled = false;
            let subclasscodefielddisabled = false;
            let approvalreasondisabled = (formtype === 'approval') ? false : true;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || formtype !== 'approval') {
                titlepage = 'Retro Claim Request';
                actionspage = 'view';
                generalfielddisabled = true;
                compartmentcodefielddisabled = true;
                subclasscodefielddisabled = true;
            }
            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled, approvalreasondisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, retrofrom, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentAirlineSelect.retrieveData();
                this.componentOriDesSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (retroclaimid, retrofrom, actionspage) => {
        let url = api.url.retroclaim.list;
        let criteria = { retroclaimid, retrofrom };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let retroclaimid = (result[0].retroclaimid) ? result[0].retroclaimid : null;
                    let cardnumber = (result[0].cardnumber) ? result[0].cardnumber : undefined;
                    let ticketname = (result[0].ticketname) ? result[0].ticketname : undefined;
                    let airlinecode = (result[0].operatingairline) ? result[0].operatingairline : undefined;
                    let airlinename = (result[0].operatingairlinename) ? result[0].operatingairlinename : null;
                    let ticketnumber = (result[0].ticketnumber) ? result[0].ticketnumber : undefined;
                    let fltnumber = (result[0].operatingfltnumber) ? result[0].operatingfltnumber : undefined;
                    let departuredate = (result[0].departuredate) ? moment(result[0].departuredate) : undefined;
                    let origin = (result[0].origin) ? result[0].origin : undefined;
                    let destination = (result[0].destination) ? result[0].destination : undefined;
                    let compartmentcode = (result[0].operatingbookingclass) ? result[0].operatingbookingclass : undefined;
                    let subclasscode = result[0].operatingbookingsubclass ? result[0].operatingbookingsubclass : undefined;
                    let approvalreason = (result[0].approvalreason) ? result[0].approvalreason : undefined;
                    
                    let eligibilitydenialcode = (result[0].eligibilitydenialcode) ? result[0].eligibilitydenialcode : null;
                    let eligibilitydenialcodeinfo = (result[0].eligibilitydenialcodeinfo) ? result[0].eligibilitydenialcodeinfo : null;
                    let reqinfo = (result[0].reqinfo) ? result[0].reqinfo : null;
                    let createdby = (result[0].createdBy) ? result[0].createdBy : null;
                    let createddate = (result[0].createdDate) ? moment(result[0].createdDate).format('DD/MM/YYYY') : null;
                    let updatedby = (result[0].updatedBy) ? result[0].updatedBy : null;
                    let updateddate = (result[0].updatedDate) ? moment(result[0].updatedDate).format('DD/MM/YYYY') : null;
                    let channel = (result[0].channel) ? result[0].channel : null;
                    let retrofrom = (result[0].retrofrom) ? result[0].retrofrom : null;
                    let tickoffid = (result[0].tickoffid) ? result[0].tickoffid : null;
                    let approvalby = (result[0].approvalby) ? result[0].approvalby : null;

                    let fieldvalue = { ...this.state.fieldvalue, retroclaimid, reqinfo, createdby, createddate, updatedby, updateddate, channel, retrofrom, tickoffid, approvalby, eligibilitydenialcode, eligibilitydenialcodeinfo };
                    this.setState({ fieldvalue });

                    let setValue = { cardnumber, ticketname, airlinecode, ticketnumber, departuredate, origin, destination, fltnumber, compartmentcode, subclasscode, approvalreason };
                    this.props.form.setFieldsValue(setValue);

                    /* Jika Manual Verification */
                    let formtype = this.props.formtype;
                    let compartmentcodefielddisabled = ((reqinfo === 'RETRO_REQUEST_CREATED' || reqinfo === 'WAITING_FOR_MANUAL_VERIFICATION') && formtype === 'approval') ? false : true;
                    let subclasscodefielddisabled = ((reqinfo === 'RETRO_REQUEST_CREATED' || reqinfo === 'WAITING_FOR_MANUAL_VERIFICATION') && formtype === 'approval') ? false : true;
                    let fielddisabled = { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled };
                    this.setState({ fielddisabled });

                    this.componentAirlineSelect.retrieveData({}, { airlinecode, airlinename }, actionspage);
                    this.componentCompartmentSelect.retrieveData({ airlinecode }, { compartmentcode }, actionspage);
                    this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode }, { subclasscode }, actionspage);
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
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let retrofrom = this.props.retrofrom;
                let requestdate = moment(new Date()).format("YYYY-MM-DD");
                let ffpcarriercode = "GA";
                let cardnumber = input.cardnumber;
                let ticketname = input.ticketname;
                let splitticketname = ticketname.split("/");
                let paxfirstname = (splitticketname[1]) ? splitticketname[1] : null;
                let paxlastname = (splitticketname[0]) ? splitticketname[0] : null;
                let operatingairline = input.airlinecode;
                let alliancetype = this.componentAirlineSelect.getValue(operatingairline, 'alliancetype');
                let compartmentcode = input.compartmentcode;
                let cabinclasscode = input.compartmentcode;
                let operatingfltnumber = input.fltnumber;
                let departuredate = moment(input.departuredate).format("YYYY-MM-DD");
                let subclasscode = input.subclasscode;
                let origin = input.origin;
                let destination = input.destination;
                let ticketnumber = input.ticketnumber;
                let seatnumber = null;
                let sequencenumber = null;
                let pnr = null;
                let channel = "BO";

                let url = '';
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
                }

                let data = {
                    requestdate, retrofrom, ffpcarriercode, cardnumber, ticketname, paxfirstname, paxlastname, operatingairline, operatingfltnumber, departuredate,
                    origin, destination, compartmentcode, cabinclasscode, subclasscode, ticketnumber, seatnumber, sequencenumber, pnr, channel
                };

                let message = 'New data has been created';

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/retro-claim-' + retrofrom.toLowerCase() + '-manager/');
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
                        this.props.history.push('/' + this.props.match.url.split('/')[1]);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    onChangeDurationType = (event) => {
        let durationtype = event === null ? null : event.target.value;

        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, durationtype } });
    }

    handleValidationTicketName = (rule, value, callback) => {
        if (value && value.split("/").length > 2) {
            callback('Only for last name and firstname');
        } else if (value && value.split("/").length < 2) {
            callback('Must consist of firstname and lastname');
        }
        callback();
    }

    handleChangeAirlineCode = (airlinecode) => {
        let compartmentcode = undefined;
        let subclasscode = undefined;
        let compartmentcodefielddisabled = (airlinecode) ? false : true;
        let subclasscodefielddisabled = true;
        let pricecalc = undefined;

        this.componentCompartmentSelect.retrieveData({ airlinecode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ compartmentcode, subclasscode, pricecalc });

        this.setState({ fieldvalue: { ...this.state.fieldvalue, airlinecode, pricecalc } });
    }

    handleChangeCompartment = (compartmentcode) => {
        let airlinecode = this.props.form.getFieldValue('airlinecode');
        let subclasscode = undefined;
        let subclasscodefielddisabled = (compartmentcode) ? false : true;
        this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ subclasscode });
    }

    handleShowRequestHistory = () => {
        this.setState({ showRequestHistory: true });
    }

    handleCancel = () => {
        this.setState({ showRequestHistory: false });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { titlepage, actionspage, formrender, fieldvalue, showRequestHistory } = this.state;
        const { generalfielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled, approvalreasondisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const { reqinfo, createdby, createddate, updatedby, updateddate, channel, approvalby, retroclaimid, eligibilitydenialcode, eligibilitydenialcodeinfo } = fieldvalue;
        const formtype = this.props.formtype;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Modal visible={showRequestHistory} title="Retro Claim Request History" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={800}>
                        <RequestHistory retroclaimid={retroclaimid} />
                    </Modal>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage}</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row >
                                <Divider>Retro Claim Information</Divider>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 2 }} xl={{ span: 12, offset: 2 }}>
                                    <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" validationrules={['required', 'pattern.number', 'max.16',]} maxLength={16} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Name on Ticket" datafield="ticketname" validationrules={['required', 'max.255', this.handleValidationTicketName]} maxLength={255} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" onChange={this.handleChangeAirlineCode} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Flight Number" datafield="fltnumber" validationrules={['required', 'pattern.alphanumeric', 'max.16']} maxLength={16} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Ticket Number" datafield="ticketnumber" validationrules={['required', 'pattern.number', 'max.16']} maxLength={16} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" placeholder="Departure Date" validationrules={['required']} minDate={moment(new Date())} disabled={generalfielddisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} disabled={generalfielddisabled} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" validationrules={(reqinfo === 'RETRO_REQUEST_REJECTED') ? [] : ['required']} onChange={this.handleChangeCompartment} disabled={compartmentcodefielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Subclass" datafield="subclasscode" validationrules={(reqinfo === 'RETRO_REQUEST_REJECTED') ? [] : ['required']} disabled={subclasscodefielddisabled} />
                                </Col>
                            </Row>
                            <Row className={(actionspage === 'view') ? '' : 'hidden'}>
                                <Divider>Request Log</Divider>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <Form.Item label="Request Info">
                                        <span className="ant-form-text">{(reqinfo) ? jsUcfirst(reqinfo, "_") : '-'} - {eligibilitydenialcode} - {eligibilitydenialcodeinfo}</span>
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
                                    <TextArea form={this.props.form} className={(reqinfo === 'RETRO_REQUEST_REJECTED') ? 'hidden' : ''} labeltext="Approved/Rejected Reason" datafield="approvalreason" validationrules={(reqinfo === 'RETRO_REQUEST_REJECTED') ? [] : ['required']} maxLengthh={255} disabled={approvalreasondisabled} />
                                </Col>
                                <Col span={8} style={{ textAlign: 'right' }}>
                                    <Button htmlType="button" type="primary" size="default" label="Request History" onClick={this.handleShowRequestHistory} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;

                                {
                                    (formtype === 'approval' && (reqinfo === 'RETRO_REQUEST_CREATED' || reqinfo === 'WAITING_FOR_MANUAL_VERIFICATION')) ? <span>
                                        <Button htmlType="submit" type="primary" label="Approve" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.approvalAction(e, 'approve')}></Button>
                                        <Button htmlType="submit" type="danger" label="Reject" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.approvalAction(e, 'reject')}></Button>
                                    </span> : ''
                                }
                                {(formtype === 'approval' && reqinfo === 'RETRO_REQUEST_REJECTED') ? <Button htmlType="submit" type="primary" label="Manual Verification" className="btn-warning" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.approvalAction(e, 'verify')} /> : ''}
                                <Button url={'/' + this.props.match.url.split('/')[1] + '/form/' + this.props.match.params.ID + '/retro-claim'} htmlType="link" type="default" label="Back" />
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
export default connect(mapStateToProps)(Form.create()(App));