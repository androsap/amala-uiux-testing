import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, SelectBase, DatePickerBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';
import SaveConfirmation from './confirmation_dialog/Save';
import moment from 'moment';

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
            visible: false,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    checkPermission() {
        let id = this.props.match.params.memberrelationid;
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

    getDetail = (memberrelationid, actionspage) => {
        let url = api.url.memberrelation.list;
        let criteria = { memberrelationid };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let relationtype = (result[0].relationtype) ? result[0].relationtype : undefined;
                    let cardnumber = (result[0].cardnumber) ? result[0].cardnumber : undefined;
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { relationtype, cardnumber, startdate };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { ...this.state.fieldvalue };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });
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
                this.setState({ isLoading: true });
                //define parameter
                let memberidparent = this.props.match.params.ID;
                let relationtype = input.relationtype;
                let cardnumber = input.cardnumber;
                let startdate = moment(input.startdate).format("YYYY-MM-DD");

                let data = { memberidparent, relationtype, cardnumber, startdate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.memberrelation.enroll;
                } else {
                    message = 'Data has been updated';
                    url = api.url.memberrelation.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                        this.props.history.push('/' + this.props.match.url.split('/')[1] + '/form/' + memberidparent + '/member-relation');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleSaveModal = (cardnumber) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            let memberidparent = this.props.match.params.ID;
            let relationtype = input.relationtype;
            let startdate = moment(input.startdate).format("YYYY-MM-DD");

            let data = { memberidparent, relationtype, cardnumber, startdate };
            if (!err) { this.setState({ visible: true, data }) }
        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleOk = () => {
        this.setState({ visible: false });
        this.props.refreshHeader();
        this.props.history.push('/member-corporate/form/' + this.props.match.params.ID + '/member-relation');
    };

    render() {
        const { titlepage, actionspage, formrender, visible, data } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const optionsRelationType = [
            { label: 'CORPORATE', value: 'Corporate' }
        ]

        const parentUrl = this.props.match.url.split('/')[1];
        const getValueCardNumber = this.props.form.getFieldValue('cardnumber');

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Member Relation | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Modal title="Save Confirmation" visible={visible} onCancel={this.handleCancel} destroyOnClose={true} footer={null}>
                        <SaveConfirmation actionspage={actionspage} data={data} closemodalrefresh={this.handleOk} cancelModal={this.handleCancel} />
                    </Modal>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage + (parentUrl === 'member' ? ' Member Active' : ' Member Relation')}</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Relation Type" datafield="relationtype" options={optionsRelationType} defaultValue="Corporate" disabled />
                                    <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" validationrules={['required', 'pattern.number', 'max.20',]} maxLength="20" disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Start Date" datafield="startdate" validationrules={['required']} maxDate={moment()} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="button" type="primary" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={() => this.handleSaveModal(getValueCardNumber)} />
                                        : (actionspage === 'update') ?
                                            <Button htmlType="button" type="primary" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleSaveModal(getValueCardNumber)} />
                                            : null
                                }
                                <Button url={'/' + this.props.match.url.split('/')[1] + '/form/' + this.props.match.params.ID + '/member-relation'} htmlType="link" type="default" label="Back" />
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
export default connect(mapStateToProps)(Form.create()(App));