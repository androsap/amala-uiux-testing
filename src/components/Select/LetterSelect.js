import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class LetterSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { createdDate: 'desc' };
        let url = api.url.letter.retrieve;
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                var options = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.lettername;
                    result2['value'] = obj.lettercode;
                    return result2;
                });

                const { lettername, lettercode } = inactivefield;
                if (lettercode) {
                    options = getOptionsDeactive(actionspage, options, lettercode, lettername);
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

export default LetterSelect;