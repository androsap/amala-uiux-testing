import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';

class InventoryVariantSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    getValue = (inventoryvariantid = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === inventoryvariantid)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { inventoryvariantname: 'asc' };
        let url = api.url.inventorysys.detail;
        let column = [];
        this.setState({ isLoading: true, options: [] });
        DetailRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.variants.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.inventoryvariantname;
                    result2['value'] = obj.inventoryvariantid;
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

    render() {
        return (<SelectBase {...this.props} style={this.props.style} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default InventoryVariantSelect;