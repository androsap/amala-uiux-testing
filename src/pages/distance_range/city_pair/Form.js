import React, { Component } from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import { api } from '../../../config/Services';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';
import Select2 from '../../../components/Select2';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';
import { SaveRequest } from '../../../utilities/RequestService';

var permissionList = _getUserPermission();
var menuname = 'citypairrange';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Add City Pair',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            citypaircode: null,
            optionsCityPair: [],
            isLoadingSelect2: {
                citypair: false
            }
        };
        this.closeAndRefresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //citypaircode
        if (!field['citypaircode']) {
            errors['citypaircode'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        if (_checkPermission(permissionList, menuname, "create")) {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        } else {
            this.getOptionCityPair();
        }
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, "access")) {
            this.checkPermission();
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        const { actionspage } = this.state;
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }

        formData['citypaircode'] = this.state.citypaircode;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let citypaircode = formData.citypaircode;
            let distancerangecode = this.props.distancerangeid;

            let message = '';
            let url = '';
            if (actionspage === 'create') {
                message = 'New data has been created';
                url = api.url.citypair.addnew;
            }

            let data = { citypaircode, distancerangecode };
            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.closeModalSuccess();
                    } else {
                        Alert.error(responsemessage);
                        this.setState({ loading: false });
                    }
                })
            }
        }
    };

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    getOptionCityPair() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            citypaircode: 'asc'
        };
        let criteria = {
            active: true
        }
        let url = api.url.citypair.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, citypair: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsCityPair = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.citypaircode + " / " + obj.airlinecode;
                    result2['value'] = obj.citypaircode;
                    return result2;
                })

                this.setState(prevState => ({
                    optionsCityPair,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, citypair: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleCityPairChange = (event) => {
        let citypaircode = event === null ? null : event.value;
        this.setState({ citypaircode });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
        const { isLoadingSelect2, citypaircode, optionsCityPair } = this.state;
        if (formrender) {
            return (
                <div className="container-fluid">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h3 className="title-has-control mt-2">{titlepage}</h3>
                    </div>
                    <hr className="mt-0" />
                    <div className="row">
                        <div className="col-sm-12">
                            <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                <Loader value={loading} />
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="citypaircode-view">City Pair</label>
                                    <div className="col-sm-8">
                                        <Select2 reference="citypaircode" className="reactSelect2" id="citypaircode-view" options={optionsCityPair} onChange={this.handleCityPairChange} value={optionsCityPair.filter(({ value }) => value === citypaircode)} disabled={generalfielddisabled} isLoading={isLoadingSelect2.citypair}></Select2>
                                        <span className="text-danger">{errors["citypaircode"]}</span>
                                    </div>
                                </div>
                                <div className="box-footer text-center">
                                    {
                                        (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                    }
                                    &nbsp;&nbsp;
		                            <button type="button" ref={this.closeAndRefresh} onClick={this.props.closeModalRefresh} className="hidden">Close Refresh</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;