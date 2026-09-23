import React, { Component } from 'react';
import { Alert, Typography, Icon } from 'antd';

const { Text } = Typography;

class App extends Component {
    render() {
        return <React.Fragment>
            <Alert message="Information" type="info" showIcon style={{ marginBottom: 15 }}
                description={
                    <React.Fragment><Text strong>Only company account that has been submitted into Google account and given permission by administrator can access.</Text><br /><br />
                        <Text>If you are still unable to access the dashboard, try to do the following:</Text><br />
                        <Text>1. Go to the sign in page of <a target="_blank" href="https://accounts.google.com/">Google Account <Icon type="link" /></a></Text><br />
                        <Text>2. Login using your company account</Text><br />
                        <Text>3. Refresh dashboard on this page</Text><br />
                    </React.Fragment>}
            />
            <Alert
                message="Disclaimer" type="warning" showIcon
                description={
                    <React.Fragment>
                        <Text strong>Chrome is the default browser to access this report.</Text><br /><br />
                        <Text>If you need to use another browser, please set up the browser's privacy setting to allow <i>third-party cookies</i> before doing the above steps.</Text><br />
                    </React.Fragment>}
            />
        </React.Fragment>
    }
}

export default App;