import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class TicketOfficeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: []
        }
    }

    componentDidMount(){
        if(this.props.forceRender){
            this.retrieveData();
        }
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { tickoffname: 'asc' };
        let url = api.url.ticketoffice.list;
        criteria.active = true;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.tickoffname;
                    result2['value'] = obj.tickoffid;
                    return result2;
                });

                var options2 = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.branchname;
                    result2['value'] = obj.branchcode;
                    return result2;
                });

                const values = options2.map(({ value }) => value);
                const filtered = options2.filter(({ value }, index) => !values.includes(value, index + 1));

                //if options deactive
                const { tickoffid, tickoffname } = inactivefield;
                if (tickoffid) {
                    options = getOptionsDeactive(actionspage, options, tickoffid, tickoffname);
                }

                this.setState({ options: this.props.branchcode ? filtered : options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getValue = (tickoffid = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === tickoffid)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default TicketOfficeSelect;