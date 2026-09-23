import React, { Component } from 'react';
import { Checkbox, Form } from 'antd';

class CheckboxBaseEntitled extends Component {
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
        let label = (this.props.labeltext) ? this.props.labeltext : (this.props.placeholder) ? this.props.placeholder : 'Field';
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        return (
            <Form.Item label={label} style={this.props.style} className={this.props.className} extra={this.props.extra} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    validateTrigger: 'checked',
                    // rules: this.validationRules(),
                    initialValue: this.props.initialValue
                })(
                    <Checkbox onChange={this.props.onChange} disabled={this.props.disabled} style={this.props.style}> {this.props.children} </Checkbox>,
                )}
            </Form.Item>
        )
    }

}

export default CheckboxBaseEntitled;
