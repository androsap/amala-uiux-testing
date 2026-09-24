import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, SelectBase, InputText, DatePickerBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Modal } from 'antd';
import { CorporateRole } from '../../../data';
import moment from 'moment';
import { getProfile } from '../../../utilities/AuthService';

const { warning } = Modal;

const prefixmenuname = 'MBCOTRCO';
const menucode = 'MBCOTRCO';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            specialfielddisabled: false,
            generalfielddisabled: false,
            idcardnumber: null,
            active: null,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                emaildisabled: true
            },
            admincardnumberundisabled: []
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    checkPermission() {
        let id = this.props.travelcoordinatorid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'View';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let emaildisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                emaildisabled = false;
            }
            //change into update page
            this.setState({ titlepage, actionspage, specialfielddisabled, generalfielddisabled, emaildisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id, actionspage);
        }
    }

    getDetail = (travelcordinatorid, actionspage, type) => {
        let url = api.url.travelcoordinator.list;
        let criteria = { travelcordinatorid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let { travelcoordinatortype, rolecode, name, birthdate, cardnumber, idcardnumber, email, username, phonenumber } = result[0] || {};
                    if (travelcordinatorid) {
                        this.props.form.setFieldsValue({
                            ['admin[0][name]']: name,
                            ['admin[0][birthdate]']: moment(birthdate),
                            ['admin[0][cardnumber]']: cardnumber,
                            ['admin[0][idcardnumber]']: idcardnumber,
                            ['admin[0][email]']: email,
                            ['admin[0][username]']: username,
                            ['admin[0][phonenumber]']: phonenumber,
                        });
                    }

                    let setValue = { travelcoordinatortype, rolecode };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({ travelcoordinatortype });
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
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const { actionspage } = this.state;
                this.setState({ isLoading: true });
                const { rolecode } = input || {};
                let requesttype = 'TRAVEL_COORDINATOR';
                let requeststatus = 'NEW';
                let requestedby = getProfile().username;
                let travelcoordinatortype = (actionspage === 'create') ? 'ADMIN' : input.travelcoordinatortype;
                let approvalby = (input.approvalby) ? input.approvalby : '';
                let approvaldate = (input.approvaldate) ? input.approvaldate : '';
                let remark = (input.remark) ? input.remark : '';
                let password = moment(input.birthdate).format("YYMMDD");
                let memberid = this.props.memberid;

                //travelcordinator
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
                        // travelcordinatoradmin[field]['travelcordinatortype'] = 'ADMIN';
                        travelcordinatoradmin[field]['updateidcardnumber'] = (this.state.idcardnumber) ? false : true;
                    }
                }
                let travelcordinator = travelcordinatoradmin.filter(element => { return element !== null; })[0];
                // let reqdatas = {
                //     rolecode, password, memberid, travelcoordinatortype, ...travelcordinator
                // };
                // let reqdatas2 = JSON.stringify(reqdatas)

                let url = '';
                let message = '';
                
                let data = {
                    requesttype, memberid, requeststatus, requestedby, approvalby, approvaldate, remark, rolecode, password, memberid, travelcoordinatortype, ...travelcordinator
                };

                if (actionspage === 'create') {
                    url = api.url.travelcoordinator.create;
                } else {
                    url = api.url.travelcoordinator.update;
                    data.travelcoordinatorid = this.props.travelcoordinatorid;
                }
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                        // this.handleSuccess();
                        this.props.refreshHeader();
                        this.props.onClose();
                        this.props.refreshList();
                    } else Alert.error(responsemessage);

                    this.setState({ isLoading: false });
                })
            }
        });
    };

    retrieveMember = (cardnumber, type, key, command) => {
        let url = api.url.member.profile;
        let data = { cardnumber };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let { email, idcardnumber, firstname, lastname, dateofbirth, username } = result || {};
                let phonenumber = result.membercontacts.length ? result.membercontacts[0].phonenumber : null;
                let memberfullname = `${firstname}${lastname ? " " + lastname : ""}`;
                dateofbirth = dateofbirth ? moment(dateofbirth) : null;
                if (type === 'admin') {
                    this.props.form.setFieldsValue({
                        ['admin[' + key + '][name]']: memberfullname,
                        ['admin[' + key + '][birthdate]']: dateofbirth,
                        ['admin[' + key + '][idcardnumber]']: idcardnumber,
                        ['admin[' + key + '][email]']: email,
                        ['admin[' + key + '][username]']: username,
                        ['admin[' + key + '][phonenumber]']: phonenumber
                    });
                    //validate ID Number disabled field
                    let { admincardnumberundisabled } = this.state;
                    const idx = admincardnumberundisabled.findIndex(x => x === key);

                    if (!idcardnumber) {
                        if (idx === -1) admincardnumberundisabled.push(key);
                    } else if (idx !== -1) admincardnumberundisabled.splice(idx, 1);

                    this.setState({ admincardnumberundisabled })

                    if (!command) this.helperAdminDisabled(cardnumber, type, key, 'stop');
                } else {
                    this.props.form.setFieldsValue({
                        ['staff[' + key + '][name]']: memberfullname,
                        ['staff[' + key + '][birthdate]']: dateofbirth,
                        ['staff[' + key + '][idcardnumber]']: idcardnumber,
                        ['staff[' + key + '][email]']: email,
                        ['staff[' + key + '][username]']: username,
                        ['staff[' + key + '][phonenumber]']: phonenumber
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
                        ['admin[' + key + '][adminemail]']: undefined,
                        ['admin[' + key + '][adminusername]']: undefined,
                        ['admin[' + key + '][adminphonenumber]']: undefined,
                    });
                } else {
                    this.props.form.setFieldsValue({
                        ['staff[' + key + '][cardnumber]']: undefined,
                        ['staff[' + key + '][name]']: undefined,
                        ['staff[' + key + '][birthdate]']: undefined,
                        ['staff[' + key + '][idcardnumber]']: undefined,
                        ['staff[' + key + '][email]']: undefined,
                        ['staff[' + key + '][username]']: undefined,
                        ['staff[' + key + '][phonenumber]']: undefined
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

    handleSuccess = () => {
        let secondsToGo = 10;
        const modal = Modal.info({
            title: 'Your request will be processed as soon as possible waiting for approval from Garuda team, Thank You',
            content: `This message will close automatically after ${secondsToGo} second.`,
            width: 600
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({ content: `This message will close automatically after ${secondsToGo} second.` });
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
        }, secondsToGo * 1000);
    };

    render() {
        const { actionspage, specialfielddisabled, travelcoordinatortype, admincardnumberundisabled } = this.state;
        const { emaildisabled } = this.state.fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        let key = 0,
            disabled = true;

        const idx = admincardnumberundisabled.findIndex(x => x === key);
        if (idx !== -1) disabled = false;

        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18 }} xl={{ span: 18 }}>
                                <SelectBase form={this.props.form} labeltext="Travel Coordinator Type" datafield="travelcoordinatortype" options={CorporateRole} defaultValue={(actionspage === 'create') ? 'ADMIN' : travelcoordinatortype} disabled />
                                <InputText form={this.props.form} labeltext="Card Number" datafield={`admin[0][cardnumber]`} validationrules={['pattern.number', 'required']} maxLength={20} onBlur={(e) => this.handleAutoFill(e, 'admin', 0)} disabled={specialfielddisabled} />
                                <InputText form={this.props.form} labeltext="Name" datafield={`admin[0][name]`} validationrules={['pattern.name', 'required']} maxLength={45} disabled={true} />
                                <InputText form={this.props.form} labeltext="Username" datafield={`admin[0][username]`} validationrules={['required']} maxLength={45} disabled={true} />
                                <InputText form={this.props.form} labeltext="ID Card Number" datafield={`admin[0][idcardnumber]`} validationrules={['pattern.number', 'required']} maxLength={20} disabled={disabled} />
                                <InputText form={this.props.form} labeltext="Phone Number" datafield={`admin[0][phonenumber]`} validationrules={['pattern.phonenumber', 'required']} maxLength={20} disabled={true} />
                                {
                                    (actionspage === 'create') ?
                                        <InputText form={this.props.form} labeltext="Email" datafield={`admin[0][email]`} validationrules={['pattern.email', 'required']} maxLength={255} disabled={true} />
                                        :
                                        <InputText form={this.props.form} labeltext="Email" datafield={`admin[0][email]`} validationrules={['pattern.email', 'required']} maxLength={255} disabled={false} />
                                }
                                <DatePickerBase form={this.props.form} labeltext="Birth Date" datafield={`admin[0][birthdate]`} validationrules={['required']} maxDate={moment()} disabled={true} />
                                <SelectBase form={this.props.form} labeltext="Corporate Role" datafield="rolecode" validationrules={(specialfielddisabled ? [] : ['required'])} options={CorporateRole} disabled={true} defaultValue={(actionspage === 'create') ? 'ADMIN' : travelcoordinatortype} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="primary" label="Save" actioncode="CREATE"></Button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));