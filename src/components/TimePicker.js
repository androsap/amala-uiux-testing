import React from 'react';
import { Form, TimePicker } from 'antd';

class TimePickerBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeFormat: (this.props.timeformat !== undefined) ? this.props.timeformat : 'HH:mm:ss'
        }
    }

    validationRules = () => {
        let validation = [];
        let fieldlabel = this.props.placeholder ? this.props.placeholder : this.props.labeltext ? this.props.labeltext : 'Time';
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
        const { dateFormat } = this.state;
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;
        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.defaultValue
                })(
                    <TimePicker format={dateFormat} style={{ width: '100%' }} disabled={this.props.disabled} placeholder={this.props.placeholder} onChange={this.props.onChange}/>,
                )}
            </Form.Item>
        )
    }

}

export default TimePickerBase;