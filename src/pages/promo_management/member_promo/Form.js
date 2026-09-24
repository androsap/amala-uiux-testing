import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';

const { Title } = Typography;
const { warning } = Modal;

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
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
            this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { cardnumber } = input;
                const registrationcode = input.registrationcode.toUpperCase();
                let channel = 'BO';

                let data = { cardnumber, registrationcode, channel };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.memberpromo.register;
                }
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/member-promo');
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    retrieveMember = (cardnumber) => {
        this.setState({ isLoading: true });

        let url = api.url.member.profile;
        let data = { cardnumber };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                let { firstname, lastname } = result || {};
                let memberfullname = `${firstname}${lastname ? ' ' + lastname : ''}`;
                this.props.form.setFieldsValue({ name: memberfullname });
            } else {
                warning({
                    title: 'Card Number (' + cardnumber + ') is not found.',
                    content: 'Please input correct card number.',
                });
            }
            this.setState({ isLoading: false });
        });
    }

    handleAutoFill = (e) => {
        let cardnumber = (e === null) ? null : e.target.value;
        if (cardnumber) this.retrieveMember(cardnumber);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, formrender, isLoading } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            document.title = `${titlepage} Member Promo  | Loyalty Management System`;
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Member Promo</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext='Card Number' datafield='cardnumber' form={this.props.form} maxLength={9} onBlur={this.handleAutoFill} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText labeltext='Name' datafield='name' form={this.props.form} disabled />
                                    <InputText labeltext='Registration Code' datafield='registrationcode' form={this.props.form} validationrules={['required', 'pattern.alphanumeric']} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                                <Button htmlType='submit' type='default' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE'></Button>
                                <Button url='/member-promo' htmlType='link' type='default' label='Back' />
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