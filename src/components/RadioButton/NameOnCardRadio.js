import React from 'react';
import { Form, Radio } from 'antd';
import { InputText } from '../Base/BaseComponent';

class RadioButton extends React.Component {
    state = {
        value: null,
        optionsNameOnCard: [],
        customnameoncard: null
    };

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${this.props.labeltext} is Required` })
                            break;
                        default:
                    }
                }
                else if (typeof (item) === "function") {
                    validation.push({
                        validator: item
                    })
                }
            })
        }

        return validation;
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    generateNameOnCard = (firstname, lastname = '', customnameoncard = null) => {
        let optionsNameOnCard = [];

        let firstnameSeparate = firstname.split(" ");
        let lastnameSeparate = lastname.split(" ");

        let firstnameShort = [];
        let firstnamelength = firstname.split(" ").length;
        for (var i = 0; i < firstnamelength; i++) {
            firstnameShort[i] = firstnameSeparate[i].slice(0, 1);
        }

        let lastnameShort = [];
        let lastnamelength = lastname.split(" ").length;
        for (var j = 0; j < lastnamelength; j++) {
            lastnameShort[j] = lastnameSeparate[j].slice(0, 1);
        }

        if (firstname || lastname) {
            //options 1
            optionsNameOnCard[0] = firstname + " " + lastname;
            optionsNameOnCard[0] = optionsNameOnCard[0].substr(0, 24);
            //options 2
            optionsNameOnCard[1] = firstnameShort.join(" ") + " " + lastname;
            optionsNameOnCard[1] = optionsNameOnCard[1].substr(0, 24);
            //options 3
            optionsNameOnCard[2] = firstname + " " + lastnameShort.join(" ");
            if (optionsNameOnCard[2].length > 24) {
                firstname = firstname.substr(0, 22);
                optionsNameOnCard[2] = firstname + " " + lastnameShort.join(" ");
            }
            //options 4
            optionsNameOnCard[3] = (lastname) ? lastname + " " + firstname : firstname;
        }
        // else {
        //     optionsNameOnCard[0] = (firstname) ? firstname : lastname;
        // }
        optionsNameOnCard = optionsNameOnCard.map((value) => { return { label: value, value } });

        if (customnameoncard) {
            let check = optionsNameOnCard.filter(obj => obj.value === customnameoncard);
            if (check.length === 0) {
                this.props.form.setFieldsValue({ [this.props.datafield]: 'customnameoncard', customnameoncard });
                this.setState({ value: 'customnameoncard' });
            }
        }

        this.setState({ optionsNameOnCard });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const radioStyle = { display: 'block', height: '30px', lineHeight: '30px' };

        const { optionsNameOnCard } = this.state;
        return (
            <Form.Item label={this.props.labeltext} className={this.props.className}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules()
                })(
                    <Radio.Group onChange={this.onChange} disabled={this.props.disabled}>
                        {
                            optionsNameOnCard.map((obj, key) => (
                                <Radio style={radioStyle} key={key} value={obj.value}>{obj.label}</Radio>
                            ))
                        }
                        <Radio style={radioStyle} value="customnameoncard">
                            More...
                        </Radio>
                        <InputText form={this.props.form} className={(this.state.value === 'customnameoncard') ? '' : 'hidden'} datafield="customnameoncard" validationrules={(this.state.value === 'customnameoncard') ? ['required', 'pattern.letterspace'] : []} maxLength={255} />
                    </Radio.Group>,
                )}
            </Form.Item>
        )
    }
}
export default RadioButton;
