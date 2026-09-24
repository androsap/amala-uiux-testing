import React, { Component } from 'react';
import { SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, DateRangeBase, CodeshareByAirlineSelect, Button, Alert, SwitchButton } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

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
                airlinecode: (props.airlinecode) ? props.airlinecode : null,
                ruletype: (props.ruletype) ? props.ruletype : null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.ruledetail.bcruledetailid;
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
                const { ruletype, airlinecode } = this.state.fieldvalue;
                if (ruletype === 'CODESHARE') {
                    this.componentCodeshareSelect.retrieveData({ airlinecode });
                }
            }
        }
    }

    componentDidMount() {
        const { actionsdetailpage } = this.props;

        if (actionsdetailpage === 'create') {

        } else if (actionsdetailpage === 'update') {
            this.getDetail();
        }
        // this.checkPermission();
        const { ruletype, airlinecode } = this.state.fieldvalue;
        if (ruletype === 'CODESHARE') {
            this.componentCodeshareSelect.retrieveData({ airlinecode });
        }
    }

    getDetail = () => {
        const { ruledetail, ruletype } = this.props;
        let awardmilesfactor = (ruledetail.awardmilesfactor !== undefined) ? Math.round(ruledetail.awardmilesfactor * 100).toString() : undefined;
        let tiermilesfactor = (ruledetail.tiermilesfactor !== undefined) ? Math.round(ruledetail.tiermilesfactor * 100).toString() : undefined;
        let minawardmiles = (ruledetail.minawardmiles !== undefined) ? ruledetail.minawardmiles.toString() : undefined;
        let mintiermiles = (ruledetail.mintiermiles !== undefined) ? ruledetail.mintiermiles.toString() : undefined;
        let frequency = (ruledetail.frequency !== undefined) ? ruledetail.frequency.toString() : undefined;
        let effectivedate = (ruledetail.effectivedate) ? moment(ruledetail.effectivedate) : null;
        let discontinuedate = (ruledetail.discontinuedate) ? moment(ruledetail.discontinuedate) : null;
        let date = [effectivedate, discontinuedate];
        let usebrandedfare = (ruledetail.usebrandedfare !== undefined) ? ruledetail.usebrandedfare : false;

        let setValue = { awardmilesfactor, tiermilesfactor, minawardmiles, mintiermiles, frequency, date, usebrandedfare };
        if (ruletype === 'CODESHARE') {
            setValue.codeshareid = (ruledetail.codeshare.codeshareid) ? ruledetail.codeshare.codeshareid : null;
        }
        this.props.form.setFieldsValue(setValue);
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage, actionsdetailpage, ruletype, ruledetail, bcruleheaderid, bcruledetailid } = this.props;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                if (ruletype === 'CODESHARE') {
                    let optionsCodeshare = this.componentCodeshareSelect.state.options;
                    input.codeshare = {};
                    input.codeshare = optionsCodeshare.filter(obj => obj.value === input.codeshareid)[0];
                    input.codeshare.codeshareid = (ruletype === 'CODESHARE') ? input.codeshareid : null;
                    input.codeshare.active = true;
                } else input.active = true;

                input.basemiles = (input.awardmilesfactor > 100) ? 1 : input.awardmilesfactor / 100;
                input.classofservicebonus = (input.awardmilesfactor > 100) ? (input.awardmilesfactor - 100) / 100 : 0;
                input.awardmilesfactor = parseInt(input.awardmilesfactor, 0) / 100;
                input.tiermilesfactor = parseInt(input.tiermilesfactor, 0) / 100;
                input.frequency = parseInt(input.frequency, 0);
                input.minawardmiles = parseInt(input.minawardmiles, 0);
                input.mintiermiles = parseInt(input.mintiermiles, 0);
                input.effectivedate = (input.date[0]) ? moment(input.date[0]).format('YYYY-MM-DD') : null;
                input.discontinuedate = (input.date[1]) ? moment(input.date[1]).format('YYYY-MM-DD') : null;
                input.usebrandedfare = (input.usebrandedfare) ? true : false;

                if (actionspage === 'create') {
                    // input = (actionsdetailpage === 'update') ? { ...ruledetail, ...input } : input;
                    this.props.saveBCRule(input);
                    this.setState({ isLoading: false });
                    this.props.handleClose();
                } else if (actionspage === 'update') {
                    input.bcruleheaderid = bcruleheaderid;
                    input.ruletype = ruletype;
                    input = { ...ruledetail, ...input };
                    // input.codeshare = {};
                    // input.codeshare.codeshareid = null;

                    let message = '';
                    let data = [];
                    let url = '';
                    if (actionsdetailpage === 'create') {
                        url = api.url.accrualrulebc.adddetail;
                    } else {
                        url = api.url.accrualrulebc.updatedetail;
                        input.bcruledetailid = bcruledetailid;
                    }

                    data.push(input);
                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);
                            this.props.handleClose();
                            this.props.refresh(bcruleheaderid, actionspage);
                        } else {
                            Alert.error(responsemessage);
                        }
                        //hide loader
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
        /*if (actionspage === 'create') {
            this.props.form.validateFieldsAndScroll((err, input) => {
                input = (actionsdetailpage === 'update') ? { ...ruledetail, ...input } : input;

                input.awardmilesfactor = input.awardmilesfactor;
                input.tiermilesfactor = input.tiermilesfactor;
                input.basemiles = (input.awardmilesfactor > 100) ? 1 : input.awardmilesfactor / 100;
                input.classofservicebonus = (input.awardmilesfactor > 100) ? (input.awardmilesfactor - 100) / 100 : 0;
                input.frequency = parseInt(input.frequency, 0);
                input.minawardmiles = parseInt(input.minawardmiles, 0);
                input.mintiermiles = parseInt(input.mintiermiles, 0);
                input.effectivedate = (input.date[0]) ? moment(input.date[0]).format('YYYY-MM-DD') : null;
                input.discontinuedate = (input.date[1]) ? moment(input.date[1]).format('YYYY-MM-DD') : null;

                this.props.saveBCRule(input);
                this.props.handleClose();
            });
        } else if (actionspage === 'update') {
            this.props.form.validateFieldsAndScroll((err, input) => {
                console.log("input", input)
                if (!err) {
                    input.awardmilesfactor = parseInt(input.awardmilesfactor) / 100;
                    input.tiermilesfactor = parseInt(input.tiermilesfactor) / 100;
                    input.basemiles = (input.awardmilesfactor > 100) ? 1 : input.awardmilesfactor / 100;
                    input.classofservicebonus = (input.awardmilesfactor > 100) ? (input.awardmilesfactor - 100) / 100 : 0;
                    input.frequency = parseInt(input.frequency, 0);
                    input.minawardmiles = parseInt(input.minawardmiles, 0);
                    input.mintiermiles = parseInt(input.mintiermiles, 0);
                    input.effectivedate = (input.date[0]) ? moment(input.date[0]).format('YYYY-MM-DD') : null;
                    input.discontinuedate = (input.date[1]) ? moment(input.date[1]).format('YYYY-MM-DD') : null;

                    console.log("input", input)
                }
            });
            const { bcruleheaderid, bcruledetailid, actionsdetailpage } = this.props;
            console.log("call update detail", actionsdetailpage, bcruleheaderid, bcruledetailid)
        }*/
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { actionspage, formrender } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { ruletype } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 3 }} xl={{ span: 16, offset: 3 }}>
                                    {
                                        (ruletype === 'CODESHARE') ?
                                            <CodeshareByAirlineSelect ref={(e) => { this.componentCodeshareSelect = e }} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Codeshare" datafield="codeshareid" validationrules={['required']} criteria={{ active: true }} disabled={generalfielddisabled} />
                                            : null
                                    }
                                    <InputText labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Award Miles Factor" datafield="awardmilesfactor" validationrules={['required', 'pattern.number', 'max.10',]} maxLength={10} suffix="%" disabled={generalfielddisabled} />
                                    <InputText labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Tier Miles Factor" datafield="tiermilesfactor" validationrules={['required', 'pattern.number', 'max.10',]} maxLength={10} suffix="%" disabled={generalfielddisabled} />
                                    <InputText labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Minimum Award Miles" datafield="minawardmiles" validationrules={['required', 'pattern.number', 'max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Minimum Tier Miles" datafield="mintiermiles" validationrules={['required', 'pattern.number', 'max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Frequency" datafield="frequency" validationrules={['required', 'pattern.number', 'max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                    <DateRangeBase labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                    {
                                        (ruletype !== 'CODESHARE') ?
                                            <SwitchButton labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={this.props.form} labeltext="Use Branded Fare" datafield="usebrandedfare" disabled={generalfielddisabled} />
                                            : null
                                    }
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                            : null
                                } &nbsp;
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