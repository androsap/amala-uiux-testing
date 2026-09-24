import React, { Component } from 'react';
import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { Alert, InputText, TextArea, CountrySelect, StateSelect, CitySelect, LanguageSelect, RoleSelect, DatePickerBase, DateRangeBase, SelectBase, CheckboxBase, InputNumber, Button } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Icon } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;
const optionsCorporateType = [
    { label: 'Perseorangan', value: 'Perseorangan' },
    { label: 'PT', value: 'PT' },
    { label: 'CV', value: 'CV' },
    { label: 'Firma', value: 'Firma' },
    { label: 'Perum', value: 'Perum' },
    { label: 'Koperasi', value: 'Koperasi' },
    { label: 'Yayasan', value: 'Yayasan' },
    { label: 'Other', value: 'Other' }
];
const optionBussinessField = [
    { label: 'Manufacture', value: 'Manufacture' },
    { label: 'Retail and Distributor', value: 'Retail and Distributor' },
    { label: 'Agricultural and Mining', value: 'Agricultural and Mining' },
    { label: 'Financial Business', value: 'Financial Business' },
    { label: 'Business Information', value: 'Business Information' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Real Estate', value: 'Real Estate' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Other', value: 'Other' }
];
const optionsIdType = [
    { label: 'KTP', value: 'KTP' },
    { label: 'SIM', value: 'SIM' },
    { label: 'Passport', value: 'Passport' },
    { label: 'Other', value: 'Other' }
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
            travelcordinator: [],
            travelmember: [],
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statecodefielddisabled: true,
                citycodefielddisabled: true,
                maxmemberfielddisabled: false
            }
        }
    }

    componentDidMount() {
        document.title = " Enrollment Corporate | Loyalty Management System ";
        let { travelcordinator } = this.state;

        if (travelcordinator.length < 1) {
            // let staffFields = { name: null, username: null, travelcordinatortype: "ADMIN", rolecode: null, idcardnumber: null, cardnumber: null, phonenumber: null, email: null, birthdate: null };
            // travelcordinator.push(staffFields);
        } else {
            this.componentStaffRoleSelect.retrieveData();
        }

        this.componentCountrySelect.retrieveData();
        this.componentLanguageSelect.retrieveData();
        // this.componentRoleSelect.retrieveData();

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
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            // if (!err) {
            // this.setState({ isLoading: true });
            //member
            let username = input.corporateemail;
            let enrollchannel = 'CORPORATE';
            let enrollmentdate = moment(new Date()).format("YYYY-MM-DD");
            let member = { username, enrollchannel, enrollmentdate };
            //membercorporatedetail
            const { corporatename, address, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, corporatetype, businessfield, contactname, contactidnum, contactidtype, contactemail, contactphonenum, maxmember, unlimited } = input;
            let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
            let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
            let actioncount = 0;
            let countrycode = ""; //dipertanyakan
            let statecode = ""; //dipertanyakan
            let membercorporatedetail = { corporatename, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, corporatetype, businessfield, contactname, contactidnum, contactidtype, contactemail, contactphonenum, startdate, enddate, maxmember, unlimited, actioncount };
            //corporatetourcode
            const { travelcordinator, travelmember } = this.state;
            const { tourcode } = input;
            startdate = (input.tourdate && input.tourdate[0]) ? moment(input.tourdate[0]).format("YYYY-MM-DD") : null;
            enddate = (input.tourdate && input.tourdate[1]) ? moment(input.tourdate[1]).format("YYYY-MM-DD") : null;
            let corporatecode = ""; //dipertanyakan
            let corporatetourcode = { tourcode, startdate, enddate, corporatecode };

            // let name = input.name ? input.name : null;
            // let value = input.value ? input.value : null;
            // let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
            // travelcordinator[number][name] = value;
            // this.props.setTravelCordinator(travelcordinator, number);

            console.log('travelcordinator', travelcordinator)
            for (const field in travelcordinator) {
                console.log('field travelcordinator', travelcordinator[field]['name'])
                // if (travelcordinator[field]['travelcordinatortype'] === 'ADMIN') {
                travelcordinator[field]['name'] = input.name;
                travelcordinator[field]['username'] = input.username;
                travelcordinator[field]['travelcordinatortype'] = 'ADMIN';
                travelcordinator[field]['rolecode'] = input.rolecode;
                travelcordinator[field]['idcardnumber'] = input.idcardnumber;
                travelcordinator[field]['cardnumber'] = input.cardnumber;
                travelcordinator[field]['phonenumber'] = input.phonenumber;
                travelcordinator[field]['email'] = input.email;
                travelcordinator[field]['birthdate'] = moment(input.birthdate).format("YYYY-MM-DD");
                // }
            }
            // handleFieldChange = (event, number) => {
            //     let name = event.target.name ? event.target.name : null;
            //     let value = event.target.value ? event.target.value : null;
            //     let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
            //     travelcordinator[number][name] = value;
            //     this.props.setTravelCordinator(travelcordinator, number);
            // }
            for (const field in travelmember) {
                console.log('field travelmember', travelmember[field]['name'])
                // if (travelcordinator[field]['travelcordinatortype'] === 'STAFF') {
                travelmember[field]['name'] = input.name_ + field;
                travelmember[field]['username'] = input.username_ + field;
                travelmember[field]['travelcordinatortype'] = 'STAFF';
                travelmember[field]['rolecode'] = input.rolecode_ + field;
                travelmember[field]['idcardnumber'] = input.idcardnumber_ + field;
                travelmember[field]['cardnumber'] = input.cardnumber_ + field;
                travelmember[field]['phonenumber'] = input.phonenumber_ + field;
                travelmember[field]['email'] = input.email_ + field;
                travelmember[field]['birthdate'] = moment(input.birthdate_ + field).format("YYYY-MM-DD");
                // }
            }
            travelcordinator.push(travelmember);

            let message = 'New data has been created';
            let url = api.url.enrollmentcorporate.enroll;
            let data = { member, membercorporatedetail, corporatetourcode, travelcordinator };
            console.log('data', data)

            // SaveRequest(url, data).then((response) => {
            //     const { responsecode, responsemessage } = response.status;
            //     if (responsecode.substring(0, 1) === '0') {
            //         message = (responsemessage) ? responsemessage : message;
            //         Alert.success(message);
            //         this.props.history.push('/enrollment-corporate');
            //     } else {
            //         Alert.error(responsemessage);
            //     }
            //     //hide loader
            //     this.setState({ isLoading: false });
            // })
            // }
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

    //INI ADDSTAFF LAMA
    addStaff() {
        let travelcordinator = { name: null, username: null, travelcordinatortype: "STAFF", rolecode: null, idcardnumber: null, cardnumber: null, phonenumber: null, email: null, birthdate: null };
        this.props.addStaffTravelCordinator(travelcordinator);
    }
    handleAddStaff = () => {
        let staffFields = { staffname: null, staffusername: null, travelcordinatortype: "STAFF", staffrolecode: null, staffidcardnumber: null, staffcardnumber: null, staffphonenumber: null, staffemail: null, staffbirthdate: null };
        // let travelmember = [...this.state.travelmember];
        let { travelmember, travelcordinator } = this.state;
        travelmember.push(staffFields);
        travelcordinator.push(travelmember);
        this.setState({ fielddisabled: { ...this.state.fielddisabled, travelmember, travelcordinator } })
        // if (travelmember.length > 0) this.componentStaffRoleSelect.retrieveData();
    }

    //REMOVE YANG LAMA
    deleteStaff = (event, number) => {
        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;

        let result = [];
        let key = 0;
        for (const field in travelcordinator) {
            if (Number.parseInt(field, 0) !== number || travelcordinator[field]['travelcordinatortype'] === 'ADMIN') {
                result[key] = travelcordinator[field];
                key++;
            }
        }

        this.props.setTravelCordinator(result);
    }
    handleRemoveStaff(i) {
        // var travelmember = [...this.state.travelmember];
        // travelmember.splice(key, 1);let result = [];
        // this.setState({ fieldvalue: { ...this.state, travelmember } });

        var travelmember = this.state.travelmember;
        let result = [];
        let key = 0;
        for (const field in travelmember) {
            if (Number.parseInt(field, 0) !== i) {
                result[key] = travelmember[field];
                key++;
            }
        }
        this.setState({ fieldvalue: { travelmember: result } });
    }

    //INI YANG LAMA YAKKK
    handleChangeField = (event, number) => {
        let name = event.target.name ? event.target.name : null;
        let value = event.target.value ? event.target.value : null;
        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
        travelcordinator[number][name] = value;
        this.props.setTravelCordinator(travelcordinator, number);
    }
    handleFieldChange = (e, key) => {
        console.log('e', e, key)
        console.log('e target datafield', e.target.datafield, key)
        let name = e.target.datafield ? e.target.datafield : null;
        let travelcordinator = [...this.state.travelcordinator];
        travelcordinator[key][name] = this.props.form.getFieldValue(name);
        console.log('e travelcordinator', travelcordinator)
        this.setState({ ...this.state.travelcordinator, travelcordinator })
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { formrender, unlimited } = this.state;
        const { travelmember } = this.state;
        const { generalfielddisabled, statecodefielddisabled, citycodefielddisabled, maxmemberfielddisabled } = this.state.fielddisabled;

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        let staffValidate = travelmember.length > 0;
        let staffFields =
            <div>
                {travelmember.map((val, i) =>
                    <div key={i}>
                        <Col className="searching-form" xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                            <Col span={12}>
                                <InputText form={this.props.form} labeltext="Name" datafield={"name_" + i} validationrules={staffValidate ? ['required'] : []} maxLength={45} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                                <InputText form={this.props.form} labeltext="Username" datafield={"username_" + i} validationrules={staffValidate ? ['required'] : []} maxLength={45} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                                <InputText form={this.props.form} labeltext="ID Numbers" datafield={"idcardnumber_" + i} validationrules={staffValidate ? ['required', 'pattern.number'] : ['required']} maxLength={45} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                                <InputText form={this.props.form} labeltext="Card Number" datafield={"cardnumber_" + i} validationrules={staffValidate ? ['required', 'pattern.number'] : ['required']} maxLength={45} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                            </Col>
                            <Col span={12}>
                                <InputText form={this.props.form} labeltext="Phone Number" datafield={"phonenumber_" + i} validationrules={staffValidate ? ['required', 'pattern.number'] : ['required']} maxLength={45} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                                <InputText form={this.props.form} labeltext="Email" datafield={"email_" + i} validationrules={staffValidate ? ['required', 'pattern.email'] : ['required']} maxLength={45} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                                <DatePickerBase form={this.props.form} labeltext="Birth Date" datafield={"birthdate_" + i} validationrules={staffValidate ? ['required'] : ['required']} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                                <RoleSelect ref={(e) => { this.componentStaffRoleSelect = e }} labeltext="Role" datafield={"rolecode_" + i} form={this.props.form} validationrules={staffValidate ? ['required'] : []} disabled={generalfielddisabled} onChange={(e) => this.handleFieldChange(e, i)} />
                            </Col>
                        </Col>
                        <Col className="gutter-row" xs={24} sm={24} md={2} lg={4} xl={4}>
                            <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.handleRemoveStaff(i)} />
                        </Col>
                    </div>
                )}
            </div>

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
                                <InputText form={this.props.form} labeltext="Corporate Name" datafield="corporatename" validationrules={['required']} maxLength={200} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext="Corporate Type" datafield="corporatetype" options={optionsCorporateType} validationrules={['required']} disabled={generalfielddisabled} />
                                <TextArea form={this.props.form} labeltext="Address" datafield="address" validationrules={['required']} maxLength={200} disabled={generalfielddisabled} />
                                <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="countrycode" defaultValue={this.state.defaultCountry} form={this.props.form} validationrules={['required']} onChange={this.onChangeCountry} disabled={generalfielddisabled} />
                                <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="statecode" form={this.props.form} validationrules={['required']} onChange={this.onChangeState} disabled={statecodefielddisabled} />
                                <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="citycode" form={this.props.form} validationrules={['required']} disabled={citycodefielddisabled} />
                                <InputText form={this.props.form} labeltext="Email" datafield="corporateemail" validationrules={['required', 'pattern.email']} maxLength={45} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Phone" datafield="phonenum" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} form={this.props.form} labeltext="Language" datafield="langcode" validationrules={['required']} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Trade Business License" datafield="tradebusinesslicense" validationrules={['required']} maxLength={45} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Tax Number" datafield="taxnumber" validationrules={['required', 'pattern.numberdotdash']} maxLength={45} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext="Business Field" datafield="businessfield" options={optionBussinessField} validationrules={['required']} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                            </Col>

                            {/* Contact Info */}
                            <Divider style={{ paddingTop: 15 }}>Contact Info</Divider>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <InputText form={this.props.form} labeltext="Name" datafield="contactname" validationrules={['required', 'pattern.alphanumericspace']} maxLength={45} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext="ID Type" datafield="contactidtype" options={optionsIdType} validationrules={['required']} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="ID Number" datafield="contactidnum" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Email" datafield="contactemail" validationrules={['required', 'pattern.email']} maxLength={45} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Phone" datafield="contactphonenum" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                            </Col>

                            {/* Travel Coordinator */}
                            <Divider style={{ paddingTop: 15 }}>Travel Coordinator</Divider>
                            <Col xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                <Divider orientation="left" style={{ marginTop: 0 }}><Text strong>Admin</Text></Divider>
                            </Col>
                            <Col className="searching-form" xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                <Col span={12}>
                                    <InputText form={this.props.form} labeltext="Name" datafield="name" validationrules={['required']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Username" datafield="username" validationrules={['required']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="ID Numbers" datafield="idcardnumber" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                </Col>
                                <Col span={12}>
                                    <InputText form={this.props.form} labeltext="Phone Number" datafield="phonenumber" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Email" datafield="email" validationrules={['required', 'pattern.email']} maxLength={45} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Birth Date" datafield="birthdate" validationrules={['required']} disabled={generalfielddisabled} />
                                    <RoleSelect ref={(e) => { this.componentRoleSelect = e }} labeltext="Role" datafield="rolecode" form={this.props.form} validationrules={['required']} disabled={generalfielddisabled} />
                                </Col>
                            </Col>
                            <Col xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                <Divider orientation="left"><Text strong>Staff</Text></Divider>
                            </Col>
                            {staffFields}
                            <Col className="gutter-row" align="center" xs={24} sm={24} md={24} style={{ marginBottom: 15 }}>
                                {
                                    (travelmember.length > 0) ? <Button htmlType="button" type="dashed" shape="circle" icon="plus" onClick={this.handleAddStaff} /> :
                                        <Button htmlType="button" type="dashed" label="Add Staff" onClick={this.handleAddStaff} style={{ width: '68%' }} />
                                }
                            </Col>

                            {/* Tour Code & Configuration */}
                            <Divider style={{ paddingTop: 15 }}>Tour Code & Configuration</Divider>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                <Divider orientation="left" style={{ marginTop: 0 }}><Text strong>Contact Info</Text></Divider>
                                <InputText form={this.props.form} labeltext="Name" datafield="contactname" validationrules={['required']} maxLength={45} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Tour Code" datafield="tourcode" validationrules={['required', 'pattern.alphanumericspace']} maxLength={45} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="tourdate" placeholder={['Start Date', 'End Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />

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
                            <Button url={'/enrollment-corporate'} type="default" label="Back" />
                        </Row>
                    </Form>
                </Spin>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));