import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class ReceiptCatalogueSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData(criteria = {}, inactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { receipttypename: 'asc' };
        let url = api.url.receiptcatalogue.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.receipttypename;
                    result2['value'] = obj.receipttypeid;

                    if (this.props.valueFrom) {
                        if (obj.receipttypename === 'BUY AWARD MILES') {
                            result2['label'] = 'Buy Mileage'
                        } else if (obj.receipttypename === 'BUY EXPIRED MILEAGE') {
                            result2['label'] = 'Buy to Extend Mileage'
                        };
                        result2['value'] = obj[this.props.valueFrom];
                    }
                    return result2;
                });

                //if options deactive
                let { receipttypeid, receipttypename } = inactive;
                if (receipttypeid) {
                    options = getOptionsDeactive(actionspage, options, receipttypeid, receipttypename);
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

export default ReceiptCatalogueSelect;