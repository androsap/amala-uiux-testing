import React, { Component } from 'react';
import RequestService from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import Services from '../../../config/Services';
import Loader from '../../../components/Loader';
import Select2 from '../../../components/Select2';
import ErrorGeneral from '../../error/ErrorGeneral';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var getServices = new Services();
var request = new RequestService();
var permissionList = _getUserPermission();
var menuname = 'statementtext';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Statement Text',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            channel: '',
            langcode: null,
            optionChannel: [],
            optionLanguage: [],
            optionPartner: [],
            criteria: {}
        }
        this.closeAndRefresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //statementtext
        if (!field['statementtext']) {
            errors['statementtext'] = 'Required';
        }

        //correctiontext
        if (!field['correctiontext']) {
            errors['correctiontext'] = 'Required';
        }

        //channel
        if (!field['channel']) {
            errors['channel'] = 'Required';
        }

        //channel
        if (!field['langcode']) {
            errors['langcode'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.props.statementtextid;
        if (id) {
            let titlepage = 'Edit Statement Text';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Statement Text';
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
                this.getOptionLanguage();
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

    getOptionLanguage() {
        let parameter = {
            sort: {
                langname: 'asc'
            }
        }
        let url = getServices.state.url.language.list;
        let column = ['langcode', 'langname'];
        var result = request.getDataList(url, parameter, column);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var result = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.langname;
                    result2['value'] = obj.langcode;
                    return result2;
                })

                this.setState({
                    optionLanguage: result
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleLanguageChange = (event) => {
        let langcode = event === null ? null : event.value;
        this.setState({ langcode });
    }

    handleChannelChange = (event) => {
        let channel = event === null ? null : event.value;
        this.setState({ channel });
    }

    getDetail(statementtextid) {
        let url = getServices.state.url.statementtext.detail;
        request.getDataDetail(url, { statementtextid }).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0' && response.result) {
                let data = response.result;
                this.refs.statementtext.value = data.statementtext;
                this.refs.correctiontext.value = data.correctiontext;

                this.setState({
                    langcode: data.langcode,
                    channel: data.channel,
                    isdefault: data.isdefault,
                }, this.getOptionLanguage());
            } else {
                this.setState(
                    {
                        responseCode: response.status.responsecode,
                        responseMessage: response.status.responsemessage,
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
        var formRadio = ['isdefault'];
        for (const field in this.refs) {
            if (formRadio.includes(field)) {
                formData[field] = this.refs[field].checked;
            } else {
                tempVal = this.refs[field].value;
                if (tempVal) {
                    tempVal = tempVal.trim();
                }
                formData[field] = tempVal;
            }
        }
        formData['channel'] = this.state.channel;
        formData['langcode'] = this.state.langcode;

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let statementid = this.props.statementid;
            let statementtext = formData.statementtext;
            let correctiontext = formData.correctiontext;
            let channel = formData.channel;
            let langcode = formData.langcode;
            let isdefault = formData.isdefault;

            let message = '';
            let url = '';
            let parameter = {};
            if (actionspage === 'create') {
                message = 'New data has been created';
                url = getServices.state.url.statementtext.create;
                parameter = { statementid, statementtext, correctiontext, channel, langcode, isdefault };
            } else {
                let statementtextid = this.props.statementtextid;
                message = 'Data has been updated';
                url = getServices.state.url.statementtext.update;
                parameter = { statementid, statementtextid, statementtext, correctiontext, channel, langcode, isdefault };
            }

            var requestData = request.saveData(url, parameter);
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

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
        const { langcode, channel, isdefault } = this.state;
        const channelOption = [
            { "value": 'MOBILE', "label": 'MOBILE' },
            { "value": 'WEBSITE', "label": 'WEBSITE' },
            { "value": 'BO', "label": 'BO' },
            { "value": 'CHECK-IN', "label": 'CHECK-IN' },
            { "value": 'PARTNER', "label": 'PARTNER' },
            { "value": 'COBRAND', "label": 'COBRAND' },
            { "value": 'CHARITY', "label": 'CHARITY' },
            { "value": 'CORPORATE', "label": 'CORPORATE' }
        ];

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
                                <div className="row">
                                    {/*<div className="col-md-6">*/}
                                    <div className="form-group row col-sm-12">
                                        <label className="col-sm-4 col-form-label" htmlFor="statementtext-view">Statement Text <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                        <div className="col-sm-8">
                                            <textarea rows="3" className="form-control" type="text" id="statementtext-view" ref="statementtext" maxLength="255" disabled={generalfielddisabled} />
                                            <span className="text-danger">{errors["statementtext"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row col-sm-12">
                                        <label className="col-sm-4 col-form-label" htmlFor="correctiontext-view">Correction Text <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                        <div className="col-sm-8">
                                            <textarea rows="3" className="form-control" type="text" id="correctiontext-view" ref="correctiontext" maxLength="255" disabled={generalfielddisabled} />
                                            <span className="text-danger">{this.state.errors["correctiontext"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row col-sm-12">
                                        <label className="col-sm-4 col-form-label" htmlFor="channel-view">Channel <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="partner" className="reactSelect2" id="channel-view" options={channelOption} onChange={this.handleChannelChange} value={channelOption.filter(({ value }) => value === channel)} disabled={generalfielddisabled}></Select2>
                                            <span className="text-danger">{this.state.errors["channel"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row col-sm-12">
                                        <label className="col-sm-4 col-form-label" htmlFor="language-view">Language <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                        <div className="col-sm-8">
                                            <Select2 reference="partner" className="reactSelect2" id="language-view" options={this.state.optionLanguage} onChange={this.handleLanguageChange} value={optionLanguage.filter(({ value }) => value === langcode)} disabled={generalfielddisabled}></Select2>
                                            <span className="text-danger">{this.state.errors["langcode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row col-sm-12">
                                        <label className="col-sm-4 col-form-label" htmlFor="isdefault-view">Is Default </label>
                                        <div className="col-sm-8">
                                            <label className="custom-control border-switch">
                                                <input id="isdefault-view" ref="isdefault" className="border-switch-control-input" type="checkbox" defaultChecked={isdefault} disabled={generalfielddisabled} />
                                                <span className="border-switch-control-description">No</span>
                                                <span className="border-switch-control-indicator"></span>
                                                <span className="border-switch-control-description">Yes</span>
                                            </label>
                                        </div>
                                    </div>
                                    {/*</div>*/}
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