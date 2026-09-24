import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputNumber, CurrencySelect, DateRangeBase, SelectBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';
import { PaymentType } from '../../../data';

// const prefixmenuname = 'PRICECT';
// const menucode = 'PRICECT';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buymileagepriceid: (this.props && this.props.buymileagepriceid) ? this.props.buymileagepriceid : null,
            actionsmasterpage: (this.props && this.props.actionspage) ? this.props.actionspage : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            mileslist: [],
            paymenttype: 'CASH',
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
                paymentfielddisabled: false
            }
        }
    }

    checkPermission() {
        const { buymileagepriceid, permission, prefixmenuname, menucode, date } = this.props;
        const { actionsmasterpage } = this.state;
        const { usermenu } = permission;
        if (buymileagepriceid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + "_UPDATE"])) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { paymentfielddisabled: true, specialfielddisabled: true, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail();
        } else {
            this.props.form.setFieldsValue({ paymenttype: 'CASH', date: [moment(date[0]), moment(date[1])] });
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
            this.setState({ fielddisabled: { ...this.state.fielddisabled, paymentfielddisabled: this.props.mileagetype === 'AWARDMILES' ? true : false } });
        }
    }

    componentDidMount() {
        this.checkPermission();

        if (this.props.unittype === 'MANUAL') {
            const length = (this.props.maxmileage - this.props.basemileage) / this.props.basemileage + 1;
            const mileslist = Array.from({ length }, (_, i) => this.props.basemileage + i * this.props.basemileage);

            mileslist.forEach((element, index) => {
                mileslist[index] = { label: element, value: element };
            });

            this.setState({ mileslist });
        }
    }

    getDetail = async () => {
        this.setState({ isLoading: true });
        const { datasource, buymileagepriceid } = this.props;
        const detailprice = datasource.filter(obj => obj.buymileagepriceid === buymileagepriceid);

        const currencycode = (detailprice && detailprice[0] && detailprice[0]['currencycode']) ? detailprice[0]['currencycode'] : undefined;
        const paymenttype = (detailprice && detailprice[0] && detailprice[0]['paymenttype']) ? detailprice[0]['paymenttype'] : undefined;
        const price = (detailprice && detailprice[0] && detailprice[0]['price'] && (detailprice[0]['price'] !== undefined || detailprice[0]['price'] !== null)) ? detailprice[0]['price'] : undefined;
        const miles = (detailprice && detailprice[0] && detailprice[0]['miles'] && (detailprice[0]['miles'] !== undefined || detailprice[0]['miles'] !== null)) ? detailprice[0]['miles'] : undefined;
        const startdate = (detailprice && detailprice[0] && detailprice[0]['startdate']) ? moment(detailprice[0]['startdate']) : moment(this.props.date[0]);
        const enddate = (detailprice && detailprice[0] && detailprice[0]['enddate']) ? moment(detailprice[0]['enddate']) : moment(this.props.date[1]);
        const date = [startdate, enddate];

        const fieldsvalue = { paymenttype, currencycode, price, date, miles };
        await this.props.form.setFieldsValue(fieldsvalue);
        this.setState({ isLoading: false, paymenttype });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                /* show loading */
                this.setState({ isLoading: true });
                const { actionsmasterpage, actionspage } = this.state;

                const currencycode = (input.currencycode) ? input.currencycode : null;
                const price = (input.price) ? input.price : null;
                const startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                const enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                const miles = (input.miles) ? input.miles : null;
                const paymenttype = (input.paymenttype) ? input.paymenttype : null;

                const data = { paymenttype, currencycode, price, startdate, enddate, miles };

                if (actionsmasterpage === 'create') {
                    if (actionspage === 'create') {
                        /* generate dummy buymileagepriceid */
                        data.buymileagepriceid = moment().format("YYYYMMDDHHmmss");
                    } else if (actionspage === 'update') {
                        data.buymileagepriceid = this.props.buymileagepriceid;
                    }

                    this.props.handleSavePrice(actionspage, data);
                    /* hide loading */
                    this.setState({ isLoading: false });
                } else if (actionsmasterpage === 'update') {
                    data.buymileageid = this.props.buymileageid;

                    let message = '';
                    let url = '';
                    if (actionspage === 'create') {
                        message = 'New data has been created';
                        url = api.url.buymileagecatalogprice.create;
                    } else {
                        data.buymileagepriceid = this.props.buymileagepriceid;
                        message = 'Data has been updated';
                        url = api.url.buymileagecatalogprice.update;
                    }

                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);

                            this.props.handleClose();
                            this.props.handleRefresh();
                        } else {
                            Alert.error(responsemessage);
                        }
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    }

    onChange = (value) => {
        this.setState({ paymenttype: value })
    }

    render() {
        const { prefixmenuname, menucode, unittype, date } = this.props;
        const { actionsmasterpage, actionspage, mileslist, paymenttype, fielddisabled } = this.state;
        const { generalfielddisabled, specialfielddisabled, paymentfielddisabled } = fielddisabled;
        const actioncode = (actionsmasterpage === 'create') ? "CREATE" : "UPDATE";
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const mindate = date ? moment(date[0]).subtract(1, "days") : null;
        const maxdate = date ? moment(date[1]) : null;

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext="Payment Type" datafield="paymenttype" placeholder="Payment Type" options={PaymentType} onChange={this.onChange} validationrules={['required']} disabled={paymentfielddisabled} />
                                {(paymenttype === 'MILEAGE') ? '' : <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext="Currency" datafield="currencycode" disabled={specialfielddisabled} validationrules={paymenttype === 'MILEAGE' ? [] : ['required']} />}
                                {unittype === 'MANUAL' ? <SelectBase form={this.props.form} labeltext="Miles" datafield="miles" placeholder="Miles" options={mileslist} validationrules={['required']} disabled={generalfielddisabled} /> : ''}
                                <InputNumber form={this.props.form} labeltext="Price" datafield="price" validationrules={['required']} step={0.1} min={1} max={999999999999} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={mindate} maxDate={maxdate} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create' && actionsmasterpage !== 'view') ? <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button> :
                                    (actionspage === 'update' && actionsmasterpage !== 'view') ? <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
