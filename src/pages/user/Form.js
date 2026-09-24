import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Alert from '../../components/Alert';
import ErrorGeneral from '../error/ErrorGeneral';
import Button from '../../components/Button';
import { connect } from "react-redux";
import { InputText, TextArea, SalutationSelect, TitleSelect, RoleSelect, CountrySelect, StateSelect, CitySelect, UserTypeSelect, SwitchButton } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: true,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                citycode: null,
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statecodefielddisabled: true,
                citycodefielddisabled: true,
                ignoretickoffiddisabled: true
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
            let fielddisabled = { specialfielddisabled, generalfielddisabled, statecodefielddisabled, citycodefielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentCountrySelect.retrieveData();
                this.componentSalutationSelect.retrieveData();
                this.componentTitleSelect.retrieveData();
                this.componentRoleSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (username, actionspage) => {
        let url = api.url.user.list;
        let criteria = { username };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {

                    if (result[0].status.toLowerCase() !== 'active')
                        this.setState({
                            fielddisabled: {
                                specialfielddisabled: true,
                                generalfielddisabled: true,
                                statecodefielddisabled: true,
                                citycodefielddisabled: true
                            },
                            isActive: false
                        })
                    const { vendorcode } = result[0] || null;
                    let username = (result[0].username) ? result[0].username : '';
                    let salutation = (result[0].salutation) ? result[0].salutation : undefined;
                    let salutationname = (result[0].salutationname) ? result[0].salutationname : undefined;
                    let title = (result[0].title) ? result[0].title : undefined;
                    let titlename = (result[0].titlename) ? result[0].titlename : undefined;
                    let userfullname = (result[0].userfullname) ? result[0].userfullname : '';
                    let useremail = (result[0].useremail) ? result[0].useremail : '';
                    let userphone = (result[0].userphone) ? result[0].userphone : '';
                    let usermobilephone = (result[0].usermobilephone) ? result[0].usermobilephone : '';
                    let userfax = (result[0].userfax) ? result[0].userfax : '';
                    let useraddress = (result[0].useraddress) ? result[0].useraddress : '';
                    let countrycode = (result[0].countrycode) ? result[0].countrycode : null;
                    let countryname = (result[0].countryname) ? result[0].countryname : null;
                    let statecode = (result[0].statecode) ? result[0].statecode : null;
                    let statename = (result[0].statename) ? result[0].statename : null;
                    let citycode = (result[0].citycode) ? result[0].citycode : null;
                    let cityname = (result[0].cityname) ? result[0].cityname : null;
                    let rolecode = (result[0].rolecode) ? result[0].rolecode : null;
                    let rolename = (result[0].rolename) ? result[0].rolename : null;
                    let tickoffid = (result[0].tickoffid) ? result[0].tickoffid : null;
                    let tickoffname = (result[0].tickoffname) ? result[0].tickoffname : null;
                    let branchcode = (result[0].branchcode) ? result[0].branchcode : null;
                    // let branchname = (result[0].branchname) ? result[0].branchname : null;
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : null;
                    let ignoretickoffid = result[0].ignoretickoffid ? result[0].ignoretickoffid : false;
                    // let partnername = (result[0].partnername) ? result[0].partnername : null;

                    let usertypetype = (typeof result[0].tickoffid !== undefined && result[0].tickoffid !== null) ? 'BRANCH' : (typeof vendorcode !== undefined && vendorcode !== null) ? 'VENDOR' : 'PARTNER';
                    let usertype = (usertypetype === 'BRANCH') ? branchcode + "|SPLIT|" + tickoffid : (usertypetype === 'PARTNER') ? partnercode : vendorcode;

                    let setValue = { username, salutation, title, userfullname, useremail, userphone, usermobilephone, useraddress, userfax, countrycode, statecode, citycode, rolecode, usertype, usertypetype, ignoretickoffid };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, ignoretickoffiddisabled: usertypetype === 'BRANCH' ? false : true } });

                    //load options select2
                    this.componentSalutationSelect.retrieveData({}, { salutation, salutationname }, actionspage);
                    this.componentTitleSelect.retrieveData({}, { title, titlename }, actionspage);
                    this.componentCountrySelect.retrieveData({}, { countrycode, countryname }, actionspage);
                    this.componentStateSelect.retrieveData({ countrycode }, { statecode, statename }, actionspage);
                    this.componentCitySelect.retrieveData({ statecode }, { citycode, cityname }, actionspage);
                    this.componentCitySelect.retrieveData({ statecode }, { citycode, cityname }, actionspage);
                    this.componentRoleSelect.retrieveData({}, { rolecode, rolename }, actionspage);
                    this.componentUserType.retrieveData(usertypetype, {}, { tickoffid, tickoffname, branchcode }, actionspage);
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
                let username = (input.username) ? input.username : null;
                let salutation = (input.salutation) ? input.salutation : null;
                let title = (input.title) ? input.title : null;
                let userfullname = (input.userfullname) ? input.userfullname : null;
                let useremail = (input.useremail) ? input.useremail : null;
                let userphone = (input.userphone) ? input.userphone : null;
                let usermobilephone = (input.usermobilephone) ? input.usermobilephone : null;
                let userfax = (input.userfax) ? input.userfax : null;
                let useraddress = (input.useraddress) ? input.useraddress : null;
                let citycode = (input.citycode) ? input.citycode : null;
                let usertypesplit = (input.usertypetype === 'BRANCH') ? input.usertype.split("|SPLIT|", 2) : input.usertype;
                let branchcode = (input.usertypetype === 'BRANCH' && usertypesplit[0]) ? usertypesplit[0] : null;
                let tickoffid = (input.usertypetype === 'BRANCH' && usertypesplit[1]) ? usertypesplit[1] : null;
                let partnercode = (input.usertypetype === 'PARTNER' && usertypesplit) ? usertypesplit : null;
                let vendorcode = (input.usertypetype === 'VENDOR' && usertypesplit) ? usertypesplit : null;
                let rolecode = (input.rolecode) ? input.rolecode : null;
                let ignoretickoffid = input.ignoretickoffid;

                let data = { username, salutation, title, userfullname, useremail, userphone, usermobilephone, userfax, useraddress, citycode, tickoffid, partnercode, rolecode, branchcode, ignoretickoffid, vendorcode };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.user.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.user.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/user');
                    } else {
                        Alert.error(responsemessage);
                    }
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

    onChangeUserType = (usertype) => {
        this.setState({ fielddisabled: { ...this.state.fielddisabled, ignoretickoffiddisabled: usertype === 'BRANCH' ? false : true } });
        this.props.form.setFieldsValue({ ignoretickoffid: false });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled, statecodefielddisabled, citycodefielddisabled, ignoretickoffiddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} User</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Username" datafield="username" form={this.props.form} validationrules={['required', 'pattern.alphanumericunderscoredot', 'max.45']} disabled={specialfielddisabled} />
                                    <SalutationSelect ref={(e) => { this.componentSalutationSelect = e }} labeltext="Salutation" datafield="salutation" form={this.props.form} disabled={generalfielddisabled} />
                                    <TitleSelect ref={(e) => { this.componentTitleSelect = e }} labeltext="Title" datafield="title" form={this.props.form} disabled={generalfielddisabled} />
                                    <InputText labeltext="Full Name" datafield="userfullname" form={this.props.form} validationrules={['required', 'pattern.letterspace', 'max.255']} disabled={generalfielddisabled} />
                                    <InputText labeltext="Email" datafield="useremail" form={this.props.form} validationrules={['required', 'type.email', 'max.45']} disabled={generalfielddisabled} />
                                    <InputText labeltext="Phone Number" datafield="userphone" form={this.props.form} validationrules={['pattern.phonenumber', 'max.45']} disabled={generalfielddisabled} />
                                    <InputText labeltext="Mobile" datafield="usermobilephone" form={this.props.form} validationrules={['required', 'pattern.phonenumber', 'max.45']} disabled={generalfielddisabled} />
                                    <InputText labeltext="Fax" datafield="userfax" form={this.props.form} validationrules={['pattern.phonenumber', 'max.45']} disabled={generalfielddisabled} />
                                    <TextArea labeltext="Address" datafield="useraddress" form={this.props.form} validationrules={['required']} disabled={generalfielddisabled} />
                                    <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="countrycode" form={this.props.form} disabled={generalfielddisabled} validationrules={['required']} onChange={this.onChangeCountry} />
                                    <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="statecode" form={this.props.form} disabled={statecodefielddisabled} validationrules={['required']} onChange={this.onChangeState} />
                                    <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="citycode" form={this.props.form} disabled={citycodefielddisabled} validationrules={['required']} />
                                    <RoleSelect ref={(e) => { this.componentRoleSelect = e }} labeltext="Role" datafield="rolecode" form={this.props.form} disabled={generalfielddisabled} validationrules={['required']} />
                                    <UserTypeSelect ref={(e) => { this.componentUserType = e }} labeltext="User Type" datafield="usertype" form={this.props.form} disabled={generalfielddisabled} validationrules={['required']} onChangeType={this.onChangeUserType} />
                                    <SwitchButton labeltext="Ignore Ticket Office" datafield="ignoretickoffid" form={this.props.form} defaultChecked={false} disabled={ignoretickoffiddisabled} />
                                    {/* <StatusRadioButton labeltext="Status" datafield="status" form={this.props.form} validationrules={['required']} disabled={generalfielddisabled} /> */}
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    this.state.isActive ?
                                        (actionspage === 'create') ?
                                            <Button htmlType="submit" type="primary" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                            : (actionspage === 'update') ?
                                                <Button htmlType="submit" type="primary" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                                : null : null
                                } &nbsp;
                                <Button url="/user" htmlType="link" type="default" label="Back" />
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
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));