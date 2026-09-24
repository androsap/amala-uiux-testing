import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import Breadcrumb from '../../../../components/Breadcrumb';
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
            redeemairactivity: [],
            certificatedetail: {},
            // selectactivity: null,
            selectactivity: true,
            standardfee: true,
            standardfielddisabled: true,
            cancelunit: null,
            certificateprice: null,
            cancelfee: null,
            selectedActivities: []
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
            status: props.certificatedetail.status,
            redeemairactivity: props.redeemairactivity
        },
            this.autoSelected(props.redeemairactivity));
        this.getFee(props.certificatedetail.awardcode);
    }

    autoSelected(redeemairactivity) {
        let selectedActivities = [];

        for (const field in redeemairactivity) {
            selectedActivities[field] = redeemairactivity[field]["redeemairactivityid"] + "-" + redeemairactivity[field]["price"];
        }
        this.setState({ selectedActivities });
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
        const { selectedActivities, certificateid, memberid, awardcode, certificateprice, standardfee } = this.state;
        var tempVal = '';
        for (const field in this.refs) {
            if (field.substring(0, 13) === "airactivities") {
                formData[field] = this.refs[field].checked;
            } else {
                tempVal = this.refs[field].value;
                if (tempVal) {
                    tempVal = tempVal.trim();
                }
                formData[field] = tempVal;
            }
        }
        formData['standardfee'] = standardfee;

        // let redeemairactivityid = [];
        // var key = 0;
        // for (const field in formData) {
        //     if (field.substring(0, 13) === 'airactivities' && formData[field] === true) {
        //         redeemairactivityid[key] = field.split("_")[1];
        //         key++;
        //     }
        // }

        let redeemairactivityid = [];
        var key = 0;
        for (const field in selectedActivities) {
            redeemairactivityid[key] = selectedActivities[field].split("-")[0];
            key++;
        }

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });

            let trxdate = moment(new Date()).format('YYYY-MM-DD');
            let standarfee = formData.standardfee;
            let fee = standardfee ? Number.parseInt(document.getElementById('totalstandarfee').innerText, 0) : Number.parseInt(formData.fee, 0);
            let price = (selectedActivities.length === 1) ? Number.parseInt(selectedActivities[0].split('-')[1], 0) : Number.parseInt(certificateprice, 0);
            let message = 'Data has been updated';
            let url = api.url.redemptioncertificate.cancel;
            let data = { trxdate, certificateid, memberid, awardcode, price, standarfee, fee, redeemairactivityid };

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
        if (standardfee) { this.refs.fee.value = '' }
        this.setState({ standardfee });
    }

    handleSelectActivityChange = (event, selected) => {
        let selectactivity = event.target.checked;
        let onSelected = selected + '_' + selectactivity;

        let tempSelected = [...this.state.selectedActivities];
        let getSelected = onSelected.split('_')[0];
        let getValue = tempSelected.indexOf(getSelected);

        if (onSelected.split('_')[1] === "true") {
            tempSelected.push(getSelected);
        } else {
            tempSelected.splice(getValue, 1);
        }

        let standardfee = this.state.standardfee;
        let standardfielddisabled = false;
        if (!tempSelected.length) {
            standardfee = false;
            standardfielddisabled = true;
            this.refs.fee.value = '';
        }

        this.setState({ selectedActivities: tempSelected, standardfee, standardfielddisabled });
    }

    handleBackClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage
        });
    }

    render() {
        const { loading, errors } = this.state;
        const { redeemairactivity, standardfee, cancelunit, cancelfee, certificateprice, selectactivity, selectedActivities, certificatedetail, certificateid, status } = this.state;

        var totalprice = (selectedActivities.length) ?
            (selectedActivities.length > 1) ? parseInt(selectedActivities[0].split('-')[1], 0) + parseInt(selectedActivities[1].split('-')[1], 0) :
                selectedActivities[0].split('-')[1] : '0';
        var percentagefee = (selectedActivities.length > 1) ? Math.ceil(certificateprice * cancelfee / 100) : Math.ceil(totalprice * cancelfee / 100);
        var labelfee = (selectedActivities.length) ? (selectedActivities.length > 1) ? "Calculated from Certificate Price" : "Calculated from Total Price" : '';
        var flightList = '';

        if (redeemairactivity.length) {
            flightList =
                redeemairactivity.map((val, i) =>
                    <div className="card mb-1" key={i}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col text-center"> {"#" + ++i} </div>
                                <div className="col text-center"> {moment(val.activitydate).format('DD/MM/YYYY')} </div>
                                <div className="col text-center"> {val.airline} </div>
                                <div className="col text-center"> {val.flightnumber} </div>
                                <div className="col text-center"> {val.origin} - {val.destination}</div>
                                <div className="col text-center"> {val.price} </div>
                                <div className="col text-center hidden">
                                    {(val.status === 'VOUCHER_ISSUED') ?
                                        <label className="custom-control fill-checkbox">
                                            <input type="checkbox" className="fill-control-input" ref={"airactivities_" + val["redeemairactivityid"]} onChange={(e) => this.handleSelectActivityChange(e, val["redeemairactivityid"] + '-' + val["price"])} defaultChecked={selectactivity ? "checked" : ""} />
                                            <span className="fill-control-indicator"></span>
                                            <span className="fill-control-description">Select</span>
                                        </label> :
                                        <span className="badge badge-muted">CANCELED</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        } else {
            flightList = <div className="card mb-1">
                <div className="card-body">
                    <div className="row">
                        <div className="col text-center">No data to display</div>
                    </div>
                </div>
            </div>
        }

        return (
            <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                <CertificateDetail certificatedetail={certificatedetail} certificateid={certificateid} />
                <div className="member-section">
                    <Loader value={loading} />
                    <label className={(status === 'VOUCHER_ISSUED') ? "main-label mt-4" : "main-label mt-4 hidden"}>Cancel Certificate</label>
                    <div className="card mt-2">
                        <div className="card-body">
                            <h4 className="mt-2">Redemption Air Activity</h4>
                            <hr className="mt-0 mb-0" />
                            <div className="card-body">
                                <div className="row font-weight-bold">
                                    <div className="col text-center"> # </div>
                                    <div className="col text-center"> Activity Date </div>
                                    <div className="col text-center"> Operating Airline </div>
                                    <div className="col text-center"> Flight Number </div>
                                    <div className="col text-center"> Origin - Destination </div>
                                    <div className="col text-center"> Price (Mileage) </div>
                                    {/* <div className="col text-center"> </div> */}
                                </div>
                            </div>
                            {flightList}
                            <div class="row justify-content-end text-right mt-4">
                                <label className="col-sm-10 col-form-label">{(selectedActivities.length > 1) ? 'Certificate Price' : 'Total Price'}</label>
                                <div className="col">
                                    <h3>{(selectedActivities.length > 1) ? certificateprice : totalprice}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={(status === 'VOUCHER_ISSUED') ? "card mt-2" : "card mt-2 hidden"}>
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
                                                    {/* <input id="standardfee-view" ref="standardfee" className="border-switch-control-input" type="checkbox" onClick={this.handleStandardFee} checked={(standardfee) ? true : false} disabled={standardfielddisabled} /> */}
                                                    <input id="standardfee-view" ref="standardfee" className="border-switch-control-input" type="checkbox" onClick={this.handleStandardFee} checked={(standardfee) ? true : false} disabled />
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
                                            {/* <input className="form-control" type="text" id="fee-view" ref="fee" maxLength="100" disabled={standardfielddisabled} /> */}
                                            <input className="form-control" type="text" id="fee-view" ref="fee" maxLength="11" />
                                            <span className="text-danger">{errors["fee"]}</span>
                                        </div>
                                        <div className={(standardfee) ? "col-sm-9" : "col-sm-9 hidden"}>
                                            <h2 id="totalstandarfee">{(cancelunit === 'PERCENTAGE') ? percentagefee : cancelfee}</h2>
                                        </div>
                                        <span className={(standardfee) ? "col-sm-12 text-muted" : " col-sm-12 text-muted hidden"}>{(cancelunit === 'PERCENTAGE') ? labelfee : ''}</span>
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
                </div>
            </form >
        );
    }
}

export default Layout;