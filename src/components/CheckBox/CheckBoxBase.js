import React from 'react';
import { Form, Checkbox, Row, Spin } from 'antd';

class CheckBoxBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            options: []
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
        const { loading } = this.state;
        return (
            <Form.Item label={this.props.labeltext} className={this.props.className}>
                <Row type="flex" justify="center">
                    <Spin spinning={loading} size="small" tip="Loading..." />
                </Row>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.initialvalue
                })(
                    <Checkbox.Group onChange={this.props.onChange} options={this.props.options} />
                )}
            </Form.Item>
        )
    }
}
export default CheckBoxBase;