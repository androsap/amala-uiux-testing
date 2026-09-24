import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, PromoCodeSelect, RegistrationCodeSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { warning } = Modal;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    };

    checkPermission() {
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
            this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
        };
        this.componentPromoCodeSelect.retrieveData();
    };

    componentDidMount() {
        this.checkPermission();
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { cardnumber, registrationcode } = input;
                const channel = 'BO';

                let data = []
                for (var i = 0; i < registrationcode.length; i++) {
                    data.push({
                        cardnumber, channel,
                        promocode: registrationcode[i].split('-')[0],
                        registrationcode: registrationcode[i].split('-')[1].toUpperCase()
                    });
                };

                let message = 'New data has been created';
                let url = api.url.memberpromo.register;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/promo-registration');
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            };
        });
    };

    retrieveMember = (cardnumber) => {
        this.setState({ isLoading: true });

        let url = api.url.member.profile;
        let data = { cardnumber };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                let { firstname, lastname, status } = result || {};
                let memberfullname = `${firstname}${lastname ? ' ' + lastname : ''}`;
                this.props.form.setFieldsValue({
                    memberstatus: status,
                    name: memberfullname
                });
            } else {
                warning({
                    title: `Card Number (${cardnumber}) is not found.`,
                    content: 'Please input correct card number.',
                });
            }
            this.setState({ isLoading: false });
        });
    };

    handleAutoFill = (e) => {
        let cardnumber = (e === null) ? null : e.target.value;
        if (cardnumber) this.retrieveMember(cardnumber);
    };

    handlePromoCodeChange = (val) => {
        this.componentRegistrationCodeSelect.retrieveDetail({ promocodelist: val, status: 'ACTIVE', date: moment().format('YYYY-MM-DD') });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, formrender } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        const promocode = this.props.form.getFieldValue('promocode');

        if (formrender) {
            document.title = `${titlepage} Promo Registration | Loyalty Management System`;
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Promo Registration</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext='Card Number' datafield='cardnumber' form={this.props.form} maxLength={9} onBlur={this.handleAutoFill} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText labeltext='Name' datafield='name' form={this.props.form} disabled />
                                    <InputText labeltext='Status' datafield='memberstatus' form={this.props.form} disabled />
                                    <PromoCodeSelect ref={(e) => { this.componentPromoCodeSelect = e }} form={this.props.form} labeltext='Promo Code' datafield='promocode' validationrules={['required']} onChange={this.handlePromoCodeChange} disabled={generalfielddisabled} usevalueaslabel={true} mode={'multiple'} />
                                    <RegistrationCodeSelect ref={(e) => { this.componentRegistrationCodeSelect = e }} form={this.props.form} labeltext='Registration Code' datafield='registrationcode' validationrules={['required']} disabled={(promocode) ? generalfielddisabled : true} mode={'multiple'} />
                                </Col>
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                                <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                                <Button url='/promo-registration' htmlType='link' type='default' label='Back' />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));