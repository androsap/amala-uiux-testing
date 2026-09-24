import React, { Component } from 'react';
import { SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import Alert from '../../../../components/Alert';
import Loader from '../../../../components/Loader';
import ErrorGeneral from '../../../error/ErrorGeneral';
import Select2 from '../../../../components/Select2';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Edit Mailing Status',
            actionspage: 'update',
            responseCode: '0',
            responseMessage: '',
            optionsMailingStatus: [
                { label: "SECOND DELIVERY", value: "SECOND_DELIVERY" },
                { label: "DELETED", value: "DELETED" },
                { label: "SELF TAKE", value: "SELF_TAKE" },
                { label: "DELIVERED BO", value: "DELIVERED_BO" },
                { label: "DELIVERED", value: "DELIVERED" },
                { label: "RETURN", value: "RETURN" },
                { label: "ERROR", value: "ERROR" }
            ],
            optionsStatus: [
                { label: 'SELF TAKE', value: 'SELF_TAKE' },
                { label: 'CO MAIL', value: 'CO_MAIL' }
            ],
            status: null,
            membermailingid: this.props.membermailingid,
            mailingsetid: this.props.mailingsetid,
            mailingid: this.props.mailingid,
            memberid: this.props.memberid
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
            let mailingsetid = this.state.mailingsetid;
            let memberid = this.state.memberid;
            let info = (formData.info === 'CO_MAIL') ? 'CO_MAIL' : formData.info;
            let mailing_status = formData.mailing_status;
            let status = formData.status;
            let selftakedate = (status === 'SELF_TAKE') ? moment(new Date()) : null;

            let message = 'Data has been updated';
            let url = api.url.membermailing.update;
            let data = { id, memberid, mailingsetid, mailingid, mailing_status, info, selftakedate };

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

    handleMailingStatusChange = (event) => {
        let mailing_status = event === null ? null : event.value;
        this.setState({ mailing_status });
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.target.value;
        this.setState({ status });
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading } = this.state;
        const { mailing_status, optionsMailingStatus, optionsStatus, status } = this.state;

        //status data
        var statusdata = optionsStatus.map((val, key) =>
            <label className="col-sm-6 col-form-label" htmlFor={val.value + "-" + key} key={val.value + "-" + key}>
                <input name="route" ref="" value={val.value} id={val.value + "-" + key} type="radio" onChange={this.handleStatusChange} checked={status === val.value} />
                &nbsp;&nbsp;&nbsp;{val.label}
            </label>
        );

        if (formrender) {
            return (
                <div className="container-fluid">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h3 className="title-has-control mt-2">{titlepage}</h3>
                    </div>
                    <hr className="mt-0" />
                    <div className="row">
                        <div className="col-sm-12">
                            <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                <Loader value={loading} />
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="mailing_status-view">Update Status </label>
                                    <div className="col-sm-8">
                                        <Select2 reference="mailing_status" className="form-control" id="mailing_status-view" options={optionsMailingStatus} onChange={this.handleMailingStatusChange} value={mailing_status} ></Select2>
                                        <span className="text-danger">{errors["mailing_status"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label"> </label>
                                    <div className="col-sm-8">
                                        <div className="row">
                                            {statusdata}
                                        </div>
                                        <span className="text-danger">{errors["status"]}</span>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label" htmlFor="info-view">Info </label>
                                    <div className="col-sm-8">
                                        <textarea rows="3" className="form-control" type="text" id="info-view" ref="info" maxLength="255" disabled={(status === 'CO_MAIL') ? true : false} />
                                        <span className="text-danger">{errors["info"]}</span>
                                    </div>
                                </div>
                                <div className="box-footer text-center">
                                    {
                                        (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                    }
                                    &nbsp;&nbsp;
		                            <button type="button" ref={this.closeAndRefresh} onClick={this.props.closeModalRefresh} className="hidden">Close Refresh</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;