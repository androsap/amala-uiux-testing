import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class SubclassSelect extends React.Component {
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

    getCompartment = (airlinecode = null, subclasscode = null) => {
        const { options } = this.state;
        let compartmentcode = null;
        let detailoptions = options.filter(obj => obj.airlinecode === airlinecode && obj.subclasscode === subclasscode)[0];
        compartmentcode = (detailoptions && detailoptions['compartmentcode']) ? detailoptions['compartmentcode'] : null;

        return compartmentcode;
    }

    retrieveData(criteria = {}, inactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { subclasscode: 'asc' };
        let url = api.url.subclass.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.subclasscode;
                    result2['value'] = obj.subclasscode;
                    result2['airlinecode'] = obj.airlinecode;
                    result2['subclasscode'] = obj.subclasscode;
                    result2['compartmentcode'] = obj.compartmentcode;
                    return result2;
                });

                //if options deactive
                let { subclasscode } = inactive;
                if (subclasscode) {
                    options = getOptionsDeactive(actionspage, options, subclasscode, subclasscode);
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

export default SubclassSelect;