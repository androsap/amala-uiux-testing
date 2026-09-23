import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class SalutationSelect extends React.Component {
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

    getGender = (salutationcode = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === salutationcode)[0];
        result = (detailoptions && detailoptions['gender']) ? detailoptions['gender'] : null;
        return result;
    }

    getLanguage = (salutationcode = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === salutationcode)[0];
        result = (detailoptions && detailoptions['langcode']) ? detailoptions['langcode'] : null;
        return result;
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { salutationname: 'asc' };
        let url = api.url.salutation.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.salutationname;
                    result2['value'] = obj.salutationcode;
                    result2['gender'] = obj.gender;
                    result2['langcode'] = obj.langcode;
                    return result2;
                });

                //if options deactive
                const { salutationcode, salutationname } = inactivefield;
                if (salutationcode) {
                    options = getOptionsDeactive(actionspage, options, salutationcode, salutationname);
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

export default SalutationSelect;