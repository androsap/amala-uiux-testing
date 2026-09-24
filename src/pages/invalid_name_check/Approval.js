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
        let activityid = this.props.activityid;
        let url = api.url.memberactivity.list;
        let criteria = { activityid: activityid };
        this.setState({ loading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let activitydate = result[0].activitydate ? moment(result[0].activitydate).format('DD/MM/YYYY') : '-';
                let cardnumber = result[0].cardnumber ? result[0].cardnumber : '-';
                let activityname = result[0].activityname ? result[0].activityname : '-';
                let firstname = result[0].firstname ? result[0].firstname : '-';
                let lastname = result[0].lastname ? result[0].lastname : '-';
                let membername = null;
                if (firstname && lastname) {
                    membername = firstname + "/" + lastname;
                } else if (firstname && lastname !== null) {
                    membername = firstname;
                } else {
                    membername = "-"
                }

                let bookingpersonalias = result[0].bookingpersonalias ? result[0].bookingpersonalias : '-';
                let createddate = result[0].createddate ? moment(result[0].createddate).format('DD/MM/YYYY') : '-';
                let createdby = result[0].createdby ? result[0].createdby : '-';

                this.setState({ loading: false, activitydate, cardnumber, activityname, membername, bookingpersonalias, createddate, createdby });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    approvalAction = (e, action) => {
        e.preventDefault();
        this.setState({ loading: true, action });
        //define parameter
        let activityid = [];
        activityid.push(this.props.activityid);
        let actiontype = (action === 'approve' ? 'APPROVED' : 'REJECTED');

        let message = 'Data has been updated';
        let url = api.url.memberairactivity.namecheckapproval;
        let data = { activityid, actiontype };

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
        const { actionType, cancelModal } = this.props;
        const { formrender, loading } = this.state;
        const { activitydate, cardnumber, activityname, membername, bookingpersonalias, createddate, createdby } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
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
                                <Col span={11}>
                                    <Form.Item label="Activity Date" {...formItemStyle}>
                                        <span className="ant-form-text">: {activitydate}</span>
                                    </Form.Item>
                                    <Form.Item label="Card Number" {...formItemStyle}>
                                        <span className="ant-form-text">: {cardnumber}</span>
                                    </Form.Item>
                                    <Form.Item label="Activity Name" {...formItemStyle}>
                                        <span className="ant-form-text">: {activityname}</span>
                                    </Form.Item>
                                </Col>
                                <Col span={13}>
                                    <Form.Item label="Member Name" {...formItemStyle}>
                                        <span className="ant-form-text">: {membername}</span>
                                    </Form.Item>
                                    <Form.Item label="Booking Person Alias" {...formItemStyle}>
                                        <span className="ant-form-text">: {bookingpersonalias}</span>
                                    </Form.Item>
                                    <Form.Item label="Created Date" {...formItemStyle}>
                                        <span className="ant-form-text">: {createddate}</span>
                                    </Form.Item>
                                    <Form.Item label="Created by" {...formItemStyle}>
                                        <span className="ant-form-text">: {createdby}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Text>Are you sure to {actionType} this data?</Text>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                <Button htmlType="button" type="default" label="Cancel" onClick={cancelModal} />
                                <Button htmlType="button" type="primary" label="OK" onClick={(e) => this.approvalAction(e, actionType)} />
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