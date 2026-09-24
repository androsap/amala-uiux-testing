import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import Alert from '../../../../components/Alert';
import Loader from '../../../../components/Loader';
import ErrorGeneral from '../../../error/ErrorGeneral';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'View Mailing Status',
            actionspage: 'view',
            responseCode: '0',
            responseMessage: '',
            membermailingid: this.props.membermailingid,
            mailingid: this.props.mailingid,
            memberid: this.props.memberid,
            memberfullname: '',
            mailingsetname: '',
            mailingname: '',
            membermailingstatus: '',
            dateinformation: [],
            urlatachment: []
        };
        this.closeAndRefresh = React.createRef();
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //mailing_status
        if (!field['mailing_status']) {
            errors['mailing_status'] = 'Required';
        }

        //status
        if (!field['status']) {
            errors['status'] = 'Required';
        }

        //info
        if (field['status'] !== 'CO_MAIL' && !field['info']) {
            errors['info'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail() {
        const { memberid, membermailingid } = this.state;
        let id = membermailingid;
        let url = api.url.membermailing.detail;
        let data = { memberid, id };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.refs.info.value = (result.info) ? result.info : '';
                this.refs.previewtext.value = (result.previewtext) ? result.previewtext : '';

                //mapping all date in member mailing
                let date = [];
                date = [
                    { label: 'Status date', value: (result.statusdate) ? moment(result.statusdate).format("YYYY-MM-DD") : null },
                    { label: 'Delivery date', value: (result.deliverydate) ? moment(result.deliverydate).format("YYYY-MM-DD") : null },
                    { label: 'Delete date', value: (result.deleteddate) ? moment(result.deliverydate).format("YYYY-MM-DD") : null },
                    { label: 'Delivered Bo date', value: (result.deliveredbodate) ? moment(result.deliverydate).format("YYYY-MM-DD") : null },
                    { label: 'Error date', value: (result.errordate) ? moment(result.deliverydate).format("YYYY-MM-DD") : null },
                    { label: 'Failure date', value: (result.failuredate) ? moment(result.deliverydate).format("YYYY-MM-DD") : null },
                    { label: 'Print date', value: (result.printeddate) ? moment(result.printeddate).format("YYYY-MM-DD") : null },
                    { label: 'Request date', value: (result.requestdate) ? moment(result.requestdate).format("YYYY-MM-DD") : null },
                    { label: 'ReSend Courier date', value: (result.resendcourierdate) ? moment(result.resendcourierdate).format("YYYY-MM-DD") : null },
                    { label: 'Resend date', value: (result.resenddate) ? moment(result.resenddate).format("YYYY-MM-DD") : null },
                    { label: 'Scheduled date', value: (result.scheduleddate) ? moment(result.scheduleddate).format("YYYY-MM-DD") : null },
                    { label: 'Self take date', value: (result.selftakedate) ? moment(result.selftakedate).format("YYYY-MM-DD") : null },
                    { label: 'Sent date', value: (result.sentdate) ? moment(result.sentdate).format("YYYY-MM-DD") : null },
                    { label: 'Sent Courier date', value: (result.sentcourierdate) ? moment(result.sentcourierdate).format("YYYY-MM-DD") : null },
                    { label: 'Return date', value: (result.returndate) ? moment(result.returndate).format("YYYY-MM-DD") : null },
                    { label: 'Printing start date', value: (result.printingstartdate) ? moment(result.printingstartdate).format("YYYY-MM-DD") : null },
                    { label: 'Printing end date', value: (result.printingenddate) ? moment(result.printingenddate).format("YYYY-MM-DD") : null },
                    { label: 'Printing end date', value: (result.printingenddate) ? moment(result.printingenddate).format("YYYY-MM-DD") : null },
                    { label: 'Mailing Start date', value: (result.mailinggstartdate) ? moment(result.mailinggstartdate).format("YYYY-MM-DD") : null },
                    { label: 'Mailing end date', value: (result.mailingenddate) ? moment(result.mailingenddate).format("YYYY-MM-DD") : null },
                    { label: 'Courier start date', value: (result.courierstartdate) ? moment(result.courierstartdate).format("YYYY-MM-DD") : null },
                    { label: 'Courier end date', value: (result.courierenddate) ? moment(result.courierenddate).format("YYYY-MM-DD") : null }
                ];

                var dateinformation = [];
                var key = 0;
                for (const field in date) {
                    if (date[field].value !== null) {
                        dateinformation[key] = [];
                        dateinformation[key]['label'] = date[field].label;
                        dateinformation[key]['value'] = date[field].value;
                        key++;
                    }
                }

                //mapping attachment
                var urlatachment = [];
                let membermailingattachment = result.membermailingattachment;
                for (const field in membermailingattachment) {
                    urlatachment[field] = membermailingattachment[field].url;
                }

                //call loader
                this.setState({
                    loading: false,
                    memberfullname: (result.memberfullname) ? result.memberfullname : '',
                    mailingsetname: (result.mailingsetname) ? result.mailingsetname : '',
                    mailingname: (result.mailingname) ? result.mailingname : '',
                    membermailingstatus: (result.membermailingstatus) ? result.membermailingstatus : '',
                    dateinformation,
                    urlatachment
                });
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
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
        formData['mailing_status'] = this.state.mailing_status;
        formData['status'] = this.state.status;

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let id = this.state.membermailingid;
            let mailingid = this.state.mailingid;
            let memberid = this.state.memberid;
            let info = (formData.info === 'CO_MAIL') ? 'CO_MAIL' : formData.info;
            let mailing_status = formData.mailing_status;
            let status = formData.status;
            let selftakedate = (status === 'SELF_TAKE') ? moment(new Date()) : null;

            let message = 'Data has been updated';
            let url = api.url.membermailing.update;
            let data = { id, memberid, mailingid, mailing_status, info, selftakedate };

            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.closeModalSuccess();
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ loading: false });
                })
            }
        }
    };

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    viewAttachment() {
        const { urlatachment } = this.state;
        for (const field in urlatachment) {
            window.open(urlatachment[field], '_blank');
        }
    }

    render() {
        const { titlepage, actionspage, formrender, loading } = this.state;
        const { mailingid, mailingsetname, mailingname, memberfullname, membermailingstatus, dateinformation, urlatachment } = this.state;

        //dateinformationdata
        var dateinformationdata = dateinformation.map((val, key) =>
            <div className="form-group row" key={key}>
                <label className="col-sm-4 col-form-label" htmlFor={key + "-view"}>{val.label} </label>
                <div className="col-sm-8">: {val.value}</div>
            </div>
        )
        if (formrender) {
            return (
                <div className="container-fluid">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h3 className="title-has-control mt-2">{titlepage}</h3>
                    </div>
                    <hr className="mt-0" />
                    <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                        <Loader value={loading} />
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="mailingid-view">Mailing ID </label>
                                    <div className="col-sm-8">: {mailingid}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="membername-view">Member Name </label>
                                    <div className="col-sm-8">: {memberfullname}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="mailingsetname-view">Mailing Set </label>
                                    <div className="col-sm-8">: {mailingsetname}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="mailing-view">Mailing </label>
                                    <div className="col-sm-8">: {mailingname}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="mailing_status-view">Status </label>
                                    <div className="col-sm-8">: {membermailingstatus}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="info-view">Info</label>
                                    <div className="col-sm-8">
                                        <textarea rows="3" className="form-control" type="text" id="info-view" ref="info" />
                                    </div>
                                </div>
                                <div className="box-footer text-center">
                                    {
                                        (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                    }
                                    &nbsp;&nbsp;
		                            <button type="button" ref={this.closeAndRefresh} onClick={this.props.closeModalRefresh} className="hidden">Close Refresh</button>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                {dateinformationdata}
                                <div className={(urlatachment.length > 0) ? "form-group row" : "form-group row hidden"}>
                                    <label className="col-sm-4 col-form-label" htmlFor="attacment-view">Attachment </label>
                                    <div className="col-sm-8">
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => this.viewAttachment()}>View Attchment</button>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="previewtext-view">Preview Text</label>
                                    <div className="col-sm-8">
                                        <textarea rows="3" className="form-control" type="text" id="previewtext-view" ref="previewtext" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;