import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, TextArea, StatementSelect, RadioButton, SwitchButton, DatePickerBase, CheckboxBase, Button, Alert, CustomTransactionSelect, SelectBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';
import { PeriodMiles, PeriodMile } from '../../data';

const { Title } = Typography;
const optionsDurationType = [
    { label: "Month", value: "MONTH" },
    { label: "Year", value: "YEAR" },
    { label: "Date", value: "DATE" },
    { label: "Day", value: "DAY" }
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
                durationtype: null,
                correctionmerge: false,
                validforredeem: false,
                validfortransfer: false,
                validforearn: false,
                validforbuy: false,
                visible: false,
                periodmile: true,
                periodmiles: 'NEW_PERIOD'
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
                this.componentStatementSelect.retrieveData();
                this.componentCustomTransactionSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (customtrxcode, actionspage) => {
        let url = api.url.customtransaction.list;
        let criteria = { customtrxcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let customtrxcode = (result[0].customtrxcode) ? result[0].customtrxcode : '';
                    let customtrxname = (result[0].customtrxname) ? result[0].customtrxname : '';
                    let periodmiles = (result[0].periodmiles) ? result[0].periodmiles : 'NEW_PERIOD';
                    let description = (result[0].description) ? result[0].description : '';
                    let durationindays = periodmiles === 'NEW_PERIOD' ? (result[0].durationindays) ? result[0].durationindays.toString() : null : null;
                    let durationinmonths = periodmiles === 'NEW_PERIOD' ? (result[0].durationinmonths) ? result[0].durationinmonths.toString() : null : null;
                    let durationinyears = periodmiles === 'NEW_PERIOD' ? (result[0].durationinyears) ? result[0].durationinyears.toString() : null : null;
                    let statementcode = result[0].statementcode ? result[0].statementcode : null;
                    let statementname = result[0].statementname ? result[0].statementname : null;
                    let durationtype = periodmiles === 'NEW_PERIOD' ? result[0].durationtype ? result[0].durationtype : null : null;
                    let periodendmonth = (durationtype === 'MONTH') ? result[0].periodendmonth : false;
                    let periodendyear = (durationtype === 'YEAR') ? result[0].periodendyear : false;
                    let durationindate = (result[0].durationtype === 'DATE' && result[0].durationindate) ? moment(result[0].durationindate) : null;
                    let validforearn = (result[0].validforearn) ? result[0].validforearn : false;
                    let validforredeem = (result[0].validforredeem) ? result[0].validforredeem : false;
                    let validfortransfer = (result[0].validfortransfer) ? result[0].validfortransfer : false;
                    let validforbuy = (result[0].validforbuy) ? result[0].validforbuy : false;
                    let extendable = (result[0].extendable) ? result[0].extendable : false;
                    let updatemembershipperiod = (result[0].updatemembershipperiod) ? result[0].updatemembershipperiod : false;
                    let checkduplicatemerge = (result[0].checkduplicatemerge) ? result[0].checkduplicatemerge : false;
                    let correctionmerge = (result[0].correctionmerge) ? result[0].correctionmerge : false;


                    let setValue = {
                        customtrxcode, customtrxname, description, durationtype, durationindays, durationinmonths, durationinyears, statementcode, checkduplicatemerge, correctionmerge,
                        periodendmonth, periodendyear, durationindate, validforearn, validforredeem, validfortransfer, validforbuy, extendable, updatemembershipperiod, periodmiles
                    };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({
                        fieldvalue: {
                            ...this.state.fieldvalue, durationtype, correctionmerge: checkduplicatemerge, periodmile: (validforearn || validforredeem || validforbuy) ? false : true,
                            validfortransfer, validforredeem, periodmiles, visible: periodmiles === 'NEW_PERIOD' ? true : false, validforbuy, validforearn
                        }
                    });

                    //load options select2
                    this.componentStatementSelect.retrieveData({}, { statementcode, statementname }, actionspage);
                    this.componentCustomTransactionSelect.retrieveData({}, { customtrxcode, customtrxname }, actionspage);
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
                let customtrxcode = input.customtrxcode.toUpperCase();
                let customtrxname = input.customtrxname;
                let statementcode = input.statementcode;
                let description = (input.description && input.description.length > 0) ? input.description : null;
                let periodmiles = input.periodmiles;
                let durationtype = periodmiles === 'NEW_PERIOD' ? input.durationtype : null;
                let durationindays = periodmiles === 'NEW_PERIOD' ? (input.durationtype === 'DAY') ? input.durationindays : null : null;
                let durationindate = periodmiles === 'NEW_PERIOD' ? (input.durationtype === 'DATE') ? moment(input.durationindate).format("YYYY-MM-DD") : null : null;
                let periodendmonth = periodmiles === 'NEW_PERIOD' ? (input.durationtype === 'MONTH') ? input.periodendmonth ? true : false : false : false;
                let durationinmonths = periodmiles === 'NEW_PERIOD' ? (input.durationtype === 'MONTH') ? input.durationinmonths : null : null;
                let periodendyear = periodmiles === 'NEW_PERIOD' ? (input.durationtype === 'YEAR') ? input.periodendyear ? true : false : false : false;
                let durationinyears = periodmiles === 'NEW_PERIOD' ? (input.durationtype === 'YEAR') ? input.durationinyears : null : null;
                let validforearn = (input.validforearn) ? input.validforearn : false;
                let validforredeem = (input.validforredeem) ? input.validforredeem : false;
                let validfortransfer = (input.validfortransfer) ? input.validfortransfer : false;
                let validforbuy = (input.validforbuy) ? input.validforbuy : false;
                let extendable = (input.extendable) ? input.extendable : false;
                let updatemembershipperiod = input.updatemembershipperiod;
                let checkduplicatemerge = input.checkduplicatemerge;
                let correctionmerge = (input.correctionmerge) ? input.correctionmerge : null;


                let data = {
                    customtrxcode, customtrxname, statementcode, description, durationtype, durationindays, durationindate, periodendmonth, periodendyear, correctionmerge,
                    durationinmonths, durationinyears, validforearn, validforredeem, validfortransfer, validforbuy, extendable, updatemembershipperiod, checkduplicatemerge, periodmiles
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.customtransaction.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.customtransaction.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/custom-transaction');
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

    handleValidationDurationInDay = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        callback();
    }

    onChangeDurationType = (event) => {
        let durationtype = event === null ? null : event.target.value;

        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, durationtype } });
    }

    onChangeCheckDuplicate = (value) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, correctionmerge: value } });
    }

    onChangeChecklist = (value, type) => {
        let { validforearn, validforredeem, validfortransfer, validforbuy, periodmile } = this.state.fieldvalue;
        periodmile = (type === 'transfer' && value.target.checked) && !validforearn && !validforredeem && !validforbuy ? false :
            (type === 'transfer' && !value.target.checked) ? true : (type !== 'transfer' && value.target.checked) ? true : 
                (type !== 'transfer' && !value.target.checked && ((!validforearn && !validforredeem) || (!validforredeem && !validforbuy) || (!validforearn && !validforbuy)) && validfortransfer) ? false : true;

        this.setState({
            fieldvalue: {
                ...this.state.fieldvalue, visible: false, periodmile,
                validforearn: (type === 'earn') ? value.target.checked : validforearn,
                validforredeem: (type === 'redeem') ? value.target.checked : validforredeem,
                validfortransfer: (type === 'transfer') ? value.target.checked : validfortransfer,
                validforbuy: (type === 'buy') ? value.target.checked : validforbuy,
            }
        });
        this.props.form.resetFields(['periodmiles', []]);
    }

    onChangePeriodMiles = (value) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, visible: value === 'NEW_PERIOD' ? true : false, periodmiles: value } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };
        const { titlepage, actionspage, formrender, fieldvalue, fielddisabled } = this.state;
        const { durationtype, correctionmerge, visible, periodmile, periodmiles } = fieldvalue
        const { specialfielddisabled, generalfielddisabled } = fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Custom Transaction | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Custom Transaction</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={{ span: 18, offset: 4 }}>
                                    <InputText labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Custom Trx Code" datafield="customtrxcode" validationrules={['required', 'pattern.alphanumeric', 'max.20',]} maxLength={20} disabled={specialfielddisabled} />
                                    <InputText labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Custom Trx Name" datafield="customtrxname" validationrules={['required', 'max.255']} maxLength={255} disabled={generalfielddisabled} />
                                    <StatementSelect labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} ref={(e) => { this.componentStatementSelect = e }} form={this.props.form} labeltext="Statement" datafield="statementcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    {/* <CheckBoxPlainList labeltext="" form={this.props.form} datafield="validfor" defaultValue={this.state.daylist} initialValue={this.state.dayDetail ? this.state.dayDetail['daylist'] : ''} options={optionsDayList} onChange={this.onChangeCb} disabled={generalfielddisabled} /> */}
                                    <Row gutter={24} style={{ marginBottom: 12 }}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 6, offset: 7 }} xl={{ span: 6, offset: 7 }}>
                                            <CheckboxBase form={this.props.form} datafield='validforearn' disabled={generalfielddisabled} onChange={(value) => this.onChangeChecklist(value, 'earn')}> Valid For Earn</CheckboxBase>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={9} xl={9}>
                                            <CheckboxBase form={this.props.form} datafield='validforredeem' disabled={generalfielddisabled} onChange={(value) => this.onChangeChecklist(value, 'redeem')}> Valid For Redeem</CheckboxBase>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 6, offset: 7 }} xl={{ span: 6, offset: 7 }}>
                                            <CheckboxBase form={this.props.form} datafield='validfortransfer' disabled={generalfielddisabled} onChange={(value) => this.onChangeChecklist(value, 'transfer')}> Valid For Transfer</CheckboxBase>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={9} xl={9}>
                                            <CheckboxBase form={this.props.form} datafield='validforbuy' disabled={generalfielddisabled} onChange={(value) => this.onChangeChecklist(value, 'buy')}> Valid For Buy</CheckboxBase>
                                        </Col>
                                    </Row>
                                    <SwitchButton labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Extendable" datafield="extendable" defaultChecked={false} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labelCol={{ span: 7 }} labeltext="Update Membership Period" datafield="updatemembershipperiod" defaultChecked={false} disabled={generalfielddisabled} />
                                    <SwitchButton labelCol={{ span: 7 }} form={this.props.form} labeltext="Check Duplicate Merge" datafield="checkduplicatemerge" defaultChecked={false} disabled={generalfielddisabled} onChange={this.onChangeCheckDuplicate} />
                                    <CustomTransactionSelect labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} ref={(e) => { this.componentCustomTransactionSelect = e }} form={this.props.form} labeltext="Correction Merge" datafield="correctionmerge" validationrules={[correctionmerge ? 'required' : '']} disabled={generalfielddisabled} />
                                    <TextArea labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Description" datafield="description" disabled={generalfielddisabled} maxLength={255} />
                                    <SelectBase labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Period Miles" datafield="periodmiles" options={periodmile ? PeriodMile : PeriodMiles} validationrules={['required']} onChange={this.onChangePeriodMiles} />
                                    <Row className={(visible) ? '' : 'hidden'}>
                                        <RadioButton labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Duration Type" datafield="durationtype" options={optionsDurationType} validationrules={[periodmiles === 'NEW_PERIOD' ? 'required' : null]} onChange={this.onChangeDurationType} disabled={generalfielddisabled} />
                                        <InputText labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Duration In Months" datafield="durationinmonths" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(!visible && durationtype === 'MONTH') ? ['required', 'pattern.number', 'max.2', this.handleValidationDurationInMonth] : null} maxLength="2" disabled={generalfielddisabled} suffix="Months" />
                                        <InputText labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Duration In Years" datafield="durationinyears" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(!visible && durationtype === 'YEAR') ? ['required', 'pattern.number', 'max.2', this.handleValidationDurationInYear] : null} maxLength="2" disabled={generalfielddisabled} suffix="Years" />
                                        <SwitchButton labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Periode End Month" datafield="periodendmonth" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(!visible && durationtype === 'MONTH') ? ['required'] : null} disabled={generalfielddisabled} />
                                        <SwitchButton labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Periode End Year" datafield="periodendyear" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(!visible && durationtype === 'YEAR') ? ['required'] : null} disabled={generalfielddisabled} />
                                        <DatePickerBase labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Duration Date" datafield="durationindate" className={(durationtype !== 'DATE') ? 'hidden' : ''} validationrules={(!visible && durationtype === 'DATE') ? ['required'] : null} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
                                        <InputText labelCol={{ span: 7 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Duration In Days" datafield="durationindays" className={(durationtype !== 'DAY') ? 'hidden' : ''} validationrules={(!visible && durationtype === 'DAY') ? ['required', 'pattern.number', this.handleValidationDurationInDay] : null} maxLength="5" disabled={generalfielddisabled} suffix="Days" />
                                    </Row>
                                </Col >
                            </Row >
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
                                <Button url="/custom-transaction" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form >
                    </Spin >
                </Row >
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));