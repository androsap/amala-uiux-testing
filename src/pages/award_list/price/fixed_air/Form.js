import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import Alert from '../../../../components/Alert';
import { api } from '../../../../config/Services';
import Loader from '../../../../components/Loader';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { _getUserPermission, _checkPermission } from '../../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'priceprice';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Award Price Fixed Air',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            specialfielddisabled: false,
            generalfielddisabled: false
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //pricedomlow
        if (!field['pricedomlow']) {
            errors['pricedomlow'] = 'Required';
        } else if (!field['pricedomlow'].match(/^[0-9]*$/)) {
            errors['pricedomlow'] = 'Only numeric';
        } else if (field['pricedomlow'].length > 10) {
            errors['pricedomlow'] = 'Maximum name value is 10 character';
        }

        //pricedompeak
        if (!field['pricedompeak']) {
            errors['pricedompeak'] = 'Required';
        } else if (!field['pricedompeak'].match(/^[0-9]*$/)) {
            errors['pricedompeak'] = 'Only numeric';
        } else if (field['pricedompeak'].length > 10) {
            errors['pricedompeak'] = 'Maximum name value is 10 character';
        }

        //priceintlow
        if (!field['priceintlow']) {
            errors['priceintlow'] = 'Required';
        } else if (!field['priceintlow'].match(/^[0-9]*$/)) {
            errors['priceintlow'] = 'Only numeric';
        } else if (field['priceintlow'].length > 10) {
            errors['priceintlow'] = 'Maximum name value is 10 character';
        }

        //priceintpeak
        if (!field['priceintpeak']) {
            errors['priceintpeak'] = 'Required';
        } else if (!field['priceintpeak'].match(/^[0-9]*$/)) {
            errors['priceintpeak'] = 'Only numeric';
        } else if (field['priceintpeak'].length > 10) {
            errors['priceintpeak'] = 'Maximum name value is 10 character';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = Number.parseInt(this.props.awardid, 0);
        if (id) {
            let titlepage = 'Edit Awards Fixed Air';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Awards Fixed Air';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, specialfielddisabled, generalfielddisabled });
            this.getDetail(id);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, "access")) {
            this.checkPermission();
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
    }

    getDetail(id) {
        let url = api.url.awardprice1.detail;
        let data = { id };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.pricedomlow.value = (typeof result.pricedomlow === "undefined") ? "" : result.pricedomlow;
                this.refs.pricedompeak.value = (typeof result.pricedompeak === "undefined") ? "" : result.pricedompeak;
                this.refs.priceintlow.value = (typeof result.priceintlow === "undefined") ? "" : result.priceintlow;
                this.refs.priceintpeak.value = (typeof result.priceintpeak === "undefined") ? "" : result.priceintpeak;
                //call loader
                this.setState({ loading: false });
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let id = this.props.awardid;
            let pricedomlow = formData.pricedomlow;
            let pricedompeak = formData.pricedompeak;
            let priceintlow = formData.priceintlow;
            let priceintpeak = formData.priceintpeak;
            let pricestatus = '1';

            let message = 'Data has been updated';
            let url = api.url.awardprice1.update;
            let data = { id, pricedomlow, pricedompeak, priceintlow, priceintpeak, pricestatus };

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        //after action, check permission
                        this.checkPermission();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        }
    };

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
        //title bar on browser
        document.title = titlepage + " | Loyalty Management System";
        if (formrender) {
            //render form
            return (
                <div className="main-panel">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="title-has-control mt-2">Manage Price</h1>
                    </div>
                    <hr className="mt-0" />
                    <div className="col-sm-12">
                        <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                            <Loader value={loading} />
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label" htmlFor="pricedomlow-view">Price Domestic Low Season </label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="pricedomlow-view" ref="pricedomlow" maxLength="10" disabled={generalfielddisabled} />
                                    <span className="text-danger">{errors["pricedomlow"]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label" htmlFor="pricedompeak-view">Price Domestic Peak Season </label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="pricedompeak-view" ref="pricedompeak" maxLength="10" disabled={generalfielddisabled} />
                                    <span className="text-danger">{errors["pricedompeak"]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label" htmlFor="priceintlow-view">Price International Low Season </label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="priceintlow-view" ref="priceintlow" maxLength="10" disabled={generalfielddisabled} />
                                    <span className="text-danger">{errors["priceintlow"]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label" htmlFor="priceintpeak-view">Price International Peak Season </label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="priceintpeak-view" ref="priceintpeak" maxLength="10" disabled={generalfielddisabled} />
                                    <span className="text-danger">{errors["priceintpeak"]}</span>
                                </div>
                            </div>
                            <div className="box-footer text-center">
                                {
                                    (actionspage !== 'view') ? <button type="submit" className="btn btn-default normal">Save</button> : ""
                                }
                            </div>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;