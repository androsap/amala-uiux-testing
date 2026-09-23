import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class CountrySelect extends React.Component {
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

    retrieveData(criteria = {}, countryinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { countryname: 'asc' };
        let url = api.url.country.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.countryname + ' (' + obj.countryphonecode + ')';
                    result2['value'] = obj.countrycode;
                    return result2;
                });

                //if options deactive
                const { countryphonecode, countryname, countrycode } = countryinactive;
                let countrylabel = countryname + ' (' + countryphonecode + ')';
                if (countrycode) {
                    options = getOptionsDeactive(actionspage, options, countrycode, countrylabel);
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

export default CountrySelect;