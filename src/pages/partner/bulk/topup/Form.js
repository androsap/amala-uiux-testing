import React, { Component } from 'react';
import { SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, TextArea, InputText, DatePickerBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            validationrulesvalue: [],
            maxlengthvalue: null,
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let transactiondate = (input.transactiondate) ? moment(input.transactiondate).format("YYYY-MM-DD") : null;
                let source = "MANUAL";
                let partnercode = this.props.partnercode;
                let tiermiles = (input.tiermiles) ? input.tiermiles : '0';
                let awardmiles = (input.awardmiles) ? input.awardmiles : undefined;
                let notes = input.notes;

                let message = 'New data has been created';
                let data = { transactiondate, source, partnercode, tiermiles, awardmiles, notes };
                let url = api.url.partnerbulk.create;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.refreshList();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleNotesType = (type) => {
        let level = undefined;
        this.props.form.setFieldsValue({ level });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { generalfielddisabled } = this.state.fielddisabled;

        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <DatePickerBase form={this.props.form} labeltext="Date" datafield="transactiondate" minDate={moment()} validationrules={['required']} />
                                <InputText form={this.props.form} labeltext="Award Miles" datafield="awardmiles" validationrules={['required', 'pattern.number']} maxLength={9} disabled={generalfielddisabled} />
                                <TextArea form={this.props.form} labeltext="Notes" datafield="notes" disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="default" label="Save" />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));