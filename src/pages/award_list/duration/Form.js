import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { Button, Alert, DatePickerBase, RadioButton, InputText, SwitchButton } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

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
                awardcodedurationid: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.awardcode;
        let awardcodedurationid = this.state.fieldvalue.awardcodedurationid;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id && awardcodedurationid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        let id = this.props.awardcode;
        this.getDetail(id);
    }

    getDetail = (awardcode) => {
        let url = api.url.awardduration.list;
        let criteria = { awardcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && awardcode) {
                let awardcodedurationid = null;
                let durationtype = null;
                if (result.length) {
                    awardcodedurationid = result[0].awardcodedurationid ? result[0].awardcodedurationid : null;
                    durationtype = result[0].durationtype ? result[0].durationtype : null;
                    let durationindate = (durationtype === 'DATE') ? moment(result[0].durationindate) : null;
                    let periodendmonth = (durationtype === 'MONTH') ? result[0].periodendmonth : false;
                    let periodendyears = (durationtype === 'YEAR') ? result[0].periodendyears : false;
                    let durationinmonths = (result[0].durationinmonths) ? result[0].durationinmonths.toString() : '';
                    let durationinyears = (result[0].durationinyears) ? result[0].durationinyears.toString() : '';
                    
                    let setValue = { durationtype, durationindate, durationinmonths, durationinyears, periodendmonth, periodendyears };
                    this.props.form.setFieldsValue(setValue);
                }
                this.setState({ fieldvalue: { ...this.state.fieldvalue, durationtype, awardcodedurationid } });
                this.checkPermission();
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
                let awardcode = this.props.awardcode;
                let durationtype = input.durationtype;
                let durationindate = (input.durationtype === 'DATE') ? moment(input.durationindate).format("YYYY-MM-DD") : null;
                let periodendmonth = (input.durationtype === 'MONTH') ? input.periodendmonth ? true : false : false;
                let durationinmonths = (input.durationtype === 'MONTH') ? parseInt(input.durationinmonths, 0) : null;
                let periodendyears = (input.durationtype === 'YEAR') ? input.periodendyears ? true : false : false;
                let durationinyears = (input.durationtype === 'YEAR') ? parseInt(input.durationinyears, 0) : null;

                let data = { awardcode, durationtype, durationindate, periodendmonth, periodendyears, durationinmonths, durationinyears };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.awardduration.create;
                } else {
                    data.awardcodedurationid = this.state.fieldvalue.awardcodedurationid;
                    message = 'Data has been updated';
                    url = api.url.awardduration.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.getDetail(awardcode);
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
        this.props.form.setFieldsValue({ durationindate: undefined, durationinmonths: undefined, periodendmonth: undefined, durationinyears: undefined, periodendyears: undefined });
    }

    handleValidationDurationInMonth = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        callback();
    }

    handleValidationDurationInYear = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        callback();
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { durationtype } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;
        const optionsDurationType = [
            { label: "Date", value: "DATE" },
            { label: "Month", value: "MONTH" },
            { label: "Year", value: "YEAR" }
        ];

        if (formrender) {
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Duration</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <RadioButton form={this.props.form} labeltext="Duration Type" datafield="durationtype" options={optionsDurationType} validationrules={['required']} onChange={this.onChangeDurationType} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Duration Date" datafield="durationindate" className={(durationtype !== 'DATE') ? 'hidden' : ''} validationrules={(durationtype === 'DATE') ? ['required'] : null} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Duration In Months" datafield="durationinmonths" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(durationtype === 'MONTH') ? ['required', 'pattern.number', this.handleValidationDurationInMonth] : null} maxLength={10} disabled={generalfielddisabled} suffix="Months" />
                                    <InputText form={this.props.form} labeltext="Duration In Years" datafield="durationinyears" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(durationtype === 'YEAR') ? ['required', 'pattern.number', this.handleValidationDurationInYear] : null} maxLength={10} disabled={generalfielddisabled} suffix="Years" />
                                    <SwitchButton form={this.props.form} labeltext="Periode End Month" datafield="periodendmonth" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(durationtype === 'MONTH') ? ['required'] : null} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Periode End Year" datafield="periodendyears" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(durationtype === 'YEAR') ? ['required'] : null} disabled={generalfielddisabled} />
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