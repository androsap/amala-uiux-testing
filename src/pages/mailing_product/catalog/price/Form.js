import React, { Component } from 'react';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest } from '../../../../utilities/RequestService';
import { Alert, Button, InputNumber, CurrencySelect, SelectBase, DateRangeBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { PaymentType } from '../../../../data';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingproductpriceid: (this.props && this.props.mailingproductpriceid) ? this.props.mailingproductpriceid : null,
            actionsmasterpage: (this.props && this.props.actionspage) ? this.props.actionspage : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldsvalue: {
                paymenttype: 'CASH',
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    };

    checkPermission() {
        const { mailingproductpriceid, permission, prefixmenuname, menucode, period } = this.props;
        const { actionsmasterpage } = this.state;
        const { usermenu } = permission;

        if (mailingproductpriceid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + '_UPDATE'])) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            };

            this.setState({ titlepage, actionspage, fielddisabled: { specialfielddisabled, generalfielddisabled } });
            this.getDetail();
        } else {
            this.props.form.setFieldsValue({ paymenttype: 'CASH', date: [period[0], period[1]] });
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
        };

    };

    componentDidMount = () => {
        this.checkPermission();
    };

    getDetail = async () => {
        this.setState({ isLoading: true });

        const { inventoryvariantid, currencycode, price, paymenttype, startdate, enddate } = this.props.prices;
        const date = [moment(startdate), moment(enddate)];

        const fielddisabled = { ...this.state.fielddisabled, specialfielddisabled: (paymenttype === 'CASH') ? false : true }
        const fieldsvalue = { inventoryvariantid, currencycode, price, paymenttype, date };

        this.props.form.setFieldsValue(fieldsvalue);
        this.setState({ fieldsvalue, fielddisabled, isLoading: false });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { actionspage } = this.state;
                const { paymenttype, currencycode, price, date, inventoryvariantid } = input || null;
                const { mailingproductpriceid, mailingproductcode, variants } = this.props;
                const inventoryvariantname = variants.find(val => val.inventoryvariantid === inventoryvariantid).inventoryvariantname;

                let data = {
                    paymenttype, currencycode, price, inventoryvariantid, inventoryvariantname,
                    startdate: (date && date[0]) ? moment(date[0]).format('YYYY-MM-DD') : null,
                    enddate: (date && date[1]) ? moment(date[1]).format('YYYY-MM-DD') : null
                };

                let url = '';
                if (actionspage === 'create') {
                    data.mailingproductcode = mailingproductcode;
                    url = api.url.mailingproduct.price.create;
                } else {
                    data.mailingproductcode = mailingproductcode;
                    data.mailingproductpriceid = mailingproductpriceid;
                    url = api.url.mailingproduct.price.update;
                }
                SaveRequest(url, data).then((response) => {
                    const { status = {} } = response || {};
                    if (status.responsecode === '0000') {
                        Alert.success(status.responsemessage);

                        this.props.handleClose();
                        this.props.handleRefreshTable();
                    } else Alert.error(status.responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleChange = async (paymenttype) => {
        const { fieldsvalue, fielddisabled } = this.state;

        this.props.form.resetFields(['paymenttype', 'currencycode', 'price', []]);
        this.setState({
            fieldsvalue: { ...fieldsvalue, paymenttype },
            fielddisabled: { ...fielddisabled, specialfielddisabled: (paymenttype === 'MILEAGE') ? true : false }
        });
    };

    render() {
        const { prefixmenuname, menucode, actioncode, period, variants } = this.props;
        const { fieldsvalue, fielddisabled, isLoading } = this.state;
        const { paymenttype } = fieldsvalue || {};
        const { generalfielddisabled } = fielddisabled || {};
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        const variantsOptions = (!variants) ? [] : variants.map((obj) => { return ({ label: obj.inventoryvariantname, value: obj.inventoryvariantid }) });

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext='Variant Name' datafield='inventoryvariantid' options={variantsOptions} validationrules={[`required`]} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext='Payment Type' datafield='paymenttype' options={PaymentType} onChange={this.handleChange} validationrules={[`required`]} disabled={generalfielddisabled} />
                                {(paymenttype === 'CASH') ? <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext='Currency Code' datafield='currencycode' validationrules={['required']} disabled={generalfielddisabled} /> : ''}
                                <InputNumber form={this.props.form} labeltext='Price (Include Tax)' datafield='price' validationrules={['required']} step={0.1} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext='Date' datafield='date' placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment(period[0]).subtract(1, 'days')} maxDate={moment(period[1])} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='default' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
