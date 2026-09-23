import {
    SET_MEMBER_SUMMARY,
    API_START,
    API_END,
    GET_MEMBER_SUMMARY
} from "../actions/ActionTypes";

const initialState = {
    data: {
        memberfullname: '',
        status: '',
        membershipname: '',
        tiername: '',
        cardnumber: '',
        branchcode: '',
        awardmiles: '',
        tiermiles: '',
        frequency: '',
        enrollmentdate: null,
        effectivedate: null,
        expireddate: null,
        dateofbirth: null,
        memberid: null,
        memberaccount: {
            awardmiles: '',
            tiermiles: '',
            frequency: ''
        },
        membercard: {
            cardnumber: '',
            cardtemplate: '',
            membershipname: '',
            tiername: ''
        },
        membertier: {
            startdate: null,
            enddate: null
        }
    },
    isLoading: true,
    status: {
        responsecode: '',
        responsemessage: ''
    }
}

const memberReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MEMBER_SUMMARY:
            return {
                data: (action.payload.result !== undefined) ? action.payload.result : state.data,
                status: {
                    responsecode: action.payload.status.responsecode,
                    responsemessage: action.payload.status.responsemessage
                }
            };
        case API_START:
            if (action.payload === GET_MEMBER_SUMMARY) {
                return {
                    ...state,
                    isLoading: true
                };
            }
            break;
        case API_END:
            if (action.payload === GET_MEMBER_SUMMARY) {
                return {
                    ...state,
                    isLoading: false
                };
            }
            break;
        default:
            return state;
    }
}

export default memberReducer;