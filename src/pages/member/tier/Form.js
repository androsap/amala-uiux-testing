import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SelectBase, MembershipTypeSelect, MembershipSelect, TierSelect, DatePickerBase, Button, Alert, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { getGeneralConfig } from '../../../utilities/Helpers';
import { general_config } from '../../../utilities/Constant';
import ErrorGeneral from '../../error/ErrorGeneral';
import moment from 'moment';

const optionsChangeProcess = [
    { value: 'UPGRADE', label: 'UPGRADE' },
    { value: 'MAINTAIN', label: 'MAINTAIN' },
    { value: 'DOWNGRADE', label: 'DOWNGRADE' }
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
            fieldvalue: {
                membershiptypeid: (this.props.membershiptypeid && this.props.membershiptypeid) ? this.props.membershiptypeid : null,
                membershipid: null,
                tierid: null,
                tierrank: null,
                startdate: null,
                enddate: null,
                tiergeneralconfig: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                membershipfielddisabled: true,
                tierfielddisabled: true,
                tierbodfielddisabled: false
            }
        }
    };

    checkPermission() {
        const id = this.props.membertierid;
        const { menucode, permission, prefixmenuname, managetiertype } = this.props;
        const { usermenu } = permission;
        if (id && (managetiertype === 'manage' || managetiertype === 'edit')) {
            this.setState({ isLoading: true });

            let { membershiptypeid } = this.state.fieldvalue;
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = (managetiertype === 'edit') ? false : true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }

            //change into update page
            this.componentMembershipTypeSelect.retrieveData();
            this.componentMembershipSelect.retrieveData({ membershiptypeid });

            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled, membershipfielddisabled: false };
            if (this.props.formType === 'detail') {
                fielddisabled = { ...this.state.fielddisabled, specialfielddisabled: true, generalfielddisabled: true, membershipfielddisabled: true };
            }

            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.form.setFieldsValue({ membershiptypeid });
            this.getDetail(id);
            this.setState({ isLoading: false });
        } else {
            this.props.form.setFieldsValue({ startdate: moment() });
            this.componentMembershipTypeSelect.retrieveData();
        };
    };

    componentDidMount() {
        this.checkPermission();
        const callback = (tiergeneralconfig) => {
            this.setState({ fieldvalue: { ...this.state.fieldvalue, tiergeneralconfig } });
        };
        getGeneralConfig(general_config.notification_tier_maintain, callback);
    };

    getRank = (tierid, callback) => {
        let paging = { limit: -1, page: 1 }
        let criteria = { tierid };
        let column = [];
        let sort = { tiername: 'asc' };
        RetrieveRequest(api.url.tierrank.list, criteria, paging, column, sort).then((response) => {
            const { status, result } = response;
            let tierrank = null;
            if (status.responsecode.substring(0, 1) === '0' && result.length !== 0) {
                tierrank = (result[0] && result[0]['rank']) ? result[0]['rank'] : null;
            }
            callback(tierrank);
        });
    };

    getDetail = (membertierid) => {
        const { formType, isBOD, managetiertype } = this.props;
        const { fieldvalue, fielddisabled } = this.state;
        let url = (formType === 'detail') ? api.url.membertier.detail : api.url.membertier.list;
        let criteria = { membertierid };
        let data = { membertierid };
        //call loader
        if (formType === 'detail') {
            DetailRequest(url, data).then((response) => {
                const { status = {}, result = {} } = response;
                if (status.responsecode === '0000') {
                    const { tierchangeprocess, membershiptypeid, membershipid, tierid, startdate, enddate, notes } = result;
                    const tierbodfielddisabled = (isBOD) ? false : true

                    const setValue = {
                        tierchangeprocess, membershiptypeid, membershipid, tierid, notes,
                        startdate: moment(startdate),
                        enddate: (enddate) ? moment(enddate) : undefined
                    };

                    this.props.form.setFieldsValue(setValue);
                    this.setState({ fielddisabled: { ...fielddisabled, tierbodfielddisabled } });
                } else this.setState({ responseMessage: 'Data not found', formrender: false });
            });
        } else {
            RetrieveRequest(url, criteria).then((response) => {
                const { status = {}, result = [] } = response;
                if (status.responsecode === '0000') {
                    if (result.length > 0) {
                        const { tierchangeprocess, membershiptypeid, membershipid, tierid, startdate, enddate, notes } = result[0];
                        const specialfielddisabled = (managetiertype === 'edit') ? false : true;
                        const tierbodfielddisabled = (managetiertype === 'manage') ? true : (managetiertype === 'edit') ? false : true;
                        const membershipfielddisabled = (managetiertype === 'manage' || managetiertype === 'edit') ? false : true;
                        const setValue = (managetiertype === 'manage') ? {
                            membershiptypeid, notes: 'Purpose: \nApproval: '
                        } : {
                            tierchangeprocess, membershiptypeid, membershipid, tierid,
                            startdate: moment(startdate),
                            enddate: (enddate) ? moment(enddate) : undefined,
                            notes: (notes === null) ? 'Purpose: \nApproval: ' : notes
                        };

                        this.props.form.setFieldsValue(setValue);
                        this.componentTierSelect.retrieveData((managetiertype === 'manage') ? { membershipid } : {});

                        /* GET TIER RANK */
                        const callback = (tierrank) => {
                            this.setState({
                                fieldvalue: { ...fieldvalue, tierrank },
                                fielddisabled: { ...fielddisabled, tierbodfielddisabled, membershipfielddisabled, specialfielddisabled }
                            });
                        }

                        this.getRank(tierid, callback);
                        this.setState({ fieldvalue: { ...this.state.fieldvalue, tierid, membershipid, startdate } });
                    } else this.setState({ responseMessage: 'Data not found', formrender: false });
                } else {
                    this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
                }
            });
        }
        this.setState({ isLoading: false });
    };

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { tierchangeprocess, tierid, notes } = input || {};
                const { memberid, membertierid, managetiertype, tierdataselected } = this.props || {};
                const { active, tiermiles, frequency, tierrenewal, frequencyrenewal } = tierdataselected || {};

                //define parameter
                let startdate = (input.startdate) ? moment(input.startdate).format("YYYY-MM-DD") : null;
                let enddate = (input.enddate) ? moment(input.enddate).format("YYYY-MM-DD") : null;

                let message = (actionspage === 'create') ? 'New data has been created' : `Data has been ${(managetiertype === 'edit') ? 'edited' : 'updated'}`;
                let url = (managetiertype === 'edit') ? api.url.membertier.editintegration : api.url.membertier.updateintegration;
                let data = (managetiertype === 'edit') ? {
                    membertierid, memberid, tierchangeprocess, tierid, startdate, enddate, notes, active, tiermiles, frequency, tierrenewal, frequencyrenewal,
                    resetaccount: true
                } : { membertierid, memberid, tierchangeprocess, tierid, startdate, enddate, notes };


                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                        this.props.handleOk();
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeMembershipType = (membershiptypeid) => {
        let membershipfielddisabled = (membershiptypeid) ? false : true;
        let membershipid = undefined;
        let tierbodfielddisabled = true;
        let tierfielddisabled = true
        let tierid = undefined;

        this.setState({ fielddisabled: { ...this.state.fielddisabled, membershipfielddisabled, tierbodfielddisabled, tierfielddisabled } });
        this.props.form.setFieldsValue({ membershipid, tierid });
        this.componentMembershipSelect.retrieveData({ membershiptypeid });
    };

    onChangeMembership = (membershipid) => {
        let tierbodfielddisabled = (membershipid) ? false : true;
        let tierid = undefined;

        this.setState({ fielddisabled: { ...this.state.fielddisabled, tierbodfielddisabled, tierfielddisabled: tierbodfielddisabled } });
        this.props.form.setFieldsValue({ tierid });

        let tierchangeprocess = this.props.form.getFieldValue('tierchangeprocess');
        if (membershipid === this.state.fieldvalue.membershipid && tierchangeprocess) {
            this.componentTierSelect.retrieveDataWithRank({ membershipid }, {}, '', tierchangeprocess, this.state.fieldvalue.tierrank);
        } else {
            this.componentTierSelect.retrieveData({ membershipid });
        }
    };

    handleProcessChange = (tierchangeprocess) => {
        let tierid = undefined;
        let membershipid = this.props.form.getFieldValue('membershipid');

        if (membershipid === this.state.fieldvalue.membershipid && tierchangeprocess) {
            this.componentTierSelect.retrieveDataWithRank({ membershipid }, {}, '', tierchangeprocess, this.state.fieldvalue.tierrank);
        } else this.componentTierSelect.retrieveData({ membershipid });

        this.props.form.setFieldsValue({ tierid });
    };

    onChangeStartDate = () => {
        this.props.form.resetFields(['enddate', []]);
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender, actionspage, fieldvalue, fielddisabled } = this.state;
        const { startdate, tiergeneralconfig } = fieldvalue;
        const { specialfielddisabled, generalfielddisabled, membershipfielddisabled, tierbodfielddisabled, tierfielddisabled } = fielddisabled;
        const { menucode, prefixmenuname, isBOD, formType, permission, managetiertype } = this.props;

        const startdatedata = this.props.form.getFieldValue('startdate');
        const tierDisabled = (isBOD) ? generalfielddisabled : ((actionspage === 'create') ? tierfielddisabled : tierbodfielddisabled);
        const endDateDisabled = (isBOD) ? specialfielddisabled : ((startdatedata) ? (formType === 'detail') ? true : false : true);
        const tierChangeProcess = this.props.form.getFieldValue('tierchangeprocess');
        const tierid = this.props.form.getFieldValue('tierid');
        const labelButton = (tierChangeProcess === "MAINTAIN" && (tierid !== tiergeneralconfig)) ? "Save" : "Save with send email";

        let minDate = (managetiertype === 'manage') ? moment() : (permission.usermenu["MBRTIER"]["MBRTIER_BACKDATE_UPDATE"]) ? null : moment(startdate);

        if (formrender) {
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                    <SelectBase form={this.props.form} labeltext="Tier Change Process" datafield="tierchangeprocess" validationrules={['required']} options={optionsChangeProcess} defaultValue={(isBOD) ? "UPGRADE" : undefined} onChange={this.handleProcessChange} disabled={(isBOD) ? specialfielddisabled : generalfielddisabled} />
                                    <MembershipTypeSelect ref={(e) => { this.componentMembershipTypeSelect = e }} form={this.props.form} labeltext="Membership Type" datafield="membershiptypeid" validationrules={['required']} onChange={this.onChangeMembershipType} disabled={specialfielddisabled} />
                                    <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Membership" datafield="membershipid" validationrules={['required']} onChange={this.onChangeMembership} disabled={membershipfielddisabled} />
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={this.props.form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={tierDisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Start Date" datafield="startdate" placeholder="Start Date" validationrules={['required']} minDate={minDate} defaultValue={moment()} onChange={this.onChangeStartDate} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="End Date" datafield="enddate" placeholder="End Date" minDate={startdatedata} disabled={endDateDisabled} />
                                    <TextArea labeltext="Notes" datafield="notes" form={this.props.form} normal maxLength={255} validationrules={['required']} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }} hidden={(formType === 'detail')}>
                                <Button htmlType="submit" type="primary" label={labelButton} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));