import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class PromoCodeSelect extends React.Component {
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

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = {};
        let url = api.url.promomanage.retrieve;
        criteria.needregister = true;
        criteria.status = 'ACTIVE';
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode === '0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = (this.props.usevalueaslabel) ? obj.promocode : obj.name;
                    result2['value'] = obj.promocode;
                    return result2;
                });

                //if options deactive
                const { promocode, name } = inactivefield;
                if (promocode) {
                    options = getOptionsDeactive(actionspage, options, promocode, name);
                }

                this.setState({ options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    retrieveDataActivity(criteria = {}, inactivefield = {}, actionspage = 'create', data = {}) {
        let paging = { limit: -1, page: 1 }
        let sort = {};
        let url = api.url.promomanage.retrieve;
        criteria.status = 'ACTIVE';
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort, data).then((response) => {
            if (response.status.responsecode === '0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.promocode;
                    result2['value'] = obj.promocode;
                    result2['startdate'] = obj.startdate;
                    result2['enddate'] = obj.enddate;
                    return result2;
                });

                //if options deactive
                const { promocode, name } = inactivefield;
                if (promocode) {
                    options = getOptionsDeactive(actionspage, options, promocode, name);
                }
                this.setState({ options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleResetOptions = () => {
        this.setState({options: []})
    };

    getValue = (promocode = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === promocode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    };

    render() {
        return (<SelectBase {...this.props} mode={this.props.mode} style={this.props.style} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default PromoCodeSelect;