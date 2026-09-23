import React, { Component } from 'react';
import { Form, Input, Icon } from 'antd'
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
        const { label, editorOptions, className, dataField, style } = this.props.props;
        const { formItemLayout, onChange, validation } = this.methods;
        const { getFieldDecorator } = this.props.form;
        const { icon, visible } = editorOptions || {};

        const classNames = (className || "") + (typeof visible !== "undefined" ? (!visible ? "d-none" : "") : "");
        const { text } = label || {};
        const styles = Object.assign(style || {}, {width: "100%"});

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
            <Input.Password 
                {...editorOptions}
                style={styles}
                onChange={e => onChange(e)}
            >
                {icon ? <Icon type={icon.type} /> : null}
            </Input.Password>
            )} 
        </Form.Item>);
    }
}

export default Index;