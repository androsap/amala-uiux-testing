import React, { Component, createRef } from 'react';
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
            return React.cloneElement(props.children, { form })
        }

        const FormTesteCreate = Form.create()(FormTeste);
        
        return (<FormTesteCreate ref={e => this.defaultForm = e} />);
    }
}

export default DefaultForm;