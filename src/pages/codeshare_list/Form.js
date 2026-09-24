import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, DateRangeBase, SwitchButton, OriDesSelect, RadioButton, AirlineSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { Tabs } from 'antd';
import moment from 'moment';
import SubclassMapping from './subclass_mapping/Index';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                allflightdisabled: false
            },
            fieldvalue: {
                codeshareid: null,
                marketingairline: null,
                marketingairlinename: null,
                operatingairline: null,
                operatingairlinename: null,
                routetype: null,
                accrualprinciple: null,
                active: true,
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentMarAirlineSelect.retrieveData({ ismarketing: true });
                this.componentOprAirlineSelect.retrieveData({ isoperating: true });
                this.componentOriDesSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (codeshareid, actionspage) => {
        let url = api.url.codeshare.list;
        let criteria = { codeshareid };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let marketingairline = (result[0].marketingairline) ? result[0].marketingairline : null;
                    let marketingairlinename = (result[0].marketingairlinename) ? result[0].marketingairlinename : null;
                    let operatingairline = (result[0].operatingairline) ? result[0].operatingairline : null;
                    let operatingairlinename = (result[0].operatingairlinename) ? result[0].operatingairlinename : null;
                    let routetype = (result[0].routetype === 'ALLROUTE') ? true : false;
                    let marketingfltnum = (result[0].marketingfltnum) ? result[0].marketingfltnum.toString().trim() : '';
                    let operatingfltnum = (result[0].operatingfltnum) ? result[0].operatingfltnum.toString().trim() : '';
                    let origin = (result[0].origin) ? result[0].origin : null;
                    let origincityname = (origin && result[0].originairport.cityname) ? result[0].originairport.cityname : null;
                    let originairportname = (origin && result[0].originairport.airportname) ? result[0].originairport.airportname : null;
                    let destination = (result[0].destination) ? result[0].destination : null;
                    let destinationcityname = (destination && result[0].destinationairport.cityname) ? result[0].destinationairport.cityname : null;
                    let destinationairportname = (destination && result[0].destinationairport.airportname) ? result[0].destinationairport.airportname : null;
                    let codesharetype = result[0].codesharetype ? result[0].codesharetype : null;
                    let accrualprinciple = result[0].accrualprinciple ? result[0].accrualprinciple : null;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    let allflightdisabled = (!routetype && actionspage !== "view") ? !active : true;

                    let setValue = { marketingairline, operatingairline, routetype, marketingfltnum, operatingfltnum, origin, destination, codesharetype, accrualprinciple, date };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { codeshareid, marketingairline, marketingairlinename, operatingairline, operatingairlinename, routetype, accrualprinciple, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, allflightdisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    this.componentMarAirlineSelect.retrieveData({ ismarketing: true }, { marketingairline, marketingairlinename }, actionspage);
                    this.componentOprAirlineSelect.retrieveData({ isoperating: true }, { operatingairline, operatingairlinename }, actionspage);
                    if (!routetype) this.componentOriDesSelect.retrieveData({}, { origin, origincityname, originairportname, destination, destinationcityname, destinationairportname }, actionspage);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                let marketingairline = input.marketingairline;
                let operatingairline = input.operatingairline;
                let routetype = (input.routetype) ? 'ALLROUTE' : 'SPECIFICROUTE'
                let marketingfltnum = (input.marketingfltnum) ? input.marketingfltnum : null;
                let operatingfltnum = (input.operatingfltnum) ? input.operatingfltnum : null;
                let origin = (input.origin) ? input.origin : null;
                let destination = (input.destination) ? input.destination : null;
                let codesharetype = (input.codesharetype) ? input.codesharetype : null;
                let accrualprinciple = (input.accrualprinciple) ? input.accrualprinciple : null;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let data = { marketingairline, operatingairline, routetype, marketingfltnum, operatingfltnum, origin, destination, codesharetype, accrualprinciple, effectivedate, discontinuedate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.codeshare.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.codeshare.update;
                    data.codeshareid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/codeshare-list');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    handleRouteType = (value) => {
        let allflightdisabled = value;
        this.props.form.setFieldsValue({ marketingfltnum: undefined, operatingfltnum: undefined, origin: undefined, destination: undefined });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, allflightdisabled }, fieldvalue: { ...this.state.fieldvalue, routetype: value } });

        if (!value) { this.componentOriDesSelect.retrieveData(); }
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, allflightdisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const { routetype, accrualprinciple, active } = this.state.fieldvalue;
        const optionsCodeshareType = [
            { value: 'FREEFLOW', label: 'FREEFLOW' },
            { value: 'BLOCKSPACE', label: 'BLOCKSPACE' }
        ]
        const optionsAccrualPrinciple = [
            { value: 'MARKETING', label: 'MARKETING' },
            { value: 'OPERATING', label: 'OPERATING' }
        ]

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Codeshare List | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Codeshare List</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.loading}>
                        <Tabs defaultActiveKey="1" style={{ marginTop: '-20px' }}>
                            <TabPane tab="Detail Information" key="1">
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <AirlineSelect ref={(e) => { this.componentMarAirlineSelect = e }} form={this.props.form} labeltext="Marketing Airline" datafield="marketingairline" validationrules={['required']} disabled={generalfielddisabled} />
                                            <AirlineSelect ref={(e) => { this.componentOprAirlineSelect = e }} form={this.props.form} labeltext="Operating Airline" datafield="operatingairline" validationrules={['required']} disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="All Flight" datafield="routetype" disabled={generalfielddisabled} onChange={this.handleRouteType} />
                                            <InputText form={this.props.form} labeltext="Marketing Flight Number" datafield="marketingfltnum" maxLength={100} validationrules={(routetype) ? [] : ['required']} disabled={allflightdisabled} />
                                            <InputText form={this.props.form} labeltext="Operating Flight Number" datafield="operatingfltnum" maxLength={100} validationrules={(routetype) ? [] : ['required']} disabled={allflightdisabled} />
                                            <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={(routetype) ? [] : ['required', 'required']} disabled={allflightdisabled} />
                                            <RadioButton form={this.props.form} labeltext="Codeshare Type" datafield="codesharetype" options={optionsCodeshareType} validationrules={['required']} disabled={generalfielddisabled} />
                                            <RadioButton form={this.props.form} labeltext="Accrual Principle" datafield="accrualprinciple" options={optionsAccrualPrinciple} validationrules={['required']} disabled={generalfielddisabled} />
                                            <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment(new Date())} disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                        {
                                            (actionspage === 'create') ?
                                                <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                                : (actionspage === 'update' && active) ?
                                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                                    : null
                                        }
                                        <Button url="/codeshare-list" htmlType="link" type="default" label="Back" />
                                    </Row>
                                </Form>
                            </TabPane>
                            {
                                (actionspage !== 'create' && accrualprinciple === 'OPERATING') && (usermenu["SUCLSMAP"]["SUCLSMAP_ACCESS"]) ?
                                    <TabPane tab="Subclass Mapping" key="2">
                                        <SubclassMapping data={this.state.fieldvalue} />
                                    </TabPane> : ""
                            }
                        </Tabs>
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