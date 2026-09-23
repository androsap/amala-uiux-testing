import React from 'react';
import { getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';
import { SelectBase } from '../Base/BaseComponent';
class StatusSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        const callback = (value) => {
            var options = value.split(',').map(key => {
                var result = {};
                result['label'] = key;
                result['value'] = key;
                return result
            });
            this.setState({ options, isLoading: false });
        }

        getGeneralConfig(general_config.member_status, callback);
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default StatusSelect;