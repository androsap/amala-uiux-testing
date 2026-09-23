export function jsonCopy(data) {
    return data ? JSON.parse(JSON.stringify(data)) : null;
}

export function isObject(data, fix = false){
    let result = false;

    if(data){
        if(!isArray(data)) result = true
    }

    return result;
}

export function isArray(data, length){
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
}

export function decodeTokenComponent(value) {
    const buff = new Buffer(value, 'base64')
    const text = buff.toString('ascii')
    return JSON.parse(text)
}

export function distinct(data, field) {
    return Array.from(new Set(data.map(s => s[field]))).map(value => {
        return data.find(x => x[field] === value)
    });
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export var sorting = {
    desc: (data, field) => {
        return data.sort((a, b) => {
            const a1 = getFieldValue(a, field) ? getFieldValue(a, field).toUpperCase() : "";
            const b1 = getFieldValue(b, field) ? getFieldValue(a, field).toUpperCase() : "";
            return a1 < b1 ? 1 : -1;
        });
    },
    asc: (data, field) => {
        return data.sort((a, b) => {
            const a1 = getFieldValue(a, field) ? getFieldValue(a, field).toUpperCase() : "";
            const b1 = getFieldValue(b, field) ? getFieldValue(b, field).toUpperCase() : "";
            return a1 > b1 ? 1 : -1;
        })
    }
}

export function getFieldValue(arr, str) {
    if (!arr) return "";
    if (str.includes(".")) {
        return getFieldValue(arr[str.substring(0, str.indexOf("."))], str.substring(str.indexOf(".") + 1))
    }
    return arr ? arr[str] : null;
}

export function summary(data, field, isAmount) {
    const getField = (arr, str) => {
        if (!arr) return "";
        if (str.includes(".")) {
            return getField(arr[str.substring(0, str.indexOf("."))], str.substring(str.indexOf(".") + 1))
        }
        return arr ? arr[str] : null;
    }
    const result = data ? (data.length > 0 ? data.map(item => {
        return getField(item, field);
    }).reduce((total, num) => {
        return total + num;
    }) : 0) : 0;

    return isAmount ? formatCurrency(result) : result;
}

export function formatCurrency(value) {
    if (typeof value === "undefined") value = "0";
    value = value.toString();

    var dpos = value.indexOf(".");
    var nStrEnd = '';
    if (dpos !== -1) {
        nStrEnd = "." + value.substring(dpos + 1, value.length);
        value = value.substring(0, dpos);
    }

    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(value)) {
        value = value.replace(rgx, "$1,$2");
    }
    return `Rp. ${value}${nStrEnd}`;
}

export function camelize(text, separator) {
    // Assume separator is _ if no one has been provided.
    if (typeof (separator) === 'undefined') {
        separator = '-';
    }

    // Cut the string into words
    let words = text.split(separator);

    // Concatenate all capitalized words to get camelized string
    let result = '';
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        result += capitalizedWord;
    }
    return result;
}

export function validationRole(validationRules, labelText, form){
    //documentation example using validation component

    //function async
    //    async(rule, value, callback, source, options) => {
    //        throw new Error('Something wrong!');
    //    }

    //enum
    //example using `enum.["test1", "test2"]`

    //type
    //    string: Must be of type string. This is the default type.
    //    number: Must be of type number.
    //    boolean: Must be of type boolean.
    //    method: Must be of type function.
    //    regexp: Must be an instance of RegExp or a string that does not generate an exception when creating a new RegExp.
    //    integer: Must be of type number and an integer.
    //    float: Must be of type number and a floating point number.
    //    array: Must be an array as determined by Array.isArray.
    //    object: Must be of type object and not Array.isArray.
    //    date: Value must be valid as determined by Date
    //    url: Must be of type url.
    //    hex: Must be of type hex.
    //    email: Must be of type email.

    let validation = [];
    if (validationRules) {
        validationRules.forEach((item) => {
            if (typeof (item) === "string") {
                let valType = item.split(".");
                let validate = {
                    pattern: "",
                    type: ""
                };
                switch (valType[0]) {
                    case "required":
                        validation.push({ required: true, message: `${labelText} is Required` })
                        break;
                    case "min":
                        validation.push({ min: parseInt(valType[1]), message: `${labelText} min length ${valType[1]}` })
                        break;
                    case "max":
                        validation.push({ max: parseInt(valType[1]), message: `${labelText} max length ${valType[1]}` })
                        break;
                    case "len":
                        validation.push({ len: parseInt(valType[1]), message: `${labelText} len length ${valType[1]}` })
                        break;
                    case "pattern":
                        if (valType[1] === "alpha") validate = { pattern: new RegExp("^[A-Za-z ]*$"), type: "must be format Alphabet" };
                        else if (valType[1] === "phonenumber") validate = { pattern: new RegExp("^[+]?[0-9]*$"), type: "must be format Phone Number" };
                        else if (valType[1] === "alphanumber") validate = { pattern: new RegExp("^[A-Za-z0-9 ]*$"), type: "must be format Alphabet or Number" };
                        else if (valType[1] === "name") validate = { pattern: new RegExp("^[A-Za-z0-9 '-.]*$"), type: "must be format Alphabet or ' - ." };
                        else if (valType[1] === "number") validate = { pattern: new RegExp("^[0-9]*$"), type: "must be format Number" };
                        else if (valType[1] === "lowerspace") validate = { pattern: new RegExp("^[a-z0-9]*$"), type: "must be format Lowercase and without space" };
                        else if (valType[1] === "lowercase") validate = { pattern: new RegExp("^[a-z0-9 ]*$"), type: "must be format Lowercase" };
                        validation.push({ pattern: validate.pattern, message: `${labelText} ${validate.type}` })
                        break;
                    case "type":
                        validation.push({ type: valType[1], message: `${labelText} must be of type ${valType[1]}` })
                        break;
                    case "enum":
                        validation.push({ type: "enum", enum: JSON.parse(`${valType[1]}`), message: `${labelText} enum ${valType[1]}` })
                        break;
                    case "matching":
                        validation.push({ 
                            validator: (rule, value, callback) => {
                                if (value && value !== form.getFieldValue(valType[1])) {
                                    callback(`${labelText} must be matching with ${valType[1]}`);
                                } 
                                else {
                                    callback();
                                }
                            }
                        })
                        break;
                    default:
                }
            }
            else if (typeof (item) === "function") {
                validation.push({
                    validator: (rule, value, callback) => item(form, rule, value, callback)
                })
            }
        })
    }
    return validation;
}
