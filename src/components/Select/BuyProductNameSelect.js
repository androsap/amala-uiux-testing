import React from 'react';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import { Select, Form, Input } from 'antd';

const InputGroup = Input.Group;
const { Option } = Select;

class BuyProductNameSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingproductcode: null,
            optionsProduct: [],
            optionsVariant: [],
            allVendorData: [],
            usertypedisabled: true
        }
    }

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                if (typeof (item) === 'string') {
                    let valType = item.split('.');
                    switch (valType[0]) {
                        case 'required':
                            validation.push({ required: true, message: `${this.props.labeltext} is Required` })
                            break;
                        default:
                    }
                }
                else if (typeof (item) === 'function') {
                    validation.push({
                        validator: item
                    })
                }
            })
        }
        return validation;
    };

    getProductMailing = async (data = {}) => {
        let url = api.url.mailingproduct.getcatalog;
        await DetailRequest(url, data).then((response) => {
            if (response.status.responsecode === '0000') {
                var optionsProduct = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.mailingproductname;
                    result2['value'] = obj.mailingproductcode;
                    result2['inventorycode'] = obj.inventorycode;
                    result2['lettername'] = obj.lettercode;
                    return result2;
                });
                this.setState({ optionsProduct });
            } else Alert.error(response.status.responsemessage);
        });
    };

    onChangeProduct = async (mailingproductcode, codeinventory) => {
        const { optionsProduct } = this.state;
        const inventorycode = (optionsProduct.find(val => val.value === mailingproductcode)) ? optionsProduct.find(val => val.value === mailingproductcode).inventorycode : (codeinventory) ? codeinventory : undefined;
        const lettername = (optionsProduct.find(val => val.value === mailingproductcode)) ? optionsProduct.find(val => val.value === mailingproductcode).lettername : undefined;

        this.props.form.resetFields([this.props.datafield[1]]);
        if (this.props.onChangeProduct) await this.props.onChangeProduct(mailingproductcode, 'productmailing', lettername);

        await DetailRequest(api.url.inventorysys.detail, { inventorycode }).then((response) => {
            if (response.status.responsecode === '0000') {
                var optionsVariant = response.result.variants.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.inventoryvariantname;
                    result2['value'] = obj.inventoryvariantid;
                    return result2;
                });
                if (this.props.onChangeProduct) this.props.onChangeProduct(response.result, 'datavariant');
                this.setState({ optionsVariant, mailingproductcode, allVendorData: response.result });

            } else Alert.error(response.status.responsemessage);
        });
    };

    onChangeVariant = (inventoryvariantid) => {
        if (this.props.onChangeVariant) {
            this.props.onChangeVariant(inventoryvariantid, 'inventoryvariantid')
        };
    };

    resetVariant = () => {
        this.setState({ optionsVariant: [] });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { mailingproductcode, optionsVariant, optionsProduct } = this.state;

        const variantfielddisabled = (this.props.disabled) ? this.props.disabled : ((!mailingproductcode) ? true : (optionsVariant.length === 0) ? true : false);
        return (
            <InputGroup>
                <Form.Item label={this.props.labeltext}>
                    {getFieldDecorator(this.props.datafield[0], {
                        rules: this.validationRules()
                    })(
                        <Select style={{ width: '45%', marginRight: '2%' }} placeholder='Choose Product' onChange={this.onChangeProduct} disabled={this.props.disabled}>
                            {optionsProduct.map((obj, key) => (
                                <Option key={key} value={obj.value}>{obj.label}</Option>
                            ))}
                        </Select>
                    )}
                    {getFieldDecorator(this.props.datafield[1], {
                        rules: this.validationRules()
                    })(
                        <Select style={{ width: '53%' }} showSearch optionFilterProp='children' placeholder='Variant' onChange={this.onChangeVariant} disabled={variantfielddisabled} allowClear={true}>
                            {optionsVariant.map((obj, key) => (
                                <Option key={key} value={obj.value}>{obj.label}</Option>
                            ))}
                        </Select>,
                    )}
                </Form.Item>
            </InputGroup>
        )
    }
}

export default BuyProductNameSelect;