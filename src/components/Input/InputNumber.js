import React, { Component } from 'react';
import { InputNumber as AntdInputNumber, Form } from 'antd';

class InputNumber extends Component {
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
                    <AntdInputNumber
                        name={this.props.datafield}
                        disabled={this.props.disabled}
                        placeholder={this.props.placeholder}
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                        min={this.props.min}
                        max={this.props.max}
                        style={(this.props.style) ? this.props.style : { width: 'auto' }}
                        formatter={this.props.formatter}
                        parser={this.props.parser} 
                        defaultValue={this.props.defaultValue}/>
                )}
            </Form.Item>
        )
    }
}

export default InputNumber;
