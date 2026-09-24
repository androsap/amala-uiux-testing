import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Alert, Button, DateRangeBase, CompartmentSelect, SubclassSelect, AirlineSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'SUCLSMAP';
const menucode = 'SUCLSMAP';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
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
                marketingsubclassfielddisabled: true,
                operatingsubclassfielddisabled: true
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
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !this.props.active) {
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
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentMarCompartmentSelect.retrieveData({ airlinecode: this.props.marketingairline });
                this.componentOprCompartmentSelect.retrieveData({ airlinecode: this.props.operatingairline });
                this.componentOprAirlineSelect.retrieveData({ isoperating: true });
                this.componentMarketingAirlineSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (subclassmappingcode, actionspage) => {
        let url = api.url.subclassmapping.list;
        let criteria = { subclassmappingcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let marketingairline = (result[0].marketingairline) ? result[0].marketingairline : null;
                    let marketingairlinename = (result[0].marketingairlinename) ? result[0].marketingairlinename : null;
                    let marketingcompartment = (result[0].marketingcompartment) ? result[0].marketingcompartment : null;
                    let marketingsubclass = (result[0].marketingsubclass) ? result[0].marketingsubclass : null;
                    let operatingairline = (result[0].operatingairline) ? result[0].operatingairline : null;
                    let operatingairlinename = (result[0].operatingairlinename) ? result[0].operatingairlinename : null;
                    let operatingcompartment = (result[0].operatingcompartment) ? result[0].operatingcompartment : null;
                    let operatingsubclass = (result[0].operatingsubclass) ? result[0].operatingsubclass : null;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];

                    let setValue = { marketingairline, marketingcompartment, marketingsubclass, operatingairline, operatingcompartment, operatingsubclass, date };
                    this.props.form.setFieldsValue(setValue);

                    this.componentMarketingAirlineSelect.retrieveData();
                    this.componentOprAirlineSelect.retrieveData({ isoperating: true });
                    this.componentMarCompartmentSelect.retrieveData({ airlinecode: marketingairline }, { airlinecode: marketingairline, airlinename: marketingairlinename }, actionspage);
                    this.componentOprCompartmentSelect.retrieveData({ airlinecode: operatingairline }, { airlinecode: operatingairline, airlinename: operatingairlinename }, actionspage);
                    this.componentMarSubclassSelect.retrieveData({ airlinecode: marketingairline, compartmentcode: marketingcompartment });
                    this.componentOprSubclassSelect.retrieveData({ airlinecode: operatingairline, compartmentcode: operatingcompartment });

                    let marketingsubclassfielddisabled = (actionspage !== 'view') ? false : true;
                    let operatingsubclassfielddisabled = (actionspage !== 'view') ? false : true;
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, marketingsubclassfielddisabled, operatingsubclassfielddisabled } });
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
                let codeshareid = this.props.codeshareid;
                let marketingairline = this.props.marketingairline;
                let marketingcompartment = input.marketingcompartment;
                let marketingsubclass = input.marketingsubclass;
                let operatingairline = input.operatingairline;
                let operatingcompartment = input.operatingcompartment;
                let operatingsubclass = input.operatingsubclass;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let request = { codeshareid, marketingairline, marketingcompartment, marketingsubclass, operatingairline, operatingcompartment, operatingsubclass, effectivedate, discontinuedate };
                let message = '';
                let url = '';
                let data = [];
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.subclassmapping.create;
                    data.push(request);
                } else {
                    message = 'Data has been updated';
                    url = api.url.subclassmapping.update;
                    request.subclassmappingcode = this.props.subclassmappingcode;
                    data = request;
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
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    onChangeMarketingCompartment = (compartmentcode) => {
        let criteria = { compartmentcode, airlinecode: this.props.marketingairline };
        this.componentMarSubclassSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ marketingsubclass: undefined });
        let marketingsubclassfielddisabled = (compartmentcode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, marketingsubclassfielddisabled } });
    }

    onChangeOperatingCompartment = (compartmentcode) => {
        let criteria = { compartmentcode, airlinecode: this.props.operatingairline };
        this.componentOprSubclassSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ operatingsubclass: undefined });
        let operatingsubclassfielddisabled = (compartmentcode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, operatingsubclassfielddisabled } });
    }

    render() {
        const { actionspage } = this.state;
        const { generalfielddisabled, marketingsubclassfielddisabled, operatingsubclassfielddisabled } = this.state.fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                {/* <InputText form={this.props.form} labeltext="Marketing Airline" datafield='marketingairline' defaultValue={this.props.marketingairline} disabled /> */}
                                <AirlineSelect ref={(e) => { this.componentMarketingAirlineSelect = e }} form={this.props.form} labeltext="Marketing Airline" datafield="marketingairline" validationrules={['required']} defaultValue={this.props.marketingairline} disabled />
                                <CompartmentSelect ref={(e) => { this.componentMarCompartmentSelect = e }} form={this.props.form} labeltext="Marketing Compartment" datafield="marketingcompartment" validationrules={['required']} onChange={this.onChangeMarketingCompartment} disabled={generalfielddisabled} />
                                <SubclassSelect ref={(e) => { this.componentMarSubclassSelect = e }} form={this.props.form} labeltext="Marketing Subclass" datafield="marketingsubclass" validationrules={['required']} disabled={marketingsubclassfielddisabled} />

                                <AirlineSelect ref={(e) => { this.componentOprAirlineSelect = e }} form={this.props.form} labeltext="Operating Airline" datafield="operatingairline" validationrules={['required']} defaultValue={this.props.operatingairline} disabled />
                                <CompartmentSelect ref={(e) => { this.componentOprCompartmentSelect = e }} form={this.props.form} labeltext="Operating Compartment" datafield="operatingcompartment" validationrules={['required']} onChange={this.onChangeOperatingCompartment} disabled={generalfielddisabled} />
                                <SubclassSelect ref={(e) => { this.componentOprSubclassSelect = e }} form={this.props.form} labeltext="Operating Subclass" datafield="operatingsubclass" validationrules={['required']} disabled={operatingsubclassfielddisabled} />

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