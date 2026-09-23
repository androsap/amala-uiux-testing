import React from 'react';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class CriteriaTypeCodeSelect extends React.Component {
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

    retrieveData(criteria = {}) {
        let paging = { limit: -1, page: 20 }
        let sort = {  
            criteriatypecode: "asc",
            criteria: "asc",
            active: "asc" 
        };
        let url = api.url.redemptionpromo.criteriatype.list;
        let column = [
            "criteriatypecode",
            "criteria",
            "active"
        ];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status } = response || {};
            const { responsecode } = status || {};
            if (responsecode==='0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.criteriatypecode;
                    result2['value'] = obj.criteriatypecode;
                    return result2;
                });
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

export default CriteriaTypeCodeSelect;
