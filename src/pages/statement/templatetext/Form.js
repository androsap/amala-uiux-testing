import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { SwitchButton, LanguageSelect, TextAreaTag, Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title } = Typography;
// const optionstemplatetext = {
//     air: [
//         { name: 'Airline', value: 'airline' },
//         { name: 'Operating Airline', value: 'operating-airline' },
//         { name: 'Marketing Airline', value: 'marketing-airline' },
//         { name: 'Flight Number', value: 'flight-number' },
//         { name: 'Operating Flight Number', value: 'operating-flight-number' },
//         { name: 'Marketing Flight Number', value: 'marketing-flight-number' },
//         { name: 'Booking Class', value: 'booking-class' },
//         { name: 'Operating Booking Class', value: 'operating-booking-class' },
//         { name: 'Marketing Booking Class', value: 'marketing-booking-class' },
//         { name: 'Origin Airport', value: 'origin-airport' },
//         { name: 'Destination Airport', value: 'destination-airport' },
//         { name: 'Flown Class', value: 'flown-class' },
//         { name: 'Transaction Date', value: 'transaction-date' }
//     ],
//     nonair: [
//         { name: 'Transaction Date', value: 'transaction-date' },
//         { name: 'Location', value: 'location' },
//         { name: 'Partner', value: 'partner' },
//         { name: 'Activity Code', value: 'activity-code' },
//         { name: 'Volume', value: 'volume' },
//         { name: 'Activity Date', value: 'activity-date' }
//     ],
//     promotion: [
//         { name: 'Promotion Header Code', value: 'promotion-header-code' },
//         { name: 'Promotion Header Name', value: 'promotion-header-name' }
//     ]
// }

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
            optionstemplatetext: {},
            uniqueArray: [],
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },

            statementcode: (this.props.location.state && this.props.location.state.statementcode) ? this.props.location.state.statementcode : null,
            channelid: (this.props.location.state && this.props.location.state.channelid) ? this.props.location.state.channelid : null,
            channelname: (this.props.location.state && this.props.location.state.channelname) ? this.props.location.state.channelname : null,
            statementname: (this.props.location.state && this.props.location.state.statementname) ? this.props.location.state.statementname : "",
            statementtype: (this.props.location.state && this.props.location.state.statementtype) ? this.props.location.state.statementtype : "PROMOTION",
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        this.getStatementVariable();
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
                this.componentLanguageSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (statementtextcode, actionspage) => {
        let url = api.url.statementtext.list;
        let criteria = { statementtextcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let statementtext = result[0].statementtext ? result[0].statementtext : '';
                    let correctiontext = result[0].correctiontext ? result[0].correctiontext : '';
                    let updatestatementtext = result[0].updatestatementtext ? result[0].updatestatementtext : '';
                    let cancelstatementtext = result[0].cancelstatementtext ? result[0].cancelstatementtext : '';
                    let cancelcorrectiontext = result[0].cancelcorrectiontext ? result[0].cancelcorrectiontext : '';

                    let langcode = result[0].langcode ? result[0].langcode : null;
                    let langname = result[0].langname ? result[0].langname : null;
                    let isdefault = result[0].isdefault ? result[0].isdefault : false;

                    let setValue = { langcode, isdefault, statementtext, correctiontext, updatestatementtext, cancelstatementtext, cancelcorrectiontext };
                    this.props.form.setFieldsValue(setValue);

                    this.componentLanguageSelect.retrieveData({}, { langcode, langname }, actionspage);
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
        const { actionspage, channelid, statementcode, statementtype } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let langcode = input.langcode;
                let statementtext = input.statementtext;
                let correctiontext = input.correctiontext;
                let updatestatementtext = (statementtype !== 'AIR' && statementtype !== 'NONAIR') ? input.updatestatementtext : '-';
                let updatecorrectiontext = '-';
                let cancelstatementtext = input.cancelstatementtext;
                let cancelcorrectiontext = (statementtype !== 'AIR' && statementtype !== 'NONAIR') ? input.cancelcorrectiontext : '-';
                let isdefault = (input.isdefault) ? true : false;
                let channel = channelid;

                let data = { langcode, statementtext, correctiontext, updatestatementtext, updatecorrectiontext, cancelstatementtext, cancelcorrectiontext, isdefault, channel, statementcode };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.statementtext.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.statementtext.update;
                    data.statementtextcode = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    const { statementcode, statementname, statementtype, channelname } = this.state;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push({ pathname: '/statement/template-text', state: { statementcode, channelname, statementname, statementtype } });
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeDurationType = (event) => {
        let durationtype = event === null ? null : event.target.value;

        let fieldvalue = this.state.fieldvalue;
        this.setState({ fieldvalue: { ...fieldvalue, durationtype } });
    }

    getStatementVariable = () => {
        const { statementtype } = this.state;
        let url = api.url.statement.variable;
        let criteria = { statementtype };
        let paging = { limit: -1, page: 1 }
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    /** for filtering data from retrieve all */
                    // let variable = result.map((val) => val.statementtype);
                    // variable.filter(function (item, pos) {
                    //     return variable.indexOf(item) === pos;
                    // })
                    // const uniqueSet = new Set(variable);
                    // const uniqueArray = [...uniqueSet];
                    // let optionstemplatetext = {};
                    // let statement = null;
                    // let variable2 = null;
                    // for (let i = 0; i < uniqueArray.length; i++) {
                    //     statement = result.filter((val) => val.statementtype === uniqueArray[i])
                    //     variable2 = statement.map(obj => {
                    //         var result2 = {};
                    //         result2['name'] = obj.name;
                    //         result2['value'] = obj.value;
                    //         return result2;
                    //     })
                    //     optionstemplatetext = {
                    //         ...optionstemplatetext, [`${uniqueArray[i]}`]: variable2
                    //     }
                    // }
                    let variable2 = result.map(obj => {
                        var result2 = {};
                        result2['name'] = obj.name;
                        result2['value'] = obj.value;
                        return result2;
                    })
                    let optionstemplatetext = {[`${statementtype}`]: variable2 }
                    this.setState({ optionstemplatetext });
                }
            }
            this.setState({ isLoading: false });
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, optionstemplatetext, uniqueArray } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const { statementtype, statementcode, statementname, channelname } = this.state;

        var templateText = optionstemplatetext[`${statementtype}`];

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Statament Template Text | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} - {statementname} ({channelname})</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 1 }} xl={{ span: 18, offset: 1 }}>
                                    <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} form={this.props.form} labeltext="Language" datafield="langcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Is Default" datafield="isdefault" disabled={generalfielddisabled} />
                                    <TextAreaTag labeltext="Statament Text" datafield="statementtext" form={this.props.form} validationrules={['required', 'pattern.alphanumericspacebracketdash']} tags={templateText} disabled={generalfielddisabled} />
                                    <TextAreaTag labeltext="Correction Text" datafield="correctiontext" form={this.props.form} validationrules={['required', 'pattern.alphanumericspacebracketdash']} tags={templateText} disabled={generalfielddisabled} />
                                    {
                                        (statementtype !== 'AIR' && statementtype !== 'NONAIR') ?
                                            <TextAreaTag labeltext="Fee Update Statement Text" datafield="updatestatementtext" form={this.props.form} validationrules={['required', 'pattern.alphanumericspacebracketdash']} tags={templateText} disabled={generalfielddisabled} /> : null
                                    }
                                    <TextAreaTag labeltext="Cancel Statement Text" datafield="cancelstatementtext" form={this.props.form} validationrules={['required', 'pattern.alphanumericspacebracketdash']} tags={templateText} disabled={generalfielddisabled} />
                                    {
                                        (statementtype !== 'AIR' && statementtype !== 'NONAIR') ?
                                            <TextAreaTag labeltext="Fee Cancel Statement Text" datafield="cancelcorrectiontext" form={this.props.form} validationrules={['required', 'pattern.alphanumericspacebracketdash']} tags={templateText} disabled={generalfielddisabled} /> : null
                                    }
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
                                <Button url={{ pathname: '/statement/template-text', state: { statementcode, channelname, statementname, statementtype } }} htmlType="link" type="default" label="Back" />
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