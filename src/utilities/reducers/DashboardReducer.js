import moment from 'moment';

const initialState = {
    enrolmentMember: {
        enrollchannel: 'ALL',
        membershipid: 'REG',
        enrollmentdate: [moment().subtract(30, 'days'), moment()],
        resultSearch: []
    },
    flight: {
        member: 'ALL',
        ffpcarriercode: [],
        flightdate: [moment().subtract(30, 'days'), moment()],
        resultSearch: [],
        memberOptions: [],
        ffpcarriercodeOptions: []
    },
    promoCode: {
        promocode: 'ALL',
        promocodedate: [moment().subtract(30, 'days'), moment()],
        promocodeOptions: [],
        resultSearch: [],
    },
    nonairActivity: {
        partnercode: 'ALL',
        nonairactivitydate: [moment().subtract(30, 'days'), moment()],
        partnerOptions: [],
        resultSearch: [],
    },
    memberactivityCorporate: {
        activitytype: 'ALL',
        memberactivitycorporatedate: [moment().subtract(30, 'days'), moment()],
        resultSearch: []
    },
    redemption: {
        partnercode: 'ALL',
        awardcode: 'ALL',
        redemptiondate: [moment().subtract(30, 'days'), moment()],
        partnerOptions: [],
        awardOptions: [],
        resultSearch: [],
    },
    memberActivity: {
        activitytype: 'ALL',
        membershipid: 'ALL',
        memberactivitydate: [moment().subtract(30, 'days'), moment()],
        resultSearch: [],
    },
    memberTier: {
        gender: 'ALL',
        startdate: moment(),
        resultSearch: []
    }

}


const DashboardReducer = (state = initialState, action) => {
    const { data, type } = action;

    if (type === 'reset') {
        return {
            ...state,
            [data]: initialState[data]
        };
    }

    return {
        ...state,
        ...type ?
            {
                [type]: {
                    ...state[type],
                    ...data
                }
            }
            : null
    };
}

export default DashboardReducer;