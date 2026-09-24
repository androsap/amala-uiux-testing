import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { SwitchButton, Button, Alert, SelectBase, InputText, DateRangeBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Select } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsDuration = [
    { label: 'MONTH', value: 'MONTH' },
    { value: 'AGE', label: 'AGE' }
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
                durationtype: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },
        }
    }

    checkPermission() {
        let id = this.props.qualificationid;
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
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (qualificationid) => {
        let url = api.url.membership.qualification.list;
        let criteria = { qualificationid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let active = (result[0].active) ? result[0].active : null;
                let qualificationid = (result[0].qualificationid) ? result[0].qualificationid : null;
                let membershipid = (result[0].membershipid) ? result[0].membershipid : null;
                let durationtype = (result[0].durationtype) ? result[0].durationtype : null;
                let durationmonth = (result[0].durationmonth) ? result[0].durationmonth : null;
                let durationyear = (result[0].durationyear) ? result[0].durationyear : null;
                let periodendmonth = (result[0].periodendmonth) ? result[0].periodendmonth : false
                let periodendyear = (result[0].periodendyear) ? result[0].periodendyear : false
                let ageperiod = (result[0].ageperiod) ? result[0].ageperiod : null;
                let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                let date = [effectivedate, discontinuedate];

                let setValue = { active, qualificationid, membershipid, durationtype, durationmonth, durationyear, periodendmonth, periodendyear, date, ageperiod };
                this.props.form.setFieldsValue(setValue);

                let fieldvalue = { ...this.state.fieldvalue, durationtype };
                this.setState({ fieldvalue });
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
                let active = true;
                let qualificationid = (actionspage === 'update') ? this.props.qualificationid : null;
                let membershipid = this.props.membershipid;
                let durationtype = (input.durationtype) ? (input.durationtype) : null;
                let durationmonth = (input.durationmonth) ? input.durationmonth : null;
                let durationyear = (input.durationyear) ? input.durationyear : null;
                let periodendmonth = (input.durationtype === 'MONTH') ? input.periodendmonth ? true : false : null;
                let ageperiod = (input.durationtype === 'AGE') ? input.ageperiod : null;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let data = { active, qualificationid, membershipid, durationmonth, durationyear, durationtype, effectivedate, discontinuedate, periodendmonth, ageperiod };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.membership.qualification.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.membership.qualification.update;
                }
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.changePage({ page: 'index' });
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleChangePage(page, qualificationid = '') {
        this.props.changePage({ page, qualificationid });
    }

    onChangeDurationType = () => {
        this.props.form.resetFields(['durationmonth', []]);
        this.props.form.resetFields(['durationyear', []]);
        this.props.form.resetFields(['periodendmonth', []]);
        this.props.form.resetFields(['periodendyear', []]);
        this.props.form.resetFields(['ageperiod', []]);
    }

    handleValidationDurationInMonth = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        callback();
    }

    handleValidationDurationInYear = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        callback();
    }

    handleValidationMaxAge = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        else if (value && value > 999) { callback('Maximum duration of 999'); }
        callback();
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, formrender, actionspage } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const durationtype = this.props.form.getFieldValue('durationtype');
        
        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Qualification (Upgrade Period) | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Qualification (Upgrade Period)</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Duration Type" datafield="durationtype" options={optionsDuration} validationrules={['required']} onChange={this.onChangeDurationType}/>
                                    <InputText form={this.props.form} labeltext="Duration In Months" datafield="durationmonth" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(durationtype === 'MONTH') ? ['required', 'pattern.number', this.handleValidationDurationInMonth] : null} maxLength={5} disabled={generalfielddisabled} suffix="Months" />
                                    <InputText form={this.props.form} labeltext="Max Age" datafield="ageperiod" className={(durationtype !== 'AGE') ? 'hidden' : ''} validationrules={(durationtype === 'AGE') ? ['required', 'pattern.number', this.handleValidationMaxAge] : null} maxLength={3} disabled={generalfielddisabled} suffix="Years Old" />
                                    <SwitchButton form={this.props.form} labeltext="Periode End Month" datafield="periodendmonth" className={(durationtype !== 'MONTH') ? 'hidden' : ''} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} minDate={moment()} validationrules={['required']}/>
                                </Col>
                            </Row>
                            <br></br>
                            <br></br>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button htmlType="button" type="default" label="Back" onClick={() => this.handleChangePage('index')} />
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