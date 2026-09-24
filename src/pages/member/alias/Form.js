import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, SelectBase, InputText } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

const optionsType = [
    { label: "Member Name", value: "MEMBER_NAME" },
    { label: "Card Number", value: "CARDNUMBER" },
    { label: "Ticket Name", value: "TICKET_NAME" }
]

const prefixmenuname = 'MBALIAS';
const menucode = 'MBALIAS';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            validationrulesvalue: [],
            maxlengthvalue: null,
            fielddisabled: {
                specialfielddisabled: true,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.memberaliasid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (memberaliasid) => {
        let url = api.url.memberalias.list;
        let criteria = { memberaliasid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let type = (result[0].type) ? result[0].type : undefined;
                    let value = undefined;
                    if (type === 'TICKET_NAME') {
                        value = (result[0].ticketname) ? result[0].ticketname : undefined;
                    } else if (type === 'MEMBER_NAME') {
                        value = (result[0].membername) ? result[0].membername : undefined;
                    } else if (type === 'CARDNUMBER') {
                        value = (result[0].cardnumber) ? result[0].cardnumber : undefined;
                    }

                    let setValue = { type, value };
                    this.props.form.setFieldsValue(setValue);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const { actionspage } = this.state;
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.memberid;
                let type = input.type;
                let membername = (type === 'MEMBER_NAME') ? input.value : null;
                let ticketname = (type === 'TICKET_NAME') ? input.value : null;
                let cardnumber = (type === 'CARDNUMBER') ? input.value : null;

                let message = 'New data has been created';
                let data = { memberid, type, membername, ticketname, cardnumber };
                let url = '';

                if (actionspage === 'create') {
                    url = api.url.memberalias.create;
                } else {
                    url = api.url.memberalias.update;
                    data.memberaliasid = this.props.memberaliasid;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.refreshHeader();
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

    // handleValidationDurationInMonth = (rule, value, callback) => {
    //     let check = value.split("/");
    //     if (value) {
    //         let checktwo = check[0].split(" ");
    //         let checkthree = (check[1] !== undefined) ? check[1].split(" ") : null;
    //         if (check.length !== 2) {
    //             callback('Invalid Format, format : [lastname]/[firstname]');
    //         } else if (checktwo.length !== 1) {
    //             callback('Invalid Format, format : [lastname]/[firstname]');
    //         } else if (check[1] !== undefined && checkthree[0] === '') {
    //             callback('Invalid Format, format : [lastname]/[firstname]');
    //         }
    //     }
    //     callback();
    // }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };

        const { generalfielddisabled } = this.state.fielddisabled;
        const { actionspage } = this.state;
        let validationrulesvalue = [];
        let maxlengthvalue = 45;
        let type = this.props.form.getFieldValue('type');
        let extra = '';
        if (type === 'MEMBER_NAME') {
            validationrulesvalue = ['required', 'pattern.letterspace'];
            maxlengthvalue = 50;
            extra = 'Example : Jajang Disko';
        } else if (type === 'TICKET_NAME') {
            validationrulesvalue = ['required', 'pattern.letterslashspace'];
            maxlengthvalue = 50;
            extra = 'Example : Jajang/Disko Sulaiman';
        } else if (type === 'CARDNUMBER') {
            validationrulesvalue = ['required', 'pattern.number'];
            maxlengthvalue = 20;
            extra = 'Example : 199288477';
        }

        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext="Alias Type" datafield="type" validationrules={['required']} options={optionsType} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Value" datafield="value" validationrules={validationrulesvalue} maxLength={maxlengthvalue} extra={extra} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage !== 'view') ? <Button htmlType="submit" type="default" label="Save" /> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));