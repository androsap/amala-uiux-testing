import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class LegendSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { module: 'asc' };
        let url = api.url.userlog.legendlist;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2

                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.module;
                    result2['value'] = obj.module;
                    return result2;
                });

                let uniqueModule = options.filter((obj, index, self) =>
                    index === self.findIndex((o) => (
                        o.label=== obj.label && o.value=== obj.value
                    ))
                );

                //if options deactive
                const { module } = inactivefield;
                if (module) {
                    options = getOptionsDeactive(actionspage, uniqueModule, module);
                }

                this.setState({ options: uniqueModule, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default LegendSelect;
