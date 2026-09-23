import {
    ENROLLMENT_SELECT_MEMBERSHIP,
    ENROLLMENT_SELECT_TIER,
    ENROLLMENT_SELECT_ENROLL_DATE,
    ENROLLMENT_SELECT_ENROLL_CHANNEL,
    ENROLLMENT_SELECT_IS_ENROLL_COBRAND,
    ENROLLMENT_SELECT_PARTNER,
    ENROLLMENT_SELECT_COBRAND,
    ENROLLMENT_SELECT_SALUTATION,
    ENROLLMENT_SELECT_TITLE,
    ENROLLMENT_SAVE_FIRSTNAME,
    ENROLLMENT_SAVE_LASTNAME,
    ENROLLMENT_SELECT_GENDER,
    ENROLLMENT_SELECT_DATEOFBIRTH,
    ENROLLMENT_SELECT_MINDATEOFBIRTH,
    ENROLLMENT_SELECT_MAXDATEOFBIRTH,
    ENROLLMENT_SELECT_NATIONALITY,
    ENROLLMENT_SELECT_RELIGION,
    ENROLLMENT_SELECT_LANGUAGE,
    ENROLLMENT_SAVE_PASSPORT_NUMBER,
    ENROLLMENT_SAVE_IDCARD_NUMBER,
    ENROLLMENT_SAVE_EMAIL,
    ENROLLMENT_SAVE_MOBILE_PHONE_NUMBER,
    ENROLLMENT_SELECT_MOBILE_PHONE_COUNTRY_CODE,
    ENROLLMENT_SELECT_PREFERRED_ADDRESS,
    ENROLLMENT_SAVE_PRIVATE_ADDRESS,
    ENROLLMENT_SAVE_POSTAL_CODE_ADDRESS_PRIVATE,
    ENROLLMENT_SELECT_COUNTRY_PRIVATE,
    ENROLLMENT_SELECT_PROVINCE_PRIVATE,
    ENROLLMENT_SELECT_CITY_PRIVATE,
    ENROLLMENT_SELECT_PHONE_COUNTRY_CODE_PRIVATE,
    ENROLLMENT_SAVE_REGION_PHONE_PRIVATE,
    ENROLLMENT_SELECT_FAX_COUNTRY_CODE_PRIVATE,
    ENROLLMENT_SAVE_REGION_FAX_PRIVATE,
    ENROLLMENT_SAVE_NUMBER_FAX_PRIVATE,
    ENROLLMENT_SAVE_NUMBER_PHONE_PRIVATE,
    ENROLLMENT_SAVE_COMPANY_NAME,
    ENROLLMENT_SAVE_DEPARTMENT,
    ENROLLMENT_SAVE_BUSINESS_ADDRESS,
    ENROLLMENT_SAVE_POSTAL_CODE_ADDRESS_BUSINESS,
    ENROLLMENT_SELECT_COUNTRY_BUSINESS,
    ENROLLMENT_SELECT_PROVINCE_BUSINESS,
    ENROLLMENT_SELECT_CITY_BUSINESS,
    ENROLLMENT_SELECT_PHONE_COUNTRY_CODE_BUSINES,
    ENROLLMENT_SAVE_REGION_PHONE_BUSINESS,
    ENROLLMENT_SAVE_NUMBER_PHONE_BUSINESS,
    ENROLLMENT_SELECT_FAX_COUNTRY_CODE_BUSINESS,
    ENROLLMENT_SAVE_REGION_FAX_BUSINESS,
    ENROLLMENT_SAVE_NUMBER_FAX_BUSINESS,
    ENROLLMENT_SELECT_HOBBIES,
    ENROLLMENT_SAVE_NAMEONCARD,
    ENROLLMENT_SAVE_CUSTOMNAMEONCARD,
    ENROLLMENT_SELECT_NAMEONCARD,
    ENROLLMENT_SAVE_USERNAME,
    ENROLLMENT_SAVE_CARDNUMBER,
    SET_ENROLLMENT_RESPONSE,
    ENROLLMENT_RESET_STORE
} from '../actions/ActionTypes';
import moment from 'moment';

