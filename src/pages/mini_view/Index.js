import React, { Component } from 'react';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import { RequestWithoutAuth } from '../../utilities/RequestService';
import { api } from '../../config/Services';
// import ReCAPTCHA from "react-google-recaptcha";
// import RCG from 'react-captcha-generator';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            loading: false,
            responsedata: '',
            cardnumber: null,
            name: null,
            tier: null,
            startperiod: null,
            endperiod: null,
            status: null
        }
        this.baseState = this.state;
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //password
        if (!field['cardnumber']) {
            errors['cardnumber'] = 'Required';
        } else if (!field['cardnumber'].match(/^[0-9]+$/)) {
            errors['cardnumber'] = 'Only numeric';
        }

        // if() {
        //     errors['cobacaptcha'] = 'Please verify that you are not a robot.';
        // }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        document.title = "Member Mini View | Loyalty Management System";
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

        if (this.handleValidation(formData)) {
            this.setState({ loading: true });

            let cardnumber = formData.cardnumber;
            let type = 'SUMMARY';
            let data = { cardnumber, type };
            let url = api.url.member.profile;
            RequestWithoutAuth(url, data).then((response) => {
                const { result } = response;
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    let responsedata = responsecode.substring(0, 1) === '0';
                    let cardnumber = (result.membercards[0] && result.membercards[0].cardnumber) ? result.membercards[0].cardnumber : '-';
                    let firstname = (result.firstname) ? result.firstname : '';
                    let lastname = (result.lastname) ? result.lastname : '';
                    let name = (firstname || lastname) ? firstname + ' ' + lastname : '-';
                    let membershipname = (result.membercards[0] && result.membercards[0].membershipname) ? result.membercards[0].membershipname : '';
                    let tiername = (result.membercards[0] && result.membercards[0].tiername) ? result.membercards[0].tiername : '';
                    let tier = (membershipname || tiername) ? membershipname + ' - ' + tiername : '-';
                    let startperiod = (result.memberaccount && result.memberaccount.startperiod) ? moment(result.memberaccount.startperiod).format("DD/MM/YYYY") : '-';
                    let endperiod = (result.memberaccount && result.memberaccount.endperiod) ? moment(result.memberaccount.endperiod).format("DD/MM/YYYY") : '-';
                    let status = (result.status) ? result.status : '-';

                    this.setState({ cardnumber, name, tier, startperiod, endperiod, status, responsedata });
                } else {
                    Alert.error(responsemessage);
                    this.setState({ responsedata: responsemessage })
                }
                this.setState({ loading: false });
            })
        }
    };

    onResetClick = () => {
        this.refs.cardnumber.value = '';
        // this.refs.cobacaptcha.reset();
        this.setState(this.baseState);
    }

    handleCaptchaChange = () => {
        // this.refs.cobacaptcha.current.getValue();
        this.refs.cobacaptcha.current.getCaptchaId();
        // this.setState({captchachecked});
    }

    render() {
        const { errors, loading, responsedata } = this.state;
        const { cardnumber, name, tier, startperiod, endperiod, status } = this.state;
        // console.log('cap', this.state.captchachecked)

        return (
            <div className="dashboard">
                <div className="main-dashboard" style={{ "background": "#333 url('/assets/images/bg_dark.png')" }}>
                    <div className="main">
                        <div className="dashboard-content">
                            <div className="container-fluid">
                                <div className="col-md-6 offset-md-3">
                                    <div className="main-panel" style={{ "boxShadow": "0 1px 15px 1px rgba(255,255,255,.3)", "borderRadius": "8px" }}>
                                        <div className="content-title flex-hr mb-0 title-description text-center">
                                            <div className="row">
                                                <div className="col-4"><img src="/assets/images/logo.png" alt="Asyst Logo" className="img-fluid" /></div>
                                                <div className="col-8"><h1 className="mt-2">Loyalty Management System</h1></div>
                                            </div>
                                        </div>
                                        <div className="top-filter" style={{ "border": "2px solid rgba(70,70,70,.2)" }}>
                                            <form className="form-horizontal position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                                <div className="m-4">
                                                    <h4 className="mt-2">Member Search</h4>
                                                    <hr className="mt-1" />
                                                    <div className="form-group row">
                                                        <label className="col-sm-3 col-form-label" htmlFor="cardnumber-view">Card Number </label>
                                                        <div className="col-sm-9">
                                                            <input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" maxLength="45" placeholder="Card Number" />
                                                            <span className="text-danger">{errors["cardnumber"]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        {/* <label className="col-sm-3 col-form-label" htmlFor="captcha-view">Captcha Verify </label> */}
                                                        <div className="col-sm-9 offset-md-3">
                                                            {/* <ReCAPTCHA ref="cobacaptcha" id="cobacaptcha" onChange={this.handleCaptchaChange} sitekey="6LfVBrgUAAAAAFYNjqXu59d3zBTKpyvu4C4-Gu54" /> */}
                                                            <span className="text-danger">{errors["cobacaptcha"]}</span>
                                                            {/* <input type='text' className={'xxx'} ref={ref => this.captchaEnter = ref} />
                                                            <RCG result={this.result} /> */}
                                                        </div>
                                                    </div>
                                                    <div className="box-footer text-center">
                                                        <button type="submit" className="btn btn-outline-dark normal mr-2">Submit</button>
                                                        <button type="button" className="btn btn-outline-dark normal" onClick={this.onResetClick}>Reset</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="top-filter" style={{ "border": "2px solid rgba(70,70,70,.2)" }}>
                                            <div className="m-4">
                                                <h4 className="mt-2">Member Info</h4>
                                                <form className="form-horizontal position-relative">
                                                    <Loader value={loading} />
                                                    <hr className="mt-1" />
                                                    {
                                                        (responsedata === true) ?
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <div className="form-group row">
                                                                        <label className="col-sm-5" htmlFor="cardnumber-view">Card Number </label>
                                                                        <div className="col-sm-7" htmlFor="cardnumber-view"> {cardnumber}</div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label className="col-sm-5" htmlFor="name-view">Name </label>
                                                                        <div className="col-sm-7" htmlFor="name-view"> {name}</div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label className="col-sm-5" htmlFor="tier-view">Tier </label>
                                                                        <div className="col-sm-7" htmlFor="tier-view"> {tier}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <div className="form-group row">
                                                                        <label className="col-sm-5" htmlFor="startdate-view">Start Period </label>
                                                                        <div className="col-sm-7" htmlFor="startdate-view"> {startperiod}</div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label className="col-sm-5" htmlFor="enddate-view">End Period </label>
                                                                        <div className="col-sm-7" htmlFor="enddate-view"> {endperiod}</div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label className="col-sm-5" htmlFor="status-view">Status </label>
                                                                        <div className="col-sm-7" htmlFor="status-view"> {status}</div>
                                                                    </div>
                                                                </div>
                                                            </div> :
                                                            <h4>No member info to display</h4>
                                                    }
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;