
import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, OriDesSelect, DateRangeBase, CheckBoxPlainList, SwitchButton } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const prefixmenuname = 'FLIGSCHE';
const menucode = 'FLIGSCHE';

const optionsDayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class App extends Component {
    constructor(props) {
        super(props);
        if (this.props.location.state && this.props.location.state.airlinecode) {
            this.state = {
                isLoading: false,
                titlepage: 'Create',
                actionspage: 'create',
                formrender: true,
                fieldvalue: {
                    flightscheduleid: null,
                    active: true
                },
                fielddisabled: {
                    generalfielddisabled: false
                },
                airlinecode: this.props.location.state.airlinecode,
                airlinename: this.props.location.state.airlinename,
                active: this.props.location.state.active
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || (this.props.location.state && !this.props.location.state.active)) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                if (this.props.location.state && this.props.location.state.airlinecode) this.componentOriDesSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (flightscheduleid, actionspage) => {
        let url = api.url.flightschedule.list;
        let criteria = { flightscheduleid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let flightscheduleid = (result[0].flightscheduleid) ? result[0].flightscheduleid : null;
                    let flightnumber = (result[0].flightnumber) ? result[0].flightnumber : null;
                    let origin = (result[0].origin) ? result[0].origin : null;
                    let origincityname = (result[0].originairport.cityname) ? result[0].originairport.cityname : null;
                    let originairportname = (result[0].originairport.airportname) ? result[0].originairport.airportname : null;
                    let destination = (result[0].destination) ? result[0].destination : null;
                    let destinationcityname = (result[0].destinationairport.cityname) ? result[0].destinationairport.cityname : null;
                    let destinationairportname = (result[0].destinationairport.airportname) ? result[0].destinationairport.airportname : null;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let monday = (result[0].monday) ? true : false;
                    let tuesday = (result[0].tuesday) ? true : false;
                    let wednesday = (result[0].wednesday) ? true : false;
                    let thursday = (result[0].thursday) ? true : false;
                    let friday = (result[0].friday) ? true : false;
                    let saturday = (result[0].saturday) ? true : false;
                    let sunday = (result[0].sunday) ? true : false;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    let validforearn = result[0].validforearn;
                    let validforredeem = result[0].validforredeem;

                    /* get day list detail */
                    let daylist = [];
                    if (monday) daylist.push('Monday')
                    if (tuesday) daylist.push('Tuesday')
                    if (wednesday) daylist.push('Wednesday')
                    if (thursday) daylist.push('Thursday')
                    if (friday) daylist.push('Friday')
                    if (saturday) daylist.push('Saturday')
                    if (sunday) daylist.push('Sunday')

                    let setValue = { flightscheduleid, flightnumber, origin, origincityname, originairportname, destination, destinationcityname, destinationairportname, date, daylist, validforearn, validforredeem };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { flightscheduleid, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    if (this.props.location.state && this.props.location.state.airlinecode)
                        this.componentOriDesSelect.retrieveData({}, { origin, origincityname, originairportname, destination, destinationcityname, destinationairportname }, actionspage);
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
                let airlinecode = this.state.airlinecode;
                let flightnumber = input.flightnumber.toUpperCase();
                let origin = input.origin;
                let destination = input.destination;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let monday = input.daylist.filter(value => value === 'Monday').length > 0;
                let tuesday = input.daylist.filter(value => value === 'Tuesday').length > 0;
                let wednesday = input.daylist.filter(value => value === 'Wednesday').length > 0;
                let thursday = input.daylist.filter(value => value === 'Thursday').length > 0;
                let friday = input.daylist.filter(value => value === 'Friday').length > 0;
                let saturday = input.daylist.filter(value => value === 'Saturday').length > 0;
                let sunday = input.daylist.filter(value => value === 'Sunday').length > 0;
                let validforearn = input.validforearn;
                let validforredeem = input.validforredeem;

                let data = { airlinecode, flightnumber, origin, destination, effectivedate, discontinuedate, sunday, monday, tuesday, wednesday, thursday, friday, saturday, validforearn, validforredeem };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.flightschedule.create;
                } else {
                    data.flightscheduleid = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.flightschedule.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push({ pathname: '/airline/schedule/', state: { airlinecode: this.state.airlinecode, airlinename: this.state.airlinename, active: this.state.active } });
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(flightscheduleid, active) {
        let url = (active) ? api.url.flightschedule.deactivate : api.url.flightschedule.activate;
        let data = { flightscheduleid };
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
        if (this.props.location.state && this.props.location.state.airlinecode) {
            const formItemLayout = {
                labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
                wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
            };
            const { titlepage, actionspage, formrender } = this.state;
            const { flightscheduleid, active } = this.state.fieldvalue;
            const { generalfielddisabled } = this.state.fielddisabled;

            if (formrender) {
                document.title = titlepage + " Flight Schedule | Loyalty Management System";
                //render form
                return (
                    <Row>
                        <Row>
                            <Col xs={24} xl={22}>
                                <Title level={3}>{titlepage} Flight Schedule for {this.state.airlinename} [{this.state.airlinecode}]</Title>
                            </Col>
                            <Divider />
                        </Row>
                        <Spin spinning={this.state.isLoading}>
                            <Form {...formItemLayout} onSubmit={this.saveAction}>
                                <Row gutter={24}>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                        <InputText labeltext="Flight Number" datafield="flightnumber" form={this.props.form} maxLength={7} validationrules={['required', 'pattern.alphanumeric']} disabled={generalfielddisabled} />
                                        <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['origin', 'destination']} form={this.props.form} validationrules={['required', 'required']} disabled={generalfielddisabled} />
                                        <CheckBoxPlainList form={this.props.form} labeltext="Day List" datafield="daylist" defaultValue={this.state.daylist} initialValue={this.state.dayDetail ? this.state.dayDetail['daylist'] : ''} options={optionsDayList} onChange={this.onChangeCb} disabled={generalfielddisabled} />
                                        <SwitchButton form={this.props.form} defaultChecked={false} labeltext="Valid for Earn" datafield="validforearn" disabled={generalfielddisabled} />
                                        <SwitchButton form={this.props.form} defaultChecked={false} labeltext="Valid for Redeem" datafield="validforredeem" disabled={generalfielddisabled} />
                                        <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} validationrules={['required']} disabled={generalfielddisabled} minDate={moment(new Date()).add(1, 'day')} />
                                    </Col>
                                </Row>
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                    {(actionspage !== 'view' && this.state.active) ?
                                        (actionspage === 'create') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                            : (actionspage === 'update' && active) ?
                                                <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                                : null : null
                                    }
                                    {
                                        (actionspage !== 'create') ?
                                            (active) ?
                                                <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(flightscheduleid, active)} /> :
                                                <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(flightscheduleid, active)} /> : ""
                                    }
                                    <Button url={{ pathname: '/airline/schedule', state: { airlinecode: this.state.airlinecode, airlinename: this.state.airlinename, active: this.state.active } }} type="default" label="Back" />
                                </Row>
                            </Form>
                        </Spin>
                    </Row>
                )
            } else {
                return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
            }
        } else {
            return (<ErrorGeneral {...this.props} message="Airline Code not detected, please do not use tab" />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));