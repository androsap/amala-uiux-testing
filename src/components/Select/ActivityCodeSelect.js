import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { Alert, SelectBase } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class ActivityCodeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    componentDidMount(){
        if(this.props.customRender){
            this.retrieveData(this.props.criteria);
        }
    };

    getValue = (activitycode = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === activitycode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { activityname: 'asc' };
        let url = api.url.activitycode.list;
        criteria.active = true;
        let column = [];
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.activitycode} - ${obj.activityname}`;
                    result2['value'] = obj.activitycode;
                    result2['nonairactivitytype'] = obj.nonairactivitytype;
                    return result2;
                });

                //if options deactive
                const { activitycode, activityname } = inactivefield;
                if (activitycode) {
                    options = getOptionsDeactive(actionspage, options, activitycode, activityname);
                }

                this.setState({ options });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} />)
    }

}

export default ActivityCodeSelect;