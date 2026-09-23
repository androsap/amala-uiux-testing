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
} from './ActionTypes';

export const resetStore = () => ({
    type: ENROLLMENT_RESET_STORE,
    payload: {}
});

export const selectMembership = (membershipid) => ({
    type: ENROLLMENT_SELECT_MEMBERSHIP,
    payload: {
        membershipid
    }
});

export const selectTier = (tier) => ({
    type: ENROLLMENT_SELECT_TIER,
    payload: {
        tier
    }
});

export const selectEnrollDate = (enrolldate) => ({
    type: ENROLLMENT_SELECT_ENROLL_DATE,
    payload: {
        enrolldate
    }
});

export const selectEnrollChannel = (enrollchannel) => ({
    type: ENROLLMENT_SELECT_ENROLL_CHANNEL,
    payload: {
        enrollchannel
    }
});

export const selectIsEnrollCobrand = (isenrollcobrand) => ({
    type: ENROLLMENT_SELECT_IS_ENROLL_COBRAND,
    payload: {
        isenrollcobrand
    }
});

export const selectPartner = (partnercode) => ({
    type: ENROLLMENT_SELECT_PARTNER,
    payload: {
        partnercode
    }
});

export const selectCobrand = (cobrandcode) => ({
    type: ENROLLMENT_SELECT_COBRAND,
    payload: {
        cobrandcode
    }
});

export const selectSalutation = (salutation) => ({
    type: ENROLLMENT_SELECT_SALUTATION,
    payload: {
        salutation
    }
});

export const selectTitle = (title) => ({
    type: ENROLLMENT_SELECT_TITLE,
    payload: {
        title
    }
});

export const saveFirstName = (firstname) => ({
    type: ENROLLMENT_SAVE_FIRSTNAME,
    payload: {
        firstname
    }
});

export const saveLastName = (lastname) => ({
    type: ENROLLMENT_SAVE_LASTNAME,
    payload: {
        lastname
    }
});

export const selectGender = (gender) => ({
    type: ENROLLMENT_SELECT_GENDER,
    payload: {
        gender
    }
});

export const selectDateOfBirth = (birthdate) => ({
    type: ENROLLMENT_SELECT_DATEOFBIRTH,
    payload: {
        birthdate
    }
});

export const selectMinDateOfBirth = (minbirthdate) => ({
    type: ENROLLMENT_SELECT_MINDATEOFBIRTH,
    payload: {
        minbirthdate
    }
});

export const selectMaxDateOfBirth = (maxbirthdate) => ({
    type: ENROLLMENT_SELECT_MAXDATEOFBIRTH,
    payload: {
        maxbirthdate
    }
});

export const selectNationality = (nationality) => ({
    type: ENROLLMENT_SELECT_NATIONALITY,
    payload: {
        nationality
    }
});

export const selectReligion = (religion) => ({
    type: ENROLLMENT_SELECT_RELIGION,
    payload: {
        religion
    }
});

export const selectLanguage = (language) => ({
    type: ENROLLMENT_SELECT_LANGUAGE,
    payload: {
        language
    }
});

export const savePassportNumber = (passportno) => ({
    type: ENROLLMENT_SAVE_PASSPORT_NUMBER,
    payload: {
        passportno
    }
});

export const saveIdCardNumber = (idcardno) => ({
    type: ENROLLMENT_SAVE_IDCARD_NUMBER,
    payload: {
        idcardno
    }
});

export const saveEmail = (email) => ({
    type: ENROLLMENT_SAVE_EMAIL,
    payload: {
        email
    }
});

export const selectMobilePhoneCode = (mobilephonecode) => ({
    type: ENROLLMENT_SELECT_MOBILE_PHONE_COUNTRY_CODE,
    payload: {
        mobilephonecode
    }
});

export const saveMobilePhoneNumber = (mobilephonenumber) => ({
    type: ENROLLMENT_SAVE_MOBILE_PHONE_NUMBER,
    payload: {
        mobilephonenumber
    }
});

export const selectPreferredAddress = (preferredaddress) => ({
    type: ENROLLMENT_SELECT_PREFERRED_ADDRESS,
    payload: {
        preferredaddress
    }
});

export const savePrivateAddress = (privateaddress) => ({
    type: ENROLLMENT_SAVE_PRIVATE_ADDRESS,
    payload: {
        privateaddress
    }
});

export const savePrivatePostalCode = (privatepostalcode) => ({
    type: ENROLLMENT_SAVE_POSTAL_CODE_ADDRESS_PRIVATE,
    payload: {
        privatepostalcode
    }
});

export const selectPrivateCountry = (privatecountry) => ({
    type: ENROLLMENT_SELECT_COUNTRY_PRIVATE,
    payload: {
        privatecountry
    }
});

export const selectPrivateProvince = (privateprovince) => ({
    type: ENROLLMENT_SELECT_PROVINCE_PRIVATE,
    payload: {
        privateprovince
    }
});

