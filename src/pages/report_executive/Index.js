import React from 'react';
import { Form, Layout, Alert, Modal, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { DashboardInformation } from '../../components/Partials';
import Iframe from 'react-iframe';

const { Title, Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    componentDidMount = async () => {
        document.title = "Executive Report | Loyalty Management System";
    };

    showModal = () => {
        this.setState({ visible: true })
    }


    render() {
        const { visible } = this.state
        return (
            <React.Fragment>
                <Alert type="info" showIcon closable={false} style={{ marginBottom: 30 }}
                    message={<Text><Link to='#' className="btn-custom-transparent" onClick={this.showModal}>See Information</Link> if you are unable to access the dashboard.</Text>}
                />                
                <Modal visible={visible} footer={null} style={{ padding: 20 }}
                    destroyOnClose={true} width={1000} onCancel={() => { this.setState({ visible: false }) }}>
                    <Title level={3}>Informations</Title><br />
                    <DashboardInformation />
                </Modal>

                <Layout>
                    <Layout.Content style={{ minHeight: 500, background: '#fff' }}>
                        <Iframe id='embeddedIframe'
                            src="https://lookerstudio.google.com/embed/reporting/da2e9386-ca74-43f9-ac27-71a09ffbe0b1/page/yfhcC"
                            width='100%' height={500} frameBorder={0} style="border:0" allowFullScreen
                        />
                    </Layout.Content>
                </Layout>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);