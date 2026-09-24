import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class MembershipSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    }

    componentDidMount() {
        if (this.props.forceRender) {
            this.retrieveData();
        }
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create', exclude = []) {
        let paging = { limit: -1, page: 1 }
        let sort = { membershipname: 'asc' };
        let url = api.url.membership.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.membershipname;
                    result2['value'] = obj.membershipid;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.membershipname;
                    result2['value'] = obj.membershipname;
                    return result2;
                });

                //if options deactive
                const { membershipid, membershipname } = inactivefield;
                if (membershipid, membershipname) {
                    options = getOptionsDeactive(actionspage, options, membershipid, membershipname);
                }

                if (exclude.length > 0) {
                    options = options.filter(obj => !exclude.includes(obj.value));
                }

                this.setState({ options: this.props.custom ? options2 : options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleResetOptions = () => {
        this.setState({ options: [] })
    };

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default MembershipSelect;