import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import SelectBase from '../Base/SelectBase';

class CategoryAwardTypeSelect extends SelectBase {
    dataSource = function (criteria, callback) {
        let paging = { limit: -1, page: 1 }
        let sort = { categorytype: 'asc' };
        let url = api.url.awardtype.category;
        let column = [];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            let { result, status } = response;
            status = (status.responsecode.substring(0, 1) === '0') ? true : false;

            callback(status, result);
        });
    }

    configuration = {
        datafield: this.props.datafield,
        labeltext: this.props.labeltext,
        editoroptions: {
            datasource: this.dataSource,
            valueexpr: "categorycode",
            displayexpr: "categorycode"
        },
        validationrules: ["required"]
    }

}

export default CategoryAwardTypeSelect;