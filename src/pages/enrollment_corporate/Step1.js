import React, { Component } from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import Select2 from '../../components/Select2';
import Datepicker from '../../components/Datepicker';
import moment from 'moment';

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
            optionsBusinessField: [
                { label: 'Manufacture', value: 'Manufacture' },
                { label: 'Retail and Distributor', value: 'Retail and Distributor' },
                { label: 'Agricultural and Mining', value: 'Agricultural and Mining' },
                { label: 'Financial Business', value: 'Financial Business' },
                { label: 'Business Information', value: 'Business Information' },
                { label: 'Utilities', value: 'Utilities' },
                { label: 'Real Estate', value: 'Real Estate' },
                { label: 'Transportation', value: 'Transportation' },
                { label: 'Other', value: 'Other' }
            ],
            optionsCountry: [],
            optionsState: [],
            optionsCity: [],
            optionsLanguage: [],
            statecodedisabled: true,
            citycodedisabled: true,
            isLoadingSelect2: {
                countrycode: false,
                statecode: false,
                citycode: false,
                langcode: false
            }
        };
    }

    componentDidMount() {
        this.getOptionsCountry();
        this.getOptionsLanguage();
    }


    isValidated() {
        let errors = {};
        let status = true;
        const userInput = this._grabUserInput();

        // corporatename
        if (!userInput.corporatename) {
            errors['corporatename'] = 'Required';
        } else if (userInput.corporatename.length > 200) {
            errors['corporatename'] = 'Maximum 200 characters';
        }

        //corporatetype
        if (!userInput.corporatetype) {
            errors['corporatetype'] = 'Required';
        }

        // address
        if (!userInput.address) {
            errors['address'] = 'Required';
        } else if (userInput.address.length > 200) {
            errors['address'] = 'Maximum 200 characters';
        }

        // countrycode
        if (!userInput.countrycode) {
            errors['countrycode'] = 'Required';
        }

        // statecode
        if (!userInput.statecode) {
            errors['statecode'] = 'Required';
        }

        // citycode
        if (!userInput.citycode) {
            errors['citycode'] = 'Required';
        }

        //corporateemail
        if (!userInput.corporateemail) {
            errors['corporateemail'] = 'Required';
        } else if (userInput.corporateemail.length > 45) {
            errors['corporateemail'] = 'Maximum 45 characters';
        } else if (!userInput.corporateemail.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            errors['corporateemail'] = 'Invalid email address';
        }

        //phone number
        if (!userInput.phonenum) {
            errors['phonenum'] = 'Required';
        } else if (userInput.phonenum.length > 45) {
            errors['phonenum'] = 'Maximum 45 characters';
        } else if (!userInput.phonenum.match(/^\+?([0-9])+$/)) {
            errors['phonenum'] = 'Only numeric';
        }

        // langcode
        if (!userInput.langcode) {
            errors['langcode'] = 'Required';
        }

        // tradebusinesslicense
        if (!userInput.tradebusinesslicense) {
            errors['tradebusinesslicense'] = 'Required';
        } else if (userInput.tradebusinesslicense.length > 45) {
            errors['tradebusinesslicense'] = 'Maximum 45 characters';
        }

        // taxnumber
        if (!userInput.taxnumber) {
            errors['taxnumber'] = 'Required';
        } else if (userInput.taxnumber.length > 45) {
            errors['taxnumber'] = 'Maximum 45 characters';
        } else if (!userInput.taxnumber.match(/^[0-9.-]+$/)) {
            errors['taxnumber'] = 'Only numeric, dot, and dash';
        }

        // businessfield
        if (!userInput.businessfield) {
            errors['businessfield'] = 'Required';
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
        return status;
    }

    _grabUserInput() {
        const { corporatename, corporatetype, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, businessfield, startdate, enddate } = this.props.enrollmentcorporate.membercorporatedetail;
        return { corporatename, corporatetype, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, businessfield, startdate, enddate };
    }

    getOptionsLanguage() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            langname: 'asc'
        };
        let criteria = {
            active: true
        };
        let url = api.url.language.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, language: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsLanguage = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.langname;
                    result2['value'] = obj.langcode;
                    return result2;
                })


                this.setState(prevState => ({
                    optionsLanguage,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, language: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsCountry() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            countryname: 'asc'
        };
        let criteria = { active: true };
        let url = api.url.country.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, countrycode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsCountry = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.countryname;
                    result2['value'] = obj.countrycode;
                    return result2;
                })


                this.setState(prevState => ({
                    optionsCountry,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, countrycode: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionsState(countrycode = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            statename: 'asc'
        };
        let criteria = {
            countrycode,
            active: true
        }
        let url = api.url.state.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, statecode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsState = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.statename;
                    result2['value'] = obj.statecode;
                    return result2;
                });

                let statecodedisabled = false;
                this.setState(prevState => ({
                    optionsState,
                    statecodedisabled,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, statecode: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionsCity(statecode = '') {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            cityname: 'asc'
        };
        let criteria = {
            statecode,
            active: true
        }
        let url = api.url.city.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, citycode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsCity = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cityname;
                    result2['value'] = obj.citycode;
                    return result2;
                });

                let citycodedisabled = false;
                this.setState(prevState => ({
                    optionsCity,
                    citycodedisabled,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, citycode: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleCorporateNameChange = (event) => {
        let corporatename = event.target.value ? event.target.value : null;
        let membercorporatedetail = { corporatename };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleCorporateTypeChange = (event) => {
        let corporatetype = event === null ? null : event.value;
        let membercorporatedetail = { corporatetype };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleAddressChange = (event) => {
        let address = event.target.value ? event.target.value : null;
        let membercorporatedetail = { address };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleCountryChange = (event) => {
        let countrycode = event === null ? null : event.value;
        let optionsState = [];
        let optionsCity = [];
        let statecodedisabled = true;
        let citycodedisabled = true;
        let statecode = null;
        let citycode = null;
        this.setState({ statecodedisabled, citycodedisabled, optionsState, optionsCity });

        let membercorporatedetail = { countrycode, statecode, citycode };
        this.props.setMemberCorporateDetail(membercorporatedetail);
        if (countrycode) { this.getOptionsState(countrycode); }
    }

    handleStateChange = (event) => {
        let statecode = event === null ? null : event.value;
        let citycodedisabled = true;
        let optionsCity = [];
        let citycode = null;
        this.setState({ citycodedisabled, optionsCity });

        let membercorporatedetail = { statecode, citycode };
        this.props.setMemberCorporateDetail(membercorporatedetail);
        if (statecode) { this.getOptionsCity(statecode); }
    }

    handleCityChange = (event) => {
        let citycode = event === null ? null : event.value;
        let membercorporatedetail = { citycode };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleCorporateEmailChange = (event) => {
        let corporateemail = event.target.value ? event.target.value : null;
        let membercorporatedetail = { corporateemail };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleLanguageChange = (event) => {
        let langcode = event === null ? null : event.value;
        let membercorporatedetail = { langcode };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleTradeBusinessLicenseChange = (event) => {
        let tradebusinesslicense = event.target.value ? event.target.value : null;
        let membercorporatedetail = { tradebusinesslicense };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleTaxNumberChange = (event) => {
        let taxnumber = event.target.value ? event.target.value : null;
        let membercorporatedetail = { taxnumber };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handlePhoneNumChange = (event) => {
        let phonenum = event.target.value ? event.target.value : null;
        let membercorporatedetail = { phonenum };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleBusinessFieldChange = (event) => {
        let businessfield = event === null ? null : event.value;
        let membercorporatedetail = { businessfield };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleStartDateChange = (event) => {
        let startdate = event === null ? null : event;
        let enddate = null;
        let membercorporatedetail = { startdate, enddate };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    handleEndDateChange = (event) => {
        let enddate = event === null ? null : event;
        let membercorporatedetail = { enddate };
        this.props.setMemberCorporateDetail(membercorporatedetail);
    }

    render() {
        const { errors, isLoadingSelect2, statecodedisabled, citycodedisabled } = this.state;
        const { optionsCorporateType, optionsCountry, optionsState, optionsCity, optionsLanguage, optionsBusinessField } = this.state;
        const { corporatename, corporatetype, address, countrycode, statecode, citycode, corporateemail, phonenum, langcode, tradebusinesslicense, taxnumber, businessfield, startdate, enddate } = this.props.enrollmentcorporate.membercorporatedetail;
        
        return (
            <div className="member-enroll">
                <div className="content-title flex-hr mb-0 title-description">
                    <h3 className="title-has-control mt-2">Corporate Information</h3>
                </div>
                <hr className="mt-0" />
                <div className="row">
                    <div className="col">
                        <form className="clearfix position-relative" autoComplete="off">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="corporatename-view">Corporate Name</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="corporatename-view" ref="corporatename" maxLength="200" value={corporatename} onChange={this.handleCorporateNameChange} />
                                            <span className="text-danger">{errors["corporatename"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="corporatetype-view">Corporate Type </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="corporatetype" className="reactSelect2" id="corporatetype-view" options={optionsCorporateType} onChange={this.handleCorporateTypeChange} value={optionsCorporateType.filter(({ value }) => value === corporatetype)}></Select2>
                                            <span className="text-danger">{errors["corporatetype"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="address-view">Address </label>
                                        <div className="col-sm-8">
                                            <textarea rows="3" className="form-control" type="text" id="address-view" ref="address" maxLength="200" value={address} onChange={this.handleAddressChange} />
                                            <span className="text-danger">{this.state.errors["address"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="countrycode-view">Country </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="countrycode" className="reactSelect2" id="countrycode-view" options={optionsCountry} onChange={this.handleCountryChange} value={optionsCountry.filter(({ value }) => value === countrycode)} isLoading={isLoadingSelect2.countrycode}></Select2>
                                            <span className="text-danger">{this.state.errors["countrycode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="statecode-view">State </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="statecode" className="reactSelect2" id="statecode-view" options={optionsState} onChange={this.handleStateChange} value={optionsState.filter(({ value }) => value === statecode)} isLoading={isLoadingSelect2.statecode} disabled={statecodedisabled}></Select2>
                                            <span className="text-danger">{this.state.errors["statecode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="citycode-view">City </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="citycode" className="reactSelect2" id="citycode-view" options={optionsCity} onChange={this.handleCityChange} value={optionsCity.filter(({ value }) => value === citycode)} isLoading={isLoadingSelect2.citycode} disabled={citycodedisabled}></Select2>
                                            <span className="text-danger">{this.state.errors["citycode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="corporateemail-view">Email</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="corporateemail-view" ref="corporateemail" maxLength="45" value={corporateemail} onChange={this.handleCorporateEmailChange} />
                                            <span className="text-danger">{errors["corporateemail"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="phonenum-view">Phone</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="phonenum-view" ref="phonenum" maxLength="45" value={phonenum} onChange={this.handlePhoneNumChange} />
                                            <span className="text-danger">{errors["phonenum"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="langcode-view">Language </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="langcode" className="reactSelect2" id="langcode-view" options={optionsLanguage} onChange={this.handleLanguageChange} value={optionsLanguage.filter(({ value }) => value === langcode)} isLoading={isLoadingSelect2.langcode}></Select2>
                                            <span className="text-danger">{this.state.errors["langcode"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="tradebusinesslicense-view">Trade Business License</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="tradebusinesslicense-view" ref="tradebusinesslicense" maxLength="45" value={tradebusinesslicense} onChange={this.handleTradeBusinessLicenseChange} />
                                            <span className="text-danger">{errors["tradebusinesslicense"]}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="taxnumber-view">Tax Number</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="taxnumber-view" ref="taxnumber" maxLength="45" value={taxnumber} onChange={this.handleTaxNumberChange} />
                                            <span className="text-danger">{errors["taxnumber"]}</span>
                                        </div>
                                    </div>
                                    {/* <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="businessfield-view">Business Field</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" id="businessfield-view" ref="businessfield" maxLength="45" value={businessfield} onChange={this.handleBusinessFieldChange} />
                                            <span className="text-danger">{errors["businessfield"]}</span>
                                        </div>
                                    </div> */}
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label" htmlFor="businessfield-view">Business Field </label>
                                        <div className="col-sm-8">
                                            <Select2 reference="businessfield" className="reactSelect2" id="businessfield-view" options={optionsBusinessField} onChange={this.handleBusinessFieldChange} value={optionsBusinessField.filter(({ value }) => value === businessfield)} ></Select2>
                                            <span className="text-danger">{errors["businessfield"]}</span>
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
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}