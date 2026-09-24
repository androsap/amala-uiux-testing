import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, PartnerSelect, SelectBase, SwitchButton, AirlineSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { Tabs } from 'antd';
import Compartment from './compartment/Index';
import Subclass from './booking_class/Index';
// import SubclassMapping from './subclass_mapping/Index';

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
                parentairlinefielddisabled: true
            },
            fieldvalue: {
                airlinecode: null,
                active: true
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
                this.componentPartnerSelect.retrieveData({ partnertype: 'AIR' });
                this.componentParentAirlineSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (airlinecode, actionspage) => {
        let url = api.url.airline.list;
        let criteria = { airlinecode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let airlinecode = (result[0].airlinecode) ? result[0].airlinecode : '';
                    let airlinename = (result[0].airlinename) ? result[0].airlinename : '';
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : null;
                    let partnername = (result[0].partnername) ? result[0].partnername : null;
                    let alliancetype = (result[0].alliancetype) ? result[0].alliancetype : null;
                    let minretroperiod = (result[0].minretroperiod) ? result[0].minretroperiod : 0;
                    let maxretroperiod = (result[0].maxretroperiod) ? result[0].maxretroperiod : 0;
                    let ismarketing = result[0].ismarketing ? result[0].ismarketing : false;
                    let isoperating = result[0].isoperating ? result[0].isoperating : false;
                    let allowcssretro = result[0].allowcssretro ? result[0].allowcssretro : false;
                    let canaccrual = result[0].canaccrual ? result[0].canaccrual : false;
                    let sendemail = result[0].sendemail ? result[0].sendemail : false;
                    let canredeem = result[0].canredeem ? result[0].canredeem : false;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let issubsidiary = result[0].issubsidiary ? result[0].issubsidiary : false;
                    let parentairline = result[0].parentairline ? result[0].parentairline : undefined;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    let parentairlinefielddisabled = (actionspage !== "view") ? !issubsidiary : true;

                    let setValue = { airlinecode, airlinename, partnercode, alliancetype, minretroperiod, maxretroperiod, ismarketing, isoperating, allowcssretro, canaccrual, canredeem, sendemail, issubsidiary, parentairline };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { airlinecode, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, parentairlinefielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    this.componentPartnerSelect.retrieveData({ partnertype: 'AIR' }, { partnercode, partnername }, actionspage);
                    this.componentParentAirlineSelect.retrieveData({}, { airlinecode: parentairline }, actionspage);
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
                let airlinecode = input.airlinecode.toUpperCase();
                let airlinename = input.airlinename;
                let partnercode = input.partnercode;
                let alliancetype = input.alliancetype;
                let minretroperiod = input.minretroperiod;
                let maxretroperiod = input.maxretroperiod;
                let ismarketing = (input.ismarketing) ? input.ismarketing : false;
                let isoperating = (input.isoperating) ? input.isoperating : false;
                let allowcssretro = (input.allowcssretro) ? input.allowcssretro : false;
                let canaccrual = (input.canaccrual) ? input.canaccrual : false;
                let canredeem = (input.canredeem) ? input.canredeem : false;
                let sendemail = (input.sendemail) ? input.sendemail : false;
                let issubsidiary = (input.issubsidiary) ? input.issubsidiary : false;
                let parentairline = (input.parentairline) ? input.parentairline : null;

                let data = { airlinecode, airlinename, partnercode, alliancetype, minretroperiod, maxretroperiod, ismarketing, isoperating, allowcssretro, canaccrual, canredeem, sendemail, issubsidiary, parentairline };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.airline.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.airline.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/airline');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    deleteData(airlinecode, active) {
        let url = (active) ? api.url.airline.deactivate : api.url.airline.activate;
        let data = { airlinecode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    handleIsSubsidiary = (issubsidiary) => {
        let parentairlinefielddisabled = !issubsidiary;
        let parentairline = undefined;
        this.props.form.setFieldsValue({ parentairline });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, parentairlinefielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled, parentairlinefielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const { airlinecode, active } = this.state.fieldvalue;
        const optionsAllianceType = [
            { value: 'INTERNALGA', label: 'INTERNAL - GA' },
            { value: 'INTERNALQG', label: 'INTERNAL - QG' },
            { value: 'INTERNALSJ', label: 'INTERNAL - SJ' },
            { value: 'SKYTEAM', label: 'SKYTEAM' },
            { value: 'STARALLIANCE', label: 'STARALLIANCE' },
            { value: 'ONEWORLD', label: 'ONEWORLD' },
            { value: 'NONE', label: 'NONE' }
        ];

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Airline | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Airline</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.loading}>
                        <Tabs defaultActiveKey="1" style={{ marginTop: '-20px' }}>
                            <TabPane tab="Detail Information" key="1">
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <InputText form={this.props.form} labeltext="Airline Code" datafield="airlinecode" maxLength={10} validationrules={['required', 'pattern.alphanumeric']} disabled={specialfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Airline Name" datafield="airlinename" maxLength={45} validationrules={['required', 'pattern.letterspace']} disabled={generalfielddisabled} />
                                            <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} disabled={generalfielddisabled} />
                                            <SelectBase labeltext="Alliance Type" datafield="alliancetype" form={this.props.form} options={optionsAllianceType} validationrules={['required']} disabled={generalfielddisabled} />
                                            <Row gutter={2}>
                                                <Col xs={12} sm={12} md={12}>
                                                    <SwitchButton labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} form={this.props.form} labeltext="Is Subsidiary" datafield="issubsidiary" disabled={generalfielddisabled} onChange={this.handleIsSubsidiary} />
                                                </Col>
                                                <Col xs={12} sm={12} md={12}>
                                                    <AirlineSelect wrapperCol={{ span: 24 }} ref={(e) => { this.componentParentAirlineSelect = e }} form={this.props.form} placeholder="Parent Airline" datafield="parentairline" validationrules={(!parentairlinefielddisabled) ? ['required'] : []} disabled={parentairlinefielddisabled} />
                                                </Col>
                                            </Row>
                                            <InputText form={this.props.form} labeltext="Min Retro Period" datafield="minretroperiod" maxLength={45} validationrules={['required', 'pattern.number']} suffix="DAYS" disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Max Retro Period" datafield="maxretroperiod" maxLength={45} validationrules={['required', 'pattern.number']} suffix="DAYS" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Is Marketing Airline" datafield="ismarketing" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Is Operating Airline" datafield="isoperating" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Allow CSS Retro" datafield="allowcssretro" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Can Accrual" datafield="canaccrual" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Send Email" datafield="sendemail" disabled={generalfielddisabled} />
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
                                        {
                                            (actionspage !== 'create') ?
                                                (active) ?
                                                    <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(airlinecode, active)} /> :
                                                    <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(airlinecode, active)} /> : ""
                                        }
                                        <Button url="/airline" htmlType="link" type="default" label="Back" />
                                    </Row>
                                </Form>
                            </TabPane>
                            {
                                (actionspage !== 'create') && (usermenu["COMPART"]["COMPART_ACCESS"]) ?
                                    <TabPane tab="Compartment" key="2">
                                        <Compartment airlinecode={this.props.match.params.ID} active={active} />
                                    </TabPane> : ""
                            }
                            {
                                (actionspage !== 'create') && (usermenu["SUBCLASS"]["SUBCLASS_ACCESS"]) ?
                                    <TabPane tab="Subclass" key="3">
                                        <Subclass airlinecode={this.props.match.params.ID} active={active} />
                                    </TabPane> : ""
                            }
                            {/* {
                                (actionspage !== 'create') && (usermenu["SUCLSMAP"]["SUCLSMAP_ACCESS"]) ?
                                    <TabPane tab="Subclass Mapping" key="4">
                                        <SubclassMapping airlinecode={this.props.match.params.ID} active={active} />
                                    </TabPane> : ""
                            } */}
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