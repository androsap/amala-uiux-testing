import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class VendorRegionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    retrieveData = async (criteria = {}, inactivefield = {}, actionspage = 'create') => {
        let paging = { limit: -1, page: 1 }
        let sort = { };
        let url = api.url.vendor.list;
        let column = [];
        this.setState({ isLoading: true });
        await RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.vendorname;
                    result2['value'] = obj.vendorcode;
                    return result2;
                });

                //if options deactive
                const { vendorname, vendorcode } = inactivefield;
                if (vendorcode) {
                    options = getOptionsDeactive(actionspage, options, vendorcode, vendorname);
                }

                this.setState({ options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    };

    getAllOption = async (type = 'dataVendorOnly') => {
        await this.props.getAllOption(this.state.options, type);
    };

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}
export default VendorRegionSelect;