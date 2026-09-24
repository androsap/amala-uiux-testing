import React from 'react';
import { Form, Layout, Alert, Modal, Typography } from 'antd';
import { Link } from 'react-router-dom';
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
		document.title = "Dashboard Report | Loyalty Management System";
	};

	showModal = () => {
		this.setState({ visible: true })
	}


	render() {
		const { visible } = this.state

		return (
			<Layout>
				<Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>

					<Modal visible={visible} footer={null} style={{ padding: 20 }}
						destroyOnClose={true} width={1000} onCancel={() => { this.setState({ visible: false }) }}>
						<Title level={3}>Information</Title><br />
						<Text strong>Only company account that has been submitted into Google account and given permission by administrator can access.</Text><br /><br />
						<Text>If you are still unable to access the page, try to do the following:</Text><br />
						<Text>1. Go to <a target="_blank" href="https://accounts.google.com/">Google Account</a></Text><br />
						<Text>2. Login using your company account</Text><br />
						<Text>3. Refresh dashboard on this page</Text><br />
					</Modal>

					<Alert type="info" showIcon closable={false} style={{ marginBottom: 30 }}
						message={<Text><Link to='#' className="btn-custom-transparent" onClick={this.showModal}>See Information</Link> if you are unable to access the dashboard.</Text>}
					/>

					<Iframe id='embeddedIframe'
						src="https://lookerstudio.google.com/embed/reporting/cfc8cadd-8cab-4986-a705-bc62c47f3aa0/page/p_jgy4kppyrc"
						width='100%' height={500} frameBorder={0} style="border:0" allowFullScreen
					/>
				</Layout.Content>
			</Layout>
		);
	}
}

export default Form.create()(App);