import React, { Component } from 'react';
import { SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from 'react-redux';
import { InputText, Button, Alert, TierCascender, SelectBase, DateRangeBase, DatePickerBase, SwitchButton } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { DurationPeriod, DurationExpiry } from '../../data';
import moment from 'moment';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fieldvalue: {
                setdowngrade: true,
                setmaintain: true,
                setupgrade: true,
                downgradedurationperiod: null,
                managedurationperiod: null,
                upgradedurationperiod: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    };

    componentDidMount() {
        document.title = 'Create Tier Duration | Loyalty Management System';
        this.componentTierCascender.retrieveData();
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { setdowngrade, downgradedurationperiod, downgradedurationexpiry, downgradedurationmonths, downgradedurationinyears, downgradedateperiod, downgradeageperiod, downgradeperiodendmonth, downgradeperiodendyear, downgradedate,
                    setmaintain, maintaindurationperiod, maintaindurationexpiry, maintaindurationmonths, maintaindurationinyears, maintaindateperiod, maintainageperiod, maintainperiodendmonth, maintainperiodendyear, maintaindate,
                    setupgrade, upgradedurationperiod, upgradedurationexpiry, upgradedurationmonths, upgradedurationinyears, upgradedateperiod, upgradeageperiod, upgradeperiodendmonth, upgradeperiodendyear, upgradedate, tierid } = input || {};
                const durationType = ['DOWNGRADE', 'MAINTAIN', 'UPGRADE'];
                const downgradeData = { downgradedurationperiod, downgradedurationexpiry, downgradedurationmonths, downgradedurationinyears, downgradedateperiod, downgradeageperiod, downgradeperiodendmonth, downgradeperiodendyear, downgradedate };
                const maintainData = { maintaindurationperiod, maintaindurationexpiry, maintaindurationmonths, maintaindurationinyears, maintaindateperiod, maintainageperiod, maintainperiodendmonth, maintainperiodendyear, maintaindate };
                const upgradeData = { upgradedurationperiod, upgradedurationexpiry, upgradedurationmonths, upgradedurationinyears, upgradedateperiod, upgradeageperiod, upgradeperiodendmonth, upgradeperiodendyear, upgradedate };

                let availableSetup = [setdowngrade, setmaintain, setupgrade];
                let availableData = [downgradeData, maintainData, upgradeData];
                let data = [];

                for (let i = 0; i < durationType.length; i++) {
                    if (availableSetup[i]) {
                        let durationperiod = availableData[i][`${durationType[i].toLowerCase()}durationperiod`];
                        let durationexpiry = availableData[i][`${durationType[i].toLowerCase()}durationexpiry`];
                        let dateperiod = availableData[i][`${durationType[i].toLowerCase()}dateperiod`];
                        let durationmonths = availableData[i][`${durationType[i].toLowerCase()}durationmonths`];
                        let periodendmonth = (availableData[i][`${durationType[i].toLowerCase()}periodendmonth`]) ? true : false;
                        let durationinyears = availableData[i][`${durationType[i].toLowerCase()}durationinyears`];
                        let periodendyear = (availableData[i][`${durationType[i].toLowerCase()}periodendyear`]) ? true : false;
                        let ageperiod = availableData[i][`${durationType[i].toLowerCase()}ageperiod`];
                        let effectivedate = (availableData[i][`${durationType[i].toLowerCase()}date`]) ? moment(availableData[i][`${durationType[i].toLowerCase()}date`][0]).format('YYYY-MM-DD') : null;
                        let discontinuedate = (availableData[i][`${durationType[i].toLowerCase()}date`]) ? moment(availableData[i][`${durationType[i].toLowerCase()}date`][1]).format('YYYY-MM-DD') : null;

                        data.push({
                            durationperiod, durationexpiry, dateperiod, durationmonths, periodendmonth, durationinyears, periodendyear, ageperiod, effectivedate, discontinuedate,
                            membershiptypeid: (tierid && tierid[0]) ? tierid[0] : null,
                            membershipid: (tierid && tierid[1]) ? tierid[1] : null,
                            tierid: (tierid && tierid[2]) ? tierid[2] : null,
                            durationtype: durationType[i],
                        });
                    }
                }

                SaveRequest(api.url.tierduration.createbulk, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : 'New data has been created');
                        this.props.history.push('/tier-duration');
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleValidationDurationInMonth = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        else if (value && value > 99999) callback('Maximum duration of 99999');
        callback();
    };

    handleValidationDurationInYear = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        else if (value && value > 99999) callback('Maximum duration of 99999');
        callback();
    };

    handleValidationMaxAge = (rule, value, callback) => {
        if (value && value < 1) { callback('Duration must start from 1'); }
        else if (value && value > 999) callback('Maximum duration of 999');
        callback();
    };

    onChangeDurationPeriod = (durationperiod, type) => {
        const { fieldvalue } = this.state;
        if (type === 'downgrade') {
            this.setState({ fieldvalue: { ...fieldvalue, downgradedurationperiod: durationperiod } });
            this.props.form.setFieldsValue({
                downgradedurationexpiry: null, downgradedurationmonths: null, downgradedateperiod: null, downgradeperiodendmonth: false, downgradedurationinyears: null, downgradeperiodendyear: false, downgradeageperiod: null
            });
        } else if (type === 'maintain') {
            this.setState({ fieldvalue: { ...fieldvalue, maintaindurationperiod: durationperiod } });
            this.props.form.setFieldsValue({
                maintaindurationexpiry: null, maintaindurationmonths: null, maintaindateperiod: null, maintainperiodendmonth: false, maintaindurationinyears: null, maintainperiodendyear: false, maintainageperiod: null
            });
        } else {
            this.setState({ fieldvalue: { ...fieldvalue, upgradedurationperiod: durationperiod } });
            this.props.form.setFieldsValue({
                upgradedurationexpiry: null, upgradedurationmonths: null, upgradedateperiod: null, upgradeperiodendmonth: false, upgradedurationinyears: null, upgradeperiodendyear: false, upgradeageperiod: null
            });
        }
    };

    onChangeType = (value, type) => {
        let { downgradedurationperiod, maintaindurationperiod, upgradedurationperiod } = this.state.fieldvalue;
        if (type === 'setdowngrade' && !value) {
            downgradedurationperiod = null;
            this.props.form.resetFields(['downgradedurationperiod', 'downgradedurationexpiry', 'downgradedurationmonths', 'downgradedateperiod', 'downgradeperiodendmonth', 'downgradedurationinyears', 'downgradeperiodendyear', 'downgradeageperiod', 'downgradedate', []]);
        } else if (type === 'setmaintain' && !value) {
            maintaindurationperiod = null;
            this.props.form.resetFields(['maintaindurationperiod', 'maintaindurationexpiry', 'maintaindurationmonths', 'maintaindateperiod', 'maintainperiodendmonth', 'maintaindurationinyears', 'maintainperiodendyear', 'maintainageperiod', 'maintaindate', []]);
        } else if (type === 'setupgrade' && !value) {
            upgradedurationperiod = null;
            this.props.form.resetFields(['upgradedurationperiod', 'upgradedurationexpiry', 'upgradedurationmonths', 'upgradedateperiod', 'upgradeperiodendmonth', 'upgradedurationinyears', 'upgradeperiodendyear', 'upgradeageperiod', 'upgradedate', []]);
        };

        this.setState({ fieldvalue: { ...this.state.fieldvalue, downgradedurationperiod, maintaindurationperiod, upgradedurationperiod, [type]: value } })
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { menucode, prefixmenuname } = this.props || {};
        const { fieldvalue, fielddisabled, isLoading } = this.state || {};
        const { generalfielddisabled } = fielddisabled || {};
        const { downgradedurationperiod, maintaindurationperiod, upgradedurationperiod, setdowngrade, setmaintain, setupgrade } = fieldvalue || {};

        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Create Tier Duration</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <TierCascender ref={(e) => { this.componentTierCascender = e }} form={this.props.form} labeltext='Tier' datafield='tierid' validationrules={['required']} disabled={generalfielddisabled} />
                            </Col>
                            <Divider orientation='left' style={{ padding: '20px 130px 0px 130px' }}>Downgrade</Divider>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <SwitchButton form={this.props.form} labeltext='Set Duration Type' datafield='setdowngrade' disabled={generalfielddisabled} defaultChecked={true} onChange={(val) => this.onChangeType(val, 'setdowngrade')} />
                                <SelectBase form={this.props.form} labeltext='Duration Period' datafield='downgradedurationperiod' options={DurationPeriod} onChange={(val) => this.onChangeDurationPeriod(val, 'downgrade')} validationrules={(setdowngrade) ? ['required'] : []} disabled={(!setdowngrade) ? true : generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext='Duration Expiry' datafield='downgradedurationexpiry' options={DurationExpiry} className={(downgradedurationperiod === 'RANGE') ? '' : 'hidden'} validationrules={(downgradedurationperiod === 'RANGE' && setdowngrade) ? ['required'] : []} disabled={(!setdowngrade) ? true : generalfielddisabled} />
                                <InputText form={this.props.form} labeltext='Duration In Month' datafield='downgradedurationmonths' className={(downgradedurationperiod === 'RANGE' || downgradedurationperiod === 'MONTH') ? '' : 'hidden'} validationrules={((downgradedurationperiod === 'RANGE' || downgradedurationperiod === 'MONTH') && setdowngrade) ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInMonth] : []} maxLength={5} disabled={(!setdowngrade) ? true : generalfielddisabled} suffix='Months' />
                                <InputText form={this.props.form} labeltext='Duration In Year' datafield='downgradedurationinyears' className={(downgradedurationperiod === 'YEAR') ? '' : 'hidden'} validationrules={(downgradedurationperiod === 'YEAR' && setdowngrade) ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInYear] : []} maxLength={5} disabled={(!setdowngrade) ? true : generalfielddisabled} suffix='Year' />
                                <DatePickerBase form={this.props.form} labeltext='Specific Date Period' datafield='downgradedateperiod' className={(downgradedurationperiod === 'DATE') ? '' : 'hidden'} validationrules={(downgradedurationperiod === 'DATE' && setdowngrade) ? ['required'] : []} minDate={moment()} disabled={(!setdowngrade) ? true : generalfielddisabled} />
                                <InputText form={this.props.form} labeltext='Max Age' datafield='downgradeageperiod' className={(downgradedurationperiod === 'AGE') ? '' : 'hidden'} validationrules={(downgradedurationperiod === 'AGE' && setdowngrade) ? ['required', 'pattern.number', 'max.3', this.handleValidationMaxAge] : []} maxLength={3} disabled={(!setdowngrade) ? true : generalfielddisabled} suffix='Years Old' />
                                <SwitchButton form={this.props.form} labeltext='Periode End Month' datafield='downgradeperiodendmonth' className={(downgradedurationperiod === 'MONTH') ? '' : 'hidden'} validationrules={(setdowngrade) ? ['required'] : []} disabled={(!setdowngrade) ? true : generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext='Periode End Year' datafield='downgradeperiodendyear' className={(downgradedurationperiod === 'YEAR') ? '' : 'hidden'} validationrules={(setdowngrade) ? ['required'] : []} disabled={(!setdowngrade) ? true : generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext='Date' datafield='downgradedate' placeholder={['Effective Date', 'Discontinue Date']} validationrules={(setdowngrade) ? ['required'] : []} minDate={moment().add(1, 'day')} disabled={(!setdowngrade) ? true : generalfielddisabled} />
                            </Col>
                            <Divider orientation='left' style={{ padding: '20px 130px 0px 130px' }}>Maintain</Divider>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <SwitchButton form={this.props.form} labeltext='Set Duration Type' datafield='setmaintain' disabled={generalfielddisabled} defaultChecked={true} onChange={(val) => this.onChangeType(val, 'setmaintain')} />
                                <SelectBase form={this.props.form} labeltext='Duration Period' datafield='maintaindurationperiod' options={DurationPeriod} onChange={(val) => this.onChangeDurationPeriod(val, 'maintain')} validationrules={(setmaintain) ? ['required'] : []} disabled={(setmaintain) ? generalfielddisabled : true} />
                                <SelectBase form={this.props.form} labeltext='Duration Expiry' datafield='maintaindurationexpiry' options={DurationExpiry} className={(maintaindurationperiod === 'RANGE') ? '' : 'hidden'} validationrules={(maintaindurationperiod === 'RANGE' && setmaintain) ? ['required'] : []} disabled={(setmaintain) ? generalfielddisabled : true} />
                                <InputText form={this.props.form} labeltext='Duration In Month' datafield='maintaindurationmonths' className={(maintaindurationperiod === 'RANGE' || maintaindurationperiod === 'MONTH') ? '' : 'hidden'} validationrules={((maintaindurationperiod === 'RANGE' || maintaindurationperiod === 'MONTH') && setmaintain) ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInMonth] : []} maxLength={5} disabled={(setmaintain) ? generalfielddisabled : true} suffix='Months' />
                                <InputText form={this.props.form} labeltext='Duration In Year' datafield='maintaindurationinyears' className={(maintaindurationperiod === 'YEAR') ? '' : 'hidden'} validationrules={(maintaindurationperiod === 'YEAR' && setmaintain) ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInYear] : []} maxLength={5} disabled={(setmaintain) ? generalfielddisabled : true} suffix='Year' />
                                <DatePickerBase form={this.props.form} labeltext='Specific Date Period' datafield='maintaindateperiod' className={(maintaindurationperiod === 'DATE') ? '' : 'hidden'} validationrules={(maintaindurationperiod === 'DATE' && setmaintain) ? ['required'] : []} minDate={moment()} disabled={(setmaintain) ? generalfielddisabled : true} />
                                <InputText form={this.props.form} labeltext='Max Age' datafield='maintainageperiod' className={(maintaindurationperiod === 'AGE') ? '' : 'hidden'} validationrules={(maintaindurationperiod === 'AGE' && setmaintain) ? ['required', 'pattern.number', 'max.3', this.handleValidationMaxAge] : []} maxLength={3} disabled={(setmaintain) ? generalfielddisabled : true} suffix='Years Old' />
                                <SwitchButton form={this.props.form} labeltext='Periode End Month' datafield='maintainperiodendmonth' className={(maintaindurationperiod === 'MONTH') ? '' : 'hidden'} validationrules={(setmaintain) ? ['required'] : []} disabled={(setmaintain) ? generalfielddisabled : true} />
                                <SwitchButton form={this.props.form} labeltext='Periode End Year' datafield='maintainperiodendyear' className={(maintaindurationperiod === 'YEAR') ? '' : 'hidden'} validationrules={(setmaintain) ? ['required'] : []} disabled={(setmaintain) ? generalfielddisabled : true} />
                                <DateRangeBase form={this.props.form} labeltext='Date' datafield='maintaindate' placeholder={['Effective Date', 'Discontinue Date']} validationrules={(setmaintain) ? ['required'] : []} minDate={moment().add(1, 'day')} disabled={(setmaintain) ? generalfielddisabled : true} />
                            </Col>
                            <Divider orientation='left' style={{ padding: '20px 130px 0px 130px' }}>Upgrade</Divider>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <SwitchButton form={this.props.form} labeltext='Set Duration Type' datafield='setupgrade' disabled={generalfielddisabled} defaultChecked={true} onChange={(val) => this.onChangeType(val, 'setupgrade')} />
                                <SelectBase form={this.props.form} labeltext='Duration Period' datafield='upgradedurationperiod' options={DurationPeriod} onChange={(val) => this.onChangeDurationPeriod(val, 'upgrade')} validationrules={(setupgrade) ? ['required'] : []} disabled={(setupgrade) ? generalfielddisabled : true} />
                                <SelectBase form={this.props.form} labeltext='Duration Expiry' datafield='upgradedurationexpiry' options={DurationExpiry} className={(upgradedurationperiod === 'RANGE') ? '' : 'hidden'} validationrules={(upgradedurationperiod === 'RANGE' && setupgrade) ? ['required'] : []} disabled={(setupgrade) ? generalfielddisabled : true} />
                                <InputText form={this.props.form} labeltext='Duration In Month' datafield='upgradedurationmonths' className={(upgradedurationperiod === 'RANGE' || upgradedurationperiod === 'MONTH') ? '' : 'hidden'} validationrules={((upgradedurationperiod === 'RANGE' || upgradedurationperiod === 'MONTH') && setupgrade) ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInMonth] : []} maxLength={5} disabled={(setupgrade) ? generalfielddisabled : true} suffix='Months' />
                                <InputText form={this.props.form} labeltext='Duration In Year' datafield='upgradedurationinyears' className={(upgradedurationperiod === 'YEAR') ? '' : 'hidden'} validationrules={(upgradedurationperiod === 'YEAR' && setupgrade) ? ['required', 'pattern.number', 'max.5', this.handleValidationDurationInYear] : []} maxLength={5} disabled={(setupgrade) ? generalfielddisabled : true} suffix='Year' />
                                <DatePickerBase form={this.props.form} labeltext='Specific Date Period' datafield='upgradedateperiod' className={(upgradedurationperiod === 'DATE') ? '' : 'hidden'} validationrules={(upgradedurationperiod === 'DATE' && setupgrade) ? ['required'] : []} minDate={moment()} disabled={(setupgrade) ? generalfielddisabled : true} />
                                <InputText form={this.props.form} labeltext='Max Age' datafield='upgradeageperiod' className={(upgradedurationperiod === 'AGE') ? '' : 'hidden'} validationrules={(upgradedurationperiod === 'AGE' && setupgrade) ? ['required', 'pattern.number', 'max.3', this.handleValidationMaxAge] : []} maxLength={3} disabled={(setupgrade) ? generalfielddisabled : true} suffix='Years Old' />
                                <SwitchButton form={this.props.form} labeltext='Periode End Month' datafield='upgradeperiodendmonth' className={(upgradedurationperiod === 'MONTH') ? '' : 'hidden'} validationrules={(setupgrade) ? ['required'] : []} disabled={(setupgrade) ? generalfielddisabled : true} />
                                <SwitchButton form={this.props.form} labeltext='Periode End Year' datafield='upgradeperiodendyear' className={(upgradedurationperiod === 'YEAR') ? '' : 'hidden'} validationrules={(setupgrade) ? ['required'] : []} disabled={(setupgrade) ? generalfielddisabled : true} />
                               <DateRangeBase form={this.props.form} labeltext='Date' datafield='upgradedate' placeholder={['Effective Date', 'Discontinue Date']} validationrules={(setupgrade) ? ['required'] : []} minDate={moment().add(1, 'day')} disabled={(setupgrade) ? generalfielddisabled : true} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE'></Button>
                            <Button url='/tier-duration' htmlType='link' type='default' label='Back' />
                        </Row>
                    </Form>
                </Spin>
            </Row >
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));