import React from 'react';
import { Form, Checkbox, Row, Col, Spin } from 'antd';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { Alert } from '../Base/BaseComponent';

class HobbiesCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            options: []
        }
    }

    retrieveData(criteria = {}, inactivefield = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { hobbiesname: 'asc' };
        let url = api.url.hobbies.list;
        criteria.active = true;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ loading: true });
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.hobbiesname;
                    result2['value'] = obj.hobbiesid;
                    return result2;
                });

                //if options deactive
                const { hobbiesid, hobbiesname } = inactivefield;
                if (hobbiesid) {
                    options = getOptionsDeactive(actionspage, options, hobbiesid, hobbiesname);
                }

                this.setState({ options, loading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            (this.props.validationrules).forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${this.props.labeltext} is Required` })
                            break;
                        default:
                    }
                }
                else if (typeof (item) === "function") {
                    validation.push({
                        validator: item
                    })
                }
            })
        }

        return validation;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { options, loading } = this.state;
        return (
            <Form.Item label={this.props.labeltext} className={this.props.className}>
                <Row type="flex" justify="center">
                    <Spin spinning={loading} size="small" tip="Loading..." />
                </Row>
                {getFieldDecorator(this.props.datafield, {
                    rules: this.validationRules(),
                    initialValue: this.props.initialvalue
                })(
                    <Checkbox.Group onChange={this.props.onChange}>
                        <Row>
                            {options.map((obj, key) => (
                                <Col span={6} key={key}>
                                    <Checkbox key={key} value={obj.value} disabled={this.props.disabled}>{obj.label}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>,
                )}
            </Form.Item>
        )
    }
}
export default HobbiesCheckbox;