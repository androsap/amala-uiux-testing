import React, { Component } from 'react';
import { Select, Checkbox, Form } from 'antd';

const { Option } = Select;

class SelectBaseWithCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: [],
        };
    }

    handleSelectChange = (value) => {
        this.setState({ selectedOptions: value });
    };

    handleOptionClick = (optionValue) => {
        const index = this.state.selectedOptions.indexOf(optionValue);

        let newSelectedOptions = this.state.selectedOptions;
        if (index === -1) {
            newSelectedOptions.push(optionValue);
        } else newSelectedOptions.splice(index, 1);

        this.setState({ selectedOptions: newSelectedOptions });
    };

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            this.props.validationrules.forEach((item, index) => {
                let label = this.props.labeltext ? this.props.labeltext :
                    this.props.placeholder ? this.props.placeholder : 'Field';
                if (typeof item === 'string') {
                    let valType = item.split('.');
                    switch (valType[0]) {
                        case 'required':
                            validation.push({
                                required: true,
                                message: `${label} is Required`,
                            });
                            break;
                        default:
                    }
                } else if (typeof item === 'function') {
                    validation.push({ validator: item });
                }
            });
        }

        return validation;
    };

    handleReset = () => {
        this.setState({ selectedOptions: []});
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        let labelPosition = this.props.labelCol || this.props.wrapperCol ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol,
        } : null;
        let allowClear = this.props.allowClear !== undefined ? this.props.allowClear : true;

        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition} style={this.props.style} >
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.defaultValue,
                })(
                    <Select
                        allowClear={allowClear}
                        mode='multiple'
                        placeholder={(this.props.placeholder) ? this.props.placeholder : `Select ${this.props.labeltext}`}
                        onChange={this.handleSelectChange}
                        maxTagCount={(this.props.maxTagCount) ? this.props.maxTagCount : null}
                        optionLabelProp='label'
                    >
                        {this.props.options.map((obj, key) => {
                            const isChecked = this.state.selectedOptions.includes(obj.value);
                            return (
                                <Option key={key} value={obj.value} label={obj.label}>
                                    <Checkbox id={`${obj.value}`} checked={isChecked} onClick={() => this.handleOptionClick(obj.value)} />
                                    {`    ${obj.label}`}
                                </Option>
                            );
                        })}
                    </Select>
                )}
            </Form.Item>
        );
    }
}

export default SelectBaseWithCheckbox;