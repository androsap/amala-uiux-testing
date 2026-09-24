import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, TextRich, TierSelect, SelectBase, SwitchButton, MultiInputSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';


const { Title } = Typography;

const optionsStatus = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
]
const optionsType = [
    { label: 'PDF', value: 'PDF' },
    { label: 'JPG', value: 'JPG' }
]
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
            checked: false,
            fieldvalue: {
                active: true,
                bodyemail: null,
                attachment: null
            },
            fielddisabled: {
                generalfielddisabled: false
            }
        };
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentTierSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    isArray(data, length) {
        let result = false;
        if (data) {
            if (typeof data === "object") {
                if (Array.isArray(data)) {
                    if (typeof length === "number") {
                        if (data.length > length) {
                            result = true;
                        }
                    } else {
                        result = true;
                    }
                }
            }
        }
        return result;
    }

    getDetail = (templateid) => {
        let url = api.url.mileagestatementtemplate.list;
        let criteria = { templateid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                const {
                    templateid,
                    templatename,
                    tierid,
                    status,
                    subjectemail,
                    ccemail,
                    bccemail,
                    attachmenttype,
                    hasattachment,
                    attachmentprotected,
                    sender,
                    senderpersona,
                    active,
                    bodyemail,
                    attachment
                } = this.isArray(result, 0) ? result[0] : {};

                if (templateid) {
                    let ccemails = [],
                        bccemails = [];

                    if (ccemail) ccemails = ccemail.split(";")
                    if (bccemail) bccemails = bccemail.split(";")

                    let setValue = { templateid, templatename, tierid, status, subjectemail, ccemails, bccemails, attachmenttype, hasattachment, attachmentprotected, sender, senderpersona, bodyemail, attachment };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { templateid, active, bodyemail, attachment, hasattachment };
                    this.setState({ fieldvalue });

                    this.componentTierSelect.retrieveData();
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
        const { bodyemail, attachment } = this.state.fieldvalue;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                // this.setState({ isLoading: true });
                //define parameter
                let templateid = input.templateid;
                let templatename = input.templatename;
                let tierid = input.tierid;
                let sender = input.sender;
                let status = (input.status) ? input.status : null;
                let subjectemail = (input.subjectemail) ? input.subjectemail : null;
                let ccemails = (input.ccemails) ? input.ccemails : null;
                let bccemails = (input.bccemails) ? input.bccemails : null;
                let senderpersona = (input.senderpersona) ? input.senderpersona : null;
                let attachmenttype = (input.attachmenttype) ? input.attachmenttype : null;
                let hasattachment = (input.hasattachment) ? true : false;
                let attachmentprotected = (input.attachmentprotected && hasattachment) ? true : false;
                let bodyattachment = (hasattachment) ? attachment : '';

                let data = {
                    templateid, templatename, tierid, status, subjectemail, ccemails, bccemails, attachmenttype,
                    hasattachment, attachmentprotected, sender, senderpersona, bodyemail, attachment: bodyattachment
                };
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.mileagestatementtemplate.create;
                } else {
                    data.templateid = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.mileagestatementtemplate.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/mileage-statement-template');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    handleBodyChange = (event) => {
        let bodyemail = event.editor.getData();
        // setTimeout(() => {
        //     const { resetFields, setFieldsValue } = this.props.form;
        //     if(!bodyemail) resetFields("bodyemail")
        //     else setFieldsValue({ bodyemail })
        // })
        this.setState({ fieldvalue: { ...this.state.fieldvalue, bodyemail } });
    }

    handleAttachmentChange = (event) => {
        let attachmentfield = event.editor.getData();
        this.setState({ fieldvalue: { ...this.state.fieldvalue, attachment: attachmentfield } });
    }

    handleCcEmailChange = (value) => {
        let ccemails = value.editor.getData();
        this.setState({ fieldvalue: { ...this.state.fieldvalue, ccemail: ccemails } });
    }

    handleBccEmailChange = (value) => {
        let bccemails = value.editor.getData();
        this.setState({ fieldvalue: { ...this.state.fieldvalue, bccemail: bccemails } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { isLoading, titlepage, actionspage, formrender, } = this.state;
        const { menucode, prefixmenuname, form } = this.props;
        const { bodyemail, attachment } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;

        let hasAtt = form.getFieldValue('hasattachment');

        if (formrender) {
            document.title = titlepage + " Template | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Template</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Divider style={{ paddingTop: 15 }}>Template Description</Divider>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                    <InputText form={form} labeltext="Template Name" datafield="templatename" maxLength={20} validationrules={['required', 'pattern.alphabetandspace']} disabled={generalfielddisabled} />
                                    <TierSelect ref={(e) => { this.componentTierSelect = e }} form={form} labeltext="Tier" datafield="tierid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SelectBase form={form} options={optionsStatus} datafield="status" labeltext="Status" disabled={generalfielddisabled} />
                                </Col>

                                <Divider style={{ paddingTop: 15 }}>Template Details</Divider>
                                <Col className="gutter-row" xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                    <Col span={12}>
                                        <InputText form={form} labeltext="Subject Email" datafield="subjectemail" maxLength={50} validationrules={['required', 'pattern.alphanumericspace']} disabled={generalfielddisabled} />
                                        <MultiInputSelect form={form} mode={"tags"} labeltext="CC Email" datafield="ccemails" maxLength={255} validationrules={['pattern.email']} onChange={this.handleCcEmailChange} disabled={generalfielddisabled} />
                                        <MultiInputSelect form={form} mode={"tags"} labeltext="BCC Email" datafield="bccemails" maxLength={255} validationrules={['pattern.email']} onChange={this.handleBccEmailChange} disabled={generalfielddisabled} />
                                    </Col>
                                    <Col span={12}>
                                        <InputText form={form} labeltext="Sender Email" datafield="sender" maxLength={50} validationrules={['required', 'pattern.email']} disabled={generalfielddisabled} />
                                        <InputText form={form} labeltext="Sender Persona" datafield="senderpersona" maxLength={50} validationrules={['pattern.alphanumericspace']} disabled={generalfielddisabled} />
                                    </Col>
                                </Col>

                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                    <TextRich
                                        form={form} labeltext="Body Email"
                                        datafield="bodyemail"
                                        content={bodyemail}
                                        events={{ "change": this.handleBodyChange }}
                                    />
                                    <SwitchButton form={form} labeltext="Has Attachment" datafield="hasattachment" disabled={generalfielddisabled} />
                                    <TextRich
                                        form={form}
                                        labeltext="Attachment"
                                        datafield="attachment"
                                        content={attachment}
                                        events={{ "change": this.handleAttachmentChange }}
                                        style={{ display: (hasAtt) ? 'block' : 'none' }}
                                    />
                                    <SelectBase form={form} options={optionsType} datafield="attachmenttype" labeltext="Save Attachment As" style={{ display: (hasAtt) ? 'block' : 'none' }} validationrules={hasAtt ? ['required'] : []} />
                                    <SwitchButton form={form} labeltext="Protected" datafield="attachmentprotected" style={{ display: (hasAtt) ? 'block' : 'none' }} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Create" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button url="/mileage-statement-template" htmlType="link" type="default" label="Back" />
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
