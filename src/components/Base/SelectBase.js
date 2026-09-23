import React, { Component } from 'react';
import { Select, Form } from 'antd';


const { Option } = Select;

class SelectBase extends Component {
    configuration = {
        datafield: this.props.datafield || "",
        labeltext: this.props.labeltext || "",
        editoroptions: {
            showSearch: this.props.editoroptions ? (this.props.editoroptions.showSearch || false) : false,
            datasource: this.props.editoroptions ? (this.props.editoroptions.datasource || []) : [],
            displayexpr: this.props.editoroptions ? this.props.editoroptions.displayexpr : "text",
            valueexpr: this.props.editoroptions ? this.props.editoroptions.valueexpr : "id",
            onChange: this.props.editoroptions ? (this.props.editoroptions.onChange || null) : null,
            defaultValue: this.props.editoroptions ? (this.props.editoroptions.defaultValue || null) : null,
            style: this.props.editoroptions ? (this.props.editoroptions.style || { width: "100%" }) : { width: "100%" },
            placeholder: this.props.editoroptions ? (this.props.editoroptions.placeholder || `Select ${this.props.labeltext || ""}`) : `Select ${this.props.labeltext || ""}`,
            disabledData: this.props.editoroptions ? (this.props.editoroptions.disabledData || null) : null,
            allowClear: this.props.editoroptions ? (this.props.editoroptions.allowClear || false) : false,
            optionFilterProp: this.props.editoroptions ? this.props.editoroptions.displayexpr : "text",
        },
        validationrules: this.props.validationrules || []
    }

    state = {
        options: [],
        isLoading: true,
        setData: (datasource) => {
            let defaultOpts = [];
            defaultOpts = defaultOpts.concat(datasource.map(this.getOptionValue))
            defaultOpts = this.manipulateData(defaultOpts);
            this.resolveDataFromId(defaultOpts);
            this.setState({ options: defaultOpts, isLoading: false });
        }
    };

    componentDidMount = () => {
        this.getData();
    };

    updateProps() {
        console.log("updateProps")
    }

    getData = (criteria = {}) => {
        const { datasource } = this.configuration.editoroptions;
        let defaultOpts = [];
        if (typeof (datasource) === "function") {
            this.callService(criteria, defaultOpts);
        }
        else if (typeof (datasource) === "object") {
            if (typeof (datasource.store) === "undefined") {
                defaultOpts = defaultOpts.concat(datasource.map(this.getOptionValue))
                defaultOpts = this.manipulateData(defaultOpts);
                this.resolveDataFromId(defaultOpts);
                this.setState({ options: defaultOpts, isLoading: false });
            }
            else {
                datasource.store(this)
            }
        }
    }

    callService = (criteria, defaultOpts) => {
        this.configuration.editoroptions.datasource(criteria, (status, data) => {
            defaultOpts = defaultOpts.concat(data.map(this.getOptionValue))
            defaultOpts = this.manipulateData(defaultOpts);
            if (status) {
                this.setState({ options: defaultOpts, isLoading: false });
                this.resolveDataFromId(defaultOpts);
            }
        });
    }

    manipulateData = (opts) => {
        return opts;
    }

    getFieldValue = (arr, str) => {
        if (str.includes(".")) {
            return this.getFieldValue(arr[str.substring(0, str.indexOf("."))], str.substring(str.indexOf(".") + 1))
        }
        return arr[str];
    };

    getOptionValue = d => {
        return {
            displayexpr: typeof (this.configuration.editoroptions.displayexpr) === "string" ? this.getFieldValue(d, this.configuration.editoroptions.displayexpr) : this.configuration.editoroptions.displayexpr(d),
            valueexpr: typeof (this.configuration.editoroptions.valueexpr) === "string" ? this.getFieldValue(d, this.configuration.editoroptions.valueexpr) : this.configuration.editoroptions.valueexpr(d),
            data: d
        }
    }

    resolveDataFromId = (opts) => {
        let filterExpr = this.props.defaultValue ? (this.props.defaultValue || this.configuration.editoroptions.defaultValue) : this.configuration.editoroptions.defaultValue;
        let optf = (typeof opts === 'undefined' ? this.state.options : opts).filter(o => o.valueexpr === filterExpr);
        if (optf.length) this.configuration.defaultValue = optf[0].displayexpr;
        if (filterExpr && this.props.form && (this.props.datafield || this.configuration.datafield)) {
            this.props.form.setFieldsValue({
                [this.configuration.datafield]: this.configuration.defaultValue
            });
        }
    }

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules || this.configuration.validationrules) {
            (this.props.validationrules || this.configuration.validationrules).forEach((item, index) => {
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

    disabledData = (id) => {
        let result = false;
        if (this.configuration.editoroptions.disabledData) {
            if (typeof (this.configuration.editoroptions.disabledData.datasource) === "function") {
                this.configuration.editoroptions.disabledData.datasource.list((status, data) => {
                    if (status) {
                        const key = this.configuration.editoroptions.disabledData.key;
                        if (data.filter(x => x[key] === id).length > 0) {
                            result = true;
                        }
                    }
                });
            }
            else if (typeof (this.configuration.editoroptions.disabledData.datasource) === "object") {
                const key = this.configuration.editoroptions.disabledData.key;

                if (this.configuration.editoroptions.disabledData.datasource.filter(x => this.getFieldValue(x, key) === id).length > 0) {
                    result = true;
                }
            }
        }

        return result;
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        let datafield = this.configuration.datafield;
        if (this.configuration.datafield.includes(".")) {
            datafield = this.configuration.datafield.split(".")[this.configuration.datafield.split(".").length - 1];
        }

        const labelPosition = this.props.labelPosition === "left" ? {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        } : null;

        return <Form.Item
            label={this.configuration.labeltext}
            {...labelPosition}
            style={this.configuration.formGroupStyle} controlId="1">
            {getFieldDecorator(datafield, {
                rules: this.validationRules()
            })(
                <Select
                    {...this.configuration.editoroptions}
                    {...this.props.editoroptions}
                    loading={this.state.isLoading}
                    placeholder={this.configuration.editoroptions.placeholder || `Select ${this.props.labeltext}`}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={this.props.disabled}
                >
                    {this.state.options.map((d, key) => (
                        <Option key={key} disabled={this.disabledData(d.valueexpr)} value={d.valueexpr}>{d.displayexpr}</Option>
                    ))}
                </Select>
            )}
        </Form.Item>
    }

}

export default SelectBase;
