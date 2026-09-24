import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, DetailRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
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
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                specialfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled};
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (regioncode, actionspage) => {
        let url = api.url.vendorregion.detail;
        let data = { regioncode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let regioncode = (result.regioncode) ? result.regioncode : null;
                let regionname = (result.regionname) ? result.regionname : null;
                let description = (result.description) ? result.description : null;
                
                let generalfielddisabled = (actionspage !== "view") ? false : true;

                let setValue = { regioncode, regionname, description };
                this.props.form.setFieldsValue(setValue);
                let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                this.setState({ fielddisabled });
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

                let regioncode = input.regioncode;
                let regionname = input.regionname;
                let description = input.description;

                let data = { regioncode, regionname, description };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New vendor region has been created';
                    url = api.url.vendorregion.create;
                } else {
                    message = 'Vendor region has been updated';
                    url = api.url.vendorregion.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? message : message;
                        Alert.success(message);
                        this.props.history.push('/vendor-region');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled} = this.state.fielddisabled;

        if (formrender) {
            document.title = titlepage + " Vendor Region | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Vendor</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Region Code" datafield="regioncode" form={this.props.form} validationrules={[`required`]} disabled={specialfielddisabled} />
                                    <InputText labeltext="Region Name" datafield="regionname" form={this.props.form} validationrules={[`required`]} disabled={generalfielddisabled} />
                                    <InputText labeltext="Description" datafield="description" form={this.props.form} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button url="/vendor-region" htmlType="link" type="default" label="Back" />
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
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));