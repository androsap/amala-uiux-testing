import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { SaveRequest, RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import ErrorGeneral from '../error/ErrorGeneral';
import Breadcrumb from '../../components/Breadcrumb';
import Select2 from '../../components/Select2';
import Datepicker from '../../components/Datepicker';
import moment from 'moment';
import RequestHistory from '../rc_requesthistory/RequestHistory';
import ReactModal from 'react-responsive-modal';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import { getOptionsDeactive } from '../../utilities/Helpers';

var permissionList = _getUserPermission();
var menuname = 'rcpartner';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Partner Retro Claim Request Detail',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            specialfielddisabled: false,
            retroclaimid: this.props.match.params.ID,
            airlinecode: null,
            optionsAirline: [],
            origin: null,
            destination: null,
            optionsAirport: [],
            optionsOrigin: [],
            optionsDestination: [],
            compartmentcode: null,
            optionsCompartment: [],
            subclasscode: null,
            optionsSubclass: [],
            departuredate: null,
            //request log//
            reqinfo: null,
            createdby: null,
            createddate: null,
            updatedby: null,
            updateddate: null,
            channel: null,
            retrofrom: null,
            tickoffid: null,
            approvalby: null,
            approvalreason: null,
            compartmentcodedisabled: true,
            subclasscodedisabled: true,
            isLoadingSelect2: {
                airline: false,
                origin: false,
                destination: false,
                compartment: false,
                subclass: false
            }
        };
    }

    handleValidation(field, actiontype) {
        let errors = {};
        let status = true;
        const { formtype, subclasscodedisabled } = this.state;

        if (formtype === 'approval' && actiontype === 'approve') {
            //compartmentcode
            if (!field['compartmentcode']) {
                errors['compartmentcode'] = 'Required';
            }

            //subclasscode
            if (!field['subclasscode'] && !subclasscodedisabled) {
                errors['subclasscode'] = 'Required';
            }

            //approvalreason
            if (!field['approvalreason']) {
                errors['approvalreason'] = 'Required';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        let formtype = this.props.match.params.TYPE;
        if (id) {
            let titlepage = 'Edit Partner Retro Claim Request';
            let actionspage = 'update';
            let specialfielddisabled = false;
            let compartmentcodedisabled = false;
            let subclasscodedisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage) || formtype !== 'approval') {
                titlepage = 'Partner Retro Claim Request Detail';
                actionspage = 'view';
                specialfielddisabled = true;
                compartmentcodedisabled = true;
                subclasscodedisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, specialfielddisabled, compartmentcodedisabled, subclasscodedisabled, formtype });
            this.getDetail(id);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getOptionsAirline();
                this.getOptionsAirport();
                this.getOptionsCompartment();
                this.getOptionsSubclass();
                this.getOptionsAirport();
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

    handleOpenModal = (retroclaimid) => {
        this.setState({ showModal: true, retroclaimid });
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
        this.getDetail();
    }

    getDetail(retroclaimid) {
        let url = api.url.retroclaim.list;
        let paging = {};
        let column = [];
        let criteria = { retroclaimid };
        let sort = {};
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                if (result.length !== 0) {
                    this.refs.cardnumber.value = (result[0].cardnumber) ? result[0].cardnumber : '';
                    let paxfirstname = (result[0].paxfirstname) ? result[0].paxfirstname : '';
                    let paxlastname = (result[0].paxlastname) ? result[0].paxlastname : '';
                    this.refs.membername.value = paxfirstname + ' ' + paxlastname;
                    this.refs.ticketname.value = (result[0].ticketname) ? result[0].ticketname : '';
                    this.refs.fltnumber.value = (result[0].operatingfltnumber) ? result[0].operatingfltnumber : '';
                    this.refs.ticketnumber.value = (result[0].ticketnumber) ? result[0].ticketnumber : '';
                    this.refs.approvalreason.value = (result[0].approvalreason) ? result[0].approvalreason : '';

                    let airlinecode = (result[0].operatingairline) ? result[0].operatingairline : null;
                    let airlinename = (result[0].operatingairlinename) ? result[0].operatingairlinename : null;
                    let departuredate = (result[0].departuredate) ? moment(result[0].departuredate) : null;
                    let origin = (result[0].origin) ? result[0].origin : null;
                    let destination = (result[0].destination) ? result[0].destination : null;
                    let compartmentcode = this.state.compartmentcode;
                    let subclasscode = (this.state.formtype !== 'approval') ? result[0].cabinclasscode : null;

                    let compartmentcodedisabled = airlinecode ? false : true;
                    let subclasscodedisabled = compartmentcode ? false : true;
                    this.setState({
                        airlinecode, airlinename, subclasscode, departuredate, origin, destination,
                        compartmentcodedisabled, subclasscodedisabled,
                        reqinfo: (result[0].reqinfo) ? result[0].reqinfo : '-',
                        createdby: (result[0].createdBy) ? result[0].createdBy : '-',
                        createddate: (result[0].createdDate) ? moment(result[0].createdDate).format('DD/MM/YYYY') : '-',
                        updatedby: (result[0].updatedBy) ? result[0].updatedBy : '-',
                        updateddate: (result[0].updatedDate) ? moment(result[0].updatedDate).format('DD/MM/YYYY') : '-',
                        channel: (result[0].channel) ? result[0].channel : '-',
                        retrofrom: (result[0].retrofrom) ? result[0].retrofrom : '-',
                        tickoffid: (result[0].tickoffid) ? result[0].tickoffid : '-',
                        approvalby: (result[0].approvalby) ? result[0].approvalby : '-',
                        approvalreason: (result[0].approvalreason) ? result[0].approvalreason : '-',
                        loading: false
                    },
                        this.getOptionsAirline(),
                        this.getOptionsAirport(),
                        this.getOptionsCompartment(airlinecode),
                        this.getOptionsSubclass(),
                        this.getOptionsAirport()
                    );
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

    saveAction = (e, type) => {
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
        formData['compartmentcode'] = this.state.compartmentcode;
        formData['subclasscode'] = this.state.subclasscode;
        if (this.handleValidation(formData, type)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let retroclaimid = this.props.match.params.ID;
            let compartmentcode = formData.compartmentcode;
            let cabinclasscode = formData.subclasscode;
            let approvalreason = formData.approvalreason;

            let reqinfo = '';
            let message = '';
            if (type === 'approve') {
                reqinfo = 'OVERRIDE_APPROVED_BY_USER';
                message = 'Data has been approved';
            } else if (type === 'reject') {
                reqinfo = 'OVERRIDE_REJECTED_BY_USER';
                message = 'Data has been rejected';
            } else if (type === 'verify') {
                reqinfo = 'WAITING_FOR_MANUAL_VERIFICATION';
                message = 'Data has been verified';
            }
            let url = api.url.retroclaim.updatereqinfo;
            let data = { retroclaimid, reqinfo, compartmentcode, cabinclasscode, approvalreason };

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/retro-claim-partner/form/' + retroclaimid);
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

    getOptionsAirline(actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            airlinename: 'asc'
        };
        let criteria = {};
        let url = api.url.airline.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsAirline = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.airlinename;
                    result2['value'] = obj.airlinecode;
                    return result2;
                });

                //if options deactive
                //marketing airline
                const { airlinecode, airlinename } = this.state;
                optionsAirline = getOptionsDeactive(actionspage, optionsAirline, airlinecode, airlinename);

                this.setState(prevState => ({
                    optionsAirline,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsAirport() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            cityname: 'asc'
        };
        let criteria = {};
        let url = api.url.airport.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsAirport = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cityname + " (" + obj.airportiatacode + "), " + obj.airportname;
                    result2['value'] = obj.airportiatacode;
                    return result2;
                });

                //if options deactive
                const { actionspage } = this.state;
                //first airport
                const { origin, originairportname, origincityname } = this.state;
                let originlabel = origincityname + " (" + origin + "), " + originairportname;
                let optionsOrigin = [...optionsAirport];
                optionsOrigin = getOptionsDeactive(actionspage, optionsOrigin, origin, originlabel);

                //second airport
                const { destination, destinationairportname, destinationcityname } = this.state;
                let destinationlabel = destinationcityname + " (" + destination + "), " + destinationairportname;
                let optionsDestination = [...optionsAirport];
                optionsDestination = getOptionsDeactive(actionspage, optionsDestination, destination, destinationlabel);

                this.setState(prevState => ({
                    optionsAirport,
                    optionsOrigin,
                    optionsDestination,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsCompartment(airlinecode) {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            compartmentcode: 'asc'
        };
        let criteria = { airlinecode };
        let url = api.url.compartment.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, compartment: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsCompartment = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.compartmentcode;
                    result2['value'] = obj.compartmentcode;
                    return result2;
                })

                let compartmentcodedisabled = (this.state.airlinecode) ? false : true;
                this.setState(prevState => ({
                    compartmentcodedisabled,
                    optionsCompartment,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, compartment: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsSubclass(compartmentcode) {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            subclasscode: 'asc'
        };
        let criteria = { compartmentcode };
        let url = api.url.subclass.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, subclass: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsSubclass = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.subclasscode;
                    result2['value'] = obj.subclasscode;
                    return result2;
                })

                let subclasscodedisabled = (this.state.compartmentcode) ? false : true;
                this.setState(prevState => ({
                    optionsSubclass,
                    subclasscodedisabled,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, subclass: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    handleCompartmentChange = (event) => {
        let compartmentcode = event === null ? null : event.value;
        let subclasscode = null;
        let subclasscodedisabled = true;
        if (compartmentcode) { this.getOptionsSubclass(compartmentcode); }
        this.setState({ compartmentcode, subclasscode, subclasscodedisabled });
    }

    handleSubclassChange = (event) => {
        let subclasscode = event === null ? null : event.value;
        this.setState({ subclasscode });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, isLoadingSelect2, specialfielddisabled, compartmentcodedisabled, subclasscodedisabled, formtype, showModal } = this.state;
        const { retroclaimid, airlinecode, optionsAirline, compartmentcode, optionsCompartment, optionsSubclass, subclasscode, departuredate, optionsOrigin, optionsDestination, origin, destination } = this.state;
        const { reqinfo, createdby, createddate, updatedby, updateddate, channel, retrofrom, tickoffid, approvalby } = this.state;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
                    <Breadcrumb path="Accrual Data Management / Retro Claim / Partner Retro Claim " />
                    <ReactModal open={showModal} onClose={this.handleCloseModal} center>
                        <div className="modal-lg">
                            <RequestHistory id={retroclaimid} closeModal={this.handleCloseModal} closeModalRefresh={this.handleCloseModalRefresh} />
                        </div>
                    </ReactModal>
                    <div className="main-panel">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h1 className="title-has-control mt-2">{titlepage}</h1>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-12">
                                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                    <Loader value={loading} />
                                    <div className="member-section">
                                        <label className="main-label mb-3">Retro Claim Info</label>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" disabled />
                                                        <span className="text-danger">{errors["cardnumber"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="membername-view">Member Name </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="membername-view" ref="membername" disabled />
                                                        <span className="text-danger">{errors["membername"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="ticketname-view">Name on Ticket </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="ticketname-view" ref="ticketname" disabled />
                                                        <span className="text-danger">{errors["ticketname"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="airlinecode-view">Airline </label>
                                                    <div className="col-sm-8">
                                                        <Select2 reference="airlinecode" className="reactSelect2" id="airlinecode-view" options={optionsAirline} onChange={this.handleAirlineChange} value={optionsAirline.filter(({ value }) => value === airlinecode)} disabled isLoading={isLoadingSelect2.airline}></Select2>
                                                        <span className="text-danger">{errors["airlinecode"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="fltnumber-view">Flight Number </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="fltnumber-view" ref="fltnumber" disabled />
                                                        <span className="text-danger">{errors["fltnumber"]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="ticketnumber-view">Ticket Number </label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" type="text" id="ticketnumber-view" ref="ticketnumber" disabled />
                                                        <span className="text-danger">{errors["ticketnumber"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="departuredate-view">Departure Date </label>
                                                    <div className="col-sm-8">
                                                        <Datepicker className="form-control" onChange={this.handleDepartureDateChange} selected={departuredate} dateFormat={"DD/MM/YYYY"} disabled maxDate={moment(new Date())} /><br />
                                                        <span className="text-danger">{errors["departuredate"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="origin-view">Origin </label>
                                                    <div className="col-sm-8">
                                                        <Select2 reference="origin" className="reactSelect2" id="origin-view" options={optionsOrigin} onChange={this.handleOriginChange} value={optionsOrigin.filter(({ value }) => value === origin)} disabled isLoading={isLoadingSelect2.airport}></Select2>
                                                        <span className="text-danger">{errors["origin"]}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="destination-view">Destination </label>
                                                    <div className="col-sm-8">
                                                        <Select2 reference="destination" className="reactSelect2" id="destination-view" options={optionsDestination} onChange={this.handleDestinationChange} value={optionsDestination.filter(({ value }) => value === destination)} disabled isLoading={isLoadingSelect2.airport}></Select2>
                                                        <span className="text-danger">{errors["destination"]}</span>
                                                    </div>
                                                </div>
                                                {(actionspage !== 'view') ?
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="compartmentcode-view">Compartment </label>
                                                        <div className="col-sm-8">
                                                            <Select2 reference="compartmentcode" className="reactSelect2" id="compartmentcode-view" options={optionsCompartment} onChange={this.handleCompartmentChange} value={optionsCompartment.filter(({ value }) => value === compartmentcode)} disabled={compartmentcodedisabled} isLoading={isLoadingSelect2.compartment}></Select2>
                                                            <span className="text-danger">{errors["compartmentcode"]}</span>
                                                        </div>
                                                    </div> : ''
                                                }
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label" htmlFor="subclasscode-view">Booking Class </label>
                                                    <div className="col-sm-8">
                                                        <Select2 reference="subclasscode" className="reactSelect2" id="subclasscode-view" options={optionsSubclass} onChange={this.handleSubclassChange} value={optionsSubclass.filter(({ value }) => value === subclasscode)} disabled={subclasscodedisabled} isLoading={isLoadingSelect2.subclass}></Select2>
                                                        <span className="text-danger">{errors["subclasscode"]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <label className="main-label mb-3 mt-3">Request Log</label>
                                        <div className="text-right">
                                            <button type="button" onClick={() => this.handleOpenModal(retroclaimid)} title="Request History" className="btn btn-sm btn-info"><i className="mdi mdi-history"></i> Request History</button>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Request Info </label>
                                                    <div className="col-sm-8"> {reqinfo} </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Created by </label>
                                                    <div className="col-sm-8"> {createdby} </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Created Date </label>
                                                    <div className="col-sm-8"> {(createddate)} </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Updated by </label>
                                                    <div className="col-sm-8"> {updatedby} </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Updated Date </label>
                                                    <div className="col-sm-8"> {updateddate} </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Created Channel </label>
                                                    <div className="col-sm-8"> {channel} - {retrofrom} </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Created Ticket Office </label>
                                                    <div className="col-sm-8"> {tickoffid} </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Approved/Rejected by </label>
                                                    <div className="col-sm-8"> {approvalby} </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4">Approved/Rejected Reason </label>
                                                    <div className="col-sm-8">
                                                        <textarea rows="3" className="form-control" type="text" id="approvalreason-view" ref="approvalreason" maxLength="255" disabled={specialfielddisabled} />
                                                        <span className="text-danger">{errors["approvalreason"]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer text-center">
                                        {(formtype === 'approval') ? <button type="button" className="btn btn-primary normal mr-2" onClick={(e) => this.saveAction(e, 'approve')}>Approve</button> : ''}
                                        {(formtype === 'approval') ? <button type="button" className="btn btn-danger normal mr-2" onClick={(e) => this.saveAction(e, 'reject')}>Reject</button> : ''}
                                        {(formtype === 'manual-verification') ? <button type="submit" className="btn btn-primary normal mr-2" onClick={(e) => this.saveAction(e, 'verify')}>Manual Verification</button> : ''}
                                        <Link to="/retro-claim-partner" className="btn btn-outline-dark normal">Back</Link>
                                    </div>
                                </form>
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