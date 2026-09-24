import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { SelectBase, InputText, CurrencySelect, SwitchButton, DateRangeBase, Button, Alert } from '../../components/Base/BaseComponent';
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
                this.componentCurrencySelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (receipttypeid, actionspage) => {
        let url = api.url.receiptcatalogue.list;
        let criteria = { receipttypeid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let type = (result[0].type) ? result[0].type : null;
                    let receipttypename = (result[0].receipttypename) ? result[0].receipttypename : '';
                    let amount = (result[0].amount) ? result[0].amount.toString() : '';
                    let mileage = (result[0].mileage) ? result[0].mileage.toString() : '';
                    let duration = (result[0].duration) ? result[0].duration.toString() : '';
                    let currencycode = (result[0].currencycode) ? result[0].currencycode : null;
                    let currencyname = (result[0].currencyname) ? result[0].currencyname : null;
                    let includevat = (result[0].includevat) ? result[0].includevat : false;
                    let effectivedate = (result[0].effectivedate) ? moment(result[0].effectivedate) : null;
                    let discontinuedate = (result[0].discontinuedate) ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];

                    let setValue = { type, receipttypename, amount, mileage, duration, currencycode, includevat, date };
                    this.props.form.setFieldsValue(setValue);

                    //load options select2
                    this.componentCurrencySelect.retrieveData({}, { currencycode, currencyname }, actionspage);
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
                let type = input.type;
                let receipttypename = input.receipttypename;
                let currencycode = input.currencycode;
                let date = input.date;
                let effectivedate = (date && date[0]) ? moment(date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (date && date[1]) ? moment(date[1]).format("YYYY-MM-DD") : null;
                let duration = input.duration;
                let amount = input.amount;
                let mileage = input.mileage;
                let includevat = (input.includevat) ? 1 : 0;

                let data = { type, receipttypename, currencycode, effectivedate, discontinuedate, duration, amount, mileage, includevat };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.receiptcatalogue.create;
                } else {
                    let receipttypeid = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.receiptcatalogue.update;
                    data.receipttypeid = receipttypeid;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/receipt-catalogue');
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
        const optionsType = [
            { value: 'BUY_CARD', label: 'BUY CARD' },
            { value: 'BUY_MILEAGE', label: 'BUY MILEAGE' },
            { value: 'TIER_MILES', label: 'TIER MILES' },
            { value: 'MILEAGE_EXPIRY', label: 'MILEAGE EXPIRY' }
        ]

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Receipt Catalogue | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Receipt Catalogue</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Type" datafield="type" options={optionsType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Name" datafield="receipttypename" validationrules={['required', 'pattern.letterspace', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext="Currency" datafield="currencycode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Amount" datafield="amount" validationrules={['required', 'pattern.number', 'max.10']} maxLength={10} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Mileage" datafield="mileage" validationrules={['pattern.number', 'max.10']} maxLength={10} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Duration" datafield="duration" validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} suffix="Months" />
                                    <SwitchButton form={this.props.form} labeltext="Include VAT" datafield="includevat" validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
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
                                <Button url="/receipt-catalogue" htmlType="link" type="default" label="Back" />
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