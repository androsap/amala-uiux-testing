import React from 'react';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Select, Form } from 'antd';
import moment from 'moment';

const { Option } = Select;

class TierRankSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            loading: false,
            tierMaxRank: null,
            optionsMileageCriteria: [],
            fieldValue: {
                minbirthdate: null,
                maxbirthdate: null
            }
        }
    }

    async retrieveData(criteria = {}, tier = null) {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let url = api.url.tierrank.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ loading: true });
        await result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.tiername;
                    result2['value'] = obj.tierid;
                    result2['rank'] = obj.rank;
                    return result2;
                }).sort((a, b) => a.rank < b.rank);

                let maxRank = Math.max.apply(Math, options.map(function (o) { return o.rank; }));
                let tierMaxRank = options.filter(obj => obj.rank === maxRank).map(obj => obj.value);
                // tier = options.filter(function (obj) { return obj.rank === max_rank; });
                // tier = (tier[0] !== undefined && tier[0]["value"] !== undefined) ? tier[0]["value"] : null;

                this.setState({ options, tierMaxRank: tierMaxRank[0], loading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    async retrieveMileageCriteria(tierid, callback) {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let criteria = { tierid, type: "UPGRADE" };
        let url = api.url.mileagecriteria.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        await result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsMileageCriteria = response.result.map(obj => {
                    var result2 = {};
                    result2['mileagecriteriaid'] = obj.mileagecriteriaid;
                    result2['minage'] = obj.minage;
                    result2['maxage'] = obj.maxage;
                    result2['effectivedate'] = obj.effectivedate;
                    result2['expireddate'] = obj.expireddate;
                    return result2;
                }).filter(obj => {
                    var today = moment(new Date());
                    var effdate = moment(new Date(obj.effectivedate));
                    var disdate = moment(new Date(obj.expireddate));
                    return effdate <= today && today <= disdate;
                });
                callback(optionsMileageCriteria);
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getDateRange = () => {
        const { minbirthdate, maxbirthdate } = this.state.fieldValue;
        let daterange = { minbirthdate, maxbirthdate };
        return daterange;
    }

    // getEligibleRank = (tier) => {
    //     let max_rank = Math.max.apply(Math, optionsTier.map(function (o) { return o.rank; }))
    //     tier = optionsTier.filter(function (obj) { return obj.rank === max_rank; });
    //     tier = (tier[0] !== undefined && tier[0]["value"] !== undefined) ? tier[0]["value"] : null;
    // }

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

    getStore() {
        return this.state;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { options, loading } = this.state;
        return (
            <Form.Item label={this.props.labeltext}>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.tierMaxRank ? this.state.tierMaxRank : this.props.defaultValue
                })(
                    <Select loading={loading} mode={this.props.mode} showSearch optionFilterProp="children" placeholder={"Choose " + this.props.labeltext.toLowerCase()} onChange={this.props.onChange} disabled={this.props.disabled} allowClear={true} getStore={() => (this.getStore())} >
                        {options.map((obj, key) => (
                            <Option key={key} value={obj.value}>{obj.label}</Option>
                        ))}
                    </Select>,
                )}
            </Form.Item>
        )
    }

}

export default TierRankSelect;