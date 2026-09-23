import React, { Component } from 'react';
import { Form, Icon, Button } from 'antd'

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
            onClick: (e) => {
                const { editorOptions } = this.props.props;
                const { onClick } = editorOptions || {};
                if(onClick) onClick(e, this.props.methods)
            }
        }
    }

    render() {
        const { label, editorOptions, className } = this.props.props;
        const { formItemLayout, onClick } = this.methods;
        const { icon, visible, text } = editorOptions || {};

        const classNames = (className || "") + (typeof visible !== "undefined" ? (!visible ? "d-none" : "") : "");

        delete editorOptions.visible;
        return (<Form.Item
            {...label}
            {...this.props}
            {...formItemLayout()}
            className={classNames}
            label={label ? label.text : ""}
        >
            <Button 
                {...editorOptions}
                onClick={onClick}
            >
                {icon ? <Icon type={icon.type} /> : null}
                { text }
            </Button>
        </Form.Item>);
    }
}

export default Index;