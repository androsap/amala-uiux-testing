import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DetailRequest, SaveRequest } from '../../../../../utilities/RequestService';
import { api } from '../../../../../config/Services';
import { Alert, InputText, Button, ChannelCheckbox, DateRangeBase } from '../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { getProfile } from '../../../../../utilities/AuthService';
import moment from 'moment';

const prefixmenuname = 'PRMREGC';
const menucode = 'PRMREGC';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            actionspageregis: this.props.actionspageregis,
            actionspagemaster: this.props.actionspagemaster,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
            }
        };
    };

    componentDidMount() {
        this.checkPermission();
    };

    checkPermission() {
        const { permission, regcode, regdata } = this.props;
        const { usermenu } = permission;

        this.setState({ isLoading: true });
        this.componentChannelSelect.retrieveData();
        if (regcode) {
            let actionspage = 'update';
            let generalfielddisabled = false;
            let specialfielddisabled = true;
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                actionspage = 'view';
                generalfielddisabled = true;
            }
            let fielddisabled = { generalfielddisabled, specialfielddisabled };
            this.setState({ actionspage, fielddisabled });
            this.getDetail(regdata);
            this.setState({ isLoading: false });
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false })
            } else this.props.form.setFieldsValue({ formstatus: 'ACTIVE' });
            this.setState({ isLoading: false });
        };
    };

    getDetail = (regdata) => {
        this.setState({ isLoading: true });
        const { actionspageregis } = this.state;
        const { promocode, startdate, enddate, registrationcode, status, regcode, channel } = (regdata.length !== 0) ? (actionspageregis === 'update') ? regdata.find(obj => obj.registrationcode === this.props.regcode) : regdata : {};
        const date = [moment(startdate), moment(enddate)];
        const formstatus = (status) ? status : '';

        let setValue = {
            promocode, date, formstatus,
            formregistrationcode: registrationcode,
            formregchannel: (actionspageregis === 'update') ? channel.map((val) => val.regchannel) : channel,
        };

        if (actionspageregis === 'update') {
            this.props.form.setFieldsValue(setValue);
        } else DetailRequest(api.url.promomanage.regcode.detail, { regcode }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                setValue.formregchannel = result.map((val) => { return val.regchannel });
                this.props.form.setFieldsValue(setValue);
            } else Alert.error(responsemessage);
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.handlePromoCode(e, true);
        this.props.form.validateFieldsAndScroll(['formregistrationcode', 'formregchannel', 'date'], (err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { actionspage, actionspagemaster, actionspageregis } = this.state;
                const { datapromo, regdata } = this.props;
                const { regcode } = regdata || {};
                const { formregistrationcode, formregchannel, date, formstatus } = input || {};

                const promocode = (datapromo) ? datapromo[0].promocode : undefined;
                const startdate = moment(date[0]).format('YYYY-MM-DD');
                const enddate = moment(date[1]).format('YYYY-MM-DD');

                let channel = [];
                formregchannel.map((val) => channel.push({ regchannel: val }));

                let data = {
                    promocode, startdate, enddate, channel,
                    registrationcode: formregistrationcode,
                    status: formstatus
                };
                if (actionspageregis === 'create' && actionspagemaster === 'create') {
                    let newData = { ...data, createdBy: getProfile().username };

                    this.props.handleSaveRegis(actionspage, newData);
                    this.setState({ isLoading: false });
                } else {
                    if (actionspagemaster === 'create') {
                        data.registrationcode = this.props.regcode;
                        let newData = { ...data, createdBy: getProfile().username };

                        this.props.handleSaveRegis(actionspage, newData);
                        this.setState({ isLoading: false });
                    } else {
                        if (actionspage !== 'create') data.regcode = regcode;
                        let url = (actionspage === 'create') ? api.url.promomanage.regcode.create : api.url.promomanage.regcode.update;
                        let message = (actionspage === 'create') ? 'New data has been created' : 'Data has been updated';

                        SaveRequest(url, data).then((response) => {
                            const { responsecode, responsemessage } = response.status;
                            if (responsecode === '0000') {
                                Alert.success((responsemessage) ? responsemessage : message);
                                this.props.onClose();
                                this.props.getRegCodeDetail();
                            } else Alert.error(responsemessage);
                            this.setState({ isLoading: false });
                        });
                    };
                };
            };
        });
    };

    render() {
        const { actionspagemaster, fielddisabled, isLoading } = this.state;
        const { generalfielddisabled, specialfielddisabled } = fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 21 }} xl={{ span: 21 }}>
                                <InputText form={this.props.form} labeltext='Registration Code' datafield='formregistrationcode' maxLength={30} validationrules={['required', 'pattern.alphabetnumeric']} disabled={generalfielddisabled} />
                                <ChannelCheckbox ref={(e) => { this.componentChannelSelect = e }} mode='multiple' form={this.props.form} labeltext='Registration Channel' datafield='formregchannel' validationrules={['required']} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext='Registration Date' datafield='date' placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment(new Date())} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} className={(actionspagemaster === 'create') ? 'hidden' : ''} labeltext='Status' datafield='formstatus' disabled={specialfielddisabled} />
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