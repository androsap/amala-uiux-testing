import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Form, Row, Col, Spin } from 'antd';
import { Button, Alert, TextArea, InputText } from '../../../components/Base/BaseComponent';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            status: this.props.data.status,
            fielddisabled: {
                generalfielddisabled: false
            }
        }
    };

    componentDidMount() {
        this.props.form.setFieldsValue({ status: (this.props.data.status === 'READYTOPACK') ? 'PACKING' : 'PACKED' });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                let orderpackedid = this.props.match.params.ID;
                let notes = input.notes;
                let status = (this.props.data.status === 'READYTOPACK') ? 'PACKING' : 'PACKED';
                let startdate = (this.props.data.status === 'READYTOPACK') ? moment(new Date()).format('YYYY-MM-DD') : null;
                let enddate = (this.props.data.status === 'PACKING') ? moment(new Date()).format('YYYY-MM-DD') : null;

                let data = { orderpackedid, notes, status, startdate, enddate };
                let message = 'New data has been updated';
                let url = api.url.packaging.update;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.closemodalrefresh();
                    } else {
                        Alert.error(responsemessage);
                        this.props.cancelModal();
                    }
                    this.setState({ isLoading: false });
                });
            }
        });
    };

    render() {
        const { generalfielddisabled } = this.state.fielddisabled;
        const { status } = this.state;

        const formItemLayout = status === 'PACKING' ? {
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
                                <InputText form={this.props.form} labeltext="Status" datafield="status" validationrules={['required']} disabled={true} />
                                <TextArea form={this.props.form} labeltext={status === "PACKING" ? 'Notes for Courier Vendor' : 'Notes For Vendor/GA'} datafield='notes' validationrules={['required']} disabled={generalfielddisabled} maxRows={7} />
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