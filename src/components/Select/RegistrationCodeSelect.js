import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest, DetailRequest } from '../../utilities/RequestService';

class RegistrationCodeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    };

    componentDidMount() {
        const { forceRender, autocomplete } = this.props;

        if (forceRender && !autocomplete) this.retrieveData();
    };

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = {};
        let url = api.url.promomanage.regcode.retrieve;
        criteria.status = 'ACTIVE';
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode === '0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.registrationcode;
                    result2['value'] = obj.registrationcode;
                    return result2;
                });

                //if options deactive
                const { registrationcode } = inactivefield;
                if (registrationcode) {
                    options = getOptionsDeactive(actionspage, options, registrationcode);
                }

                this.setState({ options, isLoading: false });
            } else Alert.error(response.status.responsemessage);
        });
    };

    retrieveDetail(data = {}) {
        DetailRequest(api.url.promomanage.regcode.retrievedetail, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                var options = result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.promocode} - ${obj.registrationcode}`;
                    result2['value'] = `${obj.promocode}-${obj.registrationcode}`;
                    return result2;
                });
                this.setState({ options });

            } else Alert.error(status.responsemessage);
            this.setState({ isLoading: false });
        });
    };

    render() {
        return (<SelectBase {...this.props} mode={this.props.mode} style={this.props.style} options={this.state.options} isLoading={this.state.isLoading} />)
    };
}

export default RegistrationCodeSelect;