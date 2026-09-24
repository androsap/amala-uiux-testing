import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, TextArea, Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { Tabs } from 'antd';
import PartnerList from './partnerlist/Index';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },
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

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (partnergroupcode, actionspage) => {
        let url = api.url.partnergroup.list;
        let criteria = { partnergroupcode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let partnergroupcode = (result[0].partnergroupcode) ? result[0].partnergroupcode : '';
                    let groupname = (result[0].groupname) ? result[0].groupname : '';
                    let contactperson = (result[0].contactperson) ? result[0].contactperson : '';
                    let email = (result[0].email) ? result[0].email : '';
                    let address = (result[0].address) ? result[0].address : '';

                    let setValue = { partnergroupcode, groupname, contactperson, email, address };
                    this.props.form.setFieldsValue(setValue);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                let partnergroupcode = input.partnergroupcode.toUpperCase();
                let groupname = input.groupname;
                let contactperson = (input.contactperson !== undefined && input.contactperson.length > 0) ? input.contactperson : undefined;
                let email = (input.email !== undefined && input.email.length > 0) ? input.email : undefined;
                let address = (input.address !== undefined && input.address.length > 0) ? input.address : undefined;

                let data = { partnergroupcode, groupname, contactperson, email, address };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.partnergroup.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.partnergroup.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/partner-group');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Partner Group | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Partner Group</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.loading}>
                        <Tabs defaultActiveKey="1" style={{ marginTop: '-20px' }}>
                            <TabPane tab="Detail Information" key="1">
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <InputText form={this.props.form} labeltext="Partner Group Code" datafield="partnergroupcode" maxLength={20} validationrules={['required', 'pattern.alphanumeric', 'max.20',]} disabled={specialfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Group Name" datafield="groupname" maxLength={100} validationrules={['required', 'pattern.alphanumericspace', 'max.100',]} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Contact Person" datafield="contactperson" maxLength={100} validationrules={['max.100']} disabled={generalfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Email" datafield="email" maxLength={100} validationrules={['pattern.email', 'max.100']} disabled={generalfielddisabled} />
                                            <TextArea form={this.props.form} labeltext="Address" datafield="address" maxLength={255} validationrules={['max.255']} disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                        {
                                            (actionspage === 'create') ?
                                                <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                                : (actionspage === 'update') ?
                                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                                    : null
                                        }
                                        <Button url="/partner-group" htmlType="link" type="default" label="Back" />
                                    </Row>
                                </Form>
                            </TabPane>
                            {
                                (actionspage !== 'create') && (usermenu["PARTLIST"]["PARTLIST_ACCESS"]) ?
                                    <TabPane tab="Partner List" key="2">
                                        <PartnerList partnergroupcode={this.props.match.params.ID} />
                                    </TabPane> : ""
                            }
                        </Tabs>
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