import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, PartnerSelect, ActivityCodeSelect, CobrandSelect, Button, Alert, DatePickerBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Approval',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                cobrandfielddisabled: true,
                activityfielddisabled: true
            },
            fieldValue: {
                enrolldate: null
            }
        }
    }

    checkPermission() {
        let id = this.props.membercobrandid;
        const { menucode, permission, prefixmenuname, formType } = this.props;
        const { usermenu } = permission;
        if (id && (formType === 'approve' || formType === 'reject')) {
            let titlepage = 'Approval';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_APPROVE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (membercobrandid, actionspage) => {
        let url = api.url.membercobrand.list;
        let criteria = { membercobrandid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : undefined;
                    let partnername = (result[0].partnername) ? result[0].partnername : undefined;
                    let cobrandcode = (result[0].cobrandcode) ? result[0].cobrandcode : undefined;
                    let cobrandname = (result[0].cobrandname) ? result[0].cobrandname : undefined;
                    let activitycode = (result[0].activitycode) ? result[0].activitycode : undefined;
                    let pointconversion = (result[0].pointconversion !== undefined && result[0].pointconversion !== null) ? result[0].pointconversion.toString() : undefined;
                    let mileageconversion = (result[0].mileageconversion !== undefined && result[0].mileageconversion !== null) ? result[0].mileageconversion.toString() : undefined;
                    let applicationid = (result[0].applicationid) ? result[0].applicationid.toString() : undefined;
                    let applicationdate = (result[0].applicationdate) ? moment(result[0].applicationdate) : undefined;
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : undefined;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : undefined;
                    let enrolldate = (result[0].enrolldate) ? moment(result[0].enrolldate) : undefined;

                    let setValue = { partnercode, cobrandcode, activitycode, applicationid, applicationdate, startdate, enddate, pointconversion, mileageconversion };
                    this.props.form.setFieldsValue(setValue);

                    this.setState({ fieldValue: { ...this.state.fieldValue, enrolldate } });

                    this.componentPartnerSelect.retrieveData({}, { partnercode, partnername }, actionspage);
                    this.componentCobrandSelect.retrieveData({ partnercode }, { cobrandcode, cobrandname }, actionspage);
                    this.componentActivitySelect.retrieveData({ partnercode })
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e, approval) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.memberid;
                let membercobrandid = this.props.membercobrandid;
                let cobrandcode = (input.cobrandcode) ? input.cobrandcode : null;
                let applicationid = (input.applicationid) ? input.applicationid : null;
                let pointconversion = (input.pointconversion) ? input.pointconversion : null;
                let mileageconversion = (input.mileageconversion) ? input.mileageconversion : null;
                let activitycode = (input.activitycode) ? input.activitycode : null;
                let applicationdate = (input.applicationdate) ? moment(input.applicationdate).format("YYYY-MM-DD") : null;
                let status = approval.toUpperCase();
                let startdate = (input.startdate) ? moment(input.startdate).format("YYYY-MM-DD") : null;
                let enddate = (input.enddate) ? moment(input.enddate).format("YYYY-MM-DD") : null;
                let enrolldate = this.state.fieldValue.enrolldate.format("YYYY-MM-DD");

                let url = api.url.membercobrand.update;
                let data = {
                    memberid, membercobrandid, cobrandcode, applicationid, applicationdate, activitycode,
                    enrolldate, status, startdate, enddate, pointconversion, mileageconversion
                };
                let message = 'Data has been updated';
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                        this.props.onClose();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { formrender } = this.state;
        const { menucode, prefixmenuname, formType } = this.props;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} disabled={true} />
                                    <CobrandSelect ref={(e) => { this.componentCobrandSelect = e }} form={this.props.form} labeltext="Cobrand" datafield="cobrandcode" validationrules={['required']} disabled={true} />
                                    <ActivityCodeSelect ref={(e) => { this.componentActivitySelect = e }} form={this.props.form} labeltext="Activity" datafield="activitycode" />
                                    <InputText form={this.props.form} labeltext="Point Conversion" datafield="pointconversion" validationrules={['pattern.number', 'max.11']} maxLength={11} />
                                    <InputText form={this.props.form} labeltext="Mileage Conversion" datafield="mileageconversion" validationrules={['pattern.number']} maxLength={11} disabled={true} />
                                    <InputText form={this.props.form} labeltext="Application ID" datafield="applicationid" validationrules={['pattern.number', 'max.11']} maxLength={11} />
                                    <DatePickerBase form={this.props.form} labeltext="Application Date" datafield="applicationdate" />
                                    <DatePickerBase form={this.props.form} labeltext="Start Date" datafield="startdate" validationrules={(formType === 'approve') ? ['required'] : []} />
                                    <DatePickerBase form={this.props.form} labeltext="End Date" datafield="enddate" />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (formType === 'approve') ? <Button htmlType="submit" type="primary" label="Approve" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.saveAction(e, 'ACTIVE')} /> :
                                        (formType === 'reject') ? <Button htmlType="submit" type="danger" label="Reject" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.saveAction(e, 'REJECTED')} /> : null
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