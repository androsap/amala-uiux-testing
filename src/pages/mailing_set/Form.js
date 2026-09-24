import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SaveRequest, DetailRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import { api } from '../../config/Services';
import Loader from '../../components/Loader';
import ErrorGeneral from '../error/ErrorGeneral';
import Datepicker from '../../components/Datepicker';
import Breadcrumb from '../../components/Breadcrumb';
import Select2 from '../../components/Select2';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import moment from 'moment';
import MailingIndex from './mailing/Index';

var permissionList = _getUserPermission();
var menuname = 'mailingset';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Mailing Set',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            validfrom: null,
            validuntil: null,
            mailingsetid: null,
            optionsStatus: [
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' }
            ],
            status: null
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;
        const { actionspage } = this.state;
        let today = moment(new Date());

        //mailingsetname
        if (!field['mailingsetname']) {
            errors['mailingsetname'] = 'Required';
        } else if (field['mailingsetname'].length > 45) {
            errors['mailingsetname'] = 'Maximum 45 characters';
        }

        //maxreorder
        if (!field['maxreorder']) {
            errors['maxreorder'] = 'Required';
        } else if (!field['maxreorder'].match(/^[0-9\s]+$/)) {
            errors['maxreorder'] = 'Only number';
        } else if (field['maxreorder'].length > 10) {
            errors['maxreorder'] = 'Maximum 10 characters';
        }

        //validfrom
        if (!field['validfrom']) {
            errors['validfrom'] = 'Required';
        } else if (field['validfrom'] < today) {
            errors['validfrom'] = 'The day after today';
        }

        //validuntil
        if (!field['validuntil']) {
            errors['validuntil'] = 'Required';
        } else if (field['validuntil'] < today) {
            errors['validuntil'] = 'The day after today';
        } else if (moment(field['validfrom']).format("YYYY/MM/DD") > moment(field['validuntil']).format("YYYY/MM/DD")) {
            errors['validuntil'] = 'Valid until must be greater than valid from';
        }

        //status
        if (!field['status'] && actionspage !== 'create') {
            errors['status'] = 'Required';
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
            let titlepage = 'Edit Mailing Set';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Mailing Set';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, generalfielddisabled });
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
        let url = api.url.mailingset.detail;
        let data = { id };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.mailingsetname.value = result.mailingsetname;
                this.refs.maxreorder.value = result.maxreorder;

                this.setState({
                    status: result.status,
                    validfrom: moment(result.validfrom),
                    validuntil: moment(result.validuntil),
                    mailingsetid: Number.parseInt(id, 0)
                });
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
        const { actionspage } = this.state;
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }

        formData['status'] = this.state.status;
        formData['validfrom'] = this.state.validfrom;
        formData['validuntil'] = this.state.validuntil;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let mailingsetname = formData.mailingsetname;
            let maxreorder = Number.parseInt(formData.maxreorder, 0);
            let mailingsettype = "BY_SYSTEM";
            let validfrom = moment(formData.validfrom).format("YYYY-MM-DD");
            let validuntil = moment(formData.validuntil).format("YYYY-MM-DD");
            let status = formData.status;

            let message = '';
            let url = '';
            let data = {};
            if (actionspage === 'create') {
                message = 'New data has been created';
                url = api.url.mailingset.create;
                data = { mailingsetname, maxreorder, mailingsettype, validfrom, validuntil, status };
            } else {
                let id = Number.parseInt(this.props.match.params.ID, 0);
                message = 'Data has been updated';
                url = api.url.mailingset.update;
                data = { id, mailingsetname, maxreorder, mailingsettype, validfrom, validuntil, status };
            }

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.setState({ mailingsetid: response.result.id });
                        this.props.history.push('/mailing-set/form/' + response.result.id);
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

    handleValidFormChange = (event) => {
        let validfrom = event === null ? null : event;
        let validuntil = null;
        this.setState({ validfrom, validuntil });
    }

    handleValidUntilChange = (event) => {
        let validuntil = event === null ? null : event;
        this.setState({ validuntil });
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.value;
        this.setState({ status });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
        const { optionsStatus, validfrom, validuntil, mailingsetid, status } = this.state;
        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Member Configuration / Mailing Set" />
                    <div className="main-panel">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h1 className="title-has-control mt-2">{titlepage}</h1>
                        </div>
                        <hr className="mt-0 mb-0" />
                        <nav className="mb-3">
                            <ul className="list-unstyled nav nav-tabs list-5">
                                <li><a href="#info" className="tab-control2 active" data-toggle="tab"> Detail Information </a></li>
                                {
                                    (actionspage !== 'create') ? <li className={_checkPermission(permissionList, "mailing", "access")}><a href="#mailing" className="tab-control2" data-toggle="tab"> Mailing </a></li> : ""
                                }
                            </ul>
                        </nav>
                        <div className="tab-entry tab-content">
                            <div className="tab-pane fade show active" id="info">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                            <Loader value={loading} />
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="mailingsetname-view">Mailing Set Name </label>
                                                        <div className="col-sm-8">
                                                            <input className="form-control" type="text" id="mailingsetname-view" ref="mailingsetname" maxLength="45" disabled={generalfielddisabled} />
                                                            <span className="text-danger">{errors["mailingsetname"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="maxreorder-view">Max re-Order </label>
                                                        <div className="col-sm-8">
                                                            <input className="form-control" type="text" id="maxreorder-view" ref="maxreorder" maxLength="10" disabled={generalfielddisabled} />
                                                            <span className="text-danger">{errors["maxreorder"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className={(actionspage === 'create') ? "form-group row hidden" : "form-group row"}>
                                                        <label className="col-sm-3 col-form-label" htmlFor="status-view">Status</label>
                                                        <div className="col-sm-8">
                                                            <Select2 reference="status" className="reactSelect2" id="status-view" options={optionsStatus} onChange={this.handleStatusChange} value={optionsStatus.filter(({ value }) => value === status)} disabled={generalfielddisabled}></Select2>
                                                            <span className="text-danger">{errors["status"]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="validfrom-view">Valid Form </label>
                                                        <div className="col-sm-8">
                                                            <Datepicker className="form-control" onChange={this.handleValidFormChange} selected={validfrom} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={moment(new Date()).add(1, 'days')} />
                                                            <span className="text-danger">{errors["validfrom"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="validuntil-view">Valid Until </label>
                                                        <div className="col-sm-8">
                                                            <Datepicker className="form-control" onChange={this.handleValidUntilChange} selected={validuntil} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={moment(validfrom)} />
                                                            <span className="text-danger">{errors["validuntil"]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer text-center">
                                                {
                                                    (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                                }
                                                &nbsp;&nbsp;
                                                <Link to="/mailing-set" className="btn btn-outline-dark normal">Back</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="mailing">
                                {
                                    (actionspage !== 'create' && !_checkPermission(permissionList, "mailing", "access")) ? <MailingIndex mailingsetid={mailingsetid} /> : ""
                                }
                            </div>
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