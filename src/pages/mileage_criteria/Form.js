import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { TierSelect, DateRangeBase, InputNumberRange, RadioButton, Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const optionsMileageType = [
    { label: "Maintain", value: "MAINTAIN" },
    { label: "Upgrade", value: "UPGRADE" }
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

    getDetail = (mileagecriteriaid, actionspage) => {
        let url = api.url.mileagecriteria.list;
        let criteria = { mileagecriteriaid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let minmileage = (result[0].minmileage) ? result[0].minmileage : 0;
                    let maxmileage = (result[0].maxmileage) ? result[0].maxmileage : 0;
                    let mileage = { min: minmileage, max: maxmileage };
                    let minfrequency = (result[0].minfrequency) ? result[0].minfrequency : 0;
                    let maxfrequency = (result[0].maxfrequency) ? result[0].maxfrequency : 0;
                    let frequency = { min: minfrequency, max: maxfrequency };
                    let minage = (result[0].minage) ? result[0].minage : 0;
                    let maxage = (result[0].maxage) ? result[0].maxage : 0;
                    let age = { min: minage, max: maxage };
                    let type = (result[0].type) ? result[0].type : null;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let expireddate = (result[0].expireddate) ? moment(result[0].expireddate) : null;
                    let date = [effectivedate, expireddate];
                    let tierid = (result[0].tierid) ? result[0].tierid : null;
                    let tiername = (result[0].tiername) ? result[0].tiername : null;

                    let setValue = { tierid, date, type, mileage, frequency, age };
                    this.props.form.setFieldsValue(setValue);

                    // //load options select2
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
        this.props.form.validateFields((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let tierid = input.tierid;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let expireddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let type = input.type;
                let minmileage = input.mileage.min;
                let maxmileage = input.mileage.max;
                let minfrequency = input.frequency.min;
                let maxfrequency = input.frequency.max;
                let minage = input.age.min;
                let maxage = input.age.max;

                let data = { tierid, effectivedate, expireddate, type, minmileage, maxmileage, minfrequency, maxfrequency, minage, maxage };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.mileagecriteria.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.mileagecriteria.update;
                    data.mileagecriteriaid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/mileage-criteria');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Mileage Criteria | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Mileage Criteria</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={this.props.form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Expired Date']} validationrules={['required']} minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="Type" datafield="type" options={optionsMileageType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputNumberRange form={this.props.form} labeltext="Tier Miles" datafield='mileage' validationrules={['required', 'max.9']} maxLength={9} disabled={generalfielddisabled} />
                                    <InputNumberRange form={this.props.form} labeltext="Frequency" datafield='frequency' validationrules={['required', 'max.9']} maxLength={9} disabled={generalfielddisabled} />
                                    <InputNumberRange form={this.props.form} labeltext="Age" datafield='age' validationrules={['required', 'max.9']} maxLength={9} disabled={generalfielddisabled} />
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
                                <Button url="/mileage-criteria" htmlType="link" type="default" label="Back" />
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