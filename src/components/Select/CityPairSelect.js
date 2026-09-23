import React from 'react';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';

class CityPairSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    retrieveData(data = {}) {
        let url = api.url.accrualruleod.getcitypairlist;
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.originairport + " - " + obj.destinationairport;
                    result2['value'] = obj.odruleid;
                    return result2;
                });

                this.setState({ options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default CityPairSelect;