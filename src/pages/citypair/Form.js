import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SaveRequest, RetrieveRequest, DeleteRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import { api } from '../../config/Services';
import Loader from '../../components/Loader';
import Select2 from '../../components/Select2';
import ErrorGeneral from '../error/ErrorGeneral';
import Breadcrumb from '../../components/Breadcrumb';
import Datepicker from '../../components/Datepicker';
import moment from 'moment';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import { getOptionsDeactive } from '../../utilities/Helpers';

var permissionList = _getUserPermission();
var menuname = 'citypair';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create City Pair',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            specialfielddisabled: false,
            generalfielddisabled: false,
            active: false,
            citypaircode: null,
            airlinecode: null,
            optionsAirline: [],
            optionsAirport: [],
            firstairportcode: null,
            optionsFirstAirport: [],
            secondairportcode: null,
            optionsSecondAirport: [],
            optionsState: [],
            startdate: null,
            enddate: null,
            route: null,
            optionsRoute: [
                { label: 'Domestic', value: 'DOMESTIC' },
                { label: 'International', value: 'INTERNATIONAL' },
                // { label: 'Both', value: 'BOTH' }
            ],
            isLoadingSelect2: {
                airline: false,
                city: false
            }
        };
    }

    handleValidation(field) {
        let errors = {};
        let status = true;
        let today = moment(new Date());

        //airlinecode
        if (!field['airlinecode']) {
            errors['airlinecode'] = 'Required';
        }

        //firstairportcode
        if (!field['firstairportcode']) {
            errors['firstairportcode'] = 'Required';
        }

        //secondairportcode
        if (!field['secondairportcode']) {
            errors['secondairportcode'] = 'Required';
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

        //route
        if (!field['route']) {
            errors['route'] = 'Required';
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
            let titlepage = 'Edit City Pair';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View City Pair';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, specialfielddisabled, generalfielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getOptionAirline();
                this.getOptionAirport();
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

    getDetail(citypaircode, actionspage) {
        let url = api.url.citypair.list;
        let paging = {};
        let column = [];
        let criteria = { citypaircode };
        let sort = {};
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let citypaircode = (result[0].citypaircode !== undefined) ? result[0].citypaircode : null;
                    let airlinecode = (result[0].airlinecode !== undefined) ? result[0].airlinecode : null;
                    let airlinename = (result[0].airlinename !== undefined) ? result[0].airlinename : null;

                    let firstairportcode = (result[0].firstairportcode !== undefined) ? result[0].firstairportcode : null;
                    let firstairportname = (result[0].firstairportname !== undefined) ? result[0].firstairportname : null;
                    let firstcityname = (result[0].firstcityname !== undefined) ? result[0].firstcityname : null;

                    let secondairportcode = (result[0].secondairportcode !== undefined) ? result[0].secondairportcode : null;
                    let secondairportname = (result[0].secondairportname !== undefined) ? result[0].secondairportname : null;
                    let secondcityname = (result[0].secondcityname !== undefined) ? result[0].secondcityname : null;

                    let startdate = (result[0].startdate !== undefined) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate !== undefined) ? moment(result[0].enddate) : null;
                    let route = (result[0].route !== undefined) ? result[0].route : null;

                    let active = (result[0].active !== undefined) ? result[0].active : false;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    this.setState({
                        loading: false,
                        citypaircode,
                        airlinecode, airlinename,
                        firstairportcode, firstairportname, firstcityname,
                        secondairportcode, secondairportname, secondcityname,
                        startdate, enddate, route,
                        active, generalfielddisabled
                    },
                        this.getOptionAirline(),
                        this.getOptionAirport());
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
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
        formData['airlinecode'] = this.state.airlinecode;
        formData['firstairportcode'] = this.state.firstairportcode;
        formData['secondairportcode'] = this.state.secondairportcode;
        formData['startdate'] = this.state.startdate;
        formData['enddate'] = this.state.enddate;
        formData['route'] = this.state.route;

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let airlinecode = formData.airlinecode;
            let firstairportcode = formData.firstairportcode;
            let secondairportcode = formData.secondairportcode;
            let citypaircode = airlinecode + firstairportcode + secondairportcode;
            let startdate = moment(formData.startdate).format("YYYY-MM-DD");
            let enddate = moment(formData.enddate).format("YYYY-MM-DD");
            let route = formData.route;

            let data = '';
            let message = ''
            let url = '';
            if (actionspage === 'create') {
                message = 'New data has been created';
                url = api.url.citypair.create;
                data = { citypaircode, airlinecode, firstairportcode, secondairportcode, startdate, enddate, route };
            } else {
                citypaircode = this.props.match.params.ID;
                message = 'Data has been updated';
                url = api.url.citypair.update;
                data = { citypaircode, airlinecode, firstairportcode, secondairportcode, startdate, enddate, route };
            }

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/city-pair/form/' + response.result.citypaircode);
                        //after action, check permission
                        this.checkPermission();
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ loading: false });
                })
            }
        }
    };

    getOptionAirline() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            airlinename: 'asc'
        };
        let criteria = {
            active: true
        };
        let url = api.url.airline.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsAirline = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.airlinename;
                    result2['value'] = obj.airlinecode;
                    return result2;
                });

                //if options deactive
                const { airlinecode, airlinename, actionspage } = this.state;
                optionsAirline = getOptionsDeactive(actionspage, optionsAirline, airlinecode, airlinename);

                this.setState(prevState => ({
                    optionsAirline,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airline: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionAirport() {
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
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, city: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                var optionsAirport = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cityname + " (" + obj.airportiatacode + "), " + obj.airportname;
                    result2['value'] = obj.airportiatacode;
                    return result2;
                });

                //if options deactive
                const { actionspage } = this.state;
                //first airport
                const { firstairportcode, firstairportname, firstcityname } = this.state;
                let firstairportlabel = firstcityname + " (" + firstairportcode + "), " + firstairportname;
                let optionsFirstAirport = [...optionsAirport];
                optionsFirstAirport = getOptionsDeactive(actionspage, optionsFirstAirport, firstairportcode, firstairportlabel);

                //second airport
                const { secondairportcode, secondairportname, secondcityname } = this.state;
                let secondairportlabel = secondcityname + " (" + secondairportcode + "), " + secondairportname;
                let optionsSecondAirport = [...optionsAirport];
                optionsSecondAirport = getOptionsDeactive(actionspage, optionsAirport, secondairportcode, secondairportlabel);

                this.setState(prevState => ({
                    optionsAirport,
                    optionsFirstAirport,
                    optionsSecondAirport,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, city: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    deleteData(citypaircode, active) {
        let url = (active) ? api.url.citypair.deactivate : api.url.citypair.activate;
        let data = { citypaircode };
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

    handleAirlineChange = (event) => {
        let airlinecode = event === null ? null : event.value;
        this.setState({ airlinecode });
    }

    handleFilterFirstSecond = (type, value) => {
        let temp = [];
        this.state.optionsAirport.forEach(obj => {
            if (value !== obj.value) temp.push(obj);
        });
        if (type === 'firstairportcode') this.setState({ optionsSecondAirport: temp });
        else if (type === 'secondairportcode') this.setState({ optionsFirstAirport: temp });
    }

    handleFirstAirportChange = (event) => {
        let firstairportcode = event === null ? null : event.value;
        this.setState({ firstairportcode });

        this.handleFilterFirstSecond('firstairportcode', firstairportcode);
    }

    handleSecondAirportChange = (event) => {
        let secondairportcode = event === null ? null : event.value;
        this.setState({ secondairportcode });
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

    handleRouteChange = (event) => {
        let route = event === null ? null : event.target.value;
        this.setState({ route });
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.value;
        this.setState({ status });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, specialfielddisabled, generalfielddisabled, isLoadingSelect2 } = this.state;
        const { airlinecode, optionsAirline, firstairportcode, optionsFirstAirport, secondairportcode, optionsSecondAirport, startdate, enddate, route, optionsRoute } = this.state;
        const { citypaircode, active } = this.state;
        //route data
        var routedata = optionsRoute.map((val, key) =>
            <label className="col-sm-4 col-form-label" htmlFor={val.value + "-" + key} key={val.value + "-" + key}>
                <input name="route" ref="" value={val.value} id={val.value + "-" + key} type="radio" onChange={this.handleRouteChange} checked={route === val.value} disabled={specialfielddisabled} />
                &nbsp;&nbsp;&nbsp;{val.label}
            </label>
        );

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Partner Management / City Pair" />
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
                                                <label className="col-sm-4 col-form-label" htmlFor="airlinecode-view">Airline </label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="airlinecode" className="reactSelect2" id="airlinecode-view" options={optionsAirline} onChange={this.handleAirlineChange} value={optionsAirline.filter(({ value }) => value === airlinecode)} disabled={specialfielddisabled} isLoading={isLoadingSelect2.airline}></Select2>
                                                    <span className="text-danger">{errors["airlinecode"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="firstairportcode-view">First Airport </label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="firstairportcode" className="reactSelect2" id="firstairportcode-view" options={optionsFirstAirport} onChange={this.handleFirstAirportChange} value={optionsFirstAirport.filter(({ value }) => value === firstairportcode)} disabled={specialfielddisabled} isLoading={isLoadingSelect2.city}></Select2>
                                                    <span className="text-danger">{errors["firstairportcode"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="secondairportcode-view">Second Airport </label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="secondairportcode" className="reactSelect2" id="secondairportcode-view" options={optionsSecondAirport} onChange={this.handleSecondAirportChange} value={optionsSecondAirport.filter(({ value }) => value === secondairportcode)} disabled={specialfielddisabled} isLoading={isLoadingSelect2.city}></Select2>
                                                    <span className="text-danger">{errors["secondairportcode"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label">Route </label>
                                                <div className="col-sm-8">
                                                    <div className="row">
                                                        {routedata}
                                                    </div>
                                                    <span className="text-danger">{errors["route"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group row">
                                                <label className="col-md-4 form-label" htmlFor="startdate-view">Start Date</label>
                                                <div className="col-sm-8">
                                                    <Datepicker className="form-control" onChange={this.handleStartDateChange} selected={startdate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={moment(new Date()).add(1, 'days')} />
                                                    <span className="text-danger">{errors["startdate"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-4 form-label" htmlFor="enddate-view">End Date</label>
                                                <div className="col-sm-8">
                                                    <Datepicker className="form-control" onChange={this.handleEndDateChange} selected={enddate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} minDate={moment(startdate)} />
                                                    <span className="text-danger">{errors["enddate"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer text-center">
                                    {
                                            ((actionspage === 'create') || (actionspage === 'update' && active)) ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                        }
                                        &nbsp;&nbsp;
                                        {
                                            (actionspage === 'update') ?
                                                (active) ?
                                                    <button type="button" className="btn btn-danger normal" onClick={() => this.deleteData(citypaircode, active)}>Deactivate</button> :
                                                    <button type="button" className="btn btn-primary normal" onClick={() => this.deleteData(citypaircode, active)}>Activate</button> : ""
                                        }
                                        &nbsp;&nbsp;
		                                <Link to="/city-pair" className="btn btn-outline-dark normal">Back</Link>
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