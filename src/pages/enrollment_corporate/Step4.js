import React, { Component } from 'react';
import Datepicker from '../../components/Datepicker';
import { api } from '../../config/Services';
import { SaveRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import moment from 'moment';
import Loader from '../../components/Loader';

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
            ],
            maxmemberdisabled: false
        };
    }

    isValidated() {
        let errors = {};
        let status = true;
        const userInput = this._grabUserInput();

        // tourcode
        if (!userInput.tourcode) {
            errors['tourcode'] = 'Required';
        } else if (userInput.tourcode.length > 45) {
            errors['tourcode'] = 'Maximum 45 characters';
        } else if (!userInput.tourcode.match(/^[a-zA-Z0-9\s]+$/)) {
            errors['tourcode'] = 'Only alphanumeric and space';
        }

        // maxmember
        if (userInput.maxmember === '' || userInput.maxmember === null) {
            errors['maxmember'] = 'Required';
        } else if (userInput.maxmember.length > 10) {
            errors['maxmember'] = 'Maximum 10 characters';
        } else if (!userInput.maxmember.match(/^\+?([0-9])+$/)) {
            errors['maxmember'] = 'Only numeric';
        }

        //startdate
        if (!userInput.startdate) {
            errors['startdate'] = 'Required';
        }

        //enddate
        if (!userInput.enddate) {
            errors['enddate'] = 'Required';
        } else if (moment(userInput.startdate).format("YYYY/MM/DD") > moment(userInput.enddate).format("YYYY/MM/DD")) {
            errors['enddate'] = 'Discontinue Date must be greater than Effective Date';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });

        if (status) {
            this.setState({ loading: true });
            //member
            let username = this.props.enrollmentcorporate.membercorporatedetail.corporateemail;
            let enrollchannel = 'CORPORATE';
            let enrollmentdate = moment(new Date()).format("YYYY-MM-DD");
            let member = { username, enrollchannel, enrollmentdate };

            //membercorporatedetail
            const { corporatename, address, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, corporatetype, maxmember, businessfield, contactname, contactidnum, contactidtype, contactemail, contactphonenum, unlimited } = this.props.enrollmentcorporate.membercorporatedetail;
            let startdate = moment(this.props.enrollmentcorporate.membercorporatedetail.startdate).format("YYYY-MM-DD");
            let enddate = moment(this.props.enrollmentcorporate.membercorporatedetail.enddate).format("YYYY-MM-DD");
            let actioncount = 0;
            let countrycode = "";
            let statecode = "";
            let membercorporatedetail = { corporatename, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, corporatetype, maxmember, businessfield, contactname, contactidnum, contactidtype, contactemail, contactphonenum, startdate, enddate, unlimited, actioncount };

            //corporatetourcode
            let travelcordinator = this.props.enrollmentcorporate.travelcordinator;
            const { tourcode } = this.props.enrollmentcorporate.corporatetourcode;
            startdate = moment(this.props.enrollmentcorporate.corporatetourcode.startdate).format("YYYY-MM-DD");
            enddate = moment(this.props.enrollmentcorporate.corporatetourcode.enddate).format("YYYY-MM-DD");
            let corporatecode = '';
            let corporatetourcode = { tourcode, startdate, enddate, corporatecode };

            for (const field in travelcordinator) {
                travelcordinator[field]['birthdate'] = moment(travelcordinator[field]['birthdate']).format("YYYY-MM-DD");
            }

            let data = { member, membercorporatedetail, corporatetourcode, travelcordinator };
            let message = 'New data has been created';
            let url = api.url.enrollmentcorporate.enroll;
            var requestData = SaveRequest(url, data);
            if (requestData) {
                return requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    console.log("response", response)
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        this.props.setReponseEnrollmentCorporate(response.result);
                        Alert.success(message);
                        //hide loader
                        this.setState({ loading: false });
                        return true;
                    } else {
                        Alert.error(responsemessage);
                        //hide loader
                        this.setState({ loading: false });
                        return false;
                    }
                })
            }
        } else {
            return false;
        }
    }

    _grabUserInput() {
        const { tourcode, startdate, enddate, unlimited } = this.props.enrollmentcorporate.corporatetourcode;
        const { maxmember } = this.props.enrollmentcorporate.membercorporatedetail;
        return { tourcode, maxmember, startdate, enddate, unlimited };
    }

    handleTourCodeChange = (event) => {
        let tourcode = event.target.value ? event.target.value : null;
        let corporatetourcode = { tourcode };
        this.props.setCorporateTourCode(corporatetourcode);
    }

    handleMaxMemberChange = (event) => {
        let maxmember = event.target.value ? event.target.value : null;
        console.log("maxmember", maxmember)
        let membercorporatedetail = { maxmember };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleStartDateChange = (event) => {
        let startdate = event === null ? null : event;
        let enddate = null;
        let corporatetourcode = { startdate, enddate };
        this.props.setCorporateTourCode(corporatetourcode);
    }

    handleEndDateChange = (event) => {
        let enddate = event === null ? null : event;
        let corporatetourcode = { enddate };
        this.props.setCorporateTourCode(corporatetourcode);
    }

    handleUnlimitedChannel = (event) => {
        let unlimited = event === null ? null : event.target.checked;
        let maxmemberdisabled = unlimited;

        this.setState({ unlimited, maxmemberdisabled });

        let maxmember = "0";
        let membercorporatedetail = { unlimited, maxmember };
        // this.refs.maxmember.value = maxmember;
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    render() {
        const { loading, errors, maxmemberdisabled } = this.state;
        const { tourcode, startdate, enddate } = this.props.enrollmentcorporate.corporatetourcode;
        const { maxmember, unlimited } = this.props.enrollmentcorporate.membercorporatedetail;

        return (
            <div className="member-enroll">
                <form className="clearfix position-relative" autoComplete="off">
                    <Loader value={loading} />
                    <div className="content-title flex-hr mb-0 title-description">
                        <h3 className="title-has-control mt-2">Contact Info</h3>
                    </div>
                    <hr className="mt-0" />
                    <div className="row">
                        <div className="col">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="tourcode-view">Tour Code</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="tourcode-view" ref="tourcode" maxLength="45" value={tourcode} onChange={this.handleTourCodeChange} />
                                            <span className="text-danger">{errors["tourcode"]}</span>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="startdate-view">Effective Date </label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handleStartDateChange} selected={startdate} dateFormat={"DD/MM/YYYY"} /><br />
                                            <span className="text-danger">{errors["startdate"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="enddate-view">Discontinue Date </label>
                                        <div className="col-sm-8">
                                            <Datepicker className="form-control" onChange={this.handleEndDateChange} selected={enddate} dateFormat={"DD/MM/YYYY"} minDate={moment(startdate)} /><br />
                                            <span className="text-danger">{errors["enddate"]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-title flex-hr mb-0 title-description">
                        <h3 className="title-has-control mt-2">Configuration</h3>
                    </div>
                    <hr className="mt-0" />
                    <div className="row">
                        <div className="col">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="maxmember-view">Max Member</label>
                                        <div className="col-sm-8">
                                            <div className="row no-gutters">
                                                <div className="col-sm-8">
                                                    <input className="form-control" type="text" id="maxmember-view" ref="maxmember" maxLength="10" value={maxmember} onChange={this.handleMaxMemberChange} disabled={maxmemberdisabled} />
                                                    <span className="text-danger">{errors["maxmember"]}</span>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="multiple-checkbox col-sm-2">
                                                        <label className="custom-control fill-checkbox">
                                                            <input type="checkbox" className="fill-control-input" name="unlimited" onChange={this.handleUnlimitedChannel} checked={unlimited} />
                                                            <span className="fill-control-indicator"></span>
                                                            <span className="fill-control-description">Unlimited</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}