
import React from 'react';
import { Form, Input } from 'antd';
const InputGroup = Input.Group;

class InputRange extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || {};
        this.state = {
            min: value.min || 0,
            max: value.max || 0,
        };
    }

    handleNumberChange = e => {
        const min = parseInt(e.target.value || 0, 10);
        if (isNaN(min)) {
            return;
        }
        if (!('value' in this.props)) {
            this.setState({ min });
        }
        this.triggerChange({ min });
    };

    handleNumber2Change = e => {
        const max = parseInt(e.target.value || 0, 10);
        if (isNaN(max)) {
            return;
        }
        if (!('value' in this.props)) {
            this.setState({ max });
        }
        this.triggerChange({ max });
    };

    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props;
        if (onChange) {
            onChange({
                ...this.state,
                ...changedValue,
            });
        }
    };

    render() {
        const { min, max } = this.state;
        return (
            <span>
                <InputGroup>
                    <Input style={{ width: '45%', textAlign: 'center' }} value={min} onChange={this.handleNumberChange} maxLength={this.props.maxLength} disabled={this.props.disabled}/>
                    <Input style={{ width: '10%', pointerEvents: 'none', backgroundColor: '#fff', textAlign: 'center' }} placeholder="~" disabled />
                    <Input style={{ width: '45%', textAlign: 'center' }} value={max} onChange={this.handleNumber2Change} maxLength={this.props.maxLength} disabled={this.props.disabled}/>
                </InputGroup>
            </span>
        );
    }
}

class InputTextRange extends React.Component {
    validationRules = (rule, value, callback) => {
        if (value.min > value.max) {
            callback('Maximum must be greater than minimum');
            return;
        }

        this.props.validationrules.forEach((item, index) => {
            let valType = item.split(".");
            switch (valType[0]) {
                case "required":
                    if (value.min === undefined || value.min === '') {
                        callback(`Minimum ${this.props.labeltext} is Required`)
                    } else if (value.max === undefined || value.max === '') {
                        callback(`Maximum ${this.props.labeltext} is Required`)
                    }
                    break;
                case "min":
                    if (value.min === undefined || parseInt(value.min.toString().length, 0) < parseInt(valType[1], 0)) {
                        callback(`Minimum ${this.props.labeltext} min length ${valType[1]}`)
                    } else if (value.max === undefined || parseInt(value.max.toString().length, 0) < parseInt(valType[1], 0)) {
                        callback(`Maximum ${this.props.labeltext} min length ${valType[1]}`)
                    }
                    break;
                case "max":
                    if (value.min === undefined || parseInt(value.min.toString().length, 0) > parseInt(valType[1], 0)) {
                        callback(`Minimum ${this.props.labeltext} min length ${valType[1]}`)
                    } else if (value.max === undefined || parseInt(value.max.toString().length, 0) > parseInt(valType[1], 0)) {
                        callback(`Maximum ${this.props.labeltext} max length ${valType[1]}`)
                    }
                    break;
                default:
            }
        })
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form.Item label={this.props.labeltext}>
                {getFieldDecorator(this.props.datafield, {
                    initialValue: { min: 0, max: 0 },
                    rules: [{ validator: this.validationRules }],
                })(<InputRange maxLength={this.props.maxLength} disabled={this.props.disabled}/>)}
            </Form.Item>
        );
    }
}
export default InputTextRange;
