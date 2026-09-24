import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, TextArea, StatementSelect, PartnerSelect, RadioButton, SwitchButton, DatePickerBase, Button, Alert, SelectBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsActivityType = [
    { label: "BONUS", value: "BONUS" },
    { label: "BUY MILES", value: "BUYMILES" },
    { label: "EXTEND", value: "EXTEND" },
    { label: "GIFT", value: "GIFT" },
    { label: "REINSTATE", value: "REINSTATE" },
    { label: "TRANSFER POINT", value: "TRANSFERPOINT" },
    { label: "ACCELERATOR", value: "ACCELERATOR" },
]

const optionsDurationType = [
    { label: "Month", value: "MONTH" },
    { label: "Year", value: "YEAR" },
    { label: "Date", value: "DATE" }
]

const optionsPeriodType = [
    { label: "Month", value: "MONTH" },
    { label: "Year", value: "YEAR" }
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
                activitycode: null,
                durationtype: null,
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
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
                this.componentStatementSelect.retrieveData({ statementtype: 'NONAIR' });
                this.componentPartnerSelect.retrieveData({ partnertype: 'NONAIR' });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (activitycode, actionspage) => {
        let url = api.url.activitycode.list;
        let criteria = { activitycode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let activitycode = (result[0].activitycode) ? result[0].activitycode : '';
                    let nonairactivitytype = (result[0].nonairactivitytype) ? result[0].nonairactivitytype : null;
                    let periodtype = (result[0].periodtype) ? result[0].periodtype : '';
                    let timeperiodback = (result[0].timeperiodback) ? result[0].timeperiodback : '';
                    let timeperiodnext = (result[0].timeperiodnext) ? result[0].timeperiodnext : '';
                    let activityname = (result[0].activityname) ? result[0].activityname : '';
                    let description = (result[0].description) ? result[0].description : '';
                    let durationinmonths = (result[0].durationinmonths) ? result[0].durationinmonths.toString() : '';
                    let durationinyears = (result[0].durationinyears) ? result[0].durationinyears.toString() : '';
                    let partnercode = result[0].partnercode ? result[0].partnercode : null;
                    let partnername = result[0].partnername ? result[0].partnername : null;
                    let statementcode = result[0].statementcode ? result[0].statementcode : null;
                    let statementname = result[0].statementname ? result[0].statementname : null;
                    let usedforbulk = (result[0].usedforbulk) ? result[0].usedforbulk : false;
                    let durationtype = result[0].durationtype ? result[0].durationtype : null;
                    let periodendmonth = (durationtype === 'MONTH') ? result[0].periodendmonth : false;
                    let periodendyears = (durationtype === 'YEAR') ? result[0].periodendyears : false;
                    let durationindate = (result[0].durationtype === 'DATE') ? moment(result[0].durationindate) : null;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { activitycode, nonairactivitytype, activityname, description, partnercode, usedforbulk, durationtype, durationinmonths, durationinyears, statementcode, periodendmonth, periodendyears, durationindate, periodtype, timeperiodback, timeperiodnext };
                    this.props.form.setFieldsValue(setValue);

                    let fieldvalue = { ...this.state.fieldvalue, durationtype, activitycode, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    //load options select2
                    this.componentStatementSelect.retrieveData({ statementtype: 'NONAIR' }, { statementcode, statementname }, actionspage);
                    this.componentPartnerSelect.retrieveData({ partnertype: 'NONAIR' }, { partnercode, partnername }, actionspage);
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
                let activitycode = input.activitycode.toUpperCase();
                let nonairactivitytype = (input.nonairactivitytype) ? input.nonairactivitytype : null;
                let periodtype = (input.periodtype) ? input.periodtype : null;
                let timeperiodback = (input.timeperiodback) ? input.timeperiodback : null;
                let timeperiodnext = input.timeperiodnext ? input.timeperiodnext : null;
                let activityname = (input.activityname) ? input.activityname : null;
                let partnercode = (input.partnercode) ? input.partnercode : null;
                let statementcode = (input.statementcode) ? input.statementcode : null;
                let usedforbulk = (input.usedforbulk) ? input.usedforbulk : false;
                let description = (input.description && input.description.length > 0) ? input.description : null;
                let durationtype = (input.durationtype) ? input.durationtype : null;
                let durationindate = (input.durationtype === 'DATE') ? moment(input.durationindate).format("YYYY-MM-DD") : null;
                let periodendmonth = (input.durationtype === 'MONTH') ? input.periodendmonth ? true : false : null;
                let durationinmonths = (input.durationtype === 'MONTH') ? input.durationinmonths : null;
                let periodendyears = (input.durationtype === 'YEAR') ? input.periodendyears ? true : false : null;
                let durationinyears = (input.durationtype === 'YEAR') ? input.durationinyears : null;

                let data = { activitycode, nonairactivitytype, activityname, partnercode, statementcode, usedforbulk, description, durationtype, durationindate, periodendmonth, periodendyears, durationinmonths, durationinyears, periodtype, timeperiodback, timeperiodnext };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.activitycode.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.activitycode.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/activity-code');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleValidationDurationInMonth = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        callback();
    }

    handleValidationDurationInYear = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        callback();
    }

    onChangeDurationType = (event) => {
        let durationtype = event === null ? null : event.target.value;

        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, durationtype } });
    }

    deleteData(activitycode, active) {
        let url = (active) ? api.url.activitycode.deactivate : api.url.activitycode.activate;
        let data = { activitycode };
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

    handleActivityCodeChange = () => {
        this.props.form.resetFields(['totalmiles', 'periodtype', 'timeperiodback', 'timeperiodnext', []]);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 9 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 15 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { activitycode, durationtype, active } = this.state.fieldvalue;
        const { specialfielddisabled, generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const nonairactivitytype = this.props.form.getFieldValue("nonairactivitytype");
        const periodtype = this.props.form.getFieldValue("periodtype");

        const periodTypeValidation = (nonairactivitytype === "REINSTATE" || nonairactivitytype === "EXTEND" || nonairactivitytype === "ACCELERATOR") ? true : false;
        const timePeriodBackValidation = (nonairactivitytype === "REINSTATE" || nonairactivitytype === "ACCELERATOR") ? true : false;
        const timePeriodNextValidation = (nonairactivitytype === "EXTEND" || nonairactivitytype === "ACCELERATOR") ? true : false;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Non Air Activity Code | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Non Air Activity Code</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Non-Air Activity Type" datafield="nonairactivitytype" options={optionsActivityType} validationrules={['required']} disabled={generalfielddisabled} onChange={this.handleActivityCodeChange} />
                                    <RadioButton form={this.props.form} className={(periodTypeValidation) ? '' : 'hidden'} labeltext="Period Type" datafield="periodtype" options={optionsPeriodType} validationrules={[(periodTypeValidation) ? 'required' : '']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} className={(timePeriodBackValidation) ? '' : 'hidden'} labeltext="Time Period Back" datafield="timeperiodback" validationrules={(timePeriodBackValidation) ? ['required', 'pattern.number'] : ''} maxLength="9" disabled={generalfielddisabled} suffix={periodtype === "YEAR" ? "Years" : periodtype === "MONTH" ? "Months" : ''} />
                                    <InputText form={this.props.form} className={(timePeriodNextValidation) ? '' : 'hidden'} labeltext="Time Period Next" datafield="timeperiodnext" validationrules={(timePeriodNextValidation) ? ['required', 'pattern.number'] : ''} maxLength="9" disabled={generalfielddisabled} suffix={periodtype === "YEAR" ? "Years" : periodtype === "MONTH" ? "Months" : ''} />
                                    <InputText form={this.props.form} labeltext="Activity Code" datafield="activitycode" validationrules={['required', 'pattern.alphanumeric', 'max.20',]} maxLength="20" disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Activity Name" datafield="activityname" validationrules={['required', 'pattern.alphanumericspace', 'max.45']} maxLength="45" disabled={generalfielddisabled} />
                                    <TextArea form={this.props.form} labeltext="Description" datafield="description" validationrules={['max.255']} disabled={generalfielddisabled} maxLength="255" />
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <StatementSelect ref={(e) => { this.componentStatementSelect = e }} form={this.props.form} labeltext="Statement" datafield="statementcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Use Bulk" datafield="usedforbulk" disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="Duration Type" datafield="durationtype" options={optionsDurationType} validationrules={['required']} onChange={this.onChangeDurationType} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Duration In Months" datafield="durationinmonths" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(durationtype === 'MONTH') ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInMonth] : null} maxLength="5" disabled={generalfielddisabled} suffix="Months" />
                                    <InputText form={this.props.form} labeltext="Duration In Years" datafield="durationinyears" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(durationtype === 'YEAR') ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInYear] : null} maxLength="5" disabled={generalfielddisabled} suffix="Years" />
                                    <SwitchButton form={this.props.form} labeltext="Period In Month" datafield="periodendmonth" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(durationtype === 'MONTH') ? ['required'] : null} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Period In Year" datafield="periodendyears" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(durationtype === 'YEAR') ? ['required'] : null} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Duration Date" datafield="durationindate" className={(durationtype !== 'DATE') ? 'hidden' : ''} validationrules={(durationtype === 'DATE') ? ['required'] : null} disabled={generalfielddisabled} />
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
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(activitycode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(activitycode, active)} /> : ""
                                }
                                <Button url="/activity-code" htmlType="link" type="default" label="Back" />
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