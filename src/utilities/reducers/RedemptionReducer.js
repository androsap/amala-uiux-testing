import {
  REDEMPTIONNONAIR_SET_ELIGIBLE_REDEEM_STATUS,
  REDEMPTIONNONAIR_SET_MEMBER_PROFILE,
  REDEMPTIONNONAIR_SET_USER,
  REDEMPTIONNONAIR_SET_AWARD,
  REDEMPTION_SET_ORIGIN,
  REDEMPTION_SET_DESTINATION,
  REDEMPTION_SET_DEPARTUREDATE,
  REDEMPTION_SET_RETURNDATE,
  REDEMPTION_SET_ISRETURN,
  REDEMPTION_SET_COMPARTMENT,
  REDEMPTION_SET_PASSENGER,
  REDEMPTION_SET_PRICELIST,
  REDEMPTION_SET_FLIGHTSCHEDULE,
  REDEMPTION_SET_SUMMARY,
  REDEMPTION_SET_RESPONSE_BUY_AWARD,
  REDEMPTION_SET_REDEEMUSER,
  REDEMPTION_SET_GENERAL_REQUEST,
  REDEMPTION_RESET_STORE
} from '../actions/ActionTypes';

const initialState = {
  step: 'step1', // AIRUPGRADE, AIRFREEFLIGHT, NONAIR
  buy_data: {
    memberid: null,
    cardnumber: null,
    awardid: null,
    redeemstatus: false
  },
  user: {
    username: null,
    countrycode: null
  },
  member: {
    memberid: null,
    firstname: null,
    lastname: null,
    salutationcode: null,
    salutationname: null,
    awardmiles: null,
    tierid: null,
    cardnumber: null,
    age: null,
    corporatedetailinfo: null
  },
  award: {
    awardcode: null,
    categorytype: null,
    awardtypecode: null,
    awardtypename: null,
    pricingby: null,
    alltiers: null,
    allcountries: null,
    priceaward: null,
    maxperson: null
  },
  searchflight: { // AIR
    origin: null,
    destination: null,
    departuredate: null,
    returndate: null,
    compartmentcode: null,
    passenger: 1,
    isreturn: false,
    upgrade: {
      airlinecode: null,
      compartmentcodedepart: null,
      paidbookingclassdepart: null,
      compartmentcodereturn: null,
      paidbookingclassreturn: null
    },
  },
  pricelist: { // AIR
    pricedeparture: [],
    pricereturn: []
  },
  flightschedule: { // AIR
    flightdeparture: [],
    flightreturn: []
  },
  redemptionsummary: { // AIR
    flightdeparture: {},
    flightreturn: {},
    mileage: null,
    certificateprice: null,
    activityprice: null,
    passenger: null,
    totalmileage: null
  },
  ticketvaliditydate: null, //AIR
  ticketnumber: null, //AIR
  countrycode: null,
  tierid: null,
  membershipid: null,
  freeaward: null,
  bookingcode: null,
  issuedate: null,
  eligbleredeemstatus: null,
  redeemuser: [],
  redeemairactivity: [],
  redeemvoucherdetail: [], //response
  voucherimage: null, //response
  validitydate: null, //response
  transaction: [], //response
  statementcode: null, //response
  redeemcode: null, //response
  responsebuyaward: {}
}

