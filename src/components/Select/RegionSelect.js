import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class RegionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData(criteria = {}, regioninactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { regionname: 'asc' };
        let url = api.url.region.list;
        criteria.active = true;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ isLoading: true });
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.regionname;
                    result2['value'] = obj.regioncode;
                    return result2;
                });

                //if options deactive
                const { regioncode, regionname } = regioninactive;
                if (regioncode) {
                    options = getOptionsDeactive(actionspage, options, regioncode, regionname);
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

export default RegionSelect;