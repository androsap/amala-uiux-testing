import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Alert, Button, CheckBoxBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { Gender, SetupEnrollChannel } from '../../../../data';

const prefixmenuname = 'PRMEMCR';
const menucode = 'PRMEMCR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionspage: 'create',
            isLoading: false,
            criteriacode: null,
            fielddisabled: {
                generalfielddisabled: false,
            }
        };
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        const promocode = this.props.match.params.ID;
        const url = api.url.promomanage.criteria.retrieve;
        const criteria = { criteriakey: this.props.type.toUpperCase(), promocategorytype: 'MEMBER', promocode };
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let gender = [];
                    let enrollchannel = [];
                    let criteriacode = [];

                    result.map((val) => {
                        if (this.props.type === 'gender') {
                            gender.push(val.criteriavalue);
                        } else enrollchannel.push(val.criteriavalue);
                        criteriacode.push(val.criteriacode);
                        return null;
                    })

                    let setValue = (this.props.type === 'gender') ? { gender } : { enrollchannel };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({ criteriacode, actionspage: 'update' });
                } else this.setState({ actionspage: 'create' });
            } else Alert.error(status.responsemessage)
            this.setState({ isLoading: false });
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        const { type, match } = this.props;
        const { criteriacode, actionspage } = this.state;

        if (actionspage === 'update') {
            criteriacode.map((val) => {
                let url = api.url.promomanage.criteria.delete;
                let data = { criteriacode: val };
                var callback = (response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode !== '0000') Alert.error(responsemessage);
                };
                return DeleteRequest(url, data, callback, null, null, true);
            })
        };

        setTimeout(() => {
            this.props.form.validateFieldsAndScroll((err, input) => {
                if (!err) {
                    this.setState({ isLoading: true });
                    const { gender, enrollchannel } = input || {};

                    const promocode = match.params.ID;
                    const promocategorytype = 'MEMBER';
                    const criteriakey = type.toUpperCase();
                    const criteriavaluelist = (type === 'gender') ? gender : enrollchannel;

                    let data = { promocode, promocategorytype, criteriakey, criteriavaluelist };
                    let url = api.url.promomanage.criteria.create
                    let message = 'New data has been created'

                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode === '0000') {
                            Alert.success((responsemessage) ? responsemessage : message);
                            this.getDetail();
                        } else Alert.error(responsemessage);
                        this.setState({ isLoading: false });
                    })
                };
            }, 500);
        })
    };

    render() {
        const { type } = this.props;
        const { isLoading, fielddisabled } = this.state;
        const { generalfielddisabled } = fielddisabled;
        const formItemLayout = {
            wrapperCol: { xs: { span: 24 }, sm: { span: 24 } }
        };

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 24, offset: 2 }} xl={{ span: 24, offset: 2 }}>
                                <CheckBoxBase form={this.props.form} datafield={(type === 'enroll_channel') ? 'enrollchannel' : 'gender'} disabled={generalfielddisabled} options={(type === 'enroll_channel') ? SetupEnrollChannel : Gender} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='default' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='ACCESS'></Button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));