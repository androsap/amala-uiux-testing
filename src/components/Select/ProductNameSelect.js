import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { DetailRequest, RetrieveRequest } from '../../utilities/RequestService';

class ProductNameSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    getValue = (mailingproductcode = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === mailingproductcode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { mailingproductname: 'asc' };
        let url = api.url.mailingproduct.getcatalog;
        let column = [];
        this.setState({ isLoading: true, options: [] });
        DetailRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.mailingproductname;
                    result2['value'] = obj.mailingproductcode;
                    result2['inventorycode'] = obj.inventorycode;
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

    retrieveData2(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { mailingproductname: 'asc' };
        let url = api.url.mailingproduct.list;
        let column = [];
        this.setState({ isLoading: true, options: [] });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.mailingproductname;
                    result2['value'] = obj.mailingproductcode;
                    result2['inventorycode'] = obj.inventorycode;
                    return result2;
                });

                //if options deactive
                const { mailingproductname, mailingproductcode } = inactivefield;
                if (mailingproductcode) {
                    options = getOptionsDeactive(actionspage, options, mailingproductcode, mailingproductname);
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

export default ProductNameSelect;