import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { PartnerSelect, DateRangeBase, InputNumberRange, SwitchButton, Button, Alert } from '../../components/Base/BaseComponent';
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
            fieldvalue: {
                earningmilesid: null,
                active: true
            },
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
                this.componentPartnerSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (earningmilesid, actionspage) => {
        let url = api.url.earningmiles.list;
        let criteria = { earningmilesid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let earningmilesid = (result[0].earningmilesid) ? result[0].earningmilesid : null;
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : null;
                    let partnername = (result[0].partnername) ? result[0].partnername : null;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let minmiles = (result[0].minmiles) ? result[0].minmiles : 0;
                    let maxmiles = (result[0].maxmiles) ? result[0].maxmiles : 0;
                    let miles = { min: minmiles, max: maxmiles };
                    let partnersupplies = result[0].partnersupplies ? result[0].partnersupplies : false;
                    let schedulevalidation = result[0].schedulevalidation ? result[0].schedulevalidation : false;
                    let promotioncodevalidation = result[0].promotioncodevalidation ? result[0].promotioncodevalidation : false;
                    let retroverification = result[0].retroverification ? result[0].retroverification : false;
                    let duplicateactivitycheck = result[0].duplicateactivitycheck ? result[0].duplicateactivitycheck : false;
                    let namecheck = result[0].namecheck ? result[0].namecheck : false;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { partnercode, date, miles, partnersupplies, schedulevalidation, promotioncodevalidation, retroverification, duplicateactivitycheck, namecheck };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { earningmilesid, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    // //load options select2
                    this.componentPartnerSelect.retrieveData({}, { partnercode, partnername }, actionspage);
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
        this.props.form.validateFields((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let partnercode = input.partnercode;
                let partnername = input.partnername;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let minmiles = input.miles.min;
                let maxmiles = input.miles.max;
                let partnersupplies = (input.partnersupplies !== undefined) ? input.partnersupplies : false;
                let schedulevalidation = (input.schedulevalidation !== undefined) ? input.schedulevalidation : false;
                let promotioncodevalidation = (input.promotioncodevalidation !== undefined) ? input.promotioncodevalidation : false;
                let retroverification = (input.retroverification !== undefined) ? input.retroverification : false;
                let duplicateactivitycheck = (input.duplicateactivitycheck !== undefined) ? input.duplicateactivitycheck : false;
                let namecheck = (input.namecheck !== undefined) ? input.namecheck : false;

                let data = { partnercode, partnername, minmiles, maxmiles, effectivedate, discontinuedate, partnersupplies, schedulevalidation, promotioncodevalidation, retroverification, duplicateactivitycheck, namecheck };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.earningmiles.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.earningmiles.update;
                    data.earningmilesid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/earning-miles');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    deleteData(earningmilesid, active) {
        let url = (active) ? api.url.earningmiles.deactivate : api.url.earningmiles.activate;
        let data = { earningmilesid };
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
        DeleteRequest(url, data, callback, active);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const { earningmilesid, active } = this.state.fieldvalue;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Earning Miles | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Earning Miles</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} disabled={generalfielddisabled} custom={true}/>
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment(new Date()).add(1, 'day')} disabled={generalfielddisabled} />
                                    <InputNumberRange form={this.props.form} labeltext="Miles" datafield='miles' validationrules={['required', 'max.45']} maxLength="45" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Partner Supplies" datafield="partnersupplies" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Schedule Validation" datafield="schedulevalidation" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Promotion Code Validation" datafield="promotioncodevalidation" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Retro Verification" datafield="retroverification" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Duplicate Activity Check" datafield="duplicateactivitycheck" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Name Check" datafield="namecheck" disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && active) ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (active) ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(earningmilesid, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(earningmilesid, active)} /> : ""
                                }
                                <Button url="/earning-miles" htmlType="link" type="default" label="Back" />
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