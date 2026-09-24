import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, RetrieveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputText, SelectBase, DateRangeBase, RadioButton, ActivityCodeSelect, CustomTransactionSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'COBBONUS';
const menucode = 'COBBONUS';

const optionsBonusType = [
    { label: 'CARD ACTIVATION', value: 'CARD_ACTIVATION' },
    { label: 'EARNING', value: 'EARNING' },
    { label: 'RENEWAL', value: 'RENEWAL' }
];
const optionsEarnedType = [
    { label: "ACCUMULATED", value: "ACCUMULATED" },
    { label: "PERMONTH", value: "PERMONTH" }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                cobrandbonuscode: null,
                active: true
            },
            fielddisabled: {
                generalfielddisabled: false
            }
        }
        this.closeAndRefresh = React.createRef();
    }

    checkPermission() {
        let id = this.props.cobrandbonuscode;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !this.props.activepartner || !this.props.activecobrand) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentActivityCodeSelect.retrieveData({ partnercode: this.props.partnercode });
                this.componentEligibleActivityCodeSelect.retrieveData({ partnercode: this.props.partnercode });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (cobrandbonuscode, actionspage) => {
        let url = api.url.cobrandbonus.list;
        let criteria = { cobrandbonuscode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status = {}, result } = response || {};
            const { cobrandbonuscode, bonustype, activitycode, customtrxcode, customtrxname, awardmiles, effectivedate, discontinuedate, bonusrule } = result[0] || {};
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let date = [moment(effectivedate), moment(discontinuedate)];
                    let duration = (bonusrule) ? bonusrule.duration.toString() : '';
                    let minimumearnedtype = (bonusrule) ? bonusrule.minimumearnedtype : null;
                    let minimumearnedmiles = (bonusrule) ? bonusrule.minimumearnedmiles.toString() : '';
                    let listearningactivitycode = (bonusrule) ? bonusrule.listearningactivitycode.map((obj) => { return obj.activitycode }) : [];
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = {
                        bonustype, activitycode, customtrxcode, date, minimumearnedtype, minimumearnedmiles, duration, listearningactivitycode,
                        awardmiles: awardmiles ? awardmiles.toString() : 0,
                    };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { cobrandbonuscode, bonustype, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    if (bonustype === 'EARNING') this.componentCustomTransactionSelect.retrieveData({}, { customtrxcode, customtrxname }, actionspage);
                    else this.componentActivityCodeSelect.retrieveData({ partnercode: this.props.partnercode }, { activitycode }, actionspage);
                    this.componentEligibleActivityCodeSelect.retrieveData({ partnercode: this.props.partnercode }, {}, actionspage);
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
                //define parameter
                let cobrandcode = this.props.cobrandcode;
                let bonustype = input.bonustype;
                let awardmiles = (input.awardmiles !== undefined) ? input.awardmiles : null;
                let activitycode = (input.activitycode) ? input.activitycode : null;
                let customtrxcode = (input.customtrxcode) ? input.customtrxcode : null;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let data = { cobrandcode, bonustype, awardmiles, activitycode, customtrxcode, effectivedate, discontinuedate };

                if (bonustype === 'EARNING') {
                    let minimumearnedtype = input.minimumearnedtype;
                    let minimumearnedmiles = input.minimumearnedmiles;
                    let duration = input.duration;
                    let listearningactivitycode = (input.listearningactivitycode) ? input.listearningactivitycode.map((obj) => { return { activitycode: obj } }) : null;
                    let bonusrule = { minimumearnedtype, minimumearnedmiles, duration, listearningactivitycode };
                    data.bonusrule = bonusrule;
                }

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.cobrandbonus.create;
                } else {
                    data.cobrandbonuscode = this.state.fieldvalue.cobrandbonuscode;
                    message = 'Data has been updated';
                    url = api.url.cobrandbonus.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { status = {} } = response;
                    const { responsecode, responsemessage } = status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.closeModalSuccess();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    }

    deleteData(cobrandbonuscode, active) {
        let url = (active) ? api.url.cobrandbonus.deactivate : api.url.cobrandbonus.activate;
        let data = { cobrandbonuscode };
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

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    onChangeBonusType = async (bonustype) => {
        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, bonustype } });

        await this.props.form.setFieldsValue({
            minimumearnedtype: null, minimumearnedmiles: null, duration: null, listearningactivitycode: []
        });

        if (bonustype === 'EARNING') this.componentCustomTransactionSelect.retrieveData();
        else this.componentActivityCodeSelect.retrieveData({ partnercode: this.props.partnercode });
        this.componentEligibleActivityCodeSelect.retrieveData({ partnercode: this.props.partnercode });
    }

    render() {
        const { form, activepartner, activecobrand } = this.props;
        const { actionspage, loading } = this.state;
        const { cobrandbonuscode, active, bonustype } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        return (
            <Row>
                <Spin spinning={loading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase labeltext="Bonus Type" datafield="bonustype" form={form} options={optionsBonusType} validationrules={['required']} onChange={this.onChangeBonusType} disabled={generalfielddisabled} />
                                <InputText form={form} labeltext="Bonus Miles" datafield="awardmiles" maxLength={11} validationrules={['required', 'pattern.number']} suffix="Miles" disabled={generalfielddisabled} />
                                <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} form={form} labeltext="Custom Transaction" datafield="customtrxcode" disabled={generalfielddisabled}
                                    validationrules={bonustype === 'EARNING' ? ['required'] : []} className={bonustype === 'EARNING' ? '' : 'hidden'} />
                                <ActivityCodeSelect ref={(e) => { this.componentActivityCodeSelect = e }} form={form} labeltext="Activity Code" datafield="activitycode" disabled={generalfielddisabled}
                                    validationrules={bonustype === 'EARNING' ? [] : ['required']} className={bonustype === 'EARNING' ? 'hidden' : ''} />
                                <DateRangeBase form={form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
                                <InputText form={form} labeltext="Status" datafield="active" defaultValue={active ? 'Active' : 'Inactive'} className={(actionspage === 'create') ? 'hidden' : ''} disabled />
                                <RadioButton form={form} labeltext="Min. Earned Type" datafield="minimumearnedtype" options={optionsEarnedType} validationrules={(bonustype === 'EARNING') ? ['required'] : []} disabled={generalfielddisabled} className={(bonustype === 'EARNING') ? '' : 'hidden'} />
                                <InputText form={form} labeltext="Min. Earned Miles" datafield="minimumearnedmiles" maxLength={11} validationrules={(bonustype === 'EARNING') ? ['required', 'pattern.number'] : []} suffix="Miles" disabled={generalfielddisabled} className={(bonustype === 'EARNING') ? '' : 'hidden'} />
                                <InputText form={form} labeltext="Duration" datafield="duration" maxLength={11} validationrules={(bonustype === 'EARNING') ? ['required', 'pattern.number'] : []} suffix="Months" disabled={generalfielddisabled} className={(bonustype === 'EARNING') ? '' : 'hidden'} />
                                <ActivityCodeSelect ref={(e) => { this.componentEligibleActivityCodeSelect = e }} mode="multiple" form={form} labeltext="Eligible Activity Code " datafield="listearningactivitycode" validationrules={(bonustype === 'EARNING') ? ['required'] : []} disabled={generalfielddisabled} className={(bonustype === 'EARNING') ? '' : 'hidden'} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage !== 'view' && activepartner) ?
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && active) ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null : null
                            }
                            {
                                (actionspage !== 'create' && activecobrand) ?
                                    (active) ?
                                        <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(cobrandbonuscode, active)} /> :
                                        <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(cobrandbonuscode, active)} /> : ""
                            }
                            <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));