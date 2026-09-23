import React, { Component } from 'react';
import { Form, Switch } from 'antd'

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
            }
        }
    }

    render() {
        const { label, editorOptions, className, dataField } = this.props.props;
        const { formItemLayout } = this.methods;
        const { getFieldDecorator } = this.props.form;
        const { visible } = editorOptions || {};

        const classNames = (className || "") + (typeof visible !== "undefined" ? (!visible ? "d-none" : "") : "");
        const { textChecked, textUnchecked } = editorOptions || {};
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
                valuePropName: 'checked'
            })(
            <Switch 
                {...editorOptions}
                checkedChildren={textChecked}
                unCheckedChildren={textUnchecked}
            />
            )} 
        </Form.Item>);
    }
}

export default Index;