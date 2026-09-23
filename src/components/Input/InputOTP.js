import React, { Component } from 'react';
import { Form, Row } from 'antd';
import OtpInput from 'react-otp-input';

class InputOTP extends Component {
    validationRules = () => {
        let validation = [];
        let label = (this.props.labeltext) ?
            this.props.labeltext : (this.props.placeholder) ? this.props.placeholder : 'Field';

        if (this.props.validationrules) {
            this.props.validationrules.forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${label} is Required` })
                            break;
                        default:
                    }
                }
                else if (typeof (item) === "function") {
                    validation.push({
                        validator: item
                    })
                }
            })
        }

        return validation;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        return (
            <Form.Item label={this.props.labeltext} style={this.props.style} className={this.props.className} extra={this.props.extra} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    validateTrigger: 'onBlur',
                    rules: this.validationRules(),
                    initialValue: this.props.defaultValue
                })(
                    <Row type="flex" justify="center">
                        <OtpInput
                            value={this.props.value}
                            shouldAutoFocus={true}
                            onChange={this.props.onChange}
                            numInputs={this.props.numInputs}
                            renderSeparator={<span>&nbsp;&nbsp;</span>}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={{ width: 50, borderRadius: '8px', borderColor: 'rgba(0, 0, 0, 0.65)' }}
                        />
                    </Row>
                )}
            </Form.Item>
        )
    }
}

export default InputOTP;
