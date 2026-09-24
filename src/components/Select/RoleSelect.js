import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class RoleSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    componentDidMount() {
        if (this.props.forceRender) this.retrieveData();
    };

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { rolename: 'asc' };
        let url = api.url.role.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.rolename;
                    result2['value'] = obj.rolecode;
                    return result2;
                });

                //if options deactive
                const { rolename, rolecode } = inactivefield;
                if (rolecode) {
                    options = getOptionsDeactive(actionspage, options, rolecode, rolename);
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

export default RoleSelect;