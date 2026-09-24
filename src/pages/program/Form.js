import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, PartnerSelect, SwitchButton, SelectBase, CurrencySelect, InputNumber, RadioButton } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { AccrualOutCarrierType } from '../../data';

const { Title } = Typography;

export const optionsTemplateFile = [
    { label: "One World", value: "ONEWORLD" },
    { label: "Skyteam", value: "SKYTEAM" },
    { label: "Star Alliance (Default Format)", value: "STARALLIANCE" },
    { label: "Star Alliance (EY Format)", value: "STARALLIANCE_EY" },
    { label: "Star Alliance (NH Format)", value: "STARALLIANCE_NH" },
    // { label: "Amala Format", value: "AMALA" }
];

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
                active: true,
                showCarrierType: false
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                templatefiledisabled: true
            }
        }
    };

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
                this.componentCurrencySelect.retrieveData();
            }

            this.props.form.setFieldsValue({ isoperatingprogram: true });
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = (programcode, actionspage) => {
        let url = api.url.program.list;
        let criteria = { programcode };

        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    const { programcode, programname, partnercode, partnername, templatefile, currencycode, currencyname, accrualout_carriertype } = result[0] || {};

                    let isoperatingprogram = (result[0].isoperatingprogram) ? result[0].isoperatingprogram : false;
                    let fileexchange = (result[0].fileexchange) ? result[0].fileexchange : false;
                    let billingrate = (result[0].billingrate !== undefined && result[0].billingrate !== null) ? result[0].billingrate : null;
                    let generalfielddisabled = (actionspage !== "view") ? true : false;
                    let templatefiledisabled = (actionspage !== "view") ? !fileexchange : true;
                    let showCarrierType = (templatefile === "ONEWORLD") ? true : false;

                    let setValue = { programcode, programname, partnercode, isoperatingprogram, fileexchange, templatefile, currencycode, billingrate, accrualout_carriertype };
                    this.props.form.setFieldsValue(setValue);
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, templatefiledisabled };
                    this.setState({ fieldvalue: { ...this.state.fieldvalue, showCarrierType }, fielddisabled });

                    this.componentPartnerSelect.retrieveData({ partnertype: 'AIR' }, { partnercode, partnername }, actionspage);
                    this.componentCurrencySelect.retrieveData({}, { currencycode, currencyname }, actionspage);
                } else this.setState({ responseMessage: 'Data not found', formrender: false });
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            this.setState({ isLoading: false });
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { programname, partnercode, templatefile, currencycode, } = input || null;

                let programcode = (input.programcode) ? input.programcode.toUpperCase() : null;
                let isoperatingprogram = (input.isoperatingprogram) ? input.isoperatingprogram : false;
                let fileexchange = (input.fileexchange) ? input.fileexchange : false;
                let billingrate = (input.billingrate !== null && input.billingrate !== undefined) ? parseFloat(input.billingrate) : null;
                let accrualout_carriertype = (fileexchange) ? (input.accrualout_carriertype && templatefile === 'ONEWORLD') ? input.accrualout_carriertype : 'ALL' : null;

                let data = { programcode, programname, partnercode, isoperatingprogram, fileexchange, templatefile, currencycode, billingrate, accrualout_carriertype };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.program.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.program.update;
                    data.programcode = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/program');
                    } else Alert.error(responsemessage);
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleFileExchange = (fileexchange) => {
        let templatefiledisabled = !fileexchange;
        this.props.form.setFieldsValue({
            templatefile: undefined,
            currencycode: undefined,
            billingrate: undefined,
            accrualout_carriertype: undefined
        });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, templatefiledisabled }, fieldvalue: { showCarrierType: false } });
    };

    handleTemplate = (value) => {
        this.props.form.setFieldsValue({ accrualout_carriertype: undefined });
        this.setState({ fieldvalue: { ...this.state.fieldvalue, showCarrierType: (value === 'ONEWORLD') ? true : false } });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { showCarrierType } = this.state.fieldvalue;
        const { generalfielddisabled, templatefiledisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Program Loyalty | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Program Loyalty</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Program Code" datafield="programcode" validationrules={['required', 'pattern.alphanumeric']} maxLength={25} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Program Name" datafield="programname" validationrules={['required']} maxLength={50} />
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} />
                                    <SwitchButton form={this.props.form} labeltext="Active Program" datafield="isoperatingprogram" />
                                    <SwitchButton form={this.props.form} labeltext="File Exchange" datafield="fileexchange" onChange={this.handleFileExchange} />
                                    <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext="Currency" datafield="currencycode" validationrules={(!templatefiledisabled) ? ['required'] : []} disabled={templatefiledisabled} />
                                    <SelectBase form={this.props.form} labeltext="Template" datafield="templatefile" options={optionsTemplateFile} validationrules={(!templatefiledisabled) ? ['required'] : []} disabled={templatefiledisabled} onChange={(value) => this.handleTemplate(value)} />
                                    <RadioButton form={this.props.form} labeltext="Accrual Out Carrier Type" datafield="accrualout_carriertype" className={(showCarrierType) ? '' : 'hidden'} options={AccrualOutCarrierType} validationrules={(showCarrierType) ? ['required'] : []} />
                                    <InputNumber form={this.props.form} labeltext="Billing Rate" datafield="billingrate" parser={input => input.replace(/(\.\d{6})\d+/g, '$1')} validationrules={(!templatefiledisabled) ? ['required'] : []} disabled={templatefiledisabled} />
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
                                <Button url="/program" htmlType="link" type="default" label="Back" />
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