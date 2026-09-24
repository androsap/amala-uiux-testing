import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { TierSelect, InputText, DateRangeBase, Button, Alert } from '../../components/Base/BaseComponent';
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
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                active: true,
                tierrelationbonusid: null
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
                this.componentTierSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (tierrelationbonusid, actionspage) => {
        let url = api.url.relationbonus.list;
        let criteria = { tierrelationbonusid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let tierrelationbonusid = (result[0].tierrelationbonusid) ? result[0].tierrelationbonusid : null;
                    let tierid = (result[0].tierid) ? result[0].tierid : null;
                    let tiername = (result[0].tiername) ? result[0].tiername : null;
                    let parentfactormiles = (result[0].parentfactormiles !== undefined) ? result[0].parentfactormiles : '';
                    let childfactormiles = (result[0].childfactormiles !== undefined) ? result[0].childfactormiles : '';
                    let parentfactortier = (result[0].parentfactortier !== undefined) ? result[0].parentfactortier : '';
                    let childfactortier = (result[0].childfactortier !== undefined) ? result[0].childfactortier : '';
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : null;
                    let date = [startdate, enddate];
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { tierid, parentfactormiles, childfactormiles, parentfactortier, childfactortier, date };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { ...this.state.fieldvalue, tierrelationbonusid, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    // load options select2
                    this.componentTierSelect.retrieveData({}, { tierid, tiername }, actionspage);
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
                let tierid = input.tierid;
                let parentfactormiles = (input.parentfactormiles !== undefined) ? input.parentfactormiles : null;
                let childfactormiles = (input.childfactormiles !== undefined) ? input.childfactormiles : null;
                let parentfactortier = (input.parentfactortier !== undefined) ? input.parentfactortier : null;
                let childfactortier = (input.childfactortier !== undefined) ? input.childfactortier : null;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let data = { tierid, parentfactormiles, childfactormiles, parentfactortier, childfactortier, startdate, enddate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.relationbonus.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.relationbonus.update;
                    data.tierrelationbonusid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/relation-bonus');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    deleteData(tierrelationbonusid, active) {
        let url = (active) ? api.url.relationbonus.deactivate : api.url.relationbonus.activate;
        let data = { tierrelationbonusid };
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
        const { tierrelationbonusid, active } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Relation Bonus | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Relation Bonus</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={this.props.form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Parent Award Miles Factor" datafield="parentfactormiles" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} suffix="%" />
                                    <InputText form={this.props.form} labeltext="Child Award Miles Factor" datafield="childfactormiles" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} suffix="%" />
                                    <InputText form={this.props.form} labeltext="Parent Tier Miles Factor" datafield="parentfactortier" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} suffix="%" />
                                    <InputText form={this.props.form} labeltext="Child Tier Miles Factor" datafield="childfactortier" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} suffix="%" />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
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
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(tierrelationbonusid, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(tierrelationbonusid, active)} /> : ""
                                }
                                <Button url="/relation-bonus" htmlType="link" type="default" label="Back" />
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