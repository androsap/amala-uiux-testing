import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { LanguageSelect, InputText, Button, Alert, SelectBase, TextArea, CountrySelect, StateSelect, CitySelect, InputNumber, CheckboxBase, DateRangeBase, BranchSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { CorporateType, BussinessField, IdType } from '../../../data';
import ErrorGeneral from '../../error/ErrorGeneral';
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
                unlimited: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statecodefielddisabled: true,
                citycodefielddisabled: true,
                maxmemberfielddisabled: false
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
            let statecodefielddisabled = false;
            let citycodefielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                statecodefielddisabled = true;
                citycodefielddisabled = true;
            }
            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled, statecodefielddisabled, citycodefielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (memberid, actionspage) => {
        let url = api.url.member.profile;
        let data = { memberid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode === '0000') {
                const { branchcodeaddress, branchcodeaddressname, branchcodeenroll, branchcodeenrollname } = result || {};
                const corporatedetailinfo = result.corporatedetailinfo.length ? result.corporatedetailinfo[0] : {};
                const { corporatename, address, corporateemail, phonenum, tradebusinesslicense, taxnumber, contactname, contactidnum, contactemail, contactphonenum, contactidtype,
                    maxmember, corporatecode, corporatetype, countrycode, countryname, statecode, statename, citycode, cityname, businessfield, langcode, langname } = corporatedetailinfo || {}

                let unlimited = (corporatedetailinfo) ? corporatedetailinfo.unlimited : false;
                let startdate = (corporatedetailinfo.startdate) ? moment(corporatedetailinfo.startdate) : null;
                let enddate = (corporatedetailinfo.enddate) ? moment(corporatedetailinfo.enddate) : null;
                let date = [startdate, enddate];
                let maxmemberfielddisabled = (actionspage !== 'view') ? (maxmember) ? false : true : true

                let setValue = {
                    corporatecode, corporatename, address, corporateemail, phonenum, tradebusinesslicense, taxnumber, contactname, contactidnum, contactemail, date, branchcodeaddress,
                    contactphonenum, maxmember, corporatetype, countrycode, statecode, citycode, businessfield, langcode, contactidtype, unlimited, branchcodeenroll
                };
                console.log(setValue)
                this.props.form.setFieldsValue(setValue);

                this.setState({
                    fieldvalue: { ...this.state.fieldvalue, corporatecode },
                    fielddisabled: { ...this.state.fielddisabled, maxmemberfielddisabled }
                });

                this.componentBranchEnrollSelect.retrieveData({}, { branchcode: branchcodeenroll, branchname: branchcodeenrollname }, actionspage);
                this.componentBranchAddressSelect.retrieveData({}, { branchcode: branchcodeaddress, branchname: branchcodeaddressname }, actionspage);
                this.componentCountrySelect.retrieveData({}, { countrycode, countryname }, actionspage);
                this.componentStateSelect.retrieveData({ countrycode }, { statecode, statename }, actionspage);
                this.componentCitySelect.retrieveData({ statecode }, { citycode, cityname }, actionspage);
                this.componentLanguageSelect.retrieveData({}, { langcode, langname }, actionspage);
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                const { corporatename, corporatetype, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, branchcodeaddress,
                    taxnumber, businessfield, contactname, contactidnum, contactidtype, contactemail, contactphonenum, maxmember, branchcodeenroll } = input || {};

                let memberid = this.props.match.params.ID;
                let corporatecode = this.state.fieldvalue.corporatecode;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let unlimited = (input.unlimited) ? true : false;
                let actioncount = 0;

                let data = {
                    memberid, corporatecode, corporatename, corporatetype, address, countrycode, statecode, citycode, corporateemail,
                    langcode, tradebusinesslicense, taxnumber, businessfield, contactname, contactidtype, contactemail, branchcodeenroll,
                    contactphonenum, contactidnum, maxmember, startdate, enddate, unlimited, actioncount, branchcodeaddress, phonenum,
                };

                var message = 'Data has been updated';
                let url = api.url.membercorporate.update;
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                    } else Alert.error(responsemessage);
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

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

    handleUnlimitedChange = (event) => {
        let unlimited = event === null ? null : event.target.checked;
        let maxmemberfielddisabled = unlimited;

        this.setState({ fielddisabled: { ...this.state.fielddisabled, maxmemberfielddisabled } });
        this.props.form.setFieldsValue({ maxmember: 0 });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const colStyle = {
            style: { paddingLeft: 0, paddingRight: 0 }
        };
        const { formrender } = this.state;
        const { generalfielddisabled, specialfielddisabled, statecodefielddisabled, citycodefielddisabled, maxmemberfielddisabled } = this.state.fielddisabled;
        const { unlimited } = this.state.fieldvalue;
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;

        // let firstname = this.props.form.getFieldValue('firstname');
        // let lastname = this.props.form.getFieldValue('lastname');

        if (formrender) {
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>Edit Member Corporate</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" >
                                    <Divider>Corporate Info</Divider>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 2 }} xl={{ span: 14, offset: 2 }}>
                                    <InputText form={this.props.form} labeltext="Corporate Code" datafield="corporatecode" disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Corporate Name" datafield="corporatename" validationrules={['required']} maxLength={45} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Corporate Type" datafield="corporatetype" options={CorporateType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <BranchSelect ref={(e) => { this.componentBranchEnrollSelect = e }} labeltext="Branch Enrollment" datafield="branchcodeenroll" form={this.props.form} disabled={generalfielddisabled} />
                                    <BranchSelect ref={(e) => { this.componentBranchAddressSelect = e }} labeltext="Branch Address" datafield="branchcodeaddress" form={this.props.form} disabled={generalfielddisabled} />
                                    <TextArea form={this.props.form} labeltext="Address" datafield="address" validationrules={['required']} maxLength={255} disabled={generalfielddisabled} />
                                    <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="countrycode" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeCountry} disabled={generalfielddisabled} />
                                    <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="statecode" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeState} disabled={statecodefielddisabled} />
                                    <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="citycode" form={this.props.form} validationrules={[`required`]} disabled={citycodefielddisabled} />
                                    <InputText form={this.props.form} labeltext="Corporate Email" datafield="corporateemail" validationrules={['required', 'pattern.email']} maxLength={255} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Phone Number" datafield="phonenum" validationrules={['required', 'pattern.phonenumber']} maxLength={20} disabled={generalfielddisabled} />
                                    <LanguageSelect form={this.props.form} ref={(e) => { this.componentLanguageSelect = e }} labeltext="Language" datafield="langcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Trade Business License (SIUP)" datafield="tradebusinesslicense" maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Tax Number (NPWP)" datafield="taxnumber" maxLength={45} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Business Field" datafield="businessfield" options={BussinessField} validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Agreement Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" >
                                    <Divider>Contact Info</Divider>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 2 }} xl={{ span: 14, offset: 2 }}>
                                    <InputText form={this.props.form} labeltext="Name" datafield="contactname" validationrules={['required']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="ID Number" datafield="contactidnum" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="ID Type" datafield="contactidtype" options={IdType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Contact Email" datafield="contactemail" validationrules={['required', 'pattern.email']} maxLength={255} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Contact Phone Number" datafield="contactphonenum" validationrules={['required', 'pattern.phonenumber']} maxLength={20} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" >
                                    <Divider>Member Configuration</Divider>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 2 }} xl={{ span: 14, offset: 2 }}>
                                    <Row gutter={24}>
                                        <Col {...colStyle} xs={10} sm={10} md={16}>
                                            <InputNumber labelCol={{ span: 15 }} wrapperCol={{ span: 8 }} form={this.props.form} labeltext="Maximum Registered Member" datafield="maxmember" validationrules={['required']} min={0} maxLength={10} disabled={maxmemberfielddisabled} />
                                        </Col>
                                        <Col {...colStyle} xs={8} sm={8} md={8}>
                                            <CheckboxBase wrapperCol={{ span: 24 }} form={this.props.form} datafield="unlimited" children="Unlimited" onChange={this.handleUnlimitedChange} checked={unlimited} style={{ marginTop: 8 }} disabled={generalfielddisabled}></CheckboxBase>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (usermenu[menucode][prefixmenuname + "_UPDATE"]) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                        : null
                                }
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