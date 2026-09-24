import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { getGeneralConfig } from '../../../utilities/Helpers';
import { general_config } from '../../../utilities/Constant';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { RadioButton, TextArea, InputText, CountrySelect, StateSelect, CitySelect, Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal, Collapse } from 'antd';
import AddressHistory from './AddressHistory';

const { Title } = Typography;
const { Panel } = Collapse;

const optionsPrefferdAddress = [
    { label: 'Private', value: 'Private' },
    { label: 'Business', value: 'Business' }
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
            visible: false,
            activeKey: []
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
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (memberid, actionspage) => {
        let type = 'ALL';
        let url = api.url.member.profile;
        let data = { memberid, type };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                const { memberaddress } = result;

                /* BUSINESS ADDRESSS */
                let business = memberaddress.filter(obj => obj.addresstype === 'BUSINESS' && obj.active === true);
                var companyname = (business && business[0] && business[0]['companyname']) ? business[0]['companyname'] : undefined;
                // var businessaddressid = (business && business[0] && business[0]['memberaddressid']) ? business[0]['memberaddressid'] : undefined;
                var businessaddress = (business && business[0] && business[0]['address']) ? business[0]['address'] : undefined;
                var businesspostal = (business && business[0] && business[0]['postalcode']) ? business[0]['postalcode'] : undefined;
                var businesscountry = (business && business[0] && business[0]['countrycode']) ? business[0]['countrycode'] : undefined;
                var businesscountryname = (business && business[0] && business[0]['countryname']) ? business[0]['countryname'] : '';
                var businessstate = (business && business[0] && business[0]['statecode']) ? business[0]['statecode'] : undefined;
                var businessstatename = (business && business[0] && business[0]['statename']) ? business[0]['statename'] : '';
                var businesscity = (business && business[0] && business[0]['citycode']) ? business[0]['citycode'] : undefined;
                var businesscityname = (business && business[0] && business[0]['cityname']) ? business[0]['cityname'] : '';
                var department = (business && business[0] && business[0]['department']) ? business[0]['department'] : undefined;
                var position = (business && business[0] && business[0]['position']) ? business[0]['position'] : undefined;
                var prefferedaddress = (business && business[0] && business[0]['ispreffered']) ? 'Business' : 'Private';

                /* PRIVATE ADDRESS */
                let privatemember = memberaddress.filter(obj => obj.addresstype === 'PRIVATE' && obj.active === true);
                var privateaddress = (privatemember && privatemember[0] && privatemember[0]['address']) ? privatemember[0]['address'] : undefined;
                var privatepostal = (privatemember && privatemember[0] && privatemember[0]['postalcode']) ? privatemember[0]['postalcode'] : undefined;
                var privatecountry = (privatemember && privatemember[0] && privatemember[0]['countrycode']) ? privatemember[0]['countrycode'] : undefined;
                var privatecountryname = (privatemember && privatemember[0] && privatemember[0]['countryname']) ? privatemember[0]['countryname'] : '';
                var privatestate = (privatemember && privatemember[0] && privatemember[0]['statecode']) ? privatemember[0]['statecode'] : undefined;
                var privatestatename = (privatemember && privatemember[0] && privatemember[0]['statename']) ? privatemember[0]['statename'] : '';
                var privatecity = (privatemember && privatemember[0] && privatemember[0]['citycode']) ? privatemember[0]['citycode'] : undefined;
                var privatecityname = (privatemember && privatemember[0] && privatemember[0]['cityname']) ? privatemember[0]['cityname'] : '';

                let memberid = result.memberid ? result.memberid : null;

                let setValue = {
                    prefferedaddress,
                    companyname, businessaddress, businesspostal, businesscountry, businessstate, businesscity, department, position,
                    privateaddress, privatepostal, privatecountry, privatestate, privatecity
                };
                this.props.form.setFieldsValue(setValue);

                let statecodebusinessfielddisabled = (actionspage !== 'view') ? false : true;
                let citycodebusinessfielddisabled = (actionspage !== 'view' && businessstate) ? false : true;
                let statecodefielddisabled = (actionspage !== 'view') ? false : true;
                let citycodefielddisabled = (actionspage !== 'view' && privatestate) ? false : true;

                this.setState({
                    fielddisabled: {
                        ...this.state.fielddisabled,
                        statecodebusinessfielddisabled, citycodebusinessfielddisabled,
                        statecodefielddisabled, citycodefielddisabled
                    },
                    fieldvalue: {
                        prefferedaddress,
                        memberid
                    },
                    activeKey: (prefferedaddress === 'Business') ? ['2'] : ['1']
                });

                this.componentBusinessCountrySelect.retrieveData({}, { countrycode: businesscountry, countryname: businesscountryname }, actionspage);
                this.componentBusinessStateSelect.retrieveData({ countrycode: businesscountry }, { statecode: businessstate, statename: businessstatename }, actionspage);
                this.componentBusinessCitySelect.retrieveData({ citycode: businessstate }, { citycode: businesscity, cityname: businesscityname }, actionspage);

                this.componentCountrySelect.retrieveData({}, { countrycode: privatecountry, countryname: privatecountryname }, actionspage);
                this.componentStateSelect.retrieveData({ countrycode: privatecountry }, { statecode: privatestate, statename: privatestatename }, actionspage);
                this.componentCitySelect.retrieveData({ citycode: privatestate }, { citycode: privatecity, cityname: privatecityname }, actionspage);

                /* SET DEFAULT FIELD BUSINESS COUNTRY */
                if (businesscountry === undefined) {
                    const callback = (businesscountry) => {
                        this.props.form.setFieldsValue({ businesscountry });
                        this.componentBusinessStateSelect.retrieveData({ countrycode: businesscountry }, { statecode: businessstate, statename: businessstatename }, actionspage);
                    }
                    getGeneralConfig(general_config.default_country, callback);
                }

                /* SET DEFAULT FIELD PRIVATE COUNTRY */
                if (privatecountry === undefined) {
                    const callback = (privatecountry) => {
                        this.props.form.setFieldsValue({ privatecountry });
                        this.componentStateSelect.retrieveData({ countrycode: privatecountry }, { statecode: privatestate, statename: privatestatename }, actionspage);
                    }
                    getGeneralConfig(general_config.default_country, callback);
                }
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
                const { businessaddressid, privateaddressid } = this.state.fieldvalue;

                let prefferedaddress = input.prefferedaddress;
                let memberid = this.props.match.params.ID;

                /* ADDRESS PRIVATE */
                let privateaddress = (input.privateaddress) ? input.privateaddress : null;
                let privatepostal = (input.privatepostal) ? input.privatepostal : null;
                let privatecountry = input.privatecountry;
                let privatestate = input.privatestate;
                let privatecity = input.privatecity;

                let data = [
                    {
                        memberaddressid: privateaddressid,
                        memberid: memberid,
                        addresstype: 'PRIVATE',
                        companyname: null,
                        department: null,
                        position: null,
                        countrycode: privatecountry,
                        statecode: privatestate,
                        citycode: privatecity,
                        address: privateaddress,
                        postalcode: privatepostal,
                        status: 'ACTIVE',
                        ispreffered: (prefferedaddress === 'Private') ? 1 : 0
                    }
                ];

                /* ADDRESS BUSINESS */
                let companyname = (input.companyname) ? input.companyname : null;
                let department = (input.department) ? input.department : null;
                let position = (input.position) ? input.position : null;
                let businessaddress = (input.businessaddress) ? input.businessaddress : null;
                let businesspostal = (input.businesspostal) ? input.businesspostal : null;
                let businesscountry = (input.businesscountry) ? input.businesscountry : null;
                let businessstate = (input.businessstate) ? input.businessstate : null;
                let businesscity = (input.businesscity) ? input.businesscity : null;

                let business = {
                    memberaddressid: businessaddressid,
                    memberid: memberid,
                    addresstype: 'BUSINESS',
                    companyname: companyname,
                    department: department,
                    position: position,
                    countrycode: businesscountry,
                    statecode: businessstate,
                    citycode: businesscity,
                    address: businessaddress,
                    postalcode: businesspostal,
                    status: 'ACTIVE',
                    ispreffered: (prefferedaddress === 'Business') ? 1 : 0
                }

                if (companyname || department || position || businessaddress || businesspostal || businesscountry || businessstate || businesscity) {
                    data.push(business);
                }

                var message = 'Data has been updated';
                var url = api.url.memberaddress.update;
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangePrefferedAddress = (event) => {
        let prefferedaddress = event ? event.target.value : null;
        let key = ['2'];
        if (prefferedaddress === 'Private') { key = ['1'] }
        this.setState({ fieldvalue: { ...this.state.fieldvalue, prefferedaddress }, activeKey: key });
    }

    onChangeCountry = (countrycode) => {
        let criteria = { countrycode };
        this.componentStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ privatestate: undefined, privatecity: undefined });
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
        this.props.form.setFieldsValue({ businessstate: undefined, businesscity: undefined });
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

    handleOpenModal = (memberid) => {
        this.setState({ visible: true, fieldvalue: { ...this.state.fieldvalue, memberid } });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    onClickCollapse = (key) => {
        this.setState({ activeKey: key });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender } = this.state;
        const { generalfielddisabled, statecodefielddisabled, citycodefielddisabled, statecodebusinessfielddisabled, citycodebusinessfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const { prefferedaddress, memberid } = this.state.fieldvalue;
        const { visible } = this.state;

        // private validation
        let privateValue = this.props.form.getFieldsValue(['privateaddress', 'privatecountry', 'privatestate', 'privatecity', 'privatepostal']);
        let privateFieldValidation = (prefferedaddress === 'Private' || privateValue.privateaddress !== "" || privateValue.privatecountry !== undefined || privateValue.privatestate !== undefined || privateValue.privatecity !== undefined || privateValue.privatepostal !== "") ? ['required'] : [];

        // business validation
        let businessValue = this.props.form.getFieldsValue(['companyname', 'department', 'position', 'businessaddress', 'businesscountry', 'businessstate', 'businesscity', 'businesspostal']);
        let businessFieldValidation = (prefferedaddress === 'Business' || businessValue.companyname !== undefined || businessValue.department !== undefined || businessValue.position !== undefined || businessValue.businessaddress !== undefined || businessValue.businesscountry !== undefined || businessValue.businessstate !== undefined || businessValue.businesscity !== undefined || businessValue.businesspostal !== undefined) ? ['required'] : [];

        if (formrender) {
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={20}>
                            <Title level={4}>Address</Title>
                        </Col>
                        <Col xs={24} xl={4} align="right">
                            <Button htmlType="button" size="small" type="primary" label="Show History" onClick={() => this.handleOpenModal(memberid)} />
                        </Col>
                        <Divider style={{ marginBottom: 15 }} />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Modal visible={visible} title="Member Address History" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={800}>
                            <AddressHistory memberid={memberid} />
                        </Modal>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <RadioButton form={this.props.form} labeltext="Preferred Address" datafield="prefferedaddress" options={optionsPrefferdAddress} validationrules={['required']} onChange={this.onChangePrefferedAddress} disabled={generalfielddisabled} />
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <Collapse bordered={false} defaultActiveKey={this.state.activeKey} activeKey={this.state.activeKey} onChange={this.onClickCollapse}>
                                        <Panel header="Private Address" key="1" forceRender={true}>
                                            <TextArea form={this.props.form} labeltext="Home Address" datafield="privateaddress" disabled={generalfielddisabled} />
                                            <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="privatecountry" form={this.props.form} validationrules={privateFieldValidation} onChange={this.onChangeCountry} disabled={generalfielddisabled} />
                                            <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="privatestate" form={this.props.form} validationrules={privateFieldValidation} onChange={this.onChangeState} disabled={statecodefielddisabled} />
                                            <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="privatecity" form={this.props.form} validationrules={privateFieldValidation} disabled={citycodefielddisabled} />
                                            <InputText form={this.props.form} labeltext="Postal Code" datafield="privatepostal" validationrules={['pattern.number']} maxLength={5} disabled={generalfielddisabled} />
                                        </Panel>
                                        <Panel header="Business Address" key="2" forceRender={true}>
                                            <InputText form={this.props.form} labeltext="Company Name" datafield="companyname" validationrules={businessFieldValidation} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Department" datafield="department" validationrules={businessFieldValidation} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Position" datafield="position" validationrules={businessFieldValidation} disabled={generalfielddisabled} />
                                            <TextArea form={this.props.form} labeltext="Business Address" datafield="businessaddress" disabled={generalfielddisabled} />
                                            <CountrySelect ref={(e) => { this.componentBusinessCountrySelect = e }} labeltext="Country" datafield="businesscountry" form={this.props.form} validationrules={businessFieldValidation} onChange={this.onChangeBusinessCountry} disabled={generalfielddisabled} />
                                            <StateSelect ref={(e) => { this.componentBusinessStateSelect = e }} labeltext="State" datafield="businessstate" form={this.props.form} validationrules={businessFieldValidation} onChange={this.onChangeBusinessState} disabled={statecodebusinessfielddisabled} />
                                            <CitySelect ref={(e) => { this.componentBusinessCitySelect = e }} labeltext="City" datafield="businesscity" form={this.props.form} validationrules={businessFieldValidation} disabled={citycodebusinessfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Postal Code" datafield="businesspostal" validationrules={['pattern.number']} maxLength={5} disabled={generalfielddisabled} />
                                        </Panel>
                                    </Collapse>
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