export const selectPrivateCity = (privatecity) => ({
    type: ENROLLMENT_SELECT_CITY_PRIVATE,
    payload: {
        privatecity
    }
});

export const selectPrivatePhoneCode = (privatephonecode) => ({
    type: ENROLLMENT_SELECT_PHONE_COUNTRY_CODE_PRIVATE,
    payload: {
        privatephonecode
    }
});

export const savePrivatePhoneRegion = (privatephoneregion) => ({
    type: ENROLLMENT_SAVE_REGION_PHONE_PRIVATE,
    payload: {
        privatephoneregion
    }
});

export const savePrivatePhoneNumber = (privatephonenumber) => ({
    type: ENROLLMENT_SAVE_NUMBER_PHONE_PRIVATE,
    payload: {
        privatephonenumber
    }
});

export const selectPrivateFaxCode = (privatefaxcode) => ({
    type: ENROLLMENT_SELECT_FAX_COUNTRY_CODE_PRIVATE,
    payload: {
        privatefaxcode
    }
});

export const savePrivateFaxRegion = (privatefaxregion) => ({
    type: ENROLLMENT_SAVE_REGION_FAX_PRIVATE,
    payload: {
        privatefaxregion
    }
});

export const savePrivateFaxNumber = (privatefaxnumber) => ({
    type: ENROLLMENT_SAVE_NUMBER_FAX_PRIVATE,
    payload: {
        privatefaxnumber
    }
});

export const saveCompanyName = (companyname) => ({
    type: ENROLLMENT_SAVE_COMPANY_NAME,
    payload: {
        companyname
    }
});

export const saveDepartment = (department) => ({
    type: ENROLLMENT_SAVE_DEPARTMENT,
    payload: {
        department
    }
});

export const saveBusinessAddress = (businessaddress) => ({
    type: ENROLLMENT_SAVE_BUSINESS_ADDRESS,
    payload: {
        businessaddress
    }
});

export const saveBusinessPostalCode = (businesspostalcode) => ({
    type: ENROLLMENT_SAVE_POSTAL_CODE_ADDRESS_BUSINESS,
    payload: {
        businesspostalcode
    }
});

export const selectBusinessCountry = (businesscountry) => ({
    type: ENROLLMENT_SELECT_COUNTRY_BUSINESS,
    payload: {
        businesscountry
    }
});

export const selectBusinessProvince = (businessprovince) => ({
    type: ENROLLMENT_SELECT_PROVINCE_BUSINESS,
    payload: {
        businessprovince
    }
});

export const selectBusinessCity = (businesscity) => ({
    type: ENROLLMENT_SELECT_CITY_BUSINESS,
    payload: {
        businesscity
    }
});

export const selectBusinessPhoneCode = (businessphonecode) => ({
    type: ENROLLMENT_SELECT_PHONE_COUNTRY_CODE_BUSINES,
    payload: {
        businessphonecode
    }
});

export const saveBusinessPhoneRegion = (businessphoneregion) => ({
    type: ENROLLMENT_SAVE_REGION_PHONE_BUSINESS,
    payload: {
        businessphoneregion
    }
});

export const saveBusinessPhoneNumber = (businessphonenumber) => ({
    type: ENROLLMENT_SAVE_NUMBER_PHONE_BUSINESS,
    payload: {
        businessphonenumber
    }
});

export const selectBusinessFaxCode = (businessfaxcode) => ({
    type: ENROLLMENT_SELECT_FAX_COUNTRY_CODE_BUSINESS,
    payload: {
        businessfaxcode
    }
});

export const saveBusinessFaxRegion = (businessfaxregion) => ({
    type: ENROLLMENT_SAVE_REGION_FAX_BUSINESS,
    payload: {
        businessfaxregion
    }
});

export const saveBusinessFaxNumber = (businessfaxnumber) => ({
    type: ENROLLMENT_SAVE_NUMBER_FAX_BUSINESS,
    payload: {
        businessfaxnumber
    }
});

export const selectHobbies = (hobbies) => ({
    type: ENROLLMENT_SELECT_HOBBIES,
    payload: {
        hobbies
    }
});

export const saveNameOnCard = (nameoncard) => ({
    type: ENROLLMENT_SAVE_NAMEONCARD,
    payload: {
        nameoncard
    }
});

export const saveCustomNameOnCard = (customnameoncard) => ({
    type: ENROLLMENT_SAVE_CUSTOMNAMEONCARD,
    payload: {
        customnameoncard
    }
});

export const selectNameOnCard = (selectednameoncard) => ({
    type: ENROLLMENT_SELECT_NAMEONCARD,
    payload: {
        selectednameoncard
    }
});

export const saveUsername = (username) => ({
    type: ENROLLMENT_SAVE_USERNAME,
    payload: {
        username
    }
});

export const saveCardNumber = (cardnumber) => ({
    type: ENROLLMENT_SAVE_CARDNUMBER,
    payload: {
        cardnumber
    }
});

export const setReponse = (response) => ({
    type: SET_ENROLLMENT_RESPONSE,
    payload: {
        response
    }
});




