import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, SelectBase, TextArea, InputText, CountrySelect, StateSelect, CitySelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { getGeneralConfig } from '../../../utilities/Helpers';
import { general_config } from '../../../utilities/Constant';

const optionsAddressType = [
    { value: 'BUSINESS', label: 'BUSINESS' },
    { value: 'PRIVATE', label: 'PRIVATE' }
];

const prefixmenuname = 'MMBRADRS';
const menucode = 'MMBRADRS';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            validationrulesvalue: [],
            maxlengthvalue: null,
            fieldvalue: {
                prefferedaddress: null,
                businessaddressid: null,
                privateaddressid: null,
                memberid: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statecodefielddisabled: true,
                citycodefielddisabled: true,
                statecodebusinessfielddisabled: true,
                citycodebusinessfielddisabled: true
            },
        }
    }

    checkPermission() {
        let id = this.props.memberaddressid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id, actionspage);
        } else {
            this.componentCountrySelect.retrieveData();
            this.componentBusinessCountrySelect.retrieveData();
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (memberaddressid, actionspage) => {
        let url = api.url.memberaddress.list;
        let criteria = { memberaddressid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let addresstype = (result[0].addresstype) ? result[0].addresstype : undefined;

                    /* BUSINESS ADDRESS */
                    let companyname = (result[0].companyname) ? result[0].companyname : undefined;
                    let department = (result[0].department) ? result[0].department : undefined;
                    let position = (result[0].position) ? result[0].position : undefined;
                    let businessaddress = (result[0].address) ? result[0].address : undefined;
                    let businesscountry = (result[0].countrycode) ? result[0].countrycode : undefined;
                    let businesscountryname = (result[0].countryname) ? result[0].countryname : undefined;
                    let businessstate = (result[0].statecode) ? result[0].statecode : undefined;
                    let businessstatename = (result[0].statename) ? result[0].statename : undefined;
                    let businesscity = (result[0].citycode) ? result[0].citycode : undefined;
                    let businesscityname = (result[0].cityname) ? result[0].cityname : undefined;
                    let businesspostal = (result[0].postalcode) ? result[0].postalcode : undefined;

                    /* PRIVATE ADDRESS */
                    let privateaddress = (result[0].address) ? result[0].address : undefined;
                    let privatecountry = (result[0].countrycode) ? result[0].countrycode : undefined;
                    let privatecountryname = (result[0].countryname) ? result[0].countryname : undefined;
                    let privatestate = (result[0].statecode) ? result[0].statecode : undefined;
                    let privatestatename = (result[0].statename) ? result[0].statename : undefined;
                    let privatecity = (result[0].citycode) ? result[0].citycode : undefined;
                    let privatecityname = (result[0].cityname) ? result[0].cityname : undefined;
                    let privatepostal = (result[0].postalcode) ? result[0].postalcode : undefined;


                    let setValue = {
                        addresstype,
                        companyname, department, position, businessaddress, businesscountry, businessstate, businesscity, businesspostal,
                        privateaddress, privatecountry, privatestate, privatecity, privatepostal
                    };
                    this.props.form.setFieldsValue(setValue);

                    if (addresstype === 'BUSINESS') {
                        this.componentBusinessCountrySelect.retrieveData({}, { countrycode: businesscountry, countryname: businesscountryname }, actionspage);
                        this.componentBusinessStateSelect.retrieveData({ countrycode: businesscountry }, { statecode: businessstate, statename: businessstatename }, actionspage);
                        this.componentBusinessCitySelect.retrieveData({ countrycode: businesscountry, statecode: businessstate }, { citycode: businesscity, cityname: businesscityname }, actionspage);
                    }

                    if (addresstype === 'PRIVATE') {
                        this.componentCountrySelect.retrieveData({}, { countrycode: privatecountry, countryname: privatecountryname }, actionspage);
                        this.componentStateSelect.retrieveData({ countrycode: privatecountry }, { statecode: privatestate, statename: privatestatename }, actionspage);
                        this.componentCitySelect.retrieveData({ countrycode: privatecountry, statecode: privatestate }, { citycode: privatecity, cityname: privatecityname }, actionspage);
                    }
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
                let memberid = this.props.memberid;
                let addresstype = input.addresstype;

                let data = [];
                let message = 'New data has been created';
                let url = '';

                if (actionspage === 'create') {
                    url = api.url.memberaddress.create;

                    if (addresstype === 'PRIVATE') {
                        let privatedata = {
                            memberaddressid: null,
                            memberid: memberid,
                            addresstype: 'PRIVATE',
                            companyname: null,
                            department: null,
                            position: null,
                            // countrycode: input.privatecountry,
                            // statecode: input.privatestate,
                            citycode: input.privatecity,
                            address: (input.privateaddress) ? input.privateaddress : null,
                            postalcode: (input.privatepostal) ? input.privatepostal : null,
                            ispreffered: false
                        };
                        data.push(privatedata);
                    } else if (addresstype === 'BUSINESS') {
                        let business = {
                            memberid: memberid,
                            addresstype: 'BUSINESS',
                            companyname: (input.companyname) ? input.companyname : null,
                            department: (input.department) ? input.department : null,
                            position: (input.position) ? input.position : null,
                            // countrycode: (input.businesscountry) ? input.businesscountry : null,
                            // statecode: (input.businessstate) ? input.businessstate : null,
                            citycode: (input.businesscity) ? input.businesscity : null,
                            address: (input.businessaddress) ? input.businessaddress : null,
                            postalcode: (input.businesspostal) ? input.businesspostal : null,
                            ispreffered: false
                        }
                        data.push(business);
                    }
                } else {
                    url = api.url.memberaddress.update;

                    let memberaddressid = this.props.memberaddressid;
                    let companyname = null;
                    let department = null;
                    let position = null;
                    let address = null;
                    let citycode = null;
                    let postalcode = null;

                    if (addresstype === 'PRIVATE') {
                        address = (input.privateaddress) ? input.privateaddress : null;
                        citycode = (input.privatecity) ? input.privatecity : null;
                        postalcode = (input.privatepostal) ? input.privatepostal : null;
                    } else if (addresstype === 'BUSINESS') {
                        address = (input.businessaddress) ? input.businessaddress : null;
                        companyname = (input.companyname) ? input.companyname : null;
                        department = (input.department) ? input.department : null;
                        position = (input.position) ? input.position : null;
                        citycode = (input.businesscity) ? input.businesscity : null;
                        postalcode = (input.businesspostal) ? input.businesspostal : null;
                    }

                    data = {
                        memberaddressid, memberid, addresstype,
                        companyname, department, position, citycode, address, postalcode
                    }
                }
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.refreshHeader();
                        this.props.onClose();
                        this.props.refreshList();
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
        this.props.form.setFieldsValue({ privatecountry: countrycode, privatestate: undefined, privatecity: undefined });
        let statecodefielddisabled = (countrycode) ? false : true;
        let citycodefielddisabled = true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled, citycodefielddisabled } });
    }

    onChangeState = (statecode) => {
        let criteria = { statecode };
        this.componentCitySelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ privatecity: undefined });
        let citycodefielddisabled = (statecode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, citycodefielddisabled } });
    }

    onChangeBusinessCountry = (countrycode) => {
        let criteria = { countrycode };
        this.componentBusinessStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ businesscountry: countrycode, businessstate: undefined, businesscity: undefined });
        let statecodebusinessfielddisabled = (countrycode) ? false : true;
        let citycodebusinessfielddisabled = true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodebusinessfielddisabled, citycodebusinessfielddisabled } });
    }

    onChangeBusinessState = (statecode) => {
        let criteria = { statecode };
        this.componentBusinessCitySelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ businesscity: undefined });
        let citycodebusinessfielddisabled = (statecode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, citycodebusinessfielddisabled } });
    }

    handleChangeType = (addresstype) => {
        const callback = (countrycode) => {
            if (countrycode) {
                let criteria = { countrycode };
                if (addresstype === 'BUSINESS') {
                    this.componentBusinessStateSelect.retrieveData(criteria);
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodebusinessfielddisabled: false } });
                    this.props.form.setFieldsValue({ businesscountry: countrycode });
                } else if (addresstype === 'PRIVATE') {
                    this.componentStateSelect.retrieveData(criteria);
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled: false } });
                    this.props.form.setFieldsValue({ privatecountry: countrycode });
                }
            }
            this.props.form.setFieldsValue({ countrycode });
        }
        /* get default country abse general configuration */
        getGeneralConfig(general_config.default_country, callback);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { specialfielddisabled, generalfielddisabled, statecodefielddisabled, citycodefielddisabled, statecodebusinessfielddisabled, citycodebusinessfielddisabled } = this.state.fielddisabled;
        const { actionspage } = this.state;
        let addresstype = this.props.form.getFieldValue('addresstype');

        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext="Type" datafield="addresstype" validationrules={['required']} options={optionsAddressType} onChange={this.handleChangeType} disabled={specialfielddisabled} />

                                <TextArea form={this.props.form} labeltext="Home Address" datafield="privateaddress" disabled={generalfielddisabled} className={(addresstype === 'PRIVATE') ? '' : 'hidden'} />
                                <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="privatecountry" form={this.props.form} validationrules={(addresstype === 'PRIVATE') ? ['required'] : []} onChange={this.onChangeCountry} disabled={generalfielddisabled} className={(addresstype === 'PRIVATE') ? '' : 'hidden'} />
                                <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="privatestate" form={this.props.form} validationrules={(addresstype === 'PRIVATE') ? ['required'] : []} onChange={this.onChangeState} disabled={statecodefielddisabled} className={(addresstype === 'PRIVATE') ? '' : 'hidden'} />
                                <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="privatecity" form={this.props.form} validationrules={(addresstype === 'PRIVATE') ? ['required'] : []} disabled={citycodefielddisabled} className={(addresstype === 'PRIVATE') ? '' : 'hidden'} />
                                <InputText form={this.props.form} labeltext="Postal Code" datafield="privatepostal" validationrules={['pattern.number']} maxLength={5} disabled={generalfielddisabled} className={(addresstype === 'PRIVATE') ? '' : 'hidden'} />

                                <InputText form={this.props.form} labeltext="Company Name" datafield="companyname" validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} disabled={generalfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                                <InputText form={this.props.form} labeltext="Department" datafield="department" validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} disabled={generalfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                                <InputText form={this.props.form} labeltext="Position" datafield="position" validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} disabled={generalfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                                <TextArea form={this.props.form} labeltext="Business Address" datafield="businessaddress" disabled={generalfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                                <CountrySelect ref={(e) => { this.componentBusinessCountrySelect = e }} labeltext="Country" datafield="businesscountry" form={this.props.form} validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} onChange={this.onChangeBusinessCountry} disabled={generalfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                                <StateSelect ref={(e) => { this.componentBusinessStateSelect = e }} labeltext="State" datafield="businessstate" form={this.props.form} validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} onChange={this.onChangeBusinessState} disabled={statecodebusinessfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                                <CitySelect ref={(e) => { this.componentBusinessCitySelect = e }} labeltext="City" datafield="businesscity" form={this.props.form} validationrules={(addresstype === 'BUSINESS') ? ['required'] : []} disabled={citycodebusinessfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />
                                <InputText form={this.props.form} labeltext="Postal Code" datafield="businesspostal" validationrules={['pattern.number']} maxLength={5} disabled={generalfielddisabled} className={(addresstype === 'BUSINESS') ? '' : 'hidden'} />


                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage !== 'view') ? <Button htmlType="submit" type="default" label="Save" /> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));