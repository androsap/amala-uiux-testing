import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, InputNumber, CurrencySelect, SelectBase } from '../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { PaymentType } from '../../../../../data';
import { jsUcfirst } from '../../../../../utilities/Helpers';

import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feeid: (this.props && this.props.feeid) ? this.props.feeid : null,
            actionsmasterpage: (this.props && this.props.actionspage) ? this.props.actionspage : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                paymenttype: null
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    };

    checkPermission() {
        const { feeid, permission, prefixmenuname, menucode } = this.props;
        const { actionsmasterpage } = this.state;
        const { usermenu } = permission;
        if (feeid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + '_UPDATE'])) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            };

            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail();
        } else {
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            }
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = async () => {
        this.setState({ isLoading: true });
        const { fieldsvalue } = this.state;
        const { feelist, feeid, type } = this.props;
        const { currencycode, amount, paymenttype } = feelist.filter(obj => obj.feeid === feeid)[0] || {};

        await this.props.form.setFieldsValue({ currencycode, paymenttype, [`${type}fee`]: amount });
        this.setState({ isLoading: false, fieldvalue: { ...fieldsvalue, paymenttype } });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { type } = this.props;
                const { actionspage } = this.state;
                const { paymenttype, currencycode } = input || {};

                let data = {
                    paymenttype, currencycode,
                    amount: Number(input[`${type}fee`]),
                    feetype: type.toUpperCase()
                };

                if (actionspage === 'create') {
                    data.feeid = moment().format('YYYYMMDDHHmmss');
                } else data.feeid = this.props.feeid;

                this.props.handleSaveFee(actionspage, data);
                this.setState({ isLoading: false });
            }
        });
    };

    handleChange = (paymenttype) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, paymenttype } })
    };

    render() {
        const { prefixmenuname, menucode, type } = this.props;
        const { actionsmasterpage, fielddisabled, fieldvalue } = this.state;
        const { specialfielddisabled } = fielddisabled;
        const { paymenttype } = fieldvalue || {};
        const actioncode = (actionsmasterpage === 'create') ? 'CREATE' : 'UPDATE';
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext='Payment Type' datafield='paymenttype' options={PaymentType} onChange={this.handleChange} validationrules={[`required`]} disabled={specialfielddisabled} />
                                <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} className={(paymenttype === 'MILEAGE') ? 'hidden' : ''} labeltext='Currency' datafield='currencycode' validationrules={(paymenttype === 'MILEAGE') ? [] : ['required']} disabled={specialfielddisabled} />
                                <InputNumber form={this.props.form} labeltext={`${jsUcfirst(type)} Fee`} datafield={`${type}fee`} validationrules={['required']} step={1} min={1} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
