import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import RequestService from '../../utilities/RequestService';
import { toast } from 'react-toastify';
import Services from '../../config/Services';
import Loader from '../../components/Loader';
import ErrorGeneral from '../error/ErrorGeneral';
import Breadcrumb from '../../components/Breadcrumb';
import Select2 from '../../components/Select2';
import Datepicker from '../../components/Datepicker';
import moment from 'moment';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';

var getServices = new Services();
var request = new RequestService();
var permissionList = _getUserPermission();
var menuname = 'tierbonus';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Tier Bonus',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            tierid: null,
            optionsTier: [],
            optionsProgram: [],
            optionsOperatingAirline: [],
            optionsMarketingAirline: [],
            optionsBookingClass: [],
            programcode: null,
            operatingairline: null,
            marketingairline: null,
            bookingon: null,
            bookingclass: null,
            bookingondisabled: true,
            bookingclassdisabled: true
        };
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //tierid
        if (!field['tierid']) {
            errors['tierid'] = 'Required';
        }

        //programcode
        if (!field['programcode']) {
            errors['programcode'] = 'Required';
        }

        //operatingairline
        if (!field['operatingairline']) {
            errors['operatingairline'] = 'Required';
        }

        //marketingairline
        if (!field['marketingairline']) {
            errors['marketingairline'] = 'Required';
        }

        //bookingclass
        if (!field['bookingclass']) {
            errors['bookingclass'] = 'Required';
        }

        //effectivedate
        if (!field['effectivedate']) {
            errors['effectivedate'] = 'Required';
        }

        //discontinuedate
        if (!field['discontinuedate']) {
            errors['discontinuedate'] = 'Required';
        }

        //factor
        if (!field['factor']) {
            errors['factor'] = 'Required';
        } else if (!field['factor'].match(/^\d+(?:\.\d{1,2})?$/)) {
            errors['factor'] = 'Only decimal';
        } else if (field['factor'].length > 45) {
            errors['factor'] = 'Maximum 45 characters';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = Number.parseInt(this.props.match.params.ID, 0);
        if (id) {
            let titlepage = 'Edit Tier Bonus';
            let actionspage = 'update';
            let generalfielddisabled = false;
            let bookingondisabled = false;
            let bookingclassdisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Tier Bonus';
                actionspage = 'view';
                generalfielddisabled = true;
                bookingondisabled = true;
                bookingclassdisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, generalfielddisabled, bookingondisabled, bookingclassdisabled });
            this.getDetail(id);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getOptionTier();
                this.getOptionProgram();
                this.getOptionAirline('marketing');
                this.getOptionAirline('operating');
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

    getDetail(tierbonusid) {
        let url = getServices.state.url.tierbonus.detail;
        request.getDataDetail(url, { tierbonusid }).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0' && response.result) {
                let data = response.result;
                this.refs.factor.value = data.factor;
                this.setState({
                    tierid: data.tierid,
                    programcode: data.programcode,
                    effectivedate: moment(data.effectivedate),
                    discontinuedate: moment(data.discontinuedate),
                    operatingairline: data.operatingairline,
                    marketingairline: data.marketingairline,
                    bookingon: data.bookingon,
                    bookingclass: data.bookingclass
                },
                    this.getOptionTier(),
                    this.getOptionProgram(),
                    this.getOptionAirline('marketing'),
                    this.getOptionAirline('operating'),
                    this.getOptionBookingClass((data.bookingon === "Operating") ? data.operatingairline : data.marketingairline))
            } else {
                this.setState(
                    {
                        responseCode: response.status.responsecode,
                        responseMessage: response.status.responsemessage
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
        formData['tierid'] = this.state.tierid;
        formData['programcode'] = this.state.programcode;
        formData['operatingairline'] = this.state.operatingairline;
        formData['marketingairline'] = this.state.marketingairline;
        formData['effectivedate'] = this.state.effectivedate;
        formData['discontinuedate'] = this.state.discontinuedate;
        formData['bookingon'] = this.state.bookingon;
        formData['bookingclass'] = this.state.bookingclass;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let tierid = formData.tierid;
            let programcode = formData.programcode;
            let operatingairline = formData.operatingairline;
            let marketingairline = formData.marketingairline;
            let bookingon = formData.bookingon;
            let bookingclass = formData.bookingclass;
            let factor = Number.parseFloat(formData.factor, 2);
            let effectivedate = moment(formData.effectivedate).format("YYYY-MM-DD");
            let discontinuedate = moment(formData.discontinuedate).format("YYYY-MM-DD");

            let tierbonusid = '';
            let message = ''
            let url = '';
            let parameter = {};
            if (actionspage === 'create') {
                message = 'New data has been created';
                url = getServices.state.url.tierbonus.create;
                parameter = { tierid, programcode, operatingairline, marketingairline, bookingon, bookingclass, factor, effectivedate, discontinuedate };
            } else {
                tierbonusid = Number.parseInt(this.props.match.params.ID, 0);
                message = 'Data has been updated';
                url = getServices.state.url.tierbonus.update;
                parameter = { tierbonusid, tierid, programcode, operatingairline, marketingairline, bookingon, bookingclass, factor, effectivedate, discontinuedate };
            }

            var requestData = request.saveData(url, parameter);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        toast.success(message);
                        this.props.history.push('/tier-bonus/form/' + response.result.tierbonusid);
                        //after action, check permission
                        this.checkPermission();
                    } else {
                        toast.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        }
    };

    getOptionBookingClass(airlinecode) {
        this.setState({ bookingclass: null });
        let url = getServices.state.url.bookingclass.getclassbyairline;
        request.getDataDetail(url, { airlinecode }).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var result = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.bookingclasscode;
                    result2['value'] = obj.bookingclassid;
                    return result2;
                })
                this.setState({
                    optionsBookingClass: result
                });
            } else {
                toast.error(response.status.responsemessage);
            }
        })
    }

    getOptionAirline(type = '') {
        let parameter = (type === 'marketing') ? {} : { operatingairline: true };
        // let operatingairline = (type === 'marketing') ? false : true ;
        let url = getServices.state.url.airline.getall;
        request.getDataDetail(url, parameter).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var result = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.airlinename;
                    result2['value'] = obj.airlinecode;
                    return result2;
                })

                if (type === 'marketing') {
                    this.setState({
                        optionsMarketingAirline: result
                    });
                } else {
                    this.setState({
                        optionsOperatingAirline: result
                    });
                }
            } else {
                toast.error(response.status.responsemessage);
            }
        });
    }

    getOptionTier() {
        let parameter = {
            sort: {
                tiername: 'asc'
            },
            criteria: {}
        }
        let url = getServices.state.url.tier.list;
        let column = ['tierid', 'tiername'];
        var result = request.getDataList(url, parameter, column);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var result = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.tiername;
                    result2['value'] = obj.tierid;
                    return result2;
                })

                this.setState({
                    optionsTier: result
                });
            } else {
                toast.error(response.status.responsemessage);
            }
        });
    }

    getOptionProgram() {
        let parameter = {
            sort: {
                programname: 'asc'
            },
            criteria: {}
        }
        let url = getServices.state.url.program.list;
        let column = ['programcode', 'programname'];
        var result = request.getDataList(url, parameter, column);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var result = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.programname;
                    result2['value'] = obj.programcode;
                    return result2;
                })

                this.setState({
                    optionsProgram: result
                });
            } else {
                toast.error(response.status.responsemessage);
            }
        });
    }

    handleTierChange = (event) => {
        let tierid = event === null ? null : event.value;
        this.setState({ tierid });
    }

    handleProgramChange = (event) => {
        let programcode = event === null ? null : event.value;
        this.setState({ programcode });
    }

    handleEffectiveDateChange = (event) => {
        let effectivedate = event === null ? null : event;
        this.setState({ effectivedate });
    }

    handleDiscontinueDateChange = (event) => {
        let discontinuedate = event === null ? null : event;
        this.setState({ discontinuedate });
    }

    handleOperatingAirlinesChange = (event) => {
        let operatingairline = event === null ? null : event.value;
        let bookingondisabled = true;
        let bookingclassdisabled = true;
        if (operatingairline) {
            let bookingondisabled = (this.state.marketingairline) ? false : true;
            let bookingclassdisabled = (this.state.bookingon) ? false : true;
            this.setState({ operatingairline, bookingondisabled, bookingclassdisabled },
                (this.state.bookingon === "Operating") ? this.getOptionBookingClass(operatingairline) : null);
        } else {
            this.setState({ operatingairline, bookingon: null, bookingclass: null, bookingondisabled, bookingclassdisabled });
        }
    }

    handleMarketingAirlinesChange = (event) => {
        let marketingairline = event === null ? null : event.value;
        let bookingondisabled = true;
        let bookingclassdisabled = true;
        if (marketingairline) {
            let bookingondisabled = (this.state.operatingairline) ? false : true;
            let bookingclassdisabled = (this.state.bookingon) ? false : true;
            this.setState({ marketingairline, bookingondisabled, bookingclassdisabled },
                (this.state.bookingon === "Marketing") ? this.getOptionBookingClass(marketingairline) : null);
        } else {
            this.setState({ marketingairline, bookingon: null, bookingclass: null, bookingondisabled, bookingclassdisabled });
        }
    }

    handleBookingOnChange = (event) => {
        let bookingon = event === null ? null : event.target.value;
        let bookingclassdisabled = (bookingon) ? false : true;
        this.setState({ bookingon, bookingclassdisabled });
        let airlinecode = null;
        if (bookingon === "Marketing") {
            airlinecode = this.state.marketingairline;
        } else {
            airlinecode = this.state.operatingairline;
        }
        this.getOptionBookingClass(airlinecode);
    }

    handleBookingClassChange = (event) => {
        let bookingclass = event === null ? null : event.value;
        this.setState({ bookingclass });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled, tierid, optionsTier, programcode, optionsProgram, effectivedate, discontinuedate, optionsOperatingAirline, operatingairline, optionsMarketingAirline, marketingairline, bookingon, bookingclass, optionsBookingClass, bookingondisabled, bookingclassdisabled } = this.state;
        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Tier Management / Tier Bonus" />
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
                                                <label className="col-sm-4 col-form-label" htmlFor="tierid-view">Tier <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="tierid" className="form-control" id="tierid-view" options={optionsTier} onChange={this.handleTierChange} value={tierid} disabled={generalfielddisabled}></Select2>
                                                    <span className="text-danger">{errors["tierid"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="programcode-view">Program <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="programcode" className="form-control" id="programcode-view" options={optionsProgram} onChange={this.handleProgramChange} value={programcode} disabled={generalfielddisabled}></Select2>
                                                    <span className="text-danger">{errors["programcode"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-4 form-label" htmlFor="effectivedate-view">Effective Date <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <Datepicker className="form-control" id="effectivedate-view" onChange={this.handleEffectiveDateChange} selected={effectivedate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} />
                                                    <span className="text-danger">{errors["effectivedate"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-4 form-label" htmlFor="discontinuedate-view">Discontinue Date <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <Datepicker className="form-control" id="discontinuedate-view" onChange={this.handleDiscontinueDateChange} selected={discontinuedate} dateFormat={"DD/MM/YYYY"} disabled={generalfielddisabled} />
                                                    <span className="text-danger">{errors["discontinuedate"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="marketingairline-view">Marketing Airline <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="marketingairline" className="form-control" id="marketingairline-view" options={optionsMarketingAirline} onChange={this.handleMarketingAirlinesChange} value={marketingairline} disabled={generalfielddisabled}></Select2>
                                                    <span className="text-danger">{errors["marketingairline"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="operatingairline-view">Operating Airline <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="operatingairline" className="form-control" id="operatingairline-view" options={optionsOperatingAirline} onChange={this.handleOperatingAirlinesChange} value={operatingairline} disabled={generalfielddisabled}></Select2>
                                                    <span className="text-danger">{errors["operatingairline"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="bookingon-view">Booking On <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <div className="row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="bookingonmarketing-view">
                                                            <input name="bookingon" value="Marketing" id="bookingonmarketing-view" type="radio" onChange={this.handleBookingOnChange} checked={bookingon === 'Marketing'} disabled={bookingondisabled} />
                                                            &nbsp;&nbsp;&nbsp;Marketing
													</label>
                                                        <label className="col-sm-4 col-form-label" htmlFor="bookingonoperating-view">
                                                            <input name="bookingon" value="Operating" id="bookingonoperating-view" type="radio" onChange={this.handleBookingOnChange} checked={bookingon === 'Operating'} disabled={bookingondisabled} />
                                                            &nbsp;&nbsp;&nbsp;Operating
													</label>
                                                    </div>
                                                    <span className="text-danger">{errors["bookingon"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="bookingclass-view">Booking Class <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <Select2 reference="bookingclass" className="form-control" id="bookingclass-view" options={optionsBookingClass} onChange={this.handleBookingClassChange} value={bookingclass} disabled={bookingclassdisabled}></Select2>
                                                    <span className="text-danger">{errors["bookingclass"]}</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="factor-view">Factor <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <input className="form-control" type="text" id="factor-view" ref="factor" maxLength="45" disabled={generalfielddisabled} />
                                                    <span className="text-danger">{errors["factor"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer text-center">
                                        {
                                            (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                        }
                                        &nbsp;&nbsp;
										<Link to="/tier-bonus" className="btn btn-outline-dark normal">Back</Link>
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