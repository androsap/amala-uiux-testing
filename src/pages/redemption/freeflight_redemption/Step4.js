import React, { Component } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import Alert from '../../../components/Alert';
import Loader from '../../../components/Loader';
import { RetrieveRequest } from '../../../utilities/RequestService';
import Select2 from '../../../components/Select2';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { getOptionsDeactive, getTravelerType } from '../../../utilities/Helpers';
import HeaderAwards from '../../../components/Header/Awards';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: [],
            redemptionsummary: {},
            optionsSalutation: [],
            salutationcode: null,
            selfusage: true,
            cardnumber: (this.props.cardnumber) ? this.props.cardnumber : null,
            awardid: (this.props.awardid) ? this.props.awardid : null,
            optionsTravelerType: [
                { label: 'Adult', value: 'ADULT' },
                { label: 'Infant', value: 'INFANT' },
                { label: 'Child', value: 'CHILD' }
            ],
            travelertype: null,
            searchflight: {},
            member: {},
            award: {},
            passengerdata: [],
            salutationcodeparticipant: [],
            travelertypepasrticipant: [],
            memberid: null,
            totalprice: 0,
            priceaward: 0,
            freeaward: false,
            confirmdisabled: false,
            branchcode: null,
            countrycode: null,
            awardcode: null,
            isLoadingSelect2: {
                salutation: false,
            }
        }
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //salutationcode
        // if (!field['salutationcode']) {
        //     errors['salutationcode'] = 'Required';
        // }

        //travelertype
        if (!field['travelertype']) {
            errors['travelertype'] = 'Required';
        }

        //name
        if (!field['name']) {
            errors['name'] = 'Required';
        } else if (!field['name'].match(/^[a-zA-Z\s]+$/)) {
            errors['name'] = 'Only letters and space';
        } else if (field['name'].length > 45) {
            errors['name'] = 'Maximum 45 characters';
        }

        //memberid
        if (field['memberid']) {
            if (!field['memberid'].match(/^[0-9]+$/)) {
                errors['memberid'] = 'Only numeric';
            } else if (field['memberid'].length > 16) {
                errors['memberid'] = 'Maximum 16 characters';
            }
        }

        //familyname
        if (!field['familyname']) {
            errors['familyname'] = 'Required';
        } else if (!field['familyname'].match(/^[a-zA-Z]+$/)) {
            errors['familyname'] = 'Only letters';
        } else if (field['familyname'].length > 45) {
            errors['familyname'] = 'Maximum 45 characters';
        }

        //participant validation
        let passenger = this.state.redemptionsummary.passenger;
        for (let i = 0; i < passenger - 1; i++) {
            //name
            if (!field['name_' + i]) {
                errors['name_' + i] = 'Required';
            } else if (!field['name_' + i].match(/^[a-zA-Z\s]+$/)) {
                errors['name_' + i] = 'Only letters and space';
            } else if (field['name_' + i].length > 45) {
                errors['name_' + i] = 'Maximum 45 characters';
            }

            //memberid
            if (field['memberid_' + i]) {
                if (!field['memberid_' + i].match(/^[0-9]+$/)) {
                    errors['memberid_' + i] = 'Only numeric';
                } else if (field['memberid_' + i].length > 16) {
                    errors['memberid_' + i] = 'Maximum 16 characters';
                }
            }

            //familyname
            if (!field['familyname_' + i]) {
                errors['familyname_' + i] = 'Required';
            } else if (!field['familyname_' + i].match(/^[a-zA-Z]+$/)) {
                errors['familyname_' + i] = 'Only letters';
            } else if (field['familyname_' + i].length > 45) {
                errors['familyname_' + i] = 'Maximum 45 characters';
            }

            // if (!field['salutationcodeparticipant']['salutationcode_' + i]) {
            //     errors['salutationcode_' + i] = 'Required';
            // }

            if (!field['travelertypepasrticipant']['travelertype_' + i]) {
                errors['travelertype_' + i] = 'Required';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        this.getOptionsSalutation();
        this.setState({
            searchflight: this.props.redemption.searchflight,
            member: this.props.redemption.member,
            award: this.props.redemption.award,
            redemptionsummary: this.props.redemption.redemptionsummary
        }, () => this.setSelfUsage(this.state.selfusage));
    }

    getOptionsSalutation() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            salutationname: 'asc'
        };
        let criteria = {
            active: true
        };
        let url = api.url.salutation.list;
        let column = [];
        /*loading select2 get data*/
        this.setState({ isLoadingSelect2: { salutation: true } });
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsSalutation = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.salutationname;
                    result2['value'] = obj.salutationcode;
                    return result2;
                })

                this.setState({
                    optionsSalutation,
                    isLoadingSelect2: { salutation: false }
                });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }

        formData['salutationcode'] = this.state.salutationcode;
        formData['travelertype'] = this.state.travelertype;
        formData['salutationcodeparticipant'] = this.state.salutationcodeparticipant;
        formData['travelertypepasrticipant'] = this.state.travelertypepasrticipant;
        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });

            const { redemptionsummary } = this.state;
            // let data = this.state.redemption;
            let redeemuser = [];
            redeemuser[0] = {};
            redeemuser[0].name = formData.name;
            redeemuser[0].familyname = formData.familyname;
            redeemuser[0].salutationcode = this.state.salutationcode;
            redeemuser[0].memberiduser = formData.memberid;
            redeemuser[0].travelertype = formData.travelertype;
            redeemuser[0].selfusage = (this.state.selfusage) ? 1 : 0;
            redeemuser[0].certificateprice = redemptionsummary.certificateprice;

            let passenger = this.state.redemptionsummary.passenger;
            for (let i = 0; i < passenger - 1; i++) {
                redeemuser[i + 1] = {};
                redeemuser[i + 1].name = formData['name_' + i];
                redeemuser[i + 1].familyname = formData['familyname_' + i];
                redeemuser[i + 1].salutationcode = formData['salutationcodeparticipant']['salutationcode_' + i];
                redeemuser[i + 1].memberiduser = formData['memberid_' + i];
                redeemuser[i + 1].travelertype = formData['travelertypepasrticipant']['travelertype_' + i];
                redeemuser[i + 1].selfusage = 0;
                redeemuser[i + 1].certificateprice = redemptionsummary.certificateprice;
            }

            this.props.setRedeemUser(redeemuser);

            // data.redeemuser = redeemuser;
            // this.props.setData("SETDATA", data);
            this.props.changePage("PAGE", 'step5');
        }
    };

    handleSalutationChange = (event) => {
        let salutationcode = event === null ? null : event.value;
        this.setState({ salutationcode });
    }

    handleSalutationParticipantChange = (event, key) => {
        let value = event === null ? null : event.value;
        let salutationcodeparticipant = this.state.salutationcodeparticipant;
        salutationcodeparticipant[key] = value;
        this.setState({ salutationcodeparticipant });
    }

    handleTravelerTypeParticipantChange = (event, key) => {
        let value = event === null ? null : event.value;
        let travelertypepasrticipant = this.state.travelertypepasrticipant;
        travelertypepasrticipant[key] = value;
        this.setState({ travelertypepasrticipant });
    }

    handleTravelerTypeChange = (event) => {
        let travelertype = event === null ? null : event.value;
        this.setState({ travelertype });
    }

    handleSelfUsageChange = (event) => {
        let selfusage = event === null ? null : event.target.checked;

        this.setSelfUsage(selfusage);

        let { optionsSalutation } = this.state;
        optionsSalutation = getOptionsDeactive('update', optionsSalutation, this.state.member.salutationcode, this.state.member.salutationname);

        this.setState({ optionsSalutation });
    }

    setSelfUsage(selfusage) {
        //if corporate not selfusge
        const { corporatedetailinfo } = this.props.redemption.member;
        if (corporatedetailinfo !== null) { selfusage = false; }

        let salutationcode = null;
        let name = '';
        let memberid = '';
        let familyname = '';
        let travelertype = null;
        if (selfusage) {
            salutationcode = this.state.member.salutationcode;
            name = this.state.member.firstname;
            memberid = this.state.member.cardnumber;
            familyname = this.state.member.lastname;

            /* GET TRAVELER TYPE BASE AGE */
            let { age } = this.state.member;
            travelertype = getTravelerType(age);
        } else {
            travelertype = null;
        }
        this.refs.name.value = name;
        this.refs.memberid.value = memberid;
        this.refs.familyname.value = familyname;

        this.setState({ selfusage, salutationcode, travelertype });
    }

    handleBackStep = (e) => {
        e.preventDefault();
        const { searchflight } = this.state;
        let isreturn = searchflight.isreturn;
        if (isreturn) {
            this.props.changePage("PAGE", 'step3');
        } else {
            this.props.changePage("PAGE", 'step2');
        }
    }

    render() {
        const { formrender } = this.state;
        if (formrender) {
            const { loading, errors, isLoadingSelect2 } = this.state;
            const { optionsSalutation, salutationcode, optionsTravelerType, travelertype, selfusage, award } = this.state;
            const { searchflight } = this.state;

            let passengerInput = [];
            if (searchflight.passenger > 1) {
                for (let key = 0; key < searchflight.passenger - 1; key++) {
                    passengerInput[key] = <div className="col-sm-12 mb-2" key={key}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label" htmlFor={"salutationcode_" + key + "-view"}>Salutation <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                            <div className="col-sm-9">
                                                <Select2 reference={"salutationcode_" + key} className="reactSelect2" id={"salutationcode_" + key + "-view"} options={optionsSalutation} onChange={(e) => this.handleSalutationParticipantChange(e, 'salutationcode_' + key)} isLoading={isLoadingSelect2.salutation}></Select2>
                                                <span className="text-danger">{errors["salutationcode_" + key]}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label" htmlFor={"name_" + key + "-view"}>Name </label>
                                            <div className="col-sm-9">
                                                <input className="form-control" type="text" id={"name_" + key + "-view"} ref={"name_" + key} maxLength="45" />
                                                <span className="text-danger">{errors["name_" + key]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label" htmlFor={"memberid_" + key + "-view"}>GarudaMiles ID <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                            <div className="col-sm-9">
                                                <input className="form-control" type="text" id={"memberid_" + key + "-view"} ref={"memberid_" + key} maxLength="16" />
                                                <span className="text-danger">{errors["memberid_" + key]}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label" htmlFor={"familyname_" + key + "-view"}>Family Name </label>
                                            <div className="col-sm-9">
                                                <input className="form-control" type="text" id={"familyname_" + key + "-view"} ref={"familyname_" + key} maxLength="45" />
                                                <span className="text-danger">{errors["familyname_" + key]}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label" htmlFor={"travelertype_" + key + "-view"}>Traveler Type </label>
                                            <div className="col-sm-9">
                                                <Select2 reference={"travelertype_" + key} className="reactSelect2" id={"travelertype_" + key + "-view"} options={optionsTravelerType} onChange={(e) => this.handleTravelerTypeParticipantChange(e, 'travelertype_' + key)} isLoading={isLoadingSelect2.travelertype} ></Select2>
                                                <span className="text-danger">{errors["travelertype_" + key]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            }

            let headeraward = '';
            if (award.awardcode !== undefined && award.awardcode !== null) {
                headeraward = <HeaderAwards id={award.awardcode} />;
            }

            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Redemption" />
                    <hr className="mt-1" />
                    <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                        <Loader value={loading} />
                        <div className="content-title flex-hr mb-1 title-description row justify-content-between">
                            <div className="col-8 text-left">
                                <h1 className="title-has-control mt-2">
                                    <div className="btn btn-outline-dark circle btn-sm" onClick={(e) => this.handleBackStep(e)}>
                                        <i className="mdi mdi-arrow-left-thick"></i>
                                    </div> &nbsp;Redemption
                                </h1>
                            </div>
                        </div>
                        <hr className="mt-1" />
                        {headeraward}
                        <div className="main-panel mt-3">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h3 className="title-has-control mt-2">Passenger Data</h3>
                            </div>
                            <hr className="mt-0" />
                            <ol className="amala-wizard mb-5 d-flex justify-content-center">
                                <li className="amala-wizard-todo no-hl">
                                    <span>Flight Info</span>
                                </li>
                                <li className="amala-wizard-doing no-hl">
                                    <span>Passenger Data</span>
                                </li>
                                <li className="amala-wizard-todo no-hl">
                                    <span>Completion</span>
                                </li>
                            </ol>
                            <div className="row">
                                <div className="col-sm-12 mb-2">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="selfusage-view">Self Usage</label>
                                                        <div className="col-sm-9">
                                                            <label className="custom-control border-switch">
                                                                <input id="selfusage-view" ref="selfusage" value="1" className="border-switch-control-input" type="checkbox" checked={selfusage} onChange={this.handleSelfUsageChange} />
                                                                <span className="border-switch-control-description">No</span>
                                                                <span className="border-switch-control-indicator"></span>
                                                                <span className="border-switch-control-description">Yes</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="salutationcode-view">Salutation <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                                        <div className="col-sm-9">
                                                            <Select2 reference="salutationcode" className="reactSelect2" id="salutationcode-view" options={optionsSalutation} onChange={this.handleSalutationChange} value={optionsSalutation.filter(({ value }) => value === salutationcode)} isLoading={isLoadingSelect2.salutation} disabled={selfusage} ></Select2>
                                                            <span className="text-danger">{errors["salutationcode"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="name-view">Name </label>
                                                        <div className="col-sm-9">
                                                            <input className="form-control" type="text" id="name-view" ref="name" maxLength="45" disabled={selfusage} />
                                                            <span className="text-danger">{errors["name"]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="memberid-view">GarudaMiles ID <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
                                                        <div className="col-sm-9">
                                                            <input className="form-control" type="text" id="memberid-view" ref="memberid" maxLength="16" disabled={selfusage} />
                                                            <span className="text-danger">{errors["memberid"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="familyname-view">Family Name </label>
                                                        <div className="col-sm-9">
                                                            <input className="form-control" type="text" id="familyname-view" ref="familyname" maxLength="45" disabled={selfusage} />
                                                            <span className="text-danger">{errors["familyname"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="travelertype-view">Traveler Type </label>
                                                        <div className="col-sm-9">
                                                            <Select2 reference="travelertype" className="reactSelect2" id="travelertype-view" options={optionsTravelerType} onChange={this.handleTravelerTypeChange} value={optionsTravelerType.filter(({ value }) => value === travelertype)} isLoading={isLoadingSelect2.travelertype} disabled={selfusage}></Select2>
                                                            <span className="text-danger">{errors["travelertype"]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {passengerInput}

                                <div className="col-sm-12 mt-3">
                                    <div className="form-group row">
                                        <div className="col-sm-3 offset-sm-9">
                                            <button type="submit" className="btn btn-success large w-100">Continue</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;