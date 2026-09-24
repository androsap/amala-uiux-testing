import React, { Component } from 'react';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voucher: [],
            voucherimage: '',
            redeemvoucherdetail: [],
            canvassourcevoucher: [],
            numbercertificate: ''
        };
    }

    componentWillReceiveProps(props) {
        const voucher = props.data;
        let numbercertificate = props.numbercertificate;
        let voucherimage = voucher['urltemplate'];
        this.setState({ voucher, voucherimage, numbercertificate });
    }

    generateCanvas(e, vouchertext, voucherimage, targetcanvas) {
        var imageCanvas = new Image();
        imageCanvas.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            const canvas = document.getElementById("canvas_" + vouchertext['certificateid'] + targetcanvas);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageCanvas, 0, 0);
            var temp1 = vouchertext['voucher'];
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
        };
        imageCanvas.src = voucherimage;
    }

    render() {
        const { voucher, voucherimage, numbercertificate } = this.state;

        let vouchercanvas = [];
        let voucherlist = [];
        for (let key = 0; key < 3; key++) {
            vouchercanvas[key] = <canvas key={"canvas_" + key} id={"canvas_" + voucher['certificateid'] + key}></canvas>;
            voucherlist[key] = <img key={key} src={voucherimage} id="imageCanvas" onLoad={(e) => this.generateCanvas(e, voucher, voucherimage, key)} alt="Template not found" className="hidden" />;
        }

        return (
            <div className="card mt-3" key={numbercertificate}>
                <div className="card-body">
                    <h4 className="mt-2">Voucher Preview</h4>
                    <hr className="mt-1" />
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            {vouchercanvas}
                            {voucherlist}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;