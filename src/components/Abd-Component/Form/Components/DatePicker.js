import React, { Component } from 'react';
import { Form, DatePicker } from 'antd'
import { validationRole, camelize } from '../../BaseFunction'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

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
            },
            renderElement: () => {
                const { editorOptions } = this.props.props;
                const { onChange } = this.methods; 
                const { type, format, style } = editorOptions || {};
                const { display } = format || {};
                const styles = Object.assign(style || {}, {width: "100%"});
                let ComponentDate = DatePicker;
                switch(type){
                    case "month":
                        ComponentDate = MonthPicker;
                        break;
                    case "range":
                        ComponentDate = RangePicker;
                        break;
                    case "week":
                        ComponentDate = WeekPicker;
                        break;
                    default:
                        ComponentDate = DatePicker;
                        break;
                }
                return <ComponentDate {...editorOptions} style={styles} format={display || "DD MMM YYYY"} onChange={onChange} />
            }
        }
    }

    render() {
        const { label, className, dataField, editorOptions } = this.props.props;
        const { formItemLayout, validation, renderElement } = this.methods;
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
                renderElement()
            )} 
        </Form.Item>);
    }
}

export default Index;