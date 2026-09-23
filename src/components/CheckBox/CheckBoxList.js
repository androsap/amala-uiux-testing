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
        return (
            <Form.Item label={this.props.labeltext} className={this.props.className}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.initialvalue
                })(
                    // <Checkbox.Group options={this.props.options} checked={this.props.checked} />

                    <Checkbox.Group onChange={this.props.onChange} style={this.props.style}>
                        <Row>
                            {this.props.options.map((obj) => (
                                <Col span={8}>
                                    <Checkbox key={obj.key} value={obj.value}>{obj.label}</Checkbox>
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