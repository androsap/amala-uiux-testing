import {
    ENROLLMENT_CORP_RESET_STORE,
    ENROLLMENT_CORP_SAVE_MEMBER,
    ENROLLMENT_CORP_SAVE_MEMBERCORPORATEDETAIL,
    ENROLLMENT_CORP_SAVE_TRAVELCORDINATOR,
    ENROLLMENT_CORP_ADD_STAFF_TRAVELCORDINATOR,
    ENROLLMENT_CORP_SAVE_CORPORATETOURCODE,
    ENROLLMENT_CORP_SET_RESPONSE
} from '../actions/ActionTypes';


export const resetStore = () => ({
    type: ENROLLMENT_CORP_RESET_STORE,
    payload: {}
});

export const setReponseEnrollmentCorporate = (data) => ({
    type: ENROLLMENT_CORP_SET_RESPONSE,
    payload: { data }
});

export const setMember = (data) => ({
    type: ENROLLMENT_CORP_SAVE_MEMBER,
    payload: { data }
});


export const addStaffTravelCordinator = (data) => ({
    type: ENROLLMENT_CORP_ADD_STAFF_TRAVELCORDINATOR,
    payload: { data }
});

export const setTravelCordinator = (data) => ({
    type: ENROLLMENT_CORP_SAVE_TRAVELCORDINATOR,
    payload: { data }
});

export const setMemberCorporateDetail = (data) => ({
    type: ENROLLMENT_CORP_SAVE_MEMBERCORPORATEDETAIL,
    payload: { data }
});

export const setCorporateTourCode = (data) => ({
    type: ENROLLMENT_CORP_SAVE_CORPORATETOURCODE,
    payload: { data }
});