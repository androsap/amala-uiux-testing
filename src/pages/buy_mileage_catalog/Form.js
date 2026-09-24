import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { Alert, InputText, Button, CustomTransactionSelect, SelectBase, TextArea, RadioButton, DateRangeBase, SwitchButton, ChannelCheckbox } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';
import { jsUcfirst } from '../../utilities/Helpers';
import { ExpirationPeriod, UnitType, PriceType } from '../../data';
import moment from 'moment';
import PriceTable from './price/Index';
import PriceForm from './price/Form';

const { Title } = Typography;

const optionsMileageType = [
    { label: 'Award Miles', value: 'AWARDMILES' },
    { label: 'Expired', value: 'EXPIRED' }
    // { label: 'Upgrade', value: 'UPGRADE' },
    // { label: 'Expiry', value: 'EXPIRY' },
    // { label: 'Trqansfer', value: 'TRANSFER' },
    // { label: 'Gift Card', value: 'GIFTCARD' }
];
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            titleformpage: 'Create',
            showpriceform: false,
            fieldvalue: {
                mileagetype: undefined,
                currencycode: null,
                buymileagepriceid: null,
                pricelist: [],
                actionsdetailpage: 'create',
                expired: false,
                basemileage: null,
                minmileage: null,
                maxmileage: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                numberofmilesdisabled: false
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
            } else this.componentCustomTrxSelect.retrieveData({ validforbuy: true });
        }
        this.componentChannelSelect.retrieveData();
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (buymileageid, actionspage) => {
        let url = api.url.buymileagecatalog.detail;
        let data = { buymileageid };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then(async (response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                const { pricetype, expirationperiod, timeperiodback, timeperiodnext, minmileage, maxmileage } = result || {};
                let buymileagechannel = (result.buymileagechannel) ? result.buymileagechannel.map(obj => obj.channelid) : [];
                let mileagetype = (result.mileagetype) ? result.mileagetype : null;
                let unittype = (result.unittype) ? result.unittype : null;
                let buymileagename = (result.buymileagename) ? result.buymileagename : null;
                let description = (result.description) ? result.description : undefined;
                let customtrxcode = result.customtrx.customtrxcode ? result.customtrx.customtrxcode : null;
                let basemileage = (result.basemileage) ? result.basemileage : null;
                let duration = (result.duration) ? result.duration : null;
                let includevat = (result.includevat) ? result.includevat : null;
                let startdate = (result.startdate) ? moment(result.startdate) : null;
                let enddate = (result.enddate) ? moment(result.enddate) : null;
                let date = [startdate, enddate];
                let pricelist = (result.prices.length) ? result.prices : [];

                let setValue = {
                    buymileagechannel, mileagetype, unittype, buymileagename, description, customtrxcode, basemileage,
                    duration, includevat, date, pricetype, expirationperiod, timeperiodback, timeperiodnext, minmileage, maxmileage
                };
                let fieldvalue = { pricelist, expired: mileagetype === 'EXPIRED' ? true : false, unittype: mileagetype === 'EXPIRED' ? pricetype : unittype, mileagetype };

                await this.setState({ fieldvalue });
                await this.props.form.setFieldsValue(setValue);

                this.componentCustomTrxSelect.retrieveData({ validforbuy: true });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                const { pricetype, expirationperiod, timeperiodback, timeperiodnext, minmileage, maxmileage } = input || {};
                let buymileagechannel = (input.buymileagechannel) ? input.buymileagechannel.map((obj, key) => { return ({ channelid: obj }) }) : [];
                let mileagetype = input.mileagetype;
                let unittype = input.unittype;
                let buymileagename = input.buymileagename;
                let description = (input.description) ? input.description : null;
                let customtrxcode = input.customtrxcode;
                let basemileage = input.basemileage;
                let duration = (input.duration) ? input.duration : null;
                let includevat = (input.includevat) ? input.includevat : false;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let prices = this.state.fieldvalue.pricelist.map((obj) => {
                    let paymenttype = obj.paymenttype;
                    let currencycode = obj.currencycode;
                    let miles = Number.parseFloat(obj.miles);
                    let price = Number.parseFloat(obj.price);
                    let startdate = obj.startdate;
                    let enddate = obj.enddate;
                    return { paymenttype, currencycode, miles, price, startdate, enddate };
                });

                let data = {
                    buymileagechannel, mileagetype, unittype, buymileagename, description, customtrxcode, basemileage, duration,
                    includevat, startdate, enddate, pricetype, expirationperiod, timeperiodback, timeperiodnext, minmileage, maxmileage
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.buymileagecatalog.create;
                    data.prices = prices;
                } else {
                    message = 'Data has been updated';
                    url = api.url.buymileagecatalog.update;
                    data.buymileageid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/buy-mileage-catalog');
                    } else Alert.error(responsemessage);
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    handleOpenModal = () => {
        const { unittype, mileagetype } = this.state.fieldvalue;
        const date = this.props.form.getFieldValue('date');
        if (mileagetype !== undefined && unittype !== undefined && date !== undefined) {
            this.setState({ showpriceform: true });
        } else {
            Alert.information('Please choose Mileage Type, Date and Unit Type / Price Type')
        }
    }

    handleCloseModal = () => {
        this.setState({ showpriceform: false });
    }

    handleCancel = () => {
        const fieldvalue = { ...this.state.fieldvalue, buymileagepriceid: null };
        this.setState({ showpriceform: false, fieldvalue });
    };

    handleRefresh = () => {
        this.setState({ loading: true });

        const buymileageid = this.props.match.params.ID;
        const url = api.url.buymileagecatalog.detail;
        DetailRequest(url, { buymileageid }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                this.setState({ fieldvalue: { ...this.state.fieldvalue, pricelist: (result.prices.length) ? result.prices : [] } });
            } else Alert.error(status.responsemessage);
        });
        this.setState({ loading: false });
    };

    setTitlePage = (titleformpage) => {
        this.setState({ titleformpage });
    }

    handleSavePrice = (actionspricepage, value) => {
        const { actionspage } = this.state;
        if (actionspage === 'create') {
            if (actionspricepage === 'create') {
                let pricelist = { pricelist: [...this.state.fieldvalue.pricelist, value] };
                let fieldvalue = { ...this.state.fieldvalue, ...pricelist };

                /* save price list and hide price form modal */
                this.setState({ fieldvalue, showpriceform: false });
            } else if (actionspricepage === 'update') {
                let { buymileagepriceid, pricelist } = this.state.fieldvalue;

                pricelist = pricelist.map((obj, key) => {
                    if (obj.buymileagepriceid === buymileagepriceid) { obj = value }
                    return obj;
                });

                let fieldvalue = { ...this.state.fieldvalue, pricelist };
                /* save price list and hide price form modal */
                this.setState({ fieldvalue, showpriceform: false });
            }
        }
    }

    handleChannelChange = (channel) => {
        let fieldvalue = { ...this.state.fieldvalue, channel };
        this.setState({ fieldvalue });

        this.props.form.setFieldsValue({ partnercode: undefined });
    }

    handleTypeChange = (event) => {
        let unittype = (event === null) ? null : event.target.value;
        let numberofmilesdisabled = (unittype === 'PIECE') ? true : false;

        let fieldvalue = { ...this.state.fieldvalue, unittype };
        let fielddisabled = { ...this.state.fielddisabled, numberofmilesdisabled };
        this.setState({ fieldvalue, fielddisabled });

        if (unittype === 'PIECE') this.props.form.setFieldsValue({ basemileage: 1 });
    }

    handleForValidation = (rule, value, callback) => {
        const unittype = this.state.fieldvalue.unittype;
        const { field } = rule;
        const type = (field === 'basemileage') ? 'Number of Miles' : (field === 'maxmileage') ? 'Max Miles' :
            (field === 'timeperiodback') ? 'Time Period Back' : 'Time Period Next';

        if (unittype === 'PACKAGE' && value && value <= 1) {
            callback('Number of Miles must be greater than 1');
        } else if (value === 0 && value) callback(`${type} must be greater than 0`);

        callback();
    }

    handleEditPrice = (buymileagepriceid) => {
        let fieldvalue = { ...this.state.fieldvalue, buymileagepriceid };
        this.setState({ showpriceform: true, fieldvalue });
    }

    handleDeletePrice = (buymileagepriceid) => {
        let { pricelist } = this.state.fieldvalue;
        pricelist = pricelist.filter(obj => obj.buymileagepriceid !== buymileagepriceid);
        this.setState({ fieldvalue: { ...this.state.fieldvalue, pricelist } });
    }

    handleMileageType = (mileagetype) => {
        this.props.form.resetFields(['pricetype', 'unittype', []]);
        this.setState({ fieldvalue: { ...this.state.fieldvalue, expired: mileagetype === 'EXPIRED' ? true : false, mileagetype, prictype: undefined, unittype: undefined } });
    }

    handleMiles = (type) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, [type]: Number(this.props.form.getFieldValue(`${type}`)) } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 7 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 17 } }
        };
        const { titlepage, actionspage, formrender, showpriceform, titleformpage } = this.state;
        const { pricelist, unittype, buymileagepriceid, expired, mileagetype } = this.state.fieldvalue;
        const { generalfielddisabled, specialfielddisabled, numberofmilesdisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const buymileageid = this.props.match.params.ID;
        const basemileage = (this.props.form.getFieldValue('basemileage') !== undefined) ? Number(this.props.form.getFieldValue('basemileage')) : null;
        const maxmileage = (this.props.form.getFieldValue('maxmileage') !== undefined) ? Number(this.props.form.getFieldValue('maxmileage')) : null;
        const date = (this.props.form.getFieldValue('date') !== undefined) ? this.props.form.getFieldValue('date') : null;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Buy Mileage Catalog | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Buy Mileage Catalog</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Modal visible={showpriceform} title={titleformpage + " Price"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                        <PriceForm menucode={menucode} prefixmenuname={prefixmenuname} buymileageid={buymileageid} buymileagepriceid={buymileagepriceid} datasource={pricelist} actionspage={actionspage} handleSavePrice={this.handleSavePrice}
                            handleRefresh={this.handleRefresh} handleClose={this.handleCloseModal} setTitlePage={this.setTitlePage} unittype={unittype} basemileage={basemileage} maxmileage={maxmileage} mileagetype={mileagetype} date={date} />
                    </Modal>
                    <Spin spinning={this.state.loading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <ChannelCheckbox ref={(e) => { this.componentChannelSelect = e }} mode='multiple' form={this.props.form} labeltext='Channel' datafield='buymileagechannel' validationrules={['required']} disabled={generalfielddisabled} />
                                    <SelectBase labeltext="Mileage Type" datafield="mileagetype" form={this.props.form} options={optionsMileageType} validationrules={['required']} onChange={this.handleMileageType} disabled={generalfielddisabled} />
                                    <RadioButton className={(expired) ? 'hidden' : ''} labeltext="Unit Type" datafield="unittype" form={this.props.form} options={UnitType} validationrules={(expired) ? [] : ['required']} onChange={this.handleTypeChange} disabled={generalfielddisabled} />
                                    <RadioButton className={(expired) ? '' : 'hidden'} labeltext="Price Type" datafield="pricetype" form={this.props.form} options={PriceType} validationrules={(expired) ? ['required'] : []} onChange={this.handleTypeChange} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Catalogue Name" datafield="buymileagename" validationrules={['required']} maxLength={50} disabled={generalfielddisabled} />
                                    <TextArea form={this.props.form} labeltext="Description" datafield="description" disabled={generalfielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTrxSelect = e }} form={this.props.form} labeltext="Custom Transaction" datafield="customtrxcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Number of Miles" datafield="basemileage" suffix={(unittype === 'MULTIPLIER' || unittype === 'MANUAL') ? 'Miles' : (unittype) ? jsUcfirst(unittype) : ''}
                                        validationrules={['required', 'pattern.number', this.handleForValidation]} disabled={(actionspage === 'create') ? numberofmilesdisabled : (expired ? specialfielddisabled : generalfielddisabled)} onChange={() => this.handleMiles('basemileage')} />
                                    {(unittype === 'MANUAL') ? <Col>
                                        <InputText form={this.props.form} labeltext="Min Miles" datafield="minmileage" validationrules={['required', 'pattern.number', this.handleForValidation]} disabled={true} defaultValue={basemileage} />
                                        <InputText form={this.props.form} labeltext="Max Miles" datafield="maxmileage" validationrules={['required', 'pattern.number', this.handleForValidation]} onChange={() => this.handleMiles('maxmileage')} disabled={(expired ? specialfielddisabled : generalfielddisabled)} />
                                    </Col> : ''
                                    }
                                    <RadioButton className={(expired) ? '' : 'hidden'} labeltext="Expiration Period" datafield="expirationperiod" form={this.props.form} options={ExpirationPeriod} validationrules={(expired) ? ['required'] : []} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} className={(expired) ? '' : 'hidden'} labeltext="Time Period Back" datafield="timeperiodback" validationrules={(expired) ? ['required', this.handleForValidation] : []} disabled={numberofmilesdisabled} />
                                    <InputText form={this.props.form} className={(expired) ? '' : 'hidden'} labeltext="Time Period Next" datafield="timeperiodnext" validationrules={(expired) ? ['required', this.handleForValidation] : []} disabled={numberofmilesdisabled} />
                                    <InputText form={this.props.form} className={(expired) ? 'hidden' : ''} labeltext="Duration" datafield="duration" suffix="Month(s)" validationrules={(expired) ? [] : ['pattern.number']} maxLength={10} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Include VAT" datafield="includevat" disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment().add(1, 'days')} disabled={generalfielddisabled} />
                                    <Form.Item label="Price">
                                        <Button htmlType="button" type="primary" size="default" label="Setup Price" onClick={() => this.handleOpenModal()} />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }}>
                                    <PriceTable {...this.props} datasource={pricelist} actionspage={actionspage} handleRefresh={this.handleRefresh} handleEditPrice={this.handleEditPrice} handleDelete={this.handleDeletePrice} unittype={unittype} />
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
                                <Button url="/buy-mileage-catalog" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
