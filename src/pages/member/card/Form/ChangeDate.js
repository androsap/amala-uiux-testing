import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, DateRangeBase } from '../../../../components/Base/BaseComponent';
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
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {},
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
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
        // this.checkPermission();
        let membercardid = this.props.match.params.membercardid;
        this.getDetail(membercardid);
    }

    getDetail = (membercardid) => {
        let url = api.url.membercard.detail;
        let criteria = { membercardid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let cardnumber = (result.cardnumber) ? result.cardnumber : '';
                    let nameoncard = (result.nameoncard) ? result.nameoncard : '';
                    let membershiptypename = (result.membershiptypename) ? result.membershiptypename : '';
                    let membershipname = (result.membershipname) ? result.membershipname : '';
                    let tiername = (result.tiername) ? result.tiername : '';

                    let setValue = { cardnumber, nameoncard, membershiptypename, membershipname, tiername };
                    this.props.form.setFieldsValue(setValue);
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
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let membercardid = this.props.match.params.membercardid;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let expireddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let message = 'Data has been updated';
                let url = api.url.membercard.changedate;
                let data = { membercardid, effectivedate, expireddate };

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                        this.props.history.push('/member/form/' + this.props.match.params.ID + '/card');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender } = this.state;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>Change Date</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Card Number" datafield="cardnumber" validationrules={['required']} disabled={true} />
                                    <InputText form={this.props.form} labeltext="Name On Card" datafield="nameoncard" validationrules={['required']} disabled={true} />
                                    <InputText form={this.props.form} labeltext="Membership Type" datafield="membershiptypename" validationrules={['required']} disabled={true} />
                                    <InputText form={this.props.form} labeltext="Membership" datafield="membershipname" validationrules={['required']} disabled={true} />
                                    <InputText form={this.props.form} labeltext="Tier" datafield="tiername" validationrules={['required']} disabled={true} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date ', 'Expired Date']} minDate={moment().add(1, 'day')} validationrules={['required']} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="submit" type="default" label="Save" />
                                <Button url={'/member/form/' + this.props.match.params.ID + '/card'} htmlType="link" type="default" label="Back" />
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