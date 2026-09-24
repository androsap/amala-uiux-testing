import React, { Component } from 'react';
import Alert from '../../../../components/Alert';
import Loader from '../../../../components/Loader';
import { DetailRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import moment from 'moment';
import CertificateDetail from './CertificateDetail';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: [],
            certificateid: props.certificateid,
            memberid: props.certificatedetail.memberid,
            awardcode: props.certificatedetail.awardcode,
            status: props.certificatedetail.status,
            cardnumber: props.cardnumber,
            awardcategory: props.awardcategory,
            activityprice: props.activityprice,
            certificatedetail: {},
            certificateprice: null,
            standardfee: true,
            cancelunit: null,
            cancelfee: null
        }
        this.baseState = this.state;
        this.refresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        if (!this.state.standardfee) {
            if (!field['fee']) {
                errors['fee'] = 'Required';
            } else if (!field['fee'].match(/^[0-9]+$/)) {
                errors['fee'] = 'Only numeric';
            }
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentWillReceiveProps(props) {
        this.setState({
            certificateid: props.certificateid,
            certificatedetail: props.certificatedetail,
            memberid: props.certificatedetail.memberid,
            certificateprice: props.certificatedetail.certificateprice,
            awardcode: props.certificatedetail.awardcode,
            status: props.certificatedetail.status
        });
        this.getFee(props.certificatedetail.awardcode);
    }

    getFee(awardcode) {
        let url = api.url.awardmaster.retrievecancelupdate;
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                //call loader
                this.setState({
                    loading: false,
                    cancelunit: (result.cancelunit) ? result.cancelunit : null,
                    cancelfee: (result.cancelfee) ? result.cancelfee : '0'
                });
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    handleRefreshMainPage = () => {
        this.refresh.current.click();
        this.refs.fee.value = '';
        this.setState(this.baseState);
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        const { certificateid, memberid, awardcode, certificateprice, standardfee } = this.state;
        var tempVal = '';
        for (const field in this.refs) {
            tempVal = this.refs[field].value;
            if (tempVal) {
                tempVal = tempVal.trim();
            }
            formData[field] = tempVal;
        }

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });

            let trxdate = moment(new Date()).format('YYYY-MM-DD');
            let standarfee = standardfee;
            let fee = standardfee ? Number.parseInt(document.getElementById('totalstandarfee').innerText, 0) : Number.parseInt(formData.fee, 0);
            let price = Number.parseInt(certificateprice, 0);
            let message = 'Data has been updated';
            let url = api.url.redemptioncertificate.cancel;
            let data = { trxdate, certificateid, memberid, awardcode, price, standarfee, fee };

            if (window.confirm("Are you sure?")) {
                var requestData = SaveRequest(url, data);
                if (requestData) {
                    requestData.then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);
                            this.props.loadDataMemberHeader(memberid);
                            this.handleRefreshMainPage();
                        } else {
                            Alert.error(responsemessage);
                        }
                        this.setState({ loading: false });
                    })
                }
            } else {
                this.setState({ loading: false });
            }
        }
    };

    handleStandardFee = (event) => {
        let standardfee = event === null ? null : event.target.checked;
        this.setState({ standardfee });
    }

    handleBackClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage
        });
    }

    render() {
        const { loading, errors } = this.state;
        const { standardfee, cancelunit, cancelfee, certificateprice, certificatedetail, certificateid, status } = this.state;

        var percentagefee = Math.ceil(certificateprice * cancelfee / 100);

        return (
            <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                <CertificateDetail certificatedetail={certificatedetail} certificateid={certificateid} />
                <div className={(status === 'VOUCHER_ISSUED') ? "member-section" : "member-section hidden"}>
                    <Loader value={loading} />
                    <label className="main-label mt-4">Cancel Certificate</label>
                    <div className="card mt-2">
                        <div className="card-body">
                            <h4 className="mt-2">Cancellation Fee</h4>
                            <hr className="mt-0" />
                            <div className="row justify-content-between">
                                <div className="col-sm-3">
                                    <div className="form-group row">
                                        <label className="col col-form-label" htmlFor="standardfee-view">Standard Fee </label>
                                        <div className="col-sm-7">
                                            <div className="row no-gutters">
                                                <label className="custom-control border-switch">
                                                    <input id="standardfee-view" ref="standardfee" className="border-switch-control-input" type="checkbox" onClick={this.handleStandardFee} defaultChecked={(standardfee) ? "checked" : null} disabled />
                                                    <span className="border-switch-control-description">No</span>
                                                    <span className="border-switch-control-indicator"></span>
                                                    <span className="border-switch-control-description">Yes</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-group row text-right">
                                        <label className="col col-form-label" htmlFor="fee-view">Fee </label>
                                        <div className={(!standardfee) ? "col-sm-9" : "col-sm-9 hidden"}>
                                            <input className="form-control" type="text" id="fee-view" ref="fee" maxLength="11" />
                                            <span className="text-danger">{errors["fee"]}</span>
                                        </div>
                                        <div className={(standardfee) ? "col-sm-9" : "col-sm-9 hidden"}>
                                            <h2 id="totalstandarfee">{(cancelunit === 'PERCENTAGE') ? percentagefee : (cancelunit === 'MILEAGE') ? cancelfee : '0'}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-footer text-center mt-3 mb-3">
                    <button onClick={() => (this.handleBackClick('INDEX'))} title="Back" className="btn btn-outline-dark normal mr-2">Back</button>
                    <button className={(status === 'VOUCHER_ISSUED') ? "btn btn-primary normal" : "btn btn-primary normal hidden"}>Confirm</button>
                    <button type="button" ref={this.refresh} onClick={this.props.refreshMainPage} className="hidden">Close Refresh</button>
                </div>
            </form>
        );
    }
}

export default Layout;