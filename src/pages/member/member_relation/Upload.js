import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Alert, Button, UploadBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Spin, Col, Typography, Divider } from 'antd';
// import TableCardnumber from './Cardnumber'

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'create',
            isLoading: false,
        }
    }

    componentDidMount() {
        document.title = ' Upload File | Loyalty Management System';

    }

    saveAction = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                let message = 'New data has been upload';
                let url = api.url.memberrelation.upload;

                /* Mapping Request File*/
                var fileRequest = new FormData();
                var file = (input.uploadcardnumber && input.uploadcardnumber[0] && input.uploadcardnumber[0]['originFileObj']) ? input.uploadcardnumber[0]['originFileObj'] : null;
                fileRequest.append("file", file);
                SaveRequest(url, {}, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.onClose();
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

    normFile = e => {
        var reader = new FileReader();
        if (e.file === undefined) { reader.readAsDataURL(e.file) };
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 13 } }
        };
        const { isLoading } = this.state;
        //render form
        return (
            <Row>
                <Col xs={24} xl={22}>
                    <Title level={3}>Upload File</Title>
                </Col>
                <Divider />
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row>
                            <UploadBase form={this.props.form} labeltext='File CSV' datafield='uploadcardnumber' validationrules={['required']} csv={true} accept={'.csv'} />
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 50 }}>
                                <Button htmlType='submit' type='primary' label={'Submit'} onClick={this.saveAction} />
                            </Row>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));