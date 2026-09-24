import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import MemberCertificates from '../Index';

import {
    resetStore,
    jumpStepTo,
    setDetailCertificate,
    selectedAirActivity,
    saveActivityAirType,
    setPriceList,
    setUpdateSummary,
    setAirActivity,
    setReponseUpdateAward
} from "../../../../utilities/actions/UpdateCertificateAction";

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';


import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import ErrorGeneral from '../../../error/ErrorGeneral';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            responseCode: '0',
            responseMessage: '',
            certificateid: null,
            redeemairactivity: [],
            memberid: null,
            awardcode: null
        }
    }

    componentDidMount() {
        let certificateid = this.props.certificateid;
        let awardcategory = this.props.awardcategory;
        let cardnumber = this.props.cardnumber;
        this.setState({ cardnumber },
            this.props.resetStore(),
            this.getDetail(certificateid, awardcategory));
    }

    getDetail(certificateid, awardcategory) {
        let url = api.url.redemptioncertificate.detail;
        let data = { certificateid, awardcategory };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.props.setDetailCertificate(result);

                this.setState({ loading: false });
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

    render() {
        const { formrender, responseMessage } = this.state;
        const { cardnumber } = this.state;
        const { redeemuser, awardcode, memberid, awardtypename, issueddate, validitydate, freeaward, bookingcode, ticketnumber, ticketvaliditydate } = this.props.updatecertificate.detailcertificate;
        const step = this.props.updatecertificate.step;

        let certificateid = (redeemuser && redeemuser.certificateid) ? redeemuser.certificateid : null;
        let certificatedetail = {
            memberid: (memberid) ? memberid : null,
            awardcode: (awardcode) ? awardcode : '-',
            awardtype: (awardtypename) ? awardtypename : '-',
            certificateprice: (redeemuser && redeemuser.certificateprice !== undefined) ? redeemuser.certificateprice : '-',
            status: (redeemuser && redeemuser.status) ? redeemuser.status : '-',
            issueddate: (issueddate) ? moment(issueddate).format('DD/MM/YYYY') : '-',
            validitydate: (validitydate) ? moment(validitydate).format('DD/MM/YYYY') : '-',
            freeaward: (freeaward !== undefined) ? (freeaward) ? 'Yes' : 'No' : '-',
            bookingcode: (bookingcode) ? bookingcode : '-',
            selfusage: (redeemuser && redeemuser.selfusage) ? 'Yes' : 'No',
            ticketnumber: (ticketnumber) ? ticketnumber : '-',
            ticketvaliditydate: (ticketvaliditydate) ? moment(ticketvaliditydate).format('DD/MM/YYYY') : '-'
        }

        if (formrender) {
            if (step === 1) {
                return (<Step1 {...this.props} certificateid={certificateid} awardcode={awardcode} certificatedetail={certificatedetail} />)
            } else if (step === 2) {
                return (<Step2 {...this.props} certificateid={certificateid} awardcode={awardcode} certificatedetail={certificatedetail} />)
            } else if (step === 3) {
                return (<Step3 {...this.props} certificateid={certificateid} awardcode={awardcode} certificatedetail={certificatedetail} />)
            } else if (step === 4) {
                return (<Step4 {...this.props} certificateid={certificateid} awardcode={awardcode} certificatedetail={certificatedetail} />)
            } else if (step === 5) {
                return (<Step5 {...this.props} certificateid={certificateid} awardcode={awardcode} certificatedetail={certificatedetail} />)
            } else if (step === 6) {
                return (<Step6 {...this.props} certificateid={certificateid} awardcode={awardcode} certificatedetail={certificatedetail} />)
            } else {
                return (<MemberCertificates memberid={memberid} cardnumber={cardnumber} />)
            }
        } else {
            return (<ErrorGeneral message={responseMessage} />);
        }
    }
}


const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    resetStore: () => dispatch(resetStore()),
    jumpStepTo: (step) => dispatch(jumpStepTo(step)),
    setDetailCertificate: (data) => dispatch(setDetailCertificate(data)),
    selectedAirActivity: (type, activity) => dispatch(selectedAirActivity(type, activity)),
    saveActivityAirType: (activityairtype) => dispatch(saveActivityAirType(activityairtype)),
    setPriceList: (pricelist) => dispatch(setPriceList(pricelist)),
    setUpdateSummary: (updatesummary) => dispatch(setUpdateSummary(updatesummary)),
    setAirActivity: (redeemairactivity) => dispatch(setAirActivity(redeemairactivity)),
    setReponseUpdateAward: (response) => dispatch(setReponseUpdateAward(response))
});
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
