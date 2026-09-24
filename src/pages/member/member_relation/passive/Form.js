import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import Alert from '../../../../components/Alert';
import Select2 from '../../../../components/Select2';
import { api } from '../../../../config/Services';
import Loader from '../../../../components/Loader';
import Datepicker from '../../../../components/Datepicker';
import ErrorGeneral from '../../../error/ErrorGeneral';
import moment from 'moment';
import Button from '../../../../components/Button';

const prefixmenuname = 'MBRRELA';
const menucode = 'MBRRELA';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Member Relation',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            specialfielddisabled: false,
            generalfielddisabled: false,
            active: true,
            memberid: (props.memberid) ? props.memberid : null,
            cardnumber: (props.cardnumber) ? props.cardnumber : null,
            memberrelationid: (props.memberrelationid) ? props.memberrelationid : null,
            optionsRelationType: [
                { value: 'CORPORATE', label: 'CORPORATE' }
            ],
            relationtype: null,
            startdate: null,
        }
        this.closeAndRefresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //relationtype
        // if (!field['relationtype']) {
        //     errors['relationtype'] = 'Required';
        // }

        //cardnumber
        if (!field['cardnumber']) {
            errors['cardnumber'] = 'Required';
        } else if (!field['cardnumber'].match(/^[0-9]+$/)) {
            errors['cardnumber'] = 'Only numeric';
        }

        //startdate
        if (!field['startdate']) {
            errors['startdate'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.state.memberrelationid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Manage Member Relation';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View Member Relation';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, generalfielddisabled, specialfielddisabled });
            this.getDetail(id);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail(memberrelationid) {
        let url = api.url.memberrelation.list;
        let paging = {};
        let column = [];
        let criteria = { memberrelationid };
        let sort = {};
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    this.refs.cardnumber.value = this.state.cardnumber ? this.state.cardnumber : '';

                    this.setState({
                        loading: false,
                        relationtype: result[0].relationtype ? result[0].relationtype : null,
                        startdate: result[0].startdate ? moment(result[0].startdate) : null,
                        active: (result[0].active !== undefined) ? result[0].active : false,
                    });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({
                    responseCode: response.status.responsecode,
                    responseMessage: response.status.responsemessage,
                    formrender: false
                });
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
        formData['relationtype'] = this.state.relationtype;
        formData['startdate'] = this.state.startdate;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let relationtype = 'CORPORATE';
            let cardnumber = formData.cardnumber;
            let startdate = moment(formData.startdate).format("YYYY-MM-DD");
            let memberidparent = this.state.memberid;

            let message = 'New data has been created';
            let url = api.url.memberrelation.enroll;
            let data = { memberidparent, relationtype, cardnumber, startdate };

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

    deleteData(memberrelationid, active) {
        let url = (active) ? api.url.memberrelation.deactivate : api.url.memberrelation.activate;
        let data = { memberrelationid };
        var deleteData = DeleteRequest(url, data);
        if (deleteData) {
            deleteData.then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    let message = 'Selected data has been deleted';
                    if (response.status.responsemessage) {
                        message = response.status.responsemessage;
                    }
                    Alert.success(message);
                } else {
                    Alert.error(response.status.responsemessage);
                }
                this.checkPermission();
            })
        }
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    handleRelationTypeChange = (event) => {
        let relationtype = event === null ? null : event.value;
        this.setState({ relationtype });
    }

    handleStartDateChange = (event) => {
        let startdate = event === null ? null : event;
        this.setState({ startdate });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, specialfielddisabled } = this.state;
        const { optionsRelationType, startdate, active, memberrelationid } = this.state;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
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
                                            <label className="col-sm-4 col-form-label" htmlFor="relationtype-view">Relation Type </label>
                                            <div className="col-sm-8">
                                                <Select2 reference="relationtype" className="reactSelect2" id="relationtype-view" options={optionsRelationType} onChange={this.handleRelationTypeChange} value={optionsRelationType.filter(({ value }) => value === 'CORPORATE')} disabled ></Select2>
                                                <span className="text-danger">{errors["relationtype"]}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number </label>
                                            <div className="col-sm-8">
                                                <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" maxLength="45" disabled={specialfielddisabled} />
                                                <span className="text-danger">{errors["cardnumber"]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="startdate-view">Start Date </label>
                                            <div className="col-sm-8">
                                                <Datepicker className="form-control" onChange={this.handleStartDateChange} selected={startdate} dateFormat={"DD/MM/YYYY"} disabled={specialfielddisabled} />
                                                <span className="text-danger">{errors["startdate"]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer text-center">
                                    {
                                        (actionspage === 'create') ?
                                            <Button type="submit" label="Save" className="btn btn-outline-dark normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button> : null
                                    }
                                    {
                                        (actionspage !== 'create') ?
                                            (active) ?
                                                <Button type="button" label="Deactivate" className="btn btn-danger normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(memberrelationid, active)} /> :
                                                <Button type="button" label="Activate" className="btn btn-primary normal mr-2" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(memberrelationid, active)} /> : ""
                                    }
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