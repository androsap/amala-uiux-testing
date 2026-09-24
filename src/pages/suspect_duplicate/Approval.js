import React from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Spin, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            paging: {},
            sort: {},
            column: []
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail() {
        const { sort, paging, column } = this.state;
        let memberid = this.props.memberid;
        let url = api.url.member.list;
        let criteria = { memberid: memberid, memberstatus: 'SUSPECTDUPLICATE' };
        this.setState({ loading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let cardnumber = result[0].cardnumber ? result[0].cardnumber : '-';
                let membershipname = result[0].membershipname ? result[0].membershipname : '-';
                let tiername = result[0].tiername ? result[0].tiername : '-';
                let name = result[0].name ? result[0].name : '-';
                let dateofbirth = result[0].dateofbirth ? moment(result[0].dateofbirth).format('DD/MM/YYYY') : '-';
                let gender = result[0].gender ? result[0].gender : '-';
                let email = result[0].email ? result[0].email : '-';
                let enrollmentdate = result[0].enrollmentdate ? moment(result[0].enrollmentdate).format('DD/MM/YYYY') : '-';

                this.setState({ loading: false, cardnumber, membershipname, tiername, name, dateofbirth, gender, email, enrollmentdate });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    approvalAction = (e, which) => {
        e.preventDefault();
        this.setState({ loading: true });
        //define parameter
        let memberid = this.props.memberid;
        let activatebyemail = which === 'by-email' ? true : false;

        let message = 'Data has been approved';
        let url = api.url.activation.suspectdupactivation;
        let data = { memberid, activatebyemail };

        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                message = (responsemessage) ? responsemessage : message;
                Alert.success(message);
                this.closeModalSuccess();
            } else {
                Alert.error(responsemessage);
            }
            this.setState({ loading: false });
        })
    };

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { formrender, loading } = this.state;
        const { cardnumber, membershipname, tiername, name, dateofbirth, gender, email, enrollmentdate } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
            colon: false
        };
        const formItemStyle = {
            style: {
                marginTop: 0,
                marginBottom: 0
            }
        }

        if (formrender) {
            return (
                <React.Fragment>
                    <Spin spinning={loading}>
                        <Form {...formItemLayout} loading={loading}>
                            <Row className="searching-form">
                                <Col span={12}>
                                    <Form.Item label="Card Number" {...formItemStyle}>
                                        <span className="ant-form-text">: {cardnumber}</span>
                                    </Form.Item>
                                    <Form.Item label="Tier" {...formItemStyle}>
                                        <span className="ant-form-text">: {membershipname} - {tiername}</span>
                                    </Form.Item>
                                    <Form.Item label="Full Name" {...formItemStyle}>
                                        <span className="ant-form-text">: {name}</span>
                                    </Form.Item>
                                    <Form.Item label="Date of Birth" {...formItemStyle}>
                                        <span className="ant-form-text">: {dateofbirth}</span>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Gender" {...formItemStyle}>
                                        <span className="ant-form-text">: {gender}</span>
                                    </Form.Item>
                                    <Form.Item label="Email" {...formItemStyle}>
                                        <span className="ant-form-text">: {email}</span>
                                    </Form.Item>
                                    <Form.Item label="Enrollment Date" {...formItemStyle}>
                                        <span className="ant-form-text">: {enrollmentdate}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Text>Click an action bellow to approve:</Text>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                <Button htmlType="button" type="primary" label="Activate by Email" onClick={(e) => this.approvalAction(e, 'by-email')} />
                                <Button htmlType="button" type="primary" label="Direct Activate" onClick={(e) => this.approvalAction(e, 'direct')} />
                                <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
                            </Row>
                        </Form>
                    </Spin>
                </React.Fragment>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} type="modal" />);
        }
    }
}

export default Form.create()(App);