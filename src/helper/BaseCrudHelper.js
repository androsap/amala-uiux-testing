import BaseHelper from "./BaseHelper";

class BaseCrudHelper extends BaseHelper {
    constructor(props){
        super(props);
    }

    static url = ""

    static create(url, data, callback) {
        return super.post(this.url + url, { parameter: data }, callback)
    }

    static update(url, data, callback) {
        return super.post(this.url + url, { parameter: data }, callback)
    }

    static delete(id, callback) {
        return super.delete(this.url + id, null, callback)
    }

    static detail(id, callback) {
        return super.get(this.url + id, null, callback)
    }

    static retrieve(url, data, callback) {
        return super.post(this.url+url, data, callback)
    }

    static list(callback) {
        return super.get(this.url, null, callback)
    }
}

export default BaseCrudHelper;
