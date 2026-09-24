import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, TextArea, AirlineSelect, SwitchButton, DatePickerBase, SelectBase, CountrySelect, RegionSelect, Button, Alert, AirportSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Table, Modal } from 'antd';
import moment from 'moment';

const { Column } = Table;
const { Title, Text } = Typography;

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
            route: [],
            showAddModal: false,
            fieldvalue: {
                blackoutid: null,
                isallroute: false,
                active: true,
                startdate: null
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

    getDetail = (blackoutid, actionspage) => {
        let url = api.url.blackout.list;
        let criteria = { blackoutid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let blackoutid = (result[0].blackoutid) ? result[0].blackoutid : '';
                    let name = (result[0].name) ? result[0].name : '';
                    let description = (result[0].description) ? result[0].description : '';
                    let airlinecode = (result[0].airlinecode) ? result[0].airlinecode : null;
                    let airlinename = (result[0].airlinename) ? result[0].airlinename : null;
                    let startdate = result[0].startdate ? moment(result[0].startdate) : undefined;
                    let enddate = result[0].enddate ? moment(result[0].enddate) : undefined;
                    let isallroute = result[0].isallroute ? result[0].isallroute : false;
                    let route = result[0].route ? result[0].route : [];
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { blackoutid, name, description, airlinecode, airlinename, startdate, enddate, isallroute, route };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { blackoutid, startdate, isallroute, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ route, fieldvalue, fielddisabled });

                    //load options select2
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
                let name = input.name.toUpperCase();
                let description = (input.description && input.description.length > 0) ? input.description : null;
                let airlinecode = input.airlinecode;
                let startdate = (input.startdate) ? moment(input.startdate).format("YYYY-MM-DD") : null;
                let enddate = (input.enddate) ? moment(input.enddate).format("YYYY-MM-DD") : null;
                let isallroute = input.isallroute ? true : false;
                let route = this.state.route.length ? this.state.route : [];

                let data = { name, description, airlinecode, startdate, enddate, isallroute, route };
                this.setState({ data });

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.blackout.create;
                } else {
                    data.blackoutid = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.blackout.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/blackout');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        })
    };

    deleteData(blackoutid, active) {
        let url = (active) ? api.url.blackout.deactivate : api.url.blackout.activate;
        let data = { blackoutid };
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

    handleIsAllRouteChange = (event) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, isallroute: event }, route: [] });
    }

    handleSetupRoute = (input) => {
        let { route } = this.state;
        route.push(input);
        this.setState({ route });
        this.handleCancel();
    }

    deleteRowAction(key) {
        var route = [...this.state.route];
        route.splice(key, 1);
        this.setState({ route });
    }

    handleOpenModal = () => {
        this.setState({ showAddModal: true });
    }

    handleCancel = () => {
        this.setState({ showAddModal: false });
    };

    onChangeStartDate = (event) => {
        this.props.form.setFieldsValue({ enddate: undefined });
        this.setState({ fieldvalue: { ...this.state.fieldvalue, startdate: event } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, route, showAddModal } = this.state;
        const { isallroute, blackoutid, active, startdate } = this.state.fieldvalue;
        const { specialfielddisabled, generalfielddisabled } = this.state.fielddisabled;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Blackout | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Blackout</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Modal visible={showAddModal} title="Setup Route" onCancel={this.handleCancel} footer={null} destroyOnClose={true} disabled={(active && usermenu[menucode][prefixmenuname + "_UPDATE"]) ? false : true}>
                        <RouteForm handleClose={this.handleCancel} setupAction={this.handleSetupRoute} route={route} />
                    </Modal>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={(e) => this.saveAction(e)}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Name" datafield="name" validationrules={['required', 'pattern.alphanumeric', 'max.100',]} maxLength={100} disabled={specialfielddisabled} />
                                    <TextArea form={this.props.form} labeltext="Description" datafield="description" validationrules={['required']} maxLength={255} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} disabled={generalfielddisabled} />
                                    {/* <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment(new Date())} disabled={generalfielddisabled} /> */}
                                    <Row gutter={2}>
                                        <Col xs={16} sm={16} md={16}>
                                            <DatePickerBase labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={this.props.form} labeltext="Date" datafield="startdate" placeholder="Start Date" validationrules={['required']} minDate={moment(new Date())} onChange={this.onChangeStartDate} disabled={specialfielddisabled} />
                                        </Col>
                                        <Col xs={8} sm={8} md={8}>
                                            <DatePickerBase wrapperCol={{ span: 24 }} form={this.props.form} placeholder="End Date" datafield="enddate" validationrules={['required']} minDate={moment(startdate)} disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <SwitchButton form={this.props.form} labeltext="Is All Route?" datafield="isallroute" validationrules={['required']} onChange={this.handleIsAllRouteChange} disabled={generalfielddisabled} />

                                    <Form.Item label="Route" className={(isallroute) ? 'hidden' : ''}>
                                        <Button type="primary" label="Setup Route" htmlType="button" onClick={() => this.handleOpenModal()} disabled={(active && usermenu[menucode][prefixmenuname + "_UPDATE"]) ? false : true} />
                                    </Form.Item>
                                </Col>
                                <Col className={(isallroute) ? 'gutter-row hidden' : 'gutter-row'} xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
                                    <Table rowKey={record => record.origin} dataSource={route} size="middle" pagination={false}>
                                        <Column title="Origin" dataIndex="origin" key="origin" render={(text, row) => text ? row.origin + ' (' + row.typeorigin + ')' : '-'} />
                                        <Column title="Destination" dataIndex="destination" key="destination" render={(text, row) => text ? row.destination + ' (' + row.typedest + ')' : '-'} />
                                        <Column
                                            title="Action"
                                            key="action"
                                            render={(value, row, index) => (
                                                <span>
                                                    <Button htmlType="button" size="small" label="Remove" type="danger" onClick={() => this.deleteRowAction(index)} disabled={(active && usermenu[menucode][prefixmenuname + "_UPDATE"]) ? false : true} />
                                                </span>
                                            )}
                                        />
                                    </Table>
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
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(blackoutid, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(blackoutid, active)} /> : ""
                                }
                                <Button url="/blackout" htmlType="link" type="default" label="Back" />
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


class RouteFormApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fieldvalue: {
                typeorigin: undefined,
                typedest: undefined
            },
            fielddisabled: {
                originfielddisabled: true,
                destinationfielddisabled: true
            },
            route: [],
            routeValidation: null
        }
    }

    handleCancel = () => {
        this.setState({ showAddModal: false });
    };

    handleSaveRoute = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            const { typeorigin, typedest } = this.state.fieldvalue;
            let routeValidation = '';
            if (!err) {
                if (typeorigin === undefined && typedest === undefined) {
                    routeValidation = "Origin or Destination is required";
                } else {
                    if (typeorigin !== undefined) {
                        input.origin = input.regionorigin || input.countryorigin || input.airportorigin;
                    }
                    if (typedest !== undefined) {
                        input.destination = input.regiondestination || input.countrydestination || input.airportdestination;
                    }

                    if (input.typeorigin !== undefined && input.origin !== undefined) {
                        if (input.typedest !== undefined && input.destination !== undefined) {
                            this.props.setupAction(input);
                        } else if (input.typedest === undefined) {
                            this.props.setupAction(input);
                        }
                    } else if (input.typedest !== undefined && input.destination !== undefined) {
                        if (input.typeorigin !== undefined && input.origin !== undefined) {
                            this.props.setupAction(input);
                        } else if (input.typeorigin === undefined) {
                            this.props.setupAction(input);
                        }
                    }
                }
            }
            this.setState({ routeValidation });
        })
    }

    handleChangeOrigin = (typeorigin) => {
        if (typeorigin === 'REGION') {
            this.componentRegionOriSelect.retrieveData();
        } else if (typeorigin === 'COUNTRY') {
            this.componentCountryOriSelect.retrieveData();
        } else if (typeorigin === 'AIRPORT') {
            this.componentAirportOriSelect.retrieveData();
        }
        this.props.form.setFieldsValue({ origin: undefined });
        this.setState({
            fieldvalue: { ...this.state.fieldvalue, typeorigin },
            fielddisabled: (typeorigin) ? { ...this.state.fielddisabled, originfielddisabled: false } : { ...this.state.fielddisabled }
        })
    }

    handleChangeDestination = (typedest) => {
        if (typedest === 'REGION') {
            this.componentRegionDesSelect.retrieveData();
        } else if (typedest === 'COUNTRY') {
            this.componentCountryDesSelect.retrieveData();
        } else if (typedest === 'AIRPORT') {
            this.componentAirportDesSelect.retrieveData();
        }
        this.props.form.setFieldsValue({ destination: undefined });
        this.setState({
            fieldvalue: { ...this.state.fieldvalue, typedest },
            fielddisabled: (typedest) ? { ...this.state.fielddisabled, destinationfielddisabled: false } : { ...this.state.fielddisabled }
        })
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 12 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
        };

        const { isLoading } = this.state;
        const { typeorigin, typedest } = this.state.fieldvalue;
        const { originfielddisabled, destinationfielddisabled } = this.state.fielddisabled;
        const optionsType = [
            { label: "REGION", value: 'REGION' },
            { label: "COUNTRY", value: 'COUNTRY' },
            { label: "AIRPORT", value: 'AIRPORT' }
        ]

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18 }} xl={{ span: 18 }}>
                                <SelectBase form={this.props.form} labeltext="Origin Type" datafield="typeorigin" options={optionsType} onChange={this.handleChangeOrigin} />
                                <RegionSelect ref={(e) => { this.componentRegionOriSelect = e }} form={this.props.form} labeltext="Region" datafield="regionorigin" validationrules={(typeorigin === 'REGION') ? ['required'] : []} className={(typeorigin === 'REGION') ? '' : 'hidden'} disabled={originfielddisabled} />
                                <CountrySelect ref={(e) => { this.componentCountryOriSelect = e }} form={this.props.form} labeltext="Country" datafield="countryorigin" validationrules={(typeorigin === 'COUNTRY') ? ['required'] : []} className={(typeorigin === 'COUNTRY') ? '' : 'hidden'} disabled={originfielddisabled} />
                                <AirportSelect ref={(e) => { this.componentAirportOriSelect = e }} form={this.props.form} labeltext="Airport" datafield="airportorigin" validationrules={(typeorigin === 'AIRPORT') ? ['required'] : []} className={(typeorigin === 'AIRPORT') ? '' : 'hidden'} disabled={originfielddisabled} />

                                <SelectBase form={this.props.form} labeltext="Destination Type" datafield="typedest" options={optionsType} onChange={this.handleChangeDestination} />
                                <RegionSelect ref={(e) => { this.componentRegionDesSelect = e }} form={this.props.form} labeltext="Region" datafield="regiondestination" validationrules={(typedest === 'REGION') ? ['required'] : []} className={(typedest === 'REGION') ? '' : 'hidden'} disabled={destinationfielddisabled} />
                                <CountrySelect ref={(e) => { this.componentCountryDesSelect = e }} form={this.props.form} labeltext="Country" datafield="countrydestination" validationrules={(typedest === 'COUNTRY') ? ['required'] : []} className={(typedest === 'COUNTRY') ? '' : 'hidden'} disabled={destinationfielddisabled} />
                                <AirportSelect ref={(e) => { this.componentAirportDesSelect = e }} form={this.props.form} labeltext="Airport" datafield="airportdestination" validationrules={(typedest === 'AIRPORT') ? ['required'] : []} className={(typedest === 'AIRPORT') ? '' : 'hidden'} disabled={destinationfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center">
                            <Text form={this.props.form} type="danger">{this.state.routeValidation}</Text>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="button" label="Save" typtype="default" onClick={this.handleSaveRoute} />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
const RouteForm = Form.create()(RouteFormApp);
export default connect(mapStateToProps)(Form.create()(App));