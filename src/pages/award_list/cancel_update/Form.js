import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, RadioButton, SwitchButton, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title } = Typography;

const optionsUnit = [
    { label: "Mileage", value: 'MILEAGE' },
    { label: "Percentage (%)", value: 'PERCENTAGE' }
]

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
            fieldvalue: {},
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                cancelfielddisabled: true,
                updatefielddisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.awardcode;
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
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (awardcode, actionspage) => {
        let url = api.url.awardmaster.detailcancelupdate;
        let data = { awardcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let cancanceled = (result.cancanceled) ? result.cancanceled : null;
                let cancelunit = (result.cancelunit) ? result.cancelunit : null;
                let cancelfee = (result.cancelfee || result.cancelfee === 0) ? result.cancelfee.toString() : null;
                let canupdated = (result.canupdated) ? result.canupdated : null;
                let updateunit = (result.updateunit) ? result.updateunit : null;
                let updatefee = (result.updatefee) ? result.updatefee.toString() : null;

                let setValue = { cancanceled, cancelunit, cancelfee, canupdated, updateunit, updatefee };
                this.props.form.setFieldsValue(setValue);

                let cancelfielddisabled = (cancanceled && actionspage !== 'view') ? false : true;
                let updatefielddisabled = (canupdated && actionspage !== 'view') ? false : true;
                this.setState({ fielddisabled: { ...this.state.fielddisabled, cancelfielddisabled, updatefielddisabled } });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let cancanceled = (input.cancanceled) ? true : false;
                let canupdated = (input.canupdated) ? true : false;
                let cancelfee = (input.cancelfee || input.cancelfee === 0) ? input.cancelfee : null;
                let updatefee = (input.updatefee) ? input.updatefee : null;
                let cancelunit = (input.cancelunit) ? input.cancelunit : null;
                let updateunit = (input.updateunit) ? input.updateunit : null;
                let cancelstatementcode = null;
                let updatestatementcode = null;

                let awardcode = this.props.awardcode;
                let data = { awardcode, cancanceled, canupdated, cancelfee, updatefee, cancelunit, updateunit, cancelstatementcode, updatestatementcode };
                let message = 'Data has been updated';
                let url = api.url.awardmaster.updatecancelupdate;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeCanCanceled = (cancelfielddisabled) => {
        let cancelunit = undefined;
        let cancelfee = undefined;
        this.props.form.setFieldsValue({ cancelunit, cancelfee });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, cancelfielddisabled: !cancelfielddisabled } });
    }

    onChangeCanUpdated = (updatefielddisabled) => {
        let updateunit = undefined;
        let updatefee = undefined;
        this.props.form.setFieldsValue({ updateunit, updatefee });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, updatefielddisabled: !updatefielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { cancelfielddisabled, generalfielddisabled, updatefielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Cancel/Update | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Cancel/Update</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SwitchButton form={this.props.form} labeltext="Can be Canceled?" datafield="cancanceled" onChange={this.onChangeCanCanceled} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="Cancel Units" datafield="cancelunit" validationrules={(cancelfielddisabled) ? [] : ['required']} options={optionsUnit} disabled={cancelfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Cancel Fee" datafield="cancelfee" validationrules={(cancelfielddisabled) ? [] : ['required', 'pattern.number', 'max.10',]} maxLength={10} disabled={cancelfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Can be Updated?" datafield="canupdated" onChange={this.onChangeCanUpdated} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="Update Units" datafield="updateunit" validationrules={(updatefielddisabled) ? [] : ['required']} options={optionsUnit} disabled={updatefielddisabled} />
                                    <InputText form={this.props.form} labeltext="Update Fee" datafield="updatefee" validationrules={(updatefielddisabled) ? [] : ['required', 'pattern.number', 'max.10',]} maxLength={10} disabled={updatefielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
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