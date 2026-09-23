import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class CobrandSelect extends React.Component {
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

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { cobrandname: 'asc' };
        let url = api.url.partnercobrand.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cobrandname;
                    result2['value'] = obj.cobrandcode;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.cobrandname} - ${obj.cobrandcode}`;
                    result2['value'] = obj.cobrandcode;
                    return result2;
                });

                var options3 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.partnername} - ${obj.partnercode}`;
                    result2['value'] = obj.partnercode;
                    return result2;
                });

                let uniqueModule = options3.filter((obj, index, self) =>
                    index === self.findIndex((o) => (
                        o.label=== obj.label && o.value=== obj.value
                    ))
                );

                //if options deactive
                const { cobrandcode, cobrandname, partnercode, partnername } = inactivefield;
                if (cobrandcode || partnercode) {
                    options = getOptionsDeactive(actionspage, options, cobrandcode, cobrandname, partnercode, partnername);
                }

                this.setState({ options: this.props.custom ? options2 : this.props.partner ? uniqueModule : options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default CobrandSelect;