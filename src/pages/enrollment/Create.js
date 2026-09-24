import React, { Component } from 'react';
import ErrorGeneral from '../error/ErrorGeneral';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../utilities/RequestService';
import { getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, InputText, TextArea, HobbiesCheckbox, CountrySelect, StateSelect, CitySelect, LanguageSelect, DatePickerBase, TierRankSelect, SalutationSelect, TitleSelect, NationalitySelect, ReligionSelect, NameOnCardRadio, SelectBase, CountryPhoneSelect, UploadBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Layout, Anchor, Affix, Table, Button as AntButton, Modal, Checkbox, Icon, Tooltip } from 'antd';
import moment from 'moment';
import uuid from 'uuid/v4';

const { Title, Text } = Typography;
const { Link } = Anchor;
const { Content, Sider } = Layout;
const { Column } = Table;
const { warning, confirm } = Modal;

const optionsGender = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" }
];
const optionsPhoneType = [
    { label: 'Mobile', value: 'MOBILE' },
    { label: 'Private Phone', value: 'PRIVATEPHONE' },
    { label: 'Business Phone', value: 'BUSINESSPHONE' },
    { label: 'Private Fax', value: 'PRIVATEFAX' },
    { label: 'Business Fax', value: 'BUSINESSFAX' }
];

