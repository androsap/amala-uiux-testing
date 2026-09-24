import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { Alert, InputText, TextArea, CountrySelect, StateSelect, CitySelect, LanguageSelect, DatePickerBase, DateRangeBase, SelectBase, CheckboxBase, InputNumber, Button } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Icon, Modal } from 'antd';
import moment from 'moment';
import { getProfile } from '../../utilities/AuthService';
import { BussinessField, CorporateRole, CorporateType, IdType } from '../../data';
import Admin from './Form/Admin';

const { warning } = Modal;
const { Title, Text } = Typography;

let id = 0;

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
            travelcordinator: [],
            admincordinator: [],
            idcardnumber: null,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statecodefielddisabled: true,
                citycodefielddisabled: true,
                maxmemberfielddisabled: false,
                idnumberdisabled: true
            },
            staffidcardnumberundisabled: [],
            admincardnumberundisabled: []
        }
    }

    componentDidMount() {
        document.title = " Enrollment Corporate | Loyalty Management System ";

        this.componentCountrySelect.retrieveData();
        this.componentLanguageSelect.retrieveData();

        this.getOptionsGeneralConfig();
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
                    this.componentStateSelect.retrieveData({ countrycode: defaultCountry });

                    this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled: false } })
                }

                this.setState({ defaultCountry });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                //member
                let member = {
                    username: input.corporateemail,
                    enrollchannel: 'CORPORATE',
                    enrollmentdate: moment(new Date()).format("YYYY-MM-DD"),
                    branchcodeenroll: getProfile().branchcode,
                    branchcodeaddress: getProfile().branchcode
                };

                //membercorporatedetail
                const { corporatename, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, corporatetype, businessfield, contactname, contactidnum, contactidtype, contactemail, contactphonenum, maxmember } = input;
                let corporatecode = input.corporatecode.toUpperCase();
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let actioncount = 0;
                let unlimited = (input.unlimited) ? input.unlimited : false;
                let membercorporatedetail = { corporatecode, corporatename, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, corporatetype, businessfield, contactname, contactidnum, contactidtype, contactemail, contactphonenum, startdate, enddate, maxmember, unlimited, actioncount };

                //corporatetourcode
                let tourcode = (input.tourcode) ? input.tourcode.toUpperCase() : null;
                let description = (input.description) ? input.description : null;
                let starttourdate = (input.tourdate && input.tourdate[0]) ? moment(input.tourdate[0]).format("YYYY-MM-DD") : null;
                let endtourdate = (input.tourdate && input.tourdate[1]) ? moment(input.tourdate[1]).format("YYYY-MM-DD") : null;
                let corporatetourcode = { corporatecode, tourcode, description, startdate: starttourdate, enddate: endtourdate };

                //travelcordinator
                let travelcordinatorstaff = [];
                let travelcordinatoradmin = [];

                for (const field in input.admin) {
                    for (const field2 in input.admin[field]) {
                        travelcordinatoradmin[field] = (travelcordinatoradmin[field]) ? travelcordinatoradmin[field] : {};
                        let value = (input.admin[field][field2]) ? input.admin[field][field2] : null;
                        /* format date */
                        if (field2.includes(['birthdate'])) {
                            value = (value) ? moment(value).format("YYYY-MM-DD") : null;
                        }
                        travelcordinatoradmin[field][field2] = value;
                        travelcordinatoradmin[field]['travelcordinatortype'] = 'ADMIN';
                        travelcordinatoradmin[field]['updateidcardnumber'] = (this.state.idcardnumber) ? false : true;
                    }
                }
                for (const field in input.staff) {
                    for (const field2 in input.staff[field]) {
                        travelcordinatorstaff[field] = (travelcordinatorstaff[field]) ? travelcordinatorstaff[field] : {};
                        let value = (input.staff[field][field2]) ? input.staff[field][field2] : null;
                        /* format date */
                        if (field2.includes(['birthdate'])) {
                            value = (value) ? moment(value).format("YYYY-MM-DD") : null;
                        }
                        travelcordinatorstaff[field][field2] = value;
                        travelcordinatorstaff[field]['travelcordinatortype'] = 'STAFF';
                        travelcordinatorstaff[field]['updateidcardnumber'] = (this.state.idcardnumber) ? false : true;
                    }
                }
                let travelcordinators = travelcordinatorstaff.concat(travelcordinatoradmin);
                let travelcordinator = travelcordinators.filter(element => { return element !== null; });

                let message = 'New data has been created';
                let url = api.url.enrollmentcorporate.enroll;

                let data = { member, membercorporatedetail, corporatetourcode, travelcordinator };

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push({ pathname: '/enrollment-corporate/result', state: { memberid: response.result.membercorporatedetail.memberid } });
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeCountry = (countrycode) => {
        let criteria = { countrycode };
        this.componentStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ statecode: undefined, citycode: undefined });
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

    handleUnlimitedChannel = (event) => {
        let unlimited = event === null ? null : event.target.checked;
        let maxmemberfielddisabled = unlimited;

        this.setState({ fielddisabled: { ...this.state.fielddisabled, maxmemberfielddisabled } });
        this.props.form.setFieldsValue({ maxmember: 0 });
    }

    handleAddStaff = () => {
        let { travelcordinator } = this.state;
        travelcordinator = travelcordinator.concat(id++);
        this.setState({ travelcordinator });
    }

    handleRemoveStaff(k) {
        let { travelcordinator } = this.state;

        travelcordinator = travelcordinator.filter(key => key !== k);
        this.setState({ travelcordinator });
    }

    handleFieldChange = (e, key) => {
        let name = e.target.name ? (e.target.name).split('_')[0] : null;
        let value = e.target.value ? e.target.value : null;
        let travelcordinator = [...this.state.travelcordinator];
        travelcordinator[key][name] = value;
        this.setState({ travelcordinator });
    }

    handleDateChange = (value, key) => {
        let travelcordinator = [...this.state.travelcordinator];
        travelcordinator[key]['birthdate'] = moment(value).format('YYYY-MM-DD');
        this.setState({ travelcordinator });
    }

    handleSelectChange = (value, key) => {
        let travelcordinator = [...this.state.travelcordinator];
        travelcordinator[key]['rolecode'] = value;
        this.setState({ travelcordinator });
    }

    handlePointConversionChange = (event) => {
        let pointconversion = event === null ? null : event.target.value;
        /* RATING GET MILAGE CONVERSION */
        let partnercode = this.props.form.getFieldValue('partnercode');
        let activitycode = this.props.form.getFieldValue('activitycode');
        this.getRating(partnercode, activitycode, pointconversion);
    }

    retrieveMember = (cardnumber, type, key, command) => {
        let url = api.url.member.profile;
        let data = { cardnumber };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let { email, idcardnumber, firstname, lastname, dateofbirth, username, membercontacts } = result || {};
                let memberfullname = `${firstname}${lastname ? " " + lastname : ""}`;
                let contacts = (membercontacts.length !== 0) ? (membercontacts.find(val => val.preferrednumber && val.active)) ? membercontacts.find(val => val.preferrednumber && val.active).phonenumber : null : null;
                dateofbirth = dateofbirth ? moment(dateofbirth) : null;
                if (type === 'admin') {
                    this.props.form.setFieldsValue({
                        ['admin[' + key + '][name]']: memberfullname,
                        ['admin[' + key + '][birthdate]']: dateofbirth,
                        ['admin[' + key + '][idcardnumber]']: idcardnumber,
                        ['admin[' + key + '][email]']: email,
                        ['admin[' + key + '][username]']: username,
                        ['admin[' + key + '][phonenumber]']: contacts,
                    });
                    //validate ID Number disabled field
                    if (key > 0) {
                        let { admincardnumberundisabled } = this.state;
                        const idx = admincardnumberundisabled.findIndex(x => x === key);

                        if (!idcardnumber) {
                            if (idx === -1) admincardnumberundisabled.push(key);
                        } else if (idx !== -1) admincardnumberundisabled.splice(idx, 1);

                        this.setState({ admincardnumberundisabled })
                    } else {
                        if (!idcardnumber) this.setState({ fielddisabled: { ...this.state.fielddisabled, idnumberdisabled: false } });
                        else this.setState({ fielddisabled: { ...this.state.fielddisabled, idnumberdisabled: true } });
                    };

                    if (!command) this.helperAdminDisabled(cardnumber, type, key, 'stop');
                } else {
                    this.props.form.setFieldsValue({
                        ['staff[' + key + '][name]']: memberfullname,
                        ['staff[' + key + '][birthdate]']: dateofbirth,
                        ['staff[' + key + '][idcardnumber]']: idcardnumber,
                        ['staff[' + key + '][email]']: email,
                        ['staff[' + key + '][username]']: username,
                        ['staff[' + key + '][phonenumber]']: contacts,
                    })
                    //validate ID Number disabled field
                    let { staffidcardnumberundisabled } = this.state;
                    const idx = staffidcardnumberundisabled.findIndex(x => x === key);

                    if (!idcardnumber) {
                        if (idx === -1) staffidcardnumberundisabled.push(key);
                    }
                    else {
                        if (idx !== -1) staffidcardnumberundisabled.splice(idx, 1);
                    }
                    this.setState({ staffidcardnumberundisabled })
                }
                this.setState({ idcardnumber });
            } else {
                if (type === 'admin') {
                    this.props.form.setFieldsValue({
                        ['admin[' + key + '][admincardnumber]']: undefined,
                        ['admin[' + key + '][adminname]']: undefined,
                        ['admin[' + key + '][adminbirthdate]']: null,
                        ['admin[' + key + '][adminidcardnumber]']: undefined,
                        ['admin[' + key + '][adminemail]']: undefined
                    });
                } else {
                    this.props.form.setFieldsValue({
                        ['staff[' + key + '][cardnumber]']: undefined,
                        ['staff[' + key + '][name]']: undefined,
                        ['staff[' + key + '][birthdate]']: undefined,
                        ['staff[' + key + '][cardnumber]']: undefined,
                        ['staff[' + key + '][email]']: undefined
                    });
                }
                warning({
                    title: 'Card Number (' + cardnumber + ') not found.',
                    content: 'Please input correct card number.',
                });
            }
            //call loader
            this.setState({ isLoading: false });
        });
    }

    helperAdminDisabled = (cardnumber, type, key, command) => {
        this.retrieveMember(cardnumber, type, key, command);
    }

    handleAutoFill = (event, type, key) => {
        let cardnumber = event === null ? null : event.target.value;
        if (cardnumber) this.retrieveMember(cardnumber, type, key);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { formrender, unlimited, fielddisabled, staffidcardnumberundisabled, admincardnumberundisabled } = this.state;
        const { travelcordinator } = this.state;
        const { generalfielddisabled, statecodefielddisabled, citycodefielddisabled, maxmemberfielddisabled } = this.state.fielddisabled;

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        if (formrender) {
            return (
                <Spin spinning={this.state.isLoading}>
                    <Col xs={24} xl={22}>
                        <Title level={3}> Enrollment Corporate </Title>
                    </Col>
                    <Divider />
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            {/* Corporate Information */}
                            <Divider>Corporate Information</Divider>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <InputText form={this.props.form} labeltext="Corporate Code" datafield="corporatecode" validationrules={['required', 'min.3', 'pattern.alphanumeric']} maxLength={10} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Corporate Name" datafield="corporatename" validationrules={['required']} maxLength={200} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext="Corporate Type" datafield="corporatetype" options={CorporateType} validationrules={['required']} disabled={generalfielddisabled} />
                                <TextArea form={this.props.form} labeltext="Address" datafield="address" validationrules={['required']} maxLength={200} disabled={generalfielddisabled} />
                                <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="countrycode" defaultValue={this.state.defaultCountry} form={this.props.form} validationrules={['required']} onChange={this.onChangeCountry} disabled={generalfielddisabled} />
                                <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="statecode" form={this.props.form} validationrules={['required']} onChange={this.onChangeState} disabled={statecodefielddisabled} />
                                <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="citycode" form={this.props.form} validationrules={['required']} disabled={citycodefielddisabled} />
                                <InputText form={this.props.form} labeltext="Email" datafield="corporateemail" validationrules={['pattern.email']} maxLength={255} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Phone" datafield="phonenum" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} form={this.props.form} labeltext="Language" datafield="langcode" validationrules={['required']} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Trade Business License" datafield="tradebusinesslicense" maxLength={45} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Tax Number" datafield="taxnumber" validationrules={['pattern.numberdotdash']} maxLength={45} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext="Business Field" datafield="businessfield" options={BussinessField} validationrules={['required']} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Agreement Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} disabled={generalfielddisabled} />
                            </Col>

                            {/* Contact Info */}
                            <Divider style={{ paddingTop: 15 }}>Contact Info</Divider>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <InputText form={this.props.form} labeltext="Name" datafield="contactname" validationrules={['required', 'pattern.alphanumericspace']} maxLength={45} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext="ID Type" datafield="contactidtype" options={IdType} validationrules={['required']} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="ID Number" datafield="contactidnum" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Email" datafield="contactemail" validationrules={['required', 'pattern.email']} maxLength={255} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Phone" datafield="contactphonenum" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                            </Col>

                            {/* Travel Coordinator */}
                            <Divider style={{ paddingTop: 15 }}>Travel Coordinator</Divider>
                            <Col xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                <Divider orientation="left" style={{ marginTop: 0 }}><Text strong>Admin</Text></Divider>
                            </Col>
                            <Admin {...this.props} handleRemoveStaff={this.handleRemoveStaff} handleAutoFill={this.handleAutoFill} fielddisabled={fielddisabled} admincardnumberundisabled={admincardnumberundisabled} />

                            <Col xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                <Divider orientation="left"><Text strong>Staff</Text></Divider>
                            </Col>
                            {/* {staffFields} */}
                            {
                                travelcordinator.map((val, i) => {
                                    return (<StaffForm {...this.props} number={val} handleFieldChange={this.handleFieldChange} handleRemoveStaff={() => this.handleRemoveStaff(val)} handleAutoFill={(e) => this.handleAutoFill(e, 'staff', val)} fielddisabled={fielddisabled} staffidcardnumberundisabled={staffidcardnumberundisabled} />)
                                })
                            }
                            <Col className="gutter-row" align="center" xs={24} sm={24} md={24} style={{ marginBottom: 15 }}>
                                {
                                    (travelcordinator.length > 0) ? <Button htmlType="button" type="dashed" shape="circle" icon="plus" onClick={this.handleAddStaff} /> :
                                        <Button htmlType="button" type="dashed" label="Add Staff" onClick={this.handleAddStaff} style={{ width: '68%' }} />
                                }
                            </Col>

                            {/* Tour Code & Configuration */}
                            <Divider style={{ paddingTop: 15 }}>Tour Code & Configuration</Divider>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <Divider orientation="left" style={{ marginTop: 0 }}><Text strong>Tour Code</Text></Divider>
                                <InputText form={this.props.form} labeltext="Tour Code" datafield="tourcode" validationrules={['required', 'pattern.alphanumeric']} maxLength={45} disabled={generalfielddisabled} />
                                <TextArea form={this.props.form} labeltext="Description" datafield="description" validationrules={['required']} maxLength={255} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Tour Code Validity" datafield="tourdate" placeholder={['Start Date', 'End Date']} validationrules={['required']} disabled={generalfielddisabled} />

                                <Divider orientation="left"><Text strong>Configuration</Text></Divider>
                                <Row gutter={24}>
                                    <Col xs={14} sm={14} md={14}>
                                        <InputNumber labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} form={this.props.form} labeltext="Max Member" datafield="maxmember" validationrules={['required']} min={0} maxLength={10} disabled={maxmemberfielddisabled} />
                                    </Col>
                                    <Col xs={10} sm={10} md={10}>
                                        <CheckboxBase wrapperCol={{ span: 24 }} form={this.props.form} datafield="unlimited" children="Unlimited" onChange={this.handleUnlimitedChannel} checked={unlimited} style={{ marginTop: 8 }}></CheckboxBase>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname}></Button>
                        </Row>
                    </Form>
                </Spin>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

class StaffForm extends Component {
    componentDidMount() { }

    render() {
        let key = this.props.number,
            disabled = true;

        const { form, handleRemoveStaff, handleAutoFill, staffidcardnumberundisabled } = this.props;
        const idx = staffidcardnumberundisabled.findIndex(x => x === key);
        if (idx !== -1) disabled = false;

        return (
            <div key={key}>
                <Col className="searching-form" xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                    <Col xs={24} sm={24} md={22} lg={{ span: 12 }} xl={{ span: 12 }}>
                        <InputText form={form} labeltext="Card Number" datafield={`staff[${key}][cardnumber]`} validationrules={['required', 'pattern.number']} onBlur={handleAutoFill} maxLength={45} />
                        <InputText form={form} labeltext="Name" datafield={`staff[${key}][name]`} validationrules={['required']} maxLength={45} disabled />
                        <DatePickerBase form={form} labeltext="Birth Date" datafield={`staff[${key}][birthdate]`} maxDate={moment()} validationrules={['required']} disabled />
                        <InputText form={form} labeltext="ID Number" datafield={`staff[${key}][idcardnumber]`} validationrules={['required', 'pattern.number']} maxLength={45} disabled={disabled} />
                    </Col>
                    <Col xs={24} sm={24} md={22} lg={{ span: 12 }} xl={{ span: 12 }}>
                        <InputText form={form} labeltext="Email" datafield={`staff[${key}][email]`} validationrules={['required', 'pattern.email']} maxLength={255} disabled />
                        <InputText form={form} labeltext="Phone Number" datafield={`staff[${key}][phonenumber]`} validationrules={['required', 'pattern.number']} maxLength={45} />
                        <InputText form={form} labeltext="Username" datafield={`staff[${key}][username]`} validationrules={['required']} maxLength={45} disabled />
                        <SelectBase form={form} labeltext="Corporate Role" datafield={`staff[${key}][rolecode]`} options={CorporateRole} validationrules={['required']} disabled={true} defaultValue={'STAFF'} />
                    </Col>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={2} lg={4} xl={4}>
                    <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={handleRemoveStaff} />
                </Col>
            </div>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
