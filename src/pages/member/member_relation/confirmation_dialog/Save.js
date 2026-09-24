import React from 'react';
import { DetailRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { Button, Alert } from '../../../../components/Base/BaseComponent';
import { Form, Spin, Row, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail() {
        let cardnumber = this.props.data.cardnumber;
        let url = api.url.member.profile;
        let data = { cardnumber };
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let memberid = (result.memberid) ? result.memberid : '-';
                    let firstname = (result.firstname) ? result.firstname : '-';
                    let lastname = (result.lastname) ? result.lastname : '';
                    let email = (result.email) ? result.email : '';
                    let name = firstname + ' ' + lastname;
                    let dateofbirth = (result.dateofbirth) ? moment(result.dateofbirth).format('DD/MM/YYYY') : '-';
                    this.setState({ loading: false, memberid, name, dateofbirth, email });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    saveAction = (e, actionspage) => {
        e.preventDefault();
        this.setState({ loading: true, actionspage });
        //define parameter
        let message = '';
        let url = '';
        if (actionspage === 'create') {
            message = 'New data has been created';
            url = api.url.memberrelation.enroll;
        } else {
            message = 'Data has been updated';
            url = api.url.memberrelation.update;
        }
        let data = this.props.data;

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
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { actionspage } = this.props;
        const { formrender, loading } = this.state;
        const { name, dateofbirth, email } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
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
                                <Form.Item label="Name" {...formItemStyle}>
                                    <span className="ant-form-text">: {name}</span>
                                </Form.Item>
                                <Form.Item label="Date of Birth" {...formItemStyle}>
                                    <span className="ant-form-text">: {dateofbirth}</span>
                                </Form.Item>
                                <Form.Item label="Email" {...formItemStyle}>
                                    <span className="ant-form-text">: {email}</span>
                                </Form.Item>
                            </Row>
                            <Text>Are you sure to save this data?</Text>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                <Button htmlType="button" type="default" label="Cancel" onClick={this.props.cancelModal} />
                                <Button htmlType="button" type="primary" label="OK" onClick={(e) => this.saveAction(e, actionspage)} />
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