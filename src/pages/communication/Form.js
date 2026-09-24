import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, SwitchButton, RoleSelect, DateRangeBase, Button, UploadBase, Alert, TextRich } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card, Modal } from 'antd';
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
            fieldvalue: {
                isallgroup: false,
                image: null,
                content: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                groupdisabled: false,
                contentdisabled: false
            },
            visible: false
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
            } else {
                this.componentRoleSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (id, actionspage) => {
        let url = api.url.communication.list;
        let criteria = { id };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let id = result[0].id ? result[0].id : '';
                    let referencenum = result[0].referencenum ? result[0].referencenum : '';
                    let isallgroup = result[0].isallgroup ? result[0].isallgroup : false;
                    let communicationrole = result[0].communicationrole.length ? result[0].communicationrole.map((obj) => { return obj.rolecode }) : [];
                    let effectivedate = result[0].effectivedate ? moment(result[0].effectivedate) : null;
                    let discontinuedate = result[0].discontinuedate ? moment(result[0].discontinuedate) : null;
                    let date = [effectivedate, discontinuedate];
                    let image = result[0].image ? result[0].image : null;
                    let title = result[0].title ? result[0].title : '';
                    let content = result[0].content ? result[0].content : '';
                    let groupdisabled = (actionspage !== 'view') ? result[0].isallgroup ? true : false : true;

                    let setValue = { id, referencenum, isallgroup, communicationrole, date, title, content };
                    this.props.form.setFieldsValue(setValue);

                    this.setState({
                        fieldvalue: { ...this.state.fieldvalue, isallgroup, image, content },
                        fielddisabled: { ...this.state.fielddisabled, groupdisabled }
                    });

                    this.componentRoleSelect.retrieveData({}, {}, actionspage);
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
                let referencenum = input.referencenum;
                let isallgroup = (input.isallgroup) ? input.isallgroup : false;
                let communicationrole = (input.communicationrole) ? input.communicationrole.map((obj, key) => { return { rolecode: obj } }) : null;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let title = input.title;
                let content = this.state.fieldvalue.content;

                let request = (isallgroup) ? { referencenum, isallgroup, title, effectivedate, discontinuedate, content } : { referencenum, isallgroup, communicationrole, title, effectivedate, discontinuedate, content };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.communication.create;
                } else {
                    request.id = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.communication.update;
                }

                /* Mapping Request File*/
                var fileRequest = new FormData();
                var file = (input.image && input.image[0] && input.image[0]['originFileObj']) ? input.image[0]['originFileObj'] : null;
                fileRequest.append("file", file);
                fileRequest.append("path", '/news');
                SaveRequest(url, request, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/communication');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeAllGroup = (value) => {
        let groupdisabled = value;
        this.props.form.setFieldsValue({ communicationrole: [] });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, groupdisabled }, fieldvalue: { ...this.state.fieldvalue, isallgroup: value } })
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleContentChange = (event) => {
        let newContent = event.editor.getData();
        console.log('newContent',newContent)
        let contentdisabled = (this.state.actionspage === 'view') ? event.editor.setReadOnly(true) : event.editor.setReadOnly(false);
        this.setState({ fieldvalue: { ...this.state.fieldvalue, content: newContent }, fielddisabled: { ...this.state.fielddisabled, contentdisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, contentdisabled, groupdisabled } = this.state.fielddisabled;
        const { isallgroup, image, content } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        let getContent = this.props.form.getFieldValue('content');
        console.log('content', content)
        console.log('getContent', getContent)

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " News | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} News</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                    <InputText form={this.props.form} labeltext="Reference Number" datafield="referencenum" maxLength={255} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Is All Group?" datafield="isallgroup" onChange={this.onChangeAllGroup} disabled={generalfielddisabled} />
                                    <RoleSelect ref={(e) => { this.componentRoleSelect = e }} form={this.props.form} mode="multiple" labeltext="Group" datafield="communicationrole" validationrules={(isallgroup) ? [] : ['required']} disabled={groupdisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                    <Row gutter={2}>
                                        <Col className="gutter-row" xl={13} lg={13} md={13} sm={13}>
                                            <UploadBase labelCol={{ span: 15 }} wrapperCol={{ span: 9 }} form={this.props.form} labeltext="Upload Image" validationrules={(actionspage === 'create') ? ['required'] : []} datafield="image" disabled={generalfielddisabled} />
                                        </Col>
                                        {
                                            (actionspage !== 'create') ?
                                                <Col className="gutter-row" xl={11} lg={11} md={11} sm={11} style={{ lineHeight: '40px' }} >
                                                    <Button htmlType="button" label="Show Image" type="primary" onClick={this.showModal} />
                                                </Col> : null
                                        }
                                    </Row>
                                    <Modal title="Show Image" visible={this.state.visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} >
                                        <Row type="flex" justify="center">
                                            <Card hoverable style={{ maxWidth: '360px' }} bodyStyle={{ display: 'none' }} cover={<img alt="News" src={image} />} />
                                        </Row>
                                    </Modal>
                                    <InputText form={this.props.form} labeltext="Title" datafield="title" maxLength={255} validationrules={['required', 'pattern.alphanumericspace']} disabled={generalfielddisabled} />
                                    <TextRich form={this.props.form} labeltext="Content" datafield="content" content={content} events={{ "change": this.handleContentChange }} validationrules={(content) ? ['required'] : []} disabled={contentdisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
                                <Button url="/communication" htmlType="link" type="default" label="Back" />
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