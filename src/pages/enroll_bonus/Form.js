import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, TierCascender, BranchSelect, PartnerSelect, CustomTransactionSelect, SelectBase, DateRangeBase, SwitchButton } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const optionsEnrollChannel = [
    { value: 'MOBILE', label: 'MOBILE' },
    { value: 'WEBSITE', label: 'WEBSITE' },
    { value: 'BO', label: 'BO' },
    { value: 'CHECKIN', label: 'CHECK-IN' },
    { value: 'PARTNER', label: 'PARTNER' },
    { value: 'COBRAND', label: 'COBRAND' },
    { value: 'CHARITY', label: 'CHARITY' },
    { value: 'CORPORATE', label: 'CORPORATE' }
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
                isdefault: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                partnercodefielddisabled: false,
                branchcodefielddisabled: false
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
                this.componentBranchSelect.retrieveData();
                this.componentPartnerSelect.retrieveData();
                this.componentCustomTransactionSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (tierenrollbonusid, actionspage) => {
        let url = api.url.enrollbonus.list;
        let criteria = { tierenrollbonusid };
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
                    let enrollchannel = result[0].enrollchannel;
                    let isdefault = (result[0].isdefault !== undefined) ? result[0].isdefault : false;
                    let activitystartperiod = (result[0].activitystartperiod) ? moment(result[0].activitystartperiod) : null;
                    let activityendperiod = (result[0].activityendperiod) ? moment(result[0].activityendperiod) : null;
                    let date = [activitystartperiod, activityendperiod];
                    let branchcode = result[0].branchcode;
                    let branchname = (result[0].branchname !== undefined) ? result[0].branchname : null;
                    let partnercode = result[0].partnercode;
                    let partnername = (result[0].partnername !== undefined) ? result[0].partnername : null;
                    let customtrxcode = result[0].customtrxcode;
                    let customtrxname = (result[0].customtrxname !== undefined) ? result[0].customtrxname : null;
                    let tiermiles = (result[0].tiermiles !== undefined) ? result[0].tiermiles.toString() : null;
                    let awardmiles = (result[0].awardmiles !== undefined) ? result[0].awardmiles.toString() : null;
                    let frequency = (result[0].frequency !== undefined) ? result[0].frequency.toString() : null;

                    let setValue = { tierid, enrollchannel, isdefault, date, branchcode, partnercode, customtrxcode, tiermiles, awardmiles, frequency };
                    this.props.form.setFieldsValue(setValue);

                    let partnercodefielddisabled = (actionspage !== 'view') ? (partnercode) ? false : true : true;
                    let branchcodefielddisabled = (actionspage !== 'view') ? (branchcode) ? false : true : true;;
                    this.setState({
                        fieldvalue: { ...this.state.fieldvalue, isdefault },
                        fielddisabled: { ...this.state.fielddisabled, partnercodefielddisabled, branchcodefielddisabled }
                    });

                    this.componentTierCascender.retrieveData();
                    this.componentPartnerSelect.retrieveData({}, { partnercode, partnername }, actionspage);
                    this.componentBranchSelect.retrieveData({}, { branchcode, branchname }, actionspage);
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
                let membershiptypeid = (input.tierid && input.tierid[0]) ? input.tierid[0] : null;
                let membershipid = (input.tierid && input.tierid[1]) ? input.tierid[1] : null;
                let tierid = (input.tierid && input.tierid[2]) ? input.tierid[2] : null;
                let enrollchannel = (input.enrollchannel !== undefined) ? input.enrollchannel : null;
                let isdefault = (input.isdefault !== undefined) ? input.isdefault : false;
                let activitystartperiod = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let activityendperiod = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let partnercode = (!isdefault && input.partnercode) ? input.partnercode : null;
                let branchcode = (!isdefault && input.branchcode) ? input.branchcode  : null;
                let customtrxcode = (input.customtrxcode) ? input.customtrxcode : null;
                let tiermiles = (input.tiermiles !== undefined) ? input.tiermiles : null;
                let awardmiles = (input.awardmiles !== undefined) ? input.awardmiles : null;
                let frequency = (input.frequency !== undefined) ? input.frequency : null;

                let data = { membershiptypeid, membershipid, tierid, enrollchannel, activitystartperiod, activityendperiod, partnercode, branchcode, customtrxcode, tiermiles, awardmiles, frequency, isdefault };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.enrollbonus.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.enrollbonus.update;
                    data.tierenrollbonusid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/enroll-bonus');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleIsDefaultOnChange = (value) => {
        let partnercodefielddisabled = value;
        let branchcodefielddisabled = value;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, partnercodefielddisabled, branchcodefielddisabled } });
        this.props.form.setFieldsValue({ partnercode: undefined, branchcode: undefined });
    }

    handleBranchChange = (value) => {
        let partnercodefielddisabled = (value) ? true : false;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, partnercodefielddisabled } });
        this.props.form.setFieldsValue({ partnercode: undefined });
    }

    handlePartnerChange = (value) => {
        let branchcodefielddisabled = (value) ? true : false;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, branchcodefielddisabled } });
        this.props.form.setFieldsValue({ branchcode: undefined });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, partnercodefielddisabled, branchcodefielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Enroll Bonus | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Enroll Bonus</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TierCascender ref={(e) => { this.componentTierCascender = e }} form={this.props.form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Enroll Channel" datafield="enrollchannel" options={optionsEnrollChannel} validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Activity Date" datafield="date" placeholder={['Start Period', 'End Period']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Is Default" datafield="isdefault" onChange={this.handleIsDefaultOnChange} disabled={generalfielddisabled} />
                                    <BranchSelect ref={(e) => { this.componentBranchSelect = e }} form={this.props.form} labeltext="Branch" datafield="branchcode" validationrules={(branchcodefielddisabled) ? [] : ['required']} onChange={this.handleBranchChange} disabled={branchcodefielddisabled} />
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={(partnercodefielddisabled) ? [] : ['required']} onChange={this.handlePartnerChange} disabled={partnercodefielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} form={this.props.form} labeltext="Custom Transaction" datafield="customtrxcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Tier Miles" datafield="tiermiles" validationrules={['required', 'pattern.number', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Award Miles" datafield="awardmiles" validationrules={['required', 'pattern.number', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Frequency" datafield="frequency" validationrules={['required', 'pattern.number', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
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
                                <Button url="/enroll-bonus" htmlType="link" type="default" label="Back" />
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