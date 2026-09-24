import React from 'react';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Select, Form } from 'antd';

const { Option } = Select;

class NomineeCardNumberSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false,
            data: []
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    onChange = (value) => {
        let { data } = this.state;
        if (value) data = data.find(x => x.cardnumber === value);

        this.props.onChange(value, value ? data : null, this.props.indexRow)
    }

    retrieveData = (visible) => {
        let { options } = this.state;
        const { form, indexRow, adultpassenger } = this.props;
        const data = form.getFieldsValue();
        if (visible) {
            let url = api.url.memberredemptionnominee.list;
            let criteria = {
                memberid: this.props.memberID,
                active: true
            }
            this.setState({ isLoading: true });
            RetrieveRequest(url, criteria, {}, [], {}, {}).then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    this.setState({
                        data: response.result
                    });

                    let dataSource = []
                    for (let index = 0; index < adultpassenger; index++) {
                        if (index !== indexRow && data[`passenger-memberid${index}`]) dataSource.push(data[`passenger-memberid${index}`])
                    }


                    var options = response.result.map(({ cardnumber, firstname, lastname }) => {
                        return {
                            label: `${cardnumber} (${firstname}${(lastname) ? ` ${lastname}` : ''})`,
                            value: cardnumber
                        };
                    });
                    this.setState({ options: options.filter(x => !dataSource.includes(x.value)), isLoading: false })
                } else Alert.error(response.status.responsemessage);
            });
        }
    }

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                let label = this.props.labeltext ? this.props.labeltext : (this.props.placeholder) ? this.props.placeholder : 'Field';
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${label} is Required` })
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

    render() {
        const { getFieldDecorator } = this.props.form;
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition} style={this.props.style}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.defaultValue
                })(
                    <Select showSearch mode={this.props.mode} loading={this.props.isLoading} optionFilterProp="children" placeholder={"Choose " + (this.props.labeltext || this.props.placeholder)} onChange={this.onChange} allowClear={true} disabled={this.props.disabled} onDropdownVisibleChange={this.retrieveData}>
                        {this.state.options.map((obj, key) => (
                            <Option key={key} value={obj.value} title={obj.label}>{obj.label}</Option>
                        ))}
                    </Select>,
                )}
            </Form.Item>
        )
    }

}

export default NomineeCardNumberSelect;
