import React, { Component } from 'react';
import { connect } from "react-redux";

import {
    changePage,
    setData,
    setEligibleRedeemStatus,
    setMemberProfile,
    setUser,
    setAward,
    setDepartureDate,
    setReturnDate,
    setOrigin,
    setDestination,
    setIsReturn,
    setCompartment,
    setPassenger,
    setPriceList,
    setFlightSchedule,
    setRedemptionSummary,
    setRedeemUser,
    setGeneralRequest,
    setReponseBuyAward,
    resetStore
} from "../../../utilities/actions/RedemptionActions";

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardnumber: this.props.match.params.cardnumber,
            awardcode: this.props.match.params.awardcode
        }
    }

    componentDidMount() {
        this.setState({
            step: this.props.redemption.step
        });
    }

    render() {
        const { cardnumber, awardcode } = this.state;
        const step = this.props.redemption.step;
        if (step === 'step2') {
            return (<Step2 {...this.props} cardnumber={cardnumber} awardcode={awardcode} />)
        } else if (step === 'step3') {
            return (<Step3 {...this.props} cardnumber={cardnumber} awardcode={awardcode} />)
        } else if (step === 'step4') {
            return (<Step4 {...this.props} cardnumber={cardnumber} awardcode={awardcode} />)
        } else if (step === 'step5') {
            return (<Step5 {...this.props} cardnumber={cardnumber} awardcode={awardcode} />)
        } else if (step === 'step6') {
            return (<Step6 {...this.props} cardnumber={cardnumber} awardcode={awardcode} />)
        } else {
            return (<Step1 {...this.props} cardnumber={cardnumber} awardcode={awardcode} />)
        }
    }
}


const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    changePage: (type, section) => dispatch(changePage(type, section)),
    setData: (type, data) => dispatch(setData(type, data)),
    setEligibleRedeemStatus: (data) => dispatch(setEligibleRedeemStatus(data)),
    setMemberProfile: (data) => dispatch(setMemberProfile(data)),
    setUser: (data) => dispatch(setUser(data)),
    setAward: (data) => dispatch(setAward(data)),
    setDepartureDate: (data) => dispatch(setDepartureDate(data)),
    setReturnDate: (data) => dispatch(setReturnDate(data)),
    setOrigin: (data) => dispatch(setOrigin(data)),
    setDestination: (data) => dispatch(setDestination(data)),
    setIsReturn: (data) => dispatch(setIsReturn(data)),
    setCompartment: (data) => dispatch(setCompartment(data)),
    setPassenger: (data) => dispatch(setPassenger(data)),
    setPriceList: (flightdeparture, flightreturn) => dispatch(setPriceList(flightdeparture, flightreturn)),
    setFlightSchedule: (flightdeparture, flightreturn) => dispatch(setFlightSchedule(flightdeparture, flightreturn)),
    setRedemptionSummary: (data) => dispatch(setRedemptionSummary(data)),
    setRedeemUser: (data) => dispatch(setRedeemUser(data)),
    setGeneralRequest: (data) => dispatch(setGeneralRequest(data)),
    setReponseBuyAward: (data) => dispatch(setReponseBuyAward(data)),
    resetStore: () => dispatch(resetStore())
});
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
