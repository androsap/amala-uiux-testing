import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import RadioButton from './RadioButton';

class CategoryTypeAwardTypeRadioButton extends RadioButton {
    dataSource = function (callback) {
        let paging = { limit: -1, page: 1 }
        let sort = { categorytype: 'asc' };
        let criteria = {}
        let url = api.url.awardtype.categorytype;
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
            valueexpr: "categorytype",
            displayexpr: "categorytype",
            disabled: this.props.disabled,
            onChange: this.props.onChange
        },
        validationrules: ["required"]
    }

}

export default CategoryTypeAwardTypeRadioButton;