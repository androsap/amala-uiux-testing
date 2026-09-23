import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class StateSelect extends React.Component {
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

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { statename: 'asc' };
        let url = api.url.state.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true, options: [] });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.statename;
                    result2['value'] = obj.statecode;
                    return result2;
                });

                //if options deactive
                const { statename, statecode } = inactivefield;
                if (statecode) {
                    options = getOptionsDeactive(actionspage, options, statecode, statename);
                }
                
                this.setState({ options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getValue = (statecode = null, field = null) => {
        const { options } = this.state;
        
        let result = null;
        let detailoptions = options.filter(obj => obj.value === statecode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;

        return result;
    }

    render() {
        return (<SelectBase {...this.props} style={this.props.style} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default StateSelect;