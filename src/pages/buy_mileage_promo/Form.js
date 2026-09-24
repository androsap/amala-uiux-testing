/**
 * @author Muhamad Humam
 * @email muhamadhumamm17@gmail.com
 * @create date 2020-07-22 14:39:58
 * @modify date 2020-07-25 11:18:43
 * @desc Features to manage the promo that is in the buy mileage feature
 */

import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, SelectBase, SwitchButton, BuyMileageCatalogSelect, TierSelect, PartnerSelect, DateRangeBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';
import moment from 'moment';
import PriceForm from './price/Form';
import PriceTable from './price/Index';

const { Title } = Typography;

/* options for dropdown */
const optionsUnitType = [
    { label: 'Piece', value: 'PIECE' },
    { label: 'Package', value: 'PACKAGE' }
];
const optionsPromoType = [
    { label: 'Discount', value: 'DISCOUNT' },
    { label: 'Fixed', value: 'FIXED' }
];
const optionsMileageType = [
    { label: 'Award Miles', value: 'AWARDMILES' },
    { label: 'Tier Upgrade', value: 'TIER_UPGRADE' },
    { label: 'Expiry', value: 'EXPIRY' },
    { label: 'Transfer', value: 'TRANSFER' },
    { label: 'Gift Card', value: 'GIFTCARD' },
    { label: 'Buy Card', value: 'BUY_CARD' }
];

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
            showpriceform: false,
            titleformpage: 'Create',
            fieldvalue: {
                promopriceid: null,
                pricelist: [],
                promotype: null,
                forallcatalog: null,
                foralltier: null,
                forallpartner: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                amountfielddisabled: true
            }
        }

        this.handleSavePrice = this.handleSavePrice.bind(this);
        this.handleEditPrice = this.handleEditPrice.bind(this);
        this.handleDeletePrice = this.handleDeletePrice.bind(this);
        this.setTitlePage = this.setTitlePage.bind(this);
        this.handleHidePriceForm = this.handleHidePriceForm.bind(this);
        this.handleRefreshData = this.handleRefreshData.bind(this);
    }

    checkPermission() {
        const id = this.props.match.params.ID;
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
                this.componentCatalogSelect.retrieveData();
                this.componentTierSelect.retrieveData();
                this.componentPartnerSelect.retrieveData({ active: true });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }


    getDetail = (promoid, actionspage) => {
        let url = api.url.buymileagepromo.detail;
        let data = { promoid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let promoid = (result.promoid) ? result.promoid : null;
                let promoname = (result.promoname) ? result.promoname : null;
                let mileagetype = (result.promoname) ? result.mileagetype : null;
                let mileageunittype = (result.mileageunittype) ? result.mileageunittype : null;
                let promotype = (result.promotype) ? result.promotype : null;
                let amount = (result.amount !== undefined && result.amount !== null) ? result.amount : null;
                let startdate = (result.startdate) ? moment(result.startdate) : null;
                let enddate = (result.enddate) ? moment(result.enddate) : null;
                let date = [startdate, enddate];
                let forallcatalog = (result.forallcatalog) ? result.forallcatalog : false;
                let foralltier = (result.foralltier) ? result.foralltier : false;
                let forallpartner = (result.forallpartner) ? result.forallpartner : false;
                let partners = (result.partners) ? result.partners.map((obj, key) => { return obj.partnercode }) : [];
                let tiers = (result.tiers) ? result.tiers.map((obj, key) => { return obj.tierid }) : [];
                let catalogs = (result.catalogs) ? result.catalogs.map((obj, key) => { return obj.buymileageid }) : [];
                let pricelist = (result.prices) ? result.prices.filter(obj => obj.active === true) : [];

                let setValue = { promoid, promoname, mileagetype, mileageunittype, promotype, amount, date, forallcatalog, foralltier, forallpartner, catalogs, tiers, partners };
                this.props.form.setFieldsValue(setValue);

                const amountfielddisabled = (promotype === undefined || promotype === 'FIXED') ? true : false;
                const fielddisabled = { ...this.state.fielddisabled, amountfielddisabled };

                this.setState({ fieldvalue: { ...this.state.fieldvalue, pricelist, promotype }, fielddisabled });

                this.componentCatalogSelect.retrieveData();
                this.componentTierSelect.retrieveData();
                this.componentPartnerSelect.retrieveData({ active: true });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage, fieldvalue } = this.state;
        const { pricelist } = fieldvalue

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                let promoid = (input.promoid) ? input.promoid : null;
                let promoname = (input.promoname) ? input.promoname : null;
                let mileagetype = (input.mileagetype) ? input.mileagetype : null;
                let mileageunittype = (input.mileageunittype) ? input.mileageunittype : null;
                let forallcatalog = (input.forallcatalog) ? true : false;
                let foralltier = (input.foralltier) ? true : false;
                let forallpartner = (input.forallpartner) ? true : false;
                let promotype = (input.promotype) ? input.promotype : null;
                let amount = (input.amount && (input.amount !== undefined || input.amount !== null)) ? input.amount : null;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let catalogs = (input.catalogs) ? input.catalogs : [];
                let tiers = (input.tiers) ? input.tiers : [];
                let partners = (input.partners) ? input.partners : [];
                let prices = pricelist.map((obj, key) => {
                    let currencycode = obj.currencycode;
                    let price = Number.parseFloat(obj.price);
                    let startdate = obj.startdate;
                    let enddate = obj.enddate;
                    return { currencycode, price, startdate, enddate };
                });

                let data = { promoid, promoname, mileagetype, mileageunittype, forallcatalog, foralltier, forallpartner, promotype, amount, startdate, enddate, catalogs, tiers, partners };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.buymileagepromo.create;
                    data.prices = prices;
                } else {
                    message = 'Data has been updated';
                    url = api.url.buymileagepromo.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/buy-mileage-promo');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handlePromoTypeChange = (promotype) => {
        /* reset amount */
        this.props.form.setFieldsValue({ amount: undefined });

        /*
            if promotype fixed or null, amount is null and field disabled,
            if promotype is discount, amount is mandatory and field enable and Setup Price disabled
        */

        const amountfielddisabled = (promotype === undefined || promotype === 'FIXED') ? true : false;

        const fielddisabled = { ...this.state.fielddisabled, amountfielddisabled };
        const fieldvalue = { ...this.state.fieldvalue, promotype };
        this.setState({ fieldvalue, fielddisabled });
    }

    handleAllCatalog = () => {
        this.props.form.setFieldsValue({ catalogs: undefined });
    }

    handleAllTier = () => {
        this.props.form.setFieldsValue({ tiers: undefined });
    }

    handleAllPartner = () => {
        this.props.form.setFieldsValue({ partners: undefined });
    }

    handleOpenModal = () => {
        this.setState({ showpriceform: true });
    }

    handleCancel = () => {
        const fieldvalue = { ...this.state.fieldvalue, promopriceid: null };
        this.setState({ showpriceform: false, fieldvalue });
    }

    handleRefreshData = () => {
        this.checkPermission();
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
                let { promopriceid, pricelist } = this.state.fieldvalue;

                pricelist = pricelist.map((obj, key) => {
                    if (obj.promopriceid === promopriceid) { obj = value }
                    return obj;
                });

                let fieldvalue = { ...this.state.fieldvalue, pricelist };
                /* save price list and hide price form modal */
                this.setState({ fieldvalue, showpriceform: false });
            }
        }
    }

    handleDeletePrice = (promopriceid) => {
        let { pricelist } = this.state.fieldvalue;
        pricelist = pricelist.filter(obj => obj.promopriceid !== promopriceid);
        this.setState({ fieldvalue: { ...this.state.fieldvalue, pricelist } });
    }

    handleEditPrice = (promopriceid) => {
        let fieldvalue = { ...this.state.fieldvalue, promopriceid };
        this.setState({ showpriceform: true, fieldvalue });
    }

    setTitlePage = (titleformpage) => {
        this.setState({ titleformpage });
    }

    handleHidePriceForm = () => {
        this.setState({ showpriceform: false });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, showpriceform, fieldvalue, titleformpage } = this.state;
        const { promotype, pricelist, promopriceid } = fieldvalue;
        const { specialfielddisabled, generalfielddisabled, amountfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const promoid = this.props.match.params.ID;

        const forallcatalog = this.props.form.getFieldValue('forallcatalog');
        const foralltier = this.props.form.getFieldValue('foralltier');
        const forallpartner = this.props.form.getFieldValue('forallpartner');
        const mileagetype = this.props.form.getFieldValue('mileagetype');

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Buy Mileage Promo | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Modal visible={showpriceform} title={titleformpage + " Price"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                        <PriceForm menucode={menucode} prefixmenuname={prefixmenuname} promoid={promoid} promopriceid={promopriceid} datasource={pricelist} actionspage={actionspage} handleRefreshData={this.handleRefreshData} handleSavePrice={this.handleSavePrice} onCloseModal={this.handleHidePriceForm} setTitlePage={this.setTitlePage} />
                    </Modal>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Buy Mileage Promo</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Promo Code" datafield="promoid" validationrules={['required', 'pattern.alphanumeric']} maxLength={20} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Promo Name" datafield="promoname" validationrules={['required']} maxLength={20} disabled={generalfielddisabled} />
                                    <SelectBase labeltext="Mileage Type" datafield="mileagetype" form={this.props.form} options={optionsMileageType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SelectBase labeltext="Mileage Unit Type" datafield="mileageunittype" form={this.props.form} options={optionsUnitType} validationrules={(mileagetype === 'AWARDMILES') ? ['required'] : []} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="For All Catalog" datafield="forallcatalog" onChange={this.handleAllCatalog} disabled={generalfielddisabled} />
                                    <BuyMileageCatalogSelect wrapperCol={{ span: 16, offset: 8 }} style={{ display: (forallcatalog) ? 'none' : 'block' }} mode="multiple" ref={(e) => { this.componentCatalogSelect = e }} form={this.props.form} placeholder="Catalogs" datafield="catalogs" validationrules={(forallcatalog) ? [] : ['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="For All Tier" datafield="foralltier" onChange={this.handleAllTier} disabled={generalfielddisabled} />
                                    <TierSelect wrapperCol={{ span: 16, offset: 8 }} style={{ display: (foralltier) ? 'none' : 'block' }} mode="multiple" ref={(e) => { this.componentTierSelect = e }} form={this.props.form} placeholder="Tiers" datafield="tiers" validationrules={(foralltier) ? [] : ['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="For All Partner" datafield="forallpartner" onChange={this.handleAllPartner} disabled={generalfielddisabled} />
                                    <PartnerSelect wrapperCol={{ span: 16, offset: 8 }} style={{ display: (forallpartner) ? 'none' : 'block' }} mode="multiple" ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} placeholder="Partners" datafield="partners" validationrules={(forallpartner) ? [] : ['required']} disabled={generalfielddisabled} />
                                    <SelectBase labeltext="Promo Type" datafield="promotype" form={this.props.form} options={optionsPromoType} validationrules={['required']} onChange={this.handlePromoTypeChange} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Amount" datafield="amount" validationrules={(promotype === 'FIXED') ? [] : ['required', 'pattern.numberdot']} maxLength={15} suffix={(promotype === 'FIXED') ? '' : '%'} disabled={amountfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment().add(1, 'days')} disabled={generalfielddisabled} />
                                    <Form.Item label="Price">
                                        <Button type="primary" size="default" label="Setup Price" htmlType="button" onClick={() => this.handleOpenModal()} disabled={actionspage === 'view' || promotype === 'DISCOUNT'} />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }}>
                                    <PriceTable {...this.props} datasource={pricelist} actionspage={actionspage} handleRefreshData={this.handleRefreshData} handleEditPrice={this.handleEditPrice} handleDeletePrice={this.handleDeletePrice} promotype={promotype} />
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
                                <Button url="/buy-mileage-promo" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row >
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));