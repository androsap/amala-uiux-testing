import React from 'react';
// import { getOptionsDeactive } from '../../utilities/Helpers';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { CascenderBase } from '../Base/BaseComponent';

class TierCascender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    retrieveData(criteria = {}, regioninactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let url = api.url.tier.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                let result = response.result;
                let optionsFinal = [];
                for (const field in result) {
                    if (optionsFinal[result[field]['membershiptypeid']] === undefined) { optionsFinal[result[field]['membershiptypeid']] = {}; }
                    optionsFinal[result[field]['membershiptypeid']]['label'] = result[field]['membershiptypename'];
                    optionsFinal[result[field]['membershiptypeid']]['value'] = result[field]['membershiptypeid'];

                    if (optionsFinal[result[field]['membershiptypeid']]['children'] === undefined) { optionsFinal[result[field]['membershiptypeid']]['children'] = []; }
                    if (optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']] === undefined) { optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']] = [] }
                    optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['label'] = result[field]['membershipname'];
                    optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['value'] = result[field]['membershipid'];

                    if (optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['children'] === undefined) { optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['children'] = []; }
                    if (optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['children'][result[field]['tierid']] === undefined) { optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['children'][result[field]['tierid']] = []; }
                    optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['children'][result[field]['tierid']]['label'] = result[field]['tiername'];
                    optionsFinal[result[field]['membershiptypeid']]['children'][result[field]['membershipid']]['children'][result[field]['tierid']]['value'] = result[field]['tierid'];
                }

                let final = [];
                var key = 0;
                var key2 = 0;
                var key3 = 0;
                for (const field in optionsFinal) {
                    final[key] = {};
                    final[key]['label'] = optionsFinal[field]['label'];
                    final[key]['value'] = optionsFinal[field]['value'];
                    final[key]['children'] = [];

                    key2 = 0;
                    for (const field2 in optionsFinal[field]['children']) {
                        final[key]['children'][key2] = {};
                        final[key]['children'][key2]['label'] = optionsFinal[field]['children'][field2]['label'];
                        final[key]['children'][key2]['value'] = optionsFinal[field]['children'][field2]['value'];
                        final[key]['children'][key2]['children']= [];

                        key3 = 0;
                        for(const field3 in optionsFinal[field]['children'][field2]['children']){
                            final[key]['children'][key2]['children'][key3] = {};
                            final[key]['children'][key2]['children'][key3]['label'] = optionsFinal[field]['children'][field2]['children'][field3]['label'];
                            final[key]['children'][key2]['children'][key3]['value'] = optionsFinal[field]['children'][field2]['children'][field3]['value'];

                            key3++;
                        }

                        key2++;
                    }

                    key++;
                }
                //if options deactive
                // const { regioncode, regionname } = regioninactive;
                // if (regioncode) {
                //     optionsFinal = getOptionsDeactive(actionspage, options, regioncode, regionname);
                // }

                this.setState({ options: final });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        const { options } = this.state;
        return (
            <CascenderBase labeltext={this.props.labeltext} datafield={this.props.datafield} form={this.props.form} options={options} validationrules={this.props.validationrules} disabled={this.props.disabled} />
        )
    }

}

export default TierCascender;