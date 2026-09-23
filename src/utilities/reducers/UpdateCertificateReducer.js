import {
    UPDATE_CERTIFICATE_RESET_STORE,
    UPDATE_CERTIFICATE_JUMP_STEP_TO,
    UPDATE_CERTIFICATE_SET_DETAIL_CERTIFICATE,
    UPDATE_CERTIFICATE_SELECTED_AIR_ACTIVITY,
    UPDATE_CERTIFICATE_SAVE_ACTIVITY_AIR_TYPE,
    UPDATE_CERTIFICATE_SET_PRICE_LIST,
    UPDATE_CERTIFICATE_SET_UPDATE_SUMMARY,
    UPDATE_CERTIFICATE_SET_AIR_ACTIVITY,
    UPDATE_CERTIFICATE_SET_RESPONSE_UPDATE_AWARD
} from '../actions/ActionTypes';

const initialState = {
    step: 1,
    activityairtype: null,
    detailcertificate: {},
    selectedairactivity: {
        departureactivity: {},
        returnactivity: {}
    },
    redeemairactivity: [],
    pricelist: {},
    updatesummary: {
        flightdeparture: {},
        flightreturn: {},
        mileage: null,
        certificateprice: null,
        passenger: null
    },
    responseupdateaward: {}
}


export default (state = initialState, action) => {
    const { payload } = action;
    switch (action.type) {
        case UPDATE_CERTIFICATE_RESET_STORE:
            return initialState;
        case UPDATE_CERTIFICATE_SET_DETAIL_CERTIFICATE:
            return {
                ...state,
                detailcertificate: (payload.detailcertificate !== undefined) ? payload.detailcertificate : state.detailcertificate
            }
        case UPDATE_CERTIFICATE_SELECTED_AIR_ACTIVITY:
            if (payload.type === 'DEPARTURE') {
                return {
                    ...state,
                    selectedairactivity: {
                        ...state.selectedairactivity,
                        departureactivity: (payload.activity !== undefined) ? payload.activity : {}
                    }
                }
            } else if (payload.type === 'RETURN') {
                return {
                    ...state,
                    selectedairactivity: {
                        ...state.selectedairactivity,
                        returnactivity: (payload.activity !== undefined) ? payload.activity : {}
                    }
                }
            } else {
                return {
                    ...state,
                    selectedairactivity: {
                        departureactivity: {},
                        returnactivity: {}
                    }
                }
            }
        case UPDATE_CERTIFICATE_JUMP_STEP_TO:
            return {
                ...state,
                step: (payload.step !== undefined) ? payload.step : 1
            }
        case UPDATE_CERTIFICATE_SAVE_ACTIVITY_AIR_TYPE:
            return {
                ...state,
                activityairtype: (payload.activityairtype !== undefined) ? payload.activityairtype : state.activityairtype
            }
        case UPDATE_CERTIFICATE_SET_PRICE_LIST:
            return {
                ...state,
                pricelist: (payload.pricelist !== undefined) ? payload.pricelist : state.pricelist
            }
        case UPDATE_CERTIFICATE_SET_UPDATE_SUMMARY:
            const { updatesummary } = payload;
            return {
                ...state,
                updatesummary: {
                    ...state.updatesummary,
                    flightdeparture: (updatesummary.flightdeparture !== undefined) ? updatesummary.flightdeparture : state.updatesummary.flightdeparture,
                    flightreturn: (updatesummary.flightreturn !== undefined) ? updatesummary.flightreturn : state.updatesummary.flightreturn,
                    mileage: (updatesummary.mileage !== undefined) ? updatesummary.mileage : state.updatesummary.mileage,
                    certificateprice: (updatesummary.certificateprice !== undefined) ? updatesummary.certificateprice : state.updatesummary.certificateprice,
                    passenger: (updatesummary.passenger !== undefined) ? updatesummary.passenger : state.updatesummary.passenger
                },
            }
        case UPDATE_CERTIFICATE_SET_AIR_ACTIVITY:
            return {
                ...state,
                redeemairactivity: (payload.redeemairactivity !== undefined) ? payload.redeemairactivity : state.redeemairactivity
            }
        case UPDATE_CERTIFICATE_SET_RESPONSE_UPDATE_AWARD:
            return {
                ...state,
                responseupdateaward: (payload.response !== undefined) ? payload.response : state.responseupdateaward
            }
        default:
            return state;
    }
}