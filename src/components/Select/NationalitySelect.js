import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class NationalitySelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }
    
    componentDidMount() {
        if (this.props.forceRender) {
            this.retrieveData();
        }
    }

    retrieveData(criteria = {}, countryinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { nationality: 'asc' };
        let url = api.url.country.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.nationality;
                    result2['value'] = obj.nationality;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.nationality;
                    result2['value'] = obj.countrycode;
                    return result2;
                });

                //if options deactive
                const { nationality, countrycode } = countryinactive;
                if (nationality || countrycode) {
                    options = getOptionsDeactive(actionspage, options, nationality, nationality, countrycode);
                }

                this.setState({ options: this.props.custom ? options2 : options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    };

    handleResetOptions = () => {
        this.setState({ options: [] })
    };

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default NationalitySelect;