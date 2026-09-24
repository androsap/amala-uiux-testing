import React, { Component } from 'react';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import { Alert, Button, DateRangeBase, CurrencySelect, InputText } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionsmasterpage: (this.props && this.props.actionspage) ? this.props.actionspage : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            active: false,
            formrender: true,
        }
    }

    checkPermission() {
        const { rateconversdetailid, permission, prefixmenuname, menucode } = this.props;
        const { actionsmasterpage } = this.state;
        const { usermenu } = permission;
        if (rateconversdetailid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + '_UPDATE'])) {
                titlepage = 'View';
                actionspage = 'view';
            }
            this.setState({ titlepage, actionspage });
            this.props.setTitlePage(titlepage);
            this.getDetail();
        } else {
            this.props.setTitlePage('Create');
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            }
        }
        this.componentCurrencySelect.retrieveData();
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = async () => {
        this.setState({ isLoading: true });
        const { datasource, rateconversdetailid } = this.props;
        const detailrule = datasource.filter(obj => obj.rateconversdetailid === rateconversdetailid);

        const active = (detailrule && detailrule[0] && detailrule[0]['active']) ? detailrule[0]['active'] : false;
        const price = (detailrule && detailrule[0] && (detailrule[0]['price'] !== null || detailrule[0]['price'] !== undefined)) ? Number(detailrule[0]['price']) : undefined;
        const awardmiles = (detailrule && detailrule[0] && (detailrule[0]['awardmiles'] !== null || detailrule[0]['awardmiles'] !== undefined)) ? Number(detailrule[0]['awardmiles']) : undefined;
        const tiermiles = (detailrule && detailrule[0] && (detailrule[0]['tiermiles'] !== null || detailrule[0]['tiermiles'] !== undefined)) ? Number(detailrule[0]['tiermiles']) : undefined;
        const frequency = (detailrule && detailrule[0] && (detailrule[0]['frequency'] !== null || detailrule[0]['frequency'] !== undefined)) ? Number(detailrule[0]['frequency']) : undefined;
        const currency = (detailrule && detailrule[0] && detailrule[0]['currency']) ? detailrule[0]['currency'] : undefined;
        const startdate = (detailrule && detailrule[0] && detailrule[0]['startdate']) ? moment(detailrule[0]['startdate']) : undefined;
        const enddate = (detailrule && detailrule[0] && detailrule[0]['enddate']) ? moment(detailrule[0]['enddate']) : undefined;
        const date = [startdate, enddate];

        await this.props.form.setFieldsValue({ price, date, awardmiles, tiermiles, frequency, currency });
        this.setState({ isLoading: false, active });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { rateconversdetailid, rateconversionid } = this.props;
                const { actionsmasterpage, actionspage } = this.state;
                const { date, currency } = input || null
                let price = input.price ? input.price : 0;
                let awardmiles = input.awardmiles ? input.awardmiles : 0;
                let tiermiles = input.tiermiles ? input.tiermiles : 0;
                let frequency = input.frequency ? input.frequency : 0;

                const data = { price, awardmiles, tiermiles, frequency, currency, startdate: moment(date[0]).format('YYYY-MM-DD'), enddate: moment(date[1]).format('YYYY-MM-DD'), active: true };
                if (actionsmasterpage === 'create') {
                    if (actionspage === 'create') {
                        data.rateconversdetailid = moment().format('YYYYMMDDHHmmss');
                    } else if (actionspage === 'update') {
                        data.rateconversdetailid = rateconversdetailid;
                    }

                    this.props.handleSavePrice(actionspage, data);
                    this.setState({ isLoading: false });
                } else if (actionsmasterpage === 'update') {
                    let url = '';
                    if (actionspage === 'create') {
                        data.rateconversionid = rateconversionid;
                        url = api.url.revenuebased.rate.adddetail;
                    } else {
                        data.rateconversdetailid = rateconversdetailid;
                        url = api.url.revenuebased.rate.updaterule;
                    }

                    SaveRequest(url, data).then((response) => {
                        const { status = {} } = response || {};
                        if (status.responsecode === '0000') {
                            Alert.success(status.responsemessage);

                            this.props.handleClose();
                            this.props.handleRefresh(rateconversdetailid);
                        } else {
                            Alert.error(status.responsemessage);
                        }
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    }

    handleActiveDeactive = (active) => {
        const { rateconversdetailid } = this.props;
        let url = (active) ? api.url.revenuebased.rate.deactivate : api.url.revenuebased.rate.activate;
        var callback = (response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                Alert.success(status.responsemessage);
                this.props.handleClose();
                this.props.handleRefresh(rateconversdetailid);
            } else {
                Alert.error(status.responsemessage);
            }
        };
        DeleteRequest(url, { rateconversdetailid }, callback, active);
    }

    render() {
        const { prefixmenuname, menucode } = this.props;
        const { actionsmasterpage, actionspage, active } = this.state;
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
                                <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext='Currency' datafield='currency' validationrules={['required']} />
                                <InputText labeltext='Price' datafield='price' form={this.props.form} maxLength={45} validationrules={['pattern.number']} />
                                <InputText labeltext='Award Miles' datafield='awardmiles' form={this.props.form} maxLength={45} validationrules={['pattern.number']} />
                                <InputText labeltext='Tier Miles' datafield='tiermiles' form={this.props.form} maxLength={45} validationrules={['pattern.number']} />
                                <InputText labeltext='Frequency' datafield='frequency' form={this.props.form} maxLength={45} validationrules={['pattern.number']} />
                                <DateRangeBase form={this.props.form} labeltext='Period' datafield='date' placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment()} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode} />
                            {
                                (actionspage === 'update' && actionsmasterpage !== 'view') ?
                                    <Button htmlType='button' type='primary' label={active ? 'Deactive' : 'Active'} menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}
                                        style={{ background: active ? 'red' : 'green', borderColor: active ? 'red' : 'green' }} onClick={() => this.handleActiveDeactive(active)} />
                                    : null
                            }
                            <Button htmlType='button' type='default' label='Back' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode} onClick={() => this.props.handleClose()} />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
