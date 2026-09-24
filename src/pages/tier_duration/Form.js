import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, TierCascender, RadioButton, SelectBase, DateRangeBase, DatePickerBase, SwitchButton } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';
import { DurationType, DurationPeriod, DurationExpiry } from '../../data';

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
                durationperiod: null,
                durationtype: null,
                periodendyear: null
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
                this.componentTierCascender.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
        // let tierid = ['20190405001', 'IND00000000000000002', 'TEST065']

        // this.props.form.setFieldsValue({ tierid })
    }

    getDetail = (tierdurationid, actionspage) => {
        let url = api.url.tierduration.list;
        let criteria = { tierdurationid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let membershiptypeid = (result[0].membershiptypeid !== undefined) ? result[0].membershiptypeid : null;
                    let membershipid = (result[0].membershipid !== undefined) ? result[0].membershipid : null;
                    let tierid = (result[0].tierid !== undefined) ? result[0].tierid : null;
                    tierid = [membershiptypeid, membershipid, tierid];
                    let durationtype = result[0].durationtype ? result[0].durationtype : null;
                    let durationperiod = result[0].durationperiod ? result[0].durationperiod : null;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let dateperiod = (result[0].dateperiod) ? moment(result[0].dateperiod) : null;
                    let durationexpiry = result[0].durationexpiry ? result[0].durationexpiry : null;
                    let durationmonths = (result[0].durationmonths !== undefined && result[0].durationmonths !== null) ? result[0].durationmonths.toString() : '';
                    let durationinyears = (result[0].durationinyears !== undefined && result[0].durationinyears !== null) ? result[0].durationinyears.toString() : '';
                    let ageperiod = (result[0].ageperiod !== undefined && result[0].ageperiod !== null) ? result[0].ageperiod.toString() : '';
                    let periodendmonth = (result[0].periodendmonth !== undefined) ? result[0].periodendmonth : false;
                    let periodendyear = (result[0].periodendyear !== undefined) ? result[0].periodendyear : false;

                    let setValue = { tierid, durationtype, durationperiod, date, durationexpiry, durationmonths, durationinyears, ageperiod, periodendmonth, periodendyear, dateperiod };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({ fieldvalue: { ...this.state.fieldvalue, durationperiod } });

                    this.componentTierCascender.retrieveData();
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
                let membershiptypeid = (input.tierid && input.tierid[0]) ? input.tierid[0] : null;
                let membershipid = (input.tierid && input.tierid[1]) ? input.tierid[1] : null;
                let tierid = (input.tierid && input.tierid[2]) ? input.tierid[2] : null;
                let durationtype = (input.durationtype !== undefined) ? input.durationtype : null;
                let durationperiod = (input.durationperiod !== undefined) ? input.durationperiod : null;
                let durationexpiry = (input.durationexpiry !== undefined) ? input.durationexpiry : null;
                let dateperiod = (input.dateperiod) ? moment(input.dateperiod).format("YYYY-MM-DD") : null;
                let durationmonths = (input.durationmonths) ? input.durationmonths : null;
                let periodendmonth = (input.periodendmonth) ? true : false;
                let durationinyears = (input.durationinyears) ? input.durationinyears : null;
                let periodendyear = (input.periodendyear) ? true : false;
                let ageperiod = (input.ageperiod !== undefined) ? input.ageperiod : null;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let data = { membershiptypeid, membershipid, tierid, durationtype, durationperiod, durationexpiry, durationmonths, dateperiod, periodendmonth, durationinyears, periodendyear, ageperiod, effectivedate, discontinuedate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.tierduration.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.tierduration.update;
                    data.tierdurationid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/tier-duration');
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
        else if (value && value > 99999) { callback('Maximum duration of 99999'); }
        callback();
    }

    handleValidationDurationInYear = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        else if (value && value > 99999) { callback('Maximum duration of 99999'); }
        callback();
    }

    handleValidationMaxAge = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        else if (value && value > 999) { callback('Maximum duration of 999'); }
        callback();
    }

    onChangeDurationPeriod = (durationperiod) => {
        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, durationperiod } });

        this.props.form.setFieldsValue({
            durationexpiry: null, durationmonths: null, dateperiod: null, periodendmonth: false,
            durationinyears: null, periodendyear: false, ageperiod: null
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, specialfielddisabled } = this.state.fielddisabled;
        const { durationperiod } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Tier Duration | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Tier Duration</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TierCascender ref={(e) => { this.componentTierCascender = e }} form={this.props.form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <RadioButton form={this.props.form} labeltext="Duration Type" datafield="durationtype" options={DurationType} validationrules={['required']} disabled={generalfielddisabled} />
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Duration Period" datafield="durationperiod" options={DurationPeriod} onChange={this.onChangeDurationPeriod} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Duration Expiry" datafield="durationexpiry" options={DurationExpiry} className={(durationperiod === 'RANGE') ? '' : 'hidden'} validationrules={(durationperiod === 'RANGE') ? ['required'] : []} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Duration In Month" datafield="durationmonths" className={(durationperiod === 'RANGE' || durationperiod === 'MONTH') ? '' : 'hidden'} validationrules={(durationperiod === 'RANGE' || durationperiod === 'MONTH') ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInMonth] : []} maxLength={5} disabled={generalfielddisabled} suffix="Months" />
                                    <InputText form={this.props.form} labeltext="Duration In Year" datafield="durationinyears" className={(durationperiod === 'YEAR') ? '' : 'hidden'} validationrules={(durationperiod === 'YEAR') ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInYear] : []} maxLength={5} disabled={generalfielddisabled} suffix="Year" />
                                    <DatePickerBase form={this.props.form} labeltext="Specific Date Period" datafield="dateperiod" className={(durationperiod === 'DATE') ? '' : 'hidden'} validationrules={(durationperiod === 'DATE') ? ['required'] : []} minDate={moment()} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Max Age" datafield="ageperiod" className={(durationperiod === 'AGE') ? '' : 'hidden'} validationrules={(durationperiod === 'AGE') ? ['required', 'pattern.number', 'max.3', this.handleValidationMaxAge] : []} maxLength={3} disabled={generalfielddisabled} suffix="Years Old" />
                                    <SwitchButton form={this.props.form} labeltext="Periode End Month" datafield="periodendmonth" className={(durationperiod === 'MONTH') ? '' : 'hidden'} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Periode End Year" datafield="periodendyear" className={(durationperiod === 'YEAR') ? '' : 'hidden'} validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
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
                                <Button url="/tier-duration" htmlType="link" type="default" label="Back" />
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