import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, DateRangeBase, Button, Alert, TierSelect, CustomTransactionSelect, TextArea } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
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
            fieldvalue: {},
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
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
                // this.componentMembershipSelect.retrieveData();
                this.componentTierSelect.retrieveWithMembership();
                this.componentCustomTransactionSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (nomineefeeconfigid) => {
        let url = api.url.nomineefeeconfig.list;
        let criteria = { nomineefeeconfigid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    // let membershipid = (result[0].membershipid) ? result[0].membershipid : null;
                    // let membershipname = (result[0].membershipname) ? result[0].membershipname : null;
                    let tierid = (result[0].tierid) ? result[0].tierid : null;
                    let feemiles = (result[0].feemiles) ? result[0].feemiles.toString() : 0;
                    let feecashidr = (result[0].feecashidr) ? result[0].feecashidr.toString() : 0;
                    let feecashusd = (result[0].feecashusd) ? result[0].feecashusd.toString() : 0;
                    let customtrxcode = (result[0].customtrxcode) ? result[0].customtrxcode : null;
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : null;
                    let date = [startdate, enddate];

                    let setValue = { tierid, feemiles, feecashidr, feecashusd, customtrxcode, date };
                    this.props.form.setFieldsValue(setValue);

                    //load options select2
                    // this.componentMembershipSelect.retrieveData({}, { membershipid, membershipname }, actionspage);
                    this.componentTierSelect.retrieveWithMembership();
                    this.componentCustomTransactionSelect.retrieveData();
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
                const { ID } = this.props.match.params;
                const { tierid, feemiles, feecashidr, feecashusd, customtrxcode, remark } = input || {};
                let date = input.date;
                let startdate = (date && date[0]) ? moment(date[0]).format("YYYY-MM-DD") : null;
                let enddate = (date && date[1]) ? moment(date[1]).format("YYYY-MM-DD") : null;

                let data = { tierid, feemiles, feecashidr, feecashusd, customtrxcode, startdate, enddate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.nomineefeeconfig.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.nomineefeeconfig.update;
                    data.nomineefeeconfigid = ID;
                    data.remark = remark;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/nominee-fee-config');
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
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { form, menucode, prefixmenuname } = this.props;
        const { titlepage, actionspage, formrender, isLoading, responseMessage, fielddisabled } = this.state;
        const { generalfielddisabled, specialfielddisabled } = fielddisabled;
        if (formrender) {
            //title bar on browser
            document.title = `${titlepage} Nominee Fee Config | Loyalty Management System`;
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Nominee Fee Config</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    {/* <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Membership" datafield="membershipid" validationrules={['required']} disabled={specialfielddisabled} /> */}
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={specialfielddisabled} />
                                    <InputText form={form} labeltext="Fee Miles" datafield="feemiles" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Fee Cash IDR" datafield="feecashidr" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Fee Cash USD" datafield="feecashusd" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} form={form} labeltext="Custom Trx" datafield="customtrxcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} disabled={generalfielddisabled} />
                                    {
                                        (actionspage === 'update') ?
                                            <TextArea form={form} labeltext="Remark" datafield="remark" disabled={generalfielddisabled} /> : ''
                                    }
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
                                <Button url="/nominee-fee-config" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));