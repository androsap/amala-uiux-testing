import { configuration } from '../config/Config';

const URL_MASTER                = configuration.API_URL_MASTER;
const URL_MAILING               = configuration.API_URL_MAILING;
const URL_TIER                  = configuration.API_URL_TIER;
const URL_GENERAL               = configuration.API_URL_GENERAL;
const URL_MEMBER                = configuration.API_URL_MEMBER;
const URL_PARTNER               = configuration.API_URL_PARTNER;
const URL_ACCRUAL               = configuration.API_URL_ACCRUAL;
const URL_USER                  = configuration.API_URL_USER;
const URL_BRANCH                = configuration.API_URL_BRANCH;
const URL_CARD                  = configuration.API_URL_CARD;
const URL_AWARD                 = configuration.API_URL_AWARD;
const URL_ENROLLMENT            = configuration.API_URL_ENROLLMENT;
const URL_ACTIVITY              = configuration.API_URL_ACTIVITY; 
const URL_ACTIVITY_AIR_INTEGRATION      = configuration.API_URL_ACTIVITY_AIR_INTEGRATION; 
const URL_ACTIVITY_NONAIR_INTEGRATION   = configuration.API_URL_ACTIVITY_NONAIR_INTEGRATION; 
const URL_TRANSACTION           = configuration.API_URL_TRANSACTION; 
const URL_TRANSACTION_SPENDING  = configuration.API_URL_TRANSACTION_SPENDING; 
const URL_REDEMPTION            = configuration.API_URL_REDEMPTION;
const URL_RECEIPT               = configuration.API_URL_RECEIPT;
const URL_CUSTOM                = configuration.API_URL_CUSTOM;
const URL_ACTIVATION            = configuration.API_URL_ACTIVATION;
const URL_ACTIVITYAIRRATING     = configuration.API_URL_ACTIVITYAIRRATING;
const URL_ACTIVITYNONAIRRATING  = configuration.API_URL_ACTIVITYNONAIRRATING;
const URL_GENERAL_CONFIG        = configuration.API_URL_GENERAL_CONFIG;
const URL_RATING                = configuration.API_URL_RATING;
const URL_COMMUNICATION         = configuration.API_URL_COMMUNICATION;
const URL_SESSION               = configuration.API_URL_SESSION;
const URL_ELIGIBLE_REDEEM       = configuration.API_URL_ELIGIBLE_REDEEM;
const URL_ELIGIBLE_BUYAWARD     = configuration.API_URL_ELIGIBLE_BUYAWARD;
const URL_BUY_CARD              = configuration.API_URL_BUY_CARD;
const URL_REORDER               = configuration.API_URL_REORDER;
const URL_GETPRICELIST          = configuration.API_URL_GETPRICELIST;

