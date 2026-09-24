import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, SwitchButton, Button, Alert, RoleSelect, CustomTransactionSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title } = Typography;

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
            customtrxcode: null,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let rolecode = this.props.location.state.rolecode;
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, rolecode, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentRoleSelect.retrieveData();
                this.componentCustomTransactionSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (customtrxcode, rolecode, actionspage) => {
        let url = api.url.customtransactionrole.detail;
        let data = { customtrxcode, rolecode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let customtrxrole_id = (result[0].customtrxrole_id) ? result[0].customtrxrole_id : undefined;
                    let customtrx = (result[0].customtrxcode) ? [result[0].customtrxcode] : undefined;
                    let rolecode = (result[0].rolecode) ? result[0].rolecode : undefined;
                    let status = result[0].status === 'ACTIVE' ? true : false;
                    
                    let setValue = { customtrxrole_id, customtrx, rolecode, status };
                    this.props.form.setFieldsValue(setValue);

                    this.componentCustomTransactionSelect.retrieveData({}, { customtrx }, actionspage);
                    this.componentRoleSelect.retrieveData({}, { rolecode }, actionspage);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let customtrxrole_id = this.props.match.params.ID;
                let customtrx = input.customtrx;
                let rolecode = input.rolecode;
                let status = input.status ? 'ACTIVE' : 'INACTIVE';
                let data = { customtrxrole_id, customtrx, rolecode, status };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.customtransactionrole.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.customtransactionrole.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/custom-transaction-role');
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
        const { titlepage, actionspage, formrender, fielddisabled } = this.state;
        const { generalfielddisabled, specialfielddisabled } = fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Custom Transaction | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Custom Transaction</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <RoleSelect ref={(e) => { this.componentRoleSelect = e }} form={this.props.form} labeltext="Role" datafield="rolecode" validationrules={['required']} disabled={specialfielddisabled} />
                                    <CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} form={this.props.form} mode='multiple' labeltext="Custom Transaction" datafield="customtrx" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Status" datafield="status" disabled={generalfielddisabled} />
                                </Col >
                            </Row >
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
                                <Button url="/custom-transaction-role" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form >
                    </Spin >
                </Row >
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));