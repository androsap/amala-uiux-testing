import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class BranchSelect extends React.Component {
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
        let sort = { branchname: 'asc' };
        let url = api.url.branch.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.branchname;
                    result2['value'] = obj.branchcode;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.branchcode} - ${obj.branchname}`;
                    result2['value'] = obj.branchcode;
                    return result2;
                });

                //if options deactive
                const { branchcode, branchname } = inactivefield;
                if (branchcode) {
                    options = getOptionsDeactive(actionspage, options, branchcode, branchname);
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

    getValue = (branchcode = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === branchcode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default BranchSelect;