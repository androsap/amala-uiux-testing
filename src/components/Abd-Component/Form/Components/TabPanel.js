import React, { Component } from 'react';
import { Form } from 'antd'
import Tabpanel from '../../Tabpanel'

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
        const { label, editorOptions, className } = this.props.props;
        const { formItemLayout } = this.methods;
        const { visible } = editorOptions || {};

        const { form } = this.props;
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
            <Tabpanel {...editorOptions} form={form} isGrouping={true} />
        </Form.Item>);
    }
}

export default Index;