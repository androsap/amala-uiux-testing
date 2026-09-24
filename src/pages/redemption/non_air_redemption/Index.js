import React, { Component } from 'react';
import { connect } from "react-redux";

import {
    changePage,
    setData,
    setEligibleRedeemStatus,
    setMemberProfile,
    setUser,
    setAward,
    setReponseBuyAward
} from "../../../utilities/actions/RedemptionActions";

import Step1 from './Step1';
import Step2 from './Step2';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardnumber: this.props.match.params.cardnumber,
            awardcode: this.props.match.params.awardcode
        }
    }

    componentDidMount() {
        document.title = "Redemption Non Air | Loyalty Management System";
        this.setState({
            step: this.props.redemption.step
        });
    }

    render() {
        const { cardnumber, awardcode } = this.state;
        const step = this.props.redemption.step;
        if (step === 'step2') {
            return (<Step2 {...this.props} cardnumber={cardnumber} awardcode={awardcode} />)
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
    setReponseBuyAward: (data) => dispatch(setReponseBuyAward(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
