import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, TierSelect, CustomTransactionSelect, DateRangeBase, SelectBase, CheckBoxList } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Tooltip, Icon } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsFileType = [
    { value: 'MOBILE', label: 'MOBILE' },
    { value: 'WEBSITE', label: 'WEBSITE' },
    { value: 'BO', label: 'BO' },
    { value: 'CHECKIN', label: 'CHECK-IN' },
    { value: 'PARTNER', label: 'PARTNER' },
    { value: 'COBRAND', label: 'COBRAND' },
    { value: 'CHARITY', label: 'CHARITY' },
    { value: 'CORPORATE', label: 'CORPORATE' }
]

const optionsGetBonus = [
    { label: 'Enrollment', value: 'ENROLLMENT' },
    { label: 'First Activity', value: 'FIRST_ACTIVITY' }
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
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },
            fieldvalue: {
                tierreferralbonusid: null,
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
                this.componentTierSelect.retrieveWithMembership();
                this.componentCustomTrxSelect.retrieveData();
                this.componentCustomTrxRefSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (tierreferralbonusid, actionspage) => {
        let url = api.url.referralbonus.list;
        let criteria = { tierreferralbonusid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status = {}, result } = response || {};
            const { tierid, tiername, startperiod, endperiod, customtrxcode, customtrxname, customtrxcoderef, customtrxnameref,
                enrollchannel, awardmiles, tiermiles, frequency, awardmilesref, tiermilesref, frequencyref, maxreferring, getbonuswhen,
                getbonuswhenref, active } = result[0] || {};
            if (status.responsecode === "0000") {
                let perioddate = [moment(startperiod), moment(endperiod)];
                awardmiles.toString();
                tiermiles.toString();
                frequency.toString();
                
                let generalfielddisabled = (actionspage !== "view") ? !active : true;

                let setValue = {
                    tierid, perioddate, customtrxcode, customtrxcoderef, tiermiles, awardmiles, frequency, getbonuswhen,
                    enrollchannel: (enrollchannel && enrollchannel.length > 0) ? enrollchannel : [],
                    awardmilesref: (awardmilesref) ? awardmilesref.toString() : 0,
                    tiermilesref: (tiermilesref) ? tiermilesref.toString() : 0,
                    frequencyref: (frequencyref) ? frequencyref.toString() : 0,
                    maxreferring: maxreferring ? maxreferring.toString() : null,
                    getbonuswhenref: (getbonuswhenref) ? getbonuswhenref : undefined
                };
                this.props.form.setFieldsValue(setValue);
                this.setState({
                    fielddisabled: { ...this.state.fielddisabled, generalfielddisabled },
                    fieldvalue: { tierreferralbonusid, active }
                });
                this.componentTierSelect.retrieveWithMembership({}, { tierid, tiername }, actionspage);
                this.componentCustomTrxSelect.retrieveData({}, { customtrxcode, customtrxname }, actionspage);
                this.componentCustomTrxRefSelect.retrieveData({}, { customtrxcoderef, customtrxnameref }, actionspage);
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
                const { tierid, customtrxcode, customtrxcoderef, awardmiles, tiermiles, frequency,
                    awardmilesref, tiermilesref, frequencyref, maxreferring, getbonuswhen, getbonuswhenref } = input || {};
                let startperiod = (input.perioddate[0]) ? moment(input.perioddate[0]).format("YYYY-MM-DD") : null;
                let endperiod = (input.perioddate[1]) ? moment(input.perioddate[1]).format("YYYY-MM-DD") : null;
                let enrollchannel = (input.enrollchannel) ? input.enrollchannel : [];

                let data = {
                    tierid, startperiod, endperiod, customtrxcode, customtrxcoderef, awardmiles, tiermiles, frequency, enrollchannel,
                    awardmilesref, tiermilesref, frequencyref, maxreferring, getbonuswhen, getbonuswhenref
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.referralbonus.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.referralbonus.update;
                    data.tierreferralbonusid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.goBack();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    deleteData(tierreferralbonusid, active) {
        let url = (active) ? api.url.referralbonus.deactivate : api.url.referralbonus.activate;
        let data = { tierreferralbonusid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    render() {
        const { menucode, prefixmenuname, form } = this.props;
        const { titlepage, actionspage, formrender, isLoading } = this.state;
        const { tierreferralbonusid, active } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;

        const refferalTooltip = `Existing member that refer code to new member`;
        const referenceTooltip = `New Member that enroll with referral code`;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 }
        };

        let getbonuswhenref = this.props.form.getFieldValue('getbonuswhenref');

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Referral Bonus | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Referral Bonus</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 4 }} xl={{ span: 14, offset: 4 }}>
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <CheckBoxList style={{ marginTop: 10 }} form={form} labeltext="Enroll Channel" datafield="enrollchannel" options={optionsFileType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={form} labeltext="Date Period" datafield="perioddate" placeholder={['Start Period', 'End Period']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Max. Referring" datafield="maxreferring" validationrules={['pattern.number']} maxLength={45} disabled={generalfielddisabled} />

                                    <Title level={4} style={{ marginTop: 30 }}>Bonus Member Referral  <Tooltip placement="top" title={refferalTooltip}><Icon type='info-circle' theme='twoTone' style={{ marginLeft: 10, fontSize: '15px' }} /></Tooltip></Title>
                                    <Divider style={{ marginTop: 0 }} />
                                    <SelectBase form={form} labeltext="Get Bonus When Reference" datafield="getbonuswhen" validationrules={['required']} options={optionsGetBonus} disabled={generalfielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTrxSelect = e }} form={form} labeltext="Custom Transaction Referral" datafield="customtrxcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Award Miles" datafield="awardmiles" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Tier Miles" datafield="tiermiles" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Frequency" datafield="frequency" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />

                                    <Title level={4} style={{ marginTop: 30 }}>Bonus Member Reference <Tooltip placement="top" title={referenceTooltip}><Icon type='info-circle' theme='twoTone' style={{ marginLeft: 10, fontSize: '15px' }} /></Tooltip></Title>
                                    <Divider style={{ marginTop: 0 }} />
                                    <SelectBase form={form} labeltext="Get Bonus When Reference" datafield="getbonuswhenref" options={optionsGetBonus} disabled={generalfielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTrxRefSelect = e }} form={form} labeltext="Custom Transaction Reference" datafield="customtrxcoderef" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Award Miles" datafield="awardmilesref" validationrules={(getbonuswhenref) ? ['required', 'pattern.number'] : ['pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Tier Miles" datafield="tiermilesref" validationrules={(getbonuswhenref) ? ['required', 'pattern.number'] : ['pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Frequency" datafield="frequencyref" validationrules={(getbonuswhenref) ? ['required', 'pattern.number'] : ['pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create' && active) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && active) ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                {
                                    (actionspage !== 'create') ? (active) ?
                                        <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(tierreferralbonusid, active)} /> :
                                        <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(tierreferralbonusid, active)} /> : null
                                }
                                {/* <Button htmlType="button" type="default" label="Back" onClick={() => { this.props.history.goBack() }} /> */}
                                <Button url="/referral-bonus" htmlType="link" type="default" label="Back" />
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
