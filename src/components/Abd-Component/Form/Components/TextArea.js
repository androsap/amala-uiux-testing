import React, { Component } from 'react';
import { Form, Input } from 'antd'
import { validationRole, camelize } from '../../BaseFunction'
const { TextArea } = Input

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
        const { getFieldDecorator } = this.props.form;
        const { visible } = editorOptions || {};

        const classNames = (className || "") + (typeof visible !== "undefined" ? (!visible ? "d-none" : "") : "");
        const { text } = label || {};

        delete editorOptions.visible;
        return (<Form.Item
            {...label}
            {...this.props}
            {...formItemLayout()}
            className={classNames}
            label={text}
        >
            {getFieldDecorator(dataField, {
                rules: validation(),
            })(
            <TextArea 
                {...editorOptions}
                onChange={e => onChange(e)}
            />
            )} 
        </Form.Item>);
    }
}

export default Index;