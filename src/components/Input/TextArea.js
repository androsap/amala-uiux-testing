import React, { Component } from 'react';
import { Input, Form } from 'antd';

class InputText extends Component {
    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            this.props.validationrules.forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${this.props.labeltext || this.props.placeholder} is Required` })
                            break;
                        case "min":
                            validation.push({ min: parseInt(valType[1], 10), message: `${this.props.labeltext || this.props.placeholder} min length ${valType[1]}` })
                            break;
                        case "max":
                            validation.push({ max: parseInt(valType[1], 10), message: `${this.props.labeltext || this.props.placeholder} max length ${valType[1]}` })
                            break;
                        case "len":
                            validation.push({ len: parseInt(valType[1], 10), message: `${this.props.labeltext || this.props.placeholder} len length ${valType[1]}` })
                            break;
                        case "pattern":
                            let validate = {
                                pattern: "",
                                type: ""
                            };
                            if (valType[1] === "letter") validate = { pattern: new RegExp("^[A-Za-z]*$\\r\\n"), type: "must be letter" };
                            else if (valType[1] === "letterspace") validate = { pattern: new RegExp("^[a-zA-Z\\r\\n ]*$"), type: "must be letter and space" };
                            else if (valType[1] === "phonenumber") validate = { pattern: new RegExp("^[+]?[0-9\\r\\n]*$"), type: "must be phone number" };
                            else if (valType[1] === "alphanumeric") validate = { pattern: new RegExp("^[A-Za-z0-9\\r\\n]*$"), type: "must be alphanumeric" };
                            else if (valType[1] === "alphanumericspace") validate = { pattern: new RegExp("^[A-Za-z0-9\\r\\n ]*$"), type: "must be alphanumeric and space" };
                            else if (valType[1] === "alphanumericdot") validate = { pattern: new RegExp("^[A-Za-z0-9.\\r\\n]*$"), type: "must be alphanumeric and dot" };
                            else if (valType[1] === "name") validate = { pattern: new RegExp("^[A-Za-z0-9 '-.\\r\\n]*$"), type: "must be letter or ' - ." };
                            else if (valType[1] === "number") validate = { pattern: new RegExp("^[0-9\\r\\n]*$"), type: "must be number" };
                            else if (valType[1] === "alphanumericspacebracketdash") validate = { pattern: new RegExp("^[A-Za-z0-9\\r\\n{}\\- ]*$"), type: "Only alphanumeric, space, bracket, and dash" };
                            validation.push({ pattern: validate.pattern, message: `${this.props.labeltext || this.props.placeholder} ${validate.type}` })
                            break;
                        case "type":
                            validation.push({ type: valType[1], message: `${this.props.labeltext || this.props.placeholder} must be of type ${valType[1]}` })
                            break;
                        case "enum":
                            validation.push({ type: "enum", enum: JSON.parse(`${valType[1]}`), message: `${this.props.labeltext || this.props.placeholder} enum ${valType[1]}` })
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
            <Form.Item label={this.props.labeltext} style={this.props.style} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    validateTrigger: 'onBlur',
                    rules: this.validationRules(),
                    // initialValue: this.props.defaultValue
                })(
                    <Input.TextArea rows={this.props.maxRows === undefined ? 0 : this.props.maxRows} name={this.props.datafield} disabled={this.props.disabled} placeholder={this.props.placeholder} maxLength={this.props.maxLength} />
                )}
            </Form.Item>
        )
    }

}

export default InputText;
