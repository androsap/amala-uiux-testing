import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import GenerateCard from '../../components/GenerateCard';
import Alert from '../../components/Alert';
import { Form, Row, Col, Divider, Typography, Button } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // memberid: (this.props.location.state && this.props.location.state.memberid) ? this.props.location.state.memberid : null,
            memberid: '201908202u0i9sj',
            cardnumber: null,
            tiername: null,
            urlcard: null,
            expireddate: null,
            validthru: null,
            membersince: null,
            username: null,
            nameoncard: null,
            email: null
        };
    }

    componentDidMount() {
        document.title = "Enrollment | Loyalty Management System";
        this.retrieveMemberData();
    }

    retrieveMemberData = () => {
        let memberid = this.props.location.state.memberid;
        let url = api.url.member.profile;
        let data = { memberid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let cardnumber = (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].cardnumber !== undefined) ? result.membercards[0].cardnumber : '-';
                let tiername = (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].tiername !== undefined) ? result.membercards[0].tiername : '-';
                let urlcard = (result.membercards.length && result.membercards[0].tiertemplatecard !== undefined) ? result.membercards[0].tiertemplatecard : null;
                let expireddate = (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].expireddate !== undefined) ? moment(result.membercards[0].expireddate).format('DD/MM/YYYY') : '-';
                let validthru = (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].enddate !== undefined && result.membertiers[0].enddate !== null) ? moment(result.membertiers[0].enddate).format("DD/MM/YYYY") : '-';
                let membersince = (result.enrollmentdate !== null) ? moment(result.enrollmentdate).format('DD/MM/YYYY') : '-';
                let username = (result.username) ? result.username : '';
                let nameoncard = (result.nameoncard) ? result.nameoncard : '-';
                let email = (result.email) ? result.email : '-';

                this.setState({ memberid, cardnumber, tiername, urlcard, validthru, expireddate, membersince, username, nameoncard, email });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    handleResendEmail = () => {
        let email = this.state.email;
        let url = api.url.activation.resendemail;
        let data = { email };

        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            let { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                Alert.success(responsemessage);
            } else {
                Alert.error(responsemessage);
            }
            this.setState({ loading: false });
        });
    }

    render() {
        const { cardnumber, memberid, username, email } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            labelAlign: 'left',
            colon: false
        };
        const formItemStyle = {
            style: {
                marginTop: 0,
                marginBottom: 0
            }
        }

        // let urlcard = 'http://172.25.230.122/uploads/cards/190516zzb9l_190516_blue.jpg';
        // let urlcard = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQHnDzafwXkUPJQ3vFWso7S9Oe6_xSKo6WxH5Thoxuq6Ny6lNWc';

        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Enrollment Result</Title>
                    </Col>
                    <Divider />
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <GenerateCard {...this.state} />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ marginTop: 40 }}>
                        <Row>
                            <Form {...formItemLayout}>
                                <Form.Item label="Card Number" {...formItemStyle}>
                                    <span className="ant-form-text">: {cardnumber}</span>
                                </Form.Item>
                                <Form.Item label="Username" {...formItemStyle}>
                                    <span className="ant-form-text" style={{ wordBreak: 'break-all' }}>: {username}</span>
                                </Form.Item>
                                <Form.Item label="Email" {...formItemStyle}>
                                    <span className="ant-form-text" style={{ wordBreak: 'break-all' }}>: {email}</span>
                                </Form.Item>
                            </Form>
                        </Row>
                        <Divider />
                        <Row style={{ marginTop: 20 }}>
                            <Text strong style={{ wordBreak: 'break-all' }}>We have sent this enrollment result to {email}. If you don't receive email, please click<Button type="link" onClick={() => this.handleResendEmail()} style={{ padding: 0 }}>Resend Email</Button></Text>
                            {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Text strong>If you don't receive email</Text>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Button htmlType="button" type="primary" onClick={() => this.handleResendEmail()}>Resend Email</Button>
                            </Col> */}
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: 40, textAlign: 'center' }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Link to={"/enrollment-corporate"}>
                            <Button htmlType="button" type="primary">New Enroll</Button>
                        </Link>
                        <Link to={"/member-corporate/form/" + memberid} target="_blank">
                            <Button htmlType="button" type="default" className="btn-custom-info">Go to Member Profile</Button>
                        </Link>
                    </Col>
                </Row>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
