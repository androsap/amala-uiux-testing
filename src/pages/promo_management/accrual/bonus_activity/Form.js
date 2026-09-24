import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RetrieveRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { ActivityCodeSelect, Alert, Button, PartnerSelect } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

const prefixmenuname = 'PRMNACR';
const menucode = 'PRMNACR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            promobonusactivitycode: null,
            fielddisabled: {
                generalfielddisabled: false,
                activitybonusfielddisabled: true
            }
        };
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        RetrieveRequest(api.url.promomanage.bonusactivity.retrieve, { promocode: this.props.match.params.ID }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    const { partnercode, bonusactivitycode, promobonusactivitycode } = result[0] || {};

                    this.props.form.setFieldsValue({ partnercode, bonusactivitycode });
                    this.setState({
                        promobonusactivitycode,
                        isLoading: false,
                        actionspage: 'update',
                        fielddisabled: { ...this.state.fielddisabled, activitybonusfielddisabled: (partnercode) ? false : true }
                    });
                    this.componentActivityBonusSelect.retrieveData({ partnercode });
                } else this.setState({ isLoading: false, actionspage: 'create' });
            } else Alert.error(status.responsemessage)

        });
        this.componentPartnerSelect.retrieveData();
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { partnercode, bonusactivitycode } = input || {};
                const { actionspage, promobonusactivitycode } = this.state;
                const promocode = this.props.match.params.ID;

                const url = (actionspage === 'create') ? api.url.promomanage.bonusactivity.create : api.url.promomanage.bonusactivity.update;
                const data = (actionspage === 'create') ? { promocode, partnercode, bonusactivitycode } : { promocode, partnercode, bonusactivitycode, promobonusactivitycode };
                const message = (actionspage === 'create') ? 'New data has been created' : 'Data has been updated';

                await SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
                await this.getDetail();
            }
        });
    };

    handlePartner = (value) => {
        this.props.form.resetFields(['bonusactivitycode', []]);
        this.componentActivityBonusSelect.retrieveData({ partnercode: value });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, activitybonusfielddisabled: (value) ? false : true } })
    };

    render() {
        const { isLoading, fielddisabled } = this.state;
        const { generalfielddisabled, activitybonusfielddisabled } = fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 14 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 10 } }
        };

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24} style={{ marginTop: 50 }}>
                            <Col className='gutter-row' xs={24} lg={{ span: 16 }} >
                                <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext='Partner Code' datafield='partnercode' validationrules={['required']} disabled={generalfielddisabled} onChange={this.handlePartner} />
                                <ActivityCodeSelect ref={(e) => { this.componentActivityBonusSelect = e }} form={this.props.form} labeltext='Activity Code' datafield='bonusactivitycode' validationrules={['required']} disabled={activitybonusfielddisabled} />
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