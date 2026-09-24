import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class LanguageSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }
    
    componentDidMount(){
        if(this.props.forceRender){
            this.retrieveData();
        }
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { langname: 'asc' };
        let url = api.url.language.list;
        let column = [];
        criteria.active = true;
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.langname;
                    result2['value'] = obj.langcode;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.langname} - ${obj.langcode}`;
                    result2['value'] = obj.langcode;
                    return result2;
                });

                //if options deactive
                const { langcode, langname } = inactivefield;
                if (langcode) {
                    options = getOptionsDeactive(actionspage, options, langcode, langname);
                }

                this.setState({ options: this.props.custom ? options2 : options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default LanguageSelect;