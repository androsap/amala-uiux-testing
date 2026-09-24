import React, { Component } from 'react';
import { InputText, DatePickerBase, Button, SelectBase } from '../../../components/Base/BaseComponent';
import { Form, Col, Icon, Row } from 'antd';
import { connect } from "react-redux";
import { CorporateRole } from '../../../data';
import moment from 'moment';

let id = 1;

class AdminForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admincordinator: [],
            generalfielddisabled: false
        }
    };

    componentDidMount() { };

    handleAddAdmin = () => {
        let admincordinator = this.state.admincordinator.concat(id++);
        this.setState({ admincordinator });
    };

    handleRemoveAdmin = (val) => {
        let admincordinator = this.state.admincordinator.filter((key) => (key !== val));
        this.setState({ admincordinator });
    };

    render() {
        const { fielddisabled, admincardnumberundisabled } = this.props;
        const { idnumberdisabled } = fielddisabled;
        const { admincordinator, generalfielddisabled } = this.state;

        return (
            <Row gutter={24}>
                <Col className="searching-form" xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                    <Col span={12}>
                        <InputText form={this.props.form} labeltext="Card Number" datafield={`admin[0][cardnumber]`} validationrules={['required', 'pattern.number']} maxLength={45} onBlur={(e) => this.props.handleAutoFill(e, 'admin', 0)} disabled={generalfielddisabled} />
                        <InputText form={this.props.form} labeltext="Name" datafield={`admin[0][name]`} validationrules={['required']} maxLength={45} disabled={true} />
                        <DatePickerBase form={this.props.form} labeltext="Birth Date" datafield={`admin[0][birthdate]`} maxDate={moment()} validationrules={['required']} disabled={true} />
                        <InputText form={this.props.form} labeltext="ID Number" datafield={`admin[0][idcardnumber]`} validationrules={['required', 'pattern.number']} maxLength={45} disabled={idnumberdisabled} />
                    </Col>
                    <Col span={12}>
                        <InputText form={this.props.form} labeltext="Email" datafield={`admin[0][email]`} validationrules={['required', 'pattern.email']} maxLength={255} disabled={true} />
                        <InputText form={this.props.form} labeltext="Phone Number" datafield={`admin[0][phonenumber]`} validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                        <InputText form={this.props.form} labeltext="Username" datafield={`admin[0][username]`} validationrules={['required']} maxLength={45} disabled={true} />
                        <SelectBase form={this.props.form} labeltext="Corporate Role" datafield={`admin[0][rolecode]`} options={CorporateRole} validationrules={['required']} disabled={true} defaultValue={'ADMIN'} />
                    </Col>
                </Col>
                {
                    admincordinator.map((val, i) => {
                        let disabled = true;
                        let idx = admincardnumberundisabled.findIndex(x => x === val);
                        if (idx !== -1) disabled = false;

                        return (
                            <div key={val}>
                                <Col className="searching-form" xs={24} sm={24} md={22} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                    <Col span={12}>
                                        <InputText form={this.props.form} labeltext="Card Number" datafield={`admin[${val}][cardnumber]`} validationrules={['required', 'pattern.number']} maxLength={45} onBlur={(e) => this.props.handleAutoFill(e, 'admin', val)} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext="Name" datafield={`admin[${val}][name]`} validationrules={['required']} maxLength={45} disabled={true} />
                                        <DatePickerBase form={this.props.form} labeltext="Birth Date" datafield={`admin[${val}][birthdate]`} maxDate={moment()} validationrules={['required']} disabled={true} />
                                        <InputText form={this.props.form} labeltext="ID Number" datafield={`admin[${val}][idcardnumber]`} validationrules={['required', 'pattern.number']} maxLength={45} disabled={disabled} />
                                    </Col>
                                    <Col span={12}>
                                        <InputText form={this.props.form} labeltext="Email" datafield={`admin[${val}][email]`} validationrules={['required', 'pattern.email']} maxLength={255} disabled={true} />
                                        <InputText form={this.props.form} labeltext="Phone Number" datafield={`admin[${val}][phonenumber]`} validationrules={['required', 'pattern.number']} maxLength={45} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext="Username" datafield={`admin[${val}][username]`} validationrules={['required']} maxLength={45} disabled={true} />
                                        <SelectBase form={this.props.form} labeltext="Corporate Role" datafield={`admin[${val}][rolecode]`} options={CorporateRole} validationrules={['required']} disabled={true} defaultValue={'ADMIN'} />
                                    </Col>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={2} lg={4} xl={4}>
                                    <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.handleRemoveAdmin(val)} />
                                </Col>
                            </div>
                        )
                    })
                }
                <Col className="gutter-row" align="center" xs={24} sm={24} md={24} style={{ marginBottom: 15 }}>
                    <Button htmlType="button" type="dashed" shape="circle" icon="plus" onClick={this.handleAddAdmin} />
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(AdminForm));