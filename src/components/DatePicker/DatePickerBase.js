import React from 'react';
import { Form, DatePicker } from 'antd';

class DatePickerBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateFormat: (this.props.dateformat !== undefined) ? this.props.dateformat : 'DD/MM/YYYY'
        }
    }

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

    disabledDate(current, minDate, maxDate) {
        // Can not select days before today and today
        if (minDate && maxDate === undefined) {
            return current && current.endOf('day') < minDate.endOf('day');
        } else if (minDate === undefined && maxDate) {
            return current && current.endOf('day') > maxDate.endOf('day');
        } else if (minDate && maxDate) {
            // return current.endOf('day').isAfter(maxDate.endOf('day')) || current.endOf('day').isSameOrBefore(minDate)
            return current && (current.endOf('day') > maxDate.endOf('day') || current.endOf('day') < minDate.endOf('day'));
        }

        return null;
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
                    <DatePicker format={dateFormat} style={{ width: '100%' }} disabled={this.props.disabled} placeholder={this.props.placeholder || this.props.labeltext} disabledDate={(e) => this.disabledDate(e, this.props.minDate, this.props.maxDate)} onChange={this.props.onChange} defaultPickerValue={this.props.defaultPickerValue} />,
                )}
            </Form.Item>
        )
    }

}

export default DatePickerBase;