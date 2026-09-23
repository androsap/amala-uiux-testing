import React from 'react';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';

class CodeshareByAirline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    }

    retrieveData(data = {}) {
        let url = api.url.codeshare.getcodesharebyairline;
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                var options = response.result;

                /* Criteria condition*/
                let criteria = this.props.criteria;
                if (Object.keys(criteria).length > 0) {
                    options = options.filter(function (item) {
                        for (var key in criteria) {
                            if (item[key] === undefined || item[key] !== criteria[key])
                                return false;
                        }
                        return true;
                    });
                }

                //remapping for base option select2
                options = options.map(obj => {
                    var result2 = {};
                    if (obj.routetype === 'ALLROUTE') {
                        result2['label'] = `${obj.marketingairline}${(obj.marketingfltnum) ? ` ${obj.marketingfltnum}` : ''}*/${obj.operatingairline}${(obj.operatingfltnum) ? ` ${obj.operatingfltnum}` : ''} (All Route)`;
                        result2['value'] = obj.codeshareid;
                        result2['routetype'] = 'ALLROUTE';
                        result2['marketingairline'] = obj.marketingairline;
                        result2['operatingairline'] = obj.operatingairline;
                    } else if (obj.routetype === 'SPECIFICROUTE') {
                        result2['label'] = `${obj.marketingairline}${(obj.marketingfltnum) ? ` ${obj.marketingfltnum}` : ''}*/${obj.operatingairline}${(obj.operatingfltnum) ? ` ${obj.operatingfltnum}` : ''} (${obj.originairport.airportiatacode} - ${obj.destinationairport.airportiatacode})`;
                        result2['value'] = obj.codeshareid;
                        result2['routetype'] = 'SPECIFICROUTE';
                        result2['marketingairline'] = obj.marketingairline;
                        result2['operatingairline'] = obj.operatingairline;
                        result2['originairportiatacode'] = obj.originairport.airportiatacode;
                        result2['destinationairportiatacode'] = obj.destinationairport.airportiatacode;
                    }
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

export default CodeshareByAirline;