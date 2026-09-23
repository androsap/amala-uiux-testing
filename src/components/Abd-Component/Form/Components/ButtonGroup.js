import React, { Component } from 'react';
import { Form, Button, Icon } from 'antd'

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
            onClick: (e, btn) => {
                const { methods } = this.props;
                const { onClick } = btn;
                if(onClick) onClick(e, methods);
            }
        }
    }

    render() {
        const { label, editorOptions, className } = this.props.props;
        const { formItemLayout, onClick } = this.methods;
        const { items, visible } = editorOptions || {};

        const classNames = (className || "") + (typeof visible !== "undefined" ? (!visible ? "d-none" : "") : "");

        return (<Form.Item
            {...label}
            {...this.props}
            {...formItemLayout()}
            className={classNames}
            label={label ? label.text : ""}
        >
            {items.map((btn, index) => {
                const { className, visible, icon, text } = btn;
                const classNames = (className || "") + (typeof visible === "undefined" ? "" : (!visible ? " d-none" : ""));

                return <Button 
                    key={`button-group-${index}`}
                    {...btn}
                    visible={btn.visible ? "" : ""}
                    className={`mr-2 ${classNames}`}
                    onClick={e => onClick(e, btn)}
                >
                    {icon ? <Icon type={icon.type} /> : null}
                    {text}
                </Button>
            })
            }
        </Form.Item>);
    }
}

export default Index;