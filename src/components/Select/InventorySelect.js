import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class InventorySelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { createdDate: 'desc' };
        let url = api.url.inventorysys.list;
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                var options = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.inventoryname;
                    result2['value'] = obj.inventorycode;
                    return result2;
                });

                const { inventoryname, inventorycode } = inactivefield;
                if (inventorycode) {
                    options = getOptionsDeactive(actionspage, options, inventorycode, inventoryname);
                }

                this.setState({ options, isLoading: false });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default InventorySelect;