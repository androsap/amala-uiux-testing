import React from 'react';
import { Form, Checkbox, Row, Col } from 'antd';

class RadioButton extends React.Component {
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
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.initialvalue
                })(
                    <Checkbox.Group onChange={this.props.onChange} style={{ width: '100%' }}>
                        <Row>
                            {this.props.options.map((value, key) => (
                                <Col span={8}>
                                    <Checkbox key={value} value={value} disabled={this.props.disabled}>{value}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>,
                )}
            </Form.Item>
        )
    }
}
export default RadioButton;