export default (state = initialState, action) => {
  const { payload } = action;
  let data = {};
  switch (action.type) {
    case "PAGE":
      return {
        ...state,
        step: action.data,
        buy_data: state.buy_data
      };
    case "SETDATA":
      return {
        ...state,
        step: state.step,
        buy_data: action.data
      };
    case REDEMPTION_RESET_STORE:
      return initialState
    case REDEMPTION_SET_GENERAL_REQUEST:
      data = payload.data;
      return {
        ...state,
        ticketvaliditydate: (data.ticketvaliditydate !== undefined) ? data.ticketvaliditydate : state.ticketvaliditydate,
        ticketnumber: (data.ticketnumber !== undefined) ? data.ticketnumber : state.ticketnumber,
        countrycode: (data.countrycode !== undefined) ? data.countrycode : state.countrycode,
        tierid: (data.tierid !== undefined) ? data.tierid : state.tierid,
        membershipid: (data.membershipid !== undefined) ? data.membershipid : state.membershipid,
        freeaward: (data.freeaward !== undefined) ? data.freeaward : state.freeaward
      }
    case REDEMPTIONNONAIR_SET_ELIGIBLE_REDEEM_STATUS:
      let eligbleredeemstatus = payload.eligbleredeemstatus;
      return {
        ...state,
        eligbleredeemstatus
      };
    case REDEMPTIONNONAIR_SET_MEMBER_PROFILE:
      data = payload.data;
      return {
        ...state,
        member: {
          memberid: (data.memberid !== undefined) ? data.memberid : null,
          firstname: (data.firstname !== undefined) ? data.firstname : null,
          lastname: (data.lastname !== undefined) ? data.lastname : null,
          salutationcode: (data.salutationcode !== undefined) ? data.salutationcode : null,
          salutationname: (data.salutationname !== undefined) ? data.salutationname : null,
          awardmiles: (data.awardmiles !== undefined) ? data.awardmiles : null,
          tierid: (data.tierid !== undefined) ? data.tierid : null,
          cardnumber: (data.cardnumber !== undefined) ? data.cardnumber : null,
          age: (data.age !== undefined) ? data.age : null,
          corporatedetailinfo: (data.corporatedetailinfo !== undefined) ? data.corporatedetailinfo : null
        }
      };
    case REDEMPTIONNONAIR_SET_USER:
      data = payload.data;
      return {
        ...state,
        user: {
          username: (data.username !== undefined) ? data.username : state.award.username,
          countrycode: (data.countrycode !== undefined) ? data.countrycode : state.award.countrycode
        }
      }
    case REDEMPTIONNONAIR_SET_AWARD:
      data = payload.data;
      return {
        ...state,
        award: {
          awardcode: (data.awardcode !== undefined) ? data.awardcode : state.award.awardcode,
          awardtypecode: (data.awardtypecode !== undefined) ? data.awardtypecode : state.award.awardtypecode,
          awardtypename: (data.awardtypename !== undefined) ? data.awardtypename : state.award.awardtypename,
          categorytype: (data.categorytype !== undefined) ? data.categorytype : state.award.awardcode,
          pricingby: (data.pricingby !== undefined) ? data.pricingby : state.award.pricingby,
          alltiers: (data.alltiers !== undefined) ? data.alltiers : state.award.alltiers,
          allcountries: (data.allcountries !== undefined) ? data.allcountries : state.award.allcountries,
          priceaward: (data.priceaward !== undefined) ? data.priceaward : state.award.priceaward,
          maxperson: (data.maxperson !== undefined) ? data.maxperson : state.award.maxperson
        },
      }
    case REDEMPTION_SET_ORIGIN:
      data = payload.data;
      return {
        ...state,
        searchflight: {
          ...state.searchflight,
          origin: (data.origin !== undefined) ? data.origin : state.origin
        }
      }
    case REDEMPTION_SET_DESTINATION:
      data = payload.data;
      return {
        ...state,
        searchflight: {
          ...state.searchflight,
          destination: (data.destination !== undefined) ? data.destination : state.destination
        }
      }
    case REDEMPTION_SET_DEPARTUREDATE:
      data = payload.data;
      return {
        ...state,
        searchflight: {
          ...state.searchflight,
          departuredate: (data.departuredate !== undefined) ? data.departuredate : state.departuredate
        }
      }
    case REDEMPTION_SET_RETURNDATE:
      data = payload.data;
      return {
        ...state,
        searchflight: {
          ...state.searchflight,
          returndate: (data.returndate !== undefined) ? data.returndate : state.returndate
        }
      }
    case REDEMPTION_SET_ISRETURN:
      data = payload.data;
      return {
        ...state,
        searchflight: {
          ...state.searchflight,
          isreturn: (data.isreturn !== undefined) ? data.isreturn : state.isreturn
        }
      }
    case REDEMPTION_SET_COMPARTMENT:
      data = payload.data;
      return {
        ...state,
        searchflight: {
          ...state.searchflight,
          compartmentcode: (data.compartmentcode !== undefined) ? data.compartmentcode : state.searchflight.compartmentcode,
          upgrade: {
            airlinecode: (data.upgrade !== undefined && data.upgrade.airlinecode !== undefined) ? data.upgrade.airlinecode : state.searchflight.upgrade.airlinecode,
            compartmentcodedepart: (data.upgrade !== undefined && data.upgrade.compartmentcodedepart !== undefined) ? data.upgrade.compartmentcodedepart : state.searchflight.upgrade.compartmentcodedepart,
            paidbookingclassdepart: (data.upgrade !== undefined && data.upgrade.paidbookingclassdepart !== undefined) ? data.upgrade.paidbookingclassdepart : state.searchflight.upgrade.paidbookingclassdepart,
            compartmentcodereturn: (data.upgrade !== undefined && data.upgrade.compartmentcodereturn !== undefined) ? data.upgrade.compartmentcodereturn : state.searchflight.upgrade.compartmentcodereturn,
            paidbookingclassreturn: (data.upgrade !== undefined && data.upgrade.paidbookingclassreturn !== undefined) ? data.upgrade.paidbookingclassreturn : state.searchflight.upgrade.paidbookingclassreturn,
          }
        }
      }
    case REDEMPTION_SET_PASSENGER:
      data = payload.data;
      return {
        ...state,
        searchflight: {
          ...state.searchflight,
          passenger: (data.passenger !== undefined) ? data.passenger : state.passenger
        }
      }
    case REDEMPTION_SET_PRICELIST:
      let { pricedeparture, pricereturn } = payload;
      return {
        ...state,
        pricelist: {
          pricedeparture: (pricedeparture !== undefined) ? pricedeparture : state.pricelist.pricedeparture,
          pricereturn: (pricereturn !== undefined) ? pricereturn : state.pricelist.pricereturn
        }
      }
    case REDEMPTION_SET_FLIGHTSCHEDULE:
      let { flightdeparture, flightreturn } = payload;
      return {
        ...state,
        flightschedule: {
          flightdeparture: (flightdeparture !== undefined) ? flightdeparture : state.flightschedule.flightdeparture,
          flightreturn: (flightreturn !== undefined) ? flightreturn : state.flightschedule.flightreturn
        }
      }
    case REDEMPTION_SET_SUMMARY:
      data = payload.data;
      return {
        ...state,
        redemptionsummary: {
          flightdeparture: (data.flightdeparture !== undefined) ? data.flightdeparture : state.redemptionsummary.flightdeparture,
          flightreturn: (data.flightreturn !== undefined) ? data.flightreturn : state.redemptionsummary.flightreturn,
          mileage: (data.mileage !== undefined) ? data.mileage : state.mileage,
          passenger: (data.passenger !== undefined) ? data.passenger : state.passenger,
          totalmileage: (data.totalmileage !== undefined) ? data.totalmileage : state.totalmileage,
          certificateprice: (data.certificateprice !== undefined) ? data.certificateprice : state.certificateprice,
          activityprice: (data.activityprice !== undefined) ? data.activityprice : state.activityprice
        },
      }
    case REDEMPTION_SET_REDEEMUSER:
      return {
        ...state,
        redeemuser: (payload.redeemuser !== undefined) ? payload.redeemuser : state.redeemuser
      }
    case REDEMPTION_SET_RESPONSE_BUY_AWARD:
      return {
        ...state,
        responsebuyaward: (payload.responsebuyaward !== undefined) ? payload.responsebuyaward : state.responsebuyaward
      }
    default:
      return state;
  }
};