import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, CategoryTypeRadioButton, CategoryCodeSelect } from '../../components/Base/BaseComponent';
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
            fieldvalue: {
                categorytype: null,
                awardtypecode: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                categorycodedisabled: true
            },
            optionsCategoryType: []
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
            let categorycodedisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                categorycodedisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled, categorycodedisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentCategoryTypeRBtn.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (awardtypecode) => {
        let url = api.url.awardtype.list;
        //decodeURIComponent, handle for encode special char in awardtypecode
        awardtypecode = decodeURIComponent(awardtypecode);
        let criteria = { awardtypecode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let awardtypecode = result[0].awardtypecode ? result[0].awardtypecode : null;
                    let awardtypename = result[0].awardtypename ? result[0].awardtypename : null;
                    let categorytype = result[0].categorytype ? result[0].categorytype : null;
                    let categorycode = result[0].categorycode ? result[0].categorycode : null;

                    let setValue = { awardtypecode, awardtypename, categorytype, categorycode };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { awardtypecode };
                    let fielddisabled = { ...this.state.fielddisabled };
                    this.setState({ fieldvalue, fielddisabled });


                    this.componentCategoryTypeRBtn.retrieveData();
                    this.componentCategoryCodeSelect.retrieveData({ categorytype });
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
                    var exclude = ['awardtypecode'];
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
                    url = api.url.awardtype.create;
                } else {
                    //decodeURIComponent, handle for encode special char in awardtypecode
                    data.awardtypecode = decodeURIComponent(this.props.match.params.ID);
                    message = 'Data has been updated';
                    url = api.url.awardtype.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/award-type');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(awardtypecode, active) {
        let url = (active) ? api.url.awardtype.deactivate : api.url.awardtype.activate;
        let data = { awardtypecode };
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

    onChangeCategoryType = (event) => {
        let categorytype = event === null ? null : event.target.value;

        this.componentCategoryCodeSelect.retrieveData({ categorytype });
        this.props.form.setFieldsValue({ categorycode: undefined });

        let categorycodedisabled = (categorytype) ? false : true;
        let fieldvalue = { ...this.state.fieldvalue, categorytype };
        let fielddisabled = { ...this.state.fielddisabled, categorycodedisabled };
        this.setState({ fieldvalue, fielddisabled });
    }

    // handleAwardTypeCode = (rule, value, callback) => {
    //     var result = value.match(" ");
    //     if (result && result.length > 0) {
    //         callback("Award Type Code not allowed space");
    //     }
    //     callback();
    // }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled, categorycodedisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        let validationawardtypecode = (actionspage === 'create') ? ['required', 'max.20', 'pattern.alphanumeric'] : ['required', 'max.20'];

        if (formrender) {
            document.title = titlepage + " Award Type | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Award Type</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Award Type Code" datafield="awardtypecode" form={this.props.form} maxLength={20} validationrules={validationawardtypecode} disabled={specialfielddisabled} />
                                    <InputText labeltext="Award Type Name" datafield="awardtypename" form={this.props.form} maxLength={45} validationrules={[`required`, `max.45`]} disabled={generalfielddisabled} />
                                    <CategoryTypeRadioButton ref={(e) => { this.componentCategoryTypeRBtn = e }} form={this.props.form} labeltext="Category Type" datafield="categorytype" validationrules={['required']} onChange={this.onChangeCategoryType} disabled={generalfielddisabled} />
                                    <CategoryCodeSelect ref={(e) => { this.componentCategoryCodeSelect = e }} form={this.props.form} labeltext="Category Code" datafield="categorycode" validationrules={['required']} disabled={categorycodedisabled} />
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
                                <Button url="/award-type" htmlType="link" type="default" label="Back" />
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