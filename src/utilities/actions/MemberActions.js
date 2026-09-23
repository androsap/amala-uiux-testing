import { api } from '../../config/Services';
import { SET_MEMBER_SUMMARY, GET_MEMBER_SUMMARY } from "./ActionTypes";
import MiddlewareActions from "./MiddlewareActions";


export function loadDataMemberHeader(id) {
    return getMemberData(id, 'SUMMARY');
}

export function getMemberData(memberid, type = 'ALL') {
    var identity = api.identity;
    let data = { type, memberid };
    data = { identity, parameter: { data } };
    
    const configuration = {
        url: api.url.member.profile,
        method: "POST",
        data,
        onSuccess: setMemberData,
        onFailure: () => console.log("Error occured loading data"),
        label: GET_MEMBER_SUMMARY
    }

    return MiddlewareActions(configuration);
}

export function setMemberData(data) {
    return {
        type: SET_MEMBER_SUMMARY,
        payload: data
    };
}