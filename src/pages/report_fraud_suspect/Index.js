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
        document.title = "Fraud Suspect Report | Loyalty Management System";
        // this.getOneTimeToken();
    }

    showModal = () => {
        this.setState({ visible: true })
    }
    // getOneTimeToken = () => {
    //     fetch(`${api.url.embed.generate}?token=${getIdToken()}`)
    //         .then((response) => { return response.json() })
    //         .then((json) => {
    //             const { status, result } = json || {};
    //             const { responsecode, responsemessage } = status || {};
    //             if (responsecode === '0000') {
    //                 let message = (responsemessage) ? responsemessage : message;
    //                 this.setState({ oneTimeToken: result })
    //             } else {
    //                 Alert.error(responsemessage);
    //             }
    //         })
    // }

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
                            src="https://lookerstudio.google.com/embed/reporting/48ddebd9-03d8-4d08-8a7e-c68694f2030b/page/p_tku5yqn73c"
                            width='100%' height={500} frameBorder={0} style="border:0" allowFullScreen
                        />
                    </Layout.Content>
                </Layout>
            </React.Fragment>

        );
    }
}

export default Form.create()(App);
