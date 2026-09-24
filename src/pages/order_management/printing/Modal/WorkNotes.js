import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { Form, Row, Col, Spin } from 'antd';
import { Button, Alert, TextArea, InputText } from '../../../../components/Base/BaseComponent';
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
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        let url = api.url.worknotes.detail;
        let criteria = { worknotesid: this.props.worknotesid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let worknotesid = result[0].worknotesid ? result[0].worknotesid : null;
                    let ordercode = result[0].ordercode ? result[0].ordercode : null;
                    let fromvendorcode = result[0].fromvendorcode ? result[0].fromvendorcode : null;
                    let fromvendorname = result[0].fromvendorname ? result[0].fromvendorname : null;
                    let from = result[0].from ? result[0].from : null;
                    let tovendorcode = result[0].tovendorcode ? result[0].tovendorcode : null;
                    let tovendorname = result[0].tovendorname ? result[0].tovendorname : null;
                    let to = result[0].to ? result[0].to : null;
                    let date = result[0].date ? moment(result[0].date).format('YYYY-MM-DD') : null;
                    let notes = result[0].notes ? result[0].notes : null;
                    
                    let setValue = { notes };
                    this.setState({ fromvendorcode, fromvendorname, tovendorcode, tovendorname, worknotesid, ordercode, from, to, date, notes });
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
        const { fromvendorcode, fromvendorname, tovendorname, tovendorcode, ordercode, from, to, date } = this.state
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let worknotesid = this.props.worknotesid;
                let notes = (input.notes) ? input.notes : null;

                let data = { worknotesid, fromvendorcode, fromvendorname, tovendorname, tovendorcode, notes, ordercode, from, to, date };
                let message = 'New data has been updated';
                let url = api.url.worknotes.update;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.onClose();
                        this.props.refresh();
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                });
            }
        });
    };

    handleChangeStatus = (status) => {
        if (status === 'RETURN') {
            this.componentBranchSelect.retrieveData();
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };

        const { generalfielddisabled } = this.state.fielddisabled;
        
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <TextArea form={this.props.form} labeltext="Notes" datafield="notes" validationrules={['required']} maxLength={255} disabled={generalfielddisabled} maxRows={7} />
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