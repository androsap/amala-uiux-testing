import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { SaveRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputNumber, TextArea, InputText, DatePickerBase, SelectBase, MembershipSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                cardnumberissuedid: null,
                active: true,
                cardnumrequest: null,
                amount: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let cardissuedsize = (input.cardnumrequest === 'UNIQUE_NUMBER') ? 1 : input.cardissuedsize;
                let cardnumrequest = input.cardnumrequest;
                let issuedexpirydate = moment(input.issuedexpirydate).format("YYYY-MM-DD");
                let membershipid = input.membershipid ? input.membershipid : null;
                let description = input.description ? input.description : null;
                let isenrollacquisition = false;
                let path = null;

                let cardnumber = [];
                let key = 0;
                for (const field in input) {
                    if (field.substring(0, 10) === 'cardnumber' && input[field]) {
                        cardnumber[key] = input[field];
                        key++;
                    }
                }

                let data = { cardissuedsize, cardnumrequest, isenrollacquisition, issuedexpirydate, membershipid, description, path, cardnumber };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.cardnumberissued.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.cardnumberissued.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/card-inventory');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    handleRequestTypeChange = (value) => {
        this.componentMembershipSelect.retrieveData();
        this.setState({ fieldvalue: { ...this.state.fieldvalue, cardnumrequest: value } });
        this.props.form.setFieldsValue({ membershipid: undefined });
    }

    // onBlurAmount = (e) => {
    //     let amount = e === null ? null : e.target.value;
    //     this.setState({ fieldvalue: { ...this.state.fieldvalue, amount } });
    // }

    handleValidateCardNumber = (rule, value, callback) => {
        if (value && value.length < 9) { callback('Card Number must be 9 digits'); }
        callback();
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const optionsRequestType = [
            { value: 'ENROLLMENT_FORM', label: 'ENROLLMENT FORM' },
            { value: 'UNIQUE_NUMBER', label: 'UNIQUE NUMBER' }
        ];
        const { titlepage, actionspage, formrender } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const { active, cardnumrequest } = this.state.fieldvalue;

        // let cardNumberFields = [];
        // for (var i = 0; i < amount; i++) {
        //     cardNumberFields.push(
        //         <Row>
        //             <InputText key={i} labeltext="Card Number" datafield={"cardnumber_" + i} form={this.props.form} maxLength={9} validationrules={(cardnumrequest === 'UNIQUE_NUMBER') ? ['required', 'pattern.number', this.handleValidateCardNumber] : []} disabled={generalfielddisabled} />
        //         </Row>
        //     )
        // }

        if (formrender) {
            document.title = titlepage + " Card Inventory | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Card Inventory</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <SelectBase form={this.props.form} labeltext="Request Type" placeholder="Request Type" datafield="cardnumrequest" validationrules={['required']} options={optionsRequestType} onChange={this.handleRequestTypeChange} />
                                    <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Membership" datafield="membershipid" className={(cardnumrequest === 'ENROLLMENT_FORM') ? '' : 'hidden'} disabled={generalfielddisabled} />
                                    <InputNumber labeltext="Amount" datafield="cardissuedsize" form={this.props.form} maxLength={10} min={1} validationrules={(cardnumrequest === 'ENROLLMENT_FORM') ? ['required', 'pattern.number'] : []} className={(cardnumrequest === 'ENROLLMENT_FORM') ? '' : 'hidden'} disabled={generalfielddisabled} />
                                    {/* {(cardnumrequest === 'UNIQUE_NUMBER') ? cardNumberFields : ''} */}
                                    <InputText labeltext="Card Number" datafield="cardnumber" form={this.props.form} maxLength={9} validationrules={(cardnumrequest === 'UNIQUE_NUMBER') ? ['required', 'pattern.number', this.handleValidateCardNumber] : []} className={(cardnumrequest === 'UNIQUE_NUMBER') ? '' : 'hidden'} disabled={generalfielddisabled} />
                                    <DatePickerBase form={this.props.form} labeltext="Expired Date" datafield="issuedexpirydate" minDate={moment().add(1, 'day')} disabled={generalfielddisabled} />
                                    <TextArea labeltext="Description" datafield="description" form={this.props.form} maxLength={255} disabled={generalfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && active) ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button url="/card-inventory" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));