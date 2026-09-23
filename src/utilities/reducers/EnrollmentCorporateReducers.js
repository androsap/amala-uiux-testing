
import {
    ENROLLMENT_CORP_RESET_STORE,
    ENROLLMENT_CORP_SAVE_MEMBER,
    ENROLLMENT_CORP_SAVE_MEMBERCORPORATEDETAIL,
    ENROLLMENT_CORP_SAVE_TRAVELCORDINATOR,
    ENROLLMENT_CORP_ADD_STAFF_TRAVELCORDINATOR,
    ENROLLMENT_CORP_SAVE_CORPORATETOURCODE,
    ENROLLMENT_CORP_SET_RESPONSE
} from '../actions/ActionTypes';

const initialState = {
    member: {
        username: null,
        enrollchannel: null,
        enrollmentdate: null
    },
    membercorporatedetail: {
        corporatecode: null,
        corporatename: null,
        address: null,
        countrycode: null,
        statecode: null,
        citycode: null,
        corporateemail: null,
        phonenum: null,
        langcode: null,
        tradebusinesslicense: null,
        taxnumber: null,
        corporatetype: null,
        unlimited: false,
        maxmember: null,
        actioncount: null,
        businessfield: null,
        contactname: null,
        contactidnum: null,
        contactidtype: null,
        contactemail: null,
        contactphonenum: null,
        startdate: null,
        enddate: null
    },
    corporatetourcode: {
        tourcodeid: null,
        tourcode: null,
        startdate: null,   //effective date
        enddate: null,      //expired date
        corporatecode: null
    },
    travelcordinator: [],
    response: {}
}


const enrollmentCorporateReducer = (state = initialState, action) => {
    const { payload } = action;
    let data = {};
    switch (action.type) {
        case ENROLLMENT_CORP_RESET_STORE:
            console.log("reset");
            return initialState;
        case ENROLLMENT_CORP_SET_RESPONSE:
            data = payload.data;
            return { ...state, response: data }
        case ENROLLMENT_CORP_SAVE_MEMBER:
            return {
                ...state,
                member: {
                    // username: (flightdeparture !== undefined) ? updatesummary.flightdeparture : state.updatesummary.flightdeparture
                }
            };
        case ENROLLMENT_CORP_ADD_STAFF_TRAVELCORDINATOR:
            data = payload.data;
            return {
                ...state,
                travelcordinator: [...state.travelcordinator, data]
            };
        case ENROLLMENT_CORP_SAVE_TRAVELCORDINATOR:
            data = payload.data;
            return {
                ...state,
                travelcordinator: (data !== undefined) ? data : state.travelcordinator
            };
        case ENROLLMENT_CORP_SAVE_MEMBERCORPORATEDETAIL:
            data = payload.data;
            return {
                ...state,
                membercorporatedetail: {
                    corporatecode: (data.corporatecode !== undefined) ? data.corporatecode : state.membercorporatedetail.corporatecode,
                    corporatename: (data.corporatename !== undefined) ? data.corporatename : state.membercorporatedetail.corporatename,
                    corporatetype: (data.corporatetype !== undefined) ? data.corporatetype : state.membercorporatedetail.corporatetype,
                    address: (data.address !== undefined) ? data.address : state.membercorporatedetail.address,
                    countrycode: (data.countrycode !== undefined) ? data.countrycode : state.membercorporatedetail.countrycode,
                    statecode: (data.statecode !== undefined) ? data.statecode : state.membercorporatedetail.statecode,
                    citycode: (data.citycode !== undefined) ? data.citycode : state.membercorporatedetail.citycode,
                    corporateemail: (data.corporateemail !== undefined) ? data.corporateemail : state.membercorporatedetail.corporateemail,
                    phonenum: (data.phonenum !== undefined) ? data.phonenum : state.membercorporatedetail.phonenum,
                    langcode: (data.langcode !== undefined) ? data.langcode : state.membercorporatedetail.langcode,
                    tradebusinesslicense: (data.tradebusinesslicense !== undefined) ? data.tradebusinesslicense : state.membercorporatedetail.tradebusinesslicense,
                    taxnumber: (data.taxnumber !== undefined) ? data.taxnumber : state.membercorporatedetail.taxnumber,
                    businessfield: (data.businessfield !== undefined) ? data.businessfield : state.membercorporatedetail.businessfield,
                    startdate: (data.startdate !== undefined) ? data.startdate : state.membercorporatedetail.startdate,
                    enddate: (data.enddate !== undefined) ? data.enddate : state.membercorporatedetail.enddate,
                    contactname: (data.contactname !== undefined) ? data.contactname : state.membercorporatedetail.contactname,
                    contactidnum: (data.contactidnum !== undefined) ? data.contactidnum : state.membercorporatedetail.contactidnum,
                    contactidtype: (data.contactidtype !== undefined) ? data.contactidtype : state.membercorporatedetail.contactidtype,
                    contactemail: (data.contactemail !== undefined) ? data.contactemail : state.membercorporatedetail.contactemail,
                    contactphonenum: (data.contactphonenum !== undefined) ? data.contactphonenum : state.membercorporatedetail.contactphonenum,
                    unlimited: (data.unlimited !== undefined) ? data.unlimited : state.membercorporatedetail.unlimited,
                    maxmember: (data.maxmember !== undefined) ? data.maxmember : state.membercorporatedetail.maxmember
                }
            };
        case ENROLLMENT_CORP_SAVE_CORPORATETOURCODE:
            data = payload.data;
            return {
                ...state,
                corporatetourcode: {
                    corporatecode: (data.corporatecode !== undefined) ? data.corporatecode : state.corporatetourcode.corporatecode,
                    tourcode: (data.tourcode !== undefined) ? data.tourcode : state.corporatetourcode.tourcode,
                    startdate: (data.startdate !== undefined) ? data.startdate : state.corporatetourcode.startdate,
                    enddate: (data.enddate !== undefined) ? data.enddate : state.corporatetourcode.enddate
                }
            };
        default:
            return state;
    }
}

export default enrollmentCorporateReducer;