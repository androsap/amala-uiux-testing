import React, { Component } from 'react';
import { Input, Form, Tag } from 'antd';

class TextAreaTag extends Component {
    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            this.props.validationrules.forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${this.props.labeltext} is Required` })
                            break;
                        case "min":
                            validation.push({ min: parseInt(valType[1], 10), message: `${this.props.labeltext} min length ${valType[1]}` })
                            break;
                        case "max":
                            validation.push({ max: parseInt(valType[1], 10), message: `${this.props.labeltext} max length ${valType[1]}` })
                            break;
                        case "len":
                            validation.push({ len: parseInt(valType[1], 10), message: `${this.props.labeltext} len length ${valType[1]}` })
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
                            validation.push({ pattern: validate.pattern, message: `${this.props.labeltext} ${validate.type}` })
                            break;
                        case "type":
                            validation.push({ type: valType[1], message: `${this.props.labeltext} must be of type ${valType[1]}` })
                            break;
                        case "enum":
                            validation.push({ type: "enum", enum: JSON.parse(`${valType[1]}`), message: `${this.props.labeltext} enum ${valType[1]}` })
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


    addLabel = (e, target, textValue) => {
        e.preventDefault();
        //Get textArea HTML control 
        var txtArea = document.getElementById(target);
        textValue = "{" + textValue + "}";
        //IE
        if (document.selection) {
            txtArea.focus();
            var sel = document.selection.createRange();
            sel.text = textValue;
            return;
        }
        //Firefox, chrome, mozilla
        else if (txtArea.selectionStart || txtArea.selectionStart === 0) {
            var startPos = txtArea.selectionStart;
            var endPos = txtArea.selectionEnd;
            txtArea.value = txtArea.value.substring(0, startPos) + textValue + txtArea.value.substring(endPos, txtArea.value.length);
            txtArea.focus();
            txtArea.selectionStart = startPos + textValue.length;
            txtArea.selectionEnd = startPos + textValue.length;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form.Item label={this.props.labeltext} style={this.props.style}>
                {getFieldDecorator(this.props.datafield, {
                    validateTrigger: 'onBlur',
                    rules: this.validationRules(),
                })(
                    <Input.TextArea id={this.props.datafield} name={this.props.datafield} disabled={this.props.disabled} placeholder={this.props.placeholder} maxLength={this.props.maxLength} />

                )}
                {
                    (this.props.tags) ?
                        this.props.tags.map((obj, key) => {
                            return (<Tag key={key} color="#108ee9" value={obj.value} onClick={(e) => this.addLabel(e, this.props.datafield, obj.value)}>{obj.name}</Tag>)
                        })
                        : null
                }
            </Form.Item>
        )
    }

}

export default TextAreaTag;
