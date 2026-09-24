import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
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
            status: this.props.data.status,
            fielddisabled: {
                generalfielddisabled: false
            }
        }
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { usevendor, reordernumber } = this.props.data || {};

                let orderprintedid = this.props.match.params.ID;
                let notes = input.notes;
                let status = (this.props.data.status === 'READYTOPRINT') ? 'PRINTING' : 'PRINTED';
                let startdate = (this.props.data.status === 'READYTOPRINT') ? moment(new Date()).format('YYYY-MM-DD') : null;
                let enddate = (this.props.data.status === 'PRINTING') ? moment(new Date()).format('YYYY-MM-DD') : null;

                let data = { orderprintedid, notes, status, startdate, enddate, usevendor, reordernumber };
                let message = 'New data has been updated';
                let url = api.url.printing.update;

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

        const formItemLayout = status === 'PRINTING' ? {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        } : {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 22, offset: 0 }} xl={{ span: 22, offset: 0 }}>
                                <TextArea form={this.props.form} labeltext={(status === 'PRINTING') ? 'Notes for Packaging Vendor' : 'Notes For Vendor/GA'} datafield="notes" validationrules={['required']} disabled={generalfielddisabled} maxRows={7} />
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 4 }} xl={{ span: 18, offset: 4 }}>
                                {status === "PRINTING" ?
                                    <p>Notes: Catatan anda akan disimpan dan dimasukkan ke catatan untuk proses berikutnya yaitu packaging</p>
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