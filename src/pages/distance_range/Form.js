import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, AirlineSelect, DateRangeBase, RadioButton, TextArea } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const optionsRoute = [
    { label: "Domestic", value: "DOMESTIC" },
    { label: "International", value: "INTERNATIONAL" },
    // { label: "Both", value: "BOTH" }
];

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
                distancerangecode: null,
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
                this.componentAirlineSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (distancerangecode, actionspage) => {
        let url = api.url.distancerange.list;
        let criteria = { distancerangecode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let distancerangecode = result[0].distancerangecode ? result[0].distancerangecode : null;
                    let distancerangename = result[0].distancerangename ? result[0].distancerangename : null;
                    let airlinecode = result[0].airlinecode;
                    let airlinename = (result[0].airlinename !== undefined) ? result[0].airlinename : null;
                    let description = result[0].description ? result[0].description : null;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let bottomrange = result[0].bottomrange !== undefined ? result[0].bottomrange.toString() : null;
                    let upperrange = result[0].upperrange !== undefined ? result[0].upperrange.toString() : null;
                    let routetype = result[0].routetype ? result[0].routetype : null;
                    let status = result[0].active ? 'Active' : 'Inactive';

                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? false : true;

                    let setValue = { distancerangecode, distancerangename, airlinecode, description, date, bottomrange, upperrange, routetype, status };
                    this.props.form.setFieldsValue(setValue);

                    let fieldvalue = { distancerangecode, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    this.componentAirlineSelect.retrieveData({}, { airlinecode, airlinename }, actionspage);
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
                let distancerangecode = (input.distancerangecode !== undefined) ? input.distancerangecode.toUpperCase() : null;
                let distancerangename = (input.distancerangename !== undefined) ? input.distancerangename : null;
                let airlinecode = (input.airlinecode) ? input.airlinecode : null;
                let description = (input.description !== undefined) ? input.description : false;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let bottomrange = (input.bottomrange !== undefined) ? input.bottomrange : null;
                let upperrange = (input.upperrange !== undefined) ? input.upperrange : null;
                let route = (input.routetype !== undefined) ? input.routetype : null;

                let data = { distancerangecode, distancerangename, airlinecode, description, effectivedate, discontinuedate, bottomrange, upperrange, route };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.distancerange.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.distancerange.update;
                    data.distancerangecode = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/distance-range');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    deleteData(distancerangecode, active) {
        let url = (active) ? api.url.distancerange.deactivate : api.url.distancerange.activate;
        let data = { distancerangecode };
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

    handleChangeEffectiveDate = () => {
        let discontinuedate = undefined;
        this.props.form.setFieldsValue({ discontinuedate });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const { distancerangecode, active } = this.state.fieldvalue;

        let effectivedate = this.props.form.getFieldValue('effectivedate');

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Distance Range | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Distance Range</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Distance Range Code" datafield="distancerangecode" validationrules={['required', 'pattern.alphanumeric', 'max.10']} maxLength={10} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Distance Range Name" datafield="distancerangename" validationrules={['required', 'pattern.alphanumericspace', 'max.255']} maxLength={255} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <TextArea form={this.props.form} labeltext="Description" datafield="description" validationrules={['required', 'max.255',]} maxLength="255" disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} minDate={moment(new Date()).add(1, 'day')} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Bottom Range" datafield="bottomrange" validationrules={['required', 'pattern.number', 'max.9']} maxLength={9} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Upper Range" datafield="upperrange" validationrules={['required', 'pattern.number', 'max.9']} maxLength={9} disabled={specialfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="routetype" datafield="routetype" options={optionsRoute} validationrules={['required']} disabled={specialfielddisabled} />
                                    {/* {
                                        (actionspage !== 'create') ?
                                            <InputText form={this.props.form} labeltext="Status" datafield="status" maxLength={10} disabled={specialfielddisabled} />
                                            : null
                                    } */}
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
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(distancerangecode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(distancerangecode, active)} /> : ""
                                }
                                <Button url="/distance-range" htmlType="link" type="default" label="Back" />
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