const optionsType = [
    { label: "KTP", value: "KTP" },
    { label: "KITAS", value: "KITAS" },
    { label: "SIM", value: "SIM" },
    { label: "PASSPORT", value: "PASSPORT" },
    { label: "VISA", value: "VISA" }
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
            loading: false,
            visible: false,
            fieldvalue: {
                membershipid: this.props.location.state ? this.props.location.state.membershipid : null,
                firstnum: this.props.location.state ? this.props.location.state.firstnum : null,
                preferredaddress: null,
                minbirthdate: null,
                maxbirthdate: null,
                referralresult: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                enrollchannelfielddisabled: true,
                privatestatefielddisabled: true,
                privatecityfielddisabled: true,
                businessstatefielddisabled: true,
                businesscityfielddisabled: true,
                usernamefielddisabled: true
            },
            optionsGeneralConfig: [],
            defaultCountry: undefined,
            defaultPhoneCountry: undefined,
            activeKey: [],
            identityid: null,
            showModalIdentity: false,
            dataListIdentity: [],
            phoneid: null,
            showModalContact: false,
            dataListContact: [],
            addressid: null,
            showModalAddress: false,
            dataListAddress: [],
            referraldata: {},
            referralCodeChecked: false,
            identityimage: null,
            identityuserimage: null,
            inputData: {},
            key: uuid(),
            identityIndex: -1
        }
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = async () => {
        let membershipid = this.props.match.params.ID;
        let url = api.url.membership.list;
        let criteria = { membershipid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    this.loadComponent(membershipid);
                    this.retrieveReferral();
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    async loadComponent(membershipid) {
        this.props.form.setFieldsValue({ enrollchannel: 'Back Office' });
        await this.componentTierRankSelect.retrieveData({ membershipid });

        /* Range BOD criteria */
        let tierid = this.componentTierRankSelect.state.tierMaxRank;
        await this.setBodCriteria(tierid);

        this.componentSalutationSelect.retrieveData();
        this.componentTitleSelect.retrieveData();
        this.componentNationalitySelect.retrieveData();
        this.componentReligionSelect.retrieveData();
        // this.componentPhoneCountrySelect.retrieveData();
        // this.componentPhoneCountryPrivateSelect.retrieveData();
        // this.componentPhoneCountryBusinessSelect.retrieveData();
        // this.componentCountryPrivateSelect.retrieveData();
        // this.componentCountryBusinessSelect.retrieveData();
        this.componentLanguageSelect.retrieveData();
        this.componentHobbiesCheckbox.retrieveData();

        // this.getOptionsGeneralConfig();

        /* Default Nationality */
        const callback = (nationality) => {
            this.props.form.setFieldsValue({ nationality });
        }
        getGeneralConfig(general_config.default_nationality, callback);

        /* Default Language */
        const callbackLanguage = (language) => {
            this.props.form.setFieldsValue({ language });
        }
        getGeneralConfig(general_config.default_language, callbackLanguage);

        this.props.form.validateFields(['tier']);
    }

    getOptionsGeneralConfig() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {};
        let criteria = {
            key: 'default.country'
        };
        let url = api.url.generalconfig.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsGeneralConfig = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.key;
                    result2['value'] = obj.value;
                    return result2;
                })

                let defaultCountry = optionsGeneralConfig.length ? optionsGeneralConfig[0].value : undefined;
                if (defaultCountry !== undefined) {
                    this.componentStatePrivateSelect.retrieveData({ countrycode: defaultCountry });
                    this.componentStateBusinessSelect.retrieveData({ countrycode: defaultCountry });

                    this.setState({ fielddisabled: { ...this.state.fielddisabled, privatestatefielddisabled: false, businessstatefielddisabled: false } })
                }

                this.setState({ optionsGeneralConfig, defaultCountry });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    retrieveReferral = () => {
        let url = api.url.referralbonus.list;
        let data = { period: moment(new Date()).format('YYYY-MM-DD') };
        RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            const { status, result } = response || {};
            if (status.responsecode === '0000') {
                const referralresult = result.length ? true : false;
                this.setState({
                    fieldvalue: { ...this.state.fieldvalue, referralresult }
                });
            }
        });
    }

    warningSuspect = () => {
        Modal.warning({
            title: 'INFORMATION',
            content: 'We have detected that the member already has a GarudaMiles account registered with a different email address. Please validate which account the member intends to use.',
            okText: 'Ok, Understand',
        });
    }

    warningInactive = () => {
        Modal.success({
            title: 'Success',
            content: 'Success, an activation link is sent to your email.'
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        let referralcode = this.props.form.getFieldValue('referralcode');
        const { actionspage, firstnum, fieldvalue } = this.state;
        const { referralresult } = fieldvalue;
        const callback = () => {
            this.props.form.validateFieldsAndScroll((err, input) => {
                if (!err) {
                    this.setState({ isLoading: true });
                    //tier&registration
                    let tierid = (input.tier) ? input.tier : null;
                    let enrollmentdate = (input.enrolldate) ? moment(input.enrolldate).format("YYYY-MM-DD") : null;
                    let enrollchannel = 'BO';
                    //personal information
                    let salutationcode = (input.salutation) ? input.salutation : null;
                    let titlecode = (input.title) ? input.title : null;
                    let firstname = (input.firstname) ? input.firstname : null;
                    let lastname = (input.lastname) ? input.lastname : null;
                    let gender = (input.gender) ? input.gender : null;
                    let dateofbirth = (input.birthdate) ? moment(input.birthdate).format("YYYY-MM-DD") : null;
                    let nationality = (input.nationality) ? input.nationality : null;
                    let religionid = (input.religion) ? input.religion : null;
                    let langcode = (input.language) ? input.language : null;
                    // let passportnumber = (input.passportno) ? input.passportno : null;
                    // let idcardnumber = (input.idcardno) ? input.idcardno : null;
                    let partnercode = null;
                    let jobcode = null;
                    let nameoncard = (input.nameoncard) ? input.nameoncard : null;
                    nameoncard = (nameoncard === 'customnameoncard') ? input.customnameoncard : nameoncard;
                    let cardnumber = (firstnum) ? (firstnum + input.cardnumber) : input.cardnumber;
                    let username = (input.email) ? input.email : null;
                    let email = (input.email) ? input.email : null;
                    let emailsubscription = (input.emailsubscription) ? input.emailsubscription : null;
                    let emailverified = false;
                    let receivedenrollbonus = false;
                    let firstactivitybonus = false;
                    let checkduplicate = true;
                    let referralcode = (input.referralcode) ? input.referralcode : null;
                    //hobbies
                    let memberhobbies = input.hobbies;
                    //memberphones
                    const { dataListContact } = this.state;
                    let memberphones = dataListContact.map((obj, key) => {
                        return {
                            preferrednumber: obj.preferrednumber,
                            phonetype: obj.phonetype,
                            countrycode: obj.countrycode,
                            regioncode: obj.regioncode,
                            phonenumber: obj.phonenumber,
                            extension: obj.extension
                        }
                    });
                    //member address
                    const { dataListAddress } = this.state;
                    let memberaddress = dataListAddress.map((obj, key) => {
                        return {
                            addresstype: obj.addresstype,
                            companyname: obj.companyname,
                            department: obj.department,
                            position: obj.position,
                            citycode: obj.citycode,
                            address: obj.address,
                            postalcode: obj.postalcode,
                            ispreffered: obj.ispreffered
                        }
                    });

                    let data = {
                        username, titlecode, salutationcode, firstname, lastname, nameoncard, gender, partnercode,
                        jobcode, langcode, dateofbirth, nationality, religionid, email, emailsubscription, enrollchannel, enrollmentdate,
                        memberhobbies, checkduplicate, emailverified, receivedenrollbonus, firstactivitybonus, referralcode
                    };

                    if (memberaddress.length > 0) {
                        data.memberaddress = memberaddress;
                    } else {
                        data.memberaddress = [];
                    }

                    if (memberphones.length > 0) {
                        data.memberphones = memberphones;
                    } else {
                        data.memberphones = null;
                    }

                    //member tier
                    let membertier = {
                        tierid,
                        tierchangeprocess: "UPGRADE",
                        startdate: moment(new Date()).format("YYYY-MM-DD"),
                        enddate: null
                    };
                    data.membertier = membertier;

                    //identity card
                    const { dataListIdentity } = this.state;
                    let memberidentity = dataListIdentity.map(({ identitytype, identitynumber }) => {
                        return {
                            identitytype,
                            identitynumber
                        }
                    });
                    var fileRequest = new FormData();
                    dataListIdentity.forEach(({ identitytype, identityimage = [], identityuserimage = [] }) => {
                        fileRequest.append([`identityimage${identitytype.toLowerCase()}`], identityimage[0].originFileObj);
                        fileRequest.append([`identityuserimage${identitytype.toLowerCase()}`], identityuserimage[0].originFileObj);
                    })

                    fileRequest.append('path', '/identitycard/');

                    if (memberidentity.length > 0) {
                        data.memberidentity = memberidentity;
                    } else {
                        data.memberidentity = [];
                    }

                    //member card
                    if (cardnumber) {
                        let membercard = { cardnumber };
                        data.membercard = membercard;
                    }

                    let message = '';
                    let url = '';
                    if (actionspage === 'create') {
                        message = 'New data has been created';
                        url = api.url.enrollment.enroll;
                    }

                    SaveRequest(url, data, fileRequest).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            if (!response.result.status === "INACTIVEEMAIL") Alert.success(message);
                            if (response.result.status === "SUSPECTDUPLICATE") this.warningSuspect();
                            if (response.result.status === "INACTIVEEMAIL") this.warningInactive();
                            // this.props.history.push('/enrollment/result');
                            this.props.history.push({ pathname: '/enrollment/result', state: { memberid: response.result.memberid } });
                        } else {
                            Alert.error(responsemessage);
                        }
                        //hide loader
                        this.setState({ isLoading: false });
                    })
                }
            });
        }
        (referralresult && !referralcode) ?
            confirm({
                title: 'Continue to save?',
                content: 'You will save data with empty Referral Code.',
                onOk(e) {
                    return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                        callback();
                    }).catch(() => console.log('Oops errors!'));
                },
                onCancel() { },
            }) : callback();
    };


    onChangeCountryPrivate = (privatecountry) => {
        let criteria = { countrycode: privatecountry };
        this.componentStatePrivateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ privatestate: undefined, privatecity: undefined });
        let privatestatefielddisabled = (privatecountry) ? false : true;
        let privatecityfielddisabled = true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, privatestatefielddisabled, privatecityfielddisabled } });
    }

    onChangeStatePrivate = (privatestate) => {
        let criteria = { statecode: privatestate };
        this.componentCityPrivateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ privatecity: undefined });
        let privatecityfielddisabled = (privatestate) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, privatecityfielddisabled } });
    }

    onChangeCountryBusiness = (businesscountry) => {
        let criteria = { countrycode: businesscountry };
        this.componentStateBusinessSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ businessstate: undefined, businesscity: undefined });
        let businessstatefielddisabled = (businesscountry) ? false : true;
        let businesscityfielddisabled = true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, businessstatefielddisabled, businesscityfielddisabled } });
    }

    onChangeStateBusiness = (businessstate) => {
        let criteria = { statecode: businessstate };

        this.componentCityBussinessSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ businesscity: undefined });
        let businesscityfielddisabled = (businessstate) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, businesscityfielddisabled } });
    }

    onChangeEmail = (email) => {
        this.props.form.setFieldsValue({ username: email.target.value });
    }

    onChangePreferredAddress = (event) => {
        let preferredaddress = event ? event.target.value : null;
        let key = ['2'];
        if (preferredaddress === 'Private') { key = ['1'] }

        this.setState({ fieldvalue: { ...this.state.fieldvalue, preferredaddress }, activeKey: key });
    }

    handleFirstNameChange = (event) => {
        let firstname = event.target === null ? '' : event.target.value;
        let lastname = this.props.form.getFieldValue('lastname');
        this.componentNameOnCard.generateNameOnCard(firstname, lastname);
    }

    handleLastNameChange = (event) => {
        let lastname = event.target === null ? '' : event.target.value;
        let firstname = this.props.form.getFieldValue('firstname');
        this.componentNameOnCard.generateNameOnCard(firstname, lastname);
    }

    handleValidateCardNumber = (rule, value, callback) => {
        if (value) {
            if (this.state.firstnum === null) {
                if (value.length < 9) { callback('Card Number must be 9 digits'); }
            } else {
                if (value.length < 7) { callback('Card Number must be 9 digits'); }
            }
        }
        callback();
    }

    handleValidationTier = (rule, value, callback) => {
        const callbackValidation = (optionsMileageCriteria) => {
            if (optionsMileageCriteria.length === 0) {
                callback("Please setup mileage criteria");
            }
            callback();
        }
        this.componentTierRankSelect.retrieveMileageCriteria(value, callbackValidation);
    }

    onClickCollapse = (key) => {
        this.setState({ activeKey: key });
    }

    handleSalutationChange = (value) => {
        let gen = this.componentSalutationSelect.getGender(value);
        let lang = this.componentSalutationSelect.getLanguage(value);
        if (value) {
            this.props.form.setFieldsValue({ gender: gen, language: lang });
        }
    }

    handleTierSelect = (tierid) => {
        this.setBodCriteria(tierid);
    }

    setBodCriteria = async (value) => {
        let callback = (optionsMileageCriteria) => {
            let minbirthdate = null;
            let maxbirthdate = moment(new Date());
            if (optionsMileageCriteria.length) {
                if (optionsMileageCriteria[0] !== undefined && optionsMileageCriteria[0].minage !== undefined) {
                    maxbirthdate = moment(moment().add(-optionsMileageCriteria[0].minage, 'years'));
                }
                if (optionsMileageCriteria[0] !== undefined && optionsMileageCriteria[0].maxage !== undefined) {
                    minbirthdate = moment(moment().add(-(optionsMileageCriteria[0].maxage + 1), 'years').add(+1, 'days'));
                }
            }
            this.setState({ fieldvalue: { ...this.state.fieldvalue, minbirthdate, maxbirthdate } });
        }
        await this.componentTierRankSelect.retrieveMileageCriteria(value, callback);
    }

    /* MEMBER IDENTITY */
    handleOpenModalIdentity = (index = -1) => {
        this.setState({ showModalIdentity: true, identityIndex: index });
    }

    handleCancelIdentity = () => {
        this.setState({ showModalIdentity: false, identityid: null, identityIndex: -1 });
    };

    saveIdentity = (data) => {
        let dataListIdentity = this.state.dataListIdentity;
        dataListIdentity.push(data);
        this.setState({ dataListIdentity }, this.handleCancelIdentity());
    }

    removeIdentity = (index) => {
        let { dataListIdentity } = this.state;
        dataListIdentity.splice(index, 1)
        this.setState({ dataListIdentity });
    }

    updateIdentity = (index, input) => {
        let { dataListIdentity } = this.state;
        dataListIdentity[index] = input;
        this.setState({ dataListIdentity }, this.handleCancelIdentity());
    }

    changeIdentity = (identitytype) => {
        this.setState({ identityimage: 'identityimage' + identitytype.toLowerCase() });
        this.setState({ identityuserimage: 'identityuserimage' + identitytype.toLowerCase() });
    }

    showImage = (inputData) => {
        this.setState({ inputData })
    }

    /* MEMBER ADDRESS */
    handleOpenModalAddress = (addressid) => {
        this.setState({ showModalAddress: true, addressid });
    }

    handleCancelAddress = () => {
        this.setState({ showModalAddress: false, addressid: null });
    };

    saveAddress = (data) => {
        let dataListAddress = this.state.dataListAddress;

        let addressid = Math.random().toString(36).substring(7);
        data = { addressid, ...data };

        dataListAddress.push(data);
        this.setState({ dataListAddress }, this.handleCancelAddress());
    }

    removeAddress = (addressid, ispreffered) => {
        let { dataListAddress } = this.state;
        dataListAddress = dataListAddress.filter(obj => obj.addressid !== addressid);

        /* set first array preffered, if remove address preffered */
        if (ispreffered) {
            dataListAddress = dataListAddress.map(function (obj, key) {
                return { ...obj, ispreffered: (key === 0) ? true : false };
            })
        }
        this.setState({ dataListAddress });
    }

    updateAddress = (addressid, input) => {
        let { dataListAddress } = this.state;
        dataListAddress = dataListAddress.map((obj, key) => {
            if (obj.addressid === addressid) { return input; }
            return obj;
        });

        this.setState({ dataListAddress }, this.handleCancelAddress());
    }

    /* MEMBER CONTACT */
    handleOpenModalContact = (phoneid) => {
        this.setState({ showModalContact: true, phoneid });
    }

    handleCancelContact = () => {
        this.setState({ showModalContact: false, phoneid: null });
    };

    saveContact = (data) => {
        let dataListContact = this.state.dataListContact;

        let phoneid = Math.random().toString(36).substring(7);
        let phonetype = data.phonetype;
        let countrycode = (data.countrycode) ? data.countrycode : null;
        let countryname = (data.countryname) ? data.countryname : null;
        let regioncode = (data.regioncode) ? data.regioncode : null;
        let phonenumber = (data.phonenumber) ? data.phonenumber : null;
        let extension = (data.extension) ? data.extension : null;
        let preferrednumber = (dataListContact.length > 0) ? false : true;

        data = { phoneid, phonetype, countrycode, countryname, regioncode, phonenumber, extension, preferrednumber };

        dataListContact.push(data);
        this.setState({ dataListContact }, this.handleCancelContact());
    }

    removeContact = (phoneid, preferrednumber) => {
        let { dataListContact } = this.state;
        dataListContact = dataListContact.filter(obj => obj.phoneid !== phoneid);
        /* set first array preffered, if remove address preffered */
        if (preferrednumber) {
            dataListContact = dataListContact.map(function (obj, key) {
                return { ...obj, preferrednumber: (key === 0) ? true : false };
            })
        }
        this.setState({ dataListContact });
    }

    updateContact = (phoneid, input) => {
        let { dataListContact } = this.state;
        dataListContact = dataListContact.map((obj, key) => {
            if (obj.phoneid === phoneid) { return input; }
            return obj;
        });

        this.setState({ dataListContact }, this.handleCancelContact());
    }

    setPreferredContact = (phoneid) => {
        let { dataListContact } = this.state;
        dataListContact = dataListContact.map((obj, key) => {
            if (obj.phoneid === phoneid) { return { ...obj, preferrednumber: true }; }
            else { return { ...obj, preferrednumber: false }; }
        });
        this.setState({ dataListContact });
    }

    setPreferredAddress = (addressid) => {
        let { dataListAddress } = this.state;
        dataListAddress = dataListAddress.map((obj, key) => {
            if (obj.addressid === addressid) { return { ...obj, ispreffered: true }; }
            else { return { ...obj, ispreffered: false }; }
        });
        this.setState({ dataListAddress });
    }

    retrieveMember = (referralcode) => {
        let url = api.url.memberreferral.getreferral;
        let data = { referralcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response || {};
            if (status.responsecode === '0000') {
                let { cardnumber, firstname, lastname, status } = result || {};
                this.setState({
                    referraldata: { cardnumber, firstname, lastname, status }
                });
            } else {
                this.setState({ referraldata: {} });
                warning({
                    title: 'Referral code (' + referralcode + ') not found.',
                    content: 'Please input correct referral code.',
                });
            }
            //call loader
            this.setState({ isLoading: false });
        });
    }

    handleCheckReferralCode = (e) => {
        let reffcode = e === null ? null : e.target.value;
        if (reffcode) this.retrieveMember(reffcode);
        this.setState({ referralCodeChecked: true });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender, showModalContact, dataListContact, phoneid, showModalAddress, dataListAddress, addressid,
            dataListIdentity, showModalIdentity, inputData, key, identityIndex, referraldata, referralCodeChecked } = this.state;
        const { firstnum, minbirthdate, maxbirthdate } = this.state.fieldvalue;
        const { generalfielddisabled, enrollchannelfielddisabled, usernamefielddisabled } = this.state.fielddisabled;
        const { menucode } = this.props;

        let firstname = this.props.form.getFieldValue('firstname');
        let lastname = this.props.form.getFieldValue('lastname');
        let defaultPickerValue = moment().set('year', parseInt(moment(maxbirthdate).format("YYYY") - ((moment(maxbirthdate).format("YYYY") - moment(minbirthdate).format("YYYY")) / 2), 0));
        let referralcode = this.props.form.getFieldValue('referralcode');

        if (formrender) {
            //title bar on browser
            document.title = " Member Enrollment | Loyalty Management System ";
            //render form
            return (
                <Row>
                    <Modal visible={showModalIdentity} title="Member Identity" onCancel={this.handleCancelIdentity} footer={null} destroyOnClose={true} width={700}>
                        <IdentityForm {...this.props} dataListIdentity={dataListIdentity} identityIndex={identityIndex} saveIdentity={this.saveIdentity} updateIdentity={this.updateIdentity}
                            changeIdentity={this.changeIdentity} showImage={this.showImage} key={key} />
                    </Modal>
                    <Modal visible={showModalContact} title="Member Contact" onCancel={this.handleCancelContact} footer={null} destroyOnClose={true} width={700}>
                        <ContactForm dataListContact={dataListContact} phoneid={phoneid} saveContact={this.saveContact} updateContact={this.updateContact} />
                    </Modal>
                    <Modal visible={showModalAddress} title="Member Address" onCancel={this.handleCancelAddress} footer={null} destroyOnClose={true} width={700}>
                        <AddressForm dataList={dataListAddress} addressid={addressid} saveAddress={this.saveAddress} updateAddress={this.updateAddress} />
                    </Modal>
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Affix offsetTop={40}>
                            <Sider width={200} style={{ background: '#fff' }}>
                                <Anchor>
                                    <Link href="#tier" title="Tier & Registration" />
                                    <Link href="#personal-information" title="Personal Information" />
                                    <Link href="#identity" title="Identity" />
                                    <Link href="#contact" title="Contact" />
                                    <Link href="#address" title="Address" />
                                    <Link href="#preferences-interests" title="Preferences & Interests" />
                                    <Link href="#member-account" title="Member Account" />
                                </Anchor>
                            </Sider>
                        </Affix>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                            <Row>
                                <Col xs={24} xl={22}>
                                    <Title level={3}> Member Enrollment </Title>
                                </Col>
                                <Divider />
                            </Row>
                            <Spin spinning={this.state.isLoading}>
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" >
                                            <Divider id="tier">Tier & Registration</Divider>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <TierRankSelect tierMaxRank ref={(e) => { this.componentTierRankSelect = e }} labeltext="Tier" datafield="tier" form={this.props.form} validationrules={['required', this.handleValidationTier]} onChange={this.handleTierSelect} disabled={true} />
                                            <DatePickerBase form={this.props.form} labeltext="Date of Enrollment" datafield="enrolldate" validationrules={['required']} defaultValue={moment(new Date())} maxDate={moment(new Date())} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Form of Registration" datafield="enrollchannel" maxLength={200} disabled={enrollchannelfielddisabled} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" >
                                            <Divider id="personal-information">Personal Information</Divider>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <SalutationSelect ref={(e) => { this.componentSalutationSelect = e }} form={this.props.form} labeltext="Salutation" datafield="salutation" onChange={this.handleSalutationChange} disabled={generalfielddisabled} />
                                            <TitleSelect ref={(e) => { this.componentTitleSelect = e }} form={this.props.form} labeltext="Title" datafield="title" disabled={generalfielddisabled} />
                                            <Row gutter={2}>
                                                <Col xs={16} sm={16} md={16}>
                                                    <InputText labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={this.props.form} labeltext="Member Name" placeholder="First Name" datafield="firstname" validationrules={['required', 'pattern.letterspace']} maxLength={45} onChange={this.handleFirstNameChange} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={8} sm={8} md={8}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Last Name" datafield="lastname" validationrules={['pattern.letter']} maxLength={45} onChange={this.handleLastNameChange} disabled={generalfielddisabled} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            {/* <InputText form={this.props.form} labeltext="Name on Card" datafield="nameoncard" disabled={generalfielddisabled} /> */}
                                            <NameOnCardRadio ref={(e) => { this.componentNameOnCard = e }} className={(firstname || lastname) ? '' : 'hidden'} form={this.props.form} labeltext="Name on Card" datafield="nameoncard" validationrules={['required', 'pattern.letterspace', 'max.45']} maxLength={45} />
                                            <InputText form={this.props.form} labeltext="Email" datafield="email" validationrules={['required', 'pattern.email']} maxLength={45} disabled={generalfielddisabled} onChange={this.onChangeEmail} />
                                            {/* <SwitchButton form={this.props.form} labeltext="Subscription" datafield="emailsubscription" disabled={generalfielddisabled} /> */}
                                            <SelectBase form={this.props.form} labeltext="Gender" datafield="gender" options={optionsGender} validationrules={['required']} disabled={generalfielddisabled} />
                                            <DatePickerBase form={this.props.form} labeltext="Date of Birth" datafield="birthdate" minDate={moment(minbirthdate)} maxDate={moment(maxbirthdate)} validationrules={['required']} defaultPickerValue={defaultPickerValue} disabled={generalfielddisabled} />
                                            <NationalitySelect ref={(e) => { this.componentNationalitySelect = e }} form={this.props.form} labeltext="Nationality" datafield="nationality" validationrules={['required']} disabled={generalfielddisabled} custom={true} />
                                            <ReligionSelect ref={(e) => { this.componentReligionSelect = e }} form={this.props.form} labeltext="Religion" datafield="religion" disabled={generalfielddisabled} />
                                            <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} form={this.props.form} labeltext="Preferred Language" datafield="language" validationrules={['required']} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Passport No" datafield="passportno" validationrules={['pattern.name']} maxLength={45} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="ID Card No" datafield="idcardno" validationrules={['pattern.name']} maxLength={45} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Referral Code" datafield="referralcode" validationrules={['pattern.alphanumeric']} maxLength={45} onBlur={(e) => this.handleCheckReferralCode(e)} disabled={generalfielddisabled}
                                                suffix=
                                                {(referraldata.cardnumber) ?
                                                    <Tooltip title={`${referraldata.cardnumber} - ${referraldata.firstname} ${referraldata.lastname ? referraldata.lastname : ''} (${referraldata.status})`}>
                                                        <Icon type="info-circle" theme="twoTone" twoToneColor="#52c41a" style={{ display: (referralcode && referralCodeChecked) ? 'block' : 'none' }} />
                                                    </Tooltip> : ''
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <IdentityIndex dataList={dataListIdentity} handleOpenModalIdentity={this.handleOpenModalIdentity} handleCancelIdentity={this.handleCancelIdentity} removeIdentity={this.removeIdentity} inputData={inputData} />
                                    <ContactIndex dataList={dataListContact} handleOpenModalContact={this.handleOpenModalContact} handleCancelContact={this.handleCancelContact} removeContact={this.removeContact} setPreferredContact={this.setPreferredContact} />
                                    <AddressIndex dataList={dataListAddress} handleOpenModalAddress={this.handleOpenModalAddress} handleCancelAddress={this.handleCancelAddress} removeAction={this.removeAddress} setPreferred={this.setPreferredAddress} />
                                    <Row gutter={24}>
                                        <Col className="gutter-row" >
                                            <Divider id="preferences-interests">Preferences & Interests</Divider>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 6 }} xl={{ span: 18, offset: 6 }}>
                                            <HobbiesCheckbox ref={(e) => { this.componentHobbiesCheckbox = e }} form={this.props.form} datafield="hobbies" disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" >
                                            <Divider id="member-account">Member Account</Divider>
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <InputText form={this.props.form} labeltext="Username" datafield="username" disabled={usernamefielddisabled} />
                                            <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" validationrules={['pattern.number', this.handleValidateCardNumber]} maxLength={(firstnum) ? 7 : 9} prefix={(firstnum) ? firstnum : false} disabled={generalfielddisabled} />

                                        </Col>
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode}></Button>
                                        <Button url={'/enrollment'} type="default" label="Back" />
                                    </Row>
                                </Form>
                            </Spin>
                        </Content>
                    </Layout>
                </Row >
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

