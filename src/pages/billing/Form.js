import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SaveRequest, RetrieveRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import { api } from '../../config/Services';
import Loader from '../../components/Loader';
import ErrorGeneral from '../error/ErrorGeneral';
import Breadcrumb from '../../components/Breadcrumb';
import Select2 from '../../components/Select2';
import Datepicker from '../../components/Datepicker';
import moment from 'moment';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import { getOptionsDeactive } from '../../utilities/Helpers';

var permissionList = _getUserPermission();
var menuname = 'accrualruleod';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Accrual Rule - Origin Destination',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            optionsPartner: [],
            optionsActivityCode: [],
            optionsAirport: [],
            optionsAirportOrigin: [],
            optionsAirportDestination: [],
            optionsAirlines: [],
            optionsRouteType: [
                { value: 'INTERNATIONAL', label: 'International' },
                { value: 'DOMESTIC', label: 'Domestic' },
                { value: 'NOT_SPECIFIED', label: 'Not Specified' }
            ],
            routetype: null,
            marketingairline: null,
            partnercode: null,
            startdate: null,
            enddate: null,
            originairport: null,
            destinationairport: null,
            marketingairlinedisabled: true,
            isLoadingSelect2: {
                partner: false,
                airline: false,
                airport: false
            }
        };
    }

    handleValidation(field) {
        let errors = {};
        let status = true;
        let today = moment(new Date());

        //odrulename
        if (!field['odrulename']) {
            errors['odrulename'] = 'Required';
        } else if (field['odrulename'].length > 45) {
            errors['odrulename'] = 'Maximum 45 characters';
        }

        //partnercode
        if (!field['partnercode']) {
            errors['partnercode'] = 'Required';
        }

        //marketingairline
        if (!field['marketingairline']) {
            errors['marketingairline'] = 'Required';
        }

        //originairport
        if (!field['originairport']) {
            errors['originairport'] = 'Required';
        }

        //routetype
        if (!field['routetype']) {
            errors['routetype'] = 'Required';
        }

        //destinationairport
        if (!field['destinationairport']) {
            errors['destinationairport'] = 'Required';
        } else if (field['destinationairport'] === field['originairport']) {
            errors['destinationairport'] = 'Destination Airport can not be same with Origin Airport';
        }

        //tpm
        if (!field['tpm']) {
            errors['tpm'] = 'Required';
        } else if (!field['tpm'].match(/^[0-9]+$/)) {
            errors['tpm'] = 'Only numeric';
        } else if (field['tpm'].length > 11) {
            errors['tpm'] = 'Maximum 11 characters';
        }

        //startdate
        if (!field['startdate']) {
            errors['startdate'] = 'Required';
        } else if (field['startdate'] < today) {
            errors['startdate'] = 'The day after today';
        }

        //enddate
        if (!field['enddate']) {
            errors['enddate'] = 'Required';
        } else if (field['enddate'] < today) {
            errors['enddate'] = 'The day after today';
        } else if (moment(field['startdate']).format("YYYY/MM/DD") > moment(field['enddate']).format("YYYY/MM/DD")) {
            errors['enddate'] = 'End Date must be greater than Start Date';
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
            let titlepage = 'Edit Accrual Rule - Origin Destination';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Accrual Rule - Origin Destination';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, generalfielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getOptionsPartner();
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

    getDetail(odruleid, actionspage) {
        let url = api.url.accrualruleod.list;
        let paging = {};
        let column = [];
        let criteria = { odruleid };
        let sort = {};
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    this.refs.odrulename.value = (typeof result[0].odrulename !== undefined) ? result[0].odrulename : "";
                    this.refs.tpm.value = (typeof result[0].tpm !== undefined) ? result[0].tpm : "";
                    this.setState({
                        partnercode: result[0].partnercode ? result[0].partnercode : null,
                        partnername: result[0].partnername ? result[0].partnername : null,
                        marketingairline: result[0].marketingairline ? result[0].marketingairline : null,
                        marketingairlinename: result[0].marketingairlinename ? result[0].marketingairlinename : null,
                        startdate: result[0].startdate ? moment(result[0].startdate) : null,
                        enddate: result[0].enddate ? moment(result[0].enddate) : null,
                        originairport: result[0].originairport ? result[0].originairport : null,
                        destinationairport: result[0].destinationairport ? result[0].destinationairport : null,
                        origincityname: (result[0].originairport) ? result[0].originairport.cityname : null,
                        originairportname: (result[0].originairport) ? result[0].originairport.airportname : null,
                        destinationcityname: (result[0].originairport) ? result[0].originairport.cityname : null,
                        destinationairportname: (result[0].originairport) ? result[0].originairport.airportname : null,
                        routetype: (result[0].routetype) ? result[0].routetype : null,
                        loading: false,
                    },
                        this.getOptionsPartner(),
                        this.getOptionsAirport(),
                        this.getOptionsAirlines(result[0].partnercode, actionspage));
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    getOptionsPartner() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            partnername: 'asc'
        };
        let criteria = {
            partnertype: 'AIR',
            active: true
        };
        let url = api.url.partner.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, partner: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsPartner = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.partnername;
                    result2['value'] = obj.partnercode;
                    return result2;
                });

                //if options deactive
                const { partnercode, partnername, actionspage } = this.state;
                optionsPartner = getOptionsDeactive(actionspage, optionsPartner, partnercode, partnername);

                this.setState(prevState => ({
                    optionsPartner,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, partner: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsAirlines(partnercode = '', reselected = false) {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            airlinename: 'asc'
        };
        let criteria = {
            partnercode,
            active: true
        }
        let url = api.url.airline.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsAirlines = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.airlinename;
                    result2['value'] = obj.airlinecode;
                    return result2;
                });

                //if options deactive
                const { marketingairline, marketingairlinename, actionspage } = this.state;
                if (!reselected) { optionsAirlines = getOptionsDeactive(actionspage, optionsAirlines, marketingairline, marketingairlinename); }

                let marketingairlinedisabled = (actionspage === 'view') ? true : false;
                this.setState(prevState => ({
                    optionsAirlines,
                    marketingairlinedisabled,
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
        let criteria = {
            active: true
        };
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
                //origin
                const { origin, originairportname, origincityname } = this.state;
                let oriAirportlabel = origincityname + " (" + origin + "), " + originairportname;
                let optionsAirportOrigin = [...optionsAirport];
                optionsAirport = getOptionsDeactive(actionspage, optionsAirportOrigin, origin, oriAirportlabel);

                //destination
                const { destination, destinationairportname, destinationcityname } = this.state;
                let destAirportlabel = destinationcityname + " (" + destination + "), " + destinationairportname;
                let optionsAirportDestination = [...optionsAirport];
                optionsAirport = getOptionsDeactive(actionspage, optionsAirportDestination, destination, destAirportlabel);

                this.setState(prevState => ({
                    optionsAirport,
                    optionsAirportOrigin,
                    optionsAirportDestination,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: false }
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
        formData['partnercode'] = this.state.partnercode;
        formData['marketingairline'] = this.state.marketingairline;
        formData['originairport'] = this.state.originairport;
        formData['destinationairport'] = this.state.destinationairport;
        formData['startdate'] = this.state.startdate;
        formData['enddate'] = this.state.enddate;
        formData['routetype'] = this.state.routetype;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let odrulename = formData.odrulename;
            let type = "OD";
            let partnercode = formData.partnercode;
            let marketingairline = formData.marketingairline;
            let originairport = formData.originairport;
            let destinationairport = formData.destinationairport;
            let tpm = formData.tpm;
            let startdate = moment(formData.startdate).format("YYYY-MM-DD");
            let enddate = moment(formData.enddate).format("YYYY-MM-DD");
            let routetype = formData.routetype;

            let data = '';
            let message = '';
            let url = '';
            if (actionspage === 'create') {
                message = 'New data has been created';
                url = api.url.accrualruleod.create;
                data = { odrulename, type, partnercode, marketingairline, originairport, destinationairport, tpm, startdate, enddate, routetype };
            } else {
                let odruleid = this.props.match.params.ID;
                message = 'Data has been updated';
                url = api.url.accrualruleod.update;
                data = { odruleid, odrulename, type, partnercode, marketingairline, originairport, destinationairport, tpm, startdate, enddate, routetype };
            }

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/accrual-rule-od/form/' + response.result.odruleid);
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

    handleFilterOriginDestination = (type, value) => {
        let temp = [];
        this.state.optionsAirport.forEach(obj => {
            if (value !== obj.value) temp.push(obj);
        });
        if (type === 'origin') this.setState({ optionsAirportDestination: temp });
        else if (type === 'destination') this.setState({ optionsAirportOrigin: temp });
    }

    handlePartnerChange = (event) => {
        let partnercode = event === null ? null : event.value;
        let marketingairline = null;
        let marketingairlinedisabled = true;
        let optionsAirlines = [];
        this.setState({ partnercode, marketingairlinedisabled, marketingairline, optionsAirlines });
        if (partnercode) { this.getOptionsAirlines(partnercode, true); }
    }

    handleAirlinesChange = (event) => {
        let marketingairline = event === null ? null : event.value;
        this.setState({ marketingairline });
    }

    handleStartDateChange = (event) => {
        let startdate = event === null ? null : event;
        let enddate = null;
        this.setState({ startdate, enddate });
    }

    handleEndDateChange = (event) => {
        let enddate = event === null ? null : event;
        this.setState({ enddate });
    }

    handleOriginChange = (event) => {
        let originairport = event === null ? null : event.value;
        this.setState({ originairport });

        this.handleFilterOriginDestination('origin', originairport);
    }

    handleDestinationChange = (event) => {
        let destinationairport = event === null ? null : event.value;
        this.setState({ destinationairport });
    }

    handleRouteTypeChange = (event) => {
        let routetype = event === null ? null : event.value;
        this.setState({ routetype });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
        const { isLoadingSelect2, partnercode, optionsPartner, startdate, enddate, optionsAirportOrigin,
            optionsAirportDestination, originairport, destinationairport, optionsAirlines, marketingairline, optionsRouteType, routetype, marketingairlinedisabled } = this.state;
        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
                    <Breadcrumb path="Accrual Data Management / Accrual Rule / Origin Destination" />
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
                                                <label className="col-sm-4 col-form-label" htmlFor="odrulename-view">Rule Name</label>
                                                <div className="col-sm-8">
                                                    <input className="form-control" type="text" id="odrulename-view" ref="odrulename" maxLength="45" disabled={generalfielddisabled} />
                                                    <span className="text-danger">{errors["odrulename"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="partnercode-view">Partner</label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="partnercode" className="reactSelect2" id="partnercode-view" options={optionsPartner} onChange={this.handlePartnerChange} value={optionsPartner.filter(({ value }) => value === partnercode)} disabled={generalfielddisabled} isLoading={isLoadingSelect2.partner}></Select2>
                                                    <span className="text-danger">{errors["partnercode"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="marketingairline-view">Airline</label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="marketingairline" className="reactSelect2" id="marketingairline-view" options={optionsAirlines} onChange={this.handleAirlinesChange} value={optionsAirlines.filter(({ value }) => value === marketingairline)} disabled={marketingairlinedisabled} isLoading={isLoadingSelect2.airline}></Select2>
                                                    <span className="text-danger">{errors["marketingairline"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="originairport-view">Origin</label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="originairport" className="reactSelect2" id="originairport-view" options={optionsAirportOrigin} onChange={this.handleOriginChange} value={optionsAirportOrigin.filter(({ value }) => value === originairport)} disabled={generalfielddisabled} isLoading={isLoadingSelect2.airport}></Select2>
                                                    <span className="text-danger">{errors["originairport"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="destinationairport-view">Destination</label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="destinationairport" className="reactSelect2" id="destinationairport-view" options={optionsAirportDestination} onChange={this.handleDestinationChange} value={optionsAirportDestination.filter(({ value }) => value === destinationairport)} disabled={generalfielddisabled} isLoading={isLoadingSelect2.airport}></Select2>
                                                    <span className="text-danger">{errors["destinationairport"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="tpm-view">TPM</label>
                                                <div className="col-sm-8">
                                                    <input className="form-control" type="text" id="tpm-view" ref="tpm" maxLength="11" disabled={generalfielddisabled} />
                                                    <span className="text-danger">{errors["tpm"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-4 form-label" htmlFor="startdate-view">Start Date</label>
                                                <div className="col-sm-8">
                                                    <Datepicker className="form-control" onChange={this.handleStartDateChange} selected={startdate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={moment(new Date()).add(1, 'days')} /><br />
                                                    <span className="text-danger">{errors["startdate"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-4 form-label" htmlFor="enddate-view">End Date</label>
                                                <div className="col-sm-8">
                                                    <Datepicker className="form-control" onChange={this.handleEndDateChange} selected={enddate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={moment(startdate)} /><br />
                                                    <span className="text-danger">{errors["enddate"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="routetype-view">Route Type</label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="routetype" className="reactSelect2" id="routetype-view" options={optionsRouteType} onChange={this.handleRouteTypeChange} value={optionsRouteType.filter(({ value }) => value === routetype)} disabled={generalfielddisabled}></Select2>
                                                    <span className="text-danger">{errors["routetype"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer text-center">
                                        {
                                            (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                        }
                                        &nbsp;&nbsp;
										<Link to="/accrual-rule-od" className="btn btn-outline-dark normal">Back</Link>
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