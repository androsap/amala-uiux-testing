import React, { Component } from 'react';
import { RetrieveRequest } from '../../../../utilities/RequestService';
import Alert from '../../../../components/Alert';
import { api } from '../../../../config/Services';
import Loader from '../../../../components/Loader';
import Datepicker from '../../../../components/Datepicker';
import Select2 from '../../../../components/Select2';
import moment from 'moment';
import RequestHistory from '../../../rc_requesthistory/RequestHistory';
import ReactModal from 'react-responsive-modal';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { getOptionsDeactive } from '../../../../utilities/Helpers';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Retro Claim Request Detail',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            activityid: '',
            retroclaimid: this.props.getStore().activityid,
            airlinecode: null,
            optionsAirline: [],
            origin: null,
            destination: null,
            optionsAirport: [],
            optionsOrigin: [],
            optionsDestination: [],
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
            isLoadingSelect2: {
                airline: false,
                origin: false,
                destination: false,
                subclass: false
            }
        }
        this.refresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.props.getStore().activityid;
        if (id) {
            let titlepage = 'View Retro Claim';
            let actionspage = 'view';
            let generalfielddisabled = true;
            this.setState({ titlepage, actionspage, generalfielddisabled });
            this.getDetail(id, actionspage);
        } else {
            // if (_checkPermission(permissionList, menuname, "create")) {
            // this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            // } else {
            this.getOptionsAirline();
            this.getOptionsAirport();
            this.getOptionsSubclass();
            this.getOptionsAirport();

            //default cardnumber
            this.refs.cardnumber.value = (this.props.getStore().cardnumber) ? this.props.getStore().cardnumber : '';
            // }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    handleOpenModal = (retroclaimid) => {
        this.setState({ showModal: true, retroclaimid: retroclaimid });
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
                    let subclasscode = result[0].operatingbookingsubclass ? result[0].operatingbookingsubclass : null;
                    let origin = (result[0].origin) ? result[0].origin : null;
                    let originairportname = (result[0].originairport.airtportname) ? result[0].originairport.airtportname : null;
                    let origincityname = (result[0].originairport.cityname) ? result[0].originairport.cityname : null;
                    let destination = (result[0].destination) ? result[0].destination : null;
                    let destinationairportname = (result[0].destinationairport.airtportname) ? result[0].destinationairport.airtportname : null;
                    let destinationcityname = (result[0].destinationairport.cityname) ? result[0].destinationairport.cityname : null;
                    this.setState({
                        airlinecode, airlinename, subclasscode, departuredate,
                        origin, originairportname, origincityname, destination, destinationairportname, destinationcityname,
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

    getOptionsSubclass() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            subclasscode: 'asc'
        };
        let criteria = {};
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

                this.setState(prevState => ({
                    optionsSubclass,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, subclass: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    handleRefreshMainPage = () => {
        this.refresh.current.click();
    }

    getOptionsBookingClass(actionspage = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            subclasscode: 'asc'
        };
        let criteria = {};
        let url = api.url.subclass.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, bookingclass: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsBookingClass = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.subclasscode;
                    result2['value'] = obj.subclasscode;
                    return result2;
                });

                //if options deactive
                //bookingclass
                const { subclasscode } = this.state;
                optionsBookingClass = getOptionsDeactive(actionspage, optionsBookingClass, subclasscode, subclasscode);

                this.setState(prevState => ({
                    optionsBookingClass,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, bookingclass: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    handleBackClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage
        });
    }

    render() {
        const { titlepage, formrender, errors, loading, isLoadingSelect2, showModal } = this.state;
        const { retroclaimid, airlinecode, optionsAirline, optionsSubclass, subclasscode, departuredate, optionsOrigin, optionsDestination, origin, destination } = this.state;
        const { reqinfo, createdby, createddate, updatedby, updateddate, channel, retrofrom, tickoffid, approvalby } = this.state;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="member-section">
                    <ReactModal open={showModal} onClose={this.handleCloseModal} center>
                        <div className="modal-lg">
                            <RequestHistory id={retroclaimid} closeModal={this.handleCloseModal} closeModalRefresh={this.handleCloseModalRefresh} />
                        </div>
                    </ReactModal>
                    <div className="content-title flex-hr mt-0 mb-0 title-description">
                        <h1 className="title-has-control mt-2">{titlepage}</h1>
                    </div>
                    <hr className="mt-0" />
                    <div className="card-table">
                        <form className="clearfix position-relative" onSubmit={(e) => e.preventDefault()} autoComplete="off">
                            <Loader value={loading} />
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
                                            <Select2 reference="airlinecode" className="reactSelect2" id="airlinecode-view" options={optionsAirline} value={optionsAirline.filter(({ value }) => value === airlinecode)} disabled isLoading={isLoadingSelect2.airline}></Select2>
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
                                            <Datepicker className="form-control" selected={departuredate} dateFormat={"DD/MM/YYYY"} disabled maxDate={moment(new Date())} /><br />
                                            <span className="text-danger">{errors["departuredate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="origin-view">Origin </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="origin" className="reactSelect2" id="origin-view" options={optionsOrigin} value={optionsOrigin.filter(({ value }) => value === origin)} disabled isLoading={isLoadingSelect2.airport}></Select2>
                                            <span className="text-danger">{errors["origin"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="destination-view">Destination </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="destination" className="reactSelect2" id="destination-view" options={optionsDestination} value={optionsDestination.filter(({ value }) => value === destination)} disabled isLoading={isLoadingSelect2.airport}></Select2>
                                            <span className="text-danger">{errors["destination"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="subclasscode-view">Subclass </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="subclasscode" className="reactSelect2" id="subclasscode-view" options={optionsSubclass} value={optionsSubclass.filter(({ value }) => value === subclasscode)} disabled isLoading={isLoadingSelect2.subclass}></Select2>
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
                                            <textarea rows="3" className="form-control" type="text" id="approvalreason-view" ref="approvalreason" maxLength="255" disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer text-center">
                                <button type="button" ref={this.refresh} onClick={this.props.refreshMainPage} className="hidden">Close Refresh</button>
                                <button type="button" onClick={() => (this.handleBackClick('retroclaimindex'))} className="btn btn-outline-dark normal">Back</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;