import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Select, Form, Input } from 'antd';

const InputGroup = Input.Group;
const { Option } = Select;

class RouteType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            RouteTypedisabled: true
        }
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

    retrieveData(type = null, criteria = {}, inactivefield = {}, actionspage = 'create') {
        if (type === 'REGION') {
            this.getRegionData(criteria, inactivefield, actionspage);
        } else if (type === 'COUNTRY') {
            this.getCountryData(criteria, inactivefield, actionspage);
        } else if (type === 'AIRPORT') {
            this.getAirportData(criteria, inactivefield, actionspage);
        }
    }

    getRegionData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { regionname: 'asc' };
        let url = api.url.region.list;
        criteria.active = true;
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.regionname;
                    result2['value'] = obj.regioncode;
                    return result2;
                });

                //if options deactive
                let { regioncode, regionname } = inactivefield;
                if (regioncode) options = getOptionsDeactive(actionspage, options, regioncode, regionname);

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getCountryData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { countryname: 'asc' };
        let url = api.url.country.list;
        criteria.active = true;
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.countryname;
                    result2['value'] = obj.countrycode;
                    return result2;
                });

                //if options deactive
                const { countryname, countrycode } = inactivefield;
                if (countrycode) options = getOptionsDeactive(actionspage, options, countryname, countrycode);

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getAirportData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { cityname: 'asc' };
        let url = api.url.airport.list;
        criteria.active = true;
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cityname + " (" + obj.airportiatacode + "), " + obj.airportname;
                    result2['value'] = obj.airportiatacode;
                    return result2;
                });

                //if options deactive
                let { airportiatacode, airportname, cityname } = inactivefield;
                if (airportiatacode) {
                    airportname = cityname + " (" + airportiatacode + "), " + airportname;
                    options = getOptionsDeactive(actionspage, options, airportiatacode, airportname);
                }

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    onChangeType = (value) => {
        this.props.form.setFieldsValue({ [this.props.datafield]: undefined });
        if (value === 'REGION2') {
            this.getRegionData();
        } else if (value === 'COUNTRY2') {
            this.getCountryData();
        } else if (value === 'AIRPORT2') {
            this.getAirportData();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { options } = this.state;
        return (
            <InputGroup>
                <Form.Item label={this.props.labeltext}>
                    {getFieldDecorator('RouteType', {
                        rules: this.validationRules()
                    })(
                        <Select style={{ width: '30%' }} placeholder="Type" onChange={this.onChangeType} disabled={this.props.disabled}>
                            <Option value="REGION2">Region</Option>
                            <Option value="COUNTRY2">Country</Option>
                            <Option value="AIRPORT2">Airport</Option>
                        </Select>
                    )}
                    {getFieldDecorator(this.props.datafield, {
                        rules: this.validationRules()
                    })(
                        <Select style={{ width: '70%' }} showSearch optionFilterProp="children" placeholder="Choose" onChange={this.props.onChange} disabled={this.props.disabled} allowClear={true}>
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

export default RouteType;