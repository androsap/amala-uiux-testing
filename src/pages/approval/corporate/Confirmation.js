import React from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, Alert, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Spin, Row, Typography } from 'antd';
import ErrorGeneral from '../../error/ErrorGeneral';

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

                const { type, result, travelco } = this.props;
                const { requestid } = result;

                let url = (type === 'approve') ? api.url.approvalcorporate.approve : api.url.approvalcorporate.reject;
                let data = {
                    requestid,
                    requeststatus: (type === 'approve') ? 'APPROVE' : 'REJECT',
                    remark: (input.remark) ? input.remark : null
                };

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : `Data has been ${(type === 'approve') ? 'Approve' : 'Reject'}`);
                        this.setState({ loading: false });
                        this.closeModalSuccess();
                        this.props.history.push((travelco) ? `/approval-corporate-travelco` : `/approval-corporate-employee`);
                    } else {
                        this.setState({ loading: false });
                        Alert.error(responsemessage);
                    }
                })
            }
        })
    };

    closeModalSuccess = () => {
        this.props.onClose(this.props.type, false);
    };

    render() {
        const { type } = this.props;
        const { formrender, loading } = this.state;
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
                                <Title level={4} style={{ marginBottom: 20 }} >{`Are you sure to ${(type === 'approve') ? 'Approve' : 'Reject'} this request ?`}</Title>
                                <TextArea form={this.props.form} placeholder='Remark' datafield='remark' maxLength={255} normal={false} />
                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                    {(type === 'approve') ?
                                        <Button htmlType='button' type='primary' label='Approve' onClick={(e) => this.approvalAction(e, 'approve')} /> :
                                        <Button htmlType='button' type='primary' label='Reject' onClick={(e) => this.approvalAction(e, 'reject')} />
                                    }
                                    <Button htmlType='button' type='default' label='Cancel' onClick={this.closeModalSuccess} />
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