class IdentityIndex extends Component {
    render() {
        const { dataList } = this.props;
        return (
            <Row gutter={24}>
                <Col className="gutter-row" >
                    <Divider id="identity">Identity</Divider>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <AntButton type="primary" size="small" onClick={() => this.props.handleOpenModalIdentity()}>Add New</AntButton>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table rowKey="identitynumber" dataSource={dataList} pagination={false} scroll={{ y: 240 }}>
                        <Column title="Identity Type" dataIndex="identitytype" key="identitytype" width="15%"
                            render={(value, row, index) => (value) ? value : '-'} />
                        <Column title="Identity Number" dataIndex="identitynumber" key="identitynumber" width="15%"
                            render={(value, row, index) => (value) ? value : '-'} />
                        <Column title="Identity Image" dataIndex="identityimage" key="identityimage" width="15%"
                            render={(value, row, index) => <img src={value[0].thumbUrl} alt="" width="100" />} />
                        <Column
                            title="Action"
                            key="action"
                            width="10%"
                            render={(value, row, index) => (
                                <span>
                                    <AntButton type="primary" size="small" icon="edit" onClick={() => this.props.handleOpenModalIdentity(index)} />
                                    <AntButton type="danger" size="small" icon="delete" onClick={() => this.props.removeIdentity(index)} />
                                </span>
                            )}
                        />
                    </Table>
                </Col>
            </Row>
        )
    }
}

class IdentityFormApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showAddModal: false,
            identityimage: null,
            identityuserimage: null,
            key: 1,
            keyUpload1: uuid()
        }
    }

    componentDidMount() {
        this.getDetail();
        let { identityIndex } = this.props;
        if (identityIndex !== -1) {
            this.getDetail();
        }
        else {
            this.props.form.resetFields(['identitytype', 'identitynumber', 'identityimage', 'identityuserimage']);
            this.setState({
                identityimage: null,
                identityuserimage: null,
            })
        }
    }

    getDetail = () => {
        let { dataListIdentity, identityIndex } = this.props;

        if (identityIndex !== -1) {
            const { identityimage = [], identityuserimage = [] } = dataListIdentity[identityIndex] || {};

            this.setState({
                identityimage: identityimage.length ? identityimage[0] : null,
                identityuserimage: identityuserimage.length ? identityuserimage[0] : null,
                key: this.state.key + 1,
                keyUpload1: uuid()
            })

            this.props.form.setFieldsValue(dataListIdentity[identityIndex]);
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        let { identityIndex } = this.props;
        this.props.form.validateFieldsAndScroll(['identitytype', 'identitynumber', 'identityimage', 'identityuserimage'], (err, input) => {
            if (!err) {
                if (identityIndex !== -1) {
                    this.props.updateIdentity(identityIndex, input);
                } else {
                    this.props.saveIdentity(input);
                }
            }
        });
    }

    onChangeType = (identitytype) => {
        this.props.changeIdentity(identitytype)
    }

    errorCondition = (type, value) => {
        this.setState({ [type]: value })
    }

    render() {
        const { isLoading, key, keyUpload1, identityimage, identityuserimage } = this.state;
        const { dataListIdentity = [], identityIndex = -1 } = this.props;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        let optionsType2 = optionsType.filter(x => !dataListIdentity.map(y => y.identitytype).includes(x.value))

        if (identityIndex !== -1) optionsType2.unshift(optionsType.find(x => x.value === dataListIdentity[identityIndex].identitytype))

        return (
            <Spin spinning={isLoading}>
                <Form {...formItemLayout} onSubmit={this.saveAction}>
                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                            <SelectBase form={this.props.form} labeltext="Identity Type" datafield="identitytype" options={optionsType2} validationrules={['required']} onChange={this.onChangeType} />
                            <InputText form={this.props.form} labeltext="ID Card No" datafield="identitynumber" validationrules={['max.45', 'required']} maxLength={45} />
                            <UploadBase form={this.props.form} blob={identityimage} accept={'image/jpeg, image/png'} maxSize={.5} value={identityimage} labeltext="Identity Image" datafield="identityimage" validationrules={['required']} key={keyUpload1} errorCondition={(type, value) => this.errorCondition(type, value)} custom={true} />
                            <UploadBase form={this.props.form} blob={identityuserimage} accept={'image/jpeg, image/png'} maxSize={.5} value={identityuserimage} labeltext="Identity User Image" datafield="identityuserimage" validationrules={['required']} key={key} errorCondition={(type, value) => this.errorCondition(type, value)} custom={true} />
                        </Col>
                    </Row>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                        <Button htmlType="submit" type="default" label="Save" />
                    </Row>
                </Form>
            </Spin>
        )
    }
}