export const SERVICEVERSION_2 = {
    region : {
        create : URL_MASTER+"/lms/master/region/create/v1",
        list   : URL_MASTER+"/lms/master/region/retrieve/v1",
        detail : URL_MASTER+"/lms/master/region/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/region/update/v1",
        delete : URL_MASTER+"/lms/master/region/delete/v1"
    },
    country : {
        create : URL_MASTER+"/lms/master/country/create/v1",
        list   : URL_MASTER+"/lms/master/country/retrieve/v1",
        detail : URL_MASTER+"/lms/master/country/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/country/update/v1",
        delete : URL_MASTER+"/lms/master/country/delete/v1"
    },
    state : {
        create : URL_MASTER+"/lms/master/state/create/v1",
        list   : URL_MASTER+"/lms/master/state/retrieve/v1",
        detail : URL_MASTER+"/lms/master/state/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/state/update/v1",
        delete : URL_MASTER+"/lms/master/state/delete/v1"
    },
    city : {
        create : URL_MASTER+"/lms/master/city/create/v1",
        list   : URL_MASTER+"/lms/master/city/retrieve/v1",
        detail : URL_MASTER+"/lms/master/city/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/city/update/v1",
        delete : URL_MASTER+"/lms/master/city/delete/v1"
    },
    airport : {
        create : URL_MASTER+"/lms/master/airport/create/v1",
        list   : URL_MASTER+"/lms/master/airport/retrieve/v1",
        detail : URL_MASTER+"/lms/master/airport/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/airport/update/v1",
        delete : URL_MASTER+"/lms/master/airport/delete/v1",
        getall : URL_MASTER+"/FFP/MasterData/Airport/getairport/v1"
    },
    title : {
        create : URL_MASTER+"/lms/master/title/create/v1",
        list   : URL_MASTER+"/lms/master/title/retrieve/v1",
        detail : URL_MASTER+"/lms/master/title/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/title/update/v1",
        delete : URL_MASTER+"/lms/master/title/delete/v1"
    },
    salutation : {
        create : URL_MASTER+"/lms/master/salutation/create/v1",
        list   : URL_MASTER+"/lms/master/salutation/retrieve/v1",
        detail : URL_MASTER+"/lms/master/salutation/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/salutation/update/v1",
        delete : URL_MASTER+"/lms/master/salutation/delete/v1"
    },
    hobbies : {
        create : URL_MASTER+"/lms/master/hobbies/create/v1",
        list   : URL_MASTER+"/lms/master/hobbies/retrieve/v1",
        detail : URL_MASTER+"/lms/master/hobbies/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/hobbies/update/v1",
        delete : URL_MASTER+"/lms/master/hobbies/delete/v1"
    },
    religion : {
        create : URL_MASTER+"/lms/master/religion/create/v1",
        list   : URL_MASTER+"/lms/master/religion/retrieve/v1",
        detail : URL_MASTER+"/lms/master/religion/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/religion/update/v1",
        delete : URL_MASTER+"/lms/master/religion/delete/v1"
    },
    language : {
        create : URL_MASTER+"/lms/master/language/create/v1",
        list   : URL_MASTER+"/lms/master/language/retrieve/v1",
        detail : URL_MASTER+"/lms/master/language/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/language/update/v1",
        delete : URL_MASTER+"/lms/master/language/delete/v1"
    },
    currency : {
        create : URL_MASTER+"/lms/master/currency/create/v1",
        list   : URL_MASTER+"/lms/master/currency/retrieve/v1",
        detail : URL_MASTER+"/lms/master/currency/retrievedetail/v1",
        update : URL_MASTER+"/lms/master/currency/update/v1",
        delete : URL_MASTER+"/lms/master/currency/delete/v1"
    },
    branch : {
        create : URL_BRANCH+"/lms/branch/branch/create/v1",
        list   : URL_BRANCH+"/lms/branch/branch/retrieve/v1",
        detail : URL_BRANCH+"/lms/branch/branch/retrievedetail/v1",
        update : URL_BRANCH+"/lms/branch/branch/update/v1",
        delete : URL_BRANCH+"/lms/branch/branch/delete/v1"
    },
    brancharea : {
        create              : URL_BRANCH+"/lms/branch/brancharea/create/v1",
        list                : URL_BRANCH+"/lms/branch/brancharea/retrieve/v1",
        detail              : URL_BRANCH+"/lms/branch/brancharea/retrievedetail/v1",
        update              : URL_BRANCH+"/lms/branch/brancharea/update/v1",
        delete              : URL_BRANCH+"/lms/branch/brancharea/delete/v1",
        getbranchfromarea   : URL_BRANCH+"/lms/branch/brancharea/getbranchfromarea/v1"
    },
    ticketoffice : {
        create      : URL_BRANCH+"/lms/branch/ticketoffice/create/v1",
        list        : URL_BRANCH+"/lms/branch/ticketoffice/retrieve/v1",
        detail      : URL_BRANCH+"/lms/branch/ticketoffice/retrievedetail/v1",
        update      : URL_BRANCH+"/lms/branch/ticketoffice/update/v1",
        delete      : URL_BRANCH+"/lms/branch/ticketoffice/delete/v1",
        getticket   : URL_BRANCH+"/lms/branch/ticketoffice/getticketoffice/v1"
    },
    mailingset: {
        create : URL_MAILING+"/lms/mailing/mailingset/create/v1",
        list   : URL_MAILING+"/lms/mailing/mailingset/retrieve/v1",
        detail : URL_MAILING+"/lms/mailing/mailingset/retrievedetail/v1",
        update : URL_MAILING+"/lms/mailing/mailingset/update/v1",
        delete : URL_MAILING+"/lms/mailing/mailingset/delete/v1"
    },
    mailing: {
        create : URL_MAILING+"/lms/mailing/mailing/create/v1",
        list   : URL_MAILING+"/lms/mailing/mailing/retrieve/v1",
        detail : URL_MAILING+"/lms/mailing/mailing/retrievedetail/v1",
        update : URL_MAILING+"/lms/mailing/mailing/update/v1",
        delete : URL_MAILING+"/lms/mailing/mailing/delete/v1"
    },
    mailingitem: {
        create : URL_MAILING+"/lms/mailing/mailingitem/create/v1",
        list   : URL_MAILING+"/lms/mailing/mailingitem/retrieve/v1",
        detail : URL_MAILING+"/lms/mailing/mailingitem/retrievedetail/v1",
        update : URL_MAILING+"/lms/mailing/mailingitem/update/v1",
        delete : URL_MAILING+"/lms/mailing/mailingitem/delete/v1"
    },
    membership : {
        create : URL_TIER+"/lms/tier/membership/create/v1",
        list   : URL_TIER+"/lms/tier/membership/retrieve/v1",
        detail : URL_TIER+"/lms/tier/membership/retrievedetail/v1",
        update : URL_TIER+"/lms/tier/membership/update/v1",
        delete : URL_TIER+"/lms/tier/membership/delete/v1"
    },
    membershiptype : {
        create : URL_TIER+"/lms/tier/membershiptype/create/v1",
        list   : URL_TIER+"/lms/tier/membershiptype/retrieve/v1",
        detail : URL_TIER+"/lms/tier/membershiptype/retrievedetail/v1",
        update : URL_TIER+"/lms/tier/membershiptype/update/v1",
        delete : URL_TIER+"/lms/tier/membershiptype/delete/v1"
    },
    tier: {
        create : URL_TIER+"/lms/tier/tier/create/v1",
        list   : URL_TIER+"/lms/tier/tier/retrieve/v1",
        detail : URL_TIER+"/lms/tier/tier/retrievedetail/v1",
        update : URL_TIER+"/lms/tier/tier/update/v1",
        delete : URL_TIER+"/lms/tier/tier/delete/v1"
    },
    tierreason: {
        create : URL_TIER+"/lms/tier/reason/create/v1",
        list   : URL_TIER+"/lms/tier/reason/retrieve/v1",
        detail : URL_TIER+"/lms/tier/reason/retrievedetail/v1",
        update : URL_TIER+"/lms/tier/reason/update/v1",
        delete : URL_TIER+"/lms/tier/reason/delete/v1"
    },
    enrollbonus : {
        create : URL_TIER+"/lms/tier/enrollbonus/create/v1",
        list   : URL_TIER+"/lms/tier/enrollbonus/retrieve/v1",
        detail : URL_TIER+"/lms/tier/enrollbonus/retrievedetail/v1",
        update : URL_TIER+"/lms/tier/enrollbonus/update/v1",
        delete : URL_TIER+"/lms/tier/enrollbonus/delete/v1"
    },
    mileagecriteria: {
        create : URL_TIER+"/lms/tier/mileagecriteria/create/v1",
        list   : URL_TIER+"/lms/tier/mileagecriteria/retrieve/v1",
        detail : URL_TIER+"/lms/tier/mileagecriteria/retrievedetail/v1",
        update : URL_TIER+"/lms/tier/mileagecriteria/update/v1",
        delete : URL_TIER+"/lms/tier/mileagecriteria/delete/v1"
    },
    activitybonus: {
        create : URL_TIER+"/lms/tier/activitybonus/create/v1",
        list   : URL_TIER+"/lms/tier/activitybonus/retrieve/v1",
        detail : URL_TIER+"/lms/tier/activitybonus/retrievedetail/v1",
        update : URL_TIER+"/lms/tier/activitybonus/update/v1",
        delete : URL_TIER+"/lms/tier/activitybonus/delete/v1"
    },
    tierduration : {
        create  : URL_TIER+"/lms/tier/tierduration/create/v1",
        list    : URL_TIER+"/lms/tier/tierduration/retrieve/v1",
        detail  : URL_TIER+"/lms/tier/tierduration/retrievedetail/v1",
        update  : URL_TIER+"/lms/tier/tierduration/update/v1",
        delete  : URL_TIER+"/lms/tier/tierduration/delete/v1"
    },
    program : {
        create  : URL_PARTNER+"/lms/partner/program/create/v1",
        list    : URL_PARTNER+"/lms/partner/program/retrieve/v1",
        detail  : URL_PARTNER+"/lms/partner/program/retrievedetail/v1",
        update  : URL_PARTNER+"/lms/partner/program/update/v1",
        delete  : URL_PARTNER+"/lms/partner/program/delete/v1",
        getprogram  : URL_PARTNER+"/lms/partner/program/getprogram/v1"
    },
    earningmiles : {
        create  : URL_PARTNER+"/lms/partner/earningmiles/create/v1",
        list    : URL_PARTNER+"/lms/partner/earningmiles/retrieve/v1",
        detail  : URL_PARTNER+"/lms/partner/earningmiles/retrievedetail/v1",
        update  : URL_PARTNER+"/lms/partner/earningmiles/update/v1",
        delete  : URL_PARTNER+"/lms/partner/earningmiles/delete/v1"
    },
    partner : {
        create  : URL_PARTNER+"/lms/partner/airlinepartner/create/v1",
        list    : URL_PARTNER+"/lms/partner/airlinepartner/retrieve/v1",
        detail  : URL_PARTNER+"/lms/partner/airlinepartner/retrievedetail/v1",
        update  : URL_PARTNER+"/lms/partner/airlinepartner/update/v1",
        delete  : URL_PARTNER+"/lms/partner/airlinepartner/delete/v1",
        getall  : URL_PARTNER+"/lms/partner/airlinepartner/getpartner/v1"
    },
    partnerlocation : {
        create  : URL_PARTNER+"/lms/partner/location/create/v1",
        list    : URL_PARTNER+"/lms/partner/location/retrieve/v1",
        detail  : URL_PARTNER+"/lms/partner/location/retrievedetail/v1",
        update  : URL_PARTNER+"/lms/partner/location/update/v1",
        delete  : URL_PARTNER+"/lms/partner/location/delete/v1",
        getall  : URL_PARTNER+"/lms/partner/location/getpartnerlocation/v1"
    },
    partnergroup : {
        create          : URL_PARTNER+"/lms/partner/group/create/v1",
        list            : URL_PARTNER+"/lms/partner/group/retrieve/v1",
        detail          : URL_PARTNER+"/lms/partner/group/retrievedetail/v1",
        update          : URL_PARTNER+"/lms/partner/group/update/v1",
        delete          : URL_PARTNER+"/lms/partner/group/delete/v1",
        addpartner      : URL_PARTNER+"/lms/partner/group/addpartner/v1",
        removepartner   : URL_PARTNER+"/lms/partner/group/removepartner/v1"
    },
    partnercobrand : {
        create  : URL_PARTNER+"/lms/partner/cobrand/create/v1",
        list    : URL_PARTNER+"/lms/partner/cobrand/retrieve/v1",
        detail  : URL_PARTNER+"/lms/partner/cobrand/retrievedetail/v1",
        update  : URL_PARTNER+"/lms/partner/cobrand/update/v1",
        delete  : URL_PARTNER+"/lms/partner/cobrand/delete/v1",
    },
    cobrandbonus : {
        create  : URL_PARTNER+"/lms/partner/cobrandbonus/create/v1",
        list    : URL_PARTNER+"/lms/partner/cobrandbonus/retrieve/v1",
        detail  : URL_PARTNER+"/lms/partner/cobrandbonus/retrievedetail/v1",
        update  : URL_PARTNER+"/lms/partner/cobrandbonus/update/v1",
        delete  : URL_PARTNER+"/lms/partner/cobrandbonus/delete/v1",
    },
    airline: {
        create : URL_PARTNER+"/lms/partner/airline/create/v1",
        list   : URL_PARTNER+"/lms/partner/airline/retrieve/v1",
        detail : URL_PARTNER+"/lms/partner/airline/retrievedetail/v1",
        update : URL_PARTNER+"/lms/partner/airline/update/v1",
        delete : URL_PARTNER+"/lms/partner/airline/delete/v1"
    },
    compartment : {
        create  : URL_PARTNER+"/lms/partner/compartment/create/v1",
        list    : URL_PARTNER+"/lms/partner/compartment/retrieve/v1",
        detail  : URL_PARTNER+"/lms/partner/compartment/retrievedetail/v1",
        update  : URL_PARTNER+"/lms/partner/compartment/update/v1",
        delete  : URL_PARTNER+"/lms/partner/compartment/delete/v1"
    },
    bookingclass: {
        create : URL_PARTNER+"/lms/partner/bookingclass/create/v1",
        list   : URL_PARTNER+"/lms/partner/bookingclass/retrieve/v1",
        detail : URL_PARTNER+"/lms/partner/bookingclass/retrievedetail/v1",
        update : URL_PARTNER+"/lms/partner/bookingclass/update/v1",
        delete : URL_PARTNER+"/lms/partner/bookingclass/delete/v1"
    },
    flightschedule: {
        create : URL_PARTNER+"/lms/partner/flightschedule/create/v1",
        list   : URL_PARTNER+"/lms/partner/flightschedule/retrieve/v1",
        detail : URL_PARTNER+"/lms/partner/flightschedule/retrievedetail/v1",
        update : URL_PARTNER+"/lms/partner/flightschedule/update/v1",
        delete : URL_PARTNER+"/lms/partner/flightschedule/delete/v1"
    },
    activitycode : {
        create  : URL_ACCRUAL+"/lms/accrual/activitycode/v2.0/create",
        list    : URL_ACCRUAL+"/lms/accrual/activitycode/v2.0/retrieve",
        detail  : URL_ACCRUAL+"/lms/accrual/activitycode/v2.0/retrievedetail",
        update  : URL_ACCRUAL+"/lms/accrual/activitycode/v2.0/update",
        delete  : URL_ACCRUAL+"/lms/accrual/activitycode/v2.0/delete",
        getall  : URL_ACCRUAL+"/lms/accrual/activitycode/v2.0/getactivitycode"
    },
    accrualruleod : {
        create  : URL_ACCRUAL+"/lms/accrual/odrule/v2.0/create",
        list    : URL_ACCRUAL+"/lms/accrual/odrule/v2.0/retrieve",
        update  : URL_ACCRUAL+"/lms/accrual/odrule/v2.0/update",
        delete  : URL_ACCRUAL+"/lms/accrual/odrule/v2.0/delete"
    },
    accrualrulenonair : {
        create  : URL_ACCRUAL+"/lms/accrual/nonairrule/v2.0/create",
        list    : URL_ACCRUAL+"/lms/accrual/nonairrule/v2.0/retrieve",
        update  : URL_ACCRUAL+"/lms/accrual/nonairrule/v2.0/update",
        delete  : URL_ACCRUAL+"/lms/accrual/nonairrule/v2.0/delete"
    },
    accrualrulebc : {
        create  : URL_ACCRUAL+"/lms/accrual/bcrule/v2.0/create",
        list    : URL_ACCRUAL+"/lms/accrual/bcrule/v2.0/retrieve",
        update  : URL_ACCRUAL+"/lms/accrual/bcrule/v2.0/update",
        delete  : URL_ACCRUAL+"/lms/accrual/bcrule/v2.0/delete"
    },
    statement : {
        create  : URL_MASTER+"/lms/master/statement/create/v1",
        list    : URL_MASTER+"/lms/master/statement/retrieve/v1",
        detail  : URL_MASTER+"/lms/master/statement/retrievedetail/v1",
        update  : URL_MASTER+"/lms/master/statement/update/v1",
        delete  : URL_MASTER+"/lms/master/statement/delete/v1"
    },
    ruleset: {
        list    : URL_GENERAL+"/lms/general/ruleset/retrieve/v1",
    },
    member: {
        list    : URL_MEMBER+"/lms/member/member/v2.1/retrieve",
        profile : URL_MEMBER+"/lms/member/member/v2.1/profile",
        update  : URL_MEMBER+"/lms/member/member/v2.1/update"
    },
    memberaddress: {
        create  : URL_MEMBER+"/lms/member/address/v2.0/create",
        update  : URL_MEMBER+"/lms/member/address/v2.0/update"
    },
    memberhobbies: {
        create  : URL_MEMBER+"/lms/member/hobbies/create/v1"
    },
    membertransaction: {
        list    : URL_MEMBER+"/lms/member/transaction/retrieve/v1",
        create  : URL_MEMBER+"/lms/member/transaction/create/v1"
    },
    membercobran: {
        list    : URL_MEMBER+"/lms/member/membercobrand/retrieve/v1",
        create  : URL_MEMBER+"/lms/member/membercobrand/create/v1",
        detail  : URL_MEMBER+"/lms/member/membercobrand/retrievedetail/v1",
        update  : URL_MEMBER+"/lms/member/membercobrand/update/v1",
    },
    membercontact: {
        list    : URL_MEMBER+"/lms/member/contact/retrieve/v1",
        create  : URL_MEMBER+"/lms/member/contact/create/v1",
        detail  : URL_MEMBER+"/lms/member/contact/retrievedetail/v1",
        update  : URL_MEMBER+"/lms/member/contact/update/v1",
        delete  : URL_MEMBER+"/lms/member/contact/delete/v1"
    },
    memberactivity:{
        // list    : URL_MEMBER+"/lms/member/activity/retrieve/v1",
        list    : URL_ACTIVITY+"/lms/activity/retrieve/v1",
    },
    memberairactivity: {
        create              : URL_ACTIVITY_AIR_INTEGRATION+"/lms/activity/air/v2.0/create",
        detail              : URL_ACTIVITY+"/lms/activity/air/v2.0/retrievedetail",
        update              : URL_ACTIVITY+"/lms/activity/air/v2.0/update",
        delete              : URL_ACTIVITY+"/lms/activity/air/v2.0/delete",
        createwithrating    : URL_ACTIVITYAIRRATING+"/lms/activitywithrating/air/v2.0/create"
    },
    membernonairactivity: {
        create              : URL_ACTIVITY_NONAIR_INTEGRATION+"/lms/activity/nonair/v2.1/create",
        detail              : URL_ACTIVITY+"/lms/activity/nonair/v2.1/retrievedetail",
        update              : URL_ACTIVITY+"/lms/activity/nonair/v2.1/update",
        delete              : URL_ACTIVITY+"/lms/activity/nonair/v2.1/delete",
        createwithrating    : URL_ACTIVITYNONAIRRATING+"/lms/activitywithrating/nonair/v2.1/create"
    },
    memberactivityhistory: {
        list    : URL_MEMBER+"/lms/member/activityhistory/retrieve/v1"
    },
    membermailing: {
        list    : URL_MEMBER+"/lms/member/mailing/retrieve/v1",
        detail  : URL_MEMBER+"/lms/member/mailing/retrievedetail/v1",
        create  : URL_MEMBER+"/lms/member/mailing/create/v1",
        update  : URL_MEMBER+"/lms/member/mailing/update/v1"
    },
    membercard: {
        list                : URL_MEMBER+"/lms/member/card/retrieve/v2",
        create              : URL_MEMBER+"/lms/member/card/create/v2",
        detail              : URL_MEMBER+"/lms/member/card/retrievedetail/v2",
        update              : URL_MEMBER+"/lms/member/card/update/v2",
        delete              : URL_MEMBER+"/lms/member/card/delete/v2",
        changedate          : URL_MEMBER+"/lms/member/card/changedate/v2",
        buycard             : URL_BUY_CARD+ "/amala/membermanagement/membercard/buycard/v2",
        reorder             : URL_REORDER+"/amala/membermanagement/membercard/reorder/v2",
        blacklist           : URL_MEMBER+"/lms/member/card/blacklist/v2",
        blacklistreorder    : URL_MEMBER+"/lms/member/card/blacklistreorder/v2"
    },
    membertier: {
        list    : URL_MEMBER+"/lms/member/tier/retrieve/v1",
        detail  : URL_MEMBER+"/lms/member/tier/retrievedetail/v1",
        create  : URL_MEMBER+"/lms/member/tier/create/v1",
        update  : URL_MEMBER+"/lms/member/tier/update/v1",
        delete  : URL_MEMBER+"/lms/member/tier/delete/v1"
    },
    cardcardnumberissued : {
        create              : URL_CARD+"/lms/cardinventory/cardnumberissued/create/v1",
        list                : URL_CARD+"/lms/cardinventory/cardnumberissued/retrieve/v1",
        detail              : URL_CARD+"/lms/cardinventory/cardnumberissued/retrievedetail/v1"
    },
    cardnumber: {
        numberofcardusage : URL_CARD + "/lms/cardinventory/cardnumber/numberofcardusage/v1",
        cardissuedreporting : URL_CARD+"/lms/cardinventory/cardnumber/cardissuedreporting/v1"
    },
    citypair : {
        create  : URL_MASTER+"/lms/master/citypair/create/v1",
        list    : URL_MASTER+"/lms/master/citypair/retrieve/v1",
        detail  : URL_MASTER+"/lms/master/citypair/retrievedetail/v1",
        update  : URL_MASTER+"/lms/master/citypair/update/v1",
        delete  : URL_MASTER+"/lms/master/citypair/delete/v1"
    },
    distancerange : {
        create  : URL_MASTER+"/lms/master/distancerange/create/v1",
        list    : URL_MASTER+"/lms/master/distancerange/retrieve/v1",
        detail  : URL_MASTER+"/lms/master/distancerange/retrievedetail/v1",
        update  : URL_MASTER+"/lms/master/distancerange/update/v1",
        delete  : URL_MASTER+"/lms/master/distancerange/delete/v1"
    },
    citypairrange : {
        create  : URL_MASTER+"/lms/master/distancerange/citypairrange/create/v2",
        list    : URL_MASTER+"/lms/master/distancerange/citypairrange/retrieve/v2",
        detail  : URL_MASTER+"/lms/master/distancerange/citypairrange/retrievedetail/v2",
        update  : URL_MASTER+"/lms/master/distancerange/citypairrange/update/v2",
        delete  : URL_MASTER+"/lms/master/distancerange/citypairrange/delete/v2"
    },
    channel: {
        list    : URL_MASTER+"/lms/master/channel/retrieve/v1"
    },
    statementtext   : {
        create  : URL_MASTER+"/lms/master/statementtext/create/v1",
        list    : URL_MASTER+"/lms/master/statementtext/retrieve/v1",
        detail  : URL_MASTER+"/lms/master/statementtext/retrievedetail/v1",
        update  : URL_MASTER+"/lms/master/statementtext/update/v1",
        delete  : URL_MASTER+"/lms/master/statementtext/delete/v1",
    },
    awardtype   : {
        create  : URL_AWARD+"/lms/award/management/awardtype/create/v1",
        list    : URL_AWARD+"/lms/award/management/awardtype/retrieve/v1",
        detail  : URL_AWARD+"/lms/award/management/awardtype/retrievedetail/v1",
        update  : URL_AWARD+"/lms/award/management/awardtype/update/v1",
        delete  : URL_AWARD+"/lms/award/management/awardtype/delete/v1",
    },
    awardcategory: {
        create  : URL_AWARD+"/lms/award/management/awardcategory/create/v1",
        list    : URL_AWARD+"/lms/award/management/awardcategory/retrieve/v1",
        detail  : URL_AWARD+"/lms/award/management/awardcategory/retrievedetail/v1",
        update  : URL_AWARD+"/lms/award/management/awardcategory/update/v1",
        delete  : URL_AWARD+"/lms/award/management/awardcategory/delete/v1",
    },
    awardprogcategory: {
        create  : URL_AWARD+"/lms/award/management/programcategory/create/v1",
        list    : URL_AWARD+"/lms/award/management/programcategory/retrieve/v1",
        detail  : URL_AWARD+"/lms/award/management/programcategory/retrievedetail/v1",
        update  : URL_AWARD+"/lms/award/management/programcategory/update/v1",
        delete  : URL_AWARD+"/lms/award/management/programcategory/delete/v1",
    },
    awardlist: {
        create              : URL_AWARD+"/lms/award/create/v2",
        list                : URL_AWARD+"/lms/award/retrieve/v2",
        getawardredeemlist  : URL_AWARD+"/lms/award/v2.0/getawardredeemlist",
    },
    awardbasicinfo: {
        create  : URL_AWARD+"/lms/award/create/v2",
        detail  : URL_AWARD+"/lms/award/basic/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/basic/update/v2"
    },
    awardpartner: {
        detail  : URL_AWARD+"/lms/award/partner/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/partner/update/v2"
    },
    awardprice1: {
        detail  : URL_AWARD+"/lms/award/price1/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/price1/update/v2"
    },
    awardprice2: {
        detail  : URL_AWARD+"/lms/award/price2/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/price2/update/v2"
    },
    awardprice3: {
        create  : URL_AWARD+"/lms/award/price3/create/v2",
        update  : URL_AWARD+"/lms/award/price3/update/v2",
        list    : URL_AWARD+"/lms/award/price3/retrieve/v2",
        detail  : URL_AWARD+"/lms/award/price3/retrievedetail/v2",
        delete  : URL_AWARD+"/lms/award/price3/delete/v2",
    },
    enrollment: {
        // enroll :  URL_ENROLLMENT+"/amala/membermanagement/member/enrollment/v2",
        enroll :  URL_ENROLLMENT
    },
    awardcancelupdate: {
        detail  : URL_AWARD+"/lms/award/cancelupdate/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/cancelupdate/update/v2"
    },
    awardeligiblecountries: {
        list    : URL_AWARD+"/lms/award/eligiblecountries/retrieve/v1",
        update  : URL_AWARD+"/lms/award/eligiblecountries/update/v1",
        delete  : URL_AWARD+"/lms/award/eligiblecountries/delete/v1",
    },
    awardeligibletiers: {
        list    : URL_AWARD+"/lms/award/eligibletiers/retrieve/v1",
        update  : URL_AWARD+"/lms/award/eligibletiers/update/v1",
        delete  : URL_AWARD+"/lms/award/eligibletiers/delete/v1",
    },
    certificatetextid: {
        detail    : URL_AWARD+"/lms/award/certificateid/retrievedetail/v1",
        update  : URL_AWARD+"/lms/award/certificateid/update/v1"
    },
    awardvouchertext: {
        create  : URL_AWARD+"/lms/award/vouchertext/create/v2",
        list    : URL_AWARD+"/lms/award/vouchertext/retrieve/v2",
        detail  : URL_AWARD+"/lms/award/vouchertext/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/vouchertext/update/v2",
        delete  : URL_AWARD+"/lms/award/vouchertext/delete/v2",
    },
    awardstatus: {
        detail  : URL_AWARD+"/lms/award/componentstatus/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/componentstatus/update/v2"
    },
    transaction:{
        earning     : URL_TRANSACTION+ "/amala/accrual/transaction/earning/v1",
        spending    : URL_TRANSACTION_SPENDING+ "/amala/accrual/transaction/spending/v1",
        rating      : URL_RATING+"/lms/accrual/rating/v3.0/rate"
    },
    redemptioncertificate: {
        create  : URL_REDEMPTION+"/lms/redemption/certificate/create/v1",
        list    : URL_REDEMPTION+"/lms/redemption/certificate/retrieve/v1",
        detail  : URL_REDEMPTION+"/lms/redemption/certificate/retrievedetail/v1",
        cancel  : URL_REDEMPTION+"/lms/redemption/certificate/cancel/v1"
    },
    memberreceipt: {
        list    : URL_RECEIPT+"/lms/receipt/receipt/retrieve/v2"
    },
    receiptcatalogue: {
        create  : URL_RECEIPT+"/lms/receipt/receiptcatalogue/create/v1",
        list    : URL_RECEIPT+"/lms/receipt/receiptcatalogue/retrieve/v1",
        update  : URL_RECEIPT+"/lms/receipt/receiptcatalogue/update/v1",
        detail  : URL_RECEIPT+"/lms/receipt/receiptcatalogue/retrievedetail/v1",
        delete  : URL_RECEIPT+"/lms/receipt/receiptcatalogue/delete/v1",
    },
    peakseason: {
        create  : URL_MASTER+"/lms/master/peakseason/create/v1",
        update  : URL_MASTER+"/lms/master/peakseason/update/v1",
        list    : URL_MASTER+"/lms/master/peakseason/retrieve/v1",
        detail  : URL_MASTER+"/lms/master/peakseason/retrievedetail/v1",
        delete  : URL_MASTER+"/lms/master/peakseason/delete/v1"
    },
    blackout: {
        create  : URL_MASTER+"/lms/master/blackout/create/v1",
        update  : URL_MASTER+"/lms/master/blackout/update/v1",
        list    : URL_MASTER+"/lms/master/blackout/retrieve/v1",
        detail  : URL_MASTER+"/lms/master/blackout/retrievedetail/v1",
        delete  : URL_MASTER+"/lms/master/blackout/delete/v1"
    },
    customtransaction: {
        create  : URL_CUSTOM+"/lms/custom/customtransaction/create/v1",
        update  : URL_CUSTOM+"/lms/custom/customtransaction/update/v1",
        list    : URL_CUSTOM+"/lms/custom/customtransaction/retrieve/v1",
        delete  : URL_CUSTOM+"/lms/custom/customtransaction/delete/v1"
    },
    activation: {
        activation : URL_ACTIVATION
    },
    generalconfig: {
        create  : URL_GENERAL_CONFIG+"/lms/master/generalconfig/v1.0/create",
        update  : URL_GENERAL_CONFIG+"/lms/master/generalconfig/v1.0/update",
        list    : URL_GENERAL_CONFIG+"/lms/master/generalconfig/v1.0/retrieve",
        delete  : URL_GENERAL_CONFIG+"/lms/master/generalconfig/v1.0/delete"
    },
    user:{
        create  : URL_USER+"/lms/user/user/create/v1",
        update  : URL_USER+"/lms/user/user/update/v1",
        list    : URL_USER+"/lms/user/user/retrieve/v1",
        delete  : URL_USER+"/lms/user/user/delete/v1"
    },
    role:{
        create  : URL_USER+"/lms/user/role/create/v1",
        update  : URL_USER+"/lms/user/role/update/v1",
        list    : URL_USER+"/lms/user/role/retrieve/v1",
        delete  : URL_USER+"/lms/user/role/delete/v1"
    },
    parkactivity: {
        list    : URL_ACTIVITY+"/lms/activity/parkactivity/retrieve/v1"
    },
    communication: {
        create  : URL_COMMUNICATION+"/lms/communication/create/v1",
        list    : URL_COMMUNICATION+"/lms/communication/retrieve/v1",
        detail  : URL_COMMUNICATION+"/lms/communication/retrievedetail/v1",
        update  : URL_COMMUNICATION+"/lms/communication/update/v1",
        delete  : URL_COMMUNICATION+"/lms/communication/delete/v1"
    },
    sessionmanagement:{
        login   : URL_SESSION+"/lms/user/session/login/v1",
        expire  : URL_SESSION+"/lms/user/session/expire/v1"
    },
    redemption: {
        eligibleredeem  : URL_ELIGIBLE_REDEEM + "/amala/redemption/geteligibleredeem/v1",
        // buyaward        : URL_ELIGIBLE_BUYAWARD + "/amala/redemption/buyaward/v1",
        buyaward        : URL_ELIGIBLE_BUYAWARD + "/amala/redemption/v4.0/buyaward",
        getpricelist    : URL_GETPRICELIST + "/lms/redemption/getpricelist/v1"
    }
}