
import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, PartnerSelect, ActivityCodeSelect, DateRangeBase, SwitchButton, LimitSelect, CustomTransactionSelect } from '../../components/Base/BaseComponent';
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
            formrender: true,
            fielddisabled: {
                generalfielddisabled: false,
                activitycodefielddisabled: true,
                mileagefielddisabled: true,
                limitfielddisabled: true
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
            let generalfielddisabled = false;
            let activitycodefielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                activitycodefielddisabled = true;
            }
            //change into update page
            let fielddisabled = { generalfielddisabled, activitycodefielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentPartnerSelect.retrieveData({ partnertype: 'NONAIR' });
            }
        }
        this.componentActivityCodeSelect.retrieveData();
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (nonairruleid, actionspage) => {
        let url = api.url.accrualrulenonair.list;
        let criteria = { nonairruleid };
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let nonairrulename = (result[0].nonairrulename) ? result[0].nonairrulename : null;
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : null;
                    let partnername = (result[0].partnername) ? result[0].partnername : null;
                    let activitycode = (result[0].activitycode) ? result[0].activitycode : null;
                    let activityname = (result[0].activityname) ? result[0].activityname : null;
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : null;
                    let date = [startdate, enddate];
                    let useactivityvolume = (result[0].useactivityvolume) ? result[0].useactivityvolume : false;
                    let activityvolume = (result[0].activityvolume !== undefined) ? result[0].activityvolume : undefined;
                    let awardmiles = (result[0].awardmiles !== undefined) ? result[0].awardmiles : undefined;
                    let tiermiles = (result[0].tiermiles !== undefined) ? result[0].tiermiles : undefined;
                    let uselimit = (result[0].uselimit) ? result[0].uselimit : false;
                    let limitcode = (result[0].limitcode !== undefined) ? result[0].limitcode : undefined;
                    let excludenonairactivity = (result[0].excludenonairactivity) ? result[0].excludenonairactivity.split(',') : [];
                    let excludecustomtrx = (result[0].excludecustomtrx) ? result[0].excludecustomtrx.split(',') : [];

                    let setValue = { nonairrulename, partnercode, partnername, activitycode, activityname, date, useactivityvolume, activityvolume, awardmiles, tiermiles, uselimit, limitcode, excludenonairactivity, excludecustomtrx };
                    this.props.form.setFieldsValue(setValue);

                    let mileagefielddisabled = !useactivityvolume;
                    let limitfielddisabled = !uselimit;
                    let fielddisabled = { ...this.state.fielddisabled, mileagefielddisabled, limitfielddisabled };
                    this.setState({ fielddisabled });

                    //add select inactive
                    this.componentPartnerSelect.retrieveData({ partnertype: 'NONAIR' }, { partnercode, partnername }, actionspage);
                    this.componentActivityCodeSelect.retrieveData({}, { activitycode, activityname }, actionspage);

                    setTimeout(() => {
                        let nonairactivitytype = this.componentActivityCodeSelect.getValue(activitycode, 'nonairactivitytype');
                        this.setState({ nonairactivitytype, isLoading: false });

                        if (nonairactivitytype === 'ACCELERATOR') {
                            this.componentActivityCodeExcludeSelect.retrieveData();
                            this.componentCustomTransactionExcludeSelect.retrieveData();
                        };
                    }, 1000);
                } else this.setState({ responseMessage: 'Data not found', formrender: false, isLoading: false });
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false, isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { nonairrulename, partnercode, activitycode, limitcode } = input || {};
                //define parameter
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let useactivityvolume = (input.useactivityvolume) ? input.useactivityvolume : false;
                let activityvolume = (useactivityvolume && input.activityvolume !== undefined) ? input.activityvolume : null;
                let awardmiles = (useactivityvolume && input.awardmiles !== undefined) ? input.awardmiles : null;
                let tiermiles = (useactivityvolume && input.tiermiles !== undefined) ? input.tiermiles : null;
                let uselimit = (input.uselimit) ? input.uselimit : false;
                let excludenonairactivity = input.excludenonairactivity && input.excludenonairactivity.length > 0 ? input.excludenonairactivity.join(',') : null;
                let excludecustomtrx = input.excludecustomtrx && input.excludecustomtrx.length > 0 ? input.excludecustomtrx.join(',') : null;

                let data = { excludenonairactivity, excludecustomtrx, nonairrulename, partnercode, activitycode, useactivityvolume, activityvolume, awardmiles, tiermiles, startdate, enddate, uselimit, limitcode };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.accrualrulenonair.create;
                } else {
                    data.nonairruleid = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.accrualrulenonair.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/accrual-rule-non-air');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(nonairruleid, active) {
        let url = (active) ? api.url.accrualrulenonair.deactivate : api.url.accrualrulenonair.activate;
        let data = { nonairruleid };
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

    onChangePartner = (partnercode) => {
        let criteria = { partnercode };
        this.componentActivityCodeSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ activitycode: undefined });
        let activitycodefielddisabled = (partnercode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, activitycodefielddisabled } });
    }

    handleUseActivityVolumeChange = (useactivityvolume) => {
        let mileagefielddisabled = !useactivityvolume;
        let activityvolume = undefined;
        let awardmiles = undefined;
        let tiermiles = undefined;

        this.props.form.setFieldsValue({ activityvolume, awardmiles, tiermiles });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, mileagefielddisabled } });
    }

    onChangeLimit = (uselimit) => {
        let criteria = {};
        let limitfielddisabled = !uselimit;
        this.componentLimitSelect.retrieveData(criteria);
        if (!uselimit) this.props.form.resetFields(['limitcode'])

        this.setState({ fielddisabled: { ...this.state.fielddisabled, limitfielddisabled } })
    }

    onChangeActivityCode = (activitycode) => {
        let nonairactivitytype = this.componentActivityCodeSelect.getValue(activitycode, 'nonairactivitytype');

        if (nonairactivitytype === 'ACCELERATOR') {
            this.componentActivityCodeExcludeSelect.retrieveData();
            this.componentCustomTransactionExcludeSelect.retrieveData();
        };

        this.setState({ nonairactivitytype });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, nonairactivitytype } = this.state;
        const { generalfielddisabled, activitycodefielddisabled, mileagefielddisabled, limitfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const useactivityvolume = this.props.form.getFieldValue('useactivityvolume');
        const uselimit = this.props.form.getFieldValue('uselimit');

        if (formrender) {
            document.title = titlepage + " Accrual Rule - Non Air | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Accrual Rule - Non Air</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Rule Name" datafield="nonairrulename" form={this.props.form} maxLength={45} validationrules={['required', 'max.45']} disabled={generalfielddisabled} />
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} labeltext="Partner" datafield="partnercode" form={this.props.form} validationrules={['required']} onChange={this.onChangePartner} disabled={generalfielddisabled} />
                                    <ActivityCodeSelect ref={(e) => { this.componentActivityCodeSelect = e }} labeltext="Activity Code" datafield="activitycode" form={this.props.form} onChange={this.onChangeActivityCode} validationrules={['required']} disabled={activitycodefielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} disabled={generalfielddisabled} minDate={moment().add(1, 'day')} />
                                    <ActivityCodeSelect ref={(e) => { this.componentActivityCodeExcludeSelect = e }} className={(nonairactivitytype === 'ACCELERATOR') ? '' : 'hidden'} mode='multiple' form={this.props.form} labeltext="Exclude Non Air Activity" datafield="excludenonairactivity" disabled={generalfielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionExcludeSelect = e }} className={(nonairactivitytype === 'ACCELERATOR') ? '' : 'hidden'} mode='multiple' form={this.props.form} labeltext="Exclude Custom Transaction" datafield="excludecustomtrx" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Use Activity Volume" datafield="useactivityvolume" onChange={this.handleUseActivityVolumeChange} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Activity Volume" datafield="activityvolume" maxLength={11} validationrules={(useactivityvolume) ? ['required', 'pattern.number'] : []} disabled={mileagefielddisabled} />
                                    <InputText form={this.props.form} labeltext="Award Miles" datafield="awardmiles" maxLength={11} validationrules={(useactivityvolume) ? ['required', 'pattern.number'] : []} disabled={mileagefielddisabled} />
                                    <InputText form={this.props.form} labeltext="Tier Miles" datafield="tiermiles" maxLength={11} validationrules={(useactivityvolume) ? ['required', 'pattern.number'] : []} disabled={mileagefielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Use Limit" datafield="uselimit" onChange={this.onChangeLimit} disabled={generalfielddisabled} />
                                    <LimitSelect ref={(e) => { this.componentLimitSelect = e }} form={this.props.form} labeltext="Limit Code" datafield="limitcode" maxLength={11} validationrules={(uselimit) ? ['required', 'pattern.number'] : []} disabled={limitfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button url="/accrual-rule-non-air" htmlType="link" type="default" label="Back" />
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