import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputText, DateRangeBase, CompartmentSelect, SubclassSelect, AirlineSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'SUCLSMAP';
const menucode = 'SUCLSMAP';

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
                specialfielddisabled: false,
                marsubclassdisabled: true,
                oprcompartmentdisabled: true,
                oprsubclassdisabled: true
            }
        }
        this.closeAndRefresh = React.createRef();
    }

    checkPermission() {
        let id = this.props.subclassmappingcode;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentMarCompartmentSelect.retrieveData({ airlinecode: this.props.airlinecode });
                this.componentOprAirlineSelect.retrieveData({ isoperating: true });
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
                    let airlinecode = (result[0].airlinecode) ? result[0].airlinecode : '';
                    let compartmentcode = (result[0].compartmentcode) ? result[0].compartmentcode : null;
                    let subclasscode = (result[0].subclasscode) ? result[0].subclasscode : '';
                    let subclassrank = (result[0].subclassrank) ? result[0].subclassrank : '';
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
                let marketingairline = this.props.airlinecode;
                let marketingcompartment = input.marketingcompartment;
                let marketingsubclass = input.marketingsubclass;
                let operatingairline = input.operatingairline;
                let operatingcompartment = input.operatingcompartment;
                let operatingsubclass = input.operatingsubclass;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let data = { marketingairline, marketingcompartment, marketingsubclass, operatingairline, operatingcompartment, operatingsubclass, effectivedate, discontinuedate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.subclassmapping.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.subclassmapping.update;
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

    onChangeMarCompartment = (compartmentcode) => {
        let criteria = { compartmentcode, airlinecode: this.props.airlinecode };
        this.componentMarSubclassSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ marketingsubclass: undefined });
        let marsubclassdisabled = (compartmentcode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, marsubclassdisabled } });
    }

    onChangeOprAirline = (airlinecode) => {
        let criteria = { airlinecode };
        this.componentOprCompartmentSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ operatingcompartment: undefined, operatingsubclass: undefined });
        let oprcompartmentdisabled = (airlinecode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, oprcompartmentdisabled } });
    }

    onChangeOprCompartment = (compartmentcode) => {
        let criteria = { compartmentcode, airlinecode: this.props.airlinecode };
        this.componentOprSubclassSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ operatingsubclass: undefined });
        let oprsubclassdisabled = (compartmentcode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, oprsubclassdisabled } });
    }

    render() {
        const { actionspage } = this.state;
        const { generalfielddisabled, specialfielddisabled, marsubclassdisabled, oprcompartmentdisabled, oprsubclassdisabled } = this.state.fielddisabled;
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
                                <InputText form={this.props.form} labeltext="Marketing Airline" datafield={this.props.airlinecode} defaultValue={this.props.airlinecode} disabled />
                                <CompartmentSelect ref={(e) => { this.componentMarCompartmentSelect = e }} form={this.props.form} labeltext="Marketing Compartment" datafield="marketingcompartment" validationrules={['required']} onChange={this.onChangeMarCompartment} disabled={specialfielddisabled} />
                                <SubclassSelect ref={(e) => { this.componentMarSubclassSelect = e }} form={this.props.form} labeltext="Marketing Subclass" datafield="marketingsubclass" validationrules={['required']} disabled={marsubclassdisabled} />
                                <AirlineSelect ref={(e) => { this.componentOprAirlineSelect = e }} form={this.props.form} labeltext="Operating Airline" datafield="operatingselect" validationrules={['required']} onChange={this.onChangeOprAirline} disabled={specialfielddisabled} />
                                <CompartmentSelect ref={(e) => { this.componentOprCompartmentSelect = e }} form={this.props.form} labeltext="Operating Compartment" datafield="operatingcompartment" validationrules={['required']} onChange={this.onChangeOprCompartment} disabled={oprcompartmentdisabled} />
                                <SubclassSelect ref={(e) => { this.componentOprSubclassSelect = e }} form={this.props.form} labeltext="Operating Subclass" datafield="operatingsubclass" validationrules={['required']} disabled={oprsubclassdisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment()} disabled={generalfielddisabled} />
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