import React from 'react';
import { Form, DatePicker, Row, Col } from 'antd';

class DateRangeCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            format: "DD/MM/YYYY",
            startValue: null,
            endValue: null,
            endOpen: false,
            dataValue: []
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

    disabledStartDate = (current, minDate, maxDate) => {
        // Can not select days before today and today
        if (minDate && maxDate === undefined) {
            return current && current.endOf('day') < minDate.endOf('day');
        } else if (minDate === undefined && maxDate) {
            return current && current.endOf('day') > maxDate.endOf('day');
        } else if (minDate && maxDate) {
            return current.endOf('day').isAfter(maxDate.endOf('day')) || current.endOf('day').isSameOrBefore(minDate.endOf('day'))
        }

        return null;
    };

    disabledEndDate = (current, minDate, maxDate) => {
        // const { startValue } = this.state;
        let startdate = (this.props.form.getFieldValue(this.props.datafield) && this.props.form.getFieldValue(this.props.datafield)[0]) ? this.props.form.getFieldValue(this.props.datafield)[0] : undefined;
        minDate = (startdate) ? startdate : minDate;

        // Can not select days before today and today
        if (minDate && maxDate === undefined) {
            return current && current.endOf('day') < minDate.endOf('day');
        } else if (minDate === undefined && maxDate) {
            return current && current.endOf('day') > maxDate.endOf('day');
        } else if (minDate && maxDate) {
            return current.endOf('day').isAfter(maxDate.endOf('day')) || current.endOf('day').isSameOrBefore(minDate.endOf('day'))
        }

        return null;
    };

    onChange = (field, value) => {
        const datafield = this.props.datafield;
        let dataValue = (this.props.form.getFieldValue(this.props.datafield)) ? this.props.form.getFieldValue(this.props.datafield) : [];
        if (field === 'startValue') { dataValue[0] = value; dataValue[1] = undefined }
        if (field === 'endValue') { dataValue[1] = value }

        this.props.form.setFieldsValue({ [datafield]: dataValue });
    };

    onStartChange = value => {
        this.onChange('startValue', value);
    };

    onEndChange = value => {
        this.onChange('endValue', value);
    };

    handleStartOpenChange = open => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = open => {
        this.setState({ endOpen: open });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { format, endOpen } = this.state;
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        let placeholderStartDate = (this.props.placeholder && this.props.placeholder[0]) ? this.props.placeholder[0] : 'Start Date';
        let placeholderEndDate = (this.props.placeholder && this.props.placeholder[1]) ? this.props.placeholder[1] : 'End Date';

        let startdate = (this.props.form.getFieldValue(this.props.datafield) && this.props.form.getFieldValue(this.props.datafield)[0]) ? this.props.form.getFieldValue(this.props.datafield)[0] : undefined;
        let enddate = (this.props.form.getFieldValue(this.props.datafield) && this.props.form.getFieldValue(this.props.datafield)[1]) ? this.props.form.getFieldValue(this.props.datafield)[1] : undefined;

        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                })(
                    <Row>
                        <Col xs={11} sm={11} md={11}>
                            <DatePicker
                                disabledDate={(e) => this.disabledStartDate(e, this.props.minDate, this.props.maxDate)}
                                // showTime
                                format={format}
                                disabled={this.props.disabled}
                                value={startdate}
                                placeholder={placeholderStartDate}
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />
                        </Col>
                        <Col xs={2} sm={2} md={2} style={{ textAlign: 'center' }}>
                            -
                        </Col>
                        <Col xs={11} sm={11} md={11}>
                            <DatePicker
                                // disabledDate={this.disabledEndDate}
                                disabledDate={(e) => this.disabledEndDate(e, this.props.minDate, this.props.maxDate)}
                                // showTime
                                format={format}
                                disabled={this.props.disabled}
                                value={enddate}
                                placeholder={placeholderEndDate}
                                onChange={this.onEndChange}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange}
                            />
                        </Col>
                    </Row>
                )}
            </Form.Item>
        )
    }
}


export default DateRangeCustom;