import React, { Component } from 'react';
import { DetailRequest, SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { InputText, TextArea, AwardTypeSelect, ChannelCheckbox, RadioButton, StatementSelect, DatePickerBase, DateRangeBase, SwitchButton, Button, Alert, SelectBase, CustomTransactionSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, message } from 'antd';
import { PricingBy, PricingByNonAir, IssuedFrom } from '../../../data';
import ErrorGeneral from '../../error/ErrorGeneral';
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
                daysfrom: null,
                unlimited: false,
                awardcode: null,
                categorycode: null,
                name: ''
            },
            fielddisabled: {
                buttonfielddisabled: false,
                specialfielddisabled: false,
                generalfielddisabled: false,
                startdatefielddisabled: false
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
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentAwardTypeSelect.retrieveData();
                this.componentChannelSelect.retrieveData();
                this.componentStatementSelect.retrieveData({ statementtype: 'REDEMPTION' });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (awardcode, actionspage) => {
        let url = api.url.awardmaster.detailbasicinfo;
        let data = { awardcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                let awardcode = (result.awardcode) ? result.awardcode : undefined;
                let awardtypecode = (result.awardtypecode) ? result.awardtypecode : undefined;
                let categorytype = (result.categorytype) ? result.categorytype : undefined;
                let categorycode = (result.categorycode) ? result.categorycode : undefined;
                let name = (result.name) ? result.name : undefined;
                let description = (result.description) ? result.description : undefined;
                let unlimited = (result.unlimited) ? result.unlimited : false;
                let startdate = (result.startdate) ? moment(result.startdate) : false;
                let enddate = (result.enddate) ? moment(result.enddate) : false;
                let date = [startdate, enddate];
                let issuedfrom = (result.issuedfrom) ? result.issuedfrom : false;
                let daysfrom = (result.daysfrom) ? result.daysfrom : undefined;
                let vouchervalidityday = (result.vouchervalidity) ? result.vouchervalidity.toString() : undefined;
                let voucherstartvalidity = (result.voucherstartvalidity) ? moment(result.voucherstartvalidity) : null;
                let voucherendvalidity = (result.voucherendvalidity) ? moment(result.voucherendvalidity) : null;
                let vouchervaliditydate = [voucherstartvalidity, voucherendvalidity];
                let statementcode = (result.statementcode) ? result.statementcode : undefined;
                let statementname = (result.statementname) ? result.statementname : undefined;
                let checkpeakseason = (result.checkpeakseason) ? result.checkpeakseason : false;
                let checkblackout = (result.checkblackout) ? result.checkblackout : false;
                let maxperson = (result.maxperson) ? result.maxperson.toString() : undefined;
                let awardchannel = (result.awardchannel) ? result.awardchannel.map((obj) => { return obj.channelid }) : [];
                let pricingbyair = (categorytype === 'AIR') ? result.pricingby : undefined;
                let pricingbynonair = (categorytype === 'NONAIR') ? result.pricingby : undefined;
                let cardnumber = (result.cardnumber) ? result.cardnumber.toString() : undefined;
                let customtrxcode = (result.customtrxcode) ? result.customtrxcode : undefined;
                let usevoucher = (result.usevoucher) ? result.usevoucher : false;

                let setValue = { awardcode, awardtypecode, categorytype, name, description, unlimited, date, startdate, issuedfrom, daysfrom, statementcode, pricingbyair, pricingbynonair, checkpeakseason, checkblackout, maxperson, awardchannel, vouchervalidityday, vouchervaliditydate, cardnumber, customtrxcode, usevoucher };
                this.props.form.setFieldsValue(setValue);

                this.setState({ fieldvalue: { ...this.fieldvalue, unlimited, categorytype, daysfrom, categorycode } });

                if (categorycode === 'TRANSFER') {
                    this.componentCustomTransactionSelect.retrieveData();
                    this.getRecipientCardNumber()
                };
                this.componentAwardTypeSelect.retrieveData();
                this.componentChannelSelect.retrieveData();
                this.componentStatementSelect.retrieveData({ statementtype: 'REDEMPTION' }, { statementcode, statementname }, actionspage);
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    getRecipientCardNumber = (value) => {
        let cardnumber = this.props.form.getFieldValue('cardnumber')
        RetrieveRequest(api.url.member.list, { cardnumber }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (value === 'fromButton') {
                    message.loading('Loading...', 0.5);
                    setTimeout(() => {
                        if (status.responsemessage === '') {
                            if (cardnumber === '' || cardnumber === undefined || result.length === 0) {
                                message.error(result.length === 0 ? 'Member not found, Please input another Cardnumber' : 'Please input the Cardnumber');
                            } else if (result[0].memberstatus !== 'ACTIVE') {
                                message.error(`This member status is ${result[0].memberstatus}, please input another Cardnumber`);
                            } else {
                                message.success('Recipient cardnumber added');
                            }
                        } else {
                            message.success(status.responsemessage)
                        }
                    }, 1000);
                }
                this.setState({
                    fieldvalue: { ...this.state.fieldvalue, name: (cardnumber === '' || cardnumber === undefined) || result.length === 0 || result[0].memberstatus !== 'ACTIVE' ? '' : result[0].name },
                    fielddisabled: { ...this.state.fielddisabled, buttonfielddisabled: true }
                });
                setTimeout(() => { this.setState({ fielddisabled: { ...this.state.fielddisabled, buttonfielddisabled: false } }) }, 1000);
            } else {
                message.error(status.responsemessage)
            }
        })
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                const { categorycode } = this.state.fieldvalue;
                let awardcode = input.awardcode.toUpperCase();
                let awardtypecode = (input.awardtypecode) ? input.awardtypecode : null;
                let categorytype = input.categorytype;
                let name = input.name;
                let description = input.description;
                let unlimited = (input.unlimited) ? true : false;
                let startdate = null;
                let enddate = null;
                if (unlimited) {
                    startdate = (input.startdate) ? moment(input.startdate).format("YYYY-MM-DD") : null;
                } else {
                    startdate = (input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                    enddate = (input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                }
                let awardchannel = (input.awardchannel) ? input.awardchannel.map((obj, key) => { return { channelid: obj } }) : null;
                let issuedfrom = input.issuedfrom;
                let daysfrom = input.daysfrom;
                let vouchervalidity = (daysfrom === 'ISSUED_DATE') ? input.vouchervalidityday : null;
                let voucherstartvalidity = (daysfrom === 'DATE_RANGE') ? (input.vouchervaliditydate && input.vouchervaliditydate[0]) ? moment(input.vouchervaliditydate[0]).format("YYYY-MM-DD") : null : null;
                let voucherendvalidity = (daysfrom === 'DATE_RANGE') ? (input.vouchervaliditydate && input.vouchervaliditydate[1]) ? moment(input.vouchervaliditydate[1]).format("YYYY-MM-DD") : null : null;
                let statementcode = input.statementcode.split("|SPLIT|")[0];
                let maxperson = (categorytype === 'AIR' && input.maxperson !== undefined) ? input.maxperson : null;
                let checkpeakseason = (input.checkpeakseason) ? true : false;
                let checkblackout = (input.checkblackout) ? true : false;
                let usevoucher = (input.usevoucher) ? true : false;
                let pricingby = (categorytype === 'AIR') ? input.pricingbyair : input.pricingbynonair;
                let cardnumber = (categorycode === 'TRANSFER' && input.cardnumber) ? input.cardnumber : null;
                let customtrxcode = (categorycode === 'TRANSFER' && input.customtrxcode) ? input.customtrxcode : null;

                let data = { awardcode, awardtypecode, categorytype, name, description, unlimited, startdate, enddate, awardchannel, issuedfrom, vouchervalidity, voucherstartvalidity, voucherendvalidity, daysfrom, usevoucher, statementcode, maxperson, checkpeakseason, checkblackout, pricingby, cardnumber, customtrxcode };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    data.awardstatus = 'NOTREADY';
                    message = 'New data has been created';
                    url = api.url.awardmaster.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.awardmaster.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/award-list');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeAwardType = (awardtypecode) => {
        let categorytype = this.componentAwardTypeSelect.getCategoryType(awardtypecode);
        let categorycode = this.componentAwardTypeSelect.getCategoryCode(awardtypecode);
        let pricingbynonair = (categorycode === 'HOTEL') ? 'FIXED' : null;
        if (categorycode === 'TRANSFER') this.componentCustomTransactionSelect.retrieveData();
        let daysfrom = undefined;
        this.props.form.setFieldsValue({ daysfrom, categorytype, pricingbynonair });
        this.setState({ fieldvalue: { ...this.state.fieldvalue, daysfrom, categorytype, categorycode } });
    }

    onChangeUnlimitedDate = (value) => {
        let unlimited = value;
        this.props.form.setFieldsValue({ date: undefined, startdate: undefined })
        this.setState({ fieldvalue: { ...this.state.fieldvalue, unlimited } });
    }

    handleDaysFromChange = (daysfrom) => {
        let vouchervalidityday = undefined;
        let vouchervaliditydate = undefined;
        this.props.form.setFieldsValue({ vouchervalidityday, vouchervaliditydate });
        this.setState({ fieldvalue: { ...this.state.fieldvalue, daysfrom } });
    }

    handleValidationTrfFactor = (rule, value, callback) => {
        if (value && value < 1) { callback('Transfer Factor must start from 1'); }
        else if (value && value > 100) { callback('Maximum Transfer Factor is 100'); }
        callback();
    }

    handleCode = (rule, value, callback) => {
        var result = value.match(" ");
        if (result && result.length > 0) {
            callback("Code not allowed space");
        }
        callback();
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { buttonfielddisabled, specialfielddisabled, generalfielddisabled, startdatefielddisabled } = this.state.fielddisabled;
        const { unlimited, categorytype, daysfrom, categorycode, name } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        let optionsDaysFrom = [
            { label: 'Issue Date', value: 'ISSUED_DATE' },
            { label: 'Date Range', value: 'DATE_RANGE' },
            { label: 'Unlimited', value: 'UNLIMITED' },
        ];

        if (categorytype === 'AIR') {
            optionsDaysFrom = [
                { label: 'Unlimited', value: 'UNLIMITED' },
            ];
        } else if (categorytype === 'NONAIR') {
            optionsDaysFrom = [
                { label: 'Issue Date', value: 'ISSUED_DATE' },
                { label: 'Date Range', value: 'DATE_RANGE' },
                { label: 'Unlimited', value: 'UNLIMITED' },
            ];
        }

        let validationawardcode = (actionspage === 'create') ? ['required', 'max.20', 'pattern.alphanumeric'] : ['required', 'max.20'];

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Award | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Award</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                    <InputText form={this.props.form} labeltext="Code" datafield="awardcode" validationrules={validationawardcode} maxLength={20} disabled={specialfielddisabled} />
                                    <AwardTypeSelect ref={(e) => { this.componentAwardTypeSelect = e }} form={this.props.form} labeltext="Award Type" datafield="awardtypecode" validationrules={['required']} onChange={(e) => this.onChangeAwardType(e)} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Category Type" datafield="categorytype" validationrules={['required', 'max.50']} maxLength={50} disabled={true} />
                                    <InputText form={this.props.form} labeltext="Name" datafield="name" validationrules={['required', 'max.50',]} maxLength={50} disabled={generalfielddisabled} />
                                    <TextArea form={this.props.form} labeltext="Description" datafield="description" validationrules={['required', 'max.255',]} maxLength={255} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Unlimited Date" datafield="unlimited" onChange={this.onChangeUnlimitedDate} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" className={(unlimited) ? 'hidden' : ''} placeholder={['Start Date', 'End Date']} minDate={moment()} validationrules={(!unlimited) ? ['required'] : null} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Start Date" datafield="startdate" className={(!unlimited) ? 'hidden' : ''} validationrules={(unlimited) ? ['required'] : null} minDate={moment()} disabled={startdatefielddisabled} />
                                    <ChannelCheckbox ref={(e) => { this.componentChannelSelect = e }} mode="multiple" form={this.props.form} labeltext="Place of Issue" datafield="awardchannel" validationrules={['required']} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext="Certificate Form" datafield="issuedfrom" validationrules={['required']} options={IssuedFrom} disabled={generalfielddisabled} />
                                    <Row gutter={6}>
                                        <Col className="gutter-row" xl={14} md={14} sm={24} >
                                            <SelectBase labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} form={this.props.form} placeholder="Days From" labeltext="Certificate Validity" datafield="daysfrom" validationrules={['required']} options={optionsDaysFrom} onChange={this.handleDaysFromChange} disabled={generalfielddisabled} />
                                        </Col>
                                        <Col className="gutter-row" xl={10} md={10} sm={24} >
                                            <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="vouchervalidityday" placeholder="Certificate Validity" className={(daysfrom === 'ISSUED_DATE') ? '' : 'hidden'} validationrules={(daysfrom === 'ISSUED_DATE') ? ['required', 'pattern.number', 'max.20'] : []} maxLength={20} disabled={generalfielddisabled} suffix="Days" />
                                            <DateRangeBase wrapperCol={{ span: 24 }} form={this.props.form} datafield="vouchervaliditydate" placeholder={['Start Date', 'End Date']} className={(daysfrom === 'DATE_RANGE') ? '' : 'hidden'} minDate={moment()} validationrules={(daysfrom === 'DATE_RANGE') ? ['required'] : []} disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <SwitchButton form={this.props.form} labeltext="Use Voucher" datafield="usevoucher" disabled={generalfielddisabled} />
                                    <StatementSelect ref={(e) => { this.componentStatementSelect = e }} form={this.props.form} labeltext="Statement" datafield="statementcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Max Person" className={(categorytype === 'AIR') ? '' : 'hidden'} datafield="maxperson" validationrules={(categorytype === 'AIR') ? ['required', 'pattern.number', 'max.1'] : []} maxLength={1} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} className={(categorytype === 'AIR') ? '' : 'hidden'} labeltext="Check Peak Season" datafield="checkpeakseason" disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} className={(categorytype === 'AIR') ? '' : 'hidden'} labeltext="Check Black Out" datafield="checkblackout" disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} className={(categorytype === 'AIR') ? '' : 'hidden'} labeltext="Pricing By" datafield="pricingbyair" validationrules={(categorytype === 'AIR') ? ['required'] : []} options={PricingBy} disabled={generalfielddisabled} />
                                    {
                                        (categorytype === 'NONAIR' && categorycode === 'HOTEL') ?
                                            <InputText form={this.props.form} labeltext="Pricing By" datafield="pricingbynonair" disabled={true} />
                                            : <RadioButton form={this.props.form} className={(categorytype === 'NONAIR') ? '' : 'hidden'} labeltext="Pricing By" datafield="pricingbynonair" validationrules={(categorytype === 'NONAIR') ? ['required'] : []} options={PricingByNonAir} disabled={specialfielddisabled} />
                                    }
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} form={this.props.form} labeltext="Recipient Custom Transaction" datafield="customtrxcode" className={(categorycode === 'TRANSFER') ? '' : 'hidden'} validationrules={(categorycode === 'TRANSFER') ? ['required'] : []} disabled={generalfielddisabled} />
                                    <Row gutter={24} className={(categorycode === 'TRANSFER') ? '' : 'hidden'} type='flex' justify='center' align='top'>
                                        <Col className="gutter-row" xl={14} md={14} sm={24} >
                                            <InputText labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} form={this.props.form} labeltext="Recipient Card Number" datafield="cardnumber" validationrules={(categorycode === 'TRANSFER') ? ['required', 'pattern.number', 'max.50'] : []} maxLength={50} disabled={generalfielddisabled} />
                                        </Col>
                                        <Col className="gutter-row" xl={2} md={10} sm={24} style={{ lineHeight: '36px', paddingLeft: -30 }} >
                                            <Button htmlType='button' type='primary' label='Search' onClick={() => this.getRecipientCardNumber('fromButton')} disabled={buttonfielddisabled} />
                                        </Col>
                                        <Col className="gutter-row" xl={8} md={10} sm={24} style={{ lineHeight: '17px', paddingLeft: 30 }} >
                                            <span>{name}</span>
                                        </Col>
                                    </Row>
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
                                <Button url="/award-list" htmlType="link" type="default" label="Back" />
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