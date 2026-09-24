import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title, Text } = Typography;

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
            fieldvalue: {
                certificateidtext: '',
                ticketofficecode: 'CGKTSGA',
                branchofficecode: 'JKTDM',
                awardcode: 'FREEFLIGHT',
                awardtypecode: 'FF1234567890',
                year4digit: 'year now format yyyy',
                year2digit: 'year now format yy',
                sequencenumber: '000001',
                checkdigit: '7'
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.awardcode;
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

        for (const field in this.state.fieldvalue) {
            this.props.form.setFieldsValue({ [field]: this.state.fieldvalue[field] });
        }
    }

    getDetail = (awardcode) => {
        let url = api.url.awardmaster.detailcertificate;
        let data = { awardcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let certificateidtext = (result.certificateidtext) ? result.certificateidtext : '';

                let setValue = { certificateidtext };
                this.props.form.setFieldsValue(setValue);

                this.setState({ fieldvalue: { ...this.state.fieldvalue, certificateidtext } });
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
                let awardcode = this.props.awardcode;
                let certificateidtext = input.certificateidtext;

                let data = { awardcode, certificateidtext };
                let message = 'Data has been updated';
                let url = api.url.awardmaster.updatecertificate;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    addCharacter = (id, code) => {
        this.setState({
            fieldvalue: {
                ...this.state.fieldvalue,
                [id]: this.props.form.getFieldValue(id),
                certificateidtext: this.state.fieldvalue.certificateidtext + code
            }
        });
        this.props.form.setFieldsValue({ certificateidtext: this.state.fieldvalue.certificateidtext + code });
    };

    handleAddCharacterChange = (event, code) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, [code]: event.target.value } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 4 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 20 } }
        };
        const { titlepage, actionspage, formrender, fieldvalue } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { certificateidtext } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Certificate Text ID | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Certificate Text ID</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} labelAlign='left' onSubmit={this.saveAction}>
                            <Row gutter={24} style={{ marginBottom: 10 }}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <InputText form={this.props.form} labeltext="Cerfiticate ID Text" datafield="certificateidtext" onChange={(e) => this.handleAddCharacterChange(e, "certificateidtext")} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginBottom: 20 }}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Text strong>Preview</Text>
                                    <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Text>
                                        {
                                            (certificateidtext)
                                                .split("{ticket-office-code}").join(fieldvalue.ticketofficecode)
                                                .split("{branch-office-code}").join(fieldvalue.branchofficecode)
                                                .split("{award-code}").join(fieldvalue.awardcode)
                                                .split("{award-type-code}").join(fieldvalue.awardtypecode)
                                                .split("{year-4-digit}").join(fieldvalue.year4digit)
                                                .split("{year-2-digit}").join(fieldvalue.year2digit)
                                                .split("{sequence-number}").join(fieldvalue.sequencenumber)
                                                .split("{check-digit}").join(fieldvalue.checkdigit)
                                        }
                                    </Text>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginBottom: 20 }}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Text strong>Template Text</Text>
                                    <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xl={12} md={12} sm={24} >
                                            <Row gutter={24}>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Ticket Office Code" style={{ width: '100%' }} onClick={() => this.addCharacter("ticketofficecode", "{ticket-office-code}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="ticketofficecode" onChange={(e) => this.handleAddCharacterChange(e, "ticketofficecode")} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Branch Office Code" style={{ width: '100%' }} onClick={() => this.addCharacter("branchofficecode", "{branch-office-code}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="branchofficecode" onChange={(e) => this.handleAddCharacterChange(e, "branchofficecode")} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Award Code" style={{ width: '100%' }} onClick={() => this.addCharacter("awardcode", "{award-code}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="awardcode" onChange={(e) => this.handleAddCharacterChange(e, "awardcode")} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Award Type Code" style={{ width: '100%' }} onClick={() => this.addCharacter("awardtypecode", "{award-type-code}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="awardtypecode" onChange={(e) => this.handleAddCharacterChange(e, "awardtypecode")} disabled={generalfielddisabled} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col className="gutter-row" xl={12} md={12} sm={24} >
                                            <Row gutter={24}>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Year (4 Digits)" style={{ width: '100%' }} onClick={() => this.addCharacter("year4digit", "{year-4-digit}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="year4digit" onChange={(e) => this.handleAddCharacterChange(e, "year4digit")} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Year (2 Digits)" style={{ width: '100%' }} onClick={() => this.addCharacter("year2digit", "{year-2-digit}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="year2digit" onChange={(e) => this.handleAddCharacterChange(e, "year2digit")} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Sequence Number" style={{ width: '100%' }} onClick={() => this.addCharacter("sequencenumber", "{sequence-number}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="sequencenumber" onChange={(e) => this.handleAddCharacterChange(e, "sequencenumber")} disabled={generalfielddisabled} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" type="default" label="Check Digit" style={{ width: '100%' }} onClick={() => this.addCharacter("checkdigit", "{check-digit}")} />
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                                                    <InputText wrapperCol={{ span: 24 }} form={this.props.form} datafield="checkdigit" onChange={(e) => this.handleAddCharacterChange(e, "checkdigit")} disabled={generalfielddisabled} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
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