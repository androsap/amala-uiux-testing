
import React, { Component } from 'react';
import { Cascader, Form } from 'antd';

class CascenderBase extends Component {
    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
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
        const { options } = this.props;
        return (
            <Form.Item label={this.props.labeltext}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules()
                })(
                    <Cascader
                        // defaultValue={['zhejiang', 'hangzhou', 'xihu']}
                        options={options}
                        onChange={this.props.onChange}
                        disabled={this.props.disabled}
                    />
                )}
            </Form.Item>
        )
    }
}


export default CascenderBase;