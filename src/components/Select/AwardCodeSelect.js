import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class AwardType extends React.Component {
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

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { name: 'asc' };
        let url = api.url.awardmaster.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                var options = result.map(({ name, awardcode }) => {
                    return {
                        label: name,
                        value: awardcode
                    };
                });

                //if options deactive
                const { name, awardcode } = inactivefield;
                if (awardcode) {
                    options = getOptionsDeactive(actionspage, options, name, awardcode);
                }
                this.setState({ options, isLoading: false });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default AwardType;