import React, { Component } from 'react';
import { DetailRequest, RetrieveRequestCustom, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { InputText, Button, Alert, DateRangeBase, RadioButton, SwitchButton, TierSelect, MembershipSelect, BranchSelect, AirlineSelect, CompartmentSelect, SubclassSelect, CityPairOdRuleSelect, SelectBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Switch } from 'antd';
import { PriceCalculation } from '../../../../data';
import ErrorGeneral from '../../../error/ErrorGeneral';
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
                awardcode: this.props.awardcode,
                categorycode: this.props.categorycode,
                pricecalc: null,
                airlinecode: null,
                alltier: false,
                allmembership: false,
                allbranch: false,
                DistanceRange: []
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                eligibletierfielddisabled: false,
                eligiblebranchfielddisabled: false,
                eligibletypefielddisabled: false,
                airlinecodefielddisabled: (this.props.categorycode === 'FREEFLIGHT') ? false : true,
                compartmentcodefielddisabled: true,
                subclasscodefielddisabled: true,
                paidairlinecodefielddisabled: false,
                paidcompartmentcodefielddisabled: true,
                paidsubclasscodefielddisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.pricederivedcode;
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
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentTierSelect.retrieveData();
                this.componentTypeSelect.retrieveData();
                this.componentBranchSelect.retrieveData();
                this.componentAirlineSelect.retrieveData();
                this.componentPaidAirlineSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = async (pricederivedcode, actionspage) => {
        let url = api.url.awardprice3.detail;
        let data = { pricederivedcode };
        //call loader
        await this.setState({ isLoading: true });
        await DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                const { createreturncitypair } = result || {};

                let startdate = (result.startdate) ? moment(result.startdate) : null;
                let enddate = (result.enddate) ? moment(result.enddate) : null;
                let date = [startdate, enddate];
                let airlinecode = (result.airlinecode) ? result.airlinecode : null;
                let airlinename = (result.airlinename) ? result.airlinename : null;
                let compartmentcode = (result.compartmentcode) ? result.compartmentcode : null;
                let compartmentname = (result.compartmentname) ? result.compartmentname : null;
                let subclasscode = (result.bookingclasscode) ? result.bookingclasscode : null;
                let subclassname = (result.bookingclassname) ? result.bookingclassname : null;
                let onewaypricelow = (result.onewaypricelow) ? result.onewaypricelow.toString() : undefined;
                let onewaypricepeak = (result.onewaypricepeak) ? result.onewaypricepeak.toString() : undefined;
                let feeder = false;
                let alltier = (result.alltier) ? result.alltier : false;
                let allmembership = (result.allmembership) ? result.allmembership : false;
                let allbranch = (result.allbranch) ? result.allbranch : false;
                let pricecalc = (result.pricecalc) ? result.pricecalc : null;
                let distancerangecode = (result.distancerangecode) ? result.distancerangecode : null;
                let distancerangename = (result.distancerangename) ? result.distancerangename : null;
                let destoriginairport = (result.destoriginairport) ? `${result.airlinecode}${result.origin}${result.destination}` : null;

                let paidairlinecode = (result.paidairlinecode !== undefined) ? result.paidairlinecode : null;
                let paidairlinename = (result.paidairlinename !== undefined) ? result.paidairlinename : null;
                let paidcompartmentcode = (result.paidcompartmentcode !== undefined) ? result.paidcompartmentcode : null;
                let paidcompartmentname = (result.paidcompartmentname !== undefined) ? result.paidcompartmentname : null;
                let paidsubclasscode = (result.paidbookingclasscode !== undefined) ? result.paidbookingclasscode : null;
                let paidsubclassname = (result.paidbookingclassname !== undefined) ? result.paidbookingclassname : null;
                let rankpaidcompartment = (result.rankpaidcompartment !== undefined) ? result.rankpaidcompartment : null;

                let eligibletier = (result.eligibletier) ? result.eligibletier.map((obj, key) => { return obj.tierid }) : [];
                let eligiblebranch = (result.eligiblebranch) ? result.eligiblebranch.map((obj, key) => { return obj.branchcode }) : [];
                let eligibletype = (result.eligibletype) ? result.eligibletype.map((obj, key) => { return obj.membershipid }) : [];

                let eligibletierfielddisabled = (actionspage !== 'view') ? alltier : true;
                let eligibletypefielddisabled = (actionspage !== 'view') ? allmembership : true;
                let eligiblebranchfielddisabled = (actionspage !== 'view') ? allbranch : true;

                const { categorycode } = this.state.fieldvalue;
                if (categorycode === 'UPGRADE') {
                    let filterCustom = (options) => {
                        if (rankpaidcompartment) {
                            let optionsCompartment = options.map(obj => {
                                var result2 = {};
                                result2['label'] = obj.label;
                                result2['value'] = obj.value;
                                result2['rank'] = obj.rank;
                                return result2;
                            }).filter(obj => {
                                return rankpaidcompartment >= obj.rank;
                            });
                            return optionsCompartment;
                        } else {
                            return options;
                        }
                    }

                    this.componentCompartmentSelect.retrieveData({ airlinecode: paidairlinecode }, {}, actionspage, filterCustom);
                } else if (categorycode === 'FREEFLIGHT') {
                    this.componentCompartmentSelect.retrieveData({ airlinecode }, { compartmentcode, compartmentname }, actionspage);
                }

                let setValue = {
                    date, createreturncitypair,
                    airlinecode, compartmentcode, subclasscode,
                    paidairlinecode, paidcompartmentcode, paidsubclasscode,
                    onewaypricelow, onewaypricepeak,
                    feeder,
                    pricecalc, distancerangecode, destoriginairport,
                    alltier, allmembership, allbranch,
                    eligibletier, eligiblebranch, eligibletype
                };
                this.props.form.setFieldsValue(setValue);
                this.setState({
                    fieldvalue: { ...this.state.fieldvalue, pricecalc, airlinecode, alltier, allmembership, allbranch },
                    fielddisabled: { ...this.state.fielddisabled, eligiblebranchfielddisabled, eligibletierfielddisabled, eligibletypefielddisabled }
                });

                this.componentAirlineSelect.retrieveData({}, { airlinecode, airlinename }, actionspage);
                this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode }, { subclasscode, subclassname }, actionspage);

                this.componentPaidAirlineSelect.retrieveData({}, { airlinecode: paidairlinecode, airlinename: paidairlinename }, actionspage);
                this.componentPaidCompartmentSelect.retrieveData({ airlinecode: paidairlinecode }, { compartmentcode: paidcompartmentcode, compartmentname: paidcompartmentname }, actionspage);
                this.componentPaidSubclassSelect.retrieveData({ airlinecode: paidairlinecode, compartmentcode: paidcompartmentcode }, { subclasscode: paidsubclasscode, subclassname: paidsubclassname });

                this.componentTierSelect.retrieveData();
                this.componentTypeSelect.retrieveData();
                this.componentBranchSelect.retrieveData();

                if (pricecalc === 'DISTANCERANGE') {
                    this.handleDistanceRangeData(distancerangename);
                } else if (pricecalc === 'CITYPAIR') this.componentCityPairOdRuleSelect.retrieveData({ airlinecode });
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
        });
        await this.setState({ isLoading: false });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;
        const { awardcode } = this.state.fieldvalue;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { paidsubclasscode, createreturncitypair } = input || {};

                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let airlinecode = input.airlinecode;
                let compartmentcode = input.compartmentcode;
                let bookingclasscode = input.subclasscode;
                let paidairlinecode = (input.paidairlinecode) ? input.paidairlinecode : null;
                let paidcompartmentcode = (input.paidcompartmentcode) ? input.paidcompartmentcode : null;
                let feeder = false;
                let travellertype = input.travellertype;
                let pricecalc = input.pricecalc;
                let distancerangecode = (pricecalc === 'DISTANCERANGE') ? input.distancerangecode : null;
                let destoriginairport = (pricecalc === 'CITYPAIR') ? input.destoriginairport : null;
                let onewaypricelow = Number.parseInt(input.onewaypricelow, 0);
                let returnpricelow = 0;
                let onewaypricepeak = Number.parseInt(input.onewaypricepeak, 0);
                let returnpricepeak = 0;
                let alltier = (input.alltier) ? input.alltier : false;
                let allbranch = (input.allbranch) ? input.allbranch : false;
                let allmembership = (input.allmembership) ? input.allmembership : false;

                let eligibletier = [];
                for (const field in input.eligibletier) {
                    eligibletier[field] = {};
                    eligibletier[field] = { tierid: input.eligibletier[field] };
                }
                let eligibletype = [];
                for (const field in input.eligibletype) {
                    eligibletype[field] = {};
                    eligibletype[field] = { membershipid: input.eligibletype[field] };
                }
                let eligiblebranch = [];
                for (const field in input.eligiblebranch) {
                    eligiblebranch[field] = {};
                    eligiblebranch[field] = { branchcode: input.eligiblebranch[field] };
                }

                let data = {
                    awardcode, startdate, enddate, feeder, travellertype, airlinecode, compartmentcode, bookingclasscode, createreturncitypair,
                    paidairlinecode, paidcompartmentcode, pricecalc, onewaypricelow, returnpricelow, onewaypricepeak, returnpricepeak,
                    distancerangecode, destoriginairport, alltier, allbranch, allmembership, eligibletier, eligibletype, eligiblebranch,
                    paidbookingclasscode: (actionspage === 'create') ? null : paidsubclasscode,
                    paidbookingclasscodelist: (actionspage === 'create') ? paidsubclasscode : null,
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.awardprice3.create;
                } else {
                    data.pricederivedcode = this.props.pricederivedcode;
                    message = 'Data has been updated';
                    url = api.url.awardprice3.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                        this.props.changePage({ displayformpage: 'index' })
                    } else if (responsecode.substring(0, 1) === '8') {
                        Alert.information((responsemessage) ? responsemessage : 'Duplicate paidbookingclass, Some succefully saved');
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleAllTierChange = (eligibletierfielddisabled) => {
        let alltier = eligibletierfielddisabled;
        this.props.form.setFieldsValue({ eligibletier: undefined });
        this.setState({
            fielddisabled: { ...this.state.fielddisabled, eligibletierfielddisabled },
            fieldvalue: { ...this.state.fieldvalue, alltier }
        });
    }

    handleAllTypeChange = (eligibletypefielddisabled) => {
        let allmembership = eligibletypefielddisabled;
        this.props.form.setFieldsValue({ eligibletype: undefined });
        this.setState({
            fielddisabled: { ...this.state.fielddisabled, eligibletypefielddisabled },
            fieldvalue: { ...this.state.fieldvalue, allmembership }
        });
    }

    handleAllBranchChange = (eligiblebranchfielddisabled) => {
        let allbranch = eligiblebranchfielddisabled;
        this.props.form.setFieldsValue({ eligiblebranch: undefined });
        this.setState({
            fielddisabled: { ...this.state.fielddisabled, eligiblebranchfielddisabled },
            fieldvalue: { ...this.state.fieldvalue, allbranch }
        });
    }

    handleChangeAirlineCode = (airlinecode) => {
        let compartmentcode = undefined;
        let subclasscode = undefined;
        let compartmentcodefielddisabled = (airlinecode) ? false : true;
        let subclasscodefielddisabled = true;
        let pricecalc = undefined;

        this.componentCompartmentSelect.retrieveData({ airlinecode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ compartmentcode, subclasscode, pricecalc });

        this.setState({ fieldvalue: { ...this.state.fieldvalue, airlinecode, pricecalc } });
    }

    handleChangeCompartment = (compartmentcode) => {
        let airlinecode = this.props.form.getFieldValue('airlinecode');
        let subclasscode = undefined;
        let subclasscodefielddisabled = (compartmentcode) ? false : true;
        this.componentSubclassSelect.retrieveData({ airlinecode, compartmentcode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ subclasscode });
    }

    handleChangePaidAirline = (paidairlinecode) => {
        let paidcompartmentcode = undefined;
        let airlinecode = paidairlinecode;
        let paidsubclasscode = undefined;
        let paidcompartmentcodefielddisabled = (paidairlinecode) ? false : true;
        let paidsubclasscodefielddisabled = true;

        let compartmentcode = undefined;
        let compartmentcodefielddisabled = (paidairlinecode) ? false : true;
        let subclasscode = undefined;
        let subclasscodefielddisabled = true;
        let pricecalc = undefined;

        this.componentPaidCompartmentSelect.retrieveData({ airlinecode: paidairlinecode });
        this.setState({
            fielddisabled: { ...this.state.fielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled, paidcompartmentcodefielddisabled, paidsubclasscodefielddisabled },
            fieldvalue: { ...this.state.fieldvalue, airlinecode, pricecalc }
        });
        this.props.form.setFieldsValue({ airlinecode, compartmentcode, subclasscode, pricecalc, paidcompartmentcode, paidsubclasscode });
    }

    handleChangePaidCompartment = (paidcompartmentcode) => {
        const { actionspage } = this.state;
        let paidairlinecode = this.props.form.getFieldValue('paidairlinecode');
        let paidsubclasscode = undefined;
        let paidsubclasscodefielddisabled = (paidcompartmentcode) ? false : true;
        let subclasscode = undefined;
        let subclasscodefielddisabled = true;

        //filter rank base paid compartment code
        let compartmentcode = undefined;
        let compartmentcodefielddisabled = (paidcompartmentcode) ? false : true;
        let rankpaidcompartment = this.componentPaidCompartmentSelect.state.options.filter(obj => { return obj.value === paidcompartmentcode });
        rankpaidcompartment = (rankpaidcompartment[0] !== undefined) ? rankpaidcompartment[0]['rank'] : null;
        let filterCustom = (options) => {
            if (rankpaidcompartment) {
                let optionsCompartment = options.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.label;
                    result2['value'] = obj.value;
                    result2['rank'] = obj.rank;
                    return result2;
                }).filter(obj => {
                    return rankpaidcompartment > obj.rank;
                });

                return optionsCompartment;
            } else {
                return options;
            }
        }

        this.componentPaidSubclassSelect.retrieveData({ airlinecode: paidairlinecode, compartmentcode: paidcompartmentcode });
        this.componentCompartmentSelect.retrieveData({ airlinecode: paidairlinecode }, {}, actionspage, filterCustom);
        this.setState({ fielddisabled: { ...this.state.fielddisabled, paidsubclasscodefielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled } });
        this.props.form.setFieldsValue({ compartmentcode, subclasscode, paidsubclasscode });
    }

    handleChangePriceCalculation = (event) => {
        let pricecalc = event ? event.target.value : null;
        let airlinecode = this.props.form.getFieldValue('airlinecode');
        let distancerangecode = undefined;
        let destoriginairport = undefined;

        if (pricecalc === 'CITYPAIR') {
            this.componentCityPairOdRuleSelect.retrieveData({ airlinecode });
        }

        this.props.form.setFieldsValue({ distancerangecode, destoriginairport });
        this.setState({ fieldvalue: { ...this.state.fieldvalue, pricecalc } });
    }

    handleChangePage = (displayformpage,) => {
        this.props.changePage({ displayformpage })
    }

    handleDistanceRangeData = (value) => {
        if (value.length > 2) {
            const criteria = { distancerangename: `%${value}%`, airlinecode: this.state.fieldvalue.airlinecode };
            const sort = { distancerangename: "asc" };
            const parameter = { criteria, sort };

            RetrieveRequestCustom(api.url.distancerange.retrieve, parameter, { limit: -1, page: 1 }).then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    var DistanceRange = response.result.map(obj => {
                        var result2 = {};
                        result2['label'] = obj.distancerangename;
                        result2['value'] = obj.distancerangecode;
                        return result2;
                    });

                    this.setState({ fieldvalue: { ...this.state.fieldvalue, DistanceRange } });
                } else Alert.error(response.status.responsemessage);
            });
        } else this.setState({ fieldvalue: { ...this.state.fieldvalue, DistanceRange: [] } });
    }

    handleDistanceRangeChange = (value) => {
        if (!value) this.setState({ fieldvalue: { ...this.state.fieldvalue, DistanceRange: [] } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, fieldvalue, fielddisabled } = this.state;
        const { generalfielddisabled, airlinecodefielddisabled, compartmentcodefielddisabled, subclasscodefielddisabled, paidairlinecodefielddisabled, paidcompartmentcodefielddisabled, paidsubclasscodefielddisabled, eligibletierfielddisabled, eligiblebranchfielddisabled, eligibletypefielddisabled } = fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const { airlinecode, categorycode, pricecalc, alltier, allmembership, allbranch, DistanceRange } = fieldvalue;

        const returnpricefielddisabled = (actionspage === 'create') ? generalfielddisabled : true;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Price</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Period', 'End Period']} minDate={moment()} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Return City Pair" datafield="createreturncitypair" defaultChecked={false} disabled={returnpricefielddisabled} />
                                                                        <AirlineSelect ref={(e) => { this.componentPaidAirlineSelect = e }} form={this.props.form} labeltext="Paid Airline" datafield="paidairlinecode" className={(categorycode === 'UPGRADE') ? '' : 'hidden'} validationrules={(categorycode === 'UPGRADE') ? ['required'] : []} onChange={this.handleChangePaidAirline} disabled={paidairlinecodefielddisabled} />
                                    <CompartmentSelect ref={(e) => { this.componentPaidCompartmentSelect = e }} form={this.props.form} labeltext="Paid Compartment" datafield="paidcompartmentcode" className={(categorycode === 'UPGRADE') ? '' : 'hidden'} validationrules={(categorycode === 'UPGRADE') ? ['required'] : []} onChange={(e) => this.handleChangePaidCompartment(e)} disabled={paidcompartmentcodefielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentPaidSubclassSelect = e }} form={this.props.form} labeltext="Paid Subclass" datafield="paidsubclasscode" className={(categorycode === 'UPGRADE') ? '' : 'hidden'} validationrules={(categorycode === 'UPGRADE') ? ['required'] : []} mode={(actionspage !== 'create') ? '' : 'multiple'} disabled={paidsubclasscodefielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} onChange={this.handleChangeAirlineCode} disabled={airlinecodefielddisabled} />
                                    <CompartmentSelect ref={(e) => { this.componentCompartmentSelect = e }} form={this.props.form} labeltext="Compartment" datafield="compartmentcode" validationrules={['required']} onChange={this.handleChangeCompartment} disabled={compartmentcodefielddisabled} />
                                    <SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Subclass" datafield="subclasscode" validationrules={['required']} disabled={subclasscodefielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="Price Calculation" datafield="pricecalc" validationrules={['required']} options={PriceCalculation} className={(airlinecode) ? '' : 'hidden'} onChange={this.handleChangePriceCalculation} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Distance Range" noSuffixPlaceholder={true} datafield="distancerangecode" placeholder='Type min. 3 char to search (ex: "Grup A")' options={DistanceRange} className={(pricecalc === 'DISTANCERANGE') ? '' : 'hidden'} validationrules={(pricecalc === 'DISTANCERANGE') ? ['required'] : []} disabled={generalfielddisabled} onSearch={this.handleDistanceRangeData} showArrow={false} onChange={this.handleDistanceRangeChange} />
                                    <CityPairOdRuleSelect ref={(e) => { this.componentCityPairOdRuleSelect = e }} form={this.props.form} labeltext="City Pair" datafield="destoriginairport" placeholder='Type City Pair Code' className={(pricecalc === 'CITYPAIR') ? '' : 'hidden'} validationrules={(pricecalc === 'CITYPAIR') ? ['required'] : []} disabled={generalfielddisabled} />
                                    <Form.Item label="Traveler">
                                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: '12px 16px', lineHeight: 1.5 }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {this.props.form.getFieldDecorator('otherstraveller', { valuePropName: 'checked', initialValue: false })(
                                                    <Switch disabled={generalfielddisabled} />
                                                )}
                                                <span style={{ marginLeft: 12, fontWeight: 500, marginBottom: 4 }}>{this.props.form.getFieldValue('otherstraveller') ? 'Allow others' : 'Deny others'}</span>
                                            </div>
                                            <div style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)' }}>
                                                By allowing this you able to set other traveller manually in this price
                                            </div>
                                        </div>
                                    </Form.Item>
                                    <Divider orientation="left">Low Season</Divider>
                                    <InputText form={this.props.form} labeltext="One Way Price Low" datafield="onewaypricelow" validationrules={['required', 'pattern.number', 'max.11',]} maxLength="11" disabled={generalfielddisabled} />
                                    <Divider orientation="left">Peak Season</Divider>
                                    <InputText form={this.props.form} labeltext="One Way Price Peak" datafield="onewaypricepeak" validationrules={['required', 'pattern.number', 'max.11',]} maxLength="11" disabled={generalfielddisabled} />
                                    <Divider orientation="left">Eligibility</Divider>
                                    <SwitchButton form={this.props.form} labeltext="All Tier" datafield="alltier" onChange={this.handleAllTierChange} disabled={generalfielddisabled} />
                                    <TierSelect mode="multiple" ref={(e) => { this.componentTierSelect = e }} form={this.props.form} labeltext="Eligible Tier" datafield="eligibletier" validationrules={(alltier) ? [] : ['required']} disabled={eligibletierfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="All Type" datafield="allmembership" onChange={this.handleAllTypeChange} disabled={generalfielddisabled} />
                                    <MembershipSelect mode="multiple" ref={(e) => { this.componentTypeSelect = e }} form={this.props.form} labeltext="Eligible Type" datafield="eligibletype" validationrules={(allmembership) ? [] : ['required']} disabled={eligibletypefielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="All User Branch" datafield="allbranch" onChange={this.handleAllBranchChange} disabled={generalfielddisabled} />
                                    <BranchSelect mode="multiple" ref={(e) => { this.componentBranchSelect = e }} form={this.props.form} labeltext="Eligible Branch" datafield="eligiblebranch" validationrules={(allbranch) ? [] : ['required']} disabled={eligiblebranchfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button htmlType="button" type="default" label="Back" onClick={() => this.handleChangePage('index')} />
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