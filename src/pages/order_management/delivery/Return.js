import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Form, Row, Col, Spin } from 'antd';
import { Button, Alert, TextArea, InputText, BranchSelect } from '../../../components/Base/BaseComponent';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            fielddisabled: {
                generalfielddisabled: false
            }
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({ returnto: 'GA' });
        this.props.form.setFieldsValue({ enddate: moment(new Date()).format("YYYY-MM-DD") });
        this.componentBranchSelect.retrieveData();
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let orderdeliveredid = this.props.match.params.ID;
                let notes = input.notes;
                let branchcode = input.branchcode;
                let returnto = input.returnto;
                let enddate = input.enddate;
                let status = 'RETURN';

                let data = { orderdeliveredid, notes, branchcode, returnto, enddate, status };
                let message = 'New data has been updated';
                let url = api.url.delivery.update2;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/order-management/delivery');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                });
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };

        const { generalfielddisabled } = this.state.fielddisabled;
        
        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <InputText form={this.props.form} labeltext="Date" datafield="enddate" disabled={true} />
                                <InputText form={this.props.form} labeltext="Return To" datafield="returnto" disabled={true} />
                                <BranchSelect ref={(e) => { this.componentBranchSelect = e }} form={this.props.form} labeltext="Branch Code" datafield="branchcode" validationrules={['required']} disabled={generalfielddisabled} custom={true} />
                                <TextArea form={this.props.form} labeltext="Notes" datafield="notes" validationrules={['required']} maxLength={255} disabled={generalfielddisabled} />
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