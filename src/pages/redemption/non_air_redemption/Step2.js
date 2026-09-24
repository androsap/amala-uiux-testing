import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumb';
import Loader from '../../../components/Loader';
import moment from 'moment';
import { formatNumber } from '../../../utilities/Helpers';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            certificateid: '',
            awardcode: '',
            awardtype: '',
            totalprice: '',
            issueddate: '',
            freeaward: '',
            bookingcode: '',
            status: '',
            salutation: '',
            name: '',
            familyname: '',
            memberid: '',
            travelertype: '',
            selfusage: '',
            voucherimage: '',
            redeemvoucherdetail: [],
            canvassourcevoucher: [],
            cardnumber: null
        }
    }

    componentWillMount() {
        let vouchertext = [];
        let redeemvoucherdetail = this.props.redemption.responsebuyaward.redeemvoucherdetail;
        for (const field in redeemvoucherdetail) {
            if (vouchertext[redeemvoucherdetail[field].certificateid] === undefined) {
                vouchertext[redeemvoucherdetail[field].certificateid] = [];
            }
            vouchertext[redeemvoucherdetail[field].certificateid].push(redeemvoucherdetail[field]);
        }

        let voucherimage = this.props.redemption.responsebuyaward.voucherimage;

        //receipt details
        let redeemuser = this.props.redemption.responsebuyaward.redeemusers;
        let salutation = (redeemuser[0]['salutationcode']) ? redeemuser[0]['salutationcode'] : '-';
        let name = (redeemuser[0]['name']) ? redeemuser[0]['name'] : '-';
        let memberiduser = (redeemuser[0]['memberiduser']) ? redeemuser[0]['memberiduser'] : '-';
        let travelertype = (redeemuser[0]['travelertype']) ? redeemuser[0]['travelertype'] : '-';
        let familyname = (redeemuser[0]['familyname']) ? redeemuser[0]['familyname'] : '-';
        let selfusage = (redeemuser[0]['selfusage'] !== undefined) ? (redeemuser[0]['selfusage']) ? 'YES' : 'NO' : '-';


        let certificateid = (redeemuser[0]['certificateid']) ? redeemuser[0]['certificateid'] : '-';
        let status = (redeemuser[0]['status']) ? redeemuser[0]['status'] : '-';
        let awardcode = (this.props.redemption.responsebuyaward.awardcode) ? this.props.redemption.responsebuyaward.awardcode : '-';
        let awardtype = (this.props.redemption.responsebuyaward.awardtypename) ? this.props.redemption.responsebuyaward.awardtypename : '-';
        let totalprice = (this.props.redemption.responsebuyaward.totalprice !== undefined) ? this.props.redemption.responsebuyaward.totalprice : '-';
        let issueddate = (this.props.redemption.responsebuyaward.issueddate) ? moment(this.props.redemption.responsebuyaward.issueddate).format("DD/MM/YYYY") : '-';
        let freeaward = (this.props.redemption.responsebuyaward.freeaward && this.props.redemption.responsebuyaward.freeaward) ? 'YES' : 'NO';
        let bookingcode = (this.props.redemption.responsebuyaward.bookingcode) ? this.props.redemption.responsebuyaward.bookingcode : '-';
        let cardnumber = (this.props.redemption.responsebuyaward.cardnumber) ? this.props.redemption.responsebuyaward.cardnumber : '-';

        this.setState({
            certificateid, awardcode, awardtype, totalprice, issueddate, freeaward,
            bookingcode, status, salutation, name, familyname,
            memberid: memberiduser,
            travelertype, selfusage, voucherimage,
            redeemvoucherdetail: vouchertext,
            canvassourcevoucher: [],
            cardnumber
        });
    }

    saveAction = (e) => {
        alert(1)
    };

    getvoucher(ctx, voucherimage, data) {
        var myImg = new Image();
        myImg.onload = function () {
            ctx.drawImage(myImg, 0, 0);
            for (const field in data) {
                ctx.font = data[field].size + 'px ' + data[field].font;
                ctx.fillStyle = data[field].color;
                data[field].positionx = data[field].positionx;
                data[field].positiony = (data[field].positiony * 1) + 19;
                ctx.fillText(data[field].vouchertext, data[field].positionx, data[field].positiony);
            }
        };
        myImg.src = voucherimage;
    }

    generateCanvas(e, vouchertext, voucherimage, i) {
        var imageCanvas = new Image();
        imageCanvas.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            for (const field in vouchertext) {
                const canvas = document.getElementById("canvas_" + field + i);
                canvas.setAttribute("width", width);
                canvas.setAttribute("height", height);
                var ctx = canvas.getContext("2d");
                ctx.drawImage(imageCanvas, 0, 0);
                var temp1 = vouchertext[field];
                for (const keyTemp1 in temp1) {
                    var posx = temp1[keyTemp1].positionx;
                    var posy = (temp1[keyTemp1].positiony * 1) + 19;
                    var text = temp1[keyTemp1].vouchertext;
                    var color = temp1[keyTemp1].color;
                    var font = temp1[keyTemp1].font;
                    var size = temp1[keyTemp1].size;

                    ctx.font = size + 'px ' + font;
                    ctx.fillStyle = color;
                    ctx.fillText(text, posx, posy);
                }
            }
        }
        imageCanvas.src = voucherimage;
    }

    render() {
        const { loading } = this.state;
        const { certificateid, awardcode, awardtype, totalprice, issueddate, freeaward, bookingcode, status } = this.state;
        const { salutation, name, familyname, memberid, travelertype, selfusage, cardnumber } = this.state;
        const { voucherimage, redeemvoucherdetail } = this.state;

        var vouchercanvas = [];
        var imagevoucher = [];
        let key = 1;
        for (const field in redeemvoucherdetail) {
            vouchercanvas[key] = [];
            imagevoucher[key] = [];
            for (let i = 0; i < 3; i++) {
                vouchercanvas[key][i] = <canvas key={"canvas_" + field + i} id={"canvas_" + field + i}></canvas>;
                imagevoucher[key][i] = <img key={key + i} src={voucherimage} id="imageCanvas" onLoad={(e) => this.generateCanvas(e, redeemvoucherdetail, voucherimage, i)} alt="Template not found" className="hidden" />;
            }
            key++;
        }
        return (
            <div className="container-fluid">
                <Breadcrumb path="Data Management / Redemption" />
                <div className="content-title flex-hr mb-1 title-description">
                    <h1 className="title-has-control mt-2">
                        <Link to={"/redemption/" + cardnumber} className="btn btn-outline-dark circle btn-sm"><i className="mdi mdi-arrow-left"></i></Link>
                        &nbsp;View Certificate
                    </h1>
                </div>
                <hr className="mt-0" />
                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                    <Loader value={loading} />
                    <div className="main-panel mt-3">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h3 className="title-has-control mt-2">Certificate Details</h3>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="salutationcode-view">Certificate ID </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="salutationcode-view">{certificateid} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="awardcode-view">Award Code </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="awardcode-view">{awardcode} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="awardtype-view">Award Type </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="awardtype-view">{awardtype} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="totalprice-view">Total Price </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="totalprice-view">{formatNumber(totalprice)} </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="issueddate-view">Issued Date </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="issueddate-view">{issueddate} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="freeaward-view">Free Award </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="freeaward-view">{freeaward} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="bookingcode-view">Booking Code </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="bookingcode-view">{bookingcode} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="status-view">Status </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="status-view">{status} </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-panel mt-3">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h3 className="title-has-control mt-2">Recipient Details</h3>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="salutation-view">Salutation </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="salutation-view">{salutation} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="name-view">Name </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="name-view">{name} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="familyname-view">Family Name </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="familyname-view">{familyname} </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="memberid-view">Card Number </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="memberid-view">{memberid} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="travelertype-view">Traveler Type </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="travelertype-view">{travelertype} </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="selfusage-view">Self Usage </label>
                                    <div className="col-sm-3 col-form-label" htmlFor="selfusage-view">{selfusage} </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-panel mt-3">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h3 className="title-has-control mt-2">Voucher Preview</h3>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                {vouchercanvas}
                                {imagevoucher}
                                {/* <img src={voucherimage} id="imageCanvas" onLoad={(e) => this.generateCanvas(e, redeemvoucherdetail, voucherimage)} alt="Template not found" className="hidden" /> */}
                            </div>
                        </div>
                    </div>
                </form>
                <div className="row mt-4">
                    <div className="col-sm-12 text-center">
                        <Link to={"/redemption/" + cardnumber} className="btn btn-primary"> Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Layout;