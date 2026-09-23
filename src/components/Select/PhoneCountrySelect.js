import React from 'react';
import { getOptionsDeactive, getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Select, Form } from 'antd';

const { Option } = Select;

class PhoneCountrySelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            loading: false,
            defaultValue: null
        }
    }

    addCountryInactive = (countryname, countrycode) => {
        if (countrycode) {
            let countryinactive = { countryname, countrycode };
            this.retrieveData({}, countryinactive);
        }
    }

    componentDidMount() {
        /* SET DEFAULT FIELD PHONE CODE */
        const callback = (defaultValue) => {
            this.setState({ defaultValue });
        }
        getGeneralConfig(general_config.default_phonecode, callback);
    }

    retrieveData(criteria = {}, countryinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { countryname: 'asc' };
        let url = api.url.country.list;
        criteria.active = true;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ loading: true });
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.countryphonecode + ' (' + obj.countryname + ')';
                    result2['value'] = obj.countryphonecode;
                    return result2;
                });

                //if options deactive
                const { countryphonecode, countryname } = countryinactive;
                let countrylabel = countryphonecode + ' (' + countryname + ')';
                if (countryphonecode) {
                    options = getOptionsDeactive(actionspage, options, countryphonecode, countrylabel);
                }

                this.setState({ options, loading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    validationRules = () => {
        let validation = [];
        let fieldlabel = this.props.placeholder ? this.props.placeholder : this.props.labeltext ? this.props.labeltext : 'Field';
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${fieldlabel} is Required` })
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
        const { options, loading, defaultValue } = this.state;
        let labelPosition = (this.props.labelCol && this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        return (
            <Form.Item label={this.props.labeltext} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.defaultValue ? this.props.defaultValue : defaultValue
                })(
                    <Select loading={loading} showSearch optionFilterProp="children" placeholder="Country Code" onChange={this.props.onChange} allowClear={true} disabled={this.props.disabled}>
                        {options.map((obj, key) => (
                            <Option key={key} value={obj.value}>{obj.label}</Option>
                        ))}
                    </Select>,
                )}
            </Form.Item>
        )
    }

}

export default PhoneCountrySelect;