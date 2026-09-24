
import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, DateRangeBase } from '../../components/Base/BaseComponent';
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
            fieldvalue: {
                fareid: null,
                active: true
            },
            fielddisabled: {
                generalfielddisabled: false,
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

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
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
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (fareid, actionspage) => {
        let url = api.url.accrualrulefare.list;
        let criteria = { fareid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let farecode = (result[0].farecode) ? result[0].farecode : null;
                    let farename = (result[0].farename) ? result[0].farename : null;
                    let farefactor = (result[0].farefactor) ? result[0].farefactor : 0;
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : null;
                    let date = [startdate, enddate];
                    let status = (result[0].status) ? result[0].status : null;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { farecode, farename, farefactor, date, status };
                    let fieldvalue = { fareid, active };
                    this.props.form.setFieldsValue(setValue);
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

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
                let farecode = input.farecode;
                let farename = input.farename;
                let farefactor = input.farefactor;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                
                let data = { farecode, farename, farefactor, startdate, enddate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.accrualrulefare.create;
                } else {
                    data.fareid = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.accrualrulefare.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/accrual-rule-fare-family');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(fareid, active) {
        let url = (active) ? api.url.accrualrulefare.deactivate : api.url.accrualrulefare.activate;
        let data = { fareid };
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
        const { fareid, active } = this.state.fieldvalue;

        if (formrender) {
            document.title = titlepage + " Accrual Rule - Fare Family | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Accrual Rule - Fare Family</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Fare Code" placeholder="Fare Code" datafield="farecode" form={this.props.form} maxLength={45} validationrules={['required', 'pattern.alphanumeric', 'pattern.alphabetnumeric']} disabled={generalfielddisabled} />
                                    <InputText labeltext="Fare Name" placeholder="Fare Name" datafield="farename" form={this.props.form} maxLength={45} validationrules={['required', 'pattern.alphanumericspace']} disabled={generalfielddisabled} />
                                    <InputText labeltext="Fare Factor" placeholder="Fare Factor" datafield="farefactor" form={this.props.form} maxLength={45} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} suffix={'%'}/>
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
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
                                {
                                    (actionspage !== 'create') ?
                                        (active) ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(fareid, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(fareid, active)} /> : ""
                                }
                                <Button url="/accrual-rule-fare-family" htmlType="link" type="default" label="Back" />
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