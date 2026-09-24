export const buildApiUrls = (URL_SERVICE) => ({
    wso: {
        login: URL_SERVICE + "/api/login/v1.0/login"
    },
    region: {
        list: URL_SERVICE + "/amala/master/location/v1.2/region/retrieve",
        create: URL_SERVICE + "/amala/master/location/v1.2/region/create",
        detail: URL_SERVICE + "/amala/master/location/v1.2/region/retrievedetail",
        update: URL_SERVICE + "/amala/master/location/v1.2/region/update",
        delete: URL_SERVICE + "/amala/master/location/v1.2/region/delete",
        activate: URL_SERVICE + "/amala/master/location/v1.2/region/activate",
        deactivate: URL_SERVICE + "/amala/master/location/v1.2/region/deactivate"
    },
    country: {
        create: URL_SERVICE + "/amala/master/location/v1.2/country/create",
        list: URL_SERVICE + "/amala/master/location/v1.2/country/retrieve",
        detail: URL_SERVICE + "/amala/master/location/v1.2/country/retrievedetail",
        update: URL_SERVICE + "/amala/master/location/v1.2/country/update",
        delete: URL_SERVICE + "/amala/master/location/v1.2/country/delete",
        activate: URL_SERVICE + "/amala/master/location/v1.2/country/activate",
        deactivate: URL_SERVICE + "/amala/master/location/v1.2/country/deactivate"
    },
    state: {
        create: URL_SERVICE + "/amala/master/location/v1.2/state/create",
        list: URL_SERVICE + "/amala/master/location/v1.2/state/retrieve",
        detail: URL_SERVICE + "/amala/master/location/v1.2/state/retrievedetail",
        update: URL_SERVICE + "/amala/master/location/v1.2/state/update",
        delete: URL_SERVICE + "/amala/master/location/v1.2/state/delete",
        activate: URL_SERVICE + "/amala/master/location/v1.2/state/activate",
        deactivate: URL_SERVICE + "/amala/master/location/v1.2/state/deactivate"
    },
    city: {
        create: URL_SERVICE + "/amala/master/location/v1.2/city/create",
        list: URL_SERVICE + "/amala/master/location/v1.2/city/retrieve",
        detail: URL_SERVICE + "/amala/master/location/v1.2/city/retrievedetail",
        update: URL_SERVICE + "/amala/master/location/v1.2/city/update",
        delete: URL_SERVICE + "/amala/master/location/v1.2/city/delete",
        activate: URL_SERVICE + "/amala/master/location/v1.2/city/activate",
        deactivate: URL_SERVICE + "/amala/master/location/v1.2/city/deactivate"
    },
    airport: {
        create: URL_SERVICE + "/amala/master/location/v1.2/airport/create",
        list: URL_SERVICE + "/amala/master/location/v1.2/airport/retrieve",
        detail: URL_SERVICE + "/amala/master/location/v1.2/airport/retrievedetail",
        update: URL_SERVICE + "/amala/master/location/v1.2/airport/update",
        delete: URL_SERVICE + "/amala/master/location/v1.2/airport/delete",
        activate: URL_SERVICE + "/amala/master/location/v1.2/airport/activate",
        deactivate: URL_SERVICE + "/amala/master/location/v1.2/airport/deactivate"
    },
    currency: {
        create: URL_SERVICE + "/amala/master/general/v1.2/currency/create",
        list: URL_SERVICE + "/amala/master/general/v1.2/currency/retrieve",
        detail: URL_SERVICE + "/amala/master/general/v1.2/currency/retrievedetail",
        update: URL_SERVICE + "/amala/master/general/v1.2/currency/update",
        delete: URL_SERVICE + "/amala/master/general/v1.2/currency/delete",
        activate: URL_SERVICE + "/amala/master/general/v1.2/currency/activate",
        deactivate: URL_SERVICE + "/amala/master/general/v1.2/currency/deactivate"
    },
    generalconfig: {
        create: URL_SERVICE + "/amala/master/general/v1.2/generalconfig/create",
        list: URL_SERVICE + "/amala/master/general/v1.2/generalconfig/retrieve",
        update: URL_SERVICE + "/amala/master/general/v1.2/generalconfig/update",
        delete: URL_SERVICE + "/amala/master/general/v1.2/generalconfig/delete",
        activate: URL_SERVICE + "/amala/master/general/v1.2/generalconfig/activate",
        deactivate: URL_SERVICE + "/amala/master/general/v1.2/generalconfig/deactivate"
    },
    title: {
        create: URL_SERVICE + "/amala/master/general/v1.2/title/create",
        list: URL_SERVICE + "/amala/master/general/v1.2/title/retrieve",
        detail: URL_SERVICE + "/amala/master/general/v1.2/title/retrievedetail",
        update: URL_SERVICE + "/amala/master/general/v1.2/title/update",
        delete: URL_SERVICE + "/amala/master/general/v1.2/title/delete",
        activate: URL_SERVICE + "/amala/master/general/v1.2/title/activate",
        deactivate: URL_SERVICE + "/amala/master/general/v1.2/title/deactivate"
    },
    salutation: {
        create: URL_SERVICE + "/amala/master/general/v1.2/salutation/create",
        list: URL_SERVICE + "/amala/master/general/v1.2/salutation/retrieve",
        detail: URL_SERVICE + "/amala/master/general/v1.2/salutation/retrievedetail",
        update: URL_SERVICE + "/amala/master/general/v1.2/salutation/update",
        delete: URL_SERVICE + "/amala/master/general/v1.2/salutation/delete",
        setdefault: URL_SERVICE + "/amala/master/general/v1.2/salutation/setdefault",
        activate: URL_SERVICE + "/amala/master/general/v1.2/salutation/activate",
        deactivate: URL_SERVICE + "/amala/master/general/v1.2/salutation/deactivate"
    },
    language: {
        create: URL_SERVICE + "/amala/master/general/v1.2/language/create",
        list: URL_SERVICE + "/amala/master/general/v1.2/language/retrieve",
        detail: URL_SERVICE + "/amala/master/general/v1.2/language/retrievedetail",
        update: URL_SERVICE + "/amala/master/general/v1.2/language/update",
        delete: URL_SERVICE + "/amala/master/general/v1.2/language/delete",
        activate: URL_SERVICE + "/amala/master/general/v1.2/language/activate",
        deactivate: URL_SERVICE + "/amala/master/general/v1.2/language/deactivate"
    },
    religion: {
        create: URL_SERVICE + "/amala/member/profile/v1.2/religion/create",
        list: URL_SERVICE + "/amala/member/profile/v1.2/religion/retrieve",
        detail: URL_SERVICE + "/amala/member/profile/v1.2/religion/retrievedetail",
        update: URL_SERVICE + "/amala/member/profile/v1.2/religion/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/religion/delete",
        activate: URL_SERVICE + "/amala/member/profile/v1.2/religion/activate",
        deactivate: URL_SERVICE + "/amala/member/profile/v1.2/religion/deactivate"
    },
    hobbies: {
        create: URL_SERVICE + "/amala/member/profile/v1.2/hobbies/create",
        list: URL_SERVICE + "/amala/member/profile/v1.2/hobbies/retrieve",
        detail: URL_SERVICE + "/amala/member/profile/v1.2/hobbies/retrievedetail",
        update: URL_SERVICE + "/amala/member/profile/v1.2/hobbies/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/hobbies/delete",
        activate: URL_SERVICE + "/amala/member/profile/v1.2/hobbies/activate",
        deactivate: URL_SERVICE + "/amala/member/profile/v1.2/hobbies/deactivate"
    },
    citypair: {
        create: URL_SERVICE + "/amala/master/citypair/v4.0/create",
        list: URL_SERVICE + "/amala/master/citypair/v4.0/retrieve",
        detail: URL_SERVICE + "/amala/master/citypair/v4.0/retrievedetail",
        update: URL_SERVICE + "/amala/master/citypair/v4.0/update",
        delete: URL_SERVICE + "/amala/master/citypair/v4.0/delete",
        activate: URL_SERVICE + "/amala/master/citypair/v4.0/activate",
        deactivate: URL_SERVICE + "/amala/master/citypair/v4.0/deactivate",
        addnew: URL_SERVICE + "/amala/master/citypair/v4.0/addnew",
        remove: URL_SERVICE + "/amala/master/citypair/v4.0/remove"
    },
    airline: {
        create: URL_SERVICE + "/amala/partner/v1.2/airline/create",
        list: URL_SERVICE + "/amala/partner/v1.2/airline/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/airline/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/airline/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/airline/delete",
        activate: URL_SERVICE + "/amala/partner/v1.2/airline/activate",
        deactivate: URL_SERVICE + "/amala/partner/v1.2/airline/deactivate"
    },
    branch: {
        create: URL_SERVICE + "/amala/branch/v1.2/branch/create",
        list: URL_SERVICE + "/amala/branch/v1.2/branch/retrieve",
        detail: URL_SERVICE + "/amala/branch/v1.2/branch/retrievedetail",
        update: URL_SERVICE + "/amala/branch/v1.2/branch/update",
        delete: URL_SERVICE + "/amala/branch/v1.2/branch/delete",
        activate: URL_SERVICE + "/amala/branch/v1.2/branch/activate",
        deactivate: URL_SERVICE + "/amala/branch/v1.2/branch/deactivate"
    },
    brancharea: {
        create: URL_SERVICE + "/amala/branch/v1.2/brancharea/create",
        list: URL_SERVICE + "/amala/branch/v1.2/brancharea/retrieve",
        detail: URL_SERVICE + "/amala/branch/v1.2/brancharea/retrievedetail",
        update: URL_SERVICE + "/amala/branch/v1.2/brancharea/update",
        delete: URL_SERVICE + "/amala/branch/v1.2/brancharea/delete",
        getbranchfromarea: URL_SERVICE + "/amala/branch/v1.2/brancharea/getbranchfromarea",
        activate: URL_SERVICE + "/amala/branch/v1.2/branch/activate",
        deactivate: URL_SERVICE + "/amala/branch/v1.2/branch/deactivate"
    },
    ticketoffice: {
        create: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/create",
        list: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/retrieve",
        detail: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/retrievedetail",
        update: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/update",
        delete: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/delete",
        getticket: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/getticketoffice",
        activate: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/activate",
        deactivate: URL_SERVICE + "/amala/branch/v1.2/ticketoffice/deactivate"
    },
    tierreason: {
        create: URL_SERVICE + "/amala/tier/v1.2/reason/create",
        list: URL_SERVICE + "/amala/tier/v1.2/reason/retrieve",
        detail: URL_SERVICE + "/amala/tier/v1.2/reason/retrievedetail",
        update: URL_SERVICE + "/amala/tier/v1.2/reason/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/reason/delete"
    },
    partner: {
        create: URL_SERVICE + "/amala/partner/v1.2/partner/create",
        list: URL_SERVICE + "/amala/partner/v1.2/partner/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/partner/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/partner/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/partner/delete",
        getall: URL_SERVICE + "/amala/partner/v1.2/partner/getpartner",
        activate: URL_SERVICE + "/amala/partner/v1.2/partner/activate",
        deactivate: URL_SERVICE + "/amala/partner/v1.2/partner/deactivate"
    },
    partnerlocation: {
        create: URL_SERVICE + "/amala/partner/v1.2/partnerlocation/create",
        list: URL_SERVICE + "/amala/partner/v1.2/partnerlocation/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/partnerlocation/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/partnerlocation/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/partnerlocation/delete",
        getall: URL_SERVICE + "/amala/partner/v1.2/partnerlocation/getpartnerlocation"
    },
    compartment: {
        create: URL_SERVICE + "/amala/partner/v1.2/compartment/create",
        list: URL_SERVICE + "/amala/partner/v1.2/compartment/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/compartment/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/compartment/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/compartment/delete"
    },
    subclass: {
        create: URL_SERVICE + "/amala/partner/v1.2/subclass/create",
        list: URL_SERVICE + "/amala/partner/v1.2/subclass/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/subclass/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/subclass/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/subclass/delete"
    },
    subclassmapping: {
        create: URL_SERVICE + "/amala/partner/v1.2/subclassmapping/create",
        list: URL_SERVICE + "/amala/partner/v1.2/subclassmapping/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/subclassmapping/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/subclassmapping/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/subclassmapping/delete"
    },
    flightschedule: {
        create: URL_SERVICE + "/amala/partner/v1.2/flightschedule/create",
        list: URL_SERVICE + "/amala/partner/v1.2/flightschedule/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/flightschedule/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/flightschedule/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/flightschedule/delete",
        activate: URL_SERVICE + "/amala/partner/v1.2/flightschedule/activate",
        deactivate: URL_SERVICE + "/amala/partner/v1.2/flightschedule/deactivate"
    },
    program: {
        create: URL_SERVICE + "/amala/partner/v1.2/program/create",
        list: URL_SERVICE + "/amala/partner/v1.2/program/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/program/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/program/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/program/delete",
        getprogram: URL_SERVICE + "/amala/partner/v1.2/program/getprogram"
    },
    receiptcatalogue: {
        create: URL_SERVICE + "/amala/accrual/catalog/v1.2/receiptcatalogue/create",
        list: URL_SERVICE + "/amala/accrual/catalog/v1.2/receiptcatalogue/retrieve",
        update: URL_SERVICE + "/amala/accrual/catalog/v1.2/receiptcatalogue/update",
        detail: URL_SERVICE + "/amala/accrual/catalog/v1.2/receiptcatalogue/retrievedetail",
        delete: URL_SERVICE + "/amala/accrual/catalog/v1.2/receiptcatalogue/delete",
    },
    distancerange: {
        create: URL_SERVICE + "/amala/award/config/v1.2/distancerange/create",
        list: URL_SERVICE + "/amala/accrual/rule/v1.2/citypair/retrieve",
        retrieve: URL_SERVICE + "/amala/award/config/v1.2/distancerange/retrieve",
        detail: URL_SERVICE + "/amala/award/config/v1.2/distancerange/retrievedetail",
        update: URL_SERVICE + "/amala/award/config/v1.2/distancerange/update",
        delete: URL_SERVICE + "/amala/award/config/v1.2/distancerange/delete",
        activate: URL_SERVICE + "/amala/award/config/v1.2/distancerange/activate",
        deactivate: URL_SERVICE + "/amala/award/config/v1.2/distancerange/deactivate"
    },
    membershiptype: {
        create: URL_SERVICE + "/amala/tier/v1.2/membershiptype/create",
        list: URL_SERVICE + "/amala/tier/v1.2/membershiptype/retrieve",
        detail: URL_SERVICE + "/amala/tier/v1.2/membershiptype/retrievedetail",
        update: URL_SERVICE + "/amala/tier/v1.2/membershiptype/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/membershiptype/delete"
    },
    membership: {
        create: URL_SERVICE + "/amala/tier/v1.2/membership/create",
        list: URL_SERVICE + "/amala/tier/v1.2/membership/retrieve",
        detail: URL_SERVICE + "/amala/tier/v1.2/membership/retrievedetail",
        update: URL_SERVICE + "/amala/tier/v1.2/membership/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/membership/delete",
        qualification: {
            list: URL_SERVICE + "/amala/tier/v1.2/membership/qualification/retrieve",
            create: URL_SERVICE + "/amala/tier/v1.2/membership/qualification/create",
            delete: URL_SERVICE + "/amala/tier/v1.2/membership/qualification/delete",
            update: URL_SERVICE + "/amala/tier/v1.2/membership/qualification/update",
        }
    },
    tier: {
        create: URL_SERVICE + "/amala/tier/v1.2/tier/create",
        list: URL_SERVICE + "/amala/tier/v1.2/tier/retrieve",
        detail: URL_SERVICE + "/amala/tier/v1.2/tier/retrievedetail",
        update: URL_SERVICE + "/amala/tier/v1.2/tier/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/tier/delete"
    },
    tierduration: {
        create: URL_SERVICE + "/amala/tier/v1.2/duration/create",
        createbulk: URL_SERVICE + "/amala/tier/v1.2/duration/createbulk",
        list: URL_SERVICE + "/amala/tier/v1.2/duration/retrieve",
        detail: URL_SERVICE + "/amala/tier/v1.2/duration/retrievedetail",
        update: URL_SERVICE + "/amala/tier/v1.2/duration/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/duration/delete"
    },
    mileagecriteria: {
        create: URL_SERVICE + "/amala/tier/v1.2/mileagecriteria/create",
        list: URL_SERVICE + "/amala/tier/v1.2/mileagecriteria/retrieve",
        detail: URL_SERVICE + "/amala/tier/v1.2/mileagecriteria/retrievedetail",
        update: URL_SERVICE + "/amala/tier/v1.2/mileagecriteria/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/mileagecriteria/delete"
    },
    awardtype: {
        create: URL_SERVICE + "/amala/award/config/v1.2/type/create",
        list: URL_SERVICE + "/amala/award/config/v1.2/type/retrieveawardtype",
        update: URL_SERVICE + "/amala/award/config/v1.2/type/update",
        delete: URL_SERVICE + "/amala/award/config/v1.2/type/delete",
        categorytype: URL_SERVICE + "/amala/award/config/v1.2/type/retrievecategorytype",
        category: URL_SERVICE + "/amala/award/config/v1.2/type/retrievecategory"
    },
    blackout: {
        create: URL_SERVICE + "/amala/award/period/v1.2/blackout/create",
        list: URL_SERVICE + "/amala/award/period/v1.2/blackout/retrieve",
        detail: URL_SERVICE + "/amala/award/period/v1.2/blackout/retrievedetail",
        update: URL_SERVICE + "/amala/award/period/v1.2/blackout/update",
        delete: URL_SERVICE + "/amala/award/period/v1.2/blackout/delete",
        activate: URL_SERVICE + "/amala/award/period/v1.2/blackout/activate",
        deactivate: URL_SERVICE + "/amala/award/period/v1.2/blackout/deactivate"
    },
    statement: {
        create: URL_SERVICE + "/amala/master/statement/v1.2/statement/create",
        list: URL_SERVICE + "/amala/master/statement/v1.2/statement/retrieve",
        detail: URL_SERVICE + "/amala/master/statement/v1.2/statement/retrievedetail",
        update: URL_SERVICE + "/amala/master/statement/v1.2/statement/update",
        delete: URL_SERVICE + "/amala/master/statement/v1.2/statement/delete",
        activate: URL_SERVICE + "/amala/master/statement/v1.2/statement/activate",
        deactivate: URL_SERVICE + "/amala/master/statement/v1.2/statement/deactivate",
        variable: URL_SERVICE + "/amala/master/statement/v1.2/variable/retrieve",
    },
    statementtext: {
        create: URL_SERVICE + "/amala/master/statement/v1.2/statementtext/create",
        list: URL_SERVICE + "/amala/master/statement/v1.2/statementtext/retrieve",
        detail: URL_SERVICE + "/amala/master/statement/v1.2/statementtext/retrievedetail",
        update: URL_SERVICE + "/amala/master/statement/v1.2/statementtext/update",
        delete: URL_SERVICE + "/amala/master/statement/v1.2/statementtext/delete",
    },
    channel: {
        list: URL_SERVICE + "/amala/master/general/v1.2/channel/retrieve",
        updatechannel: {
            list: URL_SERVICE + "/amala/master/general/v1.2/generalconfig/retrieve"
        },
        application: {
            list: URL_SERVICE + "/amala/master/general/v1.2/channel/application/retrieve"
        }
    },
    awardmaster: {
        create: URL_SERVICE + "/amala/award/config/v1.2/master/create",
        list: URL_SERVICE + "/amala/award/config/v1.2/master/retrieve",
        detailbasicinfo: URL_SERVICE + "/amala/award/config/v1.2/master/retrievedetailbasicinfo",
        update: URL_SERVICE + "/amala/award/config/v1.2/master/updatebasicinfo",
        detailpartner: URL_SERVICE + "/amala/award/config/v1.2/master/retrievedetailpartner",
        updatepartner: URL_SERVICE + "/amala/award/config/v1.2/master/updatepartner",
        detailcancelupdate: URL_SERVICE + "/amala/award/config/v1.2/master/retrievecancelupdaterule",
        updatecancelupdate: URL_SERVICE + "/amala/award/config/v1.2/master/updatecancelupdaterule",
        detailcertificate: URL_SERVICE + "/amala/award/config/v1.2/master/retrievecertificate",
        updatecertificate: URL_SERVICE + "/amala/award/config/v1.2/master/updatecertificate",
        detailstatus: URL_SERVICE + "/amala/award/config/v1.2/master/retrievedetailstatus",
        activatestatus: URL_SERVICE + "/amala/award/config/v1.2/master/activation",
        terminatestatus: URL_SERVICE + "/amala/award/config/v1.2/master/terminate",
        detailfixedprice: URL_SERVICE + "/amala/award/config/v1.2/master/retrievefixedprice",
        updatefixedprice: URL_SERVICE + "/amala/award/config/v1.2/master/updatefixedprice",
        retrievecancelupdate: URL_SERVICE + "/amala/award/config/v1.2/master/retrievecancelupdaterule"
    },
    awardeligiblecountries: {
        list: URL_SERVICE + "/amala/award/config/v1.2/eligiblecountries/retrieve",
        update: URL_SERVICE + "/amala/award/config/v1.2/eligiblecountries/update"
    },
    awardeligibletiers: {
        list: URL_SERVICE + "/amala/award/config/v1.2/eligibletiers/retrieve",
        update: URL_SERVICE + "/amala/award/config/v1.2/eligibletiers/update"
    },
    awardeligiblebranch: {
        list: URL_SERVICE + "/amala/award/config/v1.2/eligiblebranch/retrieve",
        update: URL_SERVICE + "/amala/award/config/v1.2/eligiblebranch/update"
    },
    partnercobrand: {
        create: URL_SERVICE + "/amala/partner/v1.2/cobrand/create",
        list: URL_SERVICE + "/amala/partner/v1.2/cobrand/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/cobrand/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/cobrand/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/cobrand/delete",
        activate: URL_SERVICE + "/amala/partner/v1.2/cobrand/activate",
        deactivate: URL_SERVICE + "/amala/partner/v1.2/cobrand/deactivate"
    },
    cobrandbonus: {
        create: URL_SERVICE + "/amala/partner/v1.2/cobrandbonus/create",
        list: URL_SERVICE + "/amala/partner/v1.2/cobrandbonus/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/cobrandbonus/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/cobrandbonus/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/cobrandbonus/delete",
        activate: URL_SERVICE + "/amala/partner/v1.2/cobrandbonus/activate",
        deactivate: URL_SERVICE + "/amala/partner/v1.2/cobrandbonus/deactivate"
    },
    activitycode: {
        create: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/create",
        list: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/retrieve",
        detail: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/retrievedetail",
        update: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/update",
        delete: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/delete",
        getall: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/getactivitycode",
        activate: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/activate",
        deactivate: URL_SERVICE + "/amala/accrual/catalog/v1.2/activitycode/deactivate",
        limit: {
            create: URL_SERVICE + "/amala/accrual/activity/limit/v1.2/create",
            update: URL_SERVICE + "/amala/accrual/activity/limit/v1.2/update",
            list: URL_SERVICE + "/amala/accrual/activity/limit/v1.2/retrieve",
            delete: URL_SERVICE + "/amala/accrual/activity/limit/v1.2/delete",
            activate: URL_SERVICE + "/amala/accrual/activity/limit/v1.2/activate",
            deactivate: URL_SERVICE + "/amala/accrual/activity/limit/v1.2/deactivate",
        }
    },
    codeshare: {
        create: URL_SERVICE + "/amala/partner/v1.2/codesharelist/create",
        list: URL_SERVICE + "/amala/partner/v1.2/codesharelist/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/codesharelist/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/codesharelist/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/codesharelist/delete",
        activate: URL_SERVICE + "/amala/partner/v1.2/codesharelist/activate",
        deactivate: URL_SERVICE + "/amala/partner/v1.2/codesharelist/deactivate",
        getcodesharebyairline: URL_SERVICE + "/amala/partner/v1.2/codesharelist/getcodesharebyairline",
    },
    peakseason: {
        create: URL_SERVICE + "/amala/award/period/v1.2/peakseason/create",
        list: URL_SERVICE + "/amala/award/period/v1.2/peakseason/retrieve",
        detail: URL_SERVICE + "/amala/award/period/v1.2/peakseason/retrievedetail",
        update: URL_SERVICE + "/amala/award/period/v1.2/peakseason/update",
        delete: URL_SERVICE + "/amala/award/period/v1.2/peakseason/delete",
        activate: URL_SERVICE + "/amala/award/period/v1.2/peakseason/activate",
        deactivate: URL_SERVICE + "/amala/award/period/v1.2/peakseason/deactivate"
    },
    earningmiles: {
        create: URL_SERVICE + "/amala/partner/v1.2/earningmiles/create",
        list: URL_SERVICE + "/amala/partner/v1.2/earningmiles/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/earningmiles/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/earningmiles/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/earningmiles/delete",
        activate: URL_SERVICE + "/amala/partner/v1.2/earningmiles/activate",
        deactivate: URL_SERVICE + "/amala/partner/v1.2/earningmiles/deactivate"
    },
    parkactivity: {
        create: URL_SERVICE + "/amala/accrual/parkactivity/v1.2/create",
        list: URL_SERVICE + "/amala/accrual/parkactivity/v1.2/retrieve",
        delete: URL_SERVICE + "/amala/accrual/parkactivity/v1.2/delete"
    },
    customtransaction: {
        create: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransaction/create",
        list: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransaction/retrieve",
        update: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransaction/update",
        delete: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransaction/delete",
    },
    customtransactionrole: {
        create: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransactionbyrole/create",
        list: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransactionbyrole/retrieve",
        delete: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransactionbyrole/delete",
        activate: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransactionbyrole/activate",
        deactivate: URL_SERVICE + "/amala/accrual/catalog/v1.2/customtransactionbyrole/deactivate",
    },
    mailingset: {
        create: URL_SERVICE + "/amala/mailing/mailingset/v4.0/create",
        list: URL_SERVICE + "/amala/mailing/mailingset/v4.0/retrieve",
        update: URL_SERVICE + "/amala/mailing/mailingset/v4.0/update",
        delete: URL_SERVICE + "/amala/mailing/mailingset/v4.0/delete"
    },
    mailing: {
        create: URL_SERVICE + "/amala/mailing/mailing/v4.0/create",
        list: URL_SERVICE + "/amala/mailing/mailing/v4.0/retrieve",
        update: URL_SERVICE + "/amala/mailing/mailing/v4.0/update",
        delete: URL_SERVICE + "/amala/mailing/mailing/v4.0/delete"
    },
    mailingitem: {
        create: URL_SERVICE + "/amala/mailing/mailingitem/v4.0/create",
        list: URL_SERVICE + "/amala/mailing/mailingitem/v4.0/retrieve",
        update: URL_SERVICE + "/amala/mailing/mailingitem/v4.0/update",
        delete: URL_SERVICE + "/amala/mailing/mailingitem/v4.0/delete"
    },
    enrollbonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/enrollbonus/create",
        list: URL_SERVICE + "/amala/tier/v1.2/enrollbonus/retrieve",
        update: URL_SERVICE + "/amala/tier/v1.2/enrollbonus/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/enrollbonus/delete"
    },
    activitybonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/activitybonus/create",
        list: URL_SERVICE + "/amala/tier/v1.2/activitybonus/retrieve",
        update: URL_SERVICE + "/amala/tier/v1.2/activitybonus/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/activitybonus/delete"
    },
    cardnumberissued: {
        create: URL_SERVICE + "/amala/cardinventory/v1.2/cardnumberissued/create",
        list: URL_SERVICE + "/amala/cardinventory/v1.2/cardnumberissued/retrieve",
        detail: URL_SERVICE + "/amala/cardinventory/v1.2/cardnumberissued/retrievedetail"
    },
    cardnumber: {
        cardnumberofuse: URL_SERVICE + "/amala/cardinventory/v1.2/cardnumber/cardnumberofuse",
        cardissuedreporting: URL_SERVICE + "/amala/cardinventory/v1.2/cardnumber/cardissuedreporting"
    },
    partnergroup: {
        create: URL_SERVICE + "/amala/partner/v1.2/partnergroup/create",
        list: URL_SERVICE + "/amala/partner/v1.2/partnergroup/retrieve",
        detail: URL_SERVICE + "/amala/partner/v1.2/partnergroup/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/partnergroup/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/partnergroup/delete",
        addpartner: URL_SERVICE + "/amala/partner/v1.2/partnergroup/addpartner",
        removepartner: URL_SERVICE + "/amala/partner/v1.2/partnergroup/removepartner"
    },
    accrualruleod: {
        create: URL_SERVICE + "/amala/accrual/rule/v1.2/origindestination/create",
        list: URL_SERVICE + "/amala/accrual/rule/v1.2/origindestination/retrieve",
        update: URL_SERVICE + "/amala/accrual/rule/v1.2/origindestination/update",
        delete: URL_SERVICE + "/amala/accrual/rule/v1.2/origindestination/delete",
        getcitypairbydistancerange: URL_SERVICE + "/amala/accrual/rule/v1.2/origindestination/getcitypairbydistancerange",
        getcitypairlist: URL_SERVICE + "/amala/accrual/rule/v1.2/origindestination/getcitypairlist"
    },
    accrualrulebc: {
        create: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/create",
        list: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/retrieve",
        update: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/updateheader",
        deleteheader: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/deleteheader",
        retrievebcrule: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/retrievebcrule",
        adddetail: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/adddetail",
        updatedetail: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/updatedetail",
        deletedetail: URL_SERVICE + "/amala/accrual/rule/v1.2/bookingclass/deletedetail",
    },
    accrualrulenonair: {
        create: URL_SERVICE + "/amala/accrual/rule/v1.2/nonair/create",
        list: URL_SERVICE + "/amala/accrual/rule/v1.2/nonair/retrieve",
        update: URL_SERVICE + "/amala/accrual/rule/v1.2/nonair/update",
        delete: URL_SERVICE + "/amala/accrual/rule/v1.2/nonair/delete"
    },
    accrualrulefare: {
        list      : URL_SERVICE+"/amala/accrual/rule/v1.2/farefamily/retrieve",
        create    : URL_SERVICE+"/amala/accrual/rule/v1.2/farefamily/create",
        update    : URL_SERVICE+"/amala/accrual/rule/v1.2/farefamily/update",
        delete    : URL_SERVICE+"/amala/accrual/rule/v1.2/farefamily/delete",
        activate    : URL_SERVICE+"/amala/accrual/rule/v1.2/farefamily/activate",
        deactivate    : URL_SERVICE+"/amala/accrual/rule/v1.2/farefamily/deactivate",
    },
    ruleset: {
        list: URL_SERVICE + "/lms/general/ruleset/retrieve/v1",
    },
    memberreferral: {
        getreferral: URL_SERVICE + "/amala/member/referral/v1.2/getreferral",
        generaterefcode: URL_SERVICE + "/amala/member/referral/v1.2/generaterefcode",
        viewreference: URL_SERVICE + "/amala/member/referral/v1.2/viewreference"
    },
    memberreferral: {
        getreferral: URL_SERVICE + "/amala/member/referral/v1.2/getreferral",
        generaterefcode: URL_SERVICE + "/amala/member/referral/v1.2/generaterefcode",
        viewreference: URL_SERVICE + "/amala/member/referral/v1.2/viewreference"
    },
    member: {
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/retrieve",
        profile: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/profile",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/update",
        updatewithotp: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/update/withotp",
        changepassword: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/changepassword",
        subscribe: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/subscribe",
        unsubscribe: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/unsubscribe",
        updatestatus: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/updatestatus",
        termination: URL_SERVICE + "/amala/agent/terminate/v1.2/termination",
        downloadcard: URL_SERVICE + "/amala/memberprofile/v1.2/downloadcard",
        sendverifyemail: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/send/verify/email-v2",
        verifyemail: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/verify/email",
        merging: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/merging",
        eligible: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/check/eligible",
        token: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/validate-token"
    },
    memberotp: {
        generate: URL_SERVICE + "/amala/otp/transaction/v1.2/generator",
        verification: URL_SERVICE + "/amala/otp/transaction/v1.2/verification",
        check: URL_SERVICE + "/amala/otp/transaction/v1.2/check",
        list: URL_SERVICE + "/amala/otp/data/v1.2/session/retrieve",
        generatetime: URL_SERVICE + "/amala/otp/data/v1.2/retrieve",
        create: URL_SERVICE + "/amala/otp/data/v1.2/session/create",
        update: URL_SERVICE + "/amala/otp/data/v1.2/session/update",
        updatewithotp: URL_SERVICE + "/amala/otp/data/v1.2/session/update/withotp",
        delete: URL_SERVICE + "/amala/otp/data/v1.2/session/delete",
        deletetime: URL_SERVICE + "/amala/otp/data/v1.2/delete",
        secondstimelimit: URL_SERVICE + "/amala/otp/data/v1.2/secondstimelimit",
        secondstimelimitses: URL_SERVICE + "/amala/otp/data/v1.2/session/secondstimelimit",
        updatestatus: URL_SERVICE + "/amala/member/profile/v1.2/memberprofile/updatestatus",
        sessioncheck: URL_SERVICE + "/amala/otp/transaction/v1.2/check",
        public: {
            secondstimelimit: URL_SERVICE + "/amala/otp/data/public/v1.2/secondstimelimit",
            verification: URL_SERVICE + "/amala/otp/transaction/public/v1.2/verification",
            updatewithotp: URL_SERVICE + "/amala/member/profile/public/v1.2/memberprofile/update/withotp",
        }
    },
    memberaddress: {
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberaddress/retrieve",
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberaddress/create",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberaddress/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/memberaddress/delete",
        setpreferred: URL_SERVICE + "/amala/member/profile/v1.2/memberaddress/setpreferred"
    },
    memberidentity: {
        retrieve: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/memberretrieve",
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/retrieve",
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/create",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/delete",
        verify: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/verifyidentity",
        reject: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/rejectidentity"

    },
    memberhobbies: {
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberhobbies/create",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberhobbies/update"
    },
    membertier: {
        list: URL_SERVICE + "/amala/member/tier/v1.2/retrieve",
        detail: URL_SERVICE + "/amala/member/tier/v1.2/retrievedetail",
        create: URL_SERVICE + "/amala/member/membertier/v4.0/createdata",
        update: URL_SERVICE + "/amala/member/membertier/v4.0/updatedata",
        createintegration: URL_SERVICE + "/amala/member/membertier/integration/v1.2/create",
        updateintegration: URL_SERVICE + "/amala/member/membertier/integration/v1.2/update",
        editintegration: URL_SERVICE + "/amala/member/membertier/integration/v1.2/edit",
        delete: URL_SERVICE + "/amala/member/membertier/v4.0/delete",
        activate: URL_SERVICE + "/amala/member/membertier/v4.0/activate",
        deactivate: URL_SERVICE + "/amala/member/membertier/v4.0/deactivate",
        history: URL_SERVICE + "/amala/member/tier/v1.2/history/retrieve"
    },
    membertransaction: {
        transfer: URL_SERVICE + "/amala/member/transaction/transfer/v1.2/transfer",
        list: URL_SERVICE + "/amala/member/transaction/v1.2/transaction/retrieve",
        detail: URL_SERVICE + "/amala/member/transaction/v1.2/transaction/retrievedetail",
        create: URL_SERVICE + "/lms/member/transaction/create/v1",
        earningcorrection: URL_SERVICE + "/amala/accrual/transaction/earningcorrection/v1.2/earningcorrection",
        mileagelog: URL_SERVICE + "/amala/member/transfermileagelog/v1.2/retrieve",
        count: URL_SERVICE + "/amala/member/transaction/v1.2/transaction/count",
        csv: URL_SERVICE + "/amala/member/transaction/v1.2/transaction/downloadfile",
        pdf: URL_SERVICE + "/amala/member/transaction/v1.2/transaction/downloadfilePDF",
        generatepdf: URL_SERVICE + "/amala/member/transaction/v1.2/transaction/generatefilePDF",
        generatecsv: URL_SERVICE + "/amala/member/transaction/v1.2/transaction/generatefile"
    },
    membercobrand: {
        list: URL_SERVICE + "/amala/member/membercobrand/v1.2/retrieve",
        create: URL_SERVICE + "/amala/member/membercobrand/v1.2/create",
        detail: URL_SERVICE + "/amala/member/membercobrand/v1.2/retrievedetail",
        update: URL_SERVICE + "/amala/member/membercobrand/v1.2/update",
    },
    membernotes: {
        list: URL_SERVICE + "/amala/member/profile/v1.2/membernotes/retrieve",
        create: URL_SERVICE + "/amala/member/profile/v1.2/membernotes/create",
        detail: URL_SERVICE + "/amala/member/profile/v1.2/membernotes/retrievedetail",
        update: URL_SERVICE + "/amala/member/profile/v1.2/membernotes/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/membernotes/delete",
        download: `${URL_SERVICE}/amala/member/profile/v1.2/membernotes/urldownload`
    },
    memberalias: {
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberalias/retrieve",
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberalias/create",
        detail: URL_SERVICE + "/amala/member/profile/v1.2/memberalias/retrievedetail",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberalias/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/memberalias/delete"
    },
    membercontact: {
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberphones/retrieve",
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberphones/create",
        detail: URL_SERVICE + "/amala/member/profile/v1.2/memberphones/retrievedetail",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberphones/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/memberphones/delete",
        setpreferred: URL_SERVICE + "/amala/member/profile/v1.2/memberphones/setpreferred"
    },
    memberactivity: {
        // list                 : URL_SERVICE+"/lms/member/activity/retrieve/v1",
        list: URL_SERVICE + "/amala/member/activity/v1.2/activity/retrieve",
        detail: URL_SERVICE + "/amala/member/activity/v1.2/activity/retrievedetail",
        getinvalidnamechecklist: URL_SERVICE + "/amala/member/activity/v4.0/getinvalidnamechecklist",
        limit: URL_SERVICE + "/amala/member/activity/limit/v1.2/retrieve"
    },
    memberairactivity: {
        create: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/create",
        detail: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/retrievedetail",
        update: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/update",
        delete: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/delete",
        createwithrating: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/rating/create",
        updatewithrating: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/rating/update",
        cancelwithrating: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/rating/cancel",
        namecheckapproval: URL_SERVICE + "/amala/member/activity/v1.2/airactivity/rating/namecheckapproval"
    },
    membernonairactivity: {
        create: URL_SERVICE + "/amala/member/activity/nonair/validate/v4.0/create",
        detail: URL_SERVICE + "/amala/member/activity/v4.0/retrievedetail",
        update: URL_SERVICE + "/amala/member/activity/v1.2/nonairactivity/update",
        delete: URL_SERVICE + "/amala/member/activity/v1.2/nonairactivity/delete",
        createwithrating: URL_SERVICE + "/amala/member/activity/v1.2/nonairactivity/rating/create",
        updatewithrating: URL_SERVICE + "/amala/member/activity/v1.2/nonairactivity/rating/update",
        cancelwithrating: URL_SERVICE + "/amala/member/activity/v1.2/nonairactivity/rating/cancel",
        geteligible: URL_SERVICE + "/amala/member/activity/v1.2/nonairactivity/geteligibletrx"
    },
    tierrank: {
        create: URL_SERVICE + "/amala/tier/v1.2/tierrank/create",
        list: URL_SERVICE + "/amala/tier/v1.2/tierrank/retrieve"
    },
    memberactivityhistory: {
        list: URL_SERVICE + "/lms/member/activityhistory/retrieve/v1"
    },
    membermailing: {
        list: URL_SERVICE + "/amala/member/profile/v1.2/membermailing/retrieve",
        // detail           : URL_SERVICE+"/lms/member/mailing/retrievedetail/v1",
        // create           : URL_SERVICE+"/lms/member/mailing/create/v1",
        // update           : URL_SERVICE+"/lms/member/mailing/update/v1"
    },
    membercard: {
        list: URL_SERVICE + "/amala/member/card/v1.2/retrieve",
        create: URL_SERVICE + "/lms/member/card/create/v2",
        detail: URL_SERVICE + "/amala/member/card/v1.2/retrievedetail",
        update: URL_SERVICE + "/lms/member/card/update/v2",
        delete: URL_SERVICE + "/lms/member/card/delete/v2",
        changedate: URL_SERVICE + "/amala/member/card/v1.2/changedate",
        buycard: URL_SERVICE + "/amala/member/card/v1.2/integration/buycard",
        reorder: URL_SERVICE + "/amala/member/card/v1.2/integration/reordercard",
        blacklist: URL_SERVICE + "/amala/member/card/v1.2/blacklist",
        blacklistreorder: URL_SERVICE + "/amala/member/card/v1.2/integration/blacklistreordercard"
    },
    citypairrange: {
        create: URL_SERVICE + "/lms/master/distancerange/citypairrange/create/v2",
        list: URL_SERVICE + "/lms/master/distancerange/citypairrange/retrieve/v2",
        detail: URL_SERVICE + "/lms/master/distancerange/citypairrange/retrievedetail/v2",
        update: URL_SERVICE + "/lms/master/distancerange/citypairrange/update/v2",
        delete: URL_SERVICE + "/lms/master/distancerange/citypairrange/delete/v2"
    },
    awardcategory: {
        create: URL_SERVICE + "/lms/award/management/awardcategory/create/v1",
        list: URL_SERVICE + "/lms/award/management/awardcategory/retrieve/v1",
        detail: URL_SERVICE + "/lms/award/management/awardcategory/retrievedetail/v1",
        update: URL_SERVICE + "/lms/award/management/awardcategory/update/v1",
        delete: URL_SERVICE + "/lms/award/management/awardcategory/delete/v1",
    },
    awardprogcategory: {
        create: URL_SERVICE + "/lms/award/management/programcategory/create/v1",
        list: URL_SERVICE + "/lms/award/management/programcategory/retrieve/v1",
        detail: URL_SERVICE + "/lms/award/management/programcategory/retrievedetail/v1",
        update: URL_SERVICE + "/lms/award/management/programcategory/update/v1",
        delete: URL_SERVICE + "/lms/award/management/programcategory/delete/v1",
    },
    awardbasicinfo: {
        create: URL_SERVICE + "/lms/award/create/v2",
        detail: URL_SERVICE + "/lms/award/basic/retrievedetail/v2",
        update: URL_SERVICE + "/lms/award/basic/update/v2"
    },
    awardpartner: {
        detail: URL_SERVICE + "/lms/award/partner/retrievedetail/v2",
        update: URL_SERVICE + "/lms/award/partner/update/v2"
    },
    awardprice1: {
        detail: URL_SERVICE + "/lms/award/price1/retrievedetail/v2",
        update: URL_SERVICE + "/lms/award/price1/update/v2"
    },
    awardprice2: {
        detail: URL_SERVICE + "/lms/award/price2/retrievedetail/v2",
        update: URL_SERVICE + "/lms/award/price2/update/v2"
    },
    awardprice3: {
        create: URL_SERVICE + "/amala/award/config/v1.2/pricederived/create",
        update: URL_SERVICE + "/amala/award/config/v1.2/pricederived/update",
        list: URL_SERVICE + "/amala/award/config/v1.2/pricederived/retrieve",
        detail: URL_SERVICE + "/amala/award/config/v1.2/pricederived/retrievedetail",
        delete: URL_SERVICE + "/amala/award/config/v1.2/pricederived/delete",
    },
    enrollment: {
        enroll: URL_SERVICE + "/amala/enrollment/v1.3/enrollment",
    },
    awardcancelupdate: {
        detail: URL_SERVICE + "/lms/award/cancelupdate/retrievedetail/v2",
        update: URL_SERVICE + "/lms/award/cancelupdate/update/v2"
    },
    certificatetextid: {
        detail: URL_SERVICE + "/lms/award/certificateid/retrievedetail/v1",
        update: URL_SERVICE + "/lms/award/certificateid/update/v1"
    },
    awardvouchertext: {
        create: URL_SERVICE + "/amala/award/config/v1.2/voucher/create",
        list: URL_SERVICE + "/amala/award/config/v1.2/voucher/retrieve",
        detail: URL_SERVICE + "/amala/award/config/v1.2/voucher/retrievedetail",
        update: URL_SERVICE + "/amala/award/config/v1.2/voucher/update",
        delete: URL_SERVICE + "/amala/award/config/v1.2/voucher/delete",
        activate: URL_SERVICE + "/amala/award/config/v1.2/voucher/activate",
        deactivate: URL_SERVICE + "/amala/award/config/v1.2/voucher/deactivate"
    },
    awardstatus: {
        detail: URL_SERVICE + "/lms/award/componentstatus/retrievedetail/v2",
        update: URL_SERVICE + "/lms/award/componentstatus/update/v2"
    },
    transaction: {
        earning: URL_SERVICE + "/amala/member/transaction/earning/v1.2/earning",
        spending: URL_SERVICE + "/amala/member/transaction/v1.2/spending/spending",
        rating: URL_SERVICE + "/amala/accrual/rating/v1.2/rate",
        extension: URL_SERVICE + "/amala/member/transaction/v1.2/expiration/extension",
        expiration: URL_SERVICE + "/amala/member/transaction/v1.2/expiration/expiration"
    },
    redemptioncertificate: {
        create: URL_SERVICE + "/lms/redemption/certificate/create/v1",
        list: URL_SERVICE + "/amala/redemption/certificate/v1.2/retrieve",
        detail: URL_SERVICE + "/amala/redemption/certificate/v1.2/retrievedetail",
        cancel: URL_SERVICE + "/amala/redemption/transaction/v1.2/cancel",
        update: URL_SERVICE + "/amala/redemption/transaction/v1.2/change",
        getemptyticketnumber: URL_SERVICE + "/amala/redemption/certificate/v1.2/getemptyticketnumber",
        addticketnumber: URL_SERVICE + "/amala/redemption/certificate/v1.2/addticketnumber",
        voucherverification: URL_SERVICE + "/amala/redemption/certificate/v1.2/voucherverification",
        updatestatus: URL_SERVICE + "/amala/redemption/certificate/v1.2/updatestatus",
        spendingredeem: URL_SERVICE + "/amala/redemption/transaction/v1.2/spendingredeem",
    },
    memberreceipt: {
        list: URL_SERVICE + "/amala/accrual/receipt/v1.2/retrieve",
        send: URL_SERVICE + "/amala/accrual/receipt/v1.2/sendemail",
        download: URL_SERVICE + "/amala/accrual/receipt/v1.2/download"
    },
    activation: {
        activation: URL_SERVICE + "/amala/enroll/activation/v1.2/activate",
        generatekey: URL_SERVICE + "/amala/enroll/activation/getlink/v1.2/link",
        resendemail: URL_SERVICE + "/amala/enroll/activation/v1.2/activationmail",
        retrievekey: URL_SERVICE + "/amala/enroll/activation/getlink/v1.2/getmemberbykey",
        suspectdupactivation: URL_SERVICE + "/amala/enroll/activation/v1.2/suspectdupactivation",
        resetpassword: URL_SERVICE + "/amala/enroll/activation/v1.2/activationmail/resetpassword",
        resetvalidation: URL_SERVICE + "/amala/enroll/activation/v1.2/activationmail/resetvalidation"
    },
    user: {
        create: URL_SERVICE + "/amala/user/v1.2/user/create",
        update: URL_SERVICE + "/amala/user/v1.2/user/update",
        list: URL_SERVICE + "/amala/user/v1.2/user/retrieve",
        delete: URL_SERVICE + "/amala/user/v1.2/user/delete",
        resetpassword: URL_SERVICE + "/amala/user/v1.2/user/resetpassword",
        changepassword: URL_SERVICE + "/amala/user/v1.2/user/changepassword",
        resetvalidation: URL_SERVICE + "/amala/user/v1.2/user/resetvalidation",
        resetuserpassword: URL_SERVICE + "/amala/user/v1.2/user/resetuserpassword",
        activate: URL_SERVICE + "/amala/user/v1.2/user/activate",
        deactivate: URL_SERVICE + "/amala/user/v1.2/user/deactivate",
        log: URL_SERVICE + "/amala/user/v1.2/user/log/retrieve"
    },
    userlog: {
        log: URL_SERVICE + "/amala/user/v1.2/user/log/retrieve",
        detail: URL_SERVICE + "/amala/user/v1.2/user/log/retrievedetail",
        create: URL_SERVICE + "/amala/user/v1.2/user/log/create",
        legendlist: URL_SERVICE + "/amala/user/v1.2/user/legend/retrieve",
    },
    role: {
        create: URL_SERVICE + "/amala/user/v1.2/role/create",
        update: URL_SERVICE + "/amala/user/v1.2/role/update",
        delete: URL_SERVICE + "/amala/user/v1.2/role/delete",
        list: URL_SERVICE + "/amala/user/v1.2/role/retrieve",
        activate: URL_SERVICE + "/amala/user/v1.2/role/activate",
        deactivate: URL_SERVICE + "/amala/user/v1.2/role/deactivate",
        retrieveroledetail: URL_SERVICE + "/amala/user/v1.2/role/retrieveroledetail",
        setrolepermit: URL_SERVICE + "/amala/user/v1.2/role/setrolepermit",
        getmenu: URL_SERVICE + "/amala/user/v1.2/menu/getmenu"
    },
    communication: {
        create: URL_SERVICE + "/amala/communication/v1.2/create",
        list: URL_SERVICE + "/amala/communication/v1.2/retrieve",
        detail: URL_SERVICE + "/amala/communication/v1.2/retrievedetail",
        update: URL_SERVICE + "/amala/communication/v1.2/update",
        delete: URL_SERVICE + "/amala/communication/v1.2/delete",
        activate: URL_SERVICE + "/amala/communication/v1.2/activate",
        deactivate: URL_SERVICE + "/amala/communication/v1.2/deactivate"
    },
    sessionmanagement: {
        login: URL_SERVICE + "/amala/user/v1.2/session/login",
        expire: URL_SERVICE + "/amala/user/v1.2/session/expire",
        authenticate: URL_SERVICE + "/amala/user/v1.2/sessionintegration/authenticate",
        extend: URL_SERVICE + "/amala/user/v1.2/sessionintegration/extend",
        check: URL_SERVICE + "/amala/user/v1.2/session/check"
    },
    redemption: {
        eligibleredeem: URL_SERVICE + "/amala/redemption/eligiblestatus/v1.2/geteligiblestatus",
        buyaward: URL_SERVICE + "/amala/redemption/transaction/v1.2/buy",
        updateaward: URL_SERVICE + "/amala/redemption/transaction/v1.2/change",
        getpricelist: URL_SERVICE + "/amala/redemption/pricelist/v1.2/pricecalc"
    },
    awardlist: {
        getawardredeemlist: URL_SERVICE + "/amala/award/config/v1.2/redeemlist/getawardredeemlist",
    },
    retroclaim: {
        list: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/retrieve",
        listpendingapproval: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/pendingapprovallist",
        reqinfohistory: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/reqinfohistory",
        updatereqinfo: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/updatereqinfo",
        retroclaimga: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/integration/retroclaimga",
        retroclaimqg: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/integration/retroclaimqg",
        retroclaimsj: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/integration/retroclaimsj",
        retroclaimskyteam: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/integration/retroclaimskyteam",
        retroclaimstar: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/integration/retroclaimstaralliance",
        retroclaimskyin: URL_SERVICE + "/amala/checkretroflight/history/v1.2/retrieve",
        retroclaimskyindetail: URL_SERVICE + "/amala/checkretroflight/history/v1.2/retrievedetail",
        retroclaimoneworld: URL_SERVICE + "/amala/accrual/retroclaim/v1.2/oneworld/retroclaim"
    },
    billing: {
        list: URL_SERVICE + "/amala/accrual/billing/v1.2/billing/retrieve",
        detail: URL_SERVICE + "/amala/accrual/billing/v1.2/billing/retrievedetail"
    },
    file: {
        create: URL_SERVICE + "/amala/filemanagement/v1.2/file/create",
        list: URL_SERVICE + "/amala/filemanagement/v1.2/file/retrieve",
        update: URL_SERVICE + "/amala/filemanagement/v1.2/file/update",
        delete: URL_SERVICE + "/amala/filemanagement/v1.2/file/delete",
        downloadfile: URL_SERVICE + "/amala/filemanagement/v1.2/file/downloadfile",
        downloadsum: URL_SERVICE + "/amala/filemanagement/v1.2/file/downloadsummary"

    },
    filedata: {
        create: URL_SERVICE + "/amala/filemanagement/v1.2/filedata/create",
        list: URL_SERVICE + "/amala/filemanagement/v1.2/filedata/retrieve",
        update: URL_SERVICE + "/amala/filemanagement/v1.2/filedata/update",
        delete: URL_SERVICE + "/amala/filemanagement/v1.2/filedata/delete",
        transferpoint: URL_SERVICE + "/amala/filemanagement/v1.2/filedatatransferpoint/retrieve",
        terminate: URL_SERVICE + "/amala/filemanagement/v1.2/filedatatermination/retrieve",
        approvalcobrand: URL_SERVICE + "/amala/filemanagement/v1.2/filedataapprovalcobrand/retrieve",
        cobrandfasstrack: URL_SERVICE + "/amala/filemanagement/v1.2/fasttrack/retrieve",
    },
    // filedataamala: {
    //     enrollment    : URL_SERVICE+"/amala/filemanagement/v1.2/filedataenrollment/retrieve",
    //     transferpoint : URL_SERVICE+"/amala/filemanagement/v1.2/filedatatransferpoint/retrieve",
    // },
    enrollmentfiledata: {
        list: URL_SERVICE + "/amala/filemanagement/v1.2/filedataenrollment/retrieve"
    },
    relationtype: {
        create: URL_SERVICE + "/amala/relation/config/v1.2/type/create",
        list: URL_SERVICE + "/amala/relation/config/v1.2/type/retrieve",
        update: URL_SERVICE + "/amala/relation/config/v1.2/type/update",
        delete: URL_SERVICE + "/amala/relation/config/v1.2/type/delete"
    },
    tourcode: {
        create: URL_SERVICE + "/amala/corporate/reference/v1.2/tourcode/create",
        list: URL_SERVICE + "/amala/corporate/reference/v1.2/tourcode/retrieve",
        update: URL_SERVICE + "/amala/corporate/reference/v1.2/tourcode/update",
        delete: URL_SERVICE + "/amala/corporate/reference/v1.2/tourcode/delete"
    },
    memberrelation: {
        list: URL_SERVICE + "/amala/relation/config/v1.2/memberrelation/retrieve",
        update: URL_SERVICE + "/amala/relation/config/v1.2/memberrelation/update",
        activate: URL_SERVICE + "/amala/relation/config/v1.2/memberrelation/activate",
        deactivate: URL_SERVICE + "/amala/relation/config/v1.2/memberrelation/deactivate",
        enroll: URL_SERVICE + "/amala/relation/enroll/v1.2/enrollmemberrelation",
        upload: URL_SERVICE + "/amala/relation/config/v1.2/memberrelation/upload"
    },
    membercorporate: {
        list: URL_SERVICE + "/amala/corporate/reference/v1.2/detailinfo/retrieve",
        update: URL_SERVICE + "/amala/corporate/reference/v1.2/detailinfo/update",
        activate: URL_SERVICE + "/amala/corporate/reference/v1.2/detailinfo/activate",
        deactivate: URL_SERVICE + "/amala/corporate/reference/v1.2/detailinfo/deactivate"
    },
    corporate: {
        list: URL_SERVICE + "/amala/corporate/reference/v1.2/detailinfo/retrieve",
        update: URL_SERVICE + "/amala/corporate/corporatedetailinfo/v1.2/update",
        activate: URL_SERVICE + "/amala/corporate/corporatedetailinfo/v1.2/activate",
        deactivate: URL_SERVICE + "/amala/corporate/corporatedetailinfo/v1.2/deactivate"
    },
    mileageexpiry: {
        list: URL_SERVICE + "/amala/member/transaction/v4.1/retrievemileageexpiry"
    },
    suspectdup: {
        check: URL_SERVICE + "/amala/enroll/suspectdupe/v1.2/check"

    },
    travelcoordinator: {
        create: URL_SERVICE + "/amala/corporate/reference/v1.2/travelcoordinator/create",
        list: URL_SERVICE + "/amala/corporate/reference/v1.2/travelcoordinator/retrieve",
        update: URL_SERVICE + "/amala/corporate/reference/v1.2/travelcoordinator/update",
        activate: URL_SERVICE + "/amala/corporate/reference/v1.2/travelcoordinator/activate",
        deactivate: URL_SERVICE + "/amala/corporate/reference/v1.2/travelcoordinator/deactivate"
    },
    relationbonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/relationbonus/create",
        list: URL_SERVICE + "/amala/tier/v1.2/relationbonus/retrieve",
        update: URL_SERVICE + "/amala/tier/v1.2/relationbonus/update",
        activate: URL_SERVICE + "/amala/tier/v1.2/relationbonus/activate",
        deactivate: URL_SERVICE + "/amala/tier/v1.2/relationbonus/deactivate"
    },
    enrollmentcorporate: {
        enroll: URL_SERVICE + '/amala/corporate/enrollment/v1.2/corporateenrollment'
    },
    memberaccount: {
        detail: URL_SERVICE + '/amala/member/account/v1.2/memberaccount/retrievedetail'
    },
    memberaccountdetail: {
        retrieve: URL_SERVICE + '/amala/member/account/v1.2/memberaccountdetail/retrieve',
        updatedate: URL_SERVICE + '/amala/member/account/v1.2/memberaccountdetail/updatedate',
        gettrx: `${URL_SERVICE}/amala/member/account/v1.2/memberaccountdetail/gettrx`,
        getsummary: `${URL_SERVICE}/amala/member/account/v1.2/memberaccountdetail/getsummary`,
        download: `${URL_SERVICE}/amala/member/account/v1.2/memberaccountdetail/download`,
        donwloaddetail: `${URL_SERVICE}/amala/member/account/v1.2/memberaccountdetail/download/detail`
    },
    partnerbulk: {
        create: URL_SERVICE + "/amala/partner/v1.2/partnerbulk/create",
        detail: URL_SERVICE + "/amala/partner/v1.2/partnerbulk/retrievedetail",
        update: URL_SERVICE + "/amala/partner/v1.2/partnerbulk/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/partnerbulk/delete",
        pdf: URL_SERVICE + "/amala/partner/v1.2/partnerbulk/downloadPdf",
        csv: URL_SERVICE + "/amala/partner/v1.2/partnerbulk/downloadCsv"
    },
    partnerbulkdetail: {
        detail: URL_SERVICE + "/amala/partner/v1.2/partnerbulkdetail/retrievedetail"
    },
    partnertransaction: {
        retrieve: URL_SERVICE + "/amala/partner/v1.2/partnertransaction/retrieve",
        create: URL_SERVICE + "/amala/partner/v1.2/partnertransaction/create",
        update: URL_SERVICE + "/amala/partner/v1.2/partnertransaction/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/partnertransaction/delete",
        pdf: URL_SERVICE + "/amala/partner/v1.2/partnertransaction/downloadPdf",
        csv: URL_SERVICE + "/amala/partner/v1.2/partnertransaction/downloadCsv"
    },
    partnerbilling: {
        retrieve: URL_SERVICE + "/amala/partner/v1.2/partnerbilling/retrieve",
        create: URL_SERVICE + "/amala/partner/v1.2/partnerbilling/create",
        update: URL_SERVICE + "/amala/partner/v1.2/partnerbilling/update",
        delete: URL_SERVICE + "/amala/partner/v1.2/partnerbilling/delete",
        detail: URL_SERVICE + "/amala/partner/v1.2/partnerbilling/retrievedetail",
        pdf: URL_SERVICE + "/amala/partner/v1.2/partnerbilling/downloadPdf",
        csv: URL_SERVICE + "/amala/partner/v1.2/partnerbilling/downloadCsv"
    },
    awardduration: {
        create: URL_SERVICE + "/amala/award/config/v1.2/awardduration/create",
        update: URL_SERVICE + "/amala/award/config/v1.2/awardduration/update",
        list: URL_SERVICE + "/amala/award/config/v1.2/awardduration/retrieve",
        detail: URL_SERVICE + "/amala/award/config/v1.2/awardduration/retrievedetail",
        delete: URL_SERVICE + "/amala/award/config/v1.2/awardduration/delete"
    },
    enrollmentrule: {
        create: URL_SERVICE + "/amala/partner/enrollmentfile/v1.2/rule/create",
        update: URL_SERVICE + "/amala/partner/enrollmentfile/v1.2/rule/update",
        list: URL_SERVICE + "/amala/partner/enrollmentfile/v1.2/rule/retrieve",
        delete: URL_SERVICE + "/amala/partner/enrollmentfile/v1.2/rule/delete"
    },
    airaccrualreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/airaccrual/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/airaccrual/generatefile"
    },
    nonairaccrualreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/nonairaccrual/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/nonairaccrual/generatefile"
    },
    airawardreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/airaward/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/airaward/generatefile",
        dailylist: URL_SERVICE + "/amala/reporting/v1.2/airaward/dailyreport",
        dailygenerate: URL_SERVICE + "/amala/reporting/v1.2/airaward/dailyreportdownload"
    },
    nonairawardreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/nonairaward/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/nonairaward/generatefile",
        dailylist: URL_SERVICE + "/amala/reporting/v1.2/nonairaward/dailyreport",
        dailygenerate: URL_SERVICE + "/amala/reporting/v1.2/nonairaward/dailyreportdownload"
    },
    redepositreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/redeposit/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/redeposit/generatefile",
        dailylist: URL_SERVICE + "/amala/reporting/v1.2/redeposit/dailyreport",
        dailygenerate: URL_SERVICE + "/amala/reporting/v1.2/redeposit/dailyreportdownload"
    },
    customtrxreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/customtransaction/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/customtransaction/generatefile",
        dailylist: URL_SERVICE + "/amala/reporting/v1.2/customtransaction/dailyreport",
        dailygenerate: URL_SERVICE + "/amala/reporting/v1.2/customtransaction/dailyreportdownload"
    },
    memberprofilereport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/memberprofile/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/memberprofile/generatefile"
    },
    terminatememberreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/memberterminate/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/memberterminate/generatefile"
    },
    cobrandreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/cobrand/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/cobrand/generatefile",
        fasttrack: URL_SERVICE + "/amala/reporting/v1.2/cobrand/cobrandfasttrack",
        generateft: URL_SERVICE + "/amala/reporting/v1.2/cobrand/generatecobrandfasttrack",
        earning: URL_SERVICE + "/amala/reporting/v1.2/cobrand/earningcobrand",
        generatetrx: URL_SERVICE + "/amala/reporting/v1.2/cobrand/generateearningcobrand",
        member: URL_SERVICE + "/amala/reporting/v1.2/cobrand/membercobrand",
        generatemmbr: URL_SERVICE + "/amala/reporting/v1.2/cobrand/generatemembercobrand",
        summary: URL_SERVICE + "/amala/reporting/v1.2/cobrand/summarymember",
        generatesum: URL_SERVICE + "/amala/reporting/v1.2/cobrand/generatesummary",
    },
    accrualpromo: {
        create: URL_SERVICE + "/amala/accrual/catalog/v1.2/promo/create",
        list: URL_SERVICE + "/amala/accrual/catalog/v1.2/promo/retrieve",
        detail: URL_SERVICE + "/amala/accrual/catalog/v1.2/promo/retrievedetail",
        update: URL_SERVICE + "/amala/accrual/catalog/v1.2/promo/update",
        delete: URL_SERVICE + "/amala/accrual/catalog/v1.2/promo/delete"
    },
    buymileagecatalog: {
        create: URL_SERVICE + "/amala/buymileage/catalogueintegration/v1.2/create",
        list: URL_SERVICE + "/amala/buymileage/catalogue/v1.2/master/retrieve",
        detail: URL_SERVICE + "/amala/buymileage/catalogueintegration/v1.2/retrievedetail",
        update: URL_SERVICE + "/amala/buymileage/catalogueintegration/v1.2/update",
        delete: URL_SERVICE + "/amala/buymileage/catalogueintegration/v1.2/delete",
        getprice: URL_SERVICE + "/amala/buymileage/master/v1.2/getprice",
        activate: URL_SERVICE + "/amala/buymileage/catalogue/v1.2/master/activate",
        deactivate: URL_SERVICE + "/amala/buymileage/catalogue/v1.2/master/deactivate"
    },
    buymileagecatalogprice: {
        create: URL_SERVICE + "/amala/buymileage/catalogue/v1.2/price/create",
        update: URL_SERVICE + "/amala/buymileage/catalogue/v1.2/price/update",
        delete: URL_SERVICE + "/amala/buymileage/catalogue/v1.2/price/delete"
    },
    buymileagepromo: {
        create: URL_SERVICE + "/amala/buymileage/promointegration/v1.2/create",
        update: URL_SERVICE + "/amala/buymileage/promointegration/v1.2/update",
        list: URL_SERVICE + "/amala/buymileage/promo/v1.2/master/retrieve",
        detail: URL_SERVICE + "/amala/buymileage/promointegration/v1.2/retrievedetail",
        delete: URL_SERVICE + "/amala/buymileage/promointegration/v1.2/delete",
        retrieveprice: URL_SERVICE + "/amala/buymileage/promo/v1.2/retrieveprice",
        updateprice: URL_SERVICE + "/amala/buymileage/promo/v1.2/updateprice",
        deleteprice: URL_SERVICE + "/amala/buymileage/promo/v1.2/deleteprice",
    },
    buymileagepromoprice: {
        create: URL_SERVICE + "/amala/buymileage/promo/v1.2/price/create",
        update: URL_SERVICE + "/amala/buymileage/promo/v1.2/price/update",
        list: URL_SERVICE + "/amala/buymileage/promo/v1.2/price/retrieve",
        delete: URL_SERVICE + "/amala/buymileage/promo/v1.2/price/delete"
    },
    buymileagereport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/buymileage/report",
        generate: URL_SERVICE + "/amala/reporting/v1.2/buymileage/generatefile",
        dailylist: URL_SERVICE + "/amala/reporting/v1.2/buymileage/dailyreport",
        dailygenerate: URL_SERVICE + "/amala/reporting/v1.2/buymileage/dailyreportdownload"
    },
    memberbuymileage: {
        getprice: URL_SERVICE + "/amala/buymileage/catalogueintegration/v1.2/getprice",
        getpromo: URL_SERVICE + "/amala/buymileage/promointegration/v1.2/getpromo",
        getcatalogue: URL_SERVICE + "/amala/buymileage/catalogueintegration/v1.2/getcatalogue",
        geteligible: URL_SERVICE + "/amala/member/buymileageintegration/v1.2/geteligiblemileage",
        list: URL_SERVICE + "/amala/member/buymileage/v1.2/retrieve",
        update: URL_SERVICE + "/amala/member/buymileage/v1.2/update",
        confirmation: URL_SERVICE + "/amala/member/buymileageintegration/v1.2/confirm",
        buy: URL_SERVICE + "/amala/member/buymileageintegration/v1.2/buy",
        cancel: `${URL_SERVICE}/amala/member/buymileageintegration/v1.2/cancel`,
    },
    memberbuymileagelimit: {
        check: URL_SERVICE + "/amala/member/buymileagelimit/v1.2/check",
        list: URL_SERVICE + "/amala/member/buymileagelimit/v1.2/retrieve"
    },
    mileagestatementmember: {
        list: URL_SERVICE + "/amala/mileage/statement/v1.2/log/memberstatementretrieve",
        download: URL_SERVICE + "/amala/mileage/statement/v1.2/log/membermileagedownload",
        detail: URL_SERVICE + "/amala/mileage/statement/v1.2/log/memberstatementdetail",
    },
    redemptionpromo: {
        criteriatype: {
            list: URL_SERVICE + "/amala/redeempromo/v1.2/criteriatype/retrieve",
            activate: URL_SERVICE + "/amala/redeempromo/v1.2/criteriatype/activate",
            deactivate: URL_SERVICE + "/amala/redeempromo/v1.2/criteriatype/deactivate",
        },
        categorytype: {
            list: URL_SERVICE + "/amala/redeempromo/v1.2/categorytype/retrieve",
            activate: URL_SERVICE + "/amala/redeempromo/v1.2/categorytype/activate",
            deactivate: URL_SERVICE + "/amala/redeempromo/v1.2/categorytype/deactivate",
        },
        filetype: {
            list: URL_SERVICE + "/amala/redeempromo/v1.2/file/retrieve"
        },
        filedata: {
            list: URL_SERVICE + "/amala/redeempromo/v1.2/filedata/retrieve"
        },
        criteriacategory: {
            getcriteriacategory: URL_SERVICE + "/amala/redeempromo/v1.2/criteriacategory/getcriteriacategory",
            create: URL_SERVICE + "/amala/redeempromo/v1.2/criteriacategory/create",
            update: URL_SERVICE + "/amala/redeempromo/v1.2/criteriacategory/update",
            delete: URL_SERVICE + "/amala/redeempromo/v1.2/criteriacategory/deletedatacategory"
        },
        catalog: {
            list: URL_SERVICE + "/amala/redeempromo/v1.2/catalog/retrieve",
            detail: URL_SERVICE + "/amala/redeempromo/v1.2/catalog/retrievedetail",
            activate: URL_SERVICE + "/amala/redeempromo/v1.2/catalog/activate",
            deactivate: URL_SERVICE + "/amala/redeempromo/v1.2/catalog/deactivate",
            create: URL_SERVICE + "/amala/redeempromo/v1.2/catalog/create",
            update: URL_SERVICE + "/amala/redeempromo/v1.2/catalog/update",
        }
    },
    firstactivitybonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/create",
        update: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/delete",
        list: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/retrieve",
    },
    memberlock: {
        main: URL_SERVICE + "/amala/member/profile/v1.2/memberlock/",
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberlock/create",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberlock/update",
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberlock/retrieve",
    },
    mileagestatementlog: {
        list: URL_SERVICE + "/amala/mileage/statement/v1.2/log/retrieve",
        download: URL_SERVICE + "/amala/mileage/statement/v1.2/log/logdownload",
    },
    dashboard: {
        membertier: URL_SERVICE + "/amala/dashboard/v1.2/tierinformation",
        corporateactivity: URL_SERVICE + "/amala/dashboard/v1.2/corporateactivity",
        redemption: URL_SERVICE + "/amala/dashboard/v1.2/reedemption",
        memberactivity: URL_SERVICE + "/amala/dashboard/v1.2/activityinformation",
        flight: URL_SERVICE + "/amala/dashboard/v1.2/flight",
        promocode: URL_SERVICE + "/amala/dashboard/v1.2/promoinformation",
        enrollmentmember: URL_SERVICE + "/amala/dashboard/v1.2/enrollmentmember",
        nonairactivity: URL_SERVICE + "/amala/dashboard/v1.2/nonairactivity"
    },
    mileagestatementtemplate: {
        create: URL_SERVICE + "/amala/mileage/statement/v1.2/template/create",
        update: URL_SERVICE + "/amala/mileage/statement/v1.2/template/update",
        list: URL_SERVICE + "/amala/mileage/statement/v1.2/template/retrieve",
        delete: URL_SERVICE + "/amala/mileage/statement/v1.2/template/delete"
    },
    mileagestatementmember: {
        list: URL_SERVICE + "/amala/mileage/statement/v1.2/log/memberstatementretrieve",
        download: URL_SERVICE + "/amala/mileage/statement/v1.2/log/membermileagedownload",
        detail: URL_SERVICE + "/amala/mileage/statement/v1.2/log/memberstatementdetail",
    },
    memberredemptionnominee: {
        public: {
            updatestatus: URL_SERVICE + "/amala/redemption/nominee/public/v1.2/nominee/updatestatus",
            list: URL_SERVICE + "/amala/redemption/nominee/public/v1.2/nominee/retrieve",
        },
        list: URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/retrieve",
        create: URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/create",
        delete: URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/delete",
        force: URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/force-delete",
        getcountnominee : URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/retrieve/withmaxcount",
        updatestatus: URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/updatestatus",
        resend: URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/resend-verification-email",
        getChangePrice: URL_SERVICE + "/amala/redemption/nominee/v1.2/nominee/getchangeprice"

    },
    jobcatalogue: {
        create: URL_SERVICE + "/amala/master/general/v1.2/job/create",
        list: URL_SERVICE + "/amala/master/general/v1.2/job/retrieve",
        update: URL_SERVICE + "/amala/master/general/v1.2/job/update",
        delete: URL_SERVICE + "/amala/master/general/v1.2/job/delete",
        activate: URL_SERVICE + "/amala/master/general/v1.2/job/activate",
        deactivate: URL_SERVICE + "/amala/master/general/v1.2/job/deactivate"
    },
    nomineefeeconfig: {
        list: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/retrieve",
        create: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/create",
        update: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/update",
        delete: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/delete",
        history: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/retrievehistory",
        deactivateall: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/deactivateall",
        activate: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/activate",
        deactivate: URL_SERVICE + "/amala/redemption/nominee/v1.2/fee/deactivate"
    },
    favoritedestination: {
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberfavdestination/create",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberfavdestination/update",
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberfavdestination/retrieve",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/memberfavdestination/delete"
    },
    birthdaybonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/tierbirthdaybonus/create",
        update: URL_SERVICE + "/amala/tier/v1.2/tierbirthdaybonus/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/tierbirthdaybonus/delete",
        list: URL_SERVICE + "/amala/tier/v1.2/tierbirthdaybonus/retrieve",
        activate: URL_SERVICE + "/amala/tier/v1.2/tierbirthdaybonus/activate",
        deactivate: URL_SERVICE + "/amala/tier/v1.2/tierbirthdaybonus/deactivate"
    },
    redeempromo: {
        getpromo: URL_SERVICE + "/amala/redeempromo/v1.2/rule/getpromo",
        getusagepromo: URL_SERVICE + "/amala/redeempromo/rule/v1.2/getpromousage"
    },
    firstactivitybonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/create",
        update: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/update",
        delete: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/delete",
        list: URL_SERVICE + "/amala/tier/v1.2/firstactivitybonus/retrieve",
    },
    profileintegration: {
        mergemember: URL_SERVICE + "/amala/member/profileintegration/v1.2/mergemember",
        getoriginmember: URL_SERVICE + "/amala/member/profileintegration/v1.2/mergemember/getoriginmember",
        correction: URL_SERVICE + "/amala/member/profileintegration/v1.2/correctiontransaction",
        retrieve: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/retrieve",
        detail: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/retrievedetail",
        merge: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/create",
        update: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/update",
        download: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/generatefile",
        downloadpdf: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/generatefilePDF",
        duplicate: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/checkduplicate",
        approved: URL_SERVICE + "/amala/member/profileintegration/v1.2/manual/approved"
    },
    referralbonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/referralbonus/create",
        update: URL_SERVICE + "/amala/tier/v1.2/referralbonus/update",
        list: URL_SERVICE + "/amala/tier/v1.2/referralbonus/retrieve",
        delete: URL_SERVICE + "/amala/tier/v1.2/referralbonus/delete",
        activate: URL_SERVICE + "/amala/tier/v1.2/referralbonus/activate",
        deactivate: URL_SERVICE + "/amala/tier/v1.2/referralbonus/deactivate"
    },
    mergetransactioncorrection: {
        retrievedetail: URL_SERVICE + "/amala/merge/transaction/correction/v1.2/retrievedetail",
    },
    cobrandfasttrack: {
        create: URL_SERVICE + "/amala/cobrandfasttrack/v1.2/cobrandfasttrack/create",
        list: URL_SERVICE + "/amala/cobrandfasttrack/v1.2/cobrandfasttrack/retrieve",
        detail: URL_SERVICE + "/amala/cobrandfasttrack/v1.2/cobrandfasttrack/retrievedetail",
        update: URL_SERVICE + "/amala/cobrandfasttrack/v1.2/cobrandfasttrack/update",
        delete: URL_SERVICE + "/amala/cobrandfasttrack/v1.2/cobrandfasttrack/delete",
        activate: URL_SERVICE + "/amala/cobrandfasttrack/v1.2/cobrandfasttrack/activate",
        deactivate: URL_SERVICE + "/amala/cobrandfasttrack/v1.2/cobrandfasttrack/deactivate"
    },
    promocompletionbonus: {
        list: URL_SERVICE + "/amala/completionbonus/v1.2/promocompletionbonus/retrieve",
        create: URL_SERVICE + "/amala/completionbonus/v1.2/promocompletionbonus/create",
        update: URL_SERVICE + "/amala/completionbonus/v1.2/promocompletionbonus/update",
        activate: URL_SERVICE + "/amala/completionbonus/v1.2/promocompletionbonus/activate",
        deactive: URL_SERVICE + "/amala/completionbonus/v1.2/promocompletionbonus/deactive"
    },
    tiercompletionbonus: {
        create: URL_SERVICE + "/amala/completionbonus/v1.2/tiercompletionbonus/create",
        update: URL_SERVICE + "/amala/completionbonus/v1.2/tiercompletionbonus/update",
        delete: URL_SERVICE + "/amala/completionbonus/v1.2/tiercompletionbonus/delete",
        list: URL_SERVICE + "/amala/completionbonus/v1.2/tiercompletionbonus/retrieve",
        activate: URL_SERVICE + "/amala/completionbonus/v1.2/tiercompletionbonus/activate",
        deactivate: URL_SERVICE + "/amala/completionbonus/v1.2/tiercompletionbonus/deactive"
    },
    memberidentity: {
        retrieve: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/memberretrieve",
        list: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/retrieve",
        create: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/create",
        update: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/update",
        delete: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/delete",
        verify: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/verifyidentity",
        reject: URL_SERVICE + "/amala/member/profile/v1.2/memberidentity/rejectidentity",
    },
    referralbonus: {
        create: URL_SERVICE + "/amala/tier/v1.2/referralbonus/create",
        update: URL_SERVICE + "/amala/tier/v1.2/referralbonus/update",
        list: URL_SERVICE + "/amala/tier/v1.2/referralbonus/retrieve",
        activate: URL_SERVICE + "/amala/tier/v1.2/referralbonus/activate",
        deactivate: URL_SERVICE + "/amala/tier/v1.2/referralbonus/deactivate"
    },
    completionbonus: {
        getprogress: URL_SERVICE + "/amala/completionbonus/v1.2/getprogress",
    },
    monitoringreport: {
        list: URL_SERVICE + "/amala/reporting/v1.2/reportmonitoring/retrieve",
        generate: URL_SERVICE + "/amala/reporting/v1.2/reportmonitoring/generate"
    },
    requestapproval: {
        create: URL_SERVICE + "/amala/requestapproval/v1.2/create",
        list: URL_SERVICE + "/amala/requestapproval/v1.2/retrieve",
        detail: URL_SERVICE + "/amala/requestapproval/v1.2/retrievedetail",
        delete: URL_SERVICE + "/amala/requestapproval/v1.2/delete",
        update: URL_SERVICE + "/amala/requestapproval/v1.2/update",
        history: URL_SERVICE + "/amala/requestapproval/v1.2/retrievehistory",
        approval: URL_SERVICE + "/amala/requestapprovalintegration/v1.2/approval",
        getapprovalby: URL_SERVICE + "/amala/requestapprovalintegration/v1.2/getapprovalby",
        getissuedby: URL_SERVICE + "/amala/requestapprovalintegration/v1.2/getissuedby",
    },
    vendor: {
        list: URL_SERVICE + "/amala/vendor/v1.2/master/retrieve"
    },
    revenuebased: {
        create: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/create",
        update: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/update",
        retrieveheader: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/retrieveheader",
        deleteheader: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/deleteheader",
        adddetail: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/adddetail",
        updaterule: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/updaterule",
        deleterule: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/deleterule",
        retrievedetail: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/retrievedetail",
        activate: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/activateheader",
        deactivate: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/deactivateheader",
        rate: {
            create: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/create",
            update: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/update",
            retrievedetail: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/retrievedetail",
            activate: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/activate",
            deactivate: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/deactivate",
            adddetail: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/adddetail",
            updaterule: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/updaterule",
            deleterule: URL_SERVICE + "/amala/accrual/rule/v1.2/revenuebased/rate/deleterule",
        }
    },
    letter: {
        retrieve: URL_SERVICE + "/amala/mailing/product/letter/v1.2/master/retrieve",
        detail: URL_SERVICE + "/amala/mailing/product/letter/v1.2/master/retrievedetail",
        create: URL_SERVICE + "/amala/mailing/product/letter/v1.2/master/create",
        update: URL_SERVICE + "/amala/mailing/product/letter/v1.2/master/update",
        delete: URL_SERVICE + "/amala/mailing/product/letter/v1.2/master/delete",
    },
    inventory: {
        retrieve: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/master/retrieve",
        detail: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/master/retrievedetail",
        create: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/master/create",
        update: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/master/update",
        delete: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/master/delete",
        variant: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/variant/retrieve"
    },
    mailingproduct: {
        list: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/master/retrieve",
        detail: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/master/retrievedetail",
        detailintegration: URL_SERVICE + "/amala/mailing/product/catalogue/integration/v1.2/retrievedetail",
        create: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/master/create",
        update: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/master/update",
        delete: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/master/delete",
        activate: URL_SERVICE + "/amala/mailing/product/catalogue/integration/v1.2/activate",
        deactivate: URL_SERVICE + "/amala/mailing/product/catalogue/integration/v1.2/deactivate",
        getcatalog: URL_SERVICE + "/amala/mailing/product/catalogue/integration/v1.2/getcatalog",
        price: {
            retrieve: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/price/retrieve",
            create: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/price/create",
            update: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/price/update",
            delete: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/price/delete",
        },
        vendor: {
            retrieve: URL_SERVICE + "/amala/mailing/product/catalogue/vendor/integration/v1.2/retrieve",
            create: URL_SERVICE + "/amala/mailing/product/catalogue/vendor/integration/v1.2/create",
            update: URL_SERVICE + "/amala/mailing/product/catalogue/vendor/integration/v1.2/update",
            delete: URL_SERVICE + "/amala/mailing/product/catalogue/vendor/integration/v1.2/delete",
        },
        cancelupdate: {
            update: URL_SERVICE + "/amala/mailing/product/catalogue/v1.2/master/updatefee"
        }
    },
    printingvendor: {
        retrieve: URL_SERVICE + "/amala/vendor/v1.2/master/retrieve"
    },
    vendor: {
        create: URL_SERVICE + "/amala/vendor/v1.2/master/create",
        update: URL_SERVICE + "/amala/vendor/v1.2/master/update",
        delete: URL_SERVICE + "/amala/vendor/v1.2/master/delete",
        region: URL_SERVICE + "/amala/vendor/v1.2/region/create",
        detail: URL_SERVICE + "/amala/vendor/v1.2/master/retrievedetail",
        retrieve: URL_SERVICE + "/amala/vendor/v1.2/master/retrieve",
        activate: URL_SERVICE + "/amala/vendor/v1.2/master/activate",
        deactivate: URL_SERVICE + "/amala/vendor/v1.2/master/deactivate",
        list: URL_SERVICE + "/amala/vendorintegration/v1.2/retrieve",
    },
    vendorregion: {
        create: URL_SERVICE + "/amala/vendor/v1.2/region/create",
        update: URL_SERVICE + "/amala/vendor/v1.2/region/update",
        delete: URL_SERVICE + "/amala/vendor/v1.2/region/delete",
        retrieve: URL_SERVICE + "/amala/vendor/v1.2/region/retrieve",
        detail: URL_SERVICE + "/amala/vendor/v1.2/region/retrievedetail"
    },
    vendorsla: {
        create: URL_SERVICE + "/amala/vendor/v1.2/sla/create",
        update: URL_SERVICE + "/amala/vendor/v1.2/sla/update",
        delete: URL_SERVICE + "/amala/vendor/v1.2/sla/delete",
        retrieve: URL_SERVICE + "/amala/vendor/v1.2/sla/retrieve",
        detail: URL_SERVICE + "/amala/vendor/v1.2/sla/retrievedetail"
    },
    email: {
        retrieveemailtype: URL_SERVICE + "/amala/mail/v1.0/email/retrieveemailtype",
        deactivate: URL_SERVICE + "/amala/tier/v1.2/referralbonus/deactivate",
    },
    obp: {
        create: URL_SERVICE + "/amala/accrual/obp/v1.2/create",
        update: URL_SERVICE + "/amala/accrual/obp/v1.2/updateobp",
        list: URL_SERVICE + "/amala/accrual/obp/v1.2/retrieve",
        delete: URL_SERVICE + "/amala/accrual/obp/v1.2/delete",
        uin: URL_SERVICE + "/amala/accrual/obp/v1.2/generateuinobp",
        reset: URL_SERVICE + "/amala/accrual/obp/v1.2/resetuin"
    },
    inventorysys: {
        create: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/create",
        list: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/retrieve",
        detail: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/retrievedetail",
        update: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/update",
        delete: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/delete",
        log: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/log/retrieve",
        countstock: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/countstock",
        listvariant: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/variant/retrieve",
        createvariant: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/variant/create",
        updatevariant: URL_SERVICE + "/amala/mailing/product/inventory/v1.2/variant/update",
        addstock: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/addstock",
        substract: URL_SERVICE + "/amala/mailing/product/inventory/integration/v1.2/substract",
    },
    memberbuyproduct: {
        retrieve: `${URL_SERVICE}/amala/mailing/order/v1.2/retrieve`,
        getprice: `${URL_SERVICE}/amala/mailing/product/catalogue/integration/v1.2/getprice`,
        buy: `${URL_SERVICE}/amala/mailing/order/management/integration/v1.2/buy`,
        confirmation: `${URL_SERVICE}/amala/mailing/order/management/integration/v1.2/confirmation`,
        tracking: `${URL_SERVICE}/amala/mailing/order/management/integration/v1.2/tracking`,
        getcancelfee: `${URL_SERVICE}/amala/mailing/product/catalogue/v1.2/fee/getfee`,
        cancel: `${URL_SERVICE}/amala/mailing/order/management/integration/v1.2/cancel`
    },
    approvalcorporate: {
        retrieve: `${URL_SERVICE}/amala/requestapproval/mtce/v1.2/retrieve`,
        retrievedetail: `${URL_SERVICE}/amala/requestapproval/mtce/v1.2/retrievedetail`,
        approve: `${URL_SERVICE}/amala/requestapproval/mtce/v1.2/approve`,
        reject: `${URL_SERVICE}/amala/requestapproval/mtce/v1.2/reject`
    },
    memberpromo: {
        list: URL_SERVICE + "/amala/newaccrual/promo/v1.2/memberpromo/retrieve",
        delete: URL_SERVICE + "/amala/newaccrual/promo/v1.2/memberpromo/delete",
        register: URL_SERVICE + "/amala/newaccrual/promo/v1.2/registration/register",
        download: URL_SERVICE + "/amala/newaccrual/promo/v1.2/memberpromo/download"
    },
    promomanage: {
        usage: `${URL_SERVICE}/amala/member/promo/v1.2/getpromousage`,
        create: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/catalog/create`,
        update: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/catalog/update`,
        retrieve: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/catalog/retrieve`,
        activate: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/catalog/activate`,
        deactivate: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/catalog/deactivate`,
        upload: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/catalog/upload`,
        criteriaupload: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/criteria/upload`,
        regcode: {
            create: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/regcode/create`,
            update: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/regcode/update`,
            retrieve: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/regcode/retrieve`,
            activate: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/regcode/activate`,
            deactivate: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/regcode/deactivate`,
            detail: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/regchannel/retrievedetail`,
            retrievedetail: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/regcode/retrievedetail`,
        },
        member: {
            register: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/registration/register`,
            create: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/member/create`,
            update: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/member/update`,
            retrieve: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/member/retrieve`,
            activate: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/member/activate`,
            deactivate: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/member/deactivate`,
            delete: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/member/delete`,
        },
        criteria: {
            create: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/criteria/create`,
            update: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/criteria/update`,
            retrieve: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/criteria/retrieve`,
            delete: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/criteria/delete`,
        },
        bonusactivity: {
            create: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/bonusactivitycode/create`,
            update: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/bonusactivitycode/update`,
            retrieve: `${URL_SERVICE}/amala/newaccrual/promo/v1.2/bonusactivitycode/retrieve`,
        }
    },
    embed: {
        looker: `${URL_SERVICE}/amala/module/path/v1.2/dashboard/looker`,
        generate: `${URL_SERVICE}/amala/module/path/v1.2/dashboard/generate`,
        retrieveemailtype: URL_SERVICE + "/amala/mail/v1.0/email/retrieveemailtype"
    },
    worknotes: {
        update: URL_SERVICE + "/amala/mailing/order/integration/v1.2/worknote/update",
        detail: URL_SERVICE + "/amala/mailing/order/integration/v1.2/worknote/retrieve"
    },
    printing: {
        list: URL_SERVICE + "/amala/mailing/order/integration/printing/v1.2/integration/retrieve",
        create: URL_SERVICE + "/amala/mailing/order/integration/v1.2/printed/create",
        update: URL_SERVICE + "/amala/mailing/order/integration/printing/v1.2/integration/update",
        bulk: URL_SERVICE + "/amala/mailing/order/integration/printing/v1.2/integration/updatebulk",
        detail: URL_SERVICE + "/amala/mailing/order/integration/printing/v1.2/printed/retrievedetail",
        upload: URL_SERVICE + "/amala/mailing/order/integration/printing/v1.2/integration/upload",
        download: URL_SERVICE + "/amala/mailing/order/integration/printing/v1.2/integration/download"
    },
    delivery: {
        list: URL_SERVICE + "/amala/mailing/order/integration/delivered/v1.2/integration/retrieve",
        create: URL_SERVICE + "/amala/mailing/order/integration/v1.2/delivered/create",
        bulk: URL_SERVICE + "/amala/mailing/order/integration/delivered/v1.2/integration/update/bulk",
        update: URL_SERVICE + "/amala/mailing/order/integration/delivered/v1.2/integration/update",
        detail: URL_SERVICE + "/amala/mailing/order/integration/delivered/v1.2/retrievedetail",
        download: URL_SERVICE + "/amala/mailing/order/integration/delivered/v1.2/integration/download",
        upload: URL_SERVICE + "/amala/mailing/order/integration/delivered/v1.2/integration/upload",
    },
    packaging: {
        list: URL_SERVICE + "/amala/mailing/order/integration/packaging/v1.2/integration/retrieve",
        create: URL_SERVICE + "/amala/mailing/order/integration/v1.2/packed/create",
        update: URL_SERVICE + "/amala/mailing/order/integration/packaging/v1.2/integration/update",
        detail: URL_SERVICE + "/amala/mailing/order/integration/packaging/v1.2/packed/retrievedetail",
        bulk: URL_SERVICE + "/amala/mailing/order/integration/packaging/v1.2/integration/updatebulk",
        upload: URL_SERVICE + "/amala/mailing/order/integration/packaging/v1.2/integration/upload",
        download: URL_SERVICE + "/amala/mailing/order/integration/packaging/v1.2/integration/download",
    },
    reorder: {
        list: URL_SERVICE + "/amala/mailing/order/v1.2/reorder/retrieve",
        create: URL_SERVICE + "/amala/mailing/order/integration/v1.2/reorder/create",
        update: URL_SERVICE + "/amala/mailing/order/integration/v1.2/reorder/update",
        detail: URL_SERVICE + "/amala/mailing/order/v1.2/reorder/retrievedetail",
    },
    return: {
        list: URL_SERVICE + "/amala/mailing/order/v1.2/integration/retrieve",
        detail: URL_SERVICE + "/amala/mailing/order/v1.2/orderreturn/retrievedetail",
        create: URL_SERVICE + "/amala/mailing/order/v1.2/orderreturn/create",
        update: URL_SERVICE + "/amala/mailing/order/v1.2/integration/update",
        bulk: URL_SERVICE + "/amala/mailing/order/v1.2/integration/updatebulk",
    },
    memberlocked: {
        unlock: `${URL_SERVICE}/amala/member/profile/v1.2/memberlocked/account/unlock`,
        retrieve: `${URL_SERVICE}/amala/member/profile/v1.2/memberprofile/retrieve`
    },
    datasync: {
        list: URL_SERVICE + "/amala/sync-monitoring/v1.2/retrieve",
        check: URL_SERVICE + "/amala/sync-monitoring/v1.2/check",
        retry: URL_SERVICE + "/amala/sync-monitoring/v1.2/retry",
    }
});