class ContactIndex extends Component {
    render() {
        const { dataList } = this.props;
        return (
            <Row gutter={24}>
                <Col className="gutter-row" >
                    <Divider id="contact">Contact</Divider>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <AntButton type="primary" size="small" onClick={() => this.props.handleOpenModalContact()}>Add New</AntButton>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table rowKey={record => record.phoneid} dataSource={dataList} pagination={false} scroll={{ y: 240 }}>
                        <Column title="Phone Type" dataIndex="phonetype" key="phonetype"
                            render={
                                (value) => (value) ?
                                    (optionsPhoneType.filter(obj => obj.value === value) && optionsPhoneType.filter(obj => obj.value === value)[0])
                                        ? optionsPhoneType.filter(obj => obj.value === value)[0]['label'] : '-'
                                    : '-'
                            }
                        />
                        <Column title="Phone Country Code" dataIndex="countryname" key="countryname" width="15%"
                            render={(value) => (value) ? value : '-'}
                        />
                        <Column title="Region Code" dataIndex="regioncode" key="regioncode" width="15%"
                            render={(value) => (value) ? value : '-'} />
                        <Column title="Phone Number" dataIndex="phonenumber" key="phonenumber" width="15%"
                            render={(value) => (value) ? value : '-'} />
                        <Column title="Extension" dataIndex="extension" key="extension" width="15%"
                            render={(value) => (value) ? value : '-'} />
                        <Column title="Preferred Contact" dataIndex="preferrednumber" key="preferrednumber" width="15%" align="center"
                            render={(_value, row) => <Checkbox onClick={() => this.props.setPreferredContact(row.phoneid)} checked={row.preferrednumber} />} />
                        <Column
                            title="Action"
                            key="action"
                            width="10%"
                            render={(_value, row) => (
                                <span>
                                    <AntButton type="primary" size="small" icon="edit" onClick={() => this.props.handleOpenModalContact(row.phoneid)} />
                                    <AntButton type="danger" size="small" icon="delete" onClick={() => this.props.removeContact(row.phoneid, row.preferrednumber)} />
                                </span>
                            )}
                        />
                    </Table>
                </Col>
            </Row>
        )
    }
}

class ContactFormApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showAddModal: false
        }
    }

    componentDidMount() {
        this.componentPhoneCountryCodeSelect.retrieveData();
        let phoneid = this.props.phoneid;

        if (phoneid) {
            this.getDetail();
        } else {
            const callback = (countrycode) => {
                this.props.form.setFieldsValue({ countrycode });
            }
            getGeneralConfig(general_config.default_country, callback);
        }
    }

    getDetail = () => {
        let { phoneid, dataListContact } = this.props;
        dataListContact = dataListContact.filter(obj => obj.phoneid === phoneid);

        if (dataListContact.length > 0) {
            let phonetype = (dataListContact[0]['phonetype']) ? dataListContact[0]['phonetype'] : null;
            let countrycode = (dataListContact[0]['countrycode']) ? dataListContact[0]['countrycode'] : null;
            let regioncode = (dataListContact[0]['regioncode']) ? dataListContact[0]['regioncode'] : null;
            let phonenumber = (dataListContact[0]['phonenumber']) ? dataListContact[0]['phonenumber'] : null;
            let extension = (dataListContact[0]['extension']) ? dataListContact[0]['extension'] : null;
            let fieldValue = { phonetype, countrycode, regioncode, phonenumber, extension };
            this.props.form.setFieldsValue(fieldValue);
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        let { phoneid, dataListContact } = this.props;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                let countryname = this.componentPhoneCountryCodeSelect.state.options.filter(obj => obj.value === input.countrycode)[0]['label'];

                let data = {};
                data.phonetype = input.phonetype;
                data.countrycode = (input.countrycode) ? input.countrycode : null;
                data.countryname = (countryname) ? countryname : null;
                data.phonecountrycode = (input.phonecountrycode) ? input.phonecountrycode : null;
                data.regioncode = (input.regioncode) ? input.regioncode : null;
                data.phonenumber = (input.phonenumber) ? input.phonenumber : null;
                data.extension = (input.extension) ? input.extension : null;
                data.preferrednumber = (input.preferrednumber) ? input.preferrednumber : false;

                if (phoneid) {
                    dataListContact = dataListContact.filter(obj => obj.phoneid === phoneid);
                    data.preferrednumber = (dataListContact[0]['preferrednumber']) ? dataListContact[0]['preferrednumber'] : false;

                    data.phoneid = phoneid;
                    this.props.updateContact(phoneid, data);
                } else {
                    this.props.saveContact(data);
                }
            }
        });
    }

    handleChangePhoneType = (value) => {
        if (value === 'MOBILE') {
            let regioncode = undefined;
            let extension = undefined;
            this.props.form.setFieldsValue({ regioncode, extension });
        }
    }

    render() {
        const { isLoading } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        let phonetype = this.props.form.getFieldValue('phonetype');
        return (
            <Spin spinning={isLoading}>
                <Form {...formItemLayout} onSubmit={this.saveAction}>
                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                            <SelectBase form={this.props.form} labeltext="Phone Type" datafield="phonetype" options={optionsPhoneType} validationrules={['required']} onChange={this.handleChangePhoneType} />
                            <CountryPhoneSelect ref={(e) => { this.componentPhoneCountryCodeSelect = e }} form={this.props.form} labeltext="Country Code" datafield="countrycode" validationrules={['required']} />
                            <InputText form={this.props.form} className={(phonetype === 'MOBILE') ? 'hidden' : ''} labeltext="Region Code" datafield="regioncode" validationrules={(phonetype === 'MOBILE') ? ['pattern.number', 'max.3'] : ['required', 'pattern.number', 'max.3']} maxLength={3} />
                            <InputText form={this.props.form} labeltext="Phone Number" datafield="phonenumber" validationrules={['required', 'pattern.number', 'max.20']} maxLength={20} />
                            <InputText form={this.props.form} className={(phonetype === 'MOBILE') ? 'hidden' : ''} labeltext="Extension" datafield="extension" validationrules={['pattern.number', 'max.20']} maxLength={20} />
                        </Col>
                    </Row>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                        <Button htmlType="submit" type="default" label="Save" />
                    </Row>
                </Form>
            </Spin>
        )
    }
}

