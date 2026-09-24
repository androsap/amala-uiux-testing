import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, InputText } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

const prefixmenuname = 'MMBRIDT'
const menucode = 'MMBRIDT'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            memberidentityid: null,
            fielddisabled: {
                specialfielddisabled: true,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.memberidentityid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'View';
            let actionspage = 'view';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'Edit';
                actionspage = 'update';
                generalfielddisabled = false;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (memberidentityid) => {
        let url = api.url.memberidentity.list;
        let data = { memberidentityid };

        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, data).then((response) => {
            const { status = {}, result } = response;
            const { responsecode } = status;
            if (responsecode === '0000') {
                if (result) {
                    const { memberidentityid } = result[0] || {};
                    this.props.form.setFieldsValue({ memberidentityid });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let reason = (input.reason) ? input.reason : null;
                let memberidentityid = this.props.memberidentityid;

                let data = { reason, memberidentityid };
                let url = api.url.memberidentity.reject;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        let message = (responsemessage) ? responsemessage : 'Selected data has been rejected';
                        Alert.success(message);
                        this.props.cancelModal();
                        //window.location.reload();
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
                                <InputText form={this.props.form} labeltext="Reason" datafield="reason" validationrules={['required']} disabled={generalfielddisabled} />
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