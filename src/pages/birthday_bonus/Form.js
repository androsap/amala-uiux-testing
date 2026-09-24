import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, TierSelect, BranchSelect, PartnerSelect, CustomTransactionSelect, DateRangeBase, SwitchButton, ChannelSelect } from '../../components/Base/BaseComponent';
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
                specifictype: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                partnercodefielddisabled: true,
                branchcodefielddisabled: true,
                enrollchanneldisabled: false
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
                this.componentChannelSelect.retrieveData({ validforearn: true });
                this.componentTierSelect.retrieveWithMembership();
                this.componentBranchSelect.retrieveData();
                this.componentPartnerSelect.retrieveData({ earntierbonus: true });
                this.componentCustomTransactionSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (tierbonusid, actionspage) => {
        let url = api.url.birthdaybonus.list;
        let criteria = { tierbonusid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status = {}, result } = response || {};
            const { tierid, tiername, enrollchannel, channel, bonusstartperiod, bonusendperiod, branchcode, branchname,
                partnercode, partnername, customtrxcode, customtrxname, awardmiles, tiermiles, frequency } = result[0] || {};
            if (status.responsecode === "0000") {
                const { channelid, channelname } = channel || {};
                let date = [moment(bonusstartperiod), moment(bonusendperiod)];
                let allchannel = (enrollchannel) ? false : true;
                let specifictype = (branchcode || partnercode) ? true : false;
                awardmiles.toString();
                tiermiles.toString();
                frequency.toString();

                let setValue = { tierid, enrollchannel, allchannel, specifictype, date, branchcode, partnercode, customtrxcode, tiermiles, awardmiles, frequency };
                this.props.form.setFieldsValue(setValue);

                let partnercodefielddisabled = (actionspage !== 'view') ? (partnercode) ? false : true : true;
                let branchcodefielddisabled = (actionspage !== 'view') ? (branchcode) ? false : true : true;
                let enrollchanneldisabled = (actionspage !== 'view') ? (enrollchannel) ? false : true : true;

                this.setState({
                    fieldvalue: { ...this.state.fieldvalue, specifictype },
                    fielddisabled: { ...this.state.fielddisabled, partnercodefielddisabled, branchcodefielddisabled, enrollchanneldisabled }
                });

                this.componentChannelSelect.retrieveData({ validforearn: true }, { channelid, channelname }, actionspage);
                this.componentTierSelect.retrieveWithMembership({}, { tierid, tiername }, actionspage);
                this.componentPartnerSelect.retrieveData({ earntierbonus: true }, { partnercode, partnername }, actionspage);
                this.componentBranchSelect.retrieveData({}, { branchcode, branchname }, actionspage);
                this.componentCustomTransactionSelect.retrieveData({}, { customtrxcode, customtrxname }, actionspage);
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
                const { tierid, enrollchannel, partnercode, branchcode, customtrxcode, awardmiles, tiermiles, frequency } = input || {};
                let bonusstartperiod = (input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let bonusendperiod = (input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let tierbonustype = 'BIRTHDAY_BONUS';

                let data = {
                    tierid, bonusstartperiod, bonusendperiod, customtrxcode, awardmiles, tiermiles, frequency,
                    enrollchannel, partnercode, branchcode, tierbonustype
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.birthdaybonus.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.birthdaybonus.update;
                    data.tierbonusid = this.props.match.params.ID;
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

    handleAllChannel = (value) => {
        let enrollchanneldisabled = value;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, enrollchanneldisabled } });
        this.props.form.setFieldsValue({ enrollchannel: undefined });
    }

    handleSpecificType = (value) => {
        let partnercodefielddisabled = !value;
        let branchcodefielddisabled = !value;
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
        const { menucode, prefixmenuname, form } = this.props;
        const { titlepage, actionspage, formrender, isLoading } = this.state;
        const { generalfielddisabled, partnercodefielddisabled, branchcodefielddisabled, enrollchanneldisabled } = this.state.fielddisabled;

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Birthday Bonus | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Birthday Bonus</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={form} labeltext="All Channel" datafield="allchannel" onChange={this.handleAllChannel} disabled={generalfielddisabled} />
                                    <ChannelSelect ref={(e) => { this.componentChannelSelect = e }} form={form} labeltext="Enroll Channel" datafield="enrollchannel" disabled={enrollchanneldisabled} />
                                    <DateRangeBase form={form} labeltext="Date Period" datafield="date" placeholder={['Start Period', 'End Period']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={form} labeltext="Specific Type" datafield="specifictype" onChange={this.handleSpecificType} disabled={generalfielddisabled} />
                                    <BranchSelect ref={(e) => { this.componentBranchSelect = e }} form={form} labeltext="Branch Enroll" datafield="branchcode" validationrules={(branchcodefielddisabled) ? [] : ['required']} onChange={this.handleBranchChange} disabled={branchcodefielddisabled} />
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={form} labeltext="Partner" datafield="partnercode" validationrules={(partnercodefielddisabled) ? [] : ['required']} onChange={this.handlePartnerChange} disabled={partnercodefielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} form={form} labeltext="Custom Transaction" datafield="customtrxcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Award Miles" datafield="awardmiles" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Tier Miles" datafield="tiermiles" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Frequency" datafield="frequency" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
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
                                {/* <Button htmlType="button" type="default" label="Back" onClick={() => { this.props.history.goBack() }} /> */}
                                <Button url="/birthday-bonus" htmlType="link" type="default" label="Back" />
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
