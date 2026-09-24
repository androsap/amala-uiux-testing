import React from 'react';
import { api } from '../../../../config/Services';
import { Button, DatePickerBase, RadioButton, SelectBase, Alert, CurrencySelect } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin, Card } from 'antd';
import { PaymentType, PriceType } from '../../../../data';
import { jsUcfirst } from '../../../../utilities/Helpers';
import { DetailRequest } from '../../../../utilities/RequestService';
import moment from 'moment';

import EligibleList from './EligibleList';

const { Title } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionspage: 'create',
            isLoading: false,
            openEligible: false,
            priceType: undefined,
            showTable: false,
            optionsCatalogue: [],
            selectedEligible: [],
            catalogData: {},
            requestEligible: {},
            buyDate: moment(),
            memberbuymileageid: undefined,
            catalogfielddisabled: true
        }
    }

    componentDidMount() {
        const { state } = this.props.location;
        const { selectedEligible } = state || [];
        const { buydate, buymileageid, pricetype, paymenttype, currencycode } = (state !== undefined) ? state.form : {};

        document.title = 'Member Buy to Extend Mileage | Loyalty Management System';
        if (state === undefined) {
            this.props.form.setFieldsValue({ buydate: moment() });
        } else this.setState({ selectedEligible, openEligible: true, requestEligible: { buydate, buymileageid, pricetype, paymenttype, currencycode } });
    };

    handleForm = (value) => {
        const { buydate, buymileageid, pricetype, paymenttype, currencycode } = this.state.requestEligible;
        this.setState({ openEligible: value, isLoading: true });
        setTimeout(() => {
            this.props.form.setFieldsValue({ buydate: moment(buydate), buymileageid, pricetype, paymenttype, currencycode });
            this.getCatalogue(pricetype, 'buyDate', buydate);
            this.handleCatalog(buymileageid);
            this.setState({ selectedEligible: [], isLoading: false, catalogfielddisabled: false });
        }, 1000);
    };

    handleChange = async (value, type) => {
        const { priceType, buyDate } = this.state;
        this.setState({ [type]: (type === 'priceType') ? value.target.value : value, isLoading: true, catalogData: {} });

        if (type === 'priceType' || (type === 'buyDate' && priceType !== undefined)) {
            await this.props.form.resetFields(['buymileageid', []]);
            if (type === 'priceType' && buyDate !== undefined) await this.getCatalogue(value.target.value, type, value);
            if ((type === 'buyDate' && value !== null) && priceType !== undefined) await this.getCatalogue(priceType, type, value);
        } else if (type === 'openEligible') {
            await this.props.form.validateFieldsAndScroll((err, input) => {
                if (!err) this.setState({ requestEligible: input })
            });
        }
        this.setState({ isLoading: false });
    };

    getCatalogue = async (pricetype, type, value) => {
        const { buyDate } = this.state;
        const data = {
            pricetype, source: 'BO', partnercode: null, mileagetype: 'EXPIRED',
            date: moment((type === 'buyDate') ? value : buyDate).format('YYYY-MM-DD'),
        };

        await DetailRequest(api.url.memberbuymileage.getcatalogue, data).then(async (response) => {
            const { status, result } = response;
            let optionsCatalogue = [];
            if (status.responsecode === '0000' && result) {
                optionsCatalogue = result.map((obj, key) => {
                    const label = (obj.buymileagename) ? obj.buymileagename : '-';
                    const value = (obj.buymileageid) ? obj.buymileageid : null;
                    const basemileage = (obj.basemileage) ? obj.basemileage : null;
                    const price = (obj.price && (obj.price.price !== null && obj.price.price !== undefined)) ? obj.price.price : null;
                    return { label, value, basemileage, price }
                });
                this.setState({ optionsCatalogue, catalogfielddisabled: false })
            } else Alert.error(status.responsemessage);
        });
    };

    handleCatalog = (buymileageid) => {
        this.setState({ catalogData: {}, isLoading: true })
        DetailRequest(api.url.buymileagecatalog.detail, { buymileageid }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000' && result) {
                this.setState({ catalogData: result })
            } else Alert.error(status.responsemessage);
        });
        this.setState({ isLoading: false })
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isLoading, openEligible, requestEligible, catalogData, actionspage, optionsCatalogue, catalogfielddisabled, selectedEligible } = this.state;
        const { buymileagename, pricetype } = catalogData || {};

        const memberid = this.props.match.params.ID;
        const buymileageid = this.props.form.getFieldValue('buymileageid');
        const paymenttype = this.props.form.getFieldValue('paymenttype');
        const currencycode = this.props.form.getFieldValue('currencycode');
        const nextbuttonfielddisabled = (buymileageid && ((paymenttype === 'CASH' && currencycode) || (paymenttype === 'MILEAGE'))) ? false : true;

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}><Button htmlType={(openEligible && actionspage === 'create') ? 'button' : 'link'} url={`/member/form/${memberid}/buy-mileage`} shape='circle' icon='left' onClick={() => this.handleForm(false)} /> Member Buy to Extend Mileage</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    {(openEligible) ? <EligibleList {...this.props} requestEligible={requestEligible} selectedEligible={selectedEligible} /> : <Row>
                        <Form {...formItemLayout} >
                            <Row gutter={24} style={{ marginBottom: 20 }}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 14, pull: 1 }} xl={14} style={{ marginTop: 15 }}>
                                    <DatePickerBase form={this.props.form} labeltext='Buy Date' datafield='buydate' validationrules={['required']} defaultValue={moment()} onChange={(e) => this.handleChange(e, 'buyDate')} disabled={true} />
                                    <RadioButton form={this.props.form} labeltext='Price Type' datafield='pricetype' options={PriceType} validationrules={['required']} onChange={(e) => this.handleChange(e, 'priceType')} disabled={false} />
                                    <SelectBase form={this.props.form} labeltext='Catalogue' datafield='buymileageid' validationrules={['required']} options={optionsCatalogue} onChange={this.handleCatalog} disabled={catalogfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext='Payment Type' datafield='paymenttype' validationrules={['required']} options={PaymentType} disabled={false} />
                                    {(paymenttype === 'CASH') ? <CurrencySelect form={this.props.form} labeltext='Currency Code' datafield='currencycode' validationrules={['required']} disabled={false} /> : ''}
                                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 24, push: 2 }} xl={24}>
                                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }} >
                                            <Button htmlType='button' type='primary' label='Next' disabled={nextbuttonfielddisabled} onClick={() => this.handleChange(true, 'openEligible')} />
                                        </Row>
                                    </Col>
                                </Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={10} xl={10}>
                                    <Card title='Catalogue Information' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginBottom: 20 }}>
                                        <Row style={{ marginBottom: 10 }}>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Catalogue Name</label></Col>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{buymileagename ? buymileagename : '-'}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: 10 }}>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Mileage Type</label></Col>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>Expired</Col>
                                        </Row>
                                        <Row style={{ marginBottom: 10 }}>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Price Type</label></Col>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{pricetype ? jsUcfirst(pricetype) : '-'}</Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    </Row>}
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);