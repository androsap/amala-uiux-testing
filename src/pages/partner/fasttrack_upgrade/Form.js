import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { Alert, InputText, Button, CobrandSelect, TierSelect, ActivityCodeSelect, DateRangeBase, SwitchButton, DatePickerBase, SelectBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'BUYMILCT';
const menucode = 'BUYMILCT';

const optionsPeriod = [
    { value: 'day', label: 'Day(s)' },
    { value: 'month', label: 'Month(s)' },
    { value: 'year', label: 'Year(s)' }
]

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
            fieldvalue: {
                fasttrackupgradecode: null,
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.fasttrackupgradecode;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !this.props.activepartner || !this.props.activecobrand) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
            this.props.setTitlePage(titlepage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentCobrandSelect.retrieveData();
                this.componentTierCurrentSelect.retrieveData();
                this.componentTierUpgradeSelect.retrieveData();
                this.componentActivityCodeSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (fasttrackupgradecode, actionspage) => {
        let url = api.url.cobrandfasttrack.list;
        let criteria = { fasttrackupgradecode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria, {}, [], {}).then((response) => {
            const { status, result } = response;
            const { responsecode } = status || {};
            if (responsecode === '0000') {
                const { cobrandcode, tiercurrent, tiernamecurrent, tierupgrade, tiernameupgrade, minimumearnedmiles,
                    duration, period, startdate, enddate, active } = result[0];
                let date = [moment(startdate), moment(enddate)];
                let eligibleactivitycode = (result[0].eligibleactivitycode.length) ? result[0].eligibleactivitycode.map(obj => { return obj.activitycode }) : [];
                let generalfielddisabled = (actionspage !== "view") ? !active : true;

                let setValue = {
                    cobrandcode, tiercurrent, tiernamecurrent, tierupgrade, tiernameupgrade, minimumearnedmiles,
                    duration, period, date, eligibleactivitycode
                };
                this.props.form.setFieldsValue(setValue);
                let fieldvalue = { ...this.state.fieldvalue, fasttrackupgradecode, active };
                let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                this.setState({ fieldvalue, fielddisabled });

                this.componentCobrandSelect.retrieveData();
                this.componentTierCurrentSelect.retrieveData();
                this.componentTierUpgradeSelect.retrieveData();
                this.componentActivityCodeSelect.retrieveData();
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
                const { cobrandcode, tiercurrent, tiernamecurrent, tierupgrade, tiernameupgrade, minimumearnedmiles,
                    duration, period, date, eligibleactivitycode } = input;
                let startdate = (date) ? moment(date[0]).format("YYYY-MM-DD") : null;
                let enddate = (date) ? moment(date[1]).format("YYYY-MM-DD") : null;

                let selectedActivityCode = [];
                for (const field in eligibleactivitycode) {
                    selectedActivityCode[field] = { activitycode: eligibleactivitycode[field] };
                }

                let data = {
                    cobrandcode, tiercurrent, tiernamecurrent, tierupgrade, tiernameupgrade, minimumearnedmiles,
                    duration, period, startdate, enddate, eligibleactivitycode: selectedActivityCode
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.cobrandfasttrack.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.cobrandfasttrack.update;
                    data.fasttrackupgradecode = this.props.fasttrackupgradecode;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.closemodalrefresh();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    onChangeMembershipType = (membershiptypeid) => {
        let membershipfielddisabled = (membershiptypeid) ? false : true;
        let membershipid = undefined;
        let tierfielddisabled = true;
        let tierid = undefined;

        this.setState({ fielddisabled: { ...this.state.fielddisabled, membershipfielddisabled, tierfielddisabled } });
        this.props.form.setFieldsValue({ membershipid, tierid });
        this.componentMembershipSelect.retrieveData({ membershiptypeid });
    }

    deleteData(fasttrackupgradecode, active) {
        let url = (active) ? api.url.cobrandfasttrack.deactivate : api.url.cobrandfasttrack.activate;
        let data = { fasttrackupgradecode };
        var callback = (response) => {
            const { status = {} } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
                this.props.closemodalrefresh();
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
        const { titlepage, actionspage, formrender } = this.state;
        const { fasttrackupgradecode, active } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { prefixmenuname, cobrandcode, activepartner, activecobrand } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Fast Track Upgrade | Loyalty Management System";
            //render form
            return (
                <Spin spinning={this.state.loading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <CobrandSelect ref={(e) => { this.componentCobrandSelect = e }} form={this.props.form} labeltext="Cobrand" datafield="cobrandcode" validationrules={['required']} defaultValue={cobrandcode} disabled={true} />
                                <TierSelect ref={(e) => { this.componentTierCurrentSelect = e }} form={this.props.form} labeltext="Tier" datafield="tiercurrent" validationrules={['required']} disabled={generalfielddisabled} />
                                <TierSelect ref={(e) => { this.componentTierUpgradeSelect = e }} form={this.props.form} labeltext="Tier Upgrade" datafield="tierupgrade" validationrules={['required']} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment().add(1, 'days')} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Min. Earned Miles" datafield="minimumearnedmiles" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                <Row>
                                    <Col xl={12} md={12} sm={12}>
                                        <InputText labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} form={this.props.form} labeltext="Duration" datafield="duration" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                     </Col>
                                    <Col xl={12} md={12} sm={12}>
                                        <SelectBase wrapperCol={{ span: 24 }} form={this.props.form} placeholder="Period" datafield="period" options={optionsPeriod} disabled={generalfielddisabled} />
                                    </Col>
                                </Row>
                                <ActivityCodeSelect ref={(e) => { this.componentActivityCodeSelect = e }} form={this.props.form} mode="multiple" labeltext="Activity Code" datafield="eligibleactivitycode" validationrules={['required']} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage !== 'view' && activepartner && active) ?
                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={(actionspage === 'create') ? "CREATE" : "UPDATE"}></Button>
                                    : null
                            }
                            {
                                (actionspage !== 'create' && activecobrand) ?
                                    (active) ?
                                        <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(fasttrackupgradecode, active)} /> :
                                        <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(fasttrackupgradecode, active)} /> : ""
                            }
                        </Row>
                    </Form>
                </Spin>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));