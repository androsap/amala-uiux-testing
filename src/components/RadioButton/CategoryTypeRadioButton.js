import React from 'react';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Form, Radio } from 'antd';

class CategoryTypeRadioButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    retrieveData = () => {
        let paging = { limit: -1, page: 1 }
        let sort = { categorytype: 'asc' };
        let url = api.url.awardtype.categorytype;
        let criteria = {};
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.categorytype;
                    result2['value'] = obj.categorytype;
                    return result2;
                });

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item) => {
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { options } = this.state;
        return (
            <Form.Item label={this.props.labeltext}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules()
                })(
                    <Radio.Group disabled={this.props.disabled}>
                        {options.map((obj, key) => (
                            <Radio key={key} value={obj.value} onChange={this.props.onChange}>{obj.label}</Radio>
                        ))}
                    </Radio.Group>,
                )}
            </Form.Item>
        )
    }
}
export default CategoryTypeRadioButton;