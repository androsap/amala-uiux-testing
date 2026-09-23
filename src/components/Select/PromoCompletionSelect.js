import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class PromoCompletion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    }

    retrieveData(criteria = {}, inactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = {  };
        let url = api.url.promocompletionbonus.list;
        criteria.status = 'active';
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                // remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.promocompletionname;
                    result2['value'] = obj.promocompletionid;
                    return result2;
                });

                //if options deactive
                let { promocompletionid, promocompletionname } = inactive;
                if (promocompletionid) {
                    options = getOptionsDeactive(actionspage, options, promocompletionid, promocompletionname);
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

export default PromoCompletion;