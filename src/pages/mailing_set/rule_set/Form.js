import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import Select2 from '../../../components/Select2';
import { api } from '../../../config/Services';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'ruleset';

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
            generalfielddisabled: false,
            optionsCountry: [],
            countryvalue: '',
            countrysyntax: null,
            optionsMembershipType: [],
            membershiptypesyntax: null,
            membershiptypevalue: null,
            optionsMembership: [],
            membershipsyntax: null,
            membershipavlue: null,
            membershipdisabled: true,
            optionsTier: [],
            tiersyntax: null,
            tiervalue: null,
            tierdisabled: true,
            optionsMailingSet: [],
            mailingsetid: null,
            optionsPromo: [],
            promosyntax: null,
            promovalue: null
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //code
        if (!field['code']) {
            errors['code'] = 'Required';
        } else if (!field['code'].match(/^[a-zA-Z]+$/)) {
            errors['code'] = 'Only letters';
        } else if (field['code'].length > 5) {
            errors['code'] = 'Maximum 5 characters';
        }

        //name
        if (!field['name']) {
            errors['name'] = 'Required';
        } else if (!field['name'].match(/^[a-zA-Z\s]+$/)) {
            errors['name'] = 'Only letters and space';
        } else if (field['name'].length > 45) {
            errors['name'] = 'Maximum 45 characters';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        if (id) {
            let titlepage = 'Edit Title';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Title';
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
            // this.checkPermission();
            this.getOptionsCountry();
            this.getOptionsMembershipType();
            this.getOptionsMailingSet();
            // this.getOptionsMembership();
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
    }

    getDetail(titlecode) {
        let url = api.url.title.detail;
        let data = { titlecode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.code.value = result.titlecode;
                this.refs.name.value = result.titlename;
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

    getOptionsMailingSet() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            mailingsetname: 'asc'
        };
        let criteria = {};
        let url = api.url.mailingset.list;
        let column = ['id', 'mailingsetname'];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsMailingSet = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.mailingsetname;
                    result2['value'] = obj.id;
                    return result2;
                })

                this.setState({
                    optionsMailingSet
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionsCountry() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            countryname: 'asc'
        };
        let criteria = {};
        let url = api.url.country.list;
        let column = ['countrycode', 'countryname'];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var result = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.countryname;
                    result2['value'] = obj.countrycode;
                    return result2;
                })

                this.setState({
                    optionsCountry: result
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionsMembershipType() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            membershiptypename: 'asc'
        };
        let criteria = {};
        let url = api.url.membershiptype.list;
        let column = ['membershiptypeid', 'membershiptypename'];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsMembershipType = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.membershiptypename;
                    result2['value'] = obj.membershiptypeid;
                    return result2;
                })

                this.setState({
                    optionsMembershipType
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionsMembership(membershiptypeid = '', actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            membershipname: 'asc'
        };
        let criteria = { membershiptypeid };
        let url = api.url.membership.list;
        let column = ['membershipid', 'membershipname'];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsMembership = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.membershipname;
                    result2['value'] = obj.membershipid;
                    return result2;
                })

                let membershipdisabled = (actionspage === 'view') ? true : false;
                this.setState({
                    optionsMembership,
                    membershipdisabled
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionsTier(membershipid = '', actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            membershipname: 'asc'
        };
        let criteria = { membershipid };
        let url = api.url.tier.list;
        let column = ['tierid', 'tiername'];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsTier = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.tiername;
                    result2['value'] = obj.tierid;
                    return result2;
                })

                let tierdisabled = (actionspage === 'view') ? true : false;
                this.setState({
                    optionsTier,
                    tierdisabled
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
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
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let titlename = formData.name;

            let titlecode = '';
            let message = '';
            let url = '';
            if (actionspage === 'create') {
                titlecode = formData.code.toUpperCase();
                message = 'New data has been created';
                url = api.url.title.create;
            } else {
                titlecode = this.props.match.params.ID;
                message = 'Data has been updated';
                url = api.url.title.update;
            }

            let data = { titlecode, titlename };
            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/title/form/' + response.result.titlecode);
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

    handleCountryChange = (event) => {
        let countryvalue = event === null ? null : event.value;
        this.setState({ countryvalue });
    }

    handleCountrySyntaxChange = (event) => {
        let countrysyntax = event === null ? null : event.target.checked;
        this.setState({ countrysyntax });
    }

    handleMembershipTypeSyntaxChange = (event) => {
        let membershiptypesyntax = event === null ? null : event.target.checked;
        this.setState({ membershiptypesyntax, });
    }

    handleMembershiptypeChange = (event) => {
        let membershiptypevalue = event === null ? null : event.value;
        let membershipdisabled = true;
        let tierdisabled = true;
        let optionsMembership = [];
        let optionsTier = [];
        this.setState({ membershiptypevalue, membershipdisabled, optionsMembership, optionsTier, tierdisabled });
        if (membershiptypevalue) { this.getOptionsMembership(membershiptypevalue); }
    }

    handleMembershipSyntaxChange = (event) => {
        let membershipsyntax = event === null ? null : event.target.checked;
        this.setState({ membershipsyntax });
    }

    handleMembershipChange = (event) => {
        let membershipvalue = event === null ? null : event.value;
        let tierdisabled = true;
        let optionsTier = [];
        this.setState({ membershipvalue, tierdisabled, optionsTier });
        if (membershipvalue) { this.getOptionsTier(membershipvalue); }
    }

    handleTierSyntaxChange = (event) => {
        let tiersyntax = event === null ? null : event.target.checked;
        this.setState({ tiersyntax });
    }

    handleTierChange = (event) => {
        let tiervalue = event === null ? null : event.value;
        this.setState({ tiervalue });
    }

    handleMailingSetChange = (event) => {
        let mailingsetid = event === null ? null : event.value;
        this.setState({ mailingsetid });
    }

    handlePromoSyntaxChange = (event) => {
        let promosyntax = event === null ? null : event.target.checked;
        this.setState({ promosyntax });
    }

    handlePromoChange = (event) => {
        let promovalue = event === null ? null : event.value;
        this.setState({ promovalue });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, specialfielddisabled, generalfielddisabled } = this.state;
        const { optionsCountry, countryvalue, countrysyntax,
            membershiptypevalue, membershiptypesyntax, optionsMembershipType,
            membershipvalue, membershipsyntax, optionsMembership, membershipdisabled,
            tiervalue, tiersyntax, optionsTier, tierdisabled,
            optionsMailingSet, mailingsetid,
            optionsPromo, promosyntax, promovalue } = this.state;
        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h3 className="title-has-control mt-2">Create Rule Set</h3>
                    </div>
                    <hr className="mt-0" />
                    <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                        <div className="row">
                            <div className="col-sm-6">
                                <Loader value={loading} />
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="rulesetname-view">Rule Set Name </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" type="text" id="rulesetname-view" ref="rulesetname" maxLength="45" disabled={specialfielddisabled} />
                                        <span className="text-danger">{errors["rulesetname"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="countryvalue-view">Country </label>
                                    <div className="col-sm-8">
                                        <div className="row no-gutters">
                                            <label className="custom-control border-switch">
                                                <input id="countrysyntax-view" ref="countrysyntax" className="border-switch-control-input" type="checkbox" onClick={this.handleCountrySyntaxChange} defaultChecked={(countrysyntax) ? "checked" : null} disabled={generalfielddisabled} />
                                                <span className="border-switch-control-description">NOT IN</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">IN</span>
                                            </label>
                                        </div>
                                        <Select2 reference="countryvalue" className="reactSelect2" id="countryvalue-view" options={optionsCountry} onChange={this.handleCountryChange} value={optionsCountry.filter(({ value }) => value === countryvalue)} disabled={generalfielddisabled}></Select2>
                                        <span className="text-danger">{errors["countryvalue"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="emailpermitted-view">Email Permitted ?</label>
                                    <div className="col-sm-8">
                                        <div className="multiple-checkbox col-sm-4">
                                            <label className="custom-control fill-checkbox">
                                                <input type="checkbox" className="fill-control-input" ref="emailpermitted" disabled={generalfielddisabled} />
                                                <span className="fill-control-indicator"></span>
                                                <span className="fill-control-description">Yes</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="postalpermitted-view">Postal Permitted ?</label>
                                    <div className="col-sm-8">
                                        <div className="multiple-checkbox col-sm-4">
                                            <label className="custom-control fill-checkbox">
                                                <input type="checkbox" className="fill-control-input" ref="postalpermitted" disabled={generalfielddisabled} />
                                                <span className="fill-control-indicator"></span>
                                                <span className="fill-control-description">Yes</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="smspermitted-view">SMS Permitted ?</label>
                                    <div className="col-sm-8">
                                        <div className="multiple-checkbox col-sm-4">
                                            <label className="custom-control fill-checkbox">
                                                <input type="checkbox" className="fill-control-input" ref="smspermitted" disabled={generalfielddisabled} />
                                                <span className="fill-control-indicator"></span>
                                                <span className="fill-control-description">Yes</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="enrollcode-view">Enroll Code </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" type="text" id="enrollcode-view" ref="enrollcode" maxLength="45" disabled={specialfielddisabled} />
                                        <span className="text-danger">{errors["enrollcode"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="eventname-view">Event Name </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" type="text" id="eventname-view" ref="eventname" maxLength="45" disabled={specialfielddisabled} />
                                        <span className="text-danger">{errors["eventname"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="membeshiptypevalue-view">Membership Type </label>
                                    <div className="col-sm-8">
                                        <div className="row no-gutters">
                                            <label className="custom-control border-switch">
                                                <input id="membeshiptypesyntax-view" ref="membeshiptypesyntax" className="border-switch-control-input" type="checkbox" onClick={this.handleMembershipTypeSyntaxChange} defaultChecked={(membershiptypesyntax) ? "checked" : null} disabled={generalfielddisabled} />
                                                <span className="border-switch-control-description">NOT IN</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">IN</span>
                                            </label>
                                        </div>
                                        <Select2 reference="membeshiptypevalue" className="reactSelect2" id="membeshiptypevalue-view" options={optionsMembershipType} onChange={this.handleMembershiptypeChange} value={optionsMembershipType.filter(({ value }) => value === membershiptypevalue)} disabled={generalfielddisabled}></Select2>
                                        <span className="text-danger">{errors["membeshiptypevalue"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="membershipvalue-view">Membership </label>
                                    <div className="col-sm-8">
                                        <div className="row no-gutters">
                                            <label className="custom-control border-switch">
                                                <input id="membershipsyntax-view" ref="membershipsyntax" className="border-switch-control-input" type="checkbox" onClick={this.handleMembershipSyntaxChange} defaultChecked={(membershipsyntax) ? "checked" : null} disabled={generalfielddisabled} />
                                                <span className="border-switch-control-description">NOT IN</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">IN</span>
                                            </label>
                                        </div>
                                        <Select2 reference="membershipvalue" className="reactSelect2" id="membershipvalue-view" options={optionsMembership} onChange={this.handleMembershipChange} value={optionsMembership.filter(({ value }) => value === membershipvalue)} disabled={membershipdisabled}></Select2>
                                        <span className="text-danger">{errors["membershipvalue"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="tiervalue-view">Tier </label>
                                    <div className="col-sm-8">
                                        <div className="row no-gutters">
                                            <label className="custom-control border-switch">
                                                <input id="tiersyntax-view" ref="tiersyntax" className="border-switch-control-input" type="checkbox" onClick={this.handleTierSyntaxChange} defaultChecked={(tiersyntax) ? "checked" : null} disabled={generalfielddisabled} />
                                                <span className="border-switch-control-description">NOT IN</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">IN</span>
                                            </label>
                                        </div>
                                        <Select2 reference="tiervalue" className="reactSelect2" id="tiervalue-view" options={optionsTier} onChange={this.handleTierChange} value={optionsTier.filter(({ value }) => value === tiervalue)} disabled={tierdisabled}></Select2>
                                        <span className="text-danger">{errors["membershipvalue"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="mailingsetid-view">Mailing Set </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="tiervalue" className="reactSelect2" id="mailingsetid-view" options={optionsMailingSet} onChange={this.handleMailingSetChange} value={optionsMailingSet.filter(({ value }) => value === mailingsetid)} disabled={generalfielddisabled}></Select2>
                                        <span className="text-danger">{errors["mailingsetid"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="promovalue-view">Promo </label>
                                    <div className="col-sm-8">
                                        <div className="row no-gutters">
                                            <label className="custom-control border-switch">
                                                <input id="promovalue-view" ref="promovalue" className="border-switch-control-input" type="checkbox" onClick={this.handlePromoSyntaxChange} defaultChecked={(promosyntax) ? "checked" : null} disabled={generalfielddisabled} />
                                                <span className="border-switch-control-description">NOT IN</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">IN</span>
                                            </label>
                                        </div>
                                        <Select2 reference="promovalue" className="reactSelect2" id="promovalue-view" options={optionsPromo} onChange={this.handlePromoChange} value={optionsPromo.filter(({ value }) => value === promovalue)} disabled={generalfielddisabled}></Select2>
                                        <span className="text-danger">{errors["promovalue"]}</span>
                                    </div>
                                </div>
                                <div className="box-footer text-center">
                                    {
                                        (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                    }
                                    &nbsp;&nbsp;
                                        <Link to="/title" className="btn btn-outline-dark normal">Back</Link>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="registcode-view">Registrasion code </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" type="text" id="registcode-view" ref="registcode" maxLength="45" disabled={specialfielddisabled} />
                                        <span className="text-danger">{errors["registcode"]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;