import React from 'react';
import { getOptionsDeactive } from '../../utilities/Helpers';
import { Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Select, Form } from 'antd';

const { Option } = Select;

class OriDesSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            optionsOrigin: [],
            optionsDestination: []
        }
    }

    retrieveData(criteria = {}, fieldinactive = {}, actionspage = 'create') {
        let paging = { limit: -1, page: 1 }
        let sort = { cityname: 'asc' };
        let url = api.url.airport.list;
        criteria.active = true;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.cityname + " (" + obj.airportiatacode + "), " + obj.airportname;
                    result2['value'] = obj.airportiatacode;
                    return result2;
                });

                //origin
                // let { originairport, origincityname, originairportname } = catchfield;
                let { originairport, origincityname, originairportname } = fieldinactive;
                let optionsOrigin = [...options];
                let oriAirportLabel = origincityname + " (" + originairport + "), " + originairportname;
                if (originairport) {
                    optionsOrigin = getOptionsDeactive(actionspage, optionsOrigin, originairport, oriAirportLabel);
                }
                //destination
                // let { destinationairport, destinationcityname, destinationairportname } = catchfield;
                let { destinationairport, destinationcityname, destinationairportname } = fieldinactive;
                let optionsDestination = [...options];
                let desAirportLabel = destinationcityname + " (" + destinationairport + "), " + destinationairportname;
                if (destinationairport) {
                    optionsDestination = getOptionsDeactive(actionspage, optionsDestination, destinationairport, desAirportLabel);
                }

                this.setState(prevState => ({
                    options,
                    optionsOrigin,
                    optionsDestination,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, airport: false }
                }));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    validationRules = (type) => {
        let validateori = (this.props.validationrules[0]) ? this.props.validationrules[0] : '';
        let validatedes = (this.props.validationrules[1]) ? this.props.validationrules[1] : '';
        let labelorigin = (this.props.labeltext[0]) ? this.props.labeltext[0] : 'Origin';
        let labeldestination = (this.props.labeltext[1]) ? this.props.labeltext[1] : 'Destination';
        let validation = [];
        if (this.props.validationrules) {
            if (type === 'ori') {
                switch (validateori) {
                    case "required":
                        validation.push({ required: true, message: `${labelorigin} is Required` })
                        break;
                    default:
                }
            } else if (type === 'des') {
                switch (validatedes) {
                    case "required":
                        validation.push({ required: true, message: `${labeldestination} is Required` })
                        break;
                    default:
                }
            }
        }

        return validation;
    }

    handleFilterOriginDestination = (type, value) => {
        let temp = [];
        this.state.options.forEach(obj => {
            if (value !== obj.value) temp.push(obj);
        });
        if (type === 'origin') this.setState({ optionsDestination: temp });
        else if (type === 'destination') this.setState({ optionsOrigin: temp });
    }

    handleOriginChange = (event) => {
        this.setState({ event });
        if (this.props.custom === 'routetype') this.props.originChange(event)

        this.handleFilterOriginDestination('origin', event);
    }

    handlDestinationChange = (event) => {
        this.setState({ event });
        if (this.props.custom === 'routetype') this.props.destinationChange(event)

        this.handleFilterOriginDestination('destination', event);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { optionsOrigin, optionsDestination } = this.state;
        let labelorigin = (this.props.labeltext[0]) ? this.props.labeltext[0] : 'Origin';
        let labeldestination = (this.props.labeltext[1]) ? this.props.labeltext[1] : 'Destination';
        let datafieldori = (this.props.datafield[0]) ? this.props.datafield[0] : 'originairport';
        let datafielddes = (this.props.datafield[1]) ? this.props.datafield[1] : 'destinationairport';
        return (
            <React.Fragment>
                <Form.Item label={labelorigin}>
                    {getFieldDecorator(datafieldori, {
                        rules: this.validationRules('ori')
                    })(
                        <Select showSearch optionFilterProp="children" labeltext={this.props.labeltext} placeholder={"Choose " + labelorigin} onChange={this.handleOriginChange} allowClear={true} disabled={this.props.disabled}>
                            {optionsOrigin.map((obj, key) => (
                                <Option key={key} value={obj.value}>{obj.label}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={labeldestination}>
                    {getFieldDecorator(datafielddes, {
                        rules: this.validationRules('des')
                    })(
                        <Select showSearch optionFilterProp="children" labeltext={this.props.labeltext} placeholder={"Choose " + labeldestination} onChange={this.handlDestinationChange} allowClear={true} disabled={this.props.disabled}>
                            {optionsDestination.map((obj, key) => (
                                <Option key={key} value={obj.value}>{obj.label}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            </React.Fragment>
        )
    }

}

export default OriDesSelect;