import React, { Component } from 'react';
import { Form } from 'antd';
import CKEditor from "react-ckeditor-component";

class TextRich extends Component {
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
            <Form.Item label={this.props.labeltext} style={this.props.style} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    validateTrigger: 'onBlur',
                    rules: this.validationRules()
                })(
                    <CKEditor activeClass="active" name={this.props.datafield} content={this.props.content} events={this.props.events} disabled={this.props.disabled} />
                )}
            </Form.Item>
        )
    }

}

export default TextRich;
