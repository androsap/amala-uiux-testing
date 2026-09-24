import React, { Component } from 'react';
import Datepicker from '../../components/Datepicker';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import Select2 from '../../components/Select2';

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            countstaff: 0,
            travelcordinator: props.enrollmentcorporate.travelcordinator,
            optionsRole: [],
            isLoadingSelect2: {
                rolecode: false
            }
        };
    }

    isValidated() {
        let errors = {};
        let status = true;
        const userInput = this._grabUserInput();

        for (const field in userInput.travelcordinator) {
            // name
            if (!userInput.travelcordinator[field]['name']) {
                errors['name_' + field] = 'Required';
            } else if (userInput.travelcordinator[field]['name'].length > 45) {
                errors['name_' + field] = 'Maximum 45 characters';
            } else if (!userInput.travelcordinator[field]['name'].match(/^[a-zA-Z0-9\s]+$/)) {
                errors['name_' + field] = 'Only alphanumeric and space';
            }

            // username
            if (!userInput.travelcordinator[field]['username']) {
                errors['username_' + field] = 'Required';
            } else if (userInput.travelcordinator[field]['username'].length > 45) {
                errors['username_' + field] = 'Maximum 45 characters';
            } else if (!userInput.travelcordinator[field]['username'].match(/^[a-zA-Z0-9]+$/)) {
                errors['username_' + field] = 'Only alphanumeric';
            }

            // idcardnumber
            if (!userInput.travelcordinator[field]['idcardnumber']) {
                errors['idcardnumber_' + field] = 'Required';
            } else if (userInput.travelcordinator[field]['idcardnumber'].length > 45) {
                errors['idcardnumber_' + field] = 'Maximum 45 characters';
            } else if (!userInput.travelcordinator[field]['idcardnumber'].match(/^\+?([0-9])+$/)) {
                errors['idcardnumber_' + field] = 'Only numeric';
            }

            // cardnumber
            if (!userInput.travelcordinator[field]['cardnumber']) {
                errors['cardnumber_' + field] = 'Required';
            } else if (userInput.travelcordinator[field]['cardnumber'].length > 45) {
                errors['cardnumber_' + field] = 'Maximum 45 characters';
            } else if (!userInput.travelcordinator[field]['cardnumber'].match(/^\+?([0-9])+$/)) {
                errors['cardnumber_' + field] = 'Only numeric';
            }

            // phonenumber
            if (!userInput.travelcordinator[field]['phonenumber']) {
                errors['phonenumber_' + field] = 'Required';
            } else if (userInput.travelcordinator[field]['phonenumber'].length > 45) {
                errors['phonenumber_' + field] = 'Maximum 45 characters';
            } else if (!userInput.travelcordinator[field]['phonenumber'].match(/^\+?([0-9])+$/)) {
                errors['phonenumber_' + field] = 'Only numeric';
            }

            //email
            if (!userInput.travelcordinator[field]['email']) {
                errors['email_' + field] = 'Required';
            } else if (userInput.travelcordinator[field]['email'].length > 100) {
                errors['email_' + field] = 'Maximum 100 characters';
            } else if (!userInput.travelcordinator[field]['email'].match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                errors['email_' + field] = 'Invalid email address';
            }

            // birthdate
            if (!userInput.travelcordinator[field]['birthdate']) {
                errors['birthdate_' + field] = 'Required';
            }

            // rolecode
            if (!userInput.travelcordinator[field]['rolecode']) {
                errors['rolecode_' + field] = 'Required';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    _grabUserInput() {
        const { travelcordinator } = this.props.enrollmentcorporate;
        return { travelcordinator };
    }

    componentDidMount() {
        if (this.props.enrollmentcorporate.travelcordinator.length === 0) {
            let travelcordinator = { name: null, username: null, travelcordinatortype: "ADMIN", rolecode: null, idcardnumber: null, cardnumber: null, phonenumber: null, email: null, birthdate: null };
            this.props.addStaffTravelCordinator(travelcordinator);
        }
        this.getOptionsRole();
    }

    getOptionsRole() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            rolename: 'asc',

        };
        let criteria = {
            active: true
        };
        let url = api.url.role.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, rolecode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsRole = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.rolename;
                    result2['value'] = obj.rolecode;
                    return result2;
                });

                this.setState(prevState => ({
                    optionsRole,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, rolecode: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    addStaff() {
        let travelcordinator = { name: null, username: null, travelcordinatortype: "STAFF", rolecode: null, idcardnumber: null, cardnumber: null, phonenumber: null, email: null, birthdate: null };
        this.props.addStaffTravelCordinator(travelcordinator);
    }

    handleFieldChange = (event, number) => {
        let name = event.target.name ? event.target.name : null;
        let value = event.target.value ? event.target.value : null;
        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
        travelcordinator[number][name] = value;
        this.props.setTravelCordinator(travelcordinator, number);
    }

    handleDatehange = (event, number) => {
        let birthdate = event === null ? null : event;

        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
        travelcordinator[number]['birthdate'] = birthdate;
        this.props.setTravelCordinator(travelcordinator, number);
    }

    handleRoleChange = (event, number) => {
        let rolecode = event === null ? null : event.value;

        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
        travelcordinator[number]['rolecode'] = rolecode;
        this.props.setTravelCordinator(travelcordinator, number);
    }

    render() {
        const { errors, optionsRole, isLoadingSelect2 } = this.state;
        let { travelcordinator } = this.props.enrollmentcorporate;
        let number = 0;

        let traveladmin = travelcordinator.filter(function (obj) { return obj.travelcordinatortype === 'ADMIN' });
        travelcordinator = travelcordinator.filter(function (obj) { return obj.travelcordinatortype !== 'ADMIN' });

        return (
            <div className="member-enroll">
                <div className="content-title flex-hr mb-0 title-description">
                    <h3 className="title-has-control mt-2">Travel Cordinator Admin</h3>
                </div>
                <hr className="mt-0" />
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="name-view">Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" id="name-view" ref="name" name="name" value={(traveladmin[number]) ? traveladmin[number]['name'] : ''} maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                <span className="text-danger">{errors["name_" + number]}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="username-view">Username</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" id="username-view" ref="username" value={(traveladmin[number]) ? traveladmin[number]['username'] : ''} name="username" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                <span className="text-danger">{errors["username_" + number]}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="idcardnumber-view">ID Numbers</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" id="idcardnumber-view" ref="idcardnumber" value={(traveladmin[number]) ? traveladmin[number]['idcardnumber'] : ''} name="idcardnumber" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                <span className="text-danger">{errors["idcardnumber_" + number]}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" value={(traveladmin[number]) ? traveladmin[number]['cardnumber'] : ''} name="cardnumber" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                <span className="text-danger">{errors["cardnumber_" + number]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="phonenumber-view">Phone Number</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" id="phonenumber-view" ref="phonenumber" value={(traveladmin[number]) ? traveladmin[number]['phonenumber'] : ''} name="phonenumber" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                <span className="text-danger">{errors["phonenumber_" + number]}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="email-view">Email</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" id="email-view" ref="email" value={(traveladmin[number]) ? traveladmin[number]['email'] : ''} name="email" maxLength="100" onChange={(e) => this.handleFieldChange(e, number)} />
                                <span className="text-danger">{errors["email_" + number]}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="birthdate-view">Birth Date </label>
                            <div className="col-sm-8">
                                <Datepicker className="form-control" selected={(traveladmin[number]) ? traveladmin[number]['birthdate'] : null} dateFormat={"DD/MM/YYYY"} onChange={(e) => this.handleDatehange(e, number)} /><br />
                                <span className="text-danger">{errors["birthdate_" + number]}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label" htmlFor="rolecode-view">Role </label>
                            <div className="col-sm-8">
                                <Select2 reference="rolecode" className="reactSelect2" id="rolecode-view" options={optionsRole} onChange={(e) => this.handleRoleChange(e, number)} value={optionsRole.filter(({ value }) => value === traveladmin[number]['rolecode'])} isLoading={isLoadingSelect2.rolecode}></Select2>
                                <span className="text-danger">{errors["rolecode_" + number]}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col">
                        <form className="clearfix position-relative" autoComplete="off">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h3 className="title-has-control mt-2">Travel Cordinator Staff</h3>
                            </div>
                            <hr className="mt-0" />
                            <div className="row">
                                <div className="col-md-12 text-right">
                                    <button type="button" title="Add Staff" className="btn btn-primary btn-sm" onClick={() => this.addStaff()}>Add Staff</button>
                                </div>
                            </div>
                            {
                                travelcordinator.map((val, key) => {
                                    return (
                                        <StaffForm {...this.props} optionsRole={optionsRole} number={key + 1} key={key} errors={errors} isLoadingSelect2={isLoadingSelect2} />
                                    )
                                })
                            }
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export class StaffForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
        };
    }

    handleFieldChange = (event, number) => {
        let name = event.target.name ? event.target.name : null;
        let value = event.target.value ? event.target.value : null;
        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
        travelcordinator[number][name] = value;
        this.props.setTravelCordinator(travelcordinator, number);
    }

    handleDatehange = (event, number) => {
        let birthdate = event === null ? null : event;

        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
        travelcordinator[number]['birthdate'] = birthdate;
        this.props.setTravelCordinator(travelcordinator, number);
    }

    handleRoleChange = (event, number) => {
        let rolecode = event === null ? null : event.value;

        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
        travelcordinator[number]['rolecode'] = rolecode;
        this.props.setTravelCordinator(travelcordinator, number);
    }

    deleteStaff = (event, number) => {
        let travelcordinator = this.props.enrollmentcorporate.travelcordinator;

        let result = [];
        let key = 0;
        for (const field in travelcordinator) {
            if (Number.parseInt(field, 0) !== number || travelcordinator[field]['travelcordinatortype'] === 'ADMIN') {
                result[key] = travelcordinator[field];
                key++;
            }
        }

        this.props.setTravelCordinator(result);
    }

    render() {
        const { number, errors, optionsRole, isLoadingSelect2 } = this.props;
        const { travelcordinator } = this.props.enrollmentcorporate;
        return (
            <div className="card mt-4">
                <div className="card-body">
                    <div className="row ">
                        <div className="col-md-12">
                            <label className="main-label">Staff #{number}</label>
                        </div>
                        <hr className="mt-0" />
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="name-view">Name</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="name-view" ref="name" value={travelcordinator[number]['name']} name="name" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                    <span className="text-danger">{errors["name_" + number]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="username-view">Username</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="username-view" ref="username" value={travelcordinator[number]['username']} name="username" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                    <span className="text-danger">{errors["username_" + number]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="idcardnumber-view">ID Numbers</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="idcardnumber-view" ref="idcardnumber" value={travelcordinator[number]['idcardnumber']} name="idcardnumber" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                    <span className="text-danger">{errors["idcardnumber_" + number]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" value={travelcordinator[number]['cardnumber']} name="cardnumber" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                    <span className="text-danger">{errors["cardnumber_" + number]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="phonenumber-view">Phone Number</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="phonenumber-view" ref="phonenumber" value={travelcordinator[number]['phonenumber']} name="phonenumber" maxLength="45" onChange={(e) => this.handleFieldChange(e, number)} />
                                    <span className="text-danger">{errors["phonenumber_" + number]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="email-view">Email</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" id="email-view" ref="email" value={travelcordinator[number]['email']} name="email" maxLength="100" onChange={(e) => this.handleFieldChange(e, number)} />
                                    <span className="text-danger">{errors["email_" + number]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="birthdate-view">Birth Date </label>
                                <div className="col-sm-8">
                                    <Datepicker className="form-control" selected={travelcordinator[number]['birthdate']} dateFormat={"DD/MM/YYYY"} onChange={(e) => this.handleDatehange(e, number)} /><br />
                                    <span className="text-danger">{errors["birthdate_" + number]}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-12 text-right">
                                    <button type="button" title="Delete" className="btn btn-danger btn-sm" onClick={(e) => this.deleteStaff(e, number)}><i className="mdi mdi-delete"></i></button>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" htmlFor="rolecode-view">Role </label>
                                <div className="col-sm-8">
                                    <Select2 reference="rolecode" className="reactSelect2" id="rolecode-view" options={optionsRole} onChange={(e) => this.handleRoleChange(e, number)} value={optionsRole.filter(({ value }) => value === travelcordinator[number]['rolecode'])} isLoading={isLoadingSelect2.rolecode}></Select2>
                                    <span className="text-danger">{errors["rolecode_" + number]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
