import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class PrintingVendorSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { createdDate: 'desc' };
        let url = api.url.printingvendor.retrieve;
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                //remapping for base option select2
                var options = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.vendorname;
                    result2['value'] = obj.vendorcode;
                    return result2;
                });

                const { vendorname, vendorcode } = inactivefield;
                if (vendorcode) {
                    options = getOptionsDeactive(actionspage, options, vendorcode, vendorname);
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

export default PrintingVendorSelect;