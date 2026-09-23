import React, { Component } from 'react'
import Tables from '../../Tables'
import { Form } from 'antd'

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
            callbackTable: ({ options, status, data }) => {
                if(status){
                    const { form } = this.props;
                    const { dataField } = this.props.props;
                    const { result } = data || {};
                    form.setFieldsValue({
                        [dataField]: result || []
                    })
                }
            }
        }
    }

    render() {
        const { label, editorOptions, className, dataField } = this.props.props;
        const { formItemLayout, callbackTable } = this.methods;
        const { visible } = editorOptions || {};
        const { getFieldDecorator } = this.props.form;

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
            {dataField 
            ? getFieldDecorator(dataField, {})(<Tables caseback={callbackTable} {...editorOptions} />) 
            : <Tables isGrouping={true} caseback={callbackTable} {...editorOptions} />} 
        </Form.Item>);
    }
}

export default Index;