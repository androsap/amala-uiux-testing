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
            validation: () => {
                const { label, validationRules, dataField } = this.props.props;
                const { text } = label || {};
                return validationRole(validationRules, text ||  camelize(dataField));
            }
        }
    }

    render() {
        const { label, editorOptions, dataField } = this.props.props;
        const { formItemLayout, validation } = this.methods;
        const { getFieldDecorator } = this.props.form;

        const { icon } = editorOptions || {};
        const { text } = label || {};

        return (<Form.Item
            {...label}
            {...this.props}
            {...formItemLayout()}
            className="d-none"
            label={text}
        >
            {getFieldDecorator(dataField, {
                rules: validation(),
            })(
            <Input 
                {...editorOptions}
                type="hidden"
            >
                {icon ? <Icon type={icon.type} /> : null}
            </Input>
            )} 
        </Form.Item>);
    }
}

export default Index;