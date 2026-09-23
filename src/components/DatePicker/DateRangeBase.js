import React from 'react';
import { Form, DatePicker } from 'antd';
const { RangePicker } = DatePicker;

class DateRangeBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateFormat: (this.props.dateformat !== undefined) ? this.props.dateformat : 'DD/MM/YYYY',
            placeholder: (this.props.placeholder !== undefined) ? this.props.placeholder : ['Start Date', 'End Date']
        }
    }

    validationRules = () => {
        let validation = [];
        let label = (this.props.labeltext) ? this.props.labeltext : 'Field';
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
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

    disabledDate(current, minDate, maxDate) {
        // Can not select days before today and today
        if (minDate && maxDate === undefined) {
            return current && current.endOf('day') < minDate.endOf('day');
        } else if (minDate === undefined && maxDate) {
            return current && current.endOf('day') > maxDate.endOf('day');
        } else if (minDate && maxDate) {
            return current.endOf('day').isAfter(maxDate.endOf('day')) || current.endOf('day').isSameOrBefore(minDate.endOf('day'))
        }

        return null;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { dateFormat, placeholder } = this.state;
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
                    <RangePicker format={dateFormat} style={{ width: '100%' }} placeholder={placeholder} disabled={this.props.disabled} disabledDate={(e) => this.disabledDate(e, this.props.minDate, this.props.maxDate)} onChange={this.props.onChange} defaultPickerValue={this.props.defaultPickerValue} />,
                )}
            </Form.Item>
        )
    }

}

export default DateRangeBase;