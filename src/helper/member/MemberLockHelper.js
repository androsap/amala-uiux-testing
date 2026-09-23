import BaseCrudHelper from "../BaseCrudHelper";
import { api } from "../../config/Services";

class IndexHelper extends BaseCrudHelper {
    static url = api.url.memberlock.main;

    static create(data, callback) {
        return this.create(`create`, data, callback)
    }

    static update(data, callback) {
        return this.update(`update`, data, callback)
    }

    static retrieve({
        paging = { limit: -1, page: 1 },
        criteria = {},
        sort = {},
        column = []
    }, callback) {

        return super.retrieve(`retrieve`, {
            paging,
            parameter: {
                column,
                criteria,
                sort
            },
        }, callback)
    }
}

export default IndexHelper;