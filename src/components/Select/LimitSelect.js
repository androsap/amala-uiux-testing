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

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = {};
        let url = api.url.activitycode.limit.list;
        criteria.active = true;
        let column = [];
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode === '0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.limitcode;
                    result2['value'] = obj.limitcode;
                    return result2;
                });

                //if options deactive
                const { limitcode } = inactivefield;
                if (limitcode) {
                    options = getOptionsDeactive(actionspage, options, limitcode);
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