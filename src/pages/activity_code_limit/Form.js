import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, TextArea, Button, Alert, SelectBase } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsActivityType = [
    { label: "TRANSFER POINT", value: "TRANSFERPOINT" },
    { label: "BUY MILES", value: "BUYMILES" },
    { label: "GIFT", value: "GIFT" },
    { label: "BONUS", value: "BONUS" },
    { label: "REINSTATE", value: "REINSTATE" },
    { label: "EXTEND", value: "EXTEND" }
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
            fielddisabled: {
                generalfielddisabled: false
            },
            fieldvalue: {
                limitcode: null,
                active: true
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
            let generalfielddisabled = true;

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
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (limitcode, actionspage) => {
        let url = api.url.activitycode.limit.list;
        let criteria = { limitcode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let limitcode = (result[0].limitcode) ? result[0].limitcode : '';
                    let nonairactivitytype = (result[0].nonairactivitytype) ? result[0].nonairactivitytype : '';
                    let limit = (result[0].limit) ? result[0].limit : '';
                    let description = (result[0].description) ? result[0].description : '';
                    let active = (result[0].active !== undefined) ? result[0].active : null;

                    let setValue = { limitcode, nonairactivitytype, limit, description };
                    this.props.form.setFieldsValue(setValue);

                    let fieldvalue = { ...this.state.fieldvalue, limitcode, active };
                    let fielddisabled = { ...this.state.fielddisabled };
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

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let nonairactivitytype = input.nonairactivitytype;
                let limitcode = input.limitcode;
                let limit = input.limit;
                let description = (input.description && input.description.length > 0) ? input.description : null;
                
                let data = { nonairactivitytype, limitcode, limit, description };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.activitycode.limit.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.activitycode.limit.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/activity-code-limit');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    deleteData(limitcode, active) {
        let url = (active) ? api.url.activitycode.limit.deactivate : api.url.activitycode.limit.activate;
        let data = { limitcode };
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
            labelCol: { xs: { span: 24 }, sm: { span: 9 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 15 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { limitcode, active } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Non Air Activity Limit | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Non Air Activity Limit</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Non-Air Activity Type" datafield="nonairactivitytype" options={optionsActivityType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Limit Code" datafield="limitcode" validationrules={['required', 'pattern.alphanumeric']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Limit" datafield="limit" validationrules={['required', 'pattern.number']} maxLength="9" disabled={generalfielddisabled} />
                                    <TextArea form={this.props.form} labeltext="Description" datafield="description" validationrules={['max.255']} disabled={generalfielddisabled} maxLength="255" />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (active) ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(limitcode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(limitcode, active)} /> : ""
                                }
                                <Button url="/activity-code-limit" htmlType="link" type="default" label="Back" />
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