import React from 'react';
import { SelectBase, Alert } from '../Base/BaseComponent';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';

class ChannelSelect extends React.Component {
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
        let url = api.url.channel.list;
        let active = true;
        this.setState({ isLoading: true });
        RetrieveRequest(url, { active }, {}, [], {}, {}).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                var options = result.map(({ channelid, channelname }) => {
                    return {
                        label: channelname,
                        value: channelid
                    };
                });

                this.setState({ options, isLoading: false, data: result })
            } else Alert.error(status.responsemessage);

        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }

}

export default ChannelSelect;