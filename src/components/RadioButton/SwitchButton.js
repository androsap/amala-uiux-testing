import React from 'react';
import { Form, Switch } from 'antd';

class SwitchButton extends React.Component {
    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                let label = this.props.labeltext ? this.props.labeltext : (this.props.placeholder) ? this.props.placeholder : 'Field';
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
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition} style={this.props.style}>
                {getFieldDecorator(this.props.datafield, { valuePropName: 'checked', initialValue: this.props.defaultChecked, rules: this.validationRules(), })(
                    (this.props.checked) ? <Switch checkedChildren="Yes" unCheckedChildren="No" disabled={this.props.disabled} onChange={this.props.onChange} checked={this.props.checked} /> :
                        <Switch checkedChildren="Yes" unCheckedChildren="No" disabled={this.props.disabled} onChange={this.props.onChange} />
                )}
            </Form.Item>
        )
    }
}
export default SwitchButton;