import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';

class InputPersent extends Component {
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
                        case "min":
                            validation.push({ min: parseInt(valType[1], 10), message: `${label} min length ${valType[1]}` })
                            break;
                        case "max":
                            validation.push({ max: parseInt(valType[1], 10), message: `${label} max length ${valType[1]}` })
                            break;
                        case "len":
                            validation.push({ len: parseInt(valType[1], 10), message: `${label} len length ${valType[1]}` })
                            break;
                        case "pattern":
                            let validate = {
                                pattern: "",
                                type: ""
                            };
                            if (valType[1] === "letter") validate = { pattern: new RegExp("^[A-Za-z]*$"), type: "must be letter" };
                            else if (valType[1] === "letterspace") validate = { pattern: new RegExp("^[a-zA-Z ]*$"), type: "must be letter and space" };
                            else if (valType[1] === "phonenumber") validate = { pattern: new RegExp("^[+]?[0-9]*$"), type: "must be phone number" };
                            else if (valType[1] === "alphanumeric") validate = { pattern: new RegExp("^[A-Za-z0-9]*$"), type: "must be alphanumeric" };
                            else if (valType[1] === "alphanumericspace") validate = { pattern: new RegExp("^[A-Za-z0-9 ]*$"), type: "must be alphanumeric and space" };
                            else if (valType[1] === "alphanumericdot") validate = { pattern: new RegExp("^[A-Za-z0-9.]*$"), type: "must be alphanumeric and dot" };
                            else if (valType[1] === "alphanumericdash") validate = { pattern: new RegExp("^[A-Za-z0-9-]*$"), type: "must be alphanumeric and dash" };
                            else if (valType[1] === "name") validate = { pattern: new RegExp("^[A-Za-z0-9 '-.]*$"), type: "must be letter or ' - ." };
                            else if (valType[1] === "number") validate = { pattern: new RegExp("^[0-9]*$"), type: "must be number" };
                            else if (valType[1] === "numberdotdash") validate = { pattern: new RegExp("^[0-9.-]*$"), type: "must be number, dot, dash" };
                            else if (valType[1] === "email") validate = { pattern: new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[A-Za-z.]*$"), type: "format is not valid (e.g. email@example.com)" };
                            else if (valType[1] === "letterslash") validate = { pattern: new RegExp("^[a-zA-Z/]*$"), type: "must be letter and slash" };
                            validation.push({ pattern: validate.pattern, message: `${label} ${validate.type}` })
                            break;
                        case "type":
                            validation.push({ type: valType[1], message: `${label} must be of type ${valType[1]}` })
                            break;
                        case "enum":
                            validation.push({ type: "enum", enum: JSON.parse(`${valType[1]}`), message: `${label} enum ${valType[1]}` })
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

        let defaultValue = this.props.defaultValue ? this.props.defaultValue : 0;
        let step = this.props.step ? this.props.step : 0.1;

        return (
            <Form.Item label={this.props.labeltext} style={this.props.style} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    validateTrigger: 'onBlur',
                    rules: this.validationRules(),
                    initialValue: defaultValue
                })(
                    <InputNumber
                        name={this.props.datafield}
                        disabled={this.props.disabled}
                        placeholder={this.props.placeholder}
                        maxLength={this.props.maxLength}
                        onChange={this.props.onChange}
                        min={this.props.min}
                        max={this.props.max}
                        step={step}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')} />
                )}
            </Form.Item>
        )
    }

}

export default InputPersent;
