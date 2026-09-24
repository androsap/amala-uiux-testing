import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, TierSelect, CustomTransactionSelect, SwitchButton, ChannelSelect, PromoCompletionSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

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
                specifictype: null,
                tiercompletionbonusid: null,
                status: 'active'
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                updatechanneldisabled: false
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
                this.componentPromoCompletionSelect.retrieveData();
                this.componentChannelSelect.retrieveData({});
                this.componentTierSelect.retrieveData();
                this.componentCustomTransactionSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (tiercompletionbonusid, actionspage) => {
        let url = api.url.tiercompletionbonus.list;
        let criteria = { tiercompletionbonusid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status = {}, result } = response || {};
            const { promocompletionid, tierid, tiername, updatechannel, channelapplicationid, customtrxcode, customtrxname, awardmiles, tiermiles, frequency } = result[0] || {};
            if (status.responsecode === "0000") {
                let splitupdatechannel = updatechannel.split(',');
                let allchannel = (updatechannel === "ALL") ? true : false;
                let status = result[0].status ? result[0].status : null;
                awardmiles ? awardmiles.toString() : 0;
                tiermiles ? tiermiles.toString() : 0;
                frequency ? frequency.toString() : 0;

                let generalfielddisabled = (actionspage !== "view") ? status === 'inactive' : true;
                let updatechanneldisabled = (actionspage !== 'view') ? (updatechannel) && status === 'active' && allchannel === false ? false : true : true;

                let setValue = { promocompletionid, tierid, splitupdatechannel, updatechannel: (updatechannel === 'ALL') ? undefined : splitupdatechannel, allchannel, customtrxcode, tiermiles, awardmiles, frequency, status };
                this.props.form.setFieldsValue(setValue);
                let fieldvalue = { tiercompletionbonusid, status };
                let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, updatechanneldisabled };
                this.setState({ fieldvalue, fielddisabled });

                this.componentPromoCompletionSelect.retrieveData({}, { promocompletionid }, actionspage);
                this.componentChannelSelect.retrieveData({}, { channelapplicationid }, actionspage);
                this.componentTierSelect.retrieveData({}, { tierid, tiername }, actionspage);
                this.componentCustomTransactionSelect.retrieveData({}, { customtrxcode, customtrxname }, actionspage);
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
                const { promocompletionid, tierid, updatechannel, customtrxcode, awardmiles, tiermiles, frequency } = input || {};
                let allchannel = (input.allchannel) ? true : false;
                let data = { promocompletionid, tierid, customtrxcode, awardmiles, tiermiles, frequency, updatechannel: allchannel ? ['ALL'] : updatechannel, allchannel };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.tiercompletionbonus.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.tiercompletionbonus.update;
                    data.tiercompletionbonusid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.goBack();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleAllChannel = (value) => {
        let updatechanneldisabled = value;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, updatechanneldisabled } });
        this.props.form.setFieldsValue({ updatechannel: undefined });
    }

    deleteData(tiercompletionbonusid, status) {
        let url = (status === 'inactive') ? api.url.tiercompletionbonus.activate : api.url.tiercompletionbonus.deactivate;
        let data = { tiercompletionbonusid };
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
        DeleteRequest(url, data, callback, status === 'active');
    }

    render() {
        const { menucode, prefixmenuname, form } = this.props;
        const { titlepage, actionspage, formrender, isLoading } = this.state;
        const { generalfielddisabled, updatechanneldisabled } = this.state.fielddisabled;
        const { tiercompletionbonusid, status } = this.state.fieldvalue;

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Tier Completion Bonus | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Tier Completion Bonus</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <PromoCompletionSelect ref={(e) => { this.componentPromoCompletionSelect = e }} form={form} labeltext="Promo" datafield="promocompletionid" validationrules={['required']} disabled={true ? actionspage !== 'create' : ""} />
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={form} labeltext="Tier" datafield="tierid" validationrules={['required']} mode={(actionspage === 'create') ? "multiple" : ""} disabled={generalfielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} form={form} labeltext="Custom Transaction" datafield="customtrxcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={form} labeltext="All Channel" datafield="allchannel" onChange={this.handleAllChannel} disabled={generalfielddisabled} />
                                    <ChannelSelect ref={(e) => { this.componentChannelSelect = e }} form={form} labeltext="Update Channel" datafield="updatechannel" validationrules={updatechanneldisabled ? [] : ['required']} mode={"multiple"} disabled={updatechanneldisabled} />
                                    <InputText form={form} labeltext="Award Miles" datafield="awardmiles" validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Tier Miles" datafield="tiermiles" validationrules={['pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext="Frequency" datafield="frequency" validationrules={['pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && status === 'active') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (status === 'active') ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(tiercompletionbonusid, status)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(tiercompletionbonusid, status)} /> : ""
                                }
                                {/* <Button htmlType="button" type="default" label="Back" onClick={() => { this.props.history.goBack() }} /> */}
                                <Button url="/tier-completion-bonus" htmlType="link" type="default" label="Back" />
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
