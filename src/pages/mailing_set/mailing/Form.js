import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactModal from 'react-responsive-modal';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import RuleSetIndex from '../rule_set/Index';
import { api } from '../../../config/Services';
import Select2 from '../../../components/Select2';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';
import Breadcrumb from '../../../components/Breadcrumb';
// import MailingItemIndex from '../mailing_item/Index';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'mailing';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingsetid: (this.props.location.state && this.props.location.state.mailingsetid) ? this.props.location.state.mailingsetid : null,
            mailingid: (this.props.location.state && this.props.location.state.mailingid) ? this.props.location.state.mailingid : null,
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Mailing',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            optionsMailingSet: [],
            optionsLanguage: [],
            langcode: null,
            mailingobjectid: null,
            showModal: false,
            rulesetid: '',
            rulesetname: '',
            isLoadingSelect2: {
                mailignset: false,
                langcode: false
            }
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //mailingsetid
        if (!field['mailingsetid']) {
            errors['mailingsetid'] = 'Required';
        }

        //mailingname
        if (!field['mailingname']) {
            errors['mailingname'] = 'Required';
        } else if (!field['mailingname'].match(/^[0-9a-zA-Z\s]+$/)) {
            errors['mailingname'] = 'Only alphanumeric and space';
        } else if (field['mailingname'].length > 45) {
            errors['mailingname'] = 'Maximum 45 characters';
        }

        //langcode
        if (!field['langcode']) {
            errors['langcode'] = 'Required';
        }

        //priority
        if (!field['priority']) {
            errors['priority'] = 'Required';
        } else if (!field['priority'].match(/^[0-9]+$/)) {
            errors['priority'] = 'Only number';
        } else if (field['priority'].length > 10) {
            errors['priority'] = 'Maximum 10 characters';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = (this.props.location.state && this.props.location.state.mailingid !== undefined) ? this.props.location.state.mailingid : null;
        if (id) {
            let titlepage = 'Edit Mailing';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Mailing';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, generalfielddisabled });
            this.getDetail(id);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getoptionsMailingSet();
                this.getoptionsLanguage();
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
        let url = api.url.mailing.detail;
        let data = { id };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.mailingname.value = result.mailingname;
                this.refs.priority.value = result.priority;

                this.setState({
                    mailingsetid: result.mailingsetid,
                    mailingid: id,
                    langcode: result.langcode,
                    rulesetid: (result.mailingrule && result.mailingrule[0].rulesetid) ? result.mailingrule[0].rulesetid : null
                },
                    this.getoptionsLanguage(),
                    this.getoptionsMailingSet());
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

    getoptionsLanguage() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            langname: 'asc'
        };
        let criteria = {}
        let url = api.url.language.list;
        let column = ['langcode', 'langname'];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, langcode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsLanguage = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.langname;
                    result2['value'] = obj.langcode;
                    return result2;
                })

                this.setState(prevState => ({
                    optionsLanguage,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, langcode: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getoptionsMailingSet() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            mailingsetname: 'asc'
        };
        let url = api.url.mailingset.list;
        let column = ['id', 'mailingsetname'];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, mailingset: true } }));
        var result = RetrieveRequest(url, paging, column, {}, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsMailingSet = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.mailingsetname;
                    result2['value'] = obj.id;
                    return result2;
                });

                this.setState(prevState => ({
                    optionsMailingSet,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, mailingset: false }
                }));
            } else {
                Alert.error(status.responsemessage);
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

        formData['mailingsetid'] = this.state.mailingsetid;
        formData['langcode'] = this.state.langcode;

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let mailingname = formData.mailingname;
            let priority = formData.priority;
            let langcode = formData.langcode;
            let mailingsetid = Number.parseInt(formData.mailingsetid, 0);
            let mailingtype = 'EMAIL';
            let rulesetid = Number.parseInt(formData.rulesetid, 0);
            let mailingrule = [];
            mailingrule[0] = [];
            mailingrule[0] = { rulesetid };

            let message = '';
            let url = '';
            let data = {};
            if (actionspage === 'create') {
                // id = 13;
                message = 'New data has been created';
                url = api.url.mailing.create;
                data = { mailingsetid, mailingtype, mailingname, langcode, priority, mailingrule };
            } else {
                let id = this.props.location.state.mailingid;
                message = 'Data has been updated';
                url = api.url.mailing.update;
                data = { id, mailingsetid, mailingtype, mailingname, langcode, priority, mailingrule };
            }

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push({ pathname: '/mailing-set/mailing', state: { mailingid: response.result.id, mailingsetid: response.result.mailingsetid } });
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

    handleMailingSetChange = (event) => {
        let mailingsetid = event === null ? null : event.value;
        this.setState({ mailingsetid });
    }

    handleLanguageChange = (event) => {
        let langcode = event === null ? null : event.value;
        this.setState({ langcode });
    }

    //handle open modal
    handleOpenModal = (code) => {
        this.setState({ showModal: true, patnercode: code });
    }

    //handle close modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    //handle close modal and reload data
    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
        // this.getList();
    }

    updateStore(value) {
        this.setState({
            ...value
        })
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled, isLoadingSelect2 } = this.state;
        const { mailingsetid, optionsMailingSet, optionsLanguage, langcode, mailingid, showModal, rulesetid, rulesetname } = this.state;

        if (this.props.location.state && (mailingsetid || mailingid)) {
            if (formrender) {
                //title bar on browser
                document.title = titlepage + " | Loyalty Management System";
                //render form
                return (
                    <div className="container-fluid">
                        <Breadcrumb path="Data Management / Member Configuration / Mailing" />
                        <div className="main-panel">
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
                                                        <Select2 reference="mailingsetid" className="reactSelect2" id="mailingsetid-view" options={optionsMailingSet} onChange={this.handleMailingSetChange} value={optionsMailingSet.filter(({ value }) => value === mailingsetid)} disabled isLoading={isLoadingSelect2.mailingset}></Select2>
                                                        <span className="text-danger">{errors["mailingsetid"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="mailingname-view">Mailing Name </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="mailingname-view" ref="mailingname" maxLength="45" disabled={generalfielddisabled} />
                                                        <span className="text-danger">{errors["mailingname"]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="langcode-view">Language </label>
                                                    <div className="col-sm-8">
                                                        <Select2 reference="langcode" className="reactSelect2" id="langcode-view" options={optionsLanguage} onChange={this.handleLanguageChange} value={optionsLanguage.filter(({ value }) => value === langcode)} disabled={generalfielddisabled} isLoading={isLoadingSelect2.langcode}></Select2>
                                                        <span className="text-danger">{errors["langcode"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="priority-view">Priority </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="priority-view" ref="priority" maxLength="10" disabled={generalfielddisabled} />
                                                        <span className="text-danger">{errors["priority"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="rulesetid-view">Rule Set <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                                    <div className="col-sm-5">
                                                        <input className="form-control hidden" type="text" id="rulesetid-view" ref="rulesetid" maxLength="10" disabled={true} value={rulesetid} />
                                                        <input className="form-control" type="text" id="ruleset-view" ref="ruleset" maxLength="10" disabled={true} value={rulesetname} />
                                                        <span className="text-danger">{errors["rulesetid"]}</span>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <button type="button" onClick={() => this.handleOpenModal('')} className="btn btn-default normal btn-sm">Browse</button>
                                                        <ReactModal open={showModal} onClose={this.handleCloseModal} center>
                                                            <div className="modal-lg">
                                                                <RuleSetIndex closeModalRefresh={this.handleCloseModalRefresh} updateStore={(u) => { this.updateStore(u) }} />
                                                            </div>
                                                        </ReactModal>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box-footer text-center">
                                            {
                                                (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                            }
                                            &nbsp;&nbsp;
                                        <Link to={"/mailing-set/form/" + mailingsetid} className="btn btn-outline-dark normal">Back</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* {
                                (actionspage === 'update') ? <MailingItemIndex mailingsetid={mailingsetid} mailingid={mailingid} /> : ""
                            } */}
                        </div>
                    </div>
                )
            } else {
                return (<ErrorGeneral message={this.state.responseMessage} />);
            }
        } else {
            return (<ErrorGeneral message={'Mailing ID or Mailing Set ID not detected, please do not use tab'} />);
        }
    }
}

export default Layout;