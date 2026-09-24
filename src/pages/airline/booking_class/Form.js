import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputText, DateRangeBase, SwitchButton, CompartmentSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'COMPART';
const menucode = 'COMPART';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                airportiatacode: null,
                active: true
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
        this.closeAndRefresh = React.createRef();
    }

    checkPermission() {
        let id = this.props.subclasscode;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !this.props.active) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentCompartmentSelect.retrieveData({ airlinecode: this.props.airlinecode });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (subclasscode) => {
        let airlinecode = this.props.airlinecode;
        let compartmentcode = this.props.compartmentcode;
        let url = api.url.subclass.list;
        let criteria = { airlinecode, compartmentcode, subclasscode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let airlinecode = (result[0].airlinecode) ? result[0].airlinecode : undefined;
                    let compartmentcode = (result[0].compartmentcode) ? result[0].compartmentcode : null;
                    let subclasscode = (result[0].subclasscode) ? result[0].subclasscode : null;
                    let subclassrank = (result[0].subclassrank !== undefined) ? result[0].subclassrank.toString() : undefined;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let earnmiles = result[0].earnmiles ? result[0].earnmiles : false;
                    let spendmiles = result[0].spendmiles ? result[0].spendmiles : false;
                    let upgradebymiles = result[0].upgradebymiles ? result[0].upgradebymiles : false;
                    let upgradeclass = result[0].upgradeclass ? result[0].upgradeclass : false;

                    let setValue = { airlinecode, compartmentcode, subclasscode, subclassrank, date, earnmiles, spendmiles, upgradebymiles, upgradeclass };
                    this.props.form.setFieldsValue(setValue);
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
                let airlinecode = this.props.airlinecode;
                let compartmentcode = input.compartmentcode;
                let subclasscode = input.subclasscode.toUpperCase();
                let subclassrank = input.subclassrank;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let earnmiles = (input.earnmiles) ? input.earnmiles : false;
                let spendmiles = (input.spendmiles) ? input.spendmiles : false;
                let upgradebymiles = (input.upgradebymiles) ? input.upgradebymiles : false;
                let upgradeclass = (input.upgradeclass) ? input.upgradeclass : false;

                let data = { airlinecode, compartmentcode, subclasscode, subclassrank, effectivedate, discontinuedate, earnmiles, spendmiles, upgradebymiles, upgradeclass };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.subclass.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.subclass.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
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

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { actionspage } = this.state;
        const { generalfielddisabled, specialfielddisabled } = this.state.fielddisabled;
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
                                <InputText form={this.props.form} labeltext="Airline Code" datafield={this.props.airlinecode} defaultValue={this.props.airlinecode} disabled />
                                <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" validationrules={['required']} disabled={specialfielddisabled} />
                                <InputText form={this.props.form} labeltext="Subclass" datafield="subclasscode" maxLength={2} validationrules={['required', 'pattern.letter']} disabled={specialfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment(new Date()).add(1, 'day')} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Rank" datafield="subclassrank" maxLength={9} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Earn Miles" datafield="earnmiles" disabled={generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Spend Miles" datafield="spendmiles" disabled={generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Upgrade by Miles" datafield="upgradebymiles" disabled={generalfielddisabled} />
                                <SwitchButton form={this.props.form} labeltext="Upgrade Class" datafield="upgradeclass" disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create' && this.props.active) ?
                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                    : (actionspage === 'update' && this.props.active) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                        : null
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