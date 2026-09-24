import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import GenerateCard from '../../components/GenerateCard';
import moment from 'moment';

export default class Step5 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			memberid: props.enrollment.response.memberid,
			username: props.enrollment.response.username,
			email: props.enrollment.response.email,
			tiername: props.enrollment.response.tiername,
			nameoncard: props.enrollment.response.nameoncard,
			membersince: (props.enrollment.response.membersince !== null) ? moment(props.enrollment.response.membersince).format("MM/YY") : '',
			expireddate: (props.enrollment.response.expireddate !== null) ? moment(props.enrollment.response.expireddate).format("MM/YY") : '',
			urlcard: props.enrollment.response.urlcard,
			cardnumber: props.enrollment.response.cardnumber,
			loading: false
		};
	}

	handleResendEmail = () => {
		let email = this.state.email;
		let url = api.url.activation.resendemail;
		let data = { email };

		this.setState({ loading: true });
		DetailRequest(url, data).then((response) => {
			let { responsecode, responsemessage } = response.status;
			if (responsecode.substring(0, 1) === '0') {
				Alert.success(responsemessage);
			} else {
				Alert.error(responsemessage);
			}
			this.setState({ loading: false });
		});
	}

	render() {
		const { tiername, nameoncard, membersince, expireddate, cardnumber, username, email, urlcard, loading } = this.state;
		return (
			<div className="member-enroll">
				<form className="clearfix position-relative">
					<Loader value={loading} />
					<div className="row">
						<div className="col-md-6">
							<div className="content-title flex-hr mb-0 title-description">
								<h3 className="title-has-control mt-2">Summary</h3>
							</div>
							<hr className="mt-0" />
							<div className="row">
								<div className="col">
									<div className="row">
										<label className="col-sm-3 col-form-label">Card Number </label>
										<label className="col-sm-9 col-form-label">: {cardnumber} </label>
									</div>
									<div className="row">
										<label className="col-sm-3 col-form-label">Username </label>
										<label className="col-sm-9 col-form-label">: {username} </label>
									</div>
									<div className="row">
										<label className="col-sm-3 col-form-label">Email </label>
										<label className="col-sm-9 col-form-label">: {email} </label>
									</div>
									<div className="row mt-4">
										<label className="col-sm-12 col-form-label text-danger">If you don't receive email, you can resend email using this button </label>
										<div className="col-sm-12">
											<button type="button" title="Resend Email" className="btn btn-outline-dark btn-sm" onClick={() => this.handleResendEmail()}><i className="mdi mdi-email"></i> Resend Email</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="content-title flex-hr mb-0 title-description">
								<h3 className="title-has-control mt-2">Card</h3>
							</div>
							<hr className="mt-0" />
							<div className="row">
								<div className="col-md-6">
									<figure>
										<GenerateCard urlcard={urlcard} tiername={tiername} nameoncard={nameoncard} cardnumber={cardnumber} membersince={membersince} expireddate={expireddate} />
									</figure>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		)
	}
}