import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import Chart from '../../components/Chart';
// import Breadcrumb from '../../components/Breadcrumb';
// import News from '../../components/News';
import { Button } from '../../components/Base/BaseComponent';
import { Typography, Card, Empty, Row, Col, Statistic, Icon, Modal } from 'antd';
// import { getGeneralConfig } from '../../utilities/Helpers';
// import { general_config } from '../../utilities/Constant';
// import ReactHtmlParser from 'react-html-parser';
// import DashboardItem from '../../components/DashboardItem';
import EnrollmentMemberInformation from './enrollment_member_information/Index';
// import Flight from './flight/Index';
// import PromoCode from './promo_code/Index';
// import NonAirActivity from './non_air_activity/Index'
// import ActivityCorporate from './activity_corporate/Index'
// import MemberTier from './member_tier/Index';
// import MemberActivity from './member_activity/Index';
// import Redemption from './redemption/Index';


const { Title } = Typography;

class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			announcement: null,
			enrChannelData: null,
			titleModal: ''
		}
	}

	componentDidMount() {
		document.title = "Dashboard | Loyalty Management System";

		// /* Default announcement show */
		// const callbackShow = (show) => {
		// 	if (show === 'true' || show === true) {
		// 		/* Default announcement */
		// 		const callback = (announcement) => {
		// 			this.setState({ announcement });
		// 		}
		// 		getGeneralConfig(general_config.default_announcement, callback);
		// 	}
		// }
		// getGeneralConfig(general_config.default_announcement_show, callbackShow);
	}

	showModal = () => {
		this.setState({ visible: true });
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	callbackFunction = (childData) => {
		this.setState({ enrChannelData: childData }
		)
	};

	setTitleModal = (titleModal) => {
		this.setState({ titleModal });
	}

	render() {
		// const { announcement } = this.state;
		const { enrChannelData, visible } = this.state;
		return (
			<React.Fragment>
				<Row gutter={24} style={{ marginBottom: 16 }}>
					<Modal title={this.setTitleModal} visible={visible} onCancel={this.handleCancel} footer={null} width={960} destroyOnClose={true}>
						<EnrollmentMemberInformation pageType="modal" />
					</Modal>
					<Col span={12}>
						<Card title="Enrollment Member"
							style={{ boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}
							extra={<a href="#">
								<Button htmlType="button" title="Reset" icon="redo" onClick={this.handleReset} />
								<Button htmlType="button" title="Expand Data" icon="arrows-alt" onClick={this.showModal} />
							</a>}>
							<EnrollmentMemberInformation pageType="main" />
						</Card>
					</Col>

					{/* <Col span={8}>
						<DashboardItem title="Enrollment Member" enrChannelData={enrChannelData}>
							<EnrollmentMemberInformation parentCallback={this.callbackFunction} />
						</DashboardItem>
					</Col> */}
					{/* <Col span={8}>
						<DashboardItem title="Flight" >
							<Flight/>
						</DashboardItem>
					</Col>
					<Col span={8}>
						<DashboardItem title="Promo Code">
							<PromoCode/>
						</DashboardItem>
					</Col> */}
				</Row>

				{/* <Row gutter={16} style={{ marginBottom: 16 }}>
					<Col span={12}>
						<DashboardItem title="Non - Air Activity">
							<NonAirActivity/>
						</DashboardItem>
					</Col>
					<Col span={12}>
						<DashboardItem title="Corporate Activity">
							<ActivityCorporate/>
						</DashboardItem>
					</Col>
				</Row>

				<Row gutter={16} style={{ marginBottom: 16 }}>
					<Col span={8}>
						<DashboardItem title="Member Tier">
							<MemberTier/>
						</DashboardItem>

					</Col>
					<Col span={8}>
						<DashboardItem title="Member Activity">
							<MemberActivity/>
						</DashboardItem>
					</Col>
					<Col span={8}>
						<DashboardItem title="Redemption">
							<Redemption/>
						</DashboardItem>
					</Col>
				</Row> */}
				{/* {ReactHtmlParser(announcement)} */}
			</React.Fragment>
		)
	}
}

export default Layout;