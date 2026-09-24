import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SaveRequest, RetrieveRequest, DetailRequest } from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import { api } from '../../../config/Services';
import Select2 from '../../../components/Select2';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';
import Breadcrumb from '../../../components/Breadcrumb';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';
// import ReactHtmlParser from 'react-html-parser';

var permissionList = _getUserPermission();
var menuname = 'mailingitem';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingid: (this.props.location.state && this.props.location.state.mailingid) ? this.props.location.state.mailingid : null,
            mailingsetid: (this.props.location.state && this.props.location.state.mailingsetid) ? this.props.location.state.mailingsetid : null,
            mailingname: (this.props.location.state && this.props.location.state.mailingname) ? this.props.location.state.mailingname : null,
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Mailing Item',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            optionsMailingSet: [],
            optionsLanguage: [],
            langcode: null,
            optionsItemType: [
                {
                    label: "CONTENT",
                    value: "CONTENT"
                },
                {
                    label: "ATTACHMENT",
                    value: "ATTACHMENT"
                }
            ],
            itemtype: null,
            // emailcontent: ''
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //itemtype
        if (!field['itemtype']) {
            errors['itemtype'] = 'Required';
        }

        //mailingitemname
        if (!field['mailingitemname']) {
            errors['mailingitemname'] = 'Required';
        } else if (!field['mailingitemname'].match(/^[a-zA-Z0-9\s]+$/)) {
            errors['mailingitemname'] = 'Only alphanumeric and space';
        } else if (field['mailingitemname'].length > 45) {
            errors['mailingitemname'] = 'Maximum 45 characters';
        }

        //description
        if (field['description']) {
            if (field['description'].length > 255) {
                errors['description'] = 'Maximum 255 characters';
            } else if (!field['description'].match(/^[a-zA-Z0-9\s]+$/)) {
                errors['description'] = 'Only alphanumeric and space';
            }
        }

        if (field['itemtype'] === 'ATTACHMENT') {

        }

        if (field['itemtype'] === 'CONTENT') {
            //emailcontent
            if (!field['emailcontent']) {
                errors['emailcontent'] = 'Required';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        // let id = (this.props.location.state && this.props.location.state.mailingitemid !== undefined) ? this.props.location.state.mailingitemid : null;
        let id = this.props.match.params.ID;
        if (id) {
            let titlepage = 'Edit Mailing Object';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Mailing Object';
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
                window.callCkeditor('emailcontentview');
            }
        }
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, "access")) {
            this.checkPermission();
            window.callTooltips();
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
    }

    getDetail(id) {
        let url = api.url.mailingitem.detail;
        DetailRequest(url, { id }).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.mailingitemname.value = result.mailingitemname;
                this.refs.description.value = result.description;
                this.refs.emailcontent.value = window.decodeHTML(result.emailcontent);

                // window.destroyCkeditor();
                //set emailcontent
                // var emailcontent = window.decodeHTML(result.emailcontent);
                //window.setCkeditorValue(emailcontent);

                this.setState({
                    itemtype: result.itemtype,
                    // emailcontent
                }, window.callCkeditor('emailcontentview'));
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

    getoptionsLanguage() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            langname: 'asc'
        };
        let criteria = {};
        let url = api.url.language.list;
        let column = ['langcode', 'langname'];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
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
                    optionsLanguage: result
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        const { actionspage, itemtype, mailingid } = this.state;
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }

        formData['itemtype'] = itemtype;
        formData['mailingid'] = mailingid;

        var emailcontentvalue = window.getCkeditorValue('emailcontentview');
        formData['emailcontent'] = window.encodeHTML(emailcontentvalue);

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let mailingid = formData.mailingid;
            let itemtype = formData.itemtype;
            let mailingitemname = formData.mailingitemname;
            let description = formData.description;
            let emailcontent = formData.emailcontent;
            let filelocation = null;

            let message = '';
            let url = '';
            let data = {};
            if (actionspage === 'create') {
                message = 'New data has been created';
                url = api.url.mailingitem.create;
                data = { mailingid, itemtype, mailingitemname, description, emailcontent, filelocation };
            } else {
                let id = this.props.match.params.ID;
                message = 'Data has been updated';
                url = api.url.mailingitem.update;
                data = { id, mailingid, itemtype, mailingitemname, description, emailcontent, filelocation };
            }

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push({ pathname: '/mailing-set/mailing-item/form/' + response.result.id, state: { mailingid, mailingitemid: response.result.id } });
                        // this.props.history.push('/mailing-set/mailing-item/form/'+ response.result.id);
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

    handleLanguageChange = (event) => {
        let langcode = event === null ? null : event.value;
        this.setState({ langcode });
    }

    handleItemTypeChange = (event) => {
        let itemtype = event === null ? null : event.value;
        this.setState({ itemtype });
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    };

    addCharacter(code) {
        window.addCharacter("emailcontentview", "{{" + code + "}}");
    };

    render() {
        // console.log(this.props.location.state);
        if (this.props.location.state && this.props.location.state.mailingid) {
            const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
            const { mailingid, mailingsetid, optionsItemType, itemtype, mailingname } = this.state;
            if (formrender) {
                //title bar on browser
                document.title = titlepage + " | Loyalty Management System";
                //render form
                return (
                    <div className="container-fluid">
                        <Breadcrumb path="Data Management / Member Configuration / Mailing Object" />
                        <div className="main-panel">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h1 className="title-has-control mt-2">{titlepage}</h1>
                            </div>
                            <hr className="mt-0" />
                            <div className="row">
                                <div className="col-md-12">
                                    <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                        <Loader value={loading} />
                                        <div className="form-group row">
                                            <label className="col-md-2 col-form-label" htmlFor="itemtype-view">Item Type </label>
                                            <div className="col-md-6">
                                                <Select2 reference="itemtype" className="reactSelect2" id="itemtype-view" options={optionsItemType} onChange={this.handleItemTypeChange} value={optionsItemType.filter(({ value }) => value === itemtype)} disabled={generalfielddisabled}></Select2>
                                                <span className="text-danger">{errors["itemtype"]}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-md-2 col-form-label" htmlFor="mailingitemname-view">Mailing Item Name </label>
                                            <div className="col-md-6">
                                                <input className="form-control" type="text" id="mailingitemname-view" ref="mailingitemname" maxLength="45" disabled={generalfielddisabled} />
                                                <span className="text-danger">{errors["mailingitemname"]}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-md-2 col-form-label" htmlFor="description-view">Description <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                            <div className="col-md-6">
                                                <textarea rows="3" className="form-control" type="text" id="description-view" ref="description" maxLength="255" disabled={generalfielddisabled} />
                                                <span className="text-danger">{errors["description"]}</span>
                                            </div>
                                        </div>
                                        <div className={(itemtype === 'CONTENT') ? "form-group row" : "form-group row hidden "}>
                                            <label className="col-md-2 col-form-label" htmlFor="emailcontentview">
                                                Email Content
                                            </label>
                                            <div className="col-md-7">
                                                <textarea rows="3" className="form-control" type="text" id="emailcontentview" name="emailcontent" ref="emailcontent" disabled={generalfielddisabled} />
                                                <span className="text-danger">{errors["emailcontent"]}</span>
                                            </div>
                                            <label className="col-md-3">
                                                <div id="accordion">
                                                    <div className="card">
                                                        <div className="card-header" id="customer_profile_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#customer_profile" aria-expanded="false" aria-controls="collapseOne">Customer Profile</button>
                                                            </h5>
                                                        </div>
                                                        <div id="customer_profile" className="collapse" aria-labelledby="headingOne" data-parent="#customer_profile">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("salutation")} data-toggle="tooltip" data-placement="top" title="Salutation from customer profile">Salutation</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("middle_name")} data-toggle="tooltip" data-placement="top" title="Customer middlename from customer profile">Middle Name</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("full_name")} data-toggle="tooltip" data-placement="top" title="Fullname is the complete name of customer (firstname + middlename + lastname)">Full Name</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("first_name")} data-toggle="tooltip" data-placement="top" title="Customer firstname from customer profile">First Name</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("name_on_card")} data-toggle="tooltip" data-placement="top" title="Name on card from customer profile">Name On Card</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("letter_salutation")} data-toggle="tooltip" data-placement="top" title="Letter salutation from catalog language (based on customer preffred language)">Letter Salutation</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("last_name")} data-toggle="tooltip" data-placement="top" title="Customer lastname from customer profile">Last Name</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-header" id="address_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#address" aria-expanded="false" aria-controls="collapseOne">Address</button>
                                                            </h5>
                                                        </div>
                                                        <div id="address" className="collapse" aria-labelledby="headingOne" data-parent="#address">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("address")} data-toggle="tooltip" data-placement="top" title="Preffered address">Address</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("postal_code")} data-toggle="tooltip" data-placement="top" title="Preffered address postal code">Postal Code</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("region_code")} data-toggle="tooltip" data-placement="top" title="Region code">Region Code</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("city")} data-toggle="tooltip" data-placement="top" title="Preffered address city">City</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("country")} data-toggle="tooltip" data-placement="top" title="Preffered address country">Country</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("prefered_address")} data-toggle="tooltip" data-placement="top" title="Customer preffered address with fixed format : Company name, Address, City">Prefered Address</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("company_name")} data-toggle="tooltip" data-placement="top" title="Preffered address company name">Company Name</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("departement")} data-toggle="tooltip" data-placement="top" title="Preffered address departement">Departement</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-header" id="membership_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#membership" aria-expanded="false" aria-controls="collapseOne">Membership</button>
                                                            </h5>
                                                        </div>
                                                        <div id="membership" className="collapse" aria-labelledby="headingOne" data-parent="#membership">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("member_id")} data-toggle="tooltip" data-placement="top" title="Current member ID">Member ID</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("current_tier")} data-toggle="tooltip" data-placement="top" title="Valid tier name">Current Tier</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("current_member_type")} data-toggle="tooltip" data-placement="top" title="Valid member type">Current Member Type</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("expire")} data-toggle="tooltip" data-placement="top" title="Membership will expire next quarter (true, false)">Expire</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("next_tier")} data-toggle="tooltip" data-placement="top" title="Higher tier level">Next Tier</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("tier_start_date")} data-toggle="tooltip" data-placement="top" title="Member tier life cycle start date">Tier Start Date</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("tier_end_date")} data-toggle="tooltip" data-placement="top" title="Member file cycle end date">Tier End Date</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("member_since")} data-toggle="tooltip" data-placement="top" title="Member since">Member Since</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-header" id="award_mileage_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#award_mileage" aria-expanded="false" aria-controls="collapseOne">Award Mileage</button>
                                                            </h5>
                                                        </div>
                                                        <div id="award_mileage" className="collapse" aria-labelledby="headingOne" data-parent="#award_mileage">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("award_mileage_previous")} data-toggle="tooltip" data-placement="top" title="Award mileage balance at previous quarter">Award Mileage Previous</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("award_mileage_ear")} data-toggle="tooltip" data-placement="top" title="Award milage earn within period (available only for mileage statement)">Award Mileage Earn</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("award_mileage_redeemed")} data-toggle="tooltip" data-placement="top" title="Award redeem within period (available only for mileage statement)">Award Mileage Redeemed</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("balance_within_period")} data-toggle="tooltip" data-placement="top" title="Total award mileage within the period (available only for mileage statement)">Balance Within Period</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("balance_end_period")} data-toggle="tooltip" data-placement="top" title="Award mileage balance untuk the end of period (available only for mileage statement)">Balance End Period </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-header" id="tier_mileage_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#tier_mileage" aria-expanded="false" aria-controls="collapseOne">Tier Mileage</button>
                                                            </h5>
                                                        </div>
                                                        <div id="tier_mileage" className="collapse" aria-labelledby="headingOne" data-parent="#tier_mileage">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("tier_mileage_previous")} data-toggle="tooltip" data-placement="top" title="Tier mileage balance at previous quarter">Tier Mileage Previous</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("tier_mileage_within_period")} data-toggle="tooltip" data-placement="top" title="Tier mileage within period (available only for mileage statement)">Tier Mileage Within Period</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("tier_mileage_end_period")} data-toggle="tooltip" data-placement="top" title="Tier mileage until the end of period (available only for mileage statement)">Tier Mileage End Period</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("to_up_tier_mileage")} data-toggle="tooltip" data-placement="top" title="Tier mileage needed for upgrade (availabel only for mileage statement)">To Up Tier Mileage</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("maintain_tier_mileage")} data-toggle="tooltip" data-placement="top" title="Tier mileage needed for maintain (available only for mileage statement)">Maintain Tier Mileage </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-header" id="eligible_flights_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#eligible_flights" aria-expanded="false" aria-controls="collapseOne">Eligible Flights</button>
                                                            </h5>
                                                        </div>
                                                        <div id="eligible_flights" className="collapse" aria-labelledby="headingOne" data-parent="#eligible_flights">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("frequency_previous")} data-toggle="tooltip" data-placement="top" title="Eligble flights balance at previous quarter">Frequency Previous</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("frequency_within_period")} data-toggle="tooltip" data-placement="top" title="Eligible flights within period (available only for mileage statement)">Frequency Within Period</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("frequency_end_period")} data-toggle="tooltip" data-placement="top" title="Eligible flights until the end of period (available for only mileage statement)">Frequency End Period</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("to_up_frequency")} data-toggle="tooltip" data-placement="top" title="Eligible flights needed for upgrade (avalaible only for mileage statement)">To Up Frequency</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("maintain_frequency")} data-toggle="tooltip" data-placement="top" title="Eligible flights needed for maintain (available only for mileage statement)">Maintain Frequency </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-header" id="date_information_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#date_information" aria-expanded="false" aria-controls="collapseOne">Date Information</button>
                                                            </h5>
                                                        </div>
                                                        <div id="date_information" className="collapse" aria-labelledby="headingOne" data-parent="#eligible_flights">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("current_date")} data-toggle="tooltip" data-placement="top" title="Date when mailing is sent provider">Current Date</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("period_from")} data-toggle="tooltip" data-placement="top" title="Start date of quarter period">Period From</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("period_to")} data-toggle="tooltip" data-placement="top" title="End date of quarter period">Period To</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("start_of_year")} data-toggle="tooltip" data-placement="top" title="Period start of year">Start of Year</button>
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("end_of_year")} data-toggle="tooltip" data-placement="top" title="Period end of year">End of Year </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-header" id="transaction_header">
                                                            <h5 className="mb-0">
                                                                <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#transaction" aria-expanded="false" aria-controls="collapseOne">Transactions</button>
                                                            </h5>
                                                        </div>
                                                        <div id="transaction" className="collapse" aria-labelledby="headingOne" data-parent="#eligible_flights">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-outline-dark btn-sm m-1" onClick={() => this.addCharacter("transactions")} data-toggle="tooltip" data-placement="top" title="Member transactions recorded within the period ">Transactions</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className={(itemtype === 'ATTACHMENT') ? "form-group row" : "form-group row hidden "}>
                                            <label className="col-md-2 col-form-label" htmlFor="cardtemplate-view">File Location </label>
                                            <div className="col-md-6">
                                                <div className="custom-file" style={{ zIndex: 0 }}>
                                                    <input className="custom-file-input" type="file" id="cardtemplate-view" ref="cardtemplate" disabled={generalfielddisabled} />
                                                    <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                                                </div>
                                                <span className="text-danger">{errors["cardtemplate"]}</span>
                                            </div>
                                        </div>

                                        <div className="box-footer text-center">
                                            {
                                                (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                            }
                                            &nbsp;&nbsp;
                                            <Link to={{ pathname: '/mailing-set/mailing-item', state: { mailingid, mailingsetid, mailingname } }} className="btn btn-outline-dark normal">Back</Link>
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
        } else {
            return (<ErrorGeneral message={'Mailing Object ID not detected, please do not use tab'} />);
        }
    }
}

export default Layout;