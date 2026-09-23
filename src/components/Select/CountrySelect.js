import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { Alert, SelectBase } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class CountrySelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            loading: false
        }
    }

    componentDidMount() {
        if (this.props.forceRender) {
            this.retrieveData();
        }
    }

    addCountryInactive = (countryname, countrycode) => {
        if (countrycode) {
            let countryinactive = { countryname, countrycode };
            this.retrieveData({}, countryinactive);
        }
    }

    retrieveData(criteria = {}, countryinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { countryname: 'asc' };
        let url = api.url.country.list;
        criteria.active = true;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ loading: true });
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.countryname;
                    result2['value'] = obj.countrycode;
                    return result2;
                });

                //if options deactive
                const { countrycode, countryname } = countryinactive;
                if (countrycode) {
                    options = getOptionsDeactive(actionspage, options, countrycode, countryname);
                }

                this.setState(prevState => ({
                    options,
                    loading: false
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${this.props.labeltext} is Required` })
                            break;
                        default:
                    }
                }
                else if (typeof (item) === "function") {
                    validation.push({
                        validator: item
                    })
                }
            })
        }

        return validation;
    };

    handleResetOptions = () => {
        this.setState({ options: [] })
    };

    getValue = (countrycode = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === countrycode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    getValue = (countrycode = null, field = null) => {
        const { options } = this.state;
        let result = null;
        let detailoptions = options.filter(obj => obj.value === countrycode)[0];
        result = (detailoptions && detailoptions[field]) ? detailoptions[field] : null;
        return result;
    }

    render() {
        return (
            <SelectBase {...this.props} style={this.props.style} options={this.state.options} isLoading={this.state.loading} />
        )
    }

}

export default CountrySelect;