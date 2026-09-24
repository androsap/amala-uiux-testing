import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import Alert from '../../../../components/Alert';
import { api } from '../../../../config/Services';
import Loader from '../../../../components/Loader';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { _getUserPermission, _checkPermission } from '../../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'pricefixed';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Title',
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

        //fixprice
        if (!field['fixprice']) {
            errors['fixprice'] = 'Required';
        } else if (!field['fixprice'].match(/^[0-9]*$/)) {
            errors['fixprice'] = 'Only numeric';
        } else if (field['fixprice'].length > 10) {
            errors['fixprice'] = 'Maximum name value is 10 character';
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
            let titlepage = 'Edit Awards Price 2';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Awards Price 2';
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
        let url = api.url.awardprice2.detail;
        let data = { id };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.fixprice.value = (typeof result.fixprice === "undefined") ? "" : result.fixprice;

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
            let fixprice = formData.fixprice;

            let pricestatus = '1';
            let message = 'Data has been updated';
            let url = api.url.awardprice2.update;
            let data = { id, fixprice, pricestatus };

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
        const { actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
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
                                <label className="col-sm-3 col-form-label" htmlFor="fixprice-view">Price </label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="fixprice-view" ref="fixprice" maxLength="10" disabled={generalfielddisabled} />
                                    <span className="text-danger">{errors["fixprice"]}</span>
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