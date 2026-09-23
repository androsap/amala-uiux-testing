import React, { Component, createRef } from 'react';
import BaseForm from './BaseForm'
import { 
    Form
} from 'antd';

export class DefaultForm extends Component {
    constructor(props){
        super(props);
        this.form = createRef();
        this.defaultForm = createRef();
    }

    render() {
        const { props } = this;
        const FormTeste = ({ form }) => {
            return (<BaseForm ref={e => this.form = e} form={form} {...props}  />);
        }

        const FormTesteCreate = Form.create()(FormTeste);
        
        return (<FormTesteCreate className="asyst-form" ref={e => this.defaultForm = e} />);
    }
}

export default DefaultForm;