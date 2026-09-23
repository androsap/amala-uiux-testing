import {
    REDEMPTIONNONAIR_SET_ELIGIBLE_REDEEM_STATUS,
    REDEMPTIONNONAIR_SET_MEMBER_PROFILE,
    REDEMPTIONNONAIR_SET_USER,
    REDEMPTIONNONAIR_SET_AWARD,
    REDEMPTION_SET_DEPARTUREDATE,
    REDEMPTION_SET_RETURNDATE,
    REDEMPTION_SET_ORIGIN,
    REDEMPTION_SET_DESTINATION,
    REDEMPTION_SET_COMPARTMENT,
    REDEMPTION_SET_ISRETURN,
    REDEMPTION_SET_PASSENGER,
    REDEMPTION_SET_PRICELIST,
    REDEMPTION_SET_FLIGHTSCHEDULE,
    REDEMPTION_SET_SUMMARY,
    REDEMPTION_SET_REDEEMUSER,
    REDEMPTION_SET_RESPONSE_BUY_AWARD,
    REDEMPTION_SET_GENERAL_REQUEST,
    REDEMPTION_RESET_STORE
} from '../actions/ActionTypes';


export function changePage(type, data) {
    return {
        type,
        data // AIRUPGRADE, AIRFREEFLIGHT, NONAIR,
    }
}

export function setData(type, data) {
    return {
        type,
        data
    }
}

export const resetStore = () => ({
    type: REDEMPTION_RESET_STORE,
    payload: {}
});

export const setEligibleRedeemStatus = (eligbleredeemstatus) => ({
    type: REDEMPTIONNONAIR_SET_ELIGIBLE_REDEEM_STATUS,
    payload: {
        eligbleredeemstatus
    }
});

export const setMemberProfile = (data) => ({
    type: REDEMPTIONNONAIR_SET_MEMBER_PROFILE,
    payload: {
        data
    }
});

export const setUser = (data) => ({
    type: REDEMPTIONNONAIR_SET_USER,
    payload: {
        data
    }
});

export const setAward = (data) => ({
    type: REDEMPTIONNONAIR_SET_AWARD,
    payload: {
        data
    }
});

export const setOrigin = (data) => ({
    type: REDEMPTION_SET_ORIGIN,
    payload: {
        data
    }
});

export const setDestination = (data) => ({
    type: REDEMPTION_SET_DESTINATION,
    payload: {
        data
    }
});

export const setDepartureDate = (data) => ({
    type: REDEMPTION_SET_DEPARTUREDATE,
    payload: {
        data
    }
});

export const setReturnDate = (data) => ({
    type: REDEMPTION_SET_RETURNDATE,
    payload: {
        data
    }
});

export const setIsReturn = (data) => ({
    type: REDEMPTION_SET_ISRETURN,
    payload: {
        data
    }
});

export const setCompartment = (data) => ({
    type: REDEMPTION_SET_COMPARTMENT,
    payload: {
        data
    }
});

export const setPassenger = (data) => ({
    type: REDEMPTION_SET_PASSENGER,
    payload: {
        data
    }
});

export const setPriceList = (pricedeparture, pricereturn) => ({
    type: REDEMPTION_SET_PRICELIST,
    payload: {
        pricedeparture, pricereturn
    }
});

export const setFlightSchedule = (flightdeparture, flightreturn) => ({
    type: REDEMPTION_SET_FLIGHTSCHEDULE,
    payload: {
        flightdeparture, flightreturn
    }
});

export const setRedeemUser = (redeemuser) => ({
    type: REDEMPTION_SET_REDEEMUSER,
    payload: {
        redeemuser
    }
});

export const setRedemptionSummary = (data) => ({
    type: REDEMPTION_SET_SUMMARY,
    payload: {
        data
    }
});

export const setReponseBuyAward = (responsebuyaward) => ({
    type: REDEMPTION_SET_RESPONSE_BUY_AWARD,
    payload: {
        responsebuyaward
    }
});

export const setGeneralRequest = (data) => ({
    type: REDEMPTION_SET_GENERAL_REQUEST,
    payload: {
        data
    }
})

