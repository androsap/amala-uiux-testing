import React, { Component } from 'react';
import { Form, Checkbox, Spin } from 'antd'
import { validationRole, camelize } from '../../BaseFunction'
import BaseHelper from '../../../../helper/BaseHelper';
import TypeRequestEnum from '../../enums/TypeRequestEnum';

export class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            spinning: false
        }
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
            loading: (isLoading) => {
                this.setState((prevState) => ({
                    spinning: isLoading || !prevState.spinning
                }))
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
            refresh: () => {
                const { editorOptions } = this.props.props;
                const { callService, getOptionValue, loading } = this.methods;
                var data = [];

                if(typeof(editorOptions.dataSource) === "function"){
                    callService();
                }
                else if(typeof(editorOptions.dataSource) === "object"){
                    if(editorOptions.dataSource.store){
                        data = editorOptions.dataSource.store(this);
                    }
                    else if(editorOptions.dataSource.customeStore){
                        const { url, parameter, methods, callback } =  editorOptions.dataSource.customeStore;
                        
                        class helper extends BaseHelper {};
                        loading();
                        helper.request(methods || TypeRequestEnum.REQUEST_POST, url, parameter ? parameter() : null, (status, dt, response_message) => {
                            loading();
                            if(callback) callback({ options: this, status, dt, response_message });

                            if(status) data = dt.map(getOptionValue);

                            this.setState({
                                items: data
                            })
                        });
                    }
                    else{
                        data = editorOptions.dataSource.map(getOptionValue);
                    }
                }
                this.setState({
                    items: data
                })
            },
            positionCheckbox: () => {
                const { editorOptions } = this.props.props;
                var position = {};
                if(editorOptions.position === "vertical"){
                    position = {
                        display: 'block',
                        height: '30px',
                        lineHeight: '30px',
                        marginLeft: "8px"
                    }
                }
                return position;
            },
            setItem: (data) => {
                const { getOptionValue } = this.methods;
                this.setState({
                    items: data.map(getOptionValue)
                })
            },
            getOptionValue: (d) => {
                const { editorOptions } = this.props.props;
                const { getFieldValue } = this.methods;

                if (typeof (d) === "string") {
                    return {
                        displayExpr: d,
                        valueExpr: d,
                        data: d
                    }
                }
                else{
                    return {
                        displayExpr: typeof (editorOptions.displayExpr) !== "function" ? getFieldValue(d, editorOptions.displayExpr || "display") : editorOptions.displayExpr(d),
                        valueExpr: typeof (editorOptions.valueExpr) !== "function" ? getFieldValue(d, editorOptions.valueExpr || "value") : editorOptions.valueExpr(d),
                        data: d
                    }
                }
            },
            getFieldValue: (arr, str) => {
                const { getFieldValue } = this.methods;
                if (str.includes(".")) {
                    return getFieldValue(arr[str.substring(0, str.indexOf("."))], str.substring(str.indexOf(".") + 1))
                }
                return arr[str];
            },
            callService: () => {
                const { editorOptions } = this;
                const { setItem } = this.methods;
                editorOptions.dataSource.list((status, data) => {
                    if(status){
                        setItem(data.result)
                    }
                }, false, false);
            }
        }
    }

    componentDidMount(){
        const { refresh } = this.methods;
        refresh();
    }

    render() {
        const { label, editorOptions, className, dataField } = this.props.props;
        const { formItemLayout, validation, positionCheckbox } = this.methods;
        const { visible } = editorOptions || {};
        const { getFieldDecorator } = this.props.form;
        const { items, spinning } = this.state;

        const classNames = (className || "") + (typeof visible !== "undefined" ? (!visible ? "d-none" : "") : "");
        const { text } = label || {};
        const editorOption = () => {
            delete editorOptions.dataSource;
            delete editorOptions.displayExpr;
            delete editorOptions.valueExpr;
            return editorOptions;
        }

        delete editorOptions.visible;
        return (<Spin spinning={spinning}>
                <Form.Item
                {...label}
                {...this.props}
                {...formItemLayout()}
                className={classNames}
                label={text}
            >
                {getFieldDecorator(dataField, {
                    rules: validation(),
                })(
                    <Checkbox.Group {...editorOption()}>
                        {items.map(item => {
                            return <Checkbox
                                key={item.valueExpr}
                                value={item.valueExpr}
                                data={item.data}
                                style={positionCheckbox()}
                            >
                                {item.displayExpr}
                            </Checkbox>
                        })}
                    </Checkbox.Group>
                )} 
            </Form.Item>
        </Spin>);
    }
}

export default Index;