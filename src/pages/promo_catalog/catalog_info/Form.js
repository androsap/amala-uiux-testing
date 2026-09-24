import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from 'react-redux';
import { InputText, Button, Alert, RelatedPromotionSelect, SwitchButton, TextArea, DatePickerBase, SelectBase, ChannelApplicationSelect, TimePickerBase, RadioButton } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';
import { DiscountType, PromoType, PromoPeriodType } from '../../../data';
import { jsUcfirst } from '../../../utilities/Helpers';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            fieldvalue: {
                active: null,
                promoperiodtype: null,
                starttime: '00:00:00',
                endtime: '23:59:59',
                startdate: moment(),
                ischildpromotion: false,
                discounttype: null,
            },
            id: this.props.id,
            formrender: this.props.formrender,
            actionspage: this.props.actionspage,
            generalfielddisabled: this.props.generalfielddisabled,
            participantfielddisabled: false,
            memberusefielddisabled: false,
            promoperiodfielddisabled: false,
            channelfielddisabled: false,
            datetimefielddisabled: false,
        }
    }

    componentDidMount() {
        const { id, actionspage } = this.state;
        document.title = `${jsUcfirst(actionspage)} Redemption Promo | Loyalty Management System `;
        if (id) {
            this.getDetail(id, actionspage);
        }
    }

    getDetail = (promocatalogcode, actionspage) => {
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(api.url.redemptionpromo.catalog.detail, { promocatalogcode: promocatalogcode }).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {

                    let { active, allchannel, promocode, catalogname, description, promotype, discounttype, discount, useuniquepromocode,
                        promoperiodtype, unlimitedperiod, ischildpromotion, catalogchannel, relatedpromotion } = result;
                    let channel = [];
                    if (catalogchannel !== undefined) {
                        for (var i = 0; i < catalogchannel.length; i++) {
                            channel[i] = catalogchannel[i].channelapplicationid
                        }
                    };
                    let participantlimit = (result.participantlimit < 1) ? null : result.participantlimit;
                    let unlimitedparticipant = (participantlimit > 0) ? false : true;
                    let memberuselimit = (result.memberuselimit < 1) ? null : result.memberuselimit;
                    let unlimitedmember = (memberuselimit > 0) ? false : true;
                    let startdate = moment(result.startdate);
                    let enddate = unlimitedperiod ? null : moment(result.enddate);
                    let starttime = startdate.format('HH:mm:ss');
                    let endtime = unlimitedperiod ? null : enddate.format('HH:mm:ss');

                    let datetimefielddisabled = (promoperiodtype !== null) ? true : false;
                    let promoperiodfielddisabled = (unlimitedperiod) ? true : false;

                    let setValue = {
                        active, allchannel, promocode, catalogname, description, promotype, discounttype, discount, unlimitedmember,
                        memberuselimit, promoperiodtype, unlimitedperiod, ischildpromotion, catalogchannel: channel,
                        unlimitedparticipant, useuniquepromocode, startdate, enddate, relatedpromotion, participantlimit
                    };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { promocode, active, promoperiodtype, startdate, starttime, endtime, ischildpromotion, discounttype };
                    this.setState({
                        fieldvalue, participantfielddisabled: (unlimitedparticipant ? true : false), memberusefielddisabled: (unlimitedmember ? true : false),
                        channelfielddisabled: (allchannel ? true : false), generalfielddisabled: ((actionspage !== 'create') ? true : false), promoperiodfielddisabled, datetimefielddisabled
                    });

                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let result = {};
                let startdate = values.startdate.format('YYYY-MM-DD');
                let enddate = values.enddate ? values.enddate.format('YYYY-MM-DD') : null;
                let starttime = null;
                if (actionspage === 'create') {
                    starttime = (startdate === moment().format('YYYY-MM-DD')) ? moment().add(1, 'minutes').format('HH:mm:ss') : values.promoperiodtype === 'HOUR' ? values.starttime.format('HH:mm:ss') : '00:00:00';
                } else {
                    starttime = this.state.fieldvalue.starttime;
                }
                let endtime = values.endtime ? values.endtime.format('HH:mm:ss') : '23:59:59';
                let channel = values.catalogchannel;
                let catalogname = []
                if (channel !== undefined) {
                    for (var i = 0; i < channel.length; i++) {
                        catalogname[i] = {};
                        catalogname[i].channelapplicationid = channel[i];
                    }
                } else {
                    catalogname = [];
                };
                Object.keys(values).map(function (key) {
                    result[key] = (values[key] !== undefined) ? values[key] : null;
                    result['useuniquepromocode'] = values.useuniquepromocode ? values.useuniquepromocode : false;
                    result['allchannel'] = values.allchannel ? values.allchannel : false;
                    result['ischildpromotion'] = values.ischildpromotion ? values.ischildpromotion : false;
                    result['startdate'] = `${startdate} ${starttime}`;
                    result['enddate'] = (values.unlimitedperiod) ? null : `${values.promoperiodtype === 'HOUR' ? values.startdate.format('YYYY-MM-DD') : enddate} ${endtime}`;
                    result['catalogchannel'] = catalogname;
                    result['unlimitedperiod'] = values.unlimitedperiod ? values.unlimitedperiod : false;
                    return result;
                });
                let { unlimitedmember, unlimitedparticipant, ...data } = result;

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.redemptionpromo.catalog.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.redemptionpromo.catalog.update;
                    data.promocatalogcode = this.props.match.params.ID;
                }
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/promo-catalog');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangePeriodType = (value) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, promoperiodtype: value.target.value, endtime: '23:59:59' }, datetimefielddisabled: true });
    };
    onChangeRelated = (value) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, ischildpromotion: value } });
    };
    onChangeParticipant = (value) => {
        this.props.form.setFieldsValue({ participantlimit: null });
        this.setState({ participantfielddisabled: value });
    };
    onChangeMemberUse = (value) => {
        this.props.form.setFieldsValue({ memberuselimit: null });
        this.setState({ memberusefielddisabled: value });
    };
    onChangePromoPeriod = (value) => {
        if (this.state.actionspage === 'create') { this.props.form.setFieldsValue({ promoperiod: null, enddate: null, startdate: null, endtime: null }); }
        this.props.form.resetFields(['promoperiodtype', []]);
        this.setState({ promoperiodfielddisabled: value, datetimefielddisabled: value, fieldvalue: { ...this.state.fieldvalue, promoperiodtype: null } });
    };
    onChangeChannel = (value) => {
        this.props.form.setFieldsValue({ catalogchannel: undefined });
        this.setState({ channelfielddisabled: value });
    };
    onChangeDiscountType = (value) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, discounttype: value } });
    };
    onChangeStartDate = (value) => {
        if (this.state.actionspage === 'create') {
            let starttime = (moment(value).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) ? moment().format('HH:mm:ss') : '00:00:00';
            this.setState({ fieldvalue: { ...this.state.fieldvalue, starttime } });
        }
        this.setState({ fieldvalue: { ...this.state.fieldvalue, startdate: value } });
    };
    handleParticipantValidateLimit = (rule, value, callback) => {
        if (!this.state.participantfielddisabled) {
            if (value < 1) { callback('Minimum Input 1'); }
        }
        callback();
    };
    handleMemberuseValidateLimit = (rule, value, callback) => {
        if (!this.state.memberusefielddisabled) {
            if (value < 1) { callback('Minimum Input 1'); }
        }
        callback();
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender, fieldvalue, generalfielddisabled, participantfielddisabled, memberusefielddisabled, promoperiodfielddisabled, channelfielddisabled, datetimefielddisabled } = this.state;
        const { promoperiodtype, starttime, endtime, ischildpromotion, discounttype, startdate } = fieldvalue;
        const { menucode, prefixmenuname } = this.props;
        if (formrender) {
            //render form
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext='Promo Code' datafield='promocode' validationrules={['required', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Promo Name' datafield='catalogname' validationrules={['required', 'max.255']} maxLength={255} />
                                    <TextArea form={this.props.form} labeltext='Description' datafield='description' validationrules={['max.255']} maxLength='255' />
                                    <SelectBase form={this.props.form} labeltext='Promo Type' datafield='promotype' options={PromoType} validationrules={['required']} />
                                    <SelectBase form={this.props.form} labeltext='Discount Type' datafield='discounttype' options={DiscountType} validationrules={['required']} onChange={this.onChangeDiscountType} />
                                    <InputText form={this.props.form} labeltext='Discount' datafield='discount' validationrules={['required', 'pattern.number']} maxLength={(discounttype === 'PERCENTAGE' ? 3 : 9)} />
                                    <Row>
                                        <Col xs={16} sm={16} md={16}>
                                            <InputText labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={this.props.form} labeltext='Participant Limit' datafield='participantlimit' validationrules={['pattern.number', this.handleParticipantValidateLimit]} maxLength={9} disabled={participantfielddisabled} />
                                        </Col>
                                        <Col xs={8} sm={{ push: 0.5 }}>
                                            <SwitchButton labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} form={this.props.form} labeltext='Unlimited' datafield='unlimitedparticipant' onChange={this.onChangeParticipant} />
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col xs={16} sm={16} md={16}>
                                            <InputText labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={this.props.form} labeltext='Member Use Limit' datafield='memberuselimit' validationrules={['pattern.number', this.handleMemberuseValidateLimit]} maxLength={9} disabled={memberusefielddisabled} />
                                        </Col>
                                        <Col xs={8} sm={{ push: 0.5 }}>
                                            <SwitchButton labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} form={this.props.form} labeltext='Unlimited' datafield='unlimitedmember' onChange={this.onChangeMemberUse} />
                                        </Col>
                                    </Row>
                                    <SwitchButton form={this.props.form} labeltext='Unlimited Period' datafield='unlimitedperiod' defaultChecked={false} onChange={this.onChangePromoPeriod} />
                                    <RadioButton form={this.props.form} labeltext='Promo Period Type' datafield='promoperiodtype' options={PromoPeriodType} onChange={this.onChangePeriodType} validationrules={promoperiodfielddisabled ? [] : ['required']} disabled={promoperiodfielddisabled} />
                                </Col>
                            </Row>
                            <Row style={{ display: datetimefielddisabled ? 'block' : promoperiodfielddisabled ? 'block' : promoperiodtype !== null ? 'block' : 'none' }}>
                                <Row>
                                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 6, offset: 6 }} xl={{ span: 6, offset: 6 }}>
                                        <DatePickerBase form={this.props.form} labeltext='Start Date' datafield='startdate' placeholder='Start Date' validationrules={['required']} minDate={moment()} onChange={this.onChangeStartDate} disabled={generalfielddisabled} />
                                    </Col>
                                </Row>
                                <Row style={{ display: (promoperiodfielddisabled) ? 'none' : 'block' }}>
                                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 6, offset: 6 }} xl={{ span: 6, offset: 6 }}>
                                        {(promoperiodtype === 'HOUR') ?
                                            <TimePickerBase form={this.props.form} defaultValue={moment(starttime, 'HH:mm:ss')} labeltext='Start Time' datafield='starttime' placeholder='Start Time' validationrules={['required']} disabled={generalfielddisabled} /> :
                                            <DatePickerBase form={this.props.form} labeltext='End Date' datafield='enddate' placeholder='End Date' validationrules={[((promoperiodfielddisabled) ? '' : 'required')]} minDate={startdate} disabled={promoperiodfielddisabled} />
                                        }
                                    </Col>
                                    {(promoperiodtype === 'HOUR') ?
                                        <Col xs={8} sm={8} md={8} lg={{ span: 6 }} xl={{ span: 6 }}>
                                            <TimePickerBase form={this.props.form} defaultValue={moment(endtime, 'HH:mm:ss')} labeltext='End Time' datafield='endtime' placeholder='End Time' validationrules={[((promoperiodfielddisabled) ? '' : 'required')]} disabled={promoperiodfielddisabled} />
                                        </Col> : ''
                                    }
                                </Row>
                            </Row>

                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <Row gutter={2}>
                                        <Col xs={11} sm={11} md={11}>
                                            <SwitchButton labelCol={{ span: 18, pull: 1 }} wrapperCol={{ span: 6 }} form={this.props.form} labeltext='All Channel' datafield='allchannel' validationrules={['required']} defaultChecked={false} onChange={this.onChangeChannel} />
                                        </Col>
                                        <Col xs={13} sm={13} md={13}>
                                            <ChannelApplicationSelect wrapperCol={{ span: 24 }} form={this.props.form} mode='multiple' datafield='catalogchannel' placeholder='Channel' disabled={channelfielddisabled} validationrules={[channelfielddisabled ? '' : 'required']} />
                                        </Col>
                                        <Col xs={11} sm={11} md={11}>
                                            <SwitchButton labelCol={{ span: 18, pull: 1 }} wrapperCol={{ span: 6 }} form={this.props.form} labeltext='Use Unique Voucher Code' datafield='useuniquepromocode' />
                                        </Col>
                                        <Row style={{ display: 'none' }} >
                                            <Col xs={11} sm={11} md={11}>
                                                <SwitchButton labelCol={{ span: 18, pull: 1 }} wrapperCol={{ span: 6 }} form={this.props.form} labeltext='Is Child Promotion' datafield='ischildpromotion' onChange={this.onChangeRelated} />
                                            </Col>
                                            <Col xs={13} sm={13} md={13}>
                                                <RelatedPromotionSelect wrapperCol={{ span: 24 }} style={{ display: (ischildpromotion) ? 'block' : 'none' }} form={this.props.form} placeholder='Related Promotion' datafield='relatedpromotion' validationrules={['required']} />
                                            </Col>
                                        </Row>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 15 }}>
                                <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE'></Button>
                                <Button url='/promo-catalog' htmlType='link' type='default' label='Back' />
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