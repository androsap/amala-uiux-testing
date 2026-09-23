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

    componentDidMount(){
        if(this.props.forceRender){
            this.retrieveData();
        }
    }

    getCategoryType = (awardtypecode = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === awardtypecode)[0];
        result = (detailoptions && detailoptions['categorytype']) ? detailoptions['categorytype'] : null;
        return result;
    }

    getCategoryCode = (awardtypecode = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === awardtypecode)[0];
        result = (detailoptions && detailoptions['categorycode']) ? detailoptions['categorycode'] : null;
        return result;
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { awardtypename: 'asc' };
        let url = api.url.awardtype.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.awardtypename;
                    result2['value'] = obj.awardtypecode;
                    result2['categorytype'] = obj.categorytype;
                    result2['categorycode'] = obj.categorycode;
                    return result2;
                });

                //if options deactive
                const { awardtypecode, awardtypename } = inactivefield;
                if (awardtypecode) {
                    options = getOptionsDeactive(actionspage, options, awardtypecode, awardtypename);
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

export default AwardType;