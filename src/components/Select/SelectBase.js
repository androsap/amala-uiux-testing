import React from 'react';
import { Select, Form } from 'antd';

const { Option } = Select;

class SelectBase extends React.Component {
    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                let label = this.props.labeltext ? this.props.labeltext : (this.props.placeholder) ? this.props.placeholder : 'Field';
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

    render() {
        const { getFieldDecorator } = this.props.form;
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;
        let allowClear = (this.props.allowClear !== undefined) ? this.props.allowClear : true;
        let placeholder = `${(this.props.noSuffixPlaceholder) ? '' : ((this.props.showArrow || (this.props.showArrow === undefined)) ? 'Choose ' : 'Input ')} ${(this.props.labeltext || this.props.placeholder)}`;

        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition} style={this.props.style}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.defaultValue
                })(
                    <Select
                        showSearch
                        className={this.props.className}
                        onMouseLeave={this.props.onMouseLeave}
                        showArrow={this.props.showArrow}
                        mode={this.props.mode}
                        loading={this.props.isLoading}
                        optionFilterProp="children"
                        placeholder={placeholder}
                        onChange={this.props.onChange}
                        onSearch={this.props.onSearch}
                        allowClear={allowClear}
                        disabled={this.props.disabled}
                        onDropdownVisibleChange={this.props.onDropdownVisibleChange}
                        onSelect={this.props.onSelect}
                        onBlur={this.props.onBlur}
                        {...this.props.editorOptions}>
                        {this.props.options.map((obj, key) => (
                            <Option key={key} value={obj.value} title={(this.props.usingTitle) ? `${obj.label}` : null}>
                                {obj.label}
                            </Option>
                        ))}
                    </Select>,
                )}
            </Form.Item>
        )
    }

}

export default SelectBase;