import React, { Component } from 'react';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Form, Row, Col, Spin } from 'antd';
import { Button, Alert, TextArea, InputText } from '../../../components/Base/BaseComponent';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            result: {},
            resultGenConfig: null,
            fielddisabled: {
                specialfielddisabled: true,
                generalfielddisabled: false
            }
        }
    }

    componentDidMount() {
        document.title = "Terminate / Reactivate | Loyalty Management System";
        this.props.form.setFieldsValue({ notetype: 'INFORMATION' });
        this.getDetail();
        this.getConfig();
    }

    getDetail = () => {
        let url = api.url.member.profile;
        let data = { memberid: this.props.memberid, type: 'ALL' };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            let { status = {}, result } = response;
            if (status.responsecode === '0000') {
                this.setState({ result })
            } else {
                Alert.error(status.responsemessage);
            }
            this.setState({ isLoading: false });
        });
    }

    getConfig = () => {
        let url = api.url.generalconfig.list;
        let criteria = {key: "terminate.memberstatus"};
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            let { status = {}, result } = response;
            if (status.responsecode === '0000') {
                this.setState({ resultGenConfig: result[0].value })
            } else {
                Alert.error(status.responsemessage);
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { result, resultGenConfig } = this.state;
        const terminate = (Object.keys(result).length !== 0 && resultGenConfig !== null) ? resultGenConfig.search(`${result.status}`) : null;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.memberid
                let notetype = (input.notetype) ? input.notetype : null;
                let level = (notetype === 'COMPLAINT') ? input.level : null;
                let action = (terminate !== -1) ? 'TERMINATED' : 'REACTIVATE';
                let notes = (input.notes) ? input.notes : null;

                let data = { memberid, notes, notetype, level, action };

                let message = '';
                let url = '';
                if (terminate !== -1) {
                    message = 'Member has been terminated';
                    url = api.url.member.termination;
                } else if (result.status === 'TERMINATED') {
                    message = 'Member has been reactivated';
                    url = api.url.member.termination;
                } else {
                    message = 'This member can not be Terminated or Reactivated'
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                        this.props.refreshList();
                        this.props.cancelModal();
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                });
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };

        const { generalfielddisabled } = this.state.fielddisabled;

        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <InputText form={this.props.form} labeltext="Note Type" datafield="notetype" validationrules={['required']} disabled={true} />
                                <TextArea form={this.props.form} labeltext="Notes" datafield="notes" validationrules={['required']} maxLength={255} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="default" label="Save" />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));