import React, { Component } from 'react';
import { SaveRequest, DetailRequest, RetrieveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { Alert, InputText, Button, SelectBase, RadioButton, TextArea, CountryPhoneSelect, DatePickerBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';
import { VendorType } from '../../../data'
import moment from 'moment';

import RegionTable from '../sla/Index';
import RegionForm from '../sla/Form';

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
            titleformpage: 'Create',
            showregionform: false,
            slatype: null,
            sla: [],
            fieldvalue: {
                slaid: null,
                regioncode: null,
                vendortype: null,
                actionsdetailpage: 'create',
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                slacodedaysdisabled: true,
                slacodeweeksdisabled: true,
                slacodemonthsdisabled: true,
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
            let slacodedaysdisabled = true;
            let slacodeweeksdisabled = true;
            let slacodemonthsdisabled = true;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled, slacodedaysdisabled, slacodeweeksdisabled, slacodemonthsdisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
            this.getSla(id)
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
            this.componentPhoneCountryCodeSelect.retrieveData();
        }
        this.componentPhoneCountryCodeSelect.retrieveData();
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (vendorcode, actionspage) => {
        let url = api.url.vendor.detail;
        let data = { vendorcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode === "0000") {
                const { vendorcode, vendortype, vendorname, sla, contactemail, contactperson, phonecountrycode, phonenumber, phoneregioncode, notes } = result || null;

                let startperiod = (result.startperiod) ? moment(result.startperiod) : null;
                let endperiod = (result.endperiod) ? moment(result.endperiod) : null;
                let active = (result.active !== undefined) ? result.active : null;

                let generalfielddisabled = (actionspage !== "view") ? false : true;

                let setValue = {
                    vendorcode, vendortype, vendorname, contactemail, contactperson, phonecountrycode, phonenumber,
                    phoneregioncode, notes, startperiod, endperiod
                };
                this.props.form.setFieldsValue(setValue);
                let fieldvalue = { vendortype, active };
                let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                this.setState({ fieldvalue, fielddisabled, sla, vendorname });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    getSla = (vendorcode) => {
        let url = api.url.vendorsla.retrieve;
        let criteria = { vendorcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                this.setState({ sla: result });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { sla, actionspage } = this.state;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                let vendorcode = input.vendorcode;
                let vendortype = input.vendortype;
                let vendorname = input.vendorname;
                let contactemail = (input.contactemail) ? input.contactemail : null;
                let contactperson = (input.contactperson) ? input.contactperson : null;
                let phonecountrycode = (input.phonecountrycode) ? input.phonecountrycode : null;
                let phonenumber = (input.phonenumber) ? input.phonenumber : null;
                let phoneregioncode = (input.phoneregioncode) ? input.phoneregioncode : null;
                let startperiod = (input.startperiod) ? input.startperiod : null;
                let endperiod = (input.endperiod) ? input.endperiod : null;
                let notes = (input.notes) ? input.notes : null;
                let active = true;

                let newsla = (vendortype !== 'COURIER') ? [{
                    slaid: this.state.fieldvalue.slaid,
                    regioncode: (vendortype !== 'COURIER') ? 'ALL' : input.regioncode,
                    slatype: input.slatype,
                    slaindays: input.slaindays,
                    slainweeks: input.slainweeks,
                    slainmonths: input.slainmonths
                }] : sla;

                let data = {
                    vendorcode, vendortype, vendorname, sla: newsla, contactemail,
                    contactperson, phonecountrycode, phonenumber, phoneregioncode, startperiod, endperiod, notes, active
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.vendor.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.vendor.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? message : message;
                        Alert.success(message);
                        this.props.history.push('/vendor');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    handleOpenModal = () => {
        this.setState({ showregionform: true, fieldvalue: { ...this.state.fieldvalue, slaid: null }, titleformpage: 'Create' });
    }

    handleCloseModal = () => {
        this.setState({ showregionform: false });
    }

    handleRefresh = () => {
        this.getSla(this.props.match.params.ID);
    }

    setTitlePage = (titleformpage) => {
        this.setState({ titleformpage });
    }

    onChangeSla = (event) => {
        let slatype = event === null ? null : event.target.value;
        this.props.form.resetFields(['slaindays', 'slainweeks', 'slainmonths', []]);
        this.props.form.setFieldsValue({ slatype: undefined });

        let slacodedaysdisabled = (slatype === 'DAYS') ? false : true;
        let slacodeweeksdisabled = (slatype === 'WEEKS') ? false : true;
        let slacodemonthsdisabled = (slatype === 'MONTHS') ? false : true;
        let fieldvalue = { ...this.state.fieldvalue, slatype };
        let fielddisabled = { ...this.state.fielddisabled, slacodedaysdisabled, slacodeweeksdisabled, slacodemonthsdisabled };
        this.setState({ fieldvalue, fielddisabled });
    }

    handleRegionChange = (value) => {
        this.setState({
            fieldvalue: { ...this.state.fieldvalue, vendortype: value },
            fielddisabled: { ...this.state.fielddisabled, slacodedaysdisabled: value, slacodeweeksdisabled: value, slacodemonthsdisabled: value }
        });
    }

    handleSaveRegion = (actionsregionpage, value) => {
        const { actionspage } = this.state;
        if (actionspage === 'create') {
            if (actionsregionpage === 'create') {
                let sla = [...this.state.sla, value];
                this.setState({ sla, showregionform: false });
            } else if (actionsregionpage === 'update') {
                let { sla } = this.state;
                let { slaid } = this.state.fieldvalue;

                sla = sla.map((obj) => {
                    if (obj.slaid === slaid) { obj = value }
                    return obj;
                });
                this.setState({ sla, showregionform: false });
            }
        }
    }

    handleEditRegion = (slaid) => {
        this.setState({ showregionform: true, fieldvalue: { ...this.state.fieldvalue, slaid } });
    }

    handleDeleteRegion = (slaid) => {
        let { sla } = this.state;
        sla = sla.filter(obj => obj.slaid !== slaid);
        this.setState({ sla });
    }

    deleteData(vendorcode, active) {
        let url = (active) ? api.url.vendor.deactivate : api.url.vendor.activate;
        let data = { vendorcode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (active) ? 'Selected vendor has been activated' : 'Selected vendor has been deactivated';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, showregionform, titleformpage, sla, vendorname } = this.state;
        const { slaid, active } = this.state.fieldvalue;
        const { generalfielddisabled, specialfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const vendorcode = this.props.match.params.ID;
        const startperiod = this.props.form.getFieldValue('startperiod');
        const endperiod = this.props.form.getFieldValue('endperiod');

        if (formrender) {
            //title bar on browser
            document.title = titlepage + ` Vendor ${vendorname} | Loyalty Management System `;
            //render form
            return (
                <Row>
                    {actionspage === 'create' ?
                        null
                        :
                        <Row>
                            <Col xs={24} xl={22}>
                                <Title level={4}>Basic Info</Title>
                            </Col>
                            <Divider />
                        </Row>
                    }
                    <Modal visible={showregionform} title={titleformpage + " Region"} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={680}>
                        <RegionForm menucode={menucode} prefixmenuname={prefixmenuname} vendorcode={vendorcode} slaid={slaid} datasource={sla} actionspage={actionspage} handleSaveRegion={this.handleSaveRegion} handleRefresh={this.handleRefresh} handleClose={this.handleCloseModal} setTitlePage={this.setTitlePage} />
                    </Modal>
                    <Spin spinning={this.state.loading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase labeltext="Vendor Type" datafield="vendortype" form={this.props.form} validationrules={[`required`]} options={VendorType} onChange={this.handleRegionChange} disabled={specialfielddisabled} />
                                    <InputText labeltext="Vendor Code" datafield="vendorcode" form={this.props.form} validationrules={[`required`, 'pattern.alphanumericspace']} maxLength={50} disabled={specialfielddisabled} />
                                    <InputText labeltext="Vendor Name" datafield="vendorname" form={this.props.form} validationrules={[`required`, 'pattern.alphanumericbracket']} maxLength={100} disabled={active ? generalfielddisabled : true} />
                                    <InputText form={this.props.form} labeltext="Contact Email" datafield="contactemail" validationrules={[`required`, 'pattern.email']} maxLength={100} disabled={active ? generalfielddisabled : true} />
                                    <InputText form={this.props.form} labeltext="Contact Person" datafield="contactperson" maxLength={45} validationrules={[`required`, 'pattern.letterspace']} disabled={active ? generalfielddisabled : true} />
                                    <Row gutter={24}>
                                        <Col xs={14} sm={14} md={14}>
                                            <CountryPhoneSelect labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} ref={(e) => { this.componentPhoneCountryCodeSelect = e }} form={this.props.form} labeltext="Phone" datafield="phonecountrycode" validationrules={[`required`]} disabled={active ? generalfielddisabled : true} />
                                        </Col>
                                        <Col xs={4} sm={4} md={4}>
                                            <InputText wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Regional Code" datafield="phoneregioncode" maxLength={45} validationrules={['pattern.number']} disabled={active ? generalfielddisabled : true} />
                                        </Col>
                                        <Col xs={6} sm={6} md={6}>
                                            <InputText wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Phone Number" datafield="phonenumber" maxLength={45} validationrules={[`required`, 'pattern.number']} disabled={active ? generalfielddisabled : true} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col xs={16} sm={16} md={16}>
                                            <DatePickerBase labelCol={{ span: 12 }} wrapperCol={{ span: 11 }} form={this.props.form} labeltext="Period" datafield="startperiod" placeholder="Start Date" validationrules={[`required`]} maxDate={endperiod ? moment(endperiod) : null} disabled={active ? generalfielddisabled : true} />
                                        </Col>
                                        <Col xs={8} sm={8} md={8}>
                                            <DatePickerBase wrapperCol={{ span: 24 }} form={this.props.form} datafield="endperiod" placeholder="End Date" validationrules={[`required`]} minDate={moment(startperiod)} disabled={active ? generalfielddisabled : true} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TextArea labeltext="Notes" datafield="notes" form={this.props.form} maxLength={255} disabled={active ? generalfielddisabled : true} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create' && active) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && active) ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (active) ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(vendorcode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(vendorcode, active)} /> : ""
                                }
                                <Button url="/vendor" htmlType="link" type="default" label="Back" />
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