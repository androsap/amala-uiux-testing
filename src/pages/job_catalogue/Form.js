import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, LanguageSelect } from '../../components/Base/BaseComponent';
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
            fieldvalue: {},
            fielddisabled: {
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Update';
            let actionspage = 'update';
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
            }
            //change into update page
            this.setState({ titlepage, actionspage });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
        this.componentLanguageSelect.retrieveData();
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

    getDetail = (jobcode, actionspage) => {
        let url = api.url.jobcatalogue.list;
        let criteria = { jobcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {

                    let { active, langcode, langname, jobcode, jobtitle } = this.isArray(result, 0) ? result[0] : {};
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { jobcode, langcode, langname, jobtitle };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { jobcode, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

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

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });

                let data = {};
                Object.keys(values).map(function (key) {
                    var exclude = ['jobcode'];
                    if (exclude.includes(key)) {
                        return data[key] = (values[key] !== undefined) ? values[key].toUpperCase() : null;
                    } else {
                        return data[key] = (values[key] !== undefined) ? values[key] : null;
                    }
                });

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.jobcatalogue.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.jobcatalogue.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/job-catalogue');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(jobcode, active) {
        let url = (active) ? api.url.jobcatalogue.deactivate : api.url.jobcatalogue.activate;
        let data = { jobcode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { active, jobcode } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        let specialfielddisabled = (actionspage === 'create') ? false : true;

        if (formrender) {
            document.title = titlepage + " Job Data | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Job Data</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Job Code" datafield="jobcode" form={this.props.form} maxLength={5} validationrules={[`required`,`pattern.letter`, `max.5`]} disabled={specialfielddisabled} />
                                    <InputText labeltext="Job Title" datafield="jobtitle" form={this.props.form} maxLength={45} validationrules={[`required`,`pattern.letterspace`, `max.45`]} disabled={generalfielddisabled} />
                                    <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} form={this.props.form} labeltext="Language" datafield="langcode" validationrules={['required']} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            (active) ? <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button> : "" 
                                            : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (active) ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(jobcode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(jobcode, active)} /> : ""
                                }
                                <Button url="/job-catalogue" htmlType="link" type="default" label="Back" />
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