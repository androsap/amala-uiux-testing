import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class App extends React.Component {
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

    retrieveData(inactivefield = {}, actionspage = 'create') {
        let url = api.url.partner.list;
        let criteria = { active: true };
        let sort = { partnername: 'asc' };
        let paging = { limit: -1, page: 1 };
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                var options = response.result.map(({ partnername, partnercode }) => {
                    return {
                        label: `${partnername} ( ${partnercode} )`,
                        value: partnercode
                    };
                });

                //if options deactive
                const { partnercode, partnername } = inactivefield;
                if (partnercode) {
                    options = getOptionsDeactive(actionspage, options, partnercode, partnername);
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

export default App;
