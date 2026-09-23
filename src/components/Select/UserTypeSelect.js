import React from 'react';
import { getOptionsDeactive, jsUcfirst } from '../../utilities/Helpers';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Select, Form, Input } from 'antd';

const InputGroup = Input.Group;
const { Option } = Select;

class UserType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            usertypedisabled: true
        }
    }

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

    retrieveData(type = null, criteria = {}, inactivefield = {}, actionspage = 'create') {
        if (type === 'BRANCH') {
            this.getTicketOfficeData(criteria, inactivefield, actionspage);
        } else if (type === 'PARTNER') {
            this.getPartnerData(criteria, inactivefield, actionspage);
        } else if (type === 'VENDOR') {
            this.getVendorData(criteria, inactivefield, actionspage);
        }
    }

    getTicketOfficeData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { branchcode: 'asc', tickoffname: 'asc' };
        let url = api.url.ticketoffice.list;
        criteria.active = true;
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.branchcode + " - " + obj.tickoffname;
                    result2['value'] = obj.branchcode + "|SPLIT|" + obj.tickoffid;
                    return result2;
                });

                //if options deactive
                let { tickoffid, tickoffname, branchcode } = inactivefield;
                if (tickoffid) {
                    tickoffid = branchcode + "|SPLIT|" + tickoffid;
                    tickoffname = branchcode + " - " + tickoffname;
                    options = getOptionsDeactive(actionspage, options, tickoffid, tickoffname);
                }

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getPartnerData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { partnername: 'asc' };
        let url = api.url.partner.list;
        criteria.active = true;
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.partnername;
                    result2['value'] = obj.partnercode;
                    return result2;
                });

                //if options deactive
                const { partnername, partnercode } = inactivefield;
                if (partnercode) {
                    options = getOptionsDeactive(actionspage, options, partnername, partnercode);
                }

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getVendorData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { vendorname: 'asc' };
        let url = api.url.vendor.list;
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                var options = result.map(({ vendorcode, vendorname }) => {
                    return {
                        label: jsUcfirst(vendorname),
                        value: vendorcode
                    };
                });

                //if options deactive
                const { vendorname, vendorcode } = inactivefield;
                if (vendorcode) {
                    options = getOptionsDeactive(actionspage, options, vendorname, vendorcode);
                }

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    onChangeType = (value) => {
        if (this.props.onChangeType !== undefined) { this.props.onChangeType(value) };
        this.props.form.setFieldsValue({ [this.props.datafield]: undefined });
        if (value === 'BRANCH') {
            this.getTicketOfficeData();
        } else if (value === 'PARTNER') {
            this.getPartnerData();
        } else if (value === 'VENDOR') {
            this.getVendorData();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { options } = this.state;
        return (
            <InputGroup>
                <Form.Item label={this.props.labeltext}>
                    {getFieldDecorator('usertypetype', {
                        rules: this.validationRules()
                    })(
                        <Select style={{ width: '30%' }} placeholder="Type" onChange={this.onChangeType} disabled={this.props.disabled}>
                            <Option value="BRANCH">Branch</Option>
                            <Option value="PARTNER">Partner</Option>
                            <Option value="VENDOR">Vendor</Option>
                        </Select>
                    )}
                    {getFieldDecorator(this.props.datafield, {
                        rules: this.validationRules()
                    })(
                        <Select style={{ width: '70%' }} showSearch optionFilterProp="children" placeholder="Please choose one" onChange={this.props.onChange} disabled={this.props.disabled} allowClear={true}>
                            {options.map((obj, key) => (
                                <Option key={key} value={obj.value}>{obj.label}</Option>
                            ))}
                        </Select>,
                    )}
                </Form.Item>
            </InputGroup>
        )
    }
}

export default UserType;