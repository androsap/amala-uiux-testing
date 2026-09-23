import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class CompartmentSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    }

    componentDidMount(){
        if(this.props.forceRender){
            this.retrieveData();
        }
    }

    retrieveData(criteria = {}, inactive = {}, actionspage = 'create', filterCustom = null) {
        let paging = { limit: -1, page: 1 }
        let sort = (this.props.sort) ? this.props.sort : { compartmentcode: 'asc' };
        let url = api.url.compartment.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.compartmentname;
                    result2['value'] = obj.compartmentcode;
                    result2['rank'] = obj.rank;
                    return result2;
                });

                //if options deactive
                let { compartmentcode } = inactive;
                if (compartmentcode) {
                    options = getOptionsDeactive(actionspage, options, compartmentcode, compartmentcode);
                }

                /* Sorting */
                // if (this.props.sort) {
                //     let sorting = this.props.sort.split("_");
                //     let sortField = sorting[0];
                //     let sortBy = sorting[1];

                //     if (sortField === 'rank') {
                //         if (sortBy === 'asc') {
                //             options = options.sort((a, b) => a.rank > b.rank);
                //         } else if (sortBy === 'desc') {
                //             options = options.sort((a, b) => a.rank < b.rank);
                //         }
                //     }
                // }

                if (filterCustom) {
                    this.setState({ options: filterCustom(options), isLoading: false });
                } else {
                    this.setState({ options, isLoading: false });
                }
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default CompartmentSelect;