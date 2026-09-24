import React, { Component } from 'react';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, AirlineSelect, DatePickerBase, OriDesSelect, CompartmentSelect, SubclassSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const titlealliance = {
    "GA": "INTERNALGA",
    "SKYTEAM": "SKYTEAM",
    "STARALLIANCE": "STARALLIANCE"
};
const { Title } = Typography;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
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
                eligibilitydenialinfo: null,
                retroclaimid: null,
                reqinfo: null,
                createdBy: null,
                createdDate: null,
                updatedBy: null,
                updatedDate: null,
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
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        let retrofrom = this.props.match.params.RETROFROM;
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

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || formtype) {
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
            this.componentOriDesSelect.retrieveData();
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentAirlineSelect.retrieveData({ alliancetype });
                this.componentOriDesSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (id, actionspage) => {
        let url = api.url.retroclaim.retroclaimskyindetail;
        let data = { id };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let id = (result.id) ? result.id : null;
                    let alliancetype = (result.alliancetype) ? result.alliancetype : null;
                    let cardnumber = (result.cardnumber) ? result.cardnumber : undefined;
                    let ticketname = (result.ticketname) ? result.ticketname : undefined;
                    let airlinecode = (result.operatingairline) ? result.operatingairline : undefined;
                    let airlinename = (result.operatingairlinename) ? result.operatingairlinename : null;
                    let ticketnumber = (result.ticketnumber) ? result.ticketnumber : undefined;
                    let fltnumber = (result.operatingfltnumber) ? result.operatingfltnumber : undefined;
                    let departuredate = (result.departuredate) ? moment(result.departuredate) : undefined;
                    let origin = (result.origin) ? result.origin : undefined;
                    let destination = (result.destination) ? result.destination : undefined;
                    let compartmentcode = (result.operatingbookingclass) ? result.operatingbookingclass : undefined;
                    let subclasscode = result.operatingbookingsubclass ? result.operatingbookingsubclass : undefined;
                    let approvalreason = (result.approvalreason) ? result.approvalreason : undefined;
                    let eligibilitydenialcode = (result.eligibilitydenialcode) ? result.eligibilitydenialcode : null;
                    let eligibilitydenialinfo = (result.eligibilitydenialinfo) ? result.eligibilitydenialinfo : null;

                    let reqinfo = (result.reqinfo) ? result.reqinfo : null;
                    let createdBy = (result.createdBy) ? result.createdBy : null;
                    let createdDate = (result.createdDate) ? moment(result.createdDate).format('DD/MM/YYYY') : null;
                    let updatedBy = (result.updatedBy) ? result.updatedBy : null;
                    let updatedDate = (result.updatedDate) ? moment(result.updatedDate).format('DD/MM/YYYY') : null;
                    let channel = (result.channel) ? result.channel : null;
                    let retrofrom = (result.retrofrom) ? result.retrofrom : null;
                    let tickoffid = (result.tickoffid) ? result.tickoffid : null;
                    let approvalby = (result.approvalby) ? result.approvalby : null;
                    let seatnumber = (result.seatnumber) ? result.seatnumber : null;

                    let fieldvalue = { ...this.state.fieldvalue, id, alliancetype, reqinfo, createdBy, createdDate, updatedBy, updatedDate, channel, retrofrom, tickoffid, approvalby, eligibilitydenialcode, eligibilitydenialinfo };
                    this.setState({ fieldvalue });

                    let setValue = {
                        cardnumber, ticketname, airlinecode, ticketnumber, departuredate, origin, destination, fltnumber, compartmentcode, subclasscode, approvalreason,
                        seatnumber, eligibilitydenialcode, eligibilitydenialinfo
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
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender, actionspage, fieldvalue } = this.state;
        const { generalfielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled, routetypefielddisabled } = this.state.fielddisabled;
        const { reqinfo, createdBy, createdDate, updatedBy, updatedDate, eligibilitydenialcode, eligibilitydenialinfo } = fieldvalue;
        let retrofrom = this.props.retrofrom;
        const routetype = this.props.form.getFieldValue('routetype');


        if (formrender) {
            //title bar on browser
            document.title = " Retro Claim | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Retro Claim Skyteam - In</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout}>
                            <Row >
                                <Divider>Retro Claim Information</Divider>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Name on Ticket" datafield="ticketname" disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield={"airlinecode"} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Flight Number" datafield={"fltnumber"} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Ticket Number" datafield="ticketnumber" disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Departure Date" datafield="departuredate" placeholder="Departure Date" disabled={generalfielddisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['', '']} disabled={generalfielddisabled} custom={'routetype'} />
                                    {(retrofrom === 'STARALLIANCE') ?
                                        <InputText form={this.props.form} labeltext="Route Type" datafield="routetype" disabled={(retrofrom === 'STARALLIANCE') ? true : routetypefielddisabled} />
                                        : null}
                                    {(retrofrom === 'STARALLIANCE') ?
                                        <InputText form={this.props.form} labeltext="Seat Number" datafield="seatnumber" validationrules={(routetype === 'DOMESTIC') ? ['required', 'pattern.seatnumber'] : ['pattern.seatnumber']} maxLength={4} disabled={generalfielddisabled} suffix={'ex. 22F/5F'} />
                                        : null
                                    }
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" disabled={compartmentcodefielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Subclass" datafield="subclasscode" disabled={subclasscodefielddisabled} />
                                </Col>
                            </Row>
                            <Row className={(actionspage === 'view') ? '' : 'hidden'}>
                                <Divider>Request Log</Divider>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 13, offset: 4 }}>
                                    <Form.Item label="Request Info">
                                        <span className="ant-form-text">{eligibilitydenialcode} - {eligibilitydenialinfo}</span>
                                    </Form.Item>
                                    <Form.Item label="Created By">
                                        <span className="ant-form-text">{(createdBy) ? createdBy : '-'}</span>
                                    </Form.Item>
                                    <Form.Item label="Created Date">
                                        <span className="ant-form-text">{(createdDate) ? createdDate : '-'}</span>
                                    </Form.Item>
                                    <Form.Item label="Updated By">
                                        <span className="ant-form-text">{(updatedBy) ? updatedBy : '-'}</span>
                                    </Form.Item>
                                    <Form.Item label="Updated Date">
                                        <span className="ant-form-text">{(updatedDate) ? updatedDate : '-'}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button url={`/${this.props.match.url.split('/')[1]}`} htmlType="link" type="default" label="Back" />
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