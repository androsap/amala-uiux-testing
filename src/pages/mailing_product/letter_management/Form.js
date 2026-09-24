import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, LanguageSelect, PaperSelect, VariantSelect, TextArea, EnvelopeSelect } from '../../../components/Base/BaseComponent';
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
            generalfielddisabled: false,
            specialfielddisabled: false,
            papervariantfielddisabled: true,
            envelopevariantfielddisabled: true
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let papervariantfielddisabled = false;
            let envelopevariantfielddisabled = false;
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                papervariantfielddisabled = true;
                envelopevariantfielddisabled = true;
            }
            this.setState({ titlepage, actionspage, specialfielddisabled: true, papervariantfielddisabled, envelopevariantfielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            }
        }
        this.componentLanguageSelect.retrieveData();
        this.componentPaperSelect.retrieveData();
        this.componentEnvelopeSelect.retrieveData();
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (lettercode, actionspage) => {
        let url = api.url.letter.detail;
        this.setState({ isLoading: true });
        DetailRequest(url, { lettercode }).then((response) => {
            const { status = {}, result } = response;
            if (status.responsecode === '0000') {
                const { lettercode, lettername, language, description } = result;
                let papercode = result.papervariant.inventorycode;
                let papervariantid = result.papervariant.inventoryvariantid;
                let envelopecode = result.envelopevariant.inventorycode;
                let envelopevariantid = result.envelopevariant.inventoryvariantid;

                this.props.form.setFieldsValue({ lettername, language, lettercode, papervariantid, papercode, envelopecode, envelopevariantid, description });
                this.setState({ lettername, isLoading: false });

                this.componentVariantSelect.retrieveData({ inventorycode: papercode }, { papervariantid }, actionspage);
                this.componentVariantSelect2.retrieveData({ inventorycode: envelopecode }, { envelopevariantid }, actionspage);
            } else {
                Alert.error(status.responsemessage);
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false, isLoading: false });
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });

                const { lettercode, lettername, language, papervariantid, envelopevariantid, description } = values || null;
                let data = { lettercode, lettername, language, papervariantid, envelopevariantid, description };
                let url = (actionspage === 'create') ? api.url.letter.create : api.url.letter.update;

                SaveRequest(url, data).then((response) => {
                    const { status = {} } = response;
                    if (status.responsecode === '0000') {
                        Alert.success(status.responsemessage);
                        this.props.history.push('/letter-management');
                    } else Alert.error(status.responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    handleChangePaper = (papercode) => {
        let papervariantid = undefined;
        let papervariantfielddisabled = (papercode) ? false : true;

        this.componentVariantSelect.retrieveData({ inventorycode: papercode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled }, papervariantfielddisabled });
        this.props.form.setFieldsValue({ papervariantid });
    }

    handleChangeEnvelope = (envelopecode) => {
        let envelopevariantid = undefined;
        let envelopevariantfielddisabled = (envelopecode) ? false : true;

        this.componentVariantSelect2.retrieveData({ inventorycode: envelopecode });
        this.setState({ fielddisabled: { ...this.state.fielddisabled }, envelopevariantfielddisabled });
        this.props.form.setFieldsValue({ envelopevariantid });
    }

    render() {
        const { titlepage, actionspage, formrender, isLoading, lettername, responseMessage, generalfielddisabled, specialfielddisabled, papervariantfielddisabled, envelopevariantfielddisabled } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        if (formrender) {
            document.title = titlepage + ' Letter | Loyalty Management System';
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} {(actionspage === 'create') ? 'Letter' : lettername}</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext='Letter Code' datafield='lettercode' form={this.props.form} maxLength={225} validationrules={[`required`, `max.225`]} disabled={specialfielddisabled} />
                                    <InputText labeltext='Letter Name' datafield='lettername' form={this.props.form} maxLength={225} validationrules={[`required`, `max.225`]} />
                                    <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} form={this.props.form} labeltext='Language' datafield='language' validationrules={['required']} />
                                    <Row gutter={24}>
                                        <Col xs={24} sm={16}>
                                            <PaperSelect labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} ref={(e) => { this.componentPaperSelect = e }} form={this.props.form} labeltext='Paper' datafield='papercode' validationrules={['required']} onChange={this.handleChangePaper} disabled={generalfielddisabled} usingTitle={true} />
                                        </Col>
                                        <Col xs={24} sm={8}>
                                            <VariantSelect wrapperCol={{ span: 24 }} ref={(e) => { this.componentVariantSelect = e }} form={this.props.form} placeholder='Variant' datafield='papervariantid' validationrules={['required']} disabled={papervariantfielddisabled} usingTitle={true} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col xs={24} sm={16} >
                                            <EnvelopeSelect labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} ref={(e) => { this.componentEnvelopeSelect = e }} form={this.props.form} labeltext='Envelope' datafield='envelopecode' onChange={this.handleChangeEnvelope} validationrules={['required']} disabled={generalfielddisabled} usingTitle={true} />
                                        </Col>
                                        <Col xs={24} sm={8} >
                                            <VariantSelect wrapperCol={{ span: 24 }} ref={(e) => { this.componentVariantSelect2 = e }} form={this.props.form} placeholder='Variant' datafield='envelopevariantid' validationrules={['required']} disabled={envelopevariantfielddisabled} usingTitle={true} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <TextArea labeltext='Notes' datafield='description' form={this.props.form} maxLength={225} validationrules={[`max.225`]} />
                                </Col>
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                                <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={(actionspage === 'create') ? 'CREATE' : 'UPDATE'}></Button>
                                <Button url='/letter-management' htmlType='link' type='default' label='Back' />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));