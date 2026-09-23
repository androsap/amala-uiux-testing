import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class AirlineSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    componentDidMount(){
        if(this.props.customRender){
            this.retrieveData(this.props.criteria);
        } else if(this.props.forceRender){
            this.retrieveData();
        }
    }

    getValue = (airlinecode = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === airlinecode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    retrieveData(criteria = {}, fieldinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { airlinename: 'asc' };
        let url = api.url.airline.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.airlinename;
                    result2['value'] = obj.airlinecode;
                    result2['alliancetype'] = obj.alliancetype;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.airlinename} - ${obj.airlinecode}`;
                    result2['value'] = obj.airlinecode;
                    result2['alliancetype'] = obj.alliancetype;
                    return result2;
                });

                //if options deactive
                const { airlinecode, airlinename } = fieldinactive;
                if (airlinecode) {
                    options = getOptionsDeactive(actionspage, options, airlinecode, airlinename);
                }

                this.setState({ options: this.props.custom ? options2 : options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default AirlineSelect;