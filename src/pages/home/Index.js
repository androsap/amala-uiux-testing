import React, { Component } from 'react';
import { getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';
import { Layout } from 'antd';
import ReactHtmlParser from 'react-html-parser';


const { Content } = Layout;

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			announcement: null
		}
	}

	componentDidMount() {
		document.title = "Dashboard | Loyalty Management System";

		const callbackShow = (show) => {
			if (show === 'true' || show === true) {
				const callback = (announcement) => {
					this.setState({ announcement });
				}
				getGeneralConfig(general_config.default_announcement, callback);
			}
		}
		getGeneralConfig(general_config.default_announcement_show, callbackShow);
	}

	render() {
		const { announcement } = this.state;
		const width = window.innerWidth;

		const isMobile = width <= 576;
		const isTablet = width > 576 && width <= 768;

		return (
			<React.Fragment>
				<Content
					style={{
						borderRadius: isMobile ? '8px' : '16px',
						margin: isMobile ? '12px 0' : isTablet ? '18px 0' : '24px 0',
						padding: isMobile ? '12px' : isTablet ? '16px' : '24px',
						minHeight: isMobile ? 'auto' : 500,
						background: '#fff',
						boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)',
						overflowX: 'auto',
						overflowY: 'hidden',
						WebkitOverflowScrolling: 'touch'
					}}
				>
					<div
						style={{
							overflowX: 'auto',
							width: '100%'
						}}
					>
						{ReactHtmlParser(announcement)}
					</div>
				</Content>
			</React.Fragment>
		)
	}
}

export default Home;