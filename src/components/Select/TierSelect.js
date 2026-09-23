import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class TierSelect extends React.Component {
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

    retrieveDataWithRank(criteria = {}, inactivefield = {}, actionspage = 'create', type = null, currentrank = null) {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let url = api.url.tier.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ isLoading: true });
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                let dataList = response.result.map((obj, key) => { return ({ ...obj }) });

                RetrieveRequest(api.url.tierrank.list, criteria, paging, column, sort).then((response) => {
                    dataList.forEach(a => {
                        response.result.forEach(b => {
                            if (a.tierid === b.tierid) { a.rank = b.rank }
                        });
                    });

                    //remapping for base option select2
                    var options = dataList.map(obj => {
                        var result2 = {};
                        result2['label'] = obj.tiername;
                        result2['value'] = obj.tierid;
                        result2['rank'] = obj.rank;
                        return result2;
                    });

                    //if options deactive
                    const { tierid, tiername } = inactivefield;
                    if (tierid) {
                        options = getOptionsDeactive(actionspage, options, tierid, tiername);
                    }

                    if (type === 'UPGRADE') {
                        options = options.filter(obj => obj.rank < currentrank);
                    } else if (type === 'DOWNGRADE') {
                        options = options.filter(obj => obj.rank > currentrank);
                    }

                    options.sort((a, b) => a.rank < b.rank);
                    this.setState({ options, isLoading: false });
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let url = api.url.tier.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ isLoading: true });
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.tiername;
                    result2['value'] = obj.tierid;
                    return result2;
                });

                //if options deactive
                const { tierid, tiername } = inactivefield;
                if (tierid) {
                    options = getOptionsDeactive(actionspage, options, tierid, tiername);
                }

                this.setState({ options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    retrieveWithMembership(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let url = api.url.tier.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ isLoading: true });
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.membershipname + ' - ' + obj.tiername;
                    result2['value'] = obj.tierid;
                    return result2;
                });

                //if options deactive
                const { tierid, tiername } = inactivefield;
                if (tierid) {
                    options = getOptionsDeactive(actionspage, options, tierid, tiername);
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

export default TierSelect;