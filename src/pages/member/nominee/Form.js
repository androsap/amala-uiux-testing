import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, DatePickerBase, SelectBase, SalutationSelect, RadioButton } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal, Icon } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { warning, confirm } = Modal;
const optionsType = [
    { label: "Member GarudaMiles", value: "MEMBER" },
    { label: "Non-Member GarudaMiles", value: "NONMEMBER" }
]

const optionsGender = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" }
]

const optionsPaxType = [
    { label: "Infant", value: "INF" },
    { label: "Child", value: "CHD" },
    { label: "Adult", value: "ADT" }
]

const optionsIdentity = [
    { value: 'KTP', label: 'KTP' },
    { value: 'PASSPORT', label: 'Passport' },
]

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create Nominee',
            isLoading: false,
            responseMessage: '',
            formrender: true,
            fieldvalue: {},
            fielddisabled: {}
        }
    }

    saveAction = (e) => {
        const { form, match, history } = this.props;
        const { memberidnominee, cardnumber, firstname, lastname, salutationcode, dateofbirth } = this.state.fieldvalue;

        e.preventDefault();
        const callback = () => {
            form.validateFieldsAndScroll((err, input) => {
                if (!err) {
                    this.setState({ isLoading: true });
                    let memberid = match.params.ID;
                    let membersince = moment(input.membersince).format("YYYY-MM-DD");
                    let nomineetype = input.nomineetype ? input.nomineetype : '';
                    let firstnamenon = input.firstname ? input.firstname : '';
                    let lastnamenon = input.lastname ? input.lastname : '';
                    let salutationcodenon = input.salutationcode ? input.salutationcode : '';
                    let dateofbirthnon = moment(input.dateofbirth).format("YYYY-MM-DD");
                    let phonenumber = null;
                    let identitytype = null;
                    let nik = null;
                    let passportnumber = null;
                    let gender = null;
                    
                    let url = api.url.memberredemptionnominee.create;
                    let data = nomineetype === 'MEMBER'
                        ? {
                            channel: 'amalabo',
                            memberid,
                            cardnumber,
                            memberidnominee,
                            membersince,
                            salutationcode,
                            firstname,
                            lastname,
                            dateofbirth,
                            nomineetype,
                        }
                        : {
                            channel: 'amalabo',
                            memberid,
                            cardnumber: null,
                            memberidnominee: null,
                            membersince,
                            salutationcode: salutationcodenon,
                            firstname: firstnamenon,
                            lastname: lastnamenon,
                            dateofbirth: dateofbirthnon,
                            nomineetype,
                            identitytype,
                            nik,
                            passportnumber,
                            phonenumber,
                            gender,
                            paxtype: input.paxtype
                        };
                    let message = 'New data has been created';
                    
                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);
                            this.props.refreshHeader();
                            history.push('/member/form/' + memberid + '/nominee');
                        } else {
                            Alert.error(responsemessage);
                        }
                        this.setState({ isLoading: false });
                    })
                }
            });
        }
        confirm({
            title: `New Nominee Registration Confirmation`,
            icon: <Icon type="info-circle" theme="twoTone" twoToneColor="#1890ff" />,
            content: (
                <div>
                    <p>By proceeding, you acknowledge and agree that the registered Nominee data cannot be changed for 6 (six) months from the registration date.</p>
                    <p>Kindly review all entered information carefully.</p>
                    <p>Click <b>'Yes, Proceed'</b> to confirm or <b>'Cancel'</b> to make changes.`</p>
                </div>
            ),
            okText: 'Yes, Proceed',
            cancelText: 'Cancel',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    retrieveMember = (cardnumber) => {
        let url = api.url.member.profile;
        let type = 'SUMMARY';
        let data = { cardnumber, type };
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let { membercards, memberid, salutationcode, firstname, lastname, dateofbirth } = result || {};
                let cardNumberFromCards = membercards.length ? membercards[0].cardnumber : null;
                let cardNumberCheck = (membercards.length > 1) ? cardnumber : cardNumberFromCards;
                this.props.form.setFieldsValue({
                    salutationcode,
                    firstname,
                    lastname,
                    dateofbirth: moment(dateofbirth),
                });

                this.setState({
                    fieldvalue: {
                        memberidnominee: memberid,
                        cardnumber,
                        salutationcode,
                        firstname,
                        lastname,
                        dateofbirth
                    }
                });
                if (cardnumber !== cardNumberCheck) {
                    warning({
                        title: `Member with card number (${cardnumber}) Not Valid`,
                        content: (cardNumberFromCards) ? `Card Number for this member has been changed to ${cardNumberCheck}.` : null,
                    });
                }
            } else {
                this.props.form.setFieldsValue({
                    salutationcode: undefined,
                    firstname: undefined,
                    lastname: undefined,
                    channel: undefined,
                    dateofbirth: null,
                    membersince: null
                });
                warning({
                    title: status.responsemessage,
                    content: 'Please input correct card number.',
                });
            }
            this.setState({ isLoading: false });
        });
    }

    handleAutoFill = (e) => {
        let cardnumber = e.target ? e.target.value : null;
        if (cardnumber) {
            this.props.form.setFieldsValue({
                membersince: moment()
            });
            this.retrieveMember(cardnumber);
        };
    }

    handleReset = () => {
        this.props.form.resetFields(['cardnumber', 'salutationcode', 'firstname', 'lastname', 'dateofbirth', 'membersince', 'nik', 'passportnumber', 'identitytype', 'phonenumber', []]);
    };

    handleIdentity = () => {
        this.props.form.resetFields(['nik', 'passportnumber', []]);
    }

    handleBirthday = (date) => {
        if (!date) {
            this.props.form.setFieldsValue({ paxtype: undefined });
            return;
        }
        const today = moment().startOf('day');
        const dob = moment(date).startOf('day');
        let paxtype = 'ADT';
        if (dob.clone().add(2, 'years').isAfter(today)) {
            paxtype = 'INF';
        } else if (dob.clone().add(11, 'years').isAfter(today)) {
            paxtype = 'CHD';
        }
        this.props.form.setFieldsValue({ paxtype: paxtype });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isLoading, responseMessage, titlepage, formrender } = this.state;
        const { form, match } = this.props;
        const nomineetype = this.props.form.getFieldValue('nomineetype');
        const identitytype = this.props.form.getFieldValue('identitytype');

        // const cardnumbervalue = form.getFieldValue('cardnumber');
        // const membersincedisabled = (cardnumbervalue) ? false : true;

        if (formrender) {
            document.title = titlepage + " | Loyalty Management System";
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage}</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Nominee Type" datafield="nomineetype" options={optionsType} validationrules={['required']} onChange={this.handleReset} />
                                    {nomineetype === 'MEMBER' || nomineetype === undefined ?
                                        <>
                                            <InputText form={form} labeltext="Card Number" datafield="cardnumber" validationrules={['required', 'pattern.number']} maxLength={20} onBlur={this.handleAutoFill} />
                                            <InputText form={form} labeltext="Salutation" datafield="salutationcode" disabled />
                                            <InputText form={form} labeltext="First Name" datafield="firstname" disabled />
                                            <InputText form={form} labeltext="Last Name" datafield="lastname" disabled />
                                            <DatePickerBase form={form} labeltext="Date of Birth" datafield="dateofbirth" maxDate={moment()} disabled />
                                            <DatePickerBase form={form} labeltext="Registered Since" datafield="membersince" validationrules={['required']} disabled />
                                        </>
                                        :
                                        <>
                                            <SalutationSelect ref={(e) => { this.componentSalutationSelect = e }} form={form} labeltext="Salutation" datafield="salutationcode" />
                                            <InputText form={form} labeltext="First Name" datafield="firstname" validationrules={['required', 'pattern.letterspace']} />
                                            <InputText form={form} labeltext="Last Name" datafield="lastname" validationrules={['pattern.letterspace']} />
                                            {/* <RadioButton form={form} labeltext="Identity Type" datafield="identitytype" validationrules={['required']} options={optionsIdentity} onChange={this.handleIdentity} /> */}
                                            {/* {identitytype === "KTP" ?
                                                <InputText form={form} labeltext="NIK" datafield="nik" validationrules={['required', 'pattern.number', 'max.16', 'min.16']} maxLength={16} />
                                                : identitytype === "PASSPORT" ?
                                                    <InputText form={form} labeltext="Passport" datafield="passportnumber" validationrules={['required', 'pattern.alphanumeric', 'max.9']} maxLength={9} />
                                                    : null
                                            } */}
                                            {/* <InputText form={form} labeltext="Phone Number" datafield="phonenumber" validationrules={['required', 'pattern.number', 'max.20']} maxLength={20} />
                                            <SelectBase form={form} labeltext="Gender" datafield="gender" options={optionsGender} validationrules={['required']} /> */}
                                            <DatePickerBase form={form} labeltext="Date of Birth" datafield="dateofbirth" maxDate={moment()} validationrules={['required']} onChange={this.handleBirthday}/>
                                            <SelectBase form={form} labeltext="Pax Type" datafield="paxtype" options={optionsPaxType} disabled noSuffixPlaceholder/>
                                            <DatePickerBase form={form} labeltext="Registered Since" datafield="membersince" validationrules={['required']} defaultValue={moment()} disabled />
                                        </>}
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="submit" type="default" label="Save" />
                                <Button url={'/member/form/' + match.params.ID + '/nominee'} htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
