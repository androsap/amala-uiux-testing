import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, SelectBase, DateRangeBase, SwitchButton, PhoneCountrySelect, UploadBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal, Card, Button as AntButton } from 'antd';
import { Tabs } from 'antd';
import moment from 'moment';
import PartnerLocation from './location/Index';
import EnrollmentRule from './enrollment_rule/Index';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },
            fieldvalue: {
                partnercode: null,
                active: true,
                havebulk: null,
                isupdatepartnerlogo: null,
                partnerlogo: null
            },
            visible: false
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
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentPhoneCountrySelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (partnercode, actionspage) => {
        let url = api.url.partner.list;
        let criteria = { partnercode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : '';
                    let partnername = (result[0].partnername) ? result[0].partnername : '';
                    let partnertype = (result[0].partnertype) ? result[0].partnertype : undefined;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let contactperson = (result[0].contactperson) ? result[0].contactperson : '';
                    let phonecountrycode = (result[0].phonecountrycode) ? result[0].phonecountrycode : undefined;
                    let countryname = (result[0].countryname) ? result[0].countryname : undefined;
                    let phoneregioncode = (result[0].phoneregioncode) ? result[0].phoneregioncode.toString() : '';
                    let phonenumber = (result[0].phonenumber) ? result[0].phonenumber.toString() : '';
                    let contactemail = (result[0].contactemail) ? result[0].contactemail : '';
                    let earnmiles = result[0].earnmiles ? result[0].earnmiles : false;
                    let sendaccrual = result[0].sendaccrual ? result[0].sendaccrual : false;
                    let earntiermiles = result[0].earntiermiles ? result[0].earntiermiles : false;
                    let earntierbonus = result[0].earntierbonus ? result[0].earntierbonus : false;
                    let earnfrequency = result[0].earnfrequency ? result[0].earnfrequency : false;
                    let checkmileageconversion = result[0].checkmileageconversion ? result[0].checkmileageconversion : false;
                    let trxidprovider = result[0].trxidprovider ? result[0].trxidprovider : false;
                    let tempactivity = result[0].tempactivity ? result[0].tempactivity : false;
                    let havebulk = result[0].havebulk ? result[0].havebulk : false;
                    let bulktype = (result[0].bulktype) ? result[0].bulktype : undefined;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    let isupdatepartnerlogo = result[0].isupdatepartnerlogo ? result[0].isupdatepartnerlogo : false;
                    let partnerlogo = result[0].partnerlogo ? result[0].partnerlogo : null;

                    let setValue = {
                        partnercode, partnername, partnertype, date, contactperson, phonecountrycode, phoneregioncode, phonenumber, contactemail, earnmiles,
                        sendaccrual, earntiermiles, earntierbonus, earnfrequency, checkmileageconversion, trxidprovider, tempactivity, havebulk, bulktype
                    };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { partnercode, partnername, partnertype, active, havebulk, isupdatepartnerlogo, partnerlogo };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    this.componentPhoneCountrySelect.retrieveData({}, { countryphonecode: phonecountrycode, countryname }, actionspage);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                let partnercode = input.partnercode.toUpperCase();
                let partnername = input.partnername;
                let partnertype = input.partnertype;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let contactperson = input.contactperson;
                let phonecountrycode = input.phonecountrycode;
                let phoneregioncode = input.phoneregioncode;
                let phonenumber = input.phonenumber;
                let contactemail = input.contactemail;
                let earnmiles = (input.earnmiles) ? input.earnmiles : false;
                let sendaccrual = (input.sendaccrual) ? input.sendaccrual : false;
                let earntiermiles = (input.earntiermiles) ? input.earntiermiles : false;
                let earntierbonus = (input.earntierbonus) ? input.earntierbonus : false;
                let earnfrequency = (input.earnfrequency) ? input.earnfrequency : false;
                let checkmileageconversion = (input.checkmileageconversion) ? input.checkmileageconversion : false;
                let trxidprovider = (input.trxidprovider) ? input.trxidprovider : false;
                let tempactivity = (input.tempactivity) ? input.tempactivity : false;
                let havebulk = (input.havebulk) ? input.havebulk : false;
                let bulktype = input.bulktype ? input.bulktype : undefined;
                let partnerlogo = this.props.form.getFieldValue('partnerlogo');
                
                let data = actionspage === 'update' ? {
                    partnercode, partnername, partnertype, effectivedate, discontinuedate, contactperson, phonecountrycode, phoneregioncode, phonenumber, contactemail,
                    earnmiles, sendaccrual, earntierbonus, earntiermiles, earnfrequency, checkmileageconversion, trxidprovider, tempactivity, havebulk, bulktype, isupdatepartnerlogo: this.state.fieldvalue.isupdatepartnerlogo === false && !partnerlogo ? false : true
                } : {
                    partnercode, partnername, partnertype, effectivedate, discontinuedate, contactperson, phonecountrycode, phoneregioncode, phonenumber, contactemail,
                    earnmiles, sendaccrual, earntierbonus, earntiermiles, earnfrequency, checkmileageconversion, trxidprovider, tempactivity, havebulk, bulktype
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.partner.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.partner.update;
                }

                /* Mapping Request File*/
                var fileRequest = new FormData();
                var file = (input.partnerlogo && input.partnerlogo[0] && input.partnerlogo[0]['originFileObj']) ? input.partnerlogo[0]['originFileObj'] : null;
                fileRequest.append("partnerlogo", file);
                fileRequest.append("path", '');

                SaveRequest(url, data, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/partner');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    deleteData(partnercode, active) {
        let url = (active) ? api.url.partner.deactivate : api.url.partner.activate;
        let data = { partnercode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    handleHaveBulk = (value) => {
        let havebulk = undefined ? undefined : value;
        this.props.form.setFieldsValue({ bulktype: undefined });
        this.setState({ fieldvalue: { ...this.state.fieldvalue, havebulk } });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleDeleteLogo = () => {
        this.props.form.setFieldsValue({ isupdatepartnerlogo: true, partnerlogo: null });
        this.setState(prevState => ({ fieldvalue: { ...prevState.fieldvalue, isupdatepartnerlogo: true, partnerlogo: null } }));
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const { partnercode, partnername, partnertype, active, havebulk, partnerlogo, isupdatepartnerlogo } = this.state.fieldvalue;
        const optionsPartnerType = [
            { value: 'AIR', label: 'AIR' },
            { value: 'NONAIR', label: 'NON AIR' }
        ];
        const optionsBulkType = [
            { value: 'REGULER', label: 'REGULER' },
            { value: 'NONREGULER', label: 'NON REGULER' }
        ];

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Partner | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Partner</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.loading}>
                        <Tabs defaultActiveKey="1" style={{ marginTop: '-20px' }}>
                            <TabPane tab="Detail Information" key="1">
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <InputText form={this.props.form} labeltext="Partner Code" datafield="partnercode" maxLength={10} validationrules={['required', 'pattern.alphanumeric']} disabled={specialfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Partner Name" datafield="partnername" maxLength={45} validationrules={['required', 'pattern.letterspace']} disabled={generalfielddisabled} />
                                            <SelectBase form={this.props.form} labeltext="Partner Type" datafield="partnertype" options={optionsPartnerType} validationrules={['required']} disabled={generalfielddisabled} />
                                            <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment(new Date()).add(1, 'day')} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Contact Person" datafield="contactperson" maxLength={45} validationrules={['required', 'pattern.letterspace']} disabled={generalfielddisabled} />
                                            <Row gutter={2}>
                                                <Col xs={14} sm={14} md={14}>
                                                    <PhoneCountrySelect labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} ref={(e) => { this.componentPhoneCountrySelect = e }} form={this.props.form} labeltext="Phone" datafield="phonecountrycode" validationrules={['required']} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={5} sm={5} md={5}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Regional Code" datafield="phoneregioncode" maxLength={45} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={5} sm={5} md={5}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Phone Number" datafield="phonenumber" maxLength={45} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                                </Col>
                                            </Row>
                                            <InputText form={this.props.form} labeltext="Email" datafield="contactemail" maxLength={45} validationrules={['required', 'pattern.email']} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Status" datafield="active" defaultValue={active ? 'Active' : 'Inactive'} className={(actionspage === 'create') ? 'hidden' : ''} disabled />
                                            <Row gutter={24}>
                                                <Col className="gutter-row" xl={16} md={16} sm={24} >
                                                    <UploadBase labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={this.props.form} labeltext="Partner Logo" datafield="partnerlogo" disabled={generalfielddisabled} validationrules={actionspage === 'create' ? ['required'] : []} />
                                                </Col>
                                                {
                                                    (actionspage !== 'create' && partnerlogo !== null) ?
                                                        <Col className="gutter-row" xl={8} md={8} sm={24} style={{ lineHeight: '40px' }}>
                                                            <Button htmlType="button" label="Show Logo" type="primary" onClick={this.showModal} />
                                                            <Button style={{ lineHeight: '18px' }} htmlType="button" title="Delete Logo" type="danger" icon="delete" onClick={this.handleDeleteLogo} />
                                                        </Col> : null
                                                }
                                            </Row>
                                            <Modal title="Partner Logo" visible={this.state.visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} >
                                                <Row type="flex" justify="center">
                                                    <Card hoverable style={{ maxWidth: '360px' }} bodyStyle={{ display: 'none' }} cover={<img alt="Template Card" src={partnerlogo} />} />
                                                </Row>
                                            </Modal>
                                            <Row gutter={2}>
                                                <Col xs={12} sm={12} md={12}> {/* 16 */}
                                                    <SwitchButton labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} form={this.props.form} labeltext="Have Bulk?" datafield="havebulk" onChange={this.handleHaveBulk} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={12} sm={12} md={12}> {/* 8 */}
                                                    <SelectBase wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Bulk Type" datafield="bulktype" options={optionsBulkType} validationrules={(havebulk) ? ['required'] : []} className={(havebulk) ? '' : 'hidden'} allowClear={true} disabled={generalfielddisabled} />
                                                </Col>
                                            </Row>
                                            <SwitchButton form={this.props.form} labeltext="Earn Miles" datafield="earnmiles" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Send Accrual" datafield="sendaccrual" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Earn Tier Miles" datafield="earntiermiles" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Earn Tier Bonus" datafield="earntierbonus" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Earn Frequency" datafield="earnfrequency" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Check Mileage Conversion" datafield="checkmileageconversion" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Transaction ID Provider" datafield="trxidprovider" disabled={generalfielddisabled} />
                                            <SwitchButton form={this.props.form} labeltext="Temp Activity" datafield="tempactivity" disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                        {
                                            (actionspage === 'create') ?
                                                <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                                : (actionspage === 'update' && active) ?
                                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                                    : null
                                        }
                                        {
                                            (actionspage !== 'create') ?
                                                (active) ?
                                                    <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(partnercode, active)} /> :
                                                    <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(partnercode, active)} /> : ""
                                        }
                                        <Button url="/partner" htmlType="link" type="default" label="Back" />
                                    </Row>
                                </Form>
                            </TabPane>
                            {
                                (actionspage !== 'create' && usermenu["PARTNLOC"]["PARTNLOC_ACCESS"]) ?
                                    <TabPane tab="Partner Location" key="2">
                                        <PartnerLocation partnercode={this.props.match.params.ID} active={active} />
                                    </TabPane> : ""
                            }
                            {
                                (partnertype === 'NONAIR' && actionspage !== 'create' && usermenu["ENRLRULE"]["ENRLRULE_ACCESS"]) ?
                                    <TabPane tab="Enrollment Rule" key="3">
                                        <EnrollmentRule partnercode={this.props.match.params.ID} partnername={partnername} active={active} />
                                    </TabPane> : ""
                            }
                        </Tabs>
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