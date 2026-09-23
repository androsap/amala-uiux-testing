import React from 'react';
import { Form, Radio } from 'antd';

class StatusRadioButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [
                { label: 'ACTIVE', value: 'ACTIVE' },
                { label: 'INACTIVE', value: 'INACTIVE' }
            ]
        }
    }

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
        const { options } = this.state;
        return (
            <Form.Item label={this.props.labeltext}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules()
                })(
                    <Radio.Group disabled={this.props.disabled}>
                        {options.map((obj, key) => (
                            <Radio key={key} value={obj.value}>{obj.label}</Radio>
                        ))}
                    </Radio.Group>,
                )}
            </Form.Item>
        )
    }
}
export default StatusRadioButton;