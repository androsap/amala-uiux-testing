import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class ReligionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    retrieveData(criteria = {}, inactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { religionname: 'asc' };
        let url = api.url.religion.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.religionname;
                    result2['value'] = obj.religionid;
                    return result2;
                });

                //if options deactive
                let { religionid, religionname } = inactive;
                if (religionid) {
                    options = getOptionsDeactive(actionspage, options, religionid, religionname);
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

export default ReligionSelect;