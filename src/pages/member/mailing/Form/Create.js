import React, { Component } from 'react';
import Alert from '../../../../components/Alert';
import { api } from '../../../../config/Services';
import { SaveRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import Loader from '../../../../components/Loader';
import Datepicker from "../../../../components/Datepicker";
import Select2 from "../../../../components/Select2";
import moment from "moment";
import { _getUserPermission, _checkPermission } from '../../../../utilities/PermissionService';
import ErrorGeneral from '../../../error/ErrorGeneral';

var permissionList = _getUserPermission();
var menuname = 'membermailing';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Order Member Mailing',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            memberid: props.memberid,
            mailingsetid: null,
            optionsMailingSet: [],
            mailingid: null,
            optionsMailing: [],
            mailingdisabled: true,
            requestdate: null,
            isLoadingSelect2: {
                mailingset: false,
                mailing: false
            }
        }
        this.refresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //mailingsetid
        if (!field['mailingsetid']) {
            errors['mailingsetid'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, "access")) {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getOptionsMailingSet();
            }
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
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
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, mailingset: true } }));
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

                this.setState(prevState => ({
                    optionsMailingSet,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, mailingset: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionsMailing(mailingsetid = '', actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            mailingname: 'asc'
        };
        let criteria = { mailingsetid };
        let url = api.url.mailing.list;
        let column = ['id', 'mailingname'];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, mailing: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsMailing = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.mailingname;
                    result2['value'] = obj.id;
                    return result2;
                })

                let mailingdisabled = (actionspage === 'view') ? true : false;
                this.setState(prevState => ({
                    optionsMailing,
                    mailingdisabled,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, mailing: false }
                }));
            } else {
                Alert.error(status.responsemessage);
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
        formData['memberid'] = this.state.memberid;
        formData['mailingsetid'] = this.state.mailingsetid;
        formData['mailingid'] = this.state.mailingid;
        formData['requestdate'] = this.state.requestdate;
        if (this.handleValidation(formData)) {
            this.setState({ loading: true });
            let memberid = formData.memberid;
            let mailingsetid = formData.mailingsetid;
            let mailingid = formData.mailingid;
            let requestdate = (formData.requestdate) ? moment(formData.requestdate).format("YYYY-MM-DD") : null;

            let url = api.url.membermailing.create;
            var message = 'New data has been created';
            let data = { memberid, mailingsetid, mailingid, requestdate };
            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        //redirect to index page
                        this.props.updatePage({
                            displayactivitypage: 'index'
                        });
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        }
    };

    handleBackClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage
        });
    }

    handleRefreshMainPage = () => {
        this.refresh.current.click();
    }

    handleMailingChange = (event) => {
        let mailingid = event === null ? null : event.value;
        this.setState({ mailingid });
    };

    handleMailingSetChange = (event) => {
        let mailingsetid = event === null ? null : event.value;
        let mailingid = null;
        let mailingdisabled = true;
        let activitycode = null;
        let activitycodedisabled = true;
        this.setState({ mailingsetid, mailingid, mailingdisabled, activitycode, activitycodedisabled });
        if (mailingsetid) { this.getOptionsMailing(mailingsetid); }
    };

    handleDateChange = (event) => {
        let requestdate = event === null ? null : event;
        this.setState({ requestdate });
    };

    render() {
        const { titlepage, formrender, errors, loading, generalfielddisabled } = this.state;
        const { isLoadingSelect2, mailingsetid, optionsMailingSet,
            mailingid, optionsMailing, mailingdisabled, requestdate } = this.state;
        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="profile-detail">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="title-has-control mt-2">{titlepage}</h1>
                    </div>
                    <hr className="mt-0" />
                    <div className="row">
                        <div className="col-sm-12">
                            <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                <Loader value={loading} />
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="mailingsetid-view">Mailing Set </label>
                                            <div className="col-sm-8">
                                                <Select2 reference="mailingsetid" className="form-control" id="mailingsetid-view" options={optionsMailingSet} onChange={this.handleMailingSetChange} value={mailingsetid} isLoading={isLoadingSelect2.mailingset} disabled={generalfielddisabled}></Select2>
                                                <span className="text-danger">{errors["mailingsetid"]}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="mailingid-view">Mailing <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                            <div className="col-sm-8">
                                                <Select2 reference="mailingid" className="form-control" id="mailingid-view" options={optionsMailing} onChange={this.handleMailingChange} value={mailingid} isLoading={isLoadingSelect2.cobrand} disabled={mailingdisabled}></Select2>
                                                <span className="text-danger">{errors["mailingid"]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group row">
                                            <label className="col-md-4 form-label" htmlFor="requestdate-view">Date <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                            <div className="col-sm-8">
                                                <Datepicker className="form-control" onChange={this.handleDateChange} selected={requestdate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={moment(new Date()).add(1, 'days')} />
                                                <span className="text-danger">{errors["requestdate"]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer text-center">
                                    <button type="submit" className="btn btn-outline-dark normal">Save</button>
                                    <button type="button" ref={this.refresh} onClick={this.props.refreshMainPage} className="hidden">Close Refresh</button>
                                    &nbsp;&nbsp;
									<button type="button" onClick={() => (this.handleBackClick('index'))} className="btn btn-outline-dark normal">Back</button>
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