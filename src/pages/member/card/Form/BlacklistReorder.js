import React, { Component } from 'react';
import { SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, CurrencySelect, SwitchButton, InputText, TextArea } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
        this.componentCurrencySelect.retrieveData();
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let membercardid = this.props.membercardid;
                let currencycode = input.currencycode;
                let waivefee = input.waivefee ? true : false;
                let receiptnumber = input.receiptnumber ? input.receiptnumber : null;
                let notes = input.notes ? input.notes : null;

                let message = 'Card has been blacklist & reorder';
                let data = { membercardid, currencycode, receiptnumber, waivefee, notes };
                let url = api.url.membercard.blacklistreorder;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.refreshHeader();
                        this.props.onClose();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        // const { menucode, prefixmenuname } = this.props;

        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext="Currency" datafield="currencycode" validationrules={['required']} />
                                <SwitchButton form={this.props.form} labeltext="Waive Fee" datafield="waivefee" />
                                <InputText form={this.props.form} labeltext="Receipt Number" datafield="receiptnumber" maxLength={45} />
                                <TextArea form={this.props.form} labeltext="Notes" datafield="notes" maxLength={255} />
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