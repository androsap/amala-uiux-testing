import React, { Component } from 'react';

class GenerateCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			number: '',
			date: '',
			tier: '',
			imageUrl: ''
		};
	}

	// checkUrlExists(url) {
	// 	var http = new XMLHttpRequest();
	// 	http.open('HEAD', url, false);
	// 	http.send();
	// 	return http.status !== 404;
	// }

	// componentWillMount() {
	// 	let nameoncard = this.props.nameoncard ? this.props.nameoncard : '';
	// 	let cardnumber = this.props.cardnumber ? this.props.cardnumber : '';
	// 	let tiername = this.props.tiername ? this.props.tiername.toLowerCase() : '';
	// 	let urlcard = this.props.urlcard ? this.props.urlcard : '';

	// 	var targetImageUrl = urlcard;
	// 	let tiernameFinal = tiername.replace(" ", "_");

	// 	// let date = '';
	// 	// if (tiernameFinal === 'kids' || tiernameFinal === 'blue') {
	// 	// 	date = this.props.membersince ? this.props.membersince : '';
	// 	// } else date = this.props.expireddate ? this.props.expireddate : '';

	// 	let date = this.props.membersince;

	// 	this.setState({
	// 		name: nameoncard,
	// 		number: cardnumber,
	// 		date: date,
	// 		tier: tiernameFinal,
	// 		imageUrl: targetImageUrl
	// 	});
	// }

	// componentDidMount() {
	// 	const canvas = this.refs.canvas;
	// 	const ctx = canvas.getContext('2d');
	// 	const img = this.refs.image;

	// 	img.onload = () => {
	// 		ctx.drawImage(img, 0, 0);
	// 		ctx.font = "20px sans-serif";
	// 		ctx.fillStyle = "white";
	// 		ctx.fillText(this.state.name, 20, 190);
	// 		ctx.font = "bold 27px monospace";
	// 		ctx.fillText(this.state.number, 20, 220);
	// 		ctx.font = "20px monospace";
	// 		ctx.fillText(this.state.date, 110, 256);
	// 	}
	// }

	render() {
		const { membershipid, membersince } = this.props;

		if (this.props.urlcard) {
			const canvas = this.refs.canvas;
			const ctx = canvas.getContext('2d');
			const img = this.refs.image;

			img.onload = () => {
				ctx.drawImage(img, 0, 0, 445, 281);
				ctx.font = "20px sans-serif";
				ctx.fillStyle = "white";
				ctx.fillText(this.props.nameoncard, 20, 190);
				ctx.font = "bold 27px monospace";
				ctx.fillText(this.props.cardnumber, 20, 220);
				ctx.font = "20px monospace";
				ctx.fillText((membershipid === 'JUN') ? membersince : this.props.validthru, 110, 256);
			}
		}

		return (
			<div>
				<canvas ref="canvas" width={445} height={281} className="img-fluid" />
				<img ref="image" src=
					{
						this.props.urlcard
					} className="hidden" alt="template" />
			</div>
		)
	}
}

export default GenerateCard;