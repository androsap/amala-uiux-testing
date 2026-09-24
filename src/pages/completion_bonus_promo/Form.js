import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, DateRangeBase, SwitchButton } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                promocompletionid: null,
                status: 'active'
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                quotafielddisabled: false
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
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
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

    getDetail = (promocompletionid, actionspage) => {
        let url = api.url.promocompletionbonus.list;
        let criteria = { promocompletionid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            const { startperiod, endperiod } = result[0] || {};
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let promocompletionname = result[0].promocompletionname ? result[0].promocompletionname : null;
                    let period = [moment(startperiod), moment(endperiod)];
                    let maxquota = result[0].maxquota ? result[0].maxquota : null;
                    let status = result[0].status ? result[0].status : null;
                    let unlimited = result[0].unlimited ? result[0].unlimited : false;
                    
                    let generalfielddisabled = (actionspage !== "view") ? status === 'inactive' : true;
                    let quotafielddisabled = (actionspage !== 'view') ? (maxquota) && status === 'active' && unlimited === false ? false : true : true;

                    let setValue = { promocompletionname, maxquota, period, status, unlimited };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { promocompletionid, status };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, quotafielddisabled };
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
                
                const { promocompletionname, maxquota } = input || {};
                let unlimited = (input.unlimited) ? true : false;
                let startperiod = (input.period[0]) ? moment(input.period[0]).format("YYYY-MM-DD") : null;
                let endperiod = (input.period[1]) ? moment(input.period[1]).format("YYYY-MM-DD") : null;

                let data = {promocompletionname, maxquota, startperiod, endperiod, unlimited};

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.promocompletionbonus.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.promocompletionbonus.update;
                    data.promocompletionid = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/promo-completion-bonus');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(promocompletionid, status) {
        let url = (status === 'inactive') ? api.url.promocompletionbonus.activate : api.url.promocompletionbonus.deactive;
        let data = { promocompletionid };
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
        DeleteRequest(url, data, callback, status === 'active');
    }

    handleQuota = (value) => {
        let quotafielddisabled = value;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, quotafielddisabled } });
        this.props.form.setFieldsValue({ maxquota: undefined });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled, quotafielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, form } = this.props;
        const { promocompletionid, status } = this.state.fieldvalue;
        
        if (formrender) {
            document.title = titlepage + " Promo Completion | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Promo Completion</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Program Name" datafield="promocompletionname" form={this.props.form} validationrules={[`required`, 'pattern.alphanumericspace']} maxLength={50} disabled={generalfielddisabled} />
                                    <DateRangeBase form={form} labeltext="Date Period" datafield="period" placeholder={['Start Period', 'End Period']} minDate={moment().add(0, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={form} labeltext="Bonus Unlimited" datafield="unlimited" onChange={this.handleQuota} disabled={generalfielddisabled} />
                                    <InputText labeltext="Max Quota" datafield="maxquota" form={this.props.form} validationrules={quotafielddisabled ? [] : ['required',`pattern.number`, `minnumber.1`]} disabled={quotafielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && status === 'active') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (status === 'active') ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(promocompletionid, status)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(promocompletionid, status)} /> : ""
                                }
                                <Button url="/promo-completion-bonus" htmlType="link" type="default" label="Back" />
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