import React from 'react';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import moment from 'moment';

class CityPairOdRuleSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    retrieveData(criteria = {}) {
        let url = api.url.accrualruleod.list;
        criteria = { ...criteria, active: true };
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, { page: 1, limit: -1 }, [], {}, { currentdate: moment().format('YYYY-MM-DD') }).then((response) => {
            if (response.status.responsecode === '0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.originairport} - ${obj.destinationairport}`;
                    result2['value'] = `${obj.airlinecode}${obj.originairport}${obj.destinationairport}`;
                    return result2;
                });

                const values = options.map(({ value }) => value);
                const filtered = options.filter(({ value }, index) => !values.includes(value, index + 1));

                this.setState({ options: filtered, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} disabled={(this.state.options.length === 0) ? true : this.props.disabled} />)
    }

}

export default CityPairOdRuleSelect;