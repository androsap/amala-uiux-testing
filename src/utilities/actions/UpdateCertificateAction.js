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


export const jumpStepTo = (step) => ({
    type: UPDATE_CERTIFICATE_JUMP_STEP_TO,
    payload: { step }
});

export const resetStore = () => ({
    type: UPDATE_CERTIFICATE_RESET_STORE,
    payload: {}
});

export const setDetailCertificate = (detailcertificate) => ({
    type: UPDATE_CERTIFICATE_SET_DETAIL_CERTIFICATE,
    payload: { detailcertificate }
});

export const selectedAirActivity = (type, activity) => ({
    type: UPDATE_CERTIFICATE_SELECTED_AIR_ACTIVITY,
    payload: { type, activity }
});

export const saveActivityAirType = (activityairtype) => ({
    type: UPDATE_CERTIFICATE_SAVE_ACTIVITY_AIR_TYPE,
    payload: { activityairtype }
});

export const setPriceList = (pricelist) => ({
    type: UPDATE_CERTIFICATE_SET_PRICE_LIST,
    payload: { pricelist }
});

export const setUpdateSummary = (updatesummary) => ({
    type: UPDATE_CERTIFICATE_SET_UPDATE_SUMMARY,
    payload: { updatesummary }
});

export const setAirActivity = (redeemairactivity) => ({
    type: UPDATE_CERTIFICATE_SET_AIR_ACTIVITY,
    payload: { redeemairactivity }
});

export const setReponseUpdateAward = (response) => ({
    type: UPDATE_CERTIFICATE_SET_RESPONSE_UPDATE_AWARD,
    payload: { response }
});

