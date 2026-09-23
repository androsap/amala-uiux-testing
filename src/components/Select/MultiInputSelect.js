import React, { Component } from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const children = [];
    for (let i = 2; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

class MultiInputSelect extends Component {
    validationRules = () => {
        let validation = [];
        let label = this.props.placeholder ? this.props.placeholder : this.props.labeltext ? this.props.labeltext : 'Field';

        if (this.props.validationrules) {
            this.props.validationrules.forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(",");
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
                            if (valType[1] === "letter") validate = { pattern: new RegExp("^[A-Za-z]*$"), type: "only alphabet" };
                            else if (valType[1] === "nospace") validate = { pattern: new RegExp('^\\S*$'), type: "no space" };
                            else if (valType[1] === "letterslash") validate = { pattern: new RegExp("^[a-zA-Z/]*$"), type: "must be letter and slash" };
                            else if (valType[1] === "letterslashspace") validate = { pattern: new RegExp("^[a-zA-Z/ ]*$"), type: "must be letter, slash and space" };
                            else if (valType[1] === "letterspace") validate = { pattern: new RegExp("^[a-zA-Z ]*$"), type: "must be letter and space" };
                            else if (valType[1] === "alphabet") validate = { pattern: new RegExp("^[A-Z]*$"), type: "must be uppercase" };
                            else if (valType[1] === "alphabetslash") validate = { pattern: new RegExp("^[A-Z/]*$"), type: "must be uppercase and slash" };
                            else if (valType[1] === "alphabetspace") validate = { pattern: new RegExp("^[A-Z ]*$"), type: "must be uppercase and space" };
                            else if (valType[1] === "alphabetandspace") validate = { pattern: new RegExp("^[A-Za-z ]*$"), type: "must be alphabet and space" };
                            else if (valType[1] === "phonenumber") validate = { pattern: new RegExp("^[+]?[0-9]*$"), type: "can be filled with number only" };
                            else if (valType[1] === "alphanumeric") validate = { pattern: new RegExp("^[A-Za-z0-9]*$"), type: "must be alphanumeric" };
                            else if (valType[1] === "alphanumericspace") validate = { pattern: new RegExp("^[A-Za-z0-9 ]*$"), type: "must be alphanumeric and space" };
                            else if (valType[1] === "alphanumericdot") validate = { pattern: new RegExp("^[A-Za-z0-9.]*$"), type: "must be alphanumeric and dot" };
                            else if (valType[1] === "alphanumericdash") validate = { pattern: new RegExp("^[A-Za-z0-9-]*$"), type: "must be alphanumeric and dash" };
                            else if (valType[1] === "alphanumericdashdotspace") validate = { pattern: new RegExp("^[A-Za-z0-9-. ]*$"), type: "must be alphanumeric, dash, dot and space" };
                            else if (valType[1] === "alphanumericunderscoredot") validate = { pattern: new RegExp("^[A-Za-z0-9_. ]*$"), type: "must be alphanumeric, underscore and dot" };
                            else if (valType[1] === "name") validate = { pattern: new RegExp("^[A-Za-z0-9 '-.]*$"), type: "must be letter or ' - ." };
                            else if (valType[1] === "number") validate = { pattern: new RegExp("^[0-9]*$"), type: "must be number" };
                            else if (valType[1] === "numberdot") validate = { pattern: new RegExp("^[0-9.]*$"), type: "must be number (integer or decimal)" };
                            else if (valType[1] === "numberdotdash") validate = { pattern: new RegExp("^[0-9.-]*$"), type: "must be number, dot, dash" };
                            else if (valType[1] === "email") validate = { pattern: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), type: "format is not valid (e.g. email@example.com)" };
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

        return (
            <Form.Item label={this.props.labeltext} style={this.props.style} className={this.props.className} extra={this.props.extra} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    validateTrigger: 'onBlur',
                    rules: this.validationRules(),
                    initialValue: this.props.defaultValue
                })(
                    <Select
                        mode={this.props.mode}
                        placeholder={this.props.placeholder}
                        defaultValue={this.props.defaultValue}
                        onChange={this.props.handleChange}
                        style={this.props.style}
                        disabled={this.props.disabled}
                        >
                            {this.props.children}
                    </Select>
                )}
            </Form.Item>
        )
    }

}

export default MultiInputSelect;
