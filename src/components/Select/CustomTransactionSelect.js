import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { jsUcfirst } from '../../utilities/Helpers';

class CustomTransaction extends React.Component {
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

    retrieveData(criteria = {}, inactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { customtrxname: 'asc' };
        let url = api.url.customtransaction.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status = {} } = response;
            if (status.responsecode === '0000') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = this.props.custom === undefined ? obj.customtrxname : `${obj.customtrxname} ${obj.validfortransfer ? `(${jsUcfirst(obj.periodmiles, "_")})` : ''}`;
                    result2['value'] = obj.customtrxcode;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = `${obj.customtrxcode} - ${obj.customtrxname}`;
                    result2['value'] = obj.customtrxcode;
                    return result2;
                });

                //if options deactive
                let { customtrxcode, customtrxname } = inactive;
                if (customtrxcode) {
                    options = getOptionsDeactive(actionspage, options, customtrxcode, customtrxname);
                }

                this.setState({ options: this.props.customtrx ? options2 : options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default CustomTransaction;