import React from 'react';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class ChannelApplicationSelect extends React.Component {
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
        let url = api.url.channel.application.list;
        let active = true;
        this.setState({ isLoading: true });
        RetrieveRequest(url, {active}, {}, [], {}, {}).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                this.setState({
                    data: response.result
                });

                var options = response.result.map(({ channelapplicationid, application }) => {
                    return {
                        label: application,
                        value: channelapplicationid
                    };
                });
                this.setState({ options: options, isLoading: false })

            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default ChannelApplicationSelect;