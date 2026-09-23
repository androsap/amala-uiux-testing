import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class VendorRegionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    componentDidMount() {
        if (this.props.forceRender) {
            this.retrieveData();
            if (this.props.allOption) this.props.getAllOption(this.state.options);
        }
    }

    retrieveData = async (criteria = {}, inactivefield = {}, actionspage = 'create') => {
        let paging = { limit: -1, page: 1 }
        let sort = {};
        let url = api.url.vendorregion.retrieve;
        let column = [];
        this.setState({ isLoading: true });
        await RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.regionname;
                    result2['value'] = obj.regioncode;
                    return result2;
                });

                var RemoveALL = options.map(({ routetype }) => {
                    return {
                        label: 'ALL',
                        value: 'ALL'
                    };
                });
                let NewRegion = options.filter(ar => !RemoveALL.find(rm => (rm.label === ar.label && ar.value === rm.value)))

                //if options deactive
                const { regioncode, regionname } = inactivefield;
                if (regioncode) {
                    options = getOptionsDeactive(actionspage, options, regioncode, regionname);
                }

                this.setState({ options: options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getAllOption = async (type = 'dataVendorRegionOnly') => {
        await this.props.getAllOption(this.state.options, type);
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}
export default VendorRegionSelect;
