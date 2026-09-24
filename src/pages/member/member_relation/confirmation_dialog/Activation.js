import React from 'react';
import { DetailRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { Button, Alert, TextArea } from '../../../../components/Base/BaseComponent';
import { Form, Spin, Row, Col } from 'antd';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail() {
        let memberrelationid = this.props.memberrelationid;
        let url = api.url.memberrelation.list;
        let data = { memberrelationid };
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    this.setState({ loading: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    saveAction = (e, activeData) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                //define parameter
                let memberrelationid = this.props.memberrelationid;
                let remark = input.remark;

                let url = (activeData) ? api.url.memberrelation.deactivate : api.url.memberrelation.activate;
                let data = { memberrelationid, remark };
                let message = 'Data has been updated';

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.closeModalSuccess();
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ loading: false });
                })
            }
        });
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { activeData, cancelModal } = this.props;
        const { formrender, loading } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
            colon: false
        };

        if (formrender) {
            return (
                <Row>
                    <Spin spinning={loading}>
                        <Form {...formItemLayout}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                    <TextArea form={this.props.form} labeltext="Remark" datafield="remark" validationrules={['required']} maxLength="255" />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                <Button htmlType="button" type="default" label="Cancel" onClick={cancelModal} />
                                <Button htmlType="button" type="primary" label="OK" onClick={(e) => this.saveAction(e, activeData)} />
                                <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} type="modal" />);
        }
    }
}

export default Form.create()(App);