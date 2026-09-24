import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Form, Row, Col, Spin } from 'antd';
import { Button, Alert, TextArea, SelectBase, InputText, TicketOfficeSelect, BranchSelect } from '../../../components/Base/BaseComponent';
import { OrderDeliveryNotes } from '../../../data';
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
                generalfielddisabled: false,
                ticketdisabled: true
            }
        }
    };

    componentDidMount() {
        this.props.form.setFieldsValue({ status: (this.props.data.status === 'READYTODELIVER') ? 'ON DELIVERY' : this.props.labeltext });
        this.props.form.setFieldsValue({ returnto: 'GA' });
        this.props.form.setFieldsValue({ awb: this.props.data.awb });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let orderdeliveredid = this.props.match.params.ID;
                let notes = input.notes;
                let branchcode = (input.branchcode) ? input.branchcode : null;
                let returnto = (input.returnto) ? input.returnto : null;
                let usevendor = this.props.data.usevendor;
                let vendorcode = this.props.data.vendorcode;
                let reordernumber = this.props.data.reordernumber;
                let status = (this.props.data.status === 'READYTODELIVER') ? 'DELIVERING' : input.status;
                let startdate = (this.props.data.status === 'READYTODELIVER') ? moment(new Date()).format("YYYY-MM-DD") : null;
                let enddate = (this.props.data.status === 'DELIVERING') ? moment(new Date()).format("YYYY-MM-DD") : null;
                let ticketingofficecode = (input.ticketingofficecode) ? input.ticketingofficecode : null;
                let address = (input.address) ? input.address : null;
                let awb = (input.awb) ? input.awb : null;

                let data = { orderdeliveredid, notes, usevendor, vendorcode, reordernumber, status, startdate, enddate, branchcode, returnto, ticketingofficecode, address, awb };
                let message = 'New data has been updated';
                let url = api.url.delivery.update;

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

    handleChangeStatus = (status) => {
        if (status === 'RETURN') {
            this.componentBranchSelect.retrieveData();
        }
    };

    onChangeBranchcode = (branchcode) => {
        let criteria = { branchcode };
        this.componentTicketOfficeSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ ticketoffice: undefined });
        this.props.form.resetFields(['ticketingofficecode', []]);
        this.props.form.resetFields(['address', []]);
        this.checkingTicketOffice(branchcode);
    };

    checkingTicketOffice = (branchcode) => {
        let url = api.url.branch.list;
        let criteria = { branchcode };
        RetrieveRequest(url, criteria).then((response) => {
            const { responsecode, responsemessage } = response.status;
            const { ticketoffices } = response.result[0] || {};
            if (responsecode === '0000') {
                if (response.result.length !== 0 && ticketoffices.length !== 0 && ticketoffices.filter(obj => obj.active === true)[0]) {
                    this.props.form.setFieldsValue({ ticketoffices });
                    let ticketdisabled = false;
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, ticketdisabled } });
                } else {
                    Alert.information('No Ticket Office found, please choose other Branch Code');
                    this.props.form.resetFields(['ticketingofficecode', []]);
                };
            } else {
                Alert.error(responsemessage);
                this.props.form.resetFields(['ticketingofficecode', []]);
            };
        });
    }

    onChangeTicketOffice = (tickoffid) => {
        let url = api.url.ticketoffice.list;
        let criteria = { tickoffid };
        RetrieveRequest(url, criteria).then((response) => {
            const { responsecode, responsemessage } = response.status;
            const { address } = response.result[0] || {};
            if (responsecode === '0000') {
                if (response.result.length !== 0 && address) {
                    this.props.form.setFieldsValue({ address });
                } else {
                    Alert.information('No address found, please fill in manually');
                    this.props.form.resetFields(['address', []]);
                };
            } else {
                Alert.error(responsemessage);
                this.props.form.resetFields(['address', []]);
            };
        });
    };

    render() {
        const { generalfielddisabled, ticketdisabled } = this.state.fielddisabled;
        const { status } = this.state;
        let statustype = this.props.form.getFieldValue('status');

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 7 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 17 } }
        };

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 1 }} xl={{ span: 18, offset: 1 }}>
                                {
                                    (status === 'READYTODELIVER') ?
                                        <InputText form={this.props.form} labeltext="Status" datafield="status" validationrules={['required']} disabled={true} />
                                        : <SelectBase form={this.props.form} labeltext="Status" datafield="status" validationrules={['required']} options={OrderDeliveryNotes} onChange={this.handleChangeStatus} disabled={generalfielddisabled} />
                                }
                                <InputText form={this.props.form} labeltext="Return To" datafield="returnto" validationrules={(statustype === 'RETURN') ? ['required'] : ''} className={(statustype === 'RETURN') ? '' : 'hidden'} disabled={true} />
                                {
                                    (status === 'DELIVERING') ?
                                        <InputText form={this.props.form} labeltext="AWB" placeholder="AWB" datafield="awb" validationrules={['required', 'pattern.number']} maxLength={9} className={statustype ? '' : 'hidden'} disabled={generalfielddisabled} />
                                        : null
                                }
                                <BranchSelect ref={(e) => { this.componentBranchSelect = e }} form={this.props.form} labeltext="Branch Code" datafield="branchcode" validationrules={(statustype === 'RETURN') ? ['required'] : ''} className={(statustype === 'RETURN') ? '' : 'hidden'} disabled={generalfielddisabled} custom={true} onChange={this.onChangeBranchcode} />
                                <TicketOfficeSelect ref={(e) => { this.componentTicketOfficeSelect = e }} form={this.props.form} labeltext='Ticket Office' datafield='ticketingofficecode' className={(statustype === 'RETURN') ? '' : 'hidden'} validationrules={(statustype === 'RETURN') ? ['required'] : ''} disabled={ticketdisabled} onChange={this.onChangeTicketOffice} />
                                <TextArea form={this.props.form} labeltext="Address" datafield="address" validationrules={(statustype === 'RETURN') ? ['required'] : ''} disabled={true} className={(statustype === 'RETURN') ? '' : 'hidden'} />
                                <TextArea form={this.props.form} labeltext={statustype === 'RETURN' ? "Notes for Return" : "Notes For Vendor/GA"} datafield="notes" validationrules={['required']} disabled={generalfielddisabled} maxRows={7} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="default" label="Save" />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));