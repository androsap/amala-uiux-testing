import React, { Component } from 'react';
import { SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { SwitchButton, Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Alert as AlertAnt, Typography } from 'antd';

const { Text } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let mergeTypeEnum = (input.mergeTypeEnum) ? 'ADMIN' : 'MEMBER';
                let email = this.props.email;
                let memberphoneid = this.props.phone;
                let memberaddressid = this.props.address;
                let mastermember = this.props.memberOri;
                let mergewithid = this.props.memberDes;

                let data = { email, memberphoneid, memberaddressid, mastermember, mergewithid, mergeTypeEnum };

                let message = 'New data has been merged';
                let url = api.url.member.merging;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        let mergeid = response.result.mergeid;
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        if (mergeid) window.location.href = `/merging-account/detail/${mergeid}`;
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        
        document.title = "Merge Account Confirmation";
        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row">
                                <AlertAnt
                                    type="warning"
                                    showIcon
                                    message={<span style={{ fontWeight: 600 }}>Approval by Admin</span>}
                                    description={
                                        <div>
                                            <div style={{ marginBottom: 12 }}>
                                                Automatically merge members without approval when enabled.
                                            </div>
                                            <SwitchButton form={this.props.form} datafield="mergeTypeEnum" />
                                        </div>
                                    }
                                    style={{ borderRadius: 6 }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center">
                            <Col span={24} style={{ textAlign: 'center', marginTop: 20 }}>
                                <Text>
                                    You're about to request <b>merge</b> {this.props.cardnumberOri} to {this.props.cardnumberDes} <br />
                                    After merge success, your origin member will be <b>deleted</b>. <br /><br />
                                    Are you sure you want to request merge?
                                </Text>
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 20 }}>
                            <Button htmlType="submit" type="primary" label="Yes, Request"></Button>
                            <Button htmlType="button" label="Cancel" typtype="default" onClick={this.props.handleCancel} />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));