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
// const URL_GENERAL_CONFIG        = configuration.API_URL_GENERAL_CONFIG;
const URL_RATING                = configuration.API_URL_RATING;
const URL_COMMUNICATION         = configuration.API_URL_COMMUNICATION;
const URL_SESSION               = configuration.API_URL_SESSION;
const URL_ELIGIBLE_REDEEM       = configuration.API_URL_ELIGIBLE_REDEEM;
const URL_ELIGIBLE_BUYAWARD     = configuration.API_URL_ELIGIBLE_BUYAWARD;
// const URL_BUY_CARD              = configuration.API_URL_BUY_CARD;
const URL_REORDER               = configuration.API_URL_REORDER;
const URL_GETPRICELIST          = configuration.API_URL_GETPRICELIST;
const URL_RETRO                 = configuration.API_URL_RETRO;

export const SERVICEVERSION_4 = {
    region : {
        create      : URL_MASTER+"/amala/master/region/v4.0/create",
        list        : URL_MASTER+"/amala/master/region/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/region/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/region/v4.0/update",
        delete      : URL_MASTER+"/amala/master/region/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/region/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/region/v4.0/deactivate"
    },
    salutation : {
        create      : URL_MASTER+"/amala/master/salutation/v4.0/create",
        list        : URL_MASTER+"/amala/master/salutation/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/salutation/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/salutation/v4.0/update",
        delete      : URL_MASTER+"/amala/master/salutation/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/salutation/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/salutation/v4.0/deactivate"
    },
    religion : {
        create      : URL_MASTER+"/amala/master/religion/v4.0/create",
        list        : URL_MASTER+"/amala/master/religion/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/religion/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/religion/v4.0/update",
        delete      : URL_MASTER+"/amala/master/religion/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/religion/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/religion/v4.0/deactivate"
    },
    currency : {
        create      : URL_MASTER+"/amala/master/currency/v4.0/create",
        list        : URL_MASTER+"/amala/master/currency/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/currency/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/currency/v4.0/update",
        delete      : URL_MASTER+"/amala/master/currency/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/currency/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/currency/v4.0/deactivate"
    },
    country : {
        create      : URL_MASTER+"/amala/master/country/v4.0/create",
        list        : URL_MASTER+"/amala/master/country/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/country/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/country/v4.0/update",
        delete      : URL_MASTER+"/amala/master/country/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/country/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/country/v4.0/deactivate"
    },
    state : {
        create      : URL_MASTER+"/amala/master/state/v4.0/create",
        list        : URL_MASTER+"/amala/master/state/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/state/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/state/v4.0/update",
        delete      : URL_MASTER+"/amala/master/state/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/state/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/state/v4.0/deactivate"
    },
    city : {
        create      : URL_MASTER+"/amala/master/city/v4.0/create",
        list        : URL_MASTER+"/amala/master/city/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/city/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/city/v4.0/update",
        delete      : URL_MASTER+"/amala/master/city/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/city/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/city/v4.0/deactivate"
    },
    hobbies : {
        create      : URL_MASTER+"/amala/master/hobbies/v4.0/create",
        list        : URL_MASTER+"/amala/master/hobbies/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/hobbies/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/hobbies/v4.0/update",
        delete      : URL_MASTER+"/amala/master/hobbies/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/hobbies/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/hobbies/v4.0/deactivate"
    },
    title : {
        create      : URL_MASTER+"/amala/master/title/v4.0/create",
        list        : URL_MASTER+"/amala/master/title/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/title/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/title/v4.0/update",
        delete      : URL_MASTER+"/amala/master/title/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/title/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/title/v4.0/deactivate"
    },
    airport : {
        create      : URL_MASTER+"/amala/master/airport/v4.0/create",
        list        : URL_MASTER+"/amala/master/airport/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/airport/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/airport/v4.0/update",
        delete      : URL_MASTER+"/amala/master/airport/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/airport/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/airport/v4.0/deactivate"
    },
    language : {
        create      : URL_MASTER+"/amala/master/language/v4.0/create",
        list        : URL_MASTER+"/amala/master/language/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/language/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/language/v4.0/update",
        delete      : URL_MASTER+"/amala/master/language/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/language/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/language/v4.0/deactivate"
    },
    citypair : {
        create      : URL_MASTER+"/amala/master/citypair/v4.0/create",
        list        : URL_MASTER+"/amala/master/citypair/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/citypair/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/citypair/v4.0/update",
        delete      : URL_MASTER+"/amala/master/citypair/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/citypair/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/citypair/v4.0/deactivate",
        addnew      : URL_MASTER+"/amala/master/citypair/v4.0/addnew",
        remove      : URL_MASTER+"/amala/master/citypair/v4.0/remove"
    },
    airline: {
        create      : URL_PARTNER+"/amala/partner/airline/v4.1/create",
        list        : URL_PARTNER+"/amala/partner/airline/v4.1/retrieve",
        detail      : URL_PARTNER+"/amala/partner/airline/v4.1/retrievedetail",
        update      : URL_PARTNER+"/amala/partner/airline/v4.1/update",
        delete      : URL_PARTNER+"/amala/partner/airline/v4.1/delete",
        activate    : URL_PARTNER+"/amala/partner/airline/v4.1/activate",
        deactivate  : URL_PARTNER+"/amala/partner/airline/v4.1/deactivate"
    },
    branch : {
        create      : URL_BRANCH+"/amala/branch/branch/v4.0/create",
        list        : URL_BRANCH+"/amala/branch/branch/v4.0/retrieve",
        detail      : URL_BRANCH+"/amala/branch/branch/v4.0/retrievedetail",
        update      : URL_BRANCH+"/amala/branch/branch/v4.0/update",
        delete      : URL_BRANCH+"/amala/branch/branch/v4.0/delete",
        activate    : URL_BRANCH+"/amala/branch/branch/v4.0/activate",
        deactivate  : URL_BRANCH+"/amala/branch/branch/v4.0/deactivate"
    },
    brancharea : {
        create              : URL_BRANCH+"/amala/branch/brancharea/v4.0/create",
        list                : URL_BRANCH+"/amala/branch/brancharea/v4.0/retrieve",
        detail              : URL_BRANCH+"/amala/branch/brancharea/v4.0/retrievedetail",
        update              : URL_BRANCH+"/amala/branch/brancharea/v4.0/update",
        delete              : URL_BRANCH+"/amala/branch/brancharea/v4.0/delete",
        getbranchfromarea   : URL_BRANCH+"/amala/branch/brancharea/v4.0/getbranchfromarea",
        activate            : URL_BRANCH+"/amala/branch/branch/v4.0/activate",
        deactivate          : URL_BRANCH+"/amala/branch/branch/v4.0/deactivate"
    },
    ticketoffice : {
        create      : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/create",
        list        : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/retrieve",
        detail      : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/retrievedetail",
        update      : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/update",
        delete      : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/delete",
        getticket   : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/getticketoffice",
        activate    : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/activate",
        deactivate  : URL_BRANCH+"/amala/branch/ticketoffice/v4.0/deactivate"
    },
    tierreason: {
        create : URL_TIER+"/amala/tier/tierreason/v4.0/create",
        list   : URL_TIER+"/amala/tier/tierreason/v4.0/retrieve",
        detail : URL_TIER+"/amala/tier/tierreason/v4.0/retrievedetail",
        update : URL_TIER+"/amala/tier/tierreason/v4.0/update",
        delete : URL_TIER+"/amala/tier/tierreason/v4.0/delete"
    },
    partner : {
        create      : URL_PARTNER+"/amala/partner/partner/v4.0/create",
        list        : URL_PARTNER+"/amala/partner/partner/v4.0/retrieve",
        detail      : URL_PARTNER+"/amala/partner/partner/v4.0/retrievedetail",
        update      : URL_PARTNER+"/amala/partner/partner/v4.0/update",
        delete      : URL_PARTNER+"/amala/partner/partner/v4.0/delete",
        getall      : URL_PARTNER+"/amala/partner/partner/v4.0/getpartner",
        activate    : URL_PARTNER+"/amala/partner/partner/v4.0/activate",
        deactivate  : URL_PARTNER+"/amala/partner/partner/v4.0/deactivate"
    },
    partnerlocation : {
        create  : URL_PARTNER+"/amala/partner/partnerlocation/v4.0/create",
        list    : URL_PARTNER+"/amala/partner/partnerlocation/v4.0/retrieve",
        detail  : URL_PARTNER+"/amala/partner/partnerlocation/v4.0/retrievedetail",
        update  : URL_PARTNER+"/amala/partner/partnerlocation/v4.0/update",
        delete  : URL_PARTNER+"/amala/partner/partnerlocation/v4.0/delete",
        getall  : URL_PARTNER+"/amala/partner/partnerlocation/v4.0/getpartnerlocation"
    },
    compartment : {
        create  : URL_PARTNER+"/amala/partner/compartment/v4.0/create",
        list    : URL_PARTNER+"/amala/partner/compartment/v4.0/retrieve",
        detail  : URL_PARTNER+"/amala/partner/compartment/v4.0/retrievedetail",
        update  : URL_PARTNER+"/amala/partner/compartment/v4.0/update",
        delete  : URL_PARTNER+"/amala/partner/compartment/v4.0/delete"
    },
    subclass: {
        create  : URL_PARTNER+"/amala/partner/subclass/v4.0/create",
        list    : URL_PARTNER+"/amala/partner/subclass/v4.0/retrieve",
        detail  : URL_PARTNER+"/amala/partner/subclass/v4.0/retrievedetail",
        update  : URL_PARTNER+"/amala/partner/subclass/v4.0/update",
        delete  : URL_PARTNER+"/amala/partner/subclass/v4.0/delete"
    },
    subclassmapping: {
        create  : URL_PARTNER+"/amala/partner/subclassmapping/v4.0/create",
        list    : URL_PARTNER+"/amala/partner/subclassmapping/v4.0/retrieve",
        detail  : URL_PARTNER+"/amala/partner/subclassmapping/v4.0/retrievedetail",
        update  : URL_PARTNER+"/amala/partner/subclassmapping/v4.0/update",
        delete  : URL_PARTNER+"/amala/partner/subclassmapping/v4.0/delete"
    },
    flightschedule: {
        create      : URL_PARTNER+"/amala/partner/flightschedule/v4.0/create",
        list        : URL_PARTNER+"/amala/partner/flightschedule/v4.0/retrieve",
        detail      : URL_PARTNER+"/amala/partner/flightschedule/v4.0/retrievedetail",
        update      : URL_PARTNER+"/amala/partner/flightschedule/v4.0/update",
        delete      : URL_PARTNER+"/amala/partner/flightschedule/v4.0/delete",
        activate    : URL_PARTNER+"/amala/partner/flightschedule/v4.0/activate",
        deactivate  : URL_PARTNER+"/amala/partner/flightschedule/v4.0/deactivate"
    },
    program : {
        create      : URL_PARTNER+"/amala/partner/program/v4.0/create",
        list        : URL_PARTNER+"/amala/partner/program/v4.0/retrieve",
        detail      : URL_PARTNER+"/amala/partner/program/v4.0/retrievedetail",
        update      : URL_PARTNER+"/amala/partner/program/v4.0/update",
        delete      : URL_PARTNER+"/amala/partner/program/v4.0/delete",
        getprogram  : URL_PARTNER+"/amala/partner/program/v4.0/getprogram"
    },
    generalconfig: {
        create  : URL_MASTER+"/amala/master/generalconfiguration/v4.0/create",
        list    : URL_MASTER+"/amala/master/generalconfiguration/v4.0/retrieve",
        update  : URL_MASTER+"/amala/master/generalconfiguration/v4.0/update",
        delete  : URL_MASTER+"/amala/master/generalconfiguration/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/generalconfiguration/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/generalconfiguration/v4.0/deactivate"
    },
    receiptcatalogue: {
        create  : URL_ACCRUAL+"/amala/accrual/receiptcatalogue/v4.0/create",
        list    : URL_ACCRUAL+"/amala/accrual/receiptcatalogue/v4.0/retrieve",
        update  : URL_ACCRUAL+"/amala/accrual/receiptcatalogue/v4.0/update",
        detail  : URL_ACCRUAL+"/amala/accrual/receiptcatalogue/v4.0/retrievedetail",
        delete  : URL_ACCRUAL+"/amala/accrual/receiptcatalogue/v4.0/delete",
    },
    distancerange : {
        create : URL_MASTER+"/amala/master/distancerange/v4.0/create",
        list   : URL_MASTER+"/amala/master/distancerange/v4.0/retrieve",
        detail : URL_MASTER+"/amala/master/distancerange/v4.0/retrievedetail",
        update : URL_MASTER+"/amala/master/distancerange/v4.0/update",
        delete : URL_MASTER+"/amala/master/distancerange/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/distancerange/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/distancerange/v4.0/deactivate"
    },
    membershiptype : {
        create : URL_TIER+"/amala/tier/membershiptype/v4.0/create",
        list   : URL_TIER+"/amala/tier/membershiptype/v4.0/retrieve",
        detail : URL_TIER+"/amala/tier/membershiptype/v4.0/retrievedetail",
        update : URL_TIER+"/amala/tier/membershiptype/v4.0/update",
        delete : URL_TIER+"/amala/tier/membershiptype/v4.0/delete"
    },
    membership : {
        create : URL_TIER+"/amala/tier/membership/v4.0/create",
        list   : URL_TIER+"/amala/tier/membership/v4.0/retrieve",
        detail : URL_TIER+"/amala/tier/membership/v4.0/retrievedetail",
        update : URL_TIER+"/amala/tier/membership/v4.0/update",
        delete : URL_TIER+"/amala/tier/membership/v4.0/delete"
    },
    tier: {
        create : URL_TIER+"/amala/tier/tier/v4.0/create",
        list   : URL_TIER+"/amala/tier/tier/v4.0/retrieve",
        detail : URL_TIER+"/amala/tier/tier/v4.0/retrievedetail",
        update : URL_TIER+"/amala/tier/tier/v4.0/update",
        delete : URL_TIER+"/amala/tier/tier/v4.0/delete"
    },
    tierduration : {
        create  : URL_TIER+"/amala/tier/tierduration/v4.0/create",
        list    : URL_TIER+"/amala/tier/tierduration/v4.0/retrieve",
        detail  : URL_TIER+"/amala/tier/tierduration/v4.0/retrievedetail",
        update  : URL_TIER+"/amala/tier/tierduration/v4.0/update",
        delete  : URL_TIER+"/amala/tier/tierduration/v4.0/delete"
    },
    mileagecriteria: {
        create : URL_TIER+"/amala/tier/mileagecriteria/v4.0/create",
        list   : URL_TIER+"/amala/tier/mileagecriteria/v4.0/retrieve",
        detail : URL_TIER+"/amala/tier/mileagecriteria/v4.0/retrievedetail",
        update : URL_TIER+"/amala/tier/mileagecriteria/v4.0/update",
        delete : URL_TIER+"/amala/tier/mileagecriteria/v4.0/delete"
    },
    awardtype: {
        create       : URL_AWARD+"/amala/award/type/v4.0/create",
        list         : URL_AWARD+"/amala/award/type/v4.0/retrieveawardtype",
        update       : URL_AWARD+"/amala/award/type/v4.0/update",
        categorytype : URL_AWARD+"/amala/award/type/v4.0/retrievecategorytype",
        category     : URL_AWARD+"/amala/award/type/v4.0/retrievecategory"
    },
    blackout: {
        create      : URL_AWARD+"/amala/award/blackout/v4.0/create",
        list        : URL_AWARD+"/amala/award/blackout/v4.0/retrieve",
        detail      : URL_AWARD+"/amala/award/blackout/v4.0/retrievedetail",
        update      : URL_AWARD+"/amala/award/blackout/v4.0/update",
        delete      : URL_AWARD+"/amala/award/blackout/v4.0/delete",
        activate    : URL_AWARD+"/amala/award/blackout/v4.0/activate",
        deactivate  : URL_AWARD+"/amala/award/blackout/v4.0/deactivate"
    },
    statement : {
        create      : URL_MASTER+"/amala/master/statement/v4.0/create",
        list        : URL_MASTER+"/amala/master/statement/v4.0/retrieve",
        detail      : URL_MASTER+"/amala/master/statement/v4.0/retrievedetail",
        update      : URL_MASTER+"/amala/master/statement/v4.0/update",
        delete      : URL_MASTER+"/amala/master/statement/v4.0/delete",
        activate    : URL_MASTER+"/amala/master/statement/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/master/statement/v4.0/deactivate"
    },
    statementtext   : {
        create  : URL_MASTER+"/amala/master/statementtext/v4.1/create",
        list    : URL_MASTER+"/amala/master/statementtext/v4.1/retrieve",
        detail  : URL_MASTER+"/amala/master/statementtext/v4.1/retrievedetail",
        update  : URL_MASTER+"/amala/master/statementtext/v4.1/update",
        delete  : URL_MASTER+"/amala/master/statementtext/v4.1/delete",
    },
    channel: {
        list    : URL_MASTER+"/amala/master/channel/v4.0/retrieve"
    },
    awardmaster: {
        create              : URL_AWARD+"/amala/award/master/v4.0/create",
        list                : URL_AWARD+"/amala/award/master/v4.0/retrieve",
        detailbasicinfo     : URL_AWARD+"/amala/award/master/v4.0/retrievedetailbasicinfo",
        update              : URL_AWARD+"/amala/award/master/v4.0/updatebasicinfo",
        detailpartner       : URL_AWARD+"/amala/award/master/v4.0/retrievedetailpartner",
        updatepartner       : URL_AWARD+"/amala/award/master/v4.0/updatepartner",
        detailcancelupdate  : URL_AWARD+"/amala/award/master/v4.0/retrievecancelupdaterule",
        updatecancelupdate  : URL_AWARD+"/amala/award/master/v4.0/updatecancelupdaterule",
        detailcertificate   : URL_AWARD+"/amala/award/master/v4.0/retrievecertificate",
        updatecertificate   : URL_AWARD+"/amala/award/master/v4.0/updatecertificate",
        detailstatus        : URL_AWARD+"/amala/award/master/v4.0/retrievedetailstatus",
        activatestatus      : URL_AWARD+"/amala/award/master/v4.0/activation",
        terminatestatus     : URL_AWARD+"/amala/award/master/v4.0/terminate",
        detailfixedprice    : URL_AWARD+"/amala/award/master/v4.0/retrievefixedprice",
        updatefixedprice    : URL_AWARD+"/amala/award/master/v4.0/updatefixedprice",
        retrievecancelupdate: URL_AWARD+"/amala/award/master/v4.0/retrievecancelupdaterule"
    },
    awardeligiblecountries: {
        list    : URL_AWARD+"/amala/award/eligiblecountries/v4.0/retrieve",
        update  : URL_AWARD+"/amala/award/eligiblecountries/v4.0/update"
    },
    awardeligibletiers: {
        list    : URL_AWARD+"/amala/award/eligibletiers/v4.0/retrieve",
        update  : URL_AWARD+"/amala/award/eligibletiers/v4.0/update"
    },
    partnercobrand : {
        create      : URL_PARTNER+"/amala/partner/cobrand/v4.0/create",
        list        : URL_PARTNER+"/amala/partner/cobrand/v4.0/retrieve",
        detail      : URL_PARTNER+"/amala/partner/cobrand/v4.0/retrievedetail",
        update      : URL_PARTNER+"/amala/partner/cobrand/v4.0/update",
        delete      : URL_PARTNER+"/amala/partner/cobrand/v4.0/delete",
        activate    : URL_PARTNER+"/amala/partner/cobrand/v4.0/activate",
        deactivate  : URL_PARTNER+"/amala/partner/cobrand/v4.0/deactivate"
    },
    cobrandbonus : {
        create      : URL_PARTNER+"/amala/partner/cobrandbonus/v4.1/create",
        list        : URL_PARTNER+"/amala/partner/cobrandbonus/v4.1/retrieve",
        detail      : URL_PARTNER+"/amala/partner/cobrandbonus/v4.1/retrievedetail",
        update      : URL_PARTNER+"/amala/partner/cobrandbonus/v4.1/update",
        delete      : URL_PARTNER+"/amala/partner/cobrandbonus/v4.1/delete",
        activate    : URL_PARTNER+"/amala/partner/cobrandbonus/v4.1/activate",
        deactivate  : URL_PARTNER+"/amala/partner/cobrandbonus/v4.1/deactivate"
    },
    activitycode : {
        create      : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/create",
        list        : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/retrieve",
        detail      : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/retrievedetail",
        update      : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/update",
        delete      : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/delete",
        getall      : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/getactivitycode",
        activate    : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/activate",
        deactivate  : URL_ACCRUAL+"/amala/accrual/activitycode/v4.0/deactivate"
    },
    codeshare : {
        create      : URL_PARTNER+"/amala/partner/codeshare/v4.1/create",
        list        : URL_PARTNER+"/amala/partner/codeshare/v4.1/retrieve",
        detail      : URL_PARTNER+"/amala/partner/codeshare/v4.0/retrievedetail",
        update      : URL_PARTNER+"/amala/partner/codeshare/v4.1/update",
        delete      : URL_PARTNER+"/amala/partner/codeshare/v4.1/delete",
        activate    : URL_PARTNER+"/amala/partner/codeshare/v4.1/activate",
        deactivate  : URL_PARTNER+"/amala/partner/codeshare/v4.1/deactivate"
    },
    peakseason: {
        create      : URL_AWARD+"/amala/award/peakseason/v4.0/create",
        list        : URL_AWARD+"/amala/award/peakseason/v4.0/retrieve",
        detail      : URL_AWARD+"/amala/award/peakseason/v4.0/retrievedetail",
        update      : URL_AWARD+"/amala/award/peakseason/v4.0/update",
        delete      : URL_AWARD+"/amala/award/peakseason/v4.0/delete",
        activate    : URL_AWARD+"/amala/award/peakseason/v4.0/activate",
        deactivate  : URL_AWARD+"/amala/award/peakseason/v4.0/deactivate"
    },
    earningmiles : {
        create      : URL_AWARD+"/amala/partner/earningmiles/v4.0/create",
        list        : URL_AWARD+"/amala/partner/earningmiles/v4.0/retrieve",
        detail      : URL_AWARD+"/amala/partner/earningmiles/v4.0/retrievedetail",
        update      : URL_AWARD+"/amala/partner/earningmiles/v4.0/update",
        delete      : URL_AWARD+"/amala/partner/earningmiles/v4.0/delete",
        activate    : URL_AWARD+"/amala/partner/earningmiles/v4.0/activate",
        deactivate  : URL_AWARD+"/amala/partner/earningmiles/v4.0/deactivate"
    },
    parkactivity: {
        create  : URL_ACTIVITY+"/amala/accrual/parkactivity/v4.0/create",
        list    : URL_ACTIVITY+"/amala/accrual/parkactivity/v4.0/retrieve",
        delete  : URL_ACTIVITY+"/amala/accrual/parkactivity/v4.0/delete"
    },
    customtransaction: {
        create  : URL_CUSTOM+"/amala/accrual/customtransaction/v4.0/create",
        list    : URL_CUSTOM+"/amala/accrual/customtransaction/v4.0/retrieve",
        update  : URL_CUSTOM+"/amala/accrual/customtransaction/v4.0/update",
        delete  : URL_CUSTOM+"/amala/accrual/customtransaction/v4.0/delete",
    },
    mailingset: {
        create  : URL_MAILING+"/amala/mailing/mailingset/v4.0/create",
        list    : URL_MAILING+"/amala/mailing/mailingset/v4.0/retrieve",
        update  : URL_MAILING+"/amala/mailing/mailingset/v4.0/update",
        delete  : URL_MAILING+"/amala/mailing/mailingset/v4.0/delete"
    },
    mailing: {
        create  : URL_MAILING+"/amala/mailing/mailing/v4.0/create",
        list    : URL_MAILING+"/amala/mailing/mailing/v4.0/retrieve",
        update  : URL_MAILING+"/amala/mailing/mailing/v4.0/update",
        delete  : URL_MAILING+"/amala/mailing/mailing/v4.0/delete"
    },
    mailingitem: {
        create  : URL_MAILING+"/amala/mailing/mailingitem/v4.0/create",
        list    : URL_MAILING+"/amala/mailing/mailingitem/v4.0/retrieve",
        update  : URL_MAILING+"/amala/mailing/mailingitem/v4.0/update",
        delete  : URL_MAILING+"/amala/mailing/mailingitem/v4.0/delete"
    },
    enrollbonus : {
        create  : URL_TIER+"/amala/tier/tierenrollbonus/v4.0/create",
        list    : URL_TIER+"/amala/tier/tierenrollbonus/v4.0/retrieve",
        update  : URL_TIER+"/amala/tier/tierenrollbonus/v4.0/update",
        delete  : URL_TIER+"/amala/tier/tierenrollbonus/v4.0/delete"
    },
    activitybonus: {
        create  : URL_TIER+"/amala/tier/activitybonus/v4.0/create",
        list    : URL_TIER+"/amala/tier/activitybonus/v4.0/retrieve",
        update  : URL_TIER+"/amala/tier/activitybonus/v4.0/update",
        delete  : URL_TIER+"/amala/tier/activitybonus/v4.0/delete"
    },
    cardcardnumberissued : {
        create  : URL_CARD+"/amala/cardinventory/cardnumberissued/v4.0/create",
        list    : URL_CARD+"/amala/cardinventory/cardnumberissued/v4.0/retrieve",
        detail  : URL_CARD+"/amala/cardinventory/cardnumberissued/v4.0/retrievedetail"
    },
    cardnumber: {
        cardnumberofuse   : URL_CARD +"/amala/cardinventory/cardnumber/v4.0/cardnumberofuse",
        cardissuedreporting : URL_CARD+"/amala/cardinventory/cardnumber/v4.0/cardissuedreporting"
    },
    partnergroup : {
        create          : URL_PARTNER+"/amala/partner/partnergroup/v4.0/create",
        list            : URL_PARTNER+"/amala/partner/partnergroup/v4.0/retrieve",
        detail          : URL_PARTNER+"/amala/partner/partnergroup/v4.0/retrievedetail",
        update          : URL_PARTNER+"/amala/partner/partnergroup/v4.0/update",
        delete          : URL_PARTNER+"/amala/partner/partnergroup/v4.0/delete",
        addpartner      : URL_PARTNER+"/amala/partner/partnergroup/v4.0/addpartner",
        removepartner   : URL_PARTNER+"/amala/partner/partnergroup/v4.0/removepartner"
    },
    accrualruleod : {
        create                      : URL_ACCRUAL+"/amala/accrual/odrule/v4.0/create",
        list                        : URL_ACCRUAL+"/amala/accrual/odrule/v4.0/retrieve",
        update                      : URL_ACCRUAL+"/amala/accrual/odrule/v4.0/update",
        delete                      : URL_ACCRUAL+"/amala/accrual/odrule/v4.0/delete",
        getcitypairbydistancerange  : URL_ACCRUAL+"/amala/accrual/odrule/v4.0/getcitypairbydistancerange",
        getcitypairlist             : URL_ACCRUAL+"/amala/accrual/odrule/v4.0/getcitypairlist"
    },
    accrualrulebc : {
        create  : URL_ACCRUAL+"/amala/accrual/bcrule/v4.0/create",
        list    : URL_ACCRUAL+"/amala/accrual/bcrule/v4.0/retrieve",
        update  : URL_ACCRUAL+"/amala/accrual/bcrule/v4.0/update",
        delete  : URL_ACCRUAL+"/amala/accrual/bcrule/v4.0/delete",
        retrievebcrule    : URL_ACCRUAL+"/amala/accrual/bcrule/v4.0/retrievebcrule",
    },
    accrualrulenonair : {
        create  : URL_ACCRUAL+"/amala/accrual/nonairrule/v4.1/create",
        list    : URL_ACCRUAL+"/amala/accrual/nonairrule/v4.1/retrieve",
        update  : URL_ACCRUAL+"/amala/accrual/nonairrule/v4.1/update",
        delete  : URL_ACCRUAL+"/amala/accrual/nonairrule/v4.1/delete"
    },
    ruleset: {
        list    : URL_GENERAL+"/lms/general/ruleset/retrieve/v1",
    },
    member: {
        list    : URL_MEMBER+"/amala/member/profile/v4.0/retrieve",
        profile : URL_MEMBER+"/amala/member/profile/v4.0/profile",
        update  : URL_MEMBER+"/amala/member/profile/v4.0/update"
    },
    memberaddress: {
        create  : URL_MEMBER+"/amala/member/memberaddress/v4.0/create",
        update  : URL_MEMBER+"/amala/member/memberaddress/v4.0/update"
    },
    memberhobbies: {
        create  : URL_MEMBER+"/amala/member/hobbies/v4.0/create"
    },
    membertier: {
        list                : URL_MEMBER+"/amala/member/membertier/v4.0/retrieve",
        detail              : URL_MEMBER+"/amala/member/membertier/v4.0/retrievedetail/v1",
        create              : URL_MEMBER+"/amala/member/membertier/v4.0/createdata",
        update              : URL_MEMBER+"/amala/member/membertier/v4.0/updatedata",
        createintegration   : URL_MEMBER+"/amala/member/membertier/integration/v4.0/create",
        updateintegration   : URL_MEMBER+"/amala/member/membertier/integration/v4.0/update",
        delete              : URL_MEMBER+"/amala/member/membertier/v4.0/delete",
        activate            : URL_MEMBER+"/amala/member/membertier/v4.0/activate",
        deactivate          : URL_MEMBER+"/amala/member/membertier/v4.0/deactivate"
    },
    membertransaction: {
        list                : URL_MEMBER+"/amala/member/transaction/v4.1/retrieve",
        create              : URL_MEMBER+"/lms/member/transaction/create/v1",
        earningcorrection   : URL_MEMBER+"/amala/accrual/transaction/earningcorrection/v4.0/earningcorrection"
    },
    membercobran: {
        list    : URL_MEMBER+"/amala/member/membercobrand/v4.0/retrieve",
        create  : URL_MEMBER+"/amala/member/membercobrand/v4.0/create",
        detail  : URL_MEMBER+"/amala/member/membercobrand/v4.0/retrievedetail",
        update  : URL_MEMBER+"/amala/member/membercobrand/v4.0/update",
    },
    membercontact: {
        list    : URL_MEMBER+"/amala/member/memberphone/v4.0/retrieve",
        create  : URL_MEMBER+"/amala/member/memberphone/v4.0/create",
        detail  : URL_MEMBER+"/amala/member/memberphone/v4.0/retrievedetail",
        update  : URL_MEMBER+"/amala/member/memberphone/v4.0/update",
        delete  : URL_MEMBER+"/amala/member/memberphone/v4.0/delete"
    },
    memberactivity:{
        // list    : URL_MEMBER+"/lms/member/activity/retrieve/v1",
        list    : URL_ACTIVITY+"/amala/member/activity/v4.0/retrieve",
        detail  : URL_ACTIVITY+"/amala/member/activity/v4.0/retrievedetail",
        getinvalidnamechecklist : URL_ACTIVITY+"/amala/member/activity/v4.0/getinvalidnamechecklist"
    },
    memberairactivity: {
        create              : URL_ACTIVITY_AIR_INTEGRATION+"/amala/member/activity/air/validate/v4.0/create",
        detail              : URL_ACTIVITY+"/amala/member/activity/v4.0/retrievedetail",
        update              : URL_ACTIVITY+"/amala/member/airactivity/v4.0/update",
        delete              : URL_ACTIVITY+"/amala/member/airactivity/v4.0/delete",
        createwithrating    : URL_ACTIVITYAIRRATING+"/amala/member/activity/air/withrating/v4.0/create",
        updatewithrating    : URL_ACTIVITYAIRRATING+"/amala/member/activity/air/withrating/v4.0/update",
        cancelwithrating    : URL_ACTIVITYAIRRATING+"/amala/member/activity/air/withrating/v4.0/cancel"
        
    },
    membernonairactivity: {
        create              : URL_ACTIVITY_NONAIR_INTEGRATION+"/amala/member/activity/nonair/validate/v4.0/create",
        detail              : URL_ACTIVITY+"/amala/member/activity/v4.0/retrievedetail",
        update              : URL_ACTIVITY+"/amala/member/nonairactivity/v4.0/update",
        delete              : URL_ACTIVITY+"/amala/member/nonairactivity/v4.0/delete",
        createwithrating    : URL_ACTIVITYNONAIRRATING+"/amala/member/activity/nonair/withrating/v4.0/create",
        updatewithrating    : URL_ACTIVITYNONAIRRATING+"/amala/member/activity/nonair/withrating/v4.0/update",
        cancelwithrating    : URL_ACTIVITYAIRRATING+"/amala/member/activity/nonair/withrating/v4.0/cancel"
    },
    tierrank: {
        create  : URL_TIER+"/amala/tier/tierrank/v4.0/create",
        list    : URL_TIER+"/amala/tier/tierrank/v4.0/retrieve"
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
        list                : URL_MEMBER+"/amala/member/card/v4.0/retrieve",
        create              : URL_MEMBER+"/lms/member/card/create/v2",
        detail              : URL_MEMBER+"/amala/member/card/v4.0/retrievedetail",
        update              : URL_MEMBER+"/lms/member/card/update/v2",
        delete              : URL_MEMBER+"/lms/member/card/delete/v2",
        changedate          : URL_MEMBER+"/amala/member/card/v4.0/changedate",
        buycard             : URL_MEMBER+ "/amala/member/card/v4.0/buycard",
        reorder             : URL_REORDER+"/amala/member/card/v4.0/reordercard",
        blacklist           : URL_MEMBER+"/amala/member/card/v4.0/blacklist",
        blacklistreorder    : URL_MEMBER+"/amala/member/card/v4.0/blacklistreordercard"
    },
    citypairrange : {
        create  : URL_MASTER+"/lms/master/distancerange/citypairrange/create/v2",
        list    : URL_MASTER+"/lms/master/distancerange/citypairrange/retrieve/v2",
        detail  : URL_MASTER+"/lms/master/distancerange/citypairrange/retrievedetail/v2",
        update  : URL_MASTER+"/lms/master/distancerange/citypairrange/update/v2",
        delete  : URL_MASTER+"/lms/master/distancerange/citypairrange/delete/v2"
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
        create  : URL_AWARD+"/amala/award/pricederived/v4.0/create",
        update  : URL_AWARD+"/amala/award/pricederived/v4.0/update",
        list    : URL_AWARD+"/amala/award/pricederived/v4.0/retrieve",
        detail  : URL_AWARD+"/amala/award/pricederived/v4.0/retrievedetail",
        delete  : URL_AWARD+"/amala/award/pricederived/v4.0/delete",
    },
    enrollment: {
        enroll :  URL_ENROLLMENT+"/amala/membermanagement/member/v4.0/enrollment",
        // enroll :  URL_ENROLLMENT
    },
    awardcancelupdate: {
        detail  : URL_AWARD+"/lms/award/cancelupdate/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/cancelupdate/update/v2"
    },
    certificatetextid: {
        detail    : URL_AWARD+"/lms/award/certificateid/retrievedetail/v1",
        update  : URL_AWARD+"/lms/award/certificateid/update/v1"
    },
    awardvouchertext: {
        create      : URL_AWARD+"/amala/award/voucher/v4.0/create",
        list        : URL_AWARD+"/amala/award/voucher/v4.0/retrieve",
        detail      : URL_AWARD+"/amala/award/voucher/v4.0/retrievedetail",
        update      : URL_AWARD+"/amala/award/voucher/v4.0/update",
        delete      : URL_AWARD+"/amala/award/voucher/v4.0/delete",
        activate    : URL_MASTER+"/amala/award/voucher/v4.0/activate",
        deactivate  : URL_MASTER+"/amala/award/voucher/v4.0/deactivate"
    },
    awardstatus: {
        detail  : URL_AWARD+"/lms/award/componentstatus/retrievedetail/v2",
        update  : URL_AWARD+"/lms/award/componentstatus/update/v2"
    },
    transaction:{
        earning     : URL_TRANSACTION+ "/amala/member/transaction/earning/v4.0/earning",
        spending    : URL_TRANSACTION_SPENDING+ "/amala/member/transaction/spending/v4.0/spending",
        rating      : URL_RATING+"/amala/accrual/rating/v4.0/rate"
    },
    redemptioncertificate: {
        create  : URL_REDEMPTION+"/lms/redemption/certificate/create/v1",
        list    : URL_REDEMPTION+"/amala/redemption/certificate/v4.0/retrieve",
        detail  : URL_REDEMPTION+"/amala/redemption/certificate/v4.0/retrievedetail",
        cancel  : URL_REDEMPTION+"/amala/redemption/cancelaward/v4.0/cancel",
        update  : URL_REDEMPTION+"/amala/redemption/updateaward/v4.0/update"
    },
    memberreceipt: {
        list    : URL_RECEIPT+"/amala/accrual/receipt/v4.0/retrieve"
    },
    activation: {
        activation : URL_ACTIVATION+"/amala/enroll/activation/v4.0/activate",
        generatekey : URL_ACTIVATION+"/amala/enroll/activation/v4.0/link",
        resendemail : URL_ACTIVATION+"/amala/enroll/activation/v4.0/activationmail"
    },
    user:{
        create  : URL_USER+"/amala/user/user/v4.0/create",
        update  : URL_USER+"/amala/user/user/v4.0/update",
        list    : URL_USER+"/amala/user/user/v4.0/retrieve",
        delete  : URL_USER+"/amala/user/user/v4.0/delete",
        resetpassword  : URL_USER+"/amala/user/user/v4.0/resetpassword",
        changepassword : URL_USER+"/amala/user/user/v4.0/changepassword"
    },
    role: {
        create  : URL_USER+"/amala/user/role/v4.0/create",
        update  : URL_USER+"/amala/user/role/v4.0/update",
        delete  : URL_USER+"/amala/user/role/v4.0/delete",
        list    : URL_USER + "/amala/user/role/v4.0/retrieve",
        retrieveroledetail  : URL_USER + "/amala/user/role/v4.0/retrieveroledetail",
        setrolepermit       : URL_USER + "/amala/user/role/v4.0/setrolepermit",
        getmenu        		: URL_USER + "/amala/user/menu/v5/menu/getmenu"
    },
    communication: {
        create  : URL_COMMUNICATION+"/amala/communication/v4.0/create",
        list    : URL_COMMUNICATION+"/amala/communication/v4.0/retrieve",
        detail  : URL_COMMUNICATION+"/amala/communication/v4.0/retrievedetail",
        update  : URL_COMMUNICATION+"/amala/communication/v4.0/update",
        delete  : URL_COMMUNICATION+"/amala/communication/v4.0/delete",
        activate    : URL_COMMUNICATION+"/amala/communication/v4.0/activate",
        deactivate  : URL_COMMUNICATION+"/amala/communication/v4.0/deactivate"
    },
    sessionmanagement:{
        login   : URL_SESSION+"/amala/user/session/v4.0/login",
        expire  : URL_SESSION+"/amala/user/session/v4.0/expire"
    },
    redemption: {
        eligibleredeem  : URL_ELIGIBLE_REDEEM + "/amala/redemption/eligiblestatus/v4.0/geteligiblestatus",
        buyaward        : URL_ELIGIBLE_BUYAWARD + "/amala/redemption/buyaward/v4.0/buy",
        getpricelist    : URL_GETPRICELIST + "/amala/redemption/v4.0/getpricelist"
    },
    awardlist: {
        getawardredeemlist  : URL_AWARD+"/amala/award/redeemlist/v4.0/getawardredeemlist",
    },
    retroclaim: {
        list                : URL_ACCRUAL+"/amala/accrual/retroclaim/v4.0/retrieve",
        listpendingapproval : URL_ACCRUAL+"/amala/accrual/retroclaim/v4.0/pendingapprovallist",
        reqinfohistory      : URL_ACCRUAL+"/amala/accrual/retroclaim/v4.0/reqinfohistory",
        updatereqinfo       : URL_ACCRUAL+"/amala/accrual/retroclaim/v4.0/updatereqinfo",
        retroclaimga        : URL_RETRO+"/amala/accrual/retro/claim/v4.0/retroclaimga",
        retroclaimqg        : URL_RETRO+"/amala/accrual/retro/claim/v4.0/retroclaimqg",
        retroclaimsj        : URL_RETRO+"/amala/accrual/retro/claim/v4.0/retroclaimsj",
        retroclaimskyteam   : URL_RETRO+"/amala/accrual/retro/claim/v4.0/retroclaimskyteam"
    },
    billing: {
        list    : URL_ACCRUAL+"/amala/accrual/billing/v4.0/retrieve",
        detail  : URL_ACCRUAL+"/amala/accrual/billing/v4.0/retrievedetail"
    },
    relationtype: {
        create  : URL_MASTER+"/amala/relation/relationtype/v4.0/create",
        list    : URL_MASTER+"/amala/relation/relationtype/v4.0/retrieve",
        update  : URL_MASTER+"/amala/relation/relationtype/v4.0/update"
    },
    tourcode: {
        create  : URL_MASTER+"/amala/corporate/tourcode/v4.0/create",
        list    : URL_MASTER+"/amala/corporate/tourcode/v4.0/retrieve"
    },
    memberrelation: {
        list      : URL_MASTER+"/amala/relation/memberrelation/v4.0/retrieve",
        update    : URL_MASTER+"/amala/relation/memberrelation/v4.0/update",
        activate  : URL_MASTER+"/amala/relation/memberrelation/v4.0/activate",
        deactivate: URL_MASTER+"/amala/relation/memberrelation/v4.0/deactivate",
        enroll    : URL_MASTER+"/amala/relation/v4.0/enrollmemberrelation"
    },
    membercorporate: {
        list      : URL_MASTER+"/amala/corporate/detailinfo/v4.0/retrieve",
        update    : URL_MASTER+"/amala/corporate/detailinfo/v4.0/update",
        activate  : URL_MASTER+"/amala/corporate/detailinfo/v4.0/activate",
        deactivate: URL_MASTER+"/amala/corporate/detailinfo/v4.0/deactivate"
    },
    mileageexpiry: {
        list     : URL_MASTER+"/amala/member/transaction/v4.1/retrievemileageexpiry"
    },
    suspectdup	: {
        check	: URL_MASTER + "/amala/enroll/suspectdupe/v4.0/check"

    },
    travelcoordinator: {
        create    : URL_MASTER+"/amala/member/travelcoordinator/v4.0/create",
        list      : URL_MASTER+"/amala/member/travelcoordinator/v4.0/retrieve",
        update    : URL_MASTER+"/amala/member/travelcoordinator/v4.0/update",
        activate  : URL_MASTER+"/amala/member/travelcoordinator/v4.0/activate",
        deactivate: URL_MASTER+"/amala/member/travelcoordinator/v4.0/deactivate"
    }
}