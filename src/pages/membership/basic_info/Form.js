import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, SwitchButton, MembershipTypeSelect, Button, Alert, RadioButton, DatePickerBase, SelectBase, MembershipSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Popover, Icon } from 'antd';
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
                durationtype: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                uniquenumberfielddisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.membershipid;
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
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentMembershipTypeSelect.retrieveData();
                this.componentMembershipSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (membershipid, actionspage) => {
        let url = api.url.membership.list;
        let criteria = { membershipid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let membershipid = (result[0].membershipid) ? result[0].membershipid : '';
                    let membershipname = (result[0].membershipname) ? result[0].membershipname : '';
                    let membershiptypeid = (result[0].membershiptypeid) ? result[0].membershiptypeid : '';
                    let membershiptypename = (result[0].membershiptypename) ? result[0].membershiptypename : '';
                    let terminateto = (result[0].terminateto) ? result[0].terminateto : undefined;
                    let firstnum = (result[0].firstnum) ? result[0].firstnum.toString() : '';
                    let exclusive = (result[0].exclusive) ? result[0].exclusive : '';
                    let isfirstnum = (firstnum !== undefined && firstnum !== null) ? result[0].firstnum : '';
                    let evaluationtype = result[0].evaluationtype ? result[0].evaluationtype : null;
                    let evaluationduration = (result[0].evaluationduration) ? result[0].evaluationduration.toString() : '';
                    let durationtype = result[0].durationtype ? result[0].durationtype : null;
                    let durationindate = (result[0].durationtype === 'DATE') ? moment(result[0].durationindate) : null;
                    let durationinmonths = (result[0].durationinmonths) ? result[0].durationinmonths.toString() : '';
                    let durationinyears = (result[0].durationinyears) ? result[0].durationinyears.toString() : '';
                    let periodendmonth = (durationtype === 'MONTH') ? result[0].periodendmonth : false;
                    let periodendyear = (durationtype === 'YEAR') ? result[0].periodendyear : false;
                    let uniquenumberfielddisabled = (actionspage !== 'view') ? (firstnum) ? false : true : true;

                    let setValue = {
                        membershipid, membershipname, membershiptypeid, exclusive, isfirstnum, firstnum, evaluationtype, evaluationduration,
                        durationtype, durationindate, durationinmonths, durationinyears, periodendmonth, periodendyear, terminateto
                    };
                    this.props.form.setFieldsValue(setValue);

                    let fielddisabled = { ...this.state.fielddisabled, uniquenumberfielddisabled };
                    let fieldvalue = { ...this.state.fieldvalue, evaluationtype, durationtype };
                    this.setState({ fielddisabled, fieldvalue });

                    //load options select2
                    this.componentMembershipTypeSelect.retrieveData({}, { membershiptypeid, membershiptypename }, actionspage);
                    this.componentMembershipSelect.retrieveData({}, {}, actionspage, [membershipid]);
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
                let membershipid = input.membershipid;
                let membershipname = input.membershipname;
                let membershiptypeid = input.membershiptypeid;
                let exclusive = (input.exclusive) ? true : false;
                let firstnum = (input.firstnum !== undefined && input.firstnum.length > 0) ? input.firstnum : null;
                let terminateto = (input.terminateto) ? input.terminateto : null;
                let evaluationtype = input.evaluationtype;
                let evaluationduration = (input.evaluationtype === 'MONTH') ? input.evaluationduration : null;
                let durationtype = input.durationtype;
                let durationindate = (input.durationtype === 'DATE') ? moment(input.durationindate).format("YYYY-MM-DD") : null;
                let periodendmonth = (input.durationtype === 'MONTH') ? input.periodendmonth ? true : false : null;
                let durationinmonths = (input.durationtype === 'MONTH') ? input.durationinmonths : null;
                let periodendyear = (input.durationtype === 'YEAR') ? input.periodendyear ? true : false : null;
                let durationinyears = (input.durationtype === 'YEAR') ? input.durationinyears : null;

                let data = {
                    membershipid, membershipname, membershiptypeid, exclusive, firstnum, terminateto, evaluationtype, evaluationduration,
                    durationtype, durationindate, periodendmonth, periodendyear, durationinmonths, durationinyears
                };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.membership.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.membership.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/membership');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeUniqueNumber = (value) => {
        let uniquenumberfielddisabled = !value;
        let fielddisabled = { ...this.state.fielddisabled, uniquenumberfielddisabled };
        this.setState({ fielddisabled });

        this.props.form.setFieldsValue({ firstnum: undefined });
    }

    onChangeEvaluationType = (value) => {
        let evaluationtype = value === null ? null : value;

        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, evaluationtype } });
    }

    onChangeDurationType = (event) => {
        let durationtype = event === null ? null : event.target.value;

        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, durationtype } });
        this.props.form.setFieldsValue({ durationindate: undefined, durationinmonths: undefined, periodendmonth: undefined, durationinyears: undefined, periodendyears: undefined });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled, uniquenumberfielddisabled } = this.state.fielddisabled;
        const { evaluationtype, durationtype } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;
        const optionsEvaluationType = [
            { value: 'MONTH', label: 'Month' },
            { value: 'USETIERPERIOD', label: 'Use Tier Period' }
        ];
        const optionsDurationType = [
            { label: "Date", value: "DATE" },
            { label: "Month", value: "MONTH" },
            { label: "Year", value: "YEAR" }
        ];

        let contentDurationType = <div>
            <p>This duration type is used for calculating membership period after earning transaction</p>
        </div>

        let popDurationType = <>
            <span>Duration Type <Popover content={contentDurationType} title="Duration Type"><Icon type="info-circle" style={{ color: '#1890ff'}} /></Popover>
            </span>
        </>

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Membership | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Membership</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Membership ID" datafield="membershipid" validationrules={['required', 'pattern.alphanumeric']} maxLength={20} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Membership Name" datafield="membershipname" validationrules={['required', 'pattern.alphanumericspace']} maxLength={45} disabled={generalfielddisabled} />
                                    <MembershipTypeSelect ref={(e) => { this.componentMembershipTypeSelect = e }} form={this.props.form} labeltext="Membership Type" datafield="membershiptypeid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Terminate to" placeholder="Choose Membership" datafield="terminateto" onChange={this.onChangeTerminateTo} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Exclusive Membership?" datafield="exclusive" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Have Unique Number?" datafield="isfirstnum" disabled={generalfielddisabled} onChange={this.onChangeUniqueNumber} />
                                    <InputText form={this.props.form} labeltext="Unique Number" datafield="firstnum" validationrules={(!uniquenumberfielddisabled) ? ['required', 'pattern.number'] : null} maxLength={2} disabled={uniquenumberfielddisabled} />
                                    <Row gutter={6}>
                                        <Col className="gutter-row" xl={16} md={16} sm={24} >
                                            <SelectBase labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={this.props.form} labeltext="Evaluation Type" placeholder="Evaluation Type" datafield="evaluationtype" validationrules={['required']} options={optionsEvaluationType} onChange={this.onChangeEvaluationType} disabled={generalfielddisabled} />
                                        </Col>
                                        <Col className="gutter-row" xl={8} md={8} sm={24} >
                                            <InputText wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Evaluation Duration" datafield="evaluationduration" className={(evaluationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(evaluationtype === 'MONTH') ? ['required', 'pattern.number'] : ['pattern.number']} maxLength={2} disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <RadioButton form={this.props.form} labeltext={popDurationType} datafield="durationtype" options={optionsDurationType} validationrules={['required']} onChange={this.onChangeDurationType} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Duration Date" datafield="durationindate" className={(durationtype !== 'DATE') ? 'hidden' : ''} validationrules={(durationtype === 'DATE') ? ['required'] : null} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Duration In Months" datafield="durationinmonths" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(durationtype === 'MONTH') ? ['required', 'pattern.number', 'max.2', this.handleValidationDurationInMonth] : null} maxLength={2} disabled={generalfielddisabled} suffix="Months" />
                                    <InputText form={this.props.form} labeltext="Duration In Years" datafield="durationinyears" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(durationtype === 'YEAR') ? ['required', 'pattern.number', 'max.2', this.handleValidationDurationInYear] : null} maxLength={2} disabled={generalfielddisabled} suffix="Years" />
                                    <SwitchButton form={this.props.form} labeltext="Periode End Month" datafield="periodendmonth" className={(durationtype !== 'MONTH') ? 'hidden' : ''} validationrules={(durationtype === 'MONTH') ? ['required'] : null} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Periode End Year" datafield="periodendyear" className={(durationtype !== 'YEAR') ? 'hidden' : ''} validationrules={(durationtype === 'YEAR') ? ['required'] : null} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
                                <Button url="/membership" htmlType="link" type="default" label="Back" />
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