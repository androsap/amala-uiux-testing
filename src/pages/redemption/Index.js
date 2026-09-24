import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import Breadcrumb from '../../components/Breadcrumb';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import ErrorGeneral from '../error/ErrorGeneral';

import { connect } from "react-redux";
import { setData } from "../../utilities/actions/RedemptionActions";
import { DetailRequest } from '../../utilities/RequestService';

var permissionList = _getUserPermission();
var menuname = 'redemption';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Redemption',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
        };
    }

    getStore() {
        return this.redemptionStore;
    }

    updateStore(update) {
        this.redemptionStore = {
            ...this.redemptionStore,
            ...update,
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //cardnumber
        if (!field['cardnumber']) {
            errors['cardnumber'] = 'Required';
        } else if (!field['cardnumber'].match(/^[0-9]+$/)) {
            errors['cardnumber'] = 'Only numeric';
        } else if (field['cardnumber'].length > 45) {
            errors['cardnumber'] = 'Maximum 45 characters';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        document.title = "Manage Redemption | Loyalty Management System";
        if (!_checkPermission(permissionList, menuname, 'access')) {
            (_checkPermission(permissionList, menuname, 'view'));
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
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
            //hide loader
            this.setState({ loading: true });

            let cardnumber = formData.cardnumber;
            let data = { cardnumber };
            let url = api.url.redemption.eligibleredeem;
            DetailRequest(url, data).then((response) => {
                const { result } = response;
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0' && result.redeemstatus) {
                    let memberid = result.memberid;
                    let redeemstatus = result.redeemstatus;
                    let data = { memberid, cardnumber, redeemstatus };

                    //reducer redemption
                    this.props.setData("SETDATA", data);
                    this.props.history.push('/redemption/' + formData.cardnumber);
                } else {
                    Alert.error(responsemessage);
                }
                //call loader
                this.setState({ loading: false });
            });
        }
    };

    render() {
        const { titlepage, formrender, errors, loading } = this.state;

        if (formrender) {
            if (!_checkPermission(permissionList, menuname, 'access')) {
                return (
                    <div className="container-fluid">
                        <Breadcrumb path="Data Management / Redemption" />
                        <div className="main-panel">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h1 className="title-has-control mt-2"> {titlepage}</h1>
                            </div>
                            <hr className="mt-0" />
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <form className="position-relative justify-content-center" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                        <Loader value={loading} />
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label" htmlFor="cardnumber-view">Card Number </label>
                                            <div className="col-sm-9">
                                                <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" maxLength="50" placeholder="Input Card Number" />
                                                <span className="text-danger">{errors["cardnumber"]}</span>
                                            </div>
                                        </div>
                                        <div className="box-footer text-right">
                                            {/* <Link to='/redemption/member-redemption' title="Process" className={"btn btn-outline-dark btn-sm " + _checkPermission(permissionList, 'memberredemption', 'access')}>Process</Link> */}
                                            <button type="submit" className="btn btn-outline-dark btn-sm">Process</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

// export default Layout;
// export default Layout;
const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    setData: (type, data) => dispatch(setData(type, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Layout);