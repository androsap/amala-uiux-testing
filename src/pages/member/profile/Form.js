import React, { Component } from 'react';
import { DetailRequest, SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Link } from 'react-router-dom';
import { api } from '../../../config/Services';
import { getProfile } from '../../../utilities/AuthService';
import { connect } from 'react-redux';
import {
    BranchSelect, SalutationSelect, TitleSelect, NationalitySelect, ReligionSelect, LanguageSelect,
    DatePickerBase, RadioButton, InputText, Button, Alert, NameOnCardRadio, TextArea, SwitchButton, SelectBase,
} from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Icon, Modal, Table, Statistic, Tag, Tooltip } from 'antd';
import { Gender, MemberStatus } from '../../../data';
import ErrorGeneral from '../../error/ErrorGeneral';
import moment from 'moment/moment';

import ViewOTP from './modal/ViewOTP';
import ViewVerify from './modal/ViewVerify';
import MergeFrom from './MergeFrom';
import Subscription from '../subscription/Index';
import ViewDuplicate from './ViewDuplicate';

import FormMasking from './FormMasking';

const { Column } = Table;
const { Title } = Typography;
const { Countdown } = Statistic;

const isBOD = getProfile().rolename === 'BOD';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            emailsubscription: false,
            emailsubs: false,
            emailverified: false,
            visibleDetails: false,
            masked: true,
            dataChecks: {},
            data: [],
            fieldvalue: {
                visible: false,
                mergedwith: null,
                mergedwithdate: null,
                unmergedate: null,
                partnercode: null,
                membershipperiod: null,
                receivedenrollbonus: null,
                firstactivitybonus: null,
                status: null,
                duplicatewith: null,
                email: null,
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                bodfielddisabled: false
            },
            visibility: {
                subshistory: false,
                viewreference: false,
                viewmember: false,
                originmemberlist: false,
                viewduplicatewith: false,
                viewverify: false,
                viewotp: false,
                viewconfirmback: false
            }
        }
    };

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let bodfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                bodfielddisabled = true;
            }
            if (isBOD) generalfielddisabled = true;

            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
        }
    };

    componentDidMount() {
        this.checkPermission();
        const memberid = this.props.match.params.ID;
        this.getDetail(memberid, this.state.actionspage);
        this.props.retrieveTimeOTP('profile');
    };

    getDetail = (memberid, actionspage, masked) => {
        this.props.handleLoading(true);

        let type = 'ALL';
        let url = api.url.member.profile;
        let data = { memberid, type };
        //for service getreferral
        let url1 = api.url.member.getreferral;
        let data1 = { memberid };
        //call loader
        DetailRequest(url, data).then(async (response) => {
            let { status = {}, result } = response;
            if (status.responsecode === '0000') {
                //call service getereferral
                DetailRequest(url1, data1).then((response) => {
                    let { status = {}, result } = response;
                    if (status.responsecode === '0000') {
                        const { cardnumber, referencecode, referencename, status } = result || {};
                        this.setState({
                            viewMemberData: {
                                cardnumber: (cardnumber) ? cardnumber : '-',
                                referencename: (referencename) ? referencename : '-',
                                status: (status) ? status : '-'
                            }
                        });
                        this.props.form.setFieldsValue({ referencecode });
                    }
                })

                const { branchcodeenroll, branchcodeaddress, nationality, passportnumber, idcardnumber, referralcode, referencecode, username, email, enrollchannel,
                    firstname, nameoncard, salutationcode, titlecode, religionid, gender, status, partnername, langcode, notes } = result || {};

                let lastname = (result.lastname) ? result.lastname : undefined;
                let branchcodeenrollname = (result.branchcodeenrollname) ? result.branchcodeenrollname : '';
                let branchcodeaddressname = (result.branchcodeaddressname) ? result.branchcodeaddressname : '';
                let langname = (result.langname) ? result.langname : '';
                let duplicatewith = (result.duplicatewith) ? result.duplicatewith : '';
                let enrollmentdate = (result.enrollmentdate) ? moment(result.enrollmentdate) : null;
                let terminated_date = (result.terminated_date) ? moment(result.terminated_date) : null;
                let terminated_by = (result.terminated_by) ? result.terminated_by : null;
                let salutationname = (result.salutationname) ? result.salutationname : '';
                let titlename = (result.titlename) ? result.titlename : '';
                let religionname = (result.religionname) ? result.religionname : '';
                let dateofbirth = (result.dateofbirth) ? moment(result.dateofbirth) : null;
                let emailverified = (result.emailverified) ? result.emailverified : false;
                let emailsubscription = (result.emailsubscription) ? result.emailsubscription : false;
                let subscriptionHistories = (result.subscriptionHistories) ? result.subscriptionHistories : [];
                let mergedwith = (result.mergedwith !== undefined) ? result.mergedwith : null;
                let mergedwithdate = (result.mergedwithdate !== undefined) ? result.mergedwithdate : null;
                let unmergedate = (result.unmergedate !== undefined) ? result.unmergedate : null;
                let partnercode = (result.partnercode !== undefined) ? result.partnercode : null;
                let membershipperiod = (result.membershipperiod !== undefined) ? result.membershipperiod : null;
                let receivedenrollbonus = (result.receivedenrollbonus !== undefined) ? result.receivedenrollbonus : null;
                let firstactivitybonus = (result.firstactivitybonus !== undefined) ? result.firstactivitybonus : null;

                await this.setState({
                    fieldvalue: {
                        ...this.state.fieldvalue, mergedwith, mergedwithdate, unmergedate, partnercode, membershipperiod, receivedenrollbonus, firstactivitybonus, status, duplicatewith, enrollchannel, email
                    }, emailverified, emailsubscription, subscriptionHistories, status, result
                });

                await this.props.form.setFieldsValue({
                    branchcodeenroll, branchcodeaddress, username, email, enrollmentdate, terminated_date, terminated_by, partnername, firstname, lastname, nameoncard, status, referralcode, referencecode,
                    salutationcode, titlecode, religionid, gender, dateofbirth, nationality, langcode, langname, passportnumber, idcardnumber, enrollchannel, emailverified, notes, emailsubscription,
                });

                if (!this.state.masked || masked) {
                    this.componentBranchEnrollSelect.retrieveData({}, { branchcode: branchcodeenroll, branchname: branchcodeenrollname }, actionspage);
                    this.componentBranchAddressSelect.retrieveData({}, { branchcode: branchcodeaddress, branchname: branchcodeaddressname }, actionspage);
                    this.componentSalutationSelect.retrieveData({}, { salutationcode, salutationname }, actionspage);
                    this.componentTitleSelect.retrieveData({}, { titlecode, titlename }, actionspage);
                    this.componentNationalitySelect.retrieveData({}, { nationality }, actionspage);
                    this.componentReligionSelect.retrieveData({}, { religionid, religionname }, actionspage);
                    this.componentLanguageSelect.retrieveData({}, { langcode, langname }, actionspage);
                    if (firstname) this.componentNameOnCard.generateNameOnCard(firstname, lastname, nameoncard);
                }
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            this.props.handleLoading(false);
        });
    };

    handleSaveOTP = (e, data) => {
        this.props.handleLoading(true);

        this.setState({ otpvalue: undefined, visibility: { ...this.state.visibility, viewotp: false } });
        const memberid = this.props.match.params.ID;

        DetailRequest(api.url.memberotp.generate, { memberid, channel: 'BO', transactiontype: 'UPDATEPROFILE', additionaldata: JSON.stringify(data) }).then(async (response) => {
            const { status } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000') {
                Alert.success(responsemessage);
                window.scrollTo({ top: 0, behavior: 'smooth' });

                if (data) this.setState({ data });
                Alert.success("This data will be update automatically after member input otp");
                this.props.retrieveTimeOTP('profile');
            } else Alert.error(responsemessage);
            this.props.handleLoading(false);
        })
    };

    saveAction = (e, type) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.props.handleLoading(true);

                const { partnername, email, username, firstname, status, gender, nationality, langcode, notes } = input || {};

                let memberid = this.props.match.params.ID;
                let branchcodeenroll = (input.branchcodeenroll) ? input.branchcodeenroll : null;
                let branchcodeaddress = (input.branchcodeaddress) ? input.branchcodeaddress : null;
                let enrollmentdate = (input.enrollmentdate) ? moment(input.enrollmentdate).format('YYYY-MM-DD') : null;
                let terminated_date = (input.terminated_date) ? moment(input.terminated_date).format('YYYY-MM-DD') : null;
                let terminated_by = (input.terminated_by) ? input.terminated_by : null;
                let enrollchannel = (input.enrollchannel) ? input.enrollchannel : null;
                let lastname = (input.lastname) ? input.lastname : null;
                let memberfullname = firstname + (lastname) ? ' ' + lastname : '';
                let nameoncard = (input.nameoncard === 'customnameoncard') ? input.customnameoncard : input.nameoncard;
                let salutationcode = (input.salutationcode) ? input.salutationcode : null;
                let titlecode = (input.titlecode) ? input.titlecode : null;
                let dateofbirth = (input.dateofbirth) ? moment(input.dateofbirth).format('YYYY-MM-DD') : null;
                let religionid = (input.religionid) ? input.religionid : null;
                let passportnumber = (input.passportnumber) ? input.passportnumber : null;
                let idcardnumber = (input.idcardnumber) ? input.idcardnumber : null;
                let emailsubscription = (input.emailsubscription) ? true : false;
                let referralcode = (input.referralcode) ? input.referralcode : null;
                let referencecode = (input.referencecode) ? input.referencecode : null;

                const { emailverified, fieldvalue } = this.state;
                const { mergedwith, mergedwithdate, unmergedate, partnercode, membershipperiod, receivedenrollbonus, firstactivitybonus } = fieldvalue;

                let message = 'Data has been updated';
                let url = api.url.member.update;
                let data = {
                    memberid, email, username, titlecode, salutationcode, firstname, lastname, memberfullname, nameoncard, gender, langcode, referralcode, referencecode, partnername,
                    branchcodeenroll, branchcodeaddress, dateofbirth, nationality, religionid, passportnumber, idcardnumber, status, enrollchannel, enrollmentdate,
                    terminated_date, terminated_by, mergedwith, mergedwithdate, unmergedate, partnercode, membershipperiod, receivedenrollbonus, firstactivitybonus, emailverified, emailsubscription, notes,
                };

                if (type === 'saveotp') {
                    this.handleSaveOTP(e, data);
                } else SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        this.setState({ emailsubscription: false, emailsubs: false });
                        Alert.success((responsemessage) ? responsemessage : message);
                        this.props.refreshHeader();
                    } else Alert.error(responsemessage);
                    this.props.handleLoading(false);
                });
            };
        });
    };

    handleFirstNameChange = (event) => {
        let firstname = event.target === null ? '' : event.target.value;
        let lastname = this.props.form.getFieldValue('lastname');
        this.props.form.setFieldsValue({ nameoncard: undefined });
        this.componentNameOnCard.generateNameOnCard(firstname, lastname);
    };

    handleLastNameChange = (event) => {
        let lastname = event.target === null ? '' : event.target.value;
        let firstname = this.props.form.getFieldValue('firstname');
        this.props.form.setFieldsValue({ nameoncard: undefined });
        this.componentNameOnCard.generateNameOnCard(firstname, lastname);
    };

    handleSalutationChange = (salutationcode) => {
        let gender = this.componentSalutationSelect.getGender(salutationcode);
        let langcode = this.componentSalutationSelect.getLanguage(salutationcode);
        this.props.form.setFieldsValue({ gender, langcode });
    };

    handleEmailChange = (event) => {
        const { fieldvalue } = this.state;
        const username = (event.target === null) ? '' : event.target.value;
        this.props.form.setFieldsValue({ username });
        this.setState({ emailverified: (fieldvalue.email === username) ? true : false });
    };

    handleSubscription = (value) => {
        const { emailsubscription } = this.state
        if (value !== emailsubscription || value === emailsubscription) {
            this.setState({ emailsubs: true });
        } else this.setState({ emailsubs: false });
    };

    handleOpenModal = (modalType) => {
        this.setState({ modalType, visibility: { ...this.state.visibility, [modalType]: true } });
    };

    handleCancel = () => {
        this.setState({
            visibility: {
                subshistory: false,
                viewreference: false,
                viewmember: false,
                originmemberlist: false,
                viewduplicatewith: false,
                viewverify: false,
                viewotp: false,
                viewconfirmback: false
            }
        });
    };

    generateRefCode = (memberid) => {
        this.props.handleLoading(true);
        let url = api.url.memberreferral.generaterefcode;
        let data = { memberid };

        RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            const { status, result } = response || {};
            if (status.responsecode === '0000') {
                const { referralcode } = result;
                this.props.form.setFieldsValue({ referralcode });
            } else this.setState({ responseMessage: 'Data not found', formrender: false });
            this.props.handleLoading(false);
        });
    };

    handleCancel2 = () => {
        this.setState({ visible: false, visibleDetail: false, visibleDetails: false });
    };

    handleOk = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleDetailModals = (dataChecks) => {
        this.setState({ visibleDetails: true, dataChecks });
    };

    changeState = (value, type) => {
        this.setState({ [type]: value })
    };

    finishOTPTime = () => {
        this.props.refreshHeader();
        this.props.retrieveTimeOTP();
    };

    handleMasking = async () => {
        let id = this.props.match.params.ID;
        let actionspage = this.props.actionspage;

        await this.setState({
            masked: !this.state.masked,
            isLoading: true
        });

        if (!this.state.masked) {
            await this.getDetail(id, actionspage, !this.state.masked);
        } else await this.setState({ isLoading: false });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { menucode, prefixmenuname, permission, match, dataOTP, isLoading } = this.props;
        const { formrender, emailsubs, emailverified, visibleDetails, dataChecks, fieldvalue, visibility, modalType, status, otpCountdown, masked, result } = this.state;
        const { statusScreenOTP, countdownTimeVerify } = dataOTP || {};
        const { duplicatewith, enrollchannel } = fieldvalue || {};
        const { generalfielddisabled, bodfielddisabled } = this.state.fielddisabled;
        const { viewreference, viewmember, originmemberlist, viewduplicatewith, viewotp, viewverify } = visibility;
        const { usermenu } = permission;

        let memberid = match.params.ID;
        let firstname = this.props.form.getFieldValue('firstname');
        let lastname = this.props.form.getFieldValue('lastname');
        let referralcode = this.props.form.getFieldValue('referralcode');
        let referencecode = this.props.form.getFieldValue('referencecode');
        let email = this.props.form.getFieldValue('email');
        let smallWidthScreen = (window.innerWidth < 992 && window.innerWidth > 767);
        let xtraSmallWidthScreen = (window.innerWidth < 767);

        if (formrender) {
            return (
                <Row>
                    <Modal visible={viewreference || viewmember || viewduplicatewith} title={(modalType === 'viewreference') ? 'Reference List' : (modalType === 'viewduplicatewith') ? 'Member Duplicate' : 'Member List'}
                        onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={(viewreference) ? 840 : 480}>
                        {
                            (viewduplicatewith) ? <ViewDuplicate {...this.props} duplicatewith={duplicatewith} /> : <ViewMember modalType={modalType} fields={{ memberid, referencecode }} />
                        }
                    </Modal>
                    <Modal visible={originmemberlist || viewotp || viewverify} title={(originmemberlist) ? 'List of Origin Member' : ''} onCancel={this.handleCancel} footer={null} destroyOnClose={true}
                        width={(originmemberlist) ? 960 : (viewverify) ? 420 : 370} closable={(viewotp || viewverify) ? false : true} style={{ left: (window.innerWidth > 970 && viewotp) ? 30 : 0 }}>
                        {
                            (originmemberlist) ? <MergeFrom {...this.props} /> : (viewotp) ? <ViewOTP {...this.props} handleSaveOTP={(e) => this.saveAction(e, 'saveotp')} isLoading={isLoading} onCancel={this.handleCancel} /> :
                                <ViewVerify {...this.props} handleSaveOTP={(e) => this.saveAction(e, 'saveotp')} isLoading={isLoading} email={email} onCancel={this.handleCancel} changeState={this.changeState} />
                        }
                    </Modal>
                    <Modal title='View Subscription History' visible={visibleDetails} onCancel={this.handleCancel2} destroyOnClose={true} footer={null} width={1200}>
                        <Subscription {...this.props} result={dataChecks} closemodalrefresh={this.handleOk} />
                    </Modal>

                    <Row>
                        <Col xs={(xtraSmallWidthScreen) ? 12 : 8}>
                            <Title level={4}>Personal & Information</Title>
                        </Col>
                        <Col xs={(xtraSmallWidthScreen) ? 12 : 16} style={{ textAlign: 'end' }}>
                            <Row
                                type="flex"
                                justify="end"
                                align="middle"
                            >
                                {(countdownTimeVerify > 0) && (statusScreenOTP === 'verify') && (
                                    <div style={{ marginRight: 16 }}>
                                        {(xtraSmallWidthScreen) ? null : <span>Waiting for Verification OTP =&nbsp;</span>}
                                        <Tooltip placement="topRight" title={`Waiting for Verification OTP`}>
                                            <Tag color="blue">
                                                <Countdown
                                                    valueStyle={{ fontSize: '16px', color: 'blue' }}
                                                    value={countdownTimeVerify}
                                                    format="mm:ss"
                                                    onFinish={this.finishOTPTime}
                                                />
                                            </Tag>
                                        </Tooltip>
                                    </div>
                                )}

                                <Link
                                    to="#"
                                    onClick={this.handleMasking}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        color: '#717171',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {masked ? 'Edit information' : 'Hide information'}
                                    <Icon
                                        type={masked ? 'edit' : 'eye-invisible'}
                                        style={{ marginLeft: 6 }}
                                    />
                                </Link>
                            </Row>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            {(masked) ? <FormMasking {...this.props} data={result} handleOpenModal={this.handleOpenModal} handleDetailModals={this.handleDetailModals} generateRefCode={this.generateRefCode} /> : <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={{ span: 16, offset: 2 }} lg={{ span: 16, offset: 2 }} xl={{ span: 12, offset: 4 }}>
                                    <BranchSelect ref={(e) => { this.componentBranchEnrollSelect = e }} labeltext='Branch Enrollment' datafield='branchcodeenroll' form={this.props.form} disabled={generalfielddisabled} />
                                    <BranchSelect ref={(e) => { this.componentBranchAddressSelect = e }} labeltext='Branch Address' datafield='branchcodeaddress' form={this.props.form} disabled={generalfielddisabled} />

                                    <InputText form={this.props.form} labeltext="Username" datafield="username" maxLength={255} disabled={true} />
                                    {
                                        (!emailverified) ? <Row gutter={24}>
                                            <Col className="gutter-row" xs={24} sm={{ span: (smallWidthScreen) ? 13 : 15, push: (smallWidthScreen) ? 0 : 3 }} md={{ span: 20, pull: 1 }} lg={{ span: 18, push: 1 }} style={{ marginLeft: 2 }} >
                                                <InputText form={this.props.form} labeltext="Email" onChange={this.handleEmailChange} labelCol={{ sm: 8, md: 11, lg: 9 }} wrapperCol={{ sm: 16, md: 13, lg: 15 }} maxLength={255} datafield="email" validationrules={['required', 'pattern.email']} disabled={bodfielddisabled} />
                                            </Col>
                                            <Col className="gutter-row" xs={24} sm={{ span: 4, push: (smallWidthScreen) ? 0 : 3 }} md={{ span: 4, pull: 1 }} lg={{ span: 6, push: 1 }} style={{ lineHeight: '40px', marginLeft: -5 }}>
                                                <Button htmlType="button" type="primary" label="Verify Email" onClick={() => this.handleOpenModal('viewverify')} />
                                            </Col>
                                        </Row> : <InputText form={this.props.form} labeltext="Email" onChange={this.handleEmailChange} suffix={<Icon type="check-circle" theme="twoTone" />} maxLength={255} datafield="email" validationrules={['required', 'pattern.email']} disabled={bodfielddisabled} />
                                    }
                                    {
                                        (status !== 'INACTIVEEMAIL') ? <Row gutter={24}>
                                            <Col className="gutter-row" xs={12} sm={13} md={{ span: 14, pull: 1 }} lg={{ span: 12, push: 1 }} style={{ marginLeft: 2 }} >
                                                <SwitchButton labelCol={{ sm: 16, md: 16, lg: 14 }} wrapperCol={{ sm: 5, md: 8, lg: 10 }} form={this.props.form} labeltext="Subscription" datafield="emailsubscription" validationrules={['required']} onChange={value => this.handleSubscription(value)} disabled={bodfielddisabled} />
                                            </Col>
                                            <Col className="gutter-row" xs={12} sm={7} md={{ span: 9, pull: 2 }} lg={{ span: 6, push: 1 }} style={{ lineHeight: '40px' }}>
                                                {(!isBOD) ? <Button htmlType="button" type="default" label="View History" title="View Subscription History" onClick={this.handleDetailModals} /> : ''}
                                            </Col>
                                        </Row> : null
                                    }
                                    {
                                        (emailsubs) ? <TextArea labeltext="Notes" datafield="notes" form={this.props.form} maxLength={255} validationrules={['required']} disabled={bodfielddisabled} normal={true} /> : ''
                                    }

                                    {/* Your Referral Code */}
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={{ span: (smallWidthScreen) ? 13 : 16, push: (smallWidthScreen) ? 0 : 2 }} md={{ span: 20, pull: 1 }} lg={{ span: 18, push: 1 }} style={{ marginLeft: 2 }} >
                                            <InputText form={this.props.form} labelCol={{ sm: 9, md: 11, lg: 9 }} wrapperCol={{ sm: 15, md: 13, lg: 15 }} labeltext="Your Referral Code" datafield="referralcode" disabled={true} />
                                        </Col>
                                        {
                                            (usermenu[menucode][prefixmenuname + "_UPDATE"] && !isBOD) ? (referralcode) ?
                                                <Col className="gutter-row" xs={24} sm={{ span: 3, push: (smallWidthScreen) ? 0 : 2 }} md={{ span: 4, pull: 1 }} lg={{ span: 6, push: 1 }} style={{ lineHeight: '40px', marginLeft: -5 }}>
                                                    <Button htmlType="button" label="View Reference" onClick={() => this.handleOpenModal('viewreference')} />
                                                </Col> :
                                                <Col className="gutter-row" xs={24} sm={{ span: 3, push: (smallWidthScreen) ? 0 : 2 }} md={{ span: 4, pull: 1 }} lg={{ span: 6, push: 1 }} style={{ lineHeight: '40px', marginLeft: -5 }} hidden={isBOD}>
                                                    <Button htmlType="button" label="Generate Code" onClick={() => this.generateRefCode(memberid)} />
                                                </Col> : null
                                        }
                                    </Row>

                                    {/* Reference Code */}
                                    <Row gutter={24}>
                                        <Col className="gutter-row" sm={24} md={{ span: 20, pull: 1 }} lg={{ span: 18, push: 1 }} style={{ marginLeft: 2 }} >
                                            <InputText form={this.props.form} labelCol={{ sm: 8, md: 11, lg: 9 }} wrapperCol={{ sm: 16, md: 13, lg: 15 }} labeltext="Reference Code" datafield="referencecode" disabled={true} />
                                        </Col>
                                        <Col className="gutter-row" sm={24} md={{ span: 4, pull: 1 }} lg={{ span: 6, push: 1 }} style={{ lineHeight: '40px', marginLeft: -5, display: (referencecode) ? 'block' : 'none' }}>
                                            <Button htmlType="button" label="View Member" onClick={() => this.handleOpenModal('viewmember')} />
                                        </Col>
                                    </Row>

                                    <DatePickerBase form={this.props.form} labeltext='Date of Enrollment' datafield='enrollmentdate' validationrules={['required']} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext='Date of Terminate' datafield='terminated_date' validationrules={['']} disabled={true} />
                                    <InputText form={this.props.form} labeltext='Terminated By' datafield='terminated_by' validationrules={['']} disabled={true} />
                                    <InputText form={this.props.form} labeltext='Enrollment Channel' datafield='enrollchannel' validationrules={['required']} disabled={true} />
                                    {(enrollchannel === 'PARTNER') ? <InputText form={this.props.form} labeltext='Partner' datafield='partnername' disabled={true} /> : null}

                                    <InputText form={this.props.form} labeltext='First Name' datafield='firstname' validationrules={['required', 'pattern.letterspace', 'max.45']} maxLength={45} onChange={this.handleFirstNameChange} disabled={bodfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Last Name' datafield='lastname' validationrules={['pattern.letterspace', 'max.45']} maxLength={45} onChange={this.handleLastNameChange} disabled={bodfielddisabled} />
                                    {/* <InputText form={this.props.form} labeltext='Name on Card' datafield='nameoncard' validationrules={['required', 'pattern.letterspace', 'max.45']} maxLength={45} disabled={generalfielddisabled} /> */}
                                    <NameOnCardRadio ref={(e) => { this.componentNameOnCard = e }} className={(firstname || lastname) ? '' : 'hidden'} form={this.props.form} labeltext='Name on Card' datafield='nameoncard' validationrules={['required', 'pattern.letterspace']} maxLength={255} disabled={bodfielddisabled} />

                                    {
                                        (status === 'DUPLICATE') ? <Row gutter={24}>
                                            <Col className='gutter-row' md={{ span: 18, pull: 0 }} sm={{ span: 24, pull: 3 }} xs={{ span: 24, pull: 0 }} >
                                                <SelectBase labelCol={{ span: 11 }} wrapperCol={{ span: 13 }} form={this.props.form} labeltext='Status' datafield='status' options={MemberStatus} validationrules={['required']} disabled={(fieldvalue.status === 'TERMINATED') ? true : bodfielddisabled} />
                                            </Col>
                                            <Col className='gutter-row' md={{ span: 6, push: 0 }} sm={{ span: 24, push: 8 }} xs={{ span: 24, push: 1 }} style={{ lineHeight: '40px', paddingLeft: -20 }}>
                                                <Button htmlType='button' type='primary' label='Duplicate With' onClick={() => this.handleOpenModal('viewduplicatewith')} disabled={bodfielddisabled} />
                                            </Col>
                                        </Row> : <SelectBase form={this.props.form} labeltext='Status' datafield='status' options={MemberStatus} validationrules={['required']} disabled={bodfielddisabled} />
                                    }

                                    <SalutationSelect ref={(e) => { this.componentSalutationSelect = e }} labeltext='Salutation' datafield='salutationcode' form={this.props.form} onChange={this.handleSalutationChange} disabled={generalfielddisabled} />
                                    <TitleSelect ref={(e) => { this.componentTitleSelect = e }} labeltext='Title' datafield='titlecode' form={this.props.form} disabled={generalfielddisabled} />

                                    <RadioButton form={this.props.form} labeltext="Gender" datafield="gender" options={Gender} validationrules={['required']} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Date of Birth" datafield="dateofbirth" validationrules={['required']} maxDate={moment()} disabled={generalfielddisabled} />
                                    <NationalitySelect ref={(e) => { this.componentNationalitySelect = e }} labeltext="Nationality" datafield="nationality" validationrules={[]} form={this.props.form} disabled={generalfielddisabled} custom={true} />
                                    <ReligionSelect ref={(e) => { this.componentReligionSelect = e }} labeltext="Religion" datafield="religionid" form={this.props.form} disabled={generalfielddisabled} />
                                    <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} labeltext="Preferred Language" datafield="langcode" validationrules={['required']} form={this.props.form} disabled={generalfielddisabled} />

                                    <InputText form={this.props.form} labeltext='Passport No' datafield='passportnumber' validationrules={['pattern.alphanumeric', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='ID Card No' datafield='idcardnumber' validationrules={['pattern.number', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    {
                                        (!isBOD) ?
                                            <Form.Item wrapperCol={{ offset: 8 }} className={(usermenu[menucode][prefixmenuname + '_UPDATE']) ? (fieldvalue.status === 'MERGED') ? 'hidden' : '' : 'hidden'}>
                                                <Link to='#' onClick={() => this.handleOpenModal('originmemberlist')} style={{ cursor: 'pointer' }}>View list of origin member</Link>
                                            </Form.Item> : ''
                                    }
                                </Col>
                                <Col className='gutter-row' xs={24} lg={{ span: 24, offset: 1 }} xl={{ span: 24, pull: 2 }}>
                                    <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>

                                        {
                                            (usermenu[menucode][prefixmenuname + '_UPDATE']) ?
                                                <Button htmlType='submit' type='default' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' /> : null
                                        }
                                        {
                                            (usermenu[menucode][prefixmenuname + '_UPDATEOTP']) ?
                                                <Button htmlType='button' type='primary' label='Save with OTP' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATEOTP' onClick={() => this.handleOpenModal('viewotp')} /> : null
                                        }
                                    </Row>
                                </Col>
                            </Row >}
                        </Form >
                    </Spin >
                </Row >
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    };
}

//VIEW SUBSCRIPTION HISTORY
class SubsHistoryApp extends Component {
    render() {
        let { subsHistory } = this.props;
        subsHistory = subsHistory.map((obj, key) => { return ({ no: (key + 1), ...obj }) });
        return (
            <Table rowKey={record => record.number} dataSource={subsHistory} pagination={false} scroll={{ y: 260 }}>
                <Column title='No' dataIndex='no' key='no' render={(value) => (value ? value : '-')} width='5%' />
                <Column title='Date' dataIndex='date' key='date' render={(value) => (value ? moment(value).format('DD /MM/YYYY') : '-')} width='20%' />
                <Column title='Subscription' dataIndex='subscription' key='subscription' render={(value) => (value ? 'Subscribed' : 'Unsubscribed')} width='20%' />
                <Column title='Notes' dataIndex='notes' key='notes' render={(value) => ((value) ? value : '-')} width='20%' />
            </Table>
        )
    }
}

//VIEW MEMBER
class ViewMemberApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            referenceList: [],
            memberList: {},
            isLoading: false
        };
    };

    componentDidMount() {
        const { modalType, fields } = this.props;
        const { memberid, referencecode } = fields;
        if (modalType === 'viewreference') this.getReferenceList(memberid);
        else if (modalType === 'viewmember') this.getMemberList(referencecode);
    };

    getReferenceList = (memberid) => {
        let url = api.url.memberreferral.viewreference;
        let data = { memberid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            const { status, result } = response || {};
            if (status.responsecode === '0000') {
                this.setState({ referenceList: result });
            } else this.setState({ responseMessage: 'Data not found', formrender: false });
            this.setState({ isLoading: false });
        });
    };

    getMemberList = (referralcode) => {
        let url = api.url.memberreferral.getreferral;
        let data = { referralcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            const { status, result } = response || {};
            if (status.responsecode === '0000') {
                this.setState({ memberList: result });
            } else this.setState({ responseMessage: 'Data not found', formrender: false });
            this.setState({ isLoading: false });
        });
    };

    render() {
        const { modalType } = this.props;
        const { referenceList, memberList, isLoading } = this.state;
        const { cardnumber, firstname, lastname, status, referralcode } = memberList;

        return (
            <React.Fragment>
                <Spin spinning={isLoading}>
                    {
                        (modalType === 'viewreference') ?
                            <Row>
                                <Title level={4}>Bonus from Reference</Title>
                                <Table rowKey={record => record.memberid} dataSource={referenceList} pagination={false} scroll={{ y: 200 }}>
                                    <Column title='No' dataIndex='number' key='number' render={(_t, _r, i) => ++i} width='10%' />
                                    <Column title='Card Number' dataIndex='cardnumber' key='cardnumber' width='15%' />
                                    <Column title='Reference Name' dataIndex='referencename' key='referencename' width='25%'
                                        render={(_val, row) => `${row.firstname} ${row.lastname ? row.lastname : ''}`}
                                    />
                                    <Column title='Bonus' dataIndex='getbonuswhen' key='getbonuswhen' render={(val) => val ? val : '-'} width='20%' />
                                    <Column title='Tier' dataIndex='tierid' key='tierid' render={(val) => val ? val : '-'} width='20%' />
                                    <Column title='Get Bonus' dataIndex='getreferralbonus' key='getreferralbonus' render={(val) => val ? 'YES' : 'NO'} width='20%' />
                                </Table>
                                <Title level={4} style={{ marginTop: 30 }}>Reference Details List</Title>
                                <Table rowKey={record => record.memberid} dataSource={referenceList} pagination={false} scroll={{ y: 200 }}>
                                    <Column title='No' dataIndex='number' key='number' render={(_t, _r, i) => ++i} width='2%' />
                                    <Column title='Card Number' dataIndex='cardnumber' key='cardnumber' width='10%' />
                                    <Column title='Reference Name' dataIndex='referencename' key='referencename' width='20%'
                                        render={(_val, row) => `${row.firstname} ${row.lastname ? row.lastname : ''}`}
                                    />
                                    <Column title='Bonus' dataIndex='getbonuswhenref' key='getbonuswhenref' render={(val) => val ? val : '-'} width='15%' />
                                    <Column title='Tier' dataIndex='tieridref' key='tieridref' render={(val) => val ? val : '-'} width='10%' />
                                    <Column title='Get Bonus' dataIndex='getreferralbonusref' key='getreferralbonusref' render={(val) => val ? 'YES' : 'NO'} width='10%' />
                                    <Column title='Enrollment Date' dataIndex='enrolldate' key='enrolldate' render={(val) => val ? moment(val).format('YYYY/MM/DD') : '-'} width='15%' />
                                    <Column title='Status' dataIndex='status' key='status' width='15%' />
                                </Table>
                            </Row> :
                            <Row>
                                <Col span={8}><label>Card Number</label></Col>
                                <Col span={16}>: {cardnumber}</Col>
                                <Col span={8}><label>Name</label></Col>
                                <Col span={16}>: {`${firstname} ${lastname ? lastname : ''}`}</Col>
                                <Col span={8}><label>Status</label></Col>
                                <Col span={16}>: {status}</Col>
                                <Col span={8}><label>Referral Code</label></Col>
                                <Col span={16}>: {referralcode ? referralcode : '-'}</Col>
                            </Row>
                    }
                </Spin>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
const SubsHistory = Form.create()(SubsHistoryApp);
const ViewMember = Form.create()(ViewMemberApp);
export default connect(mapStateToProps)(Form.create()(App));