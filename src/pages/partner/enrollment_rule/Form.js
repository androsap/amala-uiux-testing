import React, { Component } from 'react';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, PartnerSelect, MembershipSelect, TierSelect, SwitchButton, DateRangeBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'ENRLRULE';
const menucode = 'ENRLRULE';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            actionspage: 'create',
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                tierfielddisabled: true
            }
        };
    }

    componentDidMount() {
        this.checkPermission();
    }

    checkPermission() {
        const { permission, active, enrollmentrulecode } = this.props;
        const { usermenu } = permission;

        if (enrollmentrulecode) {
            let url = api.url.enrollmentrule.list;
            let criteria = { enrollmentrulecode };
            this.setState({ loading: true });
            RetrieveRequest(url, criteria).then((response) => {
                const { status, result } = response;
                if (status.responsecode === '0000') {
                    if (result.length !== 0) {
                        let actionspage = 'update';
                        let generalfielddisabled = false;
                        let specialfielddisabled = false
                        if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !active) {
                            actionspage = 'view';
                            generalfielddisabled = true;
                            specialfielddisabled = !active ? false : true;
                        }
                        let fielddisabled = { generalfielddisabled, specialfielddisabled };
                        this.setState({ actionspage, fielddisabled });
                        this.getDetail(result, actionspage);
                    } else {
                        this.componentMembershipSelect.retrieveData();
                    }
                }
                this.setState({ loading: false });
            });
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else this.componentMembershipSelect.retrieveData();
        }
    }

    getDetail = (result, actionspage) => {
        const { active, partnercode, partnername, membershipid, tierid, createservicecard, overrideduplicate, updatecustomerdata, startdate, enddate } = result[0] || [];
        const date = [moment(startdate), moment(enddate)]

        let generalfielddisabled = (actionspage !== "view") ? !active : true;
        let tierfielddisabled = (actionspage !== "view") ? !active : true;

        let setValue = { partnercode, membershipid, tierid, createservicecard, overrideduplicate, updatecustomerdata, date, active };
        this.props.form.setFieldsValue(setValue);
        let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, tierfielddisabled };
        this.setState({ fielddisabled });

        this.componentPartnerSelect.retrieveData({}, { partnercode, partnername }, actionspage);
        this.componentMembershipSelect.retrieveData();
        this.componentTierSelect.retrieveData();
    }

    closeModalSuccess = () => {
        this.props.closemodalrefresh();
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;
        const { enrollmentrulecode } = this.props;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });

                let { partnercode, tierid, createservicecard, overrideduplicate, updatecustomerdata, active, date } = input || {};
                let startdate = ((date && date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null);
                let enddate = ((date && date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null);
                let data = actionspage !== 'create' ?
                    { partnercode, tierid, createservicecard, overrideduplicate, updatecustomerdata, active, startdate, enddate, enrollmentrulecode } :
                        { partnercode, tierid, createservicecard, overrideduplicate, updatecustomerdata, active, startdate, enddate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.enrollmentrule.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.enrollmentrule.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.closeModalSuccess();
                    } else Alert.error(responsemessage);

                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    onChangeMembership = (membershipid) => {
        let criteria = { membershipid };
        this.componentTierSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ tierid: undefined });
        let tierfielddisabled = (membershipid) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, tierfielddisabled } });
    }

    render() {
        const { partnercode, active } = this.props;
        const { actionspage } = this.state;
        const { generalfielddisabled, specialfielddisabled, tierfielddisabled } = this.state.fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        return (
            <Row>
                <Spin spinning={this.state.loading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" defaultValue={partnercode} disabled />
                                <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Membership" datafield="membershipid" validationrules={['required']} onChange={this.onChangeMembership} disabled={generalfielddisabled} />
                                <TierSelect ref={(e) => { this.componentTierSelect = e }} form={this.props.form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={tierfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Create Service Card" datafield="createservicecard" defaultChecked={false} disabled={generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Override Duplicate" datafield="overrideduplicate" defaultChecked={false} disabled={generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Update Customer Data" datafield="updatecustomerdata" defaultChecked={false} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment(new Date())} disabled={generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Active" datafield="active" defaultChecked={false} disabled={specialfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create') ?
                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS"></Button>
                                    : (actionspage === 'update' && active) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                        : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));