class AddressIndex extends Component {
    render() {
        const { dataList } = this.props;
        let addressByType = dataList.map((obj, i) => obj.addresstype);
        addressByType = addressByType.filter((v, i) => addressByType.indexOf(v) === i);

        let addAddress = (addressByType.length === 2) ? false : true;

        return (
            <Row gutter={24}>
                <Col className="gutter-row" >
                    <Divider id="address">Address</Divider>
                </Col>
                {
                    (addAddress) ?
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'right', marginBottom: '10px' }}>
                            <AntButton type="primary" size="small" onClick={() => this.props.handleOpenModalAddress()}>Add New</AntButton>
                        </Col> : null
                }
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table rowKey={record => record.addressid} dataSource={dataList} pagination={false} scroll={{ y: 240 }}>
                        <Column title="Type" dataIndex="addresstype" key="addresstype" width="20%" />
                        <Column title="Address" dataIndex="address" key="address" width="25%"
                            render={(_value, row) =>
                                <span>
                                    {(row.addresstype === 'BUSINESS' && row.companyname) ? <Text strong>{row.companyname}<br /></Text> : ''}
                                    {(row.address) ? row.address : ''}
                                </span>
                            }
                        />
                        <Column title="Area" dataIndex="area" key="area" width="30%"
                            render={(_value, row) => row.countryname + ", " + row.statename + ", " + row.cityname} />
                        <Column title="Preferred Address" dataIndex="ispreffered" key="ispreffered" width="15%" align="center"
                            render={(_value, row) => <Checkbox onClick={() => this.props.setPreferred(row.addressid)} checked={row.ispreffered} />} />
                        <Column
                            title="Action"
                            key="action"
                            width="10%"
                            render={(value, row) => (
                                <span>
                                    <AntButton type="primary" size="small" icon="edit" onClick={() => this.props.handleOpenModalAddress(row.addressid)} />
                                    <AntButton type="danger" size="small" icon="delete" onClick={() => this.props.removeAction(row.addressid, row.ispreffered)} />
                                </span>
                            )}
                        />
                    </Table>
                </Col>
            </Row>
        )
    }
}


class AddressFormApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showAddModal: false,
            fielddisabled: {
                statecodefielddisabled: true,
                citycodefielddisabled: true,
                statecodebusinessfielddisabled: true,
                citycodebusinessfielddisabled: true
            },
        }
    }

    componentDidMount() {
        this.componentCountrySelect.retrieveData();
        let addressid = this.props.addressid;

        if (addressid) {
            this.getDetail();
        } else {
            const callback = (countrycode) => {
                if (countrycode) {
                    let statecodefielddisabled = false;
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled } });

                    let criteria = { countrycode };
                    this.componentStateSelect.retrieveData(criteria);
                }
                this.props.form.setFieldsValue({ countrycode });
            }
            getGeneralConfig(general_config.default_country, callback);
        }
    }

    getDetail = () => {
        let { addressid, dataList } = this.props;
        dataList = dataList.filter(obj => obj.addressid === addressid);

        if (dataList.length > 0) {
            let addresstype = (dataList[0]['addresstype']) ? dataList[0]['addresstype'] : null;
            let countrycode = (dataList[0]['countrycode']) ? dataList[0]['countrycode'] : null;
            let statecode = (dataList[0]['statecode']) ? dataList[0]['statecode'] : null;
            let citycode = (dataList[0]['citycode']) ? dataList[0]['citycode'] : null;
            let postalcode = (dataList[0]['postalcode']) ? dataList[0]['postalcode'] : null;
            let privateaddress = (dataList[0]['address']) ? dataList[0]['address'] : null;
            let businessaddress = (dataList[0]['address']) ? dataList[0]['address'] : null;
            let companyname = (dataList[0]['companyname']) ? dataList[0]['companyname'] : null;
            let department = (dataList[0]['department']) ? dataList[0]['department'] : null;
            let position = (dataList[0]['position']) ? dataList[0]['position'] : null;

            let fieldValue = {
                addresstype, countrycode, statecode, citycode, postalcode,
                privateaddress, businessaddress, companyname, department, position
            };
            this.props.form.setFieldsValue(fieldValue);

            let statecodefielddisabled = false;
            let citycodefielddisabled = false;

            this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled, citycodefielddisabled } });
            this.componentStateSelect.retrieveData();
            this.componentCitySelect.retrieveData();
        }
    }


    saveAction = (e) => {
        e.preventDefault();
        let { addressid, dataList } = this.props;
        this.props.form.validateFieldsAndScroll((err, input) => {

            if (!err) {
                let countryname = this.componentCountrySelect.state.options.filter(obj => obj.value === input.countrycode)[0]['label'];
                let statename = this.componentStateSelect.state.options.filter(obj => obj.value === input.statecode)[0]['label'];
                let cityname = this.componentCitySelect.state.options.filter(obj => obj.value === input.citycode)[0]['label'];

                let data = {};
                data.addresstype = input.addresstype;
                data.countrycode = (input.countrycode) ? input.countrycode : null;
                data.countryname = countryname;
                data.statecode = (input.statecode) ? input.statecode : null;
                data.statename = statename;
                data.citycode = (input.citycode) ? input.citycode : null;
                data.cityname = cityname;

                if (input.addresstype === 'PRIVATE') {
                    data.companyname = (input.companyname) ? input.companyname : null;
                    data.department = (input.department) ? input.department : null;
                    data.address = (input.privateaddress) ? input.privateaddress : null;
                    data.position = (input.position) ? input.position : null;
                    data.postalcode = (input.postalcode) ? input.postalcode : null;
                    data.ispreffered = (input.ispreffered) ? input.ispreffered : false;
                } else if (input.addresstype === 'BUSINESS') {
                    data.companyname = (input.companyname) ? input.companyname : null;
                    data.department = (input.department) ? input.department : null;
                    data.address = (input.businessaddress) ? input.businessaddress : null;
                    data.position = (input.position) ? input.position : null;
                    data.postalcode = (input.postalcode) ? input.postalcode : null;
                    data.ispreffered = (input.ispreffered) ? input.ispreffered : false;
                }

                if (addressid) {
                    dataList = dataList.filter(obj => obj.addressid === addressid);
                    data.ispreffered = (dataList[0]['ispreffered']) ? dataList[0]['ispreffered'] : false;

                    data.addressid = addressid;
                    this.props.updateAddress(addressid, data);
                } else {
                    if (dataList.length === 0) {
                        data.ispreffered = true;
                    }
                    this.props.saveAddress(data);
                }
            }
        });
    }

    onChangeCountry = (countrycode) => {
        let criteria = { countrycode };
        this.componentStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ countrycode, statecode: undefined, citycode: undefined });
        let statecodefielddisabled = (countrycode) ? false : true;
        let citycodefielddisabled = true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled, citycodefielddisabled } });
    }

    onChangeState = (statecode) => {
        let criteria = { statecode };
        this.componentCitySelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ citycode: undefined });
        let citycodefielddisabled = (statecode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, citycodefielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isLoading } = this.state;
        const { dataList, addressid } = this.props;
        const { statecodefielddisabled, citycodefielddisabled } = this.state.fielddisabled;
        let optionsAddressType = [];
        let addressByType = dataList.map((obj, i) => obj.addresstype);

        addressByType = addressByType.filter((v, i) => addressByType.indexOf(v) === i);
        if (addressByType.length === 0) {
            optionsAddressType = [
                { value: 'BUSINESS', label: 'Business' },
                { value: 'PRIVATE', label: 'Private' }
            ];
        } else if (addressByType.includes('BUSINESS')) {
            optionsAddressType = [
                { value: 'PRIVATE', label: 'Private' }
            ];
        } else if (addressByType.includes('PRIVATE')) {
            optionsAddressType = [
                { value: 'BUSINESS', label: 'Business' }
            ];
        }

        let addresstype = this.props.form.getFieldValue('addresstype');
        return (
            <Spin spinning={isLoading}>
                <Form {...formItemLayout} onSubmit={this.saveAction}>
                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                            <SelectBase form={this.props.form} labeltext="Type" datafield="addresstype" validationrules={['required']} options={optionsAddressType} disabled={(addressid) ? true : false} />
                            <TextArea form={this.props.form} labeltext="Home Address" datafield="privateaddress" className={(addresstype === 'PRIVATE') ? '' : 'hidden'} />
                            <TextArea form={this.props.form} labeltext="Business Address" datafield="businessaddress" className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />

                            <InputText form={this.props.form} labeltext="Company Name" datafield="companyname" validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                            <InputText form={this.props.form} labeltext="Department" datafield="department" validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                            <InputText form={this.props.form} labeltext="Position" datafield="position" validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />

                            <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="countrycode" form={this.props.form} validationrules={['required']} onChange={this.onChangeCountry} />
                            <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="statecode" form={this.props.form} validationrules={['required']} onChange={this.onChangeState} disabled={statecodefielddisabled} />
                            <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="citycode" form={this.props.form} validationrules={['required']} disabled={citycodefielddisabled} />
                            <InputText form={this.props.form} labeltext="Postal Code" datafield="postalcode" validationrules={['pattern.number']} maxLength={5} />
                        </Col>
                    </Row>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                        <Button htmlType="submit" type="default" label="Save" />
                    </Row>
                </Form>
            </Spin>
        )
    }
}

const IdentityForm = Form.create()(IdentityFormApp);
const ContactForm = Form.create()(ContactFormApp);
const AddressForm = Form.create()(AddressFormApp);

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));