import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Form, Row, Col, Spin } from 'antd';
import { Button, Alert, TextArea } from '../../../components/Base/BaseComponent';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            status: this.props.data[0].status,
            fielddisabled: {
                generalfielddisabled: false
            }
        }
    };

    componentDidMount() {
        this.props.form.setFieldsValue({ status: (this.props.data[0].status === 'READYTOPACK') ? 'PACKING' : this.props.labeltext });
    }

    saveAction = async (e) => {
        e.preventDefault();
        await this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                let orderpackedids = this.props.data.map(val => val.orderpackedid);
                let notes = input.notes;
                let status = (this.props.data[0].status === 'READYTOPACK') ? 'PACKING' : 'PACKED';
                let usevendor = this.props.data[0].usevendor;
                let reordernumber = this.props.data[0].reordernumber;
                let startdate = (this.props.data[0].status === 'READYTOPACK') ? moment(new Date()).format("YYYY-MM-DD") : null;
                let enddate = (this.props.data[0].status === 'PACKING') ? moment(new Date()).format("YYYY-MM-DD") : null;

                let data = { orderpackedids, notes, status, usevendor, reordernumber, startdate, enddate };
                let message = 'New data has been updated';
                let url = api.url.packaging.bulk;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.closemodalrefresh();
                    } else {
                        Alert.error(responsemessage);
                        this.props.closemodalrefresh();
                    }
                    this.setState({ isLoading: false });
                    if (this.props.type === 'download') {
                        let orderpackedids = this.props.data.map(val => val.orderpackedid);
                        let url = api.url.packaging.download
                        let data = { orderpackedids };
                        let message = 'Downloading file...';
                        this.setState({ isLoading: true });
                        DetailRequest(url, data).then((response) => {
                            const { status = {}, result } = response;
                            const { responsecode, responsemessage } = status;
                            if (responsecode === '0000') {
                                window.location.href = result.url;
                                message = (responsemessage) ? responsemessage : message;
                                Alert.success(message);
                            } else Alert.error(responsemessage);
                            this.setState({ isLoading: false });
                        });
                    }
                });
            }
        });
    };


    render() {
        const { generalfielddisabled } = this.state.fielddisabled;
        let status = this.props.data[0].status
        
        const formItemLayout = this.props.type === 'finish' ? {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 15 } }
        } : {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }}>
                                <TextArea form={this.props.form} labeltext={(this.props.type === 'finish') ? 'Notes for Courier Vendor' : 'Notes For Vendor/GA'} datafield='notes' validationrules={['required']} disabled={generalfielddisabled} maxRows={7} />
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 4 }} xl={{ span: 18, offset: 4 }}>
                                {status === "PACKING" ?
                                    <p>Notes: Catatan anda akan disimpan dan dimasukkan ke catatan untuk proses berikutnya yaitu delivery</p>
                                    :
                                    ""
                                }
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='default' label='Save' />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));