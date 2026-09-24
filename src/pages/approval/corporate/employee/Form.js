import React, { Component } from 'react';
import { DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { Button, SelectBase, DatePickerBase, InputText } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Divider, Typography, Modal } from 'antd';
import { ApprovalRequestType } from '../../../../data';
import moment from 'moment';

import Confirmation from '../Confirmation';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            visible: false,
            type: undefined,
            result: {},
            fieldvalue: {
                requesttype: 'TRAVEL_COORDINATOR',
                requeststatus: 'NEW'
            }
        }
    }

    checkPermission() {
        const { permission, match, menucode, prefixmenuname } = this.props;
        const { usermenu } = permission;

        if (match.params.ID) {
            let titlepage = 'Edit';
            let actionspage = 'update';

            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
            };

            this.setState({ titlepage, actionspage });
            this.getDetail(match.params.ID, actionspage);
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = (requestid) => {
        this.setState({ isLoading: true });

        DetailRequest(api.url.approvalcorporate.retrievedetail, { requestid }).then(async (response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    const { requesttype, requestedby, reqdata, requeststatus } = result || {};
                    const { cardnumber, travelcoordinatortype, name, username, idcardnumber, phonenumber, email,
                        birthdate, memberidparent, startdate, enddate, relationtype } = reqdata || {};

                    await this.setState({ result, fieldvalue: { requesttype, requeststatus } });
                    await this.props.form.setFieldsValue({
                        requestedby, requesttype, travelcoordinatortype, name, username, cardnumber, idcardnumber, phonenumber, email, memberidparent, relationtype,
                        birthdate: (birthdate) ? moment(birthdate) : undefined,
                        startdate: (startdate) ? moment(startdate) : undefined,
                        enddate: (enddate) ? moment(enddate) : undefined
                    });
                } else this.setState({ responseMessage: 'Data not found', formrender: false });
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            this.setState({ isLoading: false });
        });
    };

    handleModal = (type, visible, ) => {
        this.setState({ type, visible });
    };

    render() {
        const { isLoading, fieldvalue, result, visible, type } = this.state;
        const { requeststatus } = fieldvalue;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
        };

        return (
            <Row>
                <Modal visible={visible} loading={isLoading} onCancel={() => this.handleModal(type, false)} footer={null} destroyOnClose={true} width={500}>
                    <Confirmation {...this.props} onClose={() => this.handleModal(type, false)} result={result} type={type} employee={true}/>
                </Modal>

                <Spin spinning={isLoading}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Employee Approval Detail</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <InputText form={this.props.form} labeltext='Request By' datafield='requestedby' maxLength={45} disabled={true} />
                                <SelectBase form={this.props.form} labeltext='Request Type' datafield='requesttype' options={ApprovalRequestType} disabled={true} />
                                <Row>
                                    <InputText form={this.props.form} labeltext='Relation Type' datafield='relationtype' maxLength={45} disabled={true} />
                                    <InputText form={this.props.form} labeltext='Member Card' datafield='memberidparent' maxLength={45} disabled={true} />
                                    <DatePickerBase form={this.props.form} labeltext='Start Date' datafield='startdate' maxLength={45} disabled={true} />
                                </Row>

                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            {
                                (requeststatus === 'NEW') ? <Row>
                                    <Button htmlType='button' className='btn-custom-green' label='Approve' onClick={() => this.handleModal('approve', true)} />
                                    <Button htmlType='button' type='danger' label='Reject' onClick={() => this.handleModal('reject', true)} />
                                </Row> : null
                            }
                            <Button url={'/approval-corporate-employee'} htmlType='link' type='default' label='Back' />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));