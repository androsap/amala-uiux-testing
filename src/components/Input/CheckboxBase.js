import React, { Component } from 'react';
import { Checkbox } from 'antd';

class CheckboxBase extends Component {
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
        return (
            getFieldDecorator(this.props.datafield, {
                valuePropName: 'checked',
                initialValue: this.props.initialvalue
            })(
                <Checkbox onChange={this.props.onChange} disabled={this.props.disabled} style={this.props.style}> {this.props.children} </Checkbox>,
            )
        )
    }

}

export default CheckboxBase;
