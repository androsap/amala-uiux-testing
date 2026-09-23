import React, { Component } from 'react';
import { Modal } from 'antd'
import BaseForm from '../Form';

const uuidv1 = require('uuid/v1');

export class Index extends Component {
    constructor(props){
        super(props)
        this.state ={
            components: [],
            configForm: {},
            key: uuidv1(),
            keyForm: uuidv1(),
            visible: false,
            editorOptions: {}
        }
        this.methods = {
            hide: () => {
                const { editorOptions } = this.state;
                this.setState({
                    visible: false,
                })
                setTimeout(() => {
                    const { form } = this.refs;
                    if(editorOptions.onClose) editorOptions.onClose({ options: this, form: form });
                }, 20)
            },
            show: (config) => {
                this.setState({
                    visible: true,
                    key: uuidv1(),
                    editorOptions: config
                })

                setTimeout(() => {
                    if(config.contentTemplate){
                        const { form } = this.refs;
                        this.setState({ 
                            configForm: config.contentTemplate({ options: this, form: form })
                        });
                    }
                }, 20)
            }
        }
    }

    show = (config) => this.methods.show(config)
    hide = () => this.methods.hide()
    form = this.refs.form;

    render() {
        const { hide } = this.methods;
        const { visible, key, configForm, keyForm, editorOptions } = this.state;
        return (<Modal
            key={key}
            visible={visible}
            maskClosable={false}
            footer={null}
            {...editorOptions}
            destroyOnClose
            onCancel={hide}
        >
            <BaseForm ref="form" {...configForm} key={keyForm} />
        </Modal>);
    }
}

export default Index;