
import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, PartnerSelect, AirlineSelect, OriDesSelect, DateRangeBase, SelectBase } from '../../components/Base/BaseComponent';
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
            formrender: true,
            fielddisabled: {
                generalfielddisabled: false,
                airlinecodefielddisabled: true
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
            let generalfielddisabled = false;
            let airlinecodefielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                airlinecodefielddisabled = true;
            }
            //change into update page
            let fielddisabled = { generalfielddisabled, airlinecodefielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentPartnerSelect.retrieveData();
                this.componentOriDesSelect.retrieveData();
                // this.componentDesOriDesSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (odruleid, actionspage) => {
        let url = api.url.accrualruleod.list;
        let criteria = { odruleid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let odrulename = (result[0].odrulename) ? result[0].odrulename : null;
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : null;
                    let partnername = (result[0].partnername) ? result[0].partnername : null;
                    let airlinecode = (result[0].airlinecode) ? result[0].airlinecode : null;
                    let airlinename = (result[0].airlinename) ? result[0].airlinename : null;
                    let originairport = (result[0].originairport) ? result[0].originairport : null;
                    let origincityname = (result[0].origin.cityname) ? result[0].origin.cityname : null;
                    let originairportname = (result[0].origin.airportname) ? result[0].origin.airportname : null;
                    let destinationairport = (result[0].destinationairport) ? result[0].destinationairport : null;
                    let destinationcityname = (result[0].destination.cityname) ? result[0].destination.cityname : null;
                    let destinationairportname = (result[0].destination.airportname) ? result[0].destination.airportname : null;
                    let tpm = (result[0].tpm !== undefined) ? result[0].tpm : '';
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : null;
                    let date = [startdate, enddate];
                    let routetype = (result[0].routetype) ? result[0].routetype : null;

                    let setValue = { odrulename, partnercode, partnername, airlinecode, airlinename, originairport, origincityname, originairportname, destinationairport, destinationcityname, destinationairportname, tpm, date, routetype };
                    this.props.form.setFieldsValue(setValue);
                    let fielddisabled = { ...this.state.fielddisabled };
                    this.setState({ fielddisabled });

                    //add select inactive
                    this.componentPartnerSelect.retrieveData({}, { partnercode, partnername }, actionspage);
                    this.componentAirlineSelect.retrieveData({}, { airlinecode, airlinename }, actionspage);
                    this.componentOriDesSelect.retrieveData({}, { originairport, origincityname, originairportname, destinationairport, destinationcityname, destinationairportname }, actionspage);
                    // this.componentDesOriDesSelect.retrieveData({}, { destinationairport, destinationcityname, destinationairportname }, actionspage);
                    // this.componentOriOriDesSelect.retrieveData({}, { airportiata, airportname }, { originairport, origincityname, originairportname }, actionspage);
                    // this.componentOriOriDesSelect.retrieveData({}, { airportiata, airportname }, { destinationairport, destinationcityname, destinationairportname }, actionspage);
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
                let type = "OD";
                let odrulename = input.odrulename;
                let partnercode = input.partnercode;
                let airlinecode = input.airlinecode;
                let originairport = input.originairport;
                let destinationairport = input.destinationairport;
                let tpm = (input.tpm !== undefined) ? input.tpm : null;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let routetype = input.routetype;

                let data = { odrulename, type, partnercode, airlinecode, originairport, destinationairport, tpm, startdate, enddate, routetype };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.accrualruleod.create;
                } else {
                    data.odruleid = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.accrualruleod.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/accrual-rule-od');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(odruleid, active) {
        let url = (active) ? api.url.accrualruleod.deactivate : api.url.accrualruleod.activate;
        let data = { odruleid };
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

    onChangePartner = (partnercode) => {
        let criteria = { partnercode };
        this.componentAirlineSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ airlinecode: undefined });
        let airlinecodefielddisabled = (partnercode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, airlinecodefielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, airlinecodefielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const optionsRouteType = [
            { label: 'International', value: 'INTERNATIONAL' },
            { label: 'Domestic', value: 'DOMESTIC' },
            { label: 'Not Specified', value: 'NOT_SPECIFIED' }
        ]

        if (formrender) {
            document.title = titlepage + " Accrual Rule - Origin Destination | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Accrual Rule - Origin Destination</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Rule Name" datafield="odrulename" form={this.props.form} maxLength={45} validationrules={['required', 'max.45']} disabled={generalfielddisabled} />
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} labeltext="Partner" datafield="partnercode" form={this.props.form} validationrules={['required']} onChange={this.onChangePartner} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} labeltext="Airline" datafield="airlinecode" form={this.props.form} validationrules={['required']} disabled={airlinecodefielddisabled} />
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['originairport', 'destinationairport']} form={this.props.form} validationrules={['required', 'required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="TPM" datafield="tpm" maxLength={11} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
                                    <SelectBase labeltext="Route Type" datafield="routetype" form={this.props.form} options={optionsRouteType} validationrules={['required']} disabled={generalfielddisabled} />
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
                                <Button url="/accrual-rule-od" htmlType="link" type="default" label="Back" />
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