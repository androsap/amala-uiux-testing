import React, { Component } from 'react';
import { Col, Row, Spin, Typography } from 'antd';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import { Alert, EmailVerifSkeleton } from '../../components/Base/BaseComponent';
import Error404 from '../error/Error404';

const { Title, Text } = Typography;

const ASSETS = {
	logo: 'https://amala-pdt.garuda-indonesia.com/assets/images/logoGA.png',
	illustration: 'https://amala-pdt.garuda-indonesia.com/assets/images/email-verify.png',
};

const CONFETTI_COLORS = ['#008295', '#202d5c', '#f5a623', '#4caf7d', '#7fd3df'];

class EmailVerified extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			verified: false
		};
	}

	componentDidMount() {
		document.title = 'Email Verified | Loyalty Management System';
		const memberid = this.props.match.params.ID;
		this.setState({ isLoading: true });

		DetailRequest(api.url.member.verifyemail, { memberid })
			.then((response) => {
				const { status } = response;
				const ok = status.responsecode === '0000';
				if (ok) Alert.success(status.responsemessage);
				this.setState({ isLoading: false, verified: ok });
			})
			.catch(() => {
				Alert.error('Something went wrong while verifying your email.');
				this.setState({ isLoading: false, verified: false });
			});
	}

	renderConfetti() {
		const pieces = [];
		for (let i = 0; i < 40; i++) {
			const left = Math.random() * 100;
			const size = 6 + Math.random() * 8;
			const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
			const delay = Math.random() * 6;
			const duration = 5 + Math.random() * 5;
			const rotate = Math.random() * 360;
			pieces.push(
				<span
					key={i}
					style={{
						position: 'absolute',
						top: '-20px',
						left: `${left}%`,
						width: size,
						height: size * 0.6,
						background: color,
						borderRadius: 2,
						opacity: 0.85,
						transform: `rotate(${rotate}deg)`,
						animation: `ev-confetti-fall ${duration}s linear ${delay}s infinite`
					}}
				/>
			);
		}
		return pieces;
	}

	render() {
		const { isLoading, verified } = this.state;
		const BG = '#f4f3ef';
		const styles = {
			page: {
				position: 'relative',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				background: BG,
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				padding: '40px 24px',
				boxSizing: 'border-box',
			},
			confettiLayer: {
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: 'none',
				zIndex: 0,
				overflow: 'hidden'
			},
			header: {
				position: 'relative',
				zIndex: 1,
				width: '100%',
				maxWidth: 1100,
				display: 'flex',
				alignItems: 'center'
			},
			headerLogo: { height: 48 },
			main: {
				position: 'relative',
				zIndex: 1,
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				maxWidth: 640,
				margin: '0 auto'
			},
			illustration: {
				width: 240,
				maxWidth: '70%',
				margin: '0 auto 32px',
				animation: 'ev-float 3.5s ease-in-out infinite'
			},
			eyebrow: {
				display: 'inline-flex',
				alignItems: 'center',
				gap: 8,
				color: '#008295',
				fontSize: 14,
				fontWeight: 700,
				letterSpacing: '0.15em',
				textTransform: 'uppercase',
				marginBottom: 16
			},
			dot: { width: 8, height: 8, borderRadius: '50%', background: '#008295' },
			title: {
				color: '#1d2b3a',
				fontSize: 48,
				fontWeight: 800,
				lineHeight: 1.1,
				margin: '0 0 20px'
			},
			subtitle: {
				color: '#5b6472',
				fontSize: 20,
				lineHeight: 1.5,
				margin: '0 0 36px'
			},
			button: {
				display: 'inline-flex',
				alignItems: 'center',
				gap: 10,
				background: '#202D5C',
				color: '#ffffff',
				fontSize: 18,
				fontWeight: 600,
				padding: '16px 40px',
				borderRadius: 12,
				textDecoration: 'none',
				boxShadow: '0 8px 24px #202d5c86'
			},
			footer: {
				position: 'relative',
				zIndex: 1,
				marginTop: 'auto',
				paddingTop: 48,
				opacity: 0.7
			},
		};

		const keyframes = `
			@keyframes ev-float {
				0%   { transform: translateY(0); }
				50%  { transform: translateY(-12px); }
				100% { transform: translateY(0); }
			}
			@keyframes ev-confetti-fall {
				0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
				10%  { opacity: 0.9; }
				100% { transform: translateY(105vh) rotate(360deg); opacity: 0.9; }
			}
		`;

		if (isLoading) {
			return <EmailVerifSkeleton />
		} else return <>
			{
				(verified) ? <div style={styles.page}>
					<style>{keyframes}</style>

					{verified && !isLoading && (
						<div style={styles.confettiLayer}>{this.renderConfetti()}</div>
					)}

					<div style={styles.header}>
						<img src={ASSETS.logo} alt="Garuda Indonesia" style={styles.headerLogo} />
					</div>

					<Spin spinning={isLoading}>
						{!isLoading && (
							<div style={styles.main}>
								{(
									<>
										<img src={ASSETS.illustration} alt="" style={styles.illustration} />
										<span style={styles.eyebrow}>
											<span style={styles.dot} /> Email Verified
										</span>
										<h1 style={styles.title}>You're verified. Let's fly.</h1>
										<p style={styles.subtitle}>
											Your email address has been confirmed and your account is now
											active. You're all set to book your next journey with Garuda
											Indonesia.
										</p>
										<a href="https://www.garuda-indonesia.com" style={styles.button}>
											Go to Website →
										</a>
									</>
								)}
							</div>
						)}
					</Spin>

					<div style={styles.footer}>
						<Row type="flex" justify="center" style={{ padding: "0 16px" }}>
							<Col xs={24} >
								<Row type="flex" justify="center" style={{ marginTop: 20 }}>
									<div style={{ height: 1, width: 240, background: "rgba(32, 45, 92, 0.3)" }} />
								</Row>

								<Row type="flex" justify="center" align="middle" style={{ marginTop: 24, marginBottom: 32 }}>
									<Text style={{ color: "#6B7280", fontSize: "clamp(8px, 3.5vw, 10px)", fontWeight: 600, marginLeft: 6 }}>Copyright © {new Date().getFullYear()}. Powered by</Text>
									<img src="https://amala.garuda-indonesia.com/assets/images/logo.png" alt="PT. Aero System Indonesia" style={{ height: 16, width: "auto" }} />
								</Row>
							</Col>
						</Row>
					</div>
				</div> : <Error404 />
			}
		</>

	}
}

export default EmailVerified;