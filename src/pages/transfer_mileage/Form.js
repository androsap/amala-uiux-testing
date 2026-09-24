import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from 'react-redux';
import { InputText, Alert, DatePickerBase, InputNumber, CustomTransactionSelect, TextArea } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card, Button, Modal } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;
const { confirm } = Modal;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberori: [],
            memberdes: [],
            isLoading: false,
            sender: '',
            receiver: '',
        }
    }

    componentDidMount() {
        document.title = ' Transaction | Loyalty Management System ';
        this.componentCustomTrxSelect.retrieveData({ validfortransfer: true });
    }

    saveAction = (e) => {
        e.preventDefault();

        const callback = (input) => {
            this.setState({ isLoading: true });
            const { memberori, memberdes } = this.state;
            const { trxdate, awardmiles, tiermiles, frequency, customtrxcode, notes } = input || {};
            let data = {
                customtrxcode, notes, trxdate: moment(trxdate).format('YYYY-MM-DD'), sender: memberori[0].memberid, receiver: memberdes[0].memberid, awardmiles,
                tiermiles: tiermiles === null ? 0 : tiermiles, frequency: frequency === null ? 0 : frequency, sendertype: 'MEMBER', receivertype: 'MEMBER'
            };
            let url = api.url.membertransaction.transfer;
            SaveRequest(url, data).then((response) => {
                const { status = {} } = response || {};
                if (status.responsecode === '0000') {
                    this.props.form.resetFields(['sender', 'receiver', 'awardmiles', 'tiermiles', 'frequency', 'customtrxcode', 'notes', []]);
                    this.setState({ memberori: [], memberdes: [], frequency: 0, tiermiles: 0, awardmiles: 0 });
                    Alert.success(status.responsemessage);
                } else {
                    Alert.error(status.responsemessage);
                }
                this.setState({ isLoading: false });
            })
        };

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                confirm({
                    title: 'Are you sure to Transfer',
                    onOk(e) {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            callback(input);
                        }).catch(() => console.log('Oops errors!'));
                    },
                    onCancel() { },
                });
            }
        });
    };

    onChangeCardnumber = (field, value) => {
        this.setState({ [field]: value.target.value, memberori: [], memberdes: [], awardmiles: 0, tiermiles: 0, frequency: 0 });
        this.props.form.resetFields(['awardmiles', 'tiermiles', 'frequency', []]);
    };

    onSearchCardnumber = () => {
        this.setState({ isLoading: true });
        const { sender, receiver } = this.state;
        if (sender !== '' && receiver !== '' && sender !== receiver) {
            DetailRequest(api.url.member.profile, { cardnumber: sender, type: 'SUMMARY', status: 'ACTIVE' }).then((response) => {
                const { status = {} } = response || {};
                if (status.responsecode === '0000') {
                    this.setState({ memberori: [response.result] });
                } else {
                    this.setState({ memberori: [] })
                    let message = sender === '' ? 'Cardnumber sender field is required' : status.responsemessage;
                    Alert.error(message);
                }
            });
            DetailRequest(api.url.member.profile, { cardnumber: receiver, type: 'SUMMARY', status: 'ACTIVE' }).then((response) => {
                const { status = {} } = response || {};
                if (status.responsecode === '0000') {
                    this.setState({ memberdes: [response.result] });
                } else {
                    this.setState({ memberdes: [] })
                    let message = receiver === '' ? 'Cardnumber receiver field is required' : status.responsemessage;
                    Alert.error(message);
                }
            });
        } else if (sender === receiver && sender !== '') {
            Alert.error('Cardnumber cannot be same!');
        } else {
            Alert.error(`Cardnumber ${sender === '' && receiver === '' ? '' : sender === '' ? 'sender' : 'receiver'} field is required!`);
        }
        setTimeout(() => { this.setState({ isLoading: false }) }, 1000);
    };

    onChange = (field, value) => {
        if (field !== 'customtrx') {
            this.setState({ [field]: value === null ? 0 : value })
            if (value === null) {
                this.props.form.setFieldsValue({ [field]: 0 });
            }
        } else {
            this.setState({ [field]: value === undefined ? '-' : value })
        }

    };

    onClear = () => {
        this.props.form.resetFields(['sender', 'receiver', 'awardmiles', 'tiermiles', 'frequency', []]);
        this.setState({ memberori: [], memberdes: [], awardmiles: 0, tiermiles: 0, frequency: 0, sender: '', receiver: '' });
    };

    render() {
        const { isLoading, awardmiles, memberori, memberdes } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 8 } }
        };
        let senddisabled = (memberori.length > 0 && memberdes.length > 0 && awardmiles > 0) ? false : true;

        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Transfer Mileage</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={12}>
                                <Card>
                                    <InputText labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} form={this.props.form} onChange={(e) => this.onChangeCardnumber('sender', e)} labeltext='Sender' datafield='sender' validationrules={['required', 'pattern.preventsql']} placeholder='Cardnumber sender' />
                                    <InputText labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} form={this.props.form} onChange={(e) => this.onChangeCardnumber('receiver', e)} labeltext='Receiver' datafield='receiver' validationrules={['required', 'pattern.preventsql']} placeholder='Cardnumber receiver' />
                                    <Row gutter={24} type='flex' justify='center'>
                                        <Button onClick={this.onSearchCardnumber} type='primary' > Search </Button>
                                        <Button onClick={this.onClear} type='default' > Clear </Button>
                                    </Row>
                                </Card>
                                <CustomTransactionSelect style={{ marginTop: 25 }} labelCol={{ span: 8 }} wrapperCol={{ span: 13 }} ref={(e) => { this.componentCustomTrxSelect = e }} form={this.props.form}
                                    labeltext='Custom Transaction' datafield='customtrxcode' validationrules={['required']} custom={'transfermileage'} onChange={value => this.onChange('customtrx', value)} />
                                <DatePickerBase labelCol={{ span: 8 }} wrapperCol={{ span: 13 }} form={this.props.form} labeltext='Transaction Date' datafield='trxdate' validationrules={['required']} defaultValue={moment()} onChange={value => this.onChange('trxdate', value)} maxDate={moment()} />
                                <TextArea labelCol={{ span: 8 }} wrapperCol={{ span: 13 }} form={this.props.form} labeltext='Notes' datafield='notes' maxLength={255} />
                                <InputNumber labelCol={{ span: 8 }} wrapperCol={{ span: 13 }} form={this.props.form} defaultValue={0} labeltext='Award Miles' datafield='awardmiles' onChange={value => this.onChange('awardmiles', value)}
                                    min={0} max={memberori.length === 0 ? '-' : memberori[0].memberaccount[0].awardmiles} disabled={memberori.length === 0 ? true : false} />
                                <InputNumber labelCol={{ span: 8 }} wrapperCol={{ span: 13 }} form={this.props.form} defaultValue={0} labeltext='Tier Miles' datafield='tiermiles' onChange={value => this.onChange('tiermiles', value)}
                                    min={0} max={memberori.length === 0 ? '-' : memberori[0].memberaccount[0].tiermiles} disabled={memberori.length === 0 ? true : false} />
                                <InputNumber labelCol={{ span: 8 }} wrapperCol={{ span: 13 }} form={this.props.form} defaultValue={0} labeltext='Frequency' datafield='frequency' onChange={value => this.onChange('frequency', value)}
                                    min={0} max={memberori.length === 0 ? '-' : memberori[0].memberaccount[0].frequency} disabled={memberori.length === 0 ? true : false} />
                            </Col>

                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={12}>
                                <Card bordered={false} style={{ marginBottom: '20px' }} className='card-shadow'>
                                    <Divider orientation='left'> <Text strong> Sender </Text> </Divider>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Member Name </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={7} xl={7}>: {memberori.length === 0 ? '-' : memberori[0].firstname} {memberori.length === 0 ? '' : memberori[0].lastname} </Col>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Award Miles </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}>: {memberori.length === 0 ? '-' : memberori[0].memberaccount[0] === undefined || memberori[0].memberaccount[0].awardmiles === undefined ? '-' : memberori[0].memberaccount[0].awardmiles}</Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Tier Name </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={7} xl={7}>: {memberori.length === 0 ? '-' : memberori[0].membercards[0] === undefined || memberori[0].membercards[0].tiername === undefined ? '-': memberori[0].membercards[0].tiername} </Col>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Tier Miles </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}>: {memberori.length === 0 ? '-' : memberori[0].memberaccount[0] === undefined|| memberori[0].memberaccount[0].tiermiles === undefined ? '-' : memberori[0].memberaccount[0].tiermiles }</Col>
                                    </Row>
                                    <Row style={{ marginTop: 10, marginBottom: 30 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Status </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={7} xl={7}>: {memberori.length === 0 ? '-' : memberori[0].status === undefined ? '-' : memberori[0].status} </Col>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Frequency </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}>: {memberori.length === 0 ? '-' : memberori[0].memberaccount[0] === undefined || memberori[0].memberaccount[0].frequency === undefined ? '-' : memberori[0].memberaccount[0].frequency}</Col>
                                    </Row>
                                    <Divider orientation='left'> <Text strong> Receiver </Text> </Divider>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Member Name </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={7} xl={7}>: {memberdes.length === 0 ? '-' : memberdes[0].firstname} {memberdes.length === 0 ? '' : memberdes[0].lastname} </Col>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Award Miles </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}>: {memberdes.length === 0 ? '-' : memberdes[0].memberaccount[0] === undefined || memberdes[0].memberaccount[0].awardmiles === undefined ? '-' : memberdes[0].memberaccount[0].awardmiles}</Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Tier Name </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={7} xl={7}>: {memberdes.length === 0 ? '-' : memberdes[0].membercards[0] === undefined || memberdes[0].membercards[0].tiername === undefined ? '-' : memberdes[0].membercards[0].tiername} </Col>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Tier Miles </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}>: {memberdes.length === 0 ? '-' : memberdes[0].memberaccount[0] === undefined || memberdes[0].memberaccount[0].tiermiles === undefined ? '-' : memberdes[0].memberaccount[0].tiermiles}</Col>
                                    </Row>
                                    <Row style={{ marginTop: 10, marginBottom: 30 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Status </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={7} xl={7}>: {memberdes.length === 0 ? '-' : memberdes[0].status === undefined ? '-' : memberdes[0].status} </Col>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Frequency </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={5} xl={5}>: {memberdes.length === 0 ? '-' : memberdes[0].memberaccount[0] === undefined || memberdes[0].memberaccount[0].frequency === undefined ? '-' : memberdes[0].memberaccount[0].frequency}</Col>
                                    </Row>
                                    <Button onClick={this.saveAction} type='primary' block disabled={senddisabled} > Send </Button>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
