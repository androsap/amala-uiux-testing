import React from 'react';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Select, Form } from 'antd';

const { Option } = Select;

class RelatedPromotionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false,
            data: []
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData = () => {
            let url = api.url.redemptionpromo.catalog.list;
            this.setState({ isLoading: true });
            RetrieveRequest(url, { ischildpromotion:true }, {}, [], {}, {}).then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    //remapping for base option select2
                    this.setState({
                        data: response.result
                    });

                    var options = response.result.map(({ promocatalogcode, catalogname }) => {
                        return {
                            label: catalogname,
                            value: promocatalogcode
                        };
                    });
                    this.setState({ options: options, isLoading: false })

                } else {
                    Alert.error(response.status.responsemessage);
                }
            });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let labelPosition = (this.props.labelCol || this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition} style={this.props.style}>
                {getFieldDecorator(this.props.datafield, {
                    initialValue: this.props.defaultValue
                })(
                    <Select showSearch mode={this.props.mode} loading={this.props.isLoading} optionFilterProp="children" placeholder={"Choose " + (this.props.labeltext || this.props.placeholder)} onChange={this.onChange} allowClear={true} disabled={this.props.disabled}>
                        {this.state.options.map((obj, key) => (
                            <Option key={key} value={obj.value} title={obj.label}>{obj.label}</Option>
                        ))}
                    </Select>,
                )}
            </Form.Item>
        )
    }

}

export default RelatedPromotionSelect;
