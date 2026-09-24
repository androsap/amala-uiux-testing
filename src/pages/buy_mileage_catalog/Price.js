import React, { Component } from 'react';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputNumber, DateRangeBase, Button, CurrencySelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

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
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.ruledetail.bcruledetailid;
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
            }
        }
    }

    componentDidMount() {
        const { actionsdetailpage } = this.props;
        if (actionsdetailpage === 'update') {
            this.getDetail();
        }
        this.componentCurrencySelect.retrieveData();
    }

    getDetail = () => {
        const { ruledetail } = this.props;
        let awardmilesfactor = (ruledetail.awardmilesfactor !== undefined) ? Math.round(ruledetail.awardmilesfactor * 100).toString() : undefined;
        let tiermilesfactor = (ruledetail.tiermilesfactor !== undefined) ? Math.round(ruledetail.tiermilesfactor * 100).toString() : undefined;
        let minawardmiles = (ruledetail.minawardmiles !== undefined) ? ruledetail.minawardmiles.toString() : undefined;
        let mintiermiles = (ruledetail.mintiermiles !== undefined) ? ruledetail.mintiermiles.toString() : undefined;
        let frequency = (ruledetail.frequency !== undefined) ? ruledetail.frequency.toString() : undefined;
        let startdate = (ruledetail.startdate) ? moment(ruledetail.startdate) : null;
        let enddate = (ruledetail.enddate) ? moment(ruledetail.enddate) : null;
        let date = [startdate, enddate];

        let setValue = { awardmilesfactor, tiermilesfactor, minawardmiles, mintiermiles, frequency, date };
        this.props.form.setFieldsValue(setValue);
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage, actionsdetailpage, ruledetail, bcruleheaderid, bcruledetailid } = this.props;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                input.currencycode = input.currencycode;
                input.amount = input.amount;
                input.startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                input.enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                if (actionspage === 'create') {
                    this.props.savePrice(input);
                    this.setState({ isLoading: false });
                    this.props.handleClose();
                } else if (actionspage === 'update') {
                    input.bcruleheaderid = bcruleheaderid;
                    input = { ...ruledetail, ...input };
                    let data = [];
                    data.push(input);
                }
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { actionspage, formrender } = this.state;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 3 }} xl={{ span: 16, offset: 3 }}>
                                    <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext="Currency" datafield="currencycode" validationrules={['required']} />
                                    <InputNumber form={this.props.form} labeltext="Amount" datafield="amount" validationrules={['required, max.16']} maxLength={16} step={0.1} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} minDate={moment().add(1, 'day')} validationrules={['required']} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                            : null
                                } &nbsp;
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
export default connect(mapStateToProps)(Form.create()(App));