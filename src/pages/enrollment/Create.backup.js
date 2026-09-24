import React, { Component } from 'react';
import RequestService from '../../utilities/RequestService';
import 'react-Alertify/dist/ReactAlertify.css';
import Alert from '../../components/Alert';
import Services from '../../config/Services';
import Select2 from '../../components/Select2';
import moment from "moment";

var getServices = new Services();
var request     = new RequestService();

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionSalutation: [],
            salutationcode: '',
            optionPhoneCode: [],
            phoneCode: '',
            optionNationality: [],
            nationality: '',
            optionReligion: [],
            religion: '',
            optionTitle: [],
            titlecode: '',
            countrycode: '',
            statecode: '',
            citycode: '',
            businessStatecode: '',
            privateStatecode: '',
            optionCountry: [],
            optionState: [],
            optionStateBusiness: [],
            optionStatePrivate: [],
            optionBusinessCity: [],
            optionPrivateCity: [],
            loading: false,
            errors: [],
            marginLeft: 0,
            page: 1,
            height: 0,
            hobbies: [],
            parameter: {}
        }
    }

    componentDidMount() {
        document.title = "Member Enrollment | Loyalty Management System";
        this.getOptionCountry();
        this.getOptionPhoneCode();
        this.getSalutation();
        this.getReligion();
        this.getNationality();
        this.getTitle();
        this.getHobbies();
    }

    getLanguage(){
        let url = getServices.state.url.language.list;
        let column = ['langcode', 'langname'];
        var result = request.getDataList(url, '', column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.langcode;
                result2['value'] = obj.langname;
                return result2;
            })

            this.setState({
                optionLanguage: result
            });
        });
    }

    getSalutation(){
        let url = getServices.state.url.salutation.list;
        let column = ['salutationcode', 'salutationname'];
        var result = request.getDataList(url, '', column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.salutationname;
                result2['value'] = obj.salutationcode;
                return result2;
            })

            this.setState({
                optionSalutation: result
            });
        });
    }

    getReligion(){
        let url = getServices.state.url.religion.list;
        let column = ['religionid', 'religionname'];
        var result = request.getDataList(url, '', column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.religionname;
                result2['value'] = obj.religionid;
                return result2;
            })

            this.setState({
                optionReligion: result
            });
        });
    }

    getNationality(){
        let url = getServices.state.url.country.list;
        let column = ['countrycode', 'countryname'];
        var result = request.getDataList(url, {sort: {nationality: 'asc'}}, column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.countryname;
                result2['value'] = obj.countrycode;
                return result2;
            })

            this.setState({
                optionNationality: result
            });
        });
    }

    getTitle(){
        let url = getServices.state.url.title.list;
        let column = ['titlecode','titlename'];
        var result = request.getDataList(url, '', column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.titlename;
                result2['value'] = obj.titlecode;
                return result2;
            })

            this.setState({
                optionTitle: result
            });
        });
    }

    handleCountryChange = (event) => {
        let countrycode = event === null ? null : event.value;
        this.setState({ countrycode: countrycode});
    }

    handleNationalityChange = (event) => {
        let nationalitycode = event === null ? null : event.value;
        this.setState({ nationalitycode: nationalitycode});
    }

    handleBusinessCountryChange = (event) => {
        let countrycodeBusiness = event === null ? null : event.value;
        this.setState({ countrycodeBusiness: countrycodeBusiness});
        this.getOptionState(countrycodeBusiness, 'business');
    }

    handlePrivateCountryChange = (event) => {
        let countrycodePrivate = event === null ? null : event.value;
        this.setState({ countrycodePrivate: countrycodePrivate});
        this.getOptionState(countrycodePrivate, 'private');
    }

    handleBusinessCityChange = (event) => {
        let citycode = event === null ? null : event.value;
        this.setState({ businessCitycode: citycode});
    }

    handlePrivateCityChange = (event) => {
        let citycode = event === null ? null : event.value;
        this.setState({ privateCitycode: citycode});
    }

    handleBusinessStateChange = (event) => {
        let businessStatecode = event === null ? null : event.value;
        let businessCitycode = null;
        let optionBusinessCity = [];
        this.setState({ businessStatecode, businessCitycode, optionBusinessCity });
        if (businessStatecode) { this.getOptionCity(businessStatecode,'business'); }
    }

    handlePrivateStateChange = (event) => {
        let privateStatecode = event === null ? null : event.value;
        let privateCitycode = null;
        let optionPrivateCity = [];
        this.setState({ privateStatecode, privateCitycode, optionPrivateCity });
        if (privateStatecode) { this.getOptionCity(privateStatecode,'private'); }
    }

    handlePhoneCodeChange = (event, type = 'null') => {
        switch (type){
            case 'businessPhone':
                this.setState({ 'businessPhoneCode' : event.value })
                break;
            case 'privatePhone':
                this.setState({ 'privatePhoneCode' : event.value })
                break;
            case 'businessFax':
                this.setState({ 'businessFaxCode' : event.value })
                break;
            case 'privateFax':
                this.setState({ 'privateFaxCode' : event.value })
                break;
            default:
                this.setState({ 'defaultPhoneCode' : event.value })
                break;
        }
    }

    //get option country for select2 dropdown in form
    getOptionCountry() {
        let parameter = {
            sort: {
                countryname: 'asc'
            }
        }
        let url = getServices.state.url.country.list;
        let column = ['countrycode', 'countryname'];
        var result = request.getDataList(url, parameter, column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.countryname;
                result2['value'] = obj.countrycode;
                return result2;
            })

            this.setState({
                optionCountry: result
            });
        });
    }

    //get option state for select2 dropdown in form
    getOptionState(countrycode = '', type = '') {
        let parameter = {
            sort: {
                statename: 'asc'
            },
            criteria: {
                countrycode
            }
        };
        let url = getServices.state.url.state.list;
        let column = ['statecode', 'statename'];
        var result = request.getDataList(url, parameter, column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.statename;
                result2['value'] = obj.statecode;
                return result2;
            })

            if (type==='business') {
                this.setState({
                    optionStateBusiness: result
                });
            }else{
                this.setState({
                    optionStatePrivate: result
                });
            }
        });
    }

    //get option city for select2 dropdown in form
    getOptionCity(statecode = '', type = '') {
        let criteria = {
            criteria: {
                statecode
            }
        };
        let url = getServices.state.url.city.list;
        let column = ['citycode', 'cityname', 'statecode'];
        var result = request.getDataList(url, criteria, column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = obj.cityname;
                result2['value'] = obj.citycode;
                return result2;
            })

            if (type==='business') {
                this.setState({
                    optionBusinessCity: result
                });
            }else{
                this.setState({
                    optionPrivateCity: result
                });
            }
        });
    }

    getOptionPhoneCode() {
        let parameter = {
            sort: {
                countryname: 'asc'
            }
        }
        let url = getServices.state.url.country.list;
        let column = ['countrycode', 'countryname', 'countryphonecode'];
        var result = request.getDataList(url, parameter, column);
        result.then((response) => {
            //remapping for base option select2
            var result = response.result.map(obj => {
                var result2 = {};
                result2['label'] = `${obj.countryname} (${obj.countryphonecode})` ;
                result2['value'] = obj.countryphonecode;
                return result2;
            })

            this.setState({
                optionPhoneCode: result
            });
        });
    }

    getHobbies() {
        let url = getServices.state.url.hobbies.list;
        let column = ['hobbiesid', 'hobbiesname'];
        var result = request.getDataList(url, this.state, column);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    hobbies: response.result
                });
            }
        });
    }

    saveAction = () => {
        this.setState({ loading: true });

        let url        = getServices.state.url.enroll.create;
        let parameter  = this.state.parameter;
        var insertData = request.insertData(url, parameter);
        if (insertData) {
            insertData.then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    Alert.success('New data has been created');
                    this.props.history.push('/member');
                } else {
                    Alert.error(response.status.responsemessage ? response.status.responsemessage : response.status.responsedesc);
                    this.setState({ loading: false });
                }
            })
        }
    };


    handleSalutationChange = (event) => {
        let salutationcode = event === null ? null : event.value;
        this.setState({ salutationcode: salutationcode });
    }

    handleTitleChange = (event) => {
        let titlecode = event === null ? null : event.value;
        this.setState({ titlecode });
    }

    handleReligionChange = (event) => {
        let religionid = event === null ? null : event.value;
        this.setState({ religionid });
    }

    validate(el){
        let status = true;
        let message = "";
        let field = el.getAttribute("validation");
        const splitField = field.split("|");
        for (let split of splitField){
            switch (split){
                case "required":
                    if (el.value === ""){
                        status = false;
                        message = "This field is required";
                    }
                    break;
                case "email":
                    if (!el.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        status = false;
                        message = "Invalid email address";
                    }
                    break;
                case "numeric":
                    if (!el.value.match(/^[0-9]+$/)) {
                        status = false;
                        message = "Invalid number";
                    }
                    break;
                default:
                    status = true;
            }
            if (status===false) break;
        }

        let result = {status: status, message: message};
        return result;
    }

    nextPage(step){
        let currentStep = step-1;
        let error = false;
        let errorMsg = {}, formData = {}, memberaddress = {}, membercontact = {}, membercard = {};
        let hobbiesValue = [];
        let addressField = ["businesscountry", "businessstate", "businesscity", "privatecountry", "privatestate", "privateaddress", "privatecity" ];
        let contactField = ["businessphonecountrycode", "businessfaxcountrycode", "privatephonecountrycode", "privatefaxcountrycode", "mobilecountrycode"]
        let dataStep = document.getElementById("step"+currentStep).getElementsByTagName("input");
        for (const el of dataStep) {
            let inputName = el.getAttribute("name");
            let validation = el.getAttribute("validation");
            if (validation !==null ){
                let validate = this.validate(el);
                if (validate.status===false){
                    errorMsg[inputName] = validate.message;
                    error=true;
                }
            }
            // handle form data
            if (inputName!==null) {
                if (el.type==="radio") if (el.checked!==true) continue;
                switch (inputName) {
                    case ("membertier"):
                        formData.membertier = {tierid: el.value};
                        break;
                    case ("enrolldate") :
                        formData[inputName] = moment(el.value).format("YYYY-MM-DD");
                        break;
                    case ("dateofbirth") :
                        formData[inputName] = moment(el.value).format("YYYY-MM-DD");
                        break;
                    case ("hobbies") :
                        if (el.checked === true) {
                            hobbiesValue.push({hobbiesid: el.value});
                            formData.hobbies = hobbiesValue;
                        }
                        break;
                    default:
                        if (el.getAttribute('membertype') === 'memberaddress' || addressField.indexOf(inputName) !== -1) {
                            memberaddress[inputName] = el.value;
                            formData.memberaddress = memberaddress;
                        } else if (el.getAttribute('membertype') === 'membercontact' || contactField.indexOf(inputName) !== -1) {
                            membercontact[inputName] = el.value;
                            formData.membercontact = membercontact;
                        }else if (el.getAttribute('membertype') === 'cardmember'){
                            membercard[inputName] = el.value;
                            formData.membercard = membercard;
                        }else{
                            formData[inputName] = el.value;
                            if(inputName==='firstname'||inputName==='middlename'||inputName==='lastname'){
                               let memberfullname = formData['firstname']+" "+formData['middlename']+" "+formData['lastname'];
                               formData.memberfullname = memberfullname;
                            }
                        }
                        break;
                }
                formData.langcode = "ID";
                let parameter = Object.assign(this.state.parameter, formData);
                this.setState({ parameter: parameter });
            }
        }
        this.setState({errors:errorMsg});
        if (currentStep===5 && !error ) {
            this.saveAction();
        }else{
            let leftMargin =  !error ? (this.state.marginLeft)-1166 : this.state.marginLeft;
            let page = !error ? step : currentStep;
            this.setState({marginLeft: leftMargin, page: page});
        }
    }

    prevPage(step){
        let leftMargin = (this.state.marginLeft)+1166;
        this.setState({marginLeft: leftMargin, page: step});
    }

    getTier(tierID){
        let tier = {999: "Freshblue Member", 1012: "EC+ Member", 1015: "VIP Member"};
        return tier[tierID];
    }

    render() {
        const { businessCitycode, privateCitycode, businessStatecode, privateStatecode, nationalitycode, countrycode, countrycodeBusiness, countrycodePrivate  } = this.state;
        const { defaultPhoneCode, privatePhoneCode, businessPhoneCode, privateFaxCode, businessFaxCode } = this.state;
        const enrollType = this.getTier(this.props.location.state.enrollType);
        const hobbies =
                this.state.hobbies.map((value, key)=>
                    <label className="custom-control fill-checkbox" key={key}>
                        <input name="hobbies" value={value.hobbiesid} type="checkbox" className="fill-control-input" tabIndex="-1" />
                        <span className="fill-control-indicator"></span>
                        <span className="fill-control-description">{value.hobbiesname}</span>
                    </label>
                );
        return (
            <div className="container-fluid">
                <div className="dashboard-breadcrumb clean">
                    <ul className="list-unstyled">
                        <li><i className="mdi mdi-home"></i> Dashboard&nbsp;</li>
                        <li>&nbsp;Enrollment&nbsp;</li>
                        <li>&nbsp;Enrollment Member&nbsp;</li>
                    </ul>
                </div>
                <div className="t-panel">
                    <div className="content-option country-panel">
                        <div className="content-title flex-hr">
                            <h3 className="title-has-control">Enrollment</h3>
                        </div>
                        <div className="panel-form">
                            <div className="member-enroll">
                                <form id="ecMember2" className="lms-form easyWizardElement easyPager" style={{position: "relative", overflow: "hidden"}}>
                                    <ul className="easyWizardSteps">
                                        <li data-step="1" ref="step1" className={this.state.page===1 ? "current" : ""}><span>1</span> Tier</li>
                                        <li data-step="2" ref="step2" className={this.state.page===2 ? "current" : ""}><span>2</span> Personal Information</li>
                                        <li data-step="3" ref="step3" className={this.state.page===3 ? "current" : ""}><span>3</span> Address and Contact
                                        </li>
                                        <li data-step="4" ref="step4" className={this.state.page===4 ? "current" : ""}><span>4</span> Personal Interest</li>
                                        <li data-step="5" ref="step5" className={this.state.page===5 ? "current" : ""}><span>5</span> Card Number</li>
                                    </ul>
                                    <div className="easyWizardWrapper"
                                         style={{width: '6233.45px', marginLeft: `${this.state.marginLeft}px`, transition: "0.6s ease" }}>
                                        <section id="step1" className="step active" data-step-title="Tier" data-step="1" style={{float: "left",width: "1173px", height:this.state.page===1 ? "auto" : "1px" }}>
                                            <div className="member-partial">
                                                <div className="partial-title">
                                                    <h3>Tier</h3>
                                                    <p>Some description of tier lorem ipsum</p>
                                                </div>
                                                <div className="step-field">
                                                    <div className="form-group"><label
                                                        className="control-label">Tier</label>
                                                        <input name="membertier" type="hidden" value={this.props.location.state.enrollType} />
                                                        <input type="text" className="form-control" value={enrollType} readOnly placeholder="enter tier" tabIndex="-1" />
                                                    </div>
                                                </div>
                                                <div className="button-step">
                                                    <button type="button" className="btn btn-default normal next"
                                                            tabIndex="-1" onClick={(e)=>this.nextPage(2)}>Personal Information <i
                                                        className="mdi mdi-chevron-right"></i></button>
                                                </div>
                                            </div>
                                        </section>
                                        <section className="step" data-step-title="Personal Information" data-step="2" id="step2" style={{float: "left",width: "1173px", height:this.state.page===2 ? "auto" : "1px" }}>
                                            <div className="member-partial">
                                                <div className="partial-title">
                                                    <h3>Personal Information</h3>
                                                    <p>Some description of lorem ipsum</p>
                                                </div>
                                                <div className="step-field">
                                                    <div className="form-group">
                                                        <label className="control-label">Date Enrollment <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="input-group date" data-provide="datepicker">
                                                            <input required type="text" name="enrolldate" className="form-control has-date" tabIndex="-1" validation="required" />
                                                            <div className="input-group-addon">
                                                                <span className="mdi mdi-calendar"></span>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{this.state.errors["enrolldate"]}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="countrycode-view">Salutation <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div>
                                                            <Select2 name="salutationcode" className="form-control" id="salutationcode" options={this.state.optionSalutation} value={this.state.salutationcode} onChange={(e)=>this.handleSalutationChange(e)}></Select2>
                                                            <span className="text-danger">{this.state.errors["salutationcode"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Gender <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="radio-group">
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input validation="required" name="gender" value="male" id="radio1" type="radio" tabIndex="-1" defaultChecked />
                                                                <label htmlFor="radio1">Male</label>
                                                            </div>
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input validation="required" name="gender" value="female" id="radio2" type="radio" tabIndex="-1" />
                                                                <label htmlFor="radio2">Female</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Customer Status <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="radio-group">
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input name="status" value="Active" type="radio" defaultChecked />
                                                                <label htmlFor="businessAddress">Active</label>
                                                            </div>
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input name="status" value="Not Active" type="radio" />
                                                                <label htmlFor="homeAddress">Not Active</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="dual-field flex-hr justify-content-start">
                                                        <div className="form-group">
                                                            <label className="control-label">Username
                                                                <span className="form-asterisk"><i className="mdi mdi-asterisk"></i></span>
                                                            </label>
                                                            <input type="text" className="form-control" tabIndex="-1" name="username" validation="required" />
                                                            <span className="text-danger">{this.state.errors["username"]}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="control-label">Password
                                                                <span className="form-asterisk"><i className="mdi mdi-asterisk"></i></span>
                                                            </label>
                                                            <input type="password" className="form-control" name="password" validation="required" />
                                                            <span className="text-danger">{this.state.errors["password"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="dual-field flex-hr justify-content-start">
                                                        <div className="form-group">
                                                            <label className="control-label">First name
                                                                <span className="form-asterisk"><i className="mdi mdi-asterisk"></i></span>
                                                            </label>
                                                            <input type="text" className="form-control" tabIndex="1" name="firstname" validation="required" />
                                                            <span className="text-danger">{this.state.errors["firstname"]}</span>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="control-label">Middle name</label>
                                                            <input type="text" className="form-control" tabIndex="1" name="middlename" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="control-label">Last name</label>
                                                            <input type="text" className="form-control" tabIndex="2" name="lastname" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Date of birth <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="input-group date" data-provide="datepicker">
                                                            <input type="text" className="form-control has-date" name="dateofbirth" tabIndex="-1" validation="required" />
                                                            <div className="input-group-addon"><span className="mdi mdi-calendar"></span></div>
                                                        </div>
                                                        <span className="text-danger">{this.state.errors["dateofbirth"]}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Nationality <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div>
                                                            <Select2 name="nationality" className="form-control" options={this.state.optionCountry} tabIndex="-1" value={nationalitycode} onChange={(e)=>this.handleNationalityChange(e)} ></Select2>
                                                            <span className="text-danger">{this.state.errors["nationality"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Religion <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div>
                                                            <Select2 name="religionid" className="form-control" required options={this.state.optionReligion} tabIndex="-1" value={this.state.religionid} onChange={(e)=>this.handleReligionChange(e)} ></Select2>
                                                            <span className="text-danger">{this.state.errors["religion"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Passport No. <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <input type="text" name="passportnumber" className="form-control" placeholder="example: A1234" validation="required" tabIndex="-1" />
                                                        <span className="text-danger">{this.state.errors["passportnumber"]}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">ID Card <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <input type="text" name="idcardnumber" validation="required" className="form-control" placeholder="enter id card number" tabIndex="-1" />
                                                        <span className="text-danger">{this.state.errors["idcardnumber"]}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="countrycode-view">Job Title <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div>
                                                            <Select2 name="titlecode" reference="countrycode" className="form-control" id="countrycode-view" options={this.state.optionTitle} onChange={this.handleCountryChange} value={countrycode} tabIndex="-1"></Select2>
                                                            <span className="text-danger">{this.state.errors["title"]}</span>
                                                        </div>
                                                     </div>
                                                </div>
                                                <div className="button-step">
                                                    <button type="button"
                                                            className="btn btn-default normal previous"
                                                            tabIndex="-1" onClick={(e)=>this.prevPage(1)} ><i
                                                        className="mdi mdi-chevron-left" ></i> Previous
                                                    </button>
                                                    &nbsp;&nbsp;
                                                    <button type="button" className="btn btn-default normal next"
                                                            tabIndex="-1" onClick={(e)=>this.nextPage(3)} >Address Information<i
                                                        className="mdi mdi-chevron-right"></i></button>
                                                </div>
                                            </div>
                                        </section>
                                        <section id="step3" className="step" data-step-title="Address and Contact" data-step="3" style={{float: "left", width:" 1167px", height:this.state.page===3 ? "auto" : "1px" }}>
                                            <div className="member-partial">
                                                <div className="partial-title">
                                                    <h3>Address and Contact Information</h3>
                                                    <p>Some description of tier lorem ipsum</p>
                                                </div>
                                                <div className="step-field">
                                                    <div className="form-group">
                                                        <label className="control-label">Please select your preferred address</label>
                                                        <div className="radio-group">
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input membertype="memberaddress" name="prefferedaddress" value="Business" id="businessAddress" type="radio" defaultChecked />
                                                                <label htmlFor="businessAddress">Business address</label>
                                                            </div>
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input membertype="memberaddress" name="prefferedaddress" value="Private" id="homeAddress" type="radio" />
                                                                <label htmlFor="homeAddress">Private address</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="dual-field for-address">
                                                        <div className="field-left">
                                                            <h3>Business address</h3>
                                                            <div className="form-group">
                                                                <label className="control-label">Company name <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <input name="companyname" type="text" className="form-control" validation="required" />
                                                                <span className="text-danger">{this.state.errors["companyname"]}</span>
                                                            </div>
                                                            <div className="form-group ext">
                                                                <label className="control-label">Business address <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <input membertype="memberaddress" name="businessaddress" type="text" validation="required" className="form-control" placeholder="enter your address" />
                                                                <span className="text-danger">{this.state.errors["businessaddress"]}</span>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="control-label">Postal code <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <input membertype="memberaddress" name="businesspostal" type="text" validation="required|numeric" className="form-control" />
                                                                <span className="text-danger">{this.state.errors["businesspostal"]}</span>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="countrycode-view">Country <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <div>
                                                                    <Select2 membertype="memberaddress" name="businesscountry" reference="countrycode" className="form-control" options={this.state.optionCountry} onChange={(e)=>this.handleBusinessCountryChange(e)} value={countrycodeBusiness}></Select2>
                                                                    <span className="text-danger">{this.state.errors["businesscountry"]}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label">Province or State <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <div>
                                                                    <Select2 membertype="memberaddress" name="businessstate" reference="statecode" className="form-control" id="statecode-view" options={this.state.optionStateBusiness} onChange={(e)=>this.handleBusinessStateChange(e)} value={businessStatecode}></Select2>
                                                                    <span className="text-danger">{this.state.errors["businessstate"]}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="citycode-view">City <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <div>
                                                                    <Select2 membertype="memberaddress" name="businesscity" reference="citycode" className="form-control" id="citycode-view" options={this.state.optionBusinessCity} onChange={(e)=>this.handleBusinessCityChange(e)} value={businessCitycode}></Select2>
                                                                    <span className="text-danger">{this.state.errors["businesscity"]}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="field-right">
                                                            <h3>Private address</h3>
                                                            <div className="form-group"><label className="control-label">Postal code <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <input type="text" membertype="memberaddress" name="privatepostal" validation="required|numeric" className="form-control" />
                                                                <span className="text-danger">{this.state.errors["privatepostal"]}</span>
                                                            </div>
                                                            <div className="form-group"><label className="control-label">Private Address <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <input type="text" membertype="memberaddress" name="privateaddress" validation="required" className="form-control" />
                                                                <span className="text-danger">{this.state.errors["privateaddress"]}</span>
                                                            </div>
                                                            <div className="form-group">
                                                                <div className="form-group">
                                                                    <label className="form-label">Country <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                    <div>
                                                                        <Select2 membertype="memberaddress" name="privatecountry" className="form-control" options={this.state.optionCountry} onChange={(e)=>this.handlePrivateCountryChange(e)} value={countrycodePrivate}></Select2>
                                                                        <span className="text-danger">{this.state.errors["country-private"]}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label">Province or State <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <div>
                                                                    <Select2 membertype="memberaddress" name="privatestate" reference="statecode" className="form-control" id="statecode-view" options={this.state.optionStatePrivate} onChange={(e)=>this.handlePrivateStateChange(e)} value={privateStatecode}></Select2>
                                                                    <span className="text-danger">{this.state.errors["statecode"]}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="citycode-view">City <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                                <div>
                                                                    <Select2 membertype="memberaddress" name="privatecity" reference="citycode" className="form-control" id="citycode-view" options={this.state.optionPrivateCity} onChange={(e)=>this.handlePrivateCityChange(e)} value={privateCitycode}></Select2>
                                                                    <span className="text-danger">{this.state.errors["citycode"]}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h3 className="inner-title for-contact">Email and Phone</h3>
                                                    <div className="form-group">
                                                        <label className="control-label">Email address <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <input membertype="membercontact" validation="required|email" name="email" type="text" className="form-control" placeholder="example: yourname@domain.com" />
                                                        <span className="text-danger">{this.state.errors["email"]}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Business phone <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="row col-sm-8">
                                                            <div className="col-sm-4">
                                                                <Select2 membertype="membercontact" name="businessphonecountrycode" className="form-control" options={this.state.optionPhoneCode} onChange={(e)=>this.handlePhoneCodeChange(e, 'businessPhone')} value={businessPhoneCode} placeholder="select country code"></Select2>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="businessphoneregioncode" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter region code" />
                                                                <span className="text-danger">{this.state.errors["businessphoneregioncode"]}</span>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="businessphone" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter fax number" />
                                                                <span className="text-danger">{this.state.errors["businessphone"]}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Business fax <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="row col-sm-8">
                                                            <div className="col-sm-4">
                                                                <Select2 membertype="membercontact" name="businessfaxcountrycode" className="form-control" options={this.state.optionPhoneCode} onChange={(e)=>this.handlePhoneCodeChange(e, 'businessFax')} value={businessFaxCode} placeholder="select country code"></Select2>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="businessfaxregioncode" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter region code" />
                                                                <span className="text-danger">{this.state.errors["businessfaxregioncode"]}</span>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="businessfax" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control"placeholder="enter phone number" />
                                                                <span className="text-danger">{this.state.errors["businessfax"]}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group"><label className="control-label">Private Phone <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="row col-sm-8">
                                                            <div className="col-sm-4">
                                                                <Select2 membertype="membercontact" name="privatephonecountrycode" className="form-control" options={this.state.optionPhoneCode} onChange={(e)=>this.handlePhoneCodeChange(e, 'privatePhone')} value={privatePhoneCode} placeholder="select country code"></Select2>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="privatephoneregioncode" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter region code" />
                                                                <span className="text-danger">{this.state.errors["privatephoneregioncode"]}</span>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="privatephone" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter phone number" />
                                                                <span className="text-danger">{this.state.errors["privatephone"]}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Private fax <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="row col-sm-8">
                                                            <div className="col-sm-4">
                                                                <Select2 membertype="membercontact" name="privatefaxcountrycode" className="form-control" options={this.state.optionPhoneCode} onChange={(e)=>this.handlePhoneCodeChange(e, 'privateFax')} value={privateFaxCode} placeholder="select country code"></Select2>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="privatefaxregioncode" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter region code" />
                                                                <span className="text-danger">{this.state.errors["privatefaxregioncode"]}</span>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="privatefax" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter fax number" />
                                                                <span className="text-danger">{this.state.errors["privatefax"]}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Mobile Phone <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <div className="row col-sm-8">
                                                            <div className="col-sm-4">
                                                                <Select2 membertype="membercontact" name="mobilecountrycode" className="form-control" options={this.state.optionPhoneCode} onChange={(e)=>this.handlePhoneCodeChange(e)} value={defaultPhoneCode} placeholder="select country code"></Select2>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input membertype="membercontact" name="mobilephone" type="text" validation="required|numeric" style={{width: "inherit"}} className="form-control" placeholder="enter phone number" />
                                                                <span className="text-danger">{this.state.errors["mobilephone"]}</span>
                                                            </div>
                                                            <div className="col-sm-4"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="button-step">
                                                    <button type="button"
                                                            className="btn btn-default normal previous" onClick={(e)=>this.prevPage(2)}><i
                                                        className="mdi mdi-chevron-left"></i> Personal Information
                                                    </button>
                                                    &nbsp;&nbsp;
                                                    <button type="button"
                                                            className="btn btn-default normal next" onClick={(e)=>this.nextPage(4)}>Personal
                                                        Interest<i className="mdi mdi-chevron-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </section>
                                        <section className="step" id="step4" data-step-title="Personal Interest" data-step="4"
                                                 style={{float: "left", width: "1173px", height:this.state.page===4 ? "auto" : "1px" }}>
                                            <div className="control-group">
                                                <div className="member-partial">
                                                    <div className="partial-title">
                                                        <h3>Personal Interest</h3>
                                                        <p>Choose your interest lorem ipsum dolor</p>
                                                    </div>
                                                    <div className="step-field">
                                                        <h3 className="inner-title for-contact">Preferences and Interests</h3>
                                                        <div className="form-group has-checkbox">
                                                            <label className="control-label">Hobby <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                            <div className="multiple-checkbox">
                                                                { hobbies }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="button-step">
                                                        <button type="button"
                                                                className="btn btn-default normal previous"
                                                                tabIndex="-1" onClick={(e)=>this.prevPage(3)}><i
                                                            className="mdi mdi-chevron-left"></i> Address and
                                                            Contact Information
                                                        </button>
                                                        &nbsp;&nbsp;
                                                        <button type="button"
                                                                className="btn btn-default normal next"
                                                                tabIndex="-1" onClick={(e)=>this.nextPage(5)}>Card and Registration Information<i
                                                            className="mdi mdi-chevron-right"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <section id="step5" className="step" data-step-title="Card Number" data-step="5"
                                                 style={{float: "left", width: "1173px", height:this.state.page===5 ? "auto" : "1px" }}>
                                            <div className="member-partial">
                                                <div className="partial-title">
                                                    <h3>Registration Information</h3>
                                                    <p>Some description of card and resgistration lorem ipsum</p>
                                                </div>
                                                <div className="step-field">
                                                    <h3 className="inner-title fir-step">Registration</h3>
                                                    <div className="form-group">
                                                        <label className="control-label">Name on Card <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                        <input membertype="cardmember" name="nameoncard" type="text" className="form-control" validation="required" />
                                                        <span className="text-danger">{this.state.errors["nameoncard"]}</span>
                                                    </div>
                                                    {/*<div className="form-group">*/}
                                                        {/*<label className="control-label">Card Number</label>*/}
                                                        {/*<input membertype="cardmember" name="cardnumber" type="text" className="form-control" required />*/}
                                                        {/*<span className="text-danger">{this.state.errors["cardnumber"]}</span>*/}
                                                    {/*</div>*/}
                                                    <div className="form-group"><label className="control-label">Form of registration</label>
                                                        <div className="radio-group">
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input name="enrollchannel" value="CSS" id="reg1" type="radio" tabIndex="-1" defaultChecked />
                                                                <label htmlFor="reg1"> CSS</label>
                                                            </div>
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input name="enrollchannel" value="Walk In" id="reg2" type="radio" tabIndex="-1" />
                                                                <label htmlFor="reg2">Walk In</label>
                                                            </div>
                                                            <div className="rdio rdio-primary radio-inline">
                                                                <input name="enrollchannel" value="Travel Agent" id="reg3" type="radio" tabIndex="-1" />
                                                                <label htmlFor="reg3">Travel Agent</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="button-step">
                                                    <button type="button" className="btn btn-default normal" tabIndex="-1" onClick={(e)=>this.prevPage(4)}>Personal Interest
                                                    </button>
                                                    &nbsp;&nbsp;
                                                    <button className="btn btn-default normal next" tabIndex="-1" type="button"  onClick={(e)=>this.nextPage(6)}>
                                                        <i className="mdi mdi-check"></i> Enroll Member
                                                    </button>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;