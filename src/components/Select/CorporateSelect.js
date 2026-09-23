import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class CorporateSelect extends React.Component {
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

    retrieveData(criteria = {}, fieldinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { corporatename: 'asc' };
        let url = api.url.corporate.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.corporatename;
                    result2['value'] = obj.corporatecode;
                    return result2;
                });

                //if options deactive
                const { corporatecode, corporatename } = fieldinactive;
                if (corporatecode) {
                    options = getOptionsDeactive(actionspage, options, corporatecode, corporatename);
                }

                this.setState({ options, isLoading: false });
                this.props.corporateOptions(options);
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default CorporateSelect;