const initialState = {
    membershipid: null,
    tier: null,
    enrolldate: moment(new Date()),
    enrollchannel: 'MOBILE',
    isenrollcobrand: null,
    partnercode: null,
    cobrandcode: null,
    salutation: null,
    title: null,
    firstname: '',
    lastname: '',
    cardnumber: null,
    gender: 'MALE',
    birthdate: null,
    minbirthdate: null,
    maxbirthdate: null,
    nationality: null,
    religion: null,
    language: null,
    passportno: '',
    idcardno: '',
    email: '',
    mobilephonecode: null,
    mobilephonenumber: '',
    preferredaddress: 'Private',
    privateaddress: '',
    privatepostalcode: '',
    privatecountry: null,
    privateprovince: null,
    privatecity: null,
    privatephonecode: null,
    privatephoneregion: '',
    privatephonenumber: '',
    privatefaxcode: null,
    privatefaxregion: '',
    privatefaxnumber: '',
    companyname: '',
    department: '',
    businessaddress: '',
    businesspostalcode: '',
    businesscountry: null,
    businessprovince: null,
    businesscity: null,
    businessphonecode: null,
    businessphoneregion: '',
    businessphonenumber: '',
    businessfaxcode: null,
    businessfaxregion: '',
    businessfaxnumber: '',
    hobbies: [],
    nameoncard: '',
    customnameoncard: null,
    selectednameoncard: null,
    username: '',
    enrollchannelist: [
        { value: 'MOBILE', label: 'MOBILE' },
        { value: 'WEBSITE', label: 'WEBSITE' },
        { value: 'BO', label: 'BO' },
        { value: 'CHECKIN', label: 'CHECK-IN' },
        { value: 'PARTNER', label: 'PARTNER' },
        { value: 'COBRAND', label: 'COBRAND' },
        { value: 'CHARITY', label: 'CHARITY' },
        { value: 'CORPORATE', label: 'CORPORATE' }
    ],
    genderlist: [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
        // { value: 'OTHERS', label: 'Others' }
    ],
    response: {
        memberid: null,
        username: null,
        email: null,
        tiername: null,
        nameoncard: null,
        cardnumber: null,
        membersince: null,
        expireddate: null,
        urlcard: null,
        carnumber: null
    }
}

const enrollmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case ENROLLMENT_RESET_STORE:
            return initialState
        case ENROLLMENT_SELECT_MEMBERSHIP:
            return {
                ...state,
                membershipid: action.payload.membershipid
            };
        case ENROLLMENT_SELECT_TIER:
            return {
                ...state,
                tier: action.payload.tier
            };
        case ENROLLMENT_SELECT_ENROLL_DATE:
            return {
                ...state,
                enrolldate: action.payload.enrolldate
            };
        case ENROLLMENT_SELECT_ENROLL_CHANNEL:
            return {
                ...state,
                enrollchannel: action.payload.enrollchannel
            };
        case ENROLLMENT_SELECT_IS_ENROLL_COBRAND:
            return {
                ...state,
                isenrollcobrand: action.payload.isenrollcobrand
            };
        case ENROLLMENT_SELECT_PARTNER:
            return {
                ...state,
                partnercode: action.payload.partnercode
            };
        case ENROLLMENT_SELECT_COBRAND:
            return {
                ...state,
                cobrandcode: action.payload.cobrandcode
            };
        case ENROLLMENT_SELECT_SALUTATION:
            return {
                ...state,
                salutation: action.payload.salutation
            };
        case ENROLLMENT_SELECT_TITLE:
            return {
                ...state,
                title: action.payload.title
            };
        case ENROLLMENT_SAVE_FIRSTNAME:
            return {
                ...state,
                firstname: action.payload.firstname
            };
        case ENROLLMENT_SAVE_LASTNAME:
            return {
                ...state,
                lastname: action.payload.lastname
            };
        case ENROLLMENT_SELECT_GENDER:
            return {
                ...state,
                gender: action.payload.gender
            };
        case ENROLLMENT_SELECT_DATEOFBIRTH:
            return {
                ...state,
                birthdate: action.payload.birthdate
            };
        case ENROLLMENT_SELECT_MINDATEOFBIRTH:
            return {
                ...state,
                minbirthdate: action.payload.minbirthdate
            };
        case ENROLLMENT_SELECT_MAXDATEOFBIRTH:
            return {
                ...state,
                maxbirthdate: action.payload.maxbirthdate
            };
        case ENROLLMENT_SELECT_NATIONALITY:
            return {
                ...state,
                nationality: action.payload.nationality
            };
        case ENROLLMENT_SELECT_RELIGION:
            return {
                ...state,
                religion: action.payload.religion
            };
        case ENROLLMENT_SELECT_LANGUAGE:
            return {
                ...state,
                language: action.payload.language
            };
        case ENROLLMENT_SAVE_PASSPORT_NUMBER:
            return {
                ...state,
                passportno: action.payload.passportno
            };
        case ENROLLMENT_SAVE_IDCARD_NUMBER:
            return {
                ...state,
                idcardno: action.payload.idcardno
            };
        case ENROLLMENT_SAVE_EMAIL:
            return {
                ...state,
                email: action.payload.email
            };
        case ENROLLMENT_SELECT_MOBILE_PHONE_COUNTRY_CODE:
            return {
                ...state,
                mobilephonecode: action.payload.mobilephonecode
            };
        case ENROLLMENT_SAVE_MOBILE_PHONE_NUMBER:
            return {
                ...state,
                mobilephonenumber: action.payload.mobilephonenumber
            };
        case ENROLLMENT_SELECT_PREFERRED_ADDRESS:
            return {
                ...state,
                preferredaddress: action.payload.preferredaddress
            };
        case ENROLLMENT_SAVE_PRIVATE_ADDRESS:
            return {
                ...state,
                privateaddress: action.payload.privateaddress
            };
        case ENROLLMENT_SAVE_POSTAL_CODE_ADDRESS_PRIVATE:
            return {
                ...state,
                privatepostalcode: action.payload.privatepostalcode
            };
        case ENROLLMENT_SELECT_COUNTRY_PRIVATE:
            return {
                ...state,
                privatecountry: action.payload.privatecountry
            };
        case ENROLLMENT_SELECT_PROVINCE_PRIVATE:
            return {
                ...state,
                privateprovince: action.payload.privateprovince
            };
        case ENROLLMENT_SELECT_CITY_PRIVATE:
            return {
                ...state,
                privatecity: action.payload.privatecity
            };
        case ENROLLMENT_SELECT_PHONE_COUNTRY_CODE_PRIVATE:
            return {
                ...state,
                privatephonecode: action.payload.privatephonecode
            };
        case ENROLLMENT_SAVE_REGION_PHONE_PRIVATE:
            return {
                ...state,
                privatephoneregion: action.payload.privatephoneregion
            };
        case ENROLLMENT_SAVE_NUMBER_PHONE_PRIVATE:
            return {
                ...state,
                privatephonenumber: action.payload.privatephonenumber
            };
        case ENROLLMENT_SELECT_FAX_COUNTRY_CODE_PRIVATE:
            return {
                ...state,
                privatefaxcode: action.payload.privatefaxcode
            };
        case ENROLLMENT_SAVE_REGION_FAX_PRIVATE:
            return {
                ...state,
                privatefaxregion: action.payload.privatefaxregion
            };
        case ENROLLMENT_SAVE_NUMBER_FAX_PRIVATE:
            return {
                ...state,
                privatefaxnumber: action.payload.privatefaxnumber
            };
        case ENROLLMENT_SAVE_COMPANY_NAME:
            return {
                ...state,
                companyname: action.payload.companyname
            };
        case ENROLLMENT_SAVE_DEPARTMENT:
            return {
                ...state,
                department: action.payload.department
            };
        case ENROLLMENT_SAVE_BUSINESS_ADDRESS:
            return {
                ...state,
                businessaddress: action.payload.businessaddress
            };
        case ENROLLMENT_SAVE_POSTAL_CODE_ADDRESS_BUSINESS:
            return {
                ...state,
                businesspostalcode: action.payload.businesspostalcode
            };
        case ENROLLMENT_SELECT_COUNTRY_BUSINESS:
            return {
                ...state,
                businesscountry: action.payload.businesscountry
            };
        case ENROLLMENT_SELECT_PROVINCE_BUSINESS:
            return {
                ...state,
                businessprovince: action.payload.businessprovince
            };
        case ENROLLMENT_SELECT_CITY_BUSINESS:
            return {
                ...state,
                businesscity: action.payload.businesscity
            };
        case ENROLLMENT_SELECT_PHONE_COUNTRY_CODE_BUSINES:
            return {
                ...state,
                businessphonecode: action.payload.businessphonecode
            };
        case ENROLLMENT_SAVE_REGION_PHONE_BUSINESS:
            return {
                ...state,
                businessphoneregion: action.payload.businessphoneregion
            };
        case ENROLLMENT_SAVE_NUMBER_PHONE_BUSINESS:
            return {
                ...state,
                businessphonenumber: action.payload.businessphonenumber
            };
        case ENROLLMENT_SELECT_FAX_COUNTRY_CODE_BUSINESS:
            return {
                ...state,
                businessfaxcode: action.payload.businessfaxcode
            };
        case ENROLLMENT_SAVE_REGION_FAX_BUSINESS:
            return {
                ...state,
                businessfaxregion: action.payload.businessfaxregion
            };
        case ENROLLMENT_SAVE_NUMBER_FAX_BUSINESS:
            return {
                ...state,
                businessfaxnumber: action.payload.businessfaxnumber
            };
        case ENROLLMENT_SELECT_HOBBIES:
            return {
                ...state,
                hobbies: action.payload.hobbies
            };
        case ENROLLMENT_SAVE_NAMEONCARD:
            return {
                ...state,
                nameoncard: action.payload.nameoncard
            };
        case ENROLLMENT_SAVE_CUSTOMNAMEONCARD:
            return {
                ...state,
                customnameoncard: action.payload.customnameoncard
            };
        case ENROLLMENT_SELECT_NAMEONCARD:
            return {
                ...state,
                selectednameoncard: action.payload.selectednameoncard
            };
        case ENROLLMENT_SAVE_USERNAME:
            return {
                ...state,
                username: action.payload.username
            };
        case ENROLLMENT_SAVE_CARDNUMBER:
            return {
                ...state,
                cardnumber: action.payload.cardnumber
            };
        case SET_ENROLLMENT_RESPONSE:
            return {
                response: {
                    memberid: (action.payload.response.id !== undefined) ? action.payload.response.id : null,
                    username: (action.payload.response.username !== undefined) ? action.payload.response.username : null,
                    email: (action.payload.response.email !== undefined) ? action.payload.response.email : null,
                    tiername: (action.payload.response.membertiers !== undefined && action.payload.response.membertiers[0] !== undefined && action.payload.response.membertiers[0].tiername !== undefined) ? action.payload.response.membertiers[0].tiername : null,
                    nameoncard: (action.payload.response.membercards !== undefined && action.payload.response.membercards[0] !== undefined && action.payload.response.membercards[0].nameoncard !== undefined) ? action.payload.response.membercards[0].nameoncard : null,
                    cardnumber: (action.payload.response.membercards !== undefined && action.payload.response.membercards[0] !== undefined && action.payload.response.membercards[0].cardnumber !== undefined) ? action.payload.response.membercards[0].cardnumber : null,
                    membersince: (action.payload.response.enrollmentdate !== undefined) ? action.payload.response.enrollmentdate : null,
                    expireddate: (action.payload.response.membercards !== undefined && action.payload.response.membercards[0] !== undefined && action.payload.response.membercards[0].expireddate !== undefined) ? action.payload.response.membercards[0].expireddate : null,
                    urlcard: (action.payload.response.membercards !== undefined && action.payload.response.membercards[0] !== undefined && action.payload.response.membercards[0].tiertemplatecard !== undefined) ? action.payload.response.membercards[0].tiertemplatecard : null,
                    carnumber: (action.payload.response.membercards !== undefined && action.payload.response.membercards[0] !== undefined && action.payload.response.membercards[0].cardnumber !== undefined) ? action.payload.response.membercards[0].cardnumber : null
                }
            }
        default:
            return state;
    }
}


export default enrollmentReducer;