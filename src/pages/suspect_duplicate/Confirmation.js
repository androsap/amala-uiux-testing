import React from 'react';
import { DetailRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { Button, Alert, TextArea } from '../../components/Base/BaseComponent';
import { Form, Spin, Row, Typography } from 'antd';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            paging: {},
            sort: {},
            column: []
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() { }

    approvalAction = (e, which) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });

                let data = {
                    remark: input.remark,
                    memberid: this.props.result.memberid,
                    activatebyemail: (which === 'by-email') ? true : false
                };

                SaveRequest(api.url.activation.suspectdupactivation, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : 'Data has been approved');
                        this.setState({ loading: false });
                        this.closeModalSuccess();
                    } else {
                        this.setState({ loading: false });
                        Alert.error(responsemessage);
                    }
                })
            }
        })
    };

    rejectAction = () => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });

                let url = api.url.member.updatestatus;
                let data = {
                    remark: input.remark,
                    status: 'DUPLICATE',
                    memberid: this.props.result.memberid,
                    duplicatewith: this.props.selectedRowKey[0].memberid
                };

                DetailRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;

                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
                        this.setState({ loading: false });
                        this.closeModalSuccess();
                    } else {
                        Alert.error(responsemessage);
                        this.setState({ loading: false });
                    };
                });
            }
        })
    };

    closeModalSuccess = () => {
        this.props.onClose('fromConfirmation');
    };

    render() {
        const { formrender, loading } = this.state;
        const reject = (this.props.selectedRowKey && this.props.selectedRowKey.length !== 0) ? true : false;
        const formItemLayout = {
            labelCol: { xs: { span: 24 } },
            wrapperCol: { xs: { span: 24 } },
            colon: false
        };

        if (formrender) {
            return (
                <React.Fragment>
                    <Spin spinning={loading}>
                        <Form {...formItemLayout} loading={loading}>
                            <Row gutter={24} style={{ marginTop: 20, padding: '0 20px' }}>
                                <Title level={4} style={{ marginBottom: 20 }} >{`Are you sure to ${reject ? 'Reject' : 'Approve'} this suspect ?`}</Title>
                                <TextArea form={this.props.form} placeholder='Remark' datafield='remark' maxLength={255} normal={false} />
                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                    {!reject ?
                                        <Row><Button htmlType='button' type='primary' label='Activate by Email' onClick={(e) => this.approvalAction(e, 'by-email')} />
                                            <Button htmlType='button' type='primary' label='Direct Activate' onClick={(e) => this.approvalAction(e, 'direct')} /></Row> :
                                        <Button htmlType='button' type='danger' label='Reject' onClick={this.rejectAction} />}
                                </Row>
                            </Row>
                        </Form>
                    </Spin>
                </React.Fragment >
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} type='modal' />);
        }
    }
}

export default Form.create()(App);