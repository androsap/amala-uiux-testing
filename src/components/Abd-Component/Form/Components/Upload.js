import React, { Component } from 'react';
import { Form, Upload, Button, Icon } from 'antd'
import { validationRole, camelize } from '../../BaseFunction'

export class Index extends Component {
    constructor(props){
        super(props);
        this.methods = {
            formItemLayout: () => {
                const { label } = this.props.props;
                return typeof label !== "undefined" ? (label.position === 'left'
                    ? {
                        labelCol: { span: 4 },
                        wrapperCol: { span: 14 },
                    }
                    : {}) : {};
            },
            onChange: (e) => {
                const { editorOptions } = this.props.props;
                const { onChange } = editorOptions;
                if(onChange) onChange(e, this.props.methods);
            },
            validation: () => {
                const { label, validationRules, editorOptions, dataField, caption } = this.props.props;
                const { visible, disabled } = editorOptions || {};
                const { text } = label || {};
                return validationRole(visible || disabled ? [] : validationRules, text || (caption ||  camelize(dataField)));
            }
        }
    }

    render() {
        const { label, editorOptions, className, dataField } = this.props.props;
        const { formItemLayout, onChange, validation } = this.methods;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { text, url, parameter, visible } = editorOptions || {};

        const classNames = (className || "") + (typeof visible !== "undefined" ? (!visible ? "d-none" : "") : "");

        delete editorOptions.visible;
        return (<Form.Item
            {...label}
            {...this.props}
            {...formItemLayout()}
            className={classNames}
            label={label ? label.text : ""}
        >
            {getFieldDecorator(dataField, {
                rules: validation(),
            })(
                <Upload 
                    {...editorOptions}
                    onChange={onChange}
                    action={url}
                    {...parameter ? { data: parameter({ options: this, data: getFieldsValue() }) } : null}
                >
                    <Button>
                        <Icon type="upload" /> {text || "Click to Upload"}
                    </Button>
                </Upload>
            )} 
        </Form.Item>);
    }
}

export default Index;