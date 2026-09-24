
import { RetrieveRequest, DetailRequest } from './RequestService';
import { api } from '../config/Services';
import Alert from '../components/Alert';

export function getOptionsDeactive(actionspage, options, code, name) {
    if (options.filter(({ value }) => value === code).length === 0 && actionspage !== 'create') {
        options.push({ label: name, value: code });
    }
    return options;
}

export function getOptionsNameOnCard(firstname, lastname, nameoncardcustom = null) {
    let optionsNameOnCard = [];

    let firstnameSeparate = firstname.split(" ");
    let lastnameSeparate = lastname.split(" ");

    let firstnameShort = [];
    let firstnamelength = firstname.split(" ").length;
    for (var i = 0; i < firstnamelength; i++) {
        firstnameShort[i] = firstnameSeparate[i].slice(0, 1);
    }

    let lastnameShort = [];
    let lastnamelength = lastname.split(" ").length;
    for (var j = 0; j < lastnamelength; j++) {
        lastnameShort[j] = lastnameSeparate[j].slice(0, 1);
    }

    if (firstname || lastname) {
        //options 1
        optionsNameOnCard[0] = firstname + " " + lastname;
        optionsNameOnCard[0] = optionsNameOnCard[0].substr(0, 24);
        //options 2
        optionsNameOnCard[1] = firstnameShort.join(" ") + " " + lastname;
        optionsNameOnCard[1] = optionsNameOnCard[1].substr(0, 24);
        //options 3
        optionsNameOnCard[2] = firstname + " " + lastnameShort.join(" ");
        if (optionsNameOnCard[2].length > 24) {
            firstname = firstname.substr(0, 22);
            optionsNameOnCard[2] = firstname + " " + lastnameShort.join(" ");
        }
        //options 4
        optionsNameOnCard[3] = (lastname) ? lastname + " " + firstname : firstname;
    } else {
        optionsNameOnCard[0] = (firstname) ? firstname : lastname;
    }
    //options 5
    optionsNameOnCard[4] = nameoncardcustom;

    return optionsNameOnCard;
}

export function getTravelerType(age) {
    let travelertype = null;
    if (age <= 2) {
        travelertype = 'INFANT';
    } else if (age > 2 && age <= 11) {
        travelertype = 'CHILD';
    } else {
        travelertype = 'ADULT';
    }

    return travelertype;
}

export function getGeneralConfig(key, callback, forReport) {
    let paging = {
        limit: -1,
        page: 1
    }
    let sort = {
        key: 'asc'
    };
    let active = true;
    // key = "%" + key + "%";
    let criteria = { key, active };
    let url = api.url.generalconfig.list;
    let column = [];
    RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
        const { status, result } = response || {};
        const { responsecode } = status || {};
        var value = null;
        var objRole = {};
        if (responsecode === '0000') {
            if (result.length > 0) {
                value = result[0].value;
                objRole = { 'key': key, 'value': value };
            }
        } else {
            Alert.error(status.responsemessage);
        }
        callback(forReport ? objRole : value);
    });
}

export function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function jsUcfirst(string, separator = null) {
    if (separator !== null) {
        let result = [];
        let splitChar = string.split(separator);
        for (const field in splitChar) {
            result[field] = splitChar[field].charAt(0).toUpperCase() + splitChar[field].slice(1).toLowerCase()
        }
        return result.join(" ");
    } else {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
}

export function jsCapitalEachWord(string) {
    var splitStr = string.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

export function validationPassword(value) {
    if (!value.match(/[a-z]/g)) {
        return "At least 1 lowercase character.";
    } else if (!value.match(/[A-Z]/g)) {
        return "At least 1 uppercase character.";
    } else if (!value.match(/[0-9]/g)) {
        return "At least 1 digit number.";
    } else if (!value.match(/[^a-zA-Z\d]/g)) {
        return "At least 1 special character.";
    } else if (value.length < 8) {
        return "Minimum 8 characters.";
    } else if (!value.match(/^\S*$/)) {
        return "There is no blank space allowed.";
    } else if (value.length < 8) {
        return "Minimum 8 characters.";
    }

    return null;
};

export function isArray(data, length) {
    let result = false;
    if (data) {
        if (typeof data === "object") {
            if (Array.isArray(data)) {
                if (typeof length === "number") {
                    if (data.length > length) {
                        result = true;
                    }
                } else {
                    result = true;
                }
            }
        }
    }
    return result;
};

export function formatMonthAcronym(month) {
    if (month === '01' || month === '1' || month === 'January' || month === 'JANUARY') {
        return 'Jan';
    } else if (month === '02' || month === '2' || month === 'February' || month === 'FEBRUARY ') {
        return 'Feb';
    } else if (month === '03' || month === '3' || month === 'March' || month === 'MARCH') {
        return 'Mar';
    } else if (month === '04' || month === '4' || month === 'April' || month === 'APRIL') {
        return 'Apr';
    } else if (month === '05' || month === '5' || month === 'May' || month === 'MAY') {
        return 'May';
    } else if (month === '06' || month === '6' || month === 'June' || month === 'JUNE') {
        return 'Jun';
    } else if (month === '07' || month === '7' || month === 'July' || month === 'JULY') {
        return 'Jul';
    } else if (month === '08' || month === '8' || month === 'August' || month === 'AUGUST') {
        return 'Aug';
    } else if (month === '09' || month === '9' || month === 'September' || month === 'SEPTEMBER') {
        return 'Sep';
    } else if (month === '10' || month === '10' || month === 'October' || month === 'OCTOBER') {
        return 'Oct';
    } else if (month === '11' || month === '11' || month === 'November' || month === 'NOVEMBER') {
        return 'Nov';
    } else {
        return 'Dec';
    }
};

export function removeNull(obj) {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, value]) => value != null)
            .map(([key, value]) => [
                key,
                value === Object(value) ? removeNull(value) : value,
            ]),
    );
};

export function JSONChecker(value) {
    if ((value === '{  }') || (value === '{ }') || (value === '{}')) {
        return false
    } else if (/^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return true
    } else return false
}

export function isEmptyObject(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
};

export function debounce(fn, ms) {
    let timer;
    return _ => {
        clearTimeout(timer);
        timer = setTimeout(_ => {
            timer = null;
            fn.apply(this, arguments);
        }, ms);
    };
};
