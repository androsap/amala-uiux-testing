import React, { Component } from 'react';
import Select2 from '../../components/Select2';

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            optionsCorporateType: [
                { label: 'Perseorangan', value: 'Perseorangan' },
                { label: 'PT', value: 'PT' },
                { label: 'CV', value: 'CV' },
                { label: 'Firma', value: 'Firma' },
                { label: 'Perum', value: 'Perum' },
                { label: 'Koperasi', value: 'Koperasi' },
                { label: 'Yayasan', value: 'Yayasan' },
                { label: 'Other', value: 'Other' }
            ],
            optionsIdType: [
                { label: 'KTP', value: 'KTP' },
                { label: 'SIM', value: 'SIM' },
                { label: 'Passport', value: 'Passport' },
                { label: 'Other', value: 'Other' }
            ]
        };
    }

    isValidated() {
        let errors = {};
        let status = true;
        const userInput = this._grabUserInput();

        // contactname
        if (!userInput.contactname) {
            errors['contactname'] = 'Required';
        } else if (userInput.contactname.length > 45) {
            errors['contactname'] = 'Maximum 45 characters';
        } else if (!userInput.contactname.match(/^[a-zA-Z0-9\s]+$/)) {
            errors['contactname'] = 'Only alphanumeric and space';
        }

        //contactidtype
        if (!userInput.contactidtype) {
            errors['contactidtype'] = 'Required';
        }

        // contactidnum
        if (!userInput.contactidnum) {
            errors['contactidnum'] = 'Required';
        } else if (userInput.contactidnum.length > 45) {
            errors['contactidnum'] = 'Maximum 45 characters';
        } else if (!userInput.contactidnum.match(/^\+?([0-9])+$/)) {
            errors['contactidnum'] = 'Only numeric';
        }

        //contactemail
        if (!userInput.contactemail) {
            errors['contactemail'] = 'Required';
        } else if (userInput.contactemail.length > 45) {
            errors['contactemail'] = 'Maximum 45 characters';
        } else if (!userInput.contactemail.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            errors['contactemail'] = 'Invalid email address';
        }

        //contactphonenum
        if (!userInput.contactphonenum) {
            errors['contactphonenum'] = 'Required';
        } else if (userInput.contactphonenum.length > 45) {
            errors['contactphonenum'] = 'Maximum 45 characters';
        } else if (!userInput.contactphonenum.match(/^\+?([0-9])+$/)) {
            errors['contactphonenum'] = 'Only numeric';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    _grabUserInput() {
        const { contactname, contactidnum, contactemail, contactidtype, contactphonenum } = this.props.enrollmentcorporate.membercorporatedetail;
        return { contactname, contactidnum, contactemail, contactidtype, contactphonenum };
    }

    handleContactNameChange = (event) => {
        let contactname = event.target.value ? event.target.value : null;
        let membercorporatedetail = { contactname };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleContactIdNumChange = (event) => {
        let contactidnum = event.target.value ? event.target.value : null;
        let membercorporatedetail = { contactidnum };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleContactEmailChange = (event) => {
        let contactemail = event.target.value ? event.target.value : null;
        let membercorporatedetail = { contactemail };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleContactPhoneNumChange = (event) => {
        let contactphonenum = event.target.value ? event.target.value : null;
        let membercorporatedetail = { contactphonenum };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleIdTypeChange = (event) => {
        let contactidtype = event === null ? null : event.value;
        let membercorporatedetail = { contactidtype };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    render() {
        const { errors } = this.state;
        const { optionsIdType } = this.state;
        const { contactname, contactidnum, contactemail, contactidtype, contactphonenum } = this.props.enrollmentcorporate.membercorporatedetail;

        return (
            <div className="member-enroll">
                <div className="content-title flex-hr mb-0 title-description">
                    <h3 className="title-has-control mt-2">Contact Info</h3>
                </div>
                <hr className="mt-0" />
                <div className="row">
                    <div className="col">
                        <form className="clearfix position-relative" autoComplete="off">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="contactname-view">Name</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="contactname-view" ref="contactname" maxLength="45" value={contactname} onChange={this.handleContactNameChange} />
                                            <span className="text-danger">{errors["contactname"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="contactidtype-view">ID Type </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="contactidtype" className="reactSelect2" id="contactidtype-view" options={optionsIdType} onChange={this.handleIdTypeChange} value={optionsIdType.filter(({ value }) => value === contactidtype)}></Select2>
                                            <span className="text-danger">{this.state.errors["contactidtype"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="contactidnum-view">ID Numbers</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="contactidnum-view" ref="contactidnum" maxLength="45" value={contactidnum} onChange={this.handleContactIdNumChange} />
                                            <span className="text-danger">{errors["contactidnum"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="contactemail-view">Email</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="contactemail-view" ref="contactemail" maxLength="45" value={contactemail} onChange={this.handleContactEmailChange} />
                                            <span className="text-danger">{errors["contactemail"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="contactphonenum-view">Phone</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="contactphonenum-view" ref="contactphonenum" maxLength="45" value={contactphonenum} onChange={this.handleContactPhoneNumChange} />
                                            <span className="text-danger">{errors["contactphonenum"]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}