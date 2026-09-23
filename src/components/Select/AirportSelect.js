import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class AirportSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    }

    componentDidMount(){
        if(this.props.forceRender){
            this.retrieveData();
        }
    }

    retrieveData(criteria = {}, fieldinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { cityname: 'asc' };
        let url = api.url.airport.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cityname + " (" + obj.airportiatacode + "), " + obj.airportname;
                    result2['value'] = obj.airportiatacode;
                    return result2;
                });

                let { airportiatacode, cityname, airportname } = fieldinactive;
                let airportLabel = cityname + " (" + airportiatacode + "), " + airportname;
                if (airportiatacode) {
                    options = getOptionsDeactive(actionspage, options, airportiatacode, airportLabel);
                }

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

export default AirportSelect;