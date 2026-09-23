import React, { Component } from 'react';
import { Alert, Icon } from 'antd';
import moment from 'moment';

class App extends Component {
    render() {
        const { memberlock } = this.props;

        if(!memberlock) return null;

        const { reason, startdate } = memberlock || {};

        return <Alert
            message="Member is Locked"
            description={`${reason}. Start from ${moment(startdate).format("DD MMM YYYY HH:mm:ss")}. Please contact your administrator.`}
            type="error"
            style={{ marginBottom: 20 }}
            icon={<Icon type="lock" style={{ marginTop: 5 }} />}
            showIcon
        />
    }
}

export default App;