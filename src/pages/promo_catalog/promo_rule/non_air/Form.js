import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { Alert, MultiInputSelect, Button, DateRangeBase, PartnerSelectV2, PartnerLocationSelect } from '../../../../components/Base/BaseComponent';
import { Form, Row, Spin } from 'antd';
import moment from 'moment';
import ErrorGeneral from '../../../error/ErrorGeneral';

class NonAir extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            action: 'create',
            formrender: true,
            isLoading: false,
        }
    }

    componentDidMount() {
        document.title = ' Add New Redemption Promo | Loyalty Management System ';
        this.getDetail();
    };

    async getDetail() {
        const { promocatalogcode } = this.props;
        this.setState({ isLoading: true })
        await DetailRequest(api.url.redemptionpromo.criteriacategory.getcriteriacategory, { promocatalogcode }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                let data = result.find(o => o.criteriatypecode === 'NONAIR');
                if (data !== undefined) {
                    let minimumpurchase = data.promocategory.find(o => o.category === 'Minimum Purchase').data;
                    let date = data.promocategory.find(o => o.category === 'Activity Date Non Air').data;
                    let partnercode = data.promocategory.find(o => o.category === 'Partner Code').data;
                    let partnerlocation = data.promocategory.find(o => o.category === 'Partner Location Code').data;
                    let activitydate = (date === undefined) ? undefined : (date.length === 0) ? undefined : [moment((date[0]).split(',')[0]), moment((date[0]).split(',')[1])];

                    let datafield = { minimumpurchase, activitydate, partnercode, partnerlocation };
                    this.props.form.setFieldsValue(datafield);
                    this.setState({ data: result, action: 'update' });
                };
            };
            this.criteriaTypeDisabledField();
            this.componentPartnerNonairSelect.retrieveData();
            this.componentPartnerLocationSelect.retrieveData();
            setTimeout(() => this.setState({ isLoading: false }), 1500);
        })
    };

    criteriaTypeDisabledField = () => {
        let partnerdisabled = this.props.nonairdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'partnercode').active === true) ? false : true;
        let partnerlocdisabled = this.props.nonairdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'partnerlocation').active === true) ? false : true;
        let datedisabled = this.props.nonairdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'activitydate').active === true) ? false : true;
        let minpurchasedisabled = this.props.nonairdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'minimumpurchase').active === true) ? false : true;
        this.setState({ partnerdisabled, partnerlocdisabled, datedisabled, minpurchasedisabled })
    }
    saveAction = (e) => {
        e.preventDefault();
        const { action } = this.state;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let dataList = {};
                let datanonair = [];
                let data = (action === 'update') ? this.state.data.find(o => o.criteriatypecode === 'NONAIR') : undefined;

                let partnercode = {}, partnerlocation = {}, activitydate = {}, minimumpurchase = {};
                if (action === 'update') {
                    partnercode['promocategorycode'] = (data.promocategory.find(o => o.category === 'Partner Code').promocategorycode);
                    partnercode['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Partner Code').promocriteriacode);
                    partnerlocation['promocategorycode'] = (data.promocategory.find(o => o.category === 'Partner Location Code').promocategorycode);
                    partnerlocation['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Partner Location Code').promocriteriacode);
                    activitydate['promocategorycode'] = (data.promocategory.find(o => o.category === 'Activity Date Non Air').promocategorycode);
                    activitydate['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Activity Date Non Air').promocriteriacode);
                    minimumpurchase['promocategorycode'] = (data.promocategory.find(o => o.category === 'Minimum Purchase').promocategorycode);
                    minimumpurchase['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Minimum Purchase').promocriteriacode);
                };
                partnercode['categorytypecode'] = "partnercode";
                partnercode['data'] = (values.partnercode === undefined) ? [undefined] : (values.partnercode.length === 0) ? [undefined] : values.partnercode;
                partnerlocation['categorytypecode'] = "partnerlocation";
                partnerlocation['data'] = (values.partnerlocation === undefined) ? [undefined] : (values.partnerlocation.length === 0) ? [undefined] : values.partnerlocation;
                activitydate['categorytypecode'] = "activitydate";
                activitydate['data'] = ((values.activitydate === undefined) ? [undefined] : values.activitydate.length === 0) ? [undefined] : [`${moment(values.activitydate[0]).format('YYYY-MM-DD')},${moment(values.activitydate[1]).format('YYYY-MM-DD')}`];
                minimumpurchase['categorytypecode'] = "minimumpurchase";
                minimumpurchase['data'] = (values.minimumpurchase === undefined) ? [undefined] : (values.minimumpurchase.length === 0) ? [undefined] : values.minimumpurchase;

                datanonair.push(partnercode, partnerlocation, activitydate, minimumpurchase);
                let promocriteria = Object.assign({ criteriatypecode: "NONAIR", promocategory: datanonair });
                if (action === 'create') {
                    dataList = Object.assign({ promocatalogcode: this.props.promocatalogcode, promocriteria: [promocriteria] });
                } else {
                    dataList = Object.assign({ promocatalogcode: this.props.promocatalogcode, promocriteriacode: (data.promocriteriacode), criteriatypecode: "NONAIR", promocategory: datanonair });
                };

                let message = '';
                let url = '';
                if (action === 'create') {
                    message = 'New data has been created';
                    url = api.url.redemptionpromo.criteriacategory.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.redemptionpromo.criteriacategory.update;
                };
                var fileRequest = new FormData();
                var file = null;
                fileRequest.append("file", file);
                SaveRequest(url, dataList, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                    } else {
                        Alert.error(responsemessage);
                    }
                });
                setTimeout(() => {
                    this.getDetail();
                    this.setState({ action: 'update', isLoading: false });
                }, 1000);
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender, action, partnerdisabled, partnerlocdisabled, datedisabled, minpurchasedisabled } = this.state;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} >
                            <Row>
                                <PartnerSelectV2 ref={(e) => { this.componentPartnerNonairSelect = e }} form={this.props.form} mode="multiple" labeltext="Partner Code" datafield="partnercode" disabled={partnerdisabled} />
                                <PartnerLocationSelect ref={(e) => { this.componentPartnerLocationSelect = e }} form={this.props.form} mode="multiple" labeltext="Partner Location Code" datafield="partnerlocation" disabled={partnerlocdisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Activity Date" datafield="activitydate" placeholder={['Start Date', 'End Date']} minDate={moment()} disabled={datedisabled} />
                                <MultiInputSelect form={this.props.form} mode={"tags"} labeltext="Minimum Purchase" datafield="minimumpurchase" disabled={minpurchasedisabled} />
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ margin: 30 }}>
                                <Button htmlType='submit' type='primary' label={(action === 'create' ? 'Save' : 'Submit')} onClick={this.saveAction} />
                                <Button url="/promo-catalog" htmlType="link" type="default" label="Back" />
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
export default connect(mapStateToProps)(Form.create()(NonAir));