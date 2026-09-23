import React from 'react';
import { Form, Switch } from 'antd';

class SwitchButton extends React.Component {
    validationRules = () => {
        let validation = [];
        let fieldlabel = this.props.placeholder ? this.props.placeholder : this.props.labeltext ? this.props.labeltext : 'Date';
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${fieldlabel} is Required` })
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
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, { valuePropName: 'checked', initialValue: this.props.defaultChecked, rules: this.validationRules(), })(
                    (this.props.checked) ? <Switch checkedChildren="Yes" unCheckedChildren="No" disabled={this.props.disabled} onChange={this.props.onChange} checked={this.props.checked} /> :
                        <Switch checkedChildren="Yes" unCheckedChildren="No" disabled={this.props.disabled} onChange={this.props.onChange} />
                )}
            </Form.Item>
        )
    }
}
export default